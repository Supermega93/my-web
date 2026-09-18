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
 * Generates the detailed AI Coding Prompt for Claude, ChatGPT, Gemini, or other LLMs.
 * Preserves the user's strategy exactly. Instructs LLM to clarify rather than invent.
 */
export function buildRefinedCodingPrompt(
  components: StrategyComponent[],
  buildType: 'EA' | 'Indicator' = 'EA',
  originalIdea: string = '',
  platform: string = 'MT5'
): string {
  const getComp = (key: string) => components.find(c => c.key === key)?.value || '';

  const instrument = getComp('instrument') || 'Defined in specification';
  const timeframe = getComp('timeframe') || 'Defined in specification';
  const sessions = getComp('sessions');
  const setup = getComp('setup') || 'Defined in specification';
  const entryRules = getComp('entryRules') || 'Defined in specification';
  const confirmation = getComp('confirmationRules');
  const stopLoss = getComp('stopLoss') || 'Defined in specification';
  const exitRules = getComp('exitRules') || 'Defined in specification';
  const risk = getComp('riskPerTrade') || 'Defined in specification';
  const breakEven = getComp('breakEven');
  const trailingStop = getComp('trailingStop');
  const news = getComp('newsFilter');
  const maxTrades = getComp('maxTradesPerDay');
  const maxDailyLoss = getComp('maxDailyLoss');
  const plots = getComp('indicatorPlots');
  const alerts = getComp('alertTypes');

  const languageMap: Record<string, string> = {
    'MT5': 'MQL5 (MetaTrader 5)',
    'MT4': 'MQL4 (MetaTrader 4)',
    'TradingView': 'Pine Script v5 (TradingView)',
    'cTrader': 'C# (.NET / cTrader Automate)',
  };
  const targetLang = languageMap[platform] || 'MQL5 (MetaTrader 5)';

  if (buildType === 'Indicator') {
    return `==================================================
AI CODING PROMPT — TECHNICAL INDICATOR SPECIFICATION
==================================================

[ROLE]
You are a senior algorithmic trading and indicator programmer specializing in ${targetLang}.
Your task is to write clean, modular, production-ready indicator code strictly based on the trader's verified strategy specification below.

[PHILOSOPHY & DIRECTIVES]
The trader is the strategist. The specification below is the absolute source of truth.
• DO NOT add unsolicited indicators or filters that the trader did not request.
• DO NOT invent new calculation conditions or alter visual rules.
• Ensure the indicator is strictly NON-REPAINTING on closed bars.
• If any technical parameter required to compile the code is missing or ambiguous, ask the trader for clarification rather than assuming or inventing a value.

[ORIGINAL TRADER IDEA]
"${originalIdea.trim() || 'Refer to refined specification below.'}"

[TARGET SPECIFICATION]
• Target Platform: ${platform}
• Programming Language: ${targetLang}
• Instrument / Market: ${instrument}
• Timeframe: ${timeframe}
${sessions ? `• Active Sessions: ${sessions}` : ''}
• Core Setup Model: ${setup}
• Detection / Signal Logic: ${entryRules}
${confirmation ? `• Confirmation Rule: ${confirmation}` : ''}
• Visual Plots & Overlay: ${plots || 'Signal arrows / visual markers on chart'}
• Alerts & Notifications: ${alerts || 'Terminal popup and sound alert on candle close'}

[IMPLEMENTATION REQUIREMENTS]
1. Write complete, robust, compilable code without placeholders or omitted functions.
2. Ensure calculation performance is optimized (e.g. use prev_calculated in MQL or barstate in Pine Script).
3. Expose key visual inputs (colors, line widths, arrow codes, alert toggles) as configurable user inputs.
4. Add clear comments mapping each block of code directly to the trader's stated rules.
`;
  }

  return `==================================================
AI CODING PROMPT — EXPERT ADVISOR SPECIFICATION
==================================================

[ROLE]
You are a senior quantitative developer specializing in automated execution and algorithmic trading robots in ${targetLang}.
Your task is to write clean, robust, production-ready Expert Advisor code strictly based on the trader's verified strategy specification below.

[PHILOSOPHY & DIRECTIVES]
The trader is the strategist. The specification below is the absolute source of truth.
• DO NOT add unsolicited indicators (no RSI, EMA, ATR, MACD, etc. unless explicitly specified below).
• DO NOT add unsolicited filters, trend filters, or extra confirmation rules.
• DO NOT alter the trader's risk parameters, stop-loss method, or take-profit logic.
• If any technical parameter required to complete execution is missing or ambiguous, ask the trader for clarification rather than inventing a rule.

[ORIGINAL TRADER IDEA]
"${originalIdea.trim() || 'Refer to refined specification below.'}"

[TARGET SPECIFICATION]
• Target Platform: ${platform}
• Programming Language: ${targetLang}
• Instrument / Market: ${instrument}
• Execution Timeframe: ${timeframe}
${sessions ? `• Permitted Trading Session: ${sessions}` : ''}
• Primary Setup Model: ${setup}
• Entry Rules:
  ${entryRules}
${confirmation ? `• Confirmation Trigger: ${confirmation}` : ''}
• Stop Loss Logic:
  ${stopLoss}
• Exit Logic / Take Profit:
  ${exitRules}
• Risk & Position Sizing:
  ${risk}
${breakEven ? `• Break-Even Mechanism: ${breakEven}` : ''}
${trailingStop ? `• Trailing Stop Mechanism: ${trailingStop}` : ''}
${maxTrades ? `• Maximum Daily Trades: ${maxTrades}` : ''}
${maxDailyLoss ? `• Maximum Daily Loss Guard: ${maxDailyLoss}` : ''}
${news ? `• News Restriction: ${news}` : ''}

[EXECUTION ARCHITECTURE REQUIREMENTS]
1. Use standard modular structure: initialization, tick handling, and cleanup.
2. Ensure strict one-trade-per-signal execution with unique magic number and slippage handling.
3. Calculate lot sizing dynamically based on the trader's stated risk rule (${risk}) and the distance to the Stop Loss.
4. Expose all core strategy parameters as adjustable user inputs with clear tooltips.
5. Provide comprehensive error logging for order transmission and trade server response codes.
6. Provide full, compilable code ready for testing.
`;
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
