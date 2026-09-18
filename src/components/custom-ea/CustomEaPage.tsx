import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../common/Button.tsx';
import { CustomEaRequestModal } from './CustomEaRequestModal.tsx';
import { CustomEaPricingCards } from './CustomEaPricingTiers.tsx';
import { StrategyArchitectsSection } from '../home/StrategyArchitectsSection.tsx';
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
  onNavigate?: (view: any, extraId?: string) => void;
}

export function CustomEaPage({
  onTriggerBuildMyEa,
  onExploreEas,
  onNavigate = () => {},
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

          <div className="pt-2">
            <CustomEaPricingCards
              onSelectPackage={openFormWithPackage}
              buttonLabel="Start Your EA"
            />
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

        {/* Strategy Architects Section (Reused from Homepage) */}
        <StrategyArchitectsSection onNavigate={onNavigate} />

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
