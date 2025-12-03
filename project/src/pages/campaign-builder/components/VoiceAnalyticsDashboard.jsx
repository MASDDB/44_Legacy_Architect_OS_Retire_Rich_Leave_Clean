import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import voiceService from '../../../services/voiceService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const VoiceAnalyticsDashboard = ({ campaignId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    if (isOpen && campaignId) {
      loadAnalytics();
      loadRecentMessages();
    }
  }, [isOpen, campaignId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { data, success } = await voiceService?.getVoiceCampaignAnalytics(campaignId);
      if (success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading voice analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentMessages = async () => {
    try {
      const { data, success } = await voiceService?.getVoiceMessages(campaignId, {
        limit: 10,
        offset: 0
      });
      if (success) {
        setRecentMessages(data);
      }
    } catch (error) {
      console.error('Error loading voice messages:', error);
    }
  };

  if (!isOpen) return null;

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const callStatusData = [
    { name: 'Completed', value: analytics?.summary?.completedCalls || 0, color: '#10B981' },
    { name: 'No Answer', value: (analytics?.summary?.totalCalls || 0) - (analytics?.summary?.answeredCalls || 0), color: '#F59E0B' },
    { name: 'Failed', value: 0, color: '#EF4444' }, // Could calculate from analytics
    { name: 'Busy', value: 0, color: '#8B5CF6' },
    { name: 'Voicemail', value: 0, color: '#06B6D4' }
  ]?.filter(item => item?.value > 0);

  const dailyData = analytics?.dailyAnalytics?.slice(-7)?.map(day => ({
    date: new Date(day.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calls: day?.totalCalls,
    answered: day?.answeredCalls,
    completed: day?.completedCalls,
    cost: parseFloat(day?.totalCost || 0)
  })) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Voice Campaign Analytics</h2>
              <p className="text-sm text-gray-500">
                Performance metrics and insights for your voice campaign
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Calls</p>
                      <p className="text-2xl font-bold">{analytics?.summary?.totalCalls || 0}</p>
                    </div>
                    <Icon name="Phone" size={24} className="text-green-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Answer Rate</p>
                      <p className="text-2xl font-bold">{analytics?.summary?.answerRate || 0}%</p>
                    </div>
                    <Icon name="PhoneCall" size={24} className="text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Avg. Duration</p>
                      <p className="text-2xl font-bold">{voiceService?.formatCallDuration(analytics?.summary?.averageDuration || 0)}</p>
                    </div>
                    <Icon name="Clock" size={24} className="text-purple-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Total Cost</p>
                      <p className="text-2xl font-bold">{voiceService?.formatCost(analytics?.summary?.totalCost || 0)}</p>
                    </div>
                    <Icon name="DollarSign" size={24} className="text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Call Volume */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Call Volume</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="calls" fill="#3B82F6" name="Total Calls" />
                      <Bar dataKey="answered" fill="#10B981" name="Answered" />
                      <Bar dataKey="completed" fill="#059669" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Call Status Distribution */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={callStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {callStatusData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry?.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon name="TrendingUp" size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{analytics?.summary?.completionRate || 0}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="DollarSign" size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cost Per Completion</p>
                      <p className="text-lg font-semibold text-gray-900">{voiceService?.formatCost(analytics?.summary?.costPerCompletion || 0)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Icon name="Clock" size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{voiceService?.formatCallDuration(analytics?.summary?.totalDuration || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Voice Messages */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Voice Messages</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentMessages?.map((message) => {
                        const statusInfo = voiceService?.getCallStatuses()?.find(s => s?.value === message?.callStatus) || {};
                        return (
                          <tr key={message?.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {message?.lead?.fullName || 'Unknown Lead'}
                                </div>
                                <div className="text-sm text-gray-500">{message?.lead?.company || ''}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {message?.phoneNumber}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${statusInfo?.color}-100 text-${statusInfo?.color}-800`}>
                                {statusInfo?.label || message?.callStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {voiceService?.formatCallDuration(message?.callDuration)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {voiceService?.formatCost(message?.cost)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {message?.sentAt ? new Date(message.sentAt)?.toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {recentMessages?.length === 0 && (
                    <div className="text-center py-8">
                      <Icon name="Phone" size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No voice messages found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Last updated: {new Date()?.toLocaleString()}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={loadAnalytics}
              disabled={loading}
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
            <Button
              variant="default"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAnalyticsDashboard;