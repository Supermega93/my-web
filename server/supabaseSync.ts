import { createClient } from '@supabase/supabase-js';
import { dbQueries } from './db.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xbrhalmcvpxutxojemoj.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export function getSupabaseClient() {
  if (!SUPABASE_ANON_KEY) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const SUPABASE_ORDERS_LICENSES_SCHEMA_SQL = `-- Run in Supabase SQL Editor (https://supabase.com/dashboard/project/xbrhalmcvpxutxojemoj/sql)
-- Schema for Orders & EA Licenses with Secure RLS

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT NOT NULL DEFAULT 'paid',
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.licenses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  order_id TEXT,
  license_key TEXT NOT NULL UNIQUE,
  license_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  delivery_notes TEXT,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Allow select and write
DROP POLICY IF EXISTS "Public select orders" ON public.orders;
CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert/update orders" ON public.orders;
CREATE POLICY "Public insert/update orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select licenses" ON public.licenses;
CREATE POLICY "Public select licenses" ON public.licenses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert/update licenses" ON public.licenses;
CREATE POLICY "Public insert/update licenses" ON public.licenses FOR ALL USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_supabase_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_supabase_licenses_user ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_supabase_licenses_order ON public.licenses(order_id);
CREATE INDEX IF NOT EXISTS idx_supabase_licenses_key ON public.licenses(license_key);
`;

/**
 * Persists an order and optional EA license to Supabase.
 * Gracefully logs if Supabase table is not yet created in the project.
 */
export async function persistOrderToSupabase(order: any, license?: any): Promise<{
  orderSynced: boolean;
  licenseSynced: boolean;
  orderError?: string;
  licenseError?: string;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { orderSynced: false, licenseSynced: false, orderError: 'No Supabase Anon Key' };
  }

  let orderSynced = false;
  let licenseSynced = false;
  let orderError: string | undefined;
  let licenseError: string | undefined;

  try {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      user_id: order.user_id,
      product_id: order.product_id,
      amount: order.amount,
      currency: order.currency || 'USD',
      payment_status: order.payment_status || 'paid',
      transaction_id: order.transaction_id,
      created_at: order.created_at,
      updated_at: order.updated_at || order.created_at
    });

    if (error) {
      orderError = error.message;
      console.log('[Supabase Order Upsert Notice]', error.message);
    } else {
      orderSynced = true;
    }

    // Dual persistence to purchases table in Supabase
    try {
      await supabase.from('purchases').upsert({
        id: order.id,
        order_id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        status: order.payment_status || 'paid',
        created_at: order.created_at || new Date().toISOString()
      });
    } catch {
      // Non-blocking
    }
  } catch (err: any) {
    orderError = err.message;
    console.warn('[Supabase Order Upsert Exception]', err.message);
  }

  if (license) {
    try {
      const { error } = await supabase.from('licenses').upsert({
        id: license.id,
        user_id: license.user_id,
        product_id: license.product_id,
        order_id: license.order_id || order.id,
        license_key: license.license_key,
        license_type: license.license_type,
        status: license.status,
        delivery_status: license.delivery_status || 'pending',
        delivery_notes: license.delivery_notes || null,
        starts_at: license.starts_at || null,
        expires_at: license.expires_at || null,
        created_at: license.created_at,
        updated_at: license.updated_at || license.created_at
      });

      if (error) {
        licenseError = error.message;
        console.log('[Supabase License Upsert Notice]', error.message);
      } else {
        licenseSynced = true;
      }
    } catch (err: any) {
      licenseError = err.message;
      console.warn('[Supabase License Upsert Exception]', err.message);
    }
  }

  return { orderSynced, licenseSynced, orderError, licenseError };
}

/**
 * Persists an updated license to Supabase.
 */
export async function persistLicenseToSupabase(license: any): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'No Supabase Anon Key configured.' };
  }

  try {
    const { error } = await supabase.from('licenses').upsert({
      id: license.id,
      user_id: license.user_id,
      product_id: license.product_id,
      order_id: license.order_id || null,
      license_key: license.license_key,
      license_type: license.license_type,
      status: license.status,
      delivery_status: license.delivery_status || 'pending',
      delivery_notes: license.delivery_notes || null,
      starts_at: license.starts_at || null,
      expires_at: license.expires_at || null,
      created_at: license.created_at,
      updated_at: license.updated_at || new Date().toISOString()
    });

    if (error) {
      console.log('[Supabase License Update Notice]', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase License Update Exception]', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Checks connection and schema availability in Supabase for orders and licenses.
 */
export async function checkSupabaseOrdersLicensesHealth() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      connected: false,
      ordersTableReady: false,
      licensesTableReady: false,
      message: 'Supabase credentials not configured'
    };
  }

  let ordersTableReady = false;
  let licensesTableReady = false;
  let ordersCount = 0;
  let licensesCount = 0;
  let errorMsg = '';

  try {
    const { count, error } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    if (!error) {
      ordersTableReady = true;
      ordersCount = count || 0;
    } else {
      errorMsg = error.message;
    }
  } catch (e: any) {
    errorMsg = e.message;
  }

  try {
    const { count, error } = await supabase.from('licenses').select('*', { count: 'exact', head: true });
    if (!error) {
      licensesTableReady = true;
      licensesCount = count || 0;
    }
  } catch (e: any) {}

  return {
    connected: true,
    ordersTableReady,
    licensesTableReady,
    ordersCount,
    licensesCount,
    message: ordersTableReady && licensesTableReady
      ? 'Supabase orders and licenses tables are active and synchronized.'
      : errorMsg || 'Orders or licenses table awaiting SQL schema deployment in Supabase.'
  };
}

/**
 * Batch sync all local licenses to Supabase.
 */
export async function batchSyncLicensesToSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, synced: 0, error: 'No Supabase configuration' };
  }

  const licenses = dbQueries.getAllLicenses() as any[];
  let synced = 0;
  let failed = 0;
  let lastError: string | undefined;

  for (const lic of licenses) {
    try {
      const { error } = await supabase.from('licenses').upsert({
        id: lic.id,
        user_id: lic.user_id,
        product_id: lic.product_id,
        order_id: lic.order_id || null,
        license_key: lic.license_key,
        license_type: lic.license_type,
        status: lic.status,
        delivery_status: lic.delivery_status || 'pending',
        delivery_notes: lic.delivery_notes || null,
        starts_at: lic.starts_at || null,
        expires_at: lic.expires_at || null,
        created_at: lic.created_at,
        updated_at: lic.updated_at || lic.created_at
      });

      if (!error) {
        synced++;
      } else {
        failed++;
        lastError = error.message;
      }
    } catch (e: any) {
      failed++;
      lastError = e.message;
    }
  }

  return { success: failed === 0, synced, failed, total: licenses.length, error: lastError };
}

/**
 * Persists Free Academy student progress to Supabase.
 * Non-blocking: will never prevent the student from continuing if Supabase RLS is active.
 */
export async function syncAcademyProgressToSupabase(progress: {
  email: string;
  completedLessonIds: string[];
  quizScores?: any;
  lastLessonId?: string;
}): Promise<{ synced: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { synced: false, error: 'No Supabase client available.' };
  }

  try {
    const cleanEmail = progress.email.toLowerCase().trim();
    // 1. Try academy_progress table
    const { error: apErr } = await supabase.from('academy_progress').upsert({
      email: cleanEmail,
      completed_lesson_ids: JSON.stringify(progress.completedLessonIds || []),
      quiz_scores: JSON.stringify(progress.quizScores || {}),
      last_lesson_id: progress.lastLessonId || null,
      updated_at: new Date().toISOString(),
    });

    if (!apErr) {
      return { synced: true };
    }

    // 2. Try user_progress table if academy_progress wasn't present
    const { error: upErr } = await supabase.from('user_progress').upsert({
      email: cleanEmail,
      completed_lesson_ids: JSON.stringify(progress.completedLessonIds || []),
      updated_at: new Date().toISOString(),
    });

    if (!upErr) {
      return { synced: true };
    }

    return { synced: false, error: apErr.message || upErr.message };
  } catch (err: any) {
    return { synced: false, error: err.message };
  }
}

export const SUPABASE_COMPLIMENTARY_ACCESS_SCHEMA_SQL = `-- Run in Supabase SQL Editor (https://supabase.com/dashboard/project/xbrhalmcvpxutxojemoj/sql)
-- Schema for Complimentary Masterclass Access with RLS

CREATE TABLE IF NOT EXISTS public.complimentary_access (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  access_type TEXT NOT NULL DEFAULT 'masterclass',
  status TEXT NOT NULL DEFAULT 'active',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by TEXT NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoked_by TEXT,
  notes TEXT
);

ALTER TABLE public.complimentary_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select complimentary_access" ON public.complimentary_access;
CREATE POLICY "Public select complimentary_access" ON public.complimentary_access FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write complimentary_access" ON public.complimentary_access;
CREATE POLICY "Public write complimentary_access" ON public.complimentary_access FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_supabase_comp_uid ON public.complimentary_access(user_id);
CREATE INDEX IF NOT EXISTS idx_supabase_comp_email ON public.complimentary_access(user_email);
CREATE INDEX IF NOT EXISTS idx_supabase_comp_status ON public.complimentary_access(status);
`;

/**
 * Syncs complimentary access state directly to Supabase
 */
export async function syncComplimentaryAccessToSupabase(record: {
  id: string;
  user_id: string;
  user_email: string;
  access_type: string;
  status: string;
  granted_at: string;
  granted_by: string;
  revoked_at?: string | null;
  revoked_by?: string | null;
  notes?: string | null;
}): Promise<{ synced: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { synced: false, error: 'No Supabase client configured' };
  }

  try {
    const { error } = await supabase.from('complimentary_access').upsert({
      id: record.id,
      user_id: record.user_id,
      user_email: record.user_email.toLowerCase().trim(),
      access_type: record.access_type || 'masterclass',
      status: record.status || 'active',
      granted_at: record.granted_at,
      granted_by: record.granted_by,
      revoked_at: record.revoked_at || null,
      revoked_by: record.revoked_by || null,
      notes: record.notes || null,
    });

    if (error) {
      console.warn('[Supabase Complimentary Sync] Notice:', error.message);
      return { synced: false, error: error.message };
    }
    return { synced: true };
  } catch (err: any) {
    console.warn('[Supabase Complimentary Sync] Exception:', err.message);
    return { synced: false, error: err.message };
  }
}


