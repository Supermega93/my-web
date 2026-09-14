import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Download, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { ActiveView } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { PillIconBadge } from '../common/PillIconBadge.tsx';

interface FuturisticRobotHeroProps {
  onNavigate: (view: ActiveView, productId?: string) => void;
  onTriggerBuildMyEa: () => void;
}

export const FuturisticRobotHero: React.FC<FuturisticRobotHeroProps> = ({
  onNavigate,
  onTriggerBuildMyEa,
}) => {
  const handleStartFreeLessons = () => {
    const el = document.getElementById('free-academy');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('academy');
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#02050d] text-white select-none border-b border-cyan-950/40">
      {/* 1. Full-Width Background Art: Exact Supplied Realistic Cybernetic Robot Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img
          src="/assets/ChatGPT Image Sep 13, 2026, 06_24_40 AM.png"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes('ChatGPT')) {
              target.src = '/assets/meg-ai-hero-robot.png';
            } else if (target.src.includes('.png')) {
              target.src = '/assets/meg-ai-hero-robot.svg';
            }
          }}
          alt="Realistic Cybernetic Robot"
          className="w-full h-full object-cover object-[75%_center] md:object-right opacity-95 transition-opacity duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Dark Gradient Overlay: Preserves original image while ensuring left text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02050d] via-[#02050d]/80 md:via-[#02050d]/50 to-transparent pointer-events-none" />
        
        {/* Top/Bottom Subtle Transition Vignettes */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#02050d]/90 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#02050d] to-transparent pointer-events-none" />
      </div>

      {/* 2. Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-36 lg:pb-36 flex flex-col justify-center min-h-[580px] sm:min-h-[640px] lg:min-h-[720px]">
        <div className="max-w-2xl lg:max-w-2xl text-left p-6 sm:p-8 rounded-3xl backdrop-blur-sm sm:backdrop-blur-none bg-black/20 sm:bg-transparent border border-cyan-500/10 sm:border-none shadow-2xl sm:shadow-none">
          
          {/* Eyebrow Text (Exact user specification) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4 sm:mb-6"
          >
            <span className="w-6 sm:w-10 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-cyan-400 uppercase">
              EYEVOLVE. INNOVATE. AUTOMATE.
            </span>
          </motion.div>

          {/* Main Hero Headline (Exact user specification & Image 2 typography scale) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight text-white leading-[1.05] sm:leading-[1.02] drop-shadow-sm"
          >
            AUTOMATE <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              YOUR STRATEGY.
            </span>
          </motion.h1>

          {/* Subtitle (Exact user specification) */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mt-4 sm:mt-6 max-w-xl"
          >
            Turn your trading ideas into intelligent automated systems.
          </motion.p>

          {/* Two Hero Action Buttons: "Start Free Lessons" & "Download free eBook" (Matching Image 2 reference style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10"
          >
            {/* Button 1: Start Free Lessons (Clean White Pill matching Image 2 "EXPLORE SOLUTIONS") */}
            <button
              id="hero-btn-start-free-lessons"
              onClick={handleStartFreeLessons}
              className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              <span>Start Free Lessons</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Button 2: Download free eBook (Dark Glass Pill with Play/Book circle disc matching Image 2 "WATCH VIDEO", links to books page) */}
            <button
              id="hero-btn-download-free-ebook"
              onClick={() => onNavigate('ebooks')}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-700/80 hover:border-cyan-500/50 font-medium text-sm sm:text-base tracking-wide backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg group"
            >
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                <BookOpen className="w-3 h-3" />
              </span>
              <span>Download free eBook</span>
            </button>
          </motion.div>

          {/* Attached Icon Badges: Real-time Institutional Capabilities (Using Image 3 Pill Icon Style) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-8 pt-6 border-t border-slate-800/80"
          >
            <PillIconBadge
              icon={Cpu}
              label="MQL5 Native"
              variant="cyan"
              size="sm"
            />
            <PillIconBadge
              icon={ShieldCheck}
              label="Verified Logic"
              variant="emerald"
              size="sm"
            />
            <PillIconBadge
              icon={Zap}
              label="Ultra-Low Latency"
              variant="purple"
              size="sm"
            />
          </motion.div>

          {/* Institutional Partner Proof Row (Matching Image 2 "TRUSTED BY INNOVATORS") */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-slate-400 font-mono"
          >
            <div className="flex items-center gap-2 text-slate-400 text-[11px] tracking-wider uppercase font-semibold">
              <span className="w-4 h-[1px] bg-slate-600" />
              <span>PLATFORM COMPATIBILITY</span>
              <span className="w-4 h-[1px] bg-slate-600" />
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-300 font-sans text-xs tracking-wider uppercase font-bold opacity-80">
              <span className="hover:text-cyan-400 transition-colors">MetaTrader 5</span>
              <span className="text-slate-700">•</span>
              <span className="hover:text-cyan-400 transition-colors">MetaTrader 4</span>
              <span className="text-slate-700">•</span>
              <span className="hover:text-cyan-400 transition-colors">cTrader</span>
              <span className="text-slate-700">•</span>
              <span className="hover:text-cyan-400 transition-colors">TradingView</span>
              <span className="text-slate-700">•</span>
              <span className="hover:text-cyan-400 transition-colors">Python Quant</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
