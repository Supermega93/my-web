import React, { useState, useEffect, useMemo } from 'react';
import { ActiveView, Lesson } from '../../types.ts';
import { fetchAllLessons, LEVELS_META } from '../../services/academy.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { AcademyNav } from './AcademyNav.tsx';
import { SchoolMasterCrest } from './SchoolMasterCrest.tsx';
import { CourseBadgeCrest } from './CourseBadgeCrest.tsx';
import { SpeedometerProgressCard } from './SpeedometerProgressCard.tsx';
import { AcademyAuthModal } from './AcademyAuthModal.tsx';
import { getQuizForLesson } from '../../data/quizzes.ts';
import { 
  StudentTier, 
  getActiveStudentTier, 
  setActiveStudentTier, 
  subscribeToTierChanges, 
  isLessonVisibleForTier,
  PRACTICAL_EXERCISE_LESSON_ID,
  getPracticalExerciseProgress,
  isPracticalExerciseUnlocked,
  getStoredCompletedLessonIds
} from '../../services/academyAccess.ts';
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Lock, 
  Play, 
  ArrowRight, 
  Clock, 
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  FileText,
  Award
} from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { MasterclassPricingSection } from './MasterclassPricingSection.tsx';

interface AcademyHomePageProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onOpenEbookDownload?: () => void;
  onBuyNow?: (product: any, tier?: any) => void;
}

export function AcademyHomePage({ onNavigate, onOpenEbookDownload, onBuyNow }: AcademyHomePageProps) {
  const { user, isLoggedIn, isAdmin } = useAuth();
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

  // Fetch all lessons dynamically from Supabase / fallback
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchAllLessons();
      if (isMounted) {
        setLessons(data);
        setLoading(false);
      }
    }
    loadData();

    // Load saved progress and quiz scores from localStorage
    try {
      const saved = getStoredCompletedLessonIds();
      setCompletedLessonIds(saved);
      const savedScores = JSON.parse(localStorage.getItem('academy_quiz_scores') || '{}');
      setQuizScores(savedScores);
    } catch {
      // ignore
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync progress reactively when quizzes are passed or lessons toggled
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

  // Map lessons into each of the 8 curriculum levels with tier visibility filtering
  const coursesWithLessons = useMemo(() => {
    return LEVELS_META.map((meta) => {
      const levelLessons = lessons
        .filter((l) => isLessonVisibleForTier(l.id, studentTier))
        .filter((l) => {
          // match by levelNumber or string match in level_name
          const match = l.level_name.match(/Level\s+(\d+)/i);
          const lNum = match ? parseInt(match[1], 10) : 0;
          return lNum === meta.levelNumber || l.level_name.toLowerCase().includes(meta.schoolName.toLowerCase());
        });

      const completedInLevel = levelLessons.filter((l) => completedLessonIds.includes(l.id)).length;
      const progressPercent = levelLessons.length > 0 
        ? Math.round((completedInLevel / levelLessons.length) * 100) 
        : 0;

      return {
        ...meta,
        lessons: levelLessons,
        completedCount: completedInLevel,
        progressPercent,
      };
    });
  }, [lessons, completedLessonIds, studentTier]);

  // Overall metrics across all curriculum lessons visible for tier
  const visibleAllLessons = useMemo(() => {
    return lessons.filter((l) => isLessonVisibleForTier(l.id, studentTier));
  }, [lessons, studentTier]);

  const totalLessons = visibleAllLessons.length;
  const totalCompleted = completedLessonIds.filter((id) => visibleAllLessons.some((l) => l.id === id)).length;

  return (
    <div className="relative min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-28">
      {/* Top Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="curriculum" />

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        {/* Heraldic Master School Crest */}
        <div className="flex justify-center">
          <SchoolMasterCrest size="md" />
        </div>

        {/* Display Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            School of Strategy Architect
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Master institutional algorithmic execution and quantitative automation. Follow our structured 8-level curriculum designed to take discretionary traders from fundamental MQL5 architecture to institutional risk management and multi-tier expert advisors.
          </p>
        </div>

        {/* Subtle Divider */}
        <hr className="w-16 mx-auto border-[#1E293B] my-6" />

        {/* Speedometer Progress Meter */}
        <div className="pt-2">
          <SpeedometerProgressCard
            isLoggedIn={isLoggedIn}
            completedCount={totalCompleted}
            totalCount={totalLessons || 24}
            userName={user?.name}
            onSignInClick={() => setAuthModalOpen(true)}
            onContinueClick={() => {
              // Jump to first uncompleted lesson
              const nextUncompleted = lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0];
              if (nextUncompleted) {
                onNavigate('lesson-detail', nextUncompleted.id);
              }
            }}
          />
        </div>

        {/* Free Ebook & Tools Quick Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('prompt-architect')}
            className="px-4 py-2 rounded-lg bg-[#101623] hover:bg-[#141C2A] text-slate-200 border border-[#1E293B] hover:border-cyan-500/50 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Strategy Prompt Architect Tool</span>
          </button>

          <button
            onClick={() => onNavigate('free-ebook')}
            className="px-4 py-2 rounded-lg bg-[#101623] hover:bg-[#141C2A] text-slate-200 border border-[#1E293B] hover:border-emerald-500/50 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Free 48-Page Strategy Ebook (PDF)</span>
          </button>
        </div>
      </section>

      {/* Curriculum Header & Tier Indicator */}
      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 my-8 max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="font-semibold text-white uppercase tracking-wider text-[11px]">8 Structured Levels</span>
          <span aria-hidden="true">·</span>
          <span>Core Foundation to Institutional Deployment</span>
        </div>

        {/* Student Tier Badge & Status */}
        <div className="flex items-center gap-2 bg-[#101623] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-slate-400">
          <span>Your Tier:</span>
          <span
            className={`font-semibold text-xs ${
              studentTier === 'paid' || studentTier === 'complimentary'
                ? 'text-cyan-400'
                : 'text-emerald-400'
            }`}
          >
            {studentTier === 'paid' ? 'Paid Tier (All 8 Levels)' : studentTier === 'complimentary' ? 'Complimentary Access' : 'Free Core (Levels 1–3)'}
          </span>
          {isAdmin && (
            <div className="flex items-center gap-1.5 ml-2 border-l border-[#1E293B] pl-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Admin:</span>
              <button
                onClick={() => setActiveStudentTier('free')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  studentTier === 'free'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setActiveStudentTier('paid')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  studentTier === 'paid'
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paid
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sequential Courses List (Course 1 of 8 through Course 8 of 8) */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {coursesWithLessons.map((course) => {
          const isAuthorized = course.isFree || course.levelNumber <= 3 || studentTier === 'paid' || studentTier === 'complimentary' || isAdmin;
          const isUnlocked = isAuthorized;

          return (
            <div 
              key={course.id}
              className="rounded-xl bg-[#101623] border border-[#1E293B] p-6 sm:p-8 space-y-6 shadow-sm hover:border-[#2A3852] transition-colors"
            >
              {/* TOP HEADER: Crest + Course Info + Start Course Button */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-[#1E293B]">
                {/* Left: Heraldic Course Crest */}
                <div className="shrink-0 flex justify-center">
                  <CourseBadgeCrest
                    levelNumber={course.levelNumber}
                    schoolName={course.schoolName}
                    isFree={course.isFree}
                    hasNewEditionBadge={course.hasNewEditionBadge}
                    size="md"
                  />
                </div>

                {/* Center: Course Title & Description */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">
                      {course.courseOrder}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      course.isFree 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {course.isFree ? 'Free Core' : 'Masterclass Pro'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {course.schoolName}
                  </h2>

                  <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                    {course.technicalTitle}
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-xl">
                    {course.description}
                  </p>
                </div>

                {/* Right: Primary Action Button */}
                <div className="shrink-0 self-center md:self-start">
                  <button
                    onClick={() => {
                      if (isAuthorized) {
                        onNavigate('level-hub', course.id);
                      } else {
                        onNavigate('academy-pricing');
                      }
                    }}
                    className={`px-5 py-2.5 rounded-lg text-white font-medium text-xs tracking-wide transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98] ${
                      isAuthorized
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-xs'
                        : 'bg-[#1C2638] hover:bg-[#25334A] border border-[#2B3A54] text-slate-200'
                    }`}
                  >
                    <span>{isAuthorized ? 'Start Level' : 'Unlock Access'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TWO-COLUMN SPLIT: "Your Progress" (Left) vs "Course Outline" (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Your Progress (Cols 1-4) */}
                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Level Progress
                  </h3>

                  {isLoggedIn ? (
                    <div className="p-4 rounded-lg bg-[#0C121D] border border-[#1A2234] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Completion</span>
                        <span className="text-emerald-400 font-bold">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#162030] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{course.completedCount} of {course.lessons.length} Lessons Finished</span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setAuthModalOpen(true)}
                      className="p-4 rounded-lg bg-[#0C121D] border border-[#1A2234] hover:border-[#2A3852] cursor-pointer transition-colors space-y-2.5 group"
                    >
                      <div className="w-full h-2 bg-[#162030] rounded-full overflow-hidden opacity-50" />
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-emerald-400 font-medium">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span className="underline underline-offset-2">
                          Sign in to track progress
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Course Outline (Cols 5-12) */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Curriculum Lessons
                    </h3>
                    <span className="text-xs text-slate-500">
                      {course.lessons.length} Modules
                    </span>
                  </div>

                  {/* Clean List with Status Badges */}
                  <div className="space-y-2">
                    {course.lessons.map((lesson) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const hasQuiz = Boolean(getQuizForLesson(lesson.id));
                      const isPractical = lesson.id === PRACTICAL_EXERCISE_LESSON_ID;
                      const practicalProgress = getPracticalExerciseProgress(completedLessonIds);
                      const isPracticalUnlocked = isPracticalExerciseUnlocked(completedLessonIds, studentTier, isAdmin);

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
                          className="flex items-center justify-between p-3 rounded-lg bg-[#0C121D] hover:bg-[#141C2A] border border-[#1A2234] hover:border-[#2A3852] transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-4">
                            {/* Circular Icon */}
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : isPractical && !isPracticalUnlocked
                                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                                : 'bg-[#162030] text-slate-400 group-hover:text-emerald-400 border border-[#223048]'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                              ) : isPractical && !isPracticalUnlocked ? (
                                <Lock className="w-2.5 h-2.5" />
                              ) : (
                                <Play className="w-2 h-2 fill-current ml-0.5" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-slate-400 font-medium">
                                  {lesson.id === 'lesson-3-bonus'
                                    ? 'Bonus 3.B:'
                                    : lesson.id === 'lesson-3-practical'
                                    ? 'Capstone 3.5:'
                                    : lesson.id === 'lesson-8-bonus'
                                    ? 'Bonus 8.B:'
                                    : `${lesson.lesson_number}.`}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                                  {lesson.title}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs">
                            {lesson.id === 'lesson-3-bonus' ? (
                              <span className="hidden sm:inline-block text-[11px] text-emerald-400 font-medium">
                                Master Exam
                              </span>
                            ) : isPractical ? (
                              isPracticalUnlocked ? (
                                <span className="hidden sm:inline-block text-[11px] text-emerald-400 font-medium">
                                  Capstone Unlocked
                                </span>
                              ) : (
                                <span className="hidden sm:inline-block text-[11px] text-amber-400 font-medium">
                                  Locked ({practicalProgress.completedCount}/14)
                                </span>
                              )
                            ) : hasQuiz && (
                              quizScores[lesson.id] ? (
                                <span className="hidden sm:inline-block text-[11px] text-emerald-400 font-medium">
                                  Quiz {quizScores[lesson.id].score}/{quizScores[lesson.id].total}
                                </span>
                              ) : (
                                <span className="hidden sm:inline-block text-[11px] text-slate-500">
                                  Quiz
                                </span>
                              )
                            )}

                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{lesson.duration_minutes}m</span>
                            </span>

                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </section>

      {/* Distinct Masterclass Section Right Below Academy Curriculum */}
      <div className="relative mt-20 border-t border-[#1E293B] bg-[#0A0D14]">
        <MasterclassPricingSection 
          onNavigate={onNavigate} 
          onOpenAuth={() => setAuthModalOpen(true)} 
          onBuyNow={onBuyNow}
        />
      </div>

      {/* In-page Academy Auth Modal */}
      <AcademyAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
