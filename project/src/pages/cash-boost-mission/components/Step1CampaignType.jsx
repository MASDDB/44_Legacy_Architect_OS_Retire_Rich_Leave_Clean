import React from 'react';
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Step1CampaignType({ campaignData, updateCampaignData, onNext, onBack }) {
  const campaignTypes = [
    {
      id: 'reactivation',
      icon: RefreshCw,
      title: 'Reactivation Blast (Old Customers)',
      body: 'Text past customers you haven\'t seen in a while and give them a simple reason to book now.',
      footnote: 'Best for: tune-ups, seasonal promos, and slow weeks.'
    },
    {
      id: 'high_value_followup',
      icon: TrendingUp,
      title: 'High-Value Follow-Up (Old Quotes)',
      body: 'Follow up on old estimates and unsold jobs you already paid to generate.',
      footnote: 'Best for: bigger-ticket jobs that slipped through the cracks.'
    },
    {
      id: 'maintenance_membership',
      icon: DollarSign,
      title: 'Maintenance / Membership Push',
      body: 'Invite past customers into a recurring maintenance plan so you\'re not starting from zero every month.',
      footnote: 'Best for: building steady, predictable monthly cash flow.'
    }
  ];

  const handleSelect = (type) => {
    updateCampaignData({ campaignType: type });
  };

  const handleContinue = () => {
    if (!campaignData.campaignType) {
      alert('Please select a campaign type to continue');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What kind of cash do you want to create?
        </h2>
        <p className="text-gray-600">
          Pick a mission. We'll handle the heavy lifting in the background.
        </p>
      </div>

      <div className="grid gap-4">
        {campaignTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = campaignData.campaignType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`text-left p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {type.body}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {type.footnote}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          You can run different mission types over time. Let's start with the one that matches your biggest opportunity right now.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          disabled
          className="opacity-50 cursor-not-allowed"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!campaignData.campaignType}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
