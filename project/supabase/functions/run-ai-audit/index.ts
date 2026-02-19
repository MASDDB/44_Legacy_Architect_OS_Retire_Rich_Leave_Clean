import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { verifyAuth, createErrorResponse } from "../_shared/auth.ts";
import OpenAI from "npm:openai@4.56.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

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

    // 4. Validate Provider Config
    if (!OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY in environment');
      return createErrorResponse('AI provider configuration error', 503, corsHeaders);
    }

    // 5. Build and Validate body
    const body = await req.json();
    const { system, user: userPromptContent, model } = body ?? {};

    if (!userPromptContent) {
      return createErrorResponse("Missing 'user' prompt content", 400, corsHeaders);
    }

    // 6. Execute AI Completion
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [
        ...(system ? [{ role: "system" as const, content: String(system) }] : []),
        { role: "user" as const, content: String(userPromptContent) },
      ],
      temperature: 0.2,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";

    console.log(`User ${user.id} executed AI Audit. Model: ${model || "gpt-4o-mini"}`);

    return new Response(JSON.stringify({ ok: true, text }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message === 'Unauthorized' ? 401 : 500;
    console.error(`AI Audit function error: ${message}`);
    return createErrorResponse(message, status, corsHeaders);
  }
});
