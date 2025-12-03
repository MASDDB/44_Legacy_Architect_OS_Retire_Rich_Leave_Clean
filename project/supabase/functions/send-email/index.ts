import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*", // DO NOT CHANGE THIS
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*" // DO NOT CHANGE THIS
      }
    });
  }

  try {
    const { recipient_email, recipient_name, subject, html_body, text_body, notification_type, metadata } = await req?.json();

    // Validate required fields
    if (!recipient_email || !subject || !html_body) {
      return new Response(JSON.stringify({
        error: "Missing required fields: recipient_email, subject, html_body"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" // DO NOT CHANGE THIS
        }
      });
    }

    // Get Resend API key from environment
    const resendApiKey = globalThis.Deno?.env?.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    // Prepare email data for Resend API
    const emailData = {
      from: "onboarding@resend.dev",
      to: [recipient_email],
      subject: subject,
      html: html_body,
      ...(text_body && { text: text_body })
    };

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    const resendResult = await resendResponse?.json();

    if (!resendResponse?.ok) {
      throw new Error(`Resend API error: ${resendResult.message || 'Unknown error'}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message_id: resendResult.id,
      recipient: recipient_email,
      subject: subject,
      notification_type: notification_type || 'general',
      sent_at: new Date().toISOString(),
      metadata: metadata || {}
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // DO NOT CHANGE THIS
      }
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      details: "Failed to send email via Resend"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // DO NOT CHANGE THIS
      }
    });
  }
});