-- Location: supabase/migrations/20251004203929_crm_integration_hub.sql
-- Schema Analysis: Existing Database Reactivation SaaS with user_profiles and comprehensive campaign system
-- Integration Type: NEW_MODULE - CRM Integration functionality
-- Dependencies: user_profiles table (existing)

-- 1. TYPES - CRM-related enums
CREATE TYPE public.crm_provider AS ENUM ('hubspot', 'salesforce', 'pipedrive', 'custom');
CREATE TYPE public.crm_connection_status AS ENUM ('disconnected', 'connecting', 'connected', 'error', 'expired');
CREATE TYPE public.sync_direction AS ENUM ('unidirectional', 'bidirectional');
CREATE TYPE public.sync_frequency AS ENUM ('real_time', 'hourly', 'daily', 'weekly', 'manual');
CREATE TYPE public.field_mapping_type AS ENUM ('direct', 'transformation', 'calculated', 'static');
CREATE TYPE public.sync_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');

-- 2. CORE TABLES

-- CRM Connections - Store OAuth connections to external CRMs
CREATE TABLE public.crm_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    provider public.crm_provider NOT NULL,
    connection_name TEXT NOT NULL,
    oauth_access_token TEXT,
    oauth_refresh_token TEXT,
    oauth_expires_at TIMESTAMPTZ,
    connection_status public.crm_connection_status DEFAULT 'disconnected'::public.crm_connection_status,
    connection_data JSONB DEFAULT '{}'::jsonb,
    last_sync_at TIMESTAMPTZ,
    sync_errors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CRM Field Mappings - Map platform fields to CRM fields
CREATE TABLE public.crm_field_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES public.crm_connections(id) ON DELETE CASCADE,
    platform_field TEXT NOT NULL,
    crm_field TEXT NOT NULL,
    mapping_type public.field_mapping_type DEFAULT 'direct'::public.field_mapping_type,
    transformation_rules JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sync Configurations - Define sync settings and schedules
CREATE TABLE public.crm_sync_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES public.crm_connections(id) ON DELETE CASCADE,
    sync_direction public.sync_direction DEFAULT 'bidirectional'::public.sync_direction,
    sync_frequency public.sync_frequency DEFAULT 'hourly'::public.sync_frequency,
    sync_filters JSONB DEFAULT '{}'::jsonb,
    conflict_resolution JSONB DEFAULT '{"strategy": "platform_wins", "notify_conflicts": true}'::jsonb,
    is_enabled BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    next_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sync History - Track all sync operations and results
CREATE TABLE public.crm_sync_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES public.crm_connections(id) ON DELETE CASCADE,
    sync_status public.sync_status DEFAULT 'pending'::public.sync_status,
    sync_direction public.sync_direction NOT NULL,
    records_processed INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    sync_errors JSONB DEFAULT '[]'::jsonb,
    sync_summary JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CRM Custom Fields - Store custom field definitions for platform data
CREATE TABLE public.crm_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES public.crm_connections(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_description TEXT,
    is_required BOOLEAN DEFAULT false,
    default_value TEXT,
    validation_rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES - Performance optimization
CREATE INDEX idx_crm_connections_user_id ON public.crm_connections(user_id);
CREATE INDEX idx_crm_connections_provider ON public.crm_connections(provider);
CREATE INDEX idx_crm_connections_status ON public.crm_connections(connection_status);
CREATE INDEX idx_crm_field_mappings_connection_id ON public.crm_field_mappings(connection_id);
CREATE INDEX idx_crm_field_mappings_platform_field ON public.crm_field_mappings(platform_field);
CREATE INDEX idx_crm_sync_configs_connection_id ON public.crm_sync_configs(connection_id);
CREATE INDEX idx_crm_sync_configs_next_sync ON public.crm_sync_configs(next_sync_at) WHERE is_enabled = true;
CREATE INDEX idx_crm_sync_history_connection_id ON public.crm_sync_history(connection_id);
CREATE INDEX idx_crm_sync_history_status ON public.crm_sync_history(sync_status);
CREATE INDEX idx_crm_sync_history_started_at ON public.crm_sync_history(started_at);
CREATE INDEX idx_crm_custom_fields_connection_id ON public.crm_custom_fields(connection_id);

-- 4. FUNCTIONS - Business logic functions
CREATE OR REPLACE FUNCTION public.update_crm_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION public.get_crm_sync_health(user_uuid UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $func$
SELECT jsonb_build_object(
    'total_connections', COUNT(*),
    'active_connections', COUNT(*) FILTER (WHERE connection_status = 'connected'),
    'failed_connections', COUNT(*) FILTER (WHERE connection_status = 'error'),
    'last_sync_within_24h', COUNT(*) FILTER (WHERE last_sync_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'),
    'connections', jsonb_agg(
        jsonb_build_object(
            'id', id,
            'provider', provider,
            'name', connection_name,
            'status', connection_status,
            'last_sync', last_sync_at
        )
    )
)
FROM public.crm_connections cc
WHERE cc.user_id = user_uuid;
$func$;

CREATE OR REPLACE FUNCTION public.get_recent_crm_sync_activity(connection_uuid UUID, limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
    id UUID,
    sync_status TEXT,
    sync_direction TEXT,
    records_processed INTEGER,
    records_created INTEGER,
    records_updated INTEGER,
    records_failed INTEGER,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_minutes INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $func$
SELECT 
    csh.id,
    csh.sync_status::TEXT,
    csh.sync_direction::TEXT,
    csh.records_processed,
    csh.records_created,
    csh.records_updated,
    csh.records_failed,
    csh.started_at,
    csh.completed_at,
    EXTRACT(EPOCH FROM (csh.completed_at - csh.started_at))::INTEGER / 60 as duration_minutes
FROM public.crm_sync_history csh
WHERE csh.connection_id = connection_uuid
ORDER BY csh.started_at DESC
LIMIT limit_count;
$func$;

-- 5. ENABLE RLS
ALTER TABLE public.crm_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_field_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_custom_fields ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES - Using Pattern 2 (Simple User Ownership)

CREATE POLICY "users_manage_own_crm_connections"
ON public.crm_connections
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_crm_field_mappings"
ON public.crm_field_mappings
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.crm_connections cc
        WHERE cc.id = connection_id AND cc.user_id = auth.uid()
    )
);

CREATE POLICY "users_manage_own_crm_sync_configs"
ON public.crm_sync_configs
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.crm_connections cc
        WHERE cc.id = connection_id AND cc.user_id = auth.uid()
    )
);

CREATE POLICY "users_view_own_crm_sync_history"
ON public.crm_sync_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.crm_connections cc
        WHERE cc.id = connection_id AND cc.user_id = auth.uid()
    )
);

CREATE POLICY "users_manage_own_crm_custom_fields"
ON public.crm_custom_fields
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.crm_connections cc
        WHERE cc.id = connection_id AND cc.user_id = auth.uid()
    )
);

-- 7. TRIGGERS - Auto-update timestamps
CREATE TRIGGER update_crm_connections_updated_at
    BEFORE UPDATE ON public.crm_connections
    FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at_column();

CREATE TRIGGER update_crm_field_mappings_updated_at
    BEFORE UPDATE ON public.crm_field_mappings
    FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at_column();

CREATE TRIGGER update_crm_sync_configs_updated_at
    BEFORE UPDATE ON public.crm_sync_configs
    FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at_column();

CREATE TRIGGER update_crm_custom_fields_updated_at
    BEFORE UPDATE ON public.crm_custom_fields
    FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at_column();

-- 8. MOCK DATA - Sample CRM connections for testing
DO $$
DECLARE
    existing_user_id UUID;
    hubspot_conn_id UUID := gen_random_uuid();
    salesforce_conn_id UUID := gen_random_uuid();
    pipedrive_conn_id UUID := gen_random_uuid();
BEGIN
    -- Get existing user ID from user_profiles
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    IF existing_user_id IS NOT NULL THEN
        -- Insert sample CRM connections
        INSERT INTO public.crm_connections (
            id, user_id, provider, connection_name, connection_status, 
            oauth_expires_at, last_sync_at, connection_data
        ) VALUES
            (
                hubspot_conn_id, existing_user_id, 'hubspot'::public.crm_provider, 
                'HubSpot Production', 'connected'::public.crm_connection_status,
                CURRENT_TIMESTAMP + INTERVAL '90 days', 
                CURRENT_TIMESTAMP - INTERVAL '2 hours',
                '{"portal_id": "12345678", "hub_domain": "app.hubspot.com", "scopes": ["contacts", "deals"]}'::jsonb
            ),
            (
                salesforce_conn_id, existing_user_id, 'salesforce'::public.crm_provider,
                'Salesforce Org', 'connected'::public.crm_connection_status,
                CURRENT_TIMESTAMP + INTERVAL '30 days',
                CURRENT_TIMESTAMP - INTERVAL '6 hours',
                '{"instance_url": "https://yourorg.salesforce.com", "organization_id": "00D000000000000EAA"}'::jsonb
            ),
            (
                pipedrive_conn_id, existing_user_id, 'pipedrive'::public.crm_provider,
                'Pipedrive Sales', 'error'::public.crm_connection_status,
                CURRENT_TIMESTAMP - INTERVAL '1 day',
                CURRENT_TIMESTAMP - INTERVAL '1 day',
                '{"company_domain": "yourcompany.pipedrive.com", "user_id": 123456}'::jsonb
            );

        -- Insert sample field mappings
        INSERT INTO public.crm_field_mappings (
            connection_id, platform_field, crm_field, mapping_type, transformation_rules
        ) VALUES
            (hubspot_conn_id, 'full_name', 'firstname', 'transformation'::public.field_mapping_type, 
             '{"split_by": " ", "take_index": 0}'::jsonb),
            (hubspot_conn_id, 'full_name', 'lastname', 'transformation'::public.field_mapping_type,
             '{"split_by": " ", "take_index": 1}'::jsonb),
            (hubspot_conn_id, 'email', 'email', 'direct'::public.field_mapping_type, '{}'::jsonb),
            (hubspot_conn_id, 'phone', 'phone', 'direct'::public.field_mapping_type, '{}'::jsonb),
            (salesforce_conn_id, 'full_name', 'Name', 'direct'::public.field_mapping_type, '{}'::jsonb),
            (salesforce_conn_id, 'email', 'Email', 'direct'::public.field_mapping_type, '{}'::jsonb),
            (salesforce_conn_id, 'company', 'Account.Name', 'direct'::public.field_mapping_type, '{}'::jsonb);

        -- Insert sample sync configurations
        INSERT INTO public.crm_sync_configs (
            connection_id, sync_direction, sync_frequency, sync_filters, conflict_resolution, next_sync_at
        ) VALUES
            (hubspot_conn_id, 'bidirectional'::public.sync_direction, 'hourly'::public.sync_frequency,
             '{"contact_types": ["lead", "customer"]}'::jsonb,
             '{"strategy": "last_modified_wins", "notify_conflicts": false}'::jsonb,
             CURRENT_TIMESTAMP + INTERVAL '1 hour'),
            (salesforce_conn_id, 'unidirectional'::public.sync_direction, 'daily'::public.sync_frequency,
             '{"only_active_leads": true}'::jsonb,
             '{"strategy": "platform_wins", "notify_conflicts": true}'::jsonb,
             CURRENT_TIMESTAMP + INTERVAL '1 day');

        -- Insert sample sync history
        INSERT INTO public.crm_sync_history (
            connection_id, sync_status, sync_direction, records_processed, records_created, 
            records_updated, records_failed, started_at, completed_at
        ) VALUES
            (hubspot_conn_id, 'completed'::public.sync_status, 'bidirectional'::public.sync_direction,
             150, 25, 120, 5, CURRENT_TIMESTAMP - INTERVAL '2 hours 15 minutes', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
            (salesforce_conn_id, 'completed'::public.sync_status, 'unidirectional'::public.sync_direction,
             89, 15, 74, 0, CURRENT_TIMESTAMP - INTERVAL '6 hours 30 minutes', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
            (pipedrive_conn_id, 'failed'::public.sync_status, 'bidirectional'::public.sync_direction,
             0, 0, 0, 0, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day');

    END IF;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;