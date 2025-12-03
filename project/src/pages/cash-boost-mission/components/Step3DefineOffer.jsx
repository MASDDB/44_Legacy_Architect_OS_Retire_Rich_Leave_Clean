import React from 'react';
import { Info } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function Step3DefineOffer({ campaignData, updateCampaignData, onNext, onBack }) {
  const handleOfferChange = (field, value) => {
    updateCampaignData({
      offerDetails: {
        ...campaignData.offerDetails,
        [field]: value
      }
    });
  };

  const handleContinue = () => {
    const { service, normalPrice, specialOffer, expiresOn } = campaignData.offerDetails;

    if (!service || !normalPrice || !specialOffer || !expiresOn) {
      alert('Please fill in all required fields to continue');
      return;
    }

    const expiryDate = new Date(expiresOn);
    if (expiryDate <= new Date()) {
      alert('Offer expiry date must be in the future');
      return;
    }

    onNext();
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What's the offer?
        </h2>
        <p className="text-gray-600">
          Strong, simple offers win. Clear price, clear benefit, clear deadline.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service you want to promote
          </label>
          <Input
            type="text"
            value={campaignData.offerDetails.service}
            onChange={(e) => handleOfferChange('service', e.target.value)}
            placeholder="e.g., HVAC tune-up, roof inspection, plumbing service"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Normal price
            </label>
            <Input
              type="number"
              value={campaignData.offerDetails.normalPrice}
              onChange={(e) => handleOfferChange('normalPrice', e.target.value)}
              placeholder="299"
              min="0"
              step="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special offer for this campaign
            </label>
            <Input
              type="text"
              value={campaignData.offerDetails.specialOffer}
              onChange={(e) => handleOfferChange('specialOffer', e.target.value)}
              placeholder="$199 or 25% off"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer expires on
          </label>
          <Input
            type="date"
            value={campaignData.offerDetails.expiresOn}
            onChange={(e) => handleOfferChange('expiresOn', e.target.value)}
            min={minDateStr}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes for our AI (optional)
          </label>
          <textarea
            value={campaignData.offerDetails.aiNotes}
            onChange={(e) => handleOfferChange('aiNotes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Anything special about this offer, your brand voice, or how you like to talk to customers..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Anything special about this offer, your brand voice, or how you like to talk to customers.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            If you're not sure, a simple "seasonal tune-up at a fair price with a real deadline" usually outperforms fancy gimmicks.
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
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
