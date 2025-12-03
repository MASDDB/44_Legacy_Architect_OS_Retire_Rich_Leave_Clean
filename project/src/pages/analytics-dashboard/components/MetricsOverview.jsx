import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = ({ timeRange, onTimeRangeChange }) => {
  const metrics = [
    {
      id: 'reactivation_rate',
      title: 'Reactivation Rate',
      value: '24.8%',
      change: '+3.2%',
      trend: 'up',
      icon: 'TrendingUp',
      description: 'Leads converted to appointments'
    },
    {
      id: 'total_campaigns',
      title: 'Active Campaigns',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: 'Target',
      description: 'Currently running campaigns'
    },
    {
      id: 'appointments_booked',
      title: 'Appointments Booked',
      value: '847',
      change: '+127',
      trend: 'up',
      icon: 'Calendar',
      description: 'This month'
    },
    {
      id: 'roi',
      title: 'ROI',
      value: '340%',
      change: '+45%',
      trend: 'up',
      icon: 'DollarSign',
      description: 'Return on investment'
    },
    {
      id: 'cost_per_acquisition',
      title: 'Cost per Acquisition',
      value: '$42',
      change: '-$8',
      trend: 'down',
      icon: 'PiggyBank',
      description: 'Average cost per lead'
    },
    {
      id: 'revenue_generated',
      title: 'Revenue Generated',
      value: '$127,450',
      change: '+$23,100',
      trend: 'up',
      icon: 'Banknote',
      description: 'Total revenue this month'
    }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Performance Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Key metrics for your reactivation campaigns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e?.target?.value)}
            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {timeRanges?.map((range) => (
              <option key={range?.value} value={range?.value}>
                {range?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics?.map((metric) => (
          <div
            key={metric?.id}
            className="bg-background rounded-lg border border-border p-4 hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metric?.trend === 'up' ? 'bg-success/10' : 'bg-warning/10'
              }`}>
                <Icon 
                  name={metric?.icon} 
                  size={20} 
                  className={metric?.trend === 'up' ? 'text-success' : 'text-warning'} 
                />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric?.trend === 'up' ? 'text-success' : 'text-warning'
              }`}>
                <Icon 
                  name={metric?.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} 
                  size={14} 
                />
                <span>{metric?.change}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {metric?.value}
              </h3>
              <p className="text-sm font-medium text-foreground mb-1">
                {metric?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {metric?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsOverview;