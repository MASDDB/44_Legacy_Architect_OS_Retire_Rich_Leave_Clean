import React, { Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Eager-loaded: critical first-paint paths
import MarketingLandingPage from './pages/marketing-landing-page';
import NotFound from "pages/NotFound";

// Lazy-loaded page components (route-level code splitting)
const AnalyticsDashboard = React.lazy(() => import('./pages/analytics-dashboard'));
const CampaignBuilder = React.lazy(() => import('./pages/campaign-builder'));
const MainDashboard = React.lazy(() => import('./pages/main-dashboard'));
const ComplianceCenter = React.lazy(() => import('./pages/compliance-center'));
const CalendarIntegration = React.lazy(() => import('./pages/calendar-integration'));
const LeadImportManager = React.lazy(() => import('./pages/lead-import-manager'));
const WhiteLabelManagement = React.lazy(() => import('./pages/white-label-management'));
const UserAuthentication = React.lazy(() => import('./pages/user-authentication'));
const EmailCenter = React.lazy(() => import('./pages/email-center'));
const ProfileSettings = React.lazy(() => import('./pages/profile-settings'));
const ROICalculator = React.lazy(() => import('./pages/roi-calculator'));
const ApiIntegrationManagement = React.lazy(() => import('./pages/api-integration-management'));
const WebhookConfigurationDashboard = React.lazy(() => import('./pages/webhook-configuration-dashboard'));
const CRMIntegrationHub = React.lazy(() => import('./pages/crm-integration-hub'));
const PricingCheckout = React.lazy(() => import('./components/payment/PricingCheckout'));
const PaymentSuccess = React.lazy(() => import('./components/payment/PaymentSuccess'));
const CashBoostMission = React.lazy(() => import('./pages/cash-boost-mission'));
const LiveCampaign = React.lazy(() => import('./pages/cash-boost-mission/LiveCampaign'));
const CompleteCampaign = React.lazy(() => import('./pages/cash-boost-mission/CompleteCampaign'));
const AIAudit = React.lazy(() => import('./pages/ai-audit'));
const AIVoiceDemo = React.lazy(() => import('./pages/ai-voice-demo'));
const ExitReadinessDashboard = React.lazy(() => import('./pages/exit-readiness'));
const ExitReadinessAssessment = React.lazy(() => import('./pages/exit-readiness/assessment'));
const DataRoom = React.lazy(() => import('./pages/exit-readiness/data-room'));
const Financials = React.lazy(() => import('./pages/exit-readiness/financials'));
const Contracts = React.lazy(() => import('./pages/exit-readiness/contracts'));
const RFIs = React.lazy(() => import('./pages/exit-readiness/rfis'));
const KPIs = React.lazy(() => import('./pages/exit-readiness/kpis'));
const WorkingCapital = React.lazy(() => import('./pages/exit-readiness/working-capital'));
const DataRoomDemo = React.lazy(() => import('./pages/DataRoomDemo'));
const HelpCenter = React.lazy(() => import('./pages/help-center'));
const BlogIndex = React.lazy(() => import('./pages/blog'));
const First30Days = React.lazy(() => import('./pages/blog/first-30-days'));
const ExitTimeline = React.lazy(() => import('./pages/blog/exit-timeline'));
const TroubleshootingMissions = React.lazy(() => import('./pages/blog/troubleshooting-missions'));
const ConsultantsGuide = React.lazy(() => import('./pages/blog/consultants-guide'));
const SecurityPrivacy = React.lazy(() => import('./pages/blog/security-privacy'));
const LeadsView = React.lazy(() => import('./pages/leads-view'));
const LeadDetail = React.lazy(() => import('./pages/lead-detail'));
const TodaysAppointments = React.lazy(() => import('./pages/todays-appointments'));
const SchemaSanityCheck = React.lazy(() => import('./pages/dev-schema-check'));
const LegacyLandingPage = React.lazy(() => import('./pages/marketing-landing-page/LegacyLandingPage'));

// Suspense fallback
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#0f172a',
    color: '#94a3b8',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
  }}>
    Loading…
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <RouterRoutes>
            <Route path="/" element={<MarketingLandingPage />} />
            <Route path="/home-legacy" element={<LegacyLandingPage />} />
            <Route path="/main-dashboard" element={<MainDashboard />} />
            <Route path="/user-authentication" element={<UserAuthentication />} />
            <Route path="/campaign-builder" element={<CampaignBuilder />} />
            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="/lead-import-manager" element={<LeadImportManager />} />
            <Route path="/calendar-integration" element={<CalendarIntegration />} />
            <Route path="/compliance-center" element={<ComplianceCenter />} />
            <Route path="/white-label-management" element={<WhiteLabelManagement />} />
            <Route path="/email-center" element={<EmailCenter />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/roi-calculator" element={<ROICalculator />} />
            <Route path="/api-integration-management" element={<ApiIntegrationManagement />} />
            <Route path="/webhook-configuration-dashboard" element={<WebhookConfigurationDashboard />} />
            <Route path="/crm-integration-hub" element={<CRMIntegrationHub />} />
            <Route path="/checkout" element={<PricingCheckout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/checkout-success" element={<PaymentSuccess />} />
            <Route path="/cash-boost" element={<CashBoostMission />} />
            <Route path="/cash-boost/live/:campaignId" element={<LiveCampaign />} />
            <Route path="/cash-boost/complete/:campaignId" element={<CompleteCampaign />} />
            <Route path="/ai-audit" element={<AIAudit />} />
            <Route path="/ai-voice-demo" element={<AIVoiceDemo />} />
            <Route path="/exit-readiness" element={<ExitReadinessDashboard />} />
            <Route path="/exit-readiness/assessment" element={<ExitReadinessAssessment />} />
            <Route path="/exit-readiness/data-room" element={<DataRoom />} />
            <Route path="/exit-readiness/financials" element={<Financials />} />
            <Route path="/exit-readiness/contracts" element={<Contracts />} />
            <Route path="/exit-readiness/rfis" element={<RFIs />} />
            <Route path="/exit-readiness/kpis" element={<KPIs />} />
            <Route path="/exit-readiness/working-capital" element={<WorkingCapital />} />
            <Route path="/data-room-demo" element={<DataRoomDemo />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/first-30-days" element={<First30Days />} />
            <Route path="/blog/exit-timeline" element={<ExitTimeline />} />
            <Route path="/blog/troubleshooting-missions" element={<TroubleshootingMissions />} />
            <Route path="/blog/consultants-guide" element={<ConsultantsGuide />} />
            <Route path="/blog/security-privacy" element={<SecurityPrivacy />} />
            <Route path="/leads" element={<LeadsView />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/todays-appointments" element={<TodaysAppointments />} />
            <Route path="/dev/schema-check" element={<SchemaSanityCheck />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
