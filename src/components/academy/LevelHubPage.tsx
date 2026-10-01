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
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300 flex flex-col">
      {/* Academy Top Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="curriculum" currentLevel={levelMeta.levelNumber} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        
        {/* Breadcrumbs & Level Navigator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('academy')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 font-medium"
            >
              <span>Academy</span>
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold">
              Level {levelMeta.levelNumber}: {levelMeta.schoolName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Student Tier Badge & Quick Selector */}
            <div className="flex items-center gap-2 bg-[#101623] border border-[#1E293B] rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-500 hidden sm:inline">Tier:</span>
              <span
                className={`font-semibold text-xs ${
                  studentTier === 'paid' || studentTier === 'complimentary'
                    ? 'text-cyan-400'
                    : 'text-emerald-400'
                }`}
              >
                {studentTier === 'paid' ? 'Paid Tier' : studentTier === 'complimentary' ? 'Complimentary' : 'Free Core'}
              </span>
              {isAdmin && (
                <div className="flex items-center gap-1 ml-1 border-l border-[#1E293B] pl-2">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">ADMIN:</span>
                  <button
                    onClick={() => setActiveStudentTier('free')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${studentTier === 'free' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setActiveStudentTier('paid')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${studentTier === 'paid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Paid
                  </button>
                </div>
              )}
            </div>

            {prevLevel && (
              <button
                onClick={() => onNavigate('level-hub', String(prevLevel.levelNumber))}
                className="px-2.5 py-1 rounded-lg bg-[#101623] hover:bg-[#141C2A] text-slate-300 hover:text-white border border-[#1E293B] transition-colors flex items-center gap-1 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev: {prevLevel.schoolName}</span>
              </button>
            )}
            {nextLevel && (
              <button
                onClick={() => onNavigate('level-hub', String(nextLevel.levelNumber))}
                className="px-2.5 py-1 rounded-lg bg-[#101623] hover:bg-[#141C2A] text-slate-300 hover:text-white border border-[#1E293B] transition-colors flex items-center gap-1 text-xs"
              >
                <span>Next: {nextLevel.schoolName}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 1. TOP LEVEL HEADER */}
        <section className="relative p-6 sm:p-8 rounded-xl bg-[#101623] border border-[#1E293B] shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10">
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
            <div className="flex-1 text-center md:text-left space-y-3">
              {/* Category / Tier Tag & Course Index */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  {levelMeta.courseOrder}
                </span>
                <span className="text-slate-600">·</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  levelMeta.isFree 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {levelMeta.isFree ? 'Free Core' : 'Masterclass Pro'}
                </span>
              </div>

              {/* Main Level Title */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {levelMeta.schoolName}
                </h1>
                <p className="text-sm font-medium text-emerald-400 mt-1">
                  Level {levelMeta.levelNumber}: {levelMeta.technicalTitle}
                </p>
              </div>

              {/* Course Description */}
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
                {levelMeta.description}
              </p>

              {/* Primary Action Button */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                {levelMeta.isFree || isAuthorizedForLevel ? (
                  <button
                    onClick={() => onNavigate('lesson-detail', nextLessonToTake?.id || visibleLessons[0]?.id || 'lesson-1-0')}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wide transition-colors shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>{completedLessons > 0 ? 'Continue Curriculum' : 'Start First Lesson'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('academy-pricing')}
                    className="px-5 py-2.5 rounded-lg bg-[#1C2638] hover:bg-[#25334A] border border-[#2B3A54] text-white font-medium text-xs tracking-wide transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Unlock Masterclass Access</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {completedLessons > 0 && (
                  <span className="text-xs text-slate-400">
                    {completedLessons} of {totalLessons} lessons completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DIVIDER LINE */}
        <hr className="border-t border-[#1E293B]" />

        {/* 2. TWO-COLUMN SPLIT LAYOUT (DESKTOP) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: "Your Progress" */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 sm:p-6 rounded-xl bg-[#101623] border border-[#1E293B] space-y-5 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Your Progress
                </h2>
                {user && (
                  <span className="text-xs font-bold text-emerald-400">
                    {completionPercentage}%
                  </span>
                )}
              </div>

              {/* LOGGED OUT STATE */}
              {!user ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-normal">
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Sign in
                    </button>{' '}
                    to automatically synchronize completed lessons across devices.
                  </p>

                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#141C2A] hover:bg-[#1A2538] text-slate-200 border border-[#222E42] text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sign In to Track</span>
                  </button>
                </div>
              ) : (
                /* LOGGED IN STATE */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Course Completion</span>
                      <span className="font-semibold text-white">
                        {completedLessons} of {totalLessons} Finished
                      </span>
                    </div>

                    {/* Active Progress Bar */}
                    <div className="w-full h-2 bg-[#162030] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {isLevelCompleted ? (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-300">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold block text-white">Course Completed!</span>
                        You have mastered all modules in {levelMeta.schoolName}.
                      </div>
                    </div>
                  ) : null}

                  {/* Checklist */}
                  <div className="space-y-2 pt-3 border-t border-[#1E293B]">
                    <span className="text-[11px] uppercase text-slate-400 tracking-wider font-semibold block">
                      Lesson Checklist
                    </span>
                    <div className="space-y-1">
                      {visibleLessons.map((lesson) => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            onClick={(e) => handleToggleComplete(lesson.id, e)}
                            className="p-2 rounded-md bg-[#0C121D] hover:bg-[#141C2A] border border-[#1A2234] hover:border-[#2A3852] cursor-pointer transition-colors flex items-center gap-2 text-xs group"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isDone
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'border border-slate-600 group-hover:border-emerald-400'
                              }`}
                            >
                              {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
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

          {/* RIGHT COLUMN: "Course Outline" */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Curriculum Lessons
              </h2>
              <span className="text-xs text-slate-400">
                {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Loading curriculum outline...
              </div>
            ) : (
              <div className="space-y-3">
                {visibleLessons.map((lesson) => {
                  const isDone = completedLessonIds.includes(lesson.id);
                  const isFree = lesson.is_free;
                  const isPractical = lesson.id === PRACTICAL_EXERCISE_LESSON_ID || lesson.id === INDICATOR_WORKSHOP_LESSON_ID;
                  const practicalProgress = getPracticalExerciseProgress(completedLessonIds);
                  const isPracticalUnlocked = isPracticalExerciseUnlocked(completedLessonIds, studentTier, isAdmin);
                  const isUnlocked = isLessonUnlockedForTier(lesson, studentTier, isAdmin, completedLessonIds);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        if (isUnlocked) {
                          onNavigate('lesson-detail', lesson.id);
                        } else {
                          onNavigate('academy-pricing');
                        }
                      }}
                      className="p-4 sm:p-5 rounded-xl bg-[#101623] hover:bg-[#141C2A] border border-[#1E293B] hover:border-[#2A3852] cursor-pointer transition-colors shadow-sm group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Circular Status Icon */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isPractical && !isPracticalUnlocked
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                              : 'bg-[#162030] text-slate-400 group-hover:text-emerald-400 border border-[#223048]'
                          }`}>
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : isPractical && !isPracticalUnlocked ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap pb-1">
                              <span className="text-xs text-slate-400 font-semibold">
                                {lesson.id === 'lesson-3-bonus'
                                  ? 'Bonus Chapter 3.B'
                                  : lesson.id === 'lesson-3-practical'
                                  ? 'Capstone 3.5'
                                  : lesson.id === 'lesson-3-6'
                                  ? 'Workshop 3.6'
                                  : lesson.id === 'lesson-8-bonus'
                                  ? 'Bonus Chapter 8.B'
                                  : `Lesson ${levelMeta.levelNumber}.${lesson.lesson_number}`}
                              </span>
                              <span className="text-slate-600">·</span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{lesson.duration_minutes || 15}m</span>
                              </span>
                              {isPractical && (
                                isPracticalUnlocked ? (
                                  <span className="text-[11px] font-medium text-emerald-400">
                                    Capstone Unlocked
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-medium text-amber-400">
                                    Locked ({practicalProgress.completedCount}/14)
                                  </span>
                                )
                              )}
                            </div>

                            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                              {lesson.title}
                            </h3>

                            {lesson.summary && (
                              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                                {lesson.summary}
                              </p>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </section>

        {/* Footer Navigation Strip */}
        <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('academy')}
            className="px-4 py-2 rounded-lg bg-[#101623] hover:bg-[#141C2A] text-slate-300 text-xs font-medium transition-colors flex items-center gap-2 border border-[#1E293B]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Return to School of Strategy Architect</span>
          </button>

          <button
            onClick={() => onNavigate('prompt-architect')}
            className="px-4 py-2 rounded-lg bg-[#101623] hover:bg-[#141C2A] border border-[#1E293B] hover:border-cyan-500/50 text-slate-200 text-xs font-medium transition-colors flex items-center gap-2"
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
