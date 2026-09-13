import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Sliders, 
  Activity, 
  Check, 
  ChevronDown, 
  Layers, 
  Server, 
  FileCode,
  Lock,
  Zap,
  TrendingUp,
  Monitor,
  ShieldCheck,
  Code2,
  Sparkles
} from 'lucide-react';

interface EaProductDetailProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (product: Product, tier?: { id: string; name: string; price: number; currency: string; displayPrice: string }) => void;
  onTriggerBuildMyEa: () => void;
}

interface PricingTier {
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

export function EaProductDetail({
  product,
  onBack,
  onBuyNow,
  onTriggerBuildMyEa,
}: EaProductDetailProps) {
  const { formatPrice: formatCurrencyPrice, currentCurrency } = useCurrency();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const detailsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const pricingTiers: PricingTier[] = [
    {
      id: 'pc',
      name: 'PC Version',
      price: 199,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(199, 'USD'),
      license: 'Standard License: Single user/account',
      features: [
        'Compiled .ex5 binary for MetaTrader 5',
        'Standard License: Single user/account',
        'Forex & XAUUSD optimized set files',
        'Adaptive liquidity & breakout detection',
        'RSI & 50/200 EMA trend filtering',
        '1:5 risk-to-reward & trailing stop controls',
        'Lifetime license for licensed version'
      ]
    },
    {
      id: 'propfirm',
      name: 'Professional/Propfirm Version',
      price: 249,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(249, 'USD'),
      license: 'Professional License: Full professional feature set',
      badge: 'RECOMMENDED FOR PROP FIRMS',
      popular: true,
      features: [
        'All PC Version features included',
        'Professional License: Full professional feature set',
        'Dedicated Prop-Firm risk controls & equity protection',
        'Daily risk and loss limit enforcement',
        'Trading-session & profit-recycling controls',
        'ADR/ATR dynamic volatility filtering',
        'Lifetime access + future marketplace updates'
      ]
    },
    {
      id: 'source_code',
      name: 'With Source Code',
      price: 349,
      currency: 'USD',
      displayPrice: formatCurrencyPrice(349, 'USD'),
      license: 'Multi-Account License + Full MQL5 Source Code',
      badge: 'COMPLETE DEVELOPER ACCESS',
      features: [
        'Complete editable MQL5 (.mq5) source code',
        'Multi-Account License for multiple trading terminals',
        'Full algorithmic transparency & modular architecture',
        'Customizable EA parameters & logic adaptation',
        'Backtesting & multi-asset optimization framework',
        'All future update blueprints & documentation'
      ]
    }
  ];

  const [selectedTier, setSelectedTier] = useState<PricingTier>(pricingTiers[1]);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const coreFeatures = [
    { title: 'Adaptive liquidity-based trading logic', desc: 'Identifies institutional liquidity pools, stop-loss clusters, and resting orders.' },
    { title: 'Breakout and fake-breakout detection', desc: 'Distinguishes between valid momentum expansions and liquidity sweep traps.' },
    { title: 'RSI extreme filtering & directional trade blocking', desc: 'Prevents counter-trend buying at exhaustion tops and selling into market bottoms.' },
    { title: '50/200 EMA trend-alignment filtering', desc: 'Ensures higher-timeframe market structure and macro trend synergy.' },
    { title: '50 EMA reversal/adoption logic', desc: 'Detects structural trend transitions and dynamic dynamic re-entry confirmations.' },
    { title: 'ADR/ATR volatility filtering', desc: 'Calculates Average Daily Range and ATR expansion to avoid choppy, dead sessions.' },
    { title: 'Dynamic risk management', desc: 'Computes precision position sizing based on real-time account balance and stop distance.' },
    { title: 'Configurable risk per trade', desc: 'Customizable percentage-based or cash-based risk parameters per execution.' },
    { title: 'Stop Loss & Take Profit management', desc: 'Predetermined brackets placed instantly upon order fill for total capital defense.' },
    { title: '1:5 risk-to-reward framework', desc: 'Asymmetric target structuring designed to maximize edge and expectancies.' },
    { title: 'Break-even and trailing-stop management', desc: 'Locks in gains and secures risk-free trades once predetermined thresholds are met.' },
    { title: 'Trading-session controls', desc: 'Configurable trading windows targeting high-liquidity London and New York overlaps.' },
    { title: 'Profit-recycling functionality', desc: 'Secures runner positions and reinvests locked gains systematically.' },
    { title: 'Prop-firm risk controls', desc: 'Compliant risk rules designed specifically to satisfy strict evaluation challenges.' },
    { title: 'Daily risk/loss controls', desc: 'Automated circuit-breakers halt execution when daily loss caps are approached.' },
    { title: 'Market-specific configuration presets', desc: 'Pre-calibrated parameter files for Forex pairs and XAUUSD.' },
    { title: 'Backtesting and optimisation support', desc: 'Optimized MQL5 code architecture for fast 99.9% tick data model passes.' },
    { title: 'Customisable EA parameters', desc: 'Extensive user input settings allowing fine-tuning to individual trading styles.' }
  ];

  const marketplaceFeatures = [
    { title: 'Standard License', desc: 'Single user/account access for personal live or demo execution.' },
    { title: 'Professional License', desc: 'Full professional feature set with prop-firm risk controls and volatility guards.' },
    { title: 'Multi-Account License', desc: 'Engineered for fund managers and traders operating across multiple accounts simultaneously.' },
    { title: 'Lifetime License', desc: 'One-time purchase for permanent access to the licensed system version.' },
    { title: 'Future Upgrade/Update Options', desc: 'Streamlined update pathway managed centrally via the marketplace licensing infrastructure.' }
  ];

  const faqs = [
    {
      q: 'Which MetaTrader platform is supported?',
      a: 'Adaptive Liquidity Pro is built natively for MetaTrader 5 (MT5) on Windows/PC.'
    },
    {
      q: 'Which markets can I trade?',
      a: 'The system is pre-configured for Forex pairs and XAUUSD (Gold), and is fully configurable for different symbols and market conditions.'
    },
    {
      q: 'Can I use this on Prop Firm challenge accounts?',
      a: 'Yes. The Professional/Propfirm Version includes dedicated prop-firm risk controls, daily loss limit safeguards, and dynamic risk per trade.'
    },
    {
      q: 'Is full source code available?',
      a: 'Yes. The With Source Code tier ($349) grants you complete access to the editable MQL5 (.mq5) source code alongside a multi-account license.'
    },
    {
      q: 'How does marketplace licensing and verification work?',
      a: 'The system is designed as a commercial MT5 Expert Advisor. Marketplace integration allows licensing, purchase verification, and controlled access to be managed centrally.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden font-sans">
      {/* Ambient background glows matching homepage */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-emerald-600/10 via-teal-500/5 to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/8 via-teal-400/5 to-transparent blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Technical grid overlay matching homepage */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f040_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f040_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-0" 
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 space-y-24">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL TRADING SYSTEMS</span>
        </button>

        {/* 1. HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Professional Trading System • MetaTrader 5</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Adaptive Liquidity Pro V1.0
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Adaptive Liquidity Pro is a professional automated trading system developed for MetaTrader 5 (MT5). It is designed to automate structured trading strategies using liquidity, market structure, momentum, volatility, trend alignment and risk-management conditions.
            </p>

            {/* Selected Tier Banner & Quick CTA */}
            <div className="pt-2 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-emerald-700 uppercase font-semibold">
                    Current Selection: {selectedTier.name}
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono flex items-baseline gap-2">
                    {selectedTier.displayPrice}
                    <span className="text-xs font-normal text-slate-500 font-sans">
                      {currentCurrency.code} • {selectedTier.license}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handlePurchase(selectedTier)}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="font-bold shadow-lg shadow-emerald-900/15 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white hover:opacity-95"
                  >
                    Buy {selectedTier.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={scrollToPricing}
                  >
                    View All Tiers
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Media Display: Exact 200x200 Badge with light theme showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            <div className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col items-center justify-center w-full max-w-sm group">
              {/* Soft glow behind the badge */}
              <div className="absolute -inset-2 bg-emerald-500/10 rounded-3xl blur-2xl -z-10 group-hover:bg-emerald-500/20 transition-all" />

              {/* Exact 200x200 Square Badge */}
              <div className="w-[200px] h-[200px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 flex items-center justify-center">
                <img
                  src={product.image_url || STOREFRONT_MEDIA.flagshipEa.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-[200px] h-[200px] aspect-square object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="w-full mt-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  STABLE V1.0 BUILD
                </span>
                <span className="text-slate-500">MT5 (PC/Windows)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2. SUPPORTED PLATFORM SECTION */}
        <div className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              Deployment Environment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Supported Platform & Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-emerald-800 uppercase font-semibold">Platform</span>
              <h4 className="text-base font-bold text-slate-900">MetaTrader 5 (MT5)</h4>
              <p className="text-xs text-slate-600">Engineered natively in MQL5 with asynchronous order execution.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2">
                <Monitor className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-cyan-800 uppercase font-semibold">Operating System</span>
              <h4 className="text-base font-bold text-slate-900">Windows / PC</h4>
              <p className="text-xs text-slate-600">Compatible with Windows desktop, laptop, and 24/5 cloud VPS terminals.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-teal-800 uppercase font-semibold">Instruments</span>
              <h4 className="text-base font-bold text-slate-900">Forex & XAUUSD</h4>
              <p className="text-xs text-slate-600">Targeting high-volume major currency pairs and Gold with optimized presets.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-indigo-800 uppercase font-semibold">Adaptability</span>
              <h4 className="text-base font-bold text-slate-900">Configurable Presets</h4>
              <p className="text-xs text-slate-600">Flexible parameter inputs adaptable for different symbols and market conditions.</p>
            </div>
          </div>
        </div>

        {/* 3. CURRENT PRICING SECTION (Transparent Tier Comparison) */}
        <div ref={pricingRef} className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
                Transparent Licensing
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Choose Your Adaptive Liquidity Pro Edition
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Choose the edition that fits your workflow. From ready-to-trade compiled MT5 builds to full MQL5 source code access.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>One-Time Fee • No Monthly Subscriptions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier) => {
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
                      <span>{tier.badge || 'RECOMMENDED'}</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                      <div className="text-xs text-emerald-700 font-mono mt-1 font-semibold">{tier.license}</div>
                    </div>

                    <div className="pt-2">
                      <div className="text-4xl font-black text-slate-900 font-mono">
                        {tier.displayPrice}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-1">
                        {currentCurrency.code} • One-time purchase • Lifetime
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
        </div>

        {/* 4. CORE FEATURES SECTION (All 18 Specifications) */}
        <div ref={detailsRef} className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              Comprehensive Feature Set
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Core Features & Trading Logic
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Engineered with 18 specialized modules spanning structural liquidity sweeps, volatility filters, dynamic risk enforcement, and execution controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-600/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>MOD // {String(idx + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. MARKETPLACE INTEGRATION & LICENSING (Phase 2 Architecture) */}
        <div className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              Marketplace Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Centralized Licensing & Access Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              The system is designed as a commercial MT5 Expert Advisor. Our marketplace integration allows licensing, purchase verification, and controlled access to be managed centrally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceFeatures.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2"
              >
                <div className="flex items-center gap-2 text-cyan-700 font-mono text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Central Verification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hardware-bound terminal authentication, automated key provisioning, and active license status tracking.
              </p>
            </div>
          </div>
        </div>

        {/* 6. FREQUENTLY ASKED QUESTIONS */}
        <div className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              Product Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 max-w-4xl">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. MANDATORY DISCLAIMER */}
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-800 font-semibold font-mono text-[11px] uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Trading Risk Disclosure & Disclaimer</span>
          </div>
          <p>
            Past performance and backtests do not guarantee future results. Automated trading and financial instrument trading carry substantial risk of loss and are not suitable for every investor. Never risk capital you cannot afford to lose. All materials provided on EA Automation Hub are strictly for educational and algorithmic research purposes.
          </p>
        </div>

        {/* 8. BOTTOM BUY BAR */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-slate-900">Adaptive Liquidity Pro V1.0</div>
            <div className="text-xs text-slate-500 mt-1">
              Selected: <span className="text-emerald-700 font-semibold">{selectedTier.name} ({selectedTier.displayPrice})</span> • Instant download with centralized license provisioning
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => handlePurchase(selectedTier)}
            icon={<ArrowRight className="w-4 h-4" />}
            className="font-bold shadow-lg shadow-emerald-900/15 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white shrink-0 hover:opacity-95"
          >
            Buy Now — {selectedTier.displayPrice}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EaProductDetail;
