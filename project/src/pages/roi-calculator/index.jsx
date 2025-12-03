import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Calculator, Info } from 'lucide-react';

// Import components
import DatabaseInputSection from './components/DatabaseInputSection';
import CustomerValueSection from './components/CustomerValueSection';
import ReactivationRateSection from './components/ReactivationRateSection';
import CampaignCostSection from './components/CampaignCostSection';
import DurationSection from './components/DurationSection';
import ResultsPanel from './components/ResultsPanel';
import CalBookingWidget from './components/CalBookingWidget';
import TipsSection from './components/TipsSection';

const ROICalculator = () => {
  // State for calculator inputs
  const [databaseSize, setDatabaseSize] = useState(1000);
  const [customerValue, setCustomerValue] = useState(1000);
  const [reactivationRate, setReactivationRate] = useState(1.0);
  const [campaignDuration, setCampaignDuration] = useState(1);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Auto-calculate campaign cost based on database size
  const campaignCostPercentage = useMemo(() => {
    if (databaseSize >= 100000) return 15;
    if (databaseSize >= 50000) return 20;
    if (databaseSize >= 25000) return 30;
    if (databaseSize >= 10000) return 40;
    return 50;
  }, [databaseSize]);

  // Validation function
  const validateInputs = () => {
    const newErrors = {};

    if (!databaseSize || databaseSize <= 0) {
      newErrors.databaseSize = 'Database size must be greater than 0';
    }

    if (!customerValue || customerValue < 500 || customerValue > 25000) {
      newErrors.customerValue = 'Customer value must be between $500 and $25,000';
    }

    if (reactivationRate < 0.5 || reactivationRate > 75) {
      newErrors.reactivationRate = 'Reactivation rate must be between 0.5% and 75%';
    }

    if (!campaignDuration || campaignDuration <= 0) {
      newErrors.campaignDuration = 'Campaign duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Real-time validation
  useEffect(() => {
    if (Object.keys(errors)?.length > 0) {
      validateInputs();
    }
  }, [databaseSize, customerValue, reactivationRate, campaignDuration]);

  // Calculate ROI metrics
  const calculations = useMemo(() => {
    if (!validateInputs()) {
      return {
        isValid: false,
        reactivatedCustomers: 0,
        potentialRevenue: 0,
        campaignCost: 0,
        costPerReactivation: 0,
        netROI: 0,
        roiPercentage: 0,
        breakEvenRate: 0,
        monthlyROI: 0
      };
    }

    const reactivatedCustomers = Math.round((databaseSize * reactivationRate) / 100);
    const potentialRevenue = reactivatedCustomers * customerValue;
    const campaignCost = Math.round(potentialRevenue * (campaignCostPercentage / 100));
    const costPerReactivation = reactivatedCustomers > 0 ? campaignCost / reactivatedCustomers : 0;
    const netROI = potentialRevenue - campaignCost;
    const roiPercentage = campaignCost > 0 ? ((netROI / campaignCost) * 100) : 0;
    const breakEvenRate = (campaignCost / (databaseSize * customerValue)) * 100;
    const monthlyROI = campaignDuration > 0 ? netROI / campaignDuration : 0;

    return {
      isValid: true,
      reactivatedCustomers,
      potentialRevenue,
      campaignCost,
      costPerReactivation,
      netROI,
      roiPercentage,
      breakEvenRate,
      monthlyROI
    };
  }, [databaseSize, customerValue, reactivationRate, campaignDuration, campaignCostPercentage]);

  // Determine ROI status for color coding
  const getROIStatus = () => {
    if (!calculations?.isValid) return 'invalid';
    if (calculations?.roiPercentage >= 200) return 'excellent';
    if (calculations?.roiPercentage >= 100) return 'positive';
    if (calculations?.roiPercentage >= 0) return 'break-even';
    return 'negative';
  };

  const roiStatus = getROIStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>ROI Calculator - Database Reactivation ROI Analysis</title>
        <meta name="description" content="Calculate the return on investment for reactivating your dormant customer database with our comprehensive ROI calculator." />
        <meta name="keywords" content="ROI calculator, database reactivation, customer reactivation, lead reactivation ROI" />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Database Reactivation ROI Calculator</h1>
                <p className="text-gray-600">Analyze the return on investment for reactivating your dormant customer database</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">About Database Reactivation</h3>
                <p className="mt-2 text-sm text-blue-700">
                  Database reactivation involves re-engaging dormant customers in your existing database through targeted campaigns. 
                  Instead of spending money on new lead acquisition, you leverage your existing customer data to generate revenue 
                  from previously inactive prospects.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calculator Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Database Size Input */}
            <DatabaseInputSection
              value={databaseSize}
              onChange={setDatabaseSize}
              error={errors?.databaseSize}
            />

            {/* Customer Value Input */}
            <CustomerValueSection
              value={customerValue}
              onChange={setCustomerValue}
              error={errors?.customerValue}
            />

            {/* Reactivation Rate Slider */}
            <ReactivationRateSection
              value={reactivationRate}
              onChange={setReactivationRate}
              error={errors?.reactivationRate}
            />

            {/* Campaign Cost Display */}
            <CampaignCostSection
              databaseSize={databaseSize}
              percentage={campaignCostPercentage}
              cost={calculations?.campaignCost || 0}
            />

            {/* Campaign Duration */}
            <DurationSection
              value={campaignDuration}
              onChange={setCampaignDuration}
              error={errors?.campaignDuration}
            />

            {/* Tips Section */}
            <TipsSection />
          </div>

          {/* Right Column - Results Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ResultsPanel
                calculations={calculations}
                roiStatus={roiStatus}
                errors={errors}
              />

              {/* Cal.com Integration */}
              {calculations?.isValid && calculations?.roiPercentage > 0 && (
                <div className="mt-6">
                  <CalBookingWidget roiData={calculations} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;