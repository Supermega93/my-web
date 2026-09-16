import { User, Lesson, UserAccessStatus } from '../types.ts';

export type StudentTier = 'free' | 'paid' | 'complimentary';

const TIER_STORAGE_KEY = 'academy_student_tier';
const TIER_CHANGE_EVENT = 'academy-tier-change';

export const PRACTICAL_EXERCISE_LESSON_ID = 'lesson-3-practical';

export interface PrerequisiteLessonInfo {
  id: string;
  order: number;
  levelNumber: number;
  levelName: string;
  schoolName: string;
  title: string;
  shortTitle: string;
}

export const FREE_TIER_PREREQUISITES: PrerequisiteLessonInfo[] = [
  // Level 1: Preschool (5 lessons)
  { id: 'lesson-1-0', order: 1, levelNumber: 1, levelName: 'Level 1: Preschool', schoolName: 'Preschool', title: 'Orientation: Welcome to the School of AI Trading Architecture!', shortTitle: 'Orientation: Welcome' },
  { id: 'lesson-1-1', order: 2, levelNumber: 1, levelName: 'Level 1: Preschool', schoolName: 'Preschool', title: 'Lesson 1.1: The Human Bottleneck (Why Manual Traders Fail)', shortTitle: 'Lesson 1.1: Human Bottleneck' },
  { id: 'lesson-1-2', order: 3, levelNumber: 1, levelName: 'Level 1: Preschool', schoolName: 'Preschool', title: 'Lesson 1.2: The Strategy Architect Mindset', shortTitle: 'Lesson 1.2: Architect Mindset' },
  { id: 'lesson-1-3', order: 4, levelNumber: 1, levelName: 'Level 1: Preschool', schoolName: 'Preschool', title: 'Lesson 1.3: Machine Facts vs. Guru Words', shortTitle: 'Lesson 1.3: Machine Facts' },
  { id: 'lesson-1-4', order: 5, levelNumber: 1, levelName: 'Level 1: Preschool', schoolName: 'Preschool', title: 'Lesson 1.4: The 80/20 Architecture Principle', shortTitle: 'Lesson 1.4: 80/20 Principle' },

  // Level 2: Kindergarten (4 lessons)
  { id: 'lesson-2-1', order: 6, levelNumber: 2, levelName: 'Level 2: Kindergarten', schoolName: 'Kindergarten', title: 'Lesson 2.1: Labelled Boxes (Variables) 📦', shortTitle: 'Lesson 2.1: Variables' },
  { id: 'lesson-2-2', order: 7, levelNumber: 2, levelName: 'Level 2: Kindergarten', schoolName: 'Kindergarten', title: 'Lesson 2.2: Decision Checklists (Conditions) 🚦', shortTitle: 'Lesson 2.2: Conditions' },
  { id: 'lesson-2-3', order: 8, levelNumber: 2, levelName: 'Level 2: Kindergarten', schoolName: 'Kindergarten', title: 'Lesson 2.3: Kitchen Appliances (Functions) ☕', shortTitle: 'Lesson 2.3: Functions' },
  { id: 'lesson-2-4', order: 9, levelNumber: 2, levelName: 'Level 2: Kindergarten', schoolName: 'Kindergarten', title: 'Lesson 2.4: Conveyor Belts (Loops) 🔄', shortTitle: 'Lesson 2.4: Loops' },

  // Level 3: Elementary (5 lessons)
  { id: 'lesson-3-1', order: 10, levelNumber: 3, levelName: 'Level 3: Elementary', schoolName: 'Elementary', title: 'Lesson 3.1: The 5 Program Types (Robots vs. Gauges vs. Helpers) 🚘', shortTitle: 'Lesson 3.1: 5 Program Types' },
  { id: 'lesson-3-2', order: 11, levelNumber: 3, levelName: 'Level 3: Elementary', schoolName: 'Elementary', title: 'Lesson 3.2: The Robot Lifecycle (The 3 Sacred Events: OnInit, OnTick, OnDeinit) ⏱️', shortTitle: 'Lesson 3.2: Lifecycle Events' },
  { id: 'lesson-3-3', order: 12, levelNumber: 3, levelName: 'Level 3: Elementary', schoolName: 'Elementary', title: 'Lesson 3.3: The 4 Lego Blocks Architecture (Brain, Shield, Glasses, Hands) 🧱', shortTitle: 'Lesson 3.3: 4 Lego Blocks' },
  { id: 'lesson-3-4', order: 13, levelNumber: 3, levelName: 'Level 3: Elementary', schoolName: 'Elementary', title: 'Lesson 3.4: The Clean Code Blueprint (Separation of Concerns) 📐', shortTitle: 'Lesson 3.4: Code Blueprint' },
  { id: 'lesson-3-bonus', order: 14, levelNumber: 3, levelName: 'Level 3: Elementary', schoolName: 'Elementary', title: 'Bonus Chapter 3.B: Foundational Architecture Review & Master Examination 🏛️', shortTitle: 'Bonus 3.B: Master Exam' },
];

export const FREE_TIER_PREREQUISITE_IDS = FREE_TIER_PREREQUISITES.map((p) => p.id);

export interface PracticalExerciseProgress {
  isUnlocked: boolean;
  totalRequired: number;
  completedCount: number;
  remainingCount: number;
  progressPercent: number;
  completedIds: string[];
  missingLessons: PrerequisiteLessonInfo[];
  nextIncompleteLesson: PrerequisiteLessonInfo | null;
  levelBreakdown: Array<{
    levelNumber: number;
    schoolName: string;
    total: number;
    completed: number;
    isDone: boolean;
    percent: number;
  }>;
}

/**
 * Returns saved completed lesson IDs from browser localStorage safely.
 */
export function getStoredCompletedLessonIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
  } catch {
    return [];
  }
}

/**
 * Calculates current progress toward unlocking the Level 3.5 Practical Capstone Exercise.
 */
export function getPracticalExerciseProgress(completedIds?: string[]): PracticalExerciseProgress {
  const ids = completedIds ?? getStoredCompletedLessonIds();
  const completedSet = new Set(ids);
  const totalRequired = FREE_TIER_PREREQUISITES.length;
  
  const missingLessons = FREE_TIER_PREREQUISITES.filter((p) => !completedSet.has(p.id));
  const completedCount = totalRequired - missingLessons.length;
  const remainingCount = missingLessons.length;
  const progressPercent = Math.round((completedCount / totalRequired) * 100);
  const isUnlocked = missingLessons.length === 0;
  const nextIncompleteLesson = missingLessons[0] || null;

  const levelBreakdown = [1, 2, 3].map((lvlNum) => {
    const levelPrereqs = FREE_TIER_PREREQUISITES.filter((p) => p.levelNumber === lvlNum);
    const total = levelPrereqs.length;
    const completed = levelPrereqs.filter((p) => completedSet.has(p.id)).length;
    const isDone = total > 0 && completed === total;
    const schoolName = lvlNum === 1 ? 'Preschool' : lvlNum === 2 ? 'Kindergarten' : 'Elementary';
    return {
      levelNumber: lvlNum,
      schoolName,
      total,
      completed,
      isDone,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  return {
    isUnlocked,
    totalRequired,
    completedCount,
    remainingCount,
    progressPercent,
    completedIds: ids,
    missingLessons,
    nextIncompleteLesson,
    levelBreakdown,
  };
}

/**
 * Checks if the practical exercise is unlocked based on completion, student tier, or admin privilege.
 */
export function isPracticalExerciseUnlocked(
  completedIds?: string[],
  tier: StudentTier = 'free',
  isAdmin: boolean = false
): boolean {
  if (isAdmin || tier === 'paid') return true;
  const ids = completedIds ?? getStoredCompletedLessonIds();
  return FREE_TIER_PREREQUISITES.every((p) => ids.includes(p.id));
}

/**
 * Convenience testing helper: quickly mark all 14 foundation lessons completed.
 */
export function fastTrackUnlockPracticalExercise(): string[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredCompletedLessonIds();
  const combined = Array.from(new Set([...current, ...FREE_TIER_PREREQUISITE_IDS]));
  localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
  window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
  return combined;
}

/**
 * Convenience testing helper: reset foundation lessons to test locked state.
 */
export function resetPracticalExerciseProgress(): string[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredCompletedLessonIds();
  const filtered = current.filter((id) => !FREE_TIER_PREREQUISITE_IDS.includes(id));
  localStorage.setItem('completed_lesson_ids', JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: filtered } }));
  return filtered;
}

/**
 * Extracts the preview portion of the practical capstone exercise (Overview + Strategy Definition)
 * while keeping the prompt recipe, deployment steps, Strategy Tester verification, and source code protected.
 */
export function getPracticalExercisePreviewContent(fullContent: string): {
  previewContent: string;
  lockedContentTeaser: string;
} {
  const splitMarker = '## 3. Step 2: Prompt Engineering';
  const splitIndex = fullContent.indexOf(splitMarker);
  if (splitIndex !== -1) {
    return {
      previewContent: fullContent.substring(0, splitIndex).trim(),
      lockedContentTeaser: fullContent.substring(splitIndex).trim(),
    };
  }
  return {
    previewContent: fullContent,
    lockedContentTeaser: '',
  };
}

/**
 * Returns the current active student tier ('free' | 'paid' | 'complimentary').
 * Considers admin role, user access status, verified database status, and local storage override.
 */
export function getActiveStudentTier(user?: User | null, isAdmin?: boolean): StudentTier {
  if (typeof window === 'undefined') return 'free';

  // Admin/Developer defaults to paid tier
  if (isAdmin || user?.role === 'admin' || user?.role === 'developer') {
    return 'paid';
  }

  // 1. Check user access status explicitly provided on authenticated User object
  if (user?.access_status === 'complimentary' || (user as any)?.user_metadata?.access_status === 'complimentary') {
    return 'complimentary';
  }
  if (user?.access_status === 'paid' || (user as any)?.user_metadata?.access_status === 'paid' || user?.can_access_masterclass) {
    return 'paid';
  }

  // 2. If user is logged in, check verified server access status
  if (user) {
    const verifiedStatus = localStorage.getItem('user_access_status');
    if (verifiedStatus === 'complimentary') return 'complimentary';
    if (verifiedStatus === 'paid') return 'paid';
  }

  return 'free';
}

/**
 * Updates the student tier and emits an event for reactive UI updates.
 */
export function setActiveStudentTier(tier: StudentTier): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TIER_STORAGE_KEY, tier);
  localStorage.setItem('user_access_status', tier);
  window.dispatchEvent(new CustomEvent(TIER_CHANGE_EVENT, { detail: { tier } }));
}

/**
 * Hook or subscriber helper for reacting to tier changes.
 */
export function subscribeToTierChanges(callback: (tier: StudentTier) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ tier: StudentTier }>;
    callback(customEvent.detail?.tier || getActiveStudentTier());
  };

  window.addEventListener(TIER_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(TIER_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Determines whether a lesson should be visible in the curriculum list for a given tier.
 * Rule:
 * - Free tier students see lesson-3-bonus (Fundamentals Bonus & Master Exam).
 * - lesson-8-bonus (Advanced Bonus Chapter) is visible to Paid and Complimentary tier students.
 */
export function isLessonVisibleForTier(lessonId: string, tier: StudentTier): boolean {
  if (lessonId === 'lesson-8-bonus') {
    return tier === 'paid' || tier === 'complimentary';
  }
  // All other lessons (including lesson-3-bonus) are visible in the curriculum
  return true;
}

/**
 * Determines whether the content of a lesson is unlocked for reading.
 * - Free tier students unlock Levels 1–3 and lesson-3-bonus.
 * - Lesson 3.5 (the final practical exercise) is locked until all 14 prerequisite lessons in Levels 1–3 are completed.
 * - Paid and Complimentary students unlock all levels (1–8) and lesson-8-bonus.
 */
export function isLessonUnlockedForTier(
  lesson: Lesson | null,
  tier: StudentTier,
  isAdmin: boolean = false,
  completedLessonIds?: string[]
): boolean {
  if (!lesson) return false;
  if (isAdmin) return true;

  // If server explicitly denied access for this lesson:
  if (lesson.accessGranted === false && !lesson.is_free) {
    return false;
  }
  // If server explicitly granted access:
  if (lesson.accessGranted === true) {
    return true;
  }

  if (tier === 'paid' || tier === 'complimentary') return true;

  // The final practical exercise of the Free Tier requires completing all 14 foundation lessons across Levels 1–3
  if (lesson.id === PRACTICAL_EXERCISE_LESSON_ID) {
    return isPracticalExerciseUnlocked(completedLessonIds, tier, isAdmin);
  }

  // Free tier only unlocks lessons marked as is_free
  return Boolean(lesson.is_free);
}

/**
 * Checks if the user is a paid or complimentary MEGA Ecosystem member (has purchased products,
 * has paid/complimentary student tier, is an administrator, or holds an active ecosystem membership).
 */
export function isEcosystemMember(user?: User | null, isAdmin?: boolean): boolean {
  if (typeof window === 'undefined') return false;
  if (isAdmin || user?.role === 'admin' || user?.role === 'developer') return true;
  if (user?.access_status === 'paid' || user?.access_status === 'complimentary') return true;
  if (user && (localStorage.getItem('user_access_status') === 'complimentary' || localStorage.getItem('user_access_status') === 'paid')) return true;

  return false;
}

export function setEcosystemMember(unlocked: boolean): void {
  if (typeof window === 'undefined') return;
  if (unlocked) {
    localStorage.setItem('mega_ecosystem_member', 'true');
  } else {
    localStorage.removeItem('mega_ecosystem_member');
  }
  window.dispatchEvent(new CustomEvent('mega-ecosystem-change', { detail: { unlocked } }));
}

