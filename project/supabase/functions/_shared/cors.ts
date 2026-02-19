// supabase/functions/_shared/cors.ts

/**
 * Gets the allowed origins from environment variables.
 * Falls back to an empty array if not set.
 */
export const getAllowedOrigins = (): string[] => {
    const envOrigins = Deno.env.get("ALLOWED_ORIGINS");
    return envOrigins ? envOrigins.split(",").map((o) => o.trim()).filter(Boolean) : [];
};

/**
 * Generates CORS headers based on the request origin.
 */
export const getCorsHeaders = (req: Request) => {
    const origin = req.headers.get("origin");
    const allowedOrigins = getAllowedOrigins();

    // If no allowed origins are specified, default to '*' for development 
    // but warn in production. Ideally this should be configured.
    const allowOrigin = (allowedOrigins.length === 0 || (origin && allowedOrigins.includes(origin)))
        ? (origin || "*")
        : allowedOrigins[0];

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
};

/**
 * Handles CORS preflight (OPTIONS) requests.
 */
export const handleOptions = (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: getCorsHeaders(req) });
    }
    return null;
};
