import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Zap,
  Shield,
  Settings
} from 'lucide-react';
import { crmService } from '../../../services/crmService';

const IntegrationSetupWizard = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [connectionData, setConnectionData] = useState({
    connection_name: '',
    provider: '',
    oauth_access_token: '',
    oauth_refresh_token: '',
    connection_data: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const providers = crmService?.getCRMProviders();
  const totalSteps = 4;

  const steps = [
    { id: 1, title: 'Choose Provider', description: 'Select your CRM system' },
    { id: 2, title: 'Configure', description: 'Set up connection details' },
    { id: 3, title: 'Authenticate', description: 'Connect to your CRM' },
    { id: 4, title: 'Complete', description: 'Finalize setup' }
  ];

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setConnectionData(prev => ({
      ...prev,
      provider: provider?.id,
      connection_name: `${provider?.name} Integration`
    }));
  };

  const handleNext = async () => {
    setError(null);
    
    if (currentStep === 3) {
      // Handle authentication step
      await handleAuthenticate();
    } else if (currentStep === 4) {
      // Complete setup
      await handleCompleteSetup();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleAuthenticate = async () => {
    try {
      setLoading(true);
      
      // Simulate OAuth flow - in real implementation, this would redirect to CRM OAuth
      const mockTokens = {
        oauth_access_token: `mock_access_token_${Date.now()}`,
        oauth_refresh_token: `mock_refresh_token_${Date.now()}`,
        oauth_expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)?.toISOString() // 90 days
      };

      setConnectionData(prev => ({
        ...prev,
        ...mockTokens,
        connection_status: 'connected'
      }));

      setCurrentStep(4);
    } catch (err) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSetup = async () => {
    try {
      setLoading(true);
      
      const result = await crmService?.createCRMConnection(connectionData);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      onSuccess?.();
    } catch (err) {
      setError(err?.message || 'Failed to create connection');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Choose Your CRM Provider
              </h3>
              <p className="text-gray-600">
                Select the CRM system you want to integrate with
              </p>
            </div>
            <div className="grid gap-4">
              {providers?.map((provider) => (
                <motion.button
                  key={provider?.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProviderSelect(provider)}
                  className={`p-6 border-2 rounded-xl text-left transition-colors ${
                    selectedProvider?.id === provider?.id
                      ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{provider?.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {provider?.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {provider?.description}
                        </p>
                      </div>
                    </div>
                    {provider?.isPopular && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {provider?.features?.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Configure {selectedProvider?.name} Integration
              </h3>
              <p className="text-gray-600">
                Set up your connection details
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Name
                </label>
                <input
                  type="text"
                  value={connectionData?.connection_name || ''}
                  onChange={(e) => setConnectionData(prev => ({
                    ...prev,
                    connection_name: e?.target?.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a name for this connection"
                />
              </div>

              {selectedProvider?.id === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Endpoint URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://api.yourcrm.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your API key"
                    />
                  </div>
                </>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Security Notice</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your authentication credentials are encrypted and stored securely. 
                  We never store passwords in plain text.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Authenticate with {selectedProvider?.name}
              </h3>
              <p className="text-gray-600">
                Connect to your CRM account securely
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <div className="text-4xl">{selectedProvider?.icon}</div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Click the button below to authenticate with your {selectedProvider?.name} account.
                  You'll be redirected to {selectedProvider?.name} to authorize the connection.
                </p>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Permissions Required</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    This integration will request read and write access to your contacts, 
                    companies, and deals data.
                  </p>
                </div>

                <button
                  onClick={handleAuthenticate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <ExternalLink className="w-5 h-5" />
                  )}
                  {loading ? 'Authenticating...' : `Connect to ${selectedProvider?.name}`}
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integration Complete!
              </h3>
              <p className="text-gray-600">
                Your {selectedProvider?.name} integration has been set up successfully
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Connection Established</span>
                </div>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Connection Name:</strong> {connectionData?.connection_name}</p>
                  <p><strong>Provider:</strong> {selectedProvider?.name}</p>
                  <p><strong>Status:</strong> Connected</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Next Steps</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Configure field mappings to define data synchronization</li>
                  <li>• Set up sync schedules and conflict resolution rules</li>
                  <li>• Test the connection and run your first sync</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedProvider !== null;
      case 2:
        return connectionData?.connection_name?.trim()?.length > 0;
      case 3:
        return connectionData?.oauth_access_token;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e?.target === e?.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add CRM Integration
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep > step?.id
                    ? 'bg-green-600 text-white'
                    : currentStep === step?.id
                    ? 'bg-blue-600 text-white' :'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step?.id ? <Check className="w-4 h-4" /> : step?.id}
                </div>
                {index < steps?.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step?.id ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps?.map((step) => (
              <div key={step?.id} className="text-xs text-gray-600 text-center" style={{ width: '8rem' }}>
                <div className="font-medium">{step?.title}</div>
                <div>{step?.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-96 max-h-96 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {currentStep === 3 ? 'Authenticate' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleCompleteSetup}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Complete Setup
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IntegrationSetupWizard;