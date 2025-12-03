import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, Zap, Target, DollarSign, Clock } from 'lucide-react';
import { aiPersonalizationService } from '../../../services/aiPersonalizationService';

const AIPersonalizationAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [rules, setRules] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load personalization rules
      const rulesData = await aiPersonalizationService?.getPersonalizationRules();
      setRules(rulesData);

      // Load analytics for each rule
      const endDate = new Date()?.toISOString()?.split('T')?.[0];
      const startDate = new Date(Date.now() - (parseInt(dateRange) * 24 * 60 * 60 * 1000))?.toISOString()?.split('T')?.[0];
      
      const performancePromises = rulesData?.map(rule => 
        aiPersonalizationService?.getPersonalizationAnalytics(rule?.id, startDate, endDate)
      );
      
      const performances = await Promise.all(performancePromises);
      setPerformanceData(performances);

      // Mock analytics data - in real implementation, this would come from the database
      setAnalytics({
        totalPersonalizations: 1247,
        averageConfidenceScore: 0.89,
        responseRateImprovement: 23.5,
        costPerPersonalization: 0.006,
        processingTimeAvg: 1150,
        topPerformingRules: rulesData?.slice(0, 3)
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const confidenceScoreData = [
    { date: '2025-09-27', score: 0.85 },
    { date: '2025-09-28', score: 0.87 },
    { date: '2025-09-29', score: 0.91 },
    { date: '2025-09-30', score: 0.88 },
    { date: '2025-10-01', score: 0.92 },
    { date: '2025-10-02', score: 0.89 },
    { date: '2025-10-03', score: 0.94 }
  ];

  const responseRateData = [
    { name: 'Behavioral', original: 24, personalized: 34 },
    { name: 'Demographic', original: 28, personalized: 36 },
    { name: 'Engagement', original: 31, personalized: 42 },
    { name: 'Timing', original: 19, personalized: 29 }
  ];

  const costBreakdownData = [
    { name: 'GPT-5', value: 45, cost: '$0.008' },
    { name: 'GPT-5-Mini', value: 35, cost: '$0.004' },
    { name: 'GPT-4o', value: 15, cost: '$0.006' },
    { name: 'Claude-3.5', value: 5, cost: '$0.012' }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading AI personalization analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Personalization Analytics</h2>
        </div>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={dateRange}
          onChange={(e) => setDateRange(e?.target?.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-medium text-gray-500">Total Personalizations</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{analytics?.totalPersonalizations?.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-500">Avg Confidence Score</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{(analytics?.averageConfidenceScore * 100)?.toFixed(1)}%</p>
          <p className="text-sm text-green-600 mt-1">+3.2% from last period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-500">Response Rate Improvement</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">+{analytics?.responseRateImprovement}%</p>
          <p className="text-sm text-green-600 mt-1">vs non-personalized</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <h3 className="text-sm font-medium text-gray-500">Cost per Message</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">${analytics?.costPerPersonalization?.toFixed(3)}</p>
          <p className="text-sm text-gray-500 mt-1">Average across all models</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-500">Avg Processing Time</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{analytics?.processingTimeAvg}ms</p>
          <p className="text-sm text-green-600 mt-1">-150ms from last period</p>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Score Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={confidenceScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0.8, 1]} />
              <Tooltip formatter={(value) => `${(value * 100)?.toFixed(1)}%`} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Response Rate Comparison */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate: Original vs Personalized</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="original" fill="#9ca3af" name="Original" />
              <Bar dataKey="personalized" fill="#6366f1" name="Personalized" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Model Usage and Cost */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Usage & Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, cost }) => `${name}: ${value}% (${cost})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdownData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Rules */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Rules</h3>
          <div className="space-y-4">
            {analytics?.topPerformingRules?.map((rule, index) => (
              <div key={rule?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{rule?.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{rule?.personalization_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">+{(25 + Math.random() * 20)?.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">response rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Rule Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Personalization Rules Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules?.map((rule) => (
                <tr key={rule?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{rule?.name}</div>
                    <div className="text-sm text-gray-500">{rule?.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {rule?.personalization_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.floor(Math.random() * 200) + 50}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(0.85 + Math.random() * 0.1)?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +{(15 + Math.random() * 25)?.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(0.003 + Math.random() * 0.007)?.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule?.is_active 
                        ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
                    }`}>
                      {rule?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIPersonalizationAnalytics;