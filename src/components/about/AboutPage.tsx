import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../common/Button.tsx';
import { 
  TrendingUp, 
  Cpu, 
  Code2, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';

interface AboutPageProps {
  onTriggerBuildMyEa: () => void;
  onExploreEas: () => void;
}

export function AboutPage({ onTriggerBuildMyEa, onExploreEas }: AboutPageProps) {
  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono tracking-wider uppercase font-semibold">
            <Activity className="w-3.5 h-3.5 text-emerald-700" />
            <span>Institutional Automation Principles</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Built Around Trading. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800">
              Driven by Automation.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            We bridge the gap between discretionary market insights and institutional systematic execution.
          </p>
        </motion.div>

        {/* 4 Visual Pillars: Trading, Automation, Development, Education */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Trading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all shadow-md hover:shadow-xl relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 border border-emerald-200 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Trading</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Markets run on liquidity pools, institutional order flow, and asymmetric volatility. Our systems respect real market structure rather than chasing curve-fitted historical anomalies.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-mono text-emerald-800 font-semibold">
              <span>Order Flow</span>
              <span>•</span>
              <span>Liquidity Pools</span>
              <span>•</span>
              <span>Drawdown Bounds</span>
            </div>
          </motion.div>

          {/* 2. Automation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all shadow-md hover:shadow-xl relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-800 flex items-center justify-center mb-6 border border-slate-200 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Automation</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Discretionary emotion and hesitation destroy edge. Automated execution locks in discipline, operates 24/5 without fatigue, and adheres strictly to predefined risk math.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-mono text-slate-700 font-semibold">
              <span>Zero Emotion</span>
              <span>•</span>
              <span>Sub-Millisecond</span>
              <span>•</span>
              <span>24/5 Vigilance</span>
            </div>
          </motion.div>

          {/* 3. Development */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all shadow-md hover:shadow-xl relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-800 flex items-center justify-center mb-6 border border-slate-200 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Development</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              We engineer clean, modular MQL5 object-oriented code built with robust exception handling, slippage tolerance, spread filters, and multi-broker compatibility.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-mono text-slate-700 font-semibold">
              <span>Native MQL5</span>
              <span>•</span>
              <span>Modular OOP</span>
              <span>•</span>
              <span>Tick Precision</span>
            </div>
          </motion.div>

          {/* 4. Education */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all shadow-md hover:shadow-xl relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6 border border-purple-200 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Education</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Empowering systematic traders with transparent, actionable resources—from complete algorithm architecture manuals to cutting-edge AI prompt engineering guides.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-mono text-purple-800 font-semibold">
              <span>Code Handbooks</span>
              <span>•</span>
              <span>Walk-Forward</span>
              <span>•</span>
              <span>AI Prompting</span>
            </div>
          </motion.div>
        </div>

        {/* CTA Bar */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-md text-center max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Ready to Take Emotion Out of Your Trading?
          </h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal">
            Explore our ready-to-run Expert Advisors or work with our engineering team to automate your proprietary edge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onExploreEas}
            >
              Explore Trading EAs
            </Button>
            <Button
              variant="primary"
              size="lg"
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

export default AboutPage;
