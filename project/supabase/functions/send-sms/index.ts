/// <reference types="https://deno.land/x/deno@v1.28.0/lib/deno.d.ts" />

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*'
};

interface SMSRequest {
  to: string;
  message: string;
  campaignId?: string;
  leadId?: string;
}

interface SMSResponse {
  success: boolean;
  messageSid?: string;
  status?: string;
  error?: string;
  details?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const requestData: SMSRequest = await req.json();
    const { to, message, campaignId, leadId } = requestData;
    
    // Validate required fields
    if (!to || !message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: to, message'
      } as SMSResponse), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate Twilio configuration
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Twilio configuration missing. Please check environment variables.'
      } as SMSResponse), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Create Twilio request
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    
    const formData = new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER,
      Body: message
    });

    // Send SMS via Twilio API
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const twilioResponse = await response.json();

    if (!response.ok) {
      console.error('Twilio API error:', twilioResponse);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to send SMS',
        details: twilioResponse
      } as SMSResponse), {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('SMS sent successfully:', twilioResponse.sid);
    
    return new Response(JSON.stringify({
      success: true,
      messageSid: twilioResponse.sid,
      status: twilioResponse.status
    } as SMSResponse), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: error.message
    } as SMSResponse), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});