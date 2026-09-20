import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Check, 
  FileText, 
  Users, 
  GraduationCap, 
  ChevronDown,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Code2,
  Sliders,
  Lock,
  Download,
  Award,
  Compass,
  AlertTriangle,
  Zap,
  BookmarkCheck,
  CheckSquare
} from 'lucide-react';

interface EbookProductDetailProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (product: Product) => void;
  onTriggerBuildMyEa: () => void;
  onNavigateToMasterclass?: () => void;
}

export function EbookProductDetail({
  product,
  onBack,
  onBuyNow,
  onTriggerBuildMyEa,
  onNavigateToMasterclass,
}: EbookProductDetailProps) {
  const { formatPrice, currentCurrency } = useCurrency();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCurriculumTab, setActiveCurriculumTab] = useState<'part1' | 'labs' | 'part2' | 'appendices'>('part1');
  const [expandedLevel, setExpandedLevel] = useState<string | null>('level1');

  const coverUrl = product.image_url || STOREFRONT_MEDIA.paidEbook1.coverUrl;

  const handlePurchase = () => {
    // Ensure product passes the canonical $89 USD reference price
    const bookProduct: Product = {
      ...product,
      id: 'prod_ebook_mql5_guide',
      name: 'The School of AI Trading Architecture',
      price: 89.0,
      currency: 'USD',
      short_description: 'The School of AI Trading Architecture (Complete 71-Page Course Book) — $89 USD'
    };
    onBuyNow(bookProduct);
  };

  const handleMasterclassClick = () => {
    if (onNavigateToMasterclass) {
      onNavigateToMasterclass();
    } else {
      window.location.href = '/academy/pricing';
    }
  };

  const whoItsFor = [
    {
      title: 'Discretionary Traders',
      desc: 'Traders who have clear chart rules but are exhausted by staring at screens, emotional trade management, and missed execution windows.',
      icon: <Compass className="w-5 h-5 text-emerald-700" />
    },
    {
      title: 'Aspiring Algorithmic Traders (Zero-Coders)',
      desc: 'Traders who want to build sophisticated MetaTrader 5 robots and custom indicators without spending 3 years learning C++ or MQL5 syntax.',
      icon: <Cpu className="w-5 h-5 text-emerald-700" />
    },
    {
      title: 'Prop Firm Challenge Traders',
      desc: 'Traders who need strict, automated safety nets—such as an automated 4% daily loss cutoff and lot size clamping—to protect evaluations from emotion.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />
    },
    {
      title: 'Quantitative Strategy Architects',
      desc: 'System builders looking for a disciplined architectural framework: separating market analysis (Brain), safety (Shield), telemetry (Glasses), and orders (Hands).',
      icon: <Layers className="w-5 h-5 text-emerald-700" />
    }
  ];

  const whatYoullLearn = [
    {
      title: 'Translate Human Words into Machine Facts',
      desc: 'Replace fuzzy eyeball rules like "buy when momentum is strong" with binary, computable conditions that AI can code without guessing.'
    },
    {
      title: 'The 5-Ingredient Master Prompt Formula',
      desc: 'Master the exact recipe (Role, Context, Objective, Constraints, Format) that gets production-grade, compilable MQL5 code on the very first try.'
    },
    {
      title: 'The 4 Lego Blocks Robot Architecture',
      desc: 'Structure every Expert Advisor into clean, decoupled modules: The Brain (Signals), The Shield (Risk), The Glasses (HUD Display), and The Hands (Execution).'
    },
    {
      title: 'Bulletproof Safety Shields & Prop Firm Protection',
      desc: 'Code automated lot size clamping, ATR-based dynamic risk, daily equity circuit breakers, and 3-layer execution filter stacks (Spread, Session, isNewBar).'
    },
    {
      title: 'Audit & Debug Code Without Reading Syntax',
      desc: 'Run the "Explain It To Me" pre-flight audit, diagnose compiler vs logic errors, and catch AI mistake patterns before risking a single dollar.'
    },
    {
      title: 'Four Complete Production Capstones & 13 Master Prompts',
      desc: 'Walk away with 4 complete compilable robots (Breakout, Trade Manager, Prop Firm Bot, HUD Dashboard) and 13 copy-and-paste prompts for every step.'
    }
  ];

  const legoBlocks = [
    {
      name: 'The Brain',
      role: 'Market Analysis & Signals',
      desc: 'Calculates indicators (Moving Averages, RSI, ADR), reads price action buffers, and evaluates entry and exit conditions.',
      color: 'border-blue-200 bg-blue-50/50 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'The Shield',
      role: 'Risk Management & Safety Guards',
      desc: 'Calculates lot size, checks daily drawdown caps (4% daily circuit breaker), verifies spread, and prevents execution outside session hours.',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      name: 'The Glasses',
      role: 'Telemetry & Visual Feedback',
      desc: 'Draws chart objects, displays on-screen telemetry panels, prints diagnostic logs, and sends mobile push notifications via SendNotification.',
      color: 'border-purple-200 bg-purple-50/50 text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'The Hands',
      role: 'Trade Execution & Order Management',
      desc: 'Issues OrderSend commands, verifies ticket numbers, manages break-even stops, trails stop losses, and executes partial closes.',
      color: 'border-amber-200 bg-amber-50/50 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800'
    }
  ];

  const capstoneProjects = [
    {
      number: '01',
      title: 'The Volatility Exhaustion Bot',
      type: 'Expert Advisor',
      desc: 'Monitors the 5-day Average Daily Range (ADR). When price expands beyond 100% of ADR during peak hours and prints a reversal candle, it enters with tight ATR brackets.'
    },
    {
      number: '02',
      title: 'The Automated Trade Manager',
      type: 'Utility Robot',
      desc: 'A pure background execution utility. Manages any open trade on the chart—moving Stop Loss to Break-Even + buffer at 1R, taking 50% partial profit at 2R, and trailing with ATR.'
    },
    {
      number: '03',
      title: 'The Prop Firm Challenge EA',
      type: 'Safety Shield Robot',
      desc: 'Engineered specifically for prop firm evaluations. Captures starting equity at 00:00 server time. If daily loss approaches 4%, it hard-locks all trading until the next day.'
    },
    {
      number: '04',
      title: 'The Multi-Bot Control Dashboard',
      type: 'Visual HUD Interface',
      desc: 'An on-screen MT5 graphical dashboard that tracks multiple running strategies across distinct Magic Numbers (10001, 20002, 30003), displaying live P&L, lot size, and drawdown.'
    }
  ];

  const promptLibraryItems = [
    { title: 'The Pre-Flight Logic Audit', purpose: 'Finds contradictions and logic gaps before writing a single line of MQL5.' },
    { title: 'The Eyeball-to-Machine-Fact Translator', purpose: 'Turns discretionary visual rules into mathematically computable conditions.' },
    { title: 'The 5-Ingredient Master EA Generator', purpose: 'Generates complete, compilable, zero-error MT5 robots using the 4 Lego Blocks.' },
    { title: 'The Negative Constraint Guard', purpose: 'Stops AI from hallucinating missing functions, undefined variables, or setup in OnTick.' },
    { title: 'The Blueprint Agreement Specifier', purpose: 'Forces AI to confirm understanding of all rules before outputting code.' },
    { title: 'The Surgical 80/20 Code Fixer', purpose: 'Fixes specific broken blocks without AI regenerating or breaking the rest of your file.' },
    { title: 'The Compiler Error Doctor', purpose: 'Feeds MetaEditor build errors to AI with file context to produce 100% verified patches.' },
    { title: 'The Dynamic Lot Size Clamper', purpose: 'Generates institutional risk sizing with MinLot, MaxLot, and LotStep safety clamps.' },
    { title: 'The Daily Loss Circuit Breaker', purpose: 'Enforces a strict 4% equity loss cutoff for prop firm rule compliance.' },
    { title: 'The 3-Layer Filter Stack', purpose: 'Builds combined Spread Filter, Session Window Filter, and isNewBar single-fire guard.' },
    { title: 'Active Trade Management & ATR Trail', purpose: 'Codes break-even + buffer, partial closes at target 1, and trailing stop logic.' },
    { title: 'The AI Mistake-Pattern Auditor', purpose: 'Scans existing code for common AI bugs: setup in OnTick, hardcoded pips, missing MagicNumber.' },
    { title: 'The In-Sample / Out-of-Sample Protocol', purpose: 'Guides 80/20 train/test backtest splits to prevent disastrous curve-fitting.' }
  ];

  const faqs = [
    {
      q: 'What is "The School of AI Trading Architecture"?',
      a: 'It is a complete, 71-page accredited course book written by M. Dinga. It teaches you how to design, architect, prompt, test, and deploy professional MetaTrader 5 robots and custom indicators using modern AI (ChatGPT, Claude, Gemini)—without requiring any prior coding experience.'
    },
    {
      q: 'Do I need any previous coding or MQL5 experience?',
      a: 'None whatsoever. The book starts at Level 1 (Preschool) and Level 2 (Kindergarten), explaining variables as labelled boxes, conditions as decision checklists, and functions as kitchen appliances. You learn to be the Strategy Architect who directs the AI with precision, rather than a manual syntax coder.'
    },
    {
      q: 'Is this book included with the Academy Masterclass?',
      a: 'YES! If you are enrolled in the MEG.AI Academy Masterclass (or enroll in any Masterclass tier), digital access to this complete 71-page course book is included as core course material at no extra cost.'
    },
    {
      q: 'What formats and code files are included with the standalone purchase?',
      a: 'You receive an immediate, full-color digital PDF download (71 pages) plus the verified MQL5 source code (.mq5 files) for all hands-on labs and capstone projects, ready to compile directly in MetaTrader 5 MetaEditor.'
    },
    {
      q: 'How does currency conversion work for international orders?',
      a: 'The book reference price is $89 USD. Our system automatically converts this price to your local currency (such as ZAR, EUR, GBP, AUD, etc.) at real-time exchange rates during checkout.'
    },
    {
      q: 'Can I read the book on mobile or tablet?',
      a: 'Yes. The digital PDF is DRM-free and optimized for crystal-clear readability across desktop computers, tablets (iPad/Android), Kindle, and mobile screens.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden font-sans">
      {/* Subtle ambient glows matching flagship EA page */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-emerald-600/10 via-teal-500/5 to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/8 via-teal-400/5 to-transparent blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Technical grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f040_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f040_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-0" 
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 space-y-16 sm:space-y-24">
        
        {/* ==================================================== */}
        {/* TOP BREADCRUMB NAVIGATION */}
        {/* ==================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>BACK TO ALL BOOKS</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">PART OF THE ACADEMY ECOSYSTEM</span>
            <button
              onClick={handleMasterclassClick}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>Included with Masterclass</span>
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* HERO SECTION — PREMIUM PRODUCT PRESENTATION */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: 3D HARDCOVER BOOK SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            {/* Soft backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-transparent blur-2xl rounded-full -z-10" />

            <div className="relative w-full max-w-[340px] sm:max-w-[380px] p-2">
              {/* Soft floor shadow */}
              <div className="absolute inset-x-8 bottom-3 h-12 bg-slate-950/20 blur-xl rounded-full pointer-events-none" />

              {/* Book Cover */}
              <motion.div
                whileHover={{ y: -6, rotateY: -3 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-lg overflow-hidden shadow-2xl border border-slate-200/80 bg-white"
              >
                <img
                  src={coverUrl}
                  alt="The School of AI Trading Architecture by M. Dinga"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain block select-none filter drop-shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
                />
              </motion.div>

              {/* Floating Status Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs">
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  71-Page Master Text
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  MQL5 Source Files Included
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: TITLES, VALUE METRICS & BUY CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold tracking-wider uppercase">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                OFFICIAL COURSE BOOK · LEVELS 1–8
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ZERO-CODE CURRICULUM
              </span>
            </div>

            {/* Book Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                The School of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800">
                  AI Trading Architecture
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-snug">
                A Complete, Zero-Code Course for Building Professional MetaTrader 5 Robots with AI
              </p>

              {/* Author Attribution */}
              <div className="pt-1 flex items-center gap-2.5 text-xs sm:text-sm font-mono text-slate-600">
                <span className="font-bold text-slate-900">M. DINGA</span>
                <span className="text-slate-300">•</span>
                <span>Strategy Architect · Trader · Author</span>
              </div>
            </div>

            {/* Narrative Overview */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              A self-contained, accredited curriculum designed to transform discretionary traders into systematic Strategy Architects. Learn how to translate trading ideas into machine facts, direct AI models with surgical precision, and compile bulletproof MT5 robots—without ever having to write manual code.
            </p>

            {/* Core Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="text-2xl font-black text-slate-900 font-mono">71</div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Pages Complete</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="text-2xl font-black text-emerald-800 font-mono">1 – 8</div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Levels (Preschool–Grad)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="text-2xl font-black text-slate-900 font-mono">4</div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Capstone Projects</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="text-2xl font-black text-amber-700 font-mono">13</div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Master Prompts</div>
              </div>
            </div>

            {/* PURCHASE & PRICING ACTION BOX */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-emerald-800/20 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                    Official Standalone Course Book
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
                      {formatPrice(89, 'USD')}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">one-time payment</span>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  {currentCurrency.code} currency conversion applied • Instant PDF Access
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePurchase}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="flex-1 font-bold shadow-md shadow-emerald-900/20 py-4 text-base"
                >
                  Buy Course Book — {formatPrice(89, 'USD')}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleMasterclassClick}
                  icon={<GraduationCap className="w-4 h-4 text-emerald-800" />}
                  className="sm:w-auto font-semibold border-slate-300 py-4 text-sm"
                >
                  Get via Masterclass Bundle
                </Button>
              </div>

              {/* Purchase Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Instant DRM-Free PDF</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Verified MQL5 Source Files</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Lifetime Free Updates</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================== */}
        {/* MASTERCLASS ECOSYSTEM INTEGRATION CALLOUT */}
        {/* ==================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>The Masterclass Ecosystem</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                This Course Book is the Core Text of the MEG.AI Masterclass
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Enrolling in the Strategy Architect Masterclass automatically includes full digital access to this 71-page textbook, along with full access to video lessons, downloadable set files, community code reviews, and live mentorship.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleMasterclassClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>View Masterclass Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* THE STRATEGY ARCHITECT'S OATH & CORE PHILOSOPHY */}
        {/* ==================================================== */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>The Architect's Code</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Strategy Architect's Oath
            </h2>
            <p className="text-sm text-slate-600">
              From Page 5 of the official text: the foundational mindset separating professional quantitative architects from failed hobbyists.
            </p>
          </div>

          {/* Oath Box */}
          <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-white border-2 border-amber-400/30 shadow-md text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
            
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-slate-800 italic leading-relaxed">
              "I will never let the AI guess my rules.<br />
              I will replace every eyeball rule with a machine fact.<br />
              I will test before I trust, and verify before I risk.<br />
              <span className="font-bold text-slate-950 not-italic font-sans block mt-3">
                I am the Architect. The AI is my kitchen assistant."
              </span>
            </p>

            <div className="pt-2 text-xs font-mono uppercase tracking-widest text-slate-400">
              — The School of AI Trading Architecture, Page 5
            </div>
          </div>

          {/* 6-Phase Pipeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 text-center font-bold">
              THE 6-PHASE TRANSFORMATION PIPELINE
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { step: '01', title: 'IDEA', desc: 'Discretionary trading concept' },
                { step: '02', title: 'SPECIFICATION', desc: 'Dissected into machine facts' },
                { step: '03', title: 'CODING PROMPT', desc: '5-Ingredient Master Recipe' },
                { step: '04', title: 'CODE', desc: 'Clean, compilable MQL5' },
                { step: '05', title: 'TEST', desc: 'Out-of-sample backtesting' },
                { step: '06', title: 'IMPROVE', desc: 'Systematic safe iteration' }
              ].map((pipe, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/90 text-center shadow-xs">
                  <div className="text-xs font-mono font-bold text-emerald-800">{pipe.step}</div>
                  <div className="text-sm font-black text-slate-900 mt-1">{pipe.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-tight">{pipe.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The 4 Lego Blocks Architecture */}
          <div className="space-y-6 pt-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">
                The 4 Lego Blocks Architecture
              </h3>
              <p className="text-xs text-slate-600">
                Every institutional trading robot in the course is modularly assembled using four decoupled blocks:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {legoBlocks.map((block, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${block.color} shadow-xs flex flex-col justify-between space-y-4`}>
                  <div className="space-y-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${block.badgeColor}`}>
                      {block.role}
                    </span>
                    <h4 className="text-xl font-bold text-slate-900">{block.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{block.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* WHO IT IS FOR & WHAT YOU WILL LEARN */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* WHO IT IS FOR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold uppercase">
                <Users className="w-3.5 h-3.5" />
                <span>Target Learners</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Who This Course Book Is For
              </h3>
            </div>

            <div className="space-y-4">
              {whoItsFor.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT YOU WILL LEARN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold uppercase">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Learning Outcomes</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                What You Will Master in 71 Pages
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatYoullLearn.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>0{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ==================================================== */}
        {/* COMPLETE COURSE STRUCTURE (LEVELS 1–8 FROM THE PDF) */}
        {/* ==================================================== */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Full Table of Contents</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Complete Course Structure
            </h2>
            <p className="text-sm text-slate-600">
              The exact curriculum as published in the 71-page master course book. Every lesson is self-contained with copy-and-paste prompts and knowledge checks.
            </p>
          </div>

          {/* Curriculum Category Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
            {[
              { id: 'part1', label: 'Part One: The Foundations (Levels 1–3)' },
              { id: 'labs', label: 'Hands-On Labs (Indicator & EAs)' },
              { id: 'part2', label: 'Part Two: The Masterclass (Levels 4–8)' },
              { id: 'appendices', label: 'Appendices, Exam & Prompt Library' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCurriculumTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeCurriculumTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="space-y-4 max-w-4xl mx-auto">
            
            {/* PART ONE */}
            {activeCurriculumTab === 'part1' && (
              <div className="space-y-4">
                {/* Level 1 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase">LEVEL 1 · PRESCHOOL</span>
                    <span className="text-xs font-mono text-slate-400">Pages 6–13</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">The Strategy Architect Mindset</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    What is trading automation? What is a Strategy Architect? Learn why AI is a literal machine (it does not know what a "good setup" looks like), why fuzzy human words produce broken robots, and how to avoid the "Confidently Wrong" trap.
                  </p>
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-700">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">1.1 The AI Is a Literal Machine</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">1.2 Human Words vs Machine Facts</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">1.3 The Confidently Wrong Trap</div>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase">LEVEL 2 · KINDERGARTEN</span>
                    <span className="text-xs font-mono text-slate-400">Pages 14–22</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Programming Concepts in Plain English</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Master programming fundamentals through intuitive real-world metaphors: variables as labelled boxes, conditions as decision checklists, functions as kitchen appliances, and loops as repetitive tasks.
                  </p>
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-700">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">2.1 Labelled Boxes</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">2.2 Decision Checklists</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">2.3 Kitchen Appliances</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">2.4 Repetitive Tasks</div>
                  </div>
                </div>

                {/* Level 3 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-800 uppercase">LEVEL 3 · ELEMENTARY</span>
                    <span className="text-xs font-mono text-slate-400">Pages 23–31</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Robot Architecture & Blueprints</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The 5 program types in MetaTrader 5 (EA, Indicator, Script, Library, Service). The Robot's Heartbeat: OnInit (birth), OnTick (heartbeat), OnTimer (clock), OnTrade (fill alerts), and OnDeinit (shutdown). Learn why putting setup code inside OnTick ruins execution speed.
                  </p>
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-700">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">3.1 The 5 Program Types</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">3.2 The Robot's Heartbeat</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">3.3 The 4 Lego Blocks</div>
                  </div>
                </div>
              </div>
            )}

            {/* HANDS-ON LABS */}
            {activeCurriculumTab === 'labs' && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-800 uppercase">LAB 1 · PRACTICAL BUILD</span>
                    <span className="text-xs font-mono text-slate-400">Pages 32–37</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">The ADR Indicator: From Trading Idea to Working MT5 Code</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Walk through the entire 9-step workflow: Idea ➔ Spec ➔ Claude Prompt ➔ MetaEditor compile ➔ Chart validation. Includes full compilable MQL5 source code with color-coded daily range bands.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase">LAB 2 · PRACTICAL BUILD</span>
                    <span className="text-xs font-mono text-slate-400">Pages 38–43</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Build Your First Breakout EA: Complete Compilable Robot</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A complete, fully verified Expert Advisor for EURUSD H1 breakout trading. Assembles the Brain, Shield, Glasses, and Hands into zero-warning, production-grade MQL5 code with Strategy Tester optimization.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-800 uppercase">BONUS LAB · THE TWO-AI WORKFLOW</span>
                    <span className="text-xs font-mono text-slate-400">Pages 44–48</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Previous-Day High/Low Breakout EA (ChatGPT + Claude)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Learn the dual-model methodology: using ChatGPT as the Strategy Spec Architect to clarify every rule, then feeding that blueprint to Claude for clean, idiomatic MQL5 generation. Full compilable code provided.
                  </p>
                </div>
              </div>
            )}

            {/* PART TWO */}
            {activeCurriculumTab === 'part2' && (
              <div className="space-y-4">
                {/* Level 4 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-800 uppercase">LEVEL 4 · MIDDLE SCHOOL</span>
                    <span className="text-xs font-mono text-slate-400">Pages 49–53</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Mastering AI Prompt Engineering</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The 5-Ingredient Master Prompt recipe. The vital "Do Not Do This" negative constraint rule. How to enforce the Blueprint Agreement so the AI never writes code until you approve its logic specification. Surgical code fixes using the 80/20 rule.
                  </p>
                </div>

                {/* Level 5 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-800 uppercase">LEVEL 5 · HIGH SCHOOL</span>
                    <span className="text-xs font-mono text-slate-400">Pages 54–58</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">The Safety Shield & Risk Architecture</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automatic lot sizing with Min/Max/Step clamping. Prop firm safety nets: automated 4% daily loss hard circuit breaker. The 3-layer filter stack (Spread, Session, isNewBar). Active trade management: break-even + buffer, trailing stops, partial closes.
                  </p>
                </div>

                {/* Level 6 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-800 uppercase">LEVEL 6 · UNDERGRADUATE</span>
                    <span className="text-xs font-mono text-slate-400">Pages 59–62</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Visual Tools & On-Screen Dashboards</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Custom indicators with mathematical buffers. Volatility & session boxes (the ADR Fuel Tank analogy). Multi-bot on-screen control dashboards using MT5 chart objects. Bonus: TradingView Pine Script v6 webhook alert integration.
                  </p>
                </div>

                {/* Level 7 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-800 uppercase">LEVEL 7 · SENIOR YEAR</span>
                    <span className="text-xs font-mono text-slate-400">Pages 63–66</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Debugging & Code Audits Without Reading Code</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The "Explain It To Me" pre-flight audit. Compiler errors vs logic errors. The AI mistake-pattern checklist (setup in OnTick, hardcoded pips, missing MagicNumber). Out-of-sample backtesting protocol (80% train / 20% test).
                  </p>
                </div>

                {/* Level 8 */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-900 uppercase">LEVEL 8 · GRADUATION CAPSTONE</span>
                    <span className="text-xs font-mono text-slate-400">Pages 67–68</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Four Real-World Production Projects</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Build and compile 4 production-grade systems: Volatility Exhaustion Bot, Automated Trade Manager, Prop Firm Challenge EA, and Multi-Bot Control Dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* APPENDICES */}
            {activeCurriculumTab === 'appendices' && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-800 uppercase">APPENDIX A · EVALUATION</span>
                    <span className="text-xs font-mono text-slate-400">Pages 69–70</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">The Levels 1–3 Master Examination & Complete Answer Key</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    10 comprehensive architectural exam questions testing your understanding of machine facts, EA event heartbeats, the 4 Lego blocks, and safety guardrails—accompanied by an in-depth answer key with full rationales.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase">APPENDIX B · PROMPT LIBRARY</span>
                    <span className="text-xs font-mono text-slate-400">Page 71</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">The Quick-Reference Consolidated Prompt Library</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All 13 battle-tested prompt templates organized into a handy cheat sheet: Pre-Flight Audit, Machine Fact Translation, Master EA Generator, Negative Constraints, Surgical Fixes, Compiler Fixes, Dynamic Lot Sizing, and Drawdown Shields.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ==================================================== */}
        {/* CAPSTONE PROJECTS SHOWCASE */}
        {/* ==================================================== */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The 4 Capstone Projects
            </h3>
            <p className="text-xs text-slate-600">
              Graduation builds included with full, compilable source code:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capstoneProjects.map((proj, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-800">PROJECT {proj.number}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{proj.type}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">{proj.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{proj.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified MQL5 Included</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================== */}
        {/* PROMPT LIBRARY HIGHLIGHT */}
        {/* ==================================================== */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold uppercase">
              <Terminal className="w-3.5 h-3.5" />
              <span>Appendix B Spotlight</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              The 13 Master Prompt Templates
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Every prompt in the book is engineered to be copied and pasted directly into ChatGPT, Claude, or Gemini:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {promptLibraryItems.map((prompt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <div className="text-[11px] font-mono text-amber-400 font-bold">PROMPT #{idx + 1}</div>
                <div className="text-xs font-bold text-white leading-snug">{prompt.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{prompt.purpose}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================== */}
        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        {/* ==================================================== */}
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-600">
              Everything you need to know about the course book and its delivery.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================== */}
        {/* BOTTOM FINAL PURCHASE SECTION */}
        {/* ==================================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-emerald-800/30 shadow-xl text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold uppercase">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>ACCELERATE YOUR TRADING AUTOMATION</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Get The School of AI Trading Architecture
          </h3>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Gain immediate access to the 71-page comprehensive curriculum, full verified MQL5 source code files, and all 13 copy-and-paste master prompts.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePurchase}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold shadow-lg shadow-emerald-900/20 py-4 px-8 text-base"
            >
              Get The Course Book — {formatPrice(89, 'USD')}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleMasterclassClick}
              icon={<GraduationCap className="w-4 h-4 text-emerald-800" />}
              className="w-full sm:w-auto font-semibold border-slate-300 py-4 px-6 text-sm"
            >
              Included with Masterclass
            </Button>
          </div>

          <div className="pt-4 text-xs font-mono text-slate-500">
            {currentCurrency.code} • One-time purchase • DRM-Free PDF • Verified MQL5 Source Files • Lifetime Updates
          </div>
        </div>

      </div>
    </div>
  );
}

export default EbookProductDetail;
