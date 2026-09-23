import React, { useState, useEffect } from 'react';
import { ActiveView, Lesson, LevelMeta } from '../../types.ts';
import { fetchLessonsForLevel, LEVELS_META } from '../../services/academy.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { AcademyNav } from './AcademyNav.tsx';
import { CourseBadgeCrest } from './CourseBadgeCrest.tsx';
import { AcademyAuthModal } from './AcademyAuthModal.tsx';
import { getQuizForLesson } from '../../data/quizzes.ts';
import { getMasterExamForLesson } from '../../data/exams.ts';
import { 
  StudentTier, 
  getActiveStudentTier, 
  setActiveStudentTier, 
  subscribeToTierChanges, 
  isLessonVisibleForTier, 
  isLessonUnlockedForTier,
  PRACTICAL_EXERCISE_LESSON_ID,
  INDICATOR_WORKSHOP_LESSON_ID,
  getPracticalExerciseProgress,
  isPracticalExerciseUnlocked,
  getStoredCompletedLessonIds
} from '../../services/academyAccess.ts';
import { 
  Play, 
  Lock, 
  CheckCircle2, 
  Check, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  BookOpen, 
  Sparkles, 
  LogIn, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface LevelHubPageProps {
  levelId: string | number;
  onNavigate: (view: ActiveView, extraId?: string) => void;
}

export function LevelHubPage({ levelId, onNavigate }: LevelHubPageProps) {
  const { user, isAdmin } = useAuth();
  const [levelMeta, setLevelMeta] = useState<LevelMeta>(LEVELS_META[0]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; total: number }>>({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [studentTier, setStudentTier] = useState<StudentTier>(() => getActiveStudentTier(user, isAdmin));

  // Sync tier state reactively
  useEffect(() => {
    setStudentTier(getActiveStudentTier(user, isAdmin));
    const unsubscribe = subscribeToTierChanges((newTier) => {
      setStudentTier(newTier);
    });
    return unsubscribe;
  }, [user, isAdmin]);

  // Load level metadata and lessons dynamically from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadLevelData() {
      setLoading(true);
      const res = await fetchLessonsForLevel(levelId);
      if (isMounted) {
        setLevelMeta(res.levelMeta);
        setLessons(res.lessons);
        setLoading(false);
      }
    }
    loadLevelData();

    // Read stored lesson progress & quiz scores
    try {
      const saved = getStoredCompletedLessonIds();
      setCompletedLessonIds(saved);
      const scores = JSON.parse(localStorage.getItem('academy_quiz_scores') || '{}');
      setQuizScores(scores);
    } catch {
      // ignore
    }

    return () => {
      isMounted = false;
    };
  }, [levelId]);

  // Sync completed lessons reactively
  useEffect(() => {
    const handleProgressChange = () => {
      setCompletedLessonIds(getStoredCompletedLessonIds());
    };
    window.addEventListener('academy-progress-change', handleProgressChange);
    window.addEventListener('storage', handleProgressChange);
    return () => {
      window.removeEventListener('academy-progress-change', handleProgressChange);
      window.removeEventListener('storage', handleProgressChange);
    };
  }, []);

  // Handle marking a lesson as complete / incomplete
  const handleToggleComplete = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    const current = getStoredCompletedLessonIds();
    if (current.includes(lessonId)) {
      updated = current.filter((id) => id !== lessonId);
    } else {
      updated = [...current, lessonId];
    }
    setCompletedLessonIds(updated);
    try {
      localStorage.setItem('completed_lesson_ids', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: updated } }));
    } catch {
      // ignore
    }
  };

  // Sign-in handler
  const handleSignIn = () => {
    setAuthModalOpen(true);
  };

  // Free levels (1-3) are accessible to all; paid levels (4-8) require administrator, paid, or complimentary status
  const isAuthorizedForLevel = levelMeta.isFree || studentTier === 'paid' || studentTier === 'complimentary' || isAdmin;

  // Filter lessons based on active student tier
  // Free tier students see lesson-3-bonus (Fundamentals Bonus & Master Exam)
  // Paid tier students see lesson-8-bonus (Advanced Bonus Chapter)
  const visibleLessons = lessons.filter((l) => isLessonVisibleForTier(l.id, studentTier));

  // Metrics for this specific level
  const totalLessons = visibleLessons.length;
  const completedLessons = visibleLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isLevelCompleted = totalLessons > 0 && completedLessons === totalLessons;

  // Find next lesson to take: first uncompleted lesson, or the first lesson
  const nextLessonToTake = visibleLessons.find((l) => !completedLessonIds.includes(l.id)) || visibleLessons[0];

  // Adjacent level navigation
  const prevLevel = LEVELS_META.find((m) => m.levelNumber === levelMeta.levelNumber - 1);
  const nextLevel = LEVELS_META.find((m) => m.levelNumber === levelMeta.levelNumber + 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300 flex flex-col">
      {/* Academy Top Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="curriculum" />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        
        {/* Breadcrumbs & Level Navigator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('academy')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 font-semibold"
            >
              <span>Academy</span>
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-bold uppercase">
              Course {levelMeta.levelNumber}: {levelMeta.schoolName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Student Tier Badge & Quick Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono">
              <span className="text-slate-500 hidden sm:inline">Tier:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider ${
                  studentTier === 'paid' || studentTier === 'complimentary'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {studentTier === 'paid' ? 'Paid Tier' : studentTier === 'complimentary' ? 'Complimentary' : 'Free Tier'}
              </span>
              {isAdmin && (
                <div className="flex items-center gap-1 ml-1 border-l border-slate-700 pl-1.5">
                  <span className="text-[9px] text-amber-400 font-bold">ADMIN:</span>
                  <button
                    onClick={() => setActiveStudentTier('free')}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${studentTier === 'free' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setActiveStudentTier('paid')}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${studentTier === 'paid' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Paid
                  </button>
                </div>
              )}
            </div>

            {prevLevel && (
              <button
                onClick={() => onNavigate('level-hub', String(prevLevel.levelNumber))}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1 text-[11px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev: {prevLevel.schoolName}</span>
              </button>
            )}
            {nextLevel && (
              <button
                onClick={() => onNavigate('level-hub', String(nextLevel.levelNumber))}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1 text-[11px]"
              >
                <span>Next: {nextLevel.schoolName}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 1. TOP LEVEL HEADER (Matching BabyPips exact layout from screenshots) */}
        <section className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
            {/* Course Badge / Crest Vector Graphic */}
            <div className="shrink-0 flex justify-center">
              <CourseBadgeCrest
                levelNumber={levelMeta.levelNumber}
                schoolName={levelMeta.schoolName}
                isFree={levelMeta.isFree}
                hasNewEditionBadge={levelMeta.hasNewEditionBadge}
                size="lg"
              />
            </div>

            {/* Header Content */}
            <div className="flex-1 text-center md:text-left space-y-4">
              {/* Category / Tier Tag & Course Index */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                {!levelMeta.isFree && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-black uppercase tracking-wider shadow-sm">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span>PREMIUM</span>
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono tracking-wider">
                  {levelMeta.courseOrder}
                </span>
                {levelMeta.isFree && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                    Free Core
                  </span>
                )}
              </div>

              {/* Main Level Title */}
              <div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {levelMeta.schoolName}
                </h1>
                <p className="text-sm sm:text-base font-medium text-emerald-400 font-mono mt-1">
                  Level {levelMeta.levelNumber}: {levelMeta.technicalTitle}
                </p>
              </div>

              {/* Course Description */}
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
                {levelMeta.description}
              </p>

              {/* Primary Action Button */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                {levelMeta.isFree ? (
                  <button
                    onClick={() => onNavigate('lesson-detail', nextLessonToTake?.id || visibleLessons[0]?.id || 'lesson-1-0')}
                    className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] hover:scale-[1.02] flex items-center gap-2 group"
                  >
                    <span>{completedLessons > 0 ? 'Continue Course' : 'Start Course'}</span>
                    <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                    </span>
                  </button>
                ) : isAuthorizedForLevel ? (
                  <button
                    onClick={() => onNavigate('lesson-detail', nextLessonToTake?.id || 'lesson-4-1')}
                    className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] hover:scale-[1.02] flex items-center gap-2 group"
                  >
                    <span>{completedLessons > 0 ? 'Continue Course' : 'Start Course'}</span>
                    <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('academy-pricing')}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-[1.02] flex items-center gap-2.5 group"
                  >
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                    <span>Get Premium to Start Course</span>
                    <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                {completedLessons > 0 && (
                  <span className="text-xs text-slate-400 font-mono">
                    {completedLessons} of {totalLessons} lessons completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DIVIDER LINE (BabyPips exact separation) */}
        <hr className="border-t border-slate-800" />

        {/* 2. TWO-COLUMN SPLIT LAYOUT (DESKTOP) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: "Your Progress" */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Your Progress
                </h2>
                {user && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {completionPercentage}%
                  </span>
                )}
              </div>

              {/* LOGGED OUT STATE */}
              {!user ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-300 leading-normal">
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Sign in
                    </button>{' '}
                    to unlock progress tracking.
                  </p>

                  {/* BabyPips Gray Progress Bar with Blue Padlock Icon overlay */}
                  <div className="pt-2 pb-3">
                    <div className="relative w-full h-3.5 bg-slate-800 rounded-full border border-slate-700/60 overflow-visible">
                      {/* Left subtle fill tone */}
                      <div className="h-full w-1/4 bg-slate-700/60 rounded-l-full" />
                      
                      {/* Blue Circular Padlock Node (Matching exact BabyPips look) */}
                      <div 
                        onClick={() => setAuthModalOpen(true)}
                        title="Sign in to unlock progress tracking"
                        className="absolute left-1/2 -translate-x-1/2 -top-2 w-7.5 h-7.5 rounded-full bg-blue-500 hover:bg-blue-400 border-2 border-slate-900 shadow-[0_2px_10px_rgba(59,130,246,0.6)] flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110"
                      >
                        <Lock className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-normal leading-relaxed">
                    Wish there was a way to keep track of lessons you've completed? Sign in to unlock this feature and we'll display helpful markers along the way.
                  </p>

                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 hover:border-emerald-500/50 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unlock Tracking, Sign In</span>
                  </button>
                </div>
              ) : (
                /* LOGGED IN STATE: Active completion percentage & green checkmarks */
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                      <span>Course Completion</span>
                      <span className="font-bold text-white">
                        {completedLessons} of {totalLessons} Completed
                      </span>
                    </div>

                    {/* Active Progress Bar */}
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {isLevelCompleted ? (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
                      <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold block text-white">Course Completed!</span>
                        You have mastered all lessons in {levelMeta.schoolName}.
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 font-normal">
                      Click any checkbox below or within a lesson to update your cloud progress in real time.
                    </div>
                  )}

                  {/* Checklist with green checkmarks */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">
                      Lesson Checklist
                    </span>
                    <div className="space-y-1.5">
                      {visibleLessons.map((lesson) => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            onClick={(e) => handleToggleComplete(lesson.id, e)}
                            className="p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center gap-2.5 text-xs group"
                          >
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isDone
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'border border-slate-600 group-hover:border-emerald-400'
                              }`}
                            >
                              {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span
                              className={`truncate flex-1 ${
                                isDone ? 'text-slate-400 line-through' : 'text-slate-200 group-hover:text-white'
                              }`}
                            >
                              {lesson.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: "Course Outline" (Vertical Timeline List) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Course Outline</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Loading curriculum outline...
              </div>
            ) : (
              /* Vertical Timeline List (BabyPips exact matching structure) */
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
                {visibleLessons.map((lesson, idx) => {
                  const isDone = completedLessonIds.includes(lesson.id);
                  const isFree = lesson.is_free;
                  const isFirstLesson = idx === 0;
                  const isPractical = lesson.id === PRACTICAL_EXERCISE_LESSON_ID || lesson.id === INDICATOR_WORKSHOP_LESSON_ID;
                  const practicalProgress = getPracticalExerciseProgress(completedLessonIds);
                  const isPracticalUnlocked = isPracticalExerciseUnlocked(completedLessonIds, studentTier, isAdmin);
                  const isUnlocked = isLessonUnlockedForTier(lesson, studentTier, isAdmin, completedLessonIds);

                  return (
                    <div
                      key={lesson.id}
                      className="relative group transition-all"
                    >
                      {/* Circular Play / Status Icon Node on the Vertical Timeline */}
                      <div className="absolute -left-6 sm:-left-8 top-1.5 flex items-center justify-center">
                        {isDone ? (
                          /* Completed Status: Emerald Checkmark */
                          <div
                            onClick={(e) => handleToggleComplete(lesson.id, e)}
                            title="Completed (click to toggle)"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 border-2 border-emerald-400 text-slate-950 flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform hover:scale-110"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : isPractical && !isPracticalUnlocked ? (
                          /* Capstone Workshop: Locked Node until Levels 1 to 3 completed */
                          <div
                            onClick={() => onNavigate('lesson-detail', lesson.id)}
                            title={`Prerequisite Locked: ${practicalProgress.completedCount}/${practicalProgress.totalRequired} Foundation Lessons Completed (Click to preview workshop)`}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border-2 border-amber-500/80 group-hover:border-amber-400 text-amber-400 flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all hover:scale-110"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        ) : isFree ? (
                          /* Free & Unlocked: Blue Play Triangle inside circular border */
                          <div
                            onClick={() => onNavigate('lesson-detail', lesson.id)}
                            title={isPractical ? 'Start Capstone Workshop' : 'Start Lesson'}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border-2 border-blue-500/70 group-hover:border-emerald-400 group-hover:bg-emerald-500/10 text-blue-400 group-hover:text-emerald-400 flex items-center justify-center cursor-pointer shadow-sm transition-all hover:scale-110"
                          >
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </div>
                        ) : (
                          /* Paid Masterclass: Subtle Lock Icon inside node */
                          <div
                            onClick={() => {
                              if (isUnlocked) {
                                onNavigate('lesson-detail', lesson.id);
                              } else {
                                onNavigate('academy-pricing');
                              }
                            }}
                            title="Premium Masterclass Lesson"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-cyan-500/70 text-slate-400 group-hover:text-cyan-400 flex items-center justify-center cursor-pointer shadow-sm transition-all hover:scale-110"
                          >
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Lesson Content Card */}
                      <div
                        onClick={() => {
                          if (isUnlocked) {
                            onNavigate('lesson-detail', lesson.id);
                          } else {
                            onNavigate('academy-pricing');
                          }
                        }}
                        className="ml-4 sm:ml-6 p-5 sm:p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all shadow-sm group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                      >
                        {/* Grade / Module Sub-label */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                              {lesson.id === 'lesson-3-bonus'
                                ? 'Bonus Chapter 3.B'
                                : lesson.id === 'lesson-3-practical'
                                ? 'Capstone 3.5'
                                : lesson.id === 'lesson-3-6'
                                ? 'Workshop 3.6'
                                : lesson.id === 'lesson-8-bonus'
                                ? 'Bonus Chapter 8.B'
                                : levelMeta.levelNumber === 1 && lesson.lesson_number === 1 
                                ? 'Orientation' 
                                : levelMeta.levelNumber === 1 
                                ? `Lesson 1.${lesson.lesson_number - 1}` 
                                : `Lesson ${levelMeta.levelNumber}.${lesson.lesson_number}`}
                            </span>
                            {lesson.id === 'lesson-3-bonus' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                <Award className="w-2.5 h-2.5 text-emerald-400" />
                                <span>Fundamentals Bonus • Master Exam</span>
                              </span>
                            ) : lesson.id === 'lesson-3-6' ? (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/15 text-red-300 border border-red-500/30">
                                  <Play className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                                  <span>Video Lesson</span>
                                </span>
                                {isPracticalUnlocked ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <Award className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>Final Workshop • Build MT5 Indicator 📊</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/40">
                                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                                    <span>Workshop Locked ({practicalProgress.completedCount}/14 Done)</span>
                                  </span>
                                )}
                              </div>
                            ) : isPractical ? (
                              isPracticalUnlocked ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                  <Award className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>Capstone Workshop • Ready to Build 🛠️</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/40">
                                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                                  <span>Capstone Locked ({practicalProgress.completedCount}/14 Done)</span>
                                </span>
                              )
                            ) : lesson.id === 'lesson-8-bonus' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                                <span>Advanced Bonus • Masterclass</span>
                              </span>
                            ) : !isFree ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                <Lock className="w-2.5 h-2.5 text-cyan-400" />
                                <span>Masterclass</span>
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Free
                              </span>
                            )}
                            {isFirstLesson && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300">
                                Start Here
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{lesson.duration_minutes || 15} mins</span>
                          </div>
                        </div>

                        {/* Bold Lesson Title */}
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {lesson.title}
                        </h3>

                        {/* 1-Sentence Description Summary */}
                        <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed font-normal">
                          {lesson.summary ||
                            'Deconstruct institutional algorithmic execution rules, mathematical risk controls, and automated market entry parameters.'}
                        </p>

                        {/* Bottom Link Action */}
                        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                          {isPractical && !isPracticalUnlocked ? (
                            <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                              <span>Preview Workshop ({practicalProgress.progressPercent}% to Unlock)</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          ) : !isUnlocked ? (
                            <span className="text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                              <span>Unlock Lesson</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                              <span>{isPractical ? 'Start Capstone Workshop' : 'Read Lesson'}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          )}

                          <div className="flex items-center gap-2">
                            {lesson.id === 'lesson-3-bonus' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
                                <Award className="w-3 h-3 text-emerald-400" />
                                <span>10-Question Master Exam</span>
                              </span>
                            ) : isPractical ? (
                              isPracticalUnlocked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
                                  <Award className="w-3 h-3 text-emerald-400" />
                                  <span>Hands-On Capstone</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold">
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Locked ({practicalProgress.completedCount}/14)</span>
                                </span>
                              )
                            ) : lesson.id === 'lesson-8-bonus' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>Applied Capstone Blueprint</span>
                              </span>
                            ) : quizScores[lesson.id] ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                                <Award className="w-3 h-3 text-emerald-400" />
                                <span>Quiz {quizScores[lesson.id].score}/{quizScores[lesson.id].total}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 font-mono text-[10px]">
                                <HelpCircle className="w-3 h-3 text-amber-400" />
                                <span>Interactive Quiz</span>
                              </span>
                            )}

                            {isDone && (
                              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Exclusive Paid Tier Bonus Chapter Notification for Free Tier Students */}
                {levelMeta.levelNumber === 8 && studentTier === 'free' && (
                  <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Paid Tier Masterclass Exclusive</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Bonus Chapter Master Class: Creator's Workshop
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      Free tier students have full access to the Fundamentals Bonus Chapter & Master Exam in Level 3. The Creator's Workshop Advanced Bonus Chapter is unlocked for Paid Tier students, featuring production prompt architecture for multi-tier EMAs, weekly squeeze traps, dynamic ADR buffers, and prop firm kill shields.
                    </p>
                    <div className="pt-1 flex items-center gap-3">
                      <button
                        onClick={() => onNavigate('lesson-detail', 'lesson-8-bonus')}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                      >
                        Explore Advanced Bonus Chapter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Footer Navigation Strip */}
        <div className="pt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('academy')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Return to School of Strategy Architect</span>
          </button>

          <button
            onClick={() => onNavigate('prompt-architect')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Prompt Architect Tool</span>
          </button>
        </div>

      </main>

      {/* In-page Academy Auth Modal */}
      <AcademyAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
