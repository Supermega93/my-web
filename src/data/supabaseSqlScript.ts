import { FALLBACK_LESSONS } from './lessonsData.ts';
import { getLessonUuid, LEVELS_META } from '../services/academy.ts';
import { Lesson } from '../types.ts';

// Helper to escape values for standard CSV RFC 4180
function toCsvField(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function lessonsToCsv(lessons: Lesson[]): string {
  const header = 'id,course_id,order_index,level_name,lesson_number,title,content,is_free';
  const rows = lessons.map((l) =>
    [
      toCsvField(getLessonUuid(l)),
      toCsvField(l.course_id),
      toCsvField(l.order_index),
      toCsvField(l.level_name),
      toCsvField(l.lesson_number),
      toCsvField(l.title),
      toCsvField(l.content),
      toCsvField(l.is_free),
    ].join(',')
  );
  return [header, ...rows].join('\n');
}

function lessonToSqlInsert(l: Lesson): string {
  const uuid = getLessonUuid(l);
  return `INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '${uuid}',
  '${l.course_id}',
  ${l.order_index},
  $BODY$${l.level_name}$BODY$,
  ${l.lesson_number},
  $BODY$${l.title}$BODY$,
  $BODY$${l.content}$BODY$,
  ${l.is_free ? 'true' : 'false'}
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;`;
}

// 1. Missing lessons specifically identified: 6.4, 7.4, 8.1, 8.2, 8.3, 8.4
const MISSING_LESSONS_TARGETS = [
  'lesson-6-4',
  'lesson-7-4',
  'lesson-8-1',
  'lesson-8-2',
  'lesson-8-3',
  'lesson-8-4',
];

export const MISSING_LESSONS = FALLBACK_LESSONS.filter((l) =>
  MISSING_LESSONS_TARGETS.includes(l.id)
);

// 2. Levels 4 through 8 lessons (Middle School, High School, Undergraduate, Senior Year, Graduation)
export const LEVELS_4_TO_8_LESSONS = FALLBACK_LESSONS.filter((l) => {
  const match = l.level_name.match(/Level\s+(\d+)/i);
  const lvl = match ? parseInt(match[1], 10) : 0;
  return lvl >= 4 && lvl <= 8;
});

// CSV Exports
export const SUPABASE_MISSING_LESSONS_CSV = lessonsToCsv(MISSING_LESSONS);
export const SUPABASE_LEVELS_4_TO_8_CSV = lessonsToCsv(LEVELS_4_TO_8_LESSONS);
export const SUPABASE_ALL_LESSONS_CSV = lessonsToCsv(FALLBACK_LESSONS);

// SQL Scripts
export const SUPABASE_MISSING_LESSONS_SQL = `-- =========================================================================
-- SUPABASE / POSTGRESQL MISSING LESSONS SYNC
-- Targets lessons: 6.4, 7.4, 8.1, 8.2, 8.3, 8.4
-- Run this directly in Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================================

-- Ensure RLS is configured for public read access
ALTER TABLE IF EXISTS public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on lessons" ON public.lessons;
CREATE POLICY "Allow public read access on lessons" ON public.lessons FOR SELECT USING (true);

-- Upsert the ${MISSING_LESSONS.length} missing lessons
${MISSING_LESSONS.map(lessonToSqlInsert).join('\n\n')}
`;

export const SUPABASE_LEVELS_4_TO_8_SQL = `-- =========================================================================
-- SUPABASE / POSTGRESQL LEVELS 4 THROUGH 8 CURRICULUM SYNC
-- Synchronizes all 16 lessons across Levels 4, 5, 6, 7, and 8 exactly as in curriculum
-- Run this directly in Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================================

-- Upsert Courses for Levels 4 through 8
INSERT INTO public.courses (id, title, description) VALUES
  ('00000000-0000-0000-0000-000000000004', 'Level 4: Middle School — Mastering AI Prompt Engineering', 'Master the 5-Ingredient Master Prompt Recipe, the "Do Not Do This" Shield, Numbered Rule Checklists, and Surgical Code Fixes.'),
  ('00000000-0000-0000-0000-000000000005', 'Level 5: High School — The Safety Shield & Risk Architecture', 'The automated risk management engine: Dynamic Lot Sizing & Clamping, Prop Firm Safety Nets & Daily Loss Limits, The 3-Layer Filter Stack, and Active Trade Management.'),
  ('00000000-0000-0000-0000-000000000006', 'Level 6: Undergraduate — Visual Tools & On-Screen Dashboards', 'Custom indicators, pushpin buffers, smart mobile push alerts, ADR volatility fuel gauges, session boxes, on-screen interactive HUD panels, and TradingView Pine Script v6 automation.'),
  ('00000000-0000-0000-0000-000000000007', 'Level 7: Senior Year — Debugging & Code Audits Without Reading Code', 'The "Explain It To Me" pre-flight audit protocol, syntax compiler errors vs silent logic errors, the 4 common AI hallucination patterns, and 2-stage out-of-sample backtesting against curve-fitting.'),
  ('00000000-0000-0000-0000-000000000008', 'Level 8: Graduation Capstone — Real-World Practical Projects', '4 production-grade capstone projects: The Volatility Exhaustion Bot, The Automated Trade Manager, The Prop Firm Challenge EA, and The Multi-Bot Control Dashboard, plus official graduation certification.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Ensure RLS is configured for public read access
ALTER TABLE IF EXISTS public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on lessons" ON public.lessons;
CREATE POLICY "Allow public read access on lessons" ON public.lessons FOR SELECT USING (true);

-- Upsert all 16 lessons for Levels 4 to 8
${LEVELS_4_TO_8_LESSONS.map(lessonToSqlInsert).join('\n\n')}
`;

export const SUPABASE_SYNC_SQL = `-- =========================================================================
-- SUPABASE / POSTGRESQL VERBATIM CURRICULUM FULL SYNC (ALL ${FALLBACK_LESSONS.length} LESSONS)
-- Exact, word-for-word synchronization of all 8 levels and ${FALLBACK_LESSONS.length} lessons
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================================

-- 1. Ensure Table Structure with UUID Primary Keys
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_free BOOLEAN DEFAULT false
);

-- 2. Configure Row Level Security (RLS) & Grant Public Read Policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on courses" ON public.courses;
CREATE POLICY "Allow public read access on courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on lessons" ON public.lessons;
CREATE POLICY "Allow public read access on lessons" ON public.lessons FOR SELECT USING (true);

-- 3. Upsert Course Records (The 8 University Levels)
INSERT INTO public.courses (id, title, description) VALUES
${LEVELS_META.map(
  (m) =>
    `  ('00000000-0000-0000-0000-${String(m.levelNumber).padStart(12, '0')}', ${JSON.stringify(
      `Level ${m.levelNumber}: ${m.schoolName} — ${m.technicalTitle.replace(/^.*?—\s*/, '')}`
    )}, ${JSON.stringify(m.description)})`
).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 4. Upsert All ${FALLBACK_LESSONS.length} Lessons (100% Verbatim Content)
${FALLBACK_LESSONS.map(lessonToSqlInsert).join('\n\n')}
`;
