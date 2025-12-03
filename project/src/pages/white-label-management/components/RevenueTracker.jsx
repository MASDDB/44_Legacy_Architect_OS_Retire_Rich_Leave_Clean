import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const RevenueTracker = ({ selectedReseller }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [viewType, setViewType] = useState('overview');

  const timeRangeOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const viewTypeOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'detailed', label: 'Detailed Analysis' },
    { value: 'comparison', label: 'Comparison' }
  ];

  // Mock revenue data
  const monthlyRevenue = [
    { month: 'Aug 2024', revenue: 12500, commission: 2500, customers: 45 },
    { month: 'Sep 2024', revenue: 15200, commission: 3040, customers: 52 },
    { month: 'Oct 2024', revenue: 18900, commission: 3780, customers: 61 },
    { month: 'Nov 2024', revenue: 22100, commission: 4420, customers: 68 },
    { month: 'Dec 2024', revenue: 25800, commission: 5160, customers: 74 },
    { month: 'Jan 2025', revenue: 28400, commission: 5680, customers: 82 }
  ];

  const revenueByService = [
    { name: 'Database Reactivation', value: 45, revenue: 45600, color: '#1E40AF' },
    { name: 'Campaign Management', value: 30, revenue: 30400, color: '#6366F1' },
    { name: 'Analytics & Reporting', value: 15, revenue: 15200, color: '#F59E0B' },
    { name: 'Custom Integrations', value: 10, revenue: 10100, color: '#10B981' }
  ];

  const payoutHistory = [
    {
      id: 1,
      date: '2025-01-01',
      amount: 5680,
      status: 'completed',
      method: 'Stripe Connect',
      transactionId: 'txn_1234567890'
    },
    {
      id: 2,
      date: '2024-12-01',
      amount: 5160,
      status: 'completed',
      method: 'Stripe Connect',
      transactionId: 'txn_0987654321'
    },
    {
      id: 3,
      date: '2024-11-01',
      amount: 4420,
      status: 'completed',
      method: 'Stripe Connect',
      transactionId: 'txn_1122334455'
    },
    {
      id: 4,
      date: '2024-10-01',
      amount: 3780,
      status: 'completed',
      method: 'Stripe Connect',
      transactionId: 'txn_5566778899'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success text-success-foreground', label: 'Completed' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
      failed: { color: 'bg-error text-error-foreground', label: 'Failed' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const totalRevenue = monthlyRevenue?.reduce((sum, month) => sum + month?.revenue, 0);
  const totalCommission = monthlyRevenue?.reduce((sum, month) => sum + month?.commission, 0);
  const averageMonthlyRevenue = totalRevenue / monthlyRevenue?.length;
  const growthRate = ((monthlyRevenue?.[monthlyRevenue?.length - 1]?.revenue - monthlyRevenue?.[0]?.revenue) / monthlyRevenue?.[0]?.revenue * 100)?.toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Revenue Tracking</h2>
          <p className="text-sm text-muted-foreground">
            Performance metrics for {selectedReseller?.company}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-full sm:w-40"
          />
          <Select
            options={viewTypeOptions}
            value={viewType}
            onChange={setViewType}
            className="w-full sm:w-40"
          />
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Icon name="DollarSign" size={20} className="text-primary" />
            </div>
            <span className="text-sm text-success font-medium">+{growthRate}%</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">${totalRevenue?.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-success/10 rounded-full p-3">
              <Icon name="TrendingUp" size={20} className="text-success" />
            </div>
            <span className="text-sm text-primary font-medium">20%</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">${totalCommission?.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Total Commission</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-warning/10 rounded-full p-3">
              <Icon name="BarChart3" size={20} className="text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Monthly</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">${averageMonthlyRevenue?.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Avg Monthly Revenue</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-secondary/10 rounded-full p-3">
              <Icon name="Users" size={20} className="text-secondary" />
            </div>
            <span className="text-sm text-success font-medium">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {monthlyRevenue?.[monthlyRevenue?.length - 1]?.customers}
          </h3>
          <p className="text-sm text-muted-foreground">Active Customers</p>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Service */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Service</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByService}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByService?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name, props) => [
                    `$${props?.payload?.revenue?.toLocaleString()}`,
                    props?.payload?.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {revenueByService?.map((service) => (
              <div key={service?.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: service?.color }}
                  />
                  <span className="text-sm text-foreground">{service?.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  ${service?.revenue?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Commission & Payout History */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Payout History</h3>
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} />
              Export
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Method</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Transaction ID</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory?.map((payout) => (
                <tr key={payout?.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4 text-sm text-foreground">{payout?.date}</td>
                  <td className="p-4 text-sm font-medium text-foreground">
                    ${payout?.amount?.toLocaleString()}
                  </td>
                  <td className="p-4">{getStatusBadge(payout?.status)}</td>
                  <td className="p-4 text-sm text-foreground">{payout?.method}</td>
                  <td className="p-4 text-sm text-muted-foreground font-mono">
                    {payout?.transactionId}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Icon name="ExternalLink" size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {payoutHistory?.map((payout) => (
            <div key={payout?.id} className="p-4 border-b border-border last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">
                  ${payout?.amount?.toLocaleString()}
                </span>
                {getStatusBadge(payout?.status)}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Date: {payout?.date}</p>
                <p>Method: {payout?.method}</p>
                <p className="font-mono">{payout?.transactionId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueTracker;