import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cashBoostService } from '../../../services/cashBoostService';
import { useAuth } from '../../../contexts/AuthContext';

const RevenueAnalytics = () => {
  const { user } = useAuth();
  const [viewType, setViewType] = useState('revenue');
  const [timeframe, setTimeframe] = useState('monthly');
  const [cashBoostRevenue, setCashBoostRevenue] = useState(0);
  const [cashBoostCampaigns, setCashBoostCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCashBoostData();
    }
  }, [user]);

  const loadCashBoostData = async () => {
    try {
      const campaigns = await cashBoostService.getUserCampaigns(user.id);
      setCashBoostCampaigns(campaigns);

      const totalRevenue = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.total_revenue || 0), 0);
      setCashBoostRevenue(totalRevenue);
    } catch (error) {
      console.error('Error loading Cash-Boost data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    {
      period: 'Oct 2024',
      revenue: 45200,
      costs: 12800,
      profit: 32400,
      roi: 253,
      appointments: 156,
      avg_deal_value: 290
    },
    {
      period: 'Nov 2024',
      revenue: 67800,
      costs: 18900,
      profit: 48900,
      roi: 259,
      appointments: 234,
      avg_deal_value: 290
    },
    {
      period: 'Dec 2024',
      revenue: 89750,
      costs: 23400,
      profit: 66350,
      roi: 284,
      appointments: 312,
      avg_deal_value: 288
    },
    {
      period: 'Jan 2025',
      revenue: 127450,
      costs: 31200,
      profit: 96250,
      roi: 308,
      appointments: 445,
      avg_deal_value: 286
    }
  ];

  const industryBreakdown = [
    { industry: 'Solar', revenue: 45600, percentage: 35.8, color: '#F59E0B' },
    { industry: 'Home Services', revenue: 38200, percentage: 30.0, color: '#10B981' },
    { industry: 'Insurance', revenue: 24800, percentage: 19.5, color: '#1E40AF' },
    { industry: 'Healthcare', revenue: 12450, percentage: 9.8, color: '#EF4444' },
    { industry: 'Financial', revenue: 6400, percentage: 5.0, color: '#8B5CF6' }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$127,450',
      change: '+42.1%',
      trend: 'up',
      icon: 'DollarSign',
      description: 'This month'
    },
    {
      title: 'Average Deal Value',
      value: '$286',
      change: '-1.4%',
      trend: 'down',
      icon: 'TrendingUp',
      description: 'Per appointment'
    },
    {
      title: 'Profit Margin',
      value: '75.5%',
      change: '+3.2%',
      trend: 'up',
      icon: 'PieChart',
      description: 'After costs'
    },
    {
      title: 'Customer LTV',
      value: '$1,240',
      change: '+18.7%',
      trend: 'up',
      icon: 'Users',
      description: 'Lifetime value'
    }
  ];

  const formatCurrency = (value) => `$${value?.toLocaleString()}`;
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {formatCurrency(entry?.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards?.map((kpi) => (
          <div key={kpi?.title} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                kpi?.trend === 'up' ? 'bg-success/10' : 'bg-warning/10'
              }`}>
                <Icon 
                  name={kpi?.icon} 
                  size={20} 
                  className={kpi?.trend === 'up' ? 'text-success' : 'text-warning'} 
                />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                kpi?.trend === 'up' ? 'text-success' : 'text-warning'
              }`}>
                <Icon 
                  name={kpi?.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} 
                  size={14} 
                />
                <span>{kpi?.change}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {kpi?.value}
              </h3>
              <p className="text-sm font-medium text-foreground mb-1">
                {kpi?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {kpi?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Revenue Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track revenue, costs, and profitability over time
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewType === 'revenue' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('revenue')}
                className="h-8"
              >
                Revenue
              </Button>
              <Button
                variant={viewType === 'profit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('profit')}
                className="h-8"
              >
                Profit
              </Button>
              <Button
                variant={viewType === 'roi' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('roi')}
                className="h-8"
              >
                ROI
              </Button>
            </div>
            
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="period" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {viewType === 'revenue' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1E40AF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="costs"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#costGradient)"
                  />
                </>
              )}
              
              {viewType === 'profit' && (
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitGradient)"
                />
              )}
              
              {viewType === 'roi' && (
                <Area
                  type="monotone"
                  dataKey="roi"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Industry Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Revenue by Industry</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Performance breakdown across different industry verticals
          </p>
        </div>

        <div className="space-y-4">
          {industryBreakdown?.map((industry) => (
            <div key={industry?.industry} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: industry?.color }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {industry?.industry}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {industry?.percentage}% of total revenue
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(industry?.revenue)}
                </p>
                <div className="w-24 bg-muted rounded-full h-2 mt-1">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${industry?.percentage}%`,
                      backgroundColor: industry?.color 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash-Boost Missions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Cash-Boost Missions</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Revenue generated from targeted cash-boost campaigns
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading Cash-Boost data...</p>
          </div>
        ) : cashBoostCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No Cash-Boost campaigns yet</p>
            <Button onClick={() => window.location.href = '/cash-boost'}>
              Launch Your First Mission
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="DollarSign" size={20} className="text-green-600" />
                  <h4 className="text-sm font-medium text-gray-700">Total Revenue</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ${cashBoostRevenue.toLocaleString()}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="TrendingUp" size={20} className="text-blue-600" />
                  <h4 className="text-sm font-medium text-gray-700">Active Campaigns</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {cashBoostCampaigns.filter(c => c.status === 'active').length}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={20} className="text-purple-600" />
                  <h4 className="text-sm font-medium text-gray-700">Completed Campaigns</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {cashBoostCampaigns.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {cashBoostCampaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-500' :
                      campaign.status === 'completed' ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {campaign.campaign_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.contacts_messaged} contacts • {campaign.jobs_booked} jobs booked
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      ${parseFloat(campaign.total_revenue).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {campaign.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {cashBoostCampaigns.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/cash-boost'}>
                  View All Campaigns
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;