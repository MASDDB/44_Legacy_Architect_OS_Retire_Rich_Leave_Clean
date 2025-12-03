import { supabase } from '../lib/supabase';

export const paymentService = {
  /**
   * Creates a payment intent for the selected pricing plan
   */
  async createPaymentIntent(planData) {
    const { data, error } = await supabase?.functions?.invoke('create-stripe-payment', {
      body: {
        planId: planData?.planId,
        databaseTier: planData?.databaseTier,
        billingCycle: planData?.billingCycle,
        customerInfo: planData?.customerInfo,
        metadata: {
          plan_type: planData?.planId,
          database_tier: planData?.databaseTier,
          billing_cycle: planData?.billingCycle
        }
      }
    });

    if (error) {
      throw new Error(error?.message || 'Failed to create payment intent');
    }

    return data;
  },

  /**
   * Confirms payment and creates subscription/order record
   */
  async confirmPayment(paymentIntentId) {
    const { data, error } = await supabase?.functions?.invoke('confirm-stripe-payment', {
      body: { paymentIntentId }
    });

    if (error) {
      throw new Error(error?.message || 'Failed to confirm payment');
    }

    return data;
  },

  /**
   * Calculates pricing based on plan and database tier
   */
  calculatePricing(planId, databaseTier, billingCycle = 'monthly') {
    const pricingMatrix = {
      'done-for-you': {
        starter: { setup: 0, monthly: 0, revenueShare: 0.5 },
        growth: { setup: 0, monthly: 0, revenueShare: 0.5 },
        scale: { setup: 0, monthly: 0, revenueShare: 0.5 },
        enterprise: { setup: 0, monthly: 0, revenueShare: 0.5 }
      },
      'setup-plus-percentage': {
        starter: { setup: 2997, monthly: 0, percentage: 0.15 },
        growth: { setup: 4997, monthly: 0, percentage: 0.12 },
        scale: { setup: 9997, monthly: 0, percentage: 0.10 },
        enterprise: { setup: 19997, monthly: 0, percentage: 0.08 }
      },
      'white-label': {
        starter: { setup: 2997, monthly: 1997 },
        growth: { setup: 4997, monthly: 3997 },
        scale: { setup: 9997, monthly: 7997 },
        enterprise: { setup: 19997, monthly: 14997 }
      }
    };

    const planPricing = pricingMatrix?.[planId]?.[databaseTier];
    if (!planPricing) return null;

    const result = {
      setup: planPricing?.setup || 0,
      recurring: planPricing?.monthly || 0,
      revenueShare: planPricing?.revenueShare || 0,
      percentage: planPricing?.percentage || 0,
      billingCycle
    };

    // Apply annual discount for white-label
    if (billingCycle === 'annual' && planId === 'white-label') {
      result.recurring = Math.round(result?.recurring * 10 * 0.85); // 15% annual discount
      result.setup = Math.round(result?.setup * 0.75); // 25% setup discount for annual
    }

    return result;
  },

  /**
   * Formats amount as currency
   */
  formatAmount(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    })?.format(amount / 100);
  },

  /**
   * Get database tier limits
   */
  getDatabaseTierLimits(tier) {
    const limits = {
      starter: { contacts: 5000, campaigns: 10, users: 3 },
      growth: { contacts: 25000, campaigns: 50, users: 10 },
      scale: { contacts: 100000, campaigns: 200, users: 25 },
      enterprise: { contacts: 'Unlimited', campaigns: 'Unlimited', users: 'Unlimited' }
    };

    return limits?.[tier] || limits?.starter;
  }
};