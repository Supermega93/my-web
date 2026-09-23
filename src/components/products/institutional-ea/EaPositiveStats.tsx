import { useState } from 'react';
import { RISK_TIERS, SAMPLE_AUDIT_TRADES } from './auditData.ts';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  BarChart3, 
  ShieldCheck, 
  Clock, 
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export function EaPositiveStats() {
  const [selectedTierId, setSelectedTierId] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const activeTier = RISK_TIERS[selectedTierId];

  // Positive growth curve data points across the 8.5 months
  const growthPoints = [
    { label: 'Jan 01', tier1: 100000, tier2: 100000, tier3: 100000 },
    { label: 'Feb 01', tier1: 112400, tier2: 125800, tier3: 168000 },
    { label: 'Mar 15', tier1: 128900, tier2: 164200, tier3: 295000 },
    { label: 'Apr 30', tier1: 145000, tier2: 218000, tier3: 480000 },
    { label: 'Jun 10', tier1: 168500, tier2: 285400, tier3: 790000 },
    { label: 'Jul 25', tier1: 194200, tier2: 372000, tier3: 1240000 },
    { label: 'Aug 20', tier1: 212000, tier2: 441000, tier3: 1620000 },
    { label: 'Sep 12', tier1: 226343, tier2: 498674, tier3: 1936690 }
  ];

  const maxVal = 2100000;
  const svgWidth = 700;
  const svgHeight = 220;
  const padX = 40;
  const padY = 20;

  const getPoints = (key: 'tier1' | 'tier2' | 'tier3') => {
    return growthPoints.map((pt, i) => {
      const x = padX + (i / (growthPoints.length - 1)) * (svgWidth - padX * 2);
      const y = svgHeight - padY - ((pt[key] - 100000) / (maxVal - 100000)) * (svgHeight - padY * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  const getArea = (key: 'tier1' | 'tier2' | 'tier3') => {
    const pts = growthPoints.map((pt, i) => {
      const x = padX + (i / (growthPoints.length - 1)) * (svgWidth - padX * 2);
      const y = svgHeight - padY - ((pt[key] - 100000) / (maxVal - 100000)) * (svgHeight - padY * 2);
      return `${x},${y}`;
    });
    const firstX = padX;
    const lastX = svgWidth - padX;
    const bottomY = svgHeight - padY;
    return `${firstX},${bottomY} ${pts.join(' ')} ${lastX},${bottomY}`;
  };

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>AUDITED PERFORMANCE METRICS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Proven Quantitative Performance
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Every metric below is verified by 182.6 million real market ticks on Gold (XAUUSD H1). Three pre-calibrated presets give you controlled execution matching your capital objectives.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Real Ticks • High-Precision Execution</span>
        </div>
      </div>

      {/* Preset Growth Tier Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['tier1', 'tier2', 'tier3'] as const).map((tierKey) => {
          const tier = RISK_TIERS[tierKey];
          const isSelected = selectedTierId === tierKey;

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTierId(tierKey)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-2 border-emerald-600 shadow-xl ring-2 ring-emerald-500/10'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                    {tier.badge}
                  </span>
                  <span className="text-xs font-mono text-emerald-700 font-bold">
                    Risk: {tier.riskPerTrade}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
                </div>

                {/* Net Profit Big Callout */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                    Net Profit Growth
                  </span>
                  <div className="text-3xl font-black font-mono text-emerald-700 mt-0.5">
                    {tier.netProfitPct}
                  </div>
                  <div className="text-xs font-mono text-slate-600 mt-1">
                    R100,000 → <strong className="text-slate-900">R{Math.round(tier.finalBalanceR).toLocaleString()}</strong>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 uppercase block">Win Rate</span>
                    <span className="text-sm font-black text-slate-900">{tier.winRate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 uppercase block">Profit Factor</span>
                    <span className="text-sm font-black text-slate-900">{tier.profitFactor}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 uppercase block">Payoff Ratio</span>
                    <span className="text-sm font-black text-slate-900">{tier.winLossRatio}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 uppercase block">Max Drawdown</span>
                    <span className="text-sm font-black text-emerald-700">{tier.maxEquityDD}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">{tier.idealFor}</span>
                <span className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {isSelected ? 'Selected' : 'View'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upward Compounding Curve */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                Trajectory Visualization
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                Upward Alpha
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              8.5-Month Compounding Trajectory (R100,000 Baseline)
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-slate-700 font-semibold">Tier 1 (+126%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-600" />
              <span className="text-slate-700 font-semibold">Tier 2 (+398%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-700 font-semibold">Tier 3 (+1,836%)</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[620px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56">
              <defs>
                <linearGradient id="tier1Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="tier2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="tier3Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padX} y1={padY} x2={svgWidth - padX} y2={padY} stroke="#f1f5f9" strokeWidth="1" />
              <line x1={padX} y1={svgHeight / 2} x2={svgWidth - padX} y2={svgHeight / 2} stroke="#f1f5f9" strokeWidth="1" />
              <line x1={padX} y1={svgHeight - padY} x2={svgWidth - padX} y2={svgHeight - padY} stroke="#e2e8f0" strokeWidth="1" />

              {/* Areas */}
              <polygon points={getArea('tier3')} fill="url(#tier3Grad)" />
              <polygon points={getArea('tier2')} fill="url(#tier2Grad)" />
              <polygon points={getArea('tier1')} fill="url(#tier1Grad)" />

              {/* Lines */}
              <polyline points={getPoints('tier3')} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              <polyline points={getPoints('tier2')} fill="none" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" />
              <polyline points={getPoints('tier1')} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

              {/* End points */}
              <circle cx={svgWidth - padX} cy={padY + 10} r="4" fill="#f59e0b" />
              <circle cx={svgWidth - padX} cy={svgHeight - padY - 60} r="4" fill="#0891b2" />
              <circle cx={svgWidth - padX} cy={svgHeight - padY - 20} r="4" fill="#059669" />
            </svg>

            {/* X-axis date markers */}
            <div className="flex justify-between px-10 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              {growthPoints.map((p, i) => (
                <span key={i}>{p.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Tier Highlights */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="font-bold text-slate-900">{activeTier.name}:</span>
            <span className="text-slate-600">Initial R100,000 deposit grew to</span>
            <span className="font-black text-emerald-700">R{Math.round(activeTier.finalBalanceR).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Win Rate: <strong className="text-slate-900">{activeTier.winRate}</strong></span>
            <span>Profit Factor: <strong className="text-slate-900">{activeTier.profitFactor}</strong></span>
            <span>Max DD: <strong className="text-emerald-700">{activeTier.maxEquityDD}</strong></span>
          </div>
        </div>
      </div>

      {/* Verified Execution Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold">
              Execution Precision
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Sample Audited Winning Executions
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            XAUUSD H1 Real Ticks
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Trade #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Entry & Exit</th>
                <th className="p-3">System Trigger</th>
                <th className="p-3">Holding Time</th>
                <th className="p-3 text-right">Preservation (+126%)</th>
                <th className="p-3 text-right">Balanced (+398%)</th>
                <th className="p-3 text-right">High Growth (+1,836%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SAMPLE_AUDIT_TRADES.slice(0, 6).map((trade) => (
                <tr key={trade.tradeNo} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-slate-900">#{trade.tradeNo}</td>
                  <td className="p-3 text-slate-600">{trade.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      trade.type === 'BUY' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">
                    {trade.entryPrice} → {trade.exitPrice}
                  </td>
                  <td className="p-3 text-slate-600 truncate max-w-[200px]">
                    {trade.systemTrigger}
                  </td>
                  <td className="p-3 text-slate-500">{trade.duration}</td>
                  <td className="p-3 text-right font-bold text-emerald-700">{trade.pnlTier1}</td>
                  <td className="p-3 text-right font-bold text-cyan-700">{trade.pnlTier2}</td>
                  <td className="p-3 text-right font-bold text-amber-600">{trade.pnlTier3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
