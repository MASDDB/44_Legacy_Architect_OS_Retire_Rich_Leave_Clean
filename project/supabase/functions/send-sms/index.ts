import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { verifyAuth, createErrorResponse } from "../_shared/auth.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

interface SMSRequest {
  to: string;
  message: string;
  campaignId?: string;
  leadId?: string;
}

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  const corsHeaders = getCorsHeaders(req);

  try {
    // 2. Enforce Authentication
    const { user } = await verifyAuth(req);

    // 3. Method check
    if (req.method !== 'POST') {
      return createErrorResponse('Method Not Allowed', 405, corsHeaders);
    }

    // 4. Validate body
    const { to, message, campaignId, leadId } = (await req.json()) as SMSRequest;

    if (!to || !message) {
      return createErrorResponse('Missing required fields: to, message', 400, corsHeaders);
    }

    // Simple phone validation (E.164-ish)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to.replace(/\s+/g, ""))) {
      return createErrorResponse('Invalid recipient phone number format', 400, corsHeaders);
    }

    if (message.length > 1600) {
      return createErrorResponse('Message too long (max 1600 chars)', 400, corsHeaders);
    }

    // 5. Validate Twilio Config
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.error('Missing Twilio credentials in environment');
      return createErrorResponse('SMS provider configuration error', 503, corsHeaders);
    }

    // 6. Build Twilio request
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    const formData = new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER,
      Body: message
    });

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const result = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error('Twilio Error:', result);
      return createErrorResponse(`SMS delivery failed: ${result.message || 'Unknown error'}`, twilioResponse.status, corsHeaders);
    }

    console.log(`User ${user.id} successfully sent SMS to ${to}. SID: ${result.sid}`);

    return new Response(JSON.stringify({
      success: true,
      messageSid: result.sid,
      status: result.status
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message === 'Unauthorized' || message === 'Missing Authorization header' ? 401 : 500;

    console.error(`SMS function error: ${message}`);
    return createErrorResponse(message, status, corsHeaders);
  }
});