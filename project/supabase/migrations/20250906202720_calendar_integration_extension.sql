-- Schema Analysis: Extending existing CRM schema with calendar integration features
-- Integration Type: ADDITIVE - Adding new tables that reference existing appointments/user_profiles/leads
-- Dependencies: user_profiles, appointments, leads tables (already exist)

-- 1. TYPES - Calendar Integration
CREATE TYPE public.calendar_provider AS ENUM ('cal_com', 'google_calendar', 'outlook');
CREATE TYPE public.connection_status AS ENUM ('connected', 'disconnected', 'error', 'syncing');
CREATE TYPE public.day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE public.booking_status AS ENUM ('enabled', 'disabled', 'maintenance');
CREATE TYPE public.sync_status AS ENUM ('pending', 'syncing', 'success', 'failed');

-- 2. CALENDAR CONNECTIONS - Track external calendar integrations
CREATE TABLE public.calendar_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    provider public.calendar_provider NOT NULL,
    connection_status public.connection_status DEFAULT 'disconnected'::public.connection_status,
    access_token TEXT,
    refresh_token TEXT,
    external_calendar_id TEXT,
    external_account_email TEXT,
    last_sync_at TIMESTAMPTZ,
    sync_status public.sync_status DEFAULT 'pending'::public.sync_status,
    error_message TEXT,
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER AVAILABILITY - Schedule and availability management
CREATE TABLE public.user_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    day_of_week public.day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    timezone TEXT DEFAULT 'UTC'::TEXT,
    buffer_before_minutes INTEGER DEFAULT 0,
    buffer_after_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOOKING PAGE SETTINGS - Customizable booking page configuration
CREATE TABLE public.booking_page_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    page_title TEXT DEFAULT 'Book a Meeting',
    page_description TEXT,
    booking_status public.booking_status DEFAULT 'enabled'::public.booking_status,
    default_duration_minutes INTEGER DEFAULT 30,
    min_notice_hours INTEGER DEFAULT 24,
    max_advance_days INTEGER DEFAULT 60,
    allowed_duration_options INTEGER[] DEFAULT ARRAY[15, 30, 45, 60],
    require_confirmation BOOLEAN DEFAULT false,
    custom_questions JSONB DEFAULT '[]'::JSONB,
    branding_settings JSONB DEFAULT '{}'::JSONB,
    notification_settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. CALENDAR SYNC LOGS - Track synchronization events
CREATE TABLE public.calendar_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES public.calendar_connections(id) ON DELETE CASCADE NOT NULL,
    sync_type TEXT NOT NULL, -- 'full', 'incremental', 'push', 'pull'
    sync_status public.sync_status DEFAULT 'pending'::public.sync_status,
    events_synced INTEGER DEFAULT 0,
    events_created INTEGER DEFAULT 0,
    events_updated INTEGER DEFAULT 0,
    events_deleted INTEGER DEFAULT 0,
    error_details JSONB,
    sync_started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sync_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. APPOINTMENT REMINDERS - Schedule automated reminders
CREATE TABLE public.appointment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    reminder_type TEXT NOT NULL, -- 'email', 'sms', 'push'
    send_at TIMESTAMPTZ NOT NULL,
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. CALENDAR ANALYTICS - Track calendar metrics
CREATE TABLE public.calendar_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    date_recorded DATE NOT NULL,
    appointments_scheduled INTEGER DEFAULT 0,
    appointments_completed INTEGER DEFAULT 0,
    appointments_cancelled INTEGER DEFAULT 0,
    appointments_no_show INTEGER DEFAULT 0,
    total_booking_duration_minutes INTEGER DEFAULT 0,
    unique_leads_booked INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0.0000,
    avg_booking_time_hours DECIMAL(8,2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. INDEXES
CREATE INDEX idx_calendar_connections_user_id ON public.calendar_connections(user_id);
CREATE INDEX idx_calendar_connections_provider ON public.calendar_connections(provider);
CREATE INDEX idx_calendar_connections_status ON public.calendar_connections(connection_status);
CREATE INDEX idx_user_availability_user_id ON public.user_availability(user_id);
CREATE INDEX idx_user_availability_day_time ON public.user_availability(day_of_week, start_time, end_time);
CREATE INDEX idx_booking_page_settings_user_id ON public.booking_page_settings(user_id);
CREATE INDEX idx_calendar_sync_logs_connection_id ON public.calendar_sync_logs(connection_id);
CREATE INDEX idx_calendar_sync_logs_sync_status ON public.calendar_sync_logs(sync_status);
CREATE INDEX idx_appointment_reminders_appointment_id ON public.appointment_reminders(appointment_id);
CREATE INDEX idx_appointment_reminders_send_at ON public.appointment_reminders(send_at);
CREATE INDEX idx_appointment_reminders_sent ON public.appointment_reminders(sent);
CREATE INDEX idx_calendar_analytics_user_date ON public.calendar_analytics(user_id, date_recorded);

-- 9. UNIQUE CONSTRAINTS
CREATE UNIQUE INDEX idx_calendar_connections_user_provider 
ON public.calendar_connections(user_id, provider) 
WHERE connection_status = 'connected';

CREATE UNIQUE INDEX idx_user_availability_user_day_time 
ON public.user_availability(user_id, day_of_week, start_time, end_time);

CREATE UNIQUE INDEX idx_booking_page_settings_user 
ON public.booking_page_settings(user_id);

CREATE UNIQUE INDEX idx_calendar_analytics_user_date_unique
ON public.calendar_analytics(user_id, date_recorded);

-- 10. FUNCTIONS
CREATE OR REPLACE FUNCTION public.get_user_availability_for_date(
    target_user_id UUID,
    target_date DATE,
    target_timezone TEXT DEFAULT 'UTC'
)
RETURNS TABLE(
    available_slot_start TIMESTAMPTZ,
    available_slot_end TIMESTAMPTZ,
    buffer_minutes INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT 
    (target_date + ua.start_time) AT TIME ZONE target_timezone AT TIME ZONE 'UTC' as available_slot_start,
    (target_date + ua.end_time) AT TIME ZONE target_timezone AT TIME ZONE 'UTC' as available_slot_end,
    (ua.buffer_before_minutes + ua.buffer_after_minutes) as buffer_minutes
FROM public.user_availability ua
WHERE ua.user_id = target_user_id 
    AND ua.is_available = true
    AND ua.day_of_week = (
        CASE EXTRACT(dow FROM target_date)::INTEGER
            WHEN 0 THEN 'sunday'::public.day_of_week
            WHEN 1 THEN 'monday'::public.day_of_week
            WHEN 2 THEN 'tuesday'::public.day_of_week
            WHEN 3 THEN 'wednesday'::public.day_of_week
            WHEN 4 THEN 'thursday'::public.day_of_week
            WHEN 5 THEN 'friday'::public.day_of_week
            WHEN 6 THEN 'saturday'::public.day_of_week
        END
    )
ORDER BY ua.start_time;
$$;

CREATE OR REPLACE FUNCTION public.calculate_calendar_metrics(
    target_user_id UUID,
    start_date DATE,
    end_date DATE
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    total_scheduled INTEGER;
    total_completed INTEGER;
    total_cancelled INTEGER;
    total_no_show INTEGER;
    avg_duration DECIMAL;
    unique_leads INTEGER;
BEGIN
    -- Get appointment statistics
    SELECT 
        COUNT(*) FILTER (WHERE a.appointment_status = 'scheduled'),
        COUNT(*) FILTER (WHERE a.appointment_status = 'completed'),
        COUNT(*) FILTER (WHERE a.appointment_status = 'cancelled'),
        COUNT(*) FILTER (WHERE a.appointment_status = 'no_show'),
        AVG(a.duration_minutes),
        COUNT(DISTINCT a.lead_id)
    INTO total_scheduled, total_completed, total_cancelled, total_no_show, avg_duration, unique_leads
    FROM public.appointments a
    WHERE a.assigned_to = target_user_id
        AND DATE(a.scheduled_at) BETWEEN start_date AND end_date;

    -- Build result JSON
    result := jsonb_build_object(
        'user_id', target_user_id,
        'period_start', start_date,
        'period_end', end_date,
        'total_scheduled', COALESCE(total_scheduled, 0),
        'total_completed', COALESCE(total_completed, 0),
        'total_cancelled', COALESCE(total_cancelled, 0),
        'total_no_show', COALESCE(total_no_show, 0),
        'average_duration_minutes', COALESCE(avg_duration, 0),
        'unique_leads', COALESCE(unique_leads, 0),
        'completion_rate', CASE 
            WHEN COALESCE(total_scheduled, 0) > 0 
            THEN ROUND(COALESCE(total_completed, 0)::DECIMAL / total_scheduled * 100, 2)
            ELSE 0 
        END
    );

    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_external_calendar(
    connection_uuid UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    connection_record RECORD;
    log_id UUID;
    result JSONB;
BEGIN
    -- Get connection details
    SELECT * INTO connection_record 
    FROM public.calendar_connections 
    WHERE id = connection_uuid AND connection_status = 'connected';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Connection not found or not connected',
            'connection_id', connection_uuid
        );
    END IF;

    -- Create sync log entry
    INSERT INTO public.calendar_sync_logs (connection_id, sync_type, sync_status)
    VALUES (connection_uuid, 'incremental', 'syncing'::public.sync_status)
    RETURNING id INTO log_id;

    -- Update connection sync status
    UPDATE public.calendar_connections 
    SET 
        sync_status = 'syncing'::public.sync_status,
        last_sync_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = connection_uuid;

    -- Simulate sync completion (real implementation would call external APIs)
    UPDATE public.calendar_sync_logs 
    SET 
        sync_status = 'success'::public.sync_status,
        events_synced = 10,
        events_created = 3,
        events_updated = 5,
        events_deleted = 2,
        sync_completed_at = CURRENT_TIMESTAMP
    WHERE id = log_id;

    -- Update connection status
    UPDATE public.calendar_connections 
    SET sync_status = 'success'::public.sync_status
    WHERE id = connection_uuid;

    result := jsonb_build_object(
        'success', true,
        'sync_log_id', log_id,
        'connection_id', connection_uuid,
        'provider', connection_record.provider,
        'events_processed', 10
    );

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- Update log with error
        UPDATE public.calendar_sync_logs 
        SET 
            sync_status = 'failed'::public.sync_status,
            error_details = jsonb_build_object('error', SQLERRM),
            sync_completed_at = CURRENT_TIMESTAMP
        WHERE id = log_id;

        -- Update connection status
        UPDATE public.calendar_connections 
        SET 
            sync_status = 'failed'::public.sync_status,
            error_message = SQLERRM
        WHERE id = connection_uuid;

        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'sync_log_id', log_id
        );
END;
$$;

-- 11. TRIGGERS
CREATE OR REPLACE FUNCTION public.update_calendar_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calendar_connections_updated_at 
BEFORE UPDATE ON public.calendar_connections
FOR EACH ROW EXECUTE FUNCTION public.update_calendar_updated_at_column();

CREATE TRIGGER update_user_availability_updated_at 
BEFORE UPDATE ON public.user_availability
FOR EACH ROW EXECUTE FUNCTION public.update_calendar_updated_at_column();

CREATE TRIGGER update_booking_page_settings_updated_at 
BEFORE UPDATE ON public.booking_page_settings
FOR EACH ROW EXECUTE FUNCTION public.update_calendar_updated_at_column();

CREATE TRIGGER update_appointment_reminders_updated_at 
BEFORE UPDATE ON public.appointment_reminders
FOR EACH ROW EXECUTE FUNCTION public.update_calendar_updated_at_column();

CREATE TRIGGER update_calendar_analytics_updated_at 
BEFORE UPDATE ON public.calendar_analytics
FOR EACH ROW EXECUTE FUNCTION public.update_calendar_updated_at_column();

-- 12. ENABLE RLS
ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_analytics ENABLE ROW LEVEL SECURITY;

-- 13. RLS POLICIES (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_calendar_connections"
ON public.calendar_connections
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_availability"
ON public.user_availability
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_booking_settings"
ON public.booking_page_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_own_sync_logs"
ON public.calendar_sync_logs
FOR SELECT
TO authenticated
USING (
    connection_id IN (
        SELECT id FROM public.calendar_connections 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "users_view_appointment_reminders"
ON public.appointment_reminders
FOR SELECT
TO authenticated
USING (
    appointment_id IN (
        SELECT id FROM public.appointments 
        WHERE assigned_to = auth.uid()
    )
);

CREATE POLICY "users_manage_own_calendar_analytics"
ON public.calendar_analytics
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 14. MOCK DATA - Reference existing user profiles
DO $$
DECLARE
    existing_user_id UUID;
    connection_id UUID;
    booking_settings_id UUID;
    analytics_id UUID;
BEGIN
    -- Get existing user ID from user_profiles
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    IF existing_user_id IS NULL THEN
        RAISE NOTICE 'No existing users found. Please ensure user_profiles table has data.';
        RETURN;
    END IF;

    -- Create calendar connections
    INSERT INTO public.calendar_connections (id, user_id, provider, connection_status, external_account_email, last_sync_at, sync_status, settings)
    VALUES 
        (gen_random_uuid(), existing_user_id, 'cal_com'::public.calendar_provider, 'connected'::public.connection_status, 'user@calcom.example', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'success'::public.sync_status, '{"webhook_enabled": true}'::JSONB),
        (gen_random_uuid(), existing_user_id, 'google_calendar'::public.calendar_provider, 'connected'::public.connection_status, 'user@gmail.example', CURRENT_TIMESTAMP - INTERVAL '1 hour', 'success'::public.sync_status, '{"calendar_id": "primary"}'::JSONB),
        (gen_random_uuid(), existing_user_id, 'outlook'::public.calendar_provider, 'disconnected'::public.connection_status, 'user@outlook.example', NULL, 'pending'::public.sync_status, '{}'::JSONB)
    RETURNING id INTO connection_id;

    -- Create availability schedule
    INSERT INTO public.user_availability (user_id, day_of_week, start_time, end_time, is_available, timezone)
    VALUES 
        (existing_user_id, 'monday'::public.day_of_week, '09:00'::TIME, '17:00'::TIME, true, 'America/New_York'),
        (existing_user_id, 'tuesday'::public.day_of_week, '09:00'::TIME, '17:00'::TIME, true, 'America/New_York'),
        (existing_user_id, 'wednesday'::public.day_of_week, '09:00'::TIME, '17:00'::TIME, true, 'America/New_York'),
        (existing_user_id, 'thursday'::public.day_of_week, '09:00'::TIME, '17:00'::TIME, true, 'America/New_York'),
        (existing_user_id, 'friday'::public.day_of_week, '09:00'::TIME, '15:00'::TIME, true, 'America/New_York'),
        (existing_user_id, 'saturday'::public.day_of_week, '10:00'::TIME, '14:00'::TIME, false, 'America/New_York'),
        (existing_user_id, 'sunday'::public.day_of_week, '10:00'::TIME, '14:00'::TIME, false, 'America/New_York');

    -- Create booking page settings
    INSERT INTO public.booking_page_settings (id, user_id, page_title, page_description, booking_status, default_duration_minutes, min_notice_hours, max_advance_days, allowed_duration_options, custom_questions, branding_settings, notification_settings)
    VALUES (
        gen_random_uuid(),
        existing_user_id,
        'Schedule a Sales Consultation',
        'Book a personalized consultation to discuss your business needs and explore our solutions.',
        'enabled'::public.booking_status,
        45,
        24,
        30,
        ARRAY[30, 45, 60],
        '[{"id": 1, "question": "What is your company size?", "type": "select", "options": ["1-10", "11-50", "51-200", "200+"], "required": true}]'::JSONB,
        '{"primary_color": "#3B82F6", "logo_url": "/images/company-logo.png"}'::JSONB,
        '{"send_confirmation": true, "send_reminder": true, "reminder_hours_before": 24}'::JSONB
    )
    RETURNING id INTO booking_settings_id;

    -- Create sync logs
    INSERT INTO public.calendar_sync_logs (connection_id, sync_type, sync_status, events_synced, events_created, events_updated, sync_started_at, sync_completed_at)
    VALUES 
        (connection_id, 'full', 'success'::public.sync_status, 25, 5, 15, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours 45 minutes'),
        (connection_id, 'incremental', 'success'::public.sync_status, 8, 3, 4, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '55 minutes');

    -- Create calendar analytics
    INSERT INTO public.calendar_analytics (id, user_id, date_recorded, appointments_scheduled, appointments_completed, appointments_cancelled, appointments_no_show, total_booking_duration_minutes, unique_leads_booked, conversion_rate, avg_booking_time_hours)
    VALUES 
        (gen_random_uuid(), existing_user_id, CURRENT_DATE, 8, 6, 1, 1, 360, 7, 0.8750, 48.5),
        (gen_random_uuid(), existing_user_id, CURRENT_DATE - INTERVAL '1 day', 12, 10, 1, 1, 540, 11, 0.9167, 36.2),
        (gen_random_uuid(), existing_user_id, CURRENT_DATE - INTERVAL '2 days', 6, 5, 0, 1, 270, 6, 1.0000, 24.8);

    RAISE NOTICE 'Calendar integration data created successfully for user: %', existing_user_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating calendar integration data: %', SQLERRM;
END $$;