-- Optimize RLS Policies for Performance
-- Replace auth.uid() with (select auth.uid()) to prevent unnecessary re-evaluation

-- Fix user_profiles RLS policy
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles" ON public.user_profiles
    FOR ALL USING ((select auth.uid()) = id);

-- Fix companies RLS policy
DROP POLICY IF EXISTS "users_manage_own_companies" ON public.companies;
CREATE POLICY "users_manage_own_companies" ON public.companies
    FOR ALL USING ((select auth.uid()) = owner_id);

-- Fix leads RLS policy
DROP POLICY IF EXISTS "users_manage_assigned_leads" ON public.leads;
CREATE POLICY "users_manage_assigned_leads" ON public.leads
    FOR ALL USING ((select auth.uid()) = assigned_to);

-- Fix campaigns RLS policy
DROP POLICY IF EXISTS "users_manage_own_campaigns" ON public.campaigns;
CREATE POLICY "users_manage_own_campaigns" ON public.campaigns
    FOR ALL USING ((select auth.uid()) = created_by);

-- Fix campaign_leads RLS policy
DROP POLICY IF EXISTS "users_manage_own_campaign_leads" ON public.campaign_leads;
CREATE POLICY "users_manage_own_campaign_leads" ON public.campaign_leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE campaigns.id = campaign_leads.campaign_id 
            AND campaigns.created_by = (select auth.uid())
        )
    );

-- Fix appointments RLS policy
DROP POLICY IF EXISTS "users_manage_own_appointments" ON public.appointments;
CREATE POLICY "users_manage_own_appointments" ON public.appointments
    FOR ALL USING ((select auth.uid()) = assigned_to);

-- Fix lead_activities RLS policy
DROP POLICY IF EXISTS "users_manage_own_lead_activities" ON public.lead_activities;
CREATE POLICY "users_manage_own_lead_activities" ON public.lead_activities
    FOR ALL USING ((select auth.uid()) = performed_by);

-- Fix compliance_records RLS policy
DROP POLICY IF EXISTS "users_manage_own_compliance_records" ON public.compliance_records;
CREATE POLICY "users_manage_own_compliance_records" ON public.compliance_records
    FOR ALL USING ((select auth.uid()) = reviewed_by);

-- Fix sms_messages RLS policy
DROP POLICY IF EXISTS "users_manage_own_sms_messages" ON public.sms_messages;
CREATE POLICY "users_manage_own_sms_messages" ON public.sms_messages
    FOR ALL USING ((select auth.uid()) = sent_by);

-- Fix sms_templates RLS policy
DROP POLICY IF EXISTS "users_manage_own_sms_templates" ON public.sms_templates;
CREATE POLICY "users_manage_own_sms_templates" ON public.sms_templates
    FOR ALL USING ((select auth.uid()) = created_by);

-- Fix email_templates RLS policy
DROP POLICY IF EXISTS "users_manage_own_email_templates" ON public.email_templates;
CREATE POLICY "users_manage_own_email_templates" ON public.email_templates
    FOR ALL USING ((select auth.uid()) = created_by);

-- Fix email_notifications RLS policy
DROP POLICY IF EXISTS "users_manage_own_email_notifications" ON public.email_notifications;
CREATE POLICY "users_manage_own_email_notifications" ON public.email_notifications
    FOR ALL USING ((select auth.uid()) = sent_by);

-- Fix email_preferences RLS policy
DROP POLICY IF EXISTS "users_manage_own_email_preferences" ON public.email_preferences;
CREATE POLICY "users_manage_own_email_preferences" ON public.email_preferences
    FOR ALL USING ((select auth.uid()) = user_id);

-- Fix lead_scoring_models RLS policy
DROP POLICY IF EXISTS "users_manage_own_lead_scoring_models" ON public.lead_scoring_models;
CREATE POLICY "users_manage_own_lead_scoring_models" ON public.lead_scoring_models
    FOR ALL USING ((select auth.uid()) = created_by);

-- Fix calendar_connections RLS policy
DROP POLICY IF EXISTS "users_manage_own_calendar_connections" ON public.calendar_connections;
CREATE POLICY "users_manage_own_calendar_connections" ON public.calendar_connections
    FOR ALL USING ((select auth.uid()) = user_id);

-- Fix user_availability RLS policy
DROP POLICY IF EXISTS "users_manage_own_availability" ON public.user_availability;
CREATE POLICY "users_manage_own_availability" ON public.user_availability
    FOR ALL USING ((select auth.uid()) = user_id);

-- Fix booking_page_settings RLS policy
DROP POLICY IF EXISTS "users_manage_own_booking_settings" ON public.booking_page_settings;
CREATE POLICY "users_manage_own_booking_settings" ON public.booking_page_settings
    FOR ALL USING ((select auth.uid()) = user_id);

-- Fix calendar_sync_logs RLS policy
DROP POLICY IF EXISTS "users_view_own_sync_logs" ON public.calendar_sync_logs;
CREATE POLICY "users_view_own_sync_logs" ON public.calendar_sync_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.calendar_connections 
            WHERE calendar_connections.id = calendar_sync_logs.connection_id 
            AND calendar_connections.user_id = (select auth.uid())
        )
    );

-- Fix appointment_reminders RLS policy
DROP POLICY IF EXISTS "users_view_appointment_reminders" ON public.appointment_reminders;
CREATE POLICY "users_view_appointment_reminders" ON public.appointment_reminders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.appointments 
            WHERE appointments.id = appointment_reminders.appointment_id 
            AND appointments.assigned_to = (select auth.uid())
        )
    );

-- Fix calendar_analytics RLS policy
DROP POLICY IF EXISTS "users_manage_own_calendar_analytics" ON public.calendar_analytics;
CREATE POLICY "users_manage_own_calendar_analytics" ON public.calendar_analytics
    FOR ALL USING ((select auth.uid()) = user_id);

-- Fix email_confirmation_reminders RLS policy
DROP POLICY IF EXISTS "users_manage_own_email_reminders" ON public.email_confirmation_reminders;
CREATE POLICY "users_manage_own_email_reminders" ON public.email_confirmation_reminders
    FOR ALL USING ((select auth.uid()) = user_id);

-- Comment: All RLS policies have been optimized to use (select auth.uid()) instead of auth.uid()
-- This prevents the unnecessary re-evaluation of auth functions for each row, significantly
-- improving query performance at scale as recommended by Supabase performance guidelines.