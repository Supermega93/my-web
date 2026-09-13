import { GoogleGenAI } from '@google/genai';
import { extractTechnicalDetailsFromDescription, buildClearStrategy, buildDevPrompt, StructuredStrategyData } from '../src/lib/strategyEngine.ts';

export interface StrategyAiInterpretationRequest {
  buildType: 'EA' | 'Indicator';
  description: string;
  conversation?: Array<{ role: 'user' | 'assistant'; content: string }>;
  platform?: 'MT5' | 'MT4' | 'cTrader';
}

export interface StrategyAiInterpretationResponse {
  success: boolean;
  buildType: 'EA' | 'Indicator';
  systemTitle: string;
  chatGptResponse: string;
  blueprintMarkdown: string;
  structured: StructuredStrategyData & {
    indicatorPlots?: string;
    alertTypes?: string;
    calculationMethod?: string;
    windowType?: 'Chart Window' | 'Separate Subwindow' | string;
    repaintPolicy?: 'Strict Non-Repainting (Bar Close)' | 'Real-time Bar 0 (Forming)' | string;
    maxBarsCalculate?: string;
  };
  clarifications: Array<{
    id: string;
    topic: string;
    question: string;
    status: 'REQUIRES CLARIFICATION';
    suggestedOptions?: string[];
  }>;
  devPrompt: string;
  isAiGenerated: boolean;
}

/**
 * DEDICATED EA ARCHITECT SYSTEM PROMPT
 * Focuses strictly on automated trade execution, order routing, risk management, stop loss/take profit,
 * trailing stop, break-even, prop firm drawdown guardrails, and OnTick state machines.
 */
const EA_ARCHITECT_SYSTEM_PROMPT = `You are MEG.AI's Lead Algorithmic Systems Architect & MQL5 Automated Execution Engineer.
You interpret traders' natural language strategy descriptions with deep expertise in automated trading robots, trade lifecycle management, order execution, prop-firm risk guardrails, and MQL5 architecture.

You are analyzing an EXPERT ADVISOR (EA / Trading Robot) for automated trade execution on MetaTrader.

Your directives:
1. Interpret the trader's plain-English description with extreme precision. The client's words are the absolute source of truth.
2. Speak directly to the trader like an elite institutional algorithmic developer on ChatGPT:
   - Acknowledge their strategy concept and validate their trading edge.
   - Detail how their entry criteria, order routing (market vs limit), and exit triggers will execute mathematically in code.
   - Assess execution realities: slippage, spread dynamics, order timing (candle close vs tick touch), and risk preservation.
3. Formulate a comprehensive, institutional MQL5 EA Blueprint covering:
   - System Overview & Trading Edge
   - Instrument, Timeframe & Directional Model
   - Market Structure & Setup Detection
   - Order Execution Engine (Order Type, Magic Number, Slippage, Spread Filter)
   - Protective Stop Loss & Take Profit Engineering
   - Risk & Capital Preservation (Equity % sizing, Daily Loss Limit, Max Concurrent Trades)
   - Active Trade Management (Break-Even Offset, Trailing Stop Engine)
   - Operational Schedule & High-Impact News Filter
   - MQL5 State Machine & Event Handling (OnInit, OnTick, CTrade execution, Error Recovery)
4. Extract structured fields for both automated compilation and review. Set all indicator-only fields to "N/A - Expert Advisor".
5. Identify 2 to 3 genuine ambiguities or execution parameters requiring developer clarification (e.g. Candle Close confirmation vs Tick Touch, exact lot sizing calculation formula, Friday market closeout policy).
6. Generate a ready-to-run MQL5 developer prompt for code generation.
7. CRITICAL QUALITY DIRECTIVE: NEVER write "Not specified" in any field, markdown section, or value. If the trader did not explicitly state a parameter, provide an institutional baseline or configurable parameter label (e.g. "EURUSD / Multi-Asset", "M15", "Long & Short", "Structural Swing High/Low", "Dynamic 1:2 R/R", "1.0% Equity Risk", "All Liquid Sessions"). Outputs containing "Not specified" are considered unrefined and unprofessional.

You MUST respond with valid JSON strictly conforming to this structure:
{
  "systemTitle": "Concise professional title (e.g. 'M15 XAUUSD London Sweep Execution EA')",
  "chatGptResponse": "Direct, conversational, insightful 2-3 paragraph quantitative review like ChatGPT explaining how you interpreted their EA strategy, validating their execution logic, and highlighting algorithmic safeguards.",
  "blueprintMarkdown": "Comprehensive Markdown specification with sections: # System Overview, # Market & Timeframes, # Entry & Setup Logic, # Order Execution Mechanics, # Stop Loss & Take Profit, # Risk & Capital Preservation, # Trade Management (Break-Even & Trailing Stop), # Operational Filters, and # MQL5 Architectural Specifications.",
  "structured": {
    "buildType": "EA",
    "primaryDescription": "...",
    "instrument": "...",
    "timeframe": "...",
    "direction": "Long & Short | Long Only | Short Only",
    "setup": "...",
    "entryRules": "...",
    "exitRules": "...",
    "stopLoss": "...",
    "takeProfit": "...",
    "riskPerTrade": "...",
    "riskReward": "...",
    "maxDailyLoss": "...",
    "maxDailyProfit": "...",
    "maxTradesPerDay": "...",
    "maxOpenPositions": "...",
    "breakEven": "...",
    "trailingStop": "...",
    "sessions": "...",
    "tradingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "newsFilter": "...",
    "maxSpread": "...",
    "additionalRules": "...",
    "consecutiveLossProtection": "...",
    "positionSizing": "...",
    "maxExposure": "...",
    "entryTriggerType": "Candle Close | Instant Tick Touch | Retest / Limit",
    "indicatorPlots": "N/A - Expert Advisor",
    "alertTypes": "Trade Server Notifications & Journal Logs",
    "calculationMethod": "OnTick event state machine with bar-close / tick evaluation",
    "windowType": "N/A - Expert Advisor",
    "repaintPolicy": "N/A - Expert Advisor",
    "maxBarsCalculate": "N/A - Expert Advisor"
  },
  "clarifications": [
    {
      "id": "clar_1",
      "topic": "ENTRY TRIGGER TIMING",
      "question": "Should market orders execute strictly on candle close or immediately on level touch?",
      "suggestedOptions": ["On Candle Close (Recommended)", "Instant Tick Touch (Aggressive)", "Limit Order Retest"]
    }
  ],
  "devPrompt": "Clean, ready-to-run developer prompt for MQL5 EA code generation outlining the architecture, CTrade integration, OnInit, OnTick, and state machine."
}`;

/**
 * DEDICATED INDICATOR ARCHITECT SYSTEM PROMPT
 * Focuses strictly on technical indicators, chart overlays vs subwindow oscillators, buffer arrays,
 * drawing styles (arrows, lines, shaded zones, histograms), zero-repainting guarantees,
 * OnCalculate performance optimization, and multi-channel alerts (popup, sound, push notification).
 */
const INDICATOR_ARCHITECT_SYSTEM_PROMPT = `You are MEG.AI's Lead Technical Indicator Architect & MQL5 Quantitative Signal/Scanner Engineer.
You interpret traders' natural language indicator descriptions with deep expertise in non-repainting technical indicators, chart overlays, subwindow oscillators, buffer arrays, drawing styles, and multi-channel alert systems.

You are analyzing a CUSTOM INDICATOR (Technical Chart Overlay / Signal Scanner) for MetaTrader.
NOTE: An Indicator DOES NOT place trades, calculate lot sizes, manage account balance, or place stop-loss/take-profit orders. It renders visual buffers, draws zones/arrows, and sends notifications.

Your directives:
1. Interpret the trader's plain-English description with extreme precision. Focus on visual signals, mathematical formulas, buffer plots, chart aesthetics, and alert conditions.
2. Speak directly to the trader like an elite indicator developer on ChatGPT:
   - Acknowledge their indicator concept and validate their signal logic.
   - Explain how their signals will calculate mathematically inside OnCalculate() and how visual elements (arrows, lines, shaded zones) will render on the chart.
   - Address the critical indicator aspects: zero-repainting guarantees (bar 1 close lock vs bar 0 live preview), calculation efficiency (prev_calculated), and alert debounce throttling.
3. Formulate a comprehensive, institutional MQL5 Indicator Blueprint covering:
   - Indicator Overview & Visual Concept
   - Window Target & Property Allocations (#property indicator_chart_window vs #property indicator_separate_window)
   - Quantitative Formula & Signal Trigger Logic
   - Visual Plot Specifications (Arrow Wingdings, Dynamic Lines, Shaded Retest Rectangles, Color Palettes)
   - Zero-Repainting Guarantee & Bar Confirmation Architecture (Strict Bar 1 Close Lock vs Live Bar 0)
   - Multi-Timeframe (MTF) & Multi-Symbol Scanning Capability
   - Multi-Channel Alert Suite (Terminal Popup, Sound Chime, MT5 Mobile Push Notification)
   - Computational Performance & Optimization (prev_calculated, InpMaxBars limit to ensure zero chart lag)
   - MQL5 Architectural Framework (OnInit, OnCalculate, SetIndexBuffer, PlotIndexSetInteger)
4. Extract structured fields for both automated compilation and review:
   - Set stopLoss, takeProfit, riskPerTrade, maxDailyLoss, breakEven, trailingStop, positionSizing to "N/A - Technical Indicator".
   - Extract indicatorPlots, alertTypes, calculationMethod, windowType, repaintPolicy, and maxBarsCalculate accurately.
5. Identify 2 to 3 genuine ambiguities or visual/alert parameters requiring developer clarification (e.g. Strict Bar Close vs Intra-Bar Tick Alert, arrow style/color palette preference, alert throttling frequency).
6. Generate a ready-to-run MQL5 developer prompt for indicator code generation.
7. CRITICAL QUALITY DIRECTIVE: NEVER write "Not specified" in any field, markdown section, or value. If the trader did not explicitly state a parameter, supply an institutional baseline or configurable parameter label (e.g. "EURUSD / Multi-Asset", "M15", "Long & Short", "Strict Non-Repainting (Bar Close)", "Chart Window"). Outputs containing "Not specified" are considered unrefined and unprofessional.

You MUST respond with valid JSON strictly conforming to this structure:
{
  "systemTitle": "Concise professional title (e.g. 'Multi-TF FVG & Order Block Visual Scanner' or 'Session Liquidity & Divergence Indicator')",
  "chatGptResponse": "Direct, conversational, insightful 2-3 paragraph review like ChatGPT explaining how you interpreted their indicator concept, validating their visual buffer layout, and outlining non-repainting signal architecture.",
  "blueprintMarkdown": "Comprehensive Markdown specification with sections: # Indicator Overview, # Window Target & Buffer Allocation, # Signal Formula & Detection Logic, # Visual Plots & Drawing Styles, # Zero-Repaint Guarantee & Confirmation Model, # Multi-Channel Alert Suite, # Performance & Optimization, and # MQL5 Code Architecture.",
  "structured": {
    "buildType": "Indicator",
    "primaryDescription": "...",
    "instrument": "...",
    "timeframe": "...",
    "direction": "Long & Short | Long Only | Short Only",
    "setup": "...",
    "entryRules": "...",
    "exitRules": "Invalidation condition when signal marker/zone expires or price violates level",
    "stopLoss": "N/A - Technical Indicator",
    "takeProfit": "N/A - Technical Indicator",
    "riskPerTrade": "N/A - Technical Indicator",
    "riskReward": "N/A - Technical Indicator",
    "maxDailyLoss": "N/A - Technical Indicator",
    "maxDailyProfit": "N/A - Technical Indicator",
    "maxTradesPerDay": "N/A - Technical Indicator",
    "maxOpenPositions": "N/A - Technical Indicator",
    "breakEven": "N/A - Technical Indicator",
    "trailingStop": "N/A - Technical Indicator",
    "sessions": "...",
    "tradingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "newsFilter": "...",
    "maxSpread": "N/A - Technical Indicator",
    "additionalRules": "...",
    "consecutiveLossProtection": "N/A - Technical Indicator",
    "positionSizing": "N/A - Technical Indicator",
    "maxExposure": "N/A - Technical Indicator",
    "entryTriggerType": "Candle Close | Instant Tick Touch",
    "indicatorPlots": "Detailed description of plots (e.g. Signal Arrows Wingdings #233/#234, Shaded Retest Boxes, EMA Lines)",
    "alertTypes": "Terminal Popup, Audio Sound Chime, MT5 Mobile Push Notification",
    "calculationMethod": "OnCalculate buffer array scanning with prev_calculated zero-lag optimization",
    "windowType": "Chart Window | Separate Subwindow",
    "repaintPolicy": "Strict Non-Repainting (Bar Close)",
    "maxBarsCalculate": "1000 Bars"
  },
  "clarifications": [
    {
      "id": "clar_1",
      "topic": "REPAINT & SIGNAL CONFIRMATION",
      "question": "Should signals and alerts calculate strictly on the bar close (100% non-repainting) or on the forming bar (instant reaction)?",
      "suggestedOptions": ["Bar Close (Non-Repainting - Recommended)", "Live Forming Bar (Instant reaction, potential repaint)"]
    }
  ],
  "devPrompt": "Clean, ready-to-run developer prompt for MQL5 Indicator code generation outlining #property declarations, SetIndexBuffer, PlotIndexSetInteger, OnCalculate logic, and alert debounce."
}`;

export async function interpretStrategyWithGemini(
  genAI: GoogleGenAI | null,
  params: StrategyAiInterpretationRequest
): Promise<StrategyAiInterpretationResponse> {
  const { buildType, description, conversation = [], platform = 'MT5' } = params;

  // If no Gemini instance or empty description, use high-fidelity deterministic fallback
  if (!genAI || !process.env.GEMINI_API_KEY || !description.trim()) {
    return generateDeterministicFallback(buildType, description, platform);
  }

  try {
    const isEa = buildType === 'EA';
    // Select the dedicated, highly specialized system prompt
    const systemPrompt = isEa ? EA_ARCHITECT_SYSTEM_PROMPT : INDICATOR_ARCHITECT_SYSTEM_PROMPT;

    const userPrompt = `Build Type: ${buildType}
Target Platform: ${platform}
Trader's Natural Language Description:
"""
${description}
"""

${conversation.length > 0 ? `Previous Conversation:\n${conversation.map(c => `${c.role.toUpperCase()}: ${c.content}`).join('\n')}` : ''}

Please interpret this ${buildType} description with your specialized ${buildType} intelligence and output the JSON response.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    });

    const rawText = response.text || '';
    const parsed = JSON.parse(rawText);

    return {
      success: true,
      buildType,
      systemTitle: parsed.systemTitle || `${buildType}: ${parsed.structured?.instrument || 'Quantitative System'}`,
      chatGptResponse: parsed.chatGptResponse || (isEa
        ? 'I have analyzed your EA trading logic and structured it into institutional execution specifications below.'
        : 'I have analyzed your indicator concept and formulated it into non-repainting buffer specifications below.'),
      blueprintMarkdown: parsed.blueprintMarkdown || '',
      structured: {
        ...parsed.structured,
        buildType,
        primaryDescription: description,
        tradingDays: parsed.structured?.tradingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      clarifications: Array.isArray(parsed.clarifications) ? parsed.clarifications.map((c: any, idx: number) => ({
        id: c.id || `clar_${idx + 1}`,
        topic: c.topic || 'CLARIFICATION',
        question: c.question || 'Please specify this parameter.',
        status: 'REQUIRES CLARIFICATION' as const,
        suggestedOptions: Array.isArray(c.suggestedOptions) ? c.suggestedOptions : [],
      })) : [],
      devPrompt: parsed.devPrompt || '',
      isAiGenerated: true,
    };
  } catch (err) {
    console.error('[Strategy AI Interpretation Error]', err);
    return generateDeterministicFallback(buildType, description, platform);
  }
}

function generateDeterministicFallback(
  buildType: 'EA' | 'Indicator',
  description: string,
  platform: string
): StrategyAiInterpretationResponse {
  const isEa = buildType === 'EA';
  const result = extractTechnicalDetailsFromDescription(description, {}, buildType);
  const clearSpec = buildClearStrategy(result.structured);
  const prompt = buildDevPrompt(result.structured);

  const instrument = result.structured.instrument !== 'Not specified' ? result.structured.instrument : 'XAUUSD / Multi-Asset';
  const timeframe = result.structured.timeframe !== 'Not specified' ? result.structured.timeframe : 'M15';
  const title = isEa 
    ? `Custom ${platform} EA: ${instrument} (${timeframe})`
    : `Custom ${platform} Indicator: ${instrument} (${timeframe})`;

  const chatGptResponse = isEa
    ? `I have reviewed your strategy description for a custom ${platform} Expert Advisor. Your core logic for ${instrument} on ${timeframe} has been structured into systematic execution rules. I have isolated your market triggers, execution rules, and risk guardrails below.`
    : `I have reviewed your indicator concept for ${platform}. Your calculation logic, chart overlays, and signal criteria for ${instrument} on ${timeframe} have been formulated into institutional buffer specifications below.`;

  return {
    success: true,
    buildType,
    systemTitle: title,
    chatGptResponse,
    blueprintMarkdown: clearSpec,
    structured: {
      ...result.structured,
      buildType,
      indicatorPlots: isEa ? 'N/A - Expert Advisor' : (result.structured.indicatorPlots || 'Signal Arrows & Chart Overlay Zones'),
      alertTypes: isEa ? 'Trade Server Notifications & Journal Logs' : (result.structured.alertTypes || 'Terminal Popup, Sound Alert, MT5 Mobile Push'),
      calculationMethod: isEa ? 'OnTick event state machine with bar-close / tick evaluation' : (result.structured.calculationMethod || 'OnCalculate buffer array scanning with prev_calculated optimization'),
      windowType: isEa ? 'N/A - Expert Advisor' : (result.structured.windowType || 'Chart Window'),
      repaintPolicy: isEa ? 'N/A - Expert Advisor' : (result.structured.repaintPolicy || 'Strict Non-Repainting (Bar Close)'),
      maxBarsCalculate: isEa ? 'N/A - Expert Advisor' : (result.structured.maxBarsCalculate || '1000 Bars'),
    },
    clarifications: result.clarifications,
    devPrompt: prompt,
    isAiGenerated: false,
  };
}
