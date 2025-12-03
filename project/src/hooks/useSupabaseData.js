import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseData = (table, query = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let supabaseQuery = supabase?.from(table)?.select('*');
      
      // Apply filters if provided
      Object.entries(query)?.forEach(([key, value]) => {
        if (key === 'select') {
          supabaseQuery = supabase?.from(table)?.select(value);
        } else if (key === 'order') {
          supabaseQuery = supabaseQuery?.order(value?.column, { ascending: value?.ascending || false });
        } else if (key === 'limit') {
          supabaseQuery = supabaseQuery?.limit(value);
        } else {
          supabaseQuery = supabaseQuery?.eq(key, value);
        }
      });

      const { data: result, error: fetchError } = await supabaseQuery;
      
      if (fetchError) throw fetchError;
      
      setData(result || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(query)]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export const useSupabaseRealtime = (table, callback) => {
  useEffect(() => {
    const channel = supabase?.channel(`${table}_changes`)?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }, [table, callback]);
};

// CRM-specific hooks
export const useLeads = () => {
  const { data: leads, loading, error, refetch } = useSupabaseData('leads', {
    select: `
      *,
      company:companies(*),
      assigned_user:user_profiles(*)
    `,
    order: { column: 'created_at', ascending: false }
  });

  const createLead = async (leadData) => {
    const { data, error } = await supabase?.from('leads')?.insert(leadData)?.select()?.single();

    if (error) throw error;
    refetch();
    return data;
  };

  const updateLead = async (id, updates) => {
    const { data, error } = await supabase?.from('leads')?.update(updates)?.eq('id', id)?.select()?.single();

    if (error) throw error;
    refetch();
    return data;
  };

  const deleteLead = async (id) => {
    const { error } = await supabase?.from('leads')?.delete()?.eq('id', id);

    if (error) throw error;
    refetch();
  };

  return { leads, loading, error, createLead, updateLead, deleteLead, refetch };
};

export const useCampaigns = () => {
  const { data: campaigns, loading, error, refetch } = useSupabaseData('campaigns', {
    select: `
      *,
      creator:user_profiles(*),
      campaign_leads(*)
    `,
    order: { column: 'created_at', ascending: false }
  });

  const createCampaign = async (campaignData) => {
    const { data, error } = await supabase?.from('campaigns')?.insert(campaignData)?.select()?.single();

    if (error) throw error;
    refetch();
    return data;
  };

  return { campaigns, loading, error, createCampaign, refetch };
};

export const useAppointments = () => {
  const { data: appointments, loading, error, refetch } = useSupabaseData('appointments', {
    select: `
      *,
      lead:leads(*),
      assigned_user:user_profiles(*)
    `,
    order: { column: 'scheduled_at', ascending: true }
  });

  const createAppointment = async (appointmentData) => {
    const { data, error } = await supabase?.from('appointments')?.insert(appointmentData)?.select()?.single();

    if (error) throw error;
    refetch();
    return data;
  };

  return { appointments, loading, error, createAppointment, refetch };
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalLeads: 0,
    activeCampaigns: 0,
    upcomingAppointments: 0,
    conversionRate: 0,
    revenueThisMonth: 0,
    campaigns: [],
    activities: [],
    compliance: { status: 'compliant', score: 95 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Promise.allSettled to handle individual failures gracefully
        const [
          leadsResult,
          campaignsResult,
          appointmentsResult,
          conversionResult,
          revenueResult
        ] = await Promise.allSettled([
          supabase?.from('leads')?.select('*', { count: 'exact', head: true }),
          supabase?.from('campaigns')?.select('*', { count: 'exact', head: true })?.eq('campaign_status', 'active'),
          supabase?.from('appointments')?.select('*', { count: 'exact', head: true })?.gte('scheduled_at', new Date()?.toISOString()),
          supabase?.from('leads')?.select('lead_status'),
          supabase?.from('leads')?.select('estimated_value')?.eq('lead_status', 'closed_won')
        ]);

        // Extract data with proper error handling
        const totalLeads = leadsResult?.status === 'fulfilled' ? (leadsResult?.value?.count || 0) : 0;
        const activeCampaigns = campaignsResult?.status === 'fulfilled' ? (campaignsResult?.value?.count || 0) : 0;
        const upcomingAppointments = appointmentsResult?.status === 'fulfilled' ? (appointmentsResult?.value?.count || 0) : 0;
        
        const conversionData = conversionResult?.status === 'fulfilled' ? (conversionResult?.value?.data || []) : [];
        const revenueData = revenueResult?.status === 'fulfilled' ? (revenueResult?.value?.data || []) : [];

        const closedWon = conversionData?.filter(lead => lead?.lead_status === 'closed_won')?.length || 0;
        const conversionRate = totalLeads > 0 ? ((closedWon / totalLeads) * 100)?.toFixed(1) : 0;
        
        const revenueThisMonth = revenueData?.reduce((sum, lead) => {
          return sum + (parseFloat(lead?.estimated_value) || 0);
        }, 0) || 0;

        setAnalytics({
          totalLeads,
          activeCampaigns,
          upcomingAppointments,
          conversionRate,
          revenueThisMonth,
          campaigns: [],
          activities: [],
          compliance: { status: 'compliant', score: 95 }
        });

        // Log any failed requests for debugging
        if (leadsResult?.status === 'rejected') console.warn('Failed to fetch leads count:', leadsResult?.reason);
        if (campaignsResult?.status === 'rejected') console.warn('Failed to fetch campaigns count:', campaignsResult?.reason);
        if (appointmentsResult?.status === 'rejected') console.warn('Failed to fetch appointments count:', appointmentsResult?.reason);

      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError(error?.message || 'Failed to load analytics data');
        
        // Set default values on error
        setAnalytics({
          totalLeads: 0,
          activeCampaigns: 0,
          upcomingAppointments: 0,
          conversionRate: 0,
          revenueThisMonth: 0,
          campaigns: [],
          activities: [],
          compliance: { status: 'unknown', score: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { analytics, loading, error };
};