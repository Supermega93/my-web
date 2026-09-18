import { GoogleGenAI } from '@google/genai';
import {
  StrategyComponent,
  StructuredStrategyData,
  ClarificationItem,
  DevelopmentPricingEstimate,
  extractStrategyComponents,
  buildRefinedStrategySpecification,
  buildRefinedCodingPrompt,
  calculateDevelopmentPricingEstimate,
  componentsToStructuredData,
} from '../src/lib/strategyEngine.ts';

export interface StrategyAiInterpretationRequest {
  buildType: 'EA' | 'Indicator';
  description: string;
  conversation?: Array<{ role: 'user' | 'assistant'; content: string }>;
  platform?: 'MT5' | 'MT4' | 'cTrader' | 'TradingView';
}

export interface StrategyAiInterpretationResponse {
  success: boolean;
  buildType: 'EA' | 'Indicator';
  systemTitle: string;
  chatGptResponse: string;
  blueprintMarkdown: string;
  components: StrategyComponent[];
  structured: StructuredStrategyData & {
    indicatorPlots?: string;
    alertTypes?: string;
    calculationMethod?: string;
    windowType?: 'Chart Window' | 'Separate Subwindow' | string;
    repaintPolicy?: 'Strict Non-Repainting (Bar Close)' | 'Real-time Bar 0 (Forming)' | string;
    maxBarsCalculate?: string;
  };
  clarifications: ClarificationItem[];
  pricingEstimate: DevelopmentPricingEstimate;
  devPrompt: string;
  isAiGenerated: boolean;
}

/**
 * AI STRATEGY ARCHITECT SYSTEM INSTRUCTIONS
 * Strictly enforces:
 * "The trader is the strategist. The AI is the clarification and structuring assistant."
 * The AI must NEVER suggest new trading logic (no unsolicited indicators, filters, SL/TP rules).
 */
const STRATEGY_ARCHITECT_SYSTEM_PROMPT = `You are the Mega AI Labs Strategy Architect.
Your job is to help traders clearly express and structure their OWN trading strategies.
You are NOT a trading strategist.
You must NOT improve, optimize, recommend, or invent trading logic.

CORE DIRECTIVES:
1. Extract what the user has explicitly stated.
2. Identify missing or ambiguous information required to represent that strategy accurately.
3. Ask only for clarification when necessary.
4. Never assume missing values.
5. Never introduce indicators (e.g. RSI, EMA, ATR, MACD), filters, entries, exits, risk rules, or other strategy logic that the user has not provided.
6. The user's strategy is the source of truth. Your role is to clarify and structure it, not change it.
7. Do not repeatedly ask questions if enough information has already been provided.
8. Present relevant components together in the strategy workspace so the user can complete them efficiently.
9. If the user is specifying an Indicator, DO NOT ask for or output EA execution rules (Stop Loss, Take Profit, Lot Sizing, Breakeven).
10. If the user is specifying an Expert Advisor, include only the components relevant to their strategy. If Stop Loss or Risk or Timeframe are genuinely not defined, mark them as needing clarification with a neutral, non-prescriptive question (e.g. "Where should the protective stop loss be placed?"). NEVER suggest an indicator or filter to calculate it.

You MUST respond with valid JSON strictly conforming to this structure:
{
  "systemTitle": "Descriptive title (e.g. 'Asian Range Breakout Execution EA' or 'Custom Session Reversal Indicator')",
  "chatGptResponse": "Professional 1-2 paragraph structuring summary acknowledging the user's explicit rules, explaining how the components have been isolated, and identifying any specific parameters requiring their clarification.",
  "components": [
    {
      "key": "instrument | timeframe | sessions | setup | entryRules | confirmationRules | stopLoss | exitRules | riskPerTrade | breakEven | trailingStop | newsFilter | indicatorPlots | alertTypes",
      "label": "Human readable label",
      "value": "The trader's exact stated rule, or empty string if needing clarification",
      "category": "market | entry | exit | risk | management | operational | indicator",
      "needsClarification": false,
      "clarificationQuestion": "Only if needsClarification is true. Neutral question without suggesting new indicators/filters."
    }
  ],
  "clarifications": [
    {
      "id": "clar_1",
      "topic": "SHORT TOPIC",
      "question": "Neutral clarification question",
      "suggestedOptions": ["Option A", "Option B"]
    }
  ]
}`;

export async function interpretStrategyWithGemini(
  genAI: GoogleGenAI | null,
  params: StrategyAiInterpretationRequest
): Promise<StrategyAiInterpretationResponse> {
  const { buildType, description, conversation = [], platform = 'MT5' } = params;

  // If no Gemini instance or empty description, use deterministic fallback
  if (!genAI || !process.env.GEMINI_API_KEY || !description.trim()) {
    return generateDeterministicFallback(buildType, description, platform);
  }

  try {
    const isEa = buildType === 'EA';

    const userPrompt = `Build Type: ${buildType} (${isEa ? 'Expert Advisor / Automated Robot' : 'Technical Indicator / Chart Overlay'})
Target Platform: ${platform}
Trader's Natural Language Description:
"""
${description}
"""

${conversation.length > 0 ? `Previous Context:\n${conversation.map(c => `${c.role.toUpperCase()}: ${c.content}`).join('\n')}` : ''}

Analyze and structure this ${buildType} strictly according to your Strategy Architect directives. Extract ONLY what was stated. Output valid JSON.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${STRATEGY_ARCHITECT_SYSTEM_PROMPT}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Low temperature for high fidelity to user's words
      }
    });

    const rawText = response.text || '';
    const parsed = JSON.parse(rawText);

    // Map AI components or merge with deterministic fallback to ensure no required fields are missed
    const fallback = extractStrategyComponents(description, buildType);
    let finalComponents: StrategyComponent[] = [];

    if (Array.isArray(parsed.components) && parsed.components.length > 0) {
      finalComponents = parsed.components.map((c: any, idx: number) => ({
        id: `comp_${c.key || idx}`,
        key: c.key || `custom_${idx}`,
        label: c.label || c.key,
        value: c.value || '',
        category: c.category || 'entry',
        needsClarification: Boolean(c.needsClarification || !c.value),
        clarificationQuestion: c.clarificationQuestion,
        suggestedOptions: Array.isArray(c.suggestedOptions) ? c.suggestedOptions : undefined,
        isExplicitlyProvided: Boolean(c.value && !c.needsClarification),
      }));
    } else {
      finalComponents = fallback.components;
    }

    const clarifications: ClarificationItem[] = Array.isArray(parsed.clarifications) && parsed.clarifications.length > 0
      ? parsed.clarifications.map((c: any, idx: number) => ({
          id: c.id || `clar_${idx + 1}`,
          topic: c.topic || 'CLARIFICATION',
          question: c.question || 'Please specify this parameter.',
          status: 'REQUIRES CLARIFICATION' as const,
          suggestedOptions: Array.isArray(c.suggestedOptions) ? c.suggestedOptions : [],
        }))
      : fallback.clarifications;

    const blueprintMarkdown = buildRefinedStrategySpecification(finalComponents, buildType, description);
    const devPrompt = buildRefinedCodingPrompt(finalComponents, buildType, description, platform);
    const pricingEstimate = calculateDevelopmentPricingEstimate(finalComponents, buildType);
    const structured = componentsToStructuredData(finalComponents, buildType, description);

    return {
      success: true,
      buildType,
      systemTitle: parsed.systemTitle || `${buildType === 'EA' ? 'Automated EA' : 'Custom Indicator'}: ${description.slice(0, 40)}...`,
      chatGptResponse: parsed.chatGptResponse || `I have analyzed your ${buildType} trading logic and extracted the explicit rules into the structured workspace below.`,
      blueprintMarkdown,
      components: finalComponents,
      structured,
      clarifications,
      pricingEstimate,
      devPrompt,
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
  const { components, clarifications } = extractStrategyComponents(description, buildType);
  const blueprintMarkdown = buildRefinedStrategySpecification(components, buildType, description);
  const devPrompt = buildRefinedCodingPrompt(components, buildType, description, platform);
  const pricingEstimate = calculateDevelopmentPricingEstimate(components, buildType);
  const structured = componentsToStructuredData(components, buildType, description);

  const instrument = components.find(c => c.key === 'instrument')?.value || 'Trading Asset';
  const setup = components.find(c => c.key === 'setup')?.value || 'Trading Strategy';
  const title = `${platform} ${buildType}: ${setup} on ${instrument}`;

  const chatGptResponse = `I have reviewed your ${buildType} description. Your core strategy logic has been structured into the relevant components below without altering your intent or adding unrequested filters. Review the extracted rules and complete any items requiring clarification.`;

  return {
    success: true,
    buildType,
    systemTitle: title,
    chatGptResponse,
    blueprintMarkdown,
    components,
    structured,
    clarifications,
    pricingEstimate,
    devPrompt,
    isAiGenerated: false,
  };
}
