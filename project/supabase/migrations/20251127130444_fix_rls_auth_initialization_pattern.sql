/*
  # Fix RLS Auth Initialization Pattern - Performance Optimization

  This migration updates all RLS policies to use the optimized (select auth.uid()) pattern
  instead of direct auth.uid() calls. This prevents re-evaluation of auth functions for
  each row, dramatically improving query performance at scale.

  ## Changes Made

  ### 1. Cash Boost Campaigns Table (4 policies)
    - "Users can view own campaigns" - Updated to use (select auth.uid())
    - "Users can create own campaigns" - Updated to use (select auth.uid())
    - "Users can update own campaigns" - Updated to use (select auth.uid())
    - "Users can delete own campaigns" - Updated to use (select auth.uid())

  ### 2. Cash Boost Revenue Events Table (4 policies)
    - "Users can view own revenue events" - Updated to use (select auth.uid())
    - "Users can create revenue events for own campaigns" - Updated to use (select auth.uid())
    - "Users can update own revenue events" - Updated to use (select auth.uid())
    - "Users can delete own revenue events" - Updated to use (select auth.uid())

  ### 3. AI Audits Table (3 policies)
    - "Users can read own audits" - Updated to use (select auth.uid())
    - "Users can create own audits" - Updated to use (select auth.uid())
    - "Users can update own audits" - Updated to use (select auth.uid())

  ## Performance Impact
    - Eliminates redundant auth function calls per row
    - Significantly improves query performance on large datasets
    - Reduces database CPU usage for authenticated queries
*/

-- ============================================
-- Cash Boost Campaigns Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own campaigns" ON public.cash_boost_campaigns;
CREATE POLICY "Users can view own campaigns"
  ON public.cash_boost_campaigns
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own campaigns" ON public.cash_boost_campaigns;
CREATE POLICY "Users can create own campaigns"
  ON public.cash_boost_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own campaigns" ON public.cash_boost_campaigns;
CREATE POLICY "Users can update own campaigns"
  ON public.cash_boost_campaigns
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own campaigns" ON public.cash_boost_campaigns;
CREATE POLICY "Users can delete own campaigns"
  ON public.cash_boost_campaigns
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- Cash Boost Revenue Events Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own revenue events" ON public.cash_boost_revenue_events;
CREATE POLICY "Users can view own revenue events"
  ON public.cash_boost_revenue_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cash_boost_campaigns
      WHERE id = cash_boost_revenue_events.campaign_id
      AND user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create revenue events for own campaigns" ON public.cash_boost_revenue_events;
CREATE POLICY "Users can create revenue events for own campaigns"
  ON public.cash_boost_revenue_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cash_boost_campaigns
      WHERE id = cash_boost_revenue_events.campaign_id
      AND user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own revenue events" ON public.cash_boost_revenue_events;
CREATE POLICY "Users can update own revenue events"
  ON public.cash_boost_revenue_events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cash_boost_campaigns
      WHERE id = cash_boost_revenue_events.campaign_id
      AND user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cash_boost_campaigns
      WHERE id = cash_boost_revenue_events.campaign_id
      AND user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own revenue events" ON public.cash_boost_revenue_events;
CREATE POLICY "Users can delete own revenue events"
  ON public.cash_boost_revenue_events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cash_boost_campaigns
      WHERE id = cash_boost_revenue_events.campaign_id
      AND user_id = (select auth.uid())
    )
  );

-- ============================================
-- AI Audits Policies
-- ============================================

DROP POLICY IF EXISTS "Users can read own audits" ON public.ai_audits;
CREATE POLICY "Users can read own audits"
  ON public.ai_audits
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own audits" ON public.ai_audits;
CREATE POLICY "Users can create own audits"
  ON public.ai_audits
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own audits" ON public.ai_audits;
CREATE POLICY "Users can update own audits"
  ON public.ai_audits
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
