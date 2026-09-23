export interface RiskTierData {
  id: 'tier1' | 'tier2' | 'tier3';
  name: string;
  badge: string;
  riskPerTrade: string;
  riskPct: number;
  initialDepositR: number;
  finalBalanceR: number;
  netProfitR: number;
  netProfitPct: string;
  profitFactor: number;
  maxEquityDD: string;
  winRate: string;
  winLossRatio: string;
  avgHoldTime: string;
  description: string;
  idealFor: string;
  accentColor: string;
}

export const RISK_TIERS: Record<'tier1' | 'tier2' | 'tier3', RiskTierData> = {
  tier1: {
    id: 'tier1',
    name: 'Capital Preservation / Low Risk',
    badge: 'CONSERVATIVE GROWTH',
    riskPerTrade: '1.00%',
    riskPct: 1.00,
    initialDepositR: 100000,
    finalBalanceR: 226343.03,
    netProfitR: 126343.03,
    netProfitPct: '+126.3%',
    profitFactor: 3.78,
    maxEquityDD: '< 6.00%',
    winRate: '65.0%',
    winLossRatio: '3.58 : 1',
    avgHoldTime: '10h 31m',
    description: 'Engineered for steady capital preservation and institutional balance growth with strict single-digit drawdown controls capped at 6%.',
    idealFor: 'Capital Preservation & Steady Compounders ($25k - $500k Accounts)',
    accentColor: 'emerald'
  },
  tier2: {
    id: 'tier2',
    name: 'Balanced Growth',
    badge: 'ACCELERATED COMPOUNDING',
    riskPerTrade: '2.00%',
    riskPct: 2.00,
    initialDepositR: 100000,
    finalBalanceR: 498674.94,
    netProfitR: 398674.94,
    netProfitPct: '+398.7%',
    profitFactor: 3.43,
    maxEquityDD: '6.00%',
    winRate: '65.0%',
    winLossRatio: '3.25 : 1',
    avgHoldTime: '10h 31m',
    description: 'Optimized mathematical equilibrium combining verified 65% win rate and strong 4x capital expansion over 8.5 months.',
    idealFor: 'Private Portfolio Builders ($10k - $100k Accounts)',
    accentColor: 'cyan'
  },
  tier3: {
    id: 'tier3',
    name: 'High Growth Speculator',
    badge: 'MAXIMUM ALPHA COMPOUNDING',
    riskPerTrade: '4.00%',
    riskPct: 4.00,
    initialDepositR: 100000,
    finalBalanceR: 1936690.65,
    netProfitR: 1836690.65,
    netProfitPct: '+1,836%',
    profitFactor: 3.13,
    maxEquityDD: 'Controlled Guard',
    winRate: '65.0%',
    winLossRatio: '2.97 : 1',
    avgHoldTime: '10h 31m',
    description: 'High-velocity trend extraction targeting massive 18x returns via multi-week expansion captures.',
    idealFor: 'High-Alpha Speculators (High-Yield Sub-Accounts)',
    accentColor: 'amber'
  }
};

export interface AuditTrade {
  tradeNo: number;
  date: string;
  type: 'BUY' | 'SELL';
  entryPrice: string;
  exitPrice: string;
  duration: string;
  systemTrigger: string;
  pnlTier1: string;
  pnlTier2: string;
  pnlTier3: string;
  isWin: boolean;
}

export const SAMPLE_AUDIT_TRADES: AuditTrade[] = [
  {
    tradeNo: 70,
    date: '11 Sep 2026',
    type: 'BUY',
    entryPrice: '2518.40',
    exitPrice: '2546.80',
    duration: '11h 14m',
    systemTrigger: '01 Trend Gate + 02 DBLock Expansion',
    pnlTier1: '+R6,840',
    pnlTier2: '+R14,210',
    pnlTier3: '+R48,920',
    isWin: true
  },
  {
    tradeNo: 69,
    date: '08 Sep 2026',
    type: 'BUY',
    entryPrice: '2502.10',
    exitPrice: '2524.50',
    duration: '09h 40m',
    systemTrigger: '04 Profit Recycling Runner',
    pnlTier1: '+R5,120',
    pnlTier2: '+R11,040',
    pnlTier3: '+R37,500',
    isWin: true
  },
  {
    tradeNo: 67,
    date: '28 Aug 2026',
    type: 'BUY',
    entryPrice: '2480.50',
    exitPrice: '2512.90',
    duration: '14h 22m',
    systemTrigger: '02 Directional Breakout Lock',
    pnlTier1: '+R7,450',
    pnlTier2: '+R16,100',
    pnlTier3: '+R56,300',
    isWin: true
  },
  {
    tradeNo: 65,
    date: '20 Aug 2026',
    type: 'SELL',
    entryPrice: '2488.70',
    exitPrice: '2456.30',
    duration: '12h 45m',
    systemTrigger: '01 50/150 EMA Trend Gate',
    pnlTier1: '+R8,100',
    pnlTier2: '+R17,900',
    pnlTier3: '+R61,400',
    isWin: true
  },
  {
    tradeNo: 63,
    date: '10 Aug 2026',
    type: 'BUY',
    entryPrice: '2430.40',
    exitPrice: '2458.90',
    duration: '10h 18m',
    systemTrigger: '02 DBLock Multi-Week High',
    pnlTier1: '+R6,920',
    pnlTier2: '+R14,800',
    pnlTier3: '+R50,200',
    isWin: true
  },
  {
    tradeNo: 52,
    date: '18 Jul 2026',
    type: 'BUY',
    entryPrice: '2395.20',
    exitPrice: '2422.80',
    duration: '08h 15m',
    systemTrigger: '04 Dynamic Trailing Follower',
    pnlTier1: '+R6,200',
    pnlTier2: '+R13,400',
    pnlTier3: '+R45,100',
    isWin: true
  },
  {
    tradeNo: 41,
    date: '02 Jun 2026',
    type: 'SELL',
    entryPrice: '2360.10',
    exitPrice: '2334.40',
    duration: '10h 50m',
    systemTrigger: '03 RSI Momentum Confirmation',
    pnlTier1: '+R5,890',
    pnlTier2: '+R12,750',
    pnlTier3: '+R42,800',
    isWin: true
  },
  {
    tradeNo: 24,
    date: '14 Mar 2026',
    type: 'BUY',
    entryPrice: '2185.00',
    exitPrice: '2215.30',
    duration: '11h 20m',
    systemTrigger: '01 Trend Gate Genesis Expansion',
    pnlTier1: '+R7,150',
    pnlTier2: '+R15,300',
    pnlTier3: '+R51,800',
    isWin: true
  },
  {
    tradeNo: 8,
    date: '22 Jan 2026',
    type: 'BUY',
    entryPrice: '2064.50',
    exitPrice: '2092.30',
    duration: '11h 05m',
    systemTrigger: 'Target Expansion Surge (Trade 8)',
    pnlTier1: '+R6,450',
    pnlTier2: '+R13,900',
    pnlTier3: '+R46,800',
    isWin: true
  },
  {
    tradeNo: 1,
    date: '05 Jan 2026',
    type: 'BUY',
    entryPrice: '2042.10',
    exitPrice: '2061.40',
    duration: '08h 50m',
    systemTrigger: '01 Trend Gate Genesis Signal',
    pnlTier1: '+R4,200',
    pnlTier2: '+R8,900',
    pnlTier3: '+R28,500',
    isWin: true
  }
];
