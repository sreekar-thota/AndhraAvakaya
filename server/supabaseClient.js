import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

/**
 * Check if valid Supabase credentials are configured
 */
export function isSupabaseConfigured() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return false;
  if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-supabase-')) return false;
  return true;
}

/**
 * Get or initialize the Supabase server client
 * Uses service role key for administrative operations and bypassing RLS on server endpoints.
 * Falls back to anon key if service role key is not provided.
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  // Prioritize service role key on server, fallback to anon key
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return supabaseInstance;
  } catch (err) {
    console.error('[supabaseClient] Failed to initialize Supabase client:', err.message);
    return null;
  }
}

