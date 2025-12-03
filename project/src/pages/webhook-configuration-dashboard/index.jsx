import React, { useState, useEffect } from 'react';
import { Webhook, Play, Pause, Trash2, Plus, Search, CheckCircle, AlertCircle, Clock, RotateCcw, Eye, Activity, TrendingUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import Header from '../../components/ui/Header';
import webhookService from '../../services/webhookService';

const WebhookConfigurationDashboard = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('webhooks');
  const [showNewWebhookModal, setShowNewWebhookModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New webhook form state
  const [newWebhookData, setNewWebhookData] = useState({
    webhook_name: '',
    endpoint_url: '',
    event_types: [],
    retry_attempts: 3,
    timeout_seconds: 30,
    headers: {},
    payload_template: null
  });

  const availableEventTypes = webhookService?.getAvailableEventTypes();

  useEffect(() => {
    loadWebhooks();
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (selectedWebhook) {
      loadDeliveries(selectedWebhook?.id);
    }
  }, [selectedWebhook]);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const result = await webhookService?.getWebhooks();
      if (result?.error) {
        setError('Failed to load webhooks: ' + result?.error);
      } else {
        setWebhooks(result?.data || []);
      }
    } catch (err) {
      setError('Failed to load webhooks: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveries = async (webhookId) => {
    try {
      const result = await webhookService?.getWebhookDeliveries(webhookId, 50);
      if (result?.error) {
        setError('Failed to load deliveries: ' + result?.error);
      } else {
        setDeliveries(result?.data || []);
      }
    } catch (err) {
      setError('Failed to load deliveries: ' + err?.message);
    }
  };

  const loadAnalytics = async () => {
    try {
      const result = await webhookService?.getWebhookAnalytics();
      if (result?.error) {
        setError('Failed to load analytics: ' + result?.error);
      } else {
        setAnalytics(result?.data?.analytics || {});
      }
    } catch (err) {
      setError('Failed to load analytics: ' + err?.message);
    }
  };

  const handleCreateWebhook = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const result = await webhookService?.createWebhook(newWebhookData);
      if (result?.error) {
        setError('Failed to create webhook: ' + result?.error);
      } else {
        setSuccess('Webhook created successfully');
        setShowNewWebhookModal(false);
        setNewWebhookData({
          webhook_name: '',
          endpoint_url: '',
          event_types: [],
          retry_attempts: 3,
          timeout_seconds: 30,
          headers: {},
          payload_template: null
        });
        loadWebhooks();
      }
    } catch (err) {
      setError('Failed to create webhook: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWebhook = async (webhookId, isActive) => {
    try {
      const result = await webhookService?.toggleWebhookStatus(webhookId, !isActive);
      if (result?.error) {
        setError('Failed to toggle webhook: ' + result?.error);
      } else {
        setSuccess(`Webhook ${!isActive ? 'activated' : 'deactivated'} successfully`);
        loadWebhooks();
      }
    } catch (err) {
      setError('Failed to toggle webhook: ' + err?.message);
    }
  };

  const handleTestWebhook = async (webhookId) => {
    try {
      const result = await webhookService?.testWebhook(webhookId);
      if (result?.error) {
        setError('Failed to test webhook: ' + result?.error);
      } else {
        setSuccess('Test webhook sent successfully');
        if (selectedWebhook?.id === webhookId) {
          loadDeliveries(webhookId);
        }
      }
    } catch (err) {
      setError('Failed to test webhook: ' + err?.message);
    }
  };

  const handleDeleteWebhook = async (webhookId) => {
    if (!window.confirm('Are you sure you want to delete this webhook?')) return;
    
    try {
      const result = await webhookService?.deleteWebhook(webhookId);
      if (result?.error) {
        setError('Failed to delete webhook: ' + result?.error);
      } else {
        setSuccess('Webhook deleted successfully');
        if (selectedWebhook?.id === webhookId) {
          setSelectedWebhook(null);
        }
        loadWebhooks();
      }
    } catch (err) {
      setError('Failed to delete webhook: ' + err?.message);
    }
  };

  const handleRetryDelivery = async (deliveryId) => {
    try {
      const result = await webhookService?.retryWebhookDelivery(deliveryId);
      if (result?.error) {
        setError('Failed to retry delivery: ' + result?.error);
      } else {
        setSuccess('Webhook retry initiated');
        if (selectedWebhook) {
          loadDeliveries(selectedWebhook?.id);
        }
      }
    } catch (err) {
      setError('Failed to retry delivery: ' + err?.message);
    }
  };

  const viewDeliveryDetails = async (deliveryId) => {
    try {
      const result = await webhookService?.getDeliveryDetails(deliveryId);
      if (result?.error) {
        setError('Failed to load delivery details: ' + result?.error);
      } else {
        setSelectedDelivery(result?.data);
        setShowDeliveryModal(true);
      }
    } catch (err) {
      setError('Failed to load delivery details: ' + err?.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setSuccess('Copied to clipboard');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDeliveryStatusColor = (responseStatus) => {
    if (!responseStatus) return 'text-gray-500';
    if (responseStatus >= 200 && responseStatus < 300) return 'text-green-500';
    if (responseStatus >= 400) return 'text-red-500';
    return 'text-yellow-500';
  };

  const filteredWebhooks = webhooks?.filter(webhook => {
    const matchesSearch = webhook?.webhook_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         webhook?.endpoint_url?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || webhook?.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (loading && !webhooks?.length) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Webhook Configuration Dashboard</h1>
          <p className="text-gray-600">
            Configure webhooks for real-time event notifications to external systems
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Webhook className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Webhooks</p>
                <p className="text-2xl font-bold text-gray-900">{webhooks?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Webhooks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {webhooks?.filter(w => w?.status === 'active')?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.successRate || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalDeliveries || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'webhooks', label: 'Webhooks', icon: Webhook },
              { id: 'deliveries', label: 'Delivery Logs', icon: Activity },
              { id: 'testing', label: 'Testing', icon: Play }
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

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-1 items-center gap-4 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search webhooks..."
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
                  <option value="inactive">Inactive</option>
                  <option value="failed">Failed</option>
                </Select>
              </div>
              <Button
                onClick={() => setShowNewWebhookModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Webhook
              </Button>
            </div>

            {/* Webhooks List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Configured Webhooks</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredWebhooks?.length > 0 ? (
                  filteredWebhooks?.map((webhook) => (
                    <div key={webhook?.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(webhook?.status)}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {webhook?.webhook_name}
                            </h4>
                            <p className="text-sm text-gray-500">{webhook?.endpoint_url}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestWebhook(webhook?.id)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Test
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleWebhook(webhook?.id, webhook?.is_active)}
                          >
                            {webhook?.is_active ? (
                              <>
                                <Pause className="w-3 h-3 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedWebhook(webhook)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteWebhook(webhook?.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Events:</span>
                          <span className="ml-2 text-gray-900">
                            {Array.isArray(webhook?.event_types) ? webhook?.event_types?.join(', ') : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Retry Attempts:</span>
                          <span className="ml-2 text-gray-900">{webhook?.retry_attempts || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeout:</span>
                          <span className="ml-2 text-gray-900">{webhook?.timeout_seconds}s</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-2 text-gray-900">
                            {new Date(webhook?.created_at)?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No webhooks configured</p>
                    <Button
                      onClick={() => setShowNewWebhookModal(true)}
                      className="mt-4"
                    >
                      Create Your First Webhook
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === 'deliveries' && (
          <div className="space-y-6">
            {selectedWebhook ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Delivery Logs for {selectedWebhook?.webhook_name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedWebhook?.endpoint_url}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedWebhook(null)}
                  >
                    Back to All Webhooks
                  </Button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-md font-medium text-gray-900">Recent Deliveries</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Response
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {deliveries?.length > 0 ? (
                          deliveries?.map((delivery) => (
                            <tr key={delivery?.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  delivery?.delivered_at 
                                    ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                                }`}>
                                  {delivery?.delivered_at ? 'Success' : 'Failed'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {delivery?.event_type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`text-sm font-medium ${getDeliveryStatusColor(delivery?.response_status)}`}>
                                  {delivery?.response_status || 'N/A'}
                                </span>
                                {delivery?.response_time_ms && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({delivery?.response_time_ms}ms)
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(delivery?.created_at)?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => viewDeliveryDetails(delivery?.id)}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  {delivery?.failed_at && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRetryDelivery(delivery?.id)}
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                              No deliveries found for this webhook
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a webhook to view delivery logs</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {webhooks?.slice(0, 6)?.map((webhook) => (
                    <div
                      key={webhook?.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                      onClick={() => setSelectedWebhook(webhook)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{webhook?.webhook_name}</h4>
                        {getStatusIcon(webhook?.status)}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{webhook?.endpoint_url}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Webhook Testing</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Test Webhook Delivery</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Send test payloads to your webhooks to verify they are working correctly.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {webhooks?.filter(w => w?.status === 'active')?.map((webhook) => (
                    <div key={webhook?.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">{webhook?.webhook_name}</h5>
                          <p className="text-xs text-gray-500 truncate">{webhook?.endpoint_url}</p>
                        </div>
                        {getStatusIcon(webhook?.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          Events: {Array.isArray(webhook?.event_types) ? webhook?.event_types?.join(', ') : 'N/A'}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTestWebhook(webhook?.id)}
                          className="w-full"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Send Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {webhooks?.filter(w => w?.status === 'active')?.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active webhooks available for testing</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Sample Payload</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
{`{
  "event_type": "lead_created",
  "timestamp": "2024-10-04T20:39:29.740Z",
  "data": {
    "lead_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "status": "new",
    "source": "website_form"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* New Webhook Modal */}
      {showNewWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Webhook</h3>
              <form onSubmit={handleCreateWebhook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook Name
                  </label>
                  <Input
                    type="text"
                    value={newWebhookData?.webhook_name}
                    onChange={(e) => setNewWebhookData({...newWebhookData, webhook_name: e?.target?.value})}
                    placeholder="e.g. Lead Notifications"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint URL
                  </label>
                  <Input
                    type="url"
                    value={newWebhookData?.endpoint_url}
                    onChange={(e) => setNewWebhookData({...newWebhookData, endpoint_url: e?.target?.value})}
                    placeholder="https://api.example.com/webhooks/leads"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Types
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableEventTypes?.map((eventType) => (
                      <label key={eventType?.value} className="flex items-center">
                        <Checkbox
                          checked={newWebhookData?.event_types?.includes(eventType?.value)}
                          onChange={(e) => {
                            if (e?.target?.checked) {
                              setNewWebhookData({
                                ...newWebhookData,
                                event_types: [...newWebhookData?.event_types, eventType?.value]
                              });
                            } else {
                              setNewWebhookData({
                                ...newWebhookData,
                                event_types: newWebhookData?.event_types?.filter(t => t !== eventType?.value)
                              });
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{eventType?.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retry Attempts
                    </label>
                    <Input
                      type="number"
                      value={newWebhookData?.retry_attempts}
                      onChange={(e) => setNewWebhookData({...newWebhookData, retry_attempts: parseInt(e?.target?.value)})}
                      min="0"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeout (seconds)
                    </label>
                    <Input
                      type="number"
                      value={newWebhookData?.timeout_seconds}
                      onChange={(e) => setNewWebhookData({...newWebhookData, timeout_seconds: parseInt(e?.target?.value)})}
                      min="5"
                      max="300"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewWebhookModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Create Webhook
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delivery Details Modal */}
      {showDeliveryModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delivery Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeliveryModal(false)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2">
                      {selectedDelivery?.delivered_at ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Event Type:</span>
                    <span className="ml-2">{selectedDelivery?.event_type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Response Status:</span>
                    <span className="ml-2">{selectedDelivery?.response_status || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Response Time:</span>
                    <span className="ml-2">{selectedDelivery?.response_time_ms}ms</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Payload</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm text-gray-800">
                      {JSON.stringify(selectedDelivery?.payload, null, 2)}
                    </pre>
                  </div>
                </div>

                {selectedDelivery?.response_body && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Response Body</h4>
                    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-gray-800">
                        {selectedDelivery?.response_body}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedDelivery?.error_message && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Error Message</h4>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-800">{selectedDelivery?.error_message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookConfigurationDashboard;