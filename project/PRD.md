# Product Requirements Document (PRD)
# Legacy Architect OS

**Document Version:** 1.0
**Last Updated:** January 2025
**Product Owner:** TBD
**Status:** Active Development

---

## Executive Summary

Legacy Architect OS is a specialized SaaS platform designed for service-based businesses (HVAC, plumbing, electrical, roofing, landscaping) that helps them transform from owner-dependent operations into buyer-ready, sellable assets. The platform combines AI-powered customer reactivation, automated communication systems, and exit-readiness assessment tools to increase profitability while reducing owner dependence.

**Target Market:** Service businesses generating $500k-$5M+ in annual revenue looking to scale, step back, or prepare for exit within 1-5 years.

**Primary Value Proposition:** Turn dormant customer databases into immediate revenue while simultaneously building the operational infrastructure needed to sell or transition the business.

---

## Product Vision

To become the essential operating system for service business owners who want to build legacy wealth and exit on their own terms, without burning out or leaving money on the table.

---

## Problem Statement

Service business owners face three interconnected challenges:

1. **Revenue Leaks:** Thousands of past customers sit idle in databases while owners spend heavily on new lead generation
2. **Owner Dependence:** Business value is tied to the owner's involvement, making it difficult to sell or step back
3. **Exit Unpreparedness:** Most service businesses aren't structured or documented in ways that attract serious buyers or achieve premium valuations

**Market Pain Points:**
- 60%+ of inbound calls go to voicemail during business hours
- Past customers receive little to no follow-up after initial service
- Critical business documents and processes exist only in the owner's head
- No clear metrics or dashboards to prove business value to buyers
- Compliance and legal frameworks are inconsistent or non-existent

---

## Target Users

### Primary Persona: "Exit-Minded Owner"
- **Demographics:** 45-65 years old, 10+ years in business
- **Business Profile:** $1M-$5M annual revenue, 5-20 employees
- **Goals:** Maximize business value, reduce daily involvement, prepare for sale within 3-5 years
- **Pain Points:** Too dependent on them, unclear valuation, scattered data
- **Technical Proficiency:** Low to medium

### Secondary Persona: "Growth-Focused Operator"
- **Demographics:** 35-50 years old, 5-15 years in business
- **Business Profile:** $500k-$2M annual revenue, 3-10 employees
- **Goals:** Increase revenue, improve profit margins, build scalable systems
- **Pain Points:** Missed opportunities, manual processes, limited bandwidth
- **Technical Proficiency:** Medium

### Tertiary Persona: "Agency/Multi-Location Partner"
- **Demographics:** Marketing agencies or franchisees
- **Business Profile:** Serving multiple service businesses or locations
- **Goals:** Offer value-added services, recurring revenue streams
- **Pain Points:** Need white-label solutions, client management complexity
- **Technical Proficiency:** Medium to high

---

## Core Features & Functionality

### 1. AI + Exit Readiness Audit
**Purpose:** Diagnostic tool to assess current state and prioritize improvements

**Features:**
- 5-step assessment questionnaire (Business, Leads, Follow-Up, Systems, Exit)
- Dual scoring system: AI Readiness Score (0-100) and Exit Readiness Score (0-100)
- Personalized mission recommendations based on business profile
- Results dashboard with actionable next steps
- Audit history tracking to measure improvement over time

**User Story:** "As a business owner, I want to understand where I'm losing money and how buyer-ready my business is, so I can focus on the highest-impact improvements."

### 2. Cash-Boost Mission (Database Reactivation)
**Purpose:** Convert dormant past customers into immediate revenue

**Features:**
- Multi-step campaign wizard (Type, Audience, Offer, Pricing, Compliance, Review)
- Audience segmentation by service type, date range, spend level
- Offer configuration with discount types and terms
- Multi-channel outreach (SMS, Email, Voice calls)
- Real-time campaign dashboard with conversion tracking
- Performance-based pricing model (revenue share or percentage)
- Compliance management and opt-out handling
- Integration with calendar for appointment booking

**User Story:** "As a business owner, I want to re-engage past customers who haven't used my services recently, so I can generate revenue from my existing database instead of spending on new leads."

### 3. AI Voice Agent & Reception System
**Purpose:** Capture every inbound opportunity 24/7

**Features:**
- AI-powered phone answering and call qualification
- Natural conversation flow for service booking
- Calendar integration for real-time availability
- Lead capture and CRM integration
- Call recording and transcription
- Performance analytics (calls answered, bookings, revenue)
- Demo call functionality for prospects

**User Story:** "As a business owner, I want every call answered professionally even when I'm busy or after hours, so I never miss a booking opportunity."

### 4. Campaign Builder & Automation
**Purpose:** Create sophisticated, multi-channel marketing campaigns

**Features:**
- Visual flow builder for campaign logic
- Message templates library (SMS, Email, Voice)
- Conditional logic and branching paths
- A/B testing capabilities
- AI-powered message personalization
- Trigger configuration (date-based, behavior-based, manual)
- Lead scoring integration
- Multi-step nurture sequences

**User Story:** "As a business owner, I want to automate follow-up communications, so my team stays engaged with prospects without manual effort."

### 5. Analytics & Performance Dashboard
**Purpose:** Real-time visibility into business metrics

**Features:**
- Key metrics overview (leads, conversion rates, revenue)
- Campaign performance comparison
- Lead lifecycle tracking
- Revenue attribution by channel
- Appointment booking trends
- AI personalization effectiveness
- Export capabilities (PDF, CSV)
- Real-time notifications for key events

**User Story:** "As a business owner, I want to see which marketing activities generate the best ROI, so I can allocate resources effectively and prove business value to buyers."

### 6. Calendar & Appointment Management
**Purpose:** Streamline scheduling and reduce no-shows

**Features:**
- Calendar integration (Google, Outlook, ServiceTitan, etc.)
- Availability settings and booking rules
- Automated confirmation and reminder messages
- Customizable booking pages
- Team calendar management
- Analytics on booking patterns
- Waitlist management

**User Story:** "As a business owner, I want customers to book appointments directly without phone tag, so my office staff can focus on higher-value activities."

### 7. CRM Integration Hub
**Purpose:** Centralize data from multiple business systems

**Features:**
- Pre-built integrations (ServiceTitan, Jobber, Housecall Pro, etc.)
- Field mapping interface for custom fields
- Bi-directional sync capabilities
- Sync scheduling and history
- Data flow visualization
- Conflict resolution rules
- Integration setup wizard

**User Story:** "As a business owner, I want all my customer data in one place, so I can run campaigns without manual data exports and imports."

### 8. Compliance & Legal Center
**Purpose:** Ensure regulatory compliance and reduce legal risk

**Features:**
- Industry-specific compliance rules (TCPA, GDPR, etc.)
- Legal template library (opt-in, opt-out, disclosures)
- Automated opt-out management
- Audit trail for all communications
- Violation alerts and prevention
- Template validator for message compliance

**User Story:** "As a business owner, I want to ensure my marketing complies with all regulations, so I avoid fines and maintain a good reputation."

### 9. Lead Import & Management
**Purpose:** Consolidate and organize customer databases

**Features:**
- Bulk CSV/Excel upload with validation
- Duplicate detection and merging
- Data enrichment and standardization
- Industry tagging and segmentation
- Bulk action capabilities
- Import history and rollback
- Data quality scoring

**User Story:** "As a business owner, I want to easily import my customer database from spreadsheets, so I can start running campaigns quickly."

### 10. White-Label & Multi-Location Management
**Purpose:** Enable agencies and franchises to resell the platform

**Features:**
- Custom branding (logo, colors, domain)
- Reseller dashboard for client management
- Automated royalty and revenue tracking
- Client onboarding workflow
- Marketing materials library
- Partner support portal
- Sub-account management

**User Story:** "As an agency owner, I want to offer this platform under my brand to my service business clients, so I can create recurring revenue streams."

### 11. ROI Calculator
**Purpose:** Help prospects quantify potential returns

**Features:**
- Interactive calculator with business inputs
- Database size and reactivation rate assumptions
- Customer lifetime value calculations
- Campaign cost modeling
- Visual results with profit projections
- Shareable reports
- Cal.com booking widget integration

**User Story:** "As a prospect, I want to see potential ROI before committing, so I can justify the investment to myself or partners."

### 12. Webhook & API Configuration
**Purpose:** Enable custom integrations and automation

**Features:**
- Webhook endpoint management
- Event type configuration
- Payload customization
- Retry logic and failure handling
- Testing and debugging tools
- API documentation
- Rate limiting controls

**User Story:** "As a technical administrator, I want to connect Legacy Architect OS to other systems via webhooks, so I can create custom automation workflows."

### 13. Retire Rich, Leave Clean (RRLC) Exit Readiness Module
**Purpose:** Comprehensive exit preparation platform to maximize business valuation and streamline M&A process

**Features:**
- **3-Minute Exit Score Assessment:** Multi-step questionnaire covering business basics, financial metrics, and operational readiness with real-time scoring (0-100)
- **Exit Readiness Dashboard:** Real-time exit score tracking, valuation estimates, data room completion percentage, and personalized recommendations
- **Professional M&A Data Room:** Industry-standard Folders 0-10 structure for organizing due diligence documents
- **Normalized EBITDA Calculator:** Track 3-year financial performance with legitimate add-backs documentation and valuation range calculations
- **Contract Management System:** Contract index with change-of-control clause flagging and assignment restriction tracking
- **RFI (Request for Information) Tracker:** Pre-populated buyer requests with status tracking, priority management, and response templates
- **KPI Dashboard:** Industry-specific key performance indicators with historical tracking and benchmarking
- **Working Capital Calculator:** Track current assets, liabilities, and working capital trends over time
- **Two-Step TCPA-Compliant Opt-in:** Email capture followed by optional SMS consent for assessment follow-ups
- **Valuation Multiple Calculator:** Dynamic multiple calculation based on exit score, industry, recurring revenue, and financial metrics
- **10-Day Action Plan:** Auto-generated personalized improvement roadmap based on assessment results

**Data Security:**
- All RRLC tables prefixed with `rrlc_` to avoid conflicts with existing tables
- Comprehensive Row Level Security (RLS) policies on all 12 tables
- User-scoped data access with proper authentication checks
- Document version tracking and audit trails
- Secure file storage integration for sensitive documents

**User Story:** "As a business owner planning to exit in 3-5 years, I want to understand my current exit readiness, organize my due diligence materials professionally, and track improvements over time, so I can maximize my business valuation and streamline the sale process."

---

## Technical Architecture

### Frontend
- **Framework:** React 18.2
- **Routing:** React Router v6
- **State Management:** React Context + Redux Toolkit
- **Styling:** Tailwind CSS with custom design system
- **Build Tool:** Vite
- **UI Components:** Custom components + Radix UI primitives

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password)
- **APIs:** RESTful + Supabase Client SDK
- **Edge Functions:** Deno-based serverless functions

### Infrastructure
- **Hosting:** Vercel/Netlify (frontend), Supabase (backend)
- **CDN:** Automatic via hosting platform
- **SSL:** Automatic via hosting platform

### Third-Party Integrations
- **Payment Processing:** Stripe
- **SMS:** Twilio
- **Email:** SendGrid or similar
- **Voice Calls:** Retell AI SDK
- **AI/ML:** OpenAI API for personalization
- **Calendar:** Google Calendar, Outlook, Cal.com

### Security
- Row Level Security (RLS) on all database tables
- JWT-based authentication
- HTTPS enforcement
- Environment variable management
- Regular security audits
- Compliance with TCPA, GDPR, CCPA

---

## User Flows

### Flow 1: New User Onboarding
1. User lands on marketing landing page
2. Views hero section with AI receptionist demo
3. Reviews pricing and selects plan
4. Creates account (email/password)
5. Completes AI + Exit Audit (optional but encouraged)
6. Reviews audit results and recommended missions
7. Launches first Cash-Boost campaign
8. Sets up calendar integration
9. Reviews initial campaign performance

### Flow 2: Cash-Boost Campaign Launch
1. User navigates to Cash-Boost Mission page
2. Selects campaign type (One-Time Offer or Seasonal Service)
3. Defines target audience (filters by date, service, spend)
4. Configures offer details (discount, expiration, terms)
5. Selects pricing model (revenue share or percentage)
6. Reviews compliance checklist and confirms
7. Reviews campaign summary and launches
8. Campaign goes live immediately
9. User monitors performance on Live Campaign dashboard
10. Views results on Complete Campaign page after conclusion

### Flow 3: AI Voice Demo Experience
1. User clicks "Play AI Demo Call" on landing page
2. Redirected to AI Voice Demo page
3. Clicks "Start Demo Call"
4. AI agent initiates voice conversation
5. User experiences realistic service booking call
6. Call concludes with booking confirmation
7. User sees transcript and analytics
8. CTA to start free trial

### Flow 4: Exit Readiness Assessment & Preparation
1. User navigates to Exit Readiness dashboard
2. Clicks "Start Assessment" to begin 3-minute evaluation
3. **Step 1 - Business Basics:** Enters email, business name, industry, years in business, revenue, and employee count
4. Email captured for follow-up communications
5. **Step 2 - Financial Metrics:** Provides revenue growth, margins, customer concentration, and recurring revenue percentage
6. **Step 3 - Operational Readiness:** Checks boxes for documentation, processes, management team, contracts, and IP
7. **Step 4 - SMS Opt-in (Optional):** Provides phone number and consents to TCPA-compliant SMS updates
8. Receives real-time calculated exit score (0-100) with financial, operational, and market sub-scores
9. Views estimated valuation range based on revenue multiples
10. Reviews personalized recommendations and 10-day action plan
11. Accesses Exit Dashboard to track progress over time
12. Navigates to Data Room to begin organizing due diligence documents in Folders 0-10
13. Uses Financials page to calculate normalized EBITDA with add-backs
14. Reviews Contracts for change-of-control clauses
15. Manages buyer RFIs as they come in during due diligence
16. Tracks KPIs and working capital to demonstrate business health to potential buyers

### Flow 5: White-Label Partner Setup
1. Partner applies for white-label program
2. Account approved and created
3. Partner configures branding (logo, colors, domain)
4. Creates first client sub-account
5. Onboards client through guided workflow
6. Client launches campaigns under partner brand
7. Partner tracks revenue and royalties on dashboard

---

## Success Metrics (KPIs)

### Product Metrics
- **Activation Rate:** % of signups who complete AI audit within 7 days (Target: 60%)
- **Time to First Campaign:** Average days from signup to first campaign launch (Target: <3 days)
- **Campaign Launch Rate:** % of users who launch at least one campaign within 30 days (Target: 70%)
- **Multi-Mission Adoption:** % of users who launch 2+ mission types (Target: 40%)
- **Monthly Active Users (MAU):** Users who log in and view dashboard at least once per month
- **Feature Utilization:** % of users actively using each core feature

### Business Metrics
- **Monthly Recurring Revenue (MRR):** Total subscription revenue
- **Average Revenue Per User (ARPU):** Total revenue divided by active users
- **Customer Acquisition Cost (CAC):** Marketing spend / new customers
- **Customer Lifetime Value (LTV):** Average revenue per customer over lifetime
- **LTV:CAC Ratio:** Target: 3:1 or higher
- **Churn Rate:** % of customers who cancel per month (Target: <5%)
- **Net Revenue Retention:** Expansion revenue from existing customers

### Customer Success Metrics
- **Campaign ROI:** Average return on investment per campaign (Target: 200%+)
- **Reactivation Rate:** % of dormant customers who re-engage (Target: 10-15%)
- **Call Answer Rate:** % of inbound calls handled by AI (Target: 95%+)
- **Booking Conversion Rate:** % of qualified calls that result in bookings (Target: 40%+)
- **Exit Readiness Score Improvement:** Average increase in score over 6 months (Target: +20 points)
- **Customer Satisfaction (CSAT):** Survey score (Target: 4.5/5)

---

## Roadmap & Phases

### Phase 1: MVP (Completed)
- User authentication and profile management
- AI + Exit Audit assessment
- Cash-Boost Mission campaign builder
- Basic analytics dashboard
- Lead import and management
- Compliance center foundation
- Marketing landing page

### Phase 2: Automation & Intelligence (Q1 2025)
- AI Voice Agent full implementation
- Advanced campaign builder with visual flows
- A/B testing framework
- Enhanced lead scoring algorithms
- Calendar integration (Google, Outlook)
- Email campaign functionality
- Real-time notifications

### Phase 3: Enterprise & Scale (Q2 2025)
- CRM integration hub (ServiceTitan, Jobber, etc.)
- White-label platform with reseller management
- Advanced analytics and reporting
- Webhook and API management
- Multi-location support
- Team collaboration features
- Mobile app (iOS/Android)

### Phase 4: Exit Readiness Suite (Q3 2025)
- Buyer-Ready Data Room mission
- Financial performance tracking
- Document management system
- Valuation calculator
- Exit planning toolkit
- Broker/advisor integrations
- Succession planning tools

### Phase 5: AI-Powered Growth (Q4 2025)
- Predictive analytics for customer behavior
- AI-recommended campaign strategies
- Automated reputation management
- Review generation and monitoring
- Dynamic pricing optimization
- Competitor analysis tools
- Market expansion recommendations

---

## Competitive Analysis

### Direct Competitors
1. **ServiceTitan Marketing Pro**
   - Strengths: Deep CRM integration, established user base
   - Weaknesses: No exit-readiness focus, complex pricing, steep learning curve
   - Differentiation: Legacy Architect OS focuses on exit-readiness and owner independence

2. **Housecall Pro Marketing Suite**
   - Strengths: User-friendly, affordable pricing
   - Weaknesses: Limited AI capabilities, basic analytics
   - Differentiation: Superior AI voice agent and mission-based approach

3. **CallRail + ServiceDirect**
   - Strengths: Call tracking, lead generation
   - Weaknesses: No database reactivation, no exit planning
   - Differentiation: Focus on existing customer reactivation vs. new lead generation

### Indirect Competitors
- **Marketing Agencies:** Manual service, high cost, no platform ownership
- **Generic CRMs (HubSpot, Salesforce):** Not industry-specific, complex configuration
- **Business Brokers:** Only involved at exit, no operational improvement tools

### Competitive Advantages
- **Mission-Based Approach:** Clear, actionable campaigns vs. generic CRM features
- **Dual Focus:** Immediate revenue + long-term exit readiness
- **Performance Pricing:** Pay based on results, not flat fees
- **Industry Specialization:** Built specifically for service businesses
- **AI Voice Integration:** Cutting-edge call handling technology
- **Exit Planning Tools:** Unique positioning in the market

---

## Risks & Mitigation Strategies

### Technical Risks
- **Risk:** AI voice agent quality inconsistencies
  - **Mitigation:** Extensive testing, fallback to human operators, continuous training

- **Risk:** Integration failures with third-party CRMs
  - **Mitigation:** Robust error handling, fallback sync methods, manual data import

- **Risk:** Scalability issues with high campaign volumes
  - **Mitigation:** Serverless architecture, queue-based processing, monitoring

### Business Risks
- **Risk:** Low customer adoption or high churn
  - **Mitigation:** Onboarding excellence, customer success team, regular check-ins

- **Risk:** Regulatory compliance violations
  - **Mitigation:** Legal review, automated compliance checks, audit trails

- **Risk:** Competitive pressure from established players
  - **Mitigation:** Focus on niche positioning, rapid iteration, customer intimacy

### Market Risks
- **Risk:** Economic downturn reducing service business spending
  - **Mitigation:** Performance-based pricing, prove ROI, focus on cost-saving features

- **Risk:** Regulatory changes (TCPA, privacy laws)
  - **Mitigation:** Compliance-first design, legal partnerships, rapid updates

---

## Open Questions & Assumptions

### Open Questions
1. What is the optimal pricing for each tier to maximize both adoption and revenue?
2. Which CRM integrations should be prioritized first?
3. Should we build native mobile apps or focus on responsive web?
4. What is the ideal onboarding flow length to maximize activation?
5. How should we handle customers in highly regulated industries (healthcare, legal)?

### Key Assumptions
1. Service business owners will pay for tools that prove ROI quickly
2. Database reactivation can achieve 10-15% reactivation rates on average
3. AI voice quality is sufficient for professional business use
4. Exit-readiness is a strong enough value proposition to drive adoption
5. Performance-based pricing is attractive to risk-averse business owners
6. White-label partners can drive significant customer acquisition

---

## Appendices

### Appendix A: Glossary
- **Mission:** A specific, actionable campaign type (e.g., Cash-Boost, AI Reception)
- **Exit Readiness:** How prepared a business is for sale or transition
- **Database Reactivation:** Re-engaging dormant customers for new business
- **AI Voice Agent:** Automated phone answering system using conversational AI
- **RLS:** Row Level Security (database security policy)
- **TCPA:** Telephone Consumer Protection Act (US telemarketing law)

### Appendix B: Research & References
- Service business market size: $700B+ annually in US
- Average service business owner age: 52 years old
- 70% of business owners have no formal exit plan
- Average time to sell a service business: 8-12 months
- Database reactivation typical ROI: 200-400%

### Appendix C: Design System
- Primary color: Blue (#2563eb)
- Secondary colors: Green (success), Red (error), Yellow (warning)
- Typography: System font stack
- Spacing: 8px base unit
- Border radius: 8px (medium), 16px (large)
- Shadows: Tailwind elevation system

---

**Document Status:** Living document, updated quarterly or as major changes occur

**Next Review Date:** April 2025

**Document Owner:** Product Team

**Approval Required From:** CEO, CTO, Head of Product
