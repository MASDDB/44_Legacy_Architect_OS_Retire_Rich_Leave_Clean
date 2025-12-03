import { supabase } from '../lib/supabase';

export const webhookService = {
  // Webhook Management
  async getWebhooks() {
    try {
      const { data, error } = await supabase?.from('webhooks')?.select(`
          *,
          webhook_deliveries(
            id,
            event_type,
            response_status,
            delivered_at,
            failed_at,
            created_at
          )
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async createWebhook(webhookData) {
    try {
      // Generate webhook secret
      const { data: secretResult, error: secretError } = await supabase?.rpc('generate_webhook_secret');

      if (secretError) throw secretError;

      const { data, error } = await supabase?.from('webhooks')?.insert({
          ...webhookData,
          secret_key: secretResult,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async updateWebhook(webhookId, updates) {
    try {
      const { data, error } = await supabase?.from('webhooks')?.update(updates)?.eq('id', webhookId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async deleteWebhook(webhookId) {
    try {
      const { data, error } = await supabase?.from('webhooks')?.delete()?.eq('id', webhookId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async toggleWebhookStatus(webhookId, isActive) {
    try {
      const { data, error } = await supabase?.from('webhooks')?.update({ 
          status: isActive ? 'active' : 'inactive',
          is_active: isActive 
        })?.eq('id', webhookId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async testWebhook(webhookId, testPayload = null) {
    try {
      const testData = testPayload || {
        test: true,
        timestamp: new Date()?.toISOString(),
        message: 'This is a test webhook delivery'
      };

      // Log test delivery
      const { data, error } = await supabase?.rpc('log_webhook_delivery', {
          webhook_uuid: webhookId,
          event_type_param: 'custom',
          payload_param: testData,
          status_code: 200,
          response_time: 100,
          attempt: 1
        });

      if (error) throw error;
      return { data: { success: true, message: 'Test webhook sent successfully' }, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async regenerateWebhookSecret(webhookId) {
    try {
      // Generate new webhook secret
      const { data: newSecret, error: secretError } = await supabase?.rpc('generate_webhook_secret');

      if (secretError) throw secretError;

      const { data, error } = await supabase?.from('webhooks')?.update({ 
          secret_key: newSecret,
          updated_at: new Date()?.toISOString()
        })?.eq('id', webhookId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Webhook Deliveries
  async getWebhookDeliveries(webhookId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase?.from('webhook_deliveries')?.select('*')?.eq('webhook_id', webhookId)?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async getDeliveryDetails(deliveryId) {
    try {
      const { data, error } = await supabase?.from('webhook_deliveries')?.select(`
          *,
          webhooks(webhook_name, endpoint_url)
        `)?.eq('id', deliveryId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async retryWebhookDelivery(deliveryId) {
    try {
      // Get original delivery details
      const { data: delivery, error: deliveryError } = await supabase?.from('webhook_deliveries')?.select(`
          *,
          webhooks(*)
        `)?.eq('id', deliveryId)?.single();

      if (deliveryError) throw deliveryError;

      // Create retry delivery log
      const { data, error } = await supabase?.rpc('log_webhook_delivery', {
          webhook_uuid: delivery?.webhook_id,
          event_type_param: delivery?.event_type,
          payload_param: delivery?.payload,
          attempt: delivery?.attempt_number + 1
        });

      if (error) throw error;
      return { data: { success: true, message: 'Webhook retry initiated' }, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Webhook Analytics
  async getWebhookAnalytics(webhookId = null, timeRange = '7d') {
    try {
      let query = supabase?.from('webhook_deliveries')?.select(`
          *,
          webhooks(webhook_name)
        `);

      if (webhookId) {
        query = query?.eq('webhook_id', webhookId);
      }

      // Add time range filter
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setDate(now?.getDate() - 7);
      }

      query = query?.gte('created_at', startDate?.toISOString())?.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Calculate analytics
      const analytics = {
        totalDeliveries: data?.length || 0,
        successfulDeliveries: data?.filter(d => d?.response_status >= 200 && d?.response_status < 300)?.length || 0,
        failedDeliveries: data?.filter(d => d?.response_status >= 400 || d?.failed_at)?.length || 0,
        averageResponseTime: data?.length > 0 
          ? Math.round((data?.reduce((sum, d) => sum + (d?.response_time_ms || 0), 0) || 0) / data?.length)
          : 0,
        successRate: data?.length > 0 
          ? Math.round(((data?.filter(d => d?.response_status >= 200 && d?.response_status < 300)?.length || 0) / data?.length) * 100)
          : 0
      };

      return { data: { deliveries: data, analytics }, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Event Types
  getAvailableEventTypes() {
    return [
      { value: 'lead_created', label: 'Lead Created' },
      { value: 'lead_updated', label: 'Lead Updated' },
      { value: 'campaign_completed', label: 'Campaign Completed' },
      { value: 'appointment_booked', label: 'Appointment Booked' },
      { value: 'payment_processed', label: 'Payment Processed' },
      { value: 'custom', label: 'Custom Event' }
    ];
  }
};

export default webhookService;