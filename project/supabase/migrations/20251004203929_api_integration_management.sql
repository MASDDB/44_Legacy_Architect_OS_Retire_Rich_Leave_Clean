-- Location: supabase/migrations/20251004203929_api_integration_management.sql
-- Schema Analysis: Existing CRM system with user_profiles, campaigns, leads tables
-- Integration Type: addition - new API & Integration Management module
-- Dependencies: user_profiles (for user relationships)

-- 1. Enums and Types
CREATE TYPE public.api_key_status AS ENUM ('active', 'revoked', 'expired', 'suspended');
CREATE TYPE public.integration_type AS ENUM ('hubspot', 'salesforce', 'pipedrive', 'zapier', 'webhook', 'rest_api', 'custom');
CREATE TYPE public.webhook_status AS ENUM ('active', 'inactive', 'failed', 'pending');
CREATE TYPE public.webhook_event_type AS ENUM ('lead_created', 'lead_updated', 'campaign_completed', 'appointment_booked', 'payment_processed', 'custom');
CREATE TYPE public.rate_limit_period AS ENUM ('minute', 'hour', 'day', 'month');

-- 2. Core Tables

-- API Keys Management
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    api_key TEXT NOT NULL UNIQUE,
    api_secret TEXT,
    status public.api_key_status DEFAULT 'active'::public.api_key_status,
    permissions JSONB DEFAULT '[]'::jsonb,
    rate_limit INTEGER DEFAULT 1000,
    rate_limit_period public.rate_limit_period DEFAULT 'hour'::public.rate_limit_period,
    allowed_ips TEXT[],
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Third-party Integrations
CREATE TABLE public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    integration_type public.integration_type NOT NULL,
    integration_name TEXT NOT NULL,
    connection_status public.connection_status DEFAULT 'disconnected'::public.connection_status,
    oauth_tokens JSONB,
    api_credentials JSONB,
    field_mappings JSONB DEFAULT '{}'::jsonb,
    sync_settings JSONB DEFAULT '{}'::jsonb,
    last_sync_at TIMESTAMPTZ,
    sync_errors JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Webhook Configuration
CREATE TABLE public.webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    webhook_name TEXT NOT NULL,
    endpoint_url TEXT NOT NULL,
    event_types public.webhook_event_type[] NOT NULL DEFAULT '{}',
    status public.webhook_status DEFAULT 'active'::public.webhook_status,
    secret_key TEXT,
    retry_attempts INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    headers JSONB DEFAULT '{}'::jsonb,
    payload_template JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Webhook Delivery Logs
CREATE TABLE public.webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID REFERENCES public.webhooks(id) ON DELETE CASCADE,
    event_type public.webhook_event_type NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    response_time_ms INTEGER,
    attempt_number INTEGER DEFAULT 1,
    delivered_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- API Usage Analytics
CREATE TABLE public.api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CRM Integration Mappings
CREATE TABLE public.crm_field_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES public.integrations(id) ON DELETE CASCADE,
    local_field TEXT NOT NULL,
    remote_field TEXT NOT NULL,
    field_type TEXT NOT NULL,
    is_bidirectional BOOLEAN DEFAULT false,
    transformation_rules JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_status ON public.api_keys(status);
CREATE INDEX idx_api_keys_key ON public.api_keys(api_key);
CREATE INDEX idx_integrations_user_id ON public.integrations(user_id);
CREATE INDEX idx_integrations_type ON public.integrations(integration_type);
CREATE INDEX idx_integrations_status ON public.integrations(connection_status);
CREATE INDEX idx_webhooks_user_id ON public.webhooks(user_id);
CREATE INDEX idx_webhooks_status ON public.webhooks(status);
CREATE INDEX idx_webhook_deliveries_webhook_id ON public.webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_created_at ON public.webhook_deliveries(created_at);
CREATE INDEX idx_api_usage_logs_api_key_id ON public.api_usage_logs(api_key_id);
CREATE INDEX idx_api_usage_logs_created_at ON public.api_usage_logs(created_at);
CREATE INDEX idx_crm_field_mappings_integration_id ON public.crm_field_mappings(integration_id);

-- 4. Helper Functions
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN 'sk_' || encode(gen_random_bytes(32), 'hex');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_webhook_secret()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN 'whsec_' || encode(gen_random_bytes(24), 'base64');
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_api_key(key TEXT)
RETURNS TABLE(
    api_key_id UUID,
    user_id UUID,
    is_valid BOOLEAN,
    rate_limit INTEGER,
    usage_count INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    ak.id,
    ak.user_id,
    (ak.status = 'active' AND (ak.expires_at IS NULL OR ak.expires_at > CURRENT_TIMESTAMP)) as is_valid,
    ak.rate_limit,
    ak.usage_count
FROM public.api_keys ak
WHERE ak.api_key = key
LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.log_webhook_delivery(
    webhook_uuid UUID,
    event_type_param public.webhook_event_type,
    payload_param JSONB,
    status_code INTEGER DEFAULT NULL,
    response_body_param TEXT DEFAULT NULL,
    response_time INTEGER DEFAULT NULL,
    attempt INTEGER DEFAULT 1,
    error_msg TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    delivery_id UUID := gen_random_uuid();
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
$$;

-- 5. Triggers
CREATE OR REPLACE FUNCTION public.update_api_integration_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_integration_updated_at();

CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON public.integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_integration_updated_at();

CREATE TRIGGER update_webhooks_updated_at
    BEFORE UPDATE ON public.webhooks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_integration_updated_at();

CREATE TRIGGER update_crm_field_mappings_updated_at
    BEFORE UPDATE ON public.crm_field_mappings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_integration_updated_at();

-- 6. Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_field_mappings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Using Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_api_keys"
ON public.api_keys
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_integrations"
ON public.integrations
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_webhooks"
ON public.webhooks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Webhook deliveries accessible through webhook ownership
CREATE POLICY "users_view_own_webhook_deliveries"
ON public.webhook_deliveries
FOR SELECT
TO authenticated
USING (
    webhook_id IN (
        SELECT id FROM public.webhooks WHERE user_id = auth.uid()
    )
);

-- API usage logs accessible through API key ownership
CREATE POLICY "users_view_own_api_usage_logs"
ON public.api_usage_logs
FOR SELECT
TO authenticated
USING (
    api_key_id IN (
        SELECT id FROM public.api_keys WHERE user_id = auth.uid()
    )
);

-- CRM field mappings accessible through integration ownership
CREATE POLICY "users_manage_own_crm_field_mappings"
ON public.crm_field_mappings
FOR ALL
TO authenticated
USING (
    integration_id IN (
        SELECT id FROM public.integrations WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    integration_id IN (
        SELECT id FROM public.integrations WHERE user_id = auth.uid()
    )
);

-- 8. Mock Data
DO $$
DECLARE
    existing_user_id UUID;
    admin_user_id UUID;
    api_key_id UUID := gen_random_uuid();
    integration_id UUID := gen_random_uuid();
    webhook_id UUID := gen_random_uuid();
BEGIN
    -- Get existing user IDs
    SELECT id INTO existing_user_id FROM public.user_profiles WHERE role = 'sales_rep' LIMIT 1;
    SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;
    
    -- Create sample API keys
    INSERT INTO public.api_keys (id, user_id, key_name, api_key, status, permissions, rate_limit, rate_limit_period)
    VALUES 
        (api_key_id, COALESCE(admin_user_id, existing_user_id), 'Production API Key', public.generate_api_key(), 'active', '["leads:read", "campaigns:write"]'::jsonb, 5000, 'hour'),
        (gen_random_uuid(), COALESCE(existing_user_id, admin_user_id), 'Development API Key', public.generate_api_key(), 'active', '["leads:read"]'::jsonb, 1000, 'hour');

    -- Create sample integrations
    INSERT INTO public.integrations (id, user_id, integration_type, integration_name, connection_status, field_mappings)
    VALUES 
        (integration_id, COALESCE(admin_user_id, existing_user_id), 'hubspot', 'HubSpot CRM', 'connected', '{"email": "email", "first_name": "firstname", "last_name": "lastname"}'::jsonb),
        (gen_random_uuid(), COALESCE(existing_user_id, admin_user_id), 'zapier', 'Zapier Automation', 'connected', '{}'::jsonb);

    -- Create sample webhooks
    INSERT INTO public.webhooks (id, user_id, webhook_name, endpoint_url, event_types, status, secret_key)
    VALUES 
        (webhook_id, COALESCE(admin_user_id, existing_user_id), 'Lead Notifications', 'https://api.example.com/webhooks/leads', ARRAY['lead_created', 'lead_updated'], 'active', public.generate_webhook_secret()),
        (gen_random_uuid(), COALESCE(existing_user_id, admin_user_id), 'Campaign Alerts', 'https://hooks.slack.com/services/example', ARRAY['campaign_completed'], 'active', public.generate_webhook_secret());

    -- Create sample webhook deliveries
    INSERT INTO public.webhook_deliveries (webhook_id, event_type, payload, response_status, response_time_ms, delivered_at)
    VALUES 
        (webhook_id, 'lead_created', '{"lead_id": "123", "email": "test@example.com"}'::jsonb, 200, 150, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
        (webhook_id, 'lead_updated', '{"lead_id": "123", "status": "qualified"}'::jsonb, 200, 120, CURRENT_TIMESTAMP - INTERVAL '30 minutes');

    -- Create sample API usage logs
    INSERT INTO public.api_usage_logs (api_key_id, endpoint, method, status_code, response_time_ms, ip_address)
    VALUES 
        (api_key_id, '/api/v1/leads', 'GET', 200, 85, '192.168.1.100'),
        (api_key_id, '/api/v1/campaigns', 'POST', 201, 120, '192.168.1.100');

    -- Create sample CRM field mappings
    INSERT INTO public.crm_field_mappings (integration_id, local_field, remote_field, field_type, is_bidirectional)
    VALUES 
        (integration_id, 'email', 'email', 'string', true),
        (integration_id, 'first_name', 'firstname', 'string', true),
        (integration_id, 'lead_score', 'hs_score', 'number', false);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data creation failed: %', SQLERRM;
END $$;