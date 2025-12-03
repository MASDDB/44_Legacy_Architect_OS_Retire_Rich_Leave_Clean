-- Fix Function Search Path Security Issues
-- This migration addresses all Security Advisor warnings about function_search_path_mutable

-- Drop and recreate functions with secure search_path
-- This prevents potential security vulnerabilities from search_path manipulation

-- 1. Voice campaign related functions
DROP FUNCTION IF EXISTS public.update_voice_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_voice_updated_at_column()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

DROP FUNCTION IF EXISTS public.calculate_voice_analytics(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.calculate_voice_analytics(campaign_uuid uuid)
    RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
DECLARE
    analytics_result JSONB;
    total_calls_count INTEGER;
    answered_calls_count INTEGER;
    completed_calls_count INTEGER;
    total_duration_sum INTEGER;
    total_cost_sum DECIMAL(10,4);
BEGIN
    -- Get campaign statistics
    SELECT 
        COUNT(*) as total_calls,
        COUNT(*) FILTER (WHERE answered = true) as answered_calls,
        COUNT(*) FILTER (WHERE call_status = 'completed') as completed_calls,
        COALESCE(SUM(call_duration), 0) as total_duration,
        COALESCE(SUM(cost), 0) as total_cost
    INTO 
        total_calls_count,
        answered_calls_count, 
        completed_calls_count,
        total_duration_sum,
        total_cost_sum
    FROM public.voice_messages vm
    WHERE vm.campaign_id = campaign_uuid;

    -- Build analytics JSON
    analytics_result = public.jsonb_build_object(
        'totalCalls', total_calls_count,
        'answeredCalls', answered_calls_count,
        'completedCalls', completed_calls_count,
        'answerRate', CASE 
            WHEN total_calls_count > 0 THEN public.round((answered_calls_count::DECIMAL / total_calls_count) * 100, 2)
            ELSE 0 
        END,
        'completionRate', CASE 
            WHEN total_calls_count > 0 THEN public.round((completed_calls_count::DECIMAL / total_calls_count) * 100, 2)
            ELSE 0 
        END,
        'totalDuration', total_duration_sum,
        'totalCost', total_cost_sum,
        'averageDuration', CASE 
            WHEN completed_calls_count > 0 THEN public.round(total_duration_sum::DECIMAL / completed_calls_count, 2)
            ELSE 0 
        END,
        'costPerCompletion', CASE 
            WHEN completed_calls_count > 0 THEN public.round(total_cost_sum / completed_calls_count, 4)
            ELSE 0 
        END
    );

    RETURN analytics_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN '{"error": "Failed to calculate analytics"}'::jsonb;
END;
$function$;

DROP FUNCTION IF EXISTS public.send_voice_campaign(uuid, uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.send_voice_campaign(campaign_uuid uuid, lead_uuid uuid DEFAULT NULL::uuid)
    RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
DECLARE
    campaign_record public.campaigns%ROWTYPE;
    lead_record public.leads%ROWTYPE;
    voice_settings_record public.voice_campaign_settings%ROWTYPE;
    result JSONB;
    calls_sent INTEGER := 0;
    calls_failed INTEGER := 0;
BEGIN
    -- Get campaign details
    SELECT * INTO campaign_record FROM public.campaigns WHERE id = campaign_uuid;
    
    IF NOT FOUND THEN
        RETURN '{"success": false, "error": "Campaign not found"}'::jsonb;
    END IF;

    -- Check if campaign is voice type
    IF campaign_record.campaign_type != 'phone' THEN
        RETURN '{"success": false, "error": "Campaign is not a voice campaign"}'::jsonb;
    END IF;

    -- Get voice settings
    SELECT * INTO voice_settings_record FROM public.voice_campaign_settings WHERE campaign_id = campaign_uuid;

    -- Process specific lead or all campaign leads
    IF lead_uuid IS NOT NULL THEN
        -- Send to specific lead
        SELECT * INTO lead_record FROM public.leads WHERE id = lead_uuid;
        
        IF FOUND AND lead_record.phone IS NOT NULL THEN
            INSERT INTO public.voice_messages (
                campaign_id, lead_id, sent_by, phone_number, message_content,
                call_status, sent_at
            ) VALUES (
                campaign_uuid, lead_uuid, campaign_record.created_by, lead_record.phone,
                campaign_record.message_template, 'pending'::public.call_status, CURRENT_TIMESTAMP
            );
            
            calls_sent := 1;
        ELSE
            calls_failed := 1;
        END IF;
    ELSE
        -- Send to all campaign leads with phone numbers
        INSERT INTO public.voice_messages (
            campaign_id, lead_id, sent_by, phone_number, message_content,
            call_status, sent_at
        )
        SELECT 
            campaign_uuid,
            cl.lead_id,
            campaign_record.created_by,
            l.phone,
            campaign_record.message_template,
            'pending'::public.call_status,
            CURRENT_TIMESTAMP
        FROM public.campaign_leads cl
        JOIN public.leads l ON cl.lead_id = l.id
        WHERE cl.campaign_id = campaign_uuid 
        AND l.phone IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM public.voice_messages vm 
            WHERE vm.campaign_id = campaign_uuid AND vm.lead_id = l.id
        );

        GET DIAGNOSTICS calls_sent = ROW_COUNT;
    END IF;

    result = public.jsonb_build_object(
        'success', true,
        'campaignId', campaign_uuid,
        'callsSent', calls_sent,
        'callsFailed', calls_failed,
        'voiceEngine', COALESCE(voice_settings_record.voice_engine, 'twilio'),
        'timestamp', CURRENT_TIMESTAMP
    );

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN public.jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'callsSent', calls_sent,
            'callsFailed', calls_failed + 1
        );
END;
$function$;

DROP FUNCTION IF EXISTS public.update_voice_call_status(uuid, call_status, integer, text, numeric, text) CASCADE;
CREATE OR REPLACE FUNCTION public.update_voice_call_status(voice_message_uuid uuid, new_status public.call_status, call_duration_seconds integer DEFAULT NULL::integer, recording_url_param text DEFAULT NULL::text, cost_param numeric DEFAULT NULL::numeric, error_message_param text DEFAULT NULL::text)
    RETURNS boolean
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
BEGIN
    UPDATE public.voice_messages SET
        call_status = new_status,
        call_duration = COALESCE(call_duration_seconds, call_duration),
        recording_url = COALESCE(recording_url_param, recording_url),
        cost = COALESCE(cost_param, cost),
        error_message = COALESCE(error_message_param, error_message),
        answered = CASE WHEN new_status IN ('answered', 'completed') THEN true ELSE answered END,
        voicemail_detected = CASE WHEN new_status = 'voicemail' THEN true ELSE voicemail_detected END,
        answered_at = CASE WHEN new_status = 'answered' AND answered_at IS NULL THEN CURRENT_TIMESTAMP ELSE answered_at END,
        completed_at = CASE WHEN new_status IN ('completed', 'failed', 'no_answer', 'busy') THEN CURRENT_TIMESTAMP ELSE completed_at END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = voice_message_uuid;

    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$function$;

-- 2. AI Personalization related functions
DROP FUNCTION IF EXISTS public.get_lead_personalization_data(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_lead_personalization_data(lead_uuid uuid)
    RETURNS jsonb
    LANGUAGE sql
    STABLE SECURITY DEFINER
    SET search_path = ''
AS $function$
SELECT public.jsonb_build_object(
    'lead_info', public.jsonb_build_object(
        'first_name', l.first_name,
        'last_name', l.last_name,
        'job_title', l.job_title,
        'company', l.company_id,
        'lead_status', l.lead_status,
        'priority', l.priority,
        'lead_source', l.lead_source,
        'tags', l.tags,
        'estimated_value', l.estimated_value
    ),
    'behavioral_metrics', COALESCE(
        (
            SELECT public.jsonb_agg(behavioral_data ORDER BY (behavioral_data->>'event_timestamp')::timestamptz DESC)
            FROM (
                SELECT public.jsonb_build_object(
                    'event_type', lbm.event_type,
                    'event_value', lbm.event_value,
                    'event_timestamp', lbm.event_timestamp,
                    'source_url', lbm.source_url
                ) as behavioral_data
                FROM public.lead_behavioral_metrics lbm
                WHERE lbm.lead_id = lead_uuid
                ORDER BY lbm.event_timestamp DESC
                LIMIT 10
            ) metrics_ordered
        ),
        '[]'::jsonb
    ),
    'engagement_summary', (
        SELECT public.jsonb_build_object(
            'email_open_rate', les.email_open_rate,
            'email_click_rate', les.email_click_rate,
            'website_visits', les.website_visits,
            'engagement_trend', les.engagement_trend,
            'last_activity_date', les.last_activity_date,
            'campaigns_participated', les.campaigns_participated
        )
        FROM public.lead_engagement_summary les
        WHERE les.lead_id = lead_uuid
    )
)
FROM public.leads l
WHERE l.id = lead_uuid;
$function$;

DROP FUNCTION IF EXISTS public.calculate_personalization_performance(uuid, date, date) CASCADE;
CREATE OR REPLACE FUNCTION public.calculate_personalization_performance(rule_uuid uuid, start_date date, end_date date)
    RETURNS jsonb
    LANGUAGE plpgsql
    STABLE SECURITY DEFINER
    SET search_path = ''
AS $function$
DECLARE
    result JSONB;
    total_messages INTEGER;
    avg_response_rate DECIMAL;
    avg_conversion_rate DECIMAL;
    avg_confidence DECIMAL;
BEGIN
    SELECT 
        COUNT(*),
        AVG(apa.response_rate),
        AVG(apa.conversion_rate),
        AVG(apa.avg_confidence_score)
    INTO 
        total_messages,
        avg_response_rate,
        avg_conversion_rate,
        avg_confidence
    FROM public.ai_personalization_analytics apa
    WHERE apa.rule_id = rule_uuid
    AND apa.date_period BETWEEN start_date AND end_date;

    result := public.jsonb_build_object(
        'total_messages', COALESCE(total_messages, 0),
        'avg_response_rate', COALESCE(avg_response_rate, 0),
        'avg_conversion_rate', COALESCE(avg_conversion_rate, 0),
        'avg_confidence_score', COALESCE(avg_confidence, 0),
        'period', public.jsonb_build_object(
            'start_date', start_date,
            'end_date', end_date
        )
    );

    RETURN result;
END;
$function$;

DROP FUNCTION IF EXISTS public.update_ai_personalization_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_ai_personalization_updated_at()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

-- 3. API Integration related functions
DROP FUNCTION IF EXISTS public.generate_api_key() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_api_key()
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
BEGIN
    RETURN 'sk_' || public.encode(public.gen_random_bytes(32), 'hex');
END;
$function$;

DROP FUNCTION IF EXISTS public.generate_webhook_secret() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_webhook_secret()
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
BEGIN
    RETURN 'whsec_' || public.encode(public.gen_random_bytes(24), 'base64');
END;
$function$;

DROP FUNCTION IF EXISTS public.validate_api_key(text) CASCADE;
CREATE OR REPLACE FUNCTION public.validate_api_key(key text)
    RETURNS TABLE(api_key_id uuid, user_id uuid, is_valid boolean, rate_limit integer, usage_count integer)
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
SELECT 
    ak.id,
    ak.user_id,
    (ak.status = 'active' AND (ak.expires_at IS NULL OR ak.expires_at > CURRENT_TIMESTAMP)) as is_valid,
    ak.rate_limit,
    ak.usage_count
FROM public.api_keys ak
WHERE ak.api_key = key
LIMIT 1;
$function$;

DROP FUNCTION IF EXISTS public.log_webhook_delivery(uuid, webhook_event_type, jsonb, integer, text, integer, integer, text) CASCADE;
CREATE OR REPLACE FUNCTION public.log_webhook_delivery(webhook_uuid uuid, event_type_param public.webhook_event_type, payload_param jsonb, status_code integer DEFAULT NULL::integer, response_body_param text DEFAULT NULL::text, response_time integer DEFAULT NULL::integer, attempt integer DEFAULT 1, error_msg text DEFAULT NULL::text)
    RETURNS uuid
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
DECLARE
    delivery_id UUID := public.gen_random_uuid();
BEGIN
    INSERT INTO public.webhook_deliveries (
        id, webhook_id, event_type, payload, response_status,
        response_body, response_time_ms, attempt_number,
        delivered_at, failed_at, error_message
    ) VALUES (
        delivery_id, webhook_uuid, event_type_param, payload_param, status_code,
        response_body_param, response_time, attempt,
        CASE WHEN status_code BETWEEN 200 AND 299 THEN CURRENT_TIMESTAMP ELSE NULL END,
        CASE WHEN status_code IS NULL OR status_code >= 400 THEN CURRENT_TIMESTAMP ELSE NULL END,
        error_msg
    );
    
    RETURN delivery_id;
END;
$function$;

DROP FUNCTION IF EXISTS public.update_api_integration_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_api_integration_updated_at()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

-- Re-create any triggers that were dropped during function recreation
-- Note: Since we used CASCADE, we need to recreate the triggers

-- Voice-related triggers
DROP TRIGGER IF EXISTS update_voice_messages_updated_at ON public.voice_messages;
CREATE TRIGGER update_voice_messages_updated_at
    BEFORE UPDATE ON public.voice_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_voice_updated_at_column();

DROP TRIGGER IF EXISTS update_voice_campaign_settings_updated_at ON public.voice_campaign_settings;
CREATE TRIGGER update_voice_campaign_settings_updated_at
    BEFORE UPDATE ON public.voice_campaign_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_voice_updated_at_column();

DROP TRIGGER IF EXISTS update_voice_campaign_analytics_updated_at ON public.voice_campaign_analytics;
CREATE TRIGGER update_voice_campaign_analytics_updated_at
    BEFORE UPDATE ON public.voice_campaign_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_voice_updated_at_column();

-- AI Personalization-related triggers
DROP TRIGGER IF EXISTS update_ai_personalization_rules_updated_at ON public.ai_personalization_rules;
CREATE TRIGGER update_ai_personalization_rules_updated_at
    BEFORE UPDATE ON public.ai_personalization_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_ai_personalization_updated_at();

DROP TRIGGER IF EXISTS update_ai_personalization_settings_updated_at ON public.ai_personalization_settings;
CREATE TRIGGER update_ai_personalization_settings_updated_at
    BEFORE UPDATE ON public.ai_personalization_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_ai_personalization_updated_at();

DROP TRIGGER IF EXISTS update_ai_message_personalizations_updated_at ON public.ai_message_personalizations;
CREATE TRIGGER update_ai_message_personalizations_updated_at
    BEFORE UPDATE ON public.ai_message_personalizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_ai_personalization_updated_at();

DROP TRIGGER IF EXISTS update_ai_personalization_analytics_updated_at ON public.ai_personalization_analytics;
CREATE TRIGGER update_ai_personalization_analytics_updated_at
    BEFORE UPDATE ON public.ai_personalization_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_ai_personalization_updated_at();

-- API Integration-related triggers
DROP TRIGGER IF EXISTS update_api_keys_updated_at ON public.api_keys;
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_integration_updated_at();

DROP TRIGGER IF EXISTS update_integrations_updated_at ON public.integrations;
CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON public.integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_integration_updated_at();

DROP TRIGGER IF EXISTS update_webhooks_updated_at ON public.webhooks;
CREATE TRIGGER update_webhooks_updated_at
    BEFORE UPDATE ON public.webhooks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_integration_updated_at();

-- Add comments for documentation
COMMENT ON FUNCTION public.update_voice_updated_at_column() IS 'Trigger function to automatically update updated_at column for voice-related tables with secure search_path';
COMMENT ON FUNCTION public.calculate_voice_analytics(uuid) IS 'Calculate comprehensive voice campaign analytics with secure search_path';
COMMENT ON FUNCTION public.send_voice_campaign(uuid, uuid) IS 'Send voice campaign to leads with secure search_path';
COMMENT ON FUNCTION public.update_voice_call_status(uuid, public.call_status, integer, text, numeric, text) IS 'Update voice call status and metadata with secure search_path';
COMMENT ON FUNCTION public.get_lead_personalization_data(uuid) IS 'Retrieve comprehensive lead personalization data with secure search_path';
COMMENT ON FUNCTION public.calculate_personalization_performance(uuid, date, date) IS 'Calculate AI personalization performance metrics with secure search_path';
COMMENT ON FUNCTION public.update_ai_personalization_updated_at() IS 'Trigger function to automatically update updated_at column for AI personalization tables with secure search_path';
COMMENT ON FUNCTION public.generate_api_key() IS 'Generate secure API key with secure search_path';
COMMENT ON FUNCTION public.generate_webhook_secret() IS 'Generate webhook secret with secure search_path';
COMMENT ON FUNCTION public.validate_api_key(text) IS 'Validate API key and return user information with secure search_path';
COMMENT ON FUNCTION public.log_webhook_delivery(uuid, public.webhook_event_type, jsonb, integer, text, integer, integer, text) IS 'Log webhook delivery attempts with secure search_path';
COMMENT ON FUNCTION public.update_api_integration_updated_at() IS 'Trigger function to automatically update updated_at column for API integration tables with secure search_path';