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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>ADVANCED CURRICULUM & STRATEGY ARCHITECTURE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Academy Masterclass Packages
        </h2>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Unlock institutional trading automation with Levels 4 through 8. Jump directly into advanced prompt architecture, algorithmic order flow, and production-grade MQL5 deployment.
        </p>

        {/* Currency Switcher Notice */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-mono">
          <span>Pricing automatically adapted to your region:</span>
          <CurrencySelector variant="compact" />
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
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white border-2 border-emerald-500/70 shadow-xl shadow-emerald-950/20 lg:-translate-y-2'
                  : 'bg-white border border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                  {pkg.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  {!pkg.popular && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {pkg.badge}
                    </span>
                  )}
                  <h3 className={`text-xl font-extrabold ${pkg.popular ? 'text-white mt-1' : 'text-slate-900 mt-2'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed font-normal ${pkg.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {pkg.tagline}
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
                  <div className={`text-[11px] font-mono flex items-center gap-1.5 ${
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
                    onNavigate('academy-pricing');
                  }}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    pkg.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
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
