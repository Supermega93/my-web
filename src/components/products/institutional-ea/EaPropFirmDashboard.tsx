import { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, TrendingUp, Award, Clock } from 'lucide-react';

export function EaPropFirmDashboard() {
  const [selectedRisk, setSelectedRisk] = useState<'1.25' | '2.50' | '5.00'>('1.25');

  const riskData = {
    '1.25': {
      title: 'Tier 1 — Prop Firm Preset (1.25% Risk)',
      netProfit: '+126.34%',
      targetTrade: 'Trade 8 (Day 16)',
      trailingDD: '9.66%',
      maxDailyLoss: '<2.72%',
      startingDD: '0.98%',
      targetPassed: true,
      ddPassed: true,
      dailyPassed: true,
      statusBadge: 'FULL PROP-FIRM COMPLIANT',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    '2.50': {
      title: 'Tier 2 — Balanced Preset (2.50% Risk)',
      netProfit: '+398.67%',
      targetTrade: 'Trade 5 (Day 11)',
      trailingDD: '13.31%',
      maxDailyLoss: '4.85%',
      startingDD: '1.96%',
      targetPassed: true,
      ddPassed: false,
      dailyPassed: true,
      statusBadge: 'EXCEEDS 12% TRAILING DD LIMIT',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    '5.00': {
      title: 'Tier 3 — High Growth Preset (5.00% Risk)',
      netProfit: '+1,836.69%',
      targetTrade: 'Trade 3 (Day 6)',
      trailingDD: '24.07%',
      maxDailyLoss: '8.92%',
      startingDD: '4.25%',
      targetPassed: true,
      ddPassed: false,
      dailyPassed: false,
      statusBadge: 'NOT FOR EVALUATION / PRIVATE ONLY',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    }
  };

  const current = riskData[selectedRisk];

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>STRESS TEST BENCHMARK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            The Prop-Firm Challenge Stress Test
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Tested against the stringent Funding Pips 1-Step Challenge rules (12% Profit Target, 12% Max Trailing Drawdown, 6% Max Daily Drawdown).
          </p>
        </div>

        {/* Interactive Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setSelectedRisk('1.25')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedRisk === '1.25'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1.25% Prop Firm
          </button>
          <button
            onClick={() => setSelectedRisk('2.50')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedRisk === '2.50'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2.50% Balanced
          </button>
          <button
            onClick={() => setSelectedRisk('5.00')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedRisk === '5.00'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5.00% High
          </button>
        </div>
      </div>

      {/* 3 Visual Gauges as requested by Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gauge 1: 12% Trailing DD Limit vs EA Recorded */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 font-bold uppercase">Trailing DD Rule</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">12.00% Limit</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-slate-900">{current.trailingDD}</span>
              <span className={`text-xs font-mono font-bold ${current.ddPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {current.ddPassed ? 'PASSED (2.34% Cushion)' : 'BREACHES 12% CAP'}
              </span>
            </div>
            
            {/* Visual Gauge Bar */}
            <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  current.ddPassed ? 'bg-emerald-600' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (parseFloat(current.trailingDD) / 12) * 100)}%` }}
              />
              <div className="absolute top-0 right-0 h-full w-0.5 bg-slate-400" title="12% Maximum Ceiling" />
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            At 1.25% risk, peak trailing drawdown reached 9.66%, keeping a comfortable 2.34% safety buffer below the 12% challenge threshold.
          </p>
        </div>

        {/* Gauge 2: 6% Max Daily Loss vs EA Recorded */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 font-bold uppercase">Max Daily Loss</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">6.00% Limit</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-slate-900">{current.maxDailyLoss}</span>
              <span className={`text-xs font-mono font-bold ${current.dailyPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {current.dailyPassed ? 'PASSED (<2.72% Max Day)' : 'BREACHES 6% DAILY CAP'}
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  current.dailyPassed ? 'bg-emerald-600' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (parseFloat(current.maxDailyLoss.replace('<', '')) / 6) * 100)}%` }}
              />
              <div className="absolute top-0 right-0 h-full w-0.5 bg-slate-400" title="6% Daily Ceiling" />
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            The worst single trading day accounted for under 2.72% loss, safely below the 6.00% daily limit with zero circuit-breaker violations.
          </p>
        </div>

        {/* Gauge 3: 12% Profit Target vs EA Achieved */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 font-bold uppercase">Target Passing Speed</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">12.00% Target</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-emerald-700">{current.netProfit}</span>
              <span className="text-xs font-mono font-bold text-emerald-800">
                10.5x Over Target
              </span>
            </div>

            {/* Visual Target Bar */}
            <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-full" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-700">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Target Cleared:</span>
            </span>
            <span className="font-bold text-slate-900">{current.targetTrade}</span>
          </div>
        </div>
      </div>

      {/* Audited Stress Test Result Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 font-mono">
              FUNDING PIPS 1-STEP AUDIT STRESS TEST MATRIX
            </h4>
            <div className="text-xs text-slate-500 font-sans">
              Configuration: {current.title} • Starting Capital: R100,000.00
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${current.badgeColor}`}>
            {current.statusBadge}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-5">Challenge Criterion</th>
                <th className="py-3.5 px-5">Rule Limit</th>
                <th className="py-3.5 px-5">EA Realized Stat</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">Profit Target</td>
                <td className="py-4 px-5 font-mono text-slate-600">12.00% (R12,000)</td>
                <td className="py-4 px-5 font-mono font-bold text-emerald-700">+126.34% Net</td>
                <td className="py-4 px-5 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PASSED</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">Passing Velocity</td>
                <td className="py-4 px-5 font-mono text-slate-600">No Time Limit</td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">Target Achieved by Trade 8 (16 Days)</td>
                <td className="py-4 px-5 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PASSED</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">Initial Starting Drawdown</td>
                <td className="py-4 px-5 font-mono text-slate-600">&lt; 12.00% Absolute</td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">0.98% Absolute (R980.42)</td>
                <td className="py-4 px-5 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <span>11.02% BUFFER</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">Max Trailing Drawdown</td>
                <td className="py-4 px-5 font-mono text-slate-600">12.00% Trailing</td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">9.66% Peak Run (R14,043.53)</td>
                <td className="py-4 px-5 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PASSED</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">Max Daily Loss Limit</td>
                <td className="py-4 px-5 font-mono text-slate-600">6.00% Daily Equity</td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">&lt; 2.72% Max Single Day</td>
                <td className="py-4 px-5 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PASSED</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Challenge Analysis Callout */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed font-sans">
          <div className="font-bold text-slate-900 font-mono">
            CHALLENGE INCEPTION ANALYSIS:
          </div>
          <p>
            The greatest psychological and mathematical danger in evaluation challenges occurs at inception. On the R100,000 account, the maximum recorded drop below the initial balance was a mere <strong>R980.42 (0.98%)</strong> on floating equity. The required 12% target was cleared by the <strong>8th trade in just 16 trading days</strong>, avoiding entirely the psychological and mathematical pressures of time-limit evaluations.
          </p>
        </div>
      </div>
    </div>
  );
}
