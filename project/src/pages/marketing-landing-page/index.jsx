import React from 'react';
import { Helmet } from 'react-helmet';
import NavigationHeader from './components/NavigationHeader';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import DataRoomDemoSection from './components/DataRoomDemoSection';
import BenefitsSection from './components/BenefitsSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import FooterSection from './components/FooterSection';

const MarketingLandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Database Reactivation SaaS - Transform Dormant Leads Into Booked Appointments</title>
        <meta name="description" content="Stop spending thousands on new leads. Our AI-powered platform reactivates your dormant database through multi-channel outreach, turning cold prospects into booked appointments with 247% average ROI." />
        <meta name="keywords" content="database reactivation, lead reactivation, AI outreach, lead generation, appointment booking, CRM automation" />
        <meta property="og:title" content="Database Reactivation SaaS - Transform Dormant Leads Into Booked Appointments" />
        <meta property="og:description" content="Join 2,500+ businesses who've unlocked millions in hidden revenue from their dormant leads. 14-day free trial, no setup fees." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Database Reactivation SaaS - Transform Dormant Leads Into Booked Appointments" />
        <meta name="twitter:description" content="Stop spending thousands on new leads. Reactivate your dormant database with AI-powered outreach." />
      </Helmet>

      {/* Navigation Header */}
      <NavigationHeader />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Problem Identification Section */}
        <ProblemSection />

        {/* Solution Section */}
        <SolutionSection />

        {/* Data Room Demo Section */}
        <DataRoomDemoSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Customer Testimonials */}
        <TestimonialsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default MarketingLandingPage;