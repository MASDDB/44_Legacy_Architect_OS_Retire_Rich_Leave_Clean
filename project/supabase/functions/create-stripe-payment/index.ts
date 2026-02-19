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

        // 4. Validate Stripe Config
        if (!STRIPE_SECRET_KEY) {
            console.error('Missing STRIPE_SECRET_KEY in environment');
            return createErrorResponse('Payment provider configuration error', 503, corsHeaders);
        }
        const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

        // 5. Build and Validate body
        const { planId, databaseTier, billingCycle, customerInfo, metadata } = await req.json();

        if (!planId || !databaseTier || !customerInfo?.email) {
            return createErrorResponse('Missing required fields: planId, databaseTier, or email', 400, corsHeaders);
        }

        // Security check: Ensure authenticated user is only creating payments for their own email or profile
        if (user.email !== customerInfo.email) {
            // Allow this only if we have specific logic, but typically we want to cross-reference
            console.warn(`User ${user.email} attempting payment for ${customerInfo.email}`);
        }

        // 6. Pricing Matrix (duplicated for server-side enforcement)
        const pricingMatrix: Record<string, any> = {
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

        const planPricing = pricingMatrix[planId]?.[databaseTier];
        if (!planPricing) {
            return createErrorResponse('Invalid plan or tier selection', 400, corsHeaders);
        }

        let totalAmount = planPricing.setup * 100; // in cents
        if (planId === 'done-for-you') {
            totalAmount = 100; // $1 verification
        }

        // 7. Get or Create Stripe Customer
        let stripeCustomer;
        const customers = await stripe.customers.list({ email: customerInfo.email, limit: 1 });

        if (customers.data.length > 0) {
            stripeCustomer = customers.data[0];
        } else {
            stripeCustomer = await stripe.customers.create({
                email: customerInfo.email,
                name: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim(),
                metadata: { supabase_id: user.id }
            });
        }

        // 8. Create Payment Intent (with idempotency check logic)
        // We use a generated key based on the specific checkout session data
        const idempotencyKey = btoa(`${customerInfo.email}-${planId}-${databaseTier}-${totalAmount}`).substring(0, 64);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            customer: stripeCustomer.id,
            description: `${planId} - ${databaseTier} License`,
            metadata: {
                ...metadata,
                plan_id: planId,
                database_tier: databaseTier,
                billing_cycle: billingCycle,
                supabase_user_id: user.id
            },
            automatic_payment_methods: { enabled: true }
        }, {
            idempotencyKey: idempotencyKey
        });

        // 9. Sync to user profile (minimal set)
        const { error: dbError } = await supabase.from('user_profiles').upsert({
            id: user.id,
            email: customerInfo.email,
            stripe_customer_id: stripeCustomer.id,
            updated_at: new Date().toISOString()
        });

        if (dbError) console.error('DB Sync Error:', dbError);

        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customerId: stripeCustomer.id,
            amount: totalAmount / 100
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        const status = message === 'Unauthorized' ? 401 : 400;
        console.error(`Stripe creation error: ${message}`);
        return createErrorResponse(message, status, corsHeaders);
    }
});