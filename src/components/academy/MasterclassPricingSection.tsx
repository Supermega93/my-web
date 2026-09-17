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
  BookOpen
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface MasterclassPricingSectionProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onOpenAuth?: (initialMode?: 'login' | 'register') => void;
}

export function MasterclassPricingSection({ onNavigate, onOpenAuth }: MasterclassPricingSectionProps) {
  const { currentCurrency, formatPrice } = useCurrency();
  const { user } = useAuth();
  const [selectedTierId, setSelectedTierId] = useState<string>('masterclass-ea');

  const packages = [
    {
      id: 'masterclass',
      name: 'Masterclass Core',
      badge: 'LEVELS 4–8 COMPLETE',
      popular: false,
      usdPrice: 159,
      displayPrice: formatPrice(159),
      tagline: 'Complete curriculum mastery of Levels 4 through 8, advanced AI prompt engineering & certification.',
      features: [
        'Full lifetime access to Levels 4 through 8',
        'Junior High, High School, Undergraduate, Masters & PhD tiers',
        'Advanced prompt engineering templates for ChatGPT & Claude',
        'Direct algorithmic code generation workflows',
        'Private Discord student community access',
        'Official Strategy Architect Certificate of Completion',
      ],
      ctaText: 'Enroll in Masterclass',
      buttonVariant: 'secondary' as const,
    },
    {
      id: 'masterclass-ea',
      name: 'Masterclass + Adaptive Liquidity Pro',
      badge: 'BEST VALUE • MOST POPULAR',
      popular: true,
      usdPrice: 199,
      displayPrice: formatPrice(199),
      tagline: 'The complete Masterclass curriculum combined with our flagship institutional trading robot.',
      features: [
        'Everything in Masterclass (Levels 4 through 8)',
        'Adaptive Liquidity Pro EA included',
        '2-month live MT5 licence for Adaptive Liquidity Pro',
        'Access to proprietary EA set files & presets',
        'Live Strategy Implementation Workshop recording',
        'Priority technical & development support',
        'Private Discord student community & EA channels',
        'Official Strategy Architect Certificate of Completion',
      ],
      ctaText: 'Get Masterclass + EA',
      buttonVariant: 'primary' as const,
    },
    {
      id: 'premium',
      name: 'Premium VIP Masterclass',
      badge: 'VIP ARCHITECT TIER',
      popular: false,
      usdPrice: 299,
      displayPrice: formatPrice(299),
      tagline: 'The ultimate professional trading architecture mentorship with extended EA license.',
      features: [
        'Everything in Masterclass + Adaptive Liquidity Pro',
        '4-month live MT5 licence for Adaptive Liquidity Pro',
        '1-on-1 strategy architecture review session with creator',
        'VIP coaching community & private mentorship office hours',
        'Custom EA code review (audit your automated bots)',
        'Early access to new EAs, indicators, and AI tools',
        'Highest priority dedicated developer support',
        'Lifetime access to all future levels & tool updates',
      ],
      ctaText: 'Join Premium VIP',
      buttonVariant: 'secondary' as const,
    },
  ];

  return (
    <section id="masterclass-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ADVANCED CURRICULUM & STRATEGY ARCHITECTURE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Academy Masterclass Packages
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Unlock institutional trading automation with Levels 4 through 8. Jump directly into advanced prompt architecture, algorithmic order flow, and production-grade MQL5 deployment.
        </p>

        {/* Currency Switcher Notice */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono">
          <span>Pricing automatically adapted to your region:</span>
          <CurrencySelector variant="dark" />
        </div>
      </div>

      {/* 3 Masterclass Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {packages.map((pkg) => {
          const isSelected = selectedTierId === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedTierId(pkg.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all cursor-pointer ${
                pkg.popular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-cyan-950/40 border-2 border-cyan-500/70 shadow-[0_0_35px_rgba(6,182,212,0.2)] lg:-translate-y-2'
                  : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                  {pkg.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  {!pkg.popular && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                  <h3 className={`text-xl font-extrabold text-white ${pkg.popular ? 'mt-1' : 'mt-2'}`}>
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-normal">
                    {pkg.tagline}
                  </p>
                </div>

                {/* Price Display using adaptive currency */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                      {pkg.displayPrice}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      / one-time
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lifetime curriculum access included</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    What's Included:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button routing to academy pricing payment flow */}
              <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('academy-pricing');
                  }}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.popular
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
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
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-semibold">Immediate Masterclass Unlocking</div>
            <p className="text-slate-400 text-[11px]">Enrolling activates Levels 4–8 in your account with direct MT5 lesson downloads and quizzes.</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('academy-pricing')}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs transition-colors cursor-pointer"
        >
          View Full Pricing Comparison & FAQ →
        </button>
      </div>
    </section>
  );
}
