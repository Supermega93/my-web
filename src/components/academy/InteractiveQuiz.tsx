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
      <div className="rounded-3xl bg-slate-900 border-2 border-emerald-500/50 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            {isMastery ? '🎉 Concept Mastered!' : 'Quiz Completed!'}
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            You scored {score} out of {totalQ} ({percentage}%)
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
            {isMastery 
              ? 'Institutional mastery unlocked! You have thoroughly grasped the core logic, formulas, and architecture of this lesson.' 
              : 'Good effort! Review the takeaways above or retake the questions to lock in an 80%+ mastery score.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="md"
            onClick={handleRetake}
            className="border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white rounded-full px-6 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span>Retake Quiz</span>
          </Button>

          {onNextLesson && (
            <Button
              size="md"
              onClick={onNextLesson}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full px-8 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              <span>Next Lesson ➔</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-7">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-extrabold">
              Interactive Quiz
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-white">
              {quiz.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm font-mono text-slate-300">
            Question <span className="text-white font-extrabold">{currentIdx + 1}</span> of {totalQ}
          </div>
          <div className="w-24 sm:w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold shrink-0 mt-0.5">
            {currentQ.conceptTag || 'Concept'}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options (A, B, C, D) with distinct hover & instant feedback */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let optionStyle = 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 text-slate-200';
            let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500';
                badgeStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-400';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-100 ring-1 ring-rose-500';
                badgeStyle = 'bg-rose-500 text-white font-bold border-rose-400';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500/60';
              badgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold shrink-0 border ${badgeStyle} transition-transform`}>
                  {isAnswerSubmitted && isCorrect ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isAnswerSubmitted && isSelected && !isCorrect ? (
                    <XCircle className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    letter
                  )}
                </div>

                <span className="text-sm sm:text-base font-semibold leading-relaxed flex-1 mt-0.5">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box (Reveals after answering) */}
      {isAnswerSubmitted && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-amber-300">
              {selectedOption === currentQ.correctIndex ? '✨ Correct!' : '💡 Key Concept & Explanation'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {currentQ.explanation}
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIdx < totalQ - 1 ? 'Next Question' : 'View Quiz Results'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
