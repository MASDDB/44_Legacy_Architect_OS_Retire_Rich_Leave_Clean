/*
  # Drop Unused Indexes - Performance Optimization

  This migration removes indexes that are not being used by any queries,
  improving write performance and reducing storage overhead.

  ## Indexes Removed

  ### 1. AI & Personalization Tables
    - `idx_ai_message_personalizations_created_by` - Not used
    - `idx_ai_personalization_analytics_campaign_id` - Not used
    - `idx_ai_personalization_rules_created_by` - Not used

  ### 2. Compliance Tables
    - `idx_compliance_records_reviewed_by` - Not used

  ### 3. Email Tables
    - `idx_email_notifications_sent_by` - Not used
    - `idx_email_notifications_template_id` - Not used
    - `idx_email_templates_created_by` - Not used
    - `idx_email_preferences_user` - Not used

  ### 4. Lead Scoring Tables
    - `idx_lead_score_history_changed_by` - Not used
    - `idx_lead_score_history_lead_score_id` - Not used
    - `idx_lead_scores_scoring_model_id` - Not used
    - `idx_lead_scoring_models_created_by` - Not used

  ### 5. SMS Tables
    - `idx_sms_templates_created_by` - Not used

  ### 6. API & Integration Tables
    - `idx_api_keys_user_id` - Not used
    - `idx_integrations_user_id` - Not used
    - `idx_webhooks_user_id` - Not used
    - `idx_webhook_deliveries_created_at` - Not used
    - `idx_api_usage_logs_created_at` - Not used

  ### 7. Calendar Tables
    - `idx_calendar_connections_user_id` - Not used

  ### 8. Cash Boost Tables
    - `idx_cash_boost_campaigns_user_id` - Not used
    - `idx_cash_boost_campaigns_status` - Not used
    - `idx_cash_boost_campaigns_start_date` - Not used
    - `idx_cash_boost_revenue_events_campaign_id` - Not used
    - `idx_cash_boost_revenue_events_lead_id` - Not used
    - `idx_cash_boost_revenue_events_created_by` - Not used

  ### 9. AI Audits Tables
    - `idx_ai_audits_user_id` - Not used
    - `idx_ai_audits_created_at` - Not used
    - `idx_ai_audits_user_created` - Not used

  ## Performance Impact
    - Improves INSERT/UPDATE/DELETE performance
    - Reduces storage space
    - Reduces index maintenance overhead
    - Keeps only actively used indexes for optimal query performance
*/

-- AI & Personalization Tables
DROP INDEX IF EXISTS public.idx_ai_message_personalizations_created_by;
DROP INDEX IF EXISTS public.idx_ai_personalization_analytics_campaign_id;
DROP INDEX IF EXISTS public.idx_ai_personalization_rules_created_by;

-- Compliance Tables
DROP INDEX IF EXISTS public.idx_compliance_records_reviewed_by;

-- Email Tables
DROP INDEX IF EXISTS public.idx_email_notifications_sent_by;
DROP INDEX IF EXISTS public.idx_email_notifications_template_id;
DROP INDEX IF EXISTS public.idx_email_templates_created_by;
DROP INDEX IF EXISTS public.idx_email_preferences_user;

-- Lead Scoring Tables
DROP INDEX IF EXISTS public.idx_lead_score_history_changed_by;
DROP INDEX IF EXISTS public.idx_lead_score_history_lead_score_id;
DROP INDEX IF EXISTS public.idx_lead_scores_scoring_model_id;
DROP INDEX IF EXISTS public.idx_lead_scoring_models_created_by;

-- SMS Tables
DROP INDEX IF EXISTS public.idx_sms_templates_created_by;

-- API & Integration Tables
DROP INDEX IF EXISTS public.idx_api_keys_user_id;
DROP INDEX IF EXISTS public.idx_integrations_user_id;
DROP INDEX IF EXISTS public.idx_webhooks_user_id;
DROP INDEX IF EXISTS public.idx_webhook_deliveries_created_at;
DROP INDEX IF EXISTS public.idx_api_usage_logs_created_at;

-- Calendar Tables
DROP INDEX IF EXISTS public.idx_calendar_connections_user_id;

-- Cash Boost Tables
DROP INDEX IF EXISTS public.idx_cash_boost_campaigns_user_id;
DROP INDEX IF EXISTS public.idx_cash_boost_campaigns_status;
DROP INDEX IF EXISTS public.idx_cash_boost_campaigns_start_date;
DROP INDEX IF EXISTS public.idx_cash_boost_revenue_events_campaign_id;
DROP INDEX IF EXISTS public.idx_cash_boost_revenue_events_lead_id;
DROP INDEX IF EXISTS public.idx_cash_boost_revenue_events_created_by;

-- AI Audits Tables
DROP INDEX IF EXISTS public.idx_ai_audits_user_id;
DROP INDEX IF EXISTS public.idx_ai_audits_created_at;
DROP INDEX IF EXISTS public.idx_ai_audits_user_created;
