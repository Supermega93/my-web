import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types.ts';
import { LogIn, UserPlus, Mail, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
}: AuthModalProps) {
  const { login, register, loginWithGoogle, resendVerificationEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setError(res.error || 'Google Sign-In prompt failed. Please try with email.');
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const target = unverifiedEmail || email.trim();
    if (!target) {
      setError('Please provide your email address to resend confirmation.');
      return;
    }
    setResending(true);
    setError('');
    setSuccess('');
    try {
      const res = await resendVerificationEmail(target);
      if (res.success) {
        setSuccess(res.message || `Verification link resent to ${target}!`);
      } else {
        setError(res.error || 'Could not resend email. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const cleanEmail = email.trim();

    try {
      if (mode === 'login') {
        const result = await login(cleanEmail, password);
        if (result.needsVerification) {
          setNeedsVerification(true);
          setUnverifiedEmail(result.unverifiedEmail || cleanEmail);
          setError(result.error || 'Please verify your email before accessing your account.');
        } else if (!result.success) {
          setError(result.error || 'Invalid credentials');
        } else {
          onClose();
        }
      } else {
        const result = await register({ name, email: cleanEmail, phone, password, role });
        if (result.needsVerification) {
          setNeedsVerification(true);
          setUnverifiedEmail(result.unverifiedEmail || cleanEmail);
          setSuccess(result.message || `Verification link sent to ${cleanEmail}! Please check your email to activate your account.`);
        } else if (!result.success) {
          setError(result.error || 'Registration failed');
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={needsVerification ? 'Verify Your Email' : mode === 'login' ? 'Welcome Back' : 'Create Trader Account'}
      subtitle={needsVerification ? 'Complete email confirmation via Supabase to access your account.' : mode === 'login' ? 'Sign in to access your EAs, licenses, Academy courses, and tools.' : 'Join MEG.AI Labs to unlock courses, download set files, and track progress.'}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Segmented Tab Switcher (Apple-Inspired) */}
        {!needsVerification && (
          <div className="flex p-1 bg-slate-950/70 rounded-2xl border border-slate-800/80 mb-2">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
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
                setError('');
                setSuccess('');
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
        )}

        {error && (
          <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        {needsVerification ? (
          <div className="space-y-4 py-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Mail className="w-6 h-6" />
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              We sent a confirmation link to:
            </p>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-emerald-400 font-mono text-center break-all">
              {unverifiedEmail || email}
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm mx-auto">
              Users must verify their email address before accessing the platform. Please check your inbox and spam folders.
            </p>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                type="button"
                disabled={resending}
                onClick={handleResend}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium"
              >
                {resending ? 'Sending...' : 'Resend Verification Link'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setNeedsVerification(false);
                  setMode('login');
                  setError('');
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono pt-2 cursor-pointer"
              >
                Already clicked the link? <span className="text-emerald-400 underline font-semibold">Sign In</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 text-xs font-semibold transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Google OAuth Option */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-750 border border-slate-750 hover:border-slate-600 text-xs font-medium text-white flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
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

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 text-xs transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@ea-hub.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 text-xs transition-all"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 text-xs transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Password</label>
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
                  <span>A Supabase confirmation link will be sent to activate your account.</span>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  icon={mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium"
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
    </Modal>
  );
}
