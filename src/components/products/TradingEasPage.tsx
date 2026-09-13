import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Product, ActiveView } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { 
  ArrowRight, 
  Cpu, 
  Check, 
  ShieldAlert, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface TradingEasPageProps {
  products: Product[];
  onNavigate: (view: ActiveView, productId?: string) => void;
  onBuyNow: (product: Product) => void;
  onTriggerBuildMyEa: () => void;
}

export function TradingEasPage({
  products,
  onNavigate,
  onBuyNow,
  onTriggerBuildMyEa,
}: TradingEasPageProps) {
  const [platformFilter, setPlatformFilter] = useState<'all' | 'mt5' | 'prop'>('all');
  const catalogRef = useRef<HTMLDivElement>(null);

  const eaProducts = products.filter(p => p.type === 'ea' && p.active === 1);
  const featuredEa = eaProducts.find(p => p.id === 'prod_ea_adaptive_liquidity') || eaProducts[0];
  const otherEas = eaProducts.filter(p => p.id !== featuredEa?.id);

  const formatPrice = (price: number, currency: string = 'USD') => {
    return `$${price.toFixed(2)}`;
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans">
      {/* Ambience glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono tracking-wider uppercase font-semibold">
            <Cpu className="w-3.5 h-3.5 text-emerald-700" />
            <span>MQL5 Quantitative Architecture</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800">EAs</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Professional automation built for systematic trading.
          </p>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToCatalog}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore EAs</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* 2. FEATURED FLAGSHIP EA SECTION: Adaptive Liquidity Pro V1.0 */}
      {featuredEa && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Product Visual Showcase: Exact 200x200 badge with 8px border radius and strict 1:1 square aspect ratio */}
              <div className="lg:col-span-5 relative bg-slate-50 min-h-[340px] flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-slate-200 group">
                <div className="relative">
                  {/* Soft depth glow behind badge */}
                  <div className="absolute -inset-2 bg-emerald-500/10 rounded-xl blur-xl -z-10 group-hover:bg-emerald-500/20 transition-all" />
                  
                  {/* Exact 200x200 Square Badge with 8px rounded corners (rounded-lg) */}
                  <div className="w-[200px] h-[200px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white flex items-center justify-center">
                    <img
                      src={STOREFRONT_MEDIA.flagshipEa.imageUrl}
                      alt="Adaptive Liquidity Pro V1.0 MT5 Badge"
                      referrerPolicy="no-referrer"
                      className="w-[200px] h-[200px] aspect-square object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="mt-6 text-center space-y-1">
                  <div className="text-[11px] font-mono text-emerald-800 uppercase tracking-widest font-bold">
                    FLAGSHIP ALGORITHMIC SYSTEM
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    MetaTrader 5 Native (MQL5)
                  </div>
                </div>
              </div>

              {/* Concise Description & Key Features */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                      Smart Money Liquidity
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Prop Firm & Live Accounts
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {featuredEa.name}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {featuredEa.short_description || 'Institutional liquidity sweep and order flow EA for MetaTrader 5 with strict risk control.'}
                  </p>
                </div>

                {/* Key Features (Short bullet format) */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Algorithmic liquidity sweeps & institutional order flow imbalance</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dynamic ATR volatility stop loss & trailing break-even filters</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Martingale, Zero Grid, strict prop firm drawdown controls</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Immediate digital delivery with lifetime updates & set files</span>
                  </div>
                </div>

                {/* Pricing & Dual CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-3xl font-black text-slate-900 font-mono">
                      {formatPrice(featuredEa.price, featuredEa.currency)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">Instant digital download • {featuredEa.currency || 'USD'}</div>
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

      {/* 3. CATALOGUE SHOWCASE OF ALL AVAILABLE EAs */}
      <section ref={catalogRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Systematic Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              All Available Trading Systems
            </h2>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                platformFilter === 'all'
                  ? 'bg-white text-emerald-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Systems
            </button>
            <button
              onClick={() => setPlatformFilter('mt5')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                platformFilter === 'mt5'
                  ? 'bg-white text-emerald-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              MetaTrader 5
            </button>
            <button
              onClick={() => setPlatformFilter('prop')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                platformFilter === 'prop'
                  ? 'bg-white text-emerald-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Prop Firm Ready
            </button>
          </div>
        </div>

        {/* EAs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eaProducts.map((ea) => (
            <motion.div
              key={ea.id}
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all shadow-md hover:shadow-xl flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-200 p-3">
                  <div className="w-36 h-36 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white flex items-center justify-center">
                    <img
                      src={ea.image_url || STOREFRONT_MEDIA.flagshipEa.imageUrl}
                      alt={ea.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full aspect-square object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-emerald-800 shadow-xs">
                    {ea.platform || 'MetaTrader 5'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {ea.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                    {ea.short_description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-slate-900 font-mono">
                    {formatPrice(ea.price, ea.currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">{ea.currency || 'USD'} (Lifetime)</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('ea-detail', ea.id)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onBuyNow(ea)}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CUSTOM EA BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Need a Custom EA Programmed to Your Rules?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl font-normal">
              Our quantitative developers program proprietary MQL5 systems with custom entry models, risk protocols, and VPS optimization.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onTriggerBuildMyEa}
            icon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 font-bold"
          >
            Build My EA
          </Button>
        </div>
      </section>
    </div>
  );
}

export default TradingEasPage;
