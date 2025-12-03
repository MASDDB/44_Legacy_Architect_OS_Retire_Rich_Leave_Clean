import { useState, useEffect } from 'react';
import smsService from '../services/smsService';

/**
 * Custom hook for managing SMS campaigns
 */
const useSMSCampaign = (campaignId) => {
  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load SMS messages for campaign
  const loadMessages = async (campaignId) => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      const data = await smsService?.getSMSMessages(campaignId);
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error loading SMS messages:', err);
      setError(err?.message || 'Failed to load SMS messages');
    } finally {
      setLoading(false);
    }
  };

  // Load SMS templates
  const loadTemplates = async () => {
    try {
      const data = await smsService?.getSMSTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error loading SMS templates:', err);
    }
  };

  // Load SMS statistics
  const loadStats = async (campaignId) => {
    if (!campaignId) return;
    
    try {
      const data = await smsService?.getSMSStats(campaignId);
      setStats(data);
    } catch (err) {
      console.error('Error loading SMS stats:', err);
    }
  };

  // Send SMS to single lead
  const sendSingleSMS = async (leadId, message) => {
    try {
      setLoading(true);
      const result = await smsService?.sendCampaignSMS(campaignId, leadId, message);
      
      // Reload messages and stats
      await loadMessages(campaignId);
      await loadStats(campaignId);
      
      return result;
    } catch (err) {
      console.error('Error sending SMS:', err);
      setError(err?.message || 'Failed to send SMS');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send bulk SMS to multiple leads
  const sendBulkSMS = async (leadIds, message) => {
    try {
      setLoading(true);
      const results = await smsService?.sendBulkSMS(campaignId, leadIds, message);
      
      // Reload messages and stats
      await loadMessages(campaignId);
      await loadStats(campaignId);
      
      return results;
    } catch (err) {
      console.error('Error sending bulk SMS:', err);
      setError(err?.message || 'Failed to send bulk SMS');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new SMS template
  const createTemplate = async (templateData) => {
    try {
      const result = await smsService?.createSMSTemplate(templateData);
      await loadTemplates(); // Reload templates
      return result;
    } catch (err) {
      console.error('Error creating template:', err);
      setError(err?.message || 'Failed to create template');
      throw err;
    }
  };

  // Initialize data when campaignId changes
  useEffect(() => {
    if (campaignId) {
      loadMessages(campaignId);
      loadStats(campaignId);
    }
  }, [campaignId]);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Auto-refresh stats every 30 seconds when there are pending messages
  useEffect(() => {
    if (stats?.pending > 0) {
      const interval = setInterval(() => {
        loadStats(campaignId);
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [stats?.pending, campaignId]);

  return {
    // Data
    messages,
    templates,
    stats,
    loading,
    error,
    
    // Actions
    sendSingleSMS,
    sendBulkSMS,
    createTemplate,
    
    // Utilities
    refreshMessages: () => loadMessages(campaignId),
    refreshStats: () => loadStats(campaignId),
    refreshTemplates: loadTemplates,
    clearError: () => setError(null)
  };
};

export default useSMSCampaign;