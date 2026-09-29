import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  Award, 
  Cpu, 
  Zap, 
  Bot, 
  Clock, 
  Users, 
  CheckCircle2, 
  Star,
  Lock,
  MessageSquareCode,
  Mail,
  ShieldAlert,
  Send,
  CreditCard
} from 'lucide-react';
import { ActiveView } from '../../types.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../common/Button.tsx';
import { AcademyNav } from './AcademyNav.tsx';
import { setActiveStudentTier, StudentTier, getActiveStudentTier } from '../../services/academyAccess.ts';
import { api } from '../../services/api.ts';
import { ExternalLink } from 'lucide-react';

interface AcademyPricingPageProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
  onBuyNow?: (product: any, tier?: any) => void;
}

export function AcademyPricingPage({ onNavigate, onOpenAuth, onBuyNow }: AcademyPricingPageProps) {
  const { currentCurrency, formatPrice, convertAmount } = useCurrency();
  const { user, isAdmin, isEmailVerified, sendMasterclassVerification } = useAuth();
  const [selectedTierId, setSelectedTierId] = useState<string>('masterclass-ea');
  const [currentStudentTier, setCurrentStudentTier] = useState<StudentTier>(() => getActiveStudentTier(user, isAdmin));

  // The 3 Required Masterclass Pricing Packages ($99 / $169 / $299)
  const packages = [
    {
      id: 'masterclass',
      name: 'MASTERCLASS',
      badge: 'EDUCATION',
      positioning: 'EDUCATION',
      popular: false,
      usdPrice: 99,
      displayPrice: formatPrice(99),
      primaryMessage: 'Learn to build professional trading systems with AI.',
      supportingDescription: 'Master the architecture behind AI-powered trading systems, from strategy specification to EA development.',
      features: [
        'The School of AI Trading Architecture (Complete 71-Page Course Book · $89 value)',
        'Full access to Masterclass Levels 4 through 8 (Middle School to PhD)',
        'Advanced AI Prompt Engineering (Practical frameworks for ChatGPT, Claude & AI development)',
        'AI Trading Prompt Library (Strategy spec, MQL5, EAs, indicators, debugging, optimization & error fixing)',
        'Strategy Architecture Templates (Market, session, entry, confirmation, filters, risk & trade management)',
        '"From Idea → EA" Workflow (Trading Idea → Spec → AI Coding Prompt → MQL5 → Backtest → Debug → Refine)',
        'Practical Labs and Capstone Projects',
        'Advanced prompt engineering templates',
        'Official Strategy Architect Certificate of Completion',
        'Private student community access',
        'Future curriculum updates and newly published educational modules',
      ],
      notIncluded: [
        'Adaptive Liquidity Pro EA',
        'Any EA license',
        '1-on-1 strategy architecture review',
        'VIP coaching / private mentorship',
        'EA code review',
      ],
      ctaText: 'START MASTERCLASS',
      theme: 'standard',
    },
    {
      id: 'masterclass-ea',
      name: 'MASTERCLASS + ADAPTIVE LIQUIDITY PRO',
      badge: 'BEST VALUE • MOST POPULAR',
      positioning: 'EDUCATION + REAL EA',
      popular: true,
      usdPrice: 169,
      displayPrice: formatPrice(169),
      primaryMessage: 'Learn the architecture. Then put it into practice.',
      supportingDescription: 'Everything in Masterclass, plus access to Adaptive Liquidity Pro and a practical breakdown of how a professional automated trading system is structured.',
      features: [
        'Everything in the $99 Masterclass (Course book, Levels 4–8, prompt library & templates)',
        'Adaptive Liquidity Pro EA included',
        '2-month live MT5 license for Adaptive Liquidity Pro',
        'Proprietary EA set files and presets',
        'Adaptive Liquidity Pro Architecture Breakdown (Directional Filter, RSI Trend Filter, Liquidity / watch-areas, ADR / WAR & Profit Recycling)',
        'EA Implementation Workshop (Real recording: Strategy Idea → Specification → AI Prompt → MQL5 → Testing & Debugging)',
        'Adaptive Liquidity Pro Setup & Configuration Guide (Installation, presets, risk settings, drawdown, daily loss limits & when NOT to run)',
        'Priority technical & development support',
        'Private Discord student community & EA channels',
        'Official Strategy Architect Certificate of Completion',
      ],
      notIncluded: [
        '1-on-1 strategy architecture review',
        'VIP coaching community & private mentorship office hours',
        'Custom EA code review',
      ],
      ctaText: 'GET MASTERCLASS + EA',
      theme: 'popular',
    },
    {
      id: 'premium',
      name: 'PREMIUM VIP MASTERCLASS',
      badge: 'VIP ARCHITECT TIER',
      positioning: 'EDUCATION + EA + PERSONAL ARCHITECT',
      popular: false,
      usdPrice: 299,
      displayPrice: formatPrice(299),
      primaryMessage: 'Build, review and refine your own trading systems.',
      supportingDescription: 'Everything in Masterclass + Adaptive Liquidity Pro, plus personalized strategy architecture, EA code review and direct VIP support.',
      features: [
        'Everything in Masterclass + Adaptive Liquidity Pro ($169 tier)',
        '4-month live MT5 license for Adaptive Liquidity Pro',
        '1-on-1 Strategy Architecture Review (Personalized session to understand, structure & clarify your rules, entry, filters, risk & trade management)',
        'VIP Coaching Community & Private Mentorship Office Hours',
        'Custom EA Code Review (Audit your AI-generated or custom EAs to verify logic matches strategy)',
        'Early access to new EAs, indicators and AI trading tools',
        'Highest-priority dedicated developer support',
        'Lifetime access to all future levels & tool updates',
      ],
      notIncluded: [],
      ctaText: 'JOIN VIP MASTERCLASS',
      theme: 'vip',
    },
  ];

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    setSelectedTierId(pkg.id);
    if (onBuyNow) {
      const productObj = {
        id: pkg.id,
        name: pkg.name,
        type: 'service' as const,
        price: pkg.usdPrice,
        currency: 'USD',
        short_description: pkg.primaryMessage,
        description: pkg.supportingDescription,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: 1
      };
      onBuyNow(productObj, {
        id: pkg.id,
        name: pkg.name,
        price: pkg.usdPrice,
        currency: 'USD',
        displayPrice: pkg.displayPrice,
        tagline: pkg.primaryMessage
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Academy Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="pricing" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ACADEMY MASTERCLASS & BUNDLES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Unlock the Full Trading Architecture Curriculum
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Graduate from manual retail trading into algorithmic strategy architecture. Access Levels 4 through 8, production-ready MQL5 templates, and pair your education with our flagship Adaptive Liquidity Pro EA.
          </p>

          {/* Current Tier Status Notice */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-mono">
            <span className="text-slate-500">Your Current Status:</span>
            <span
              className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                currentStudentTier === 'paid' || currentStudentTier === 'complimentary'
                  ? 'bg-cyan-100 border border-cyan-300 text-cyan-900'
                  : 'bg-slate-200 border border-slate-300 text-slate-700'
              }`}
            >
              {currentStudentTier === 'paid' ? 'Paid Masterclass Active' : currentStudentTier === 'complimentary' ? 'Complimentary Access' : 'Free Tier (Levels 1–3)'}
            </span>
          </div>

          {/* Included Course Book Callout Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                  Included With All Masterclass Enrollments
                </div>
                <div className="text-sm font-bold text-slate-900">
                  The School of AI Trading Architecture (Complete 71-Page Course Book · $89 Standalone Value)
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ebook-detail', 'prod_ebook_mql5_guide')}
              className="text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer shrink-0"
            >
              Preview Course Book →
            </button>
          </div>
        </div>

        {/* 3-Tier Value Ladder Quick Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider block">
                The Mega AI Labs Value Ladder
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Understand Your Upgrade Options in 30 Seconds
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Base USD $99 · $169 · $299
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-slate-900">$99 USD</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 uppercase">
                    Education
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">MASTERCLASS</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Learn the architecture. Learn how to use AI. Structure strategies, build prompt systems, and own the complete 71-page course book.
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60 font-semibold">
                Core Intent: Learn to Build
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 flex flex-col justify-between space-y-2 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-emerald-950">$169 USD</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase">
                    Best Value
                  </span>
                </div>
                <h4 className="text-sm font-bold text-emerald-950 mt-1">MASTERCLASS + ADAPTIVE LIQUIDITY PRO</h4>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Learn the architecture + put it into practice with our flagship MT5 trading robot (2-Month License), implementation workshop & architecture breakdown.
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-800 pt-2 border-t border-emerald-200 font-semibold">
                Core Intent: Learn + Put into Practice
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between space-y-2 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-white">$299 USD</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                    VIP Architect
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">PREMIUM VIP MASTERCLASS</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Everything above + extended 4-Month EA license + 1-on-1 personalized strategy architecture review + custom EA code reviews with the creator.
                </p>
              </div>
              <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-slate-800 font-semibold">
                Core Intent: Learn + Use + Personal Architect Access
              </div>
            </div>
          </div>
        </div>

        {/* 3 PRICING CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isSelected = selectedTierId === pkg.id;
            const isPopular = pkg.popular;
            const isVip = pkg.id === 'premium';

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedTierId(pkg.id)}
                className={`rounded-3xl p-8 transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? isVip
                      ? 'bg-white border-2 border-slate-900 shadow-xl ring-2 ring-slate-900/10'
                      : 'bg-white border-2 border-emerald-700 shadow-xl ring-2 ring-emerald-600/10'
                    : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular / VIP Floating Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{pkg.badge}</span>
                  </div>
                )}
                {isVip && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{pkg.badge}</span>
                  </div>
                )}
                {!isPopular && !isVip && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-800 font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                      {pkg.positioning}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-sm font-bold text-emerald-800 mt-2 leading-snug">
                      {pkg.primaryMessage}
                    </p>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {pkg.supportingDescription}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                        {pkg.displayPrice}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">one-time</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {currentCurrency.code} • Base USD ${pkg.usdPrice}
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                      What is Included:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-medium text-slate-700">{feat}</span>
                        </li>
                      ))}
                      {pkg.notIncluded.map((feat, fIdx) => (
                        <li key={`not-${fIdx}`} className="flex items-start gap-2.5 opacity-40">
                          <span className="w-4 text-center text-slate-400 font-bold shrink-0 mt-0.5">✕</span>
                          <span className="leading-relaxed line-through">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-8 mt-6 border-t border-slate-100">
                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    size="md"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPackage(pkg);
                    }}
                    className={`font-bold shadow-sm transition-all ${
                      isSelected
                        ? isVip
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : ''
                    }`}
                  >
                    {pkg.ctaText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPARISON & TRUST SECTION */}
        <div className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              Curriculum Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Upgrade to Masterclass?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Free students learn the fundamental building blocks in Levels 1–3. The Masterclass equips you with the complete engineering toolset for institutional deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-emerald-800 uppercase font-semibold">Levels 4–5</span>
              <h4 className="text-base font-bold text-slate-900">Advanced Architecture</h4>
              <p className="text-xs text-slate-600">State machines, multi-timeframe engines, ATR volatility filtering & automated risk throttles.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-cyan-800 uppercase font-semibold">Levels 6–7</span>
              <h4 className="text-base font-bold text-slate-900">Quant Verification</h4>
              <p className="text-xs text-slate-600">Walk-forward optimization, Monte Carlo stress testing, and real tick modeling against slippage.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-teal-800 uppercase font-semibold">Flagship EA</span>
              <h4 className="text-base font-bold text-slate-900">Adaptive Liquidity Pro</h4>
              <p className="text-xs text-slate-600">Included in Tier 2 (2-Month License) & Tier 3 (4-Month License) with curated presets and live setup files.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-indigo-800 uppercase font-semibold">Certification</span>
              <h4 className="text-base font-bold text-slate-900">Official Credential</h4>
              <p className="text-xs text-slate-600">Verify your algorithmic competencies with a verifiable Certificate of Completion.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-slate-200/80 max-w-3xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Can I continue on the Free Tier?</h4>
              <p>Yes, absolutely. Levels 1 through 3, the Free Capstone (Lesson 3.5 Breakout EA), the Indicator Workshop (Lesson 3.6), and both companion exercise PDFs are 100% free forever for all students.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">How does the currency conversion work?</h4>
              <p>All prices are converted dynamically using institutional FX rates from the base USD amounts ($99, $169, and $299). You pay in your local currency with zero conversion markup.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">What is the difference between the three tiers?</h4>
              <p><strong>$99 Masterclass:</strong> Complete AI Trading Architecture education (Course book, Levels 4–8, AI Prompt Library, and templates).<br/><strong>$169 Masterclass + EA:</strong> Everything in education, plus Adaptive Liquidity Pro EA (2-month live MT5 license), setup guide, presets, and Implementation Workshop.<br/><strong>$299 Premium VIP:</strong> Everything above, plus 4-month EA license, 1-on-1 strategy architecture review, and custom EA code reviews with the creator.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">What happens after I enroll?</h4>
              <p>Your student tier is instantly elevated to Paid Masterclass. All locked levels (Levels 4 to 8) and advanced bonus chapters unlock immediately in your portal.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
