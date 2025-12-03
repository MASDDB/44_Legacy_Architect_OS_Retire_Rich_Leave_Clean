import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, RefreshCw, Edit, Rocket } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cashBoostService } from '../../../services/cashBoostService';

export default function Step6Review({ campaignData, updateCampaignData, onLaunch, onBack, loading }) {
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [editingSms, setEditingSms] = useState(false);
  const [smsText, setSmsText] = useState('');

  useEffect(() => {
    if (!campaignData.messageSms) {
      generateMessage();
    } else {
      setSmsText(campaignData.messageSms);
    }
  }, []);

  const generateMessage = async () => {
    try {
      setGeneratingMessage(true);
      const message = await cashBoostService.generateAIMessage(
        campaignData.campaignType,
        campaignData.offerDetails,
        campaignData.audienceFilters,
        campaignData.offerDetails.aiNotes
      );
      setSmsText(message);
      updateCampaignData({ messageSms: message });
    } catch (error) {
      console.error('Error generating message:', error);
      alert('Failed to generate message. Please try again.');
    } finally {
      setGeneratingMessage(false);
    }
  };

  const handleSaveSms = () => {
    updateCampaignData({ messageSms: smsText });
    setEditingSms(false);
  };

  const campaignTypeNames = {
    reactivation: 'Reactivation Blast',
    high_value_followup: 'High-Value Follow-Up',
    maintenance_membership: 'Maintenance / Membership Push'
  };

  const offerSummary = `${campaignData.offerDetails.specialOffer} on ${campaignData.offerDetails.service}`;
  const startDate = new Date().toLocaleDateString();
  const endDate = new Date(campaignData.offerDetails.expiresOn).toLocaleDateString();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review your messages
        </h2>
        <p className="text-gray-600">
          This is what your customers will see. You're in full control.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Text message preview
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={generateMessage}
                disabled={generatingMessage}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${generatingMessage ? 'animate-spin' : ''}`} />
                Regenerate with AI
              </button>
              <button
                onClick={() => setEditingSms(!editingSms)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
                Edit text
              </button>
            </div>
          </div>

          {editingSms ? (
            <div className="space-y-3">
              <textarea
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows="5"
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setSmsText(campaignData.messageSms);
                    setEditingSms(false);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSms}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-900 whitespace-pre-wrap">
              {smsText}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-3">
            We'll personalize this with each customer's name where possible.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Ready to launch?
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Campaign type:</span>
              <span className="font-medium text-gray-900">
                {campaignTypeNames[campaignData.campaignType]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Audience:</span>
              <span className="font-medium text-gray-900">
                {campaignData.audienceSize.toLocaleString()} contacts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Offer:</span>
              <span className="font-medium text-gray-900">
                {offerSummary}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Schedule:</span>
              <span className="font-medium text-gray-900">
                {startDate} through {endDate}
              </span>
            </div>
            {campaignData.pricingMode === 'performance' && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Success fee:</span>
                <span className="font-medium text-gray-900">
                  {campaignData.performanceRate}% of collected revenue for this mission
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          disabled={loading}
        >
          Back
        </Button>
        <Button
          onClick={onLaunch}
          disabled={loading || !campaignData.messageSms}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Launch Cash-Boost Mission
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
