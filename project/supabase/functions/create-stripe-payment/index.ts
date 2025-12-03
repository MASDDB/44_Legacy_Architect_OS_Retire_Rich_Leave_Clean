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
        const supabaseUrl = globalThis?.Deno?.env?.get('SUPABASE_URL');
        const supabaseKey = globalThis?.Deno?.env?.get('SUPABASE_ANON_KEY');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Create a Stripe client
        const stripeKey = globalThis?.Deno?.env?.get('STRIPE_SECRET_KEY');
        const stripe = new Stripe(stripeKey);

        // Get the request body
        const { planId, databaseTier, billingCycle, customerInfo, metadata } = await req?.json();

        // Validate required fields
        if (!planId || !databaseTier || !customerInfo?.email) {
            return new Response(JSON.stringify({
                error: 'Missing required fields: planId, databaseTier, and customerInfo.email'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            });
        }

        // Calculate pricing based on plan and database tier
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
        if (!planPricing) {
            return new Response(JSON.stringify({
                error: 'Invalid plan or database tier combination'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            });
        }

        // Calculate total amount (setup fee for initial payment)
        let totalAmount = planPricing?.setup * 100; // Convert to cents

        // For revenue share plans, create a minimal setup intent
        if (planId === 'done-for-you') {
            totalAmount = 100; // $1 verification charge
        }

        // Create or retrieve Stripe customer
        let stripeCustomer;
        try {
            const customers = await stripe?.customers?.list({
                email: customerInfo?.email,
                limit: 1
            });

            if (customers?.data?.length > 0) {
                stripeCustomer = customers?.data?.[0];
            } else {
                stripeCustomer = await stripe?.customers?.create({
                    email: customerInfo?.email,
                    name: `${customerInfo?.firstName || ''} ${customerInfo?.lastName || ''}`?.trim(),
                    metadata: {
                        plan_id: planId,
                        database_tier: databaseTier,
                        billing_cycle: billingCycle
                    }
                });
            }
        } catch (stripeError) {
            return new Response(JSON.stringify({
                error: `Stripe customer error: ${stripeError.message}`
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            });
        }

        // Create payment intent description
        const getDescription = (planId, tier) => {
            const planNames = {
                'done-for-you': 'Done-For-You Partnership',
                'setup-plus-percentage': 'Setup + Performance Plan',
                'white-label': 'White-Label License'
            };
            return `${planNames?.[planId] || planId} - ${tier?.charAt(0)?.toUpperCase() + tier?.slice(1)} Tier`;
        };

        // Create a Stripe payment intent
        const paymentIntent = await stripe?.paymentIntents?.create({
            amount: totalAmount,
            currency: 'usd',
            customer: stripeCustomer?.id,
            description: getDescription(planId, databaseTier),
            metadata: {
                ...metadata,
                plan_id: planId,
                database_tier: databaseTier,
                billing_cycle: billingCycle,
                customer_email: customerInfo?.email,
                setup_fee: planPricing?.setup?.toString(),
                monthly_fee: planPricing?.monthly?.toString() || '0',
                revenue_share: planPricing?.revenueShare?.toString() || '0',
                percentage_fee: planPricing?.percentage?.toString() || '0'
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Store subscription/order record in database
        const { data: subscriptionRecord, error: dbError } = await supabase?.from('user_profiles')?.upsert({
                email: customerInfo?.email,
                full_name: `${customerInfo?.firstName || ''} ${customerInfo?.lastName || ''}`?.trim(),
                stripe_customer_id: stripeCustomer?.id,
                updated_at: new Date()?.toISOString()
            }, {
                onConflict: 'email'
            });

        if (dbError) {
            console.error('Database error:', dbError);
        }

        // Return the payment intent client secret
        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customerId: stripeCustomer.id,
            amount: totalAmount,
            planId: planId,
            databaseTier: databaseTier,
            billingCycle: billingCycle
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error('Payment creation error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        });
    }
});