import { useState } from 'react';
import { ShieldAlert, Calculator, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function EaRiskOfRuinSimulator() {
  const [simulatedLosses, setSimulatedLosses] = useState<number>(7);

  // Dynamic formula: Balance_N = Balance_0 * (1 - r)^N
  const startingCapital = 100000;
  const calculateRemaining = (rate: number, losses: number) => {
    return Math.round(startingCapital * Math.pow(1 - rate, losses));
  };

  const lossPct = (rate: number, losses: number) => {
    const rem = calculateRemaining(rate, losses);
    return (((startingCapital - rem) / startingCapital) * 100).toFixed(1);
  };

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>MATHEMATICAL CAPITAL DEFENSE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Risk of Ruin & Consecutive Loss Math
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Instead of concealing downside exposure, we model it with quantitative transparency. Because lot allocation dynamically recalculates on active equity, capital decay is exponential, not linear.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-600">
          Formula: <span className="font-bold text-slate-900">Balance<sub>N</sub> = Balance<sub>0</sub> × (1 − r)<sup>N</sup></span>
        </div>
      </div>

      {/* The Ruin Matrix Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900 font-mono">
            CONSECUTIVE LOSS THRESHOLDS VS. AUDITED STRESS TEST
          </h4>
          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            AUDIT MAX: 7 LOSSES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-5">Risk Profile</th>
                <th className="py-3.5 px-5">Loss of 50% Capital</th>
                <th className="py-3.5 px-5">Loss of 75% Capital</th>
                <th className="py-3.5 px-5">Ruin (&gt;95% Loss)</th>
                <th className="py-3.5 px-5 text-right">Actual Test Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">
                  <div className="font-mono text-emerald-700">1.25% (Tier 1 / Prop Firm)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Strict preservation</div>
                </td>
                <td className="py-4 px-5 font-mono text-slate-800">56 Consecutive</td>
                <td className="py-4 px-5 font-mono text-slate-800">110 Consecutive</td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">238 Consecutive</td>
                <td className="py-4 px-5 text-right font-mono font-black text-emerald-700">
                  7 Losses (34x Margin)
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">
                  <div className="font-mono text-cyan-800">2.50% (Tier 2 / Balanced)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Sharpe sweet spot</div>
                </td>
                <td className="py-4 px-5 font-mono text-slate-800">28 Consecutive</td>
                <td className="py-4 px-5 font-mono text-slate-800">55 Consecutive</td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">118 Consecutive</td>
                <td className="py-4 px-5 text-right font-mono font-black text-cyan-800">
                  7 Losses (16x Margin)
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">
                  <div className="font-mono text-amber-600">5.00% (Tier 3 / High Growth)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Aggressive acceleration</div>
                </td>
                <td className="py-4 px-5 font-mono text-slate-800">14 Consecutive</td>
                <td className="py-4 px-5 font-mono text-slate-800">27 Consecutive</td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">59 Consecutive</td>
                <td className="py-4 px-5 text-right font-mono font-black text-amber-600">
                  7 Losses (8x Margin)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Loss Sequence Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Interactive Loss Sequence Simulator</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Simulate Consecutive Loss Impact on R100,000 Starting Capital
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Simulate Losses:</span>
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
              {[3, 5, 7, 10, 14].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setSimulatedLosses(cnt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    simulatedLosses === cnt
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cnt} {cnt === 7 ? '★ Max' : 'L'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Consecutive Losses: <strong className="text-emerald-400 text-sm">{simulatedLosses}</strong></span>
            {simulatedLosses === 7 && (
              <span className="text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded">
                ★ 7 Losses = Actual 8.5-Month Audit Stress Peak
              </span>
            )}
            {simulatedLosses > 7 && (
              <span className="text-amber-400 font-bold bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded">
                Simulated Stress Beyond Historical Maximum
              </span>
            )}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={simulatedLosses}
            onChange={(e) => setSimulatedLosses(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Simulation Output Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 Output */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">Tier 1 (1.25% Risk)</span>
              <span className="text-slate-400">-{lossPct(0.0125, simulatedLosses)}% Loss</span>
            </div>
            <div className="text-2xl font-black font-mono text-white">
              R{calculateRemaining(0.0125, simulatedLosses).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Capital preserved: {(100 - parseFloat(lossPct(0.0125, simulatedLosses))).toFixed(1)}% intact after {simulatedLosses} consecutive stop-outs.
            </div>
          </div>

          {/* Tier 2 Output */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">Tier 2 (2.50% Risk)</span>
              <span className="text-slate-400">-{lossPct(0.025, simulatedLosses)}% Loss</span>
            </div>
            <div className="text-2xl font-black font-mono text-white">
              R{calculateRemaining(0.025, simulatedLosses).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Capital preserved: {(100 - parseFloat(lossPct(0.025, simulatedLosses))).toFixed(1)}% intact after {simulatedLosses} consecutive stop-outs.
            </div>
          </div>

          {/* Tier 3 Output */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">Tier 3 (5.00% Risk)</span>
              <span className="text-slate-400">-{lossPct(0.05, simulatedLosses)}% Loss</span>
            </div>
            <div className="text-2xl font-black font-mono text-amber-300">
              R{calculateRemaining(0.05, simulatedLosses).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Capital preserved: {(100 - parseFloat(lossPct(0.05, simulatedLosses))).toFixed(1)}% intact after {simulatedLosses} consecutive stop-outs.
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Safety Margins:</strong> During the 8.5-month audit, the system never exceeded 7 consecutive losses. Even at the most aggressive 5.00% setting, the system operated at a <strong>2x safety margin below a 50% drawdown sequence</strong>, and an <strong>8x safety margin from ruin</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}
