import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { calendarService } from '../../../services/calendarService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    timeframe: '7' // days
  });

  useEffect(() => {
    loadAppointments();
  }, [user, filters]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = calendarService?.subscribeToAppointments(
      user?.id,
      (payload) => {
        if (payload?.eventType === 'INSERT') {
          setAppointments(prev => [payload?.new, ...prev]);
        } else if (payload?.eventType === 'UPDATE') {
          setAppointments(prev => 
            prev?.map(apt => 
              apt?.id === payload?.new?.id ? payload?.new : apt
            )
          );
        } else if (payload?.eventType === 'DELETE') {
          setAppointments(prev => 
            prev?.filter(apt => apt?.id !== payload?.old?.id)
          );
        }
      }
    );

    return () => {
      if (channel) {
        calendarService?.supabase?.removeChannel(channel);
      }
    };
  }, [user]);

  const loadAppointments = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const filterOptions = {
        start_date: new Date()?.toISOString(),
        end_date: new Date(Date.now() + parseInt(filters?.timeframe) * 24 * 60 * 60 * 1000)?.toISOString()
      };

      if (filters?.status) {
        filterOptions.status = filters?.status;
      }

      const { data, error: serviceError } = await calendarService?.getAppointments(
        user?.id,
        filterOptions
      );

      if (serviceError) {
        setError(serviceError);
        return;
      }

      setAppointments(data || []);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const { error: updateError } = await calendarService?.updateAppointmentStatus(
        appointmentId,
        newStatus
      );

      if (updateError) {
        setError(updateError);
        return;
      }

      // Update local state
      setAppointments(prev =>
        prev?.map(apt =>
          apt?.id === appointmentId
            ? { ...apt, appointment_status: newStatus }
            : apt
        )
      );
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      case 'no_show':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'email campaign':
        return 'Mail';
      case 'sms campaign':
        return 'MessageSquare';
      case 'voice campaign':
        return 'Phone';
      case 'website':
        return 'Globe';
      case 'referral':
        return 'Users';
      default:
        return 'Calendar';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!user) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">Please sign in to view appointments.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Upcoming Appointments</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filters?.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e?.target?.value }))}
            className="text-sm border border-border rounded px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <select
            value={filters?.timeframe}
            onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e?.target?.value }))}
            className="text-sm border border-border rounded px-2 py-1"
          >
            <option value="7">Next 7 days</option>
            <option value="14">Next 2 weeks</option>
            <option value="30">Next month</option>
          </select>
          <Button variant="outline" size="sm" onClick={loadAppointments}>
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : appointments?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No upcoming appointments</h4>
          <p className="text-muted-foreground mb-4">
            {filters?.status ? `No ${filters?.status} appointments found` : 'No appointments scheduled'}
          </p>
          <Button variant="outline" size="sm" onClick={() => setFilters({ status: '', timeframe: '30' })}>
            <Icon name="Plus" size={14} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Lead</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments?.map((appointment) => (
                  <tr key={appointment?.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {appointment?.lead?.first_name} {appointment?.lead?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{appointment?.lead?.email}</p>
                        {appointment?.lead?.phone && (
                          <p className="text-sm text-muted-foreground">{appointment?.lead?.phone}</p>
                        )}
                        {appointment?.lead?.company?.name && (
                          <p className="text-xs text-muted-foreground">{appointment?.lead?.company?.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {formatDateTime(appointment?.scheduled_at)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment?.duration_minutes || 30} minutes
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={getSourceIcon(appointment?.lead?.lead_source)} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                        <span className="text-sm text-foreground">
                          {appointment?.lead?.lead_source || 'Direct'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={appointment?.appointment_status}
                        onChange={(e) => handleStatusUpdate(appointment?.id, e?.target?.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${getStatusColor(appointment?.appointment_status)}`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Icon name="Eye" size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Icon name="Edit" size={14} />
                        </Button>
                        {appointment?.meeting_link && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Join Meeting"
                            onClick={() => window.open(appointment?.meeting_link, '_blank')}
                          >
                            <Icon name="Video" size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {appointments?.map((appointment) => (
              <div key={appointment?.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {appointment?.lead?.first_name} {appointment?.lead?.last_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{appointment?.lead?.email}</p>
                    {appointment?.lead?.company?.name && (
                      <p className="text-xs text-muted-foreground">{appointment?.lead?.company?.name}</p>
                    )}
                  </div>
                  <select
                    value={appointment?.appointment_status}
                    onChange={(e) => handleStatusUpdate(appointment?.id, e?.target?.value)}
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(appointment?.appointment_status)}`}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-foreground">
                      {formatDateTime(appointment?.scheduled_at)} 
                      ({appointment?.duration_minutes || 30}m)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon 
                      name={getSourceIcon(appointment?.lead?.lead_source)} 
                      size={14} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-foreground">
                      {appointment?.lead?.lead_source || 'Direct'}
                    </span>
                  </div>
                  {appointment?.title && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="FileText" size={14} className="text-muted-foreground" />
                      <span className="text-foreground">{appointment?.title}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Icon name="Edit" size={14} />
                    </Button>
                    {appointment?.meeting_link && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(appointment?.meeting_link, '_blank')}
                      >
                        <Icon name="Video" size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {appointments?.length} appointments
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <Icon name="ChevronLeft" size={14} />
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Icon name="ChevronRight" size={14} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UpcomingAppointments;