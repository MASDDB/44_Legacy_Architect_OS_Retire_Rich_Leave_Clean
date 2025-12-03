-- Schema Analysis: Existing CRM system with super_admin role and user_profiles table
-- Integration Type: addition/extension  
-- Dependencies: user_profiles table, user_role enum (super_admin exists)

-- Create function to log out all users (super admin only)
CREATE OR REPLACE FUNCTION public.logout_all_users()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role public.user_role;
    affected_sessions INTEGER := 0;
    result jsonb;
BEGIN
    -- Check if current user is super_admin
    SELECT role INTO current_user_role
    FROM public.user_profiles 
    WHERE id = auth.uid();
    
    IF current_user_role IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'User profile not found'
        );
    END IF;
    
    IF current_user_role != 'super_admin'::public.user_role THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Access denied: Super admin privileges required'
        );
    END IF;
    
    -- Get count of active sessions before logout
    SELECT COUNT(*) INTO affected_sessions
    FROM auth.sessions 
    WHERE NOT (user_id = auth.uid()); -- Don't count current user's session
    
    -- Log out all users except current super admin
    -- This effectively deletes all sessions except the current user's
    DELETE FROM auth.sessions 
    WHERE NOT (user_id = auth.uid());
    
    -- Build success response
    result := jsonb_build_object(
        'success', true,
        'message', 'All users have been logged out successfully',
        'affected_sessions', affected_sessions,
        'timestamp', CURRENT_TIMESTAMP
    );
    
    -- Log the admin action
    INSERT INTO public.lead_activities (
        lead_id, 
        performed_by, 
        activity_type, 
        description, 
        created_at
    )
    SELECT 
        NULL, -- No specific lead for this system action
        auth.uid(),
        'system_admin',
        'Super admin logged out all users - Sessions affected: ' || affected_sessions,
        CURRENT_TIMESTAMP;
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'System error occurred: ' || SQLERRM
        );
END;
$$;

-- Create function to get active sessions count (super admin only)
CREATE OR REPLACE FUNCTION public.get_active_sessions_count()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role public.user_role;
    active_sessions INTEGER := 0;
    total_users INTEGER := 0;
BEGIN
    -- Check if current user is super_admin
    SELECT role INTO current_user_role
    FROM public.user_profiles 
    WHERE id = auth.uid();
    
    IF current_user_role IS NULL OR current_user_role != 'super_admin'::public.user_role THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Access denied: Super admin privileges required'
        );
    END IF;
    
    -- Get active sessions count
    SELECT COUNT(DISTINCT user_id) INTO active_sessions
    FROM auth.sessions 
    WHERE expires_at > CURRENT_TIMESTAMP;
    
    -- Get total users count
    SELECT COUNT(*) INTO total_users
    FROM public.user_profiles
    WHERE is_active = true;
    
    RETURN jsonb_build_object(
        'success', true,
        'active_sessions', active_sessions,
        'total_users', total_users,
        'timestamp', CURRENT_TIMESTAMP
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'System error occurred: ' || SQLERRM
        );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.logout_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_sessions_count() TO authenticated;