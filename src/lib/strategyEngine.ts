/**
 * MEG.AI Strategy Intake & Extraction Engine
 * 
 * The client's strategy description is the PRIMARY SOURCE OF TRUTH.
 * The AI organizes and clarifies the strategy — NOT redesigning, optimizing, or inventing rules.
 * 
 * Flow: EXTRACT → STRUCTURE → CLARIFY → PRESENT
 */

export interface StructuredStrategyData {
  primaryDescription: string;
  instrument: string;
  timeframe: string;
  direction: 'Long & Short' | 'Long Only' | 'Short Only' | 'Not specified';
  setup: string;
  entryRules: string;
  exitRules: string;
  stopLoss: string;
  takeProfit: string;
  riskPerTrade: string;
  riskReward: string;
  maxDailyLoss: string;
  maxDailyProfit: string;
  maxTradesPerDay: string;
  maxOpenPositions: string;
  breakEven: string;
  trailingStop: string;
  sessions: string;
  tradingDays: string[];
  newsFilter: string;
  maxSpread: string;
  additionalRules: string;
  consecutiveLossProtection: string;
  positionSizing: string;
  maxExposure: string;
  entryTriggerType?: 'Candle Close' | 'Instant Tick Touch' | 'Retest / Limit' | 'Not specified';
}

export interface ClarificationItem {
  id: string;
  topic: string;
  question: string;
  status: 'REQUIRES CLARIFICATION';
  suggestedOptions?: string[];
}

export interface StrategyExtractionResult {
  structured: StructuredStrategyData;
  clarifications: ClarificationItem[];
  status: 'STRATEGY READY FOR REVIEW' | 'CLARIFICATION REQUIRED';
  confidenceSummary: string;
}

/**
 * Intelligent deterministic extraction from client's plain-English strategy description.
 * Adheres strictly to the user's explicit words. Missing values are flagged as "Not specified".
 */
export function extractTechnicalDetailsFromDescription(
  text: string,
  existingOverrides?: Partial<StructuredStrategyData>
): StrategyExtractionResult {
  const desc = text || '';
  const lower = desc.toLowerCase();

  // 1. INSTRUMENTS
  let instrument = existingOverrides?.instrument || '';
  if (!instrument || instrument === 'Not specified') {
    if (lower.includes('xauusd') || lower.includes('gold')) instrument = 'XAUUSD (Gold)';
    else if (lower.includes('eurusd')) instrument = 'EURUSD';
    else if (lower.includes('gbpusd')) instrument = 'GBPUSD';
    else if (lower.includes('us30') || lower.includes('dow')) instrument = 'US30 (Dow Jones)';
    else if (lower.includes('nas100') || lower.includes('nasdaq')) instrument = 'NAS100 (Nasdaq)';
    else if (lower.includes('spx500') || lower.includes('s&p')) instrument = 'SPX500 (S&P 500)';
    else if (lower.includes('btcusd') || lower.includes('bitcoin')) instrument = 'BTCUSD';
    else if (lower.includes('usdjpy')) instrument = 'USDJPY';
    else if (lower.includes('audusd')) instrument = 'AUDUSD';
    else instrument = 'Not specified';
  }

  // 2. TIMEFRAMES
  let timeframe = existingOverrides?.timeframe || '';
  if (!timeframe || timeframe === 'Not specified') {
    if (/\bm1\b/i.test(desc) || lower.includes('1 minute') || lower.includes('1-minute')) timeframe = 'M1 (1-Minute)';
    else if (/\bm5\b/i.test(desc) || lower.includes('5 minute') || lower.includes('5-minute')) timeframe = 'M5 (5-Minute)';
    else if (/\bm15\b/i.test(desc) || lower.includes('15 minute') || lower.includes('15-minute')) timeframe = 'M15 (15-Minute)';
    else if (/\bm30\b/i.test(desc) || lower.includes('30 minute') || lower.includes('30-minute')) timeframe = 'M30 (30-Minute)';
    else if (/\bh1\b/i.test(desc) || lower.includes('1 hour') || lower.includes('1-hour') || lower.includes('hourly')) timeframe = 'H1 (1-Hour)';
    else if (/\bh4\b/i.test(desc) || lower.includes('4 hour') || lower.includes('4-hour')) timeframe = 'H4 (4-Hour)';
    else if (/\bd1\b/i.test(desc) || lower.includes('daily')) timeframe = 'D1 (Daily)';
    else timeframe = 'Not specified';
  }

  // 3. SESSIONS
  let sessions = existingOverrides?.sessions || '';
  if (!sessions || sessions === 'Not specified') {
    const hasLondon = lower.includes('london');
    const hasNY = lower.includes('new york') || lower.includes('ny am') || lower.includes('ny session') || lower.includes('ny');
    const hasAsia = lower.includes('asia') || lower.includes('tokyo');

    if (hasLondon && hasNY) sessions = 'London + New York';
    else if (hasLondon) sessions = 'London Session Only';
    else if (hasNY) sessions = 'New York Session Only';
    else if (hasAsia) sessions = 'Asian Session Only';
    else sessions = 'Not specified';
  }

  // 4. DIRECTION
  let direction = existingOverrides?.direction || 'Not specified';
  if (direction === 'Not specified') {
    if (lower.includes('only buy') || lower.includes('long only') || lower.includes('bullish only')) direction = 'Long Only';
    else if (lower.includes('only sell') || lower.includes('short only') || lower.includes('bearish only')) direction = 'Short Only';
    else if (lower.includes('buy') && lower.includes('sell')) direction = 'Long & Short';
    else if (lower.includes('long') && lower.includes('short')) direction = 'Long & Short';
  }

  // 5. RISK PER TRADE
  let riskPerTrade = existingOverrides?.riskPerTrade || '';
  if (!riskPerTrade || riskPerTrade === 'Not specified') {
    const riskMatch = desc.match(/risk\s*([0-9.]+)\s*%/i) || desc.match(/([0-9.]+)\s*%\s*(risk|per trade|equity)/i);
    if (riskMatch) {
      riskPerTrade = `${riskMatch[1]}%`;
    } else if (lower.includes('fixed lot') || desc.match(/([0-9.]+)\s*lots?/i)) {
      const lotMatch = desc.match(/([0-9.]+)\s*lots?/i);
      riskPerTrade = lotMatch ? `Fixed Lot (${lotMatch[1]} Lots)` : 'Fixed Lot';
    } else {
      riskPerTrade = 'Not specified';
    }
  }

  // 6. STOP LOSS
  let stopLoss = existingOverrides?.stopLoss || '';
  if (!stopLoss || stopLoss === 'Not specified') {
    if (lower.includes('below the sweep') || lower.includes('below sweep')) {
      stopLoss = 'Below liquidity sweep';
    } else if (lower.includes('above the sweep') || lower.includes('above sweep')) {
      stopLoss = 'Above liquidity sweep';
    } else if (lower.includes('swing high') || lower.includes('swing low')) {
      stopLoss = 'Structural Swing High / Low';
    } else if (lower.includes('atr')) {
      const atrMatch = desc.match(/([0-9.]+)\s*(x|\*)\s*atr/i) || desc.match(/atr\s*([0-9.]+)/i);
      stopLoss = atrMatch ? `${atrMatch[1]}x ATR Volatility Stop` : 'ATR Dynamic Stop';
    } else {
      const pipMatch = desc.match(/stop\s*(loss)?\s*(of|at|is)?\s*([0-9.]+)\s*pips?/i) || desc.match(/([0-9.]+)\s*pips?\s*stop/i);
      stopLoss = pipMatch ? `${pipMatch[pipMatch.length - 1]} Pips` : 'Not specified';
    }
  }

  // 7. TAKE PROFIT / RISK REWARD
  let takeProfit = existingOverrides?.takeProfit || '';
  let riskReward = existingOverrides?.riskReward || '';
  if (!takeProfit || takeProfit === 'Not specified') {
    const rMatch = desc.match(/([0-9.]+)\s*r\b/i) || desc.match(/target\s*([0-9.]+)\s*r/i) || desc.match(/1\s*:\s*([0-9.]+)/i);
    if (rMatch) {
      takeProfit = `${rMatch[1]}R Multiple`;
      riskReward = `1:${rMatch[1]}`;
    } else if (lower.includes('opposing liquidity') || lower.includes('opposite liquidity')) {
      takeProfit = 'Opposing session liquidity pool';
    } else {
      const tpPipMatch = desc.match(/take\s*profit\s*(of|at|is)?\s*([0-9.]+)\s*pips?/i) || desc.match(/([0-9.]+)\s*pips?\s*(tp|take profit)/i);
      takeProfit = tpPipMatch ? `${tpPipMatch[tpPipMatch.length - 1]} Pips` : 'Not specified';
    }
  }

  // 8. SETUP & ENTRY RULES
  let entryRules = existingOverrides?.entryRules || '';
  let setup = existingOverrides?.setup || '';
  if (!entryRules || entryRules === 'Not specified') {
    const entryMatches: string[] = [];
    if (lower.includes('sweep') || lower.includes('liquidity')) entryMatches.push('Wait for liquidity sweep of session high/low');
    if (lower.includes('displacement')) entryMatches.push('Confirm strong displacement candle');
    if (lower.includes('fair value gap') || lower.includes('fvg')) entryMatches.push('Enter upon mitigation of Fair Value Gap (FVG)');
    if (lower.includes('market structure shift') || lower.includes('mss')) entryMatches.push('Confirm Market Structure Shift (MSS)');
    if (lower.includes('ema') && lower.includes('cross')) entryMatches.push('Wait for moving average crossover confirmation');
    if (lower.includes('breakout')) entryMatches.push('Identify breakout beyond key range or level');

    if (entryMatches.length > 0) {
      entryRules = entryMatches.join('; ');
      setup = entryMatches[0];
    } else if (desc.trim().length > 15) {
      entryRules = desc.split('.')[0]?.trim() || 'Described in primary strategy';
      setup = 'Custom client price-action setup';
    } else {
      entryRules = 'Not specified';
      setup = 'Not specified';
    }
  }

  // 9. EXIT RULES
  let exitRules = existingOverrides?.exitRules || '';
  if (!exitRules || exitRules === 'Not specified') {
    const exitParts: string[] = [];
    if (stopLoss !== 'Not specified') exitParts.push(`Stop Loss: ${stopLoss}`);
    if (takeProfit !== 'Not specified') exitParts.push(`Take Profit: ${takeProfit}`);
    if (lower.includes('opposite signal') || lower.includes('reverse signal')) exitParts.push('Close position on opposite signal');
    exitRules = exitParts.length > 0 ? exitParts.join(' | ') : 'Not specified';
  }

  // 10. TRADE MANAGEMENT (Break Even, Trailing Stop)
  let breakEven = existingOverrides?.breakEven || '';
  if (!breakEven || breakEven === 'Not specified') {
    if (lower.includes('break even') || lower.includes('breakeven') || lower.includes('move stop to be')) {
      const beMatch = desc.match(/at\s*([0-9.]+)\s*r/i) || desc.match(/after\s*([0-9.]+)\s*r/i) || desc.match(/([0-9.]+)\s*r/i);
      breakEven = beMatch ? `Move to Break-Even at ${beMatch[1]}R` : 'Move stop to Break-Even';
    } else {
      breakEven = 'Not specified';
    }
  }

  let trailingStop = existingOverrides?.trailingStop || '';
  if (!trailingStop || trailingStop === 'Not specified') {
    if (lower.includes('trail') || lower.includes('trailing')) {
      const trailAtr = desc.match(/trail.*([0-9.]+)\s*(x|\*)\s*atr/i);
      trailingStop = trailAtr ? `Trail ${trailAtr[1]}x ATR` : 'Active Trailing Stop';
    } else {
      trailingStop = 'Not specified';
    }
  }

  // 11. RISK CONSTRAINTS (Max daily loss, consecutive losses, trade counts)
  let maxDailyLoss = existingOverrides?.maxDailyLoss || '';
  if (!maxDailyLoss || maxDailyLoss === 'Not specified') {
    const dailyLossMatch = desc.match(/daily\s*(max\s*)?loss\s*(of|is|at)?\s*([0-9.]+)\s*%/i) || desc.match(/max\s*daily\s*loss\s*([0-9.]+)\s*%/i);
    maxDailyLoss = dailyLossMatch ? `${dailyLossMatch[dailyLossMatch.length - 1]}%` : 'Not specified';
  }

  let consecutiveLossProtection = existingOverrides?.consecutiveLossProtection || '';
  if (!consecutiveLossProtection || consecutiveLossProtection === 'Not specified') {
    const consecMatch = desc.match(/([0-9]+)\s*consecutive\s*losses?/i) || desc.match(/stop\s*after\s*([0-9]+)\s*losses?/i);
    consecutiveLossProtection = consecMatch ? `Stop trading after ${consecMatch[1]} consecutive losses` : 'Not specified';
  }

  let maxTradesPerDay = existingOverrides?.maxTradesPerDay || '';
  if (!maxTradesPerDay || maxTradesPerDay === 'Not specified') {
    const tradesMatch = desc.match(/([0-9]+)\s*trades?\s*(per|a)\s*day/i) || desc.match(/max\s*([0-9]+)\s*trades?/i);
    maxTradesPerDay = tradesMatch ? `${tradesMatch[1]} trades/day` : 'Not specified';
  }

  let maxOpenPositions = existingOverrides?.maxOpenPositions || '';
  if (!maxOpenPositions || maxOpenPositions === 'Not specified') {
    const posMatch = desc.match(/([0-9]+)\s*(open\s*)?position/i) || desc.match(/one\s*trade\s*at\s*a\s*time/i);
    maxOpenPositions = posMatch ? (posMatch[1] ? `${posMatch[1]} position(s)` : '1 position max') : 'Not specified';
  }

  // 12. CONDITIONS & FILTERS
  let newsFilter = existingOverrides?.newsFilter || '';
  if (!newsFilter || newsFilter === 'Not specified') {
    if (lower.includes('news') || lower.includes('nfp') || lower.includes('cpi') || lower.includes('fomc')) {
      newsFilter = 'Pause execution during high-impact economic news events';
    } else {
      newsFilter = 'Not specified';
    }
  }

  let maxSpread = existingOverrides?.maxSpread || '';
  if (!maxSpread || maxSpread === 'Not specified') {
    const spreadMatch = desc.match(/spread\s*(under|below|max|of)?\s*([0-9.]+)\s*pips?/i);
    maxSpread = spreadMatch ? `${spreadMatch[2]} Pips` : 'Not specified';
  }

  const tradingDays = existingOverrides?.tradingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const additionalRules = existingOverrides?.additionalRules || (desc.length > 200 ? 'Refer to primary description for full details' : 'Not specified');

  // 13. IDENTIFY GENUINE AMBIGUITIES / CLARIFICATIONS (Only when necessary)
  const clarifications: ClarificationItem[] = [];

  // Check Entry Trigger Precision
  if (
    (lower.includes('breakout') || lower.includes('sweep') || lower.includes('cross')) &&
    !lower.includes('candle close') &&
    !lower.includes('bar close') &&
    !lower.includes('tick') &&
    !lower.includes('limit order')
  ) {
    clarifications.push({
      id: 'clarify-entry-trigger',
      topic: 'ENTRY TRIGGER EXECUTION',
      question: 'Does execution occur immediately on touch of the level, or after the candle closes?',
      status: 'REQUIRES CLARIFICATION',
      suggestedOptions: ['On Candle Close (Conservative)', 'Instant Tick Touch (Aggressive)', 'Limit Order Retest'],
    });
  }

  // Check Stop Loss Precision if left completely unspecified
  if (stopLoss === 'Not specified' && desc.length > 20) {
    clarifications.push({
      id: 'clarify-stop-loss',
      topic: 'STOP LOSS PLACEMENT',
      question: 'No explicit stop loss rule detected. Where should the protective stop be placed?',
      status: 'REQUIRES CLARIFICATION',
      suggestedOptions: ['Recent Swing High/Low', 'Fixed Pips', 'ATR Multiplier'],
    });
  }

  const status = clarifications.length > 0 ? 'CLARIFICATION REQUIRED' : 'STRATEGY READY FOR REVIEW';

  const structured: StructuredStrategyData = {
    primaryDescription: desc,
    instrument,
    timeframe,
    direction: direction as any,
    setup,
    entryRules,
    exitRules,
    stopLoss,
    takeProfit,
    riskPerTrade,
    riskReward: riskReward || 'Not specified',
    maxDailyLoss,
    maxDailyProfit: existingOverrides?.maxDailyProfit || 'Not specified',
    maxTradesPerDay,
    maxOpenPositions,
    breakEven,
    trailingStop,
    sessions,
    tradingDays,
    newsFilter,
    maxSpread,
    additionalRules,
    consecutiveLossProtection,
    positionSizing: riskPerTrade !== 'Not specified' ? `Calculated from ${riskPerTrade}` : 'Not specified',
    maxExposure: existingOverrides?.maxExposure || 'Not specified',
  };

  return {
    structured,
    clarifications,
    status,
    confidenceSummary: `Extracted from client's strategy description. ${clarifications.length > 0 ? `${clarifications.length} item(s) require clarification.` : 'All core parameters successfully mapped.'}`,
  };
}

/**
 * Representation 1: VIEW AS PROMPT
 * Structured, professional prompt suitable for giving to an AI coding/development assistant.
 * STRICTLY reflects the client's rules without redesigning or inventing.
 */
export function buildDevPrompt(data: StructuredStrategyData): string {
  return `==================================================
AI DEVELOPMENT PROMPT — EXPERT ADVISOR SPECIFICATION
==================================================

[ROLE]
You are an institutional MQL5 algorithmic systems architect. Your task is to develop a production-ready Expert Advisor strictly based on the client's verified strategy rules below. Do NOT alter, optimize, or invent rules beyond this specification.

[CONTEXT & ORIGINAL CLIENT DESCRIPTION]
${data.primaryDescription || 'No description provided.'}

[STRATEGY OBJECTIVE]
Automate the client's specified trading logic into a deterministic, robust Expert Advisor adhering to institutional execution and strict risk preservation standards.

[MARKET & INSTRUMENT]
• Target Asset / Symbol: ${data.instrument}
• Execution Timeframe: ${data.timeframe}
• Trading Direction: ${data.direction}

[ENTRY CONDITIONS]
• Primary Setup Model: ${data.setup}
• Entry Execution Rules: ${data.entryRules}
• Confirmation Filters: ${data.entryTriggerType || 'Evaluated strictly as defined in client description'}

[EXIT CONDITIONS]
• Stop Loss: ${data.stopLoss}
• Take Profit: ${data.takeProfit}
• Invalidation & Exit Triggers: ${data.exitRules}

[RISK MANAGEMENT]
• Risk Per Trade: ${data.riskPerTrade}
• Risk / Reward Ratio: ${data.riskReward}
• Maximum Daily Loss: ${data.maxDailyLoss}
• Maximum Trades Per Day: ${data.maxTradesPerDay}
• Maximum Open Positions: ${data.maxOpenPositions}
• Consecutive Loss Protection: ${data.consecutiveLossProtection}
• Position Sizing Model: ${data.positionSizing}

[TRADE MANAGEMENT]
• Break-Even Mechanism: ${data.breakEven}
• Trailing Stop Mechanism: ${data.trailingStop}
• Order Handling: One trade per signal; strict duplicate position prevention.

[TRADING CONDITIONS]
• Permitted Sessions: ${data.sessions}
• Active Trading Days: ${data.tradingDays.join(', ')}
• Maximum Allowed Spread: ${data.maxSpread}
• Economic News Filter: ${data.newsFilter}

[FILTERS & RESTRICTIONS]
• Spread Protection: Block order placement if current spread exceeds ${data.maxSpread}.
• New Bar Evaluation: Run entry/exit checks strictly on bar open (isNewBar) unless tick execution is explicitly requested.

[EXECUTION REQUIREMENTS]
• Architecture: Standard MQL5 modular framework (OnInit, OnDeinit, OnTick).
• Position Management: Trade through CTrade class with proper magic number and slippage handling.
• Error Handling: Validate order return codes (trade server responses) and log diagnostics.

[EDGE CASES]
• Requote handling with exponential backoff retry.
• Weekend gap protection and Friday session closure if required.
• Prevent negative lot calculations or sizing below broker minimum lot limit.

[VALIDATION REQUIREMENTS]
• Clean compilation with 0 errors and 0 warnings in MetaEditor.
• 99.9% real tick-data backtest verification over multi-year market cycles.

[IMPORTANT IMPLEMENTATION RULES]
• The client's strategy description is the absolute source of truth.
• Do NOT add unsolicited indicators or modify risk parameters.
• Treat any "Not specified" parameter as an adjustable input parameter with a safe default.
`;
}

/**
 * Representation 2: VIEW AS CLEAR STRATEGY
 * Simple human-readable explanation of exactly what the client's strategy does.
 * Allows the client to verify: "Yes, this is exactly what I meant."
 */
export function buildClearStrategy(data: StructuredStrategyData): string {
  return `STRATEGY OVERVIEW
The automated system trades ${data.instrument} on the ${data.timeframe} timeframe${data.sessions !== 'Not specified' ? ` during ${data.sessions}` : ''}.

DIRECTION:
${data.direction}

ENTRY RULES:
${formatRulesList(data.entryRules)}

STOP LOSS:
${data.stopLoss}

TAKE PROFIT:
${data.takeProfit}

RISK MANAGEMENT:
• Risk Per Trade: ${data.riskPerTrade}
• Stop Loss: ${data.stopLoss}
• Take Profit: ${data.takeProfit}
• Risk/Reward: ${data.riskReward}
• Maximum Daily Loss: ${data.maxDailyLoss}
• Maximum Trades Per Day: ${data.maxTradesPerDay}
• Maximum Open Positions: ${data.maxOpenPositions}
• Consecutive Loss Protection: ${data.consecutiveLossProtection}

TRADE MANAGEMENT:
• Break-Even: ${data.breakEven}
• Trailing Stop: ${data.trailingStop}

TRADING CONDITIONS:
• Sessions: ${data.sessions}
• Trading Days: ${data.tradingDays.join(', ')}
• Spread Filter: ${data.maxSpread}
• News Filter: ${data.newsFilter}

ADDITIONAL RULES:
${data.additionalRules !== 'Not specified' ? data.additionalRules : 'No additional custom rules specified.'}
`;
}

function formatRulesList(rules: string): string {
  if (!rules || rules === 'Not specified') return '1. Not specified (defined by user).';
  const parts = rules.split(/;|\n|\. /).map(r => r.trim()).filter(Boolean);
  if (parts.length <= 1) return `1. ${rules}`;
  return parts.map((p, idx) => `${idx + 1}. ${p.replace(/^\d+\.\s*/, '')}`).join('\n');
}
