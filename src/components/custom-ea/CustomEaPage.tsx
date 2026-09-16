import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../common/Button.tsx';
import { CustomEaRequestModal } from './CustomEaRequestModal.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Cpu, 
  ShieldCheck, 
  Code2, 
  FileCheck, 
  CheckCircle2,
  Sliders,
  Send,
  HelpCircle,
  Clock,
  Layers,
  Activity
} from 'lucide-react';

interface CustomEaPageProps {
  onTriggerBuildMyEa: () => void;
  onExploreEas: () => void;
}

export function CustomEaPage({
  onTriggerBuildMyEa,
  onExploreEas,
}: CustomEaPageProps) {
  const { formatPrice } = useCurrency();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('Standard');

  const openFormWithPackage = (pkg: string) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const processSteps = [
    {
      num: '01',
      title: 'Describe Strategy',
      desc: 'Explain your strategy in your own words — no coding required.',
    },
    {
      num: '02',
      title: 'AI Structures',
      desc: 'System maps entry, exit, risk, and session rules automatically.',
    },
    {
      num: '03',
      title: 'Review Strategy',
      desc: 'Verify that the parameters accurately represent your rules.',
    },
    {
      num: '04',
      title: 'Prompt or Clear',
      desc: 'Choose between human-readable verification or AI prompt.',
    },
    {
      num: '05',
      title: 'Edit if Needed',
      desc: 'Adjust any parameter without losing your original words.',
    },
    {
      num: '06',
      title: 'Submit & Build',
      desc: 'Institutional MQL5 development and stress backtesting.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28 space-y-24">
        {/* 1. HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono tracking-wider uppercase font-semibold">
            <Code2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Custom Engineering Lab</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
            Your Strategy. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800">
              Your EA.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Turn your trading strategy into a custom Expert Advisor built around your rules.
          </p>

          <div className="pt-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openFormWithPackage('Custom')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-bold text-base shadow-md shadow-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Build My EA</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* 2. DEVELOPMENT PACKAGES (3 Large Premium Cards Matching Reference Design) */}
        <div className="space-y-10 pt-4">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Transparent Engineering Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Development Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Package 1: BASIC */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group relative"
            >
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Entry Tier</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">BASIC</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Single-indicator or price-action breakout models with fixed risk and scheduled trading sessions.
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">From {formatPrice(149)}</span>
                    <span className="text-sm text-slate-400 line-through font-mono">{formatPrice(299)}</span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">50% OFF</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Turnaround: 3–5 business days</span>
                  </div>
                </div>

                {/* Key inclusions */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1–2 indicator or price action triggers</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fixed lot size or fixed % equity risk</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fixed Take Profit & Stop Loss</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full clean source code (.mq5 / .mq4)</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => openFormWithPackage('Basic')}
                >
                  Start Your EA
                </Button>
              </div>
            </motion.div>

            {/* Package 2: INTERMEDIATE (FEATURED DEEP EMERALD PLAN) */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white border border-emerald-600/50 shadow-2xl shadow-emerald-950/20 flex flex-col justify-between group relative transform lg:-translate-y-2"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Most Popular</span>
              </div>

              <div className="space-y-6 pt-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">Standard Tier</span>
                  <h3 className="text-2xl font-black text-white mt-1">INTERMEDIATE</h3>
                  <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                    Multi-timeframe setups, dynamic ATR trailing stops, break-even logic, and prop-firm drawdown limiters.
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">From {formatPrice(299)}</span>
                    <span className="text-sm text-emerald-300/70 line-through font-mono">{formatPrice(599)}</span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-300 text-slate-950">50% OFF</span>
                  </div>
                  <div className="text-[11px] text-emerald-200 font-mono mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Turnaround: 5–8 business days</span>
                  </div>
                </div>

                {/* Key inclusions */}
                <div className="space-y-3 pt-4 border-t border-emerald-700/60 text-xs text-emerald-50">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Multi-timeframe trend & confirmation filters</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Dynamic ATR trailing stop & break-even</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Daily max loss limiter (prop-firm compliant)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Economic news filter integration</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Source code + 14-day QA warranty</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-emerald-700/60">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openFormWithPackage('Intermediate')}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Your EA</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Package 3: ADVANCED */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group relative"
            >
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Institutional Tier</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">ADVANCED</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Institutional order flow, liquidity sweeps, multi-symbol portfolio management, and custom GUI dashboards.
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">From {formatPrice(499)}</span>
                    <span className="text-sm text-slate-400 line-through font-mono">{formatPrice(999)}</span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">50% OFF</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Turnaround: 10–14 business days</span>
                  </div>
                </div>

                {/* Key inclusions */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Smart Money liquidity void & sweep logic</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-currency portfolio risk balancer</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Interactive on-chart GUI dashboard</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Telegram / Discord webhook alerts</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>30-day warranty & priority support</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => openFormWithPackage('Advanced')}
                >
                  Start Your EA
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Pricing Note */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-mono">
              * Final project scope and pricing are confirmed after developer review and consultation.
            </p>
          </div>
        </div>

        {/* 3. CUSTOM DEVELOPMENT PROCESS (Visually present 6 steps) */}
        <div className="pt-12 border-t border-slate-200/80 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Execution Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Custom Development Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="text-sm font-mono text-emerald-800 font-bold mb-2 flex items-center justify-between">
                    <span>{step.num} — {step.title}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                  Phase {step.num} of 06
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 border border-emerald-700 text-center space-y-6 text-white shadow-2xl shadow-emerald-950/20">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to Turn Your Rules into Systematic Code?
          </h3>
          <p className="text-sm text-emerald-100/80 max-w-xl mx-auto">
            Open our custom strategy intake form and our quantitative development team will review your specifications.
          </p>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => openFormWithPackage('Custom')}
            icon={<ArrowRight className="w-4 h-4" />}
            className="font-bold bg-white text-emerald-950 hover:bg-emerald-50"
          >
            Build My EA
          </Button>
        </div>
      </div>

      {/* Modal / Slide-out Form */}
      <CustomEaRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPackage={selectedPackage}
      />
    </div>
  );
}

export default CustomEaPage;
