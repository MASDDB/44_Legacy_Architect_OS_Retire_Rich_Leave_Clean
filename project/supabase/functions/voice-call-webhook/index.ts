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
      const formData = await req.formData();
      webhookData = Object.fromEntries(formData.entries()) as any;
    } else {
      webhookData = await req.json();
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