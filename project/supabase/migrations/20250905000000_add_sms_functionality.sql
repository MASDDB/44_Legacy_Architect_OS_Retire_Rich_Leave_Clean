-- Location: supabase/migrations/20250905000000_add_sms_functionality.sql
-- Schema Analysis: Existing CRM schema with campaigns, leads, user_profiles
-- Integration Type: Addition - SMS functionality extension
-- Dependencies: campaigns, leads, user_profiles (existing)

-- Create SMS messages table to track all SMS communications
CREATE TABLE public.sms_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    sent_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message_content TEXT NOT NULL,
    twilio_message_sid TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create SMS templates table for reusable message templates
CREATE TABLE public.sms_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    category TEXT DEFAULT 'general',
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_sms_messages_campaign_id ON public.sms_messages(campaign_id);
CREATE INDEX idx_sms_messages_lead_id ON public.sms_messages(lead_id);
CREATE INDEX idx_sms_messages_sent_by ON public.sms_messages(sent_by);
CREATE INDEX idx_sms_messages_phone_number ON public.sms_messages(phone_number);
CREATE INDEX idx_sms_messages_status ON public.sms_messages(status);
CREATE INDEX idx_sms_messages_sent_at ON public.sms_messages(sent_at);
CREATE INDEX idx_sms_templates_created_by ON public.sms_templates(created_by);
CREATE INDEX idx_sms_templates_category ON public.sms_templates(category);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_sms_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_sms_messages_updated_at
    BEFORE UPDATE ON public.sms_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_sms_updated_at_column();

CREATE TRIGGER update_sms_templates_updated_at
    BEFORE UPDATE ON public.sms_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_sms_updated_at_column();

-- Enable RLS
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_sms_messages"
ON public.sms_messages
FOR ALL
TO authenticated
USING (sent_by = auth.uid())
WITH CHECK (sent_by = auth.uid());

CREATE POLICY "users_manage_own_sms_templates"
ON public.sms_templates
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Function to send SMS and log it
CREATE OR REPLACE FUNCTION public.send_campaign_sms(
    p_campaign_id UUID,
    p_lead_id UUID,
    p_message TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_phone_number TEXT;
    v_lead_name TEXT;
    v_message_id UUID;
    v_personalized_message TEXT;
BEGIN
    -- Get lead phone number and name
    SELECT phone, CONCAT(first_name, ' ', last_name)
    INTO v_phone_number, v_lead_name
    FROM public.leads
    WHERE id = p_lead_id AND assigned_to = auth.uid();
    
    IF v_phone_number IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Lead not found or no phone number available'
        );
    END IF;
    
    -- Personalize message (replace {{first_name}} with actual name)
    v_personalized_message = REPLACE(p_message, '{{first_name}}', SPLIT_PART(v_lead_name, ' ', 1));
    v_personalized_message = REPLACE(v_personalized_message, '{{last_name}}', SPLIT_PART(v_lead_name, ' ', 2));
    v_personalized_message = REPLACE(v_personalized_message, '{{full_name}}', v_lead_name);
    
    -- Insert SMS record
    INSERT INTO public.sms_messages (
        campaign_id, lead_id, sent_by, phone_number, message_content, status
    ) VALUES (
        p_campaign_id, p_lead_id, auth.uid(), v_phone_number, v_personalized_message, 'pending'
    ) RETURNING id INTO v_message_id;
    
    -- Return success with details for frontend to call Twilio function
    RETURN jsonb_build_object(
        'success', true,
        'message_id', v_message_id,
        'phone_number', v_phone_number,
        'message', v_personalized_message
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- Function to update SMS status after Twilio response
CREATE OR REPLACE FUNCTION public.update_sms_status(
    p_message_id UUID,
    p_twilio_sid TEXT,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.sms_messages
    SET
        twilio_message_sid = p_twilio_sid,
        status = p_status,
        error_message = p_error_message,
        delivered_at = CASE WHEN p_status = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_message_id AND sent_by = auth.uid();
    
    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Insert sample SMS templates
DO $$
DECLARE
    existing_user_id UUID;
BEGIN
    -- Get an existing user for the templates
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    IF existing_user_id IS NOT NULL THEN
        INSERT INTO public.sms_templates (name, content, variables, category, created_by) VALUES
            ('Welcome Message', 'Hi {{first_name}}, welcome to our CRM system! We are excited to work with you.', '["first_name"]'::jsonb, 'welcome', existing_user_id),
            ('Follow Up', 'Hi {{first_name}}, just following up on our previous conversation. Any questions?', '["first_name"]'::jsonb, 'follow_up', existing_user_id),
            ('Appointment Reminder', 'Hi {{first_name}}, this is a reminder about your appointment tomorrow at {{time}}.', '["first_name", "time"]'::jsonb, 'appointment', existing_user_id),
            ('Product Demo', 'Hi {{first_name}}, would you be interested in a quick demo of our product? It only takes 15 minutes.', '["first_name"]'::jsonb, 'demo', existing_user_id),
            ('Thank You', 'Thank you {{first_name}} for your time today. We look forward to working with {{company_name}}.', '["first_name", "company_name"]'::jsonb, 'thank_you', existing_user_id);
    END IF;
END $$;