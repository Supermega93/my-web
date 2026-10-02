import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, BookOpen, Cpu, ShieldCheck, Zap, Check, Loader2, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveView } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { saveEbookDownloadToFirestore } from '../../services/firestoreService.ts';
import { PrimaryButton } from '../common/PrimaryButton.tsx';
import { SecondaryButton } from '../common/SecondaryButton.tsx';

export interface HeroSectionProps {
  onNavigate: (view: ActiveView, productId?: string) => void;
  onTriggerBuildMyEa?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
}) => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleStartFreeLessons = () => {
    onNavigate('academy');
  };

  const handleDownloadFreeEbook = async () => {
    setDownloading(true);
    try {
      const downloadUrl = '/api/ebooks/download';
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.setAttribute('download', 'The-Traders-Guide-to-Understanding-Strategy-Automation.pdf');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (_) {}

      await saveEbookDownloadToFirestore({
        ebookId: 'free_lead_magnet_traders_guide',
        ebookTitle: "The Trader's Guide to Understanding Strategy Automation",
        userId: user?.id,
        userEmail: user?.email,
        source: 'hero_btn_download_free_ebook',
        downloadUrl,
      });

      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
      }, 4000);
    } catch (err) {
      console.warn('Direct eBook download notice:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="relative w-full pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-14 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto select-none">
      
      {/* 1. Large Rounded Outer Container inspired by Reference Design */}
      <div className="relative rounded-[2.2rem] sm:rounded-[2.8rem] lg:rounded-[3.2rem] overflow-hidden bg-gradient-to-b from-[#0e061e] via-[#14082c] to-[#080213] border border-purple-500/25 shadow-[0_25px_90px_rgba(112,26,179,0.22),0_0_50px_rgba(217,70,239,0.08)] ring-1 ring-inset ring-white/10">
        
        {/* Deep Purple / Magenta Ambient Gradient Environment & Lighting Integration */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle tech background radial grid mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#a855f710_1px,transparent_1px),linear-gradient(to_bottom,#a855f710_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
          
          {/* Top-Right Magenta/Violet Glow */}
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-600/18 via-purple-600/12 to-transparent rounded-full blur-[140px]" />
          
          {/* Center-Left Deep Violet Glow */}
          <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-purple-700/15 via-indigo-600/10 to-transparent rounded-full blur-[130px]" />

          {/* Bottom Ambient Glow */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#080213] via-[#080213]/80 to-transparent" />
        </div>

        {/* Hero Content Layout */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-between min-h-[72vh] lg:min-h-[78vh]">
          
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center my-auto py-4 sm:py-8 w-full">
            
            {/* Eyebrow Pill Badge (Futuristic purple/magenta pill with glowing accent dot) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-purple-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] mb-5 sm:mb-7 self-center"
            >
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.9)] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.24em] font-bold text-purple-200 uppercase">
                EVOLVE. INNOVATE. AUTOMATE.
              </span>
            </motion.div>

            {/* Main Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] font-black tracking-tight text-white leading-[1.08] sm:leading-[1.04] font-sans text-center max-w-5xl mx-auto"
            >
              YOUR STRATEGY. <br className="hidden sm:inline" />
              YOUR LOGIC.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300">
                YOUR AUTOMATION.
              </span>
            </motion.h1>

            {/* Subheadline Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-purple-200/90 font-normal leading-relaxed mt-5 sm:mt-6 max-w-3xl mx-auto text-center"
            >
              Transform your Forex strategy into a structured, intelligent trading system with AI — from idea and strategy architecture to a working MT5 Expert Advisor.
            </motion.p>

            {/* Short Supporting Line */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-3.5 sm:mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-purple-400/20 backdrop-blur-xs text-xs sm:text-sm font-medium tracking-wide text-purple-200/90 font-mono"
            >
              <span className="text-fuchsia-400 font-bold">Learn.</span>
              <span className="text-purple-400">•</span>
              <span className="text-white font-bold">Architect.</span>
              <span className="text-purple-400">•</span>
              <span className="text-purple-300 font-bold">Automate.</span>
            </motion.div>

            {/* Modern Pill-Shaped CTA Action Buttons (Preserved actions & logic) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-10"
            >
              {/* Primary Button: White Pill Button with Dark Text */}
              <PrimaryButton
                id="hero-btn-start-free-lessons"
                onClick={handleStartFreeLessons}
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                className="group"
              >
                Start Free Lessons
              </PrimaryButton>

              {/* Secondary Button: Glass Pill Button with Light Border */}
              <SecondaryButton
                id="hero-btn-download-free-ebook"
                onClick={handleDownloadFreeEbook}
                disabled={downloading}
                size="lg"
                className="group"
                icon={
                  downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                  ) : downloadComplete ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-purple-300 group-hover:text-white transition-transform group-hover:translate-x-1" />
                  )
                }
              >
                <span className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    downloadComplete ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
                  }`}>
                    <BookOpen className="w-3 h-3" />
                  </span>
                  <span>
                    {downloading
                      ? 'Downloading...'
                      : downloadComplete
                      ? 'eBook Downloaded!'
                      : 'Download free eBook'}
                  </span>
                </span>
              </SecondaryButton>
            </motion.div>

            {/* Feature Proof Badges: Pill-shaped badges with subtle glass styling */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-10 pt-6 border-t border-purple-500/20 max-w-2xl mx-auto w-full"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-purple-200 text-xs font-mono backdrop-blur-sm">
                <Cpu className="w-3.5 h-3.5 text-purple-300" />
                <span>MQL5 Native</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-purple-200 text-xs font-mono backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Logic</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-purple-200 text-xs font-mono backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Ultra-Low Latency</span>
              </div>
            </motion.div>

            {/* Platform Compatibility Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 pt-2 flex flex-col sm:flex-row sm:items-center justify-center gap-3 sm:gap-5 text-xs text-purple-300/70 font-mono"
            >
              <div className="flex items-center gap-2 text-purple-300/60 text-[11px] tracking-wider uppercase font-semibold shrink-0">
                <span className="w-2.5 h-[1px] bg-purple-500/30" />
                <span>PLATFORM COMPATIBILITY</span>
                <span className="w-2.5 h-[1px] bg-purple-500/30" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-purple-200 font-sans text-xs tracking-wider uppercase font-medium">
                <span className="hover:text-white transition-colors">MetaTrader 5</span>
                <span className="text-purple-500/50">•</span>
                <span className="hover:text-white transition-colors">MetaTrader 4</span>
                <span className="text-purple-500/50">•</span>
                <span className="hover:text-white transition-colors">cTrader</span>
                <span className="text-purple-500/50">•</span>
                <span className="hover:text-white transition-colors">TradingView</span>
                <span className="text-purple-500/50">•</span>
                <span className="hover:text-white transition-colors">Python Quant</span>
              </div>
            </motion.div>

          </div>

          {/* 3. Bottom: Scroll to Explore Indicator */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center pt-8 pb-1 text-center">
            <button
              onClick={() => {
                window.scrollBy({ top: 600, behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-1.5 text-purple-300/60 hover:text-white transition-colors text-[10px] font-mono tracking-widest uppercase cursor-pointer group"
              aria-label="Scroll to explore"
            >
              <span className="tracking-[0.25em]">SCROLL TO EXPLORE</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400 group-hover:text-white transition-colors animate-bounce mt-0.5" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;
