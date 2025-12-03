import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Settings,
  Play,
  MoreHorizontal,
  Zap
} from 'lucide-react';

const CRMConnectionCard = ({ connection, onTest, onSync, onConfigure }) => {
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'connecting':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Error';
      case 'connecting':
        return 'Connecting...';
      case 'expired':
        return 'Token Expired';
      default:
        return 'Disconnected';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'hubspot':
        return '🔶';
      case 'salesforce':
        return '☁️';
      case 'pipedrive':
        return '📊';
      default:
        return '🔧';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString)?.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const handleTest = async () => {
    if (testing) return;
    setTesting(true);
    try {
      await onTest?.();
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await onSync?.();
    } finally {
      setSyncing(false);
    }
  };

  const syncConfig = connection?.crm_sync_configs?.[0];
  const isConnected = connection?.connection_status === 'connected';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {getProviderIcon(connection?.provider)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {connection?.connection_name || 'Unnamed Connection'}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {connection?.provider} Integration
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onConfigure?.()}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(connection?.connection_status)}`}>
          {getStatusIcon(connection?.connection_status)}
          {getStatusText(connection?.connection_status)}
        </div>
        
        {isConnected && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Zap className="w-4 h-4 text-green-500" />
            Sync: {syncConfig?.sync_frequency || 'manual'}
          </div>
        )}
      </div>
      {/* Connection Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last Sync:</span>
          <span className="text-gray-900">
            {formatDate(connection?.last_sync_at)}
          </span>
        </div>
        
        {syncConfig?.next_sync_at && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Next Sync:</span>
            <span className="text-gray-900">
              {formatDate(syncConfig?.next_sync_at)}
            </span>
          </div>
        )}
        
        {connection?.oauth_expires_at && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Token Expires:</span>
            <span className={`${
              new Date(connection.oauth_expires_at) < new Date() 
                ? 'text-red-600' :'text-gray-900'
            }`}>
              {formatDate(connection?.oauth_expires_at)}
            </span>
          </div>
        )}

        {connection?.sync_errors?.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Recent Errors</span>
            </div>
            <p className="text-xs text-red-600">
              {connection?.sync_errors?.[0]?.error || 'Connection error occurred'}
            </p>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleTest}
          disabled={testing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          Test
        </button>
        
        <button
          onClick={handleSync}
          disabled={syncing || !isConnected}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          Sync Now
        </button>
        
        <button
          onClick={() => onConfigure?.()}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default CRMConnectionCard;