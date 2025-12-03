import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StripeProvider } from '../../contexts/StripeContext';
import StripePaymentForm from './StripePaymentForm';
import { paymentService } from '../../services/paymentService';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const PricingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [planData, setPlanData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: ''
  });

  useEffect(() => {
    // Get plan selection from navigation state or URL params
    const planId = location?.state?.selectedPlan || new URLSearchParams(location?.search)?.get('plan');
    const tier = location?.state?.databaseTier || new URLSearchParams(location?.search)?.get('tier') || 'growth';
    
    if (planId) {
      const pricing = paymentService?.calculatePricing(planId, tier, 'monthly');
      setPlanData({
        planId,
        databaseTier: tier,
        billingCycle: 'monthly',
        pricing,
        customerInfo: {}
      });
    }
  }, [location]);

  const handleCreatePaymentIntent = async () => {
    if (!planData || !customerInfo?.email) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const paymentData = {
        ...planData,
        customerInfo
      };

      const result = await paymentService?.createPaymentIntent(paymentData);
      setClientSecret(result?.clientSecret);
    } catch (err) {
      setError(err?.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (result) => {
    // Navigate to success page with result data
    navigate('/payment-success', { 
      state: { 
        paymentResult: result,
        planData 
      } 
    });
  };

  const handlePaymentError = (error) => {
    setError(error?.message || 'Payment failed. Please try again.');
  };

  const formatPricingDisplay = (pricing) => {
    if (!pricing) return 'Contact Us';
    
    if (planData?.planId === 'done-for-you') {
      return '50% Revenue Share';
    }
    
    if (planData?.planId === 'setup-plus-percentage') {
      return `${paymentService?.formatAmount(pricing?.setup * 100)} setup + ${(pricing?.percentage * 100)}% of sales`;
    }
    
    if (planData?.planId === 'white-label') {
      const setupText = pricing?.setup > 0 ? ` + ${paymentService?.formatAmount(pricing?.setup * 100)} setup` : '';
      const recurringText = pricing?.recurring > 0 ? `${paymentService?.formatAmount(pricing?.recurring * 100)}/month` : '';
      return recurringText + setupText;
    }
    
    return 'Contact Us';
  };

  if (!planData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-muted-foreground mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Plan Selected</h2>
          <p className="text-muted-foreground mb-4">Please select a pricing plan to continue.</p>
          <Button onClick={() => navigate('/')}>
            Choose Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <StripeProvider>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Order</h1>
            <p className="text-muted-foreground">You're one step away from supercharging your CRM</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium capitalize">{planData?.planId?.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database Tier</span>
                    <span className="font-medium capitalize">{planData?.databaseTier}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Cycle</span>
                    <span className="font-medium capitalize">{planData?.billingCycle}</span>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPricingDisplay(planData?.pricing)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Customer Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo?.firstName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e?.target?.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo?.lastName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e?.target?.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo?.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e?.target?.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo?.company}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, company: e?.target?.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                </div>
              )}

              {!clientSecret ? (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Ready to Proceed?</h3>
                  <p className="text-muted-foreground mb-6">
                    Click below to initialize secure payment processing.
                  </p>
                  <Button
                    onClick={handleCreatePaymentIntent}
                    disabled={loading || !customerInfo?.email || !customerInfo?.firstName}
                    className="w-full"
                    size="lg"
                    iconName={loading ? "Loader2" : "CreditCard"}
                    iconClassName={loading ? "animate-spin" : ""}
                    iconPosition="left"
                  >
                    {loading ? 'Initializing...' : 'Proceed to Payment'}
                  </Button>
                </div>
              ) : (
                <StripePaymentForm
                  clientSecret={clientSecret}
                  amount={planData?.pricing?.setup * 100 || 0}
                  planData={planData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  confirmButtonText="Complete Purchase"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </StripeProvider>
  );
};

export default PricingCheckout;