import { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Filter, Eye, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { SAMPLE_AUDIT_TRADES, AuditTrade } from './auditData.ts';

export function EaEquityCurveAndTrades() {
  const [activeTier, setActiveTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const [filterType, setFilterType] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [showAllTrades, setShowAllTrades] = useState<boolean>(false);

  // Simulated representative equity curve points for the 8.5-month audit (70 trades)
  const equityPointsMap = {
    tier1: [
      { trade: 0, balance: 100000, label: '01 Jan (Start)' },
      { trade: 8, balance: 112000, label: 'Trade 8 (12% Target)' },
      { trade: 18, balance: 128500, label: 'Trade 18' },
      { trade: 28, balance: 122000, label: 'Trade 28 (DD Run 9.66%)' },
      { trade: 38, balance: 149000, label: 'Trade 38' },
      { trade: 48, balance: 168000, label: 'Trade 48' },
      { trade: 58, balance: 194000, label: 'Trade 58' },
      { trade: 70, balance: 226343, label: 'Trade 70 (Audit End)' }
    ],
    tier2: [
      { trade: 0, balance: 100000, label: '01 Jan (Start)' },
      { trade: 8, balance: 128000, label: 'Trade 8' },
      { trade: 18, balance: 175000, label: 'Trade 18' },
      { trade: 28, balance: 152000, label: 'Trade 28 (DD Run 13.3%)' },
      { trade: 38, balance: 245000, label: 'Trade 38' },
      { trade: 48, balance: 310000, label: 'Trade 48' },
      { trade: 58, balance: 410000, label: 'Trade 58' },
      { trade: 70, balance: 498675, label: 'Trade 70 (Audit End)' }
    ],
    tier3: [
      { trade: 0, balance: 100000, label: '01 Jan (Start)' },
      { trade: 8, balance: 162000, label: 'Trade 8' },
      { trade: 18, balance: 310000, label: 'Trade 18' },
      { trade: 28, balance: 235000, label: 'Trade 28 (DD Run 24.1%)' },
      { trade: 38, balance: 590000, label: 'Trade 38' },
      { trade: 48, balance: 920000, label: 'Trade 48' },
      { trade: 58, balance: 1450000, label: 'Trade 58' },
      { trade: 70, balance: 1936691, label: 'Trade 70 (Audit End)' }
    ]
  };

  const points = equityPointsMap[activeTier];
  const maxVal = Math.max(...points.map(p => p.balance));
  const minVal = 80000;

  // SVG coordinates: 700 width x 240 height
  const getSvgY = (val: number) => {
    return 220 - ((val - minVal) / (maxVal - minVal)) * 180;
  };
  const getSvgX = (idx: number) => {
    return 40 + (idx / (points.length - 1)) * 620;
  };

  const pathData = points
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i)} ${getSvgY(pt.balance)}`)
    .join(' ');

  const areaData = `${pathData} L ${getSvgX(points.length - 1)} 230 L ${getSvgX(0)} 230 Z`;

  const filteredTrades = SAMPLE_AUDIT_TRADES.filter(t => {
    if (filterType === 'WIN') return t.isWin;
    if (filterType === 'LOSS') return !t.isWin;
    return true;
  });

  const displayedTrades = showAllTrades ? filteredTrades : filteredTrades.slice(0, 5);

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>TRANSPARENT EXECUTION AUDIT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Audited Equity Curve & Trade History
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Examine how the algorithm traversed market expansions, pullbacks, and volatile Gold trend cycles. Select any tier to inspect the equity trajectory and individual execution entries.
          </p>
        </div>

        {/* Tier Switcher for Equity Curve */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTier('tier1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTier === 'tier1'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tier 1 (+126.3%)
          </button>
          <button
            onClick={() => setActiveTier('tier2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTier === 'tier2'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tier 2 (+398.7%)
          </button>
          <button
            onClick={() => setActiveTier('tier3')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTier === 'tier3'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tier 3 (+1,836%)
          </button>
        </div>
      </div>

      {/* Interactive Equity Curve Chart Display */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono text-slate-400">
              AUDITED EQUITY TRAJECTORY (R100k BASELINE)
            </div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">
              R100,000 → R{points[points.length - 1].balance.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Equity High-Water Curve</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-slate-400">Drawdown Recovery Phase</span>
            </div>
          </div>
        </div>

        {/* Responsive SVG Curve */}
        <div className="relative w-full h-[240px] overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <line x1="40" y1="40" x2="660" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="40" y1="100" x2="660" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="40" y1="160" x2="660" y2="160" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="40" y1="220" x2="660" y2="220" stroke="#334155" />

            {/* Area Fill */}
            <path d={areaData} fill="url(#curveGradient)" />

            {/* Curve Path */}
            <path
              d={pathData}
              fill="none"
              stroke="#34d399"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Node Points */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={getSvgX(i)}
                  cy={getSvgY(pt.balance)}
                  r="5"
                  fill="#059669"
                  stroke="#ecfdf5"
                  strokeWidth="2"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Milestone Callouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">STARTING CAPITAL</span>
            <span className="text-white font-bold">R100,000.00</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">PROP TARGET PASSED</span>
            <span className="text-emerald-400 font-bold">Trade 8 (16 Days)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">MAX DRAWDOWN RUN</span>
            <span className="text-amber-400 font-bold">7 Consecutive Losses</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">FINAL BALANCE</span>
            <span className="text-emerald-300 font-bold">R{points[points.length - 1].balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Trade Log Explorer */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-lg font-black text-slate-900 font-mono">
              AUDITED TRADE LOG SAMPLE (70 TOTAL EXECUTIONS)
            </h4>
            <p className="text-xs text-slate-500 font-sans">
              Real executions showing entry, exit, holding duration, and active system filter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Filter:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'WIN', 'LOSS'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    filterType === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Trade #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Entry / Exit</th>
                <th className="py-3 px-4">Hold Time</th>
                <th className="py-3 px-4">Applied System Filter</th>
                <th className="py-3 px-4 text-right">Result ({activeTier.toUpperCase()})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTrades.map((t) => {
                const pnl = activeTier === 'tier1' ? t.pnlTier1 : activeTier === 'tier2' ? t.pnlTier2 : t.pnlTier3;
                return (
                  <tr key={t.tradeNo} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{t.tradeNo}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {t.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        t.type === 'BUY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {t.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {t.entryPrice} → {t.exitPrice}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {t.duration}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-slate-600">
                      {t.systemTrigger}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={t.isWin ? 'text-emerald-700' : 'text-rose-600'}>
                        {pnl}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Showing {displayedTrades.length} of {filteredTrades.length} sample trades ({filteredTrades.length} total in selection)
          </span>

          <button
            onClick={() => setShowAllTrades(!showAllTrades)}
            className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            {showAllTrades ? 'Collapse Trade View ↑' : 'View Full Sample Set (10 Trades) ↓'}
          </button>
        </div>
      </div>
    </div>
  );
}
