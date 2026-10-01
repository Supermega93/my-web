import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion, LessonQuiz } from '../../data/quizzes.ts';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  ShieldCheck,
  Check,
  Flame,
  Volume2
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface InteractiveQuizProps {
  quiz: LessonQuiz;
  onCompleteQuiz?: (score: number, total: number) => void;
  onNextLesson?: () => void;
}

export function InteractiveQuiz({ quiz, onCompleteQuiz, onNextLesson }: InteractiveQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<{ [qIdx: number]: number }>({});

  const questions = quiz.questions;
  const currentQ = questions[currentIdx] || questions[0];
  const totalQ = questions.length;

  // Load previous best score if available
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('academy_quiz_scores') || '{}');
      if (stored[quiz.lessonId] !== undefined) {
        // User has taken this quiz before
      }
    } catch {
      // ignore
    }
  }, [quiz.lessonId]);

  const fireConfetti = (mode: 'mini' | 'grand') => {
    try {
      if (mode === 'mini') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#34D399', '#38BDF8', '#FBBF24']
        });
      } else {
        // Grand celebration
        const count = 200;
        const defaults = {
          origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: confetti.Options) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          colors: ['#10B981', '#38BDF8', '#6366F1']
        });
        fire(0.2, {
          spread: 60,
          colors: ['#FBBF24', '#34D399']
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
      }
    } catch {
      // Canvas confetti fallback
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    const newAnswers = { ...answersHistory, [currentIdx]: idx };
    setAnswersHistory(newAnswers);

    const isCorrect = idx === currentQ.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
      fireConfetti('mini');
    }

    // Immediately persist quiz score and curriculum marking
    try {
      const stored = JSON.parse(localStorage.getItem('academy_quiz_scores') || '{}');
      stored[quiz.lessonId] = {
        score: newScore,
        total: totalQ,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('academy_quiz_scores', JSON.stringify(stored));
    } catch {
      // ignore
    }

    // If this is the final (or single) question, trigger curriculum completion immediately
    if (currentIdx === totalQ - 1 && onCompleteQuiz) {
      onCompleteQuiz(newScore, totalQ);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished quiz
      setQuizFinished(true);
      fireConfetti('grand');
      
      try {
        const stored = JSON.parse(localStorage.getItem('academy_quiz_scores') || '{}');
        stored[quiz.lessonId] = {
          score: score,
          total: totalQ,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem('academy_quiz_scores', JSON.stringify(stored));
      } catch {
        // ignore
      }

      if (onCompleteQuiz) {
        onCompleteQuiz(score, totalQ);
      }
    }
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setAnswersHistory({});
  };

  if (!currentQ) {
    return null;
  }

  if (quizFinished) {
    const percentage = Math.round((score / totalQ) * 100);
    const isMastery = percentage >= 80;

    return (
      <div className="rounded-xl bg-[#101623] border border-[#1E293B] p-6 sm:p-10 text-center space-y-5 shadow-sm relative overflow-hidden animate-in fade-in duration-200">
        <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Award className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            {isMastery ? 'Concept Mastered' : 'Assessment Completed'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Score: {score} / {totalQ} ({percentage}%)
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {isMastery 
              ? 'Institutional concept mastery confirmed. You have demonstrated a clear understanding of the trading logic and risk controls in this lesson.' 
              : 'Review the educational takeaways above or retake the assessment to achieve an 80%+ mastery score.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={handleRetake}
            className="px-4 py-2 rounded-lg bg-[#141C2A] hover:bg-[#1A2538] text-slate-300 hover:text-white border border-[#222E42] text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>

          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wide transition-colors shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#101623] border border-[#1E293B] shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
              Assessment
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              {quiz.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Question <strong className="text-white font-semibold">{currentIdx + 1}</strong> of {totalQ}
          </span>
          <div className="w-20 sm:w-28 h-1.5 bg-[#162030] rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="space-y-4">
        <div className="flex items-start gap-2.5">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider shrink-0 mt-0.5">
            {currentQ.conceptTag || 'Concept'}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options (A, B, C, D) */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let optionStyle = 'bg-[#0C121D] border-[#1E293B] hover:border-[#2A3852] hover:bg-[#141C2A] text-slate-200';
            let badgeStyle = 'bg-[#162030] text-slate-400 border-[#223048]';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200';
                badgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-200';
                badgeStyle = 'bg-rose-500 text-white font-bold border-rose-400';
              } else {
                optionStyle = 'bg-[#0C121D]/50 border-[#1E293B]/40 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-emerald-500/10 border-emerald-500/50 text-white';
              badgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-lg border transition-colors flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 border ${badgeStyle}`}>
                  {isAnswerSubmitted && isCorrect ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isAnswerSubmitted && isSelected && !isCorrect ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    letter
                  )}
                </div>

                <span className="text-sm font-medium leading-relaxed flex-1 mt-0.5">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box */}
      {isAnswerSubmitted && (
        <div className="p-4 sm:p-5 rounded-lg bg-[#0C121D] border border-[#1E293B] space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {selectedOption === currentQ.correctIndex ? 'Correct Analysis' : 'Explanation & Context'}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {currentQ.explanation}
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wide transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <span>{currentIdx < totalQ - 1 ? 'Next Question' : 'View Summary'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
