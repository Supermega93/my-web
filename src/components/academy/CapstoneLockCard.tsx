import React, { useState } from 'react';
import { ActiveView } from '../../types.ts';
import { 
  PracticalExerciseProgress, 
  fastTrackUnlockPracticalExercise, 
  resetPracticalExerciseProgress 
} from '../../services/academyAccess.ts';
import { 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Terminal, 
  ChevronRight, 
  Check, 
  RotateCcw,
  Zap,
  Code2,
  FileCheck,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface CapstoneLockCardProps {
  progress: PracticalExerciseProgress;
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onProgressUpdated?: () => void;
}

export function CapstoneLockCard({ progress, onNavigate, onProgressUpdated }: CapstoneLockCardProps) {
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFastTrack = () => {
    setIsUpdating(true);
    fastTrackUnlockPracticalExercise();
    setTimeout(() => {
      setIsUpdating(false);
      if (onProgressUpdated) onProgressUpdated();
    }, 200);
  };

  const handleReset = () => {
    setIsUpdating(true);
    resetPracticalExerciseProgress();
    setTimeout(() => {
      setIsUpdating(false);
      if (onProgressUpdated) onProgressUpdated();
    }, 200);
  };

  const displayedMissing = showAllMissing 
    ? progress.missingLessons 
    : progress.missingLessons.slice(0, 4);

  return (
    <div className="relative mt-8 rounded-2xl bg-white border border-amber-300 p-6 sm:p-10 shadow-sm space-y-8 overflow-hidden text-slate-900">
      {/* Header with Lock Badge & Motivation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Free Tier Capstone Workshop
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[11px] font-medium text-slate-500">Prerequisite Locked</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Complete Levels 1 to 3 to Unlock Full Workshop
            </h3>
          </div>
        </div>

        {/* Big Progress Counter Pill */}
        <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Foundation Progress</div>
            <div className="text-lg font-bold text-emerald-700">
              {progress.completedCount} / {progress.totalRequired} <span className="text-xs text-slate-500 font-normal">({progress.progressPercent}%)</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs">
            {progress.progressPercent}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">
            Curriculum Completion: <span className="text-slate-900 font-bold">{progress.completedCount}</span> of {progress.totalRequired} Foundation Lessons
          </span>
          <span className="text-amber-700 font-bold">
            {progress.remainingCount} lesson{progress.remainingCount === 1 ? '' : 's'} remaining
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, progress.progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Level Breakdown Grid (Levels 1, 2, 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 relative z-10">
        {progress.levelBreakdown.map((lvl) => {
          return (
            <div
              key={lvl.levelNumber}
              className={`p-4 rounded-xl border transition-all ${
                lvl.isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Level {lvl.levelNumber}
                </span>
                {lvl.isDone ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Complete</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-700">
                    {lvl.completed}/{lvl.total} Done
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900 mb-2">{lvl.schoolName}</div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    lvl.isDone ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${lvl.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Action Button: Jump to Next Incomplete Lesson */}
      {progress.nextIncompleteLesson && (
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recommended Next Step</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {progress.nextIncompleteLesson.title}
            </div>
            <div className="text-xs text-slate-600">
              {progress.nextIncompleteLesson.levelName}
            </div>
          </div>

          <button
            onClick={() => onNavigate('lesson-detail', progress.nextIncompleteLesson!.id)}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Continue to Next Lesson</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}

      {/* Remaining Prerequisite Lessons Checklist */}
      {progress.missingLessons.length > 0 && (
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase tracking-wider font-bold">
              Uncompleted Prerequisite Lessons ({progress.missingLessons.length})
            </span>
            {progress.missingLessons.length > 4 && (
              <button
                onClick={() => setShowAllMissing(!showAllMissing)}
                className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer font-semibold"
              >
                {showAllMissing ? 'Show Fewer' : `Show All ${progress.missingLessons.length} Remaining`}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {displayedMissing.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => onNavigate('lesson-detail', lesson.id)}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between gap-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 group-hover:border-emerald-500 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 shrink-0 text-xs font-bold transition-colors">
                    {lesson.order}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {lesson.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {lesson.levelName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 font-semibold">
                  <span>Start Lesson</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teaser of Protected Workshop Artifacts */}
      <div className="space-y-3 pt-4 border-t border-slate-200 relative z-10">
        <div className="text-xs uppercase tracking-wider text-slate-600 font-bold flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <span>Protected Workshop Artifacts (Unlocks Upon Foundation Completion)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>The 5-Ingredient AI Master Prompt Formula</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ready-to-Run ChatGPT/Claude/Gemini Master Prompt</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>MetaEditor F4/F7 0-Error Compilation & Safety Protocol</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>MT5 Strategy Tester Verification Checklist (5-Points)</span>
          </div>
          <div className="sm:col-span-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 font-medium">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Complete Verified MQL5 Source Code Answer Key (Breakout_EA_Level1to3.mq5)</span>
          </div>
        </div>
      </div>

      {/* Testing & Fast-Track Utility Bar */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 relative z-10">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
          <span>Complete all 14 lessons in Levels 1–3 to earn Capstone Architect certification.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFastTrack}
            disabled={isUpdating}
            title="Convenience testing tool: instantly mark Levels 1–3 complete to preview the fully unlocked workshop"
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3 h-3 text-emerald-600" />
            <span>Fast-Track Demo (Unlock All 14)</span>
          </button>

          {progress.completedCount > 0 && (
            <button
              onClick={handleReset}
              disabled={isUpdating}
              title="Reset progress to test the locked state"
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-[11px] transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
