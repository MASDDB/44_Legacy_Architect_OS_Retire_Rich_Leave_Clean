import { supabase } from '../lib/supabase';

class CalendarService {
  // Calendar Connections Management
  async getCalendarConnections(userId) {
    try {
      const { data, error } = await supabase?.from('calendar_connections')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async connectCalendar(userId, provider, connectionData) {
    try {
      const { data, error } = await supabase?.from('calendar_connections')?.insert({
          user_id: userId,
          provider,
          connection_status: 'connected',
          access_token: connectionData?.access_token,
          refresh_token: connectionData?.refresh_token,
          external_calendar_id: connectionData?.external_calendar_id,
          external_account_email: connectionData?.external_account_email,
          last_sync_at: new Date()?.toISOString(),
          sync_status: 'success',
          settings: connectionData?.settings || {}
        })?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async disconnectCalendar(connectionId) {
    try {
      const { data, error } = await supabase?.from('calendar_connections')?.update({
          connection_status: 'disconnected',
          access_token: null,
          refresh_token: null,
          sync_status: 'pending',
          error_message: null
        })?.eq('id', connectionId)?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async syncCalendar(connectionId) {
    try {
      const { data, error } = await supabase?.rpc('sync_external_calendar', {
          connection_uuid: connectionId
        });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // User Availability Management
  async getUserAvailability(userId) {
    try {
      const { data, error } = await supabase?.from('user_availability')?.select('*')?.eq('user_id', userId)?.order('day_of_week', { ascending: true })?.order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async updateAvailability(userId, availabilityData) {
    try {
      // Delete existing availability for user
      await supabase?.from('user_availability')?.delete()?.eq('user_id', userId);

      // Insert new availability settings
      const { data, error } = await supabase?.from('user_availability')?.insert(
          availabilityData?.map(slot => ({
            user_id: userId,
            day_of_week: slot?.day_of_week,
            start_time: slot?.start_time,
            end_time: slot?.end_time,
            is_available: slot?.is_available,
            timezone: slot?.timezone || 'UTC',
            buffer_before_minutes: slot?.buffer_before_minutes || 0,
            buffer_after_minutes: slot?.buffer_after_minutes || 0
          }))
        )?.select();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async getAvailabilityForDate(userId, date, timezone = 'UTC') {
    try {
      const { data, error } = await supabase?.rpc('get_user_availability_for_date', {
          target_user_id: userId,
          target_date: date,
          target_timezone: timezone
        });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Booking Page Management
  async getBookingPageSettings(userId) {
    try {
      const { data, error } = await supabase?.from('booking_page_settings')?.select('*')?.eq('user_id', userId)?.single();

      if (error && error?.code === 'PGRST116') {
        // No settings found, return default
        return {
          data: {
            page_title: 'Book a Meeting',
            page_description: '',
            booking_status: 'enabled',
            default_duration_minutes: 30,
            min_notice_hours: 24,
            max_advance_days: 60,
            allowed_duration_options: [15, 30, 45, 60],
            require_confirmation: false,
            custom_questions: [],
            branding_settings: {},
            notification_settings: {}
          },
          error: null
        };
      }

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async updateBookingPageSettings(userId, settings) {
    try {
      const { data, error } = await supabase?.from('booking_page_settings')?.upsert({
          user_id: userId,
          ...settings
        })?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Appointments Management (extends existing appointments table)
  async getAppointments(userId, filters = {}) {
    try {
      let query = supabase?.from('appointments')?.select(`
          *,
          lead:leads(
            id,
            first_name,
            last_name,
            email,
            phone,
            company:companies(name)
          )
        `)?.eq('assigned_to', userId)?.order('scheduled_at', { ascending: true });

      // Apply filters
      if (filters?.status) {
        query = query?.eq('appointment_status', filters?.status);
      }

      if (filters?.start_date) {
        query = query?.gte('scheduled_at', filters?.start_date);
      }

      if (filters?.end_date) {
        query = query?.lte('scheduled_at', filters?.end_date);
      }

      if (filters?.lead_id) {
        query = query?.eq('lead_id', filters?.lead_id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async createAppointment(appointmentData) {
    try {
      const { data, error } = await supabase?.from('appointments')?.insert({
          title: appointmentData?.title,
          description: appointmentData?.description,
          scheduled_at: appointmentData?.scheduled_at,
          duration_minutes: appointmentData?.duration_minutes || 30,
          assigned_to: appointmentData?.assigned_to,
          lead_id: appointmentData?.lead_id,
          meeting_link: appointmentData?.meeting_link,
          meeting_location: appointmentData?.meeting_location,
          notes: appointmentData?.notes,
          appointment_status: 'scheduled'
        })?.select()?.single();

      if (error) {
        throw error;
      }

      // Create reminder if needed
      if (appointmentData?.create_reminder) {
        await this.createAppointmentReminder(data?.id, appointmentData?.reminder_settings);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async updateAppointmentStatus(appointmentId, status) {
    try {
      const { data, error } = await supabase?.from('appointments')?.update({ appointment_status: status })?.eq('id', appointmentId)?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Reminder Management
  async createAppointmentReminder(appointmentId, reminderSettings) {
    try {
      const reminders = [];

      if (reminderSettings?.email_reminder) {
        reminders?.push({
          appointment_id: appointmentId,
          reminder_type: 'email',
          send_at: reminderSettings?.email_send_at
        });
      }

      if (reminderSettings?.sms_reminder) {
        reminders?.push({
          appointment_id: appointmentId,
          reminder_type: 'sms',
          send_at: reminderSettings?.sms_send_at
        });
      }

      if (reminders?.length === 0) {
        return { data: null, error: null };
      }

      const { data, error } = await supabase?.from('appointment_reminders')?.insert(reminders)?.select();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async getPendingReminders() {
    try {
      const { data, error } = await supabase?.from('appointment_reminders')?.select(`
          *,
          appointment:appointments(
            title,
            scheduled_at,
            lead:leads(first_name, last_name, email, phone)
          )
        `)?.eq('sent', false)?.lte('send_at', new Date()?.toISOString())?.order('send_at', { ascending: true });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Calendar Analytics
  async getCalendarAnalytics(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase?.rpc('calculate_calendar_metrics', {
          target_user_id: userId,
          start_date: startDate,
          end_date: endDate
        });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  async getDailyAnalytics(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase?.from('calendar_analytics')?.select('*')?.eq('user_id', userId)?.gte('date_recorded', startDate)?.lte('date_recorded', endDate)?.order('date_recorded', { ascending: true });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Sync Logs
  async getSyncLogs(userId, limit = 50) {
    try {
      const { data, error } = await supabase?.from('calendar_sync_logs')?.select(`
          *,
          connection:calendar_connections(
            provider,
            external_account_email
          )
        `)?.in('connection_id', 
          supabase?.from('calendar_connections')?.select('id')?.eq('user_id', userId)
        )?.order('created_at', { ascending: false })?.limit(limit);

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Real-time subscriptions
  subscribeToAppointments(userId, callback) {
    const channel = supabase?.channel('appointments')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `assigned_to=eq.${userId}`
        },
        callback
      )?.subscribe();

    return channel;
  }

  subscribeToSyncStatus(userId, callback) {
    const channel = supabase?.channel('calendar-sync')?.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'calendar_connections',
          filter: `user_id=eq.${userId}`
        },
        callback
      )?.subscribe();

    return channel;
  }

  // Utility methods
  async getConnectionStatus(userId) {
    try {
      const { data, error } = await supabase?.from('calendar_connections')?.select('provider, connection_status, last_sync_at, sync_status, error_message')?.eq('user_id', userId);

      if (error) {
        throw error;
      }

      const statusSummary = {
        total_connections: data?.length || 0,
        connected: data?.filter(c => c?.connection_status === 'connected')?.length || 0,
        last_sync: data?.reduce((latest, conn) => {
          return !latest || (conn?.last_sync_at && conn?.last_sync_at > latest) 
            ? conn?.last_sync_at 
            : latest;
        }, null),
        has_errors: data?.some(c => c?.connection_status === 'error') || false,
        providers: data?.map(c => ({
          provider: c?.provider,
          status: c?.connection_status,
          sync_status: c?.sync_status,
          last_sync: c?.last_sync_at,
          error: c?.error_message
        })) || []
      };

      return { data: statusSummary, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  formatAppointmentForCalendar(appointment) {
    return {
      id: appointment?.id,
      title: appointment?.title,
      start: appointment?.scheduled_at,
      end: new Date(new Date(appointment?.scheduled_at).getTime() + 
            (appointment?.duration_minutes || 30) * 60000)?.toISOString(),
      status: appointment?.appointment_status,
      attendee: appointment?.lead ? 
        `${appointment?.lead?.first_name} ${appointment?.lead?.last_name}` : 
        'Unknown',
      email: appointment?.lead?.email,
      phone: appointment?.lead?.phone,
      company: appointment?.lead?.company?.name,
      location: appointment?.meeting_location,
      link: appointment?.meeting_link,
      notes: appointment?.notes,
      color: this.getStatusColor(appointment?.appointment_status)
    };
  }

  getStatusColor(status) {
    const colors = {
      scheduled: '#3B82F6',   // Blue
      confirmed: '#10B981',   // Green  
      completed: '#6B7280',   // Gray
      cancelled: '#EF4444',   // Red
      no_show: '#F59E0B'      // Amber
    };
    return colors?.[status] || colors?.scheduled;
  }
}

export const calendarService = new CalendarService();
export default calendarService;