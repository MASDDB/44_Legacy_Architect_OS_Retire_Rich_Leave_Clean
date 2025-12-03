-- =============================================
-- Email Confirmation Helper Functions (Public Schema)
-- =============================================

-- Helper function to check email confirmation status for debugging
-- Note: This queries auth.users in read-only mode from public schema
CREATE OR REPLACE FUNCTION public.check_email_confirmation_status(user_email TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  is_confirmed BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow checking confirmation status for the current authenticated user
  -- This prevents unauthorized access to other users' data
  IF auth.email() != user_email AND NOT (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'super_admin'::public.user_role
    )
  ) THEN
    RAISE EXCEPTION 'Permission denied: Can only check your own email status';
  END IF;

  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email,
    au.email_confirmed_at,
    (au.email_confirmed_at IS NOT NULL) as is_confirmed
  FROM auth.users au
  WHERE au.email = user_email;
END;
$$;

-- Function to get current user's email confirmation status
CREATE OR REPLACE FUNCTION public.get_current_user_email_status()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  is_confirmed BOOLEAN,
  needs_confirmation BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email,
    au.email_confirmed_at,
    (au.email_confirmed_at IS NOT NULL) as is_confirmed,
    (au.email_confirmed_at IS NULL) as needs_confirmation
  FROM auth.users au
  WHERE au.id = auth.uid();
END;
$$;

-- Grant necessary permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.check_email_confirmation_status(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_email_status() TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION public.check_email_confirmation_status(TEXT) IS 'Check email confirmation status (restricted to own email or super_admin)';
COMMENT ON FUNCTION public.get_current_user_email_status() IS 'Get current authenticated user email confirmation status';

-- Create a notification system for unconfirmed emails (optional)
CREATE TABLE IF NOT EXISTS public.email_confirmation_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    reminder_count INTEGER DEFAULT 0,
    last_reminder_sent TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_email_confirmation_reminders_user_id 
ON public.email_confirmation_reminders(user_id);

-- Enable RLS for the reminders table
ALTER TABLE public.email_confirmation_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policy for email confirmation reminders
CREATE POLICY "users_manage_own_email_reminders"
ON public.email_confirmation_reminders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Function to create reminder record for unconfirmed users
CREATE OR REPLACE FUNCTION public.create_email_confirmation_reminder()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    is_confirmed BOOLEAN;
BEGIN
    -- Get current user info
    SELECT auth.uid() INTO current_user_id;
    
    -- Check if email is already confirmed
    SELECT (au.email_confirmed_at IS NOT NULL)
    INTO is_confirmed
    FROM auth.users au
    WHERE au.id = current_user_id;
    
    -- If already confirmed, no need for reminder
    IF is_confirmed THEN
        RETURN FALSE;
    END IF;
    
    -- Create or update reminder record
    INSERT INTO public.email_confirmation_reminders (user_id, reminder_count, last_reminder_sent)
    VALUES (current_user_id, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        reminder_count = email_confirmation_reminders.reminder_count + 1,
        last_reminder_sent = NOW(),
        updated_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Failed to create email confirmation reminder: %', SQLERRM;
        RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_email_confirmation_reminder() TO authenticated;

COMMENT ON FUNCTION public.create_email_confirmation_reminder() IS 'Create or update email confirmation reminder for current user';