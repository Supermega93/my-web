import { Button } from '../common/Button.tsx';
import { 
  FileText, 
  Cpu, 
  UserCheck, 
  DollarSign, 
  Code, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Shield,
  Layers,
  Terminal
} from 'lucide-react';

interface HowItWorksPageProps {
  onTriggerBuildMyEa: () => void;
  onExploreEas: () => void;
}

export function HowItWorksPage({
  onTriggerBuildMyEa,
  onExploreEas,
}: HowItWorksPageProps) {
  const steps = [
    {
      num: 1,
      title: 'Describe Your Strategy',
      badge: 'Input Phase',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      desc: 'Define your strategy in plain language. Detail your timeframe, market indicators, entry conditions, exit filters, and risk tolerance without needing programming knowledge.'
    },
    {
      num: 2,
      title: 'AI Analyzes Your Rules',
      badge: 'Logic Synthesis',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      desc: 'Our rule-processing engine parses indicators, identifies state ambiguities, and structures trading conditions into an algorithmic state diagram.'
    },
    {
      num: 3,
      title: 'Developer Reviews Your Strategy',
      badge: 'Quant Audit',
      icon: <UserCheck className="w-5 h-5 text-purple-400" />,
      desc: 'A senior MQL5 quantitative engineer manually inspects the logic, evaluating execution latencies, spread impact, and prop-firm compliance.'
    },
    {
      num: 4,
      title: 'Receive Your Quote',
      badge: 'Transparency',
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      desc: 'You receive a detailed technical specification alongside fixed milestone pricing and an exact delivery timeframe. Zero hidden surprises.'
    },
    {
      num: 5,
      title: 'EA Development',
      badge: 'Engineering',
      icon: <Code className="w-5 h-5 text-emerald-400" />,
      desc: 'Your robot is coded using high-speed, modular object-oriented MQL5, featuring memory management, robust error handling, and slippage protection.'
    },
    {
      num: 6,
      title: 'Testing & Delivery',
      badge: 'Verification',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      desc: 'Multi-year tick-data backtesting with 99.9% quality modelling, forward demo execution, and delivery of compiled binary (.ex5) and full source code (.mq5).'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wider uppercase">
            <span>Engineering Pipeline</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How EA Automation Hub Works
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A standardized, institutional-grade development pipeline designed to transform manual discretionary trading concepts into verified automated execution.
          </p>
        </div>

        {/* 6 Step Interactive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-semibold">
                    STEP 0{step.num}
                  </span>
                </div>

                <div className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-slate-900 border border-slate-800 text-slate-400 mb-2">
                  {step.badge}
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Phase 1 Informational</span>
                <span className="text-emerald-400">Standardized QA</span>
              </div>
            </div>
          ))}
        </div>

        {/* Engineering Standards */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-100">
              Our Core Quality & Verification Safeguards
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every EA released or custom developed passes through strict code standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-2">
              <span className="font-mono font-bold text-emerald-400 block uppercase">1. Strict Equity Guards</span>
              <p className="text-slate-400 leading-relaxed">
                Predefined hard stop losses on every executed order. Zero martingale, zero unhedged high-risk grid exposure.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono font-bold text-cyan-400 block uppercase">2. Latency Optimization</span>
              <p className="text-slate-400 leading-relaxed">
                Direct MQL5 order send methods with minimal memory allocations to capture slippage-free fills on VPS setups.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono font-bold text-purple-400 block uppercase">3. Full Source Code</span>
              <p className="text-slate-400 leading-relaxed">
                Custom clients receive 100% uncompiled MQL5 source code (.mq5) with clean documentation and comments.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6 space-y-4">
          <h2 className="text-2xl font-bold text-slate-100">Ready to start automating?</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onTriggerBuildMyEa}
              icon={<Sparkles className="w-4 h-4 text-slate-950" />}
            >
              Build My EA
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onExploreEas}
            >
              Explore Trading EAs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
