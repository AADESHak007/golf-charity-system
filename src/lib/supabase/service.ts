import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables');
}

/**
 * Supabase service role client singleton.
 * Bypasses RLS (Row Level Security) - only use this inside server-side
 * background workers or webhook handlers where we must manage data 
 * independent of the authenticated user's session.
 */
export const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
