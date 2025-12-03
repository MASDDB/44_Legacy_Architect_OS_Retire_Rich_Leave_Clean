/*
  # Fix Unindexed Foreign Keys - Performance Optimization

  This migration adds indexes to all foreign key columns that were missing them,
  significantly improving query performance for JOIN operations and foreign key lookups.

  ## Changes Made

  ### 1. AI Message & Personalization Tables
    - `ai_message_personalizations`: Added indexes on campaign_id, lead_id
    - `ai_personalization_analytics`: Added index on rule_id

  ### 2. API & Integration Tables
    - `api_usage_logs`: Added index on api_key_id

  ### 3. Appointment Tables
    - `appointment_reminders`: Added index on appointment_id
    - `appointments`: Added index on lead_id

  ### 4. Calendar Tables
    - `calendar_sync_logs`: Added index on connection_id

  ### 5. Campaign Tables
    - `campaign_ab_test_results`: Added index on campaign_id
    - `campaign_analytics`: Added index on campaign_id
    - `campaign_automation_logs`: Added index on campaign_id
    - `campaign_flow_edges`: Added index on campaign_id
    - `campaign_flow_nodes`: Added index on campaign_id
    - `campaign_leads`: Added index on lead_id

  ### 6. Company Tables
    - `companies`: Added index on owner_id

  ### 7. CRM Tables
    - `crm_field_mappings`: Added index on integration_id

  ### 8. Email Tables
    - `email_confirmation_reminders`: Added index on user_id

  ### 9. Lead Tables
    - `lead_activities`: Added indexes on lead_id, performed_by
    - `lead_behavioral_metrics`: Added index on lead_id
    - `lead_engagement_summary`: Added index on lead_id
    - `lead_score_history`: Added index on lead_id
    - `lead_scores`: Added index on lead_id
    - `leads`: Added index on company_id

  ### 10. SMS Tables
    - `sms_messages`: Added indexes on campaign_id, lead_id, sent_by

  ### 11. Voice Tables
    - `voice_campaign_analytics`: Added index on campaign_id
    - `voice_messages`: Added indexes on campaign_id, lead_id, sent_by

  ### 12. Webhook Tables
    - `webhook_deliveries`: Added index on webhook_id

  ## Performance Impact
    - Dramatically improves JOIN performance
    - Speeds up foreign key constraint checks
    - Reduces query execution time for related data lookups
*/

-- AI Message & Personalization Tables
CREATE INDEX IF NOT EXISTS idx_ai_message_personalizations_campaign_id 
  ON public.ai_message_personalizations(campaign_id);

CREATE INDEX IF NOT EXISTS idx_ai_message_personalizations_lead_id 
  ON public.ai_message_personalizations(lead_id);

CREATE INDEX IF NOT EXISTS idx_ai_personalization_analytics_rule_id 
  ON public.ai_personalization_analytics(rule_id);

-- API & Integration Tables
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_api_key_id 
  ON public.api_usage_logs(api_key_id);

-- Appointment Tables
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_appointment_id 
  ON public.appointment_reminders(appointment_id);

CREATE INDEX IF NOT EXISTS idx_appointments_lead_id 
  ON public.appointments(lead_id);

-- Calendar Tables
CREATE INDEX IF NOT EXISTS idx_calendar_sync_logs_connection_id 
  ON public.calendar_sync_logs(connection_id);

-- Campaign Tables
CREATE INDEX IF NOT EXISTS idx_campaign_ab_test_results_campaign_id 
  ON public.campaign_ab_test_results(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id 
  ON public.campaign_analytics(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_automation_logs_campaign_id 
  ON public.campaign_automation_logs(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_flow_edges_campaign_id 
  ON public.campaign_flow_edges(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_flow_nodes_campaign_id 
  ON public.campaign_flow_nodes(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_leads_lead_id 
  ON public.campaign_leads(lead_id);

-- Company Tables
CREATE INDEX IF NOT EXISTS idx_companies_owner_id 
  ON public.companies(owner_id);

-- CRM Tables
CREATE INDEX IF NOT EXISTS idx_crm_field_mappings_integration_id 
  ON public.crm_field_mappings(integration_id);

-- Email Tables
CREATE INDEX IF NOT EXISTS idx_email_confirmation_reminders_user_id 
  ON public.email_confirmation_reminders(user_id);

-- Lead Tables
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id 
  ON public.lead_activities(lead_id);

CREATE INDEX IF NOT EXISTS idx_lead_activities_performed_by 
  ON public.lead_activities(performed_by);

CREATE INDEX IF NOT EXISTS idx_lead_behavioral_metrics_lead_id 
  ON public.lead_behavioral_metrics(lead_id);

CREATE INDEX IF NOT EXISTS idx_lead_engagement_summary_lead_id 
  ON public.lead_engagement_summary(lead_id);

CREATE INDEX IF NOT EXISTS idx_lead_score_history_lead_id 
  ON public.lead_score_history(lead_id);

CREATE INDEX IF NOT EXISTS idx_lead_scores_lead_id 
  ON public.lead_scores(lead_id);

CREATE INDEX IF NOT EXISTS idx_leads_company_id 
  ON public.leads(company_id);

-- SMS Tables
CREATE INDEX IF NOT EXISTS idx_sms_messages_campaign_id 
  ON public.sms_messages(campaign_id);

CREATE INDEX IF NOT EXISTS idx_sms_messages_lead_id 
  ON public.sms_messages(lead_id);

CREATE INDEX IF NOT EXISTS idx_sms_messages_sent_by 
  ON public.sms_messages(sent_by);

-- Voice Tables
CREATE INDEX IF NOT EXISTS idx_voice_campaign_analytics_campaign_id 
  ON public.voice_campaign_analytics(campaign_id);

CREATE INDEX IF NOT EXISTS idx_voice_messages_campaign_id 
  ON public.voice_messages(campaign_id);

CREATE INDEX IF NOT EXISTS idx_voice_messages_lead_id 
  ON public.voice_messages(lead_id);

CREATE INDEX IF NOT EXISTS idx_voice_messages_sent_by 
  ON public.voice_messages(sent_by);

-- Webhook Tables
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id 
  ON public.webhook_deliveries(webhook_id);
