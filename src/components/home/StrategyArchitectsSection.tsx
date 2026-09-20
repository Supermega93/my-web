import React from 'react';
import { motion } from 'motion/react';
import { ActiveView } from '../../types.ts';
import { PillIconBadge } from '../common/PillIconBadge.tsx';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Sliders, 
  Code2, 
  Terminal, 
  CheckCircle2, 
  Bot, 
  Award,
  Layers
} from 'lucide-react';

interface StrategyArchitectsSectionProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
}

export const StrategyArchitectsSection: React.FC<StrategyArchitectsSectionProps> = ({ onNavigate }) => {
  const architects = [
    {
      id: 'mega',
      name: 'MEGA DIENG',
      title: 'Lead Strategy Architect',
      roleBadge: 'Lead Architect',
      experience: '12+ Years Systematic Trading',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&crop=faces&q=80',
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
      profile: 'Leads the strategy intake and architectural review process. Focuses on ensuring trading ideas are translated into robust, executable rules without altering the trader\'s core edge.',
      approach: 'The trader is the strategist. We ensure the logic is bulletproof.',
      specialties: [
        'Institutional strategy systems',
        'Execution architecture & MQL5 logic',
        'Prop firm risk preservation',
        'Edge preservation modeling'
      ],
      deliverable: 'MQL5 Architecture & Custom Build'
    },
    {
      id: 'alex-mason',
      name: 'ALEX MASON',
      title: 'Strategy Systems Architect',
      roleBadge: 'Systems Architect',
      experience: '9+ Years Quantitative Modeling',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&crop=faces&q=80',
      icon: <Terminal className="w-5 h-5 text-teal-600" />,
      profile: 'Specialises in clarifying trader logic, defining structural boundaries, and ensuring strategy inputs, conditions, and execution rules are fully specified.',
      approach: 'Clear rules create consistent execution.',
      specialties: [
        'Algorithmic workflow design',
        'Multi-timeframe confirmation models',
        'Session-based mechanics',
        'Structural boundary definition'
      ],
      deliverable: 'Refined Specifications & Prompts'
    },
    {
      id: 'daniel-reyes',
      name: 'DANIEL REYES',
      title: 'TradingView & Indicator Architect',
      roleBadge: 'Indicator Architect',
      experience: '8+ Years MQL5 / Pine Script Dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
      icon: <Sliders className="w-5 h-5 text-emerald-600" />,
      profile: 'Focuses on visual execution, indicator-driven logic, alert conditions, and bridging TradingView strategies into production-ready specifications.',
      approach: 'Visual clarity must match execution precision.',
      specialties: [
        'Pine Script strategy design',
        'TradingView-to-MT5 workflow translation',
        'Technical indicator structure & alerts',
        'Non-repainting buffer verification'
      ],
      deliverable: 'Indicators & Translation Workflows'
    }
  ];

  return (
    <section id="strategy-architects" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
        <PillIconBadge
          icon={Sparkles}
          label="Human-Guided AI Engineering"
          variant="emerald"
          size="md"
        />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Meet the Strategy Architects
        </h2>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Your strategy. Your rules. Our architecture. The trader provides the strategy, while our architects clarify, structure and prepare it for automated execution without changing the trading logic.
        </p>
      </div>

      {/* Architect Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {architects.map((arch) => (
          <div
            key={arch.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 space-y-6 group"
          >
            <div className="space-y-5">
              {/* Header with avatar & role */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={arch.avatar}
                    alt={arch.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg border border-slate-200 shadow-xs">
                    {arch.icon}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {arch.roleBadge}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {arch.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {arch.experience}
                  </p>
                </div>
              </div>

              {/* Title & Profile */}
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold text-emerald-800">
                  {arch.title}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {arch.profile}
                </p>
              </div>

              {/* Philosophy / Approach Quote */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs italic text-slate-700">
                "{arch.approach}"
              </div>

              {/* Specialties List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Core Specialisation:
                </span>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {arch.specialties.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Deliverable:</span>
              <span className="font-bold text-slate-900">{arch.deliverable}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Support Dock: AI Self-Coding & Custom Build */}
      <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Self-Coding or Custom Build</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Ready to Structure Your Strategy?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Generate an institutional 20-section coding prompt to build it yourself with ChatGPT/Claude, or hand it to our Strategy Architects for a verified custom build.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('prompt-architect')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Launch Strategy Architect</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('custom-ea')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wide transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Custom EA Services</span>
          </button>
        </div>
      </div>
    </section>
  );
};
