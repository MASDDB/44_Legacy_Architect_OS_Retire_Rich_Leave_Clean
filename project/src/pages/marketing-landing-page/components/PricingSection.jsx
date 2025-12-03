import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedTier, setSelectedTier] = useState('growth');

  const pricingPlans = [
    {
      id: 'done-for-you',
      name: 'Guided AI Partnership',
      description: 'We handle setup & optimization - 50% revenue share',
      popular: false,
      databaseTiers: {
        starter: { contacts: 5000, price: 0, revenueShare: 0.5 },
        growth: { contacts: 25000, price: 0, revenueShare: 0.5 },
        scale: { contacts: 100000, price: 0, revenueShare: 0.5 },
        enterprise: { contacts: 'Unlimited', price: 0, revenueShare: 0.5 }
      },
      features: [
        'Complete database analysis & segmentation',
        'Custom AI campaign creation',
        'Multi-channel outreach (Voice, SMS, Email)',
        'Dedicated campaign manager',
        'Real-time performance monitoring',
        'Compliance management included',
        'Calendar integration setup',
        'Monthly strategy calls',
        '50% of generated revenue shared',
        'Guaranteed results or money back'
      ],
      limitations: [
        'Revenue sharing model applies to all earnings',
        'Minimum 6-month commitment required'
      ],
      cta: 'Start Partnership',
      badge: null,
      pricing: {
        monthly: { price: 0, setup: 0, description: '50% Revenue Share' },
        annual: { price: 0, setup: 0, description: '50% Revenue Share' }
      }
    },
    {
      id: 'setup-plus-percentage',
      name: 'Legacy Architect OS Pro',
      description: 'Full platform access + performance pricing',
      popular: true,
      databaseTiers: {
        starter: { contacts: 5000, setup: 2997, percentage: 0.15 },
        growth: { contacts: 25000, setup: 4997, percentage: 0.12 },
        scale: { contacts: 100000, setup: 9997, percentage: 0.10 },
        enterprise: { contacts: 'Unlimited', setup: 19997, percentage: 0.08 }
      },
      features: [
        'Platform setup & configuration',
        'Database import & segmentation',
        'Campaign template library',
        'Training & onboarding sessions',
        'Email & chat support',
        'Performance-based pricing model',
        'Calendar integration',
        'Performance analytics dashboard',
        'Scales with your database size',
        '30-day money-back guarantee'
      ],
      limitations: [
        'Setup fee varies by database size',
        'Performance percentage applies to all sales',
        'Self-managed campaigns after setup'
      ],
      cta: 'Calculate My Price',
      badge: 'Most Popular',
      pricing: {
        monthly: { price: 0, setup: 2997, description: 'Setup + 15% of Sales' },
        annual: { price: 0, setup: 2997, description: 'Setup + 15% of Sales' }
      }
    },
    {
      id: 'white-label',
      name: 'Agency/Multi-Location License',
      description: 'Resell or run multiple locations',
      popular: false,
      databaseTiers: {
        starter: { contacts: 10000, price: 1997, setup: 2997 },
        growth: { contacts: 50000, price: 3997, setup: 4997 },
        scale: { contacts: 200000, price: 7997, setup: 9997 },
        enterprise: { contacts: 'Unlimited', price: 14997, setup: 19997 }
      },
      features: [
        'Full white-label platform access',
        'Custom branding & domain',
        'Reseller dashboard & tools',
        'Client management system',
        'Automated royalty tracking',
        'Marketing materials included',
        'Dedicated partner support',
        'Training & certification program',
        'Revenue sharing opportunities',
        'Scales with client database sizes'
      ],
      limitations: [
        'Minimum 6-month commitment',
        'Revenue sharing applies',
        'Pricing scales with database capacity'
      ],
      cta: 'Apply Now',
      badge: 'Partner Program',
      pricing: {
        monthly: { price: 1997, setup: 2997 },
        annual: { price: 19970, setup: 1497, savings: 4467 }
      }
    }
  ];

  const handlePlanSelection = (planId) => {
    navigate('/user-authentication', { state: { selectedPlan: planId } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const formatDatabaseTierPrice = (plan, tier) => {
    if (plan?.id === 'done-for-you') {
      return '50% Revenue Share';
    }
    
    if (plan?.id === 'setup-plus-percentage') {
      const tierData = plan?.databaseTiers?.[tier];
      if (!tierData) return 'Contact Us';
      return `${formatPrice(tierData?.setup)} setup + ${(tierData?.percentage * 100)}% of sales`;
    }

    if (plan?.id === 'white-label') {
      const tierData = plan?.databaseTiers?.[tier];
      if (!tierData) return 'Contact Us';
      return billingCycle === 'monthly' 
        ? `${formatPrice(tierData?.price)}/mo + ${formatPrice(tierData?.setup)} setup`
        : `${formatPrice(tierData?.price * 10)}/yr + ${formatPrice(tierData?.setup / 2)} setup`;
    }

    return 'Contact Us';
  };

  const getDatabaseTierDescription = (contacts) => {
    if (typeof contacts === 'string') return contacts;
    return `Up to ${contacts?.toLocaleString()} contacts`;
  };

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="CreditCard" size={16} />
            <span>Pricing Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Path to Exit-Ready
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Whether you want guided AI partnership, full platform access, or a white-label license to help other service businesses, we have a path that scales with your mission goals.
          </p>

          {/* Database Size Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['starter', 'growth', 'scale', 'enterprise']?.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTier === tier
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {tier?.charAt(0)?.toUpperCase() + tier?.slice(1)}
                {tier !== 'enterprise' && (
                  <span className="block text-xs opacity-75">
                    {getDatabaseTierDescription(pricingPlans?.[0]?.databaseTiers?.[tier]?.contacts)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {pricingPlans?.map((plan) => (
            <div
              key={plan?.id}
              className={`relative bg-card border rounded-2xl p-8 ${
                plan?.popular
                  ? 'border-primary shadow-elevated scale-105'
                  : 'border-border hover:shadow-elevated'
              } transition-all duration-300`}
            >
              {/* Badge */}
              {plan?.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    {plan?.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan?.name}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {plan?.description}
                </p>

                {/* Pricing Display for Selected Tier */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {formatDatabaseTierPrice(plan, selectedTier)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    For {getDatabaseTierDescription(plan?.databaseTiers?.[selectedTier]?.contacts)}
                  </div>
                  
                  {billingCycle === 'annual' && plan?.pricing?.annual?.savings && (
                    <div className="text-sm text-success font-medium mt-2">
                      Save {formatPrice(plan?.pricing?.annual?.savings)} annually
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan?.popular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handlePlanSelection(plan?.id)}
                  className="w-full mb-6"
                >
                  {plan?.cta}
                </Button>
              </div>

              {/* Database Tier Breakdown */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-foreground text-sm">Database Size Options:</h4>
                {Object?.entries(plan?.databaseTiers || {})?.map(([tier, data]) => (
                  <div key={tier} className={`p-2 rounded border text-xs ${
                    selectedTier === tier ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{tier}</span>
                      <span className="text-muted-foreground">
                        {getDatabaseTierDescription(data?.contacts)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">What's included:</h4>
                <ul className="space-y-3">
                  {plan?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan?.limitations?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Important Notes:</h4>
                    <ul className="space-y-2">
                      {plan?.limitations?.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Icon name="Info" size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Not Sure Which Path Fits Your Exit Timeline?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Schedule a free consultation to discuss your business size, exit goals, and get personalized recommendations for the best mission-based pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" iconName="Calculator" iconPosition="left">
                Calculate My Pricing
              </Button>
              <Button variant="ghost" size="lg" iconName="MessageCircle" iconPosition="left">
                Chat with Sales
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span>Performance-based pricing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={16} className="text-success" />
              <span>Scales with your database</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;