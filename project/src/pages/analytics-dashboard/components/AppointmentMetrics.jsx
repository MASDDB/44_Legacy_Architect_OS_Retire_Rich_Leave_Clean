import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppointmentMetrics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');

  const appointmentData = [
    {
      period: 'Week 1',
      scheduled: 89,
      confirmed: 76,
      completed: 68,
      no_show: 8,
      cancelled: 13
    },
    {
      period: 'Week 2',
      scheduled: 95,
      confirmed: 82,
      completed: 74,
      no_show: 8,
      cancelled: 13
    },
    {
      period: 'Week 3',
      scheduled: 78,
      confirmed: 67,
      completed: 59,
      no_show: 8,
      cancelled: 11
    },
    {
      period: 'Week 4',
      scheduled: 112,
      confirmed: 98,
      completed: 89,
      no_show: 9,
      cancelled: 14
    }
  ];

  const statusDistribution = [
    { name: 'Completed', value: 290, percentage: 77.3, color: '#10B981' },
    { name: 'No Show', value: 33, percentage: 8.8, color: '#EF4444' },
    { name: 'Cancelled', value: 51, percentage: 13.6, color: '#F59E0B' },
    { name: 'Pending', value: 1, percentage: 0.3, color: '#6B7280' }
  ];

  const appointmentMetrics = [
    {
      title: 'Total Scheduled',
      value: '374',
      change: '+12.3%',
      trend: 'up',
      icon: 'Calendar',
      description: 'This month'
    },
    {
      title: 'Confirmation Rate',
      value: '86.4%',
      change: '+2.1%',
      trend: 'up',
      icon: 'CheckCircle',
      description: 'Appointments confirmed'
    },
    {
      title: 'Show-up Rate',
      value: '89.7%',
      change: '+1.8%',
      trend: 'up',
      icon: 'UserCheck',
      description: 'Confirmed appointments'
    },
    {
      title: 'Avg. Booking Time',
      value: '2.4 days',
      change: '-0.3 days',
      trend: 'up',
      icon: 'Clock',
      description: 'From contact to booking'
    }
  ];

  const timeSlotPerformance = [
    { time: '9:00 AM', bookings: 45, completion_rate: 92, no_show_rate: 4 },
    { time: '10:00 AM', bookings: 52, completion_rate: 89, no_show_rate: 6 },
    { time: '11:00 AM', bookings: 38, completion_rate: 95, no_show_rate: 3 },
    { time: '2:00 PM', bookings: 41, completion_rate: 87, no_show_rate: 8 },
    { time: '3:00 PM', bookings: 49, completion_rate: 91, no_show_rate: 5 },
    { time: '4:00 PM', bookings: 35, completion_rate: 86, no_show_rate: 9 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            {data?.value} appointments ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {appointmentMetrics?.map((metric) => (
          <div key={metric?.title} className="bg-card rounded-lg border border-border p-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Appointment Trends</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Weekly appointment scheduling and completion rates
              </p>
            </div>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e?.target?.value)}
              className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="period" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="scheduled" fill="#1E40AF" name="Scheduled" radius={[2, 2, 0, 0]} />
                <Bar dataKey="confirmed" fill="#10B981" name="Confirmed" radius={[2, 2, 0, 0]} />
                <Bar dataKey="completed" fill="#059669" name="Completed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Appointment Status</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Distribution of appointment outcomes
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {statusDistribution?.map((item) => (
              <div key={item?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {item?.name}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {item?.value} ({item?.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Time Slot Performance */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Time Slot Performance</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Booking and completion rates by appointment time
            </p>
          </div>
          
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time Slot
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Bookings
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  No-Show Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {timeSlotPerformance?.map((slot) => (
                <tr key={slot?.time} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {slot?.time}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground">
                      {slot?.bookings}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-success">
                        {slot?.completion_rate}%
                      </div>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 bg-success rounded-full"
                          style={{ width: `${slot?.completion_rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-error">
                      {slot?.no_show_rate}%
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      slot?.completion_rate >= 90 
                        ? 'bg-success/10 text-success' 
                        : slot?.completion_rate >= 85 
                        ? 'bg-warning/10 text-warning' :'bg-error/10 text-error'
                    }`}>
                      {slot?.completion_rate >= 90 ? 'Excellent' : slot?.completion_rate >= 85 ? 'Good' : 'Needs Improvement'}
                    </div>
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

export default AppointmentMetrics;