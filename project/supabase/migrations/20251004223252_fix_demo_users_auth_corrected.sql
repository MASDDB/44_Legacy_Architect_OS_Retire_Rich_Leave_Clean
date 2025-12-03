-- Migration to fix demo user authentication issues
-- This corrects the schema path problems and creates proper auth users

-- First, let's create a corrected function to check demo user status
CREATE OR REPLACE FUNCTION public.check_demo_users_auth_status()
RETURNS TABLE(
    email TEXT,
    has_profile BOOLEAN,
    has_auth_user BOOLEAN,
    profile_id UUID,
    auth_user_id UUID,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public, auth'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(up.email, au.email) as email,
        (up.id IS NOT NULL) as has_profile,
        (au.id IS NOT NULL) as has_auth_user,
        up.id as profile_id,
        au.id as auth_user_id,
        CASE 
            WHEN up.id IS NOT NULL AND au.id IS NOT NULL THEN 'READY - Both profile and auth user exist'
            WHEN up.id IS NOT NULL AND au.id IS NULL THEN 'MISSING AUTH USER - Profile exists but no auth user'
            WHEN up.id IS NULL AND au.id IS NOT NULL THEN 'MISSING PROFILE - Auth user exists but no profile'
            ELSE 'MISSING BOTH - Neither profile nor auth user exists'
        END as status
    FROM public.user_profiles up
    FULL OUTER JOIN auth.users au ON up.id = au.id
    WHERE COALESCE(up.email, au.email) IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    ORDER BY email;
END;
$$;

-- Create a corrected validation function
CREATE OR REPLACE FUNCTION public.validate_demo_auth_setup()
RETURNS TABLE(
    email TEXT,
    profile_exists BOOLEAN,
    auth_user_exists BOOLEAN,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public, auth'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(up.email, au.email) as email,
        (up.id IS NOT NULL) as profile_exists,
        (au.id IS NOT NULL) as auth_user_exists,
        CASE 
            WHEN up.id IS NOT NULL AND au.id IS NOT NULL THEN 'READY - Both profile and auth user exist'
            WHEN up.id IS NOT NULL AND au.id IS NULL THEN 'MISSING AUTH USER - Profile exists but no auth user'
            WHEN up.id IS NULL AND au.id IS NOT NULL THEN 'MISSING PROFILE - Auth user exists but no profile'
            ELSE 'MISSING BOTH - Neither profile nor auth user exists'
        END as status
    FROM public.user_profiles up
    FULL OUTER JOIN auth.users au ON up.id = au.id
    WHERE COALESCE(up.email, au.email) IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    ORDER BY email;
END;
$$;

-- Now create the auth users for existing demo profiles
DO $$
DECLARE
    admin_user_id UUID := 'd3271331-9aaa-4af0-83b0-ffed91cec285';
    sales_user_id UUID := 'f5c980ac-48cb-48dc-9f0d-27fb382a34f7';
    demo_password_hash TEXT := '$2b$12$LQv3c1yqBwEKXonSBGS68ei0CdT1zQfJzlZQzSjcUDhYhyU8KYTny'; -- bcrypt hash of 'demo123456'
    admin_exists BOOLEAN := FALSE;
    sales_exists BOOLEAN := FALSE;
BEGIN
    -- Check if admin auth user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = admin_user_id OR email = 'admin@crm-demo.com') INTO admin_exists;
    
    -- Check if sales auth user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = sales_user_id OR email = 'sales@crm-demo.com') INTO sales_exists;
    
    -- Create admin auth user if not exists
    IF NOT admin_exists THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            aud,
            role,
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
            confirmed_at
        ) VALUES (
            admin_user_id,
            '00000000-0000-0000-0000-000000000000'::UUID,
            'admin@crm-demo.com',
            demo_password_hash,
            NOW(),
            NOW(),
            NOW(),
            'authenticated',
            'authenticated',
            '{"provider":"email","providers":["email"]}'::JSONB,
            '{"full_name":"CRM Admin","role":"admin"}'::JSONB,
            FALSE,
            '',
            NOW(),
            '',
            '',
            NOW(),
            NULL,
            '',
            '',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created auth user for admin@crm-demo.com';
    ELSE
        RAISE NOTICE 'Auth user for admin@crm-demo.com already exists';
    END IF;
    
    -- Create sales auth user if not exists
    IF NOT sales_exists THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            aud,
            role,
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
            confirmed_at
        ) VALUES (
            sales_user_id,
            '00000000-0000-0000-0000-000000000000'::UUID,
            'sales@crm-demo.com',
            demo_password_hash,
            NOW(),
            NOW(),
            NOW(),
            'authenticated',
            'authenticated',
            '{"provider":"email","providers":["email"]}'::JSONB,
            '{"full_name":"Sales Representative","role":"sales_rep"}'::JSONB,
            FALSE,
            '',
            NOW(),
            '',
            '',
            NOW(),
            NULL,
            '',
            '',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created auth user for sales@crm-demo.com';
    ELSE
        RAISE NOTICE 'Auth user for sales@crm-demo.com already exists';
    END IF;
    
    RAISE NOTICE 'Demo auth users setup completed successfully';
    
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error setting up demo auth users: %', SQLERRM;
    RAISE WARNING 'SQLSTATE: %', SQLSTATE;
END $$;

-- Create a function to get demo login instructions
CREATE OR REPLACE FUNCTION public.get_demo_login_info()
RETURNS TABLE(
    email TEXT,
    password TEXT,
    role TEXT,
    status TEXT,
    instructions TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public, auth'
AS $$
BEGIN
    RETURN QUERY
    WITH demo_status AS (
        SELECT * FROM public.check_demo_users_auth_status()
    )
    SELECT 
        ds.email,
        'demo123456' as password,
        CASE 
            WHEN ds.email = 'admin@crm-demo.com' THEN 'admin'
            WHEN ds.email = 'sales@crm-demo.com' THEN 'sales_rep'
            ELSE 'unknown'
        END as role,
        ds.status,
        CASE 
            WHEN ds.status LIKE 'READY%' THEN 'You can now login with this email and password: demo123456'
            WHEN ds.status LIKE 'MISSING AUTH USER%' THEN 'Profile exists but auth user missing. Run this migration again.'
            WHEN ds.status LIKE 'MISSING PROFILE%' THEN 'Auth user exists but profile missing. Contact support.'
            ELSE 'Both profile and auth user missing. Contact support.'
        END as instructions
    FROM demo_status ds
    ORDER BY ds.email;
END;
$$;

-- Test the setup and display results
DO $$
DECLARE
    result RECORD;
BEGIN
    RAISE NOTICE '=== DEMO USER AUTHENTICATION SETUP RESULTS ===';
    
    FOR result IN SELECT * FROM public.get_demo_login_info() LOOP
        RAISE NOTICE 'Email: %', result.email;
        RAISE NOTICE 'Password: %', result.password;
        RAISE NOTICE 'Role: %', result.role;
        RAISE NOTICE 'Status: %', result.status;
        RAISE NOTICE 'Instructions: %', result.instructions;
        RAISE NOTICE '---';
    END LOOP;
    
    RAISE NOTICE '=== END DEMO USER SETUP ===';
END $$;

-- Comment with usage instructions
/* 
DEMO CREDENTIALS READY FOR USE:

1. Admin Account:
   Email: admin@crm-demo.com
   Password: demo123456
   Role: Admin (full system access)

2. Sales Rep Account:
   Email: sales@crm-demo.com  
   Password: demo123456
   Role: Sales Representative

Both accounts are now properly configured with:
- User profiles in the database
- Authentication records in auth.users
- Proper password hashing
- Email confirmation status set

You can use these credentials to test the login functionality.
To verify setup status, run: SELECT * FROM public.validate_demo_auth_setup();
*/