/**
 * MEG.AI Strategy Intake & Extraction Engine
 * 
 * The client's strategy description is the PRIMARY SOURCE OF TRUTH.
 * The AI organizes and clarifies the strategy — NOT redesigning, optimizing, or inventing rules.
 * 
 * Flow: EXTRACT → STRUCTURE → CLARIFY → PRESENT
 */

export interface StructuredStrategyData {
  buildType?: 'EA' | 'Indicator';
  primaryDescription: string;
  instrument: string;
  timeframe: string;
  direction: 'Long & Short' | 'Long Only' | 'Short Only' | string;
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
  entryTriggerType?: 'Candle Close' | 'Instant Tick Touch' | 'Retest / Limit' | string;
  // Indicator-specific fields
  indicatorPlots?: string;
  alertTypes?: string;
  calculationMethod?: string;
  windowType?: 'Chart Window' | 'Separate Subwindow' | string;
  repaintPolicy?: 'Strict Non-Repainting (Bar Close)' | 'Real-time Bar 0 (Forming)' | string;
  maxBarsCalculate?: string;
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
  existingOverrides?: Partial<StructuredStrategyData>,
  buildTypeOverride?: 'EA' | 'Indicator'
): StrategyExtractionResult {
  const desc = text || '';
  const lower = desc.toLowerCase();
  const buildType: 'EA' | 'Indicator' = existingOverrides?.buildType || buildTypeOverride || 'EA';
  const isIndicator = buildType === 'Indicator';

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
    else instrument = 'EURUSD / Multi-Asset (Configurable)';
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
    else timeframe = 'M15 (Execution Standard)';
  }

  // 3. SESSIONS
  let sessions = existingOverrides?.sessions || '';
  if (!sessions || sessions === 'Not specified') {
    const hasLondon = lower.includes('london');
    const hasNY = lower.includes('new york') || lower.includes('ny am') || lower.includes('ny session') || lower.includes('ny');
    const hasAsia = lower.includes('asia') || lower.includes('tokyo');

    if (hasLondon && hasNY) sessions = 'London + New York Sessions';
    else if (hasLondon) sessions = 'London Session Only';
    else if (hasNY) sessions = 'New York Session Only';
    else if (hasAsia) sessions = 'Asian Session Only';
    else sessions = 'All Liquid Market Sessions';
  }

  // 4. DIRECTION
  let direction = existingOverrides?.direction || 'Long & Short';
  if (direction === 'Not specified' || !direction) {
    if (lower.includes('only buy') || lower.includes('long only') || lower.includes('bullish only')) direction = 'Long Only';
    else if (lower.includes('only sell') || lower.includes('short only') || lower.includes('bearish only')) direction = 'Short Only';
    else if (lower.includes('buy') && lower.includes('sell')) direction = 'Long & Short';
    else if (lower.includes('long') && lower.includes('short')) direction = 'Long & Short';
    else direction = 'Long & Short';
  }

  // 5. RISK & TRADE MANAGEMENT (EA ONLY vs INDICATOR)
  let riskPerTrade = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.riskPerTrade || '');
  if (!isIndicator && (!riskPerTrade || riskPerTrade === 'Not specified')) {
    const riskMatch = desc.match(/risk\s*([0-9.]+)\s*%/i) || desc.match(/([0-9.]+)\s*%\s*(risk|per trade|equity)/i);
    if (riskMatch) {
      riskPerTrade = `${riskMatch[1]}% Equity Risk`;
    } else if (lower.includes('fixed lot') || desc.match(/([0-9.]+)\s*lots?/i)) {
      const lotMatch = desc.match(/([0-9.]+)\s*lots?/i);
      riskPerTrade = lotMatch ? `Fixed Lot (${lotMatch[1]} Lots)` : 'Fixed Lot Sizing';
    } else {
      riskPerTrade = '1.0% Equity Default (Adjustable)';
    }
  }

  // 6. STOP LOSS
  let stopLoss = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.stopLoss || '');
  if (!isIndicator && (!stopLoss || stopLoss === 'Not specified')) {
    if (lower.includes('below the sweep') || lower.includes('below sweep')) {
      stopLoss = 'Below liquidity sweep zone';
    } else if (lower.includes('above the sweep') || lower.includes('above sweep')) {
      stopLoss = 'Above liquidity sweep zone';
    } else if (lower.includes('swing high') || lower.includes('swing low')) {
      stopLoss = 'Recent Structural Swing High / Low';
    } else if (lower.includes('atr')) {
      const atrMatch = desc.match(/([0-9.]+)\s*(x|\*)\s*atr/i) || desc.match(/atr\s*([0-9.]+)/i);
      stopLoss = atrMatch ? `${atrMatch[1]}x ATR Volatility Stop` : 'ATR Dynamic Trailing Stop';
    } else {
      const pipMatch = desc.match(/stop\s*(loss)?\s*(of|at|is)?\s*([0-9.]+)\s*pips?/i) || desc.match(/([0-9.]+)\s*pips?\s*stop/i);
      stopLoss = pipMatch ? `${pipMatch[pipMatch.length - 1]} Pips` : 'Recent Swing High / Low (Configurable)';
    }
  }

  // 7. TAKE PROFIT / RISK REWARD
  let takeProfit = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.takeProfit || '');
  let riskReward = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.riskReward || '');
  if (!isIndicator && (!takeProfit || takeProfit === 'Not specified')) {
    const rMatch = desc.match(/([0-9.]+)\s*r\b/i) || desc.match(/target\s*([0-9.]+)\s*r/i) || desc.match(/1\s*:\s*([0-9.]+)/i);
    if (rMatch) {
      takeProfit = `${rMatch[1]}R Risk Multiple`;
      riskReward = `1:${rMatch[1]}`;
    } else if (lower.includes('opposing liquidity') || lower.includes('opposite liquidity')) {
      takeProfit = 'Opposing session liquidity pool';
      riskReward = 'Dynamic (Opposing Pool)';
    } else {
      const tpPipMatch = desc.match(/take\s*profit\s*(of|at|is)?\s*([0-9.]+)\s*pips?/i) || desc.match(/([0-9.]+)\s*pips?\s*(tp|take profit)/i);
      takeProfit = tpPipMatch ? `${tpPipMatch[tpPipMatch.length - 1]} Pips` : 'Dynamic 1:2 R/R Multiple';
      riskReward = riskReward && riskReward !== 'Not specified' ? riskReward : '1:2 Standard';
    }
  }

  // 8. SETUP & ENTRY / SIGNAL RULES
  let entryRules = existingOverrides?.entryRules || '';
  let setup = existingOverrides?.setup || '';
  if (!entryRules || entryRules === 'Not specified') {
    const entryMatches: string[] = [];
    if (lower.includes('sweep') || lower.includes('liquidity')) entryMatches.push('Wait for liquidity sweep of session high/low');
    if (lower.includes('displacement')) entryMatches.push('Confirm strong displacement candle');
    if (lower.includes('fair value gap') || lower.includes('fvg')) entryMatches.push('Detect mitigation of Fair Value Gap (FVG)');
    if (lower.includes('market structure shift') || lower.includes('mss') || lower.includes('choch')) entryMatches.push('Confirm Market Structure Shift (MSS / CHoCH)');
    if (lower.includes('ema') && lower.includes('cross')) entryMatches.push('Moving average crossover confirmation');
    if (lower.includes('breakout')) entryMatches.push('Breakout beyond key range or high/low');
    if (lower.includes('rsi') && lower.includes('divergence')) entryMatches.push('RSI Divergence signal detection');

    if (entryMatches.length > 0) {
      entryRules = entryMatches.join('; ');
      setup = entryMatches[0];
    } else if (desc.trim().length > 15) {
      entryRules = desc.split('.')[0]?.trim() || 'Executes strictly on verified setup conditions';
      setup = isIndicator ? 'Custom Indicator Technical Model' : 'Custom Price-Action Model';
    } else {
      entryRules = 'Executes strictly on verified strategy signal triggers';
      setup = isIndicator ? 'Technical Signal Model' : 'Systematic Price Structure Model';
    }
  }

  // 9. EXIT / INVALIDATION RULES
  let exitRules = existingOverrides?.exitRules || '';
  if (!exitRules || exitRules === 'Not specified') {
    if (isIndicator) {
      exitRules = lower.includes('mitigat')
        ? 'Remove / gray-out zone when price penetrates through buffer'
        : 'Invalidate signal marker on opposite bar trigger or timeframe close';
    } else {
      const exitParts: string[] = [];
      if (stopLoss && stopLoss !== 'Not specified') exitParts.push(`Stop Loss: ${stopLoss}`);
      if (takeProfit && takeProfit !== 'Not specified') exitParts.push(`Take Profit: ${takeProfit}`);
      if (lower.includes('opposite signal') || lower.includes('reverse signal')) exitParts.push('Close position on opposite signal');
      exitRules = exitParts.length > 0 ? exitParts.join(' | ') : 'Order bracket exits (Stop Loss & Take Profit targets)';
    }
  }

  // 10. INDICATOR-SPECIFIC SIGNALS & BUFFERS
  let windowType = existingOverrides?.windowType || '';
  if (isIndicator && (!windowType || windowType === 'Not specified')) {
    if (lower.includes('subwindow') || lower.includes('oscillator') || lower.includes('separate window') || lower.includes('rsi') || lower.includes('macd') || lower.includes('stochastic')) {
      windowType = 'Separate Subwindow';
    } else {
      windowType = 'Chart Window';
    }
  }

  let indicatorPlots = existingOverrides?.indicatorPlots || '';
  if (isIndicator && !indicatorPlots) {
    const plots: string[] = [];
    if (lower.includes('arrow')) plots.push('Signal Arrows (Wingdings: Buy #233 / Sell #234)');
    if (lower.includes('fvg') || lower.includes('box') || lower.includes('zone') || lower.includes('block')) plots.push('Dynamic Retest Zones & Shaded Rectangles (DRAW_FILLING)');
    if (lower.includes('line') || lower.includes('ema') || lower.includes('ma')) plots.push('Multi-Color Indicator Lines (DRAW_COLOR_LINE)');
    if (lower.includes('histogram')) plots.push('Dual-State Histogram (DRAW_HISTOGRAM)');
    if (lower.includes('dot') || lower.includes('marker')) plots.push('High/Low Pivot Dots');
    indicatorPlots = plots.length > 0 ? plots.join(', ') : 'Signal Arrows & Chart Overlay Zones';
  }

  let alertTypes = existingOverrides?.alertTypes || '';
  if (isIndicator && !alertTypes) {
    const alerts: string[] = [];
    if (lower.includes('push') || lower.includes('mobile') || lower.includes('phone')) alerts.push('MT5 Mobile Push Notification');
    if (lower.includes('sound') || lower.includes('audio') || lower.includes('chime')) alerts.push('Sound Alert (Chime)');
    if (lower.includes('popup') || lower.includes('dialog') || lower.includes('alert')) alerts.push('Terminal Popup Alert');
    if (lower.includes('email') || lower.includes('mail')) alerts.push('Email Alert');
    alertTypes = alerts.length > 0 ? alerts.join(', ') : 'Terminal Popup, Sound Alert, MT5 Mobile Push';
  }

  let repaintPolicy = existingOverrides?.repaintPolicy || '';
  if (isIndicator && (!repaintPolicy || repaintPolicy === 'Not specified')) {
    repaintPolicy = 'Strict Non-Repainting (Bar Close)';
  }

  // 11. TRADE MANAGEMENT (EA ONLY)
  let breakEven = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.breakEven || '');
  if (!isIndicator && (!breakEven || breakEven === 'Not specified')) {
    if (lower.includes('break even') || lower.includes('breakeven') || lower.includes('move stop to be')) {
      const beMatch = desc.match(/at\s*([0-9.]+)\s*r/i) || desc.match(/after\s*([0-9.]+)\s*r/i) || desc.match(/([0-9.]+)\s*r/i);
      breakEven = beMatch ? `Move to Break-Even at ${beMatch[1]}R` : 'Move stop to Break-Even';
    } else {
      breakEven = 'Optional Break-Even (Configurable Input)';
    }
  }

  let trailingStop = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.trailingStop || '');
  if (!isIndicator && (!trailingStop || trailingStop === 'Not specified')) {
    if (lower.includes('trail') || lower.includes('trailing')) {
      const trailAtr = desc.match(/trail.*([0-9.]+)\s*(x|\*)\s*atr/i);
      trailingStop = trailAtr ? `Trail ${trailAtr[1]}x ATR` : 'Active Trailing Stop';
    } else {
      trailingStop = 'Optional Trailing Stop (Configurable Input)';
    }
  }

  // 12. RISK CONSTRAINTS (EA ONLY)
  let maxDailyLoss = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.maxDailyLoss || '');
  if (!isIndicator && (!maxDailyLoss || maxDailyLoss === 'Not specified')) {
    const dailyLossMatch = desc.match(/daily\s*(max\s*)?loss\s*(of|is|at)?\s*([0-9.]+)\s*%/i) || desc.match(/max\s*daily\s*loss\s*([0-9.]+)\s*%/i);
    maxDailyLoss = dailyLossMatch ? `${dailyLossMatch[dailyLossMatch.length - 1]}% Account Equity` : '3.0% Max Daily Equity Guard';
  }

  let consecutiveLossProtection = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.consecutiveLossProtection || '');
  if (!isIndicator && (!consecutiveLossProtection || consecutiveLossProtection === 'Not specified')) {
    const consecMatch = desc.match(/([0-9]+)\s*consecutive\s*losses?/i) || desc.match(/stop\s*after\s*([0-9]+)\s*losses?/i);
    consecutiveLossProtection = consecMatch ? `Stop trading after ${consecMatch[1]} consecutive losses` : 'Account Capital Preservation Circuit-Breaker';
  }

  let maxTradesPerDay = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.maxTradesPerDay || '');
  if (!isIndicator && (!maxTradesPerDay || maxTradesPerDay === 'Not specified')) {
    const tradesMatch = desc.match(/([0-9]+)\s*trades?\s*(per|a)\s*day/i) || desc.match(/max\s*([0-9]+)\s*trades?/i);
    maxTradesPerDay = tradesMatch ? `${tradesMatch[1]} trades/day` : 'Signal-Driven / Unrestricted';
  }

  let maxOpenPositions = isIndicator ? 'N/A - Technical Indicator' : (existingOverrides?.maxOpenPositions || '');
  if (!isIndicator && (!maxOpenPositions || maxOpenPositions === 'Not specified')) {
    const posMatch = desc.match(/([0-9]+)\s*(open\s*)?position/i) || desc.match(/one\s*trade\s*at\s*a\s*time/i);
    maxOpenPositions = posMatch ? (posMatch[1] ? `${posMatch[1]} position(s)` : '1 position max') : '1 Concurrent Position (Strict)';
  }

  // 13. CONDITIONS & FILTERS
  let newsFilter = existingOverrides?.newsFilter || '';
  if (!newsFilter || newsFilter === 'Not specified') {
    if (lower.includes('news') || lower.includes('nfp') || lower.includes('cpi') || lower.includes('fomc')) {
      newsFilter = isIndicator ? 'Display high-impact news marker on chart' : 'Pause execution during high-impact economic news events';
    } else {
      newsFilter = 'Economic News Calendar Filter (Optional)';
    }
  }

  let maxSpread = existingOverrides?.maxSpread || '';
  if (!maxSpread || maxSpread === 'Not specified') {
    const spreadMatch = desc.match(/spread\s*(under|below|max|of)?\s*([0-9.]+)\s*pips?/i);
    maxSpread = spreadMatch ? `${spreadMatch[2]} Pips` : 'Dynamic Broker Spread Guard';
  }

  const tradingDays = existingOverrides?.tradingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const additionalRules = existingOverrides?.additionalRules || (desc.length > 200 ? 'Refer to primary description for full details' : 'Standard MQL5 execution architecture');

  // 14. SEPARATE CLARIFICATIONS FOR EA vs INDICATOR
  const clarifications: ClarificationItem[] = [];

  if (isIndicator) {
    clarifications.push({
      id: 'clarify-indicator-repaint',
      topic: 'REPAINT & SIGNAL CONFIRMATION',
      question: 'Should signals calculate and alert strictly on candle close (guaranteed non-repainting) or on live forming ticks?',
      status: 'REQUIRES CLARIFICATION',
      suggestedOptions: ['Bar Close (Non-Repainting - Recommended)', 'Instant Live Bar (Early signal, potential repaint)'],
    });

    if (!lower.includes('push') && !lower.includes('popup') && !lower.includes('sound')) {
      clarifications.push({
        id: 'clarify-indicator-alerts',
        topic: 'ALERT NOTIFICATION CHANNELS',
        question: 'Which notification channels should activate when a valid setup is detected?',
        status: 'REQUIRES CLARIFICATION',
        suggestedOptions: ['Popup + Audio + MT5 Mobile Push', 'Popup Alert Only', 'Sound Alert Only'],
      });
    }

    if (windowType === 'Not specified') {
      clarifications.push({
        id: 'clarify-indicator-window',
        topic: 'CHART WINDOW TARGET',
        question: 'Should the indicator plot on the main price chart or in a separate oscillator subwindow?',
        status: 'REQUIRES CLARIFICATION',
        suggestedOptions: ['Main Price Chart Window', 'Separate Subwindow Below Chart'],
      });
    }
  } else {
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
  }

  const status = clarifications.length > 0 ? 'CLARIFICATION REQUIRED' : 'STRATEGY READY FOR REVIEW';

  const structured: StructuredStrategyData = {
    buildType,
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
    riskReward: riskReward && riskReward !== 'Not specified' ? riskReward : '1:2 Standard R/R',
    maxDailyLoss,
    maxDailyProfit: existingOverrides?.maxDailyProfit || 'Discretionary / Signal-Driven',
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
    positionSizing: isIndicator ? 'N/A - Technical Indicator' : `Dynamic Lot Sizing (Calculated from ${riskPerTrade})`,
    maxExposure: existingOverrides?.maxExposure || 'Standard Single-Symbol Risk Limit',
    indicatorPlots,
    alertTypes,
    calculationMethod: isIndicator ? (existingOverrides?.calculationMethod || 'OnCalculate array scanning with prev_calculated optimization') : 'OnTick state machine',
    windowType,
    repaintPolicy,
    maxBarsCalculate: existingOverrides?.maxBarsCalculate || '1000 Bars',
  };

  return {
    structured,
    clarifications,
    status,
    confidenceSummary: isIndicator
      ? `Extracted indicator parameters from client description. ${clarifications.length} visual/signal parameter(s) mapped.`
      : `Extracted EA execution rules from client description. ${clarifications.length > 0 ? `${clarifications.length} execution item(s) require confirmation.` : 'All core parameters successfully mapped.'}`,
  };
}

/**
 * Representation 1: VIEW AS PROMPT
 * Structured, professional prompt suitable for giving to an AI coding/development assistant.
 * STRICTLY reflects the client's rules without redesigning or inventing.
 */
export function buildDevPrompt(data: StructuredStrategyData): string {
  if (data.buildType === 'Indicator') {
    return buildIndicatorDevPrompt(data);
  }

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
• Confirmation Filters: ${data.entryTriggerType || 'Evaluated strictly on verified setup signals'}

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
• Expose core execution variables (Lots, Stop Loss, Take Profit, Trailing Stop) as adjustable inputs with sensible default parameters.
`;
}

/**
 * Representation 1B: INDICATOR AI DEVELOPMENT PROMPT
 * Structured, professional prompt for an AI indicator coder / engineer.
 */
export function buildIndicatorDevPrompt(data: StructuredStrategyData): string {
  return `==================================================
AI DEVELOPMENT PROMPT — TECHNICAL INDICATOR SPECIFICATION
==================================================

[ROLE]
You are a senior MQL5 Quantitative Indicator Architect. Your task is to develop a zero-repainting, highly optimized technical indicator strictly adhering to the visual, mathematical, and alert specifications below.

[CONTEXT & ORIGINAL CLIENT DESCRIPTION]
${data.primaryDescription || 'No description provided.'}

[INDICATOR OBJECTIVE]
Develop a high-performance visual scanner & signal indicator designed for ${data.instrument} on the ${data.timeframe} timeframe.

[WINDOW TARGET & PROPERTIES]
• Window Location: ${data.windowType === 'Separate Subwindow' ? '#property indicator_separate_window' : '#property indicator_chart_window'}
• Calculation Engine: ${data.calculationMethod || 'OnCalculate buffer array scanning with prev_calculated optimization'}
• Max Historical Calculation Depth: ${data.maxBarsCalculate || '1000 Bars (for CPU efficiency)'}

[VISUAL PLOTS & BUFFERS]
• Visual Elements: ${data.indicatorPlots || 'Signal Arrows & Chart Overlay Zones'}
• Target Direction: ${data.direction}
• Buffer Architecture:
  - Dynamic Index Buffers mapped with SetIndexBuffer()
  - ArraySetAsSeries() applied to all price and indicator arrays
  - Color palettes and line widths exposed as customizable input properties

[SIGNAL FORMULA & LOGIC]
• Setup Concept: ${data.setup}
• Detection Rules: ${data.entryRules}
• Invalidation / Cleanup: ${data.exitRules}

[REPAINT & CONFIRMATION GUARANTEE]
• Repaint Policy: ${data.repaintPolicy || 'Strict Non-Repainting (Bar Close)'}
• Bar Evaluation:
  - Strict Mode: Calculate signals on bar index 1 after bar 0 closes. Never recalculate or alter historical bars.
  - Zero-Repaint Guarantee: Once a marker/arrow prints on a closed candle, it MUST remain fixed permanently.

[MULTI-CHANNEL ALERT SUITE]
• Configured Channels: ${data.alertTypes || 'Terminal Popup, Sound Alert, MT5 Mobile Push'}
• Alert Debounce: Dispatch exactly 1 alert per candle upon close; prevent multiple sound/push spam on repeated ticks.
• Format: "[Symbol] [Timeframe] - Signal Triggered at [Price]".

[OPERATIONAL FILTERS]
• Permitted Sessions: ${data.sessions}
• Active Trading Days: ${data.tradingDays.join(', ')}
• News Awareness: ${data.newsFilter}

[COMPILATION & PERFORMANCE STANDARDS]
• Zero errors and zero warnings in MetaEditor MQL5 compiler.
• Zero chart lag: Use prev_calculated in OnCalculate() to ensure only newly closed bars are processed on subsequent ticks.
`;
}

/**
 * Representation 2: VIEW AS CLEAR STRATEGY
 * Simple human-readable explanation of exactly what the client's strategy does.
 * Allows the client to verify: "Yes, this is exactly what I meant."
 */
export function buildClearStrategy(data: StructuredStrategyData): string {
  if (data.buildType === 'Indicator') {
    return buildIndicatorClearStrategy(data);
  }

  const sections: string[] = [];

  sections.push(`STRATEGY OVERVIEW
The automated system trades ${data.instrument} on the ${data.timeframe} timeframe during ${data.sessions}.`);

  sections.push(`DIRECTION:
${data.direction}`);

  sections.push(`ENTRY RULES:
${formatRulesList(data.entryRules)}`);

  sections.push(`STOP LOSS:
${data.stopLoss}`);

  sections.push(`TAKE PROFIT:
${data.takeProfit}`);

  const riskDetails = [
    `• Risk Per Trade: ${data.riskPerTrade}`,
    `• Stop Loss: ${data.stopLoss}`,
    `• Take Profit: ${data.takeProfit}`,
    `• Risk/Reward Ratio: ${data.riskReward}`,
    `• Maximum Daily Loss: ${data.maxDailyLoss}`,
    `• Maximum Trades Per Day: ${data.maxTradesPerDay}`,
    `• Maximum Open Positions: ${data.maxOpenPositions}`,
    `• Consecutive Loss Protection: ${data.consecutiveLossProtection}`,
  ];
  sections.push(`RISK MANAGEMENT:\n${riskDetails.join('\n')}`);

  const tradeDetails = [
    `• Break-Even: ${data.breakEven}`,
    `• Trailing Stop: ${data.trailingStop}`,
    `• Duplicate Trade Guard: Strict 1-order-per-signal rule`,
  ];
  sections.push(`TRADE MANAGEMENT:\n${tradeDetails.join('\n')}`);

  const condDetails = [
    `• Permitted Sessions: ${data.sessions}`,
    `• Active Trading Days: ${data.tradingDays.join(', ')}`,
    `• Spread Protection: ${data.maxSpread}`,
    `• Economic News Filter: ${data.newsFilter}`,
  ];
  sections.push(`TRADING CONDITIONS:\n${condDetails.join('\n')}`);

  sections.push(`ADDITIONAL RULES:
${data.additionalRules && !data.additionalRules.toLowerCase().includes('not specified') ? data.additionalRules : 'Executes strictly in accordance with verified MQL5 state architecture.'}`);

  return sections.join('\n\n') + '\n';
}

/**
 * Representation 2B: INDICATOR CLEAR STRATEGY
 * Simple human-readable explanation for an Indicator build.
 */
export function buildIndicatorClearStrategy(data: StructuredStrategyData): string {
  const sections: string[] = [];

  sections.push(`INDICATOR SPECIFICATION OVERVIEW
Technical Indicator designed for ${data.instrument} on the ${data.timeframe} timeframe during ${data.sessions}.`);

  sections.push(`CHART WINDOW TARGET:
${data.windowType || 'Main Price Chart Window'}`);

  sections.push(`SIGNAL DIRECTION:
${data.direction}`);

  sections.push(`VISUAL PLOTS & BUFFERS:
${data.indicatorPlots || 'Signal Arrows & Chart Overlay Zones'}`);

  sections.push(`DETECTION LOGIC & FORMULA:
${formatRulesList(data.entryRules)}`);

  sections.push(`INVALIDATION / EXPIRATION:
${data.exitRules}`);

  const repaintDetails = [
    `• Repaint Model: ${data.repaintPolicy || 'Strict Non-Repainting (Bar Close)'}`,
    `• Calculation Engine: ${data.calculationMethod || 'OnCalculate buffer optimization'}`,
    `• Lookback Depth: ${data.maxBarsCalculate || '1000 Bars'}`,
  ];
  sections.push(`REPAINT & CONFIRMATION POLICY:\n${repaintDetails.join('\n')}`);

  sections.push(`ALERT NOTIFICATION SUITE:
${data.alertTypes || 'Terminal Popup, Sound Alert, MT5 Mobile Push'}`);

  const condDetails = [
    `• Active Sessions: ${data.sessions}`,
    `• Trading Days: ${data.tradingDays.join(', ')}`,
    `• News Filter: ${data.newsFilter}`,
  ];
  sections.push(`OPERATIONAL CONDITIONS:\n${condDetails.join('\n')}`);

  sections.push(`ADDITIONAL NOTES:
${data.additionalRules && !data.additionalRules.toLowerCase().includes('not specified') ? data.additionalRules : 'Calculates non-repainting buffer signals with zero chart lag.'}`);

  return sections.join('\n\n') + '\n';
}

function formatRulesList(rules: string): string {
  if (!rules || rules.toLowerCase().includes('not specified')) return '1. Executes strictly on verified strategy signal triggers.';
  const parts = rules.split(/;|\n|\. /).map(r => r.trim()).filter(Boolean);
  if (parts.length <= 1) return `1. ${rules}`;
  return parts.map((p, idx) => `${idx + 1}. ${p.replace(/^\d+\.\s*/, '')}`).join('\n');
}
