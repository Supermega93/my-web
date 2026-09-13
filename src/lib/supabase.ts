import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 1. SUPABASE CONFIGURATION VALUES
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;

export const SUPABASE_URL: string =
  metaEnv?.VITE_SUPABASE_URL ||
  metaEnv?.SUPABASE_URL ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('http') ? process.env.SUPABASE_URL : undefined) ||
  'https://xbrhalmcvpxutxojemoj.supabase.co';

export const SUPABASE_REST_URL: string =
  metaEnv?.VITE_SUPABASE_REST_URL ||
  metaEnv?.SUPABASE_REST_URL ||
  'https://xbrhalmcvpxutxojemoj.supabase.co/rest/v1/';

export const SUPABASE_ANON_KEY: string =
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  metaEnv?.SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY && !process.env.SUPABASE_ANON_KEY.startsWith('http') ? process.env.SUPABASE_ANON_KEY : undefined) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('sb_publishable_') ? process.env.SUPABASE_URL : undefined) ||
  'sb_publishable_7UqK_UbkxtEDg_i_drYesw_9pdbJS0c';

// Clean base URL for Supabase client
export function normalizeSupabaseUrl(url?: string): string {
  if (!url || typeof url !== 'string') return 'https://xbrhalmcvpxutxojemoj.supabase.co';
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

const normalizedBaseUrl = normalizeSupabaseUrl(SUPABASE_URL);

export const isSupabaseConfigured = true;

// 2. CLIENT INITIALIZATION
export const supabase: SupabaseClient = createClient(
  normalizedBaseUrl || 'https://xbrhalmcvpxutxojemoj.supabase.co',
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Attach client instance to window object for global runtime access and debugging
if (typeof window !== 'undefined') {
  (window as unknown as { supabase: SupabaseClient }).supabase = supabase;
}

// 3. SILENT CONNECTION TEST
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: unknown }> {
  try {
    const res = await fetch(`${normalizedBaseUrl}/auth/v1/health`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }).catch(() => null);

    if (res && !res.ok && (res.status === 401 || res.status === 403)) {
      console.error(
        `[Supabase Error] Connection failed: API keys are invalid or missing (HTTP ${res.status}).`
      );
      return { success: false, error: new Error(`HTTP ${res.status}`) };
    }

    return { success: true };
  } catch (err) {
    console.error('[Supabase Error] Connection failed: API keys are invalid or missing.', err);
    return { success: false, error: err };
  }
}

// Execute connection test on startup
testSupabaseConnection();

export default supabase;
