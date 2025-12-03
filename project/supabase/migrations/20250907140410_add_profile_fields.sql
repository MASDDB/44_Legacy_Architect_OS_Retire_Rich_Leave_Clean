-- Location: supabase/migrations/20250907140410_add_profile_fields.sql
-- Schema Analysis: user_profiles table exists with basic fields (email, full_name, phone, role)  
-- Integration Type: PARTIAL_EXISTS - Adding missing profile fields to existing table
-- Dependencies: Extends existing user_profiles table

-- Add missing profile columns to existing user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company);
CREATE INDEX IF NOT EXISTS idx_user_profiles_timezone ON public.user_profiles(timezone);

-- Update existing records to populate first_name and last_name from full_name where possible
UPDATE public.user_profiles 
SET 
    first_name = COALESCE(first_name, split_part(full_name, ' ', 1)),
    last_name = CASE 
        WHEN array_length(string_to_array(full_name, ' '), 1) > 1 
        THEN split_part(full_name, ' ', 2)
        ELSE ''
    END
WHERE first_name IS NULL OR last_name IS NULL;

-- Add a function to keep full_name in sync with first_name and last_name
CREATE OR REPLACE FUNCTION public.sync_full_name()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Auto-update full_name when first_name or last_name changes
    IF NEW.first_name IS NOT NULL OR NEW.last_name IS NOT NULL THEN
        NEW.full_name = TRIM(COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, ''));
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to auto-sync full_name
DROP TRIGGER IF EXISTS trigger_sync_full_name ON public.user_profiles;
CREATE TRIGGER trigger_sync_full_name
    BEFORE UPDATE OF first_name, last_name ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_full_name();