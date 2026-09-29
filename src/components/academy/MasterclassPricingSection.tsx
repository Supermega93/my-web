import React, { useState } from 'react';
import { ActiveView } from '../../types.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { CurrencySelector } from '../common/CurrencySelector.tsx';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Bot, 
  Crown, 
  Layers,
  Award,
  Zap,
  Lock,
  BookOpen,
  Star,
  UserCheck
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface MasterclassPricingSectionProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onOpenAuth?: (initialMode?: 'login' | 'register') => void;
  onBuyNow?: (product: any, tier?: any) => void;
}

export function MasterclassPricingSection({ onNavigate, onOpenAuth, onBuyNow }: MasterclassPricingSectionProps) {
  const { currentCurrency, formatPrice } = useCurrency();
  const { user } = useAuth();
  const [selectedTierId, setSelectedTierId] = useState<string>('masterclass-ea');

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
        'The School of AI Trading Architecture (Complete 71-page course book · $89 value)',
        'Full access to Masterclass Levels 4–8 (Middle School to PhD)',
        'Advanced AI Prompt Engineering (Practical frameworks for ChatGPT, Claude & AI development)',
        'AI Trading Prompt Library (Strategy spec, MQL5, EAs, indicators, debugging, optimization & error fixing)',
        'Strategy Architecture Templates (Market, session, entry, confirmation, filters, risk & trade management)',
        '"From Idea → EA" Workflow (Idea → Spec → AI Prompt → MQL5 → Compile → Backtest → Debug → Refine)',
        'Practical Labs and Capstone Projects',
        'Advanced prompt engineering templates',
        'Official Strategy Architect Certificate of Completion',
        'Private student community access',
        'Future curriculum updates and newly published educational modules',
      ],
      ctaText: 'START MASTERCLASS',
      buttonVariant: 'secondary' as const,
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
      ctaText: 'GET MASTERCLASS + EA',
      buttonVariant: 'primary' as const,
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
        'Lifetime access to future educational levels and tool updates',
      ],
      ctaText: 'JOIN VIP MASTERCLASS',
      buttonVariant: 'secondary' as const,
    },
  ];

  const handleAction = (pkg: typeof packages[0]) => {
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
    } else {
      onNavigate('academy-pricing');
    }
  };

  return (
    <section id="masterclass-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>ADVANCED CURRICULUM & STRATEGY ARCHITECTURE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Academy Masterclass Packages
        </h2>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Master the architecture behind AI-powered trading systems, from strategy specification to production-ready MQL5 deployment.
        </p>

        {/* Currency Switcher Notice */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-mono">
          <span>Pricing automatically adapted to your region:</span>
          <CurrencySelector variant="compact" />
        </div>
      </div>

      {/* 3-Tier Value Ladder Overview Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            Value Ladder Quick Guide
          </span>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold hidden sm:inline">
            Clear 3-Tier Progression
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              01
            </span>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-black text-slate-900 font-mono">$99</span>
                <span className="text-[11px] font-mono font-bold text-slate-600">EDUCATION</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Learn the architecture · AI prompts · Strategy specs · Complete 71-page course book.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              02
            </span>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-black text-emerald-950 font-mono">$169</span>
                <span className="text-[11px] font-mono font-bold text-emerald-800">EDUCATION + REAL EA</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
                Learn the architecture + Adaptive Liquidity Pro EA (2-Mo License) + Implementation Workshop.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              03
            </span>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-black text-white font-mono">$299</span>
                <span className="text-[11px] font-mono font-bold text-amber-400">EDUCATION + EA + PERSONAL ARCHITECT</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Everything above + 4-Mo EA License + 1-on-1 Strategy Architecture Review + Code Audits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Masterclass Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-2">
        {packages.map((pkg) => {
          const isSelected = selectedTierId === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedTierId(pkg.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all cursor-pointer ${
                pkg.popular
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white border-2 border-emerald-500/70 shadow-xl shadow-emerald-950/20 lg:-translate-y-2'
                  : 'bg-white border border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Popular / VIP Badge */}
              {pkg.popular ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                  {pkg.badge}
                </div>
              ) : (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
                  {pkg.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider mb-2 bg-slate-100/90 text-slate-800 border border-slate-200">
                    <span>{pkg.positioning}</span>
                  </div>
                  <h3 className={`text-xl font-extrabold ${pkg.popular ? 'text-white mt-1' : 'text-slate-900 mt-1'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm font-bold mt-2 leading-snug ${pkg.popular ? 'text-emerald-300' : 'text-slate-900'}`}>
                    {pkg.primaryMessage}
                  </p>
                  <p className={`text-xs mt-1.5 leading-relaxed font-normal ${pkg.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                    {pkg.supportingDescription}
                  </p>
                </div>

                {/* Price Display using adaptive currency */}
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  pkg.popular 
                    ? 'bg-slate-900/90 border-slate-800' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                      pkg.popular ? 'text-white' : 'text-slate-900'
                    }`}>
                      {pkg.displayPrice}
                    </span>
                    <span className={`text-xs font-mono ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                      / one-time
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {currentCurrency.code} • Base USD ${pkg.usdPrice}
                  </div>
                  <div className={`text-[11px] font-mono flex items-center gap-1.5 pt-1 ${
                    pkg.popular ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lifetime curriculum access included</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold block ${
                    pkg.popular ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    What's Included:
                  </span>
                  <ul className={`space-y-2.5 text-xs ${
                    pkg.popular ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                          pkg.popular ? 'text-emerald-400' : 'text-emerald-600'
                        }`} />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button routing to academy pricing payment flow */}
              <div className={`pt-6 mt-6 border-t ${
                pkg.popular ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(pkg);
                  }}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    pkg.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/25'
                      : pkg.id === 'premium'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white font-bold'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white font-bold'
                  }`}
                >
                  <span>{pkg.ctaText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust and Guarantee Footnote */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-900 font-bold">Immediate Masterclass Unlocking</div>
            <p className="text-slate-500 text-[11px]">Enrolling activates Levels 4–8 in your account with direct MT5 lesson downloads and quizzes.</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('academy-pricing')}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200"
        >
          View Full Pricing Comparison & FAQ →
        </button>
      </div>
    </section>
  );
}
