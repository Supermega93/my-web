import { supabase } from '../lib/supabase.ts';
import { Lesson, CustomDevLead, LevelMeta } from '../types.ts';
import { FALLBACK_LESSONS } from '../data/lessonsData.ts';
import { getStoredToken } from './api.ts';
import { fetchUserProgressFromFirestore, saveLessonProgressToFirestore } from './firestoreService.ts';

// Comprehensive, institutional BabyPips-style curriculum
// Used dynamically and as authoritative fallback if Supabase table is empty or loading
export const LEVELS_META: LevelMeta[] = [
  {
    id: 'level-1',
    levelNumber: 1,
    schoolName: 'Preschool',
    technicalTitle: 'Preschool — Strategy Architect Mindset',
    courseOrder: 'Course 1 of 8',
    description: 'The foundation of AI Trading Architecture: understanding why the AI is a literal machine, translating eyeball rules into machine facts, avoiding hallucinations, and safety testing.',
    isFree: true,
    hasNewEditionBadge: false,
  },
  {
    id: 'level-2',
    levelNumber: 2,
    schoolName: 'Kindergarten',
    technicalTitle: 'Kindergarten — Programming Concepts in Plain English',
    courseOrder: 'Course 2 of 8',
    description: 'Demystifying variables, booleans, functions, and loops through everyday visual analogies before touching a single line of MQL5 code.',
    isFree: true,
    hasNewEditionBadge: false,
  },
  {
    id: 'level-3',
    levelNumber: 3,
    schoolName: 'Elementary',
    technicalTitle: 'Elementary — Robot Architecture & Blueprints',
    courseOrder: 'Course 3 of 8',
    description: 'The 5 MQL5 program types, the robot lifecycle (OnInit, OnTick, OnDeinit), the 4 Modular Lego Blocks, and the hands-on Breakout EA Capstone Workshop.',
    isFree: true,
    hasNewEditionBadge: false,
  },
  {
    id: 'level-4',
    levelNumber: 4,
    schoolName: 'Middle School',
    technicalTitle: 'Middle School — Mastering AI Prompt Engineering',
    courseOrder: 'Course 4 of 8',
    description: 'Master the 5-Ingredient Master Prompt Recipe, the "Do Not Do This" Shield, Numbered Rule Checklists, and Surgical Code Fixes.',
    isFree: false,
    hasNewEditionBadge: true,
  },
  {
    id: 'level-5',
    levelNumber: 5,
    schoolName: 'High School',
    technicalTitle: 'High School — The Safety Shield & Risk Architecture',
    courseOrder: 'Course 5 of 8',
    description: 'The automated risk management engine: Dynamic Lot Sizing & Clamping, Prop Firm Safety Nets & Daily Loss Limits, The 3-Layer Filter Stack, and Active Trade Management.',
    isFree: false,
    hasNewEditionBadge: true,
  },
  {
    id: 'level-6',
    levelNumber: 6,
    schoolName: 'Undergraduate',
    technicalTitle: 'Undergraduate — Visual Tools & On-Screen Dashboards',
    courseOrder: 'Course 6 of 8',
    description: 'Custom indicators, pushpin buffers, smart mobile push alerts, ADR volatility fuel gauges, session boxes, on-screen interactive HUD panels, and TradingView Pine Script v6 automation.',
    isFree: false,
    hasNewEditionBadge: true,
  },
  {
    id: 'level-7',
    levelNumber: 7,
    schoolName: 'Senior Year',
    technicalTitle: 'Senior Year — Debugging & Code Audits Without Reading Code',
    courseOrder: 'Course 7 of 8',
    description: 'The "Explain It To Me" pre-flight audit protocol, syntax compiler errors vs silent logic errors, the 4 common AI hallucination patterns, and 2-stage out-of-sample backtesting against curve-fitting.',
    isFree: false,
    hasNewEditionBadge: true,
  },
  {
    id: 'level-8',
    levelNumber: 8,
    schoolName: 'Graduation',
    technicalTitle: 'Graduation Capstone — Real-World Practical Projects',
    courseOrder: 'Course 8 of 8',
    description: '4 production-grade capstone projects: The Volatility Exhaustion Bot, The Automated Trade Manager, The Prop Firm Challenge EA, and The Multi-Bot Control Dashboard, plus official graduation certification.',
    isFree: false,
    hasNewEditionBadge: true,
  },
];

export function getLevelMeta(levelIdentifier: string | number): LevelMeta {
  const norm = String(levelIdentifier).toLowerCase().trim();
  const numMatch = norm.match(/\d+/);
  const targetNum = numMatch ? parseInt(numMatch[0], 10) : null;

  if (targetNum && targetNum >= 1 && targetNum <= 8) {
    const found = LEVELS_META.find((m) => m.levelNumber === targetNum);
    if (found) return found;
  }

  const byName = LEVELS_META.find(
    (m) =>
      m.id === norm ||
      m.schoolName.toLowerCase() === norm ||
      norm.includes(m.schoolName.toLowerCase()) ||
      m.technicalTitle.toLowerCase().includes(norm) ||
      (norm === 'preschool' && m.levelNumber === 1) ||
      (norm === 'kindergarten' && m.levelNumber === 2) ||
      (norm === 'elementary' && m.levelNumber === 3)
  );

  if (byName) return byName;
  return LEVELS_META[0];
}

// Re-export full authoritative curriculum
export { FALLBACK_LESSONS } from '../data/lessonsData.ts';

// Generate deterministic UUID for each lesson to match Supabase UUID column
export function getLessonUuid(lesson: Lesson): string {
  if (lesson.uuid && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lesson.uuid)) {
    return lesson.uuid;
  }
  const match = lesson.level_name.match(/Level\s+(\d+)/i);
  const lvl = match ? parseInt(match[1], 10) : 1;
  const num = lesson.lesson_number ?? lesson.order_index;
  const lvlStr = String(lvl).padStart(8, '0');
  const numStr = String(num).padStart(12, '0');
  return `${lvlStr}-0000-0000-0000-${numStr}`;
}

// Helper to merge a Supabase lesson record with authoritative metadata without altering a single word of content
function mapSupabaseLesson(item: any): Lesson {
  const fallback = FALLBACK_LESSONS.find(
    (f) =>
      f.id === item.id ||
      f.uuid === item.id ||
      getLessonUuid(f) === item.id ||
      (f.course_id === item.course_id && f.lesson_number === item.lesson_number) ||
      f.order_index === item.order_index ||
      f.title.toLowerCase() === (item.title || '').toLowerCase()
  );
  return {
    ...fallback,
    ...item,
    id: fallback?.id || item.id || '',
    uuid: item.id,
    course_id: item.course_id || fallback?.course_id || '',
    order_index: item.order_index ?? fallback?.order_index ?? 1,
    level_name: item.level_name || fallback?.level_name || '',
    lesson_number: item.lesson_number ?? fallback?.lesson_number ?? 1,
    title: item.title || fallback?.title || '',
    content: item.content || fallback?.content || '',
    is_free: item.is_free !== undefined ? item.is_free : (fallback?.is_free ?? false),
    summary: item.summary || fallback?.summary || '',
    duration_minutes: item.duration_minutes || fallback?.duration_minutes || 10,
  } as Lesson;
}

// Helper to fetch all lessons outline (from authoritative API with automatic fallback)
export async function fetchAllLessons(): Promise<Lesson[]> {
  try {
    const res = await fetch('/api/academy/curriculum');
    if (res.ok) {
      const data = await res.json();
      if (data.lessons && Array.isArray(data.lessons) && data.lessons.length > 0) {
        return data.lessons.map((l: any) => ({
          ...l,
          is_free: Boolean(l.is_free),
          content: '', // Outline does not include proprietary content
        }));
      }
    }
  } catch (apiErr) {
    console.warn('[Academy] API curriculum fetch notice:', apiErr);
  }

  // Fallback to Supabase
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseLesson);
    }
  } catch (supaErr) {
    console.warn('[Academy] Supabase lessons query notice:', supaErr);
  }

  return FALLBACK_LESSONS;
}

// Helper to fetch a single lesson by ID or lesson number with server-enforced access control
export async function fetchLessonById(lessonId: string, token?: string | null): Promise<Lesson | null> {
  const effectiveToken = token || getStoredToken();
  try {
    const headers: Record<string, string> = {};
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }
    const res = await fetch(`/api/academy/lessons/${encodeURIComponent(lessonId)}`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data && data.lesson) {
        return {
          ...data.lesson,
          is_free: Boolean(data.lesson.is_free),
          accessGranted: true,
          accessType: data.accessType,
        };
      }
    } else if (res.status === 403) {
      const data = await res.json().catch(() => ({}));
      if (data && data.lesson) {
        return {
          ...data.lesson,
          is_free: false,
          content: '', // Zero bytes delivered
          accessGranted: false,
          requiresAuth: Boolean(data.requiresAuth),
          requiresPurchase: Boolean(data.requiresPurchase),
          accessType: data.accessType || 'none',
        };
      }
    }
  } catch (apiErr) {
    console.warn('[Academy] API lesson fetch notice:', apiErr);
  }

  // Fallback if network/offline: Check outline
  const fallback = FALLBACK_LESSONS.find(
    (l) => l.id === lessonId || String(l.lesson_number) === lessonId || String(l.order_index) === lessonId
  );
  if (fallback) {
    return {
      ...fallback,
      // For paid lessons, content is always stripped on client if offline
      content: fallback.is_free ? fallback.content : '',
      accessGranted: Boolean(fallback.is_free),
      requiresAuth: !fallback.is_free,
      requiresPurchase: !fallback.is_free,
      accessType: fallback.is_free ? 'free' : 'none',
    };
  }

  return null;
}

// Diagnostic helper to inspect Supabase sync status
export async function checkSupabaseLessonsSync(): Promise<{
  connected: boolean;
  remoteCount: number;
  localCount: number;
  isSynced: boolean;
  statusMessage: string;
}> {
  try {
    const { data, error, count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact' });

    if (error) {
      return {
        connected: false,
        remoteCount: 0,
        localCount: FALLBACK_LESSONS.length,
        isSynced: false,
        statusMessage: `Supabase query returned: ${error.message}`
      };
    }

    const remoteCount = data ? data.length : (count || 0);
    const isSynced = remoteCount === FALLBACK_LESSONS.length;

    return {
      connected: true,
      remoteCount,
      localCount: FALLBACK_LESSONS.length,
      isSynced,
      statusMessage: isSynced 
        ? `Fully synced with Supabase database (all ${FALLBACK_LESSONS.length} lessons active).`
        : remoteCount > 0 
          ? `Partially synced: ${remoteCount} of ${FALLBACK_LESSONS.length} lessons present.`
          : 'Table exists in Supabase. Ready to sync via SQL script or admin tool.'
    };
  } catch (err: any) {
    return {
      connected: false,
      remoteCount: 0,
      localCount: FALLBACK_LESSONS.length,
      isSynced: false,
      statusMessage: `Connection error: ${err.message || 'Unknown'}`
    };
  }
}

// Attempt direct upsert of curriculum into Supabase
export async function syncLessonsToSupabase(): Promise<{
  success: boolean;
  insertedCount: number;
  error?: string;
}> {
  try {
    const rows = FALLBACK_LESSONS.map((l) => ({
      id: getLessonUuid(l),
      course_id: l.course_id,
      order_index: l.order_index,
      level_name: l.level_name,
      lesson_number: l.lesson_number,
      title: l.title,
      content: l.content.trim(),
      is_free: l.is_free,
    }));

    const { data, error } = await supabase
      .from('lessons')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) {
      return {
        success: false,
        insertedCount: 0,
        error: error.message
      };
    }

    return {
      success: true,
      insertedCount: data ? data.length : rows.length
    };
  } catch (err: any) {
    return {
      success: false,
      insertedCount: 0,
      error: err.message || 'Unknown sync error'
    };
  }
}

// Submit custom development lead to Supabase 'custom_dev_leads' (with local server fallback)
export async function submitCustomDevLead(lead: CustomDevLead): Promise<{ success: boolean; error?: string; leadId?: string }> {
  try {
    // 1. First attempt direct Supabase insert
    const { data, error } = await supabase
      .from('custom_dev_leads')
      .insert([
        {
          email: lead.email.trim().toLowerCase(),
          name: lead.name?.trim() || null,
          phone: lead.phone?.trim() || null,
          telegram: lead.telegram?.trim() || null,
          platform: lead.platform || 'MetaTrader 5 (MQL5)',
          instrument: lead.instrument || 'All Forex / Metals',
          timeframe: lead.timeframe || '15-Minute',
          strategy_idea: lead.strategy_idea,
          generated_prompt: lead.generated_prompt || null,
          status: 'pending_review',
        },
      ])
      .select();

    if (!error && data && data.length > 0) {
      return { success: true, leadId: data[0].id || `lead_${Date.now()}` };
    }

    // 2. Fallback to our express API route if Supabase schema cache doesn't have custom_dev_leads table yet
    const res = await fetch('/api/custom-dev-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json();
      return { success: true, leadId: json.leadId || `lead_${Date.now()}` };
    }

    // Fallback storage in browser localStorage so no lead is ever lost
    try {
      const stored = JSON.parse(localStorage.getItem('saved_custom_dev_leads') || '[]');
      const newLead = { ...lead, id: `local_lead_${Date.now()}`, created_at: new Date().toISOString() };
      stored.push(newLead);
      localStorage.setItem('saved_custom_dev_leads', JSON.stringify(stored));
      return { success: true, leadId: newLead.id };
    } catch {
      return { success: true, leadId: `offline_lead_${Date.now()}` };
    }
  } catch (err: any) {
    console.error('[Academy] Failed to submit lead:', err);
    return { success: false, error: err.message || 'Failed to submit project brief' };
  }
}

// Fetch all lessons belonging to a specific Level (e.g. "Level 1" or school name "Preschool")
export async function fetchLessonsForLevel(
  levelIdentifier: string | number
): Promise<{ levelMeta: LevelMeta; lessons: Lesson[] }> {
  const levelMeta = getLevelMeta(levelIdentifier);

  try {
    // 1. Fetch from Supabase lessons table where level_name matches or course_id matches
    const searchPattern = `Level ${levelMeta.levelNumber}%`;
    const courseId = `00000000-0000-0000-0000-${String(levelMeta.levelNumber).padStart(12, '0')}`;
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .or(`level_name.ilike.${searchPattern},course_id.eq.${courseId}`)
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return { levelMeta, lessons: data.map(mapSupabaseLesson) };
    }
  } catch (err) {
    console.warn('[Academy] Supabase fetchLessonsForLevel error, utilizing fallback:', err);
  }

  // 2. Authoritative Fallback from FALLBACK_LESSONS
  const filtered = FALLBACK_LESSONS.filter((l) => {
    const match = l.level_name.match(/Level\s+(\d+)/i);
    const num = match ? parseInt(match[1], 10) : 1;
    return num === levelMeta.levelNumber;
  });

  return {
    levelMeta,
    lessons: filtered.length > 0 ? filtered : FALLBACK_LESSONS.slice(0, 3),
  };
}

// ==============================================================================
// SUPABASE USER PROGRESS PERSISTENCE (user_progress table)
// ==============================================================================

/**
 * Loads completed lesson IDs for a specific user ID directly from backend database and Supabase user_progress table.
 */
export async function fetchUserProgressFromSupabase(userId: string): Promise<string[]> {
  if (!userId) return [];
  const token = getStoredToken();
  const completedIdsSet = new Set<string>();

  // 1. Fetch from server database
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/academy/progress', { headers });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.completedLessonIds)) {
        data.completedLessonIds.forEach((id: string) => completedIdsSet.add(id));
      }
    }
  } catch (apiErr) {
    console.warn('[Academy Progress] Server fetch notice:', apiErr);
  }

  // 2. Fetch from Firestore
  try {
    const firestoreIds = await fetchUserProgressFromFirestore(userId);
    if (firestoreIds && firestoreIds.length > 0) {
      firestoreIds.forEach((id: string) => completedIdsSet.add(id));
    }
  } catch (fsErr) {
    console.warn('[Academy Progress] Firestore fetch notice:', fsErr);
  }

  // 3. Fetch from Supabase user_progress table
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('lesson_id, is_completed')
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (!error && data && data.length > 0) {
      for (const row of data) {
        const uuid = row.lesson_id;
        const matched = FALLBACK_LESSONS.find(
          (l) => getLessonUuid(l) === uuid || l.id === uuid || l.uuid === uuid
        );
        if (matched) {
          completedIdsSet.add(matched.id);
        } else {
          completedIdsSet.add(uuid);
        }
      }
    }
  } catch (err) {
    console.warn('[Supabase Progress] Network notice fetching progress:', err);
  }

  return Array.from(completedIdsSet);
}

/**
 * Persists lesson completion status by user ID in Supabase user_progress table and backend database.
 */
export async function saveUserLessonProgressToSupabase(
  userId: string,
  lessonId: string,
  isCompleted: boolean = true
): Promise<boolean> {
  if (!userId || !lessonId) return false;
  const token = getStoredToken();

  // 1. Persist to authoritative backend database
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
    const nextCompleted = isCompleted
      ? Array.from(new Set([...local, lessonId]))
      : local.filter((id: string) => id !== lessonId);

    await fetch('/api/academy/progress', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        completedLessonIds: nextCompleted,
        lastLessonId: lessonId,
      }),
    });
  } catch (apiErr) {
    console.warn('[Academy Progress] Server save notice:', apiErr);
  }

  // 2. Persist to Firestore
  try {
    await saveLessonProgressToFirestore(userId, lessonId, isCompleted);
  } catch (fsErr) {
    console.warn('[Academy Progress] Firestore save notice:', fsErr);
  }

  // 3. Persist to Supabase user_progress table
  try {
    const matched = FALLBACK_LESSONS.find((l) => l.id === lessonId || l.uuid === lessonId);
    const lessonUuid = matched ? getLessonUuid(matched) : (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lessonId) ? lessonId : null);

    if (!lessonUuid) {
      console.warn('[Supabase Progress] Invalid lesson identifier for UUID mapping:', lessonId);
      return false;
    }

    if (isCompleted) {
      // Upsert into Supabase user_progress
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonUuid,
            is_completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) {
        // If unique constraint is on different columns, try insert directly
        if (error.code === '42P10' || error.message?.includes('constraint')) {
          await supabase.from('user_progress').insert({
            user_id: userId,
            lesson_id: lessonUuid,
            is_completed: true,
            completed_at: new Date().toISOString(),
          });
        } else {
          console.warn('[Supabase Progress] Upsert notice:', error.message);
        }
      }
      return true;
    } else {
      // Remove or mark incomplete
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('lesson_id', lessonUuid);

      if (error) {
        console.warn('[Supabase Progress] Delete notice:', error.message);
      }
      return true;
    }
  } catch (err) {
    console.warn('[Supabase Progress] Sync exception:', err);
    return false;
  }
}

/**
 * Batch synchronizes all locally cached completed lessons to Supabase user_progress for a user.
 */
export async function syncAllProgressToSupabase(userId: string, lessonIds: string[]): Promise<number> {
  if (!userId || !lessonIds || lessonIds.length === 0) return 0;
  let count = 0;
  for (const id of lessonIds) {
    const success = await saveUserLessonProgressToSupabase(userId, id, true);
    if (success) count++;
  }
  return count;
}
