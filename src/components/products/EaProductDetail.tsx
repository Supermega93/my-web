import { useRef } from 'react';
import { Product } from '../../types.ts';
import { 
  ArrowLeft, 
  ShieldAlert
} from 'lucide-react';
import { EaHeroMetrics } from './institutional-ea/EaHeroMetrics.tsx';
import { EaPricingAndLicensing } from './institutional-ea/EaPricingAndLicensing.tsx';
import { EaFiveSystems } from './institutional-ea/EaFiveSystems.tsx';
import { EaPositiveStats } from './institutional-ea/EaPositiveStats.tsx';
import { EaCapitalAllocationGuide } from './institutional-ea/EaCapitalAllocationGuide.tsx';
import { EaFaq } from './institutional-ea/EaFaq.tsx';

interface EaProductDetailProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (product: Product, tier?: { id: string; name: string; price: number; currency: string; displayPrice: string }) => void;
  onTriggerBuildMyEa: () => void;
}

export function EaProductDetail({
  product,
  onBack,
  onBuyNow,
  onTriggerBuildMyEa,
}: EaProductDetailProps) {
  const pricingRef = useRef<HTMLDivElement>(null);
  const systemsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToSystems = () => systemsRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToStats = () => statsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-emerald-600/10 via-teal-500/5 to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/8 via-teal-400/5 to-transparent blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Technical grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f040_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f040_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-0" 
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 space-y-16">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL TRADING SYSTEMS</span>
        </button>

        {/* 1. HERO — HEADLINE QUANTITATIVE RESULTS (Win Rate: 65%, Drawdown: 6%) */}
        <EaHeroMetrics
          onScrollToPricing={scrollToPricing}
          onScrollToSystems={scrollToSystems}
          onScrollToStats={scrollToStats}
        />

        {/* 2. PRICING ABOVE ALL THE INFORMATION AND STATS */}
        <div ref={pricingRef}>
          <EaPricingAndLicensing
            product={product}
            pricingRef={pricingRef}
            onBuyNow={onBuyNow}
          />
        </div>

        {/* 3. THE INFORMATION STARTS WITH WHAT ACTUALLY DRIVES THE EA */}
        <div ref={systemsRef}>
          <EaFiveSystems />
        </div>

        {/* 4. POSITIVE STATS ONLY */}
        <div ref={statsRef}>
          <EaPositiveStats />
        </div>

        {/* 5. CAPITAL ALLOCATION GUIDE BY DEPLOYMENT OBJECTIVE */}
        <EaCapitalAllocationGuide />

        {/* 6. FAQS — STRATEGY LOGIC, SETUP REQUIREMENTS & INSTALLATION SUPPORT */}
        <EaFaq />

        {/* 7. MANDATORY BOTTOM DISCLAIMER (PAST PERFORMANCE DOES NOT DETERMINE FUTURE PROFITS) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-slate-300 border border-slate-800 shadow-md space-y-2.5 text-xs leading-relaxed font-sans">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono text-[11px] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>DISCLAIMER & RISK DISCLOSURE</span>
          </div>
          <p className="text-slate-200 font-medium">
            Past performance and backtest modeling are not indicative of and do not guarantee or determine future profits. Trading financial markets, foreign exchange, and leveraged commodities involves substantial risk of loss and is not suitable for all investors.
          </p>
          <p className="text-slate-400">
            All figures, statistics, and audit metrics presented here are derived from quantitative MT5 Strategy Tester modeling using 100% real tick execution data (01 Jan 2026 – 12 Sep 2026) for analytical and educational evaluation. No representation or guarantee is made that any trading account will achieve profits or avoid losses similar to those illustrated.
          </p>
          <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800">
            Data Source: Audited 100% real tick execution dataset (01 Jan 2026 – 12 Sep 2026) • Strategy: INSTITUTIONAL Adaptive Liquidity Pro 1
          </div>
        </div>
      </div>
    </div>
  );
}

export default EaProductDetail;
