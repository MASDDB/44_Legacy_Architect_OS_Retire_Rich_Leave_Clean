-- Location: supabase/migrations/20250905010000_add_email_notifications.sql
-- Schema Analysis: CRM system with campaigns, leads, appointments, user_profiles (all existing)
-- Integration Type: Addition - Adding email notification system
-- Dependencies: user_profiles, campaigns, leads, appointments (existing tables)

-- 1. Create email notification types
CREATE TYPE public.email_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'bounced');
CREATE TYPE public.email_notification_type AS ENUM (
    'appointment_confirmation',
    'appointment_reminder',
    'lead_welcome',
    'campaign_email',
    'follow_up_reminder',
    'password_reset',
    'account_verification'
);

-- 2. Email templates table
CREATE TABLE public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    text_body TEXT,
    template_type public.email_notification_type NOT NULL,
    variables JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Email notifications table
CREATE TABLE public.email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    text_body TEXT,
    email_status public.email_status DEFAULT 'pending',
    notification_type public.email_notification_type NOT NULL,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    related_entity_id UUID,
    related_entity_type TEXT,
    sent_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    resend_message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Email notification preferences
CREATE TABLE public.email_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    notification_type public.email_notification_type NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_type)
);

-- 5. Create indexes
CREATE INDEX idx_email_templates_type ON public.email_templates(template_type);
CREATE INDEX idx_email_templates_active ON public.email_templates(is_active);
CREATE INDEX idx_email_notifications_status ON public.email_notifications(email_status);
CREATE INDEX idx_email_notifications_type ON public.email_notifications(notification_type);
CREATE INDEX idx_email_notifications_sent_at ON public.email_notifications(sent_at);
CREATE INDEX idx_email_notifications_entity ON public.email_notifications(related_entity_id, related_entity_type);
CREATE INDEX idx_email_preferences_user ON public.email_preferences(user_id);

-- 6. Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_email_templates"
ON public.email_templates
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_own_email_notifications"
ON public.email_notifications
FOR ALL
TO authenticated
USING (sent_by = auth.uid())
WITH CHECK (sent_by = auth.uid());

CREATE POLICY "users_manage_own_email_preferences"
ON public.email_preferences
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. Functions
CREATE OR REPLACE FUNCTION public.update_email_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_email_notification(
    recipient_email_param TEXT,
    recipient_name_param TEXT,
    subject_param TEXT,
    html_body_param TEXT,
    text_body_param TEXT DEFAULT NULL,
    notification_type_param public.email_notification_type DEFAULT 'campaign_email',
    template_id_param UUID DEFAULT NULL,
    related_entity_id_param UUID DEFAULT NULL,
    related_entity_type_param TEXT DEFAULT NULL,
    metadata_param JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.email_notifications (
        recipient_email,
        recipient_name,
        subject,
        html_body,
        text_body,
        notification_type,
        template_id,
        related_entity_id,
        related_entity_type,
        sent_by,
        metadata
    ) VALUES (
        recipient_email_param,
        recipient_name_param,
        subject_param,
        html_body_param,
        text_body_param,
        notification_type_param,
        template_id_param,
        related_entity_id_param,
        related_entity_type_param,
        auth.uid(),
        metadata_param
    ) RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$$;

-- 9. Triggers
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_email_updated_at_column();

CREATE TRIGGER update_email_notifications_updated_at
    BEFORE UPDATE ON public.email_notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_email_updated_at_column();

CREATE TRIGGER update_email_preferences_updated_at
    BEFORE UPDATE ON public.email_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_email_updated_at_column();

-- 10. Mock data
DO $$
DECLARE
    existing_user_id UUID;
    template_id UUID;
    welcome_template_id UUID;
BEGIN
    -- Get existing user ID
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    IF existing_user_id IS NOT NULL THEN
        -- Create default email templates
        INSERT INTO public.email_templates (id, name, subject, html_body, text_body, template_type, created_by)
        VALUES 
            (gen_random_uuid(), 'Appointment Confirmation', 'Your Appointment is Confirmed', 
             '<h1>Appointment Confirmed</h1><p>Dear {{name}},</p><p>Your appointment on {{date}} has been confirmed.</p><p>Best regards,<br>The Team</p>',
             'Appointment Confirmed\n\nDear {{name}},\n\nYour appointment on {{date}} has been confirmed.\n\nBest regards,\nThe Team',
             'appointment_confirmation', existing_user_id),
            (gen_random_uuid(), 'Lead Welcome Email', 'Welcome to our CRM System', 
             '<h1>Welcome!</h1><p>Dear {{name}},</p><p>Thank you for your interest in our services.</p><p>Best regards,<br>The Team</p>',
             'Welcome!\n\nDear {{name}},\n\nThank you for your interest in our services.\n\nBest regards,\nThe Team',
             'lead_welcome', existing_user_id)
        RETURNING id INTO template_id;

        -- Create default email preferences for existing user
        INSERT INTO public.email_preferences (user_id, notification_type, is_enabled)
        VALUES 
            (existing_user_id, 'appointment_confirmation', true),
            (existing_user_id, 'appointment_reminder', true),
            (existing_user_id, 'lead_welcome', true),
            (existing_user_id, 'campaign_email', true),
            (existing_user_id, 'follow_up_reminder', true);

        -- Create sample email notification
        INSERT INTO public.email_notifications (
            recipient_email,
            recipient_name,
            subject,
            html_body,
            text_body,
            notification_type,
            template_id,
            sent_by,
            email_status,
            metadata
        ) VALUES (
            'demo@example.com',
            'Demo User',
            'Welcome to our CRM System',
            '<h1>Welcome!</h1><p>This is a sample email notification.</p>',
            'Welcome!\n\nThis is a sample email notification.',
            'lead_welcome',
            template_id,
            existing_user_id,
            'sent',
            '{"demo": true, "source": "migration"}'::jsonb
        );
    ELSE
        RAISE NOTICE 'No existing users found. Email templates and preferences will be created when users are available.';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating email mock data: %', SQLERRM;
END $$;