import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';

const CampaignPerformanceChart = () => {
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('reactivation_rate');

  const performanceData = [
    {
      date: 'Jan 1',
      reactivation_rate: 18.5,
      appointments_booked: 45,
      revenue: 12500,
      cost_per_lead: 38
    },
    {
      date: 'Jan 8',
      reactivation_rate: 21.2,
      appointments_booked: 67,
      revenue: 18900,
      cost_per_lead: 35
    },
    {
      date: 'Jan 15',
      reactivation_rate: 19.8,
      appointments_booked: 58,
      revenue: 16200,
      cost_per_lead: 41
    },
    {
      date: 'Jan 22',
      reactivation_rate: 23.4,
      appointments_booked: 78,
      revenue: 22100,
      cost_per_lead: 32
    },
    {
      date: 'Jan 29',
      reactivation_rate: 24.8,
      appointments_booked: 89,
      revenue: 25400,
      cost_per_lead: 29
    },
    {
      date: 'Feb 5',
      reactivation_rate: 26.1,
      appointments_booked: 95,
      revenue: 28700,
      cost_per_lead: 27
    },
    {
      date: 'Feb 12',
      reactivation_rate: 22.9,
      appointments_booked: 72,
      revenue: 19800,
      cost_per_lead: 33
    }
  ];

  const metrics = [
    { value: 'reactivation_rate', label: 'Reactivation Rate (%)', color: '#1E40AF' },
    { value: 'appointments_booked', label: 'Appointments Booked', color: '#10B981' },
    { value: 'revenue', label: 'Revenue ($)', color: '#F59E0B' },
    { value: 'cost_per_lead', label: 'Cost per Lead ($)', color: '#EF4444' }
  ];

  const selectedMetricData = metrics?.find(m => m?.value === selectedMetric);

  const formatTooltipValue = (value, name) => {
    if (name === 'reactivation_rate') return [`${value}%`, 'Reactivation Rate'];
    if (name === 'revenue') return [`$${value?.toLocaleString()}`, 'Revenue'];
    if (name === 'cost_per_lead') return [`$${value}`, 'Cost per Lead'];
    return [value, name];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Campaign Performance Trends</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track your campaign metrics over time
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e?.target?.value)}
              className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {metrics?.map((metric) => (
                <option key={metric?.value} value={metric?.value}>
                  {metric?.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
              className="h-8"
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
              className="h-8"
            >
              Bar
            </Button>
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={formatTooltipValue}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={selectedMetricData?.color}
                strokeWidth={3}
                dot={{ fill: selectedMetricData?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: selectedMetricData?.color, strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={formatTooltipValue}
              />
              <Legend />
              <Bar
                dataKey={selectedMetric}
                fill={selectedMetricData?.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignPerformanceChart;