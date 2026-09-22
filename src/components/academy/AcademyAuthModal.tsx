import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  X, 
  Lock, 
  LogIn, 
  UserPlus, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Eye,
  EyeOff,
  ExternalLink,
  Globe,
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
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [domainAuthPrompt, setDomainAuthPrompt] = useState<{
    show: boolean;
    domain: string;
    consoleUrl: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setDomainAuthPrompt(null);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        if (result.isUnauthorizedDomain) {
          setDomainAuthPrompt({
            show: true,
            domain: window.location.hostname,
            consoleUrl: result.authorizedDomainUrl || 'https://console.firebase.google.com/project/gen-lang-client-0034348968/authentication/settings',
          });
        } else {
          setErrorMsg(result.error || 'Google Sign-In prompt failed. You can also sign in with email.');
        }
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

  return createPortal(
    <div 
      id="academy-auth-modal"
      className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4 sm:p-6 text-center"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      {/* Click-outside backdrop layer */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        className="relative w-full max-w-md my-auto bg-slate-900/98 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-left z-10 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {needsVerification ? (
          /* Verification Required Screen */
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Verify Your Email Address
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                For platform security, verify your email address via Supabase to access the Academy courses and files.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 text-center break-all">
              {unverifiedEmail || email}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2 text-left animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 text-left animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Button
                type="button"
                onClick={handleResend}
                disabled={resending}
                variant="primary"
                fullWidth
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium cursor-pointer"
              >
                {resending ? 'Sending Link...' : 'Resend Verification Link'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setNeedsVerification(false);
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg('Once you have confirmed your email, sign in below.');
                }}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Already verified? <span className="text-emerald-400 font-semibold underline">Sign In</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 text-xs font-semibold transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>

            <div className="border-t border-slate-800/80 pt-4 mt-4">
              <p className="text-[11px] text-slate-400 mb-2.5">Prefer instant login without confirmation emails?</p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-750 border border-slate-750 hover:border-slate-600 text-xs font-medium text-white flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center space-y-1.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {mode === 'login' ? 'Welcome Back to Academy' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                {mode === 'login' 
                  ? 'Sign in to sync your progress, track quiz scores, and unlock lesson materials.' 
                  : 'Get started for free to access course modules, community notes, and study guides.'}
              </p>
            </div>

            {/* Segmented Control Tabs */}
            <div className="flex p-1 bg-slate-950/70 rounded-2xl border border-slate-800/80 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all select-none cursor-pointer ${
                  mode === 'login'
                    ? 'bg-slate-800 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all select-none cursor-pointer ${
                  mode === 'register'
                    ? 'bg-slate-800 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error / Success Notifications */}
            {domainAuthPrompt?.show && (
              <div className="mb-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs animate-in fade-in duration-150 space-y-2.5">
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <p className="font-semibold text-amber-300">Domain Authorization Required for Google Popup</p>
                    <p className="text-[11px] text-amber-300/80 leading-relaxed mt-0.5">
                      Google OAuth requires domain <span className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-200">{domainAuthPrompt.domain}</span> in your Firebase Console Authorized Domains list.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setDomainAuthPrompt(null);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Create with Email (Instant Access)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={domainAuthPrompt.consoleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-amber-900/60 hover:bg-amber-850 text-amber-200 border border-amber-700/60 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Add in Firebase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-3.5 p-3 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-3.5 p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-750 border border-slate-750 hover:border-slate-600 text-xs font-medium text-white flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
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

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-800/80 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                or email
              </span>
              <div className="border-t border-slate-800/80 w-full" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 text-xs transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@meg-labs.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 text-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 text-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>A confirmation link will be sent to your email to activate access.</span>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  fullWidth
                  icon={mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium cursor-pointer"
                >
                  {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 text-xs font-semibold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
