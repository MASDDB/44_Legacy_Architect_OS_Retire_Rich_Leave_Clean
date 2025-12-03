import React, { useState, useEffect } from 'react';
import { Key, Link, BarChart3, AlertCircle, CheckCircle, Clock, Plus, Search, RotateCcw, Trash2, ExternalLink, Copy, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import apiIntegrationService from '../../services/apiIntegrationService';

const ApiIntegrationManagement = () => {
  const [activeTab, setActiveTab] = useState('api-keys');
  const [apiKeys, setApiKeys] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [usageAnalytics, setUsageAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New API Key form state
  const [newKeyData, setNewKeyData] = useState({
    key_name: '',
    permissions: ['leads:read'],
    rate_limit: 1000,
    rate_limit_period: 'hour',
    allowed_ips: [],
    expires_at: ''
  });

  // New Integration form state
  const [newIntegrationData, setNewIntegrationData] = useState({
    integration_type: 'hubspot',
    integration_name: '',
    field_mappings: {},
    sync_settings: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [keysResult, integrationsResult, analyticsResult] = await Promise.all([
        apiIntegrationService?.getApiKeys(),
        apiIntegrationService?.getIntegrations(),
        apiIntegrationService?.getApiUsageAnalytics()
      ]);

      if (keysResult?.error) {
        setError('Failed to load API keys: ' + keysResult?.error);
      } else {
        setApiKeys(keysResult?.data || []);
      }

      if (integrationsResult?.error) {
        setError('Failed to load integrations: ' + integrationsResult?.error);
      } else {
        setIntegrations(integrationsResult?.data || []);
      }

      if (analyticsResult?.error) {
        setError('Failed to load analytics: ' + analyticsResult?.error);
      } else {
        setUsageAnalytics(analyticsResult?.data || []);
      }
    } catch (err) {
      setError('Failed to load data: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const result = await apiIntegrationService?.createApiKey(newKeyData);
      if (result?.error) {
        setError('Failed to create API key: ' + result?.error);
      } else {
        setSuccess('API key created successfully');
        setShowNewKeyModal(false);
        setNewKeyData({
          key_name: '',
          permissions: ['leads:read'],
          rate_limit: 1000,
          rate_limit_period: 'hour',
          allowed_ips: [],
          expires_at: ''
        });
        loadData();
      }
    } catch (err) {
      setError('Failed to create API key: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key?')) return;
    
    try {
      const result = await apiIntegrationService?.revokeApiKey(keyId);
      if (result?.error) {
        setError('Failed to revoke API key: ' + result?.error);
      } else {
        setSuccess('API key revoked successfully');
        loadData();
      }
    } catch (err) {
      setError('Failed to revoke API key: ' + err?.message);
    }
  };

  const handleRegenerateKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to regenerate this API key? The old key will stop working immediately.')) return;
    
    try {
      const result = await apiIntegrationService?.regenerateApiKey(keyId);
      if (result?.error) {
        setError('Failed to regenerate API key: ' + result?.error);
      } else {
        setSuccess('API key regenerated successfully');
        loadData();
      }
    } catch (err) {
      setError('Failed to regenerate API key: ' + err?.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setSuccess('Copied to clipboard');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': case'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'revoked': case'disconnected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredApiKeys = apiKeys?.filter(key => {
    const matchesSearch = key?.key_name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || key?.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const filteredIntegrations = integrations?.filter(integration => {
    const matchesSearch = integration?.integration_name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || integration?.connection_status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (loading && !apiKeys?.length && !integrations?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API & Integration Management</h1>
          <p className="text-gray-600">
            Manage your API keys, third-party integrations, and monitor usage analytics
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'api-keys', label: 'API Keys', icon: Key },
              { id: 'integrations', label: 'Integrations', icon: Link },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'documentation', label: 'Documentation', icon: ExternalLink }
            ]?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-blue-100 text-blue-700' :'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab?.label}
              </button>
            ))}
          </nav>
        </div>

        {/* API Keys Tab */}
        {activeTab === 'api-keys' && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-1 items-center gap-4 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search API keys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e?.target?.value)}
                  className="w-32"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="revoked">Revoked</option>
                  <option value="expired">Expired</option>
                </Select>
              </div>
              <Button
                onClick={() => setShowNewKeyModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Generate New Key
              </Button>
            </div>

            {/* API Keys List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredApiKeys?.length > 0 ? (
                  filteredApiKeys?.map((key) => (
                    <div key={key?.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(key?.status)}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {key?.key_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Created {new Date(key?.created_at)?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(key?.api_key)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRegenerateKey(key?.id)}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Regenerate
                          </Button>
                          {key?.status === 'active' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRevokeKey(key?.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Rate Limit:</span>
                          <span className="ml-2 text-gray-900">
                            {key?.rate_limit} per {key?.rate_limit_period}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Usage:</span>
                          <span className="ml-2 text-gray-900">{key?.usage_count || 0} calls</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Permissions:</span>
                          <span className="ml-2 text-gray-900">
                            {Array.isArray(key?.permissions) ? key?.permissions?.join(', ') : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Used:</span>
                          <span className="ml-2 text-gray-900">
                            {key?.last_used_at ? new Date(key?.last_used_at)?.toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No API keys found</p>
                    <Button
                      onClick={() => setShowNewKeyModal(true)}
                      className="mt-4"
                    >
                      Generate Your First API Key
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e?.target?.value)}
                  className="w-40"
                >
                  <option value="all">All Status</option>
                  <option value="connected">Connected</option>
                  <option value="disconnected">Disconnected</option>
                  <option value="error">Error</option>
                </Select>
              </div>
              <Button
                onClick={() => setShowNewIntegrationModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Integration
              </Button>
            </div>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations?.length > 0 ? (
                filteredIntegrations?.map((integration) => (
                  <div key={integration?.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {integration?.integration_name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {integration?.integration_type}
                          </p>
                        </div>
                      </div>
                      {getStatusIcon(integration?.connection_status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="font-medium capitalize">{integration?.connection_status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Sync:</span>
                        <span className="font-medium">
                          {integration?.last_sync_at 
                            ? new Date(integration?.last_sync_at)?.toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Test
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No integrations found</p>
                  <Button
                    onClick={() => setShowNewIntegrationModal(true)}
                    className="mt-4"
                  >
                    Add Your First Integration
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total API Calls</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {usageAnalytics?.length || 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Keys</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {apiKeys?.filter(k => k?.status === 'active')?.length || 0}
                    </p>
                  </div>
                  <Key className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connected Integrations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {integrations?.filter(i => i?.connection_status === 'connected')?.length || 0}
                    </p>
                  </div>
                  <Link className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Usage Chart Placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">API Usage Over Time</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Usage analytics chart will be displayed here</p>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'documentation' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">API Documentation</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Authentication</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Include your API key in the Authorization header:</p>
                  <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Base URL</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm text-gray-800">
                    https://api.yourapp.com/v1
                  </code>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Endpoints</h4>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-mono">GET</span>
                      <code className="text-sm">/leads</code>
                    </div>
                    <p className="text-sm text-gray-600">Retrieve all leads</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-mono">POST</span>
                      <code className="text-sm">/leads</code>
                    </div>
                    <p className="text-sm text-gray-600">Create a new lead</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-mono">GET</span>
                      <code className="text-sm">/campaigns</code>
                    </div>
                    <p className="text-sm text-gray-600">Retrieve all campaigns</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Rate Limits</h4>
                <p className="text-sm text-gray-700">
                  Rate limits are applied per API key. Default limits are 1,000 requests per hour.
                  Check the <code className="bg-gray-100 px-1 rounded">X-RateLimit-Remaining</code> header
                  to see your remaining quota.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* New API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generate New API Key</h3>
              <form onSubmit={handleCreateApiKey} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <Input
                    type="text"
                    value={newKeyData?.key_name}
                    onChange={(e) => setNewKeyData({...newKeyData, key_name: e?.target?.value})}
                    placeholder="e.g. Production API Key"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate Limit
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={newKeyData?.rate_limit}
                      onChange={(e) => setNewKeyData({...newKeyData, rate_limit: parseInt(e?.target?.value)})}
                      className="flex-1"
                    />
                    <Select
                      value={newKeyData?.rate_limit_period}
                      onChange={(e) => setNewKeyData({...newKeyData, rate_limit_period: e?.target?.value})}
                      className="w-24"
                    >
                      <option value="minute">per minute</option>
                      <option value="hour">per hour</option>
                      <option value="day">per day</option>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewKeyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Generate Key
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiIntegrationManagement;