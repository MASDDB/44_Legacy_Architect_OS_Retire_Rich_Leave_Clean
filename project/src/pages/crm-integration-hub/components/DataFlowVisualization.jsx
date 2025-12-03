import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  ArrowRight, 
  ArrowLeftRight,
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

const DataFlowVisualization = ({ connections, syncHealth }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'connecting':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <Database className="w-6 h-6 text-gray-400" />;
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

  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'bidirectional':
        return <ArrowLeftRight className="w-5 h-5 text-blue-600" />;
      case 'unidirectional':
        return <ArrowRight className="w-5 h-5 text-blue-600" />;
      default:
        return <ArrowRight className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!connections?.length) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Data Flow to Display
        </h3>
        <p className="text-gray-600">
          Connect your CRM systems to visualize data flow and synchronization.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Connections</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {syncHealth?.total_connections || 0}
              </p>
            </div>
            <Database className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Syncs</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {syncHealth?.active_connections || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {syncHealth?.last_sync_within_24h || 0}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Health Score</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {syncHealth?.active_connections && syncHealth?.total_connections
                  ? Math.round((syncHealth?.active_connections / syncHealth?.total_connections) * 100)
                  : 0
                }%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>
      </div>
      {/* Data Flow Diagram */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Data Flow Architecture
        </h3>
        
        <div className="flex flex-col items-center space-y-8">
          {/* Platform Hub */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center min-w-48"
          >
            <Database className="w-8 h-8 mx-auto mb-3" />
            <h4 className="text-lg font-semibold">Database Reactivation Platform</h4>
            <p className="text-blue-100 text-sm mt-1">Central Data Hub</p>
          </motion.div>

          {/* Connection Lines */}
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
            {connections?.map((connection, index) => (
              <motion.div
                key={connection?.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="flex flex-col items-center"
              >
                {/* Connection Line */}
                <div className="flex flex-col items-center mb-4">
                  <div className="h-16 w-px bg-gray-300 mb-2"></div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    {getDirectionIcon(connection?.crm_sync_configs?.[0]?.sync_direction)}
                    <span className="capitalize">
                      {connection?.crm_sync_configs?.[0]?.sync_frequency || 'manual'}
                    </span>
                  </div>
                  <div className="h-16 w-px bg-gray-300 mt-2"></div>
                </div>

                {/* CRM System */}
                <div className={`bg-white border-2 rounded-xl p-6 text-center min-w-48 ${
                  connection?.connection_status === 'connected' ?'border-green-200 shadow-green-100' 
                    : connection?.connection_status === 'error' ?'border-red-200 shadow-red-100' :'border-gray-200'
                } shadow-lg`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">
                      {getProviderIcon(connection?.provider)}
                    </div>
                    {getStatusIcon(connection?.connection_status)}
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {connection?.provider}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {connection?.connection_name}
                  </p>
                  
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    connection?.connection_status === 'connected' ?'bg-green-100 text-green-700'
                      : connection?.connection_status === 'error' ?'bg-red-100 text-red-700' :'bg-gray-100 text-gray-700'
                  }`}>
                    {connection?.connection_status === 'connected' && <Zap className="w-3 h-3" />}
                    <span className="capitalize">{connection?.connection_status}</span>
                  </div>

                  {connection?.last_sync_at && (
                    <div className="mt-3 text-xs text-gray-500">
                      Last sync: {new Date(connection.last_sync_at)?.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Data Types Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Synchronized Data Types
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Contacts', icon: Users, count: '2.5K+' },
            { name: 'Companies', icon: Database, count: '850+' },
            { name: 'Deals', icon: TrendingUp, count: '320+' },
            { name: 'Activities', icon: Activity, count: '1.2K+' }
          ]?.map((dataType, index) => (
            <motion.div
              key={dataType?.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 border border-gray-200 rounded-lg text-center hover:border-blue-300 transition-colors"
            >
              <dataType.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">{dataType?.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{dataType?.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataFlowVisualization;