-- Location: supabase/migrations/20250906202507_advanced_lead_scoring_system.sql
-- Schema Analysis: Enhancing existing CRM system with leads, lead_activities, campaigns, campaign_leads
-- Integration Type: enhancement - adding advanced lead scoring on top of existing structure
-- Dependencies: leads, lead_activities, campaigns, campaign_leads, user_profiles tables

-- 1. Types for Advanced Lead Scoring
CREATE TYPE public.lead_score_category AS ENUM ('hot', 'warm', 'cold', 'unknown');
CREATE TYPE public.behavioral_event_type AS ENUM (
    'email_open', 'email_click', 'website_visit', 'form_submit', 'download', 
    'video_watch', 'demo_request', 'pricing_view', 'contact_attempt', 
    'social_engagement', 'referral_generated', 'meeting_scheduled'
);
CREATE TYPE public.scoring_model_type AS ENUM ('rule_based', 'ai_powered', 'hybrid', 'predictive');

-- 2. Lead Behavioral Metrics (references existing leads table)
CREATE TABLE public.lead_behavioral_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    event_type public.behavioral_event_type NOT NULL,
    event_value NUMERIC DEFAULT 1,
    event_metadata JSONB DEFAULT '{}',
    event_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. AI Lead Scoring Models
CREATE TABLE public.lead_scoring_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    model_type public.scoring_model_type DEFAULT 'rule_based'::public.scoring_model_type,
    version TEXT DEFAULT '1.0',
    is_active BOOLEAN DEFAULT false,
    model_config JSONB DEFAULT '{}',
    training_data_summary JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Lead Scores (comprehensive scoring system)
CREATE TABLE public.lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    scoring_model_id UUID REFERENCES public.lead_scoring_models(id) ON DELETE SET NULL,
    overall_score NUMERIC(5,2) DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    category public.lead_score_category DEFAULT 'unknown'::public.lead_score_category,
    
    -- Individual score components
    demographic_score NUMERIC(5,2) DEFAULT 0,
    behavioral_score NUMERIC(5,2) DEFAULT 0,
    engagement_score NUMERIC(5,2) DEFAULT 0,
    fit_score NUMERIC(5,2) DEFAULT 0,
    intent_score NUMERIC(5,2) DEFAULT 0,
    
    -- Score factors and reasoning
    score_factors JSONB DEFAULT '{}',
    score_reasoning TEXT,
    confidence_level NUMERIC(3,2) DEFAULT 0.5 CHECK (confidence_level >= 0 AND confidence_level <= 1),
    
    -- Predictive elements
    conversion_probability NUMERIC(3,2) DEFAULT 0.5,
    predicted_close_date DATE,
    predicted_value NUMERIC(10,2),
    
    -- Timestamps for tracking
    calculated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lead Engagement History (aggregated from various sources)
CREATE TABLE public.lead_engagement_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Email engagement metrics
    emails_sent INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    email_open_rate NUMERIC(3,2) DEFAULT 0,
    email_click_rate NUMERIC(3,2) DEFAULT 0,
    last_email_engagement TIMESTAMPTZ,
    
    -- Campaign engagement metrics
    campaigns_participated INTEGER DEFAULT 0,
    campaign_responses INTEGER DEFAULT 0,
    campaign_response_rate NUMERIC(3,2) DEFAULT 0,
    last_campaign_response TIMESTAMPTZ,
    
    -- Website/Digital engagement
    website_visits INTEGER DEFAULT 0,
    pages_viewed INTEGER DEFAULT 0,
    time_on_site INTEGER DEFAULT 0, -- in seconds
    downloads INTEGER DEFAULT 0,
    form_submissions INTEGER DEFAULT 0,
    last_website_visit TIMESTAMPTZ,
    
    -- Communication engagement
    calls_made INTEGER DEFAULT 0,
    calls_answered INTEGER DEFAULT 0,
    meetings_scheduled INTEGER DEFAULT 0,
    meetings_completed INTEGER DEFAULT 0,
    last_direct_contact TIMESTAMPTZ,
    
    -- Overall engagement scoring
    engagement_trend TEXT DEFAULT 'stable',
    engagement_velocity NUMERIC(5,2) DEFAULT 0,
    last_activity_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Lead Score History (track score changes over time)
CREATE TABLE public.lead_score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    lead_score_id UUID REFERENCES public.lead_scores(id) ON DELETE CASCADE,
    previous_score NUMERIC(5,2),
    new_score NUMERIC(5,2),
    previous_category public.lead_score_category,
    new_category public.lead_score_category,
    change_reason TEXT,
    change_factors JSONB DEFAULT '{}',
    changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential Indexes for Performance
CREATE INDEX idx_lead_behavioral_metrics_lead_id ON public.lead_behavioral_metrics(lead_id);
CREATE INDEX idx_lead_behavioral_metrics_event_type ON public.lead_behavioral_metrics(event_type);
CREATE INDEX idx_lead_behavioral_metrics_timestamp ON public.lead_behavioral_metrics(event_timestamp);

CREATE INDEX idx_lead_scores_lead_id ON public.lead_scores(lead_id);
CREATE INDEX idx_lead_scores_category ON public.lead_scores(category);
CREATE INDEX idx_lead_scores_overall_score ON public.lead_scores(overall_score);
CREATE INDEX idx_lead_scores_expires_at ON public.lead_scores(expires_at);

CREATE INDEX idx_lead_engagement_summary_lead_id ON public.lead_engagement_summary(lead_id);
CREATE INDEX idx_lead_engagement_summary_last_activity ON public.lead_engagement_summary(last_activity_date);

CREATE INDEX idx_lead_score_history_lead_id ON public.lead_score_history(lead_id);
CREATE INDEX idx_lead_score_history_created_at ON public.lead_score_history(created_at);

-- 8. Functions for AI-Powered Lead Scoring (Before RLS Policies)
CREATE OR REPLACE FUNCTION public.calculate_behavioral_score(lead_uuid UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    behavior_score NUMERIC := 0;
    event_count INTEGER;
    high_value_events INTEGER;
    recent_activity_count INTEGER;
BEGIN
    -- Count total behavioral events
    SELECT COUNT(*) INTO event_count
    FROM public.lead_behavioral_metrics lbm
    WHERE lbm.lead_id = lead_uuid;
    
    -- Count high-value events (demo_request, pricing_view, meeting_scheduled)
    SELECT COUNT(*) INTO high_value_events
    FROM public.lead_behavioral_metrics lbm
    WHERE lbm.lead_id = lead_uuid
    AND lbm.event_type IN ('demo_request', 'pricing_view', 'meeting_scheduled', 'form_submit');
    
    -- Count recent activity (last 30 days)
    SELECT COUNT(*) INTO recent_activity_count
    FROM public.lead_behavioral_metrics lbm
    WHERE lbm.lead_id = lead_uuid
    AND lbm.event_timestamp > (CURRENT_TIMESTAMP - INTERVAL '30 days');
    
    -- Calculate behavioral score (0-40 points max)
    behavior_score := LEAST(40, 
        (event_count * 1.0) + 
        (high_value_events * 5.0) + 
        (recent_activity_count * 2.0)
    );
    
    RETURN COALESCE(behavior_score, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_engagement_score(lead_uuid UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    engagement_score NUMERIC := 0;
    summary_record RECORD;
BEGIN
    -- Get engagement summary
    SELECT * INTO summary_record
    FROM public.lead_engagement_summary les
    WHERE les.lead_id = lead_uuid;
    
    IF summary_record IS NOT NULL THEN
        -- Calculate engagement score (0-30 points max)
        engagement_score := LEAST(30,
            (COALESCE(summary_record.email_open_rate, 0) * 10) +
            (COALESCE(summary_record.email_click_rate, 0) * 15) +
            (COALESCE(summary_record.campaign_response_rate, 0) * 20) +
            (CASE WHEN summary_record.meetings_completed > 0 THEN 10 ELSE 0 END) +
            (CASE WHEN summary_record.last_activity_date > (CURRENT_TIMESTAMP - INTERVAL '7 days') THEN 5 ELSE 0 END)
        );
    END IF;
    
    RETURN COALESCE(engagement_score, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_fit_score(lead_uuid UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    fit_score NUMERIC := 0;
    lead_record RECORD;
    company_record RECORD;
BEGIN
    -- Get lead and company information
    SELECT l.*, c.name as company_name, c.industry, c.company_size, c.annual_revenue
    INTO lead_record
    FROM public.leads l
    LEFT JOIN public.companies c ON l.company_id = c.id
    WHERE l.id = lead_uuid;
    
    IF lead_record IS NOT NULL THEN
        -- Calculate fit score based on company profile (0-30 points max)
        fit_score := 0;
        
        -- Industry fit (0-10 points)
        IF lead_record.industry IS NOT NULL THEN
            fit_score := fit_score + 10;
        END IF;
        
        -- Company size fit (0-10 points)
        IF lead_record.company_size IS NOT NULL AND lead_record.company_size > 50 THEN
            fit_score := fit_score + 10;
        END IF;
        
        -- Revenue fit (0-10 points)
        IF lead_record.annual_revenue IS NOT NULL AND lead_record.annual_revenue > 1000000 THEN
            fit_score := fit_score + 10;
        END IF;
        
        -- Job title relevance (additional points from lead priority)
        IF lead_record.priority = 'high'::public.lead_priority THEN
            fit_score := fit_score + 5;
        ELSIF lead_record.priority = 'medium'::public.lead_priority THEN
            fit_score := fit_score + 2;
        END IF;
    END IF;
    
    RETURN COALESCE(fit_score, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_overall_lead_score(lead_uuid UUID, scoring_model_uuid UUID DEFAULT NULL)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    total_score NUMERIC := 0;
    behavioral_score NUMERIC;
    engagement_score NUMERIC;
    fit_score NUMERIC;
    demographic_score NUMERIC := 0;
    intent_score NUMERIC := 0;
BEGIN
    -- Calculate component scores
    behavioral_score := public.calculate_behavioral_score(lead_uuid);
    engagement_score := public.calculate_engagement_score(lead_uuid);
    fit_score := public.calculate_fit_score(lead_uuid);
    
    -- Basic demographic score (placeholder for future enhancement)
    demographic_score := 10;
    
    -- Basic intent score (placeholder for AI implementation)
    intent_score := 10;
    
    -- Calculate total score (max 100 points)
    total_score := behavioral_score + engagement_score + fit_score + demographic_score + intent_score;
    
    RETURN LEAST(100, COALESCE(total_score, 0));
END;
$$;

CREATE OR REPLACE FUNCTION public.get_lead_score_category(score NUMERIC)
RETURNS public.lead_score_category
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    IF score >= 80 THEN
        RETURN 'hot'::public.lead_score_category;
    ELSIF score >= 60 THEN
        RETURN 'warm'::public.lead_score_category;
    ELSIF score >= 30 THEN
        RETURN 'cold'::public.lead_score_category;
    ELSE
        RETURN 'unknown'::public.lead_score_category;
    END IF;
END;
$$;

-- 9. Triggers for automatic score updates
CREATE OR REPLACE FUNCTION public.update_lead_score_on_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_score NUMERIC;
    new_category public.lead_score_category;
    existing_score_id UUID;
BEGIN
    -- Calculate new score
    current_score := public.calculate_overall_lead_score(NEW.lead_id);
    new_category := public.get_lead_score_category(current_score);
    
    -- Check if there's an existing active score
    SELECT id INTO existing_score_id
    FROM public.lead_scores ls
    WHERE ls.lead_id = NEW.lead_id
    AND ls.expires_at > CURRENT_TIMESTAMP
    ORDER BY ls.created_at DESC
    LIMIT 1;
    
    IF existing_score_id IS NOT NULL THEN
        -- Update existing score
        UPDATE public.lead_scores
        SET 
            overall_score = current_score,
            category = new_category,
            behavioral_score = public.calculate_behavioral_score(NEW.lead_id),
            engagement_score = public.calculate_engagement_score(NEW.lead_id),
            fit_score = public.calculate_fit_score(NEW.lead_id),
            calculated_at = CURRENT_TIMESTAMP,
            expires_at = CURRENT_TIMESTAMP + INTERVAL '24 hours'
        WHERE id = existing_score_id;
    ELSE
        -- Create new score record
        INSERT INTO public.lead_scores (
            lead_id, overall_score, category,
            behavioral_score, engagement_score, fit_score,
            demographic_score, intent_score
        ) VALUES (
            NEW.lead_id, current_score, new_category,
            public.calculate_behavioral_score(NEW.lead_id),
            public.calculate_engagement_score(NEW.lead_id),
            public.calculate_fit_score(NEW.lead_id),
            10, 10
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- 10. Enable RLS on all new tables
ALTER TABLE public.lead_behavioral_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_engagement_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_score_history ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies using Pattern 2 (Simple User Ownership) and Pattern 7 (Complex Relationships)
-- Pattern 7: Complex relationship for lead_behavioral_metrics (access through lead ownership)
CREATE OR REPLACE FUNCTION public.can_access_lead_data(lead_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.leads l
    WHERE l.id = lead_uuid AND l.assigned_to = auth.uid()
)
$$;

CREATE POLICY "users_manage_own_lead_behavioral_metrics"
ON public.lead_behavioral_metrics
FOR ALL
TO authenticated
USING (public.can_access_lead_data(lead_id))
WITH CHECK (public.can_access_lead_data(lead_id));

-- Pattern 2: Simple user ownership for scoring models
CREATE POLICY "users_manage_own_lead_scoring_models"
ON public.lead_scoring_models
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Pattern 7: Complex relationship for lead_scores (access through lead ownership)
CREATE POLICY "users_manage_own_lead_scores"
ON public.lead_scores
FOR ALL
TO authenticated
USING (public.can_access_lead_data(lead_id))
WITH CHECK (public.can_access_lead_data(lead_id));

-- Pattern 7: Complex relationship for lead_engagement_summary (access through lead ownership)
CREATE POLICY "users_manage_own_lead_engagement_summary"
ON public.lead_engagement_summary
FOR ALL
TO authenticated
USING (public.can_access_lead_data(lead_id))
WITH CHECK (public.can_access_lead_data(lead_id));

-- Pattern 7: Complex relationship for lead_score_history (access through lead ownership)
CREATE POLICY "users_manage_own_lead_score_history"
ON public.lead_score_history
FOR ALL
TO authenticated
USING (public.can_access_lead_data(lead_id))
WITH CHECK (public.can_access_lead_data(lead_id));

-- 12. Triggers to automatically update scores on behavioral events
CREATE TRIGGER update_score_on_behavioral_event
    AFTER INSERT ON public.lead_behavioral_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_lead_score_on_activity();

-- Update engagement summary on lead activities
CREATE OR REPLACE FUNCTION public.update_engagement_summary_on_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.lead_engagement_summary (lead_id, last_activity_date)
    VALUES (NEW.lead_id, NEW.activity_date)
    ON CONFLICT (lead_id) DO UPDATE SET
        last_activity_date = GREATEST(lead_engagement_summary.last_activity_date, NEW.activity_date),
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_engagement_on_lead_activity
    AFTER INSERT ON public.lead_activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_engagement_summary_on_activity();

-- 13. Mock Data for Advanced Lead Scoring System
DO $$
DECLARE
    existing_lead_1 UUID;
    existing_lead_2 UUID;
    existing_user_id UUID;
    scoring_model_id UUID := gen_random_uuid();
BEGIN
    -- Get existing lead and user IDs (don't create new ones)
    SELECT id INTO existing_lead_1 FROM public.leads LIMIT 1;
    SELECT id INTO existing_lead_2 FROM public.leads OFFSET 1 LIMIT 1;
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;

    IF existing_lead_1 IS NOT NULL AND existing_user_id IS NOT NULL THEN
        -- Create a default AI scoring model
        INSERT INTO public.lead_scoring_models (
            id, name, model_type, version, is_active, 
            model_config, performance_metrics, created_by
        ) VALUES (
            scoring_model_id,
            'Advanced CRM Lead Scoring v2.0',
            'hybrid'::public.scoring_model_type,
            '2.0',
            true,
            '{"weights": {"behavioral": 0.4, "engagement": 0.3, "fit": 0.3}, "ai_model": "gpt-5-nano", "update_frequency": "realtime"}',
            '{"accuracy": 0.87, "precision": 0.82, "recall": 0.89, "last_trained": "2025-09-06"}',
            existing_user_id
        );

        -- Add behavioral metrics for leads
        INSERT INTO public.lead_behavioral_metrics (
            lead_id, event_type, event_value, event_metadata, event_timestamp
        ) VALUES
            (existing_lead_1, 'email_open', 1, '{"campaign_id": "email_sequence_1", "email_subject": "Enterprise Demo Available"}', CURRENT_TIMESTAMP - INTERVAL '2 days'),
            (existing_lead_1, 'email_click', 2, '{"link_url": "/demo-request", "campaign_id": "email_sequence_1"}', CURRENT_TIMESTAMP - INTERVAL '2 days'),
            (existing_lead_1, 'website_visit', 1, '{"page_url": "/pricing", "session_duration": 180}', CURRENT_TIMESTAMP - INTERVAL '1 day'),
            (existing_lead_1, 'demo_request', 10, '{"form_data": {"interest_level": "high", "timeline": "immediate"}}', CURRENT_TIMESTAMP - INTERVAL '1 day'),
            (existing_lead_1, 'pricing_view', 5, '{"pricing_tier": "enterprise", "time_spent": 120}', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
            (existing_lead_2, 'email_open', 1, '{"campaign_id": "nurture_sequence_1"}', CURRENT_TIMESTAMP - INTERVAL '5 days'),
            (existing_lead_2, 'website_visit', 1, '{"page_url": "/features", "session_duration": 45}', CURRENT_TIMESTAMP - INTERVAL '3 days'),
            (existing_lead_2, 'form_submit', 3, '{"form_type": "newsletter", "lead_magnet": "crm_guide"}', CURRENT_TIMESTAMP - INTERVAL '3 days');

        -- Create engagement summaries
        INSERT INTO public.lead_engagement_summary (
            lead_id, emails_sent, emails_opened, emails_clicked, 
            email_open_rate, email_click_rate, website_visits, 
            pages_viewed, downloads, last_email_engagement, 
            last_website_visit, last_activity_date, engagement_trend
        ) VALUES
            (existing_lead_1, 5, 4, 2, 0.80, 0.40, 8, 15, 2, 
             CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 
             CURRENT_TIMESTAMP - INTERVAL '6 hours', 'increasing'),
            (existing_lead_2, 3, 1, 0, 0.33, 0.00, 3, 4, 1,
             CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '3 days',
             CURRENT_TIMESTAMP - INTERVAL '3 days', 'stable');

        -- Generate lead scores using the scoring functions
        INSERT INTO public.lead_scores (
            lead_id, scoring_model_id, overall_score, category,
            behavioral_score, engagement_score, fit_score,
            demographic_score, intent_score, confidence_level,
            conversion_probability, predicted_value, score_reasoning
        ) VALUES
            (existing_lead_1, scoring_model_id, 
             public.calculate_overall_lead_score(existing_lead_1),
             public.get_lead_score_category(public.calculate_overall_lead_score(existing_lead_1)),
             public.calculate_behavioral_score(existing_lead_1),
             public.calculate_engagement_score(existing_lead_1),
             public.calculate_fit_score(existing_lead_1),
             15, 20, 0.92, 0.85, 42000,
             'High behavioral engagement with demo request and pricing page views. Strong email engagement rates.'),
            (existing_lead_2, scoring_model_id,
             public.calculate_overall_lead_score(existing_lead_2),
             public.get_lead_score_category(public.calculate_overall_lead_score(existing_lead_2)),
             public.calculate_behavioral_score(existing_lead_2),
             public.calculate_engagement_score(existing_lead_2),
             public.calculate_fit_score(existing_lead_2),
             10, 8, 0.65, 0.45, 18000,
             'Moderate engagement with limited email interaction. Downloaded lead magnet shows some interest.');

        RAISE NOTICE 'Advanced lead scoring system initialized with behavioral metrics and AI-powered scoring for existing leads.';
    ELSE
        RAISE NOTICE 'No existing leads found. Run basic CRM migration first to create leads and user profiles.';
    END IF;
END $$;