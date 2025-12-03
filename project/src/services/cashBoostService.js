import { supabase } from '../lib/supabase';

export const cashBoostService = {
  async createCampaign(campaignData) {
    const { data, error } = await supabase
      .from('cash_boost_campaigns')
      .insert([{
        campaign_type: campaignData.campaignType,
        audience_size: campaignData.audienceSize,
        audience_filters: campaignData.audienceFilters,
        offer_details: campaignData.offerDetails,
        pricing_mode: campaignData.pricingMode,
        performance_rate: campaignData.performanceRate || 0,
        message_sms: campaignData.messageSms,
        message_email: campaignData.messageEmail,
        status: 'draft',
        start_date: campaignData.startDate,
        end_date: campaignData.endDate,
        user_id: campaignData.userId
      }])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getCampaign(campaignId) {
    const { data, error } = await supabase
      .from('cash_boost_campaigns')
      .select('*')
      .eq('id', campaignId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getUserCampaigns(userId) {
    const { data, error } = await supabase
      .from('cash_boost_campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateCampaign(campaignId, updates) {
    const { data, error } = await supabase
      .from('cash_boost_campaigns')
      .update(updates)
      .eq('id', campaignId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async launchCampaign(campaignId) {
    const { data, error } = await supabase
      .from('cash_boost_campaigns')
      .update({
        status: 'active',
        start_date: new Date().toISOString()
      })
      .eq('id', campaignId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async completeCampaign(campaignId) {
    const { data, error } = await supabase
      .from('cash_boost_campaigns')
      .update({
        status: 'completed',
        end_date: new Date().toISOString()
      })
      .eq('id', campaignId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async addRevenueEvent(revenueData) {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('cash_boost_revenue_events')
      .insert([{
        campaign_id: revenueData.campaignId,
        lead_id: revenueData.leadId,
        job_value: revenueData.jobValue,
        collected_at: revenueData.collectedAt || new Date().toISOString(),
        notes: revenueData.notes,
        created_by: user?.user?.id
      }])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getRevenueEvents(campaignId) {
    const { data, error } = await supabase
      .from('cash_boost_revenue_events')
      .select('*, leads(first_name, last_name, company)')
      .eq('campaign_id', campaignId)
      .order('collected_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateRevenueEvent(eventId, updates) {
    const { data, error } = await supabase
      .from('cash_boost_revenue_events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async deleteRevenueEvent(eventId) {
    const { error } = await supabase
      .from('cash_boost_revenue_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  },

  async billPerformanceFee(campaignId) {
    const campaign = await this.getCampaign(campaignId);

    if (!campaign || campaign.pricing_mode !== 'performance') {
      throw new Error('Campaign is not in performance mode');
    }

    if (campaign.performance_fee_billed) {
      throw new Error('Performance fee already billed');
    }

    const { data, error } = await supabase.functions.invoke('bill-performance-fee', {
      body: { campaignId }
    });

    if (error) throw error;

    await this.updateCampaign(campaignId, {
      performance_fee_billed: true
    });

    return data;
  },

  async updateCampaignMetrics(campaignId, metrics) {
    const updates = {};

    if (metrics.contactsMessaged !== undefined) updates.contacts_messaged = metrics.contactsMessaged;
    if (metrics.repliesCount !== undefined) updates.replies_count = metrics.repliesCount;
    if (metrics.jobsBooked !== undefined) updates.jobs_booked = metrics.jobsBooked;
    if (metrics.jobsCompleted !== undefined) updates.jobs_completed = metrics.jobsCompleted;

    const { data, error } = await supabase
      .from('cash_boost_campaigns')
      .update(updates)
      .eq('id', campaignId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async generateProjection(audienceSize, campaignType, offerDetails) {
    const conversionRates = {
      reactivation: { low: 0.03, high: 0.08 },
      high_value_followup: { low: 0.05, high: 0.12 },
      maintenance_membership: { low: 0.04, high: 0.10 }
    };

    const rates = conversionRates[campaignType] || conversionRates.reactivation;
    const avgJobValue = parseFloat(offerDetails.specialOffer) || 150;

    const jobsLow = Math.round(audienceSize * rates.low);
    const jobsHigh = Math.round(audienceSize * rates.high);
    const revLow = jobsLow * avgJobValue;
    const revHigh = jobsHigh * avgJobValue;

    return {
      jobsLow,
      jobsHigh,
      revLow,
      revHigh,
      avgJobValue
    };
  },

  async generateAIMessage(campaignType, offerDetails, audienceFilters, aiNotes) {
    try {
      const campaignTypeNames = {
        reactivation: 'Reactivation Blast',
        high_value_followup: 'High-Value Follow-Up',
        maintenance_membership: 'Maintenance / Membership Push'
      };

      const prompt = `Generate a friendly, conversational SMS message for a ${campaignTypeNames[campaignType]} campaign.

Service: ${offerDetails.service}
Normal Price: $${offerDetails.normalPrice}
Special Offer: ${offerDetails.specialOffer}
Offer Expires: ${offerDetails.expiresOn}
Additional Notes: ${aiNotes || 'None'}

The message should:
- Be under 160 characters if possible
- Sound personal and direct
- Include a clear call to action
- Mention the offer and deadline
- Be appropriate for existing customers
- Include [NAME] placeholder for personalization

Do not include opt-out language (we add that automatically).`;

      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: {
          prompt,
          maxTokens: 150
        }
      });

      if (error) throw error;
      return data.message || this.getFallbackMessage(campaignType, offerDetails);
    } catch (err) {
      console.error('AI generation failed, using fallback:', err);
      return this.getFallbackMessage(campaignType, offerDetails);
    }
  },

  getFallbackMessage(campaignType, offerDetails) {
    const messages = {
      reactivation: `Hi [NAME]! We miss you. Get ${offerDetails.specialOffer} on ${offerDetails.service} if you book by ${new Date(offerDetails.expiresOn).toLocaleDateString()}. Reply YES to claim your spot!`,
      high_value_followup: `Hi [NAME], still interested in ${offerDetails.service}? We can do ${offerDetails.specialOffer} if you book before ${new Date(offerDetails.expiresOn).toLocaleDateString()}. Ready to move forward?`,
      maintenance_membership: `Hi [NAME]! Join our maintenance plan for just ${offerDetails.specialOffer}. Lock in this rate if you sign up by ${new Date(offerDetails.expiresOn).toLocaleDateString()}. Interested?`
    };

    return messages[campaignType] || messages.reactivation;
  }
};
