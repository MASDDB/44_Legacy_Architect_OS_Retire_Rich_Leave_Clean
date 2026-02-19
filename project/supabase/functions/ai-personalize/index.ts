import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import OpenAI from "npm:openai@4.56.0";

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").filter(Boolean);

function getCorsHeaders(req: Request) {
    const origin = req.headers.get("origin") || "";
    const allowed = ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);
    return {
        "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0] || "",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
}

Deno.serve(async (req: Request) => {
    const cors = getCorsHeaders(req);

    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: cors });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    try {
        // --- Auth ---
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Missing authorization" }), {
                status: 401,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        // --- Validate body ---
        const body = await req.json();
        const { template, rule, leadData, model } = body ?? {};

        if (!template || typeof template !== "string") {
            return new Response(JSON.stringify({ error: "Missing or invalid 'template'" }), {
                status: 400,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        // --- OpenAI (server-side only) ---
        const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
        if (!OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: "AI service unavailable" }), {
                status: 503,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

        const systemPrompt =
            "You are an expert marketing copywriter specializing in personalized messaging. " +
            "Create compelling, personalized messages that feel natural and relevant to the recipient. " +
            "Keep the tone professional yet engaging.";

        const userPrompt = `
      Personalize this marketing template for the lead.

      Template: ${template}

      Lead Data:
      - Name: ${leadData?.first_name || ""} ${leadData?.last_name || ""}
      - Company: ${leadData?.company_name || "Unknown"}
      - Industry: ${leadData?.industry || "Unknown"}
      - Title: ${leadData?.job_title || "Unknown"}

      Rule: ${rule?.name || "Default"} — ${rule?.description || "Standard personalization"}

      Return only the personalized message text.
    `;

        const completion = await openai.chat.completions.create({
            model: model || "gpt-4o-mini",
            messages: [
                { role: "system" as const, content: systemPrompt },
                { role: "user" as const, content: userPrompt },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const text = completion.choices?.[0]?.message?.content?.trim() ?? "";

        return new Response(JSON.stringify({ ok: true, text }), {
            status: 200,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ ok: false, error: "AI processing failed" }),
            {
                status: 500,
                headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
            }
        );
    }
});
