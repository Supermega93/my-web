import fs from 'fs';
import path from 'path';
import { FALLBACK_LESSONS } from '../src/data/lessonsData.ts';
import { LEVELS_META } from '../src/services/academy.ts';

function getLessonUuid(lesson: any): string {
  const match = lesson.level_name.match(/Level\s+(\d+)/i);
  const lvl = match ? parseInt(match[1], 10) : 1;
  const num = lesson.lesson_number ?? lesson.order_index;
  const lvlStr = String(lvl).padStart(8, '0');
  const numStr = String(num).padStart(12, '0');
  return `${lvlStr}-0000-0000-0000-${numStr}`;
}

const coursesSql = `
-- Upsert Course Records (The 8 University Levels)
INSERT INTO public.courses (id, title, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Level 1: Preschool — Strategy Architect Mindset', 'The foundation of AI Trading Architecture: understanding why the AI is a literal machine, translating eyeball rules into machine facts, avoiding hallucinations, and safety testing.'),
  ('00000000-0000-0000-0000-000000000002', 'Level 2: Kindergarten — Programming Concepts in Plain English', 'Demystifying variables, booleans, functions, and loops through everyday visual analogies before touching a single line of MQL5 code.'),
  ('00000000-0000-0000-0000-000000000003', 'Level 3: Elementary — Robot Architecture & Blueprints', 'The 5 MQL5 program types, the robot lifecycle (OnInit, OnTick, OnDeinit), and assembling the 4 Modular Lego Blocks (Brain, Shield, Hands, Senses).'),
  ('00000000-0000-0000-0000-000000000004', 'Level 4: Middle School — Indicator Math & Signal Logic', 'Deconstructing moving average lag, dynamic ATR volatility bands, and multi-indicator confluence architecture without statistical multicollinearity.'),
  ('00000000-0000-0000-0000-000000000005', 'Level 5: High School — Institutional Liquidity & Smart Money Logic', 'Algorithmic detection of liquidity sweeps, Fair Value Gaps (FVG), order block absorption, and multi-timeframe Optimal Trade Entry (OTE) discount zones.'),
  ('00000000-0000-0000-0000-000000000006', 'Level 6: Undergraduate — Visual Tools & On-Screen Dashboards', 'Custom indicators, pushpin buffers, smart mobile push alerts, ADR volatility fuel gauges, session boxes, on-screen interactive HUD panels, and TradingView Pine Script v6 automation.'),
  ('00000000-0000-0000-0000-000000000007', 'Level 7: Senior Year — Debugging & Code Audits Without Reading Code', 'The "Explain It To Me" pre-flight audit protocol, syntax compiler errors vs silent logic errors, the 4 common AI hallucination patterns, and 2-stage out-of-sample backtesting against curve-fitting.'),
  ('00000000-0000-0000-0000-000000000008', 'Level 8: Graduation Capstone — Real-World Practical Projects', '4 production-grade capstone projects: The Volatility Exhaustion Bot, The Automated Trade Manager, The Prop Firm Challenge EA, and The Multi-Bot Control Dashboard, plus official graduation certification.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;
`;

function generateLessonSql(lesson: any): string {
  const uuid = getLessonUuid(lesson);
  // Use $BODY$ quoting so single quotes and LaTeX $$ formulas do not clash
  return `
INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '${uuid}',
  '${lesson.course_id}',
  ${lesson.order_index},
  $BODY$${lesson.level_name}$BODY$,
  ${lesson.lesson_number},
  $BODY$${lesson.title}$BODY$,
  $BODY$${lesson.content.trim()}$BODY$,
  ${lesson.is_free ? 'true' : 'false'}
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;
`;
}

// 1. Missing lessons specifically: 6.4, 7.4, 8.1, 8.2, 8.3, 8.4
const missingLessons = FALLBACK_LESSONS.filter(l => 
  (l.id === 'lesson-6-4') ||
  (l.id === 'lesson-7-4') ||
  (l.id === 'lesson-8-1') ||
  (l.id === 'lesson-8-2') ||
  (l.id === 'lesson-8-3') ||
  (l.id === 'lesson-8-4')
);

const missingSqlHeader = `-- =========================================================================
-- SUPABASE SQL SCRIPT: ADD MISSING LESSONS (6.4, 7.4, 8.1, 8.2, 8.3, 8.4)
-- Run this in your Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. Ensure Table Structure & RLS
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

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on courses" ON public.courses;
CREATE POLICY "Allow public read access on courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on lessons" ON public.lessons;
CREATE POLICY "Allow public read access on lessons" ON public.lessons FOR SELECT USING (true);

${coursesSql}

-- 2. Safely remove any outdated / partial records for these specific lessons
DELETE FROM public.lessons 
WHERE (course_id = '00000000-0000-0000-0000-000000000006' AND lesson_number = 4)
   OR (course_id = '00000000-0000-0000-0000-000000000007' AND lesson_number = 4)
   OR (course_id = '00000000-0000-0000-0000-000000000008' AND lesson_number IN (1, 2, 3, 4));

-- 3. Insert Missing Lessons (6.4, 7.4, 8.1, 8.2, 8.3, 8.4)
`;

const missingSql = missingSqlHeader + missingLessons.map(generateLessonSql).join('\n');

// 2. Full sync SQL with all 29 lessons
const fullSqlHeader = `-- =========================================================================
-- SUPABASE / POSTGRESQL VERBATIM CURRICULUM FULL SYNC (ALL 29 LESSONS)
-- Exact, word-for-word synchronization of all 8 levels and 29 lessons
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

${coursesSql}

-- 3. Upsert All 29 Lessons (100% Verbatim Content)
`;

const fullSql = fullSqlHeader + FALLBACK_LESSONS.map(generateLessonSql).join('\n');

// 3. Generate CSV for missing lessons (and all lessons)
function escapeCsv(str: string): string {
  if (!str) return '""';
  return `"${str.replace(/"/g, '""')}"`;
}

const csvHeader = 'id,course_id,order_index,level_name,lesson_number,title,content,is_free\n';
const missingCsvRows = missingLessons.map(l => [
  getLessonUuid(l),
  l.course_id,
  l.order_index,
  escapeCsv(l.level_name),
  l.lesson_number,
  escapeCsv(l.title),
  escapeCsv(l.content.trim()),
  l.is_free ? 'true' : 'false'
].join(',')).join('\n');

const missingCsv = csvHeader + missingCsvRows;

// Output files
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.resolve('public', 'supabase_missing_lessons.sql'), missingSql);
fs.writeFileSync(path.resolve('public', 'supabase_missing_lessons.csv'), missingCsv);
fs.writeFileSync(path.resolve('public', 'supabase_sync_all_curriculum.sql'), fullSql);

// Also save to root for easy user download/export
fs.writeFileSync(path.resolve('supabase_missing_lessons.sql'), missingSql);
fs.writeFileSync(path.resolve('supabase_missing_lessons.csv'), missingCsv);
fs.writeFileSync(path.resolve('supabase_sync_all_curriculum.sql'), fullSql);

// Update src/data/supabaseSqlScript.ts
const tsContent = `// Auto-synchronized SQL script containing all 29 authoritative lessons and 8 school levels
// Generated with deterministic UUIDs and $BODY$ PostgreSQL escaping

export const SUPABASE_SYNC_SQL = ${JSON.stringify(fullSql)};

export const SUPABASE_MISSING_LESSONS_SQL = ${JSON.stringify(missingSql)};

export const SUPABASE_MISSING_LESSONS_CSV = ${JSON.stringify(missingCsv)};
`;

fs.writeFileSync(path.resolve('src/data/supabaseSqlScript.ts'), tsContent);

console.log('Successfully generated SQL and CSV files!');
console.log(`Total lessons: ${FALLBACK_LESSONS.length}`);
console.log(`Missing lessons targeted: ${missingLessons.length}`);
