-- Migration to fix demo user authentication
-- This creates the corresponding auth.users for existing demo profiles

-- Create demo auth users with proper password hashing
-- Note: In production, this should be done via Supabase Auth API or admin dashboard

DO $$
DECLARE
    admin_user_id UUID;
    sales_user_id UUID;
    demo_password_hash TEXT;
BEGIN
    -- Get existing profile IDs
    SELECT id INTO admin_user_id FROM user_profiles WHERE email = 'admin@crm-demo.com';
    SELECT id INTO sales_user_id FROM user_profiles WHERE email = 'sales@crm-demo.com';
    
    -- Create password hash for 'demo123456'
    -- This is a bcrypt hash of 'demo123456' with salt rounds 12
    demo_password_hash := '$2b$12$LQv3c1yqBwEKXonSBGS68ei0CdT1zQfJzlZQzSjcUDhYhyU8KYTny';
    
    -- Insert admin user into auth.users if not exists
    IF admin_user_id IS NOT NULL THEN
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
            confirmation_sent_at
        )
        SELECT
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
            false,
            '',
            NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM auth.users WHERE email = 'admin@crm-demo.com'
        );
    END IF;
    
    -- Insert sales user into auth.users if not exists
    IF sales_user_id IS NOT NULL THEN
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
            confirmation_sent_at
        )
        SELECT
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
            false,
            '',
            NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM auth.users WHERE email = 'sales@crm-demo.com'
        );
    END IF;
    
    RAISE NOTICE 'Demo auth users setup completed';
    
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error setting up demo auth users: %', SQLERRM;
END $$;

-- Create function to validate demo users are working
CREATE OR REPLACE FUNCTION public.validate_demo_auth_setup()
RETURNS TABLE(
    email TEXT,
    profile_exists BOOLEAN,
    auth_user_exists BOOLEAN,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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
    FROM user_profiles up
    FULL OUTER JOIN auth.users au ON up.id = au.id
    WHERE COALESCE(up.email, au.email) IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    ORDER BY email;
END;
$$;

-- Test the setup
SELECT * FROM validate_demo_auth_setup();