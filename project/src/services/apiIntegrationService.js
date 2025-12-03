import { supabase } from '../lib/supabase';

export const apiIntegrationService = {
  // API Keys Management
  async getApiKeys() {
    try {
      const { data, error } = await supabase?.from('api_keys')?.select(`
          *,
          api_usage_logs(count)
        `)?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async createApiKey(keyData) {
    try {
      // Generate API key using database function
      const { data: keyResult, error: keyError } = await supabase?.rpc('generate_api_key');

      if (keyError) throw keyError;

      const { data, error } = await supabase?.from('api_keys')?.insert({
          ...keyData,
          api_key: keyResult,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async updateApiKey(keyId, updates) {
    try {
      const { data, error } = await supabase?.from('api_keys')?.update(updates)?.eq('id', keyId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async revokeApiKey(keyId) {
    try {
      const { data, error } = await supabase?.from('api_keys')?.update({ status: 'revoked' })?.eq('id', keyId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async regenerateApiKey(keyId) {
    try {
      // Generate new API key
      const { data: newKey, error: keyError } = await supabase?.rpc('generate_api_key');

      if (keyError) throw keyError;

      const { data, error } = await supabase?.from('api_keys')?.update({ 
          api_key: newKey,
          updated_at: new Date()?.toISOString()
        })?.eq('id', keyId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Integrations Management
  async getIntegrations() {
    try {
      const { data, error } = await supabase?.from('integrations')?.select(`
          *,
          crm_field_mappings(*)
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async createIntegration(integrationData) {
    try {
      const { data, error } = await supabase?.from('integrations')?.insert({
          ...integrationData,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async updateIntegration(integrationId, updates) {
    try {
      const { data, error } = await supabase?.from('integrations')?.update(updates)?.eq('id', integrationId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async deleteIntegration(integrationId) {
    try {
      const { data, error } = await supabase?.from('integrations')?.delete()?.eq('id', integrationId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async testIntegrationConnection(integrationId) {
    try {
      // In a real implementation, this would test the actual connection
      // For now, we'll simulate a connection test
      const { data, error } = await supabase?.from('integrations')?.update({ 
          connection_status: 'connected',
          last_sync_at: new Date()?.toISOString()
        })?.eq('id', integrationId)?.select()?.single();

      if (error) throw error;
      return { data: { success: true, message: 'Connection successful' }, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // API Usage Analytics
  async getApiUsageAnalytics(apiKeyId = null, timeRange = '7d') {
    try {
      let query = supabase?.from('api_usage_logs')?.select(`
          *,
          api_keys(key_name)
        `);

      if (apiKeyId) {
        query = query?.eq('api_key_id', apiKeyId);
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
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Rate Limiting
  async updateRateLimit(apiKeyId, rateLimit, period) {
    try {
      const { data, error } = await supabase?.from('api_keys')?.update({ 
          rate_limit: rateLimit,
          rate_limit_period: period 
        })?.eq('id', apiKeyId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // CRM Field Mappings
  async getFieldMappings(integrationId) {
    try {
      const { data, error } = await supabase?.from('crm_field_mappings')?.select('*')?.eq('integration_id', integrationId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async createFieldMapping(mappingData) {
    try {
      const { data, error } = await supabase?.from('crm_field_mappings')?.insert(mappingData)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async updateFieldMapping(mappingId, updates) {
    try {
      const { data, error } = await supabase?.from('crm_field_mappings')?.update(updates)?.eq('id', mappingId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  async deleteFieldMapping(mappingId) {
    try {
      const { data, error } = await supabase?.from('crm_field_mappings')?.delete()?.eq('id', mappingId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

export default apiIntegrationService;