# Architecture Documentation
# Legacy Architect OS

**Version:** 1.0
**Last Updated:** January 2025
**Status:** Current

---

## Table of Contents
1. [Software Architecture Overview](#software-architecture-overview)
2. [Main Navigation Structure](#main-navigation-structure)
3. [Database Schema](#database-schema)
4. [Authentication Approach](#authentication-approach)
5. [Styling & Component System](#styling--component-system)
6. [Integration Points](#integration-points)

---

## Software Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Contexts   │      │
│  │              │  │              │  │              │      │
│  │ - Dashboard  │  │ - UI Library │  │ - Auth       │      │
│  │ - Campaigns  │  │ - Forms      │  │ - Stripe     │      │
│  │ - Analytics  │  │ - Charts     │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                  │
│                  ┌────────▼────────┐                        │
│                  │  Service Layer  │                        │
│                  │                 │                        │
│                  │ - CRM Service   │                        │
│                  │ - Email Service │                        │
│                  │ - SMS Service   │                        │
│                  │ - Payment Svc   │                        │
│                  └────────┬────────┘                        │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  Backend Layer (Supabase)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Auth System │  │ Edge Functions│     │
│  │              │  │              │  │              │      │
│  │ - Tables     │  │ - JWT Tokens │  │ - send-email │      │
│  │ - RLS        │  │ - Sessions   │  │ - send-sms   │      │
│  │ - Functions  │  │ - Policies   │  │ - payments   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              Third-Party Services Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Stripe     │  │    Twilio    │  │   OpenAI     │      │
│  │   (Payment)  │  │   (SMS/Call) │  │ (AI Features)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture (React + Vite)

**Framework:** React 18.2 with Vite 5.0 build system

**Key Technologies:**
- **Routing:** React Router v6 (client-side routing)
- **State Management:** React Context API + Redux Toolkit (hybrid approach)
- **Styling:** Tailwind CSS 3.4 with custom design tokens
- **Forms:** React Hook Form for validation
- **Charts:** Recharts for analytics visualization
- **Flow Builder:** ReactFlow/XYFlow for campaign visual builders
- **API Client:** Supabase JavaScript Client + Axios for external APIs

**Directory Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI library (Button, Input, Select, etc.)
│   ├── payment/        # Stripe payment components
│   ├── AppIcon.jsx     # Icon wrapper (Lucide React)
│   ├── AppImage.jsx    # Image component
│   └── ErrorBoundary.jsx
├── pages/              # Route-level page components
│   ├── main-dashboard/
│   ├── campaign-builder/
│   ├── analytics-dashboard/
│   ├── exit-readiness/  # RRLC Exit Readiness Module
│   └── [other-pages]/
├── contexts/           # React Context providers
│   ├── AuthContext.jsx
│   └── StripeContext.jsx
├── hooks/              # Custom React hooks
│   ├── useEmailNotifications.js
│   ├── useSMSCampaign.js
│   └── useSupabaseData.js
├── services/           # API service layer
│   ├── adminService.js
│   ├── crmService.js
│   ├── emailService.js
│   ├── smsService.js
│   ├── paymentService.js
│   ├── rrclService.js           # RRLC database operations
│   ├── rrclExitScoreCalculator.js  # Exit score algorithm
│   └── [other-services]/
├── lib/                # External library configurations
│   ├── supabase.js     # Supabase client
│   └── openai.js       # OpenAI client
├── utils/              # Utility functions
│   ├── cn.js           # Class name utilities
│   └── authDebugger.js
└── styles/             # Global styles
    ├── tailwind.css    # Tailwind imports
    └── index.css       # Custom CSS variables
```

### Backend Architecture (Supabase)

**Database:** PostgreSQL 15+ with PostGIS extensions

**Key Features:**
- **Row Level Security (RLS):** All tables have RLS policies
- **Real-time Subscriptions:** Live data updates for campaigns
- **Database Functions:** Complex business logic in PL/pgSQL
- **Edge Functions:** Deno-based serverless functions
- **Storage:** File uploads (future feature)

**Supabase Services Used:**
1. **Auth:** Email/password authentication with JWT tokens
2. **Database:** PostgreSQL with RLS
3. **Edge Functions:** Serverless compute for webhooks and integrations
4. **Realtime:** WebSocket connections for live updates (future)

---

## Main Navigation Structure

### Public Routes (Unauthenticated)
- `/` - Marketing Landing Page
- `/user-authentication` - Login/Register
- `/roi-calculator` - Public ROI Calculator
- `/ai-voice-demo` - AI Voice Agent Demo

### Protected Routes (Authenticated)

#### Dashboard Section
- `/main-dashboard` - Primary dashboard with overview metrics and quick actions

#### Campaign Management Section
- `/lead-import-manager` - Upload and manage lead databases
- `/campaign-builder` - Create multi-channel campaigns with visual flow builder
- `/analytics-dashboard` - Campaign performance and metrics
- `/cash-boost` - Cash Boost Mission setup wizard
- `/cash-boost/live/:campaignId` - Live campaign monitoring
- `/cash-boost/complete/:campaignId` - Completed campaign results
- `/ai-audit` - AI + Exit Readiness Assessment

#### Business Tools Section
- `/roi-calculator` - ROI calculator (also available publicly)
- `/email-center` - Email campaign management

#### Exit Readiness Section (RRLC Module)
- `/exit-readiness` - Exit Readiness dashboard with score and valuation
- `/exit-readiness/assessment` - 3-minute exit score assessment
- `/exit-readiness/data-room` - M&A data room (Folders 0-10)
- `/exit-readiness/financials` - EBITDA calculator and financial analysis
- `/exit-readiness/contracts` - Contract index with change-of-control tracking
- `/exit-readiness/rfis` - Request for Information tracker
- `/exit-readiness/kpis` - KPI dashboard with industry benchmarks
- `/exit-readiness/working-capital` - Working capital calculator

#### Platform Settings Section
- `/calendar-integration` - Calendar connection and appointment settings
- `/compliance-center` - Compliance tracking and legal templates
- `/profile-settings` - User profile and account settings
- `/crm-integration-hub` - CRM integrations (ServiceTitan, Jobber, etc.)
- `/api-integration-management` - API key management
- `/webhook-configuration-dashboard` - Webhook setup and monitoring

#### Business Management Section
- `/white-label-management` - White-label branding and reseller tools
- `/stripe-connect-integration` - Stripe payment setup (future)

#### Payment Routes
- `/checkout` - Stripe checkout flow
- `/payment-success` - Payment confirmation

### Sidebar Navigation Structure

The sidebar is organized into collapsible sections:

```javascript
navigationSections = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    items: [
      { path: '/main-dashboard', label: 'Overview', icon: 'Home' }
    ]
  },
  {
    id: 'campaigns',
    title: 'Campaign Management',
    items: [
      { path: '/lead-import-manager', label: 'Lead Import', icon: 'Upload' },
      { path: '/campaign-builder', label: 'Campaign Builder', icon: 'Zap' },
      { path: '/analytics-dashboard', label: 'Analytics', icon: 'BarChart3' }
    ]
  },
  {
    id: 'tools',
    title: 'Business Tools',
    items: [
      { path: '/roi-calculator', label: 'ROI Calculator', icon: 'Calculator' },
      { path: '/email-center', label: 'Email Center', icon: 'Mail' }
    ]
  },
  {
    id: 'exitReadiness',
    title: 'Exit Readiness',
    items: [
      { path: '/exit-readiness', label: 'Exit Dashboard', icon: 'TrendingUp' },
      { path: '/exit-readiness/assessment', label: 'Exit Score', icon: 'Target' },
      { path: '/exit-readiness/data-room', label: 'Data Room', icon: 'FolderOpen' },
      { path: '/exit-readiness/financials', label: 'Financials', icon: 'DollarSign' },
      { path: '/exit-readiness/contracts', label: 'Contracts', icon: 'FileText' },
      { path: '/exit-readiness/rfis', label: 'RFIs', icon: 'MessageSquare' },
      { path: '/exit-readiness/kpis', label: 'KPIs', icon: 'BarChart3' },
      { path: '/exit-readiness/working-capital', label: 'Working Capital', icon: 'Wallet' }
    ]
  },
  {
    id: 'platform',
    title: 'Platform Settings',
    items: [
      { path: '/calendar-integration', label: 'Calendar Integration', icon: 'Calendar' },
      { path: '/compliance-center', label: 'Compliance Center', icon: 'Shield' }
    ]
  },
  {
    id: 'business',
    title: 'Business Management',
    items: [
      { path: '/white-label-management', label: 'White Label', icon: 'Palette' }
    ]
  }
]
```

---

## Database Schema

### Core Tables (59 total - includes 12 RRLC tables)

#### User Management
```sql
-- User profiles (extends auth.users)
user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'sales_rep',
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Enums
user_role: 'admin', 'manager', 'sales_rep', 'viewer', 'super_admin'
```

#### CRM Core Tables
```sql
-- Companies/Accounts
companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  owner_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Leads
leads (
  id UUID PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_id UUID REFERENCES companies(id),
  job_title TEXT,
  lead_source TEXT,
  lead_status lead_status DEFAULT 'new',
  priority lead_priority DEFAULT 'medium',
  estimated_value DECIMAL(12,2),
  assigned_to UUID REFERENCES user_profiles(id),
  last_contacted TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Enums
lead_status: 'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
lead_priority: 'low', 'medium', 'high', 'urgent'

-- Lead Activities
lead_activities (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  activity_type TEXT NOT NULL,
  description TEXT,
  performed_by UUID REFERENCES user_profiles(id),
  activity_date TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ
)
```

#### Campaign Management
```sql
-- Campaigns
campaigns (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type campaign_type NOT NULL,
  campaign_status campaign_status DEFAULT 'draft',
  target_audience TEXT,
  message_template TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Enums
campaign_type: 'email', 'sms', 'phone', 'social', 'direct_mail'
campaign_status: 'draft', 'active', 'paused', 'completed', 'archived'

-- Campaign Leads (many-to-many)
campaign_leads (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  lead_id UUID REFERENCES leads(id),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  response_type TEXT,
  created_at TIMESTAMPTZ
)

-- Campaign Flow Builder
campaign_flow_nodes (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  node_type TEXT NOT NULL,
  node_data JSONB NOT NULL,
  position_x FLOAT,
  position_y FLOAT,
  created_at TIMESTAMPTZ
)

campaign_flow_edges (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  source_node_id UUID REFERENCES campaign_flow_nodes(id),
  target_node_id UUID REFERENCES campaign_flow_nodes(id),
  edge_type TEXT,
  edge_data JSONB,
  created_at TIMESTAMPTZ
)

-- Campaign Analytics
campaign_analytics (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  metric_date DATE NOT NULL,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  responded_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ
)

-- A/B Testing
campaign_ab_test_results (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  variant_name TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  statistical_significance DECIMAL(5,2),
  created_at TIMESTAMPTZ
)
```

#### Cash Boost Campaigns
```sql
-- Cash Boost Campaigns
cash_boost_campaigns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  target_audience JSONB NOT NULL,
  offer_details JSONB NOT NULL,
  pricing_model JSONB NOT NULL,
  compliance_checklist JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  total_contacts INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  responses_received INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  launched_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Revenue Events
cash_boost_revenue_events (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES cash_boost_campaigns(id),
  lead_id UUID REFERENCES leads(id),
  event_type TEXT NOT NULL,
  revenue_amount DECIMAL(10,2) NOT NULL,
  event_date TIMESTAMPTZ DEFAULT now(),
  metadata JSONB,
  created_at TIMESTAMPTZ
)
```

#### AI Features
```sql
-- AI Audits
ai_audits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  answers JSONB NOT NULL,
  ai_readiness_score INTEGER NOT NULL,
  exit_readiness_score INTEGER NOT NULL,
  recommended_missions JSONB NOT NULL,
  created_at TIMESTAMPTZ
)

-- AI Message Personalization
ai_message_personalizations (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  lead_id UUID REFERENCES leads(id),
  original_message TEXT NOT NULL,
  personalized_message TEXT NOT NULL,
  personalization_factors JSONB,
  engagement_score DECIMAL(3,2),
  created_at TIMESTAMPTZ
)

-- AI Settings
ai_personalization_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  enabled BOOLEAN DEFAULT false,
  personalization_level TEXT DEFAULT 'medium',
  tone_preference TEXT DEFAULT 'professional',
  custom_instructions TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- AI Analytics
ai_personalization_analytics (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  personalized_count INTEGER DEFAULT 0,
  non_personalized_count INTEGER DEFAULT 0,
  personalized_conversion_rate DECIMAL(5,2),
  non_personalized_conversion_rate DECIMAL(5,2),
  improvement_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ
)
```

#### Lead Scoring
```sql
-- Lead Scores
lead_scores (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  overall_score INTEGER NOT NULL,
  engagement_score INTEGER,
  fit_score INTEGER,
  behavior_score INTEGER,
  recency_score INTEGER,
  score_factors JSONB,
  last_calculated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Lead Score History
lead_score_history (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  score_snapshot INTEGER NOT NULL,
  score_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Lead Scoring Models
lead_scoring_models (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  model_name TEXT NOT NULL,
  scoring_rules JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### Communication Tables
```sql
-- SMS Messages
sms_messages (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  lead_id UUID REFERENCES leads(id),
  phone_number TEXT NOT NULL,
  message_body TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ
)

-- SMS Templates
sms_templates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  template_name TEXT NOT NULL,
  template_body TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Email Notifications
email_notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  notification_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ
)

-- Email Templates
email_templates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Voice Messages
voice_messages (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  lead_id UUID REFERENCES leads(id),
  phone_number TEXT NOT NULL,
  call_duration_seconds INTEGER,
  call_status TEXT DEFAULT 'pending',
  transcript TEXT,
  recording_url TEXT,
  sentiment_score DECIMAL(3,2),
  called_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Voice Campaign Settings
voice_campaign_settings (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  voice_type TEXT DEFAULT 'male',
  speaking_rate DECIMAL(3,2) DEFAULT 1.0,
  script_template TEXT NOT NULL,
  retry_logic JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### Appointments & Calendar
```sql
-- Appointments
appointments (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  lead_id UUID REFERENCES leads(id),
  assigned_to UUID REFERENCES user_profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  appointment_status appointment_status DEFAULT 'scheduled',
  meeting_location TEXT,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Enums
appointment_status: 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'

-- Calendar Connections
calendar_connections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  calendar_id TEXT,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- User Availability
user_availability (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ
)

-- Appointment Reminders
appointment_reminders (
  id UUID PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id),
  reminder_type TEXT NOT NULL,
  reminder_offset_minutes INTEGER NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ
)

-- Booking Page Settings
booking_page_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  page_slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  duration_options INTEGER[],
  buffer_time_minutes INTEGER DEFAULT 0,
  custom_branding JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### Integrations
```sql
-- CRM Connections
crm_connections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  crm_provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  instance_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- CRM Field Mappings
crm_field_mappings (
  id UUID PRIMARY KEY,
  connection_id UUID REFERENCES crm_connections(id),
  crm_field_name TEXT NOT NULL,
  local_field_name TEXT NOT NULL,
  field_type TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ
)

-- CRM Sync History
crm_sync_history (
  id UUID PRIMARY KEY,
  connection_id UUID REFERENCES crm_connections(id),
  sync_type TEXT NOT NULL,
  records_synced INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  sync_status TEXT DEFAULT 'pending',
  error_details TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- API Keys
api_keys (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  key_name TEXT NOT NULL,
  api_key_hash TEXT NOT NULL,
  api_key_preview TEXT NOT NULL,
  permissions JSONB,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ
)

-- Webhooks
webhooks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  webhook_name TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  event_types TEXT[],
  secret_key TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Webhook Deliveries
webhook_deliveries (
  id UUID PRIMARY KEY,
  webhook_id UUID REFERENCES webhooks(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  delivered_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ
)
```

#### Compliance
```sql
-- Compliance Records
compliance_records (
  id UUID PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  compliance_status compliance_status DEFAULT 'pending_review',
  violation_type TEXT,
  description TEXT,
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Enums
compliance_status: 'compliant', 'warning', 'violation', 'pending_review'
```

#### RRLC (Retire Rich, Leave Clean) Exit Readiness Tables
```sql
-- Email Captures (Step 1 of assessment)
rrlc_email_captures (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'assessment',
  captured_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ
)

-- SMS Consents (TCPA-compliant)
rrlc_sms_consents (
  id UUID PRIMARY KEY,
  email_capture_id UUID REFERENCES rrlc_email_captures(id),
  phone_number TEXT NOT NULL,
  consent_given BOOLEAN DEFAULT false,
  consent_text TEXT NOT NULL,
  consent_timestamp TIMESTAMPTZ,
  opt_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Assessment Submissions
rrlc_assessment_submissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email_capture_id UUID REFERENCES rrlc_email_captures(id),
  -- Business basics
  business_name TEXT,
  industry TEXT,
  years_in_business INTEGER,
  annual_revenue DECIMAL(15,2),
  employee_count INTEGER,
  -- Financial metrics
  revenue_growth_rate DECIMAL(5,2),
  gross_margin DECIMAL(5,2),
  ebitda_margin DECIMAL(5,2),
  customer_concentration DECIMAL(5,2),
  recurring_revenue_percentage DECIMAL(5,2),
  -- Operational readiness
  has_financial_statements BOOLEAN,
  has_clean_books BOOLEAN,
  has_documented_processes BOOLEAN,
  has_management_team BOOLEAN,
  has_customer_contracts BOOLEAN,
  has_ip_documentation BOOLEAN,
  -- Calculated scores
  overall_exit_score INTEGER NOT NULL,
  financial_score INTEGER,
  operational_score INTEGER,
  market_score INTEGER,
  valuation_multiple_low DECIMAL(5,2),
  valuation_multiple_high DECIMAL(5,2),
  estimated_valuation_low DECIMAL(15,2),
  estimated_valuation_high DECIMAL(15,2),
  -- Metadata
  raw_answers JSONB,
  recommendations JSONB,
  action_plan JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Businesses
rrlc_businesses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES rrlc_assessment_submissions(id),
  business_name TEXT NOT NULL,
  legal_entity_name TEXT,
  ein TEXT,
  incorporation_date DATE,
  industry TEXT,
  current_exit_score INTEGER,
  data_room_completion_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Data Room Folders (0-10)
rrlc_data_room_folders (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES rrlc_businesses(id),
  user_id UUID REFERENCES auth.users(id),
  folder_number INTEGER CHECK (folder_number >= 0 AND folder_number <= 10),
  folder_name TEXT NOT NULL,
  folder_description TEXT,
  completion_percentage DECIMAL(5,2),
  document_count INTEGER,
  is_complete BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Documents
rrlc_documents (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES rrlc_businesses(id),
  folder_id UUID REFERENCES rrlc_data_room_folders(id),
  user_id UUID REFERENCES auth.users(id),
  document_name TEXT NOT NULL,
  document_type TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  document_status rrlc_document_status DEFAULT 'uploaded',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Financial Records
rrlc_financial_records (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES rrlc_businesses(id),
  user_id UUID REFERENCES auth.users(id),
  fiscal_year INTEGER NOT NULL,
  fiscal_period TEXT,
  revenue DECIMAL(15,2),
  ebitda DECIMAL(15,2),
  net_income DECIMAL(15,2),
  total_assets DECIMAL(15,2),
  total_liabilities DECIMAL(15,2),
  is_audited BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- EBITDA Add-backs
rrlc_ebitda_addbacks (
  id UUID PRIMARY KEY,
  financial_record_id UUID REFERENCES rrlc_financial_records(id),
  business_id UUID REFERENCES rrlc_businesses(id),
  user_id UUID REFERENCES auth.users(id),
  addback_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  justification TEXT,
  is_legitimate BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- KPI Metrics
rrlc_kpi_metrics (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES rrlc_businesses(id),
  user_id UUID REFERENCES auth.users(id),
  metric_name TEXT NOT NULL,
  metric_category TEXT,
  metric_value DECIMAL(15,2) NOT NULL,
  metric_unit TEXT,
  measurement_date DATE NOT NULL,
  industry_benchmark DECIMAL(15,2),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Contracts
rrlc_contracts (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES rrlc_businesses(id),
  user_id UUID REFERENCES auth.users(id),
  contract_name TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  counterparty_name TEXT NOT NULL,
  contract_value DECIMAL(15,2),
  start_date DATE,
  end_date DATE,
  has_change_of_control_clause BOOLEAN,
  requires_consent_for_assignment BOOLEAN,
  contract_risk rrlc_contract_risk DEFAULT 'low',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- RFIs (Request for Information)
rrlc_rfis (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES rrlc_businesses(id),
  user_id UUID REFERENCES auth.users(id),
  rfi_title TEXT NOT NULL,
  rfi_description TEXT,
  rfi_category TEXT,
  requested_date DATE,
  due_date DATE,
  rfi_status rrlc_rfi_status DEFAULT 'not_started',
  priority rrlc_rfi_priority DEFAULT 'medium',
  response_text TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Working Capital Records
rrlc_working_capital_records (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES rrlc_businesses(id),
  user_id UUID REFERENCES auth.users(id),
  calculation_date DATE NOT NULL,
  cash DECIMAL(15,2),
  accounts_receivable DECIMAL(15,2),
  inventory DECIMAL(15,2),
  accounts_payable DECIMAL(15,2),
  total_current_assets DECIMAL(15,2),
  total_current_liabilities DECIMAL(15,2),
  working_capital DECIMAL(15,2),
  working_capital_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Enums for RRLC module
rrlc_assessment_status: 'incomplete', 'complete', 'reviewed'
rrlc_document_status: 'pending', 'uploaded', 'approved', 'rejected'
rrlc_rfi_status: 'not_started', 'in_progress', 'complete', 'blocked'
rrlc_rfi_priority: 'low', 'medium', 'high', 'urgent'
rrlc_contract_risk: 'low', 'medium', 'high'
```

**RRLC Module Features:**
- All tables prefixed with `rrlc_` to avoid conflicts
- Comprehensive RLS policies on all 12 tables
- Two-step TCPA-compliant opt-in (email → optional SMS)
- Real-time exit score calculation (0-100)
- Dynamic valuation multiple calculation
- Professional M&A data room with Folders 0-10 structure
- Financial analysis with normalized EBITDA
- Contract change-of-control tracking
- Buyer RFI management
- KPI tracking with industry benchmarks
- Working capital analysis

### Database Naming Conventions

**Tables:**
- Plural nouns: `users`, `leads`, `campaigns`
- Snake_case: `user_profiles`, `campaign_leads`

**Columns:**
- Snake_case: `first_name`, `created_at`
- Foreign keys: `{table}_id` (e.g., `user_id`, `campaign_id`)
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Booleans: `is_active`, `has_permission`

**Indexes:**
- Format: `idx_{table}_{column(s)}`
- Example: `idx_leads_assigned_to`

---

## Authentication Approach

### Supabase Auth Integration

**Authentication Method:** Email/Password (primary)
- Social auth (Google, Microsoft) implemented in UI but not backend yet
- Magic links disabled by default
- Email confirmation disabled for easier onboarding

### Architecture

```
┌─────────────────────────────────────────────────┐
│           Client Application (React)             │
│  ┌────────────────────────────────────────┐     │
│  │        AuthContext Provider            │     │
│  │                                         │     │
│  │  State:                                │     │
│  │  - user (auth.users)                   │     │
│  │  - userProfile (user_profiles table)   │     │
│  │  - loading                             │     │
│  │  - initialized                         │     │
│  │                                         │     │
│  │  Methods:                              │     │
│  │  - signUp(email, password, metadata)   │     │
│  │  - signIn(email, password)             │     │
│  │  - signOut()                           │     │
│  │  - resetPassword(email)                │     │
│  └────────┬───────────────────────────────┘     │
│           │                                      │
└───────────┼──────────────────────────────────────┘
            │
            │ Supabase Client SDK
            │
┌───────────▼──────────────────────────────────────┐
│         Supabase Auth Service                     │
│  ┌────────────────────────────────────────┐     │
│  │          auth.users table              │     │
│  │                                         │     │
│  │  - id (UUID, PK)                       │     │
│  │  - email                               │     │
│  │  - encrypted_password                  │     │
│  │  - email_confirmed_at                  │     │
│  │  - last_sign_in_at                     │     │
│  │  - raw_user_meta_data (JSONB)         │     │
│  │  - raw_app_meta_data (JSONB)          │     │
│  └────────┬───────────────────────────────┘     │
│           │                                      │
│           │ Trigger: handle_new_user()           │
│           │                                      │
│  ┌────────▼───────────────────────────────┐     │
│  │      user_profiles table               │     │
│  │                                         │     │
│  │  - id (FK to auth.users.id)           │     │
│  │  - email                               │     │
│  │  - full_name                           │     │
│  │  - role (user_role enum)              │     │
│  │  - phone                               │     │
│  │  - avatar_url                          │     │
│  │  - is_active                           │     │
│  └────────────────────────────────────────┘     │
└──────────────────────────────────────────────────┘
```

### Authentication Flow

**1. Sign Up Flow:**
```javascript
// User registers
await signUp(email, password, { full_name: 'John Doe' })

// Supabase creates auth.users record
// Trigger automatically creates user_profiles record
// Returns user object and session

// AuthContext updates state:
// - user = auth user object
// - userProfile = user_profiles record
```

**2. Sign In Flow:**
```javascript
// User logs in
await signIn(email, password)

// Supabase validates credentials
// Returns JWT access token and refresh token

// AuthContext:
// 1. Sets user from auth session
// 2. Fetches userProfile from user_profiles table
// 3. Updates state with both objects
```

**3. Session Management:**
```javascript
// On app initialization
useEffect(() => {
  // Check for existing session
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    setUser(session.user)
    await fetchUserProfile(session.user.id)
  }

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setUserProfile(null)
      }
    }
  )
}, [])
```

**4. Protected Routes:**
```javascript
// Pages check auth state
const { user, initialized } = useAuth()

// Redirect if not authenticated
useEffect(() => {
  if (initialized && !user) {
    navigate('/user-authentication')
  }
}, [user, initialized, navigate])
```

### Row Level Security (RLS)

All tables have RLS enabled with policies like:

```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can view leads assigned to them
CREATE POLICY "Users can view assigned leads"
  ON leads FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

-- Super admins can view all data
CREATE POLICY "Super admins can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );
```

### Token Storage

- **Access Token:** Stored in memory and localStorage by Supabase client
- **Refresh Token:** Stored in localStorage by Supabase client
- **Automatic Refresh:** Supabase client handles token refresh automatically
- **Expiration:** Access tokens expire after 1 hour (configurable)

### Security Features

1. **Password Requirements:**
   - Minimum 6 characters (can be increased)
   - Hashed with bcrypt before storage

2. **CORS Configuration:**
   - Restricted to specific domains in production
   - Localhost allowed in development

3. **Rate Limiting:**
   - Email/password auth attempts limited
   - Password reset requests limited

4. **Session Security:**
   - HTTPOnly cookies (when using cookie-based auth)
   - Secure flag in production
   - SameSite=Lax

---

## Styling & Component System

### Design System

**Framework:** Tailwind CSS 3.4 with custom configuration

**Color Palette:**
```css
/* CSS Custom Properties (src/styles/index.css) */
:root {
  --color-background: #f9fafb;      /* gray-50 */
  --color-foreground: #111827;      /* gray-900 */
  --color-primary: #1e40af;         /* blue-800 */
  --color-primary-foreground: #ffffff;
  --color-secondary: #6366f1;       /* indigo-500 */
  --color-secondary-foreground: #ffffff;
  --color-accent: #f59e0b;          /* amber-500 */
  --color-accent-foreground: #ffffff;
  --color-success: #10b981;         /* emerald-500 */
  --color-success-foreground: #ffffff;
  --color-warning: #f59e0b;         /* amber-500 */
  --color-error: #ef4444;           /* red-500 */
  --color-muted: #f3f4f6;          /* gray-100 */
  --color-muted-foreground: #6b7280; /* gray-500 */
  --color-border: #e5e7eb;         /* gray-200 */
  --color-card: #ffffff;
  --color-card-foreground: #111827;
}
```

**Typography:**
- **Font Family:** Inter (sans-serif), JetBrains Mono (monospace)
- **Font Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights:** 120% (headings), 150% (body)
- **Scale:** xs (0.75rem) → 6xl (3.75rem)

**Spacing System:**
- **Base Unit:** 8px (0.5rem in Tailwind)
- **Common Spacings:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

**Border Radius:**
- **Small:** 0.25rem (4px)
- **Medium:** 0.5rem (8px)
- **Large:** 1rem (16px)
- **XL:** 1.5rem (24px)

**Shadows:**
```css
soft: 0 1px 3px rgba(0, 0, 0, 0.1)
elevated: 0 10px 25px rgba(0, 0, 0, 0.1)
```

### Component Library

All UI components are in `src/components/ui/`

#### Button Component
```javascript
<Button
  variant="default" | "outline" | "ghost" | "destructive"
  size="sm" | "md" | "lg"
  loading={boolean}
  iconName="IconName"
  iconPosition="left" | "right"
  fullWidth={boolean}
>
  Click Me
</Button>
```

**Variants:**
- `default`: Primary blue button
- `outline`: Border with transparent background
- `ghost`: No border, transparent background
- `destructive`: Red button for dangerous actions

#### Input Component
```javascript
<Input
  label="Email Address"
  type="text" | "email" | "password" | "number"
  placeholder="Enter email"
  error="Error message"
  helperText="Helper text"
  required={boolean}
  disabled={boolean}
/>
```

#### Select Component
```javascript
<Select
  label="Select Option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={handleChange}
  error="Error message"
  required={boolean}
/>
```

#### Checkbox Component
```javascript
<Checkbox
  label="I agree to terms"
  checked={boolean}
  onChange={handleChange}
  error="Error message"
  disabled={boolean}
/>
```

#### Header Component
```javascript
<Header
  title="Page Title"
  subtitle="Page description"
  breadcrumbs={[
    { label: 'Home', path: '/' },
    { label: 'Current Page' }
  ]}
/>
```

#### Sidebar Component
```javascript
<Sidebar
  isCollapsed={boolean}
  onToggle={() => setIsCollapsed(!isCollapsed)}
/>
```

### Layout Patterns

**Dashboard Layout:**
```jsx
<div className="min-h-screen bg-background">
  <Header />
  <Sidebar />
  <main className="ml-60 pt-16 p-8">
    {/* Page content */}
  </main>
</div>
```

**Card Layout:**
```jsx
<div className="bg-card border border-border rounded-xl p-6 shadow-soft">
  <h3 className="text-lg font-semibold text-foreground mb-4">
    Card Title
  </h3>
  <p className="text-muted-foreground">
    Card content
  </p>
</div>
```

**Form Layout:**
```jsx
<form className="space-y-6">
  <Input label="Field 1" />
  <Input label="Field 2" />
  <Button type="submit" fullWidth>Submit</Button>
</form>
```

### Responsive Design

**Breakpoints:**
```javascript
sm: '640px'   // Mobile
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large Desktop
2xl: '1536px' // Extra Large
```

**Common Patterns:**
```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive text size
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Hide on mobile, show on desktop
<div className="hidden lg:block">

// Stack on mobile, row on desktop
<div className="flex flex-col lg:flex-row gap-4">
```

### Icon System

**Library:** Lucide React

**Usage:**
```javascript
import Icon from '../components/AppIcon'

<Icon name="User" size={16} className="text-primary" />
```

**Common Icons:**
- Navigation: `Home`, `Settings`, `Menu`, `Search`
- Actions: `Plus`, `Edit`, `Trash2`, `Save`
- Status: `Check`, `X`, `AlertCircle`, `Info`
- Business: `Users`, `Building2`, `Phone`, `Mail`

---

## Integration Points

### Supabase Edge Functions

Located in `supabase/functions/`:

1. **send-email** - Email delivery via SendGrid/similar
2. **send-sms** - SMS delivery via Twilio
3. **send-voice-call** - Voice calls via Retell AI
4. **voice-call-webhook** - Voice call status webhooks
5. **create-stripe-payment** - Create Stripe payment intents
6. **confirm-stripe-payment** - Confirm Stripe payments
7. **bill-performance-fee** - Calculate performance fees

**Calling Edge Functions:**
```javascript
const response = await fetch(
  `${supabaseUrl}/functions/v1/send-sms`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to: '+1234567890', message: 'Hello' })
  }
)
```

### External APIs

**Stripe (Payments):**
- Client: `@stripe/stripe-js`, `@stripe/react-stripe-js`
- Server: Edge function calls Stripe API

**Twilio (SMS/Voice):**
- Server-side only (via edge functions)
- Credentials in Supabase secrets

**OpenAI (AI Features):**
- Client: `openai` npm package
- API key in environment variables
- Used for: Message personalization, lead scoring

**Retell AI (Voice Agent):**
- Client: `retell-client-js-sdk`
- Used for: AI voice demo, voice campaigns

### Environment Variables

Required in `.env`:
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_RETELL_API_KEY=your_retell_key
```

---

## Best Practices & Conventions

### Code Organization

1. **Component Structure:**
   ```
   ComponentName/
   ├── index.jsx              (Main component)
   ├── ComponentPart.jsx      (Sub-components)
   └── utils.js               (Component-specific utilities)
   ```

2. **Service Layer:**
   - All database calls go through service files
   - Services return `{ data, error }` objects
   - Error handling centralized

3. **State Management:**
   - Global state: React Context (Auth, Stripe)
   - Local state: useState
   - Form state: React Hook Form
   - Server state: Direct Supabase calls (no cache layer yet)

### Naming Conventions

- **Files:** PascalCase for components, camelCase for utilities
- **Components:** PascalCase (e.g., `UserProfile`)
- **Functions:** camelCase (e.g., `handleSubmit`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **CSS Classes:** Tailwind utility classes only

### Error Handling

```javascript
// Service layer
export async function getLeads() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching leads:', error)
    return { data: null, error: error.message }
  }
}

// Component layer
const { data: leads, error } = await getLeads()
if (error) {
  // Show error UI
  setError(error)
}
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

### Database Migrations

Migrations are in `supabase/migrations/` with timestamp prefixes.

**Naming:** `YYYYMMDDHHMMSS_description.sql`

**Example:** `20250104211641_crm_system.sql`

### Testing Strategy

- Manual testing in development
- No automated tests currently
- Future: Jest + React Testing Library

---

## Future Enhancements

1. **Real-time Features:** WebSocket subscriptions for live updates
2. **Mobile Apps:** React Native for iOS/Android
3. **Advanced Analytics:** Custom dashboards with D3.js
4. **AI Enhancements:** GPT-4 for campaign optimization
5. **Multi-tenancy:** Organization-based data isolation
6. **API Layer:** Public REST API for integrations
7. **Caching:** Redis for performance optimization
8. **Search:** Full-text search with PostgreSQL or Algolia

---

**Document Maintained By:** Engineering Team
**Last Reviewed:** January 2025
**Next Review:** April 2025
