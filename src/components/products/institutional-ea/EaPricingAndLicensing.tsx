import { useState, RefObject } from 'react';
import { Product } from '../../../types.ts';
import { useCurrency } from '../../../context/CurrencyContext.tsx';
import { Button } from '../../common/Button.tsx';
import { Check, Sparkles, Terminal, ShieldCheck, ArrowRight } from 'lucide-react';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  displayPrice: string;
  license: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

interface EaPricingAndLicensingProps {
  product: Product;
  pricingRef: RefObject<HTMLDivElement | null>;
  onBuyNow: (product: Product, tier?: { id: string; name: string; price: number; currency: string; displayPrice: string }) => void;
}

export function EaPricingAndLicensing({
  product,
  pricingRef,
  onBuyNow
}: EaPricingAndLicensingProps) {
  const { formatPrice: formatCurrencyPrice, currentCurrency } = useCurrency();

  const pricingTiers: PricingTier[] = [
    {
      id: 'license_6m',
      name: '6 Month License',
      price: 199,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(199, 'USD'),
      license: 'Access Period: 6 Months Licensed Access',
      badge: 'STANDARD ACCESS',
      features: [
        'Full licensed access to Adaptive Liquidity Pro V1.0',
        'All 3 Calibrated Presets (Preservation, Balanced, High Growth)',
        'Compiled .ex5 binary for MetaTrader 5 (Windows/VPS)',
        'Forex & XAUUSD (Gold H1) pre-calibrated parameter setfiles',
        'Built-in 6% risk protection controls & equity safeguards',
        'Active license key verification for trading terminal'
      ]
    },
    {
      id: 'license_12m',
      name: '12 Month License',
      price: 299,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(299, 'USD'),
      license: 'Access Period: 12 Months Licensed Access',
      badge: 'BEST VALUE',
      popular: true,
      features: [
        'Full licensed access to Adaptive Liquidity Pro V1.0',
        'Access Period: 12 Months active license term',
        'All 3 Calibrated Presets (Preservation, Balanced, High Growth)',
        'Compiled .ex5 binary for MetaTrader 5 (Windows/VPS)',
        'Comprehensive institutional risk controls suite',
        'Trading-session, ADR/ATR volatility & profit-recycling',
        'Multi-account license support (Live + Demo accounts)'
      ]
    },
    {
      id: 'license_source',
      name: 'Source Code License',
      price: 499,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(499, 'USD'),
      license: 'Developer License: Complete MQL5 Source Code',
      badge: 'DEVELOPER ACCESS',
      features: [
        'Complete editable MQL5 (.mq5) source code',
        'Unrestricted private execution on unlimited accounts',
        'Full algorithmic transparency & modular architecture',
        'Customizable EA parameters & custom logic adaptation',
        'Backtesting & multi-asset optimization framework',
        'Comprehensive developer documentation & logic maps'
      ]
    }
  ];

  const [selectedTier, setSelectedTier] = useState<PricingTier>(pricingTiers[1]);

  const handlePurchase = (tier?: PricingTier) => {
    const tierToUse = tier || selectedTier;
    const customizedProduct: Product = {
      ...product,
      price: tierToUse.price,
      currency: tierToUse.currency,
      short_description: `${product.name} (${tierToUse.name}) — ${tierToUse.displayPrice}`
    };
    onBuyNow(customizedProduct, tierToUse);
  };

  return (
    <div ref={pricingRef} className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold">
            Licensed Access Terms
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Acquire Institutional Access
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Choose your licensed deployment term with pre-calibrated setfiles for all 3 risk tiers, or obtain full editable MQL5 source code rights.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Instant Download • Automated Provisioning</span>
        </div>
      </div>

      {/* 2 Standard Licensed Tiers (6 Months vs 12 Months) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {pricingTiers.slice(0, 2).map((tier) => {
          const isSelected = selectedTier.id === tier.id;
          const isPopular = tier.popular;

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier)}
              className={`rounded-3xl p-8 transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-white border-2 border-emerald-700 shadow-xl ring-2 ring-emerald-600/10'
                  : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{tier.badge || 'BEST VALUE'}</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                    Licensed Access
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                  <div className="text-xs text-emerald-700 font-mono mt-1 font-semibold">{tier.license}</div>
                </div>

                <div className="pt-2">
                  <div className="text-4xl font-black text-slate-900 font-mono">
                    {tier.displayPrice}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    {currentCurrency.code} • License Term: {tier.name === '12 Month License' ? '12 Months' : '6 Months'} Access Period
                  </div>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(tier);
                    handlePurchase(tier);
                  }}
                  className={`w-full font-bold ${
                    isSelected 
                      ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white shadow-md' 
                      : ''
                  }`}
                >
                  {isSelected ? `Get ${tier.name}` : `Select ${tier.name}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Developer Source Code License ($499) */}
      {(() => {
        const sourceTier = pricingTiers[2];
        const isSourceSelected = selectedTier.id === sourceTier.id;

        return (
          <div 
            onClick={() => setSelectedTier(sourceTier)}
            className={`mt-6 rounded-3xl p-7 sm:p-9 transition-all duration-300 relative cursor-pointer border-2 ${
              isSourceSelected
                ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-emerald-500 shadow-2xl ring-2 ring-emerald-500/20'
                : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-slate-800 hover:border-slate-700 shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Visually Separate Developer License</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold">
                    Full MQL5 Source (.mq5)
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {sourceTier.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-sans leading-relaxed">
                    Complete MQL5 (.mq5) source code access for institutional quantitative developers and traders requiring unrestricted logic adaptation, multi-terminal deployment, and private algorithmic ownership.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {sourceTier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-5 shrink-0 lg:border-l lg:border-slate-800/80 lg:pl-8">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                    Source Code License
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono mt-1">
                    {sourceTier.displayPrice}
                  </div>
                  <span className="text-xs font-mono text-emerald-400 mt-1 block">
                    Full Developer Rights • Unlimited Term
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(sourceTier);
                    handlePurchase(sourceTier);
                  }}
                  className="w-full sm:w-auto font-bold bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20"
                >
                  {isSourceSelected ? 'Obtain Source Code License' : 'Select Source Code License'}
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
