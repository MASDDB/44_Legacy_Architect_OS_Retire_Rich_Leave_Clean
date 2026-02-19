import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { verifyAuth, createErrorResponse } from "../_shared/auth.ts";
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

Deno.serve(async (req: Request) => {
    // 1. Handle CORS Preflight
    const preflight = handleOptions(req);
    if (preflight) return preflight;

    const corsHeaders = getCorsHeaders(req);

    try {
        // 2. Enforce Authentication
        const { user, supabase } = await verifyAuth(req);

        // 3. Method check
        if (req.method !== 'POST') {
            return createErrorResponse('Method Not Allowed', 405, corsHeaders);
        }

        // 4. Validate body
        const { paymentIntentId } = await req.json();
        if (!paymentIntentId) {
            return createErrorResponse('Payment Intent ID is required', 400, corsHeaders);
        }

        // 5. Validate Provider Config
        if (!STRIPE_SECRET_KEY) {
            console.error('Missing STRIPE_SECRET_KEY in environment');
            return createErrorResponse('Payment provider configuration error', 503, corsHeaders);
        }
        const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

        // 6. Retrieve and Verify Payment Intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent) {
            return createErrorResponse('Payment Intent not found', 404, corsHeaders);
        }

        // SECURITY: Ensure this payment intent belongs to the authenticated user
        // We check the 'supabase_user_id' we added to metadata during creation
        if (paymentIntent.metadata.supabase_user_id !== user.id && paymentIntent.metadata.customer_email !== user.email) {
            console.warn(`User ${user.id} attempted to confirm unauthorized payment intent ${paymentIntentId}`);
            return createErrorResponse('Access Denied: Unauthorized payment confirmation', 403, corsHeaders);
        }

        // 7. Extract metadata for profile updates
        const { plan_id: planId, database_tier: databaseTier, customer_email: customerEmail } = paymentIntent.metadata;

        // 8. Update User Profile
        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .update({
                subscription_plan: planId,
                database_tier: databaseTier,
                subscription_status: paymentIntent.status === 'succeeded' ? 'active' : 'pending',
                stripe_payment_intent_id: paymentIntentId,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single();

        if (profileError) console.error('Profile update error:', profileError);

        // 9. Handle Recurring Subscription (if applicable)
        if (planId === 'white-label' && paymentIntent.status === 'succeeded' && !userProfile?.stripe_subscription_id) {
            try {
                const monthlyAmount = parseFloat(paymentIntent.metadata.monthly_fee || '0') * 100;
                if (monthlyAmount > 0) {
                    const subscription = await stripe.subscriptions.create({
                        customer: paymentIntent.customer as string,
                        items: [{
                            price_data: {
                                currency: 'usd',
                                unit_amount: monthlyAmount,
                                recurring: { interval: 'month' },
                                product_data: {
                                    name: `${planId} - ${databaseTier} License`,
                                    metadata: { plan_id: planId, database_tier: databaseTier }
                                }
                            }
                        }],
                        metadata: {
                            plan_id: planId,
                            database_tier: databaseTier,
                            supabase_user_id: user.id
                        }
                    });

                    await supabase.from('user_profiles')
                        .update({ stripe_subscription_id: subscription.id })
                        .eq('id', user.id);
                }
            } catch (subError) {
                console.error('Subscription creation failed during confirmation:', subError);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            paymentStatus: paymentIntent.status,
            planId,
            databaseTier,
            userProfile
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        const status = message === 'Unauthorized' ? 401 : 400;
        console.error(`Payment confirmation error: ${message}`);
        return createErrorResponse(message, status, corsHeaders);
    }
});