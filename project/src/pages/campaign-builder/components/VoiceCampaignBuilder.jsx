import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import voiceService from '../../../services/voiceService';

const VoiceCampaignBuilder = ({ 
  campaign, 
  selectedLeads = [], 
  onSendVoice, 
  onClose, 
  isOpen 
}) => {
  const [loading, setLoading] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'alice',
    language: 'en-US',
    speed: '1.0',
    pitch: '0'
  });
  const [retrySettings, setRetrySettings] = useState({
    maxRetries: 3,
    retryDelay: 3600,
    retryOnNoAnswer: true,
    retryOnBusy: true
  });
  const [messageContent, setMessageContent] = useState(
    campaign?.message_template || ''
  );
  const [results, setResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load existing voice campaign settings
  useEffect(() => {
    if (isOpen && campaign?.id) {
      loadVoiceCampaignSettings();
    }
  }, [isOpen, campaign?.id]);

  const loadVoiceCampaignSettings = async () => {
    try {
      const { data, success } = await voiceService?.getVoiceCampaignSettings(campaign?.id);
      if (success && data) {
        setVoiceSettings(data?.voiceSettings || voiceSettings);
        setRetrySettings(data?.retrySettings || retrySettings);
      }
    } catch (error) {
      console.error('Error loading voice campaign settings:', error);
    }
  };

  const handleSendVoiceCampaign = async () => {
    if (!campaign?.id || selectedLeads?.length === 0) {
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      // Save voice campaign settings first
      await voiceService?.upsertVoiceCampaignSettings(campaign?.id, {
        voiceSettings,
        retrySettings,
        complianceSettings: {
          tcpaCompliant: true,
          dncCheck: true,
          consentRequired: true,
          optOutKeywords: ['STOP', 'UNSUBSCRIBE']
        },
        callScheduling: {
          respectTimezones: true,
          businessHoursOnly: true,
          startTime: '09:00',
          endTime: '17:00',
          activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      });

      // Send voice calls to selected leads
      const callResults = [];
      
      for (const lead of selectedLeads) {
        if (lead?.phone) {
          const result = await voiceService?.sendVoiceCall(
            campaign?.id,
            lead?.id,
            lead?.phone,
            messageContent,
            voiceSettings
          );
          
          callResults?.push({
            leadId: lead?.id,
            leadName: lead?.first_name ? `${lead?.first_name} ${lead?.last_name}` : 'Unknown Lead',
            phone: lead?.phone,
            success: result?.success,
            error: result?.error,
            data: result?.data
          });
        } else {
          callResults?.push({
            leadId: lead?.id,
            leadName: lead?.first_name ? `${lead?.first_name} ${lead?.last_name}` : 'Unknown Lead',
            phone: 'No phone number',
            success: false,
            error: 'No phone number provided'
          });
        }
      }

      const successfulCalls = callResults?.filter(r => r?.success)?.length;
      const failedCalls = callResults?.filter(r => !r?.success)?.length;

      setResults({
        totalAttempts: callResults?.length,
        successfulCalls,
        failedCalls,
        details: callResults
      });

      // Call parent callback
      if (onSendVoice) {
        onSendVoice({
          campaignId: campaign?.id,
          callResults,
          summary: {
            totalAttempts: callResults?.length,
            successfulCalls,
            failedCalls
          }
        });
      }
    } catch (error) {
      console.error('Voice campaign error:', error);
      setResults({
        totalAttempts: selectedLeads?.length,
        successfulCalls: 0,
        failedCalls: selectedLeads?.length,
        error: error?.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResults(null);
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="Phone" size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Voice Campaign Builder</h2>
              <p className="text-sm text-gray-500">
                Send voice calls to {selectedLeads?.length} selected leads
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!results ? (
            <>
              {/* Campaign Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Campaign Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Campaign:</span>
                    <p className="font-medium">{campaign?.name || 'Untitled Campaign'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Selected Leads:</span>
                    <p className="font-medium">{selectedLeads?.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Est. Cost:</span>
                    <p className="font-medium">${(selectedLeads?.length * 0.05)?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Message Content
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e?.target?.value)}
                  placeholder="Enter the message content that will be converted to speech..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Character count: {messageContent?.length} (recommended: 100-300 characters)
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                  </Button>
                </div>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Voice Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voice
                      </label>
                      <Select
                        value={voiceSettings?.voice}
                        onChange={(value) => setVoiceSettings(prev => ({ ...prev, voice: value }))}
                        options={[
                          { value: 'alice', label: 'Alice (Female)' },
                          { value: 'man', label: 'Man (Male)' },
                          { value: 'woman', label: 'Woman (Female)' },
                          { value: 'Polly.Amy', label: 'Amy (British Female)' },
                          { value: 'Polly.Brian', label: 'Brian (British Male)' }
                        ]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <Select
                        value={voiceSettings?.language}
                        onChange={(value) => setVoiceSettings(prev => ({ ...prev, language: value }))}
                        options={[
                          { value: 'en-US', label: 'English (US)' },
                          { value: 'en-GB', label: 'English (UK)' },
                          { value: 'es-ES', label: 'Spanish' },
                          { value: 'fr-FR', label: 'French' },
                          { value: 'de-DE', label: 'German' }
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Speed: {voiceSettings?.speed}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={voiceSettings?.speed}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: e?.target?.value }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pitch: {voiceSettings?.pitch}
                      </label>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        step="1"
                        value={voiceSettings?.pitch}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: e?.target?.value }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-3">Retry Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Retries
                      </label>
                      <Input
                        type="number"
                        value={retrySettings?.maxRetries}
                        onChange={(e) => setRetrySettings(prev => ({ ...prev, maxRetries: parseInt(e?.target?.value) }))}
                        min="0"
                        max="5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retry Delay (seconds)
                      </label>
                      <Input
                        type="number"
                        value={retrySettings?.retryDelay}
                        onChange={(e) => setRetrySettings(prev => ({ ...prev, retryDelay: parseInt(e?.target?.value) }))}
                        min="300"
                        max="86400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <Checkbox
                          id="retryOnNoAnswer"
                          checked={retrySettings?.retryOnNoAnswer}
                          onChange={(checked) => setRetrySettings(prev => ({ ...prev, retryOnNoAnswer: checked }))}
                          label="Retry on no answer"
                        />
                        <Checkbox
                          id="retryOnBusy"
                          checked={retrySettings?.retryOnBusy}
                          onChange={(checked) => setRetrySettings(prev => ({ ...prev, retryOnBusy: checked }))}
                          label="Retry on busy signal"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Leads Preview */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Selected Leads</h3>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                  {selectedLeads?.map((lead, index) => (
                    <div key={lead?.id || index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">
                          {lead?.first_name ? `${lead?.first_name} ${lead?.last_name}` : 'Unknown Lead'}
                        </p>
                        <p className="text-xs text-gray-500">{lead?.phone || 'No phone number'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{lead?.company?.name}</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                          lead?.phone ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {lead?.phone ? 'Ready' : 'No phone'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Results */
            (<div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Phone" size={24} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Campaign Sent!</h3>
                <p className="text-gray-600">
                  {results?.successfulCalls} out of {results?.totalAttempts} calls were initiated successfully
                </p>
              </div>
              {/* Results Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{results?.successfulCalls}</p>
                  <p className="text-sm text-green-600">Successful</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{results?.failedCalls}</p>
                  <p className="text-sm text-red-600">Failed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{results?.totalAttempts}</p>
                  <p className="text-sm text-blue-600">Total</p>
                </div>
              </div>
              {/* Detailed Results */}
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {results?.details?.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{result?.leadName}</p>
                      <p className="text-xs text-gray-500">{result?.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        result?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result?.success ? 'Initiated' : 'Failed'}
                      </span>
                      {result?.error && (
                        <p className="text-xs text-red-500 mt-1">{result?.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>)
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {!results && `Est. cost: $${(selectedLeads?.length * 0.05)?.toFixed(2)} • ${selectedLeads?.length} calls`}
            {results && `Campaign completed at ${new Date()?.toLocaleTimeString()}`}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {results ? 'Close' : 'Cancel'}
            </Button>
            {!results && (
              <Button
                variant="default"
                onClick={handleSendVoiceCampaign}
                disabled={loading || selectedLeads?.length === 0 || !messageContent?.trim()}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Sending Calls...
                  </>
                ) : (
                  <>
                    <Icon name="Phone" size={16} className="mr-2" />
                    Send Voice Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCampaignBuilder;