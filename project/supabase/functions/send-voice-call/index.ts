import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      globalThis.Deno?.env.get('SUPABASE_URL') ?? '',
      globalThis.Deno?.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { campaignId, leadId, phoneNumber, messageContent, voiceSettings }: VoiceCallRequest = await req.json()

    // Validate required fields
    if (!campaignId || !phoneNumber || !messageContent) {
      throw new Error('Missing required fields: campaignId, phoneNumber, messageContent')
    }

    // Check if user owns the campaign
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select('id, created_by, campaign_type')
      .eq('id', campaignId)
      .eq('created_by', user.id)
      .single()

    if (campaignError || !campaign) {
      throw new Error('Campaign not found or access denied')
    }

    if (campaign.campaign_type !== 'phone') {
      throw new Error('Campaign is not a voice campaign')
    }

    // Get voice campaign settings
    const { data: voiceSettings_db } = await supabaseClient
      .from('voice_campaign_settings')
      .select('*')
      .eq('campaign_id', campaignId)
      .single()

    // Merge voice settings
    const finalVoiceSettings = {
      voice: voiceSettings?.voice || voiceSettings_db?.voice_settings?.voice || 'alice',
      language: voiceSettings?.language || voiceSettings_db?.voice_settings?.language || 'en-US',
      speed: voiceSettings?.speed || voiceSettings_db?.voice_settings?.speed || '1.0',
      pitch: voiceSettings?.pitch || voiceSettings_db?.voice_settings?.pitch || '0',
    }

    // Create TwiML for the call
    const twimlContent = `
      <Response>
        <Say voice="${finalVoiceSettings.voice}" language="${finalVoiceSettings.language}">
          ${messageContent}
        </Say>
        <Record timeout="10" transcribe="true" transcribeCallback="${globalThis.Deno?.env.get('SUPABASE_URL')}/functions/v1/voice-call-transcription"/>
      </Response>
    `

    // Create voice message record
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
        },
      ])
      .select()
      .single()

    if (voiceMessageError) {
      throw new Error(`Failed to create voice message record: ${voiceMessageError.message}`)
    }

    // For demo purposes, simulate call initiation success
    // In production, you would integrate with actual voice service (Twilio, Retell, Voicerr)
    const simulatedResponse = {
      success: true,
      voiceMessageId: voiceMessage.id,
      callSid: `CA${Math.random().toString(36).substring(2, 15)}`,
      status: 'initiated',
      phoneNumber,
      messageContent,
      voiceSettings: finalVoiceSettings,
      estimatedCost: 0.05, // $0.05 per call estimate
      twimlContent,
    }

    // Update voice message with call SID and status
    await supabaseClient
      .from('voice_messages')
      .update({
        twilio_call_sid: simulatedResponse.callSid,
        call_status: 'initiated',
        cost: simulatedResponse.estimatedCost,
      })
      .eq('id', voiceMessage.id)

    // Update campaign analytics
    const today = new Date().toISOString().split('T')[0]
    const { data: existingAnalytics } = await supabaseClient
      .from('voice_campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('date_tracked', today)
      .single()

    if (existingAnalytics) {
      // Update existing analytics
      await supabaseClient
        .from('voice_campaign_analytics')
        .update({
          total_calls: existingAnalytics.total_calls + 1,
          total_cost: (parseFloat(existingAnalytics.total_cost) + simulatedResponse.estimatedCost).toFixed(4),
        })
        .eq('id', existingAnalytics.id)
    } else {
      // Create new analytics record
      await supabaseClient.from('voice_campaign_analytics').insert([
        {
          campaign_id: campaignId,
          date_tracked: today,
          total_calls: 1,
          total_cost: simulatedResponse.estimatedCost,
        },
      ])
    }

    return new Response(JSON.stringify(simulatedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Voice call error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})