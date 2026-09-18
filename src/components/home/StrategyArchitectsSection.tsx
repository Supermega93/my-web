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
      name: 'Mega',
      title: 'Lead Strategy Architect & Senior MQL5 Engineer',
      roleBadge: 'Lead Architect',
      experience: '12+ Years Systematic Trading',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
      bio: 'Pioneered Mega AI Labs quantitative architecture. Oversees execution safety, prop firm risk preservation, and institutional order flow automation.',
      specialties: [
        'MQL5 Expert Advisor Architecture',
        'Prop Firm Risk & Daily Loss Shields',
        'ICT / Liquidity Sweep Mechanics',
        'Zero-Martingale Execution Modeling'
      ],
      deliverable: 'Automated EAs & Source Code'
    },
    {
      id: 'alex-mason',
      name: 'Alex Mason',
      title: 'Quantitative Systems & Algorithmic Design Specialist',
      roleBadge: 'Quantitative Architect',
      experience: '9+ Years Quantitative Modeling',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
      icon: <Terminal className="w-5 h-5 text-teal-600" />,
      bio: 'Specializes in mathematical edge extraction, session volatility mechanics, and converting complex discretionary trader logic into strict algorithmic rules.',
      specialties: [
        'Session Breakout & London Models',
        'Multi-Timeframe Structure Confirmation',
        'Dynamic ATR Risk & Trailing Stops',
        'Tick-Data Backtesting Telemetry'
      ],
      deliverable: 'Refined Specifications & Coding Prompts'
    },
    {
      id: 'daniel-reyes',
      name: 'Daniel Reyes',
      title: 'Technical Indicator & Visual Scanner Architect',
      roleBadge: 'Indicator Architect',
      experience: '8+ Years MQL5 / Pine Script Dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
      icon: <Sliders className="w-5 h-5 text-emerald-600" />,
      bio: 'Expert in high-performance chart visualization, non-repainting buffer calculations, multi-pair market scanners, and instant push alert frameworks.',
      specialties: [
        'Non-Repainting MQL5 Indicators',
        'Fair Value Gap (FVG) & Zone Mapping',
        'Multi-Pair Volatility Dashboards',
        'Mobile Push, Sound & Popup Alerts'
      ],
      deliverable: 'Custom Indicators & Alert Suites'
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
          The trader is the strategist. Our architects clarify, structure, and turn your trading ideas into production-grade automated systems without altering your rules.
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

              {/* Title & Bio */}
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold text-emerald-800">
                  {arch.title}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {arch.bio}
                </p>
              </div>

              {/* Specialties List */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Core Architectural Focus:
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

      {/* Interactive CTA Dock linking to Strategy Architect */}
      <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Strategy Intake</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Ready to Structure Your Strategy?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Describe your idea in plain English. The AI Strategy Architect will extract your logic, verify components, and prepare your specification for coding or custom build.
          </p>
        </div>

        <button
          onClick={() => onNavigate('prompt-architect')}
          className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2.5 shrink-0 cursor-pointer group"
        >
          <span>Launch AI Strategy Architect</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
