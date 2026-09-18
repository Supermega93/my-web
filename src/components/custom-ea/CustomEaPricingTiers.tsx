import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Check, Clock } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';

export interface CustomEaPackage {
  id: string;
  name: string;
  tierLabel: string;
  description: string;
  baseUsdPrice: number;
  originalUsdPrice: number;
  discountBadge: string;
  turnaround: string;
  isPopular?: boolean;
  features: string[];
}

export const CUSTOM_EA_PACKAGES: CustomEaPackage[] = [
  {
    id: 'basic',
    name: 'BASIC',
    tierLabel: 'Entry Tier',
    description: 'Single-indicator or price-action breakout models with fixed risk and scheduled trading sessions.',
    baseUsdPrice: 149,
    originalUsdPrice: 299,
    discountBadge: '50% OFF',
    turnaround: '3–5 business days',
    features: [
      '1–2 indicator or price action triggers',
      'Fixed lot size or fixed % equity risk',
      'Fixed Take Profit & Stop Loss',
      'Full clean source code (.mq5 / .mq4)',
    ],
  },
  {
    id: 'intermediate',
    name: 'INTERMEDIATE',
    tierLabel: 'Standard Tier',
    description: 'Multi-timeframe setups, dynamic ATR trailing stops, break-even logic, and prop-firm drawdown limiters.',
    baseUsdPrice: 299,
    originalUsdPrice: 599,
    discountBadge: '50% OFF',
    turnaround: '5–8 business days',
    isPopular: true,
    features: [
      'Multi-timeframe trend & confirmation filters',
      'Dynamic ATR trailing stop & break-even',
      'Daily max loss limiter (prop-firm compliant)',
      'Economic news filter integration',
      'Source code + 14-day QA warranty',
    ],
  },
  {
    id: 'advanced',
    name: 'ADVANCED',
    tierLabel: 'Institutional Tier',
    description: 'Institutional order flow, liquidity sweeps, multi-symbol portfolio management, and custom GUI dashboards.',
    baseUsdPrice: 499,
    originalUsdPrice: 999,
    discountBadge: '50% OFF',
    turnaround: '10–14 business days',
    features: [
      'Smart Money liquidity void & sweep logic',
      'Multi-currency portfolio risk balancer',
      'Interactive on-chart GUI dashboard',
      'Telegram / Discord webhook alerts',
      '30-day warranty & priority support',
    ],
  },
];

interface CustomEaPricingCardsProps {
  onSelectPackage: (packageName: string) => void;
  selectedPackageName?: string;
  buttonLabel?: string;
  hideDisclaimer?: boolean;
}

export function CustomEaPricingCards({
  onSelectPackage,
  selectedPackageName,
  buttonLabel = 'Start Your EA',
  hideDisclaimer = false,
}: CustomEaPricingCardsProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Package 1: BASIC */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          className={`p-8 rounded-3xl bg-white border transition-all shadow-sm hover:shadow-md flex flex-col justify-between group relative ${
            selectedPackageName?.toLowerCase() === 'basic'
              ? 'border-emerald-600 ring-2 ring-emerald-600/30'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Entry Tier</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">BASIC</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Single-indicator or price-action breakout models with fixed risk and scheduled trading sessions.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">From {formatPrice(149)}</span>
                <span className="text-sm text-slate-400 line-through font-mono">{formatPrice(299)}</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">50% OFF</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Turnaround: 3–5 business days</span>
              </div>
            </div>

            {/* Key inclusions */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1–2 indicator or price action triggers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fixed lot size or fixed % equity risk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fixed Take Profit & Stop Loss</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full clean source code (.mq5 / .mq4)</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <Button
              variant={selectedPackageName?.toLowerCase() === 'basic' ? 'primary' : 'outline'}
              size="md"
              fullWidth
              onClick={() => onSelectPackage('Basic')}
            >
              {selectedPackageName?.toLowerCase() === 'basic' ? 'Selected • Basic' : buttonLabel}
            </Button>
          </div>
        </motion.div>

        {/* Package 2: INTERMEDIATE (FEATURED DEEP EMERALD PLAN) */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.25 }}
          className={`p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white border shadow-2xl shadow-emerald-950/20 flex flex-col justify-between group relative transform lg:-translate-y-2 ${
            selectedPackageName?.toLowerCase() === 'intermediate'
              ? 'border-emerald-400 ring-2 ring-emerald-400/40'
              : 'border-emerald-600/50'
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Most Popular</span>
          </div>

          <div className="space-y-6 pt-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">Standard Tier</span>
              <h3 className="text-2xl font-black text-white mt-1">INTERMEDIATE</h3>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                Multi-timeframe setups, dynamic ATR trailing stops, break-even logic, and prop-firm drawdown limiters.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">From {formatPrice(299)}</span>
                <span className="text-sm text-emerald-300/70 line-through font-mono">{formatPrice(599)}</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-300 text-slate-950">50% OFF</span>
              </div>
              <div className="text-[11px] text-emerald-200 font-mono mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>Turnaround: 5–8 business days</span>
              </div>
            </div>

            {/* Key inclusions */}
            <div className="space-y-3 pt-4 border-t border-emerald-700/60 text-xs text-emerald-50">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Multi-timeframe trend & confirmation filters</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Dynamic ATR trailing stop & break-even</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Daily max loss limiter (prop-firm compliant)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Economic news filter integration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Source code + 14-day QA warranty</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-emerald-700/60">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPackage('Intermediate')}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{selectedPackageName?.toLowerCase() === 'intermediate' ? 'Selected • Intermediate' : buttonLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Package 3: ADVANCED */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          className={`p-8 rounded-3xl bg-white border transition-all shadow-sm hover:shadow-md flex flex-col justify-between group relative ${
            selectedPackageName?.toLowerCase() === 'advanced'
              ? 'border-emerald-600 ring-2 ring-emerald-600/30'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Institutional Tier</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">ADVANCED</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Institutional order flow, liquidity sweeps, multi-symbol portfolio management, and custom GUI dashboards.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">From {formatPrice(499)}</span>
                <span className="text-sm text-slate-400 line-through font-mono">{formatPrice(999)}</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">50% OFF</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Turnaround: 10–14 business days</span>
              </div>
            </div>

            {/* Key inclusions */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Smart Money liquidity void & sweep logic</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-currency portfolio risk balancer</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interactive on-chart GUI dashboard</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Telegram / Discord webhook alerts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-day warranty & priority support</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <Button
              variant={selectedPackageName?.toLowerCase() === 'advanced' ? 'primary' : 'outline'}
              size="md"
              fullWidth
              onClick={() => onSelectPackage('Advanced')}
            >
              {selectedPackageName?.toLowerCase() === 'advanced' ? 'Selected • Advanced' : buttonLabel}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Pricing Note */}
      {!hideDisclaimer && (
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-mono">
            * Final project scope and pricing are confirmed after developer review and consultation.
          </p>
        </div>
      )}
    </div>
  );
}
