import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, Zap, Check, AlertTriangle, ArrowRight, Activity, Percent } from 'lucide-react';
import { RISK_TIERS, RiskTierData } from './auditData.ts';

interface EaRiskProfilesProps {
  onSelectTierForCheckout?: (tierId: 'tier1' | 'tier2' | 'tier3') => void;
  onScrollToPropFirm: () => void;
}

export function EaRiskProfiles({ onScrollToPropFirm }: EaRiskProfilesProps) {
  const [activeTab, setActiveTab] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
            <span>AUDITED CONFIGURATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Choose Your Risk Profile
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            The algorithm dynamically scales lot sizing based on active equity. Three distinct institutional configurations were subjected to the 182.6M real-tick audit benchmark.
          </p>
        </div>

        <button
          onClick={onScrollToPropFirm}
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-800 hover:text-emerald-950 font-bold bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:border-emerald-300 transition-all cursor-pointer shrink-0"
        >
          <span>View Prop-Firm Stress Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Large Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* TIER 1: PROP FIRM */}
        <div 
          onClick={() => setActiveTab('tier1')}
          className={`rounded-3xl p-7 transition-all duration-300 relative flex flex-col justify-between cursor-pointer border-2 ${
            activeTab === 'tier1'
              ? 'bg-white border-emerald-600 shadow-xl ring-2 ring-emerald-600/10'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>PROP FIRM PRESET</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                1.25% / Trade
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Capital Preservation</h3>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Optimized for evaluation challenges and strict institutional drawdown mandates.
              </p>
            </div>

            {/* Visual Progression */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Starting Balance</span>
                <span className="font-bold text-slate-900">R100,000.00</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[44%]" />
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span>Audited Ending</span>
                  <span className="text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">+126.3%</span>
                </span>
                <span className="text-base font-black text-slate-900 font-mono">R226,343.03</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Max Equity DD</div>
                <div className="text-lg font-black font-mono text-emerald-700">9.66%</div>
                <div className="text-[10px] text-slate-500 font-mono">R14,043 peak drop</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Profit Factor</div>
                <div className="text-lg font-black font-mono text-slate-900">3.78</div>
                <div className="text-[10px] text-slate-500 font-mono">Highest Efficiency</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Sharpe Ratio</div>
                <div className="text-lg font-black font-mono text-slate-900">11.31</div>
                <div className="text-[10px] text-slate-500 font-mono">Maximum Stability</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Avg Payoff</div>
                <div className="text-lg font-black font-mono text-slate-900">3.58 : 1</div>
                <div className="text-[10px] text-slate-500 font-mono">Win/Loss Ratio</div>
              </div>
            </div>

            {/* Prop Firm Stress Test Callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
              <div className="font-mono font-bold text-emerald-900 flex items-center justify-between">
                <span>Funding Pips 1-Step Target</span>
                <span className="text-emerald-700 font-black">Trade 8</span>
              </div>
              <div className="space-y-1 text-slate-600 font-sans text-[11px]">
                <div className="flex justify-between">
                  <span>12% Profit Target:</span>
                  <span className="font-bold text-slate-900">Achieved in 16 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Trailing DD (12% limit):</span>
                  <span className="font-bold text-emerald-700">9.66% recorded</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Loss (6% limit):</span>
                  <span className="font-bold text-emerald-700">&lt;2.72% max day</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100">
            <span className="text-[11px] font-mono text-slate-500 block">
              Ideal for: Prop Firm Candidates & Fund Managers ($50k–$500k)
            </span>
          </div>
        </div>

        {/* TIER 2: BALANCED GROWTH */}
        <div 
          onClick={() => setActiveTab('tier2')}
          className={`rounded-3xl p-7 transition-all duration-300 relative flex flex-col justify-between cursor-pointer border-2 ${
            activeTab === 'tier2'
              ? 'bg-white border-cyan-600 shadow-xl ring-2 ring-cyan-600/10'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-700" />
                <span>BALANCED GROWTH</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                2.50% / Trade
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">The Sharpe Sweet Spot</h3>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Optimized mathematical equilibrium between return curve velocity and drawdown comfort.
              </p>
            </div>

            {/* Visual Progression */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Starting Balance</span>
                <span className="font-bold text-slate-900">R100,000.00</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-600 h-full rounded-full w-[65%]" />
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-800 font-bold flex items-center gap-1">
                  <span>Audited Ending</span>
                  <span className="text-[10px] bg-cyan-100 px-1.5 py-0.2 rounded">+398.7%</span>
                </span>
                <span className="text-base font-black text-slate-900 font-mono">R498,674.94</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Max Equity DD</div>
                <div className="text-lg font-black font-mono text-slate-900">13.31%</div>
                <div className="text-[10px] text-slate-500 font-mono">R54,074 peak drop</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Profit Factor</div>
                <div className="text-lg font-black font-mono text-slate-900">3.43</div>
                <div className="text-[10px] text-slate-500 font-mono">Robust Compounder</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Sharpe Ratio</div>
                <div className="text-lg font-black font-mono text-cyan-800">11.05</div>
                <div className="text-[10px] text-slate-500 font-mono">Exceptional Balance</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Recovery Factor</div>
                <div className="text-lg font-black font-mono text-slate-900">7.37</div>
                <div className="text-[10px] text-slate-500 font-mono">Linear R²: 0.95</div>
              </div>
            </div>

            {/* Descriptive Insight */}
            <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200 space-y-2 text-xs">
              <div className="font-mono font-bold text-cyan-900">
                Quant Audit Verdict
              </div>
              <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                Represents the recommended baseline for personal live capital. Provides a 4x account expansion over 8.5 months with controlled 13.3% maximal floating drawdown.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100">
            <span className="text-[11px] font-mono text-slate-500 block">
              Ideal for: Private Portfolio Builders ($10k–$100k Accounts)
            </span>
          </div>
        </div>

        {/* TIER 3: HIGH GROWTH */}
        <div 
          onClick={() => setActiveTab('tier3')}
          className={`rounded-3xl p-7 transition-all duration-300 relative flex flex-col justify-between cursor-pointer border-2 ${
            activeTab === 'tier3'
              ? 'bg-slate-950 text-white border-amber-500 shadow-2xl ring-2 ring-amber-500/20'
              : 'bg-slate-950 text-white border-slate-800 hover:border-slate-700 shadow-lg'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>HIGH GROWTH ALPHA</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                5.00% / Trade
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Aggressive Alpha</h3>
              <p className="text-xs text-amber-300/80 font-mono mt-1 font-bold">
                HIGHER RETURN. HIGHER DRAWDOWN.
              </p>
            </div>

            {/* Visual Progression */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Starting Balance</span>
                <span className="font-bold text-white">R100,000.00</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full w-[95%]" />
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span>Audited Ending</span>
                  <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded">+1,836%</span>
                </span>
                <span className="text-base font-black text-amber-300 font-mono">R1,936,690.65</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Max Equity DD</div>
                <div className="text-lg font-black font-mono text-amber-400">24.07%</div>
                <div className="text-[10px] text-slate-500 font-mono">R320,908 peak drop</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Profit Factor</div>
                <div className="text-lg font-black font-mono text-white">3.13</div>
                <div className="text-[10px] text-slate-500 font-mono">18x Multiple</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Sharpe Ratio</div>
                <div className="text-lg font-black font-mono text-white">10.60</div>
                <div className="text-[10px] text-slate-500 font-mono">High Compound</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Linear R²</div>
                <div className="text-lg font-black font-mono text-white">0.90</div>
                <div className="text-[10px] text-slate-500 font-mono">Recovery: 5.72</div>
              </div>
            </div>

            {/* High-Risk Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2 text-xs">
              <div className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Capital Acceleration Warning</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                Designed exclusively for isolated sub-accounts where rapid compounding takes precedence over drawdown restraint. Users must routinely withdraw initial capital.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block">
              Ideal for: High-Alpha Speculators (Isolated Sub-Accounts)
            </span>
          </div>
        </div>
      </div>

      {/* Maximum Equity Drawdown Gauge & Bar Comparison */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-lg font-black text-slate-900 font-mono">
              MAXIMUM EQUITY DRAWDOWN COMPARISON
            </h4>
            <p className="text-xs text-slate-500 font-sans">
              Peak floating equity drop recorded on the 100,000 baseline across 182,669,622 ticks.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Audited Benchmark Range: 9.66% – 24.07%
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Tier 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Tier 1 / Prop Firm (1.25% Risk)</span>
              <span className="font-bold text-emerald-700">9.66% Max DD (R14,043.53)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all duration-700" style={{ width: '9.66%' }} />
            </div>
          </div>

          {/* Tier 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Tier 2 / Balanced (2.50% Risk)</span>
              <span className="font-bold text-cyan-800">13.31% Max DD (R54,074.86)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-cyan-600 h-full rounded-full transition-all duration-700" style={{ width: '13.31%' }} />
            </div>
          </div>

          {/* Tier 3 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Tier 3 / High Growth (5.00% Risk)</span>
              <span className="font-bold text-amber-600">24.07% Max DD (R320,908.52)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: '24.07%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
