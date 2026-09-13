import React, { useState } from 'react';
import { Button } from '../common/Button.tsx';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Code2, 
  Terminal, 
  FileCode,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface StrategyBuilderComingSoonProps {
  onBack: () => void;
  onExploreEas: () => void;
}

export function StrategyBuilderComingSoon({
  onBack,
  onExploreEas,
}: StrategyBuilderComingSoonProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [platform, setPlatform] = useState('MetaTrader 5 (MQL5)');
  const [strategyNotes, setStrategyNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.notifyInterest({ email, platform, strategyNotes });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-8">
          {/* Back button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 2 Feature In Development</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              EA Strategy Builder coming soon.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We are currently engineering our proprietary AI-powered EA Strategy Builder. In Phase 2, you will be able to describe your trading indicators, entry conditions, and money management rules in plain natural language, and receive an automated technical analysis and development specification.
            </p>
          </div>

          {/* Phase 2 Capabilities Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-left">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 w-fit">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">Natural Language Parsing</h3>
              <p className="text-[11px] text-slate-400">
                Describe chart patterns, EMA crosses, and session liquidity in regular English.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-left">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 w-fit">
                <FileCode className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">Technical Spec Generation</h3>
              <p className="text-[11px] text-slate-400">
                Automated generation of pseudo-code, finite state machines, and risk matrices.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-left">
              <div className="p-2 rounded bg-purple-500/10 text-purple-400 w-fit">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">Engineer Verification</h3>
              <p className="text-[11px] text-slate-400">
                Direct handoff to senior quantitative developers for compiled delivery.
              </p>
            </div>
          </div>

          {/* Early Access Notification Signup */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-6 space-y-4">
            {submitted ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-100">Priority Notification Confirmed</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You have been placed on the priority access list for the Phase 2 launch. We will email you the moment the AI Strategy Builder is unlocked.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={onExploreEas}>
                    Explore Ready-Made EAs in the meantime
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-200">
                    Get Early Access to the Phase 2 AI Strategy Builder
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reserve your priority spot and receive complimentary development credits upon launch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@example.com"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Target Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option>MetaTrader 5 (MQL5)</option>
                      <option>MetaTrader 4 (MQL4)</option>
                      <option>cTrader (C#)</option>
                      <option>Python API</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Optional: Brief description of strategy you want to automate
                  </label>
                  <input
                    type="text"
                    value={strategyNotes}
                    onChange={(e) => setStrategyNotes(e.target.value)}
                    placeholder="e.g. London breakout with 1.5 ATR stop loss and partial take profit"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    *Zero spam. Used exclusively for Phase 2 beta onboarding.
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={loading}
                    icon={<Zap className="w-3.5 h-3.5 text-slate-950" />}
                  >
                    {loading ? 'Submitting...' : 'Join Phase 2 Priority Queue'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
