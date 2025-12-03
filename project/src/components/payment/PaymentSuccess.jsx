import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { paymentResult, planData } = location?.state || {};

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-muted-foreground mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Information Missing</h2>
          <p className="text-muted-foreground mb-4">We couldn't find your payment details.</p>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const getPlanDisplayName = (planId) => {
    const names = {
      'done-for-you': 'Done-For-You Partnership',
      'setup-plus-percentage': 'Setup + Performance Plan',
      'white-label': 'White-Label License'
    };
    return names?.[planId] || planId;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-success/20 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={40} className="text-success-foreground" />
              </div>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-success/30 rounded-full animate-ping opacity-30"></div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for choosing {getPlanDisplayName(planData?.planId)}
          </p>

          {/* Order Details */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-foreground mb-4">Order Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{getPlanDisplayName(planData?.planId)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database Tier</span>
                <span className="font-medium capitalize">{planData?.databaseTier}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-medium font-mono text-sm">
                  {paymentResult?.paymentIntent?.id?.substring(0, 20)}...
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-success">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Warning if applicable */}
          {paymentResult?.warning && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={20} className="text-orange-600 flex-shrink-0" />
                <p className="text-orange-800 text-sm">{paymentResult?.warning}</p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-primary/10 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">What's Next?</h3>
            <div className="text-left space-y-2 text-muted-foreground">
              {planData?.planId === 'done-for-you' && (
                <>
                  <p>✓ Our team will contact you within 24 hours</p>
                  <p>✓ Database analysis will begin immediately</p>
                  <p>✓ Campaign setup starts within 48 hours</p>
                </>
              )}
              {planData?.planId === 'setup-plus-percentage' && (
                <>
                  <p>✓ Setup process will begin within 24 hours</p>
                  <p>✓ Training sessions will be scheduled</p>
                  <p>✓ Platform access credentials will be sent</p>
                </>
              )}
              {planData?.planId === 'white-label' && (
                <>
                  <p>✓ White-label platform will be provisioned</p>
                  <p>✓ Branding customization will begin</p>
                  <p>✓ Partner training will be scheduled</p>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/main-dashboard')}
              size="lg"
              iconName="BarChart3"
              iconPosition="left"
            >
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              size="lg"
              iconName="Home"
              iconPosition="left"
            >
              Return Home
            </Button>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm mb-4">
              Need help? Our support team is here for you.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" size="sm" iconName="Mail" iconPosition="left">
                Email Support
              </Button>
              <Button variant="ghost" size="sm" iconName="Phone" iconPosition="left">
                Call Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;