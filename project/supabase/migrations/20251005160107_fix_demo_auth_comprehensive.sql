-- Comprehensive Demo User Authentication Fix
-- This migration ensures demo users have proper auth.users records and can authenticate

-- Step 1: Check if demo users exist in auth.users and create them if missing
DO $$
DECLARE
    admin_user_id UUID;
    sales_user_id UUID;
    admin_profile_exists BOOLEAN := FALSE;
    sales_profile_exists BOOLEAN := FALSE;
    admin_auth_exists BOOLEAN := FALSE;
    sales_auth_exists BOOLEAN := FALSE;
BEGIN
    -- Check if profiles exist
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE email = 'admin@crm-demo.com') INTO admin_profile_exists;
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE email = 'sales@crm-demo.com') INTO sales_profile_exists;
    
    -- Check if auth users exist
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@crm-demo.com') INTO admin_auth_exists;
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sales@crm-demo.com') INTO sales_auth_exists;
    
    RAISE NOTICE 'Demo user status check:';
    RAISE NOTICE 'Admin profile exists: %, auth exists: %', admin_profile_exists, admin_auth_exists;
    RAISE NOTICE 'Sales profile exists: %, auth exists: %', sales_profile_exists, sales_auth_exists;
    
    -- Get or create admin user
    IF admin_profile_exists THEN
        SELECT id INTO admin_user_id FROM public.user_profiles WHERE email = 'admin@crm-demo.com';
        RAISE NOTICE 'Found existing admin profile with ID: %', admin_user_id;
    ELSE
        admin_user_id := gen_random_uuid();
        RAISE NOTICE 'Generated new admin user ID: %', admin_user_id;
    END IF;
    
    -- Get or create sales user  
    IF sales_profile_exists THEN
        SELECT id INTO sales_user_id FROM public.user_profiles WHERE email = 'sales@crm-demo.com';
        RAISE NOTICE 'Found existing sales profile with ID: %', sales_user_id;
    ELSE
        sales_user_id := gen_random_uuid();
        RAISE NOTICE 'Generated new sales user ID: %', sales_user_id;
    END IF;
    
    -- Create auth.users records if they don't exist
    IF NOT admin_auth_exists THEN
        RAISE NOTICE 'Creating auth.users record for admin demo user';
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            admin_user_id,
            '00000000-0000-0000-0000-000000000000',
            'admin@crm-demo.com',
            crypt('demo123456', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "CRM Admin Demo", "role": "admin"}',
            FALSE,
            'authenticated',
            'authenticated',
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE 'Created auth.users record for admin@crm-demo.com';
    ELSE
        -- Update existing auth user password to ensure it's correct
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('demo123456', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW()
        WHERE email = 'admin@crm-demo.com';
        RAISE NOTICE 'Updated existing auth.users record for admin@crm-demo.com';
    END IF;
    
    IF NOT sales_auth_exists THEN
        RAISE NOTICE 'Creating auth.users record for sales demo user';
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            sales_user_id,
            '00000000-0000-0000-0000-000000000000',
            'sales@crm-demo.com',
            crypt('demo123456', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Sales Rep Demo", "role": "sales_rep"}',
            FALSE,
            'authenticated',
            'authenticated',
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE 'Created auth.users record for sales@crm-demo.com';
    ELSE
        -- Update existing auth user password to ensure it's correct
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('demo123456', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW()
        WHERE email = 'sales@crm-demo.com';
        RAISE NOTICE 'Updated existing auth.users record for sales@crm-demo.com';
    END IF;
    
    -- Create or update profile records
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin@crm-demo.com',
        'CRM Admin Demo',
        'admin',
        TRUE,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = TRUE,
        updated_at = NOW();
    
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        sales_user_id,
        'sales@crm-demo.com',
        'Sales Rep Demo',
        'sales_rep',
        TRUE,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = TRUE,
        updated_at = NOW();
        
    RAISE NOTICE 'Demo user setup completed successfully';
    RAISE NOTICE 'Admin user ID: % - Profile: %, Auth: %', admin_user_id, admin_profile_exists, admin_auth_exists;
    RAISE NOTICE 'Sales user ID: % - Profile: %, Auth: %', sales_user_id, sales_profile_exists, sales_auth_exists;
    
END $$;

-- Step 2: Create enhanced demo status checking function
CREATE OR REPLACE FUNCTION public.get_demo_auth_status()
RETURNS TABLE(
    email TEXT,
    profile_id UUID,
    auth_user_id UUID,
    status TEXT,
    can_login BOOLEAN,
    last_sign_in_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH demo_emails AS (
        SELECT unnest(ARRAY['admin@crm-demo.com', 'sales@crm-demo.com']) AS demo_email
    ),
    profile_check AS (
        SELECT 
            de.demo_email,
            up.id as profile_id,
            up.is_active
        FROM demo_emails de
        LEFT JOIN public.user_profiles up ON up.email = de.demo_email
    ),
    auth_check AS (
        SELECT 
            pc.demo_email,
            pc.profile_id,
            pc.is_active,
            au.id as auth_user_id,
            au.email_confirmed_at IS NOT NULL as email_confirmed,
            au.last_sign_in_at
        FROM profile_check pc
        LEFT JOIN auth.users au ON au.email = pc.demo_email
    )
    SELECT 
        ac.demo_email::TEXT,
        ac.profile_id,
        ac.auth_user_id,
        CASE 
            WHEN ac.profile_id IS NOT NULL AND ac.auth_user_id IS NOT NULL AND ac.email_confirmed AND ac.is_active 
            THEN 'READY'
            WHEN ac.profile_id IS NOT NULL AND ac.auth_user_id IS NOT NULL AND NOT ac.email_confirmed 
            THEN 'NEEDS_CONFIRMATION'
            WHEN ac.profile_id IS NOT NULL AND ac.auth_user_id IS NULL 
            THEN 'MISSING_AUTH_USER'
            WHEN ac.profile_id IS NULL AND ac.auth_user_id IS NOT NULL 
            THEN 'MISSING_PROFILE'
            ELSE 'NOT_SETUP'
        END::TEXT,
        (ac.profile_id IS NOT NULL AND ac.auth_user_id IS NOT NULL AND ac.email_confirmed AND ac.is_active)::BOOLEAN,
        ac.last_sign_in_at
    FROM auth_check ac
    ORDER BY ac.demo_email;
END;
$$;

-- Step 3: Create demo login verification function
CREATE OR REPLACE FUNCTION public.verify_demo_credentials(
    demo_email TEXT DEFAULT 'admin@crm-demo.com'
)
RETURNS TABLE(
    email TEXT,
    password TEXT,
    status TEXT,
    instructions TEXT,
    ready_to_login BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    demo_status RECORD;
BEGIN
    -- Get current status
    SELECT * INTO demo_status 
    FROM public.get_demo_auth_status() 
    WHERE get_demo_auth_status.email = demo_email;
    
    RETURN QUERY
    SELECT 
        demo_email::TEXT,
        'demo123456'::TEXT,
        COALESCE(demo_status.status, 'NOT_FOUND')::TEXT,
        CASE 
            WHEN demo_status.status = 'READY' 
            THEN 'Ready to login! Use email: ' || demo_email || ' and password: demo123456'
            WHEN demo_status.status = 'NEEDS_CONFIRMATION' 
            THEN 'Demo account exists but needs email confirmation (should be auto-confirmed)'
            WHEN demo_status.status = 'MISSING_AUTH_USER' 
            THEN 'Profile exists but missing auth user - run migration again'
            WHEN demo_status.status = 'MISSING_PROFILE' 
            THEN 'Auth user exists but missing profile - run migration again'
            ELSE 'Demo account not properly set up - run migration to fix'
        END::TEXT,
        COALESCE(demo_status.can_login, FALSE)::BOOLEAN;
END;
$$;

-- Step 4: Test demo authentication setup
DO $$
DECLARE
    admin_status RECORD;
    sales_status RECORD;
BEGIN
    -- Check admin demo status
    SELECT * INTO admin_status FROM public.verify_demo_credentials('admin@crm-demo.com');
    RAISE NOTICE 'Admin Demo Status: % - %', admin_status.status, admin_status.instructions;
    
    -- Check sales demo status  
    SELECT * INTO sales_status FROM public.verify_demo_credentials('sales@crm-demo.com');
    RAISE NOTICE 'Sales Demo Status: % - %', sales_status.status, sales_status.instructions;
    
    -- Final verification
    IF admin_status.ready_to_login AND sales_status.ready_to_login THEN
        RAISE NOTICE '✅ SUCCESS: Both demo accounts are ready for authentication';
        RAISE NOTICE 'Login credentials:';
        RAISE NOTICE '  Admin: admin@crm-demo.com / demo123456';  
        RAISE NOTICE '  Sales: sales@crm-demo.com / demo123456';
    ELSE
        RAISE NOTICE '❌ WARNING: Some demo accounts are not ready';
        IF NOT admin_status.ready_to_login THEN
            RAISE NOTICE '  Admin issue: %', admin_status.instructions;
        END IF;
        IF NOT sales_status.ready_to_login THEN
            RAISE NOTICE '  Sales issue: %', sales_status.instructions;
        END IF;
    END IF;
END $$;

-- Step 5: Add comments for maintenance
COMMENT ON FUNCTION public.get_demo_auth_status() IS 
'Checks the authentication setup status for demo users (admin@crm-demo.com, sales@crm-demo.com)';

COMMENT ON FUNCTION public.verify_demo_credentials(TEXT) IS 
'Verifies demo user credentials and provides setup instructions';

-- Migration completed
SELECT 'Demo authentication fix migration completed - check the logs above for status' as result;