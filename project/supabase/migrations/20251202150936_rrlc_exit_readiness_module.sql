/*
  # RRLC Exit Readiness Module

  1. New Tables
    - `rrlc_email_captures` - Step 1 opt-in: email collection
    - `rrlc_sms_consents` - Step 2 opt-in: TCPA-compliant SMS consent
    - `rrlc_assessment_submissions` - Complete assessment data with calculated scores
    - `rrlc_businesses` - Business profiles for exit readiness tracking
    - `rrlc_data_room_folders` - Folders 0-10 structure for M&A data rooms
    - `rrlc_documents` - Document management with version tracking
    - `rrlc_financial_records` - P&L and balance sheet data
    - `rrlc_ebitda_addbacks` - Legitimate add-back documentation
    - `rrlc_kpi_metrics` - KPI tracking with historical data
    - `rrlc_contracts` - Contract index with change-of-control flags
    - `rrlc_rfis` - Request for Information tracking
    - `rrlc_working_capital_records` - Working capital calculations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add indexes for performance optimization

  3. Notes
    - All tables prefixed with `rrlc_` to avoid conflicts with existing Legacy Architect OS tables
    - Foreign keys link to auth.users via user_id
    - Timestamps (created_at, updated_at) on all tables
*/

-- Create custom types for RRLC module
CREATE TYPE rrlc_assessment_status AS ENUM ('incomplete', 'complete', 'reviewed');
CREATE TYPE rrlc_document_status AS ENUM ('pending', 'uploaded', 'approved', 'rejected');
CREATE TYPE rrlc_rfi_status AS ENUM ('not_started', 'in_progress', 'complete', 'blocked');
CREATE TYPE rrlc_rfi_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE rrlc_contract_risk AS ENUM ('low', 'medium', 'high');

-- 1. Email Captures (Step 1 of assessment)
CREATE TABLE IF NOT EXISTS public.rrlc_email_captures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'assessment',
    captured_at TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SMS Consents (Step 2 of assessment - TCPA compliant)
CREATE TABLE IF NOT EXISTS public.rrlc_sms_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_capture_id UUID REFERENCES public.rrlc_email_captures(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    consent_given BOOLEAN DEFAULT false,
    consent_text TEXT NOT NULL,
    consent_timestamp TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT,
    opt_out_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Assessment Submissions (Complete assessment with scores)
CREATE TABLE IF NOT EXISTS public.rrlc_assessment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_capture_id UUID REFERENCES public.rrlc_email_captures(id),

    -- Business Basics (Step 1)
    business_name TEXT,
    industry TEXT,
    years_in_business INTEGER,
    annual_revenue DECIMAL(15,2),
    employee_count INTEGER,

    -- Financial Metrics (Step 2)
    revenue_growth_rate DECIMAL(5,2),
    gross_margin DECIMAL(5,2),
    ebitda_margin DECIMAL(5,2),
    customer_concentration DECIMAL(5,2),
    recurring_revenue_percentage DECIMAL(5,2),

    -- Operational Readiness (Step 3)
    has_financial_statements BOOLEAN DEFAULT false,
    has_clean_books BOOLEAN DEFAULT false,
    has_documented_processes BOOLEAN DEFAULT false,
    has_management_team BOOLEAN DEFAULT false,
    has_customer_contracts BOOLEAN DEFAULT false,
    has_ip_documentation BOOLEAN DEFAULT false,

    -- Calculated Scores
    overall_exit_score INTEGER NOT NULL,
    financial_score INTEGER,
    operational_score INTEGER,
    market_score INTEGER,
    valuation_multiple_low DECIMAL(5,2),
    valuation_multiple_high DECIMAL(5,2),
    estimated_valuation_low DECIMAL(15,2),
    estimated_valuation_high DECIMAL(15,2),

    -- Assessment metadata
    assessment_status rrlc_assessment_status DEFAULT 'complete',
    completed_at TIMESTAMPTZ DEFAULT now(),
    raw_answers JSONB,
    recommendations JSONB,
    action_plan JSONB,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Businesses (Exit readiness tracking)
CREATE TABLE IF NOT EXISTS public.rrlc_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.rrlc_assessment_submissions(id),

    business_name TEXT NOT NULL,
    legal_entity_name TEXT,
    ein TEXT,
    incorporation_date DATE,
    business_address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',

    industry TEXT,
    sub_industry TEXT,
    business_description TEXT,
    website TEXT,

    -- Current metrics
    current_exit_score INTEGER,
    data_room_completion_percentage DECIMAL(5,2) DEFAULT 0,
    last_assessment_date TIMESTAMPTZ,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Data Room Folders (Folders 0-10 for M&A)
CREATE TABLE IF NOT EXISTS public.rrlc_data_room_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    folder_number INTEGER NOT NULL CHECK (folder_number >= 0 AND folder_number <= 10),
    folder_name TEXT NOT NULL,
    folder_description TEXT,

    completion_percentage DECIMAL(5,2) DEFAULT 0,
    document_count INTEGER DEFAULT 0,
    required_document_count INTEGER DEFAULT 0,

    is_complete BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(business_id, folder_number)
);

-- 6. Documents (File management)
CREATE TABLE IF NOT EXISTS public.rrlc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.rrlc_data_room_folders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    document_name TEXT NOT NULL,
    document_type TEXT,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,

    document_status rrlc_document_status DEFAULT 'uploaded',
    version INTEGER DEFAULT 1,
    previous_version_id UUID REFERENCES public.rrlc_documents(id),

    description TEXT,
    tags TEXT[],

    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Financial Records (P&L, Balance Sheet)
CREATE TABLE IF NOT EXISTS public.rrlc_financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    fiscal_year INTEGER NOT NULL,
    fiscal_period TEXT,

    -- Income Statement
    revenue DECIMAL(15,2),
    cost_of_goods_sold DECIMAL(15,2),
    gross_profit DECIMAL(15,2),
    operating_expenses DECIMAL(15,2),
    ebitda DECIMAL(15,2),
    depreciation DECIMAL(15,2),
    amortization DECIMAL(15,2),
    interest_expense DECIMAL(15,2),
    taxes DECIMAL(15,2),
    net_income DECIMAL(15,2),

    -- Balance Sheet
    total_assets DECIMAL(15,2),
    current_assets DECIMAL(15,2),
    fixed_assets DECIMAL(15,2),
    total_liabilities DECIMAL(15,2),
    current_liabilities DECIMAL(15,2),
    long_term_debt DECIMAL(15,2),
    equity DECIMAL(15,2),

    -- Cash Flow
    operating_cash_flow DECIMAL(15,2),
    investing_cash_flow DECIMAL(15,2),
    financing_cash_flow DECIMAL(15,2),

    notes TEXT,
    is_audited BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(business_id, fiscal_year, fiscal_period)
);

-- 8. EBITDA Add-backs
CREATE TABLE IF NOT EXISTS public.rrlc_ebitda_addbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    financial_record_id UUID REFERENCES public.rrlc_financial_records(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    addback_type TEXT NOT NULL,
    addback_category TEXT,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,

    justification TEXT,
    is_legitimate BOOLEAN DEFAULT true,
    documentation_provided BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. KPI Metrics
CREATE TABLE IF NOT EXISTS public.rrlc_kpi_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    metric_name TEXT NOT NULL,
    metric_category TEXT,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_unit TEXT,

    measurement_date DATE NOT NULL,
    comparison_to_prior DECIMAL(10,2),
    industry_benchmark DECIMAL(15,2),

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Contracts
CREATE TABLE IF NOT EXISTS public.rrlc_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    contract_name TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    counterparty_name TEXT NOT NULL,

    contract_value DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    auto_renewal BOOLEAN DEFAULT false,

    -- Change of Control Analysis
    has_change_of_control_clause BOOLEAN DEFAULT false,
    change_of_control_details TEXT,
    requires_consent_for_assignment BOOLEAN DEFAULT false,

    -- Risk Assessment
    contract_risk rrlc_contract_risk DEFAULT 'low',
    risk_notes TEXT,

    document_id UUID REFERENCES public.rrlc_documents(id),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. RFIs (Request for Information)
CREATE TABLE IF NOT EXISTS public.rrlc_rfis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    rfi_title TEXT NOT NULL,
    rfi_description TEXT,
    rfi_category TEXT,

    requested_by TEXT,
    requested_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,

    rfi_status rrlc_rfi_status DEFAULT 'not_started',
    priority rrlc_rfi_priority DEFAULT 'medium',

    response_text TEXT,
    response_date DATE,

    assigned_to UUID REFERENCES auth.users(id),

    document_ids UUID[],

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Working Capital Records
CREATE TABLE IF NOT EXISTS public.rrlc_working_capital_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.rrlc_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    calculation_date DATE NOT NULL,

    -- Current Assets
    cash DECIMAL(15,2) DEFAULT 0,
    accounts_receivable DECIMAL(15,2) DEFAULT 0,
    inventory DECIMAL(15,2) DEFAULT 0,
    prepaid_expenses DECIMAL(15,2) DEFAULT 0,
    other_current_assets DECIMAL(15,2) DEFAULT 0,
    total_current_assets DECIMAL(15,2) DEFAULT 0,

    -- Current Liabilities
    accounts_payable DECIMAL(15,2) DEFAULT 0,
    accrued_expenses DECIMAL(15,2) DEFAULT 0,
    deferred_revenue DECIMAL(15,2) DEFAULT 0,
    current_portion_debt DECIMAL(15,2) DEFAULT 0,
    other_current_liabilities DECIMAL(15,2) DEFAULT 0,
    total_current_liabilities DECIMAL(15,2) DEFAULT 0,

    -- Calculated Fields
    working_capital DECIMAL(15,2) DEFAULT 0,
    working_capital_percentage DECIMAL(5,2) DEFAULT 0,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rrlc_email_captures_email ON public.rrlc_email_captures(email);
CREATE INDEX IF NOT EXISTS idx_rrlc_sms_consents_email_capture_id ON public.rrlc_sms_consents(email_capture_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_assessment_submissions_user_id ON public.rrlc_assessment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_businesses_user_id ON public.rrlc_businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_data_room_folders_business_id ON public.rrlc_data_room_folders(business_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_documents_business_id ON public.rrlc_documents(business_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_documents_folder_id ON public.rrlc_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_financial_records_business_id ON public.rrlc_financial_records(business_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_ebitda_addbacks_business_id ON public.rrlc_ebitda_addbacks(business_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_kpi_metrics_business_id ON public.rrlc_kpi_metrics(business_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_contracts_business_id ON public.rrlc_contracts(business_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_rfis_business_id ON public.rrlc_rfis(business_id);
CREATE INDEX IF NOT EXISTS idx_rrlc_rfis_status ON public.rrlc_rfis(rfi_status);
CREATE INDEX IF NOT EXISTS idx_rrlc_working_capital_business_id ON public.rrlc_working_capital_records(business_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.rrlc_email_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_sms_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_data_room_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_ebitda_addbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_rfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rrlc_working_capital_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rrlc_email_captures
CREATE POLICY "Anyone can insert email captures"
  ON public.rrlc_email_captures FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view email captures"
  ON public.rrlc_email_captures FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for rrlc_sms_consents
CREATE POLICY "Anyone can insert SMS consents"
  ON public.rrlc_sms_consents FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view SMS consents"
  ON public.rrlc_sms_consents FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for rrlc_assessment_submissions
CREATE POLICY "Users can view own assessments"
  ON public.rrlc_assessment_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.rrlc_assessment_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON public.rrlc_assessment_submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for rrlc_businesses
CREATE POLICY "Users can view own businesses"
  ON public.rrlc_businesses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own businesses"
  ON public.rrlc_businesses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses"
  ON public.rrlc_businesses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses"
  ON public.rrlc_businesses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_data_room_folders
CREATE POLICY "Users can view own folders"
  ON public.rrlc_data_room_folders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders"
  ON public.rrlc_data_room_folders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON public.rrlc_data_room_folders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON public.rrlc_data_room_folders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_documents
CREATE POLICY "Users can view own documents"
  ON public.rrlc_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.rrlc_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.rrlc_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.rrlc_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_financial_records
CREATE POLICY "Users can view own financial records"
  ON public.rrlc_financial_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial records"
  ON public.rrlc_financial_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial records"
  ON public.rrlc_financial_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial records"
  ON public.rrlc_financial_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_ebitda_addbacks
CREATE POLICY "Users can view own addbacks"
  ON public.rrlc_ebitda_addbacks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addbacks"
  ON public.rrlc_ebitda_addbacks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addbacks"
  ON public.rrlc_ebitda_addbacks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addbacks"
  ON public.rrlc_ebitda_addbacks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_kpi_metrics
CREATE POLICY "Users can view own KPI metrics"
  ON public.rrlc_kpi_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KPI metrics"
  ON public.rrlc_kpi_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own KPI metrics"
  ON public.rrlc_kpi_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own KPI metrics"
  ON public.rrlc_kpi_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_contracts
CREATE POLICY "Users can view own contracts"
  ON public.rrlc_contracts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contracts"
  ON public.rrlc_contracts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contracts"
  ON public.rrlc_contracts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contracts"
  ON public.rrlc_contracts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_rfis
CREATE POLICY "Users can view own RFIs"
  ON public.rrlc_rfis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can insert own RFIs"
  ON public.rrlc_rfis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RFIs"
  ON public.rrlc_rfis FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = assigned_to)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete own RFIs"
  ON public.rrlc_rfis FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rrlc_working_capital_records
CREATE POLICY "Users can view own working capital records"
  ON public.rrlc_working_capital_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own working capital records"
  ON public.rrlc_working_capital_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own working capital records"
  ON public.rrlc_working_capital_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own working capital records"
  ON public.rrlc_working_capital_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_rrlc_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_assessment_submissions_updated_at') THEN
        CREATE TRIGGER update_rrlc_assessment_submissions_updated_at
            BEFORE UPDATE ON public.rrlc_assessment_submissions
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_businesses_updated_at') THEN
        CREATE TRIGGER update_rrlc_businesses_updated_at
            BEFORE UPDATE ON public.rrlc_businesses
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_data_room_folders_updated_at') THEN
        CREATE TRIGGER update_rrlc_data_room_folders_updated_at
            BEFORE UPDATE ON public.rrlc_data_room_folders
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_documents_updated_at') THEN
        CREATE TRIGGER update_rrlc_documents_updated_at
            BEFORE UPDATE ON public.rrlc_documents
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_financial_records_updated_at') THEN
        CREATE TRIGGER update_rrlc_financial_records_updated_at
            BEFORE UPDATE ON public.rrlc_financial_records
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_ebitda_addbacks_updated_at') THEN
        CREATE TRIGGER update_rrlc_ebitda_addbacks_updated_at
            BEFORE UPDATE ON public.rrlc_ebitda_addbacks
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_kpi_metrics_updated_at') THEN
        CREATE TRIGGER update_rrlc_kpi_metrics_updated_at
            BEFORE UPDATE ON public.rrlc_kpi_metrics
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_contracts_updated_at') THEN
        CREATE TRIGGER update_rrlc_contracts_updated_at
            BEFORE UPDATE ON public.rrlc_contracts
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_rfis_updated_at') THEN
        CREATE TRIGGER update_rrlc_rfis_updated_at
            BEFORE UPDATE ON public.rrlc_rfis
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rrlc_working_capital_records_updated_at') THEN
        CREATE TRIGGER update_rrlc_working_capital_records_updated_at
            BEFORE UPDATE ON public.rrlc_working_capital_records
            FOR EACH ROW
            EXECUTE FUNCTION public.update_rrlc_updated_at_column();
    END IF;
END $$;
