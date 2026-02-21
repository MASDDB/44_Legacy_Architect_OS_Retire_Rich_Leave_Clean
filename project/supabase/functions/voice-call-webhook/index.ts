import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface VoiceCallWebhookData {
  CallSid: string;
  CallStatus: string;
  CallDuration?: string;
  RecordingUrl?: string;
  TranscriptionText?: string;
  DialCallDuration?: string;
  From?: string;
  To?: string;
}

const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') ?? '';
const VOICE_WEBHOOK_URL = Deno.env.get('VOICE_WEBHOOK_URL') ?? '';

const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
};

const validateTwilioSignature = async (
  signature: string,
  url: string,
  params: URLSearchParams,
): Promise<boolean> => {
  if (!TWILIO_AUTH_TOKEN) return false;

  const entries = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
  const payload = entries.reduce((acc, [key, value]) => `${acc}${key}${value}`, url);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(TWILIO_AUTH_TOKEN),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );

  let binary = "";
  for (const byte of new Uint8Array(signatureBuffer)) {
    binary += String.fromCharCode(byte);
  }

  const expectedSignature = btoa(binary);
  return secureCompare(signature, expectedSignature);
};

Deno.serve(async (req: Request) => {
  // Webhooks are usually called by external providers (Twilio, Retell, etc.)
  // We do NOT use verifyAuth here, but we should restrict origins if possible
  // or use signature verification (e.g. Twilio-Signature header).

  const preflight = handleOptions(req);
  if (preflight) return preflight;

  const corsHeaders = getCorsHeaders(req);

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: corsHeaders });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let webhookData: VoiceCallWebhookData;
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const twilioSignature = req.headers.get('x-twilio-signature');
      if (!twilioSignature || !TWILIO_AUTH_TOKEN) {
        return new Response(JSON.stringify({ error: 'Webhook signature validation is not configured' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const rawBody = await req.text();
      const params = new URLSearchParams(rawBody);
      const requestUrl = VOICE_WEBHOOK_URL || req.url;
      const signatureValid = await validateTwilioSignature(twilioSignature, requestUrl, params);
      if (!signatureValid) {
        return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      webhookData = Object.fromEntries(params.entries()) as any;
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported webhook format' }), {
        status: 415,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { CallSid, CallStatus, CallDuration, RecordingUrl } = webhookData;

    if (!CallSid) {
      return new Response(JSON.stringify({ error: 'CallSid is required' }), { status: 400, headers: corsHeaders });
    }

    // Mapping logi...
    const statusMapping: Record<string, string> = {
      'initiated': 'initiated',
      'ringing': 'ringing',
      'in-progress': 'answered',
      'completed': 'completed',
      'busy': 'busy',
      'no-answer': 'no_answer',
      'failed': 'failed',
      'canceled': 'failed',
    };

    const mappedStatus = statusMapping[CallStatus] || 'failed';

    const { data: voiceMessage, error: findError } = await supabaseClient
      .from('voice_messages')
      .select('*')
      .eq('twilio_call_sid', CallSid)
      .maybeSingle();

    if (findError || !voiceMessage) {
      console.warn('Voice message not found for CallSid:', CallSid);
      return new Response(JSON.stringify({ error: 'Call not found' }), { status: 404, headers: corsHeaders });
    }

    const durationInSeconds = parseInt(CallDuration || '0');
    const calculatedCost = (durationInSeconds / 60) * 0.05;

    const updateData: any = {
      call_status: mappedStatus,
      call_duration: durationInSeconds,
      updated_at: new Date().toISOString(),
    };

    if (['answered', 'completed'].includes(mappedStatus)) {
      updateData.answered = true;
      if (!voiceMessage.answered_at) updateData.answered_at = new Date().toISOString();
    }

    if (['completed', 'failed', 'no_answer', 'busy'].includes(mappedStatus)) {
      updateData.completed_at = new Date().toISOString();
      updateData.cost = calculatedCost.toFixed(4);
    }

    if (RecordingUrl) updateData.recording_url = RecordingUrl;

    await supabaseClient
      .from('voice_messages')
      .update(updateData)
      .eq('id', voiceMessage.id);

    console.log(`Webhook: Updated Call ${CallSid} to status ${mappedStatus}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: 'Internal processing error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
