-- Location: supabase/migrations/20251003154920_voice_campaign_functionality.sql
-- Schema Analysis: Existing campaigns, leads, and user_profiles infrastructure with SMS support
-- Integration Type: PARTIAL_EXISTS - Extending existing campaign system with voice functionality
-- Dependencies: campaigns, leads, user_profiles, campaign_leads tables

-- Step 1: Create voice-specific enum types
CREATE TYPE public.call_status AS ENUM (
  'pending',
  'initiated', 
  'ringing',
  'answered',
  'completed',
  'busy',
  'no_answer',
  'failed',
  'voicemail'
);

-- Step 2: Voice messages table (mirrors sms_messages structure)
CREATE TABLE public.voice_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    sent_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message_content TEXT NOT NULL,
    voice_file_url TEXT,
    call_duration INTEGER DEFAULT 0,
    call_status public.call_status DEFAULT 'pending'::public.call_status,
    answered BOOLEAN DEFAULT false,
    voicemail_detected BOOLEAN DEFAULT false,
    recording_url TEXT,
    cost DECIMAL(10,4),
    twilio_call_sid TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Voice campaign settings (extends campaign functionality)
CREATE TABLE public.voice_campaign_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE UNIQUE,
    voice_engine TEXT DEFAULT 'twilio' CHECK (voice_engine IN ('twilio', 'retell', 'voicerr')),
    voice_settings JSONB DEFAULT '{"voice": "alice", "language": "en-US", "speed": "1.0", "pitch": "0"}'::jsonb,
    retry_settings JSONB DEFAULT '{"maxRetries": 3, "retryDelay": 3600, "retryOnNoAnswer": true, "retryOnBusy": true}'::jsonb,
    compliance_settings JSONB DEFAULT '{"tcpaCompliant": true, "dncCheck": true, "consentRequired": true, "optOutKeywords": ["STOP", "UNSUBSCRIBE"]}'::jsonb,
    call_scheduling JSONB DEFAULT '{"respectTimezones": true, "businessHoursOnly": true, "startTime": "09:00", "endTime": "17:00", "activeDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Voice analytics table
CREATE TABLE public.voice_campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date_tracked DATE DEFAULT CURRENT_DATE,
    total_calls INTEGER DEFAULT 0,
    answered_calls INTEGER DEFAULT 0,
    voicemails INTEGER DEFAULT 0,
    completed_calls INTEGER DEFAULT 0,
    failed_calls INTEGER DEFAULT 0,
    busy_signals INTEGER DEFAULT 0,
    no_answers INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    answer_rate DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    average_call_duration DECIMAL(8,2),
    cost_per_completion DECIMAL(10,4),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Indexes for performance
CREATE INDEX idx_voice_messages_campaign_id ON public.voice_messages(campaign_id);
CREATE INDEX idx_voice_messages_lead_id ON public.voice_messages(lead_id);
CREATE INDEX idx_voice_messages_sent_by ON public.voice_messages(sent_by);
CREATE INDEX idx_voice_messages_call_status ON public.voice_messages(call_status);
CREATE INDEX idx_voice_messages_sent_at ON public.voice_messages(sent_at);
CREATE INDEX idx_voice_messages_phone_number ON public.voice_messages(phone_number);

CREATE INDEX idx_voice_campaign_settings_campaign_id ON public.voice_campaign_settings(campaign_id);
CREATE INDEX idx_voice_campaign_analytics_campaign_id ON public.voice_campaign_analytics(campaign_id);
CREATE INDEX idx_voice_campaign_analytics_date_tracked ON public.voice_campaign_analytics(date_tracked);

-- Step 6: Functions (must be created before RLS policies)
CREATE OR REPLACE FUNCTION public.update_voice_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_voice_analytics(campaign_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    analytics_result = jsonb_build_object(
        'totalCalls', total_calls_count,
        'answeredCalls', answered_calls_count,
        'completedCalls', completed_calls_count,
        'answerRate', CASE 
            WHEN total_calls_count > 0 THEN ROUND((answered_calls_count::DECIMAL / total_calls_count) * 100, 2)
            ELSE 0 
        END,
        'completionRate', CASE 
            WHEN total_calls_count > 0 THEN ROUND((completed_calls_count::DECIMAL / total_calls_count) * 100, 2)
            ELSE 0 
        END,
        'totalDuration', total_duration_sum,
        'totalCost', total_cost_sum,
        'averageDuration', CASE 
            WHEN completed_calls_count > 0 THEN ROUND(total_duration_sum::DECIMAL / completed_calls_count, 2)
            ELSE 0 
        END,
        'costPerCompletion', CASE 
            WHEN completed_calls_count > 0 THEN ROUND(total_cost_sum / completed_calls_count, 4)
            ELSE 0 
        END
    );

    RETURN analytics_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN '{"error": "Failed to calculate analytics"}'::jsonb;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_voice_campaign(campaign_uuid UUID, lead_uuid UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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

    result = jsonb_build_object(
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
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'callsSent', calls_sent,
            'callsFailed', calls_failed + 1
        );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_voice_call_status(
    voice_message_uuid UUID,
    new_status public.call_status,
    call_duration_seconds INTEGER DEFAULT NULL,
    recording_url_param TEXT DEFAULT NULL,
    cost_param DECIMAL(10,4) DEFAULT NULL,
    error_message_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Step 7: Enable RLS
ALTER TABLE public.voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_campaign_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Step 8: RLS Policies (using Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_voice_messages"
ON public.voice_messages
FOR ALL
TO authenticated
USING (sent_by = auth.uid())
WITH CHECK (sent_by = auth.uid());

-- Voice campaign settings accessible through campaigns relationship
CREATE POLICY "users_manage_voice_campaign_settings"
ON public.voice_campaign_settings
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.campaigns c 
        WHERE c.id = campaign_id AND c.created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.campaigns c 
        WHERE c.id = campaign_id AND c.created_by = auth.uid()
    )
);

-- Voice analytics accessible through campaigns relationship
CREATE POLICY "users_view_voice_campaign_analytics"
ON public.voice_campaign_analytics
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.campaigns c 
        WHERE c.id = campaign_id AND c.created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.campaigns c 
        WHERE c.id = campaign_id AND c.created_by = auth.uid()
    )
);

-- Step 9: Triggers
CREATE TRIGGER update_voice_messages_updated_at
    BEFORE UPDATE ON public.voice_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_voice_updated_at_column();

CREATE TRIGGER update_voice_campaign_settings_updated_at
    BEFORE UPDATE ON public.voice_campaign_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_voice_updated_at_column();

CREATE TRIGGER update_voice_campaign_analytics_updated_at
    BEFORE UPDATE ON public.voice_campaign_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_voice_updated_at_column();

-- Step 10: Mock data for voice campaigns (references existing campaigns)
DO $$
DECLARE
    existing_campaign_id UUID;
    existing_user_id UUID;
    existing_lead_id UUID;
    voice_settings_id UUID := gen_random_uuid();
    voice_message_id UUID := gen_random_uuid();
    analytics_id UUID := gen_random_uuid();
BEGIN
    -- Get existing campaign with 'phone' type or create voice campaign reference
    SELECT id INTO existing_campaign_id 
    FROM public.campaigns 
    WHERE campaign_type = 'phone' 
    LIMIT 1;

    -- If no phone campaign exists, use the first available campaign
    IF existing_campaign_id IS NULL THEN
        SELECT id INTO existing_campaign_id 
        FROM public.campaigns 
        LIMIT 1;
    END IF;

    SELECT created_by INTO existing_user_id 
    FROM public.campaigns 
    WHERE id = existing_campaign_id;

    SELECT id INTO existing_lead_id 
    FROM public.leads 
    WHERE phone IS NOT NULL 
    LIMIT 1;

    -- Only create mock data if we have the necessary existing records
    IF existing_campaign_id IS NOT NULL AND existing_user_id IS NOT NULL AND existing_lead_id IS NOT NULL THEN
        -- Create voice campaign settings
        INSERT INTO public.voice_campaign_settings (
            id, campaign_id, voice_engine, voice_settings, retry_settings,
            compliance_settings, call_scheduling
        ) VALUES (
            voice_settings_id,
            existing_campaign_id,
            'twilio',
            '{"voice": "alice", "language": "en-US", "speed": "1.0", "pitch": "0"}'::jsonb,
            '{"maxRetries": 3, "retryDelay": 3600, "retryOnNoAnswer": true, "retryOnBusy": true}'::jsonb,
            '{"tcpaCompliant": true, "dncCheck": true, "consentRequired": true, "optOutKeywords": ["STOP", "UNSUBSCRIBE"]}'::jsonb,
            '{"respectTimezones": true, "businessHoursOnly": true, "startTime": "09:00", "endTime": "17:00", "activeDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}'::jsonb
        );

        -- Create sample voice message
        INSERT INTO public.voice_messages (
            id, campaign_id, lead_id, sent_by, phone_number, message_content,
            call_duration, call_status, answered, cost, twilio_call_sid,
            sent_at, answered_at, completed_at
        ) VALUES (
            voice_message_id,
            existing_campaign_id,
            existing_lead_id,
            existing_user_id,
            '+1234567890',
            'Hello! This is a sample voice campaign message for database reactivation.',
            45,
            'completed'::public.call_status,
            true,
            0.15,
            'CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            CURRENT_TIMESTAMP - INTERVAL '1 day',
            CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '5 seconds',
            CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '50 seconds'
        );

        -- Create sample analytics
        INSERT INTO public.voice_campaign_analytics (
            id, campaign_id, date_tracked, total_calls, answered_calls,
            completed_calls, total_duration, total_cost, answer_rate, completion_rate,
            average_call_duration, cost_per_completion
        ) VALUES (
            analytics_id,
            existing_campaign_id,
            CURRENT_DATE,
            10,
            7,
            6,
            420,
            1.50,
            70.00,
            60.00,
            70.00,
            0.25
        );

        RAISE NOTICE 'Voice campaign mock data created successfully';
    ELSE
        RAISE NOTICE 'Insufficient existing data to create voice campaign mock data. Please ensure campaigns and leads with phone numbers exist.';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating voice campaign mock data: %', SQLERRM;
END $$;