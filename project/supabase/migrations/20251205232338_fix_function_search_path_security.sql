/*
  # Fix Function Search Path Security Issue
  
  This migration fixes the security warning for the update_rrlc_updated_at_column function
  by setting an explicit search_path. This prevents potential security issues from search_path
  manipulation attacks.
  
  ## Changes
  - Recreate update_rrlc_updated_at_column function with SET search_path = ''
  
  ## Security Impact
  - Prevents search_path hijacking attacks
  - Ensures function always uses fully qualified names or empty search_path
*/

-- Drop and recreate the function with secure search_path
CREATE OR REPLACE FUNCTION public.update_rrlc_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Add comment explaining the security setting
COMMENT ON FUNCTION public.update_rrlc_updated_at_column() IS 
'Automatically updates the updated_at column to current timestamp. 
Uses empty search_path for security.';
