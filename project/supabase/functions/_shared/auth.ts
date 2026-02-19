// supabase/functions/_shared/auth.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Verifies the JWT from the Authorization header and returns the user.
 * Throws an error if authorization is missing or invalid.
 */
export const verifyAuth = async (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        throw new Error('Missing Authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: { Authorization: authHeader },
        },
    });

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error('Unauthorized');
    }

    return { user, supabase };
};

/**
 * Unified error response generator for edge functions.
 */
export const createErrorResponse = (error: string, status = 400, headers = {}) => {
    return new Response(
        JSON.stringify({ error, success: false }),
        {
            status,
            headers: { ...headers, 'Content-Type': 'application/json' }
        }
    );
};
