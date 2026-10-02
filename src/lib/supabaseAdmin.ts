import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.ts';

// 1. ENVIRONMENT CONFIGURATION & SERVICE ROLE KEY RESOLUTION
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;

const rawKey =
  (typeof process !== 'undefined' && process.env?.SUPABASE_SERVICE_ROLE_KEY) ||
  metaEnv?.SUPABASE_SERVICE_ROLE_KEY ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_SERVICE_ROLE_KEY) ||
  metaEnv?.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const env = {
  SUPABASE_URL:
    (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    metaEnv?.VITE_SUPABASE_URL ||
    metaEnv?.SUPABASE_URL ||
    SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: (rawKey && !rawKey.startsWith('sb_publishable_')) ? rawKey : SUPABASE_ANON_KEY,
};

export const SUPABASE_SERVICE_ROLE_KEY: string = env.SUPABASE_SERVICE_ROLE_KEY;

const normalizedUrl = normalizeSupabaseUrl(env.SUPABASE_URL);

export const isServiceRoleConfigured = Boolean(
  env.SUPABASE_SERVICE_ROLE_KEY &&
  env.SUPABASE_SERVICE_ROLE_KEY !== SUPABASE_ANON_KEY
);

// 2. BACKEND/ADMIN CLIENT INITIALIZATION
// Initializing the Supabase client with the service role key for backend-only operations
export const supabaseAdmin: SupabaseClient = createClient(
  normalizedUrl,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

/**
 * Returns the initialized Supabase Admin client instance
 */
export function getSupabaseAdmin(): SupabaseClient {
  return supabaseAdmin;
}

// 3. TYPES FOR SUPABASE BACKEND ENTITIES
export interface SupabaseUserProfile {
  id: string; // Maps to Firebase UID
  email: string;
  name?: string;
  phone?: string | null;
  role: 'admin' | 'customer' | 'developer';
  access_status: 'free' | 'paid' | 'complimentary';
  can_access_masterclass: boolean;
  client_type?: 'academy' | 'product' | 'both' | 'registration';
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

export interface SupabaseEntitlement {
  id: string;
  user_id: string;
  user_email: string;
  access_type: 'masterclass' | 'ea_lifetime' | 'mentorship' | 'custom_dev';
  status: 'active' | 'revoked' | 'expired';
  granted_by: string;
  granted_at: string;
  revoked_at?: string | null;
  revoked_by?: string | null;
  notes?: string | null;
}

export interface SupabaseActivityLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  category: 'auth' | 'academy' | 'purchase' | 'license' | 'admin' | 'entitlement';
  details?: Record<string, any>;
  status: 'success' | 'warning' | 'error';
  ip_address?: string;
  created_at: string;
}

export interface SupabaseAcademyClientRecord {
  user_id: string;
  email: string;
  name?: string;
  completed_lessons_count: number;
  total_progress_pct: number;
  highest_level: number;
  quizzes_passed: number;
  access_tier: 'free' | 'paid' | 'complimentary';
  last_active: string;
}

export interface SupabaseProductClientRecord {
  user_id: string;
  email: string;
  name?: string;
  product_name: string;
  product_type: string;
  license_key?: string;
  license_status?: string;
  amount: number;
  currency: string;
  purchased_at: string;
}

// 4. FIREBASE AUTH -> SUPABASE SYNC CONNECTOR
/**
 * Maps a Firebase Auth user to Supabase profile and stores persistent identity.
 */
export async function syncFirebaseUserToSupabase(userData: {
  id: string;
  email: string;
  name?: string;
  phone?: string | null;
  role?: string;
  emailVerified?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: userData.id,
      email: userData.email.toLowerCase().trim(),
      name: userData.name || userData.email.split('@')[0],
      phone: userData.phone || null,
      role: userData.role || 'customer',
      updated_at: new Date().toISOString(),
    };

    // Upsert into Supabase profiles / users table
    const { error: profileErr } = await supabaseAdmin
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (profileErr) {
      // Fallback try to 'users' table
      const { error: userErr } = await supabaseAdmin
        .from('users')
        .upsert(payload, { onConflict: 'id' });

      if (userErr && !userErr.message.includes('relation "users" does not exist')) {
        console.warn('[Supabase Admin] Sync user fallback notice:', userErr.message);
      }
    }

    // Log the successful sync/auth event in activity logs
    await logSupabaseActivity({
      userId: userData.id,
      userEmail: userData.email,
      action: 'FIREBASE_AUTH_SYNCED',
      category: 'auth',
      details: { emailVerified: userData.emailVerified, role: userData.role },
      status: 'success',
    });

    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase Admin] syncFirebaseUserToSupabase notice:', err.message);
    return { success: false, error: err.message };
  }
}

// 5. ACTIVITY LOGS (AUDIT TRAIL)
/**
 * Records a real-time event to Supabase activity_logs
 */
export async function logSupabaseActivity(params: {
  userId?: string;
  userEmail?: string;
  action: string;
  category?: 'auth' | 'academy' | 'purchase' | 'license' | 'admin' | 'entitlement';
  details?: Record<string, any>;
  status?: 'success' | 'warning' | 'error';
}): Promise<boolean> {
  try {
    const logItem = {
      user_id: params.userId || null,
      user_email: params.userEmail || null,
      action: params.action,
      category: params.category || 'admin',
      details: params.details || {},
      status: params.status || 'success',
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from('activity_logs').insert([logItem]);
    if (error) {
      // Table may not exist yet or RLS policy; silently log locally
      console.info('[Supabase Admin Log]', logItem.action, logItem.user_email || '');
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Retrieves latest activity logs for live monitoring
 */
export async function getSupabaseActivityLogs(limit = 50): Promise<SupabaseActivityLog[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }
    return data as SupabaseActivityLog[];
  } catch {
    return [];
  }
}

// 6. ENTITLEMENTS & ACCESS MANAGEMENT
/**
 * Retrieves all entitlements from Supabase complimentary_access and entitlements
 */
export async function getSupabaseEntitlements(): Promise<SupabaseEntitlement[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('complimentary_access')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id || `ent_${item.user_id}`,
      user_id: item.user_id,
      user_email: item.user_email || item.email,
      access_type: item.access_type || 'masterclass',
      status: item.status || 'active',
      granted_by: item.granted_by || 'Admin',
      granted_at: item.granted_at || item.created_at || new Date().toISOString(),
      revoked_at: item.revoked_at || null,
      revoked_by: item.revoked_by || null,
      notes: item.notes || null,
    }));
  } catch {
    return [];
  }
}

/**
 * Grants access entitlement directly in Supabase
 */
export async function grantSupabaseEntitlement(params: {
  userId: string;
  email: string;
  accessType?: 'masterclass' | 'ea_lifetime' | 'mentorship' | 'masterclass_99' | 'masterclass_ea_169' | 'masterclass_vip_299' | string;
  notes?: string;
  grantedBy?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      user_id: params.userId,
      email: params.email.toLowerCase().trim(),
      user_email: params.email.toLowerCase().trim(),
      access_type: params.accessType || 'masterclass',
      status: 'active',
      granted_by: params.grantedBy || 'admin',
      notes: params.notes || 'Granted via Admin Dashboard',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from('complimentary_access')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      throw error;
    }

    await logSupabaseActivity({
      userId: params.userId,
      userEmail: params.email,
      action: 'ENTITLEMENT_GRANTED',
      category: 'entitlement',
      details: { accessType: params.accessType || 'masterclass', notes: params.notes },
      status: 'success',
    });

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase Admin] grantSupabaseEntitlement error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Revokes access entitlement in Supabase
 */
export async function revokeSupabaseEntitlement(params: {
  userId: string;
  email: string;
  revokedBy?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('complimentary_access')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by: params.revokedBy || 'admin',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', params.userId);

    if (error) {
      throw error;
    }

    await logSupabaseActivity({
      userId: params.userId,
      userEmail: params.email,
      action: 'ENTITLEMENT_REVOKED',
      category: 'entitlement',
      status: 'warning',
    });

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase Admin] revokeSupabaseEntitlement error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Checks if a specific user has an active entitlement in Supabase
 */
export async function checkUserSupabaseEntitlement(
  userId: string,
  email?: string
): Promise<{ hasMasterclass: boolean; entitlement?: SupabaseEntitlement | null }> {
  try {
    let query = supabaseAdmin
      .from('complimentary_access')
      .select('*')
      .eq('status', 'active');

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('email', email.toLowerCase().trim());
    }

    const { data, error } = await query.limit(1);

    if (error || !data || data.length === 0) {
      return { hasMasterclass: false, entitlement: null };
    }

    return {
      hasMasterclass: true,
      entitlement: data[0] as SupabaseEntitlement,
    };
  } catch {
    return { hasMasterclass: false, entitlement: null };
  }
}

// 7. ACADEMY & PRODUCT CLIENT QUERIES
/**
 * Fetches users with segmented client tags: Academy vs Product/EA Clients
 */
export async function getSupabaseSegmentedClients(): Promise<{
  academyClients: SupabaseAcademyClientRecord[];
  productClients: SupabaseProductClientRecord[];
}> {
  try {
    const [progressRes, ordersRes, licensesRes] = await Promise.all([
      supabaseAdmin.from('user_progress').select('*'),
      supabaseAdmin.from('orders').select('*'),
      supabaseAdmin.from('licenses').select('*'),
    ]);

    const academyClients: SupabaseAcademyClientRecord[] = (progressRes.data || []).map((p: any) => ({
      user_id: p.user_id,
      email: p.user_email || p.email || 'student@megaai.app',
      name: p.name || 'Academy Student',
      completed_lessons_count: Array.isArray(p.completed_lesson_ids) ? p.completed_lesson_ids.length : 0,
      total_progress_pct: Math.min(100, Math.round(((Array.isArray(p.completed_lesson_ids) ? p.completed_lesson_ids.length : 0) / 32) * 100)),
      highest_level: p.highest_level || 1,
      quizzes_passed: p.quizzes_passed || 0,
      access_tier: p.access_tier || 'free',
      last_active: p.updated_at || p.created_at || new Date().toISOString(),
    }));

    const productClients: SupabaseProductClientRecord[] = (ordersRes.data || []).map((o: any) => {
      const matchedLicense = (licensesRes.data || []).find((l: any) => l.order_id === o.id || l.user_id === o.user_id);
      return {
        user_id: o.user_id,
        email: o.user_email || o.email || 'client@megaai.app',
        name: o.user_name || 'EA Client',
        product_name: o.product_name || o.product_id || 'EA License',
        product_type: o.product_type || 'EA',
        license_key: matchedLicense?.license_key || 'PENDING-EFT-VERIFICATION',
        license_status: matchedLicense?.status || o.payment_status || 'active',
        amount: Number(o.amount || o.amount_usd || 0),
        currency: o.currency || 'USD',
        purchased_at: o.created_at || new Date().toISOString(),
      };
    });

    return { academyClients, productClients };
  } catch (err) {
    console.warn('[Supabase Admin] getSupabaseSegmentedClients notice:', err);
    return { academyClients: [], productClients: [] };
  }
}

// 8. HEALTH TEST FOR ADMIN CONSOLE
export async function testSupabaseAdminConnection(): Promise<{
  connected: boolean;
  serviceRoleActive: boolean;
  url: string;
  error?: string;
}> {
  try {
    const { data: bucketData, error: bucketErr } = await supabaseAdmin.storage.listBuckets();
    if (bucketErr) {
      return {
        connected: false,
        serviceRoleActive: false,
        url: normalizedUrl,
        error: bucketErr.message,
      };
    }
    return {
      connected: true,
      serviceRoleActive: isServiceRoleConfigured,
      url: normalizedUrl,
    };
  } catch (err: any) {
    return {
      connected: false,
      serviceRoleActive: false,
      url: normalizedUrl,
      error: err.message,
    };
  }
}

export default supabaseAdmin;
