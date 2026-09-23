import { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Cpu, 
  Settings, 
  Headphones, 
  Search, 
  Sparkles,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'strategy' | 'setup' | 'install';
  question: string;
  answer: string;
  details?: string[];
}

export function EaFaq() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'strategy' | 'setup' | 'install'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('strategy_1');

  const faqItems: FaqItem[] = [
    // --- STRATEGY LOGIC & TRADING ENGINE ---
    {
      id: 'strategy_1',
      category: 'strategy',
      question: 'How does the EA identify high-probability entries on Gold (XAUUSD)?',
      answer: 'Adaptive Liquidity Pro 1 operates on a multi-layered quantitative framework rather than static retail indicators. It synchronizes three distinct filters before considering an execution: macro trend alignment, liquidity breakout boundaries, and momentum exhaustion checks.',
      details: [
        '50 & 150 EMA Trend Gate: Verifies directional alignment on H1 and suppresses counter-trend tick impulses.',
        'Directional Breakout Lock (DBLock): Tracks 20-day high/low liquidity clusters and ADR expansion windows.',
        'Adaptive RSI Guard: 28-period smoothed momentum filter prevents buying at parabolic tops or selling into exhaustive bottoms.',
        'Payoff Asymmetry: Targets a 3.58 : 1 average win-to-loss ratio so profitability does not rely on dangerous 90%+ win rate gimmicks.'
      ]
    },
    {
      id: 'strategy_2',
      category: 'strategy',
      question: 'Does the system use grid, martingale, or cost-averaging techniques?',
      answer: 'Absolutely not. The algorithm strictly prohibits martingale, grid additions, or holding unhedged drawdown. Every single order is placed with a fixed mathematical Stop Loss and Take Profit calculated at the moment of execution.',
      details: [
        'Zero Averaging Down: Never opens additional losing positions to mask trade drawdowns.',
        'Strict Risk Sizing: Position volume is dynamically determined as an exact percentage of account equity (e.g., 1.0% to 4.0%).',
        'Hard Stop Loss: Every trade has a server-side Stop Loss transmitted directly to the broker upon order creation.'
      ]
    },
    {
      id: 'strategy_3',
      category: 'strategy',
      question: 'How does the 12-Hour Stale Trade Liquidation protect my account?',
      answer: 'Institutional liquidity flows are time-sensitive. Positions that stall without expanding into directional profit within 12 hours lose their statistical edge and increase exposure to off-session spread widening and overnight swap fees.',
      details: [
        'Automatic Exit: Trades that have not hit profit targets or expansion milestones by hour 12 are liquidated at market.',
        'Swap Reduction: Dramatically lowers swap cost degradation over multi-day chop.',
        'Weekend Gap Immunization: System clears floating exposure before Friday market close to protect against weekend geopolitical gaps.'
      ]
    },
    {
      id: 'strategy_4',
      category: 'strategy',
      question: 'Can the EA be deployed on other currency pairs or instruments?',
      answer: 'While the 182.6M tick audit was strictly performed on Gold (XAUUSD H1), the underlying liquidity-breakout mechanics apply to other liquid FX pairs. The download package includes pre-calibrated parameter setfiles for EURUSD, GBPUSD, and USDJPY alongside Gold.',
      details: [
        'Primary Focus: Gold (XAUUSD) on the 1-Hour (H1) timeframe for maximum volatility harvesting.',
        'Secondary Setfiles: EURUSD and GBPUSD H1 setfiles included with modified ADR sensitivity.',
        'Independent Optimization: Source Code license holders can run MT5 genetic optimizations across any asset class.'
      ]
    },

    // --- SETUP REQUIREMENTS & BROKER COMPATIBILITY ---
    {
      id: 'setup_1',
      category: 'setup',
      question: 'What trading terminal and operating systems are supported?',
      answer: 'The EA is built natively in MQL5 for MetaTrader 5 (MT5). It runs on Windows 10/11 desktop or laptop computers, Windows Cloud Virtual Private Servers (VPS), and macOS via Parallels Desktop, CrossOver, or Wine.',
      details: [
        'Native Platform: MetaTrader 5 (64-bit MT5 terminal build 3800 or newer).',
        'OS Compatibility: Windows 10/11, Windows Server 2019/2022, and macOS via virtualization.',
        'Hardware Footprint: Lightweight MQL5 code consuming under 45 MB of RAM during live execution.'
      ]
    },
    {
      id: 'setup_2',
      category: 'setup',
      question: 'Is a Virtual Private Server (VPS) required to run the EA?',
      answer: 'While you can run the EA on your regular home computer, a 24/5 Cloud VPS is strongly recommended for institutional execution. A VPS guarantees uninterrupted uptime, immunity from home power/Wi-Fi outages, and ultra-low latency (<5ms) to your broker server.',
      details: [
        'Recommended VPS Specs: 1-2 vCPU, 2 GB RAM, located in London (LD4) or New York (NY4) close to broker liquidity.',
        'Continuous Management: Allows the 12-hour liquidation timer and dynamic trailing stop to function seamlessly around the clock.',
        'Setup Assistance: Our installation documentation provides pre-tested VPS recommendations and configuration steps.'
      ]
    },
    {
      id: 'setup_3',
      category: 'setup',
      question: 'What are the minimum capital and broker account requirements?',
      answer: 'The system is compatible with any regulated MT5 broker offering RAW or ECN spreads. It supports micro, mini, and standard contract sizes, accommodating personal growth accounts as well as funded capital.',
      details: [
        'Recommended Minimum Balance: $250 – $500 for micro-lot testing; $1,000+ for optimal compound growth.',
        'Account Type: ECN, RAW Spread, or Pro Zero-Spread accounts with low commissions.',
        'Leverage: Compatible with leverage from 1:30 (strict regulatory jurisdictions) up to 1:500.',
        'Prop Firm Compatible: Fully compliant with 1-step and 2-step evaluation rules (no prohibited latency arbitrage or toxic tick scalping).'
      ]
    },
    {
      id: 'setup_4',
      category: 'setup',
      question: 'How many trading accounts can I use with my license?',
      answer: 'Licenses support multiple accounts simultaneously. You can deploy the EA across your primary live account, a secondary demo account for forward-testing, and evaluation challenges simultaneously without extra fees.',
      details: [
        'Multi-Terminal Support: Run on both Live and Demo accounts at the same time.',
        'Instant Transfer: Easily switch account numbers inside your automated license portal without waiting for support.',
        'Source Code License: Unlimited private account deployments with zero terminal or licensing restrictions.'
      ]
    },

    // --- INSTALLATION, SETFILES & SUPPORT ---
    {
      id: 'install_1',
      category: 'install',
      question: 'How do I install the .ex5 file and pre-calibrated setfiles in MT5?',
      answer: 'Installation takes under 3 minutes. After completing your order, you receive instant access to download the compiled `.ex5` binary, pre-calibrated `.set` files, and step-by-step instructions.',
      details: [
        'Step 1: In MT5, click File → Open Data Folder → MQL5 → Experts, and paste the AdaptiveLiquidityPro.ex5 file.',
        'Step 2: Restart MT5 or right-click "Experts" in Navigator and click Refresh.',
        'Step 3: Drag the EA onto the XAUUSD H1 chart, click "Load" on the Inputs tab, and select your preferred preset file (.set).',
        'Step 4: Enable the "Algo Trading" button in the top toolbar and enter your license key.'
      ]
    },
    {
      id: 'install_2',
      category: 'install',
      question: 'What pre-calibrated parameter setfiles are included in the package?',
      answer: 'You receive three institutional parameter setfiles engineered from our quantitative modeling dataset, eliminating any guesswork in setting inputs:',
      details: [
        'Preset 1 (Preservation): 1.0% equity risk per trade, tight 6% risk protection guard, ideal for conservative preservation.',
        'Preset 2 (Balanced Growth): 2.0% equity risk per trade, balanced compound acceleration (+398.7% audited gain).',
        'Preset 3 (High Growth Speculator): 4.0% risk per trade targeting maximum velocity expansion (+1,836% audited net gain).',
        'Forex Complementary Setfiles: Bonus pre-calibrated setfiles for EURUSD and GBPUSD.'
      ]
    },
    {
      id: 'install_3',
      category: 'install',
      question: 'What kind of technical installation and ongoing support is provided?',
      answer: 'Every customer receives comprehensive technical onboarding and dedicated engineering support to ensure smooth deployment on your terminal.',
      details: [
        'Comprehensive Documentation: High-resolution PDF installation guide and video walkthrough.',
        'Direct Engineering Support: Priority ticket assistance and VIP Telegram channel access.',
        'Remote Setup Assistance: Optional AnyDesk / TeamViewer guided installation for users needing help with VPS or MT5 setup.',
        'Free Parameter Updates: All seasonal recalibrations and software maintenance releases are delivered free during your active license term.'
      ]
    },
    {
      id: 'install_4',
      category: 'install',
      question: 'What is the difference between the 6-Month, 12-Month, and Source Code licenses?',
      answer: 'Standard licenses provide the compiled `.ex5` binary with automated license management, while the Source Code license provides the raw MQL5 source code (.mq5) with full commercial/private developer rights.',
      details: [
        '6-Month License ($199): Compiled .ex5 binary, all 3 risk setfiles, 6 months of updates & support.',
        '12-Month License ($299, Best Value): Compiled .ex5 binary, all 3 risk setfiles, 12 months of updates & support, multi-account terminal access.',
        'Developer Source Code License ($499): 100% editable MQL5 (.mq5) source code, unrestricted private execution on unlimited terminals forever, no expiration, and algorithmic customization rights.'
      ]
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>KNOWLEDGE BASE & SUPPORT DIRECTORY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            Everything you need to know about the strategy logic, setup requirements, VPS hosting, and step-by-step installation support for Adaptive Liquidity Pro 1.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions & logic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Questions ({faqItems.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('strategy')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'strategy'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-emerald-800 border border-slate-200/80 hover:bg-emerald-50/50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Strategy Logic & Engine ({faqItems.filter(f => f.category === 'strategy').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('setup')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'setup'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-cyan-800 border border-slate-200/80 hover:bg-cyan-50/50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Setup Requirements & VPS ({faqItems.filter(f => f.category === 'setup').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('install')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'install'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-teal-800 border border-slate-200/80 hover:bg-teal-50/50'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Installation & Support ({faqItems.filter(f => f.category === 'install').length})</span>
        </button>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm font-sans space-y-2">
            <div>No matching questions found for "{searchQuery}".</div>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-xs font-mono text-emerald-700 font-bold underline cursor-pointer"
            >
              Reset filters and view all questions
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            
            const categoryBadge = {
              strategy: { label: 'Strategy Logic', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              setup: { label: 'Setup & VPS', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
              install: { label: 'Install & Support', color: 'bg-teal-50 text-teal-800 border-teal-200' }
            }[faq.category];

            return (
              <div
                key={faq.id}
                className={`rounded-2xl bg-white border transition-all overflow-hidden ${
                  isOpen 
                    ? 'border-emerald-600/60 shadow-md ring-1 ring-emerald-500/10' 
                    : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${categoryBadge.color}`}>
                        {categoryBadge.label}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {faq.question}
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isOpen 
                      ? 'bg-emerald-100 text-emerald-800 rotate-180' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-700 leading-relaxed border-t border-slate-100/80 font-sans space-y-4">
                    <p className="font-normal text-slate-700">
                      {faq.answer}
                    </p>

                    {faq.details && faq.details.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                          Key Technical Points
                        </span>
                        <div className="space-y-2">
                          {faq.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support Card Footer */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Dedicated Engineering Support</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Have a technical question about your broker or setup?
          </h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Our engineering team is available 24/5 to assist with MT5 terminal setup, VPS configuration, setfile selection, and backtest analysis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <a
            href="mailto:support@eaautomationhub.com"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold text-center transition-all shadow-md shadow-emerald-900/30"
          >
            Email Engineering Support
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
          >
            <span>VIP Telegram Help</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
