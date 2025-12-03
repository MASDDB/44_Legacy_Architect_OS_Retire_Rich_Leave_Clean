-- Additional Security Hardening Migration
-- This migration addresses the remaining security issues that require Supabase configuration changes

-- Note: The following issues require Supabase Dashboard configuration and cannot be fixed via SQL migration:

-- 1. Leaked Password Protection (auth_leaked_password_protection)
-- Action Required: Enable in Supabase Dashboard > Authentication > Settings
-- Navigate to: https://supabase.com/dashboard/project/[your-project]/auth/settings
-- Enable: "Enable password protection against leaked passwords"

-- 2. Insufficient MFA Options (auth_insufficient_mfa_options) 
-- Action Required: Configure in Supabase Dashboard > Authentication > Settings
-- Navigate to: https://supabase.com/dashboard/project/[your-project]/auth/settings
-- Enable additional MFA methods like TOTP, Phone, etc.

-- 3. PostgreSQL Version Update (vulnerable_postgres_version)
-- Action Required: Update PostgreSQL version via Supabase Dashboard
-- Navigate to: https://supabase.com/dashboard/project/[your-project]/settings/database
-- Click on "Upgrade" to apply the latest PostgreSQL security patches

-- Create a reminder table for security configuration tasks
CREATE TABLE IF NOT EXISTS public.security_configuration_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_name TEXT NOT NULL,
    issue_level TEXT NOT NULL DEFAULT 'WARN',
    description TEXT NOT NULL,
    remediation_action TEXT NOT NULL,
    dashboard_url TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert security configuration reminders
INSERT INTO public.security_configuration_reminders (issue_name, issue_level, description, remediation_action, dashboard_url) VALUES 
(
    'auth_leaked_password_protection',
    'WARN',
    'Leaked password protection is currently disabled. Supabase Auth prevents the use of compromised passwords by checking against HaveIBeenPwned.org.',
    'Enable leaked password protection in Supabase Dashboard > Authentication > Settings',
    'https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection'
),
(
    'auth_insufficient_mfa_options',
    'WARN', 
    'This project has too few multi-factor authentication (MFA) options enabled.',
    'Enable additional MFA methods (TOTP, Phone, etc.) in Supabase Dashboard > Authentication > Settings',
    'https://supabase.com/docs/guides/auth/auth-mfa'
),
(
    'vulnerable_postgres_version',
    'WARN',
    'Current Postgres version has security patches available. Upgrade your postgres database to apply important security patches.',
    'Upgrade PostgreSQL version via Supabase Dashboard > Settings > Database',
    'https://supabase.com/docs/guides/platform/upgrading'
);

-- Add RLS policies for security reminders table
ALTER TABLE public.security_configuration_reminders ENABLE ROW LEVEL SECURITY;

-- Policy to allow super_admin users to view and manage security reminders
CREATE POLICY "super_admin_manage_security_reminders" ON public.security_configuration_reminders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = (SELECT auth.uid())
            AND up.role = 'super_admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = (SELECT auth.uid())
            AND up.role = 'super_admin'
        )
    );

-- Create a function to mark security configurations as completed
CREATE OR REPLACE FUNCTION public.mark_security_config_completed(issue_name_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Check if user is super_admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid()
        AND up.role = 'super_admin'
    ) THEN
        RETURN false;
    END IF;

    UPDATE public.security_configuration_reminders 
    SET 
        completed = true,
        updated_at = CURRENT_TIMESTAMP
    WHERE issue_name = issue_name_param;

    RETURN FOUND;
END;
$$;

-- Create a function to get pending security configurations
CREATE OR REPLACE FUNCTION public.get_pending_security_configurations()
RETURNS TABLE(
    issue_name text,
    issue_level text,
    description text,
    remediation_action text,
    dashboard_url text,
    created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT 
        scr.issue_name,
        scr.issue_level,
        scr.description,
        scr.remediation_action,
        scr.dashboard_url,
        scr.created_at
    FROM public.security_configuration_reminders scr
    WHERE scr.completed = false
    ORDER BY scr.created_at DESC;
$$;

-- Add comments
COMMENT ON TABLE public.security_configuration_reminders IS 'Tracks security configuration tasks that require manual dashboard configuration';
COMMENT ON FUNCTION public.mark_security_config_completed(text) IS 'Mark a security configuration task as completed (super_admin only)';
COMMENT ON FUNCTION public.get_pending_security_configurations() IS 'Get list of pending security configuration tasks';

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_security_config_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_security_configuration_reminders_updated_at
    BEFORE UPDATE ON public.security_configuration_reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_security_config_updated_at();