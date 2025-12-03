-- Location: supabase/migrations/20250104211641_crm_system.sql
-- CRM System Database Schema for Lead Management, Campaigns, and Analytics

-- 1. Custom Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'sales_rep', 'viewer');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE public.lead_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE public.campaign_type AS ENUM ('email', 'sms', 'phone', 'social', 'direct_mail');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.compliance_status AS ENUM ('compliant', 'warning', 'violation', 'pending_review');

-- 2. Core Tables

-- User profiles (intermediary table for auth integration)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'sales_rep'::public.user_role,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Companies/Accounts
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    company_size TEXT,
    annual_revenue DECIMAL(15,2),
    owner_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Leads
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company_id UUID REFERENCES public.companies(id),
    job_title TEXT,
    lead_source TEXT,
    lead_status public.lead_status DEFAULT 'new'::public.lead_status,
    priority public.lead_priority DEFAULT 'medium'::public.lead_priority,
    estimated_value DECIMAL(12,2),
    assigned_to UUID REFERENCES public.user_profiles(id),
    last_contacted TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    campaign_type public.campaign_type NOT NULL,
    campaign_status public.campaign_status DEFAULT 'draft'::public.campaign_status,
    target_audience TEXT,
    message_template TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Campaign leads (many-to-many)
CREATE TABLE public.campaign_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    response_type TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, lead_id)
);

-- Appointments
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    lead_id UUID REFERENCES public.leads(id),
    assigned_to UUID REFERENCES public.user_profiles(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    appointment_status public.appointment_status DEFAULT 'scheduled'::public.appointment_status,
    meeting_location TEXT,
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Lead activities/interactions
CREATE TABLE public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT,
    performed_by UUID REFERENCES public.user_profiles(id),
    activity_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Compliance tracking
CREATE TABLE public.compliance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'campaign', 'lead', 'message'
    entity_id UUID NOT NULL,
    compliance_status public.compliance_status DEFAULT 'pending_review'::public.compliance_status,
    violation_type TEXT,
    description TEXT,
    reviewed_by UUID REFERENCES public.user_profiles(id),
    reviewed_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes for Performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_company_id ON public.leads(company_id);
CREATE INDEX idx_leads_status ON public.leads(lead_status);
CREATE INDEX idx_leads_priority ON public.leads(priority);
CREATE INDEX idx_leads_next_follow_up ON public.leads(next_follow_up);
CREATE INDEX idx_campaigns_created_by ON public.campaigns(created_by);
CREATE INDEX idx_campaigns_status ON public.campaigns(campaign_status);
CREATE INDEX idx_campaign_leads_campaign_id ON public.campaign_leads(campaign_id);
CREATE INDEX idx_campaign_leads_lead_id ON public.campaign_leads(lead_id);
CREATE INDEX idx_appointments_assigned_to ON public.appointments(assigned_to);
CREATE INDEX idx_appointments_lead_id ON public.appointments(lead_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_performed_by ON public.lead_activities(performed_by);
CREATE INDEX idx_compliance_records_entity ON public.compliance_records(entity_type, entity_id);

-- 4. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
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
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for companies
CREATE POLICY "users_manage_own_companies"
ON public.companies
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Pattern 2: Simple user ownership for leads
CREATE POLICY "users_manage_assigned_leads"
ON public.leads
FOR ALL
TO authenticated
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());

-- Pattern 2: Simple user ownership for campaigns
CREATE POLICY "users_manage_own_campaigns"
ON public.campaigns
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Pattern 2: Campaign leads access based on campaign ownership
CREATE POLICY "users_manage_own_campaign_leads"
ON public.campaign_leads
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c 
    WHERE c.id = campaign_leads.campaign_id 
    AND c.created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns c 
    WHERE c.id = campaign_leads.campaign_id 
    AND c.created_by = auth.uid()
  )
);

-- Pattern 2: Simple user ownership for appointments
CREATE POLICY "users_manage_own_appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());

-- Pattern 2: Lead activities access based on lead ownership
CREATE POLICY "users_manage_own_lead_activities"
ON public.lead_activities
FOR ALL
TO authenticated
USING (performed_by = auth.uid())
WITH CHECK (performed_by = auth.uid());

-- Pattern 2: Simple user ownership for compliance records
CREATE POLICY "users_manage_own_compliance_records"
ON public.compliance_records
FOR ALL
TO authenticated
USING (reviewed_by = auth.uid())
WITH CHECK (reviewed_by = auth.uid());

-- 7. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Mock Data for CRM System
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    sales_rep_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    company1_id UUID := gen_random_uuid();
    company2_id UUID := gen_random_uuid();
    lead1_id UUID := gen_random_uuid();
    lead2_id UUID := gen_random_uuid();
    lead3_id UUID := gen_random_uuid();
    campaign1_id UUID := gen_random_uuid();
    campaign2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@crm-demo.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "CRM Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (sales_rep_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sales@crm-demo.com', crypt('sales123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sales Representative", "role": "sales_rep"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@crm-demo.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sales Manager", "role": "manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert companies
    INSERT INTO public.companies (id, name, industry, website, phone, email, address, city, state, zip_code, company_size, annual_revenue, owner_id)
    VALUES
        (company1_id, 'Tech Solutions Inc', 'Software', 'https://techsolutions.com', '555-0123', 'info@techsolutions.com', '123 Tech Street', 'San Francisco', 'CA', '94105', '50-200', 2500000.00, admin_uuid),
        (company2_id, 'Digital Marketing Pro', 'Marketing', 'https://digitalmarketing.com', '555-0456', 'hello@digitalmarketing.com', '456 Marketing Ave', 'Austin', 'TX', '73301', '10-50', 850000.00, manager_uuid);

    -- Insert leads
    INSERT INTO public.leads (id, first_name, last_name, email, phone, company_id, job_title, lead_source, lead_status, priority, estimated_value, assigned_to, next_follow_up, notes, tags)
    VALUES
        (lead1_id, 'John', 'Smith', 'john.smith@techsolutions.com', '555-0789', company1_id, 'CTO', 'Website', 'qualified'::public.lead_status, 'high'::public.lead_priority, 45000.00, sales_rep_uuid, CURRENT_TIMESTAMP + INTERVAL '2 days', 'Very interested in our enterprise solution', ARRAY['enterprise', 'hot-lead']),
        (lead2_id, 'Sarah', 'Johnson', 'sarah@digitalmarketing.com', '555-0321', company2_id, 'Marketing Director', 'Referral', 'contacted'::public.lead_status, 'medium'::public.lead_priority, 25000.00, sales_rep_uuid, CURRENT_TIMESTAMP + INTERVAL '5 days', 'Needs more information about pricing', ARRAY['marketing', 'referral']),
        (lead3_id, 'Mike', 'Wilson', 'mike.wilson@startup.com', '555-0654', null, 'Founder', 'LinkedIn', 'new'::public.lead_status, 'urgent'::public.lead_priority, 75000.00, admin_uuid, CURRENT_TIMESTAMP + INTERVAL '1 day', 'Hot startup lead - moving fast', ARRAY['startup', 'urgent']);

    -- Insert campaigns
    INSERT INTO public.campaigns (id, name, description, campaign_type, campaign_status, target_audience, message_template, start_date, end_date, budget, created_by)
    VALUES
        (campaign1_id, 'Q4 Enterprise Outreach', 'Targeting enterprise customers for end-of-year deals', 'email'::public.campaign_type, 'active'::public.campaign_status, 'Enterprise CTOs and IT Directors', 'Hi {{first_name}}, looking to close out the year strong with our enterprise solution...', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days', 15000.00, admin_uuid),
        (campaign2_id, 'SMB Marketing Campaign', 'Small and medium business marketing automation campaign', 'sms'::public.campaign_type, 'completed'::public.campaign_status, 'SMB Marketing Directors', 'Hi {{first_name}}, check out how we can automate your marketing...', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '10 days', 8000.00, manager_uuid);

    -- Insert campaign leads
    INSERT INTO public.campaign_leads (campaign_id, lead_id, sent_at, delivered_at, opened_at, clicked_at)
    VALUES
        (campaign1_id, lead1_id, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '24 days', CURRENT_TIMESTAMP - INTERVAL '23 days'),
        (campaign2_id, lead2_id, CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '44 days', null);

    -- Insert appointments
    INSERT INTO public.appointments (title, description, lead_id, assigned_to, scheduled_at, duration_minutes, appointment_status, meeting_link, notes)
    VALUES
        ('Enterprise Demo - Tech Solutions', 'Product demonstration for enterprise features', lead1_id, sales_rep_uuid, CURRENT_TIMESTAMP + INTERVAL '3 days', 90, 'scheduled'::public.appointment_status, 'https://meet.google.com/demo-123', 'Prepare enterprise feature deck'),
        ('Follow-up Call - Digital Marketing', 'Pricing discussion and next steps', lead2_id, sales_rep_uuid, CURRENT_TIMESTAMP + INTERVAL '6 days', 60, 'confirmed'::public.appointment_status, 'https://zoom.us/meeting/456', 'Have pricing sheet ready'),
        ('Discovery Call - Startup', 'Initial discovery call with startup founder', lead3_id, admin_uuid, CURRENT_TIMESTAMP + INTERVAL '1 day', 45, 'scheduled'::public.appointment_status, 'https://meet.google.com/startup-789', 'Focus on scalability needs');

    -- Insert lead activities
    INSERT INTO public.lead_activities (lead_id, activity_type, description, performed_by, activity_date, metadata)
    VALUES
        (lead1_id, 'email_sent', 'Sent follow-up email after initial contact', sales_rep_uuid, CURRENT_TIMESTAMP - INTERVAL '5 days', '{"email_subject": "Following up on our conversation", "template_id": "follow-up-1"}'::jsonb),
        (lead1_id, 'call_completed', 'Had 30-minute discovery call', sales_rep_uuid, CURRENT_TIMESTAMP - INTERVAL '7 days', '{"call_duration": 30, "outcome": "positive", "next_step": "schedule_demo"}'::jsonb),
        (lead2_id, 'email_opened', 'Opened marketing campaign email', sales_rep_uuid, CURRENT_TIMESTAMP - INTERVAL '44 days', '{"campaign_id": "campaign2_id", "open_count": 2}'::jsonb),
        (lead3_id, 'lead_created', 'New lead from LinkedIn', admin_uuid, CURRENT_TIMESTAMP - INTERVAL '2 days', '{"source": "linkedin", "campaign": "organic"}'::jsonb);

    -- Insert compliance records
    INSERT INTO public.compliance_records (entity_type, entity_id, compliance_status, description, reviewed_by, reviewed_at)
    VALUES
        ('campaign', campaign1_id, 'compliant'::public.compliance_status, 'Campaign reviewed for CAN-SPAM compliance', admin_uuid, CURRENT_TIMESTAMP - INTERVAL '20 days'),
        ('campaign', campaign2_id, 'compliant'::public.compliance_status, 'SMS campaign follows TCPA guidelines', manager_uuid, CURRENT_TIMESTAMP - INTERVAL '40 days');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;