import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveView, Lesson, LevelMeta } from '../../types.ts';
import { fetchAllLessons, LEVELS_META } from '../../services/academy.ts';
import { CourseBadgeCrest } from '../academy/CourseBadgeCrest.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  getPracticalExerciseProgress,
  isPracticalExerciseUnlocked,
  PRACTICAL_EXERCISE_LESSON_ID,
  getActiveStudentTier,
  FREE_TIER_PREREQUISITES
} from '../../services/academyAccess.ts';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Award, 
  HelpCircle,
  Play,
  Layers,
  ChevronRight,
  ShieldCheck,
  Lock,
  Unlock,
  Code2,
  Cpu,
  Check,
  Zap,
  Target
} from 'lucide-react';

interface HomeFreeAcademySectionProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
}

export function HomeFreeAcademySection({ onNavigate }: HomeFreeAcademySectionProps) {
  const { user, isAdmin } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(1);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const studentTier = getActiveStudentTier(user, isAdmin);

  // Load all lessons and user completion data
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const data = await fetchAllLessons();
      if (isMounted) {
        setLessons(data);
        setLoading(false);
      }
    }
    load();

    const readSaved = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
        setCompletedLessonIds(saved);
      } catch {
        // ignore
      }
    };

    readSaved();

    const handleProgressChange = () => readSaved();
    window.addEventListener('academy-progress-change', handleProgressChange);
    window.addEventListener('storage', handleProgressChange);

    return () => {
      isMounted = false;
      window.removeEventListener('academy-progress-change', handleProgressChange);
      window.removeEventListener('storage', handleProgressChange);
    };
  }, []);

  // Filter for the 3 free levels (Levels 1, 2, 3)
  const freeLevelsMeta = LEVELS_META.filter((m) => m.levelNumber <= 3);

  // Get active selected level meta
  const activeLevelMeta = freeLevelsMeta.find((m) => m.levelNumber === selectedLevelNumber) || freeLevelsMeta[0];

  // Lessons belonging to the currently selected level
  const activeLessons = lessons.filter((l) => {
    const match = l.level_name.match(/Level\s+(\d+)/i);
    const lNum = match ? parseInt(match[1], 10) : 0;
    return lNum === selectedLevelNumber || l.level_name.toLowerCase().includes(activeLevelMeta.schoolName.toLowerCase());
  });

  // Calculate free curriculum metrics
  const practicalProgress = getPracticalExerciseProgress(completedLessonIds);
  const isPracticalUnlocked = isPracticalExerciseUnlocked(completedLessonIds, studentTier, isAdmin);

  const completedFreeCount = practicalProgress.completedCount;
  const totalFreeLessonsCount = practicalProgress.totalRequired;

  // Jump to first uncompleted lesson or orientation
  const handleStartNextLesson = () => {
    if (practicalProgress.nextIncompleteLesson) {
      onNavigate('lesson-detail', practicalProgress.nextIncompleteLesson.id);
    } else {
      onNavigate('lesson-detail', 'lesson-1-0');
    }
  };

  return (
    <section id="free-academy" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono uppercase tracking-wider font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>100% Free Introductory Track • No Credit Card Required</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Start With The{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800">
            Free Academy
          </span>
        </h2>

        <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-3xl mx-auto">
          Begin your journey into quantitative algorithmic trading with <strong>zero coding required</strong>. Master how to turn your plain-English trading ideas into engineered <strong>AI prompts</strong> (ChatGPT & Claude) and build, compile, and deploy your very <strong>first automated trading bot</strong> on MetaTrader 5.
        </p>

        {/* 3 Core Pillars: AI Prompts • No Coding • First Trading Bot */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>⚡ Zero Coding Background Required</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>🤖 Engineered AI Prompts for MQL5</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-teal-700" />
            <span>🚀 Build & Deploy Your 1st Trading Bot</span>
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-mono font-bold text-sm">
                {completedFreeCount}/{totalFreeLessonsCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Free Curriculum Progress</div>
                <div className="text-[11px] text-slate-500">
                  {completedFreeCount === 0 
                    ? '14 foundational lessons ready for you' 
                    : `${completedFreeCount} of ${totalFreeLessonsCount} completed (${practicalProgress.progressPercent}%)`}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartNextLesson}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{completedFreeCount > 0 ? 'Continue Free Track' : 'Start Lesson 1.0 (Free)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Free Level Tabs (Level 1 Preschool, Level 2 Kindergarten, Level 3 Elementary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {freeLevelsMeta.map((level) => {
          const isSelected = selectedLevelNumber === level.levelNumber;
          const levelPrereqs = FREE_TIER_PREREQUISITES.filter(p => p.levelNumber === level.levelNumber);
          const completedCount = levelPrereqs.filter(p => completedLessonIds.includes(p.id)).length;
          const isLevelComplete = completedCount === levelPrereqs.length && levelPrereqs.length > 0;

          return (
            <button
              key={level.id}
              onClick={() => setSelectedLevelNumber(level.levelNumber)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer group ${
                isSelected 
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10' 
                  : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Highlight bar */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-600" />
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <CourseBadgeCrest
                      levelNumber={level.levelNumber}
                      schoolName={level.schoolName}
                      isFree={true}
                      size="sm"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-wider">
                      Course {level.levelNumber} of 8 • FREE
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      Level {level.levelNumber}: {level.schoolName}
                    </h3>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                  isLevelComplete
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  {isLevelComplete ? 'Done ✓' : `${completedCount}/${levelPrereqs.length}`}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-3 font-normal line-clamp-2 leading-relaxed">
                {level.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">
                  {completedCount}/{levelPrereqs.length} Lessons Finished
                </span>
                <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-900'}`}>
                  View Lessons <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Level Showcase with Full Lessons Grid */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Level Banner Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-center p-1 shadow-sm shrink-0">
              <CourseBadgeCrest
                levelNumber={activeLevelMeta.levelNumber}
                schoolName={activeLevelMeta.schoolName}
                isFree={true}
                size="md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
                  Level {activeLevelMeta.levelNumber} • {activeLevelMeta.schoolName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-semibold">
                  Free Tier
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {activeLevelMeta.technicalTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
                {activeLevelMeta.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('level-hub', String(activeLevelMeta.levelNumber))}
              className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Level Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (activeLessons.length > 0) {
                  onNavigate('lesson-detail', activeLessons[0].id);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Level {activeLevelMeta.levelNumber}</span>
            </button>
          </div>
        </div>

        {/* Lessons Cards List */}
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase text-slate-500 tracking-wider font-bold">
            Curriculum Lessons in Level {activeLevelMeta.levelNumber}:
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeLessons.map((lesson, idx) => {
              const isCompleted = completedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => onNavigate('lesson-detail', lesson.id)}
                  className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          Lesson {activeLevelMeta.levelNumber}.{lesson.lesson_number}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 font-semibold">
                            Free
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {lesson.title}
                    </h4>

                    {/* Excerpt preview */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {lesson.content
                        .replace(/[#*`_>\[\]]/g, '')
                        .slice(0, 140)
                        .trim()}...
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        8 min
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700">
                        <HelpCircle className="w-3 h-3" />
                        Mastery Quiz
                      </span>
                    </div>

                    <span className="text-emerald-800 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>Read Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FINAL PRACTICAL EXERCISE CARD (Visible preview, Locked state with live progress) */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-6 border-t border-slate-200/90">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0F1E1B] via-[#0B1714] to-[#060D0B] text-white p-6 sm:p-8 border border-emerald-700/60 shadow-xl overflow-hidden space-y-6">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none" />

            {/* Top Bar: Title & Locked/Unlocked Status */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  isPracticalUnlocked 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isPracticalUnlocked ? (
                    <Unlock className="w-6 h-6 stroke-[2.5]" />
                  ) : (
                    <Lock className="w-6 h-6 stroke-[2.5]" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Culminating Free Tier Capstone
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isPracticalUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isPracticalUnlocked ? 'Unlocked ✓' : 'Locked • Levels 1–3 Required'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Final Practical Exercise: Build & Verify Your First Robot
                  </h3>
                  <p className="text-xs text-emerald-100/70 mt-1">
                    The hands-on capstone workshop where you assemble your first fully functional MQL5 Breakout EA and verify it in MetaTrader 5.
                  </p>
                </div>
              </div>

              {/* Progress Pill */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-700/50 flex items-center gap-3 shrink-0 self-stretch md:self-auto">
                <div className="text-right flex-1 md:flex-initial">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-200">Prerequisite Progress</div>
                  <div className="text-base font-mono font-bold text-white">
                    {practicalProgress.completedCount} / {practicalProgress.totalRequired} <span className="text-xs text-emerald-400">({practicalProgress.progressPercent}%)</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-mono font-bold text-xs">
                  {practicalProgress.progressPercent}%
                </div>
              </div>
            </div>

            {/* Live Progress Bar Across Levels 1 to 3 */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-200">
                <span>Completion Status: {isPracticalUnlocked ? 'All prerequisites satisfied! Ready for Capstone.' : `${practicalProgress.remainingCount} prerequisite lesson(s) remaining`}</span>
                <span className="font-bold">{practicalProgress.progressPercent}% Completed</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-950/80 border border-emerald-800/40 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${practicalProgress.progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    isPracticalUnlocked
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                      : 'bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400'
                  }`}
                />
              </div>

              {/* 3-Level Breakdown Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {practicalProgress.levelBreakdown.map((lb) => (
                  <div
                    key={lb.levelNumber}
                    className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs font-mono ${
                      lb.isDone
                        ? 'bg-emerald-950/50 border-emerald-600/60 text-emerald-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {lb.isDone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Level {lb.levelNumber}: {lb.schoolName}</span>
                    </div>
                    <span className="font-bold">{lb.completed}/{lb.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Exercise Preview Details (Always Visible!) */}
            <div className="p-5 rounded-2xl bg-black/40 border border-emerald-800/50 space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    Exercise Blueprint Preview
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/80">Estimated Time: 45 min</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">1</span>
                    <span>Rule Translation</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light">Convert eyeball support bounce into exact machine facts.</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">2</span>
                    <span>4 Lego Blocks</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light">Structure the Brain, Shield, Glasses, and Hands modules.</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">3</span>
                    <span>AI Assembly</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light">Generate complete MQL5 source code using the Master Prompt.</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">4</span>
                    <span>MT5 Backtest</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light">Compile in MetaEditor and verify zero errors in Strategy Tester.</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 relative z-10">
              <div className="text-xs text-emerald-200 font-light">
                {isPracticalUnlocked 
                  ? '🎉 All prerequisites unlocked! You can now start the hands-on capstone workshop.'
                  : 'Complete all 14 foundational lessons in Levels 1 to 3 to unlock full workshop execution.'}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('lesson-detail', PRACTICAL_EXERCISE_LESSON_ID)}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPracticalUnlocked
                      ? 'bg-white text-emerald-950 hover:bg-emerald-50 shadow-md shadow-emerald-900/30'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50'
                  }`}
                >
                  {isPracticalUnlocked ? (
                    <>
                      <span>Start Practical Exercise</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Preview Locked Exercise</span>
                    </>
                  )}
                </button>

                {!isPracticalUnlocked && practicalProgress.nextIncompleteLesson && (
                  <button
                    onClick={() => onNavigate('lesson-detail', practicalProgress.nextIncompleteLesson!.id)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Resume Next Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pathways Switcher to Pro Track or Full Academy */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ready to progress beyond Level 3? Explore our Pro Track (Levels 4–8) for ICT & Prop Firm engines.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('prompt-architect')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
            >
              AI Prompt Architect Tool
            </button>
            <button
              onClick={() => onNavigate('academy')}
              className="text-xs font-bold text-white px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore All 8 Levels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeFreeAcademySection;
