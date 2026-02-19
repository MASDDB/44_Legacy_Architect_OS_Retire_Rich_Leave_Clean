import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { verifyAuth, createErrorResponse } from "../_shared/auth.ts";

interface VoiceCallRequest {
  campaignId: string
  leadId?: string
  phoneNumber: string
  messageContent: string
  voiceSettings?: {
    voice?: string
    language?: string
    speed?: string
    pitch?: string
  }
}

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  const corsHeaders = getCorsHeaders(req);

  try {
    // 2. Enforce Authentication
    const { user, supabase: supabaseClient } = await verifyAuth(req);

    // 3. Method check
    if (req.method !== 'POST') {
      return createErrorResponse('Method Not Allowed', 405, corsHeaders);
    }

    // 4. Validate body
    const { campaignId, leadId, phoneNumber, messageContent, voiceSettings }: VoiceCallRequest = await req.json();

    if (!campaignId || !phoneNumber || !messageContent) {
      return createErrorResponse('Missing required fields: campaignId, phoneNumber, messageContent', 400, corsHeaders);
    }

    // 5. Ownership Check
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select('id, created_by, campaign_type')
      .eq('id', campaignId)
      .eq('created_by', user.id)
      .single();

    if (campaignError || !campaign) {
      return createErrorResponse('Campaign not found or access denied', 404, corsHeaders);
    }

    if (campaign.campaign_type !== 'phone') {
      return createErrorResponse('Campaign is not a voice campaign', 400, corsHeaders);
    }

    // 6. Voice Settings Logic
    const { data: voiceSettings_db } = await supabaseClient
      .from('voice_campaign_settings')
      .select('*')
      .eq('campaign_id', campaignId)
      .maybeSingle();

    const finalVoiceSettings = {
      voice: voiceSettings?.voice || voiceSettings_db?.voice_settings?.voice || 'alice',
      language: voiceSettings?.language || voiceSettings_db?.voice_settings?.language || 'en-US',
      speed: voiceSettings?.speed || voiceSettings_db?.voice_settings?.speed || '1.0',
      pitch: voiceSettings?.pitch || voiceSettings_db?.voice_settings?.pitch || '0',
    };

    // 7. Track the record in DB
    const { data: voiceMessage, error: voiceMessageError } = await supabaseClient
      .from('voice_messages')
      .insert([
        {
          campaign_id: campaignId,
          lead_id: leadId,
          sent_by: user.id,
          phone_number: phoneNumber,
          message_content: messageContent,
          call_status: 'pending',
          sent_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (voiceMessageError) throw voiceMessageError;

    // 8. Simulated Voice Provider Interaction (Twilio/Retell)
    const simulatedResponse = {
      success: true,
      voiceMessageId: voiceMessage.id,
      callSid: `CA${Math.random().toString(36).substring(2, 15)}`,
      status: 'initiated',
      phoneNumber,
      estimatedCost: 0.05,
    };

    // 9. Post-initiation updates (Analytics)
    await supabaseClient
      .from('voice_messages')
      .update({
        twilio_call_sid: simulatedResponse.callSid,
        call_status: 'initiated',
        cost: simulatedResponse.estimatedCost,
      })
      .eq('id', voiceMessage.id);

    const today = new Date().toISOString().split('T')[0];
    const { data: existingAnalytics } = await supabaseClient
      .from('voice_campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('date_tracked', today)
      .maybeSingle();

    if (existingAnalytics) {
      await supabaseClient
        .from('voice_campaign_analytics')
        .update({
          total_calls: existingAnalytics.total_calls + 1,
          total_cost: (parseFloat(existingAnalytics.total_cost) + simulatedResponse.estimatedCost).toFixed(4),
        })
        .eq('id', existingAnalytics.id);
    } else {
      await supabaseClient.from('voice_campaign_analytics').insert([{
        campaign_id: campaignId,
        date_tracked: today,
        total_calls: 1,
        total_cost: simulatedResponse.estimatedCost,
      }]);
    }

    return new Response(JSON.stringify(simulatedResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message === 'Unauthorized' ? 401 : 400;
    console.error(`Voice Call error: ${message}`);
    return createErrorResponse(message, status, corsHeaders);
  }
});