import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, BookOpen, Cpu, ShieldCheck, Zap, Check, Loader2, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveView } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { saveEbookDownloadToFirestore } from '../../services/firestoreService.ts';

interface FuturisticRobotHeroProps {
  onNavigate: (view: ActiveView, productId?: string) => void;
  onTriggerBuildMyEa: () => void;
}

export const FuturisticRobotHero: React.FC<FuturisticRobotHeroProps> = ({
  onNavigate,
}) => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  // Primary hero portrait asset matching the user's provided asset and reference design:
  // Tries the user's uploaded portrait face.jpg first, cascading smoothly through assets
  const [heroImgSrc, setHeroImgSrc] = useState<string>('/face.jpg');

  const handleImageError = () => {
    if (heroImgSrc === '/face.jpg') {
      setHeroImgSrc('/assets/face.jpg');
    } else if (heroImgSrc === '/assets/face.jpg') {
      setHeroImgSrc('/assets/hero-visionary-portrait.png');
    } else if (heroImgSrc === '/assets/hero-visionary-portrait.png') {
      setHeroImgSrc('/assets/hero-visionary-portrait.jpg');
    } else if (heroImgSrc === '/assets/hero-visionary-portrait.jpg') {
      setHeroImgSrc('/assets/hero-visionary-portrait.svg');
    }
  };

  const handleStartFreeLessons = () => {
    onNavigate('academy');
  };

  const handleDownloadFreeEbook = async () => {
    setDownloading(true);
    try {
      // 1. Trigger the direct browser download of the protected eBook immediately
      const downloadUrl = '/api/ebooks/download';
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.setAttribute('download', 'The-Traders-Guide-to-Understanding-Strategy-Automation.pdf');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Confetti celebration
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (_) {}

      // 2. Save download event to Firebase Firestore
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
    <section className="relative w-full overflow-hidden bg-[#000000] text-white select-none border-b border-zinc-900">
      {/* 1. Subtle Background Elements & Architectural Depth */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Deep ambient radial glow behind subject */}
        <div className="absolute top-[10%] right-[10%] w-[580px] h-[580px] bg-white/[0.04] rounded-full blur-[120px] pointer-events-none" />
        
        {/* Subtle circular/radial orbital rings behind the subject (recreating reference) */}
        <div className="hidden lg:block absolute right-[6%] top-[12%] w-[480px] h-[480px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="hidden lg:block absolute right-[1%] top-[4%] w-[680px] h-[680px] rounded-full border border-white/[0.025] pointer-events-none" />

        {/* Extremely subtle vertical architectural line separating left content and right subject */}
        <div className="hidden lg:block absolute left-[52%] top-12 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Edge Vignette */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* 2. Hero Content & Portrait Layout (2-Column Desktop, Stacked Mobile) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 flex flex-col justify-between min-h-[82vh] lg:min-h-[88vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          
          {/* LEFT COLUMN: Existing Hero Content (Preserved text, reference typography hierarchy) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-left py-4 sm:py-8 lg:pr-6">
            
            {/* Eyebrow Pill Badge (Reference black-and-silver pill with glowing green dot) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.02)] mb-5 sm:mb-7 self-start"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.22em] font-semibold text-zinc-300 uppercase">
                EVOLVE. INNOVATE. AUTOMATE.
              </span>
            </motion.div>

            {/* Main Hero Headline (Preserved copy, Reference typography scale and crisp silver-white contrast) */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-black tracking-tight text-white leading-[1.03] drop-shadow-sm font-sans"
            >
              AUTOMATE <br className="hidden sm:inline" />
              <span className="text-zinc-200">
                YOUR STRATEGY.
              </span>
            </motion.h1>

            {/* Subheadline (Preserved copy, cinematic charcoal-silver typography) */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-zinc-400 font-normal leading-relaxed mt-5 sm:mt-6 max-w-xl"
            >
              Turn your trading ideas into intelligent automated systems.
            </motion.p>

            {/* CTA Action Buttons (Preserved actions, Reference button visual language) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10"
            >
              {/* Button 1: Start Free Lessons (Pure white glowing rounded button with diagonal arrow) */}
              <button
                id="hero-btn-start-free-lessons"
                onClick={handleStartFreeLessons}
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-sm sm:text-base tracking-tight transition-all shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                <span>Start Free Lessons</span>
                <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Button 2: Download free eBook (Explore Benefits style: refined dark button with right arrow) */}
              <button
                id="hero-btn-download-free-ebook"
                onClick={handleDownloadFreeEbook}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 hover:border-zinc-700 font-semibold text-sm sm:text-base tracking-tight backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg group"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  downloadComplete
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/10 text-white group-hover:bg-white group-hover:text-black'
                }`}>
                  {downloading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : downloadComplete ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <BookOpen className="w-3 h-3" />
                  )}
                </span>
                <span>
                  {downloading
                    ? 'Downloading...'
                    : downloadComplete
                    ? 'eBook Downloaded!'
                    : 'Download free eBook'}
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-1" />
              </button>
            </motion.div>

            {/* Attached Badges: High-contrast black & silver minimalist pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-8 pt-6 border-t border-zinc-900"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-mono">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                <span>MQL5 Native</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Logic</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-mono">
                <Zap className="w-3.5 h-3.5 text-zinc-300" />
                <span>Ultra-Low Latency</span>
              </div>
            </motion.div>

            {/* Platform Compatibility / Proof Row (Reference TRUSTED BY logos row) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-7 pt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-zinc-500 font-mono"
            >
              <div className="flex items-center gap-2 text-zinc-500 text-[11px] tracking-wider uppercase font-semibold shrink-0">
                <span className="w-3 h-[1px] bg-zinc-800" />
                <span>PLATFORM COMPATIBILITY</span>
                <span className="w-3 h-[1px] bg-zinc-800" />
              </div>

              <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 text-zinc-400 font-sans text-xs tracking-wider uppercase font-semibold">
                <span className="hover:text-white transition-colors">MetaTrader 5</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-white transition-colors">MetaTrader 4</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-white transition-colors">cTrader</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-white transition-colors">TradingView</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-white transition-colors">Python Quant</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: The Visionary Portrait with Glowing Halo Ring (Reference design visual truth) */}
          <div className="lg:col-span-5 xl:col-span-5 relative flex items-end justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0 min-h-[380px] sm:min-h-[500px] lg:min-h-[640px]">
            
            {/* Ambient Halo Radial Glow */}
            <div className="absolute top-1/4 right-1/4 w-[320px] h-[320px] bg-white/[0.08] rounded-full blur-[90px] pointer-events-none" />

            {/* Portrait Container with Chiaroscuro Fade to Black */}
            <div className="relative w-full max-w-[480px] lg:max-w-none lg:w-[115%] xl:w-[120%] flex items-end justify-center lg:justify-end group">
              <img
                src={heroImgSrc}
                onError={handleImageError}
                alt="Visionary strategy architect portrait with glowing halo ring"
                className="w-full h-auto max-h-[580px] sm:max-h-[650px] lg:max-h-[720px] object-contain object-bottom select-none pointer-events-none filter grayscale contrast-125 brightness-95 drop-shadow-[0_0_40px_rgba(255,255,255,0.18)] transition-all duration-700"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 65%, transparent 98%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 98%)',
                }}
                referrerPolicy="no-referrer"
              />

              {/* Subtle Dark Clothing Overlay (turns light clothing into cinematic charcoal shadows) */}
              <div 
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

          </div>

        </div>

        {/* 3. Bottom Center: Scroll to Explore (Reference footer element) */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center pt-8 pb-2 text-center">
          <button
            onClick={() => {
              window.scrollBy({ top: 600, behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-[10px] font-mono tracking-widest uppercase cursor-pointer group"
            aria-label="Scroll to explore"
          >
            <span className="tracking-[0.25em]">SCROLL TO EXPLORE</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors animate-bounce mt-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
