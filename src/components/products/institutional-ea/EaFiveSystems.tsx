import { useState } from 'react';
import { 
  Layers, 
  Shield, 
  Sliders, 
  RefreshCw, 
  Clock, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Info,
  Activity,
  ShieldCheck,
  Cpu,
  Bell
} from 'lucide-react';

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
      videoTopic: 'Directional Breakout lock filter',
      videoTitle: 'Directional Breakout lock filter',
      youtubeId: 'yOpYQsrIQ4k',
      videoExplanation: 'A breakout strategy without this is just betting that every level breaks. The Directional Lock is what stops the EA from selling into demand or buying into supply just because a candle closed the "right" way — it waits for the market to prove the level is actually gone before it lets a trade back into that side.\n\nThis isn\'t a filter that avoids trades. It\'s a filter that avoids the wrong trades — at the exact moments they\'re most tempting to take.'
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
      videoTopic: 'Directional Breakout lock filter',
      videoTitle: 'Directional Breakout lock filter',
      youtubeId: 'yOpYQsrIQ4k',
      videoExplanation: 'A breakout strategy without this is just betting that every level breaks. The Directional Lock is what stops the EA from selling into demand or buying into supply just because a candle closed the "right" way — it waits for the market to prove the level is actually gone before it lets a trade back into that side.\n\nThis isn\'t a filter that avoids trades. It\'s a filter that avoids the wrong trades — at the exact moments they\'re most tempting to take.'
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
      videoTopic: 'RSI Adaptive Trend Filter',
      videoTitle: 'RSI Adaptive Trend Filter',
      youtubeId: 'r4LIYttuywA',
      videoExplanation: 'The Adaptive RSI Trend Filter is a daily safety check built into the Adaptive Liquidity Pro EA. Every day, it looks at yesterday\'s H1 RSI reading. If RSI closed overbought, new Buy breakouts are blocked for the day. If RSI closed oversold, new Sell breakouts are blocked instead. This stops the EA from chasing a breakout right into an exhausted move.\n\nA block can run for up to 2 calendar days before it\'s forced into a one-day cool-off, so the filter can never lock out a direction indefinitely. It can also end early if price makes a clean structural break — closing back through the prior day\'s high/low or the xx EMA — a sign the exhaustion has already resolved. A supporting moving-average filter adds one more layer: even when RSI is extreme, the block only holds if price is genuinely aligned with that extreme on the xx/xxx EMA.\n\nThis filter runs independently of the EA\'s Directional Breakout Lock, which covers longer, structural reversals off the weekly high/low. Together, they give the EA two separate lines of defense — one for short-term RSI exhaustion, one for weekly-level reversals — so it isn\'t buying tops or selling bottoms in either timeframe.'
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
      videoTopic: 'Profit Recycling Filter',
      videoTitle: 'Profit Recycling Filter',
      youtubeId: 'TAlPjy00VEk',
      videoExplanation: 'How it works: once a trade\'s stop loss has been moved to breakeven — meaning that position can no longer lose money — the EA checks if the account is currently sitting on more equity than balance. If there\'s genuine floating profit cushioning the account, and price has pushed a further buffer distance past breakeven (so it isn\'t stacking into a shallow pullback), it opens a second "Follower" trade in the same direction, sized fresh, with its own stop. One follower per master. No follower gets added if the remaining reward-to-risk on that level no longer justifies it, or if the trading window\'s about to close.\n\nWhen it matters most: the difference between a trade that clips a small target and a trade that actually rides a trend. The first entry proves the level is right and removes its own risk. The recycling engine only steps in after that\'s already true — using the market\'s own confirmation as the trigger to compound.\n\nWhy it\'s important: compounding size into a winner is how trending moves get fully captured — but only if it\'s done with money the market has already handed back, not fresh capital gambled on hope. This is the EA scaling in the way a disciplined trader scales in: never before the trade has proven itself, never past the point where the risk still makes sense.\n\nIt doesn\'t chase size. It earns the right to add it.'
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
      ]
    },
    {
      id: 6,
      num: '06',
      name: 'Dynamic Volatility Engine',
      subtitle: 'Daily ADR-Based Stop & Target Calibration',
      icon: Activity,
      color: 'rose',
      badge: 'Risk Filter',
      summary: 'This adaptive risk model rebuilds every trade\'s stop loss and take profit from the market\'s own measured volatility each session — never from a static pip value left over from a different regime.',
      technicalSpecs: [
        'Base Metric: Rolling multi-day Average Daily Range, recalculated at every session open',
        'Stop Construction: ADR-derived stop distance plus a manipulation buffer to survive normal noise',
        'Reward Enforcement: Take-profit mathematically stretched to guarantee the configured Risk:Reward ratio',
        'Regime Adaptation: Full parameter rebuild daily — no fixed distances carried across shifting volatility'
      ]
    },
    {
      id: 7,
      num: '07',
      name: 'Prop Firm Compliance Guard',
      subtitle: 'Challenge-Grade Drawdown & Target Enforcement',
      icon: ShieldCheck,
      color: 'blue',
      badge: 'Account Protection',
      summary: 'A continuous equity-monitoring layer that enforces prop firm challenge rules in real time, so one uncontrolled stretch can never undo a strategy\'s edge.',
      technicalSpecs: [
        'Daily Loss Ceiling: Hard equity-based cutoff halts all trading for the remainder of the session',
        'Maximum Drawdown Lock: Breach of the overall loss threshold triggers full strategy shutdown',
        'Profit Target Lockout: Reaching the target closes every position and halts further execution',
        'Challenge State Machine: All three thresholds evaluated against live equity simultaneously, every tick'
      ]
    },
    {
      id: 8,
      num: '08',
      name: 'Intelligent Defense System',
      subtitle: 'Macro-Explosion & Stacking Distance Protection',
      icon: Cpu,
      color: 'violet',
      badge: 'Execution Defense',
      summary: 'Two independent safeguards that stop the EA from chasing exhausted moves and from compounding size into unconfirmed pullbacks.',
      technicalSpecs: [
        'Macro Explosion Block: Daily range vs. ADR multiplier check prevents entries into already-extended moves',
        'Stacking Distance Delay: Follower trades require a minimum buffer past breakeven before compounding size',
        'Pullback Immunity: Prevents premature scaling into shallow, unconfirmed retracements',
        'Dual-Layer Evaluation: Runs independently across both the breakout and profit-recycling subsystems'
      ]
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
            Standard retail algorithms rely on static indicators or dangerous averaging/martingale grids. Adaptive Liquidity Pro 1 combines eight defensive and execution engineering systems.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
          {systems.length} Complementary Systems • Zero Grid • Zero Martingale
        </div>
      </div>

      {/* Interactive System Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: System Selector List */}
        <div className="lg:col-span-5 space-y-3">
          {systems.map((sys, idx) => {
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
            {active.youtubeId ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800/80 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      <span>Video Masterclass Walkthrough</span>
                    </div>
                    <div className="text-sm font-bold text-slate-100">
                      {active.videoTitle || active.videoTopic}
                    </div>
                  </div>

                  <a
                    href={`https://youtu.be/${active.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-emerald-400 hover:text-emerald-300 border border-slate-700 font-mono text-[11px] font-bold transition-colors w-fit shrink-0 cursor-pointer"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* 16:9 Responsive Embedded Video */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                  <iframe
                    src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0&modestbranding=1`}
                    title={active.videoTitle || active.name}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>

                {/* Explanation Alongside Video */}
                {active.videoExplanation && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <Info className="w-3 h-3 text-emerald-400" />
                      <span>How This Filter Works in Live Trading:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {active.videoExplanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800/80 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>VIDEO MASTERCLASS — COMING SOON</span>
                    </div>
                    <div className="text-sm font-bold text-slate-100">
                      {active.name} Walkthrough
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/60 font-mono text-[11px] font-bold cursor-not-allowed w-fit shrink-0 opacity-70 select-none"
                  >
                    <Bell className="w-3 h-3 text-slate-400" />
                    <span>Notify Me</span>
                  </button>
                </div>

                {/* 16:9 Responsive Placeholder matching video height exactly */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950/90 border border-slate-800/80 shadow-inner flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center max-w-sm space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700/70 flex items-center justify-center text-amber-400 shadow-md">
                      <Play className="w-5 h-5 fill-amber-400/20 text-amber-400 ml-0.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                        Masterclass Video In Production
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        Live execution recording and algorithmic breakdown for {active.name} will be published directly to this module.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                      <span>Curriculum Status: Scheduled Release</span>
                    </div>
                  </div>
                </div>

                {/* Status bar matching explanation box */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-amber-400" />
                    <span>System Architecture Status:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    The {active.name} quantitative logic and runtime risk checks are fully coded and operational in the live MT5 build. The video tutorial breakdown will be attached here upon release.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
