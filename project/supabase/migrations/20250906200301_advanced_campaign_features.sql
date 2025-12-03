-- Location: supabase/migrations/20250906200301_advanced_campaign_features.sql
-- Schema Analysis: Existing CRM system with campaigns, email_notifications, sms_messages tables
-- Integration Type: Extension - Adding advanced campaign workflow and analytics features
-- Dependencies: campaigns, user_profiles, email_notifications, sms_messages

-- 1. Add advanced campaign configuration columns to existing campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS flow_type TEXT DEFAULT 'sequential' CHECK (flow_type IN ('sequential', 'conditional', 'trigger-based', 'multi-channel')),
ADD COLUMN IF NOT EXISTS trigger_settings JSONB DEFAULT '{"type": "lead-created", "conditions": [], "delay": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS conditional_logic JSONB DEFAULT '{"enabled": false, "rules": []}'::jsonb,
ADD COLUMN IF NOT EXISTS multi_channel_coordination JSONB DEFAULT '{"enabled": false, "primaryChannel": "email", "fallbackChannels": [], "coordinationRules": []}'::jsonb,
ADD COLUMN IF NOT EXISTS ab_test_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ab_test_config JSONB DEFAULT '{"testDuration": 7, "trafficSplit": 50, "testMetrics": ["response"], "minSampleSize": 100}'::jsonb,
ADD COLUMN IF NOT EXISTS automation_rules JSONB DEFAULT '{"respectTimezones": true, "businessHoursOnly": true, "dailyLimit": 100, "totalLimit": 1000}'::jsonb,
ADD COLUMN IF NOT EXISTS scheduling_config JSONB DEFAULT '{"timezone": "EST", "startTime": "09:00", "endTime": "17:00", "activeDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}'::jsonb;

-- 2. Create campaign flow nodes table for visual workflow builder
CREATE TABLE public.campaign_flow_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    node_type TEXT NOT NULL CHECK (node_type IN ('start', 'end', 'message', 'conditional', 'delay', 'trigger', 'ab_test')),
    position_x NUMERIC NOT NULL DEFAULT 0,
    position_y NUMERIC NOT NULL DEFAULT 0,
    node_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create campaign flow edges table for connections
CREATE TABLE public.campaign_flow_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    edge_id TEXT NOT NULL,
    source_node TEXT NOT NULL,
    target_node TEXT NOT NULL,
    edge_type TEXT DEFAULT 'default',
    edge_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create campaign analytics table for performance tracking
CREATE TABLE public.campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL DEFAULT 0,
    metric_data JSONB DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ
);

-- 5. Create A/B test results table
CREATE TABLE public.campaign_ab_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    participant_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    conversion_rate NUMERIC DEFAULT 0.0,
    statistical_significance NUMERIC DEFAULT 0.0,
    is_winner BOOLEAN DEFAULT false,
    test_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create campaign automation logs table
CREATE TABLE public.campaign_automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    automation_type TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    execution_status TEXT DEFAULT 'pending' CHECK (execution_status IN ('pending', 'executing', 'completed', 'failed', 'skipped')),
    execution_data JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Add indexes for performance
CREATE INDEX idx_campaign_flow_nodes_campaign_id ON public.campaign_flow_nodes(campaign_id);
CREATE INDEX idx_campaign_flow_nodes_type ON public.campaign_flow_nodes(node_type);
CREATE INDEX idx_campaign_flow_edges_campaign_id ON public.campaign_flow_edges(campaign_id);
CREATE INDEX idx_campaign_flow_edges_source ON public.campaign_flow_edges(source_node);
CREATE INDEX idx_campaign_flow_edges_target ON public.campaign_flow_edges(target_node);
CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_metric ON public.campaign_analytics(metric_name);
CREATE INDEX idx_campaign_analytics_recorded_at ON public.campaign_analytics(recorded_at);
CREATE INDEX idx_campaign_ab_test_campaign_id ON public.campaign_ab_test_results(campaign_id);
CREATE INDEX idx_campaign_automation_logs_campaign_id ON public.campaign_automation_logs(campaign_id);
CREATE INDEX idx_campaign_automation_logs_status ON public.campaign_automation_logs(execution_status);

-- 8. Create functions for campaign analytics
CREATE OR REPLACE FUNCTION public.calculate_campaign_metrics(p_campaign_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_sent INTEGER := 0;
    total_delivered INTEGER := 0;
    total_opened INTEGER := 0;
    total_clicked INTEGER := 0;
    total_responded INTEGER := 0;
    result JSONB;
BEGIN
    -- Calculate email metrics
    SELECT 
        COUNT(*) FILTER (WHERE email_status = 'sent'),
        COUNT(*) FILTER (WHERE email_status = 'delivered'),
        COUNT(*) FILTER (WHERE metadata->>'opened' = 'true'),
        COUNT(*) FILTER (WHERE metadata->>'clicked' = 'true')
    INTO total_sent, total_delivered, total_opened, total_clicked
    FROM public.email_notifications 
    WHERE related_entity_id = p_campaign_id AND related_entity_type = 'campaign';

    -- Calculate SMS metrics
    SELECT 
        COUNT(*) FILTER (WHERE status = 'sent'),
        COUNT(*) FILTER (WHERE status = 'delivered')
    INTO total_sent, total_delivered
    FROM public.sms_messages 
    WHERE campaign_id = p_campaign_id;

    -- Build result JSON
    result := jsonb_build_object(
        'total_sent', total_sent,
        'total_delivered', total_delivered,
        'total_opened', total_opened,
        'total_clicked', total_clicked,
        'total_responded', total_responded,
        'delivery_rate', CASE WHEN total_sent > 0 THEN ROUND((total_delivered::NUMERIC / total_sent) * 100, 2) ELSE 0 END,
        'open_rate', CASE WHEN total_delivered > 0 THEN ROUND((total_opened::NUMERIC / total_delivered) * 100, 2) ELSE 0 END,
        'click_rate', CASE WHEN total_opened > 0 THEN ROUND((total_clicked::NUMERIC / total_opened) * 100, 2) ELSE 0 END,
        'response_rate', CASE WHEN total_sent > 0 THEN ROUND((total_responded::NUMERIC / total_sent) * 100, 2) ELSE 0 END
    );

    RETURN result;
END;
$$;

-- 9. Create function for A/B test analysis
CREATE OR REPLACE FUNCTION public.analyze_ab_test_results(p_campaign_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    variant_a_count INTEGER := 0;
    variant_b_count INTEGER := 0;
    variant_a_conversions INTEGER := 0;
    variant_b_conversions INTEGER := 0;
    statistical_significance NUMERIC;
    winner_variant TEXT;
    result JSONB;
BEGIN
    -- Get A/B test data
    SELECT 
        SUM(CASE WHEN variant_name = 'A' THEN participant_count ELSE 0 END),
        SUM(CASE WHEN variant_name = 'B' THEN participant_count ELSE 0 END),
        SUM(CASE WHEN variant_name = 'A' THEN conversion_count ELSE 0 END),
        SUM(CASE WHEN variant_name = 'B' THEN conversion_count ELSE 0 END)
    INTO variant_a_count, variant_b_count, variant_a_conversions, variant_b_conversions
    FROM public.campaign_ab_test_results
    WHERE campaign_id = p_campaign_id;

    -- Calculate statistical significance (simplified)
    IF variant_a_count > 0 AND variant_b_count > 0 THEN
        statistical_significance := ABS((variant_a_conversions::NUMERIC / variant_a_count) - (variant_b_conversions::NUMERIC / variant_b_count)) * 100;
        
        -- Determine winner
        IF (variant_a_conversions::NUMERIC / variant_a_count) > (variant_b_conversions::NUMERIC / variant_b_count) THEN
            winner_variant := 'A';
        ELSE
            winner_variant := 'B';
        END IF;
    ELSE
        statistical_significance := 0;
        winner_variant := 'Inconclusive';
    END IF;

    result := jsonb_build_object(
        'variant_a', jsonb_build_object(
            'participants', variant_a_count,
            'conversions', variant_a_conversions,
            'conversion_rate', CASE WHEN variant_a_count > 0 THEN ROUND((variant_a_conversions::NUMERIC / variant_a_count) * 100, 2) ELSE 0 END
        ),
        'variant_b', jsonb_build_object(
            'participants', variant_b_count,
            'conversions', variant_b_conversions,
            'conversion_rate', CASE WHEN variant_b_count > 0 THEN ROUND((variant_b_conversions::NUMERIC / variant_b_count) * 100, 2) ELSE 0 END
        ),
        'statistical_significance', ROUND(statistical_significance, 2),
        'winner', winner_variant,
        'is_conclusive', statistical_significance > 95
    );

    RETURN result;
END;
$$;

-- 10. Enable RLS for all new tables
ALTER TABLE public.campaign_flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_flow_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_automation_logs ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies using Pattern 7 (Complex relationships through campaigns)
CREATE OR REPLACE FUNCTION public.can_access_campaign_data(p_campaign_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = p_campaign_id AND c.created_by = auth.uid()
)
$$;

-- RLS Policies for campaign flow nodes
CREATE POLICY "users_manage_campaign_flow_nodes"
ON public.campaign_flow_nodes
FOR ALL
TO authenticated
USING (public.can_access_campaign_data(campaign_id))
WITH CHECK (public.can_access_campaign_data(campaign_id));

-- RLS Policies for campaign flow edges
CREATE POLICY "users_manage_campaign_flow_edges"
ON public.campaign_flow_edges
FOR ALL
TO authenticated
USING (public.can_access_campaign_data(campaign_id))
WITH CHECK (public.can_access_campaign_data(campaign_id));

-- RLS Policies for campaign analytics
CREATE POLICY "users_view_campaign_analytics"
ON public.campaign_analytics
FOR SELECT
TO authenticated
USING (public.can_access_campaign_data(campaign_id));

CREATE POLICY "system_insert_campaign_analytics"
ON public.campaign_analytics
FOR INSERT
TO authenticated
WITH CHECK (public.can_access_campaign_data(campaign_id));

-- RLS Policies for A/B test results
CREATE POLICY "users_manage_campaign_ab_test_results"
ON public.campaign_ab_test_results
FOR ALL
TO authenticated
USING (public.can_access_campaign_data(campaign_id))
WITH CHECK (public.can_access_campaign_data(campaign_id));

-- RLS Policies for automation logs
CREATE POLICY "users_view_campaign_automation_logs"
ON public.campaign_automation_logs
FOR SELECT
TO authenticated
USING (public.can_access_campaign_data(campaign_id));

CREATE POLICY "system_insert_campaign_automation_logs"
ON public.campaign_automation_logs
FOR INSERT
TO authenticated
WITH CHECK (public.can_access_campaign_data(campaign_id));

-- 12. Create triggers for updated_at columns
CREATE TRIGGER update_campaign_flow_nodes_updated_at
    BEFORE UPDATE ON public.campaign_flow_nodes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_ab_test_results_updated_at
    BEFORE UPDATE ON public.campaign_ab_test_results
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Mock data for advanced campaign features
DO $$
DECLARE
    existing_campaign_id UUID;
    existing_user_id UUID;
    flow_node_1_id UUID := gen_random_uuid();
    flow_node_2_id UUID := gen_random_uuid();
    flow_node_3_id UUID := gen_random_uuid();
BEGIN
    -- Get existing campaign and user
    SELECT id INTO existing_campaign_id FROM public.campaigns LIMIT 1;
    SELECT created_by INTO existing_user_id FROM public.campaigns WHERE id = existing_campaign_id LIMIT 1;

    IF existing_campaign_id IS NOT NULL AND existing_user_id IS NOT NULL THEN
        -- Update existing campaign with advanced features
        UPDATE public.campaigns 
        SET 
            flow_type = 'conditional',
            trigger_settings = '{"type": "lead-created", "conditions": [{"field": "lead_score", "operator": ">", "value": 75}], "delay": 30}'::jsonb,
            conditional_logic = '{"enabled": true, "rules": [{"condition": "lead_responded", "action": "skip_next_message"}]}'::jsonb,
            ab_test_enabled = true,
            ab_test_config = '{"testDuration": 14, "trafficSplit": 50, "testMetrics": ["response", "conversion"], "minSampleSize": 200}'::jsonb
        WHERE id = existing_campaign_id;

        -- Create flow nodes
        INSERT INTO public.campaign_flow_nodes (id, campaign_id, node_id, node_type, position_x, position_y, node_data)
        VALUES 
            (flow_node_1_id, existing_campaign_id, 'start-1', 'start', 250, 50, '{"label": "Campaign Start"}'::jsonb),
            (flow_node_2_id, existing_campaign_id, 'message-1', 'message', 250, 200, '{"channel": "email", "name": "Welcome Email", "content": "Welcome to our platform!"}'::jsonb),
            (flow_node_3_id, existing_campaign_id, 'end-1', 'end', 250, 350, '{"label": "Campaign End"}'::jsonb);

        -- Create flow edges
        INSERT INTO public.campaign_flow_edges (campaign_id, edge_id, source_node, target_node, edge_type)
        VALUES 
            (existing_campaign_id, 'edge-1', 'start-1', 'message-1', 'default'),
            (existing_campaign_id, 'edge-2', 'message-1', 'end-1', 'default');

        -- Create sample analytics data
        INSERT INTO public.campaign_analytics (campaign_id, metric_name, metric_value, metric_data, period_start, period_end)
        VALUES 
            (existing_campaign_id, 'total_sent', 1250, '{"breakdown": {"email": 750, "sms": 500}}'::jsonb, NOW() - INTERVAL '7 days', NOW()),
            (existing_campaign_id, 'total_delivered', 1100, '{"breakdown": {"email": 680, "sms": 420}}'::jsonb, NOW() - INTERVAL '7 days', NOW()),
            (existing_campaign_id, 'total_opened', 450, '{"breakdown": {"email": 450, "sms": 0}}'::jsonb, NOW() - INTERVAL '7 days', NOW()),
            (existing_campaign_id, 'total_clicked', 125, '{"breakdown": {"email": 125, "sms": 0}}'::jsonb, NOW() - INTERVAL '7 days', NOW());

        -- Create A/B test results
        INSERT INTO public.campaign_ab_test_results (campaign_id, variant_name, participant_count, conversion_count, conversion_rate)
        VALUES 
            (existing_campaign_id, 'A', 625, 78, 12.48),
            (existing_campaign_id, 'B', 625, 95, 15.20);

        -- Update winner
        UPDATE public.campaign_ab_test_results 
        SET is_winner = true 
        WHERE campaign_id = existing_campaign_id AND variant_name = 'B';

        -- Create automation logs
        INSERT INTO public.campaign_automation_logs (campaign_id, automation_type, trigger_event, execution_status, execution_data)
        VALUES 
            (existing_campaign_id, 'conditional_logic', 'lead_responded', 'completed', '{"lead_id": "sample-lead-id", "action": "skip_next_message"}'::jsonb),
            (existing_campaign_id, 'ab_test', 'message_sent', 'completed', '{"variant": "B", "participant_count": 25}'::jsonb),
            (existing_campaign_id, 'multi_channel', 'email_bounced', 'completed', '{"fallback_channel": "sms", "message_sent": true}'::jsonb);
    END IF;
END $$;