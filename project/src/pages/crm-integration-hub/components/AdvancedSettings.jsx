import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw, AlertTriangle, CheckCircle, Trash2, Shield, Database, Webhook, Bell, Clock } from 'lucide-react';


const AdvancedSettings = ({ connections, selectedConnection, onConnectionSelect }) => {
  const [settings, setSettings] = useState({
    webhooks: [],
    customFields: [],
    apiLimits: {
      requestsPerMinute: 60,
      bulkOperationLimit: 1000
    },
    notifications: {
      syncSuccess: true,
      syncFailure: true,
      connectionErrors: true,
      weeklyReports: false
    },
    security: {
      encryptionEnabled: true,
      auditLogging: true,
      ipRestrictions: []
    },
    advanced: {
      retryAttempts: 3,
      timeoutSeconds: 30,
      batchSize: 100,
      enableCaching: true
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'custom-fields', label: 'Custom Fields', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Clock }
  ];

  useEffect(() => {
    if (selectedConnection?.id) {
      loadAdvancedSettings();
    }
  }, [selectedConnection]);

  const loadAdvancedSettings = async () => {
    if (!selectedConnection?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would load from the database
      // For now, we'll use mock data
      setSettings(prev => ({
        ...prev,
        connectionId: selectedConnection?.id
      }));
    } catch (err) {
      setError(err?.message || 'Failed to load advanced settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      // In a real implementation, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
  };

  const addWebhook = () => {
    const newWebhook = {
      id: crypto.randomUUID(),
      url: '',
      events: [],
      isActive: true
    };
    setSettings(prev => ({
      ...prev,
      webhooks: [...prev?.webhooks, newWebhook]
    }));
  };

  const removeWebhook = (webhookId) => {
    setSettings(prev => ({
      ...prev,
      webhooks: prev?.webhooks?.filter(w => w?.id !== webhookId)
    }));
  };

  const addCustomField = () => {
    const newField = {
      id: crypto.randomUUID(),
      name: '',
      type: 'string',
      required: false,
      defaultValue: ''
    };
    setSettings(prev => ({
      ...prev,
      customFields: [...prev?.customFields, newField]
    }));
  };

  const removeCustomField = (fieldId) => {
    setSettings(prev => ({
      ...prev,
      customFields: prev?.customFields?.filter(f => f?.id !== fieldId)
    }));
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">General Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Rate Limit (per minute)
                </label>
                <input
                  type="number"
                  value={settings?.apiLimits?.requestsPerMinute || 60}
                  onChange={(e) => updateSettings('apiLimits', 'requestsPerMinute', parseInt(e?.target?.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">Maximum API requests per minute</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulk Operation Limit
                </label>
                <input
                  type="number"
                  value={settings?.apiLimits?.bulkOperationLimit || 1000}
                  onChange={(e) => updateSettings('apiLimits', 'bulkOperationLimit', parseInt(e?.target?.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">Maximum records per bulk operation</p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Rate Limiting</span>
              </div>
              <p className="text-sm text-yellow-700">
                These limits help prevent API throttling. Adjust based on your CRM provider's rate limits.
              </p>
            </div>
          </div>
        );

      case 'webhooks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Webhook Configuration</h4>
              <button
                onClick={addWebhook}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Webhook className="w-4 h-4" />
                Add Webhook
              </button>
            </div>
            <div className="space-y-4">
              {settings?.webhooks?.length > 0 ? (
                settings?.webhooks?.map((webhook, index) => (
                  <div key={webhook?.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900">Webhook {index + 1}</h5>
                      <button
                        onClick={() => removeWebhook(webhook?.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://api.yourapp.com/webhook"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Events
                        </label>
                        <select
                          multiple
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="sync.started">Sync Started</option>
                          <option value="sync.completed">Sync Completed</option>
                          <option value="sync.failed">Sync Failed</option>
                          <option value="connection.error">Connection Error</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={webhook?.isActive}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Webhook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h5 className="font-medium text-gray-900 mb-2">No Webhooks Configured</h5>
                  <p className="text-sm text-gray-600 mb-4">
                    Set up webhooks to receive real-time notifications about sync events.
                  </p>
                  <button
                    onClick={addWebhook}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Webhook className="w-4 h-4" />
                    Add First Webhook
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'custom-fields':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Custom Fields</h4>
              <button
                onClick={addCustomField}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Database className="w-4 h-4" />
                Add Field
              </button>
            </div>
            <div className="space-y-4">
              {settings?.customFields?.length > 0 ? (
                settings?.customFields?.map((field, index) => (
                  <div key={field?.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900">Custom Field {index + 1}</h5>
                      <button
                        onClick={() => removeCustomField(field?.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Name
                        </label>
                        <input
                          type="text"
                          placeholder="field_name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="string">Text</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                          <option value="email">Email</option>
                          <option value="url">URL</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Value
                        </label>
                        <input
                          type="text"
                          placeholder="Default value"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Required field</span>
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h5 className="font-medium text-gray-900 mb-2">No Custom Fields</h5>
                  <p className="text-sm text-gray-600 mb-4">
                    Create custom fields to capture additional data not available in standard CRM fields.
                  </p>
                  <button
                    onClick={addCustomField}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Database className="w-4 h-4" />
                    Add First Field
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Notification Settings</h4>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Email Notifications</h5>
                <div className="space-y-3">
                  {Object.entries(settings?.notifications || {})?.map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateSettings('notifications', key, e?.target?.checked)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {key?.split(/(?=[A-Z])/)?.join(' ')?.replace(/^\w/, c => c?.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-600">
                          {key === 'syncSuccess' && 'Notify when synchronization completes successfully'}
                          {key === 'syncFailure' && 'Notify when synchronization fails'}
                          {key === 'connectionErrors' && 'Notify about connection issues'}
                          {key === 'weeklyReports' && 'Send weekly sync summary reports'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Security Settings</h4>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Data Protection</h5>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings?.security?.encryptionEnabled}
                      onChange={(e) => updateSettings('security', 'encryptionEnabled', e?.target?.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Enable Encryption</div>
                      <div className="text-sm text-gray-600">Encrypt all data in transit and at rest</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings?.security?.auditLogging}
                      onChange={(e) => updateSettings('security', 'auditLogging', e?.target?.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Audit Logging</div>
                      <div className="text-sm text-gray-600">Log all API calls and data access</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Security Best Practices</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Regularly rotate API keys and tokens</li>
                  <li>• Monitor for unusual access patterns</li>
                  <li>• Use IP restrictions when possible</li>
                  <li>• Enable two-factor authentication</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Performance Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings?.advanced?.retryAttempts || 3}
                  onChange={(e) => updateSettings('advanced', 'retryAttempts', parseInt(e?.target?.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">Number of retry attempts for failed requests</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={settings?.advanced?.timeoutSeconds || 30}
                  onChange={(e) => updateSettings('advanced', 'timeoutSeconds', parseInt(e?.target?.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">Request timeout in seconds</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Size
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={settings?.advanced?.batchSize || 100}
                  onChange={(e) => updateSettings('advanced', 'batchSize', parseInt(e?.target?.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">Number of records to process in each batch</p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings?.advanced?.enableCaching}
                    onChange={(e) => updateSettings('advanced', 'enableCaching', e?.target?.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Enable Caching</div>
                    <div className="text-sm text-gray-600">Cache API responses to improve performance</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!connections?.length) {
    return (
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Connections Available
        </h3>
        <p className="text-gray-600">
          Create a CRM connection first to access advanced settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Advanced Settings
        </h3>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Select Connection:
          </label>
          <select
            value={selectedConnection?.id || ''}
            onChange={(e) => {
              const connection = connections?.find(c => c?.id === e?.target?.value);
              onConnectionSelect?.(connection);
            }}
            className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a connection...</option>
            {connections?.map((connection) => (
              <option key={connection?.id} value={connection?.id}>
                {connection?.connection_name} ({connection?.provider})
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedConnection && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <nav className="space-y-2">
              {sections?.map((section) => (
                <button
                  key={section?.id}
                  onClick={() => setActiveSection(section?.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section?.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' :'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section?.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {sections?.find(s => s?.id === activeSection)?.label} Settings
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Configure advanced options for {selectedConnection?.connection_name}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {success && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Settings saved</span>
                  </div>
                )}
                
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Settings
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-700 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading settings...</p>
              </div>
            ) : (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderSectionContent()}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;