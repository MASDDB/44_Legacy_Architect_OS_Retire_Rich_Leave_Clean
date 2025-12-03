import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { calendarService } from '../../../services/calendarService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const CalendarAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7'); // days
  const [selectedMetric, setSelectedMetric] = useState('appointments');

  useEffect(() => {
    loadAnalytics();
  }, [user, dateRange]);

  const loadAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = new Date();
      startDate?.setDate(endDate?.getDate() - parseInt(dateRange));

      // Load summary analytics
      const { data: summaryData, error: summaryError } = await calendarService?.getCalendarAnalytics(
        user?.id,
        startDate?.toISOString()?.split('T')?.[0],
        endDate?.toISOString()?.split('T')?.[0]
      );

      if (summaryError) {
        throw new Error(summaryError);
      }

      setAnalytics(summaryData);

      // Load daily analytics
      const { data: dailyAnalytics, error: dailyError } = await calendarService?.getDailyAnalytics(
        user?.id,
        startDate?.toISOString()?.split('T')?.[0],
        endDate?.toISOString()?.split('T')?.[0]
      );

      if (dailyError) {
        throw new Error(dailyError);
      }

      setDailyData(dailyAnalytics || []);
    } catch (err) {
      setError(err?.message || 'Failed to load calendar analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getMetricValue = (data, metric) => {
    const metricMap = {
      appointments: data?.appointments_scheduled || 0,
      completed: data?.appointments_completed || 0,
      cancelled: data?.appointments_cancelled || 0,
      no_show: data?.appointments_no_show || 0,
      duration: data?.total_booking_duration_minutes || 0
    };
    return metricMap?.[metric];
  };

  const chartData = dailyData?.map(day => ({
    date: formatDate(day?.date_recorded),
    appointments: day?.appointments_scheduled || 0,
    completed: day?.appointments_completed || 0,
    cancelled: day?.appointments_cancelled || 0,
    no_show: day?.appointments_no_show || 0,
    duration: Math.round((day?.total_booking_duration_minutes || 0) / 60), // Convert to hours
    leads: day?.unique_leads_booked || 0,
    conversion: day?.conversion_rate || 0
  }));

  const statusDistribution = analytics ? [
    { name: 'Completed', value: analytics?.total_completed || 0, color: '#10B981' },
    { name: 'Cancelled', value: analytics?.total_cancelled || 0, color: '#EF4444' },
    { name: 'No Show', value: analytics?.total_no_show || 0, color: '#F59E0B' }
  ] : [];

  const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

  if (!user) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">Please sign in to view calendar analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Calendar Analytics</h2>
            <p className="text-muted-foreground">
              Track your appointment booking performance and scheduling metrics.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e?.target?.value)}
              className="border border-border rounded px-3 py-2 text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 2 weeks</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
            <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
              <Icon name="RefreshCw" size={14} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scheduled</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics?.total_scheduled || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {dateRange} day period
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">
                    {analytics?.total_completed || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics?.completion_rate || 0}% completion rate
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Leads</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics?.unique_leads || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Individual prospects
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(analytics?.average_duration_minutes || 0)}m
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Per appointment
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Trend */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Appointments Trend</h3>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e?.target?.value)}
                  className="border border-border rounded px-2 py-1 text-sm"
                >
                  <option value="appointments">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="duration">Duration (Hours)</option>
                </select>
              </div>

              {chartData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#888"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-300 text-muted-foreground">
                  <div className="text-center">
                    <Icon name="TrendingUp" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No chart data available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Distribution */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Appointment Status</h3>

              {statusDistribution?.some(item => item?.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100)?.toFixed(0)}%)`
                      }
                    >
                      {statusDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-300 text-muted-foreground">
                  <div className="text-center">
                    <Icon name="PieChart" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No status data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Daily Performance Table */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Daily Performance</h3>
            
            {dailyData?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Scheduled</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Completed</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cancelled</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">No Show</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Hours</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData?.map((day, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium text-foreground">
                          {formatDate(day?.date_recorded)}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {day?.appointments_scheduled || 0}
                        </td>
                        <td className="py-3 px-4 text-success">
                          {day?.appointments_completed || 0}
                        </td>
                        <td className="py-3 px-4 text-destructive">
                          {day?.appointments_cancelled || 0}
                        </td>
                        <td className="py-3 px-4 text-warning">
                          {day?.appointments_no_show || 0}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {Math.round((day?.total_booking_duration_minutes || 0) / 60 * 10) / 10}h
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {((day?.conversion_rate || 0) * 100)?.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No daily performance data available</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarAnalytics;