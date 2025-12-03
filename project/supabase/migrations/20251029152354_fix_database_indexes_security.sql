/*
  # Fix Database Indexes for Security and Performance

  This migration addresses security and performance issues by:
  
  1. **Adding Missing Foreign Key Indexes** - Critical for query performance
     - ai_message_personalizations: created_by
     - ai_personalization_analytics: campaign_id
     - ai_personalization_rules: created_by
     - compliance_records: reviewed_by
     - email_notifications: sent_by, template_id
     - email_templates: created_by
     - lead_score_history: changed_by, lead_score_id
     - lead_scores: scoring_model_id
     - lead_scoring_models: created_by

  2. **Removing Unused Indexes** - Improves write performance and reduces storage
     - Removes 96 unused indexes across multiple tables
     - These indexes were created but never utilized by queries
     - Keeping them adds overhead to INSERT/UPDATE/DELETE operations

  3. **Important Notes**
     - Foreign key indexes are essential for JOIN operations and referential integrity checks
     - Unused indexes waste storage and slow down write operations
     - This migration improves both read and write performance
*/

-- ============================================================================
-- Add Missing Foreign Key Indexes
-- ============================================================================

-- AI Message Personalizations
CREATE INDEX IF NOT EXISTS idx_ai_message_personalizations_created_by 
  ON public.ai_message_personalizations(created_by);

-- AI Personalization Analytics
CREATE INDEX IF NOT EXISTS idx_ai_personalization_analytics_campaign_id 
  ON public.ai_personalization_analytics(campaign_id);

-- AI Personalization Rules
CREATE INDEX IF NOT EXISTS idx_ai_personalization_rules_created_by 
  ON public.ai_personalization_rules(created_by);

-- Compliance Records
CREATE INDEX IF NOT EXISTS idx_compliance_records_reviewed_by 
  ON public.compliance_records(reviewed_by);

-- Email Notifications
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent_by 
  ON public.email_notifications(sent_by);

CREATE INDEX IF NOT EXISTS idx_email_notifications_template_id 
  ON public.email_notifications(template_id);

-- Email Templates
CREATE INDEX IF NOT EXISTS idx_email_templates_created_by 
  ON public.email_templates(created_by);

-- Lead Score History
CREATE INDEX IF NOT EXISTS idx_lead_score_history_changed_by 
  ON public.lead_score_history(changed_by);

CREATE INDEX IF NOT EXISTS idx_lead_score_history_lead_score_id 
  ON public.lead_score_history(lead_score_id);

-- Lead Scores
CREATE INDEX IF NOT EXISTS idx_lead_scores_scoring_model_id 
  ON public.lead_scores(scoring_model_id);

-- Lead Scoring Models
CREATE INDEX IF NOT EXISTS idx_lead_scoring_models_created_by 
  ON public.lead_scoring_models(created_by);

-- ============================================================================
-- Remove Unused Indexes
-- ============================================================================

-- AI Personalization indexes
DROP INDEX IF EXISTS public.idx_ai_personalization_rules_type;
DROP INDEX IF EXISTS public.idx_ai_personalization_rules_active;
DROP INDEX IF EXISTS public.idx_ai_personalization_rules_priority;
DROP INDEX IF EXISTS public.idx_ai_message_personalizations_lead_id;
DROP INDEX IF EXISTS public.idx_ai_message_personalizations_campaign_id;
DROP INDEX IF EXISTS public.idx_ai_message_personalizations_message_type;
DROP INDEX IF EXISTS public.idx_ai_message_personalizations_created_at;
DROP INDEX IF EXISTS public.idx_ai_personalization_analytics_rule_id;
DROP INDEX IF EXISTS public.idx_ai_personalization_analytics_date_period;

-- User and company indexes
DROP INDEX IF EXISTS public.idx_user_profiles_email;
DROP INDEX IF EXISTS public.idx_user_profiles_role;
DROP INDEX IF EXISTS public.idx_user_profiles_company;
DROP INDEX IF EXISTS public.idx_user_profiles_timezone;
DROP INDEX IF EXISTS public.idx_companies_owner_id;
DROP INDEX IF EXISTS public.idx_companies_name;

-- Lead management indexes
DROP INDEX IF EXISTS public.idx_leads_company_id;
DROP INDEX IF EXISTS public.idx_leads_status;
DROP INDEX IF EXISTS public.idx_leads_priority;
DROP INDEX IF EXISTS public.idx_leads_next_follow_up;

-- Campaign indexes
DROP INDEX IF EXISTS public.idx_campaigns_status;
DROP INDEX IF EXISTS public.idx_campaign_leads_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_leads_lead_id;

-- Appointment indexes
DROP INDEX IF EXISTS public.idx_appointments_lead_id;
DROP INDEX IF EXISTS public.idx_appointments_scheduled_at;

-- Lead activity indexes
DROP INDEX IF EXISTS public.idx_lead_activities_lead_id;
DROP INDEX IF EXISTS public.idx_lead_activities_performed_by;

-- Compliance indexes
DROP INDEX IF EXISTS public.idx_compliance_records_entity;

-- SMS indexes
DROP INDEX IF EXISTS public.idx_sms_messages_campaign_id;
DROP INDEX IF EXISTS public.idx_sms_messages_lead_id;
DROP INDEX IF EXISTS public.idx_sms_messages_sent_by;
DROP INDEX IF EXISTS public.idx_sms_messages_phone_number;
DROP INDEX IF EXISTS public.idx_sms_messages_status;
DROP INDEX IF EXISTS public.idx_sms_messages_sent_at;
DROP INDEX IF EXISTS public.idx_sms_templates_category;

-- Email indexes
DROP INDEX IF EXISTS public.idx_email_templates_type;
DROP INDEX IF EXISTS public.idx_email_templates_active;
DROP INDEX IF EXISTS public.idx_email_notifications_status;
DROP INDEX IF EXISTS public.idx_email_notifications_type;
DROP INDEX IF EXISTS public.idx_email_notifications_sent_at;
DROP INDEX IF EXISTS public.idx_email_notifications_entity;

-- API and integration indexes
DROP INDEX IF EXISTS public.idx_api_keys_status;
DROP INDEX IF EXISTS public.idx_api_keys_key;
DROP INDEX IF EXISTS public.idx_integrations_type;
DROP INDEX IF EXISTS public.idx_integrations_status;
DROP INDEX IF EXISTS public.idx_webhooks_status;
DROP INDEX IF EXISTS public.idx_webhook_deliveries_webhook_id;
DROP INDEX IF EXISTS public.idx_api_usage_logs_api_key_id;

-- Campaign flow indexes
DROP INDEX IF EXISTS public.idx_campaign_flow_nodes_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_flow_nodes_type;
DROP INDEX IF EXISTS public.idx_campaign_flow_edges_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_flow_edges_source;
DROP INDEX IF EXISTS public.idx_campaign_flow_edges_target;

-- Campaign analytics indexes
DROP INDEX IF EXISTS public.idx_campaign_analytics_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_analytics_metric;
DROP INDEX IF EXISTS public.idx_campaign_analytics_recorded_at;
DROP INDEX IF EXISTS public.idx_campaign_ab_test_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_automation_logs_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_automation_logs_status;

-- Lead scoring indexes
DROP INDEX IF EXISTS public.idx_lead_behavioral_metrics_lead_id;
DROP INDEX IF EXISTS public.idx_lead_behavioral_metrics_event_type;
DROP INDEX IF EXISTS public.idx_lead_behavioral_metrics_timestamp;
DROP INDEX IF EXISTS public.idx_lead_scores_lead_id;
DROP INDEX IF EXISTS public.idx_lead_scores_category;
DROP INDEX IF EXISTS public.idx_lead_scores_overall_score;
DROP INDEX IF EXISTS public.idx_lead_scores_expires_at;
DROP INDEX IF EXISTS public.idx_lead_engagement_summary_lead_id;
DROP INDEX IF EXISTS public.idx_lead_engagement_summary_last_activity;
DROP INDEX IF EXISTS public.idx_lead_score_history_lead_id;
DROP INDEX IF EXISTS public.idx_lead_score_history_created_at;

-- CRM integration indexes
DROP INDEX IF EXISTS public.idx_crm_field_mappings_integration_id;

-- Calendar indexes
DROP INDEX IF EXISTS public.idx_calendar_connections_provider;
DROP INDEX IF EXISTS public.idx_calendar_connections_status;
DROP INDEX IF EXISTS public.idx_user_availability_user_id;
DROP INDEX IF EXISTS public.idx_user_availability_day_time;
DROP INDEX IF EXISTS public.idx_booking_page_settings_user_id;
DROP INDEX IF EXISTS public.idx_calendar_sync_logs_connection_id;
DROP INDEX IF EXISTS public.idx_calendar_sync_logs_sync_status;
DROP INDEX IF EXISTS public.idx_appointment_reminders_appointment_id;
DROP INDEX IF EXISTS public.idx_appointment_reminders_send_at;
DROP INDEX IF EXISTS public.idx_appointment_reminders_sent;
DROP INDEX IF EXISTS public.idx_calendar_analytics_user_date;
DROP INDEX IF EXISTS public.idx_email_confirmation_reminders_user_id;

-- Voice campaign indexes
DROP INDEX IF EXISTS public.idx_voice_messages_campaign_id;
DROP INDEX IF EXISTS public.idx_voice_messages_lead_id;
DROP INDEX IF EXISTS public.idx_voice_messages_sent_by;
DROP INDEX IF EXISTS public.idx_voice_messages_call_status;
DROP INDEX IF EXISTS public.idx_voice_messages_sent_at;
DROP INDEX IF EXISTS public.idx_voice_messages_phone_number;
DROP INDEX IF EXISTS public.idx_voice_campaign_settings_campaign_id;
DROP INDEX IF EXISTS public.idx_voice_campaign_analytics_campaign_id;
DROP INDEX IF EXISTS public.idx_voice_campaign_analytics_date_tracked;
