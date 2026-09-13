import React, { useState, useEffect, useMemo } from 'react';
import { ActiveView, Lesson } from '../../types.ts';
import { fetchLessonById, fetchAllLessons } from '../../services/academy.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { AcademyNav } from './AcademyNav.tsx';
import { BabyPipsContentRenderer } from './BabyPipsContentRenderer.tsx';
import { InteractiveQuiz } from './InteractiveQuiz.tsx';
import { MasterExamAssessment } from './MasterExamAssessment.tsx';
import { CapstoneLockCard } from './CapstoneLockCard.tsx';
import { getQuizForLesson, LessonQuiz } from '../../data/quizzes.ts';
import { getMasterExamForLesson, MasterExam } from '../../data/exams.ts';
import { 
  StudentTier, 
  getActiveStudentTier, 
  setActiveStudentTier, 
  subscribeToTierChanges, 
  isLessonUnlockedForTier, 
  isLessonVisibleForTier,
  PRACTICAL_EXERCISE_LESSON_ID,
  getPracticalExerciseProgress,
  isPracticalExerciseUnlocked,
  getPracticalExercisePreviewContent,
  getStoredCompletedLessonIds
} from '../../services/academyAccess.ts';
import { AcademyAuthModal } from './AcademyAuthModal.tsx';
import { FreeCourseEmailModal } from './FreeCourseEmailModal.tsx';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Clock, 
  BookOpen, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ChevronRight,
  GraduationCap,
  HelpCircle,
  Award,
  Mail,
  RotateCcw
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface LessonViewerPageProps {
  lessonId: string;
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onOpenCheckout?: (productId: string) => void;
}

export function LessonViewerPage({ lessonId, onNavigate, onOpenCheckout }: LessonViewerPageProps) {
  const { user, isAdmin, loginWithGoogle } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [studentTier, setStudentTier] = useState<StudentTier>(() => getActiveStudentTier(user, isAdmin));
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => getStoredCompletedLessonIds());
  const [trackingEmail, setTrackingEmail] = useState<string>(() => {
    if (user?.email) return user.email;
    return localStorage.getItem('academy_tracking_email') || '';
  });

  // Prompt gently for email tracking if not already set and not skipped
  useEffect(() => {
    if (!user && !localStorage.getItem('academy_tracking_email') && !localStorage.getItem('academy_tracking_skipped')) {
      const timer = setTimeout(() => {
        setEmailModalOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Sync tier state reactively
  useEffect(() => {
    setStudentTier(getActiveStudentTier(user, isAdmin));
    const unsubscribe = subscribeToTierChanges((newTier) => {
      setStudentTier(newTier);
    });
    return unsubscribe;
  }, [user, isAdmin]);

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

  // Dynamic fetch of lesson from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadLesson() {
      setLoading(true);
      const [fetchedLesson, fetchedAll] = await Promise.all([
        fetchLessonById(lessonId),
        fetchAllLessons(),
      ]);

      if (isMounted) {
        setLesson(fetchedLesson);
        setAllLessons(fetchedAll);
        setLoading(false);

        // Check if marked completed
        try {
          const completed = getStoredCompletedLessonIds();
          setCompletedLessonIds(completed);
          if (fetchedLesson && completed.includes(fetchedLesson.id)) {
            setIsCompleted(true);
          } else {
            setIsCompleted(false);
          }
        } catch {
          // ignore
        }
      }
    }

    loadLesson();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  // Access control: Free Tier students access Levels 1-3 and lesson-3-bonus.
  // Final practical capstone (lesson-3-practical) is locked until Levels 1 to 3 are completed.
  // Paid Tier students unlock Levels 4-8 and lesson-8-bonus.
  const isLessonFree = lesson ? Boolean(lesson.is_free) : true;
  const isPractical = lesson?.id === PRACTICAL_EXERCISE_LESSON_ID;
  const practicalProgress = useMemo(
    () => getPracticalExerciseProgress(completedLessonIds),
    [completedLessonIds]
  );
  const isPracticalUnlocked = useMemo(
    () => isPracticalExerciseUnlocked(completedLessonIds, studentTier, isAdmin),
    [completedLessonIds, studentTier, isAdmin]
  );
  const isUnlocked = isPractical
    ? isPracticalUnlocked
    : isLessonUnlockedForTier(lesson, studentTier, isAdmin, completedLessonIds);

  const { previewContent, lockedContentTeaser } = useMemo(() => {
    if (!lesson || !isPractical) return { previewContent: '', lockedContentTeaser: '' };
    return getPracticalExercisePreviewContent(lesson.content);
  }, [lesson, isPractical]);

  // Dedicated Master Exam for foundational bonus chapter (kept separate from normal quizzes)
  const masterExam: MasterExam | null = lesson ? getMasterExamForLesson(lesson.id) : null;

  // Standard practice quiz if available (only if not a master exam chapter)
  const activeQuiz: LessonQuiz | null = (lesson && !masterExam) ? getQuizForLesson(lesson.id) : null;

  // Next and Previous lesson navigation: only cycle through lessons visible to this tier
  const visibleLessons = allLessons.filter((l) => isLessonVisibleForTier(l.id, studentTier));
  const currentIndex = visibleLessons.findIndex((l) => l.id === lesson?.id || l.order_index === lesson?.order_index);
  const prevLesson = currentIndex > 0 ? visibleLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < visibleLessons.length - 1 ? visibleLessons[currentIndex + 1] : null;

  const syncProgressToServer = async (ids: string[]) => {
    const emailToUse = user?.email || localStorage.getItem('academy_tracking_email');
    if (!emailToUse) return; // Untracked session
    try {
      await fetch('/api/academy/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse,
          completedLessonIds: ids,
          lastLessonId: lesson?.id,
        }),
      });
    } catch {
      // Non-blocking offline fallback
    }
  };

  const handleMarkComplete = (explicitLessonId?: string) => {
    const targetId = explicitLessonId || lesson?.id;
    if (!targetId) return;
    try {
      const completed: string[] = getStoredCompletedLessonIds();
      if (!completed.includes(targetId)) {
        const updated = [...completed, targetId];
        setIsCompleted(true);
        setCompletedLessonIds(updated);
        localStorage.setItem('completed_lesson_ids', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: updated } }));
        syncProgressToServer(updated);
      } else {
        setIsCompleted(true);
      }
    } catch {
      // ignore
    }
  };

  const handleToggleComplete = () => {
    if (!lesson) return;
    try {
      const completed: string[] = getStoredCompletedLessonIds();
      let updated: string[];
      if (completed.includes(lesson.id)) {
        updated = completed.filter((id) => id !== lesson.id);
        setIsCompleted(false);
      } else {
        updated = [...completed, lesson.id];
        setIsCompleted(true);
      }
      setCompletedLessonIds(updated);
      localStorage.setItem('completed_lesson_ids', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: updated } }));
      syncProgressToServer(updated);
    } catch {
      // ignore
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <AcademyNav onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-slate-400">Loading lesson from Supabase...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <AcademyNav onNavigate={onNavigate} />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Lesson Not Found</h2>
          <p className="text-sm text-slate-400">The requested lesson could not be retrieved from the database.</p>
          <Button onClick={() => onNavigate('academy')} className="bg-emerald-500 text-slate-950">
            Return to Academy Curriculum
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Academy Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="curriculum" />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
          {/* Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <button
              onClick={() => onNavigate('academy')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Academy</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => {
                const match = lesson.level_name.match(/Level\s+(\d+)/i);
                const lvlNum = match ? match[1] : '1';
                onNavigate('level-hub', lvlNum);
              }}
              className="hover:text-emerald-400 transition-colors text-slate-300 line-clamp-1 font-medium cursor-pointer"
              title="View Level Course Outline"
            >
              {lesson.level_name}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-emerald-400 font-mono font-medium">
              {lesson.id === 'lesson-3-bonus' ? 'Fundamentals Bonus' : lesson.id === 'lesson-8-bonus' ? 'Advanced Bonus' : `Lesson ${lesson.lesson_number}`}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Active Student Tier Mode Badge & Quick-Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px] font-mono">
              <span className="text-slate-500 px-1.5 hidden sm:inline">Student Tier:</span>
              <button
                onClick={() => setActiveStudentTier('free')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                  studentTier === 'free'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View as Free Tier Student (Levels 1–3 + Fundamentals Bonus & Master Exam)"
              >
                Free Tier
              </button>
              <button
                onClick={() => setActiveStudentTier('paid')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                  studentTier === 'paid'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View as Paid Tier Student (Levels 1–8 + Creator Workshop Advanced Bonus)"
              >
                Paid Tier
              </button>
            </div>

            <button
              onClick={handleCopyShare}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-all"
              title="Share Lesson"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Lesson Header Card */}
        <div className="py-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              {lesson.level_name}
            </span>

            {isPractical ? (
              isPracticalUnlocked ? (
                <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Free Tier Capstone • Workshop Unlocked 🎉</span>
                </span>
              ) : (
                <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free Tier Capstone • Locked ({practicalProgress.completedCount}/14 Completed)</span>
                </span>
              )
            ) : lesson.id === 'lesson-3-bonus' ? (
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fundamentals Bonus & Master Exam</span>
              </span>
            ) : lesson.id === 'lesson-8-bonus' ? (
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paid Tier • Advanced Bonus Chapter</span>
              </span>
            ) : isLessonFree ? (
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <Unlock className="w-3 h-3" />
                <span>Free Tier</span>
              </span>
            ) : (
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Masterclass Pro</span>
              </span>
            )}

            {/* Gentle Progress Tracking Status */}
            {trackingEmail ? (
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono hover:border-emerald-400 transition-colors cursor-pointer"
                title="Click to manage or switch tracking email"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tracking to: <span className="underline">{trackingEmail}</span></span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono hover:bg-slate-800 hover:border-emerald-500/40 transition-colors cursor-pointer"
                title="Save your results so you can resume anytime"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Want to track your results? Enter email</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>{lesson.duration_minutes || 15} Min Read</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {lesson.title}
          </h1>

          {lesson.summary && (
            <p className="text-base text-slate-300 leading-relaxed font-light border-l-2 border-emerald-500/40 pl-4 py-1">
              {lesson.summary}
            </p>
          )}

          {/* Complete Checklist button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{isCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
            </button>

            <button
              onClick={() => onNavigate('prompt-architect')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Strategy in Prompt Architect</span>
            </button>
          </div>
        </div>

        {/* Capstone Status Banner for Lesson 3.5 */}
        {isPractical && (
          isPracticalUnlocked ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>🎉 Capstone Unlocked: Strategy Architect Certified</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      14/14 Completed (100%)
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-light mt-0.5 max-w-2xl">
                    You have mastered all foundational lessons across Levels 1 through 3. The full Breakout EA Build Workshop, master prompt recipe, deployment steps, and compilable MQL5 source code are 100% unlocked below!
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.12)]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>Workshop Prerequisite Locked</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold">
                      {practicalProgress.completedCount}/{practicalProgress.totalRequired} Foundation Lessons ({practicalProgress.progressPercent}%)
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-light mt-0.5 max-w-2xl">
                    Previewing Strategy Definition & Machine Facts below. Complete all 14 foundation lessons across Levels 1–3 to unlock the full 5-Ingredient Master Prompt, MetaEditor Deployment Protocol, and Verified MQL5 Source Code!
                  </div>
                </div>
              </div>

              {practicalProgress.nextIncompleteLesson && (
                <button
                  onClick={() => onNavigate('lesson-detail', practicalProgress.nextIncompleteLesson!.id)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
                >
                  <span>Next: {practicalProgress.nextIncompleteLesson.shortTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              )}
            </div>
          )
        )}

        {/* Content Section or Lock Card */}
        {isPractical && !isPracticalUnlocked ? (
          /* Locked State for Capstone Workshop: Preview Visible + Progress Lock Card */
          <div className="mt-4 p-6 sm:p-10 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-10">
            {/* Strategy Definition & Machine Facts Preview */}
            <BabyPipsContentRenderer content={previewContent} />

            {/* Locked Capstone Card with Live Progress, Level Breakdown & Incomplete Lesson Checklist */}
            <CapstoneLockCard
              progress={practicalProgress}
              onNavigate={onNavigate}
              onProgressUpdated={() => {
                setCompletedLessonIds(getStoredCompletedLessonIds());
              }}
            />
          </div>
        ) : isUnlocked ? (
          <div className="mt-4 p-6 sm:p-10 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-10">
            {/* Formatted Content with Clean BabyPips Typography */}
            <BabyPipsContentRenderer content={lesson.content} />

            {/* Dedicated Master Examination Assessment (Extracted & Kept Separate from Normal Quizzes) */}
            {masterExam && (
              <div id="master-exam-section" className="pt-10 border-t border-slate-800">
                <MasterExamAssessment
                  exam={masterExam}
                  onPassedExam={(score, total) => {
                    handleMarkComplete();
                  }}
                  onNextStep={() => {
                    onNavigate('level-hub', '4');
                  }}
                />
              </div>
            )}

            {/* Interactive Quiz Knowledge Check (For normal curriculum lessons with quizzes, kept separate from master exam) */}
            {activeQuiz && !masterExam && (
              <div id="lesson-quiz-section" className="pt-8 border-t border-slate-850">
                <InteractiveQuiz
                  quiz={activeQuiz}
                  onCompleteQuiz={() => {
                    handleMarkComplete();
                  }}
                  onNextLesson={nextLesson ? () => onNavigate('lesson-detail', nextLesson.id) : undefined}
                />
              </div>
            )}

            {/* Bottom Complete Callout */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono">
                Institutional Algorithmic Curriculum • Strategy Architect Academy
              </div>

              <div className="flex items-center gap-3">
                {!user && (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-xs text-slate-400 hover:text-emerald-400 font-mono underline cursor-pointer"
                  >
                    Sign in to sync progress
                  </button>
                )}

                <button
                  onClick={handleToggleComplete}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Lesson Completed!' : 'Mark Lesson as Complete'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Locked Card for Level 4+ and Paid Advanced Bonus Chapter */
          <div className="mt-4 p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 text-center space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <div className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                {lesson.id === 'lesson-8-bonus' ? 'Paid Tier Masterclass Exclusive' : 'Proprietary Institutional Curriculum'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lesson.id === 'lesson-8-bonus' ? "Creator's Workshop Masterclass Required" : 'Masterclass Pro Access Required'}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {lesson.id === 'lesson-8-bonus' 
                  ? "This Advanced Bonus Chapter covers production MQL5 prompts for 2-tier EMA alignment, weekly squeeze traps, dynamic ADR buffers, on-screen chart HUDs, and automated prop firm daily loss shields. It is exclusively available to Paid Tier students."
                  : 'Levels 4 through 8 contain our proprietary quantitative trading engines, production MQL5 source code architectures, 99.9% tick data Monte Carlo stress tests, and Equinix LD4 low-latency execution setups.'}
              </p>
            </div>

            {/* Included highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left py-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Full MQL5 OOP Code Templates</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Fair Value Gap & Sweep Algorithms</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Monte Carlo Drawdown Simulator</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Prop Firm Challenge Risk Kill Switches</span>
              </div>
            </div>

            {/* Unlock CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setActiveStudentTier('paid');
                }}
                className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                Switch to Paid Tier Access
              </button>

              <button
                onClick={() => onNavigate('custom-ea')}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <span>Order Custom Masterclass Project</span>
              </button>

              <button
                onClick={() => onNavigate('academy')}
                className="px-5 py-3.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                Back to Free Curriculum (Levels 1–3)
              </button>
            </div>
          </div>
        )}

        {/* Previous & Next Navigation Bar */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
          {prevLesson ? (
            <button
              onClick={() => onNavigate('lesson-detail', prevLesson.id)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 font-mono">Previous Lesson</div>
                <div className="line-clamp-1 max-w-[200px]">{prevLesson.title}</div>
              </div>
              <span className="sm:hidden">Previous</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => onNavigate('academy')}
            className="text-xs text-slate-400 hover:text-emerald-400 font-mono transition-colors"
          >
            All Curriculum Levels
          </button>

          {nextLesson ? (
            <button
              onClick={() => onNavigate('lesson-detail', nextLesson.id)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-all group"
            >
              <span className="sm:hidden">Next</span>
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-slate-400 font-mono">Next Lesson</div>
                <div className="line-clamp-1 max-w-[200px]">{nextLesson.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div />
          )}
        </div>

      </main>

      {/* In-page Academy Auth Modal */}
      <AcademyAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Free Course Gentle Email Tracking Modal */}
      <FreeCourseEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onEmailSubmitted={(email) => {
          setTrackingEmail(email);
          syncProgressToServer(completedLessonIds);
        }}
        onSkip={() => {
          // Handled inside modal, localStorage updated
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />
    </div>
  );
}
