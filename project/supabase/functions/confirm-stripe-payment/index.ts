import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
};

serve(async (req) => {
    if (req?.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders
        });
    }

    try {
        // Create a Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Create a Stripe client
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        const stripe = new Stripe(stripeKey);

        // Get the request body
        const { paymentIntentId } = await req?.json();

        if (!paymentIntentId) {
            return new Response(JSON.stringify({
                error: 'Payment Intent ID is required'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            });
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe?.paymentIntents?.retrieve(paymentIntentId);

        if (!paymentIntent) {
            return new Response(JSON.stringify({
                error: 'Payment Intent not found'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404
            });
        }

        // Extract metadata
        const metadata = paymentIntent?.metadata;
        const planId = metadata?.plan_id;
        const databaseTier = metadata?.database_tier;
        const customerEmail = metadata?.customer_email;

        // Update user profile with subscription information
        const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.update({
                subscription_plan: planId,
                database_tier: databaseTier,
                subscription_status: paymentIntent?.status === 'succeeded' ? 'active' : 'pending',
                stripe_payment_intent_id: paymentIntentId,
                updated_at: new Date()?.toISOString()
            })?.eq('email', customerEmail)?.select()?.single();

        if (profileError) {
            console.error('Profile update error:', profileError);
        }

        // For recurring plans (white-label), set up subscription
        if (planId === 'white-label' && paymentIntent?.status === 'succeeded') {
            try {
                const monthlyAmount = parseFloat(metadata?.monthly_fee || '0') * 100;
                
                if (monthlyAmount > 0) {
                    // Create a subscription for recurring billing
                    const subscription = await stripe?.subscriptions?.create({
                        customer: paymentIntent?.customer,
                        items: [{
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: `${planId} - ${databaseTier} tier`,
                                    metadata: {
                                        plan_id: planId,
                                        database_tier: databaseTier
                                    }
                                },
                                unit_amount: monthlyAmount,
                                recurring: {
                                    interval: 'month'
                                }
                            }
                        }],
                        metadata: {
                            plan_id: planId,
                            database_tier: databaseTier,
                            customer_email: customerEmail
                        }
                    });

                    // Update user profile with subscription ID
                    await supabase?.from('user_profiles')?.update({
                            stripe_subscription_id: subscription?.id
                        })?.eq('email', customerEmail);
                }
            } catch (subscriptionError) {
                console.error('Subscription creation error:', subscriptionError);
                // Continue - don't fail the confirmation
            }
        }

        // Return success response
        return new Response(JSON.stringify({
            success: true,
            paymentStatus: paymentIntent.status,
            planId: planId,
            databaseTier: databaseTier,
            subscriptionActive: paymentIntent.status === 'succeeded',
            userProfile: userProfile
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        });
    }
});