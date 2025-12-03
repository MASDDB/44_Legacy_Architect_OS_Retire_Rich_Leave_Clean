-- Fix the get_active_sessions_count function
-- The function was trying to use 'expires_at' column which doesn't exist in auth.sessions
-- Replace with correct Supabase auth.sessions schema

CREATE OR REPLACE FUNCTION public.get_active_sessions_count()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
    
    -- Get active sessions count using correct Supabase auth.sessions schema
    -- Use 'not_after' instead of 'expires_at' for session expiration check
    SELECT COUNT(DISTINCT user_id) INTO active_sessions
    FROM auth.sessions 
    WHERE not_after > CURRENT_TIMESTAMP;
    
    -- Get total users count
    SELECT COUNT(*) INTO total_users
    FROM public.user_profiles
    WHERE id IS NOT NULL;
    
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
$function$