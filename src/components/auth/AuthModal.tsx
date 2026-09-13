import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types.ts';
import { LogIn, UserPlus, Shield, Sparkles } from 'lucide-react';

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
  const { login, register, quickLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, phone, password, role });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = async (r: UserRole) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(r);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Sign In to EA Automation Hub' : 'Create Trader Account'}
      subtitle="Access your purchased EAs, licenses, ebooks, and project queues."
      maxWidth="md"
    >
      <div className="space-y-5 text-xs">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-mono">
            {error}
          </div>
        )}

        {/* Quick Demo Role Switcher for seamless Phase 1 evaluation */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              1-Click Demo Profiles (Phase 1 Testing)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Instantly switch between roles to test RBAC security and dedicated dashboards:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickRole('customer')}
              className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500 font-mono text-[11px] transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickRole('developer')}
              className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500 font-mono text-[11px] transition-colors"
            >
              Developer
            </button>
            <button
              type="button"
              onClick={() => handleQuickRole('admin')}
              className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 text-purple-400 hover:border-purple-500 font-mono text-[11px] transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-500 font-mono text-[10px] uppercase">Or standard credentials</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-400 font-mono mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-mono mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@ea-hub.com"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-slate-400 font-mono mb-1">Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-mono mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              type="submit"
              disabled={loading}
              icon={mode === 'login' ? <LogIn className="w-4 h-4 text-slate-950" /> : <UserPlus className="w-4 h-4 text-slate-950" />}
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setError('');
              setMode(mode === 'login' ? 'register' : 'login');
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono"
          >
            {mode === 'login'
              ? "Don't have an account? Create one"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
