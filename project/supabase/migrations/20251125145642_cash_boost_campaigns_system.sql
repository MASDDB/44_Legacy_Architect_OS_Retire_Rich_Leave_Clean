/*
  # Cash-Boost Mission System

  1. New Tables
    - `cash_boost_campaigns`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `campaign_type` (text: reactivation, high_value_followup, maintenance_membership)
      - `audience_size` (integer)
      - `audience_filters` (jsonb: filter configuration)
      - `offer_details` (jsonb: service, pricing, expiry, notes)
      - `pricing_mode` (text: included_plan, performance)
      - `performance_rate` (decimal: percentage if performance mode)
      - `message_sms` (text)
      - `message_email` (text, nullable)
      - `status` (text: draft, active, paused, completed, cancelled)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `contacts_messaged` (integer, default 0)
      - `replies_count` (integer, default 0)
      - `jobs_booked` (integer, default 0)
      - `jobs_completed` (integer, default 0)
      - `total_revenue` (decimal, default 0)
      - `performance_fee_amount` (decimal, default 0)
      - `performance_fee_billed` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cash_boost_revenue_events`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, references cash_boost_campaigns)
      - `lead_id` (uuid, references leads, nullable)
      - `job_value` (decimal)
      - `collected_at` (timestamptz)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own campaigns and revenue events
    - Super admins can view all data
*/

-- Create cash_boost_campaigns table
CREATE TABLE IF NOT EXISTS public.cash_boost_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_type text NOT NULL CHECK (campaign_type IN ('reactivation', 'high_value_followup', 'maintenance_membership')),
  audience_size integer NOT NULL DEFAULT 0,
  audience_filters jsonb DEFAULT '{}'::jsonb,
  offer_details jsonb DEFAULT '{}'::jsonb,
  pricing_mode text NOT NULL CHECK (pricing_mode IN ('included_plan', 'performance')),
  performance_rate decimal(5,2) DEFAULT 0,
  message_sms text NOT NULL,
  message_email text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  start_date timestamptz,
  end_date timestamptz,
  contacts_messaged integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  jobs_booked integer DEFAULT 0,
  jobs_completed integer DEFAULT 0,
  total_revenue decimal(12,2) DEFAULT 0,
  performance_fee_amount decimal(12,2) DEFAULT 0,
  performance_fee_billed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cash_boost_revenue_events table
CREATE TABLE IF NOT EXISTS public.cash_boost_revenue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.cash_boost_campaigns(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  job_value decimal(12,2) NOT NULL,
  collected_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_cash_boost_campaigns_user_id 
  ON public.cash_boost_campaigns(user_id);

CREATE INDEX IF NOT EXISTS idx_cash_boost_campaigns_status 
  ON public.cash_boost_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_cash_boost_campaigns_start_date 
  ON public.cash_boost_campaigns(start_date);

CREATE INDEX IF NOT EXISTS idx_cash_boost_revenue_events_campaign_id 
  ON public.cash_boost_revenue_events(campaign_id);

CREATE INDEX IF NOT EXISTS idx_cash_boost_revenue_events_lead_id 
  ON public.cash_boost_revenue_events(lead_id);

CREATE INDEX IF NOT EXISTS idx_cash_boost_revenue_events_created_by 
  ON public.cash_boost_revenue_events(created_by);

-- Enable Row Level Security
ALTER TABLE public.cash_boost_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_boost_revenue_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cash_boost_campaigns
CREATE POLICY "Users can view own campaigns"
  ON public.cash_boost_campaigns
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Users can create own campaigns"
  ON public.cash_boost_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON public.cash_boost_campaigns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON public.cash_boost_campaigns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for cash_boost_revenue_events
CREATE POLICY "Users can view own revenue events"
  ON public.cash_boost_revenue_events
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.cash_boost_campaigns
      WHERE cash_boost_campaigns.id = campaign_id
      AND cash_boost_campaigns.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Users can create revenue events for own campaigns"
  ON public.cash_boost_revenue_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.cash_boost_campaigns
      WHERE cash_boost_campaigns.id = campaign_id
      AND cash_boost_campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own revenue events"
  ON public.cash_boost_revenue_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own revenue events"
  ON public.cash_boost_revenue_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create function to update campaign totals when revenue events change
CREATE OR REPLACE FUNCTION update_cash_boost_campaign_totals()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update campaign totals
  UPDATE public.cash_boost_campaigns
  SET 
    total_revenue = (
      SELECT COALESCE(SUM(job_value), 0)
      FROM public.cash_boost_revenue_events
      WHERE campaign_id = COALESCE(NEW.campaign_id, OLD.campaign_id)
    ),
    performance_fee_amount = CASE 
      WHEN pricing_mode = 'performance' THEN
        (SELECT COALESCE(SUM(job_value), 0) * (performance_rate / 100)
         FROM public.cash_boost_revenue_events
         WHERE campaign_id = COALESCE(NEW.campaign_id, OLD.campaign_id))
      ELSE 0
    END,
    updated_at = now()
  WHERE id = COALESCE(NEW.campaign_id, OLD.campaign_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for revenue event changes
DROP TRIGGER IF EXISTS trigger_update_cash_boost_totals ON public.cash_boost_revenue_events;
CREATE TRIGGER trigger_update_cash_boost_totals
  AFTER INSERT OR UPDATE OR DELETE ON public.cash_boost_revenue_events
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_boost_campaign_totals();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cash_boost_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_cash_boost_campaigns_updated_at ON public.cash_boost_campaigns;
CREATE TRIGGER trigger_cash_boost_campaigns_updated_at
  BEFORE UPDATE ON public.cash_boost_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_boost_updated_at();
