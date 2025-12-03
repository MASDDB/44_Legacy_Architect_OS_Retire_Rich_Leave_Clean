import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import { crmService } from '../../../services/crmService';

const SyncHistoryDisplay = ({ connections, selectedConnection, onConnectionSelect }) => {
  const [syncHistory, setSyncHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load sync history when connection changes
  useEffect(() => {
    if (selectedConnection?.id) {
      loadSyncHistory();
    }
  }, [selectedConnection]);

  const loadSyncHistory = async () => {
    if (!selectedConnection?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await crmService?.getSyncHistory(selectedConnection?.id, 50);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setSyncHistory(result?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load sync history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes < 1) return 'Less than 1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString)?.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getDirectionIcon = (direction) => {
    return direction === 'bidirectional' ? '⬄' : '➔';
  };

  // Filter and sort history
  const filteredHistory = syncHistory?.filter(record => {
    if (filterStatus === 'all') return true;
    return record?.sync_status === filterStatus;
  })?.sort((a, b) => {
    const dateA = new Date(a?.started_at || 0);
    const dateB = new Date(b?.started_at || 0);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Calculate summary stats
  const summaryStats = {
    total: filteredHistory?.length || 0,
    completed: filteredHistory?.filter(r => r?.sync_status === 'completed')?.length || 0,
    failed: filteredHistory?.filter(r => r?.sync_status === 'failed')?.length || 0,
    totalRecords: filteredHistory?.reduce((sum, r) => sum + (r?.records_processed || 0), 0) || 0
  };

  if (!connections?.length) {
    return (
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Connections Available
        </h3>
        <p className="text-gray-600">
          Create a CRM connection first to view sync history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sync History
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
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Syncs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summaryStats?.total}</p>
                </div>
                <History className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{summaryStats?.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{summaryStats?.failed}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Records Synced</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {summaryStats?.totalRecords?.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Sync History for {selectedConnection?.connection_name}
              </h4>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={loadSyncHistory}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="running">Running</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Sort:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e?.target?.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
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
                <p className="text-gray-600">Loading sync history...</p>
              </div>
            ) : filteredHistory?.length > 0 ? (
              <div className="space-y-4">
                {filteredHistory?.map((record, index) => (
                  <motion.div
                    key={record?.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(record?.sync_status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 capitalize">
                              {record?.sync_status} Sync
                            </span>
                            <span className="text-gray-600">
                              {getDirectionIcon(record?.sync_direction)}
                            </span>
                            <span className="text-sm text-gray-600 capitalize">
                              {record?.sync_direction}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Started: {formatDate(record?.started_at)}
                          </p>
                        </div>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(record?.sync_status)}`}>
                        {record?.sync_status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Records Processed:</span>
                        <div className="font-medium text-gray-900">{record?.records_processed || 0}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <div className="font-medium text-green-600">{record?.records_created || 0}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Updated:</span>
                        <div className="font-medium text-blue-600">{record?.records_updated || 0}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Failed:</span>
                        <div className="font-medium text-red-600">{record?.records_failed || 0}</div>
                      </div>
                    </div>

                    {record?.duration_minutes && (
                      <div className="mt-2 text-sm text-gray-600">
                        Duration: {formatDuration(record?.duration_minutes)}
                      </div>
                    )}

                    {record?.completed_at && (
                      <div className="mt-2 text-sm text-gray-600">
                        Completed: {formatDate(record?.completed_at)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Sync History
                </h4>
                <p className="text-gray-600 mb-4">
                  No synchronization history found for this connection.
                </p>
                <button
                  onClick={() => {/* Trigger manual sync */}}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <PlayCircle className="w-4 h-4" />
                  Run First Sync
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SyncHistoryDisplay;