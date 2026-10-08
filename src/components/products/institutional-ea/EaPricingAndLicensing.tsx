import { useState, RefObject } from 'react';
import { Product } from '../../../types.ts';
import { useCurrency } from '../../../context/CurrencyContext.tsx';
import { Button } from '../../common/Button.tsx';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Award, 
  CheckCircle2, 
  Headphones 
} from 'lucide-react';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  displayOriginalPrice: string;
  discountPercent: number;
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
      price: 119.4,
      originalPrice: 238.8,
      displayOriginalPrice: formatCurrencyPrice(238.8, 'USD'),
      discountPercent: 50,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(119.4, 'USD'),
      license: 'Access Period: 6 Months Licensed Access',
      badge: '50% OFF SPECIAL',
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
      price: 179.4,
      originalPrice: 358.8,
      displayOriginalPrice: formatCurrencyPrice(358.8, 'USD'),
      discountPercent: 50,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(179.4, 'USD'),
      license: 'Access Period: 12 Months Licensed Access',
      badge: '50% OFF • BEST VALUE',
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
      id: 'license_prop_firm_mobile',
      name: 'Prop Firm & Mobile Version',
      price: 150,
      originalPrice: 300,
      displayOriginalPrice: formatCurrencyPrice(300, 'USD'),
      discountPercent: 50,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(150, 'USD'),
      license: 'Specialized Prop-Firm Trading & Mobile Version',
      badge: '50% OFF SPECIAL',
      features: [
        'Engineered specifically for prop-firm trading rules & drawdown safeguards',
        'Full mobile monitoring & management on Android and iOS devices',
        'Top recommended for FTMO, FundingPips & FundedNext',
        'Also recommended for Goat Funded Trader, Blue Guardian & BrightFunded',
        'Personal 1-on-1 installation assistance by Mega AI Labs (upon proof of payment)',
        'Comprehensive self-installation manual provided via Email & Telegram'
      ]
    }
  ];

  const [selectedTier, setSelectedTier] = useState<PricingTier>(pricingTiers[1]);

  const handlePurchase = (tier?: PricingTier) => {
    const tierToUse = tier || selectedTier;
    const customizedProduct: Product = {
      ...product,
      price: tierToUse.price,
      original_price: tierToUse.originalPrice,
      on_special: true,
      discount_percent: 50,
      currency: tierToUse.currency,
      short_description: `${product.name} (${tierToUse.name}) — ${tierToUse.displayPrice} (Special: 50% Off, was ${tierToUse.displayOriginalPrice})`
    };
    onBuyNow(customizedProduct, tierToUse);
  };

  return (
    <div ref={pricingRef} className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>LIMITED-TIME SPECIAL PRICING — 50% OFF</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Acquire Institutional Access
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Current pricing is on special by 50% off normal retail pricing across all licensed terms and the specialized Prop Firm &amp; Mobile Version.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Instant Download • Automated Provisioning</span>
        </div>
      </div>

      {/* Special Offer Highlight Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border border-rose-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs font-black font-mono text-sm">
            -50%
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-rose-800 uppercase tracking-wider">
              SPECIAL PROMOTION: 50% OFF CURRENT PRICING
            </div>
            <div className="text-sm font-bold text-slate-900">
              All Adaptive Liquidity Pro licenses are currently reduced by 50% from the normal price.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-mono text-xs font-bold">
            50% SAVINGS APPLIED
          </span>
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

                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold uppercase">
                      50% OFF SPECIAL
                    </span>
                    <span className="text-xs text-slate-400 font-mono line-through font-normal">
                      Normal: {tier.displayOriginalPrice}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-black text-slate-900 font-mono">
                      {tier.displayPrice}
                    </div>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      (Save 50%)
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Current Special Price • Normal Price: {tier.displayOriginalPrice}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
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

      {/* Prop Firm & Mobile Version ($150) — Replaces Source Code */}
      {(() => {
        const propTier = pricingTiers[2];
        const isPropSelected = selectedTier.id === propTier.id;

        return (
          <div 
            onClick={() => setSelectedTier(propTier)}
            className={`mt-6 rounded-3xl p-6 sm:p-8 lg:p-9 transition-all duration-300 relative cursor-pointer border-2 ${
              isPropSelected
                ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-emerald-500 shadow-2xl ring-2 ring-emerald-500/20'
                : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-slate-800 hover:border-slate-700 shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              <div className="space-y-6 flex-1">
                {/* Header badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Specialized Prop-Firm Edition</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Android &amp; iOS Compatible</span>
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {propTier.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans leading-relaxed">
                    A specialized version of the EA designed for <strong className="text-white">prop-firm trading</strong>, with mobile compatibility for <strong className="text-white">Android and iOS</strong>.
                  </p>
                </div>

                {/* Recommended Prop Firms Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recommended Prop Firms</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Evaluated &amp; Recommended Setup
                    </span>
                  </div>

                  {/* Top 3 Recommendations (Visually Highlighted) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { name: 'FTMO', highlight: 'Top Recommendation' },
                      { name: 'FundingPips', highlight: 'Top Recommendation' },
                      { name: 'FundedNext', highlight: 'Top Recommendation' },
                    ].map((firm) => (
                      <div
                        key={firm.name}
                        className="p-3 rounded-xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/40 shadow-xs flex flex-col items-center sm:items-start justify-center text-center sm:text-left"
                      >
                        <span className="text-xs font-mono font-bold text-white tracking-wide">
                          {firm.name}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{firm.highlight}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Other 3 Recommended Prop Firms */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Also Recommended:
                    </span>
                    {['Goat Funded Trader', 'Blue Guardian', 'BrightFunded'].map((firm) => (
                      <span
                        key={firm}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-medium"
                      >
                        {firm}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 font-sans leading-tight pt-1">
                    *Recommended for use with these prop firms. This does not imply or guarantee approval, profitability, or universal EA acceptance by every firm.
                  </p>
                </div>

                {/* Installation & Setup & Mobile Compatibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Installation & Setup */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                      <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Installation &amp; Setup (Mega AI Labs)</span>
                    </div>
                    <div className="space-y-2 text-xs text-slate-300 font-sans">
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">1.</span>
                        <div>
                          <strong className="text-white">Personal Installation:</strong> Mega AI Labs personally assists with installation after receiving proof of payment and arranging a call with the customer.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">2.</span>
                        <div>
                          <strong className="text-white">Self Installation:</strong> Follow the included manual to set up the robot yourself. Manual provided automatically via email and Telegram.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Compatibility */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mobile Compatibility</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        Designed to work with <strong className="text-white">Android and iOS mobile devices</strong>, allowing customers to conveniently monitor and manage their trading setup from mobile.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 font-semibold border border-slate-700">
                        Android MT5
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 font-semibold border border-slate-700">
                        iOS / Apple
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 font-semibold border border-slate-700">
                        Remote VPS Sync
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & CTA Column */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-6 shrink-0 lg:border-l lg:border-slate-800/80 lg:pl-8 lg:w-72">
                <div className="space-y-1.5 lg:text-right">
                  <div className="flex lg:justify-end items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase">
                      50% OFF SPECIAL
                    </span>
                    <span className="text-xs text-slate-400 font-mono line-through font-normal">
                      Normal: {propTier.displayOriginalPrice}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono uppercase text-slate-300 font-semibold block">
                    Prop Firm &amp; Mobile Version
                  </span>
                  <div className="flex lg:justify-end items-baseline gap-2">
                    <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                      {propTier.displayPrice}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      (Save 50%)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 block">
                    Current Special Price (Normal: {propTier.displayOriginalPrice}) • Mobile Ready
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block pt-0.5">
                    Personal or self installation included
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(propTier);
                    handlePurchase(propTier);
                  }}
                  className="w-full font-bold bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 text-xs sm:text-sm py-3.5"
                >
                  GET PROP FIRM &amp; MOBILE VERSION
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default EaPricingAndLicensing;
