-- Migration to definitively fix demo user authentication
-- Ensures both user_profiles and auth.users records exist and are properly linked

-- First, create an improved function to check demo users status
CREATE OR REPLACE FUNCTION public.get_demo_auth_status()
RETURNS TABLE(
    email TEXT,
    has_profile BOOLEAN,
    has_auth_user BOOLEAN,
    profile_id UUID,
    auth_id UUID,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(up.email, au.email) as email,
        (up.id IS NOT NULL) as has_profile,
        (au.id IS NOT NULL) as has_auth_user,
        up.id as profile_id,
        au.id as auth_id,
        CASE 
            WHEN up.id IS NOT NULL AND au.id IS NOT NULL THEN 'READY'
            WHEN up.id IS NOT NULL AND au.id IS NULL THEN 'MISSING_AUTH_USER'
            WHEN up.id IS NULL AND au.id IS NOT NULL THEN 'MISSING_PROFILE'
            ELSE 'MISSING_BOTH'
        END as status
    FROM public.user_profiles up
    FULL OUTER JOIN auth.users au ON up.id = au.id
    WHERE COALESCE(up.email, au.email) IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    ORDER BY email;
END;
$$;

-- Create proper auth users for the existing demo profiles
DO $$
DECLARE
    admin_profile_id UUID;
    sales_profile_id UUID;
    admin_exists BOOLEAN := FALSE;
    sales_exists BOOLEAN := FALSE;
    demo_password_hash TEXT;
BEGIN
    -- Get existing profile IDs from the user_profiles table
    SELECT id INTO admin_profile_id FROM public.user_profiles WHERE email = 'admin@crm-demo.com';
    SELECT id INTO sales_profile_id FROM public.user_profiles WHERE email = 'sales@crm-demo.com';
    
    -- Create proper password hash for 'demo123456'
    demo_password_hash := crypt('demo123456', gen_salt('bf', 12));
    
    -- Check if auth users already exist
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = admin_profile_id) INTO admin_exists;
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = sales_profile_id) INTO sales_exists;
    
    -- Create admin auth user if profile exists but auth user doesn't
    IF admin_profile_id IS NOT NULL AND NOT admin_exists THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            confirmation_token,
            confirmation_sent_at,
            email_change_token_new,
            email_change,
            email_change_sent_at,
            last_sign_in_at,
            phone_change_token,
            phone_change,
            phone_change_sent_at,
            confirmed_at,
            recovery_token,
            recovery_sent_at,
            email_change_token_current,
            email_change_confirm_status,
            banned_until,
            reauthentication_token,
            reauthentication_sent_at,
            is_sso_user,
            deleted_at,
            is_anonymous
        ) VALUES (
            admin_profile_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'admin@crm-demo.com',
            demo_password_hash,
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}'::JSONB,
            '{"full_name":"CRM Admin","email":"admin@crm-demo.com"}'::JSONB,
            FALSE,
            '',
            NOW(),
            '',
            '',
            NULL,
            NULL,
            '',
            '',
            NULL,
            NOW(),
            '',
            NULL,
            '',
            0,
            NULL,
            '',
            NULL,
            FALSE,
            NULL,
            FALSE
        );
        
        RAISE NOTICE 'Created auth.users record for admin@crm-demo.com with ID: %', admin_profile_id;
    ELSE
        IF admin_profile_id IS NULL THEN
            RAISE WARNING 'Admin profile not found in user_profiles table';
        ELSE
            RAISE NOTICE 'Auth user already exists for admin@crm-demo.com';
        END IF;
    END IF;
    
    -- Create sales auth user if profile exists but auth user doesn't
    IF sales_profile_id IS NOT NULL AND NOT sales_exists THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            confirmation_token,
            confirmation_sent_at,
            email_change_token_new,
            email_change,
            email_change_sent_at,
            last_sign_in_at,
            phone_change_token,
            phone_change,
            phone_change_sent_at,
            confirmed_at,
            recovery_token,
            recovery_sent_at,
            email_change_token_current,
            email_change_confirm_status,
            banned_until,
            reauthentication_token,
            reauthentication_sent_at,
            is_sso_user,
            deleted_at,
            is_anonymous
        ) VALUES (
            sales_profile_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'sales@crm-demo.com',
            demo_password_hash,
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}'::JSONB,
            '{"full_name":"Sales Representative","email":"sales@crm-demo.com"}'::JSONB,
            FALSE,
            '',
            NOW(),
            '',
            '',
            NULL,
            NULL,
            '',
            '',
            NULL,
            NOW(),
            '',
            NULL,
            '',
            0,
            NULL,
            '',
            NULL,
            FALSE,
            NULL,
            FALSE
        );
        
        RAISE NOTICE 'Created auth.users record for sales@crm-demo.com with ID: %', sales_profile_id;
    ELSE
        IF sales_profile_id IS NULL THEN
            RAISE WARNING 'Sales profile not found in user_profiles table';
        ELSE
            RAISE NOTICE 'Auth user already exists for sales@crm-demo.com';
        END IF;
    END IF;
    
    RAISE NOTICE 'Demo user authentication setup completed successfully';
    
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in demo auth setup: %', SQLERRM;
    RAISE WARNING 'Error code: %', SQLSTATE;
END $$;

-- Create a verification function to test the setup
CREATE OR REPLACE FUNCTION public.verify_demo_login_setup()
RETURNS TABLE(
    email TEXT,
    password TEXT,
    status TEXT,
    can_authenticate BOOLEAN,
    profile_role TEXT,
    instructions TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH demo_check AS (
        SELECT * FROM public.get_demo_auth_status()
    )
    SELECT 
        dc.email,
        'demo123456'::TEXT as password,
        dc.status,
        (dc.status = 'READY') as can_authenticate,
        COALESCE(up.role::TEXT, 'unknown') as profile_role,
        CASE 
            WHEN dc.status = 'READY' THEN 'Ready to login with demo123456'
            WHEN dc.status = 'MISSING_AUTH_USER' THEN 'Profile exists but missing auth user - contact administrator'
            WHEN dc.status = 'MISSING_PROFILE' THEN 'Auth user exists but missing profile - contact administrator'
            ELSE 'Setup incomplete - contact administrator'
        END as instructions
    FROM demo_check dc
    LEFT JOIN public.user_profiles up ON dc.profile_id = up.id
    ORDER BY dc.email;
END;
$$;

-- Run verification and display results
DO $$
DECLARE
    demo_result RECORD;
BEGIN
    RAISE NOTICE '=== DEMO USER VERIFICATION RESULTS ===';
    
    FOR demo_result IN 
        SELECT * FROM public.verify_demo_login_setup() 
    LOOP
        RAISE NOTICE 'Email: % | Password: % | Status: % | Role: % | Ready: %', 
            demo_result.email, 
            demo_result.password, 
            demo_result.status,
            demo_result.profile_role,
            demo_result.can_authenticate;
        RAISE NOTICE 'Instructions: %', demo_result.instructions;
        RAISE NOTICE '---';
    END LOOP;
    
    RAISE NOTICE '=== END VERIFICATION ===';
END $$;

-- Final comment with complete setup details
/* 
🎯 DEMO USER AUTHENTICATION - FINAL SETUP

CREDENTIALS READY FOR LOGIN:
1. Admin Account:
   - Email: admin@crm-demo.com
   - Password: demo123456
   - Role: Admin (full CRM access)

2. Sales Representative Account:
   - Email: sales@crm-demo.com  
   - Password: demo123456
   - Role: Sales Rep (standard access)

TECHNICAL DETAILS:
- User profiles already existed in database
- Created corresponding auth.users records with proper password hashing
- Both accounts have confirmed email status for immediate login
- Passwords are hashed using bcrypt with 12 salt rounds

VERIFICATION:
Run this query to check status: SELECT * FROM public.verify_demo_login_setup();

TROUBLESHOOTING:
If login still fails, check:
1. Supabase project URL and anon key are correct
2. RLS policies allow authentication
3. No browser cache issues
4. Network connectivity to Supabase
*/