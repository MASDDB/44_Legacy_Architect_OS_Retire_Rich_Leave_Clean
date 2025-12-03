import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';




const CampaignPreview = ({ 
  campaign, 
  messages, 
  settings, 
  flowNodes, 
  flowEdges, 
  onClose, 
  onLaunch, 
  isOpen 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const previewSteps = [
    'Campaign Overview',
    'Message Flow',
    'Settings & Compliance',
    'Final Review'
  ];

  if (!isOpen) return null;

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'sms': return 'MessageSquare';
      case 'email': return 'Mail';
      case 'phone': return 'Phone';
      default: return 'MessageCircle';
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose?.();
    }
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e?.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, onClose]);

  const renderCampaignOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Campaign Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{settings?.name || 'Unnamed Campaign'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Description:</span>
              <span className="font-medium">{settings?.description || 'No description'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Industry:</span>
              <span className="font-medium">{settings?.industry || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Flow Type:</span>
              <span className="font-medium capitalize">{settings?.flowType?.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Campaign Statistics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Messages:</span>
              <span className="font-medium">{messages?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Channels:</span>
              <span className="font-medium">{new Set(messages?.map(m => m?.channel))?.size || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Daily Limit:</span>
              <span className="font-medium">{settings?.dailyLimit || 'No limit'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Limit:</span>
              <span className="font-medium">{settings?.totalLimit || 'No limit'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessageFlow = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Message Sequence</h4>
      {messages?.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No messages added to this campaign</p>
      ) : (
        <div className="space-y-4">
          {messages?.map((message, index) => (
            <div key={message?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name={getChannelIcon(message?.channel)} size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{message?.name}</h5>
                    <p className="text-sm text-gray-500 capitalize">{message?.channel}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {message?.delay > 0 ? `+${message?.delay}min` : 'Immediate'}
                </div>
              </div>
              
              {message?.subject && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700">Subject: </span>
                  <span className="text-sm text-gray-600">{message?.subject}</span>
                </div>
              )}
              
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {message?.content?.substring(0, 200)}{message?.content?.length > 200 ? '...' : ''}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {message?.abTest && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">A/B Test</span>
                )}
                {message?.skipIfResponded && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Skip if Responded</span>
                )}
                {message?.skipIfBooked && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Skip if Booked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsCompliance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Schedule Settings</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Timezone:</span>
              <span className="font-medium">{settings?.timezone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Business Hours:</span>
              <span className="font-medium">{settings?.startTime} - {settings?.endTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Days:</span>
              <span className="font-medium">{settings?.activeDays?.length} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Launch Date:</span>
              <span className="font-medium">{settings?.launchDate || 'Immediate'}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Compliance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">TCPA Compliance:</span>
              <Icon 
                name={settings?.tcpaCompliance ? 'CheckCircle' : 'XCircle'} 
                size={16} 
                className={settings?.tcpaCompliance ? 'text-green-500' : 'text-red-500'} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">CAN-SPAM:</span>
              <Icon 
                name={settings?.canSpamCompliance ? 'CheckCircle' : 'XCircle'} 
                size={16} 
                className={settings?.canSpamCompliance ? 'text-green-500' : 'text-red-500'} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">GDPR:</span>
              <Icon 
                name={settings?.gdprCompliance ? 'CheckCircle' : 'XCircle'} 
                size={16} 
                className={settings?.gdprCompliance ? 'text-green-500' : 'text-red-500'} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Auto Opt-out:</span>
              <Icon 
                name={settings?.autoOptOut ? 'CheckCircle' : 'XCircle'} 
                size={16} 
                className={settings?.autoOptOut ? 'text-green-500' : 'text-red-500'} 
              />
            </div>
          </div>
        </div>
      </div>

      {settings?.abTestEnabled && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">A/B Testing Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Test Duration:</span>
              <span className="font-medium">{settings?.testDuration} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Traffic Split:</span>
              <span className="font-medium">{settings?.trafficSplit}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Min Sample:</span>
              <span className="font-medium">{settings?.minSampleSize}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFinalReview = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon name="Info" size={20} className="text-blue-600 mr-3" />
          <div>
            <h4 className="font-medium text-blue-900">Ready to Launch</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your campaign is configured and ready to launch. Review the summary below before proceeding.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="MessageSquare" size={24} className="text-primary" />
          </div>
          <h4 className="font-medium text-gray-900">{messages?.length}</h4>
          <p className="text-sm text-gray-500">Total Messages</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Users" size={24} className="text-success" />
          </div>
          <h4 className="font-medium text-gray-900">All Leads</h4>
          <p className="text-sm text-gray-500">Target Audience</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Clock" size={24} className="text-warning" />
          </div>
          <h4 className="font-medium text-gray-900">
            {settings?.launchDate || 'Immediate'}
          </h4>
          <p className="text-sm text-gray-500">Launch Schedule</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Pre-launch Checklist</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" />
            <span className="text-sm">Campaign configured</span>
          </div>
          <div className="flex items-center">
            <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" />
            <span className="text-sm">Messages created</span>
          </div>
          <div className="flex items-center">
            <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" />
            <span className="text-sm">Compliance settings verified</span>
          </div>
          <div className="flex items-center">
            <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" />
            <span className="text-sm">Schedule configured</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Campaign Preview</h2>
            <p className="text-sm text-gray-600 mt-1">
              Review your campaign before launching
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="border-b bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {previewSteps?.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center ${index < previewSteps?.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentStep
                      ? 'bg-blue-600 text-white'
                      : index < currentStep
                      ? 'bg-green-600 text-white' :'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index === currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < previewSteps?.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 0 && renderCampaignOverview()}
          {currentStep === 1 && renderMessageFlow()}
          {currentStep === 2 && renderSettingsCompliance()}
          {currentStep === 3 && renderFinalReview()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <Icon name="ChevronLeft" size={16} className="mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close Preview
            </Button>
            
            {currentStep === previewSteps?.length - 1 ? (
              <Button
                onClick={onLaunch}
                disabled={messages?.length === 0}
              >
                <Icon name="Rocket" size={16} className="mr-2" />
                Launch Campaign
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep(Math.min(previewSteps?.length - 1, currentStep + 1))}
              >
                Next
                <Icon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreview;