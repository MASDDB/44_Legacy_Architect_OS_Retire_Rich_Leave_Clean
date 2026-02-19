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
        const { action } = body ?? {};

        if (!action || !["reasoning", "recommendations"].includes(action)) {
            return new Response(
                JSON.stringify({ error: "Invalid action. Must be 'reasoning' or 'recommendations'" }),
                { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
            );
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

        // --- Action: reasoning ---
        if (action === "reasoning") {
            const { leadId, scores } = body;
            if (!leadId || !scores) {
                return new Response(
                    JSON.stringify({ error: "Missing leadId or scores" }),
                    { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
                );
            }

            const { data: leadData } = await supabase
                .from("leads")
                .select("first_name, last_name, job_title, priority, estimated_value, company:companies(name, industry, company_size)")
                .eq("id", leadId)
                .single();

            const { data: behaviorData } = await supabase
                .from("lead_behavioral_metrics")
                .select("event_type, event_timestamp")
                .eq("lead_id", leadId)
                .order("event_timestamp", { ascending: false })
                .limit(10);

            const prompt = `Analyze this lead's scoring data and provide concise reasoning:

Lead: ${leadData?.first_name || ""} ${leadData?.last_name || ""}, ${leadData?.job_title || "N/A"}
Company: ${leadData?.company?.name || "Unknown"} (${leadData?.company?.industry || "N/A"})
Priority: ${leadData?.priority || "N/A"}, Est. Value: $${leadData?.estimated_value || 0}

Scores: Overall ${scores.overall}/100, Behavioral ${scores.behavioral}/40, Engagement ${scores.engagement}/30, Fit ${scores.fit}/30

Recent: ${behaviorData?.map((b: any) => b.event_type).join(", ") || "None"}

Provide 2-3 sentences on key score drivers.`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system" as const, content: "You are a lead scoring analyst. Provide concise, actionable explanations." },
                    { role: "user" as const, content: prompt },
                ],
                max_tokens: 150,
                temperature: 0.3,
            });

            return new Response(
                JSON.stringify({ ok: true, text: completion.choices?.[0]?.message?.content?.trim() ?? "" }),
                { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
            );
        }

        // --- Action: recommendations ---
        if (action === "recommendations") {
            const { leadsData, limit = 10 } = body;
            if (!leadsData || !Array.isArray(leadsData) || leadsData.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Missing or empty leadsData array" }),
                    { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
                );
            }

            const prompt = `Analyze these ${leadsData.length} leads and recommend the top ${limit} for immediate action:

${leadsData.map((s: any, i: number) => `${i + 1}. ${s.name} — Score: ${s.score}/100, Category: ${s.category}, Value: $${s.predicted_value}`).join("\n")}

Return JSON: {"recommendations": [{"lead_id": "uuid", "priority_reason": "brief reason"}]}`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system" as const, content: "You are a sales AI analyst. Return valid JSON only." },
                    { role: "user" as const, content: prompt },
                ],
                max_tokens: 500,
                temperature: 0.3,
                response_format: { type: "json_object" },
            });

            const text = completion.choices?.[0]?.message?.content ?? "{}";
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                parsed = { recommendations: [] };
            }

            return new Response(
                JSON.stringify({ ok: true, ...parsed }),
                { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify({ error: "Unknown action" }), {
            status: 400,
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
