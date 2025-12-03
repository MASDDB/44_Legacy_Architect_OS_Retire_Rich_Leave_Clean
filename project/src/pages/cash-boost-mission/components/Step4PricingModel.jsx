import React, { useState, useEffect } from 'react';
import { TrendingUp, CreditCard } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cashBoostService } from '../../../services/cashBoostService';

export default function Step4PricingModel({ campaignData, updateCampaignData, onNext, onBack }) {
  const [projection, setProjection] = useState(null);

  useEffect(() => {
    loadProjection();
  }, [campaignData.campaignType, campaignData.audienceSize, campaignData.offerDetails]);

  const loadProjection = async () => {
    try {
      const proj = await cashBoostService.generateProjection(
        campaignData.audienceSize,
        campaignData.campaignType,
        campaignData.offerDetails
      );
      setProjection(proj);
    } catch (error) {
      console.error('Error generating projection:', error);
    }
  };

  const handleSelectMode = (mode) => {
    updateCampaignData({ pricingMode: mode });
  };

  const handleContinue = () => {
    if (!campaignData.pricingMode) {
      alert('Please select a pricing model to continue');
      return;
    }
    onNext();
  };

  const performanceRate = campaignData.performanceRate || 15;
  const userRate = 100 - performanceRate;

  const userLow = projection ? Math.round(projection.revLow * (userRate / 100)) : 0;
  const userHigh = projection ? Math.round(projection.revHigh * (userRate / 100)) : 0;
  const feeLow = projection ? Math.round(projection.revLow * (performanceRate / 100)) : 0;
  const feeHigh = projection ? Math.round(projection.revHigh * (performanceRate / 100)) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How do you want to pay for this mission?
        </h2>
        <p className="text-gray-600">
          Pick what feels right for you: flat usage or shared upside.
        </p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => handleSelectMode('included_plan')}
          className={`text-left p-6 rounded-lg border-2 transition-all ${
            campaignData.pricingMode === 'included_plan'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              campaignData.pricingMode === 'included_plan' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Use my included plan
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  Pricing mode: included
                </span>
              </div>
              <p className="text-gray-600">
                Use your included AI minutes and messages. No extra performance fee. Great if you run campaigns regularly and like fixed costs.
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleSelectMode('performance')}
          className={`text-left p-6 rounded-lg border-2 transition-all ${
            campaignData.pricingMode === 'performance'
              ? 'border-green-600 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              campaignData.pricingMode === 'performance' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Campaign (We Win When You Win)
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                  Recommended
                </span>
              </div>
              <p className="text-gray-600 mb-3">
                Pay a small success fee on collected revenue from this mission only. If the campaign flops, you don't owe a performance fee.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  You keep the bulk of the cash.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  We only earn when the campaign actually produces revenue.
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      {projection && campaignData.pricingMode === 'performance' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What this could look like
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Contacts messaged:</span>
              <span className="font-medium text-gray-900">{campaignData.audienceSize.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Estimated jobs booked:</span>
              <span className="font-medium text-gray-900">{projection.jobsLow} – {projection.jobsHigh}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Estimated revenue:</span>
              <span className="font-medium text-gray-900">${projection.revLow.toLocaleString()} – ${projection.revHigh.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Your share at {userRate}%:</span>
              <span className="font-medium text-green-600">${userLow.toLocaleString()} – ${userHigh.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Our success fee at {performanceRate}%:</span>
              <span className="font-medium text-gray-900">${feeLow.toLocaleString()} – ${feeHigh.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
            These are estimates, not guarantees, but they're based on real campaign data.
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!campaignData.pricingMode}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
