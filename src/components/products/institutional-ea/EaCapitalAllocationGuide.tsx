import { Shield, TrendingUp, Zap, CheckCircle2, UserCheck } from 'lucide-react';

export function EaCapitalAllocationGuide() {
  const profiles = [
    {
      tier: 'Preset 1 (Conservative)',
      title: 'Capital Preservation & Steady Growth',
      capitalTarget: '$25,000 – $500,000 Accounts',
      icon: Shield,
      accent: 'border-emerald-200 bg-emerald-50/50',
      tag: 'Strict Capital Preservation',
      tagColor: 'bg-emerald-100 text-emerald-800',
      recommendations: [
        'Deploy this preset for conservative balance growth with tight risk controls strictly capped at 6%.',
        'Leverages the verified 65% win rate and asymmetrical 3.58:1 win-to-loss payoff for consistent accumulation.',
        'Eliminates market volatility stress through disciplined risk caps.'
      ]
    },
    {
      tier: 'Preset 2 (Balanced)',
      title: 'Accelerated Wealth Builders',
      capitalTarget: '$10,000 – $100,000 Accounts',
      icon: TrendingUp,
      accent: 'border-cyan-200 bg-cyan-50/50',
      tag: 'Accelerated Compounding',
      tagColor: 'bg-cyan-100 text-cyan-800',
      recommendations: [
        'Delivers powerful compounding (+398.7% audited gain) with smooth month-over-month capital acceleration.',
        'Combines 65% win rate precision with dynamic trailing defenses for optimal balance growth.',
        'High execution consistency generating dependable weekly alpha on Gold H1.'
      ]
    },
    {
      tier: 'Preset 3 (High Growth)',
      title: 'High-Alpha Speculators',
      capitalTarget: 'Dedicated High-Yield Accounts',
      icon: Zap,
      accent: 'border-amber-200 bg-amber-50/50',
      tag: 'Maximum Alpha Acceleration',
      tagColor: 'bg-amber-100 text-amber-900',
      recommendations: [
        'Engineered for maximum velocity capital acceleration targeting massive 18x compounding (+1,836% audited net gain).',
        'Captures prolonged directional trend expansions via multi-week high/low breakout locks.',
        'Optimized for compounding accounts seeking exponential upside on Gold.'
      ]
    }
  ];

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>CAPITAL ALLOCATION GUIDE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Strategic Recommendations by Deployment Objective
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          Quantitative systems should be matched to specific risk tolerance, account size, and capital objectives. All 3 pre-calibrated presets are included in the download package.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {profiles.map((p, idx) => {
          return (
            <div
              key={idx}
              className={`p-7 rounded-3xl border ${p.accent} shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-all`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${p.tagColor}`}>
                    {p.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {p.tier}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {p.title}
                  </h3>
                  <div className="text-xs font-mono text-emerald-800 font-bold mt-1">
                    Target Capital: {p.capitalTarget}
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-600 font-sans">
                  {p.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
                Pre-calibrated parameter setfiles included
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
