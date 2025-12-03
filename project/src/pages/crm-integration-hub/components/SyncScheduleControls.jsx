import React, { useState, useEffect } from 'react';

import { Clock, Save, RefreshCw, Settings, AlertCircle, CheckCircle, Calendar, ArrowLeftRight, ArrowRight, Filter } from 'lucide-react';
import { crmService } from '../../../services/crmService';

const SyncScheduleControls = ({ connections, selectedConnection, onConnectionSelect }) => {
  const [syncConfig, setSyncConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load sync config when connection changes
  useEffect(() => {
    if (selectedConnection?.id) {
      loadSyncConfig();
    }
  }, [selectedConnection]);

  const loadSyncConfig = async () => {
    if (!selectedConnection?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await crmService?.getSyncConfig(selectedConnection?.id);
      
      // If no config exists, create default one
      if (result?.error || !result?.data) {
        setSyncConfig({
          sync_direction: 'bidirectional',
          sync_frequency: 'hourly',
          sync_filters: {},
          conflict_resolution: {
            strategy: 'platform_wins',
            notify_conflicts: true
          },
          is_enabled: true
        });
      } else {
        setSyncConfig(result?.data);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load sync configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedConnection?.id || !syncConfig) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const result = await crmService?.updateSyncConfig(selectedConnection?.id, syncConfig);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to save sync configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field, value) => {
    setSyncConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateConflictResolution = (field, value) => {
    setSyncConfig(prev => ({
      ...prev,
      conflict_resolution: {
        ...prev?.conflict_resolution,
        [field]: value
      }
    }));
  };

  const getSyncDirectionIcon = (direction) => {
    switch (direction) {
      case 'bidirectional':
        return <ArrowLeftRight className="w-5 h-5" />;
      case 'unidirectional':
        return <ArrowRight className="w-5 h-5" />;
      default:
        return <ArrowLeftRight className="w-5 h-5" />;
    }
  };

  const getSyncFrequencyDescription = (frequency) => {
    switch (frequency) {
      case 'real_time':
        return 'Changes sync immediately via webhooks';
      case 'hourly':
        return 'Data syncs every hour';
      case 'daily':
        return 'Data syncs once per day';
      case 'weekly':
        return 'Data syncs once per week';
      case 'manual':
        return 'Sync only when manually triggered';
      default:
        return 'Custom sync schedule';
    }
  };

  if (!connections?.length) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Connections Available
        </h3>
        <p className="text-gray-600">
          Create a CRM connection first to configure sync schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sync Schedule Configuration
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Sync Settings for {selectedConnection?.connection_name}
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Configure data synchronization frequency and conflict resolution
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {success && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Configuration saved</span>
                </div>
              )}
              
              <button
                onClick={handleSaveConfig}
                disabled={saving || !syncConfig}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Configuration
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading sync configuration...</p>
            </div>
          ) : syncConfig ? (
            <div className="space-y-8">
              {/* Basic Settings */}
              <div>
                <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Basic Settings
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sync Direction */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sync Direction
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="sync_direction"
                          value="bidirectional"
                          checked={syncConfig?.sync_direction === 'bidirectional'}
                          onChange={(e) => updateConfig('sync_direction', e?.target?.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Bidirectional</div>
                          <div className="text-sm text-gray-600">Sync data both ways</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="sync_direction"
                          value="unidirectional"
                          checked={syncConfig?.sync_direction === 'unidirectional'}
                          onChange={(e) => updateConfig('sync_direction', e?.target?.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <ArrowRight className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Unidirectional</div>
                          <div className="text-sm text-gray-600">Platform to CRM only</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Sync Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sync Frequency
                    </label>
                    <select
                      value={syncConfig?.sync_frequency || 'hourly'}
                      onChange={(e) => updateConfig('sync_frequency', e?.target?.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="real_time">Real-time</option>
                      <option value="hourly">Every Hour</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="manual">Manual Only</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-2">
                      {getSyncFrequencyDescription(syncConfig?.sync_frequency)}
                    </p>
                  </div>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncConfig?.is_enabled || false}
                      onChange={(e) => updateConfig('is_enabled', e?.target?.checked)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Enable Automatic Sync</div>
                      <div className="text-sm text-gray-600">
                        Allow automatic data synchronization based on the schedule above
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conflict Resolution */}
              <div>
                <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Conflict Resolution
                </h5>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      When data conflicts occur:
                    </label>
                    <select
                      value={syncConfig?.conflict_resolution?.strategy || 'platform_wins'}
                      onChange={(e) => updateConflictResolution('strategy', e?.target?.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="platform_wins">Platform data wins</option>
                      <option value="crm_wins">CRM data wins</option>
                      <option value="last_modified_wins">Last modified wins</option>
                      <option value="manual_review">Manual review required</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={syncConfig?.conflict_resolution?.notify_conflicts || false}
                      onChange={(e) => updateConflictResolution('notify_conflicts', e?.target?.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Notify about conflicts</div>
                      <div className="text-sm text-gray-600">
                        Send notifications when data conflicts are resolved
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sync Filters */}
              <div>
                <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Sync Filters
                </h5>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Advanced Feature</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Sync filters allow you to control which records are synchronized based on custom criteria. 
                    This feature requires additional configuration and will be available in advanced settings.
                  </p>
                </div>
              </div>

              {/* Status Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Sync Status</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Last sync: {selectedConnection?.last_sync_at ? 
                    new Date(selectedConnection.last_sync_at)?.toLocaleString() : 
                    'Never'
                  }</p>
                  <p>Next sync: {syncConfig?.next_sync_at ? 
                    new Date(syncConfig.next_sync_at)?.toLocaleString() : 
                    'Not scheduled'
                  }</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Sync Configuration
              </h4>
              <p className="text-gray-600">
                Failed to load sync configuration for this connection.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SyncScheduleControls;