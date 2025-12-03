-- Location: supabase/migrations/20251003163207_ai_message_personalization.sql
-- Schema Analysis: Existing schema has comprehensive messaging system (campaigns, sms_messages, voice_messages, email_templates)
-- Integration Type: Extension - adding AI personalization to existing messaging infrastructure
-- Dependencies: campaigns, leads, user_profiles, sms_messages, voice_messages, email_templates, lead_behavioral_metrics

-- 1. Types for AI personalization system
CREATE TYPE public.personalization_type AS ENUM ('behavioral', 'demographic', 'engagement', 'timing', 'content_preference', 'lead_score');
CREATE TYPE public.ai_model_type AS ENUM ('gpt-5', 'gpt-5-mini', 'gpt-4o', 'claude-3.5', 'custom');
CREATE TYPE public.personalization_status AS ENUM ('active', 'inactive', 'testing', 'deprecated');

-- 2. AI Personalization Rules table
CREATE TABLE public.ai_personalization_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    personalization_type public.personalization_type NOT NULL,
    ai_model public.ai_model_type DEFAULT 'gpt-5'::public.ai_model_type,
    conditions JSONB NOT NULL DEFAULT '{}',
    template_variables JSONB NOT NULL DEFAULT '{}',
    prompt_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. AI Message Personalization History
CREATE TABLE public.ai_message_personalizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL, -- 'sms', 'voice', 'email'
    original_template TEXT NOT NULL,
    personalized_content TEXT NOT NULL,
    personalization_rules_used JSONB NOT NULL DEFAULT '[]',
    ai_model_used public.ai_model_type NOT NULL,
    processing_time_ms INTEGER,
    lead_data_used JSONB NOT NULL DEFAULT '{}',
    behavioral_data_used JSONB NOT NULL DEFAULT '{}',
    confidence_score DECIMAL(3,2),
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. AI Personalization Analytics
CREATE TABLE public.ai_personalization_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.ai_personalization_rules(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date_period DATE NOT NULL,
    messages_personalized INTEGER DEFAULT 0,
    avg_processing_time_ms INTEGER DEFAULT 0,
    avg_confidence_score DECIMAL(3,2),
    response_rate DECIMAL(5,4),
    conversion_rate DECIMAL(5,4),
    cost_per_message DECIMAL(10,4),
    performance_score DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Personalization Settings (per user/organization)
CREATE TABLE public.ai_personalization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    default_ai_model public.ai_model_type DEFAULT 'gpt-5'::public.ai_model_type,
    enable_behavioral_personalization BOOLEAN DEFAULT true,
    enable_demographic_personalization BOOLEAN DEFAULT true,
    enable_engagement_personalization BOOLEAN DEFAULT true,
    enable_timing_optimization BOOLEAN DEFAULT true,
    max_processing_time_ms INTEGER DEFAULT 5000,
    fallback_to_original BOOLEAN DEFAULT true,
    api_settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential Indexes for performance
CREATE INDEX idx_ai_personalization_rules_type ON public.ai_personalization_rules(personalization_type);
CREATE INDEX idx_ai_personalization_rules_active ON public.ai_personalization_rules(is_active);
CREATE INDEX idx_ai_personalization_rules_priority ON public.ai_personalization_rules(priority DESC);
CREATE INDEX idx_ai_message_personalizations_lead_id ON public.ai_message_personalizations(lead_id);
CREATE INDEX idx_ai_message_personalizations_campaign_id ON public.ai_message_personalizations(campaign_id);
CREATE INDEX idx_ai_message_personalizations_message_type ON public.ai_message_personalizations(message_type);
CREATE INDEX idx_ai_message_personalizations_created_at ON public.ai_message_personalizations(created_at DESC);
CREATE INDEX idx_ai_personalization_analytics_rule_id ON public.ai_personalization_analytics(rule_id);
CREATE INDEX idx_ai_personalization_analytics_date_period ON public.ai_personalization_analytics(date_period DESC);
CREATE INDEX idx_ai_personalization_settings_user_id ON public.ai_personalization_settings(user_id);

-- 7. Functions for AI message personalization (FIXED GROUP BY ISSUE)
CREATE OR REPLACE FUNCTION public.get_lead_personalization_data(lead_uuid UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT jsonb_build_object(
    'lead_info', jsonb_build_object(
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
            SELECT jsonb_agg(behavioral_data ORDER BY (behavioral_data->>'event_timestamp')::timestamptz DESC)
            FROM (
                SELECT jsonb_build_object(
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
        SELECT jsonb_build_object(
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
$$;

CREATE OR REPLACE FUNCTION public.calculate_personalization_performance(rule_uuid UUID, start_date DATE, end_date DATE)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
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

    result := jsonb_build_object(
        'total_messages', COALESCE(total_messages, 0),
        'avg_response_rate', COALESCE(avg_response_rate, 0),
        'avg_conversion_rate', COALESCE(avg_conversion_rate, 0),
        'avg_confidence_score', COALESCE(avg_confidence, 0),
        'period', jsonb_build_object(
            'start_date', start_date,
            'end_date', end_date
        )
    );

    RETURN result;
END;
$$;

-- 8. Enable RLS on all new tables
ALTER TABLE public.ai_personalization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_message_personalizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_personalization_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_personalization_settings ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_ai_personalization_rules"
ON public.ai_personalization_rules
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_own_ai_message_personalizations"
ON public.ai_message_personalizations
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_view_own_ai_personalization_analytics"
ON public.ai_personalization_analytics
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.ai_personalization_rules apr
        WHERE apr.id = rule_id AND apr.created_by = auth.uid()
    )
);

CREATE POLICY "users_manage_own_ai_personalization_settings"
ON public.ai_personalization_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 10. Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_ai_personalization_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_ai_personalization_rules_updated_at
    BEFORE UPDATE ON public.ai_personalization_rules
    FOR EACH ROW EXECUTE FUNCTION public.update_ai_personalization_updated_at();

CREATE TRIGGER update_ai_personalization_analytics_updated_at
    BEFORE UPDATE ON public.ai_personalization_analytics
    FOR EACH ROW EXECUTE FUNCTION public.update_ai_personalization_updated_at();

CREATE TRIGGER update_ai_personalization_settings_updated_at
    BEFORE UPDATE ON public.ai_personalization_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_ai_personalization_updated_at();

-- 11. Mock data for AI personalization system
DO $$
DECLARE
    existing_user_id UUID;
    existing_campaign_id UUID;
    existing_lead_id UUID;
    rule1_id UUID := gen_random_uuid();
    rule2_id UUID := gen_random_uuid();
    rule3_id UUID := gen_random_uuid();
BEGIN
    -- Get existing user, campaign, and lead IDs
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    SELECT id INTO existing_campaign_id FROM public.campaigns LIMIT 1;
    SELECT id INTO existing_lead_id FROM public.leads LIMIT 1;

    IF existing_user_id IS NOT NULL THEN
        -- AI Personalization Rules
        INSERT INTO public.ai_personalization_rules (id, name, description, personalization_type, ai_model, conditions, template_variables, prompt_template, created_by) VALUES
            (rule1_id, 'High Engagement Personalization', 'Personalizes messages for leads with high email engagement', 'engagement'::public.personalization_type, 'gpt-5'::public.ai_model_type, 
             '{"min_email_open_rate": 0.5, "min_website_visits": 3}',
             '{"tone": "enthusiastic", "urgency": "medium"}',
             'Generate a personalized message for {{first_name}} who works as {{job_title}}. Their engagement shows {{engagement_trend}} with {{email_open_rate}} email open rate. Use an {{tone}} tone with {{urgency}} urgency.',
             existing_user_id),
            (rule2_id, 'Industry-Specific Messaging', 'Tailors messages based on company industry and job role', 'demographic'::public.personalization_type, 'gpt-5-mini'::public.ai_model_type,
             '{"job_titles": ["CTO", "VP Engineering", "Tech Lead"]}',
             '{"focus": "technical_benefits", "language": "professional"}',
             'Create a technical message for {{first_name}}, {{job_title}}. Focus on {{focus}} using {{language}} language. Mention relevant technical solutions.',
             existing_user_id),
            (rule3_id, 'Behavioral Sequence Optimization', 'Optimizes message timing and content based on lead behavior patterns', 'behavioral'::public.personalization_type, 'gpt-5'::public.ai_model_type,
             '{"recent_activity_days": 7, "min_page_views": 2}',
             '{"reference_activity": true, "personalization_level": "high"}',
             'Craft a message referencing {{first_name}}s recent activity: {{recent_activities}}. Use {{personalization_level}} personalization level.',
             existing_user_id);

        -- AI Personalization Settings
        INSERT INTO public.ai_personalization_settings (user_id, default_ai_model, enable_behavioral_personalization, enable_demographic_personalization, enable_engagement_personalization, enable_timing_optimization, api_settings) VALUES
            (existing_user_id, 'gpt-5'::public.ai_model_type, true, true, true, true, 
             '{"openai_api_key": "VITE_OPENAI_API_KEY", "max_tokens": 500, "temperature": 0.7, "reasoning_effort": "medium", "verbosity": "medium"}');

        -- Sample personalization history (if we have existing campaign and lead)
        IF existing_campaign_id IS NOT NULL AND existing_lead_id IS NOT NULL THEN
            INSERT INTO public.ai_message_personalizations (lead_id, campaign_id, message_type, original_template, personalized_content, personalization_rules_used, ai_model_used, processing_time_ms, lead_data_used, behavioral_data_used, confidence_score, created_by) VALUES
                (existing_lead_id, existing_campaign_id, 'sms', 'Hi {{first_name}}, check out our solution for your business needs.', 
                 'Hi John, as a CTO at TechSolutions, I noticed your recent interest in automation tools. Our enterprise solution could streamline your development workflow significantly.',
                 ('[{"rule_id": "' || rule1_id || '", "rule_name": "High Engagement Personalization"}]')::jsonb,
                 'gpt-5'::public.ai_model_type, 1250, 
                 '{"first_name": "John", "job_title": "CTO", "company": "TechSolutions", "engagement_trend": "increasing"}',
                 '{"recent_page_views": 5, "last_activity": "2025-10-02"}',
                 0.92, existing_user_id),
                (existing_lead_id, existing_campaign_id, 'email', 'Dear {{first_name}}, we have a special offer for you.',
                 'Dear John, based on your role as CTO and your recent exploration of our technical documentation, I wanted to share how our API-first approach has helped similar enterprise teams reduce deployment time by 40%.',
                 ('[{"rule_id": "' || rule2_id || '", "rule_name": "Industry-Specific Messaging"}]')::jsonb,
                 'gpt-5-mini'::public.ai_model_type, 980,
                 '{"first_name": "John", "job_title": "CTO", "industry": "technology"}',
                 '{"documentation_views": 3, "api_section_time": 120}',
                 0.88, existing_user_id);

            -- Sample analytics data
            INSERT INTO public.ai_personalization_analytics (rule_id, campaign_id, date_period, messages_personalized, avg_processing_time_ms, avg_confidence_score, response_rate, conversion_rate, cost_per_message, performance_score) VALUES
                (rule1_id, existing_campaign_id, CURRENT_DATE - 1, 25, 1200, 0.91, 0.34, 0.12, 0.08, 0.89),
                (rule2_id, existing_campaign_id, CURRENT_DATE - 1, 18, 950, 0.87, 0.28, 0.09, 0.06, 0.82),
                (rule3_id, existing_campaign_id, CURRENT_DATE - 1, 12, 1450, 0.93, 0.41, 0.18, 0.10, 0.94);
        END IF;
    END IF;
END $$;