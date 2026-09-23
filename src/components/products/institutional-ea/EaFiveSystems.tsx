import { useState } from 'react';
import { Layers, Shield, Sliders, RefreshCw, Clock, Play, CheckCircle2, ChevronRight } from 'lucide-react';

export function EaFiveSystems() {
  const [selectedSystem, setSelectedSystem] = useState<number>(0);

  const systems = [
    {
      id: 1,
      num: '01',
      name: 'Trend Structural Gate',
      subtitle: '50 / 150 EMA Alignment Protocol',
      icon: Layers,
      color: 'emerald',
      badge: 'Directional Filter',
      summary: 'Trade entries require strict alignment across the 50-period and 150-period Exponential Moving Averages. Counter-trend signals are purged at the initialization level.',
      technicalSpecs: [
        'Fast Baseline: 50 EMA on H1 chart',
        'Macro Anchor: 150 EMA structural alignment',
        'State Rejection: Any counter-trend tick trigger is immediately dropped before order creation',
        'Chop Filter: Dynamic spread tolerance checks during flat EMA convergence'
      ],
      videoTopic: 'Filter Masterclass 01: Why 90% of EAs fail without dual-period trend gating'
    },
    {
      id: 2,
      num: '02',
      name: 'Directional Breakout Lock (DBLock)',
      subtitle: 'Multi-Week Highs/Lows + ADR Boundaries',
      icon: Sliders,
      color: 'cyan',
      badge: 'Structural Defense',
      summary: 'Incorporates multi-week high/low level tracking and ADR boundary calculations. If market expansion misses ADR windows for 3 consecutive days, opposite trades are hard-locked.',
      technicalSpecs: [
        'Boundary Tracking: Rolling 20-day high and low liquidity pools',
        'ADR Window: 14-period Average Daily Range expansion verification',
        'Hard Lock: 3 consecutive days of sub-ADR compression triggers full trade freeze',
        'Trap Neutralizer: Distinguishes between liquidity grab sweeps and genuine continuation'
      ],
      videoTopic: 'Filter Masterclass 02: DBLock and how to avoid fakeout liquidity traps on Gold'
    },
    {
      id: 3,
      num: '03',
      name: 'Adaptive RSI Exhaustion Guard',
      subtitle: '28-Period Adaptive Momentum Protection',
      icon: Shield,
      color: 'indigo',
      badge: 'Momentum Filter',
      summary: 'This adaptive smoothing model only permits continuation breakouts when momentum is verified, avoiding premature counter-trend execution into parabolic rallies or dumps.',
      technicalSpecs: [
        'Base Metric: 28-period smoothed Relative Strength Index',
        'Exhaustion Thresholds: Asymmetric dynamic bands adapted to Gold volatility',
        'Continuation Lock: Rejects top-picking during strong liquidity-driven momentum',
        'Execution Safety: Purges entries when momentum signals diverge from price trajectory'
      ],
      videoTopic: 'Filter Masterclass 03: The 28-period RSI filter that prevented 14 false tops'
    },
    {
      id: 4,
      num: '04',
      name: 'Profit Recycling & Trailing Defense',
      subtitle: 'Dynamic Follower Orders at >= 2.5:1 R:R',
      icon: RefreshCw,
      color: 'teal',
      badge: 'Payoff Optimization',
      summary: 'Executes a dynamic trailing offset once positive, activating follower orders only when the remaining risk-to-reward ratio meets or exceeds 2.5:1 to harvest runner legs.',
      technicalSpecs: [
        'Break-even Shift: Stop Loss automatically locked into profit at 1.0R gain',
        'Trailing Offset: Dynamic volatility-based trailing cushion',
        'Follower Scaling: Secondary micro-runner activated only when remaining R:R >= 2.5:1',
        'Asymmetry: Delivers verified 3.58:1 average win-to-loss ratio'
      ],
      videoTopic: 'Filter Masterclass 04: Profit recycling math — amplifying 65% win rates into 3.78 profit factors'
    },
    {
      id: 5,
      num: '05',
      name: '12-Hour Stale Trade Liquidation',
      subtitle: 'Systematic Capital Velocity Enforcement',
      icon: Clock,
      color: 'amber',
      badge: 'Exposure Defense',
      summary: 'Any position lingering beyond 12 hours without momentum expansion is systematically liquidated at market, minimizing overnight swap risk and weekend gap exposure.',
      technicalSpecs: [
        'Timer Constraint: Exact 12-hour tick duration monitor',
        'Liquidation Trigger: If price has not crossed 1.2R expansion by hour 12, exit at market',
        'Overnight Defense: Reduces negative swap bleeding and off-session chop',
        'Weekend Gap Immunization: System eliminates trapped positions before Friday market close'
      ],
      videoTopic: 'Filter Masterclass 05: The 12-Hour rule that saved the account during consolidation'
    }
  ];

  const active = systems[selectedSystem];

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold">
            <span>RULE-GOVERNED FRAMEWORK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            What Actually Drives the EA?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Standard retail algorithms rely on static indicators or dangerous averaging/martingale grids. Adaptive Liquidity Pro 1 combines five defensive and execution engineering systems.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
          5 Complementary Systems • Zero Grid • Zero Martingale
        </div>
      </div>

      {/* Interactive System Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: System Selector List */}
        <div className="lg:col-span-5 space-y-3">
          {systems.map((sys, idx) => {
            const Icon = sys.icon;
            const isSelected = selectedSystem === idx;
            return (
              <div
                key={sys.id}
                onClick={() => setSelectedSystem(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600/10'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    {sys.num}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-800 font-bold uppercase">
                        {sys.badge}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {sys.name}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-emerald-700' : 'text-slate-400'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Side: Deep-Dive System Architecture Display */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-emerald-700">
                  SYSTEM // {active.num}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                  {active.badge}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">Institutional Spec</span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {active.name}
              </h3>
              <div className="text-xs font-mono text-slate-500 mt-1 font-semibold">
                {active.subtitle}
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-sans bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {active.summary}
            </p>

            {/* Technical Specifications */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Algorithmic Specifications & Implementation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {active.technicalSpecs.map((spec, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/60 flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Series Connection Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <Play className="w-3 h-3 fill-emerald-400" />
                  <span>Educational Masterclass Series</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {active.videoTopic}
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 font-mono text-[11px] font-bold text-center shrink-0">
                Lesson Video Link
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
