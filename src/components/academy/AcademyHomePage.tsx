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

interface AcademyHomePageProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onOpenEbookDownload?: () => void;
}

export function AcademyHomePage({ onNavigate, onOpenEbookDownload }: AcademyHomePageProps) {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-28">
      {/* Top Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="curriculum" />

      {/* Hero Section (Matching BabyPips n.png) */}
      <section className="pt-12 sm:pt-16 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        {/* Heraldic Master School Crest */}
        <div className="flex justify-center">
          <SchoolMasterCrest size="md" />
        </div>

        {/* Display Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            School of Strategy Architect
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Welcome! Are you new to trading forex and algorithmic bots? The School of Strategy Architect is our comprehensive online course that helps beginners and discretionary traders learn how to build, test, and master automated trading systems. If you've always wanted to eliminate emotional trading and master institutional algorithmic execution, then this course is for you.
          </p>
        </div>

        {/* Subtle Divider */}
        <hr className="w-24 mx-auto border-slate-800 my-6" />

        {/* Speedometer Progress Meter (Matching BabyPips n.png) */}
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
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all hover:border-cyan-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Strategy Prompt Architect Tool</span>
          </button>

          <button
            onClick={() => onNavigate('free-ebook')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 transition-all hover:border-emerald-400"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Free 48-Page Strategy Ebook (PDF)</span>
          </button>
        </div>
      </section>

      {/* "Get Started!" Pill Divider and Student Tier Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-8">
        <div className="px-6 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-200 font-extrabold text-sm tracking-wide shadow-lg flex items-center gap-2">
          <span>Get Started!</span>
        </div>

        {/* Student Tier Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full p-1 text-xs font-mono">
          <span className="text-slate-500 px-2 hidden sm:inline">Student Tier:</span>
          <button
            onClick={() => setActiveStudentTier('free')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
              studentTier === 'free'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Free Tier (Levels 1–3 + Master Exam)
          </button>
          <button
            onClick={() => setActiveStudentTier('paid')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
              studentTier === 'paid'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paid Tier (Levels 1–8 + Creator's Workshop)
          </button>
        </div>
      </div>

      {/* Sequential Courses List (Course 1 of 8 through Course 8 of 8, matching BabyPips n.png) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {coursesWithLessons.map((course, idx) => {
          const isUnlocked = course.isFree || course.levelNumber <= 3;

          return (
            <div 
              key={course.id}
              className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-10 space-y-8 shadow-xl hover:border-slate-700/80 transition-all"
            >
              {/* TOP HEADER: Crest + Course Info + Start Course Button (matching n.png) */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
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
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      {course.courseOrder}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      course.isFree 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {course.isFree ? 'Free Core' : 'Masterclass Pro'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {course.schoolName}
                  </h2>

                  <p className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold">
                    {course.technicalTitle}
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed font-light max-w-xl">
                    {course.description}
                  </p>
                </div>

                {/* Right: Primary Green Action Button (matching n.png) */}
                <div className="shrink-0 self-center md:self-start">
                  <button
                    onClick={() => onNavigate('level-hub', course.id)}
                    className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Start Course</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* TWO-COLUMN SPLIT: "Your Progress" (Left) vs "Course Outline" (Right) (matching n.png) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Your Progress (Cols 1-4) */}
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400">
                    Your Progress
                  </h3>

                  {isLoggedIn ? (
                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Completion</span>
                        <span className="text-emerald-400 font-bold">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{course.completedCount} of {course.lessons.length} Lessons Completed</span>
                      </div>
                    </div>
                  ) : (
                    /* Logged-out state matching BabyPips n.png: Lock icon + "Sign in to unlock progress tracking" */
                    <div 
                      onClick={() => setAuthModalOpen(true)}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-3 group"
                    >
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden opacity-50" />
                      
                      <div className="flex items-center gap-2.5 text-xs text-sky-400 group-hover:text-sky-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                          <Lock className="w-3 h-3" />
                        </div>
                        <span className="underline underline-offset-2">
                          Sign in to unlock progress tracking.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Course Outline (Cols 5-12) (matching n.png) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400">
                      Course Outline
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      {course.lessons.length} Lessons
                    </span>
                  </div>

                  {/* Vertical Connected Outline with Circular Play Buttons (matching n.png) */}
                  <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
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
                              onNavigate('level-hub', course.id);
                            }
                          }}
                          className="relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
                        >
                          {/* Circular Play / Lock Indicator (on the vertical line) */}
                          <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                              : isPractical && !isPracticalUnlocked
                              ? 'bg-slate-900 border-2 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                              : 'bg-sky-500 group-hover:bg-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                            ) : isPractical && !isPracticalUnlocked ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            )}
                          </div>

                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono text-slate-400 font-bold">
                                {lesson.id === 'lesson-3-bonus'
                                  ? 'Bonus Chapter 3.B:'
                                  : lesson.id === 'lesson-3-practical'
                                  ? 'Capstone 3.5:'
                                  : lesson.id === 'lesson-8-bonus'
                                  ? 'Bonus Chapter 8.B:'
                                  : `Lesson ${lesson.lesson_number}:`}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                                {lesson.title}
                              </span>
                              {lesson.id === 'lesson-3-bonus' && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  <Award className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>Fundamentals Bonus</span>
                                </span>
                              )}
                              {isPractical && (
                                isPracticalUnlocked ? (
                                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <Award className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>Capstone Workshop • Unlocked 🎉</span>
                                  </span>
                                ) : (
                                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                                    <span>Locked ({practicalProgress.completedCount}/14 Done)</span>
                                  </span>
                                )
                              )}
                              {lesson.id === 'lesson-8-bonus' && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                                  <span>Advanced Bonus</span>
                                </span>
                              )}
                            </div>
                            
                            {lesson.summary && (
                              <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-light">
                                {lesson.summary}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {lesson.id === 'lesson-3-bonus' ? (
                              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                <Award className="w-3 h-3 text-emerald-400" />
                                <span>Master Exam (10 Qs)</span>
                              </span>
                            ) : isPractical ? (
                              isPracticalUnlocked ? (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  <Award className="w-3 h-3 text-emerald-400" />
                                  <span>Hands-On Capstone</span>
                                </span>
                              ) : (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>{practicalProgress.progressPercent}% Complete</span>
                                </span>
                              )
                            ) : lesson.id === 'lesson-8-bonus' ? (
                              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>Capstone Blueprint</span>
                              </span>
                            ) : hasQuiz && (
                              quizScores[lesson.id] ? (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Quiz {quizScores[lesson.id].score}/{quizScores[lesson.id].total}</span>
                                </span>
                              ) : (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <HelpCircle className="w-3 h-3 text-amber-400" />
                                  <span>Quiz</span>
                                </span>
                              )
                            )}

                            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{lesson.duration_minutes}m</span>
                            </span>

                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      );
                    })}

                    {/* Paid Tier Notice for Course 8 when on Free Tier */}
                    {course.levelNumber === 8 && studentTier === 'free' && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Advanced Bonus Chapter Available for Paid Tier</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            Includes Creator's Workshop prompt architecture blueprints for multi-tier EMAs and prop firm kill shields.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveStudentTier('paid')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shrink-0 transition-all cursor-pointer"
                        >
                          View as Paid Tier
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </section>

      {/* In-page Academy Auth Modal */}
      <AcademyAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
