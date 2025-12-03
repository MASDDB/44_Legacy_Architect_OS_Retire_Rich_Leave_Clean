-- Fix Function Search Path Security Warning
-- Addresses Supabase security linter warnings about mutable search_path in functions

-- =============================================================================
-- SECURITY FIX: Add SET search_path = '' to all functions to prevent
-- search_path hijacking attacks as recommended by Supabase security guidelines
-- =============================================================================

-- 1. Trigger Functions (DB Utility Functions)
CREATE OR REPLACE FUNCTION public.sync_full_name()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    -- Auto-update full_name when first_name or last_name changes
    IF NEW.first_name IS NOT NULL OR NEW.last_name IS NOT NULL THEN
        NEW.full_name = TRIM(COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, ''));
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'sales_rep'::public.user_role)
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_sms_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_email_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_calendar_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_lead_score_on_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_engagement_summary_on_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.lead_engagement_summary (lead_id, last_activity_date)
    VALUES (NEW.lead_id, NEW.activity_date)
    ON CONFLICT (lead_id) DO UPDATE SET
        last_activity_date = GREATEST(lead_engagement_summary.last_activity_date, NEW.activity_date),
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$function$;

-- 2. Security Functions
CREATE OR REPLACE FUNCTION public.can_access_campaign_data(p_campaign_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
SELECT EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = p_campaign_id AND c.created_by = auth.uid()
)
$function$;

CREATE OR REPLACE FUNCTION public.can_access_lead_data(lead_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
SELECT EXISTS (
    SELECT 1 FROM public.leads l
    WHERE l.id = lead_uuid AND l.assigned_to = auth.uid()
)
$function$;

-- 3. Email & Authentication Functions
CREATE OR REPLACE FUNCTION public.check_email_confirmation_status(user_email text)
 RETURNS TABLE(user_id uuid, email text, email_confirmed_at timestamp with time zone, is_confirmed boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Only allow checking confirmation status for the current authenticated user
  -- This prevents unauthorized access to other users' data
  IF auth.email() != user_email AND NOT (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'super_admin'::public.user_role
    )
  ) THEN
    RAISE EXCEPTION 'Permission denied: Can only check your own email status';
  END IF;

  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email,
    au.email_confirmed_at,
    (au.email_confirmed_at IS NOT NULL) as is_confirmed
  FROM auth.users au
  WHERE au.email = user_email;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_email_status()
 RETURNS TABLE(user_id uuid, email text, email_confirmed_at timestamp with time zone, is_confirmed boolean, needs_confirmation boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email,
    au.email_confirmed_at,
    (au.email_confirmed_at IS NOT NULL) as is_confirmed,
    (au.email_confirmed_at IS NULL) as needs_confirmation
  FROM auth.users au
  WHERE au.id = auth.uid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_email_confirmation_reminder()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    current_user_id UUID;
    is_confirmed BOOLEAN;
BEGIN
    -- Get current user info
    SELECT auth.uid() INTO current_user_id;
    
    -- Check if email is already confirmed
    SELECT (au.email_confirmed_at IS NOT NULL)
    INTO is_confirmed
    FROM auth.users au
    WHERE au.id = current_user_id;
    
    -- If already confirmed, no need for reminder
    IF is_confirmed THEN
        RETURN FALSE;
    END IF;
    
    -- Create or update reminder record
    INSERT INTO public.email_confirmation_reminders (user_id, reminder_count, last_reminder_sent)
    VALUES (current_user_id, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        reminder_count = email_confirmation_reminders.reminder_count + 1,
        last_reminder_sent = NOW(),
        updated_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Failed to create email confirmation reminder: %', SQLERRM;
        RETURN FALSE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.send_email_notification(recipient_email_param text, recipient_name_param text, subject_param text, html_body_param text, text_body_param text DEFAULT NULL::text, notification_type_param email_notification_type DEFAULT 'campaign_email'::email_notification_type, template_id_param uuid DEFAULT NULL::uuid, related_entity_id_param uuid DEFAULT NULL::uuid, related_entity_type_param text DEFAULT NULL::text, metadata_param jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- 4. Campaign & Analytics Functions
CREATE OR REPLACE FUNCTION public.calculate_campaign_metrics(p_campaign_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.analyze_ab_test_results(p_campaign_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- 5. Lead Scoring Functions
CREATE OR REPLACE FUNCTION public.calculate_behavioral_score(lead_uuid uuid)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_engagement_score(lead_uuid uuid)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_fit_score(lead_uuid uuid)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_overall_lead_score(lead_uuid uuid, scoring_model_uuid uuid DEFAULT NULL::uuid)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_lead_score_category(score numeric)
 RETURNS lead_score_category
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- 6. User Management Functions
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get user ID from user_profiles table (NOT from public.users - that table doesn't exist)
    SELECT id INTO user_uuid 
    FROM public.user_profiles 
    WHERE email = user_email AND is_active = true
    LIMIT 1;
    
    RETURN user_uuid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.promote_user_to_super_admin(user_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    affected_rows INTEGER;
    user_uuid UUID;
BEGIN
    -- Get the user ID
    SELECT get_user_id_by_email(user_email) INTO user_uuid;
    
    IF user_uuid IS NULL THEN
        RETURN 'ERROR: User not found with email: ' || user_email;
    END IF;
    
    -- Update the user role to super_admin
    UPDATE public.user_profiles 
    SET role = 'super_admin'::public.user_role,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_uuid;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    IF affected_rows > 0 THEN
        RETURN 'SUCCESS: User ' || user_email || ' promoted to super_admin';
    ELSE
        RETURN 'ERROR: Failed to update user ' || user_email;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.list_super_admin_users()
 RETURNS TABLE(user_id uuid, email text, full_name text, role text, is_active boolean, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.email,
        up.full_name,
        up.role::TEXT,
        up.is_active,
        up.created_at
    FROM public.user_profiles up 
    WHERE up.role = 'super_admin'::public.user_role
    ORDER BY up.created_at DESC;
END;
$function$;

-- 7. Demo & Testing Functions
CREATE OR REPLACE FUNCTION public.create_demo_auth_users()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    result jsonb := '{"created": [], "errors": []}'::jsonb;
    demo_user record;
    user_id uuid;
BEGIN
    -- Loop through user_profiles that don't have corresponding auth.users
    FOR demo_user IN 
        SELECT up.id, up.email, up.full_name, up.role
        FROM user_profiles up
        LEFT JOIN auth.users au ON up.email = au.email
        WHERE au.id IS NULL
        AND up.email IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    LOOP
        BEGIN
            -- Note: This is a placeholder function
            -- In real implementation, users must be created through:
            -- 1. Supabase Auth API (recommended)
            -- 2. Admin dashboard
            -- 3. Sign-up process
            
            result := jsonb_set(
                result, 
                '{created}', 
                result->'created' || jsonb_build_object(
                    'email', demo_user.email,
                    'user_id', demo_user.id,
                    'note', 'Please create this user through Supabase Auth API or dashboard'
                )
            );
            
        EXCEPTION WHEN others THEN
            result := jsonb_set(
                result, 
                '{errors}', 
                result->'errors' || jsonb_build_object(
                    'email', demo_user.email,
                    'error', SQLERRM
                )
            );
        END;
    END LOOP;
    
    RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_demo_users_auth_status()
 RETURNS TABLE(email text, has_profile boolean, has_auth_user boolean, profile_id uuid, auth_user_id uuid, status text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(up.email, au.email) as email,
        (up.id IS NOT NULL) as has_profile,
        (au.id IS NOT NULL) as has_auth_user,
        up.id as profile_id,
        au.id as auth_user_id,
        CASE 
            WHEN up.id IS NOT NULL AND au.id IS NOT NULL THEN 'complete'
            WHEN up.id IS NOT NULL AND au.id IS NULL THEN 'missing_auth_user'
            WHEN up.id IS NULL AND au.id IS NOT NULL THEN 'missing_profile'
            ELSE 'unknown'
        END as status
    FROM user_profiles up
    FULL OUTER JOIN auth.users au ON up.email = au.email
    WHERE COALESCE(up.email, au.email) IN ('admin@crm-demo.com', 'sales@crm-demo.com')
    ORDER BY email;
END;
$function$;

-- 8. Calendar Functions
CREATE OR REPLACE FUNCTION public.get_user_availability_for_date(target_user_id uuid, target_date date, target_timezone text DEFAULT 'UTC'::text)
 RETURNS TABLE(available_slot_start timestamp with time zone, available_slot_end timestamp with time zone, buffer_minutes integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_calendar_metrics(target_user_id uuid, start_date date, end_date date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.sync_external_calendar(connection_uuid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- 9. Admin & System Functions
CREATE OR REPLACE FUNCTION public.get_active_sessions_count()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    current_user_role public.user_role;
    active_sessions INTEGER := 0;
    total_users INTEGER := 0;
BEGIN
    -- Check if current user is super_admin
    SELECT role INTO current_user_role
    FROM public.user_profiles 
    WHERE id = auth.uid();
    
    IF current_user_role IS NULL OR current_user_role != 'super_admin'::public.user_role THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Access denied: Super admin privileges required'
        );
    END IF;
    
    -- Get active sessions count using correct Supabase auth.sessions schema
    -- Use 'not_after' instead of 'expires_at' for session expiration check
    SELECT COUNT(DISTINCT user_id) INTO active_sessions
    FROM auth.sessions 
    WHERE not_after > CURRENT_TIMESTAMP;
    
    -- Get total users count
    SELECT COUNT(*) INTO total_users
    FROM public.user_profiles
    WHERE id IS NOT NULL;
    
    RETURN jsonb_build_object(
        'success', true,
        'active_sessions', active_sessions,
        'total_users', total_users,
        'timestamp', CURRENT_TIMESTAMP
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'System error occurred: ' || SQLERRM
        );
END;
$function$;

CREATE OR REPLACE FUNCTION public.logout_all_users()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    current_user_role public.user_role;
    affected_sessions INTEGER := 0;
    result jsonb;
BEGIN
    -- Check if current user is super_admin
    SELECT role INTO current_user_role
    FROM public.user_profiles 
    WHERE id = auth.uid();
    
    IF current_user_role IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'User profile not found'
        );
    END IF;
    
    IF current_user_role != 'super_admin'::public.user_role THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Access denied: Super admin privileges required'
        );
    END IF;
    
    -- Get count of active sessions before logout
    SELECT COUNT(*) INTO affected_sessions
    FROM auth.sessions 
    WHERE NOT (user_id = auth.uid()); -- Don't count current user's session
    
    -- Log out all users except current super admin
    -- This effectively deletes all sessions except the current user's
    DELETE FROM auth.sessions 
    WHERE NOT (user_id = auth.uid());
    
    -- Build success response
    result := jsonb_build_object(
        'success', true,
        'message', 'All users have been logged out successfully',
        'affected_sessions', affected_sessions,
        'timestamp', CURRENT_TIMESTAMP
    );
    
    -- Log the admin action
    INSERT INTO public.lead_activities (
        lead_id, 
        performed_by, 
        activity_type, 
        description, 
        created_at
    )
    SELECT 
        NULL, -- No specific lead for this system action
        auth.uid(),
        'system_admin',
        'Super admin logged out all users - Sessions affected: ' || affected_sessions,
        CURRENT_TIMESTAMP;
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'System error occurred: ' || SQLERRM
        );
END;
$function$;

-- 10. SMS Functions
CREATE OR REPLACE FUNCTION public.update_sms_status(p_message_id uuid, p_twilio_sid text, p_status text, p_error_message text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.send_campaign_sms(p_campaign_id uuid, p_lead_id uuid, p_message text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- =============================================================================
-- MIGRATION COMPLETE
-- All 33 functions have been updated with SET search_path = '' 
-- to address Supabase security linter warnings about mutable search_path
-- =============================================================================

-- Add comment for documentation
COMMENT ON SCHEMA public IS 'Updated all functions with SET search_path = '''' for security compliance - 2025-09-13';