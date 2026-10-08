import React, { useState, useEffect, useMemo } from 'react';
import { ActiveView, Lesson } from '../../types.ts';
import { fetchLessonById, fetchAllLessons, fetchUserProgressFromSupabase, saveUserLessonProgressToSupabase, syncAllProgressToSupabase } from '../../services/academy.ts';
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
  INDICATOR_WORKSHOP_LESSON_ID,
  getPracticalExerciseProgress,
  isPracticalExerciseUnlocked,
  getPracticalExercisePreviewContent,
  getStoredCompletedLessonIds
} from '../../services/academyAccess.ts';
import { IndicatorWorkshopWorkbench } from './IndicatorWorkshopWorkbench.tsx';
import { LessonVideoPlayer } from './LessonVideoPlayer.tsx';
import { LessonExerciseDocCard } from './LessonExerciseDocCard.tsx';
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

  // Sync completed lessons reactively and load from Supabase when user is authenticated
  useEffect(() => {
    let active = true;

    async function loadSupabaseProgress() {
      if (user?.id) {
        const supaCompleted = await fetchUserProgressFromSupabase(user.id);
        if (active && supaCompleted && supaCompleted.length > 0) {
          const localCompleted = getStoredCompletedLessonIds();
          const combined = Array.from(new Set([...localCompleted, ...supaCompleted]));
          setCompletedLessonIds(combined);
          localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
          window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
        }
      }
    }

    loadSupabaseProgress();

    const handleProgressChange = () => {
      setCompletedLessonIds(getStoredCompletedLessonIds());
    };
    window.addEventListener('academy-progress-change', handleProgressChange);
    window.addEventListener('storage', handleProgressChange);
    return () => {
      active = false;
      window.removeEventListener('academy-progress-change', handleProgressChange);
      window.removeEventListener('storage', handleProgressChange);
    };
  }, [user?.id]);

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
  }, [lessonId, user?.id, user?.access_status, studentTier]);

  // Access control: Free Tier students access Levels 1-3 and lesson-3-bonus.
  // Final practical capstone (lesson-3-practical) is locked until Levels 1 to 3 are completed.
  // Paid Tier students unlock Levels 4-8 and lesson-8-bonus.
  const isLessonFree = lesson ? Boolean(lesson.is_free) : true;
  const isBreakoutWorkshop = lesson?.id === PRACTICAL_EXERCISE_LESSON_ID || lesson?.id === 'lesson-3-5';
  const isIndicatorWorkshop = lesson?.id === INDICATOR_WORKSHOP_LESSON_ID || lesson?.id === 'lesson-3-6';
  const isPractical = isBreakoutWorkshop || isIndicatorWorkshop;

  // Level 1, 2, and 3 Lesson identification for masterclass video embedding:
  // Lesson 1.1 (and orientation 1.0) -> Level 1 video
  // Lesson 2.1 -> Level 2 video
  // Lesson 3.1 -> Level 3 video
  // Generic -> any other lesson with video_url or video_id
  const isLevel1Lesson = lesson
    ? (
        lesson.id === 'lesson-1-1' ||
        lesson.id === 'lesson-1-0' ||
        lesson.title?.toLowerCase().includes('lesson 1.1') ||
        (lesson.level_name?.includes('Level 1') && (lesson.lesson_number === 1 || lesson.lesson_number === 2 || lesson.order_index === 1 || lesson.order_index === 2))
      )
    : false;

  const isLevel2Lesson = lesson
    ? (
        lesson.id === 'lesson-2-1' ||
        lesson.title?.toLowerCase().includes('lesson 2.1') ||
        (lesson.level_name?.includes('Level 2') && (lesson.lesson_number === 1 || lesson.order_index === 5 || lesson.id?.includes('2-1')))
      )
    : false;

  const isLevel3Lesson = lesson
    ? (
        lesson.id === 'lesson-3-1' ||
        lesson.title?.toLowerCase().includes('lesson 3.1') ||
        (lesson.level_name?.includes('Level 3') && (lesson.lesson_number === 1 || lesson.order_index === 9 || lesson.id?.includes('3-1')))
      )
    : false;

  const isLevel4Lesson = lesson
    ? (
        lesson.id === 'lesson-4-1' ||
        lesson.title?.toLowerCase().includes('lesson 4.1') ||
        (lesson.level_name?.includes('Level 4') && (lesson.lesson_number === 1 || lesson.order_index === 14 || lesson.order_index === 15 || lesson.id?.includes('4-1')))
      )
    : false;

  const isLevel5Lesson = lesson
    ? (
        lesson.id === 'lesson-5-1' ||
        lesson.title?.toLowerCase().includes('lesson 5.1') ||
        (lesson.level_name?.includes('Level 5') && (lesson.lesson_number === 1 || lesson.order_index === 18 || lesson.order_index === 19 || lesson.id?.includes('5-1')))
      )
    : false;

  const isOtherDedicatedVideoLesson = lesson
    ? (
        Boolean(lesson.video_url || lesson.video_id) &&
        !isLevel1Lesson &&
        !isLevel2Lesson &&
        !isLevel3Lesson &&
        !isLevel4Lesson &&
        !isLevel5Lesson &&
        !isBreakoutWorkshop &&
        !isIndicatorWorkshop
      )
    : false;
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

        // Persist directly into Supabase user_progress by user ID
        if (user?.id) {
          saveUserLessonProgressToSupabase(user.id, targetId, true);
        }
      } else {
        setIsCompleted(true);
        if (user?.id) {
          saveUserLessonProgressToSupabase(user.id, targetId, true);
        }
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
        if (user?.id) {
          saveUserLessonProgressToSupabase(user.id, lesson.id, false);
        }
      } else {
        updated = [...completed, lesson.id];
        setIsCompleted(true);
        if (user?.id) {
          saveUserLessonProgressToSupabase(user.id, lesson.id, true);
        }
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
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans">
        <AcademyNav onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Loading lesson...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans">
        <AcademyNav onNavigate={onNavigate} />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Lesson Not Found</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">The requested lesson could not be retrieved from the database.</p>
          <Button onClick={() => onNavigate('academy')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-xs">
            Return to Academy Curriculum
          </Button>
        </div>
      </div>
    );
  }

  const currentLevelNumber = lesson?.level_name 
    ? parseInt(lesson.level_name.match(/Level\s+(\d+)/i)?.[1] || '1', 10) 
    : undefined;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Academy Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="curriculum" currentLevel={currentLevelNumber} />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        
        {/* Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <button
              onClick={() => onNavigate('academy')}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 font-medium cursor-pointer text-slate-600"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Academy</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={() => {
                const match = lesson.level_name.match(/Level\s+(\d+)/i);
                const lvlNum = match ? match[1] : '1';
                onNavigate('level-hub', lvlNum);
              }}
              className="hover:text-emerald-700 transition-colors text-slate-600 line-clamp-1 font-medium cursor-pointer"
              title="View Level Course Outline"
            >
              {lesson.level_name}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-emerald-700 font-bold">
              {lesson.id === 'lesson-3-bonus' ? 'Fundamentals Bonus' : lesson.id === 'lesson-8-bonus' ? 'Advanced Bonus' : `Lesson ${lesson.lesson_number}`}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Active Student Tier Mode Badge */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs shadow-xs">
              <span className="text-slate-500 hidden sm:inline">Tier:</span>
              <span
                className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                  studentTier === 'paid' || studentTier === 'complimentary'
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {studentTier === 'paid' ? 'Paid Tier' : studentTier === 'complimentary' ? 'Complimentary' : 'Free Tier'}
              </span>
              {isAdmin && (
                <div className="flex items-center gap-1 ml-1 border-l border-slate-200 pl-1.5">
                  <span className="text-[10px] text-amber-700 font-bold">ADMIN:</span>
                  <button
                    onClick={() => setActiveStudentTier('free')}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${studentTier === 'free' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setActiveStudentTier('paid')}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${studentTier === 'paid' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Paid
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCopyShare}
              className="p-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Share Lesson"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Lesson Header Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs text-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              {lesson.level_name}
            </span>

            {isBreakoutWorkshop ? (
              isPracticalUnlocked ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Capstone • Breakout EA Unlocked</span>
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Capstone • Locked ({practicalProgress.completedCount}/14 Completed)</span>
                </span>
              )
            ) : isIndicatorWorkshop ? (
              isPracticalUnlocked ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Final Workshop • MT5 Indicator Unlocked</span>
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Final Workshop • Locked ({practicalProgress.completedCount}/14 Completed)</span>
                </span>
              )
            ) : lesson.id === 'lesson-3-bonus' ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fundamentals Bonus & Master Exam</span>
              </span>
            ) : lesson.id === 'lesson-8-bonus' ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>Paid Tier • Advanced Bonus</span>
              </span>
            ) : isLessonFree ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" />
                <span>Free Tier</span>
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Masterclass Pro</span>
              </span>
            )}

            {/* Gentle Progress Tracking Status */}
            {trackingEmail ? (
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs hover:border-emerald-400 transition-colors cursor-pointer"
                title="Click to manage or switch tracking email"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tracking to: <span className="underline">{trackingEmail}</span></span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                title="Save your results so you can resume anytime"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>Save progress: Enter email</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{lesson.duration_minutes || 15} min read</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {lesson.title}
          </h1>

          {lesson.summary && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal border-l-2 border-emerald-500 pl-4 py-1">
              {lesson.summary}
            </p>
          )}

          {/* Educational Progression Pipeline */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-slate-800 font-semibold">1. Read Lesson</span>
              <span className="text-slate-300">→</span>
              <span className={activeQuiz ? "text-slate-800 font-semibold" : "text-slate-400"}>2. Quiz & Exam</span>
              <span className="text-slate-300">→</span>
              <span className={isCompleted ? "text-emerald-700 font-bold" : "text-slate-400"}>
                {isCompleted ? '✓ 3. Completed' : '3. Mark Done'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
                <span>{isCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
              </button>

              <button
                onClick={() => onNavigate('prompt-architect')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prompt Architect</span>
              </button>
            </div>
          </div>
        </div>

        {/* Capstone Status Banner for Lesson 3.5 & Lesson 3.6 */}
        {isPractical && (
          isPracticalUnlocked ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-900 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>
                      {isIndicatorWorkshop
                        ? '🎉 Final Practical Workshop: Build Your First MT5 Indicator'
                        : '🎉 Capstone Unlocked: Strategy Architect Certified'}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      14/14 Completed (100%)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-normal mt-0.5 max-w-2xl">
                    {isIndicatorWorkshop
                      ? 'You have unlocked the final practical workshop of the Free Academy! Follow the interactive 8-step workbench below to specify, prompt, compile in MetaEditor, visually test in MT5, and iterate your custom ADR indicator.'
                      : 'You have mastered all foundational lessons across Levels 1 through 3. The full Breakout EA Build Workshop, master prompt recipe, deployment steps, and compilable MQL5 source code are 100% unlocked below!'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-900 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>{isIndicatorWorkshop ? 'Indicator Workshop Prerequisite Locked' : 'Workshop Prerequisite Locked'}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {practicalProgress.completedCount}/{practicalProgress.totalRequired} Foundation Lessons ({practicalProgress.progressPercent}%)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-normal mt-0.5 max-w-2xl">
                    {isIndicatorWorkshop
                      ? 'Previewing Idea & Structural Specifications below. Complete all 14 foundation lessons across Levels 1–3 to unlock the interactive 8-step indicator workbench, Claude coding prompts, compiler error protocol, and full MQL5 source code!'
                      : 'Previewing Strategy Definition & Machine Facts below. Complete all 14 foundation lessons across Levels 1–3 to unlock the full 5-Ingredient Master Prompt, MetaEditor Deployment Protocol, and Verified MQL5 Source Code!'}
                  </div>
                </div>
              </div>

              {practicalProgress.nextIncompleteLesson && (
                <button
                  onClick={() => onNavigate('lesson-detail', practicalProgress.nextIncompleteLesson!.id)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
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
          <div className="mt-4 p-6 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-10 text-slate-900">
            {/* Video Lesson Version at the very beginning of Lesson 3.5 */}
            {isBreakoutWorkshop && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=WmiEpfDXjOo"}
                videoId={lesson.video_id || "WmiEpfDXjOo"}
                title={lesson.video_title || "🎥 Practical Workshop: From Trading Idea to MT5 EA With AI"}
                subtitle={lesson.video_subtitle || "Watch the complete practical walkthrough before working through the lesson below."}
                badgeText={lesson.video_badge || "Practical Workshop Video"}
                footerHint="Watch the full practical walkthrough video above or review the strategy blueprint preview below."
                footerSubtext="Strategy Preview & Guide Below ↓"
              />
            )}

            {/* Video Lesson Version at the very beginning of Lesson 3.6 */}
            {isIndicatorWorkshop && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=MzNUHEDPWPs"}
                videoId={lesson.video_id || "MzNUHEDPWPs"}
                title={lesson.video_title || "Build Your First MT5 Indicator (ADR)"}
                subtitle={lesson.video_subtitle || "Full video lesson version: follow the complete 16-step AI automation workflow, ChatGPT prompt specifications, Claude MQL5 coding, MetaEditor compilation, and MT5 visual chart testing."}
                badgeText={lesson.video_badge || "Video Lesson Version"}
              />
            )}

            {/* Free Downloadable Exercise Document */}
            {isBreakoutWorkshop && (
              <LessonExerciseDocCard type="ea" className="my-4" />
            )}
            {isIndicatorWorkshop && (
              <LessonExerciseDocCard type="indicator" className="my-4" />
            )}

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
          <div className="mt-4 p-6 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-10 text-slate-900">
            {/* Embedded YouTube Video for Level 1 (Lesson 1.1 & Orientation) */}
            {isLevel1Lesson && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=POVEstXyCkg"}
                videoId={lesson.video_id || "POVEstXyCkg"}
                title={lesson.video_title || "Level 1 Masterclass: Strategy Architect Mindset & Foundations"}
                subtitle={lesson.video_subtitle || "Watch this masterclass before beginning the written lesson below."}
                badgeText={lesson.video_badge || "Level 1 Video Masterclass"}
                footerHint="Watch the Level 1 masterclass video above, then follow the full written lesson and take the quick quiz below."
                footerSubtext="Written Lesson & Quiz Below ↓"
              />
            )}

            {/* Embedded YouTube Video for Level 2 (Lesson 2.1) */}
            {isLevel2Lesson && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=sQBo6OO0JOo"}
                videoId={lesson.video_id || "sQBo6OO0JOo"}
                title={lesson.video_title || "Level 2 Masterclass: Programming Concepts in Plain English"}
                subtitle={lesson.video_subtitle || "Watch this video walkthrough before beginning the written lesson below."}
                badgeText={lesson.video_badge || "Level 2 Video Masterclass"}
                footerHint="Watch the video walkthrough above, then study the labelled boxes and variables below."
                footerSubtext="Written Lesson & Code Below ↓"
              />
            )}

            {/* Embedded YouTube Video for Level 3 (Lesson 3.1) */}
            {isLevel3Lesson && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=qSFuZUI-y8U"}
                videoId={lesson.video_id || "qSFuZUI-y8U"}
                title={lesson.video_title || "Level 3 Masterclass: Robot Architecture & Blueprints"}
                subtitle={lesson.video_subtitle || "Watch this video walkthrough before beginning the written lesson below."}
                badgeText={lesson.video_badge || "Level 3 Video Masterclass"}
                footerHint="Watch the video walkthrough above, then study the 5 program types and blueprints below."
                footerSubtext="Written Architecture Guide Below ↓"
              />
            )}

            {/* Embedded YouTube Video for Level 4 (Lesson 4.1) */}
            {isLevel4Lesson && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=8dCosWPYlIY"}
                videoId={lesson.video_id || "8dCosWPYlIY"}
                title={lesson.video_title || "Level 4 Masterclass: Mastering AI Prompt Engineering"}
                subtitle={lesson.video_subtitle || "Watch this masterclass walkthrough on prompt engineering formulas before beginning the written lesson below."}
                badgeText={lesson.video_badge || "Level 4 Video Masterclass"}
                footerHint="Watch the Level 4 masterclass video above, then follow the full written lesson and prompt recipes below."
                footerSubtext="Written Lesson & Prompts Below ↓"
              />
            )}

            {/* Embedded YouTube Video for Level 5 (Lesson 5.1) */}
            {isLevel5Lesson && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=jXLcal2hSrw"}
                videoId={lesson.video_id || "jXLcal2hSrw"}
                title={lesson.video_title || "Level 5 Masterclass: The Safety Shield & Risk Architecture"}
                subtitle={lesson.video_subtitle || "Watch this video walkthrough on safety shields and automated risk architecture before beginning the written lesson below."}
                badgeText={lesson.video_badge || "Level 5 Video Masterclass"}
                footerHint="Watch the Level 5 masterclass video above, then study dynamic lot sizing and prop firm circuit breakers below."
                footerSubtext="Written Lesson & Code Below ↓"
              />
            )}

            {/* Embedded YouTube Video for any subsequent lesson with video configuration */}
            {isOtherDedicatedVideoLesson && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url!}
                videoId={lesson.video_id}
                title={lesson.video_title || lesson.title}
                subtitle={lesson.video_subtitle || lesson.summary}
                badgeText={lesson.video_badge || "Video Masterclass"}
              />
            )}

            {/* 3. Embedded YouTube Video at the very beginning of Lesson 3.5 */}
            {isBreakoutWorkshop && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=WmiEpfDXjOo"}
                videoId={lesson.video_id || "WmiEpfDXjOo"}
                title={lesson.video_title || "🎥 Practical Workshop: From Trading Idea to MT5 EA With AI"}
                subtitle={lesson.video_subtitle || "Watch the complete practical walkthrough before working through the lesson below."}
                badgeText={lesson.video_badge || "Practical Workshop Video"}
                footerHint="Watch the complete practical walkthrough before working through the written lesson, prompt recipes, and verified source code below."
                footerSubtext="Written Manual & Resources Below ↓"
              />
            )}

            {/* Video Lesson Version at the very beginning of Lesson 3.6 */}
            {isIndicatorWorkshop && (
              <LessonVideoPlayer
                videoUrl={lesson.video_url || "https://www.youtube.com/watch?v=MzNUHEDPWPs"}
                videoId={lesson.video_id || "MzNUHEDPWPs"}
                title={lesson.video_title || "Build Your First MT5 Indicator (ADR)"}
                subtitle={lesson.video_subtitle || "Full video lesson version: follow the complete 16-step AI automation workflow, ChatGPT prompt specifications, Claude MQL5 coding, MetaEditor compilation, and MT5 visual chart testing."}
                badgeText={lesson.video_badge || "Video Lesson Version"}
              />
            )}

            {/* Free Downloadable Exercise Document associated directly with the exercise */}
            {isIndicatorWorkshop && (
              <LessonExerciseDocCard type="indicator" className="my-6" />
            )}

            {/* Interactive Indicator Workshop Workbench for Lesson 3.6 */}
            {isIndicatorWorkshop && (
              <div className="mb-8">
                <IndicatorWorkshopWorkbench
                  onComplete={() => handleMarkComplete('lesson-3-6')}
                  isCompleted={isCompleted}
                  onNavigateToMasterclass={() => onNavigate('level-hub', '4')}
                />
              </div>
            )}

            {/* 4. Formatted Content with Clean BabyPips Typography */}
            <BabyPipsContentRenderer content={lesson.content} />

            {/* 5. Existing downloadable resources / materials for Lesson 3.5 */}
            {isBreakoutWorkshop && (
              <div className="pt-4 border-t border-slate-200">
                <LessonExerciseDocCard type="ea" className="my-2" />
              </div>
            )}

            {/* Dedicated Master Examination Assessment (Extracted & Kept Separate from Normal Quizzes) */}
            {masterExam && (
              <div id="master-exam-section" className="pt-10 border-t border-slate-200">
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
              <div id="lesson-quiz-section" className="pt-8 border-t border-slate-200">
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
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Institutional Algorithmic Curriculum • Strategy Architect Academy
              </div>

              <div className="flex items-center gap-3">
                {!user && (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-xs text-slate-600 hover:text-emerald-700 font-medium underline cursor-pointer"
                  >
                    Sign in to sync progress
                  </button>
                )}

                <button
                  onClick={handleToggleComplete}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
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
          <div className="mt-4 p-8 sm:p-14 rounded-2xl bg-white border border-slate-200 text-center space-y-6 shadow-sm relative overflow-hidden text-slate-900">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mx-auto shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <div className="text-xs uppercase text-cyan-700 font-bold tracking-wider">
                {lesson.id === 'lesson-8-bonus' ? 'Paid Tier Masterclass Exclusive' : 'Proprietary Institutional Curriculum'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lesson.id === 'lesson-8-bonus' ? "Creator's Workshop Masterclass Required" : 'Masterclass Pro Access Required'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {lesson.id === 'lesson-8-bonus' 
                  ? "This Advanced Bonus Chapter covers production MQL5 prompts for 2-tier EMA alignment, weekly squeeze traps, dynamic ADR buffers, on-screen chart HUDs, and automated prop firm daily loss shields. It is exclusively available to Paid Tier students."
                  : 'Levels 4 through 8 contain our proprietary quantitative trading engines, production MQL5 source code architectures, 99.9% tick data Monte Carlo stress tests, and Equinix LD4 low-latency execution setups.'}
              </p>
            </div>

            {/* Included highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left py-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Full MQL5 OOP Code Templates</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Fair Value Gap & Sweep Algorithms</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Monte Carlo Drawdown Simulator</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Prop Firm Challenge Risk Kill Switches</span>
              </div>
            </div>

            {/* Unlock CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('academy-pricing')}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all shadow-xs cursor-pointer"
              >
                Get Masterclass Access (View Pricing)
              </button>

              <button
                onClick={() => onNavigate('academy-pricing')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all border border-slate-200 flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View Masterclass Pricing Packages</span>
              </button>

              <button
                onClick={() => onNavigate('academy')}
                className="px-5 py-3 rounded-xl text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
              >
                Back to Free Curriculum (Levels 1–3)
              </button>
            </div>
          </div>
        )}

        {/* Previous & Next Navigation Bar */}
        <div className="mt-10 pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
          {prevLesson ? (
            <button
              onClick={() => onNavigate('lesson-detail', prevLesson.id)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all shadow-xs group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400">Previous Lesson</div>
                <div className="line-clamp-1 max-w-[200px]">{prevLesson.title}</div>
              </div>
              <span className="sm:hidden">Previous</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => onNavigate('academy')}
            className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors"
          >
            All Curriculum Levels
          </button>

          {nextLesson ? (
            isIndicatorWorkshop && studentTier === 'free' ? (
              <button
                onClick={() => onNavigate('level-hub', '4')}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-xs font-semibold text-cyan-800 transition-all group cursor-pointer shadow-xs"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-cyan-600">Graduate Free Academy</div>
                  <div className="line-clamp-1 max-w-[200px]">Unlock Masterclass Pro</div>
                </div>
                <span className="sm:hidden">Masterclass</span>
                <Sparkles className="w-4 h-4 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('lesson-detail', nextLesson.id)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all shadow-xs group cursor-pointer"
              >
                <span className="sm:hidden">Next</span>
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-emerald-100">Next Lesson</div>
                  <div className="line-clamp-1 max-w-[200px]">{nextLesson.title}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            )
          ) : isIndicatorWorkshop ? (
            <button
              onClick={() => onNavigate('level-hub', '4')}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs transition-all group cursor-pointer"
            >
              <div className="text-right">
                <div className="text-[10px] text-cyan-100 uppercase tracking-wider">Graduate to Masterclass</div>
                <div className="line-clamp-1">Enter Level 4: Middle School</div>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
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
