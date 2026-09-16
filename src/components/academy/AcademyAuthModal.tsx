import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  X, 
  Lock, 
  LogIn, 
  UserPlus, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface AcademyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AcademyAuthModal({ isOpen, onClose, onSuccess }: AcademyAuthModalProps) {
  const { login, register, loginWithGoogle, resendVerificationEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setErrorMsg(result.error || 'Google Sign-In prompt failed. You can also sign in with email.');
      } else {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const target = unverifiedEmail || email.trim();
    if (!target) {
      setErrorMsg('Please provide your email address to resend confirmation.');
      return;
    }
    setResending(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await resendVerificationEmail(target);
      if (res.success) {
        setSuccessMsg(res.message || `Verification link resent to ${target}!`);
      } else {
        setErrorMsg(res.error || 'Could not resend email. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await login(cleanEmail, password);
        if (result.needsVerification) {
          setNeedsVerification(true);
          setUnverifiedEmail(result.unverifiedEmail || cleanEmail);
          setErrorMsg(result.error || 'Please verify your email before accessing your account.');
        } else if (!result.success) {
          setErrorMsg(result.error || 'Invalid credentials');
        } else {
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        const result = await register({
          email: cleanEmail,
          password,
          name: name.trim() || undefined,
        });
        if (result.needsVerification) {
          setNeedsVerification(true);
          setUnverifiedEmail(result.unverifiedEmail || cleanEmail);
          setSuccessMsg(result.message || `Verification link sent to ${cleanEmail}! Please check your email to activate your account.`);
        } else if (!result.success) {
          setErrorMsg(result.error || 'Registration failed');
        } else {
          setSuccessMsg('Account created successfully! Logging you in...');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 1000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {needsVerification ? (
          /* Verification Required Screen */
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Verify Your Email Address
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                For platform security, all accounts must verify their email address via Supabase before accessing courses and tools.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 text-center break-all">
              {unverifiedEmail || email}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                {resending ? 'Sending Link...' : 'Resend Verification Link'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setNeedsVerification(false);
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg('Once you have clicked the confirmation link in your email, sign in below.');
                }}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Already verified? <span className="text-emerald-400 font-semibold underline">Sign In</span>
              </button>
            </div>

            <div className="border-t border-slate-800/80 pt-4 mt-4">
              <p className="text-[11px] text-slate-400 mb-2">Want instant access without verification emails?</p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google (Instant Verified Access)</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {mode === 'login' ? 'Sign In to Unlock Progress' : 'Create Free Student Account'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Sync your lesson progress, track quiz scores, and unlock personalized trading meters across all courses.
              </p>
            </div>

            {/* Error / Success Notifications */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mb-4 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold text-white flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-mono uppercase text-slate-500">
                or with email
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-slate-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@quant.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-slate-600"
                />
              </div>

              {mode === 'register' && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>A verification link will be sent to your email to activate access.</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {mode === 'login' ? (
                  <span>Don't have an account yet? <strong className="text-emerald-400">Register</strong></span>
                ) : (
                  <span>Already registered? <strong className="text-emerald-400">Sign In</strong></span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
