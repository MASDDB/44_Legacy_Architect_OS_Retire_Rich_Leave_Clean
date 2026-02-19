import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { verifyAuth, createErrorResponse } from "../_shared/auth.ts";
import Stripe from "npm:stripe@12.0.0";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

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

    // 4. Validate Provider Config
    if (!STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY in environment');
      return createErrorResponse('Payment provider configuration error', 503, corsHeaders);
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    // 5. Get body
    const { campaignId } = await req.json();

    if (!campaignId) {
      return createErrorResponse("Campaign ID is required", 400, corsHeaders);
    }

    // 6. Ownership Check (Campaign must belong to the authenticated user)
    const { data: campaign, error: campaignError } = await supabase
      .from("cash_boost_campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (campaignError || !campaign) {
      return createErrorResponse("Campaign not found or access denied", 404, corsHeaders);
    }

    if (campaign.pricing_mode !== "performance") {
      return createErrorResponse("Campaign is not in performance mode", 400, corsHeaders);
    }

    if (campaign.performance_fee_billed) {
      return createErrorResponse("Performance fee already billed", 400, corsHeaders);
    }

    // 7. Get User Profile for Stripe Customer ID
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id, email, full_name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return createErrorResponse("User profile not found", 404, corsHeaders);
    }

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      // Create customer on the fly if missing (unlikely but safe)
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("user_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const feeAmount = Math.round(campaign.performance_fee_amount * 100);

    if (feeAmount <= 0) {
      return createErrorResponse("No performance fee to bill", 400, corsHeaders);
    }

    // 8. Create Invoice Item + Invoice
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: feeAmount,
      currency: "usd",
      description: `Cash-Boost Mission Performance Fee - ${campaign.campaign_type.replace("_", " ")}`,
      metadata: {
        campaign_id: campaign.id,
        user_id: user.id
      },
    });

    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: "charge_automatically",
      description: `Cash-Boost Mission Performance Fee`,
    });

    await stripe.invoices.finalizeInvoice(invoice.id);

    try {
      await stripe.invoices.pay(invoice.id);
    } catch (paymentError) {
      console.error("Payment attempt failed, invoice remains open:", paymentError);
    }

    // 9. Update state in DB
    const { error: updateError } = await supabase
      .from("cash_boost_campaigns")
      .update({
        performance_fee_billed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    if (updateError) console.error("Error updating campaign record:", updateError);

    return new Response(JSON.stringify({
      success: true,
      invoiceId: invoice.id,
      amount: feeAmount / 100,
      status: invoice.status,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message === 'Unauthorized' ? 401 : 500;
    console.error(`Performance Fee error: ${message}`);
    return createErrorResponse(message, status, corsHeaders);
  }
});
