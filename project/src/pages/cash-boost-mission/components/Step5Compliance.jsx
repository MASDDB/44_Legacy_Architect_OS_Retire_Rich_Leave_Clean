import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

export default function Step5Compliance({ campaignData, updateCampaignData, onNext, onBack }) {
  const handleCheckChange = (field, checked) => {
    updateCampaignData({
      complianceChecks: {
        ...campaignData.complianceChecks,
        [field]: checked
      }
    });
  };

  const handleContinue = () => {
    const { existingCustomers, optOutUnderstood, legalUnderstood } = campaignData.complianceChecks;

    if (!existingCustomers || !optOutUnderstood || !legalUnderstood) {
      alert('Please confirm all compliance items to continue');
      return;
    }

    onNext();
  };

  const allChecked =
    campaignData.complianceChecks.existingCustomers &&
    campaignData.complianceChecks.optOutUnderstood &&
    campaignData.complianceChecks.legalUnderstood;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quick compliance check
        </h2>
        <p className="text-gray-600">
          We're on your side. Let's keep this powerful and safe.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Compliance Requirements
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <Checkbox
              checked={campaignData.complianceChecks.existingCustomers}
              onChange={(e) => handleCheckChange('existingCustomers', e.target.checked)}
              className="mt-1"
            />
            <span className="text-gray-700">
              These contacts are existing or past customers, or they've given permission to be contacted.
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <Checkbox
              checked={campaignData.complianceChecks.optOutUnderstood}
              onChange={(e) => handleCheckChange('optOutUnderstood', e.target.checked)}
              className="mt-1"
            />
            <span className="text-gray-700">
              I understand every message will include a clear way to opt out, and opt-outs will be honored automatically.
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <Checkbox
              checked={campaignData.complianceChecks.legalUnderstood}
              onChange={(e) => handleCheckChange('legalUnderstood', e.target.checked)}
              className="mt-1"
            />
            <span className="text-gray-700">
              I understand this tool supports compliance but does not replace legal advice for my business.
            </span>
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            We'll handle quiet hours, opt-outs, and basic guardrails. If you have industry-specific rules, make sure your legal advisor is okay with your outreach plan.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!allChecked}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
