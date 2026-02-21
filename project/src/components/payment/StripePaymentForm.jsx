import React, { useState, useEffect } from 'react';
import { 
  useStripe, 
  useElements, 
  PaymentElement,
  Elements 
} from '@stripe/react-stripe-js';
import { useStripeContext } from '../../contexts/StripeContext';
import { paymentService } from '../../services/paymentService';
import Button from '../ui/Button';
import Icon from '../AppIcon';

// Inner form component that uses Stripe hooks
const StripePaymentFormInner = ({
  clientSecret,
  amount,
  currency = 'USD',
  planData,
  onSuccess,
  onError,
  confirmButtonText = 'Complete Payment',
  className = ''
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentReady, setPaymentReady] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    setErrorMessage('');
    setPaymentReady(false);
  }, [clientSecret]);

  useEffect(() => {
    if (elements) {
      const paymentElement = elements?.getElement(PaymentElement);
      if (paymentElement) {
        paymentElement?.on('ready', () => {
          setPaymentReady(true);
        });
      }
    }
  }, [elements]);

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error: stripeError, paymentIntent } = await stripe?.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location?.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (stripeError) {
        setErrorMessage(stripeError?.message || 'Payment failed. Please try again.');
        onError?.(stripeError);
      } else if (paymentIntent) {
        if (paymentIntent?.status === 'succeeded') {
          try {
            const confirmationData = await paymentService?.confirmPayment(paymentIntent?.id);
            
            const successResult = {
              paymentIntent,
              planData,
              subscriptionData: confirmationData,
              warning: confirmationData?.error ? 'Payment processed but confirmation failed. Please contact support.' : undefined
            };

            setSuccessData(successResult);
            setShowSuccessAnimation(true);

            setTimeout(() => {
              setShowSuccessAnimation(false);
              onSuccess?.(successResult);
            }, 3000);
          } catch (confirmError) {
            const successResult = {
              paymentIntent,
              planData,
              warning: 'Payment processed successfully but confirmation failed. Please contact support to activate your subscription.'
            };
            setSuccessData(successResult);
            setShowSuccessAnimation(true);
            setTimeout(() => {
              setShowSuccessAnimation(false);
              onSuccess?.(successResult);
            }, 3000);
          }
        } else if (paymentIntent?.status === 'requires_action') {
          setErrorMessage('Additional authentication required. Please complete the verification.');
        } else {
          setErrorMessage('Payment processing incomplete. Please try again.');
        }
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements || !clientSecret) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Loading payment system...
        </p>
      </div>
    );
  }

  return (
    <div className={`relative bg-card rounded-lg border border-border p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Element */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Payment Details
            </label>
            <PaymentElement 
              options={{
                fields: {
                  billingDetails: 'auto'
                },
                layout: 'tabs'
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!paymentReady || isProcessing || !stripe || !elements}
          className="w-full"
          size="lg"
          iconName={isProcessing ? "Loader2" : "CreditCard"}
          iconClassName={isProcessing ? "animate-spin" : ""}
          iconPosition="left"
        >
          {isProcessing ? 'Processing Payment...' : confirmButtonText}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span>Secured by Stripe • Your payment information is encrypted</span>
        </div>
      </form>

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
          <div className="text-center space-y-6 p-8">
            {/* Animated Success Icon */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center animate-bounce">
                  <Icon name="Check" size={32} className="text-success-foreground" />
                </div>
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-success/30 rounded-full animate-ping opacity-30"></div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-success">
                Payment Successful! 🎉
              </h3>
              <p className="text-foreground font-medium">
                Your {planData?.planId} subscription is active
              </p>
              {successData?.warning && (
                <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  {successData?.warning}
                </p>
              )}
            </div>

            {/* Amount Display */}
            <div className="bg-success/10 rounded-lg p-4">
              <p className="text-lg font-semibold text-success">
                {paymentService?.formatAmount(amount, currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Setting up your account...
              </p>
            </div>

            {/* Loading Dots */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper component that provides Elements context
const StripePaymentForm = (props) => {
  const { stripePromise, stripeOptions } = useStripeContext();

  if (!props?.clientSecret) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-center text-muted-foreground">
          Preparing payment system...
        </p>
      </div>
    );
  }

  const elementsOptions = {
    clientSecret: props?.clientSecret,
    ...stripeOptions,
    defaultValues: props?.planData?.customerInfo ? {
      billingDetails: {
        name: `${props?.planData?.customerInfo?.firstName || ''} ${props?.planData?.customerInfo?.lastName || ''}`?.trim(),
        email: props?.planData?.customerInfo?.email || '',
        phone: props?.planData?.customerInfo?.phone || '',
      }
    } : undefined
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <StripePaymentFormInner {...props} />
    </Elements>
  );
};

export default StripePaymentForm;
