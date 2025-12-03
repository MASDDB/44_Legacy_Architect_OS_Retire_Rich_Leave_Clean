import { supabase } from '../lib/supabase';

class CRMService {
  // Get all CRM connections for current user
  async getCRMConnections() {
    try {
      const { data, error } = await supabase?.from('crm_connections')?.select(`
          *,
          crm_sync_configs (
            id,
            sync_direction,
            sync_frequency,
            is_enabled,
            last_sync_at,
            next_sync_at
          )
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Create new CRM connection
  async createCRMConnection(connectionData) {
    try {
      const { data, error } = await supabase?.from('crm_connections')?.insert([connectionData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Update CRM connection
  async updateCRMConnection(connectionId, updates) {
    try {
      const { data, error } = await supabase?.from('crm_connections')?.update(updates)?.eq('id', connectionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Delete CRM connection
  async deleteCRMConnection(connectionId) {
    try {
      const { data, error } = await supabase?.from('crm_connections')?.delete()?.eq('id', connectionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Get field mappings for a connection
  async getFieldMappings(connectionId) {
    try {
      const { data, error } = await supabase?.from('crm_field_mappings')?.select('*')?.eq('connection_id', connectionId)?.order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Update field mappings
  async updateFieldMappings(connectionId, mappings) {
    try {
      // First delete existing mappings
      await supabase?.from('crm_field_mappings')?.delete()?.eq('connection_id', connectionId);

      // Then insert new mappings
      if (mappings?.length > 0) {
        const mappingsWithConnectionId = mappings?.map(mapping => ({
          ...mapping,
          connection_id: connectionId
        }));

        const { data, error } = await supabase?.from('crm_field_mappings')?.insert(mappingsWithConnectionId)?.select();

        if (error) throw error;
        return { data, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Get sync configuration
  async getSyncConfig(connectionId) {
    try {
      const { data, error } = await supabase?.from('crm_sync_configs')?.select('*')?.eq('connection_id', connectionId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Update sync configuration
  async updateSyncConfig(connectionId, config) {
    try {
      const { data, error } = await supabase?.from('crm_sync_configs')?.upsert([{ connection_id: connectionId, ...config }])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Get sync history
  async getSyncHistory(connectionId, limit = 20) {
    try {
      const { data, error } = await supabase?.rpc('get_recent_crm_sync_activity', {
          connection_uuid: connectionId,
          limit_count: limit
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Get CRM sync health overview
  async getCRMSyncHealth() {
    try {
      const { data: session } = await supabase?.auth?.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase?.rpc('get_crm_sync_health', {
          user_uuid: session?.session?.user?.id
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Trigger manual sync
  async triggerManualSync(connectionId) {
    try {
      // In a real implementation, this would call an edge function
      // For now, we'll create a sync history entry
      const { data, error } = await supabase?.from('crm_sync_history')?.insert([{
          connection_id: connectionId,
          sync_status: 'pending',
          sync_direction: 'bidirectional',
          records_processed: 0,
          records_created: 0,
          records_updated: 0,
          records_failed: 0,
          started_at: new Date()?.toISOString()
        }])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Test CRM connection
  async testConnection(connectionId) {
    try {
      // In a real implementation, this would call the CRM API
      // For demo purposes, we'll simulate a test
      const randomSuccess = Math.random() > 0.3; // 70% success rate

      if (randomSuccess) {
        await this.updateCRMConnection(connectionId, {
          connection_status: 'connected',
          last_sync_at: new Date()?.toISOString()
        });
        return { data: { success: true, message: 'Connection test successful' }, error: null };
      } else {
        await this.updateCRMConnection(connectionId, {
          connection_status: 'error',
          sync_errors: [{ 
            timestamp: new Date()?.toISOString(), 
            error: 'Connection timeout', 
            details: 'Unable to connect to CRM API endpoint' 
          }]
        });
        return { data: { success: false, message: 'Connection test failed' }, error: null };
      }
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  // Get available CRM providers
  getCRMProviders() {
    return [
      {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Connect to HubSpot CRM for lead and contact synchronization',
        icon: '🔶',
        features: ['Contacts', 'Companies', 'Deals', 'Custom Properties'],
        isPopular: true
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Integrate with Salesforce CRM for comprehensive data sync',
        icon: '☁️',
        features: ['Leads', 'Contacts', 'Accounts', 'Opportunities'],
        isPopular: true
      },
      {
        id: 'pipedrive',
        name: 'Pipedrive',
        description: 'Sync with Pipedrive for streamlined sales pipeline management',
        icon: '📊',
        features: ['Persons', 'Organizations', 'Deals', 'Activities'],
        isPopular: false
      },
      {
        id: 'custom',
        name: 'Custom API',
        description: 'Connect to any CRM using custom API configuration',
        icon: '🔧',
        features: ['Custom Fields', 'Webhooks', 'REST API', 'GraphQL'],
        isPopular: false
      }
    ];
  }

  // Get platform fields available for mapping
  getPlatformFields() {
    return [
      { key: 'full_name', label: 'Full Name', type: 'string', required: true },
      { key: 'first_name', label: 'First Name', type: 'string', required: false },
      { key: 'last_name', label: 'Last Name', type: 'string', required: false },
      { key: 'email', label: 'Email Address', type: 'email', required: true },
      { key: 'phone', label: 'Phone Number', type: 'phone', required: false },
      { key: 'company', label: 'Company', type: 'string', required: false },
      { key: 'job_title', label: 'Job Title', type: 'string', required: false },
      { key: 'lead_source', label: 'Lead Source', type: 'string', required: false },
      { key: 'lead_status', label: 'Lead Status', type: 'enum', required: false },
      { key: 'created_at', label: 'Created Date', type: 'datetime', required: false },
      { key: 'updated_at', label: 'Updated Date', type: 'datetime', required: false }
    ];
  }

  // Get common CRM fields for different providers
  getCRMFields(provider) {
    const commonFields = {
      hubspot: [
        { key: 'firstname', label: 'First Name', type: 'string' },
        { key: 'lastname', label: 'Last Name', type: 'string' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'phone', label: 'Phone Number', type: 'string' },
        { key: 'company', label: 'Company Name', type: 'string' },
        { key: 'jobtitle', label: 'Job Title', type: 'string' },
        { key: 'hs_lead_status', label: 'Lead Status', type: 'enumeration' },
        { key: 'hs_lifecycle_stage', label: 'Lifecycle Stage', type: 'enumeration' }
      ],
      salesforce: [
        { key: 'FirstName', label: 'First Name', type: 'string' },
        { key: 'LastName', label: 'Last Name', type: 'string' },
        { key: 'Name', label: 'Full Name', type: 'string' },
        { key: 'Email', label: 'Email', type: 'email' },
        { key: 'Phone', label: 'Phone', type: 'phone' },
        { key: 'Company', label: 'Company', type: 'string' },
        { key: 'Title', label: 'Title', type: 'string' },
        { key: 'LeadSource', label: 'Lead Source', type: 'picklist' },
        { key: 'Status', label: 'Status', type: 'picklist' }
      ],
      pipedrive: [
        { key: 'name', label: 'Name', type: 'varchar' },
        { key: 'first_name', label: 'First Name', type: 'varchar' },
        { key: 'last_name', label: 'Last Name', type: 'varchar' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'phone', label: 'Phone', type: 'phone' },
        { key: 'org_name', label: 'Organization', type: 'varchar' },
        { key: 'job_title', label: 'Job Title', type: 'varchar' },
        { key: 'lead_source', label: 'Lead Source', type: 'varchar' }
      ],
      custom: []
    };

    return commonFields?.[provider] || [];
  }
}

export const crmService = new CRMService();
export default crmService;