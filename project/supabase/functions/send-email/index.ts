import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { verifyAuth, createErrorResponse } from "../_shared/auth.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

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
    const { recipient_email, subject, html_body, text_body, notification_type, metadata } = await req.json();

    if (!recipient_email || !subject || !html_body) {
      return createErrorResponse('Missing required fields: recipient_email, subject, html_body', 400, corsHeaders);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient_email)) {
      return createErrorResponse('Invalid recipient email format', 400, corsHeaders);
    }

    // 5. Validate Provider Config
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY in environment');
      return createErrorResponse('Email provider configuration error', 503, corsHeaders);
    }

    // 6. Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "LAOS CRM <notifications@resend.dev>", // Replace with verified domain in production
        to: [recipient_email],
        subject: subject,
        html: html_body,
        text: text_body,
        tags: [
          { name: 'user_id', value: user.id },
          { name: 'notification_type', value: notification_type || 'general' }
        ]
      })
    });

    const result = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend error:', result);
      return createErrorResponse(`Email delivery failed: ${result.message || 'Unknown error'}`, resendResponse.status, corsHeaders);
    }

    console.log(`User ${user.id} sent email to ${recipient_email}. ID: ${result.id}`);

    return new Response(JSON.stringify({
      success: true,
      message_id: result.id,
      sent_at: new Date().toISOString(),
      metadata: metadata || {}
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message === 'Unauthorized' ? 401 : 500;
    console.error(`Email function error: ${message}`);
    return createErrorResponse(message, status, corsHeaders);
  }
});