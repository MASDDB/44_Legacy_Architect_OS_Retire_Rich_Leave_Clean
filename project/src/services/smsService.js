import { supabase } from '../lib/supabase';

/**
 * SMS Service for Twilio integration
 */
class SMSService {
  /**
   * Send SMS through Twilio Edge Function
   */
  async sendSMS({ to, message, campaignId, leadId }) {
    try {
      const { data: { session } } = await supabase?.auth?.getSession();
      const token = session?.access_token;

      const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          to,
          message,
          campaignId,
          leadId
        })
      });

      const result = await response?.json();
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to send SMS');
      }

      return result;
    } catch (error) {
      console.error('SMS Service Error:', error);
      throw error;
    }
  }

  /**
   * Send campaign SMS using database function
   */
  async sendCampaignSMS(campaignId, leadId, message) {
    try {
      const { data, error } = await supabase?.rpc('send_campaign_sms', {
        p_campaign_id: campaignId,
        p_lead_id: leadId,
        p_message: message
      });

      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to prepare SMS');
      }

      // Now send via Twilio
      const twilioResult = await this.sendSMS({
        to: data?.phone_number,
        message: data?.message,
        campaignId,
        leadId
      });

      // Update status in database
      await this.updateSMSStatus(data?.message_id, twilioResult?.messageSid, 'sent');

      return {
        success: true,
        messageId: data?.message_id,
        twilioSid: twilioResult?.messageSid
      };
    } catch (error) {
      console.error('Campaign SMS Error:', error);
      throw error;
    }
  }

  /**
   * Update SMS status after Twilio response
   */
  async updateSMSStatus(messageId, twilioSid, status, errorMessage = null) {
    try {
      const { data, error } = await supabase?.rpc('update_sms_status', {
        p_message_id: messageId,
        p_twilio_sid: twilioSid,
        p_status: status,
        p_error_message: errorMessage
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update SMS Status Error:', error);
      throw error;
    }
  }

  /**
   * Get SMS messages for a campaign
   */
  async getSMSMessages(campaignId) {
    try {
      const { data, error } = await supabase?.from('sms_messages')?.select(`
          *,
          lead:leads(first_name, last_name, email),
          sent_by_user:user_profiles!sent_by(full_name, email)
        `)?.eq('campaign_id', campaignId)?.order('sent_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get SMS Messages Error:', error);
      throw error;
    }
  }

  /**
   * Get SMS templates
   */
  async getSMSTemplates() {
    try {
      const { data, error } = await supabase?.from('sms_templates')?.select('*')?.eq('is_active', true)?.order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get SMS Templates Error:', error);
      throw error;
    }
  }

  /**
   * Create SMS template
   */
  async createSMSTemplate({ name, content, variables = [], category = 'general' }) {
    try {
      const { data, error } = await supabase?.from('sms_templates')?.insert({
          name,
          content,
          variables,
          category,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create SMS Template Error:', error);
      throw error;
    }
  }

  /**
   * Send bulk SMS to multiple leads
   */
  async sendBulkSMS(campaignId, leadIds, message) {
    const results = [];
    
    for (const leadId of leadIds) {
      try {
        const result = await this.sendCampaignSMS(campaignId, leadId, message);
        results?.push({ leadId, success: true, ...result });
      } catch (error) {
        results?.push({ leadId, success: false, error: error?.message });
      }
    }

    return results;
  }

  /**
   * Get SMS statistics for analytics
   */
  async getSMSStats(campaignId) {
    try {
      const { data, error } = await supabase?.from('sms_messages')?.select('status')?.eq('campaign_id', campaignId);

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 0
      };

      data?.forEach(message => {
        switch (message?.status) {
          case 'sent':
            stats.sent++;
            break;
          case 'delivered':
            stats.delivered++;
            break;
          case 'failed':
            stats.failed++;
            break;
          case 'pending':
            stats.pending++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Get SMS Stats Error:', error);
      return { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 };
    }
  }
}

export default new SMSService();