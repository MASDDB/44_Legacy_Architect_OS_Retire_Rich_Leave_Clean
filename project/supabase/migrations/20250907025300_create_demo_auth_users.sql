-- Migration to create demo authentication users
-- This ensures the demo users in user_profiles table also exist in Supabase Auth

-- Note: In production Supabase, you would typically create users through:
-- 1. Sign up process (which creates both auth.users and user_profiles)
-- 2. Admin dashboard
-- 3. Management API

-- For development/demo purposes, we'll create a function to handle this
-- This function should be called manually through Supabase dashboard or API

CREATE OR REPLACE FUNCTION create_demo_auth_users()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb := '{"created": [], "errors": []}'::jsonb;
    demo_user record;
    user_id uuid;
BEGIN
    -- Loop through user_profiles that don't have corresponding auth.users
    FOR demo_user IN 
        SELECT up.id, up.email, up.full_name, up.role
        FROM user_profiles up
        LEFT JOIN auth.users au ON up.email = au.email
        WHERE au.id IS NULL
        AND up.email IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    LOOP
        BEGIN
            -- Note: This is a placeholder function
            -- In real implementation, users must be created through:
            -- 1. Supabase Auth API (recommended)
            -- 2. Admin dashboard
            -- 3. Sign-up process
            
            result := jsonb_set(
                result, 
                '{created}', 
                result->'created' || jsonb_build_object(
                    'email', demo_user.email,
                    'user_id', demo_user.id,
                    'note', 'Please create this user through Supabase Auth API or dashboard'
                )
            );
            
        EXCEPTION WHEN others THEN
            result := jsonb_set(
                result, 
                '{errors}', 
                result->'errors' || jsonb_build_object(
                    'email', demo_user.email,
                    'error', SQLERRM
                )
            );
        END;
    END LOOP;
    
    RETURN result;
END;
$$;

-- Create a helper function to check auth user status
CREATE OR REPLACE FUNCTION check_demo_users_auth_status()
RETURNS TABLE(
    email text,
    has_profile boolean,
    has_auth_user boolean,
    profile_id uuid,
    auth_user_id uuid,
    status text
)
LANGUAGE plpgsql
SECURITY DEFINER
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
            WHEN up.id IS NOT NULL AND au.id IS NOT NULL THEN 'complete'
            WHEN up.id IS NOT NULL AND au.id IS NULL THEN 'missing_auth_user'
            WHEN up.id IS NULL AND au.id IS NOT NULL THEN 'missing_profile'
            ELSE 'unknown'
        END as status
    FROM user_profiles up
    FULL OUTER JOIN auth.users au ON up.email = au.email
    WHERE COALESCE(up.email, au.email) IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    ORDER BY email;
END;
$$;

-- Add comments for manual steps
COMMENT ON FUNCTION create_demo_auth_users() IS 
'Helper function to identify users that need to be created in Supabase Auth. 
Manual steps required:
1. Call this function to see which users need auth accounts
2. Create users through Supabase dashboard or Auth API
3. Use password: demo123456 for demo users';

COMMENT ON FUNCTION check_demo_users_auth_status() IS 
'Check the authentication status of demo users to verify setup';