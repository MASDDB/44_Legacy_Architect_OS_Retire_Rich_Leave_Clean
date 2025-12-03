import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, Plus, CheckCircle, XCircle, Database, Activity } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { crmService } from '../../services/crmService';

// Import components
import CRMConnectionCard from './components/CRMConnectionCard';
import FieldMappingInterface from './components/FieldMappingInterface';
import SyncScheduleControls from './components/SyncScheduleControls';
import DataFlowVisualization from './components/DataFlowVisualization';
import IntegrationSetupWizard from './components/IntegrationSetupWizard';
import SyncHistoryDisplay from './components/SyncHistoryDisplay';
import AdvancedSettings from './components/AdvancedSettings';

const CRMIntegrationHub = () => {
  // State Management
  const [connections, setConnections] = useState([]);
  const [syncHealth, setSyncHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [connectionsResult, healthResult] = await Promise.all([
        crmService?.getCRMConnections(),
        crmService?.getCRMSyncHealth()
      ]);

      if (connectionsResult?.error) {
        throw new Error(connectionsResult.error);
      }

      if (healthResult?.error) {
        throw new Error(healthResult.error);
      }

      setConnections(connectionsResult?.data || []);
      setSyncHealth(healthResult?.data || null);
    } catch (err) {
      setError(err?.message || 'Failed to load CRM data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCRMData();
    setRefreshing(false);
  };

  const handleTestConnection = async (connectionId) => {
    try {
      const result = await crmService?.testConnection(connectionId);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Refresh connections to show updated status
      await loadCRMData();
    } catch (err) {
      setError(err?.message || 'Connection test failed');
    }
  };

  const handleTriggerSync = async (connectionId) => {
    try {
      const result = await crmService?.triggerManualSync(connectionId);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Refresh data to show new sync status
      await loadCRMData();
    } catch (err) {
      setError(err?.message || 'Sync trigger failed');
    }
  };

  // Get status counts for overview
  const getStatusCounts = () => {
    if (!connections?.length) return { connected: 0, error: 0, total: 0 };
    
    return {
      connected: connections?.filter(c => c?.connection_status === 'connected')?.length || 0,
      error: connections?.filter(c => c?.connection_status === 'error')?.length || 0,
      total: connections?.length || 0
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar onToggle={() => {}} />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading CRM Integration Hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onToggle={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    CRM Integration Hub
                  </h1>
                  <p className="text-gray-600">
                    Manage seamless data synchronization with major CRM systems
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  
                  <button
                    onClick={() => setShowSetupWizard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Integration
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium">Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Connections</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts?.total}</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Connections</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts?.connected}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Failed Connections</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts?.error}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Sync</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {syncHealth?.last_sync_within_24h > 0 
                        ? `${syncHealth?.last_sync_within_24h} within 24h`
                        : 'No recent syncs'
                      }
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <nav className="flex space-x-8 border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'field-mapping', label: 'Field Mapping' },
                  { id: 'sync-schedule', label: 'Sync Schedule' },
                  { id: 'data-flow', label: 'Data Flow' },
                  { id: 'sync-history', label: 'Sync History' },
                  { id: 'settings', label: 'Advanced Settings' }
                ]?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {connections?.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {connections?.map((connection) => (
                          <CRMConnectionCard
                            key={connection?.id}
                            connection={connection}
                            onTest={() => handleTestConnection(connection?.id)}
                            onSync={() => handleTriggerSync(connection?.id)}
                            onConfigure={() => setSelectedConnection(connection)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No CRM Integrations
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Connect your first CRM system to start synchronizing leads and contacts seamlessly.
                        </p>
                        <button
                          onClick={() => setShowSetupWizard(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Integration
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'field-mapping' && (
                  <FieldMappingInterface
                    connections={connections}
                    selectedConnection={selectedConnection}
                    onConnectionSelect={setSelectedConnection}
                  />
                )}

                {activeTab === 'sync-schedule' && (
                  <SyncScheduleControls
                    connections={connections}
                    selectedConnection={selectedConnection}
                    onConnectionSelect={setSelectedConnection}
                  />
                )}

                {activeTab === 'data-flow' && (
                  <DataFlowVisualization
                    connections={connections}
                    syncHealth={syncHealth}
                  />
                )}

                {activeTab === 'sync-history' && (
                  <SyncHistoryDisplay
                    connections={connections}
                    selectedConnection={selectedConnection}
                    onConnectionSelect={setSelectedConnection}
                  />
                )}

                {activeTab === 'settings' && (
                  <AdvancedSettings
                    connections={connections}
                    selectedConnection={selectedConnection}
                    onConnectionSelect={setSelectedConnection}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Setup Wizard Modal */}
      <AnimatePresence>
        {showSetupWizard && (
          <IntegrationSetupWizard
            onClose={() => setShowSetupWizard(false)}
            onSuccess={() => {
              setShowSetupWizard(false);
              loadCRMData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CRMIntegrationHub;