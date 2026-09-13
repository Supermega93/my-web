import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../common/Button.tsx';
import { 
  CheckCircle2, 
  Sparkles, 
  Target, 
  LineChart, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Send,
  Lock
} from 'lucide-react';

interface CoachingPageProps {
  onTriggerBuildMyEa: () => void;
  onExploreEas: () => void;
}

export function CoachingPage({ onTriggerBuildMyEa, onExploreEas }: CoachingPageProps) {
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('intermediate');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#070B12] text-slate-100 overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-40 right-10 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
        {/* Header Badge & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Coaching Program — Coming Soon</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Coaching</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Practical trading, automation and strategy development guidance designed to scale your systematic execution.
          </p>
        </motion.div>

        {/* Waitlist Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 max-w-xl mx-auto bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5 relative">
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Join the Private Mentorship Waitlist
                </h2>
                <p className="text-xs text-slate-400">
                  Be the first to secure 1-on-1 institutional quantitative strategy audits and automated execution onboarding.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@quantcapital.com"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  Trading Experience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', label: '< 1 Year' },
                    { id: 'intermediate', label: '1 - 3 Years' },
                    { id: 'pro', label: '3+ Years / Pro' },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setExperience(exp.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        experience === exp.id
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
                icon={loading ? undefined : <Send className="w-4 h-4" />}
                className="mt-2 text-sm font-semibold tracking-wide"
              >
                {loading ? 'Securing Priority...' : 'Join the Waitlist'}
              </Button>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Strictly private. No spam. Priority cohort invitations only.</span>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Priority Waitlist Confirmed</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Thank you! We have reserved your position for the inaugural coaching intake. You will receive an invitation ahead of public release.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                >
                  Register Another Email
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Future Pillars Preview */}
        <div className="mt-24">
          <div className="text-center space-y-2 mb-12">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Coaching Curriculum Overview
            </h3>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              What We Cover in 1-on-1 Guidance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#0F1623] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Strategy Quant Auditing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transform subjective discretionary chart patterns into strict, mathematically testable entry, exit, and order flow criteria.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#0F1623] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-teal-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20">
                <LineChart className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Algorithmic Risk Models</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Implement dynamic volatility filters, ATR trailing buffers, and prop-firm drawdown rules to protect equity in all regimes.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#0F1623] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Execution & VPS Tuning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deploy automated robots to low-latency cloud infrastructure with automated watchdog monitoring and fail-safes.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Alternative Pathway CTA */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#111928] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Need an EA programmed right now?</h4>
            <p className="text-xs text-slate-400">
              Skip the coaching waitlist and let our quantitative engineers build your custom bot directly.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={onExploreEas}
            >
              Explore EAs
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onTriggerBuildMyEa}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Build My EA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CoachingPage;
