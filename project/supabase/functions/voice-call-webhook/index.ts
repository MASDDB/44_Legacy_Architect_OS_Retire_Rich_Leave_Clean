import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for webhook processing
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse webhook data (could be form-encoded or JSON)
    let webhookData: VoiceCallWebhookData
    
    const contentType = req.headers.get('content-type')
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      // Parse form data (Twilio sends this format)
      const formData = await req.formData()
      webhookData = Object.fromEntries(formData.entries()) as any
    } else {
      // Parse JSON data
      webhookData = await req.json()
    }

    const { CallSid, CallStatus, CallDuration, RecordingUrl, TranscriptionText, From, To } = webhookData

    if (!CallSid) {
      throw new Error('CallSid is required')
    }

    // Map Twilio status to our call_status enum
    const statusMapping: Record<string, string> = {
      'initiated': 'initiated',
      'ringing': 'ringing',
      'in-progress': 'answered',
      'completed': 'completed',
      'busy': 'busy',
      'no-answer': 'no_answer',
      'failed': 'failed',
      'canceled': 'failed',
    }

    const mappedStatus = statusMapping[CallStatus] || 'failed'

    // Find the voice message by call SID
    const { data: voiceMessage, error: findError } = await supabaseClient
      .from('voice_messages')
      .select('*')
      .eq('twilio_call_sid', CallSid)
      .single()

    if (findError || !voiceMessage) {
      console.error('Voice message not found for CallSid:', CallSid)
      return new Response('Voice message not found', { status: 404 })
    }

    // Calculate cost based on duration (example: $0.05/minute)
    const durationInSeconds = parseInt(CallDuration || '0')
    const costPerMinute = 0.05
    const calculatedCost = (durationInSeconds / 60) * costPerMinute

    // Update voice message with webhook data
    const updateData: any = {
      call_status: mappedStatus,
      call_duration: durationInSeconds,
      updated_at: new Date().toISOString(),
    }

    // Set answered flag for successful calls
    if (['answered', 'completed'].includes(mappedStatus)) {
      updateData.answered = true
      if (!voiceMessage.answered_at) {
        updateData.answered_at = new Date().toISOString()
      }
    }

    // Set completion timestamp for final statuses
    if (['completed', 'failed', 'no_answer', 'busy'].includes(mappedStatus)) {
      updateData.completed_at = new Date().toISOString()
      updateData.cost = calculatedCost.toFixed(4)
    }

    // Handle recording URL
    if (RecordingUrl) {
      updateData.recording_url = RecordingUrl
    }

    // Detect voicemail (basic heuristic: short duration + completed status)
    if (mappedStatus === 'completed' && durationInSeconds < 30) {
      updateData.voicemail_detected = true
      updateData.call_status = 'voicemail'
    }

    const { error: updateError } = await supabaseClient
      .from('voice_messages')
      .update(updateData)
      .eq('id', voiceMessage.id)

    if (updateError) {
      throw new Error(`Failed to update voice message: ${updateError.message}`)
    }

    // Update campaign analytics
    const today = new Date().toISOString().split('T')[0]
    const { data: analytics, error: analyticsError } = await supabaseClient
      .from('voice_campaign_analytics')
      .select('*')
      .eq('campaign_id', voiceMessage.campaign_id)
      .eq('date_tracked', today)
      .single()

    if (analytics) {
      // Calculate updated analytics
      const updates: any = {
        updated_at: new Date().toISOString(),
      }

      // Increment counters based on status
      if (mappedStatus === 'answered' && !voiceMessage.answered) {
        updates.answered_calls = analytics.answered_calls + 1
      }
      if (mappedStatus === 'completed' && voiceMessage.call_status !== 'completed') {
        updates.completed_calls = analytics.completed_calls + 1
        updates.total_duration = analytics.total_duration + durationInSeconds
        updates.total_cost = (parseFloat(analytics.total_cost) + calculatedCost).toFixed(4)
      }
      if (mappedStatus === 'failed' && voiceMessage.call_status !== 'failed') {
        updates.failed_calls = analytics.failed_calls + 1
      }
      if (mappedStatus === 'busy' && voiceMessage.call_status !== 'busy') {
        updates.busy_signals = analytics.busy_signals + 1
      }
      if (mappedStatus === 'no_answer' && voiceMessage.call_status !== 'no_answer') {
        updates.no_answers = analytics.no_answers + 1
      }
      if (mappedStatus === 'voicemail' && !voiceMessage.voicemail_detected) {
        updates.voicemails = analytics.voicemails + 1
      }

      // Calculate rates if we have meaningful data
      if (Object.keys(updates).length > 1) {
        const totalCalls = analytics.total_calls
        if (updates.answered_calls !== undefined) {
          updates.answer_rate = ((updates.answered_calls / totalCalls) * 100).toFixed(2)
        }
        if (updates.completed_calls !== undefined) {
          updates.completion_rate = ((updates.completed_calls / totalCalls) * 100).toFixed(2)
          if (updates.completed_calls > 0) {
            updates.average_call_duration = (updates.total_duration / updates.completed_calls).toFixed(2)
            updates.cost_per_completion = (parseFloat(updates.total_cost) / updates.completed_calls).toFixed(4)
          }
        }

        await supabaseClient
          .from('voice_campaign_analytics')
          .update(updates)
          .eq('id', analytics.id)
      }
    }

    // Log successful processing
    console.log(`Voice call webhook processed: CallSid=${CallSid}, Status=${CallStatus} -> ${mappedStatus}`)

    return new Response(JSON.stringify({ 
      success: true, 
      processed: {
        callSid: CallSid,
        status: mappedStatus,
        duration: durationInSeconds,
        cost: calculatedCost.toFixed(4)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Voice webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})