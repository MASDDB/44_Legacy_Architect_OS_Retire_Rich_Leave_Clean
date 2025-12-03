-- Supabase Migration: Optimize RLS Policies Auth Functions Performance
-- Fix auth.uid() re-evaluation performance issues identified by Supabase linter
-- Timestamp: 2025-10-06 18:59:47

BEGIN;

-- =============================================================================
-- 1. FIX: voice_messages table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for voice_messages
DROP POLICY IF EXISTS "users_manage_own_voice_messages" ON public.voice_messages;

CREATE POLICY "users_manage_own_voice_messages"
ON public.voice_messages
FOR ALL
TO authenticated
USING (sent_by = (select auth.uid()))
WITH CHECK (sent_by = (select auth.uid()));

-- =============================================================================
-- 2. FIX: ai_personalization_rules table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for ai_personalization_rules
DROP POLICY IF EXISTS "users_manage_own_ai_personalization_rules" ON public.ai_personalization_rules;

CREATE POLICY "users_manage_own_ai_personalization_rules"
ON public.ai_personalization_rules
FOR ALL
TO authenticated
USING (created_by = (select auth.uid()))
WITH CHECK (created_by = (select auth.uid()));

-- =============================================================================
-- 3. FIX: voice_campaign_settings table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for voice_campaign_settings
DROP POLICY IF EXISTS "users_manage_voice_campaign_settings" ON public.voice_campaign_settings;

CREATE POLICY "users_manage_voice_campaign_settings"
ON public.voice_campaign_settings
FOR ALL
TO authenticated
USING (campaign_id IN (
    SELECT id FROM public.campaigns 
    WHERE created_by = (select auth.uid())
))
WITH CHECK (campaign_id IN (
    SELECT id FROM public.campaigns 
    WHERE created_by = (select auth.uid())
));

-- =============================================================================
-- 4. FIX: voice_campaign_analytics table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for voice_campaign_analytics
DROP POLICY IF EXISTS "users_view_voice_campaign_analytics" ON public.voice_campaign_analytics;

CREATE POLICY "users_view_voice_campaign_analytics"
ON public.voice_campaign_analytics
FOR SELECT
TO authenticated
USING (campaign_id IN (
    SELECT id FROM public.campaigns 
    WHERE created_by = (select auth.uid())
));

-- =============================================================================
-- 5. FIX: ai_message_personalizations table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for ai_message_personalizations
DROP POLICY IF EXISTS "users_manage_own_ai_message_personalizations" ON public.ai_message_personalizations;

CREATE POLICY "users_manage_own_ai_message_personalizations"
ON public.ai_message_personalizations
FOR ALL
TO authenticated
USING (created_by = (select auth.uid()))
WITH CHECK (created_by = (select auth.uid()));

-- =============================================================================
-- 6. FIX: ai_personalization_analytics table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for ai_personalization_analytics
DROP POLICY IF EXISTS "users_view_own_ai_personalization_analytics" ON public.ai_personalization_analytics;

CREATE POLICY "users_view_own_ai_personalization_analytics"
ON public.ai_personalization_analytics
FOR SELECT
TO authenticated
USING (rule_id IN (
    SELECT id FROM public.ai_personalization_rules 
    WHERE created_by = (select auth.uid())
));

-- =============================================================================
-- 7. FIX: ai_personalization_settings table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for ai_personalization_settings
DROP POLICY IF EXISTS "users_manage_own_ai_personalization_settings" ON public.ai_personalization_settings;

CREATE POLICY "users_manage_own_ai_personalization_settings"
ON public.ai_personalization_settings
FOR ALL
TO authenticated
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- =============================================================================
-- 8. FIX: api_keys table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for api_keys
DROP POLICY IF EXISTS "users_manage_own_api_keys" ON public.api_keys;

CREATE POLICY "users_manage_own_api_keys"
ON public.api_keys
FOR ALL
TO authenticated
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- =============================================================================
-- 9. FIX: integrations table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for integrations
DROP POLICY IF EXISTS "users_manage_own_integrations" ON public.integrations;

CREATE POLICY "users_manage_own_integrations"
ON public.integrations
FOR ALL
TO authenticated
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- =============================================================================
-- 10. FIX: webhooks table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for webhooks
DROP POLICY IF EXISTS "users_manage_own_webhooks" ON public.webhooks;

CREATE POLICY "users_manage_own_webhooks"
ON public.webhooks
FOR ALL
TO authenticated
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- =============================================================================
-- 11. FIX: webhook_deliveries table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for webhook_deliveries
DROP POLICY IF EXISTS "users_view_own_webhook_deliveries" ON public.webhook_deliveries;

CREATE POLICY "users_view_own_webhook_deliveries"
ON public.webhook_deliveries
FOR SELECT
TO authenticated
USING (webhook_id IN (
    SELECT id FROM public.webhooks 
    WHERE user_id = (select auth.uid())
));

-- =============================================================================
-- 12. FIX: api_usage_logs table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for api_usage_logs
DROP POLICY IF EXISTS "users_view_own_api_usage_logs" ON public.api_usage_logs;

CREATE POLICY "users_view_own_api_usage_logs"
ON public.api_usage_logs
FOR SELECT
TO authenticated
USING (api_key_id IN (
    SELECT id FROM public.api_keys 
    WHERE user_id = (select auth.uid())
));

-- =============================================================================
-- 13. FIX: crm_field_mappings table policy optimization
-- =============================================================================

-- Drop and recreate the RLS policy for crm_field_mappings
DROP POLICY IF EXISTS "users_manage_own_crm_field_mappings" ON public.crm_field_mappings;

CREATE POLICY "users_manage_own_crm_field_mappings"
ON public.crm_field_mappings
FOR ALL
TO authenticated
USING (integration_id IN (
    SELECT id FROM public.integrations 
    WHERE user_id = (select auth.uid())
))
WITH CHECK (integration_id IN (
    SELECT id FROM public.integrations 
    WHERE user_id = (select auth.uid())
));

-- =============================================================================
-- Migration Completion and Validation
-- =============================================================================

-- Add comment to track this optimization
COMMENT ON SCHEMA public IS 'Schema updated: RLS policies optimized to prevent auth.uid() re-evaluation per row (2025-10-06)';

-- Verify all tables have RLS enabled (should already be enabled)
-- Note: This is just a verification query, not changing RLS status
DO $$
DECLARE
    table_name TEXT;
    tables_to_verify TEXT[] := ARRAY[
        'voice_messages', 
        'ai_personalization_rules', 
        'voice_campaign_settings',
        'voice_campaign_analytics',
        'ai_message_personalizations',
        'ai_personalization_analytics', 
        'ai_personalization_settings',
        'api_keys',
        'integrations',
        'webhooks',
        'webhook_deliveries',
        'api_usage_logs',
        'crm_field_mappings'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_to_verify
    LOOP
        -- Ensure RLS is enabled for each optimized table
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
        RAISE NOTICE 'RLS verified/enabled for table: %', table_name;
    END LOOP;
END $$;

COMMIT;

-- =============================================================================
-- Performance Improvement Summary:
-- =============================================================================
-- 
-- This migration fixes RLS policy performance issues by:
-- 1. Replacing direct auth.uid() calls with (select auth.uid())
-- 2. Ensuring auth functions execute once per query, not per row
-- 3. Maintaining the same security model while improving scalability
-- 4. Following Supabase best practices for RLS policy optimization
--
-- Tables optimized: 13 tables with RLS policy performance improvements
-- Expected performance improvement: Significant reduction in query execution time
-- for large datasets due to reduced auth function re-evaluation
-- 
-- All policies maintain the same security restrictions while improving performance.
-- =============================================================================