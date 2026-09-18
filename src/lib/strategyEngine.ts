/**
 * MEG.AI Strategy Intake & Extraction Engine — AI Strategy Architect
 * 
 * CORE PHILOSOPHY:
 * "The trader is the strategist. The AI is the clarification and structuring assistant."
 * The AI must NEVER take ownership of the strategy.
 * The AI must NEVER suggest new trading logic (no unsolicited RSI, EMA, ATR, filters, optimizations).
 * 
 * Flow:
 * TRADER'S IDEA
 * → CLARIFY THE TRADER'S OWN LOGIC
 * → STRUCTURE THE STRATEGY
 * → REFINED SPECIFICATION
 * → AI CODING PROMPT
 * → BUILD IT YOURSELF OR SUBMIT TO MEGA AI LABS FOR CUSTOM BUILD
 */

export interface StrategyComponent {
  id: string;
  key: string;
  label: string;
  value: string;
  category: 'market' | 'entry' | 'exit' | 'risk' | 'management' | 'operational' | 'indicator' | 'other';
  needsClarification?: boolean;
  clarificationQuestion?: string;
  suggestedOptions?: string[];
  isExplicitlyProvided: boolean;
}

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
  components: StrategyComponent[];
  clarifications: ClarificationItem[];
  status: 'STRATEGY READY FOR REVIEW' | 'CLARIFICATION REQUIRED';
  confidenceSummary: string;
}

export interface PricingFeatureItem {
  name: string;
  min: number;
  max: number;
}

export interface DevelopmentPricingEstimate {
  baseTierName: string;
  baseMin: number;
  baseMax: number;
  features: PricingFeatureItem[];
  totalMin: number;
  totalMax: number;
}

/**
 * Intelligent deterministic component extractor.
 * Adheres strictly to the user's explicit words.
 * NEVER invents indicators, filters, or missing logic.
 * Only outputs components relevant to the user's stated strategy.
 */
export function extractStrategyComponents(
  text: string,
  buildType: 'EA' | 'Indicator' = 'EA',
  existingComponents?: StrategyComponent[]
): {
  components: StrategyComponent[];
  clarifications: ClarificationItem[];
} {
  const desc = (text || '').trim();
  const lower = desc.toLowerCase();
  const isIndicator = buildType === 'Indicator';

  // Helper to check if an existing component was manually edited
  const getExistingVal = (key: string) => {
    return existingComponents?.find(c => c.key === key)?.value;
  };

  const components: StrategyComponent[] = [];
  const clarifications: ClarificationItem[] = [];

  // 1. INSTRUMENT / MARKET
  let instrumentVal = getExistingVal('instrument');
  if (!instrumentVal) {
    if (lower.includes('xauusd') || lower.includes('gold')) instrumentVal = 'XAUUSD (Gold)';
    else if (lower.includes('eurusd')) instrumentVal = 'EURUSD';
    else if (lower.includes('gbpusd')) instrumentVal = 'GBPUSD';
    else if (lower.includes('us30') || lower.includes('dow')) instrumentVal = 'US30 (Dow Jones)';
    else if (lower.includes('nas100') || lower.includes('nasdaq')) instrumentVal = 'NAS100 (Nasdaq)';
    else if (lower.includes('spx500') || lower.includes('s&p')) instrumentVal = 'SPX500 (S&P 500)';
    else if (lower.includes('btcusd') || lower.includes('bitcoin')) instrumentVal = 'BTCUSD';
    else if (lower.includes('usdjpy')) instrumentVal = 'USDJPY';
    else if (lower.includes('audusd')) instrumentVal = 'AUDUSD';
    else if (lower.includes('forex') || lower.includes('any pair') || lower.includes('multi-asset')) {
      instrumentVal = 'Multi-Asset / Configurable';
    }
  }

  if (instrumentVal) {
    components.push({
      id: 'comp-instrument',
      key: 'instrument',
      label: 'Market / Instrument',
      value: instrumentVal,
      category: 'market',
      isExplicitlyProvided: true,
    });
  } else {
    components.push({
      id: 'comp-instrument',
      key: 'instrument',
      label: 'Market / Instrument',
      value: '',
      category: 'market',
      needsClarification: true,
      clarificationQuestion: 'Which market or asset should this strategy be designed for? (e.g. XAUUSD, EURUSD, US30)',
      suggestedOptions: ['XAUUSD (Gold)', 'EURUSD', 'US30 (Dow)', 'Multi-Pair (Forex)'],
      isExplicitlyProvided: false,
    });
    clarifications.push({
      id: 'clarify-instrument',
      topic: 'MARKET / INSTRUMENT',
      question: 'Which market or asset should this strategy be designed for? (e.g. XAUUSD, EURUSD, US30)',
      status: 'REQUIRES CLARIFICATION',
      suggestedOptions: ['XAUUSD (Gold)', 'EURUSD', 'US30 (Dow)', 'Multi-Pair (Forex)'],
    });
  }

  // 2. TIMEFRAME
  let timeframeVal = getExistingVal('timeframe');
  if (!timeframeVal) {
    if (/\bm1\b/i.test(desc) || lower.includes('1 minute') || lower.includes('1-minute')) timeframeVal = '1 Minute (M1)';
    else if (/\bm5\b/i.test(desc) || lower.includes('5 minute') || lower.includes('5-minute')) timeframeVal = '5 Minutes (M5)';
    else if (/\bm15\b/i.test(desc) || lower.includes('15 minute') || lower.includes('15-minute')) timeframeVal = '15 Minutes (M15)';
    else if (/\bm30\b/i.test(desc) || lower.includes('30 minute') || lower.includes('30-minute')) timeframeVal = '30 Minutes (M30)';
    else if (/\bh1\b/i.test(desc) || lower.includes('1 hour') || lower.includes('1-hour') || lower.includes('hourly')) timeframeVal = '1 Hour (H1)';
    else if (/\bh4\b/i.test(desc) || lower.includes('4 hour') || lower.includes('4-hour')) timeframeVal = '4 Hours (H4)';
    else if (/\bd1\b/i.test(desc) || lower.includes('daily')) timeframeVal = 'Daily (D1)';
  }

  if (timeframeVal) {
    components.push({
      id: 'comp-timeframe',
      key: 'timeframe',
      label: 'Timeframe',
      value: timeframeVal,
      category: 'market',
      isExplicitlyProvided: true,
    });
  } else {
    components.push({
      id: 'comp-timeframe',
      key: 'timeframe',
      label: 'Timeframe',
      value: '',
      category: 'market',
      needsClarification: true,
      clarificationQuestion: 'What chart timeframe do you execute this strategy on? (e.g. M15, M5, H1)',
      suggestedOptions: ['15 Minutes (M15)', '5 Minutes (M5)', '1 Hour (H1)', '1 Minute (M1)'],
      isExplicitlyProvided: false,
    });
    clarifications.push({
      id: 'clarify-timeframe',
      topic: 'TIMEFRAME',
      question: 'What chart timeframe do you execute this strategy on? (e.g. M15, M5, H1)',
      status: 'REQUIRES CLARIFICATION',
      suggestedOptions: ['15 Minutes (M15)', '5 Minutes (M5)', '1 Hour (H1)', '1 Minute (M1)'],
    });
  }

  // 3. TRADING SESSION (Only display if user mentioned a session or breakout)
  let sessionVal = getExistingVal('sessions');
  if (!sessionVal) {
    const hasLondon = lower.includes('london');
    const hasNY = lower.includes('new york') || lower.includes('ny session') || lower.includes('ny open');
    const hasAsia = lower.includes('asian') || lower.includes('asia') || lower.includes('tokyo');
    if (hasLondon && hasAsia) sessionVal = 'London Session (trading Asian range)';
    else if (hasLondon && hasNY) sessionVal = 'London & New York Sessions';
    else if (hasLondon) sessionVal = 'London Session';
    else if (hasNY) sessionVal = 'New York Session';
    else if (hasAsia) sessionVal = 'Asian Session';
  }

  if (sessionVal) {
    components.push({
      id: 'comp-sessions',
      key: 'sessions',
      label: 'Trading Session',
      value: sessionVal,
      category: 'operational',
      isExplicitlyProvided: true,
    });
  }

  // 4. STRATEGY / SETUP
  let setupVal = getExistingVal('setup');
  if (!setupVal) {
    if (lower.includes('asian') && lower.includes('breakout')) setupVal = 'Asian Range Breakout';
    else if (lower.includes('liquidity sweep') || lower.includes('sweep')) setupVal = 'Liquidity Sweep';
    else if (lower.includes('fair value gap') || lower.includes('fvg')) setupVal = 'Fair Value Gap (FVG) Retest';
    else if (lower.includes('breakout')) setupVal = 'Key Level / Range Breakout';
    else if (lower.includes('crossover') || lower.includes('cross')) setupVal = 'Moving Average Crossover';
    else if (lower.includes('trend')) setupVal = 'Trend Following';
    else if (desc.length > 0) {
      setupVal = isIndicator ? 'Custom Indicator Signal Model' : 'Discretionary Trading Setup';
    }
  }

  if (setupVal) {
    components.push({
      id: 'comp-setup',
      key: 'setup',
      label: 'Setup / Model',
      value: setupVal,
      category: 'entry',
      isExplicitlyProvided: true,
    });
  }

  // 5. ENTRY LOGIC (Long & Short conditions)
  let entryVal = getExistingVal('entryRules');
  if (!entryVal) {
    const entryRules: string[] = [];
    if (lower.includes('buy above') || lower.includes('buy when')) {
      const match = desc.match(/buy\s+(above|when|if|on)\s+([^.,;\n]+)/i);
      if (match) entryRules.push(`Long: Buy ${match[1]} ${match[2].trim()}`);
    } else if (lower.includes('break') && (lower.includes('asian high') || lower.includes('asian session high'))) {
      entryRules.push('Long: Buy when price breaks above Asian high');
    }

    if (lower.includes('sell below') || lower.includes('sell when')) {
      const match = desc.match(/sell\s+(below|when|if|on)\s+([^.,;\n]+)/i);
      if (match) entryRules.push(`Short: Sell ${match[1]} ${match[2].trim()}`);
    } else if (lower.includes('break') && (lower.includes('asian low') || lower.includes('asian session low'))) {
      entryRules.push('Short: Sell when price breaks below Asian low');
    }

    if (entryRules.length > 0) {
      entryVal = entryRules.join(' | ');
    } else if (desc.length > 10) {
      entryVal = desc;
    }
  }

  if (entryVal) {
    components.push({
      id: 'comp-entry',
      key: 'entryRules',
      label: isIndicator ? 'Signal Generation Logic' : 'Entry Logic',
      value: entryVal,
      category: 'entry',
      isExplicitlyProvided: true,
    });
  } else {
    components.push({
      id: 'comp-entry',
      key: 'entryRules',
      label: isIndicator ? 'Signal Generation Logic' : 'Entry Logic',
      value: '',
      category: 'entry',
      needsClarification: true,
      clarificationQuestion: 'What exact market condition triggers an entry?',
      isExplicitlyProvided: false,
    });
  }

  // 6. CONFIRMATION RULES (Only if mentioned or explicitly relevant)
  let confirmVal = getExistingVal('confirmationRules');
  if (!confirmVal) {
    if (lower.includes('candle close') || lower.includes('bar close')) {
      confirmVal = 'Requires candle close confirmation';
    } else if (lower.includes('instant') || lower.includes('touch') || lower.includes('immediately')) {
      confirmVal = 'Enter immediately on price touch (no candle close wait)';
    } else if (lower.includes('retest')) {
      confirmVal = 'Enter on retest of the broken level';
    }
  }
  if (confirmVal) {
    components.push({
      id: 'comp-confirmation',
      key: 'confirmationRules',
      label: 'Confirmation Rule',
      value: confirmVal,
      category: 'entry',
      isExplicitlyProvided: true,
    });
  }

  // 7. STOP LOSS (EA ONLY)
  if (!isIndicator) {
    let slVal = getExistingVal('stopLoss');
    if (!slVal) {
      const slPipsMatch = desc.match(/stop\s*loss\s*(of|at|is)?\s*([0-9.]+)\s*pips?/i) || desc.match(/([0-9.]+)\s*pips?\s*stop/i);
      if (slPipsMatch) {
        slVal = `${slPipsMatch[slPipsMatch.length - 1]} Pips`;
      } else if (lower.includes('midpoint') || lower.includes('middle of the range')) {
        slVal = 'Asian range midpoint';
      } else if (lower.includes('opposite range') || lower.includes('opposite side of range')) {
        slVal = 'Opposite side of range';
      } else if (lower.includes('swing high') || lower.includes('swing low')) {
        slVal = 'Recent swing high / low';
      } else if (lower.includes('atr')) {
        const atrMatch = desc.match(/([0-9.]+)\s*(x|\*)\s*atr/i);
        slVal = atrMatch ? `${atrMatch[1]}x ATR` : 'ATR Dynamic Stop';
      }
    }

    if (slVal) {
      components.push({
        id: 'comp-stoploss',
        key: 'stopLoss',
        label: 'Stop Loss',
        value: slVal,
        category: 'exit',
        isExplicitlyProvided: true,
      });
    } else {
      components.push({
        id: 'comp-stoploss',
        key: 'stopLoss',
        label: 'Stop Loss',
        value: '',
        category: 'exit',
        needsClarification: true,
        clarificationQuestion: 'Where should the protective stop loss be placed? (e.g. Asian range midpoint, opposite range level, or recent swing?)',
        suggestedOptions: ['Asian range midpoint', 'Opposite side of the range', 'Recent swing high / low', 'Fixed Pips'],
        isExplicitlyProvided: false,
      });
      clarifications.push({
        id: 'clarify-stoploss',
        topic: 'STOP LOSS',
        question: 'Where should the protective stop loss be placed? (e.g. Asian range midpoint, opposite range level, or recent swing?)',
        status: 'REQUIRES CLARIFICATION',
        suggestedOptions: ['Asian range midpoint', 'Opposite side of the range', 'Recent swing high / low', 'Fixed Pips'],
      });
    }
  }

  // 8. EXIT LOGIC / TAKE PROFIT (EA ONLY)
  if (!isIndicator) {
    let exitVal = getExistingVal('exitRules') || getExistingVal('takeProfit');
    if (!exitVal) {
      if (lower.includes('opposite side of the range') || lower.includes('opposite range') || lower.includes('opposite side of range')) {
        exitVal = 'Exit at opposite side of the range';
      } else {
        const rMatch = desc.match(/([0-9.]+)\s*r\b/i) || desc.match(/1\s*:\s*([0-9.]+)/i);
        if (rMatch) {
          exitVal = `${rMatch[1]}R Take Profit`;
        } else {
          const tpPipMatch = desc.match(/take\s*profit\s*(of|at|is)?\s*([0-9.]+)\s*pips?/i) || desc.match(/([0-9.]+)\s*pips?\s*(tp|take profit)/i);
          if (tpPipMatch) {
            exitVal = `${tpPipMatch[tpPipMatch.length - 1]} Pips Take Profit`;
          }
        }
      }
    }

    if (exitVal) {
      components.push({
        id: 'comp-exit',
        key: 'exitRules',
        label: 'Exit Logic / Take Profit',
        value: exitVal,
        category: 'exit',
        isExplicitlyProvided: true,
      });
    } else {
      components.push({
        id: 'comp-exit',
        key: 'exitRules',
        label: 'Exit Logic / Take Profit',
        value: '',
        category: 'exit',
        needsClarification: true,
        clarificationQuestion: 'What is the exit condition or Take Profit target for the trade?',
        suggestedOptions: ['Opposite side of the range', 'Fixed Risk/Reward (e.g. 1:2 R/R)', 'Fixed Pips', 'Opposite Signal'],
        isExplicitlyProvided: false,
      });
      clarifications.push({
        id: 'clarify-exit',
        topic: 'EXIT LOGIC',
        question: 'What is the exit condition or Take Profit target for the trade?',
        status: 'REQUIRES CLARIFICATION',
        suggestedOptions: ['Opposite side of the range', 'Fixed Risk/Reward (e.g. 1:2 R/R)', 'Fixed Pips', 'Opposite Signal'],
      });
    }
  }

  // 9. RISK MANAGEMENT / POSITION SIZING (EA ONLY)
  if (!isIndicator) {
    let riskVal = getExistingVal('riskPerTrade');
    if (!riskVal) {
      const riskMatch = desc.match(/risk\s*([0-9.]+)\s*%/i) || desc.match(/([0-9.]+)\s*%\s*(risk|per trade|equity)/i);
      if (riskMatch) {
        riskVal = `${riskMatch[1]}% per trade`;
      } else if (lower.includes('fixed lot') || desc.match(/([0-9.]+)\s*lots?/i)) {
        const lotMatch = desc.match(/([0-9.]+)\s*lots?/i);
        riskVal = lotMatch ? `${lotMatch[1]} Fixed Lots` : 'Fixed Lot Sizing';
      }
    }

    if (riskVal) {
      components.push({
        id: 'comp-risk',
        key: 'riskPerTrade',
        label: 'Risk Management',
        value: riskVal,
        category: 'risk',
        isExplicitlyProvided: true,
      });
    } else {
      components.push({
        id: 'comp-risk',
        key: 'riskPerTrade',
        label: 'Risk Management',
        value: '',
        category: 'risk',
        needsClarification: true,
        clarificationQuestion: 'What risk percentage or lot sizing would you like to use per trade?',
        suggestedOptions: ['1% per trade', '0.5% per trade', '2% per trade', 'Fixed Lot Size (e.g. 0.1)'],
        isExplicitlyProvided: false,
      });
      clarifications.push({
        id: 'clarify-risk',
        topic: 'RISK MANAGEMENT',
        question: 'What risk percentage or lot sizing would you like to use per trade?',
        status: 'REQUIRES CLARIFICATION',
        suggestedOptions: ['1% per trade', '0.5% per trade', '2% per trade', 'Fixed Lot Size (e.g. 0.1)'],
      });
    }
  }

  // 10. TRADE MANAGEMENT (Break-even, Trailing Stop — ONLY if mentioned)
  if (!isIndicator) {
    let beVal = getExistingVal('breakEven');
    if (!beVal && (lower.includes('break even') || lower.includes('breakeven'))) {
      const beMatch = desc.match(/at\s*([0-9.]+)\s*r/i) || desc.match(/after\s*([0-9.]+)\s*pips/i);
      beVal = beMatch ? `Move to Break-Even at ${beMatch[0]}` : 'Move Stop Loss to Break-Even once in profit';
    }
    if (beVal) {
      components.push({
        id: 'comp-breakeven',
        key: 'breakEven',
        label: 'Break-Even Rule',
        value: beVal,
        category: 'management',
        isExplicitlyProvided: true,
      });
    }

    let trailVal = getExistingVal('trailingStop');
    if (!trailVal && (lower.includes('trail') || lower.includes('trailing'))) {
      const trailAtr = desc.match(/trail.*([0-9.]+)\s*(x|\*)\s*atr/i);
      trailVal = trailAtr ? `Trailing Stop: ${trailAtr[1]}x ATR` : 'Active Trailing Stop';
    }
    if (trailVal) {
      components.push({
        id: 'comp-trailing',
        key: 'trailingStop',
        label: 'Trailing Stop Rule',
        value: trailVal,
        category: 'management',
        isExplicitlyProvided: true,
      });
    }
  }

  // 11. NEWS RESTRICTIONS (ONLY if mentioned)
  let newsVal = getExistingVal('newsFilter');
  if (!newsVal && (lower.includes('news') || lower.includes('nfp') || lower.includes('cpi') || lower.includes('fomc'))) {
    newsVal = 'Do not trade during high-impact news events';
  }
  if (newsVal) {
    components.push({
      id: 'comp-news',
      key: 'newsFilter',
      label: 'News Restriction',
      value: newsVal,
      category: 'operational',
      isExplicitlyProvided: true,
    });
  }

  // 12. MAXIMUM TRADES / DAILY LOSS (ONLY if mentioned)
  if (!isIndicator) {
    let maxTradesVal = getExistingVal('maxTradesPerDay');
    if (!maxTradesVal && (lower.includes('trades a day') || lower.includes('trades per day') || lower.includes('one trade'))) {
      const match = desc.match(/([0-9]+)\s*trades?\s*(per|a)\s*day/i) || desc.match(/one trade/i);
      maxTradesVal = match ? (match[0].toLowerCase().includes('one') ? '1 trade per day maximum' : `${match[1]} trades per day maximum`) : 'Daily trade limit';
    }
    if (maxTradesVal) {
      components.push({
        id: 'comp-maxtrades',
        key: 'maxTradesPerDay',
        label: 'Daily Trade Limit',
        value: maxTradesVal,
        category: 'operational',
        isExplicitlyProvided: true,
      });
    }

    let dailyLossVal = getExistingVal('maxDailyLoss');
    if (!dailyLossVal && (lower.includes('daily loss') || lower.includes('max loss'))) {
      const match = desc.match(/([0-9.]+)\s*%\s*(max\s*)?daily\s*loss/i) || desc.match(/daily\s*loss.*([0-9.]+)\s*%/i);
      dailyLossVal = match ? `${match[1]}% Max Daily Loss Guard` : 'Max Daily Loss Protection';
    }
    if (dailyLossVal) {
      components.push({
        id: 'comp-dailyloss',
        key: 'maxDailyLoss',
        label: 'Max Daily Loss Guard',
        value: dailyLossVal,
        category: 'risk',
        isExplicitlyProvided: true,
      });
    }
  }

  // 13. INDICATOR-SPECIFIC COMPONENTS
  if (isIndicator) {
    let plotVal = getExistingVal('indicatorPlots');
    if (!plotVal) {
      const plots: string[] = [];
      if (lower.includes('arrow')) plots.push('Signal Arrows (Buy / Sell)');
      if (lower.includes('box') || lower.includes('zone') || lower.includes('fvg')) plots.push('Dynamic Range / Zone Boxes');
      if (lower.includes('line')) plots.push('Custom Indicator Plot Lines');
      if (lower.includes('histogram')) plots.push('Oscillator Histogram');
      plotVal = plots.length > 0 ? plots.join(', ') : 'Signal Arrows & Chart Overlay Markers';
    }
    components.push({
      id: 'comp-plots',
      key: 'indicatorPlots',
      label: 'Visual Display & Plots',
      value: plotVal,
      category: 'indicator',
      isExplicitlyProvided: true,
    });

    let alertVal = getExistingVal('alertTypes');
    if (!alertVal) {
      const alerts: string[] = [];
      if (lower.includes('push') || lower.includes('mobile')) alerts.push('Mobile Push Notification');
      if (lower.includes('sound') || lower.includes('audio')) alerts.push('Audio Chime');
      if (lower.includes('popup') || lower.includes('dialog')) alerts.push('Terminal Popup Alert');
      if (lower.includes('email')) alerts.push('Email Notification');
      alertVal = alerts.length > 0 ? alerts.join(', ') : 'Terminal Popup & Sound Alert';
    }
    components.push({
      id: 'comp-alerts',
      key: 'alertTypes',
      label: 'Alert Notifications',
      value: alertVal,
      category: 'indicator',
      isExplicitlyProvided: true,
    });
  }

  return { components, clarifications };
}

/**
 * Builds the clean "YOUR REFINED STRATEGY" specification.
 * Contains ONLY the user's defined trading logic.
 * Language remains completely faithful to the user's original strategy.
 */
export function buildRefinedStrategySpecification(
  components: StrategyComponent[],
  buildType: 'EA' | 'Indicator' = 'EA',
  originalIdea: string = ''
): string {
  const lines: string[] = [];

  lines.push(`YOUR REFINED STRATEGY`);
  lines.push(`==================================================`);
  lines.push(`TYPE: ${buildType === 'Indicator' ? 'Technical Indicator' : 'Expert Advisor (Automated Trading Strategy)'}`);

  if (originalIdea.trim()) {
    lines.push(``);
    lines.push(`ORIGINAL TRADER IDEA:`);
    lines.push(`"${originalIdea.trim()}"`);
  }

  // Render components by logical groupings
  const renderedKeys = new Set<string>();

  const renderComponent = (comp: StrategyComponent) => {
    if (!comp || renderedKeys.has(comp.key)) return;
    renderedKeys.add(comp.key);
    lines.push(``);
    lines.push(`${comp.label.toUpperCase()}`);
    lines.push(comp.value || (comp.needsClarification ? '[Needs clarification]' : 'Not specified'));
  };

  // 1. Market & Timeframe
  components.filter(c => c.category === 'market').forEach(renderComponent);

  // 2. Operational & Session
  components.filter(c => c.category === 'operational').forEach(renderComponent);

  // 3. Setup & Entry
  components.filter(c => c.category === 'entry').forEach(renderComponent);

  // 4. Stop Loss & Exit
  components.filter(c => c.category === 'exit').forEach(renderComponent);

  // 5. Risk
  components.filter(c => c.category === 'risk').forEach(renderComponent);

  // 6. Management
  components.filter(c => c.category === 'management').forEach(renderComponent);

  // 7. Indicator-specific
  components.filter(c => c.category === 'indicator').forEach(renderComponent);

  // 8. Any other custom user-added rules
  components.filter(c => !renderedKeys.has(c.key)).forEach(renderComponent);

  return lines.join('\n');
}

/**
 * Generates a comprehensive, 20-section implementation-ready AI Coding Prompt
 * for ChatGPT, Claude, Gemini, or other LLMs.
 * 
 * DIRECTIVES:
 * - The trader's refined specification is the ONLY source of truth.
 * - The AI must NOT invent or add trading logic.
 * - Dynamic: omits irrelevant sections (e.g. EA orders for indicators, Pine Script specifics for MT5).
 * - Acts as a professional developer handoff document.
 */
export function buildRefinedCodingPrompt(
  components: StrategyComponent[],
  buildType: 'EA' | 'Indicator' = 'EA',
  originalIdea: string = '',
  platform: string = 'MT5'
): string {
  const getComp = (key: string) => components.find(c => c.key === key)?.value || '';

  const instrument = getComp('instrument') || 'Trader specified in specification';
  const timeframe = getComp('timeframe') || 'Trader specified in specification';
  const direction = getComp('direction') || 'Long & Short';
  const sessions = getComp('sessions');
  const tradingDays = getComp('tradingDays');
  const setup = getComp('setup') || 'Defined in specification below';
  const entryRules = getComp('entryRules') || 'Defined in specification below';
  const confirmation = getComp('confirmationRules');
  const entryTrigger = getComp('entryTriggerType') || 'Candle Close';
  const stopLoss = getComp('stopLoss');
  const takeProfit = getComp('takeProfit');
  const exitRules = getComp('exitRules');
  const risk = getComp('riskPerTrade');
  const breakEven = getComp('breakEven');
  const trailingStop = getComp('trailingStop');
  const news = getComp('newsFilter');
  const maxTrades = getComp('maxTradesPerDay');
  const maxDailyLoss = getComp('maxDailyLoss');
  const maxSpread = getComp('maxSpread');
  const plots = getComp('indicatorPlots');
  const alerts = getComp('alertTypes');
  const additionalRules = getComp('additionalRules');

  const isIndicator = buildType === 'Indicator';
  const isPineScript = platform === 'TradingView';

  // Language mapping
  const languageMap: Record<string, string> = {
    'MT5': 'MQL5 (MetaTrader 5)',
    'MT4': 'MQL4 (MetaTrader 4)',
    'TradingView': 'Pine Script v5 (TradingView)',
    'cTrader': 'C# (.NET / cTrader Automate)',
  };
  const targetLang = languageMap[platform] || 'MQL5 (MetaTrader 5)';

  // Program Type
  let programType = 'Expert Advisor (Automated Trading Robot)';
  if (isIndicator) {
    programType = isPineScript ? 'TradingView Indicator' : 'Technical Indicator';
  } else if (isPineScript) {
    programType = 'TradingView Strategy (strategy.*)';
  }

  // Section 1: Role
  const roleText = isIndicator
    ? `You are a senior algorithmic trading and technical indicator developer specializing in ${targetLang}. Your task is to write clean, modular, production-ready, non-repainting indicator code strictly based on the trader's verified strategy specification below.`
    : `You are a senior quantitative developer and automated execution engineer specializing in ${targetLang}. Your task is to write clean, robust, institutional-grade automated trading code strictly based on the trader's verified strategy specification below.`;

  // Section 5: Strategy Overview
  const strategyOverview = [
    setup ? `• Model Setup: ${setup}` : '',
    entryRules ? `• Signal Trigger: ${entryRules}` : '',
    confirmation ? `• Confirmation: ${confirmation}` : '',
    stopLoss ? `• Stop Loss: ${stopLoss}` : '',
    (takeProfit || exitRules) ? `• Exit Target: ${takeProfit || exitRules}` : '',
    originalIdea.trim() ? `• Original Trader Intent: "${originalIdea.trim()}"` : '',
  ].filter(Boolean).join('\n');

  // Section 6: User-Defined Inputs
  const userInputs: string[] = [];
  components
    .filter(c => c.value && c.value.trim().length > 0)
    .forEach((c) => {
      userInputs.push(
        `- Input Name: ${c.label} (${c.key})\n  • What it controls: Configurable setting for ${c.label.toLowerCase()}\n  • Specified Value: "${c.value}"\n  • Configurable: Yes\n  • Note: Use this exact specified value; do NOT invent a different default.`
      );
    });

  // Section 7: Market / Symbol Conditions
  const marketConditions = [
    `• Instrument / Symbol: ${instrument}`,
    `• Execution Timeframe: ${timeframe}`,
    `• Allowed Trade Direction: ${direction}`,
    sessions ? `• Active Trading Session(s): ${sessions}` : '• Active Trading Session(s): Any session unless restricted by user inputs',
    tradingDays ? `• Active Trading Days: ${tradingDays}` : '',
    maxSpread ? `• Maximum Allowable Spread: ${maxSpread}` : '',
  ].filter(Boolean).join('\n');

  // Section 8: Calculations
  const calculationsList: string[] = [];
  if (setup.toLowerCase().includes('high') || setup.toLowerCase().includes('low') || setup.toLowerCase().includes('breakout') || setup.toLowerCase().includes('range')) {
    calculationsList.push('1. Price Extremum Calculation: Accurately compute session or bar high/low boundaries strictly according to the stated timeframe.');
  }
  if (setup.toLowerCase().includes('moving average') || setup.toLowerCase().includes('ema') || setup.toLowerCase().includes('sma')) {
    calculationsList.push('2. Moving Average Formula: Compute moving average values using standard mathematical smoothing as specified.');
  }
  if (setup.toLowerCase().includes('atr') || stopLoss.toLowerCase().includes('atr') || trailingStop.toLowerCase().includes('atr')) {
    calculationsList.push('3. Volatility / ATR Metric: Calculate Average True Range (ATR) strictly over the user-defined period for buffer or trailing calculations.');
  }
  if (risk && !isIndicator) {
    calculationsList.push(`4. Position Sizing Calculation: Compute exact order volume from the user-specified risk rule ("${risk}") relative to the distance between entry price and Stop Loss price. Ensure broker lot-step rounding and minimum/maximum volume limits.`);
  }
  if (calculationsList.length === 0) {
    calculationsList.push(`1. Calculate technical setup conditions strictly matching: "${setup}". DO NOT introduce unrequested indicators or mathematical formulas.`);
  }

  // Section 9: Entry Logic (Numbered format)
  const entryLines: string[] = [];
  entryLines.push('LONG ENTRY CONDITIONS:');
  entryLines.push(`1. Direction filter allows Long trades (Direction = "${direction}").`);
  entryLines.push(`2. Market setup condition is satisfied: ${setup}.`);
  entryLines.push(`3. Specific Long trigger occurs: ${entryRules}.`);
  if (confirmation) {
    entryLines.push(`4. Confirmation rule is verified: ${confirmation}.`);
  }
  entryLines.push(`5. Trigger timing: Enter strictly on ${entryTrigger}.`);
  entryLines.push('');
  entryLines.push('SHORT ENTRY CONDITIONS:');
  entryLines.push(`1. Direction filter allows Short trades (Direction = "${direction}").`);
  entryLines.push(`2. Market setup condition is satisfied: ${setup}.`);
  entryLines.push(`3. Specific Short trigger occurs: ${entryRules}.`);
  if (confirmation) {
    entryLines.push(`4. Confirmation rule is verified: ${confirmation}.`);
  }
  entryLines.push(`5. Trigger timing: Enter strictly on ${entryTrigger}.`);

  // Section 10: Exit Logic
  const exitLines: string[] = [];
  if (stopLoss) exitLines.push(`• Stop Loss: ${stopLoss}`);
  if (takeProfit) exitLines.push(`• Take Profit: ${takeProfit}`);
  if (exitRules && exitRules !== takeProfit) exitLines.push(`• Additional Exit Rules: ${exitRules}`);
  if (breakEven) exitLines.push(`• Break-Even Exit: Move Stop Loss to entry price when price reaches ${breakEven}`);
  if (trailingStop) exitLines.push(`• Trailing Stop Exit: Trail Stop Loss by ${trailingStop}`);

  // Section 11: Risk Management
  const riskLines: string[] = [];
  if (risk) riskLines.push(`• Risk Per Trade: ${risk}`);
  if (maxTrades) riskLines.push(`• Maximum Trades Per Day: ${maxTrades}`);
  if (maxDailyLoss) riskLines.push(`• Maximum Daily Loss / Drawdown Limit: ${maxDailyLoss}`);
  if (news) riskLines.push(`• News Restriction: ${news}`);

  // Section 12: Trade Management
  const tradeMgmtLines: string[] = [];
  if (breakEven) tradeMgmtLines.push(`• Break-Even Modification: When profit reaches ${breakEven}, modify position Stop Loss to entry price (plus optional spread buffer). Ensure modification occurs once only.`);
  if (trailingStop) tradeMgmtLines.push(`• Trailing Stop Adjustment: Continuously update position Stop Loss by ${trailingStop} strictly after favorable market progression.`);
  if (tradeMgmtLines.length === 0) {
    tradeMgmtLines.push('• Maintain position until either defined Stop Loss or Take Profit is struck. No unrequested trade modifications.');
  }

  // Section 13: Session / Time Logic
  const sessionLines: string[] = [];
  if (sessions) {
    sessionLines.push(`• Trading Sessions: ${sessions}`);
    sessionLines.push('• New entries are strictly restricted to the specified session hours.');
    sessionLines.push('• Timezone handling: Expose session start hour/minute and end hour/minute as configurable broker-time inputs. Do not hardcode an assumed local timezone.');
  } else {
    sessionLines.push('• No restrictive session window specified; allow evaluation across all active market hours.');
  }

  // Section 14: Indicator Visuals (Only if Indicator or visual plots defined)
  const visualLines: string[] = [];
  if (isIndicator || plots) {
    visualLines.push(plots || '• Signal arrows, visual highlight markers, and level lines matching the setup rules.');
    visualLines.push('• Use distinct, high-contrast colors for bullish vs. bearish plots.');
    visualLines.push('• Ensure visual buffers are non-repainting on confirmed closed bars.');
  }

  // Section 15: Alerts
  const alertLines: string[] = [];
  if (alerts) {
    alertLines.push(`• Alert Types: ${alerts}`);
  } else {
    alertLines.push('• Provide standard terminal popup and sound alert when a verified entry signal occurs on candle close.');
  }
  if (isPineScript) {
    alertLines.push('• Include alertcondition() calls with dynamic placeholders ({{ticker}}, {{close}}, {{time}}).');
  }

  // Section 16: EA-Specific Requirements (Only if EA)
  const eaRequirements: string[] = [];
  if (!isIndicator) {
    eaRequirements.push('1. Magic Number & Identifier: Provide unique integer Magic Number input to track and manage this strategy\'s orders independently.');
    eaRequirements.push('2. Duplicate Trade Prevention: Prevent multiple simultaneous entries on the same bar or for the same signal event.');
    eaRequirements.push('3. Execution & Deviation: Use standard slippage/deviation settings suitable for market execution.');
    eaRequirements.push('4. Spread Protection: Check current spread before executing; abort if spread exceeds the user-defined maximum.');
    eaRequirements.push('5. Instrument & Timeframe Isolation: Ensure logic calculates on the chart symbol and chart period unless explicitly multi-timeframe.');
    if (platform === 'MT5') {
      eaRequirements.push('6. MQL5 Architecture: Utilize CTrade standard library class for order management, with proper MqlTradeRequest and MqlTradeResult handling.');
    } else if (platform === 'MT4') {
      eaRequirements.push('6. MQL4 Architecture: Utilize OrderSend, OrderClose, OrderModify with ticket tracking and GetLastError() logging.');
    } else if (isPineScript) {
      eaRequirements.push('6. TradingView Strategy Architecture: Utilize strategy.entry(), strategy.exit(), strategy.close() with calc_on_order_fills=true.');
    }
  }

  // Construct structured prompt output
  const sections: string[] = [];

  sections.push(`================================================================================
AI CODING PROMPT — ${programType.toUpperCase()}
================================================================================

[SECTION 1: ROLE / OBJECTIVE]
${roleText}

[SECTION 2: PLATFORM]
${platform}

[SECTION 3: PROGRAM TYPE]
${programType}

[SECTION 4: PROGRAMMING LANGUAGE]
${targetLang}

[SECTION 5: STRATEGY OVERVIEW]
${strategyOverview || 'Refer to the comprehensive technical rules detailed below.'}

[SECTION 6: USER-DEFINED INPUTS]
List of parameters explicitly defined by the trader to expose as configurable inputs:
${userInputs.length > 0 ? userInputs.join('\n\n') : 'No custom numerical inputs specified; expose standard period, stop loss, and risk inputs.'}
* DIRECTIVE: Expose these as configurable inputs. DO NOT invent default values or thresholds where the user did not provide one.

[SECTION 7: MARKET / SYMBOL CONDITIONS]
${marketConditions}

[SECTION 8: CALCULATIONS]
Implement the following mathematical and technical calculations required by the strategy:
${calculationsList.join('\n')}
* DIRECTIVE: Explain and calculate precisely how these values are derived. DO NOT introduce calculations that were not specified by the trader.

[SECTION 9: ENTRY LOGIC]
Translate the trader's entry conditions into precise implementation rules:
${entryLines.join('\n')}
* DIRECTIVE: Do NOT add confirmation rules, indicators, moving averages, RSI, or filters that the trader did not explicitly specify.`);

  // Section 10: Exit Logic (Omit if indicator with no trade exits)
  if (!isIndicator && exitLines.length > 0) {
    sections.push(`[SECTION 10: EXIT LOGIC]
Clearly define every exit condition specified by the trader:
${exitLines.join('\n')}
* DIRECTIVE: Only include the exit mechanisms actually specified above. Do not add arbitrary take profit or trailing rules.`);
  }

  // Section 11: Risk Management (Omit if indicator)
  if (!isIndicator && riskLines.length > 0) {
    sections.push(`[SECTION 11: RISK MANAGEMENT]
Implement the user's specified risk and exposure controls:
${riskLines.join('\n')}
* DIRECTIVE: Adhere strictly to the stated risk parameters. Do not invent missing rules.`);
  }

  // Section 12: Trade Management (Omit if indicator)
  if (!isIndicator) {
    sections.push(`[SECTION 12: TRADE MANAGEMENT]
Post-entry position management lifecycle:
${tradeMgmtLines.join('\n')}
* DIRECTIVE: Execute only the specified post-entry actions.`);
  }

  // Section 13: Session / Time Logic
  sections.push(`[SECTION 13: SESSION / TIME LOGIC]
Timing and session parameters:
${sessionLines.join('\n')}`);

  // Section 14: Indicator Visuals (Include if indicator or plots defined)
  if (isIndicator || visualLines.length > 0) {
    sections.push(`[SECTION 14: INDICATOR VISUALS]
Chart presentation requirements:
${visualLines.join('\n')}`);
  }

  // Section 15: Alerts
  sections.push(`[SECTION 15: ALERTS]
Notification and alert triggers:
${alertLines.join('\n')}`);

  // Section 16: EA-Specific Requirements (Omit if indicator)
  if (!isIndicator) {
    sections.push(`[SECTION 16: EA-SPECIFIC IMPLEMENTATION REQUIREMENTS]
Execution safety and system infrastructure:
${eaRequirements.join('\n')}
* IMPORTANT: These are technical implementation details required to safely execute the defined strategy. They must NOT be used to invent new trading logic.`);
  }

  // Section 17: Code Quality Requirements
  sections.push(`[SECTION 17: CODE QUALITY REQUIREMENTS]
1. Produce complete, working, compilable code without placeholders, omitted functions, or "insert logic here" comments.
2. Structure the code modularly (Initialization, Main Event Handler, Signal Evaluation, Execution/Visuals, Cleanup).
3. Use descriptive, professional variable and function naming.
4. Add clear comments mapping each block of code directly to the trader's rules.
5. Avoid unnecessary complexity or external library dependencies beyond standard platform libraries.`);

  // Section 18: Error Handling
  sections.push(`[SECTION 18: ERROR HANDLING]
${isIndicator 
  ? '1. Handle array out-of-bound errors and division-by-zero checks gracefully.\n2. Ensure proper handling of history download delays (prev_calculated / bar_index checks).\n3. Protect against uninitialized buffer values.' 
  : '1. Check return codes on all trade orders (e.g. TRADE_RETCODE_DONE in MQL5, ERR_NO_ERROR in MQL4).\n2. Implement retry logic for transient broker errors (requotes, busy trade server).\n3. Validate price distances against broker FreezeLevel and StopLevel before placing or modifying stops.\n4. Protect against zero-divide in lot sizing formulas.'}`);

  // Section 19: Testing Requirements
  sections.push(`[SECTION 19: TESTING CHECKLIST]
Verify that the generated code passes the following test criteria:
• Signal Verification: Long and Short signals trigger at the exact conditions defined in Section 9.
• Bar Close Confirmation: Logic checks bar completion before executing if candle close trigger is specified.
${!isIndicator ? '• Stop Loss & Take Profit: Verified on every opened trade.\n• Risk Calculation: Dynamic lots adjust accurately to account balance/equity changes.\n• Spread Filter: Blocks entries when market spread widens beyond specified limit.\n• One Trade Per Signal: Duplicate orders are prevented.' : '• Non-Repainting: Historical buffer values remain static after candle close.\n• Visual Clarity: Chart plots, arrows, and lines appear correctly without visual clutter.'}
• Alert Accuracy: Triggers fire at the exact moment of signal verification.`);

  // Section 20: Important Implementation Rules
  sections.push(`[SECTION 20: IMPORTANT IMPLEMENTATION RULES]
• "Do not add, remove, optimize, reinterpret, or modify any trading rule contained in the specification."
• "The specification is the source of truth."
• "If something is genuinely ambiguous, identify the ambiguity before making a trading assumption."
• "Do not introduce indicators, filters, confirmations, exits, risk rules or other strategy logic that are not contained in the specification."
================================================================================`);

  return sections.join('\n\n');
}

/**
 * Calculates transparent development pricing range reusing the existing Custom EA pricing structure.
 * Basic tier: From $149 (was $299)
 * Intermediate tier: From $299 (was $599)
 * Advanced tier: From $499 (was $999)
 */
export function calculateDevelopmentPricingEstimate(
  components: StrategyComponent[],
  buildType: 'EA' | 'Indicator' = 'EA'
): DevelopmentPricingEstimate {
  const isIndicator = buildType === 'Indicator';

  if (isIndicator) {
    const features: PricingFeatureItem[] = [];
    const hasZones = components.some(c => c.value.toLowerCase().includes('zone') || c.value.toLowerCase().includes('box') || c.value.toLowerCase().includes('fvg'));
    const hasAlerts = components.some(c => c.value.toLowerCase().includes('push') || c.value.toLowerCase().includes('sound') || c.value.toLowerCase().includes('popup'));
    const hasMultiTf = components.some(c => c.value.toLowerCase().includes('multi') || c.value.toLowerCase().includes('mtf'));

    if (hasZones) features.push({ name: 'Dynamic Chart Window Retest & Box Plots', min: 25, max: 40 });
    if (hasAlerts) features.push({ name: 'Multi-Channel Alert Suite (Mobile Push / Popup / Sound)', min: 20, max: 35 });
    if (hasMultiTf) features.push({ name: 'Multi-Timeframe Buffer Calculation Engine', min: 35, max: 55 });

    const baseMin = 129;
    const baseMax = 199;
    const featMin = features.reduce((acc, f) => acc + f.min, 0);
    const featMax = features.reduce((acc, f) => acc + f.max, 0);

    return {
      baseTierName: 'Custom Indicator Architecture',
      baseMin,
      baseMax,
      features,
      totalMin: baseMin + featMin,
      totalMax: baseMax + featMax,
    };
  }

  // EA Calculation
  const hasSessionBreakout = components.some(c => c.key === 'sessions' || c.value.toLowerCase().includes('asian') || c.value.toLowerCase().includes('breakout'));
  const hasDynamicExit = components.some(c => c.key === 'exitRules' && (c.value.toLowerCase().includes('opposite') || c.value.toLowerCase().includes('range')));
  const hasBreakEven = components.some(c => c.key === 'breakEven');
  const hasTrailing = components.some(c => c.key === 'trailingStop');
  const hasNews = components.some(c => c.key === 'newsFilter');
  const hasMultiCondition = components.length >= 7;

  // Determine base tier from existing Custom EA pricing
  let baseTierName = 'BASIC EA DEVELOPMENT';
  let baseMin = 149;
  let baseMax = 249;

  if (hasMultiCondition || (hasBreakEven && hasTrailing)) {
    baseTierName = 'INTERMEDIATE EA DEVELOPMENT';
    baseMin = 299;
    baseMax = 449;
  }

  const features: PricingFeatureItem[] = [];
  if (hasSessionBreakout) {
    features.push({ name: 'Session Range Tracking & Breakout Engine', min: 35, max: 55 });
  }
  if (hasDynamicExit) {
    features.push({ name: 'Dynamic Opposite-Range Exit Logic', min: 25, max: 40 });
  }
  if (hasBreakEven) {
    features.push({ name: 'Automated Break-Even Profit Safeguard', min: 20, max: 35 });
  }
  if (hasTrailing) {
    features.push({ name: 'Dynamic Trailing Stop Engine', min: 25, max: 40 });
  }
  if (hasNews) {
    features.push({ name: 'Economic News Calendar Guard', min: 30, max: 45 });
  }

  const featMin = features.reduce((acc, f) => acc + f.min, 0);
  const featMax = features.reduce((acc, f) => acc + f.max, 0);

  return {
    baseTierName,
    baseMin,
    baseMax,
    features,
    totalMin: baseMin + featMin,
    totalMax: baseMax + featMax,
  };
}

/**
 * Backward compatibility function: converts StrategyComponent[] to StructuredStrategyData
 */
export function componentsToStructuredData(
  components: StrategyComponent[],
  buildType: 'EA' | 'Indicator',
  description: string
): StructuredStrategyData {
  const getVal = (key: string) => components.find(c => c.key === key)?.value || '';

  return {
    buildType,
    primaryDescription: description,
    instrument: getVal('instrument') || 'Not specified',
    timeframe: getVal('timeframe') || 'Not specified',
    direction: (getVal('direction') as any) || 'Long & Short',
    setup: getVal('setup') || 'Defined in specification',
    entryRules: getVal('entryRules') || 'Defined in specification',
    exitRules: getVal('exitRules') || 'Defined in specification',
    stopLoss: getVal('stopLoss') || 'Defined in specification',
    takeProfit: getVal('exitRules') || 'Defined in specification',
    riskPerTrade: getVal('riskPerTrade') || 'Defined in specification',
    riskReward: getVal('riskReward') || 'Defined by user',
    maxDailyLoss: getVal('maxDailyLoss') || 'N/A',
    maxDailyProfit: 'N/A',
    maxTradesPerDay: getVal('maxTradesPerDay') || 'N/A',
    maxOpenPositions: '1 concurrent position',
    breakEven: getVal('breakEven') || 'N/A',
    trailingStop: getVal('trailingStop') || 'N/A',
    sessions: getVal('sessions') || 'N/A',
    tradingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    newsFilter: getVal('newsFilter') || 'N/A',
    maxSpread: 'Dynamic broker spread guard',
    additionalRules: 'Defined in specification',
    consecutiveLossProtection: 'N/A',
    positionSizing: `Calculated from ${getVal('riskPerTrade') || 'risk rule'}`,
    maxExposure: 'Standard',
    indicatorPlots: getVal('indicatorPlots'),
    alertTypes: getVal('alertTypes'),
    calculationMethod: 'Bar close execution',
    windowType: 'Chart Window',
    repaintPolicy: 'Strict Non-Repainting (Bar Close)',
    maxBarsCalculate: '1000 Bars',
  };
}

/**
 * Backward-compatibility wrapper for extractTechnicalDetailsFromDescription
 */
export function extractTechnicalDetailsFromDescription(
  text: string,
  existingOverrides?: Partial<StructuredStrategyData>,
  buildTypeOverride?: 'EA' | 'Indicator'
): StrategyExtractionResult {
  const buildType = buildTypeOverride || existingOverrides?.buildType || 'EA';
  const { components, clarifications } = extractStrategyComponents(text, buildType);
  const structured = componentsToStructuredData(components, buildType, text);

  return {
    structured,
    components,
    clarifications,
    status: clarifications.length > 0 ? 'CLARIFICATION REQUIRED' : 'STRATEGY READY FOR REVIEW',
    confidenceSummary: `Extracted ${components.length} explicit strategy components.`,
  };
}

/**
 * Backward-compatibility wrapper for buildDevPrompt
 */
export function buildDevPrompt(data: StructuredStrategyData): string {
  const components: StrategyComponent[] = [
    { id: '1', key: 'instrument', label: 'Market / Instrument', value: data.instrument, category: 'market', isExplicitlyProvided: true },
    { id: '2', key: 'timeframe', label: 'Timeframe', value: data.timeframe, category: 'market', isExplicitlyProvided: true },
    { id: '3', key: 'setup', label: 'Setup / Model', value: data.setup, category: 'entry', isExplicitlyProvided: true },
    { id: '4', key: 'entryRules', label: 'Entry Logic', value: data.entryRules, category: 'entry', isExplicitlyProvided: true },
    { id: '5', key: 'stopLoss', label: 'Stop Loss', value: data.stopLoss, category: 'exit', isExplicitlyProvided: true },
    { id: '6', key: 'exitRules', label: 'Exit Logic', value: data.exitRules, category: 'exit', isExplicitlyProvided: true },
    { id: '7', key: 'riskPerTrade', label: 'Risk Management', value: data.riskPerTrade, category: 'risk', isExplicitlyProvided: true },
  ];
  if (data.sessions && data.sessions !== 'N/A') components.push({ id: '8', key: 'sessions', label: 'Trading Session', value: data.sessions, category: 'operational', isExplicitlyProvided: true });
  if (data.breakEven && data.breakEven !== 'N/A') components.push({ id: '9', key: 'breakEven', label: 'Break-Even', value: data.breakEven, category: 'management', isExplicitlyProvided: true });
  if (data.trailingStop && data.trailingStop !== 'N/A') components.push({ id: '10', key: 'trailingStop', label: 'Trailing Stop', value: data.trailingStop, category: 'management', isExplicitlyProvided: true });
  if (data.newsFilter && data.newsFilter !== 'N/A') components.push({ id: '11', key: 'newsFilter', label: 'News Filter', value: data.newsFilter, category: 'operational', isExplicitlyProvided: true });

  return buildRefinedCodingPrompt(components, data.buildType || 'EA', data.primaryDescription, 'MT5');
}

/**
 * Backward-compatibility wrapper for buildIndicatorDevPrompt
 */
export function buildIndicatorDevPrompt(data: StructuredStrategyData): string {
  return buildDevPrompt(data);
}

/**
 * Backward-compatibility wrapper for buildClearStrategy
 */
export function buildClearStrategy(data: StructuredStrategyData): string {
  const components: StrategyComponent[] = [
    { id: '1', key: 'instrument', label: 'Market / Instrument', value: data.instrument, category: 'market', isExplicitlyProvided: true },
    { id: '2', key: 'timeframe', label: 'Timeframe', value: data.timeframe, category: 'market', isExplicitlyProvided: true },
    { id: '3', key: 'setup', label: 'Setup / Model', value: data.setup, category: 'entry', isExplicitlyProvided: true },
    { id: '4', key: 'entryRules', label: 'Entry Logic', value: data.entryRules, category: 'entry', isExplicitlyProvided: true },
    { id: '5', key: 'stopLoss', label: 'Stop Loss', value: data.stopLoss, category: 'exit', isExplicitlyProvided: true },
    { id: '6', key: 'exitRules', label: 'Exit Logic', value: data.exitRules, category: 'exit', isExplicitlyProvided: true },
    { id: '7', key: 'riskPerTrade', label: 'Risk Management', value: data.riskPerTrade, category: 'risk', isExplicitlyProvided: true },
  ];
  if (data.sessions && data.sessions !== 'N/A') components.push({ id: '8', key: 'sessions', label: 'Trading Session', value: data.sessions, category: 'operational', isExplicitlyProvided: true });
  return buildRefinedStrategySpecification(components, data.buildType || 'EA', data.primaryDescription);
}

/**
 * Backward-compatibility wrapper for buildIndicatorClearStrategy
 */
export function buildIndicatorClearStrategy(data: StructuredStrategyData): string {
  return buildClearStrategy(data);
}
