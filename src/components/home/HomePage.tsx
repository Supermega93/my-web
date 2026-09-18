import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product, ActiveView } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { HomeFreeAcademySection } from './HomeFreeAcademySection.tsx';
import { FuturisticRobotHero } from './FuturisticRobotHero.tsx';
import { StrategyArchitectsSection } from './StrategyArchitectsSection.tsx';
import { PillIconBadge } from '../common/PillIconBadge.tsx';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Code2, 
  GraduationCap, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Activity, 
  Download, 
  CheckCircle2,
  TrendingUp,
  Star,
  Quote,
  Shield,
  Clock,
  UserCheck,
  Zap,
  Compass,
  Layers,
  ExternalLink
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  onNavigate: (view: ActiveView, productId?: string) => void;
  onBuyNow: (product: Product) => void;
  onTriggerBuildMyEa: () => void;
}

export function HomePage({
  products,
  onNavigate,
  onBuyNow,
  onTriggerBuildMyEa,
}: HomePageProps) {
  // Find flagship EA and featured eBook
  const featuredEa = products.find(p => p.type === 'ea' && p.active === 1) || products[0];
  const featuredEbook = products.find(p => p.type === 'ebook' && p.active === 1);

  const { formatPrice: formatCurrencyPrice, currentCurrency } = useCurrency();

  const formatPrice = (price?: number, currency: string = 'USD') => {
    if (!price) return '$0.00';
    return formatCurrencyPrice(price, currency);
  };

  const processSteps = [
    { num: '01', title: 'Submit Strategy', desc: 'Provide your core rules and indicators.' },
    { num: '02', title: 'Developer Discussion', desc: 'Direct technical consultation with our MQL5 dev.' },
    { num: '03', title: 'Transparent Quote', desc: 'Clear timeline, scope, and fixed pricing.' },
    { num: '04', title: 'MQL5 Development', desc: 'Clean, modular, object-oriented programming.' },
    { num: '05', title: 'Verification & Testing', desc: 'Tick data backtesting and execution safety audits.' },
    { num: '06', title: 'Delivery & Source Code', desc: 'Compiled .ex5 and full .mq5 source code handed over.' },
  ];

  // Verified reviews matching the requested testimonial structure
  const testimonials = [
    {
      id: 1,
      name: 'David Vance',
      role: 'Systematic Trader & Funded Account Holder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      quote: 'The transition from discretionary manual chart staring to strict MQL5 automation was seamless. The Free Academy broke down the math without confusing jargon, and the custom EA delivered with zero martingale risk passed my 200k prop firm evaluation in 3 weeks.',
      highlight: 'Passed $200k Prop Firm Evaluation',
      featured: true,
    },
    {
      id: 2,
      name: 'Elena Rostova',
      role: 'Quantitative Portfolio Manager',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      quote: 'Adaptive Liquidity Pro is built with genuine order flow logic. Having verified stop losses on every execution without hidden grid mechanics is what separates MEG.AI LABS from typical internet EA scams. Superb craftsmanship.',
      highlight: 'Institutional Order Flow Verified',
      featured: false,
    },
    {
      id: 3,
      name: 'Marcus Thorne',
      role: 'Algorithmic Developer & MQL5 Student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      quote: 'The Strategy Architect handbook and curriculum saved me months of trial and error. The prompt architect tool alone helped me structure exact logical conditions before even writing the first line of code.',
      highlight: 'Automated 3 Custom Strategies',
      featured: false,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans">
      {/* 1. Ambient Warm & Emerald Studio Lighting */}
      <div className="absolute -top-10 -right-10 w-[550px] h-[550px] bg-gradient-to-bl from-emerald-600/10 via-teal-500/5 to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute top-24 right-20 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[90px] pointer-events-none -z-0" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/8 via-teal-400/5 to-transparent blur-[140px] pointer-events-none -z-0" />

      {/* 2. Subtle Technical Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f040_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f040_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      {/* 1. HERO SECTION: Full-Width Futuristic MEG.AI LABS Robot (Images 1 & 2) */}
      <FuturisticRobotHero
        onNavigate={onNavigate}
        onTriggerBuildMyEa={onTriggerBuildMyEa}
      />

      {/* 2. STRATEGY ARCHITECT ACADEMY TRACKS */}
      <section className="relative pt-12 pb-14 md:pt-16 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header introducing the tracks */}
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Structured Strategy Architect Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Institutional MQL5 Learning Tracks
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            From foundational quantitative logic to institutional-grade execution algorithms. 100% free and open access.
          </p>
        </div>

        {/* 4 Floating Level Cards (Styled with attached Image 3 pill badges) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Level 1: Preschool */}
          <div 
            onClick={() => onNavigate('level-hub', '1')}
            className="p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="space-y-3">
              <PillIconBadge
                icon={BookOpen}
                label="4 FREE LESSONS"
                variant="emerald"
                size="sm"
              />
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Level 1: Preschool
              </h3>
              <p className="text-xs text-slate-500 font-normal line-clamp-2">
                Strategy Architect Mindset & AI machine facts.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3 text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open Level 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Level 2: Kindergarten (FEATURED DEEP FOREST GREEN) */}
          <div 
            onClick={() => onNavigate('level-hub', '2')}
            className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 border border-emerald-700/60 shadow-xl shadow-emerald-950/20 transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer text-white transform hover:-translate-y-1"
          >
            <div className="space-y-3">
              <PillIconBadge
                icon={TrendingUp}
                label="ACTIVE FREE TRACK"
                variant="green"
                size="sm"
              />
              <h3 className="text-base font-bold text-white">
                Level 2: Kindergarten
              </h3>
              <p className="text-xs text-emerald-100/90 font-normal line-clamp-2">
                Variables 📦, Conditions 🚦, Functions 🍞 & Loops 🔄.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-emerald-700/60 mt-3 text-xs font-semibold text-emerald-300 group-hover:translate-x-0.5 transition-transform">
              <span>Open Level 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Level 3: Elementary */}
          <div 
            onClick={() => onNavigate('level-hub', '3')}
            className="p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="space-y-3">
              <PillIconBadge
                icon={Cpu}
                label="3 FREE LESSONS"
                variant="blue"
                size="sm"
              />
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Level 3: Elementary
              </h3>
              <p className="text-xs text-slate-500 font-normal line-clamp-2">
                5 Program Types 🚘, Robot Heartbeat 💓 & 4 Lego Blocks 🧱.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3 text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open Level 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Levels 4-8: Pro Track */}
          <div 
            onClick={() => onNavigate('academy')}
            className="p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="space-y-3">
              <PillIconBadge
                icon={ShieldCheck}
                label="15 PRO LESSONS"
                variant="purple"
                size="sm"
              />
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Levels 4–8: Pro Track
              </h3>
              <p className="text-xs text-slate-500 font-normal line-clamp-2">
                Institutional ICT, Prop Firm Safeguards & Live Capstones.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3 text-xs font-semibold text-purple-700 group-hover:translate-x-0.5 transition-transform">
              <span>Explore Pro Tracks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Floating Bottom Metrics & Free Academy CTA Dock */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8">
              <div className="text-left">
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">11 Free</div>
                <div className="text-[11px] text-slate-500">Curriculum Lessons</div>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

              <div className="text-left">
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">98%</div>
                <div className="text-[11px] text-slate-500">Student Satisfaction</div>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

              <div className="text-left">
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">24/7</div>
                <div className="text-[11px] text-slate-500">AI Prompt Architect</div>
              </div>
            </div>

            {/* Glowing Deep Emerald Pill Button with White Circular Disc Icon */}
            <button
              onClick={() => {
                const el = document.getElementById('free-academy');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onNavigate('academy');
              }}
              className="pl-2 pr-6 py-2 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center gap-3 cursor-pointer border border-emerald-600/40 group"
            >
              <span className="w-7 h-7 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <span className="tracking-wider uppercase">Start Free Academy</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Pill tags underneath dock (matching Image 3 pill style) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4">
            <PillIconBadge icon={Check} label="MODERN" variant="emerald" size="sm" />
            <PillIconBadge icon={Zap} label="FAST" variant="blue" size="sm" />
            <PillIconBadge icon={Shield} label="SECURE" variant="indigo" size="sm" />
            <PillIconBadge icon={TrendingUp} label="SCALABLE" variant="teal" size="sm" />
          </div>
        </div>
      </section>

      {/* 2. FREE ACADEMY SECTION (PRESERVED CONTENT & SYSTEM) */}
      <HomeFreeAcademySection onNavigate={onNavigate} />

      {/* 3. SERVICES SECTION: 4 Institutional Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
            Institutional Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Core Ecosystem
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto font-normal">
            Engineered specifically for systematic prop firm and institutional FX traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InteractiveServiceCard
            title="Trading EAs"
            subtitle="Ready-to-use trading automation."
            buttonText="Explore EAs"
            icon={<Cpu className="w-6 h-6 text-emerald-700" />}
            tag="Direct Deployment"
            onClick={() => onNavigate('eas')}
          />

          <InteractiveServiceCard
            title="Ebooks"
            subtitle="Learn trading automation and MQL5 development."
            buttonText="Explore Ebooks"
            icon={<BookOpen className="w-6 h-6 text-emerald-700" />}
            tag="Educational Manuals"
            onClick={() => onNavigate('ebooks')}
          />

          <InteractiveServiceCard
            title="Custom EA Development"
            subtitle="Turn your trading strategy into an Expert Advisor."
            buttonText="Build My EA"
            icon={<Code2 className="w-6 h-6 text-emerald-700" />}
            tag="Proprietary Code"
            onClick={() => onNavigate('custom-ea')}
          />

          <InteractiveServiceCard
            title="Coaching"
            subtitle="Practical trading, automation and strategy development guidance."
            buttonText="Explore Coaching"
            icon={<GraduationCap className="w-6 h-6 text-purple-700" />}
            tag="Coming Soon"
            isComingSoon={true}
            onClick={() => onNavigate('coaching')}
          />
        </div>
      </section>

      {/* MEET THE STRATEGY ARCHITECTS SECTION */}
      <StrategyArchitectsSection onNavigate={onNavigate} />

      {/* 4. FREE EBOOK LEAD MAGNET SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-white border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left: Book Mockup Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => onNavigate('free-ebook')}
                className="relative group flex flex-col items-center cursor-pointer"
                title="Click to view Free Guide & Checklist"
              >
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] flex items-center justify-center py-2">
                  <div className="absolute inset-x-8 bottom-2 h-14 bg-slate-300/60 blur-2xl rounded-full pointer-events-none -z-0" />
                  <img
                    src={STOREFRONT_MEDIA.freeEbook.coverUrl}
                    alt="The Trader's Guide to Understanding Strategy Automation by M. Dinga"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[420px] object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-500 z-10"
                  />
                </div>

                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Right: Section Copy & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <PillIconBadge
                icon={Sparkles}
                label="FREE GUIDE — INSTANT ACCESS"
                variant="emerald"
                size="md"
              />

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
                Is Your Strategy Ready For Automation?
              </h2>

              <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
                Download the free guide and discover what needs to be clear before a trading strategy can become an automated system.
              </p>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-mono text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Central Concept: &ldquo;Automation begins when ideas become rules.&rdquo;</span>
                </div>
                <p className="text-slate-500">
                  Includes the 5-point Automation-Ready Checklist to evaluate your entries, stop losses, profit targets, dynamic sizing, and session filters.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate('free-ebook')}
                  className="w-full sm:w-auto pl-2 pr-7 py-2.5 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Download className="w-4 h-4" />
                  </span>
                  <span className="tracking-wider uppercase">Download Free eBook</span>
                </button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('ebooks')}
                >
                  View Book Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED FLAGSHIP EA SECTION: Adaptive Liquidity Pro V1.0 */}
      {featuredEa && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Prop-Firm Ready Robotic Systems
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Featured Trading EA
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Engineered with strict algorithmic stop losses and no toxic martingale mechanics.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Product Visual */}
              <div 
                onClick={() => onNavigate('ea-detail', featuredEa.id)}
                className="lg:col-span-5 relative bg-slate-50 min-h-[320px] lg:min-h-[440px] flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-slate-200 group cursor-pointer"
                title="Click to view full EA details and backtest telemetry"
              >
                <div className="relative">
                  <div className="w-[200px] h-[200px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white flex items-center justify-center group-hover:border-emerald-400 group-hover:shadow-emerald-500/10 transition-all">
                    <img
                      src={STOREFRONT_MEDIA.flagshipEa.imageUrl}
                      alt="Adaptive Liquidity Pro V1.0 MT5 Badge"
                      referrerPolicy="no-referrer"
                      className="w-[200px] h-[200px] aspect-square object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="mt-6 text-center space-y-1">
                  <div className="text-[11px] font-mono text-emerald-800 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                    <span>OFFICIAL MT5 RELEASE // V1.0</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-sm font-mono text-slate-500">
                    Prop-Firm Risk Architecture
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <PillIconBadge
                    icon={Activity}
                    label="Prop-Firm Verified Architecture"
                    variant="blue"
                    size="md"
                  />

                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {featuredEa.name}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    Institutional liquidity-based trading system for MetaTrader 5 (PC). Features breakout and fake-breakout detection, RSI and 50/200 EMA trend filtering, ADR/ATR volatility controls, dynamic risk management, and prop-firm compliance. Pre-configured for Forex and XAUUSD.
                  </p>
                </div>

                {/* Key Features List from Document */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Adaptive liquidity & breakout detection</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>RSI & 50/200 EMA trend filtering</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Prop-firm risk & daily loss limits</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1:5 risk-to-reward & trailing stops</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ADR/ATR volatility filtering</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Forex & XAUUSD optimized set files</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-3xl font-black text-slate-900 font-mono">
                      {formatPrice(featuredEa.price, 'USD')}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      From {formatPrice(199, 'USD')} PC • Up to {formatPrice(349, 'USD')} Source Code
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => onNavigate('ea-detail', featuredEa.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onBuyNow(featuredEa)}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. CUSTOM EA DEVELOPMENT SECTION: "YOUR STRATEGY. YOUR EA." */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <PillIconBadge
            icon={Code2}
            label="Proprietary Engineering"
            variant="cyan"
            size="md"
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
            Your Strategy. Your EA.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Turn your personal trading rules, indicators, and discretionary setups into a proprietary automated trading robot.
          </p>
        </div>

        {/* 6-Step Visual Process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {processSteps.map((step) => (
            <div 
              key={step.num}
              onClick={onTriggerBuildMyEa}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
              title="Click to request custom EA consultation"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  STEP {step.num}
                </span>
                <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                  <span>{step.title}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Dev CTA Action */}
        <div className="text-center pt-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTriggerBuildMyEa}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-extrabold text-base shadow-md shadow-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Build My EA</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* 7. PRICING SECTION (REFLECTING ACTUAL E-BOOK, TRADING ROBOT, AND CUSTOM EA) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <PillIconBadge
            icon={Zap}
            label="Transparent System Pricing"
            variant="purple"
            size="md"
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Transparent Pricing For Every Trader
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto font-normal">
            Choose your path into algorithmic automation: master the methodology with our engineering handbook, deploy our verified flagship trading robot, or commission bespoke custom EA development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: ACTUAL E-BOOK */}
          <div className="rounded-3xl p-8 bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Digital Handbook</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Instant PDF</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {featuredEbook?.name || 'MQL5 Algorithmic Blueprint'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The complete manual on turning plain English trading rules into high-performing MQL5 code using engineered AI prompt workflows.
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 font-mono">
                    {formatPrice(featuredEbook?.price || 49.00)}
                  </span>
                  <span className="text-sm font-mono text-slate-400 line-through">$89.00</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">SAVE 45%</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Immediate access • DRM-free download</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Complete 5-Ingredient AI Prompt architecture templates</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>MQL5 syntax cheatsheets & indicator boilerplates</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Prop firm mathematical drawdown formulas</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>No programming background needed — plain English logic</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Lifetime revision updates included</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                fullWidth
                size="lg"
                onClick={() => {
                  if (featuredEbook) {
                    onBuyNow(featuredEbook);
                  } else {
                    onNavigate('ebooks');
                  }
                }}
              >
                Get The E-Book
              </Button>
              <button 
                onClick={() => onNavigate('ebooks')}
                className="w-full text-center text-xs text-slate-500 hover:text-emerald-800 transition-colors font-medium py-1"
              >
                View all handbook editions →
              </button>
            </div>
          </div>

          {/* Card 2: ACTUAL TRADING ROBOT (FEATURED DEEP EMERALD CARD - MATCHING REFERENCE IMAGE) */}
          <div className="rounded-3xl p-8 sm:p-9 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white border border-emerald-600/40 shadow-2xl shadow-emerald-950/25 flex flex-col justify-between space-y-8 relative transform lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] font-mono tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FLAGSHIP TRADING ROBOT // VERIFIED EA</span>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Ready-To-Run System</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-500/40">MT5 Native</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  {featuredEa?.name || 'Adaptive Liquidity Pro V1.0'}
                </h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Institutional MetaTrader 5 Expert Advisor with automated liquidity sweep execution, dynamic ATR risk, and prop firm safety compliance.
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-mono">
                    {formatPrice(featuredEa?.price || 249.00)}
                  </span>
                  <span className="text-sm font-mono text-emerald-300/70 line-through">{formatPrice(499.00)}</span>
                  <span className="text-xs font-bold text-slate-950 bg-emerald-300 px-2 py-0.5 rounded-full">50% OFF</span>
                </div>
                <div className="text-[11px] text-emerald-200 mt-1 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Instant delivery (.ex5 + .set presets + manual)</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-emerald-700/60 text-xs text-emerald-50">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Automated ICT / Smart Money Liquidity Sweep execution</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>100% Rule-Based: Strict Stop Loss & ZERO martingale or grid</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Prop-Firm Equity Shield with daily loss emergency kill-switch</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Dynamic ATR volatility trailing stop & break-even logic</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Optimized preset (.set) files for XAUUSD, EURUSD & US30</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Lifetime license & free algorithm updates</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (featuredEa) {
                    onBuyNow(featuredEa);
                  } else {
                    onNavigate('eas');
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Trading Robot</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <button 
                onClick={() => onNavigate('eas')}
                className="w-full text-center text-xs text-emerald-200 hover:text-white transition-colors font-medium py-1"
              >
                Inspect full backtest metrics & telemetry →
              </button>
            </div>
          </div>

          {/* Card 3: ACTUAL CUSTOM EA */}
          <div className="rounded-3xl p-8 bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Custom Development</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Full Source Code</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Custom EA Engineering</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Have our senior quantitative MQL5 developers transform your proprietary discretionary strategy into an institutional automated robot.
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 font-mono">From {formatPrice(149)}</span>
                  <span className="text-sm font-mono text-slate-400 line-through">{formatPrice(299)}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">50% OFF</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Turnaround: 3-7 business days</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Your custom indicator & price action rules automated</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct 1-on-1 developer consultation & strategy scoping</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>100% full clean source code (.mq5 / .mq4) handed over</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Custom risk filters: Max daily loss, time session, spread locks</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>14-day warranty & free post-delivery bug fixes</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={onTriggerBuildMyEa}
              >
                Build My Custom EA
              </Button>
              <button 
                onClick={() => onNavigate('custom-ea')}
                className="w-full text-center text-xs text-slate-500 hover:text-emerald-800 transition-colors font-medium py-1"
              >
                Learn more about custom development →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION (MATCHING REFERENCE INSPIRATION) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <PillIconBadge
            icon={Star}
            label="Verified Trader Experiences"
            variant="amber"
            size="md"
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Trusted by Quantitative & Prop-Firm Traders
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto font-normal">
            Read how systematic traders and MQL5 developers transformed their manual trading into disciplined algorithmic execution.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                t.featured
                  ? 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 border-2 border-emerald-300 shadow-lg shadow-emerald-900/5'
                  : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-700 ml-2">5.0</span>
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/80">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>{t.highlight}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {t.name}
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating / Statistics Strip */}
        <div className="mt-12 rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-slate-900 font-mono">4.9 / 5.0</div>
            <div className="text-xs text-slate-500 mt-1 font-mono">Average Rating (280+ Reviews)</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-700 font-mono">1,200+</div>
            <div className="text-xs text-slate-500 mt-1 font-mono">Systematic Students Educated</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 font-mono">100%</div>
            <div className="text-xs text-slate-500 mt-1 font-mono">Verified Clean Source Code</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-700 font-mono">0%</div>
            <div className="text-xs text-slate-500 mt-1 font-mono">Toxic Martingale / Grid</div>
          </div>
        </div>
      </section>

      {/* 9. CREDIBILITY & METRICS STRIP */}
      <section className="py-16 border-t border-slate-200/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono">100%</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono">MQL5 Native</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="text-3xl md:text-4xl font-black text-emerald-700 font-mono">&lt; 5ms</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono">Execution Latency</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="text-3xl md:text-4xl font-black text-teal-700 font-mono">0%</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono">Toxic Martingale</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono">24/5</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono">VPS Monitoring</div>
          </div>
        </div>
      </section>

      {/* 9.5 VERIFIED PLATFORM ROUTE DIRECTORY */}
      <section id="platform-directory" className="py-16 border-t border-slate-200/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50/80 border border-slate-200/90 p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Direct Routes • Desktop & Mobile Responsive</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Platform Navigation Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Every page, curriculum level, and resource is direct-link accessible and persistent across all devices.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 12 Core Routes Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {/* Group 1: Free Academy Tracks */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Academy Tracks</span>
              </div>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('level-hub', '1')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Level 1: Preschool (Free)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('level-hub', '2')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Level 2: Kindergarten (Free)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('level-hub', '3')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Level 3: Elementary (Free)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('lesson-detail', 'lesson-3-practical')}
                    className="w-full text-left p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 font-semibold transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>MQL5 Indicator Exercise</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('academy')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Full Curriculum (Levels 1–8)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Group 2: Systems & Robots */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600" />
                <span>Trading Systems</span>
              </div>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('ea-detail', featuredEa?.id || 'prod_ea_adaptive_liquidity')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-slate-700 hover:text-cyan-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Adaptive Liquidity Pro</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('eas')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-slate-700 hover:text-cyan-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>All Trading EAs Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('custom-ea')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-slate-700 hover:text-cyan-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Custom EA Engineering</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={onTriggerBuildMyEa}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Consultation Request</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Group 3: Free Resources & Tools */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>Free Tools & Books</span>
              </div>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('free-ebook')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Free Strategy Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('ebooks')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Quantitative E-Books</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('prompt-architect')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>AI Strategy Builder</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('coaching')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>1-on-1 Mentorship</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Group 4: Client Portal & Company */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Client & Company</span>
              </div>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('portal')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Downloads Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Client Login & Sign Up</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>About & Methodology</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('free-academy');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>Interactive Free Academy</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. BOTTOM CTA BANNER */}
      <section className="py-20 border-t border-slate-200/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 border border-emerald-700 text-white overflow-hidden text-center max-w-4xl mx-auto space-y-6 shadow-2xl shadow-emerald-950/20">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Turn Your Trading Strategy Into Automation.
          </h2>
          <p className="text-emerald-100/90 text-base sm:text-lg max-w-xl mx-auto font-normal">
            Start with our verified institutional EAs or work with our engineering team on your custom automated system.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTriggerBuildMyEa}
              className="px-8 py-4 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-base shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Build My EA</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-emerald-400 text-white hover:bg-white/10 hover:text-white"
              onClick={() => onNavigate('eas')}
            >
              Explore Trading EAs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive Service Card Component
// ---------------------------------------------------------------------------

interface InteractiveServiceCardProps {
  title: string;
  subtitle: string;
  buttonText: string;
  icon: React.ReactNode;
  tag: string;
  isComingSoon?: boolean;
  onClick: () => void;
}

function InteractiveServiceCard({
  title,
  subtitle,
  buttonText,
  icon,
  tag,
  isComingSoon = false,
  onClick,
}: InteractiveServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative p-7 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-xl overflow-hidden ${
        isHovered 
          ? 'border-emerald-300 shadow-emerald-900/10' 
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <PillIconBadge
            icon={isComingSoon ? Sparkles : ShieldCheck}
            label={tag}
            variant={isComingSoon ? 'purple' : 'emerald'}
            size="sm"
          />

          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700/60 p-1 flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              {icon}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
        <span className={`${
          isComingSoon ? 'text-purple-700' : 'text-emerald-700'
        } group-hover:underline`}>
          {buttonText}
        </span>
        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700 group-hover:translate-x-1 transition-all duration-200">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

export default HomePage;
