import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { calendarService } from '../../../services/calendarService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilitySettings = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
    { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
    { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  useEffect(() => {
    loadAvailability();
  }, [user]);

  const loadAvailability = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: serviceError } = await calendarService?.getUserAvailability(user?.id);

      if (serviceError) {
        throw new Error(serviceError);
      }

      // Initialize with default availability if none exists
      if (!data || data?.length === 0) {
        const defaultAvailability = daysOfWeek?.map(day => ({
          day_of_week: day?.key,
          start_time: day?.key === 'saturday' || day?.key === 'sunday' ? '10:00' : '09:00',
          end_time: day?.key === 'saturday' || day?.key === 'sunday' ? '14:00' : '17:00',
          is_available: day?.key !== 'saturday' && day?.key !== 'sunday',
          timezone: 'America/New_York',
          buffer_before_minutes: 0,
          buffer_after_minutes: 0
        }));
        setAvailability(defaultAvailability);
      } else {
        setAvailability(data);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load availability settings');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = (dayKey, field, value) => {
    setAvailability(prev =>
      prev?.map(day =>
        day?.day_of_week === dayKey
          ? { ...day, [field]: value }
          : day
      )
    );
    setSuccessMessage(''); // Clear success message on change
  };

  const toggleDayAvailability = (dayKey) => {
    updateAvailability(dayKey, 'is_available', !availability?.find(d => d?.day_of_week === dayKey)?.is_available);
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      setError(null);

      const { error: saveError } = await calendarService?.updateAvailability(user?.id, availability);

      if (saveError) {
        throw new Error(saveError);
      }

      setSuccessMessage('Availability settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err?.message || 'Failed to save availability settings');
    } finally {
      setSaving(false);
    }
  };

  const copySchedule = (fromDay) => {
    const sourceDay = availability?.find(d => d?.day_of_week === fromDay);
    if (!sourceDay) return;

    setAvailability(prev =>
      prev?.map(day => ({
        ...day,
        start_time: sourceDay?.start_time,
        end_time: sourceDay?.end_time,
        timezone: sourceDay?.timezone,
        buffer_before_minutes: sourceDay?.buffer_before_minutes,
        buffer_after_minutes: sourceDay?.buffer_after_minutes
      }))
    );
  };

  if (!user) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">Please sign in to manage availability settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Availability Settings</h2>
            <p className="text-muted-foreground">
              Configure your weekly availability for appointment booking. Times are displayed in your local timezone.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadAvailability} disabled={loading}>
              <Icon name="RefreshCw" size={14} className="mr-2" />
              Refresh
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving ? (
                <Icon name="Loader2" size={14} className="mr-2 animate-spin" />
              ) : (
                <Icon name="Save" size={14} className="mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <p className="text-success text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mb-6 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium text-foreground">Quick Setup:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copySchedule('monday')}
          >
            Copy Monday to All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAvailability(prev => prev?.map(day => ({
                ...day,
                is_available: day?.day_of_week !== 'saturday' && day?.day_of_week !== 'sunday',
                start_time: '09:00',
                end_time: '17:00'
              })));
            }}
          >
            Standard Business Hours
          </Button>
        </div>
      </div>
      {/* Availability Schedule */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Schedule</h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {daysOfWeek?.map((day) => {
              const dayAvailability = availability?.find(a => a?.day_of_week === day?.key) || {
                day_of_week: day?.key,
                start_time: '09:00',
                end_time: '17:00',
                is_available: true,
                timezone: 'America/New_York',
                buffer_before_minutes: 0,
                buffer_after_minutes: 0
              };

              return (
                <div
                  key={day?.key}
                  className={`border border-border rounded-lg p-4 transition-all ${
                    dayAvailability?.is_available 
                      ? 'bg-background border-border' :'bg-muted border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Day Toggle */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleDayAvailability(day?.key)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          dayAvailability?.is_available
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {dayAvailability?.is_available && (
                          <Icon name="Check" size={12} />
                        )}
                      </button>
                      <h4 className="font-medium text-foreground min-w-[80px]">
                        {day?.label}
                      </h4>
                    </div>

                    {/* Time Settings */}
                    {dayAvailability?.is_available ? (
                      <div className="flex items-center space-x-4">
                        {/* Start Time */}
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-muted-foreground">From:</label>
                          <input
                            type="time"
                            value={dayAvailability?.start_time}
                            onChange={(e) =>
                              updateAvailability(day?.key, 'start_time', e?.target?.value)
                            }
                            className="border border-border rounded px-2 py-1 text-sm"
                          />
                        </div>

                        {/* End Time */}
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-muted-foreground">To:</label>
                          <input
                            type="time"
                            value={dayAvailability?.end_time}
                            onChange={(e) =>
                              updateAvailability(day?.key, 'end_time', e?.target?.value)
                            }
                            className="border border-border rounded px-2 py-1 text-sm"
                          />
                        </div>

                        {/* Timezone */}
                        <div className="flex items-center space-x-2">
                          <select
                            value={dayAvailability?.timezone}
                            onChange={(e) =>
                              updateAvailability(day?.key, 'timezone', e?.target?.value)
                            }
                            className="border border-border rounded px-2 py-1 text-sm max-w-[200px]"
                          >
                            {timezones?.map((tz) => (
                              <option key={tz?.value} value={tz?.value}>
                                {tz?.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">
                        Not available
                      </span>
                    )}
                  </div>
                  {/* Buffer Settings */}
                  {dayAvailability?.is_available && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <label className="text-muted-foreground">Buffer before:</label>
                          <select
                            value={dayAvailability?.buffer_before_minutes}
                            onChange={(e) =>
                              updateAvailability(day?.key, 'buffer_before_minutes', parseInt(e?.target?.value))
                            }
                            className="border border-border rounded px-2 py-1"
                          >
                            <option value={0}>No buffer</option>
                            <option value={5}>5 minutes</option>
                            <option value={10}>10 minutes</option>
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <label className="text-muted-foreground">Buffer after:</label>
                          <select
                            value={dayAvailability?.buffer_after_minutes}
                            onChange={(e) =>
                              updateAvailability(day?.key, 'buffer_after_minutes', parseInt(e?.target?.value))
                            }
                            className="border border-border rounded px-2 py-1"
                          >
                            <option value={0}>No buffer</option>
                            <option value={5}>5 minutes</option>
                            <option value={10}>10 minutes</option>
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                          </select>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copySchedule(day?.key)}
                          className="text-xs"
                        >
                          <Icon name="Copy" size={12} className="mr-1" />
                          Copy to All
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Preview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Schedule Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availability?.filter(day => day?.is_available)?.map(day => (
              <div key={day?.day_of_week} className="bg-muted rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-foreground capitalize">
                    {day?.day_of_week}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {day?.start_time} - {day?.end_time}
                  </span>
                </div>
              </div>
            ))}
        </div>
        
        {availability?.filter(day => day?.is_available)?.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No available days configured. Enable at least one day to accept bookings.
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySettings;