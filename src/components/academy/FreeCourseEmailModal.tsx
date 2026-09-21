import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, Bookmark, User, KeyRound, Sparkles, X } from 'lucide-react';

interface FreeCourseEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmitted: (email: string) => void;
  onSkip: () => void;
  onOpenAuthModal?: () => void;
}

export const FreeCourseEmailModal: React.FC<FreeCourseEmailModalProps> = ({
  isOpen,
  onClose,
  onEmailSubmitted,
  onSkip,
  onOpenAuthModal,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRestoreMode, setIsRestoreMode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Persist to local storage
      localStorage.setItem('academy_tracking_email', cleanEmail);
      localStorage.removeItem('academy_tracking_skipped');

      // Call server to retrieve or initialize student progress
      const res = await fetch('/api/academy/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          completedLessonIds: JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]'),
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.progress?.completedLessonIds?.length > 0) {
          // Merge remote with local
          const localIds = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
          const combined = Array.from(new Set([...localIds, ...data.progress.completedLessonIds]));
          localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
        }
      }

      onEmailSubmitted(cleanEmail);
      onClose();
    } catch {
      // Fallback client-only save
      localStorage.setItem('academy_tracking_email', cleanEmail);
      onEmailSubmitted(cleanEmail);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('academy_tracking_skipped', 'true');
    onSkip();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm"
      onClick={handleSkip}
    >
      <div className="fixed inset-0 -z-10" onClick={handleSkip} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg my-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Close Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Skip"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-bold">
            MEGA FREE ACADEMY // PROGRESS SYNC
          </span>
        </div>

        {/* Clear Headline & Friendly Message */}
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Want to track your results? Enter your email.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You don't need a password or full account just to participate. If you enter an email, we'll save your results to it so you can return anytime. If you skip, you can still take the course, but we won't track your results.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>No forced account creation — just a friendly choice.</span>
          </div>
        </div>

        {/* Email Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 font-semibold mb-1.5">
              {isRestoreMode ? 'Enter your saved email to restore results' : 'Your Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                autoFocus
              />
            </div>
            {errorMessage && (
              <p className="text-xs text-rose-600 font-medium mt-1.5">{errorMessage}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>SAVING...</span>
              ) : (
                <>
                  <span>{isRestoreMode ? 'RESTORE MY RESULTS' : 'SAVE MY RESULTS'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full sm:w-auto py-3 px-5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center"
            >
              Skip & Take Untracked
            </button>
          </div>
        </form>

        {/* Gentle Account and Returning User Options */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setIsRestoreMode(!isRestoreMode)}
            className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
          >
            {isRestoreMode ? '← Back to new student' : 'Returning student? Restore progress'}
          </button>

          {onOpenAuthModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Password Account / Sign In</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
