-- Fix for "relation public.users does not exist" error
-- This migration addresses the table name confusion and provides the correct way to set super_admin role

-- Step 1: Ensure super_admin enum value exists (defensive check)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin' AND enumtypid = 'public.user_role'::regtype) THEN
        ALTER TYPE public.user_role ADD VALUE 'super_admin';
    END IF;
END $$;

-- Step 2: Create a helper function to get user ID by email
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get user ID from user_profiles table (NOT from public.users - that table doesn't exist)
    SELECT id INTO user_uuid 
    FROM public.user_profiles 
    WHERE email = user_email AND is_active = true
    LIMIT 1;
    
    RETURN user_uuid;
END;
$$;

-- Step 3: Create a safe function to promote user to super_admin by email
CREATE OR REPLACE FUNCTION promote_user_to_super_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    affected_rows INTEGER;
    user_uuid UUID;
BEGIN
    -- Get the user ID
    SELECT get_user_id_by_email(user_email) INTO user_uuid;
    
    IF user_uuid IS NULL THEN
        RETURN 'ERROR: User not found with email: ' || user_email;
    END IF;
    
    -- Update the user role to super_admin
    UPDATE public.user_profiles 
    SET role = 'super_admin'::public.user_role,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_uuid;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    IF affected_rows > 0 THEN
        RETURN 'SUCCESS: User ' || user_email || ' promoted to super_admin';
    ELSE
        RETURN 'ERROR: Failed to update user ' || user_email;
    END IF;
END;
$$;

-- Step 4: Create a function to verify super admin users
CREATE OR REPLACE FUNCTION list_super_admin_users()
RETURNS TABLE(
    user_id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.email,
        up.full_name,
        up.role::TEXT,
        up.is_active,
        up.created_at
    FROM public.user_profiles up 
    WHERE up.role = 'super_admin'::public.user_role
    ORDER BY up.created_at DESC;
END;
$$;

-- Step 5: Add helpful comments
COMMENT ON FUNCTION promote_user_to_super_admin(TEXT) IS 
'Promotes a user to super_admin role by email. Usage: SELECT promote_user_to_super_admin(''user@example.com'');';

COMMENT ON FUNCTION list_super_admin_users() IS 
'Lists all users with super_admin role. Usage: SELECT * FROM list_super_admin_users();';

COMMENT ON FUNCTION get_user_id_by_email(TEXT) IS 
'Helper function to get user UUID by email from user_profiles table.';

-- Step 6: Grant necessary permissions
GRANT EXECUTE ON FUNCTION promote_user_to_super_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION list_super_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_id_by_email(TEXT) TO authenticated;