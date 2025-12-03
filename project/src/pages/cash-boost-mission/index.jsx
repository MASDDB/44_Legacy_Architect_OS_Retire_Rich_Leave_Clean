import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { cashBoostService } from '../../services/cashBoostService';
import Step1CampaignType from './components/Step1CampaignType';
import Step2SelectAudience from './components/Step2SelectAudience';
import Step3DefineOffer from './components/Step3DefineOffer';
import Step4PricingModel from './components/Step4PricingModel';
import Step5Compliance from './components/Step5Compliance';
import Step6Review from './components/Step6Review';

export default function CashBoostMission() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [campaignData, setCampaignData] = useState({
    campaignType: '',
    audienceSource: '',
    audienceFilters: {
      lastJobMonthsAgo: 6,
      excludeContactedDays: 30,
      minJobValue: 0
    },
    audienceSize: 0,
    offerDetails: {
      service: '',
      normalPrice: '',
      specialOffer: '',
      expiresOn: '',
      aiNotes: ''
    },
    pricingMode: '',
    performanceRate: 15,
    complianceChecks: {
      existingCustomers: false,
      optOutUnderstood: false,
      legalUnderstood: false
    },
    messageSms: '',
    messageEmail: ''
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCampaignData = (updates) => {
    setCampaignData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleLaunch = async () => {
    try {
      setLoading(true);

      const campaign = await cashBoostService.createCampaign({
        campaignType: campaignData.campaignType,
        audienceSize: campaignData.audienceSize,
        audienceFilters: campaignData.audienceFilters,
        offerDetails: campaignData.offerDetails,
        pricingMode: campaignData.pricingMode,
        performanceRate: campaignData.pricingMode === 'performance' ? campaignData.performanceRate : 0,
        messageSms: campaignData.messageSms,
        messageEmail: campaignData.messageEmail,
        startDate: new Date().toISOString(),
        endDate: new Date(campaignData.offerDetails.expiresOn).toISOString(),
        userId: user.id
      });

      await cashBoostService.launchCampaign(campaign.id);

      navigate(`/cash-boost/live/${campaign.id}`);
    } catch (error) {
      console.error('Error launching campaign:', error);
      alert('Failed to launch campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1CampaignType
            campaignData={campaignData}
            updateCampaignData={updateCampaignData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step2SelectAudience
            campaignData={campaignData}
            updateCampaignData={updateCampaignData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3DefineOffer
            campaignData={campaignData}
            updateCampaignData={updateCampaignData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4PricingModel
            campaignData={campaignData}
            updateCampaignData={updateCampaignData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <Step5Compliance
            campaignData={campaignData}
            updateCampaignData={updateCampaignData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <Step6Review
            campaignData={campaignData}
            updateCampaignData={updateCampaignData}
            onLaunch={handleLaunch}
            onBack={handleBack}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Cash-Boost Mission - Database Reactivation</title>
      </Helmet>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Cash-Boost Mission
                  </h1>
                  <div className="text-sm text-gray-500">
                    Step {currentStep} of {totalSteps}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {renderStep()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
