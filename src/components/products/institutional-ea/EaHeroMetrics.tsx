import { motion } from 'motion/react';
import { Shield, TrendingUp, Activity, CheckCircle, Database, Award, Zap } from 'lucide-react';
import { STOREFRONT_MEDIA } from '../../../constants/media.ts';

interface EaHeroMetricsProps {
  onScrollToPricing: () => void;
  onScrollToSystems: () => void;
  onScrollToStats: () => void;
}

export function EaHeroMetrics({
  onScrollToPricing,
  onScrollToSystems,
  onScrollToStats
}: EaHeroMetricsProps) {
  const metrics = [
    {
      value: '65.0%',
      label: 'Verified Win Rate',
      subtext: 'Robust entry precision across 70 audited trades',
      accent: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/80',
      badge: 'High Precision'
    },
    {
      value: '< 6.00%',
      label: 'Max Drawdown',
      subtext: 'Strict single-digit risk control ceiling',
      accent: 'text-indigo-700 bg-indigo-50/80 border-indigo-200/80',
      badge: 'Ultra-Tight Risk'
    },
    {
      value: '+1,836%',
      label: 'High Growth Profit',
      subtext: 'High Growth Speculator preset return',
      accent: 'text-amber-600 bg-amber-50/80 border-amber-200/80',
      badge: 'Alpha Velocity'
    },
    {
      value: '+398.7%',
      label: 'Balanced Profit',
      subtext: 'Smooth compound trajectory preset',
      accent: 'text-cyan-700 bg-cyan-50/80 border-cyan-200/80',
      badge: 'Compound Engine'
    },
    {
      value: '+126.3%',
      label: 'Preservation Profit',
      subtext: 'Steady low-risk capital expansion',
      accent: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/80',
      badge: 'Capital Guard'
    },
    {
      value: '3.78',
      label: 'Best Profit Factor',
      subtext: '3.58 : 1 average win-to-loss ratio',
      accent: 'text-slate-900 bg-slate-50 border-slate-200',
      badge: 'Asymmetric Edge'
    }
  ];

  return (
    <div className="relative space-y-10">
      {/* Top Protocol Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 font-mono font-black text-xs">
            AL1
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
              <span>INSTITUTIONAL QUANTITATIVE PERFORMANCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                100% REAL TICKS
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Audit Dataset: 01 Jan 2026 – 12 Sep 2026 • Instrument: XAUUSD (Gold) • Timeframe: H1
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onScrollToPricing}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer font-bold"
          >
            Get License
          </button>
          <button
            onClick={onScrollToSystems}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200"
          >
            What Drives the EA
          </button>
          <button
            onClick={onScrollToStats}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200"
          >
            Audited Stats
          </button>
        </div>
      </div>

      {/* Main Title & Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-medium shadow-sm">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>MQL5 NATIVE QUANTITATIVE EXPERT ADVISOR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08]">
            INSTITUTIONAL <br />
            <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
              ADAPTIVE LIQUIDITY PRO 1
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-2xl font-normal leading-relaxed">
            Algorithmic XAUUSD execution built around <span className="font-semibold text-slate-900">liquidity expansion</span>, <span className="font-semibold text-slate-900">breakout structure</span> and <span className="font-semibold text-slate-900">dynamic trade protection</span>. Engineered with high 65% win rate precision, disciplined 6% risk controls, and zero martingale.
          </p>

          {/* Audit Scope Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-slate-50 border border-emerald-200/70 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-800">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>
                <strong className="text-slate-950 font-bold">182,669,622</strong> Real Ticks Audited
              </span>
            </div>
            <div className="text-slate-600">
              8.5-Month Modeling (Jan 1 – Sep 12, 2026)
            </div>
            <div className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>65% Win Rate • 3.78 Profit Factor</span>
            </div>
          </div>
        </div>

        {/* 200x200 Badge Display */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative p-6 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col items-center w-full max-w-xs group">
            <div className="w-[180px] h-[180px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-950 flex items-center justify-center p-1">
              <img
                src={STOREFRONT_MEDIA.flagshipEa.imageUrl}
                alt="Institutional Adaptive Liquidity Pro 1"
                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="w-full mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                MT5 ARCHITECTURE
              </span>
              <span className="text-slate-500">XAUUSD H1</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Large Favourable Metric Cards */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>HEADLINE QUANTITATIVE AUDIT RESULTS (01 JAN – 12 SEP 2026)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {metrics.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`p-4 sm:p-5 rounded-2xl border ${item.accent} shadow-xs flex flex-col justify-between hover:shadow-md transition-all group`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 truncate">
                  {item.badge}
                </span>
                <span className="text-[9px] font-mono text-slate-400">0{idx + 1}</span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-950 group-hover:scale-105 transition-transform origin-left">
                  {item.value}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {item.label}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-sans mt-2 leading-tight pt-2 border-t border-slate-200/50">
                {item.subtext}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
