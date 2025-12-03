import { supabase } from '../lib/supabase';
import openai from '../lib/openai';

class AIPersonalizationService {
  /**
   * Personalizes a message using AI based on lead data and personalization rules
   * @param {Object} params - Personalization parameters
   * @returns {Promise<Object>} Personalized message result
   */
  async personalizeMessage({
    leadId,
    campaignId,
    messageType,
    originalTemplate,
    personalizationRules = [],
    aiModel = 'gpt-5'
  }) {
    try {
      const startTime = Date.now();

      // Get lead personalization data
      const { data: leadData } = await supabase?.rpc('get_lead_personalization_data', { lead_uuid: leadId });

      if (!leadData) {
        throw new Error('Lead data not found');
      }

      // Apply personalization rules to get the best matching rule
      const selectedRule = await this._selectBestRule(personalizationRules, leadData);
      
      if (!selectedRule) {
        return {
          personalizedContent: originalTemplate,
          confidence: 0.5,
          ruleUsed: null,
          processingTime: Date.now() - startTime
        };
      }

      // Generate personalized content using AI
      const personalizedContent = await this._generatePersonalizedContent(
        originalTemplate,
        selectedRule,
        leadData,
        aiModel
      );

      const processingTime = Date.now() - startTime;

      // Calculate confidence score based on data quality and rule match
      const confidence = this._calculateConfidenceScore(leadData, selectedRule);

      // Save personalization history
      const { data: historyRecord } = await supabase?.from('ai_message_personalizations')?.insert({
          lead_id: leadId,
          campaign_id: campaignId,
          message_type: messageType,
          original_template: originalTemplate,
          personalized_content: personalizedContent,
          personalization_rules_used: [{
            rule_id: selectedRule?.id,
            rule_name: selectedRule?.name
          }],
          ai_model_used: aiModel,
          processing_time_ms: processingTime,
          lead_data_used: leadData?.lead_info,
          behavioral_data_used: leadData?.behavioral_metrics || {},
          confidence_score: confidence,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        })?.select()?.single();

      return {
        personalizedContent,
        confidence,
        ruleUsed: selectedRule,
        processingTime,
        historyId: historyRecord?.id
      };

    } catch (error) {
      console.error('AI personalization error:', error);
      return {
        personalizedContent: originalTemplate,
        confidence: 0.3,
        error: error?.message,
        processingTime: Date.now() - Date.now()
      };
    }
  }

  /**
   * Creates or updates AI personalization rules
   * @param {Object} ruleData - Rule configuration
   * @returns {Promise<Object>} Created rule
   */
  async createPersonalizationRule(ruleData) {
    try {
      const { data, error } = await supabase?.from('ai_personalization_rules')?.insert({
          name: ruleData?.name,
          description: ruleData?.description,
          personalization_type: ruleData?.personalizationType,
          ai_model: ruleData?.aiModel || 'gpt-5',
          conditions: ruleData?.conditions || {},
          template_variables: ruleData?.templateVariables || {},
          prompt_template: ruleData?.promptTemplate,
          is_active: ruleData?.isActive !== false,
          priority: ruleData?.priority || 1,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating personalization rule:', error);
      throw error;
    }
  }

  /**
   * Gets all personalization rules for current user
   * @returns {Promise<Array>} List of personalization rules
   */
  async getPersonalizationRules() {
    try {
      const { data, error } = await supabase?.from('ai_personalization_rules')?.select('*')?.order('priority', { ascending: false })?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching personalization rules:', error);
      throw error;
    }
  }

  /**
   * Gets personalization analytics for a specific rule
   * @param {string} ruleId - Rule ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Analytics data
   */
  async getPersonalizationAnalytics(ruleId, startDate, endDate) {
    try {
      const { data, error } = await supabase?.rpc('calculate_personalization_performance', {
          rule_uuid: ruleId,
          start_date: startDate,
          end_date: endDate
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching personalization analytics:', error);
      throw error;
    }
  }

  /**
   * Gets or creates AI personalization settings for current user
   * @returns {Promise<Object>} User settings
   */
  async getPersonalizationSettings() {
    try {
      const user = (await supabase?.auth?.getUser())?.data?.user;
      if (!user) throw new Error('User not authenticated');

      let { data, error } = await supabase?.from('ai_personalization_settings')?.select('*')?.eq('user_id', user?.id)?.single();

      // Create default settings if none exist
      if (error && error?.code === 'PGRST116') {
        const { data: newSettings, error: createError } = await supabase?.from('ai_personalization_settings')?.insert({
            user_id: user?.id,
            default_ai_model: 'gpt-5',
            enable_behavioral_personalization: true,
            enable_demographic_personalization: true,
            enable_engagement_personalization: true,
            enable_timing_optimization: true,
            max_processing_time_ms: 5000,
            fallback_to_original: true,
            api_settings: {
              max_tokens: 500,
              reasoning_effort: 'medium',
              verbosity: 'medium'
            }
          })?.select()?.single();

        if (createError) throw createError;
        data = newSettings;
      } else if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting personalization settings:', error);
      throw error;
    }
  }

  /**
   * Updates AI personalization settings
   * @param {Object} settings - Settings to update
   * @returns {Promise<Object>} Updated settings
   */
  async updatePersonalizationSettings(settings) {
    try {
      const user = (await supabase?.auth?.getUser())?.data?.user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase?.from('ai_personalization_settings')?.upsert({
          user_id: user?.id,
          ...settings,
          updated_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating personalization settings:', error);
      throw error;
    }
  }

  /**
   * Gets personalization history for a lead or campaign
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Personalization history
   */
  async getPersonalizationHistory(filters = {}) {
    try {
      let query = supabase?.from('ai_message_personalizations')?.select(`
          *,
          leads:lead_id(first_name, last_name, email, job_title),
          campaigns:campaign_id(name, campaign_type)
        `)?.order('created_at', { ascending: false });

      if (filters?.leadId) {
        query = query?.eq('lead_id', filters?.leadId);
      }
      
      if (filters?.campaignId) {
        query = query?.eq('campaign_id', filters?.campaignId);
      }

      if (filters?.messageType) {
        query = query?.eq('message_type', filters?.messageType);
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching personalization history:', error);
      throw error;
    }
  }

  // Private helper methods

  /**
   * Selects the best personalization rule based on lead data and conditions
   * @private
   */
  async _selectBestRule(rules, leadData) {
    if (!rules || rules?.length === 0) {
      return null;
    }

    // Sort rules by priority and evaluate conditions
    const sortedRules = rules?.sort((a, b) => (b?.priority || 1) - (a?.priority || 1));
    
    for (const rule of sortedRules) {
      if (this._evaluateRuleConditions(rule, leadData)) {
        return rule;
      }
    }

    // Return first rule as fallback
    return sortedRules?.[0] || null;
  }

  /**
   * Evaluates if a rule's conditions match the lead data
   * @private
   */
  _evaluateRuleConditions(rule, leadData) {
    const conditions = rule?.conditions || {};
    const leadInfo = leadData?.lead_info || {};
    const engagement = leadData?.engagement_summary || {};

    try {
      // Check engagement conditions
      if (conditions?.min_email_open_rate && 
          (!engagement?.email_open_rate || engagement?.email_open_rate < conditions?.min_email_open_rate)) {
        return false;
      }

      if (conditions?.min_website_visits && 
          (!engagement?.website_visits || engagement?.website_visits < conditions?.min_website_visits)) {
        return false;
      }

      // Check job title conditions
      if (conditions?.job_titles && conditions?.job_titles?.length > 0) {
        if (!leadInfo?.job_title || !conditions?.job_titles?.includes(leadInfo?.job_title)) {
          return false;
        }
      }

      // Check lead status conditions
      if (conditions?.lead_statuses && conditions?.lead_statuses?.length > 0) {
        if (!leadInfo?.lead_status || !conditions?.lead_statuses?.includes(leadInfo?.lead_status)) {
          return false;
        }
      }

      // Check priority conditions
      if (conditions?.min_priority && leadInfo?.priority) {
        const priorityValues = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
        const leadPriorityValue = priorityValues?.[leadInfo?.priority] || 1;
        const minPriorityValue = priorityValues?.[conditions?.min_priority] || 1;
        
        if (leadPriorityValue < minPriorityValue) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.warn('Error evaluating rule conditions:', error);
      return false;
    }
  }

  /**
   * Generates personalized content using OpenAI
   * @private
   */
  async _generatePersonalizedContent(originalTemplate, rule, leadData, aiModel) {
    try {
      let prompt = this._buildPersonalizationPrompt(originalTemplate, rule, leadData);

      const response = await openai?.chat?.completions?.create({
        model: aiModel,
        messages: [
          {
            role: 'system',
            content: 'You are an expert marketing copywriter specializing in personalized messaging. Create compelling, personalized messages that feel natural and relevant to the recipient. Keep the tone professional yet engaging.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        reasoning_effort: rule?.template_variables?.reasoning_effort || 'medium',
        verbosity: rule?.template_variables?.verbosity || 'medium',
        max_completion_tokens: 500
      });

      return response?.choices?.[0]?.message?.content?.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to basic template replacement
      return this._basicTemplateReplacement(originalTemplate, leadData);
    }
  }

  /**
   * Builds the AI prompt for personalization
   * @private
   */
  _buildPersonalizationPrompt(originalTemplate, rule, leadData) {
    const leadInfo = leadData?.lead_info || {};
    const engagement = leadData?.engagement_summary || {};
    const behavioral = leadData?.behavioral_metrics || [];

    let prompt = rule?.prompt_template;

    // Replace template variables with actual data
    const replacements = {
      first_name: leadInfo?.first_name || 'there',
      last_name: leadInfo?.last_name || '',
      job_title: leadInfo?.job_title || 'professional',
      company: leadInfo?.company || 'your company',
      lead_status: leadInfo?.lead_status || 'new',
      email_open_rate: engagement?.email_open_rate || 0,
      engagement_trend: engagement?.engagement_trend || 'stable',
      website_visits: engagement?.website_visits || 0,
      recent_activities: behavioral?.slice(0, 3)?.map(b => b?.event_type)?.join(', ') || 'website browsing',
      ...rule?.template_variables
    };

    Object.keys(replacements)?.forEach(key => {
      const value = replacements?.[key];
      prompt = prompt?.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    prompt += `\n\nOriginal template: "${originalTemplate}"\n\nGenerate a personalized version that incorporates the lead's information naturally while maintaining the core message intent.`;

    return prompt;
  }

  /**
   * Fallback method for basic template replacement
   * @private
   */
  _basicTemplateReplacement(template, leadData) {
    const leadInfo = leadData?.lead_info || {};
    
    let result = template;
    result = result?.replace(/{{first_name}}/g, leadInfo?.first_name || 'there');
    result = result?.replace(/{{last_name}}/g, leadInfo?.last_name || '');
    result = result?.replace(/{{job_title}}/g, leadInfo?.job_title || 'professional');
    result = result?.replace(/{{company}}/g, leadInfo?.company || 'your company');

    return result;
  }

  /**
   * Calculates confidence score based on data quality and rule match
   * @private
   */
  _calculateConfidenceScore(leadData, rule) {
    let score = 0.5; // Base score

    const leadInfo = leadData?.lead_info || {};
    const engagement = leadData?.engagement_summary || {};
    const behavioral = leadData?.behavioral_metrics || [];

    // Data quality factors
    if (leadInfo?.first_name) score += 0.1;
    if (leadInfo?.job_title) score += 0.1;
    if (leadInfo?.company) score += 0.1;
    if (engagement?.email_open_rate > 0) score += 0.1;
    if (behavioral?.length > 0) score += 0.1;

    // Rule specificity
    const conditions = rule?.conditions || {};
    const conditionCount = Object.keys(conditions)?.length;
    score += Math.min(conditionCount * 0.05, 0.1);

    return Math.min(Math.max(score, 0), 1);
  }
}

export const aiPersonalizationService = new AIPersonalizationService();