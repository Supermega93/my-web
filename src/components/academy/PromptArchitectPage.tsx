import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ActiveView } from '../../types.ts';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Code2, 
  Terminal, 
  FileText,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { StrategyIntakeWorkflow } from '../strategy/StrategyIntakeWorkflow.tsx';
import { StructuredStrategyData } from '../../lib/strategyEngine.ts';

interface PromptArchitectPageProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onTriggerBuildMyEa?: (prefillData?: any) => void;
}

export function PromptArchitectPage({ onNavigate, onTriggerBuildMyEa }: PromptArchitectPageProps) {
  const handleTriggerBuildThisForMe = (structuredData: StructuredStrategyData, prompt: string) => {
    const prefill = {
      projectName: `Custom EA: ${structuredData.instrument} (${structuredData.timeframe})`,
      platform: 'MT5' as const,
      instruments: structuredData.instrument !== 'Not specified' ? structuredData.instrument : 'XAUUSD',
      timeframe: structuredData.timeframe !== 'Not specified' ? structuredData.timeframe : 'M15',
      entryRules: structuredData.entryRules,
      exitRules: structuredData.exitRules,
      stopLoss: structuredData.stopLoss,
      takeProfit: structuredData.takeProfit,
      riskManagement: `Risk per trade: ${structuredData.riskPerTrade} | Max Daily Loss: ${structuredData.maxDailyLoss} | Max Trades: ${structuredData.maxTradesPerDay}`,
      tradeManagement: `Break-Even: ${structuredData.breakEven} | Trailing Stop: ${structuredData.trailingStop}`,
      otherRequirements: `Sessions: ${structuredData.sessions} | Spread: ${structuredData.maxSpread} | News: ${structuredData.newsFilter} | ${structuredData.additionalRules}`,
      strategyDescription: structuredData.primaryDescription,
      structuredData: structuredData,
      promptText: prompt,
    };

    if (onTriggerBuildMyEa) {
      onTriggerBuildMyEa(prefill);
    } else {
      onNavigate('custom-ea');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 pt-28 pb-24 relative overflow-hidden font-sans">
      {/* Background ambient lighting matching Build My EA */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-slate-500">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-emerald-800 transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button 
            onClick={() => onNavigate('prompt-architect')} 
            className="text-emerald-800 font-bold hover:underline cursor-pointer"
          >
            Free Tools
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">AI Strategy Builder</span>
        </nav>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>FREE AI STRATEGY BUILDER</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            AI Strategy Builder
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Turn your trading strategy into a clear, structured specification. Your description is the primary source of truth — the AI organizes and clarifies your rules without redesigning or inventing.
          </p>

          {/* Workflow Sequence Banner */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs font-mono text-slate-600">
              <span className="text-emerald-800 font-bold">1 DESCRIBE STRATEGY</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-800 font-bold">2 AI STRUCTURES</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-800 font-bold">3 REVIEW & CLARIFY</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-800 font-bold">4 PROMPT OR CLEAR STRATEGY</span>
            </div>
          </div>
        </div>

        {/* Unified Strategy Intake & Review Engine */}
        <StrategyIntakeWorkflow
          mode="free-tool"
          onTriggerBuildMyEa={handleTriggerBuildThisForMe}
        />

        {/* Educational Guarantee / Scope Assurance Panel */}
        <div className="mt-16 pt-10 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Source of Truth Preserved</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              The AI never modifies your entry conditions, indicators, or risk rules. What you describe is exactly what is generated.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Two Representation Modes</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              Switch seamlessly between a plain-English human verification summary and an institutional MQL5 development prompt.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Seamless EA Development</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              Ready to automate? Send your structured rules directly into our custom development pipeline in one click.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PromptArchitectPage;
