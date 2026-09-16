import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MasterExam } from '../../data/exams.ts';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  GraduationCap,
  Clock,
  Check
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface MasterExamAssessmentProps {
  exam: MasterExam;
  onPassedExam?: (score: number, total: number) => void;
  onNextStep?: () => void;
}

export function MasterExamAssessment({
  exam,
  onPassedExam,
  onNextStep
}: MasterExamAssessmentProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const questions = exam.questions;
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;

  // Load previous exam record if available
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('academy_master_exam_scores') || '{}');
      if (stored[exam.id]) {
        // user previously completed
      }
    } catch {
      // ignore
    }
  }, [exam.id]);

  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  // Calculate score
  const correctCount = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const hasPassed = scorePercent >= exam.passingScorePercent;

  const triggerCelebration = () => {
    try {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };
      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      };
      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#10B981', '#38BDF8', '#6366F1'] });
      fire(0.2, { spread: 60, colors: ['#FBBF24', '#34D399'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    } catch {
      // fallback
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    if (isExamSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    if (hasPassed) {
      triggerCelebration();
    }
    try {
      const stored = JSON.parse(localStorage.getItem('academy_master_exam_scores') || '{}');
      stored[exam.id] = {
        score: correctCount,
        total: totalQuestions,
        scorePercent,
        passed: hasPassed,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('academy_master_exam_scores', JSON.stringify(stored));
    } catch {
      // ignore
    }

    if (hasPassed && onPassedExam) {
      onPassedExam(correctCount, totalQuestions);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsExamSubmitted(false);
    setCurrentIdx(0);
  };

  // Pre-exam start banner
  if (!examStarted) {
    return (
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Master Examination</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {exam.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {exam.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Questions</div>
            <div className="text-xl font-bold text-white mt-0.5">{totalQuestions} Questions</div>
            <div className="text-xs text-slate-500">Levels 1, 2, & 3 Curriculum</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Passing Threshold</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{exam.passingScorePercent}% Mastery</div>
            <div className="text-xs text-slate-500">8 out of 10 required</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Certification</div>
            <div className="text-xl font-bold text-cyan-400 mt-0.5">Junior Architect</div>
            <div className="text-xs text-slate-500">Instant Verification</div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Untimed • Comprehensive Rationales Provided After Completion</span>
          </div>
          <Button
            size="lg"
            onClick={() => setExamStarted(true)}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full px-8 shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            <span>Begin Master Examination ➔</span>
          </Button>
        </div>
      </div>
    );
  }

  // Exam Result Screen
  if (isExamSubmitted) {
    return (
      <div className="rounded-3xl bg-slate-900/95 border-2 border-emerald-500/50 p-6 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="text-center space-y-4">
          <div className={`w-20 h-20 mx-auto rounded-full border-2 flex items-center justify-center ${
            hasPassed 
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
              : 'bg-amber-500/20 border-amber-400 text-amber-400'
          }`}>
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
              hasPassed ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {hasPassed ? '🎉 EXAMINATION PASSED' : 'EXAMINATION COMPLETED'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              You Scored {correctCount} / {totalQuestions} ({scorePercent}%)
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              {hasPassed 
                ? 'Institutional foundational mastery achieved! You have verified deep command of Strategy Architect principles, code mechanics in plain English, and modular robot architecture.'
                : 'Good attempt! You need 80% to pass the Master Examination. Review the question-by-question rationales below to master the concepts, then retake whenever you are ready.'}
            </p>
          </div>

          {hasPassed && (
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Foundational Accreditation Status: Verified</span>
              </div>
              <p className="text-slate-300">
                You are officially qualified to architect automated Expert Advisors, specify algorithmic machine facts, and safely prompt AI code engines for MetaTrader 5.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleRetake}
              className="border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white rounded-full px-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Retake Examination</span>
            </Button>
            {onNextStep && (
              <Button
                size="md"
                onClick={onNextStep}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full px-8 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              >
                <span>Continue to Next Step ➔</span>
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Question Review & Rationale */}
        <div className="pt-8 border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Complete Question Review & Answer Key</span>
            </h4>
            <span className="text-xs font-mono text-slate-400">
              {correctCount} Correct • {totalQuestions - correctCount} Incorrect
            </span>
          </div>

          <div className="space-y-5">
            {questions.map((q, idx) => {
              const selected = userAnswers[idx];
              const isCorrect = selected === q.correctIndex;
              return (
                <div 
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-slate-950/60 border-emerald-500/30'
                      : 'bg-slate-950/60 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{q.levelOrigin}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {q.conceptTag}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white mt-3 mb-3">
                    {q.question}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = selected === optIdx;
                      const isTheCorrect = optIdx === q.correctIndex;

                      let rowStyle = 'bg-slate-900/60 border-slate-800/60 text-slate-400';
                      if (isTheCorrect) {
                        rowStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium';
                      } else if (isUserChoice && !isTheCorrect) {
                        rowStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-300 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`px-3.5 py-2 rounded-xl border text-xs flex items-center justify-between ${rowStyle}`}
                        >
                          <span>{opt}</span>
                          {isTheCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isUserChoice && !isTheCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Plain English Rationale */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed font-normal">
                    <span className="font-mono font-bold text-emerald-400 mr-1.5">Rationale:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Flow: Question by Question
  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-7">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-1.5">
              <span>{exam.levelRange}</span>
              <span>•</span>
              <span>Passing: {exam.passingScorePercent}%</span>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-white">
              {exam.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-300">
            Question <span className="text-white font-extrabold">{currentIdx + 1}</span> of {totalQuestions}
          </span>
          <div className="w-24 sm:w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Stepper Indicator (1 - 10) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {questions.map((_, i) => {
          const isAnswered = userAnswers[i] !== undefined;
          const isCurrent = currentIdx === i;

          return (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                isCurrent 
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : isAnswered 
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Box */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            {currentQ.levelOrigin}
          </span>
          <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            {currentQ.conceptTag}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = userAnswers[currentIdx] === optIdx;

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                  isSelected 
                    ? 'bg-emerald-500/10 border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected 
                    ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                    : 'border-slate-700 group-hover:border-slate-500 text-transparent'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <span className="text-xs sm:text-sm leading-relaxed font-normal">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation & Submit */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          className="border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-3">
          {currentIdx < totalQuestions - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              size="md"
              disabled={!isAllAnswered}
              onClick={handleSubmitExam}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-6 shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-40 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Submit Master Exam</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
