/*
  # Fix Function Search Path Security Issue

  This migration fixes the security vulnerability in the update_cash_boost_updated_at
  function by setting an immutable search_path. This prevents potential security risks
  from search_path manipulation.

  ## Changes Made

  ### Function Security Fix
    - `update_cash_boost_updated_at`: Set SECURITY DEFINER with fixed search_path

  ## Security Impact
    - Prevents search_path manipulation attacks
    - Ensures function always uses the correct schema
    - Hardens database security against privilege escalation
*/

-- Drop and recreate the function with proper security settings
DROP FUNCTION IF EXISTS public.update_cash_boost_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_cash_boost_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers that use this function
DROP TRIGGER IF EXISTS update_cash_boost_campaigns_updated_at ON public.cash_boost_campaigns;
CREATE TRIGGER update_cash_boost_campaigns_updated_at
  BEFORE UPDATE ON public.cash_boost_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cash_boost_updated_at();

DROP TRIGGER IF EXISTS update_cash_boost_revenue_events_updated_at ON public.cash_boost_revenue_events;
CREATE TRIGGER update_cash_boost_revenue_events_updated_at
  BEFORE UPDATE ON public.cash_boost_revenue_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cash_boost_updated_at();
