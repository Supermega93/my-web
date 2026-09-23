import { Calendar, Database, Activity, CheckCircle2, TrendingUp, Clock, Hash } from 'lucide-react';

export function EaAuditMetrics() {
  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
          <Database className="w-3.5 h-3.5 text-emerald-700" />
          <span>VERIFIED QUANTITATIVE AUDIT</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          8.5 Months. 182.7 Million Real Ticks.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          Full execution history audited on MetaTrader 5 using 100% real tick data on XAUUSD (Gold). All three configurations shared the exact same 51.43% win rate across 70 executions with zero trade omission.
        </p>
      </div>

      {/* 4 Large Audit Pillar Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Real Ticks</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            182,669,622
          </div>
          <div className="text-xs text-slate-500 font-sans">
            Every tick modeled with real spread
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Audit Period</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            8.5 Months
          </div>
          <div className="text-xs text-slate-500 font-sans">
            01 Jan 2026 – 12 Sep 2026
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Total Trades</span>
            <Hash className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            70 Trades
          </div>
          <div className="text-xs text-slate-500 font-sans">
            High-selectivity quality execution
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Verified Win Rate</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
            51.43%
          </div>
          <div className="text-xs text-slate-500 font-sans">
            36 Wins / 34 Losses (3.0+ : 1 Payoff)
          </div>
        </div>
      </div>

      {/* Date Timeline Graphic */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-white font-bold">01 JAN 2026</span>
            <span>(Audit Genesis)</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <span>─────────────────────────</span>
            <span className="text-emerald-400 font-bold">255 TRADING DAYS</span>
            <span>─────────────────────────</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-bold">12 SEP 2026</span>
            <span>(Audit Completion)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs font-mono border-t border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-900">
            <span className="text-slate-400 block text-[10px]">INSTRUMENT</span>
            <span className="text-white font-bold">XAUUSD (Gold H1)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900">
            <span className="text-slate-400 block text-[10px]">AVERAGE HOLD TIME</span>
            <span className="text-emerald-400 font-bold">10h 31m per Trade</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900">
            <span className="text-slate-400 block text-[10px]">MAX TEST CONSECUTIVE LOSSES</span>
            <span className="text-white font-bold">7 Trades (Stress Limit)</span>
          </div>
        </div>
      </div>

      {/* Capital Growth Bar Comparison */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h4 className="text-lg font-black text-slate-900 font-mono">
            REPORTED NET PROFIT FROM R100,000 STARTING CAPITAL
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            How the 70 audited trades compounded initial capital under each risk profile.
          </p>
        </div>

        <div className="space-y-5 pt-2">
          {/* Tier 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Tier 1: Prop Firm Preset (1.25% Risk)</span>
              <span className="font-bold text-emerald-700">+126.3% (R226,343.03 Final Balance)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all duration-700" style={{ width: '12%' }} />
            </div>
          </div>

          {/* Tier 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Tier 2: Balanced Preset (2.50% Risk)</span>
              <span className="font-bold text-cyan-800">+398.7% (R498,674.94 Final Balance)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-cyan-600 h-full rounded-full transition-all duration-700" style={{ width: '35%' }} />
            </div>
          </div>

          {/* Tier 3 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Tier 3: High Growth Preset (5.00% Risk)</span>
              <span className="font-bold text-amber-600">+1,836% (R1,936,690.65 Final Balance)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-700" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
