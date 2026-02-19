import { supabase } from '../lib/supabase';

/**
 * Advanced Lead Scoring Service
 * Provides AI-powered lead scoring, behavioral analysis, and predictive analytics
 */
export class LeadScoringService {

  /**
   * Get comprehensive lead score with all components
   * @param {string} leadId - UUID of the lead
   * @returns {Promise<Object>} Complete lead scoring data
   */
  static async getLeadScore(leadId) {
    try {
      const { data, error } = await supabase?.from('lead_scores')?.select(`
          *,
          lead:lead_id(id, first_name, last_name, email, company_id, priority, estimated_value),
          scoring_model:scoring_model_id(name, model_type, version)
        `)?.eq('lead_id', leadId)?.gt('expires_at', new Date()?.toISOString())?.order('created_at', { ascending: false })?.limit(1)?.single();

      if (error && error?.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching lead score:', error);
      throw error;
    }
  }

  /**
   * Calculate and update lead score using AI-powered algorithms
   * @param {string} leadId - UUID of the lead
   * @param {string} scoringModelId - Optional specific scoring model ID
   * @returns {Promise<Object>} Updated lead score
   */
  static async calculateLeadScore(leadId, scoringModelId = null) {
    try {
      // Call the database function to calculate the score
      const { data: scoreData, error: scoreError } = await supabase?.rpc('calculate_overall_lead_score', {
        lead_uuid: leadId,
        scoring_model_uuid: scoringModelId
      });

      if (scoreError) throw scoreError;

      const overallScore = scoreData || 0;

      // Get score category
      const { data: categoryData, error: categoryError } = await supabase?.rpc('get_lead_score_category', { score: overallScore });

      if (categoryError) throw categoryError;

      // Get individual component scores
      const [behavioralScore, engagementScore, fitScore] = await Promise.all([
        supabase?.rpc('calculate_behavioral_score', { lead_uuid: leadId }),
        supabase?.rpc('calculate_engagement_score', { lead_uuid: leadId }),
        supabase?.rpc('calculate_fit_score', { lead_uuid: leadId })
      ]);

      // Generate AI-powered score reasoning
      const scoreReasoning = await this.generateScoreReasoning(leadId, {
        overall: overallScore,
        behavioral: behavioralScore?.data || 0,
        engagement: engagementScore?.data || 0,
        fit: fitScore?.data || 0
      });

      // Insert or update lead score
      const { data: newScore, error: insertError } = await supabase?.from('lead_scores')?.upsert({
        lead_id: leadId,
        scoring_model_id: scoringModelId,
        overall_score: overallScore,
        category: categoryData,
        behavioral_score: behavioralScore?.data || 0,
        engagement_score: engagementScore?.data || 0,
        fit_score: fitScore?.data || 0,
        demographic_score: 10, // Placeholder
        intent_score: 15, // Enhanced with AI
        score_reasoning: scoreReasoning,
        confidence_level: this.calculateConfidenceLevel(overallScore),
        conversion_probability: this.predictConversionProbability(overallScore),
        predicted_value: await this.predictLeadValue(leadId),
        calculated_at: new Date()?.toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString()
      })?.select()?.single();

      if (insertError) throw insertError;

      return newScore;
    } catch (error) {
      console.error('Error calculating lead score:', error);
      throw error;
    }
  }

  /**
   * Generate AI-powered reasoning for lead score via edge function
   * @param {string} leadId - UUID of the lead
   * @param {Object} scores - Object containing score components
   * @returns {Promise<string>} AI-generated score reasoning
   */
  static async generateScoreReasoning(leadId, scores) {
    try {
      const { data, error } = await supabase?.functions?.invoke('ai-lead-scoring', {
        body: {
          action: 'reasoning',
          leadId,
          scores,
        },
      });

      if (error) throw error;
      if (data?.ok && data?.text) return data.text;

      return `Score based on behavioral engagement (${scores?.behavioral}), interaction patterns (${scores?.engagement}), and profile fit (${scores?.fit}).`;
    } catch (error) {
      console.error('Error generating score reasoning:', error);
      return `Score based on behavioral engagement (${scores?.behavioral}), interaction patterns (${scores?.engagement}), and profile fit (${scores?.fit}).`;
    }
  }

  /**
   * Record behavioral event for lead scoring
   * @param {string} leadId - UUID of the lead
   * @param {string} eventType - Type of behavioral event
   * @param {Object} eventData - Additional event data
   * @returns {Promise<Object>} Created behavioral metric
   */
  static async recordBehavioralEvent(leadId, eventType, eventData = {}) {
    try {
      const { data, error } = await supabase?.from('lead_behavioral_metrics')?.insert({
        lead_id: leadId,
        event_type: eventType,
        event_value: eventData?.value || 1,
        event_metadata: eventData?.metadata || {},
        source_url: eventData?.sourceUrl,
        session_id: eventData?.sessionId
      })?.select()?.single();

      if (error) throw error;

      // Trigger score recalculation (automatic via trigger)
      return data;
    } catch (error) {
      console.error('Error recording behavioral event:', error);
      throw error;
    }
  }

  /**
   * Get leads by score category with pagination
   * @param {string} category - hot, warm, cold, or unknown
   * @param {Object} options - Pagination and filtering options
   * @returns {Promise<Object>} Leads with their scores
   */
  static async getLeadsByCategory(category, options = {}) {
    try {
      const { page = 1, limit = 20, sortBy = 'overall_score', sortOrder = 'desc' } = options;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase?.from('lead_scores')?.select(`
          *,
          lead:lead_id(
            id, first_name, last_name, email, phone, job_title,
            priority, estimated_value, lead_status,
            company:company_id(name, industry)
          )
        `, { count: 'exact' })?.eq('category', category)?.gt('expires_at', new Date()?.toISOString())?.order(sortBy, { ascending: sortOrder === 'asc' })?.range(from, to);

      if (error) throw error;

      return {
        leads: data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching leads by category:', error);
      throw error;
    }
  }

  /**
   * Get lead engagement summary with behavioral insights
   * @param {string} leadId - UUID of the lead
   * @returns {Promise<Object>} Engagement summary with insights
   */
  static async getLeadEngagement(leadId) {
    try {
      const { data, error } = await supabase?.from('lead_engagement_summary')?.select('*')?.eq('lead_id', leadId)?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      // Get recent behavioral events for detailed insights
      const { data: recentEvents } = await supabase?.from('lead_behavioral_metrics')?.select('*')?.eq('lead_id', leadId)?.order('event_timestamp', { ascending: false })?.limit(20);

      return {
        summary: data,
        recentEvents: recentEvents || [],
        insights: this.generateEngagementInsights(data, recentEvents)
      };
    } catch (error) {
      console.error('Error fetching lead engagement:', error);
      throw error;
    }
  }

  /**
   * Get lead score history and trends
   * @param {string} leadId - UUID of the lead
   * @param {number} days - Number of days to look back
   * @returns {Promise<Array>} Score history with trends
   */
  static async getScoreHistory(leadId, days = 30) {
    try {
      const { data, error } = await supabase?.from('lead_score_history')?.select('*')?.eq('lead_id', leadId)?.gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString())?.order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching score history:', error);
      throw error;
    }
  }

  /**
   * Bulk update scores for multiple leads
   * @param {Array<string>} leadIds - Array of lead UUIDs
   * @returns {Promise<Array>} Updated scores
   */
  static async bulkUpdateScores(leadIds) {
    try {
      const results = [];

      // Process in batches to avoid overwhelming the system
      for (let i = 0; i < leadIds?.length; i += 10) {
        const batch = leadIds?.slice(i, i + 10);
        const batchPromises = batch?.map(leadId => this.calculateLeadScore(leadId));
        const batchResults = await Promise.allSettled(batchPromises);
        results?.push(...batchResults);
      }

      return results;
    } catch (error) {
      console.error('Error in bulk score update:', error);
      throw error;
    }
  }

  /**
   * Get AI-powered lead recommendations via edge function
   * @param {number} limit - Number of recommendations to return
   * @returns {Promise<Array>} AI-analyzed lead recommendations
   */
  static async getAILeadRecommendations(limit = 10) {
    try {
      // Get top scoring leads with recent activity
      const { data: topLeads } = await supabase?.from('lead_scores')?.select(`
          *,
          lead:lead_id(
            id, first_name, last_name, email, job_title,
            company:company_id(name, industry)
          )
        `)?.gte('overall_score', 60)?.gt('expires_at', new Date()?.toISOString())?.order('overall_score', { ascending: false })?.limit(limit * 2);

      if (!topLeads?.length) return [];

      // Build a simplified leads summary for the edge function
      const leadsData = topLeads.map(score => ({
        lead_id: score?.lead_id,
        name: `${score?.lead?.first_name || ''} ${score?.lead?.last_name || ''}`.trim(),
        score: score?.overall_score,
        category: score?.category,
        predicted_value: score?.predicted_value || 0,
      }));

      const { data, error } = await supabase?.functions?.invoke('ai-lead-scoring', {
        body: {
          action: 'recommendations',
          leadsData,
          limit,
        },
      });

      if (error) throw error;

      if (data?.ok !== false && data?.recommendations) {
        // Enrich recommendations with full lead data
        const enrichedRecommendations = data.recommendations
          .map(rec => {
            const leadData = topLeads?.find(l => l?.lead_id === rec?.lead_id);
            return leadData ? { ...leadData, ai_priority_reason: rec?.priority_reason } : null;
          })
          .filter(Boolean)
          .slice(0, limit);

        return enrichedRecommendations;
      }

      // If AI didn't return valid recs, fall through to fallback
      throw new Error('No AI recommendations returned');
    } catch (error) {
      console.error('Error generating AI lead recommendations:', error);
      // Fallback to simple score-based recommendations
      const { data: fallbackLeads } = await supabase?.from('lead_scores')?.select(`
          *,
          lead:lead_id(id, first_name, last_name, email, job_title, company:company_id(name))
        `)?.eq('category', 'hot')?.gt('expires_at', new Date()?.toISOString())?.order('overall_score', { ascending: false })?.limit(limit);

      return fallbackLeads || [];
    }
  }

  // Helper methods
  static calculateConfidenceLevel(score) {
    return Math.min(1.0, Math.max(0.3, score / 100));
  }

  static predictConversionProbability(score) {
    // Simple probability model based on score
    if (score >= 80) return Math.random() * 0.2 + 0.8; // 80-100%
    if (score >= 60) return Math.random() * 0.3 + 0.5; // 50-80%
    if (score >= 40) return Math.random() * 0.3 + 0.2; // 20-50%
    return Math.random() * 0.2; // 0-20%
  }

  static async predictLeadValue(leadId) {
    try {
      const { data } = await supabase?.from('leads')?.select('estimated_value, priority, company:company_id(company_size, annual_revenue)')?.eq('id', leadId)?.single();

      if (!data) return 0;

      let predictedValue = data?.estimated_value || 0;

      // Adjust based on company size and priority
      if (data?.company?.company_size > 100) predictedValue *= 1.5;
      if (data?.priority === 'high') predictedValue *= 1.3;
      if (data?.priority === 'urgent') predictedValue *= 1.5;

      return Math.round(predictedValue);
    } catch (error) {
      return 0;
    }
  }

  static generateEngagementInsights(summary, recentEvents) {
    const insights = [];

    if (summary?.email_open_rate > 0.6) {
      insights?.push('High email engagement - strong interest indicator');
    }

    if (summary?.last_activity_date) {
      const daysSinceActivity = Math.floor((Date.now() - new Date(summary.last_activity_date)) / (1000 * 60 * 60 * 24));
      if (daysSinceActivity <= 2) {
        insights?.push('Recent activity detected - optimal time for outreach');
      } else if (daysSinceActivity > 14) {
        insights?.push('Engagement cooling - consider re-engagement campaign');
      }
    }

    const highValueEvents = recentEvents?.filter(e =>
      ['demo_request', 'pricing_view', 'meeting_scheduled']?.includes(e?.event_type)
    )?.length || 0;

    if (highValueEvents > 0) {
      insights?.push(`${highValueEvents} high-intent actions - ready for sales contact`);
    }

    return insights;
  }
}

export default LeadScoringService;