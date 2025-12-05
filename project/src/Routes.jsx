import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import CampaignBuilder from './pages/campaign-builder';
import MainDashboard from './pages/main-dashboard';
import MarketingLandingPage from './pages/marketing-landing-page';
import ComplianceCenter from './pages/compliance-center';
import CalendarIntegration from './pages/calendar-integration';
import LeadImportManager from './pages/lead-import-manager';
import WhiteLabelManagement from './pages/white-label-management';
import UserAuthentication from './pages/user-authentication';
import EmailCenter from './pages/email-center';
import ProfileSettings from './pages/profile-settings';
import ROICalculator from './pages/roi-calculator';
import ApiIntegrationManagement from './pages/api-integration-management';
import WebhookConfigurationDashboard from './pages/webhook-configuration-dashboard';
import CRMIntegrationHub from './pages/crm-integration-hub';
import PricingCheckout from './components/payment/PricingCheckout';
import PaymentSuccess from './components/payment/PaymentSuccess';
import CashBoostMission from './pages/cash-boost-mission';
import LiveCampaign from './pages/cash-boost-mission/LiveCampaign';
import CompleteCampaign from './pages/cash-boost-mission/CompleteCampaign';
import AIAudit from './pages/ai-audit';
import AIVoiceDemo from './pages/ai-voice-demo';
import ExitReadinessDashboard from './pages/exit-readiness';
import ExitReadinessAssessment from './pages/exit-readiness/assessment';
import DataRoom from './pages/exit-readiness/data-room';
import Financials from './pages/exit-readiness/financials';
import Contracts from './pages/exit-readiness/contracts';
import RFIs from './pages/exit-readiness/rfis';
import KPIs from './pages/exit-readiness/kpis';
import WorkingCapital from './pages/exit-readiness/working-capital';
import DataRoomDemo from './pages/DataRoomDemo';
import HelpCenter from './pages/help-center';
import BlogIndex from './pages/blog';
import First30Days from './pages/blog/first-30-days';
import ExitTimeline from './pages/blog/exit-timeline';
import TroubleshootingMissions from './pages/blog/troubleshooting-missions';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<MarketingLandingPage />} />
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
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;