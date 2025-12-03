import { supabase } from '../lib/supabase.js';

class VoiceService {
  // Send voice call to individual lead
  async sendVoiceCall(campaignId, leadId, phoneNumber, messageContent, voiceSettings = {}) {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-voice-call', {
        body: {
          campaignId,
          leadId,
          phoneNumber,
          messageContent,
          voiceSettings
        }
      });

      if (error) {
        throw new Error(`Voice call failed: ${error.message}`);
      }

      return {
        success: true,
        data: {
          voiceMessageId: data?.voiceMessageId,
          callSid: data?.callSid,
          status: data?.status,
          estimatedCost: data?.estimatedCost,
          phoneNumber: data?.phoneNumber,
          messageContent: data?.messageContent
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message
      };
    }
  }

  // Send voice campaign to multiple leads
  async sendVoiceCampaign(campaignId, leadIds = []) {
    try {
      // Use database function to send campaign
      const { data, error } = await supabase?.rpc('send_voice_campaign', {
        campaign_uuid: campaignId,
        lead_uuid: leadIds?.length === 1 ? leadIds?.[0] : null
      });

      if (error) {
        throw new Error(`Voice campaign failed: ${error.message}`);
      }

      return {
        success: true,
        data: {
          campaignId,
          callsSent: data?.callsSent || 0,
          callsFailed: data?.callsFailed || 0,
          voiceEngine: data?.voiceEngine || 'twilio',
          timestamp: data?.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message
      };
    }
  }

  // Get voice messages for a campaign
  async getVoiceMessages(campaignId, options = {}) {
    try {
      let query = supabase?.from('voice_messages')?.select(`
          *,
          leads (
            id,
            first_name,
            last_name,
            email,
            phone,
            company_id,
            companies (
              name
            )
          ),
          campaigns (
            id,
            name,
            campaign_type
          )
        `)?.eq('campaign_id', campaignId)?.order('sent_at', { ascending: false });

      // Apply filters
      if (options?.status) {
        query = query?.eq('call_status', options?.status);
      }
      if (options?.answered !== undefined) {
        query = query?.eq('answered', options?.answered);
      }
      if (options?.limit) {
        query = query?.limit(options?.limit);
      }
      if (options?.offset) {
        query = query?.range(options?.offset, options?.offset + (options?.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch voice messages: ${error.message}`);
      }

      return {
        success: true,
        data: data?.map(message => ({
          id: message?.id,
          campaignId: message?.campaign_id,
          leadId: message?.lead_id,
          phoneNumber: message?.phone_number,
          messageContent: message?.message_content,
          callStatus: message?.call_status,
          callDuration: message?.call_duration,
          answered: message?.answered,
          voicemailDetected: message?.voicemail_detected,
          cost: message?.cost,
          recordingUrl: message?.recording_url,
          errorMessage: message?.error_message,
          sentAt: message?.sent_at,
          answeredAt: message?.answered_at,
          completedAt: message?.completed_at,
          lead: message?.leads ? {
            id: message?.leads?.id,
            firstName: message?.leads?.first_name,
            lastName: message?.leads?.last_name,
            fullName: `${message?.leads?.first_name} ${message?.leads?.last_name}`,
            email: message?.leads?.email,
            phone: message?.leads?.phone,
            company: message?.leads?.companies?.name
          } : null,
          campaign: message?.campaigns ? {
            id: message?.campaigns?.id,
            name: message?.campaigns?.name,
            type: message?.campaigns?.campaign_type
          } : null
        })) || []
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message,
        data: []
      };
    }
  }

  // Get voice campaign analytics
  async getVoiceCampaignAnalytics(campaignId) {
    try {
      // Use database function to calculate analytics
      const { data: analyticsData, error } = await supabase?.rpc('calculate_voice_analytics', {
        campaign_uuid: campaignId
      });

      if (error) {
        throw new Error(`Failed to fetch voice analytics: ${error.message}`);
      }

      // Also get recent analytics records
      const { data: recentAnalytics } = await supabase?.from('voice_campaign_analytics')?.select('*')?.eq('campaign_id', campaignId)?.order('date_tracked', { ascending: false })?.limit(30);

      return {
        success: true,
        data: {
          summary: analyticsData || {
            totalCalls: 0,
            answeredCalls: 0,
            completedCalls: 0,
            answerRate: 0,
            completionRate: 0,
            totalDuration: 0,
            totalCost: 0,
            averageDuration: 0,
            costPerCompletion: 0
          },
          dailyAnalytics: recentAnalytics?.map(record => ({
            date: record?.date_tracked,
            totalCalls: record?.total_calls,
            answeredCalls: record?.answered_calls,
            completedCalls: record?.completed_calls,
            voicemails: record?.voicemails,
            failedCalls: record?.failed_calls,
            busySignals: record?.busy_signals,
            noAnswers: record?.no_answers,
            totalDuration: record?.total_duration,
            totalCost: record?.total_cost,
            answerRate: record?.answer_rate,
            completionRate: record?.completion_rate,
            averageCallDuration: record?.average_call_duration,
            costPerCompletion: record?.cost_per_completion
          })) || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message,
        data: {
          summary: {
            totalCalls: 0,
            answeredCalls: 0,
            completedCalls: 0,
            answerRate: 0,
            completionRate: 0,
            totalDuration: 0,
            totalCost: 0,
            averageDuration: 0,
            costPerCompletion: 0
          },
          dailyAnalytics: []
        }
      };
    }
  }

  // Update voice call status (for manual updates or testing)
  async updateVoiceCallStatus(voiceMessageId, status, options = {}) {
    try {
      const { data, error } = await supabase?.rpc('update_voice_call_status', {
        voice_message_uuid: voiceMessageId,
        new_status: status,
        call_duration_seconds: options?.duration,
        recording_url_param: options?.recordingUrl,
        cost_param: options?.cost,
        error_message_param: options?.errorMessage
      });

      if (error) {
        throw new Error(`Failed to update voice call status: ${error.message}`);
      }

      return {
        success: true,
        updated: data
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message
      };
    }
  }

  // Get voice campaign settings
  async getVoiceCampaignSettings(campaignId) {
    try {
      const { data, error } = await supabase?.from('voice_campaign_settings')?.select('*')?.eq('campaign_id', campaignId)?.single();

      if (error && error?.code !== 'PGRST116') {
        throw new Error(`Failed to fetch voice campaign settings: ${error.message}`);
      }

      return {
        success: true,
        data: data ? {
          id: data?.id,
          campaignId: data?.campaign_id,
          voiceEngine: data?.voice_engine,
          voiceSettings: data?.voice_settings,
          retrySettings: data?.retry_settings,
          complianceSettings: data?.compliance_settings,
          callScheduling: data?.call_scheduling,
          createdAt: data?.created_at,
          updatedAt: data?.updated_at
        } : null
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message,
        data: null
      };
    }
  }

  // Create or update voice campaign settings
  async upsertVoiceCampaignSettings(campaignId, settings) {
    try {
      const { data, error } = await supabase?.from('voice_campaign_settings')?.upsert([
          {
            campaign_id: campaignId,
            voice_engine: settings?.voiceEngine || 'twilio',
            voice_settings: settings?.voiceSettings || {
              voice: 'alice',
              language: 'en-US',
              speed: '1.0',
              pitch: '0'
            },
            retry_settings: settings?.retrySettings || {
              maxRetries: 3,
              retryDelay: 3600,
              retryOnNoAnswer: true,
              retryOnBusy: true
            },
            compliance_settings: settings?.complianceSettings || {
              tcpaCompliant: true,
              dncCheck: true,
              consentRequired: true,
              optOutKeywords: ['STOP', 'UNSUBSCRIBE']
            },
            call_scheduling: settings?.callScheduling || {
              respectTimezones: true,
              businessHoursOnly: true,
              startTime: '09:00',
              endTime: '17:00',
              activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
          }
        ], {
          onConflict: 'campaign_id'
        })?.select()?.single();

      if (error) {
        throw new Error(`Failed to save voice campaign settings: ${error.message}`);
      }

      return {
        success: true,
        data: {
          id: data?.id,
          campaignId: data?.campaign_id,
          voiceEngine: data?.voice_engine,
          voiceSettings: data?.voice_settings,
          retrySettings: data?.retry_settings,
          complianceSettings: data?.compliance_settings,
          callScheduling: data?.call_scheduling
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message
      };
    }
  }

  // Get call status options
  getCallStatuses() {
    return [
      { value: 'pending', label: 'Pending', color: 'gray' },
      { value: 'initiated', label: 'Initiated', color: 'blue' },
      { value: 'ringing', label: 'Ringing', color: 'yellow' },
      { value: 'answered', label: 'Answered', color: 'green' },
      { value: 'completed', label: 'Completed', color: 'success' },
      { value: 'busy', label: 'Busy', color: 'orange' },
      { value: 'no_answer', label: 'No Answer', color: 'purple' },
      { value: 'failed', label: 'Failed', color: 'red' },
      { value: 'voicemail', label: 'Voicemail', color: 'indigo' }
    ];
  }

  // Format call duration for display
  formatCallDuration(durationInSeconds) {
    if (!durationInSeconds || durationInSeconds === 0) {
      return '0s';
    }

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Format cost for display
  formatCost(cost, currency = 'USD') {
    if (!cost || cost === 0) {
      return '$0.00';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })?.format(cost);
  }
}

// Export singleton instance
export const voiceService = new VoiceService();
export default voiceService;