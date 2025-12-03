import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const LeadLifecycleTracker = () => {
  const lifecycleData = [
    { name: 'Hot Leads', value: 342, percentage: 28.5, color: '#EF4444' },
    { name: 'Warm Leads', value: 567, percentage: 47.2, color: '#F59E0B' },
    { name: 'Cold Leads', value: 291, percentage: 24.3, color: '#6B7280' }
  ];

  const conversionData = [
    {
      stage: 'Initial Contact',
      hot: 95,
      warm: 78,
      cold: 23,
      total: 196,
      icon: 'Phone'
    },
    {
      stage: 'Follow-up Response',
      hot: 87,
      warm: 65,
      cold: 12,
      total: 164,
      icon: 'MessageSquare'
    },
    {
      stage: 'Appointment Scheduled',
      hot: 78,
      warm: 45,
      cold: 8,
      total: 131,
      icon: 'Calendar'
    },
    {
      stage: 'Appointment Confirmed',
      hot: 72,
      warm: 38,
      cold: 6,
      total: 116,
      icon: 'CheckCircle'
    },
    {
      stage: 'Appointment Completed',
      hot: 68,
      warm: 32,
      cold: 4,
      total: 104,
      icon: 'UserCheck'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            {data?.value} leads ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Lead Lifecycle Tracking</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor lead progression through your reactivation funnel
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Distribution Pie Chart */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Lead Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lifecycleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {lifecycleData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {lifecycleData?.map((item) => (
              <div key={item?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-foreground font-medium">
                  {item?.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({item?.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Conversion Funnel</h4>
          <div className="space-y-4">
            {conversionData?.map((stage, index) => (
              <div key={stage?.stage} className="relative">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={stage?.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{stage?.stage}</p>
                      <p className="text-xs text-muted-foreground">
                        {stage?.total} total conversions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-muted-foreground">Hot: {stage?.hot}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs mt-1">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        <span className="text-muted-foreground">Warm: {stage?.warm}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs mt-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                        <span className="text-muted-foreground">Cold: {stage?.cold}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < conversionData?.length - 1 && (
                  <div className="flex justify-center py-2">
                    <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadLifecycleTracker;