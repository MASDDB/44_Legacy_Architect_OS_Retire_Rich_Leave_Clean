import { useState, useEffect } from 'react';
import { emailService } from '../services/emailService.js';
import { supabase } from '../lib/supabase.js';

export const useEmailNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch email notifications
  const fetchNotifications = async (limit = 50, offset = 0) => {
    try {
      setLoading(true);
      const data = await emailService?.getEmailNotifications(limit, offset);
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to fetch notifications');
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch email templates
  const fetchTemplates = async (templateType = null) => {
    try {
      setLoading(true);
      const data = await emailService?.getEmailTemplates(templateType);
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to fetch templates');
      console.error('Fetch templates error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch email preferences
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const data = await emailService?.getEmailPreferences();
      setPreferences(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to fetch preferences');
      console.error('Fetch preferences error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send email notification
  const sendEmail = async (emailData) => {
    try {
      setLoading(true);
      const result = await emailService?.sendEmail(emailData);
      setError(null);
      
      // Refresh notifications list
      await fetchNotifications();
      
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to send email');
      console.error('Send email error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send appointment confirmation
  const sendAppointmentConfirmation = async (appointment, lead) => {
    try {
      setLoading(true);
      const result = await emailService?.sendAppointmentConfirmation(appointment, lead);
      setError(null);
      
      // Refresh notifications list
      await fetchNotifications();
      
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to send appointment confirmation');
      console.error('Send appointment confirmation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send lead welcome email
  const sendLeadWelcome = async (lead, campaign = null) => {
    try {
      setLoading(true);
      const result = await emailService?.sendLeadWelcome(lead, campaign);
      setError(null);
      
      // Refresh notifications list
      await fetchNotifications();
      
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to send welcome email');
      console.error('Send welcome email error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send campaign email
  const sendCampaignEmail = async (campaign, lead, customContent = null) => {
    try {
      setLoading(true);
      const result = await emailService?.sendCampaignEmail(campaign, lead, customContent);
      setError(null);
      
      // Refresh notifications list
      await fetchNotifications();
      
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to send campaign email');
      console.error('Send campaign email error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const updatePreferences = async (updatedPreferences) => {
    try {
      setLoading(true);
      await emailService?.updateEmailPreferences(updatedPreferences);
      setPreferences(updatedPreferences);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to update preferences');
      console.error('Update preferences error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription for notifications
  useEffect(() => {
    const channel = supabase?.channel('email_notifications')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_notifications'
        },
        (payload) => {
          if (payload?.eventType === 'INSERT') {
            setNotifications(prev => [payload?.new, ...prev]);
          } else if (payload?.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev?.map(item => 
                item?.id === payload?.new?.id ? payload?.new : item
              )
            );
          } else if (payload?.eventType === 'DELETE') {
            setNotifications(prev => 
              prev?.filter(item => item?.id !== payload?.old?.id)
            );
          }
        }
      )?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  return {
    notifications,
    templates,
    preferences,
    loading,
    error,
    fetchNotifications,
    fetchTemplates,
    fetchPreferences,
    sendEmail,
    sendAppointmentConfirmation,
    sendLeadWelcome,
    sendCampaignEmail,
    updatePreferences,
    clearError: () => setError(null)
  };
};

export default useEmailNotifications;