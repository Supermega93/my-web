import { MEGA_AI_MASTER_SYSTEM_PROMPT } from '../../server/megaAiPrompt.ts';

export { MEGA_AI_MASTER_SYSTEM_PROMPT };

export interface MegaAiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actions?: Array<{
    label: string;
    actionType: 'navigate' | 'build-ea' | 'quick-reply';
    target?: string;
    payload?: any;
  }>;
}

/**
 * Intelligent deterministic assistant reasoning engine.
 * Implements the verbatim logic, persona, intents, examples, and disclaimers
 * from the MEGA AI Master System Prompt.
 */
export function generateLocalMegaAiResponse(
  userQuery: string, 
  currentView?: string
): { content: string; actions?: MegaAiMessage['actions'] } {
  const query = userQuery.trim().toLowerCase();

  // 1. UNSURE INTENT: "I don't know where to start"
  if (
    query.includes("don't know where to start") || 
    query.includes("dont know where to start") ||
    query.includes("where do i start") ||
    query.includes("where should i start") ||
    query.includes("new here") ||
    query.includes("help me start") ||
    query.includes("lost")
  ) {
    return {
      content: `No problem! Tell me what you're trying to build or learn, and I'll point you in the right direction.

Are you looking to:
• **Learn** how algorithmic trading and MQL5 work from scratch?
• **Structure a trading strategy** without writing code?
• **Build a custom Expert Advisor (EA)** from an existing rule set?
• **Develop a custom app, website, or AI automation**?`,
      actions: [
        { label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' },
        { label: 'Try AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
        { label: 'Build My EA', actionType: 'build-ea' },
      ]
    };
  }

  // 2. LEARN TO BUILD TRADING BOTS / CODING QUESTION
  // Example from Master Prompt: "I want to build a trading bot but I don't know how to code."
  if (
    (query.includes('trading bot') || query.includes('expert advisor') || query.includes('ea') || query.includes('bot')) &&
    (query.includes("don't know how to code") || query.includes("dont know how to code") || query.includes('no coding') || query.includes('no code') || query.includes('cannot code'))
  ) {
    return {
      content: `You don't necessarily need to start with coding. 

You can describe your trading idea in plain English using the **AI Strategy Builder**, structure the rules and risk management, then use **Build My EA** if you want the strategy developed into an actual Expert Advisor.

If you also want to understand the mechanics yourself, our **Free Academy** and **Vol. 1 eBook** teach you how to build bots step-by-step using AI tools as your coding accelerator.`,
      actions: [
        { label: 'Open AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
        { label: 'Build My EA', actionType: 'build-ea' },
        { label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' },
      ]
    };
  }

  // 3. "Can you build my EA?"
  if (
    query.includes('can you build my ea') || 
    query.includes('build my ea') || 
    query.includes('develop my ea') ||
    query.includes('create an ea for me') ||
    query.includes('make me an ea')
  ) {
    return {
      content: `Yes! If you already have a defined strategy, the **Build My EA** process is designed to turn those rules into an automated Expert Advisor.

If your strategy isn't clearly defined yet, start with our free **AI Strategy Builder** to structure your entry rules, exit rules, and risk management parameters first. Once structured, you can send it directly into the Build My EA workflow with a single click.`,
      actions: [
        { label: 'Start Build My EA', actionType: 'build-ea' },
        { label: 'Try AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
        { label: 'View Custom EA Details', actionType: 'navigate', target: 'custom-ea' },
      ]
    };
  }

  // 4. "I want to build an app" / Website / Custom Digital Solution
  if (
    query.includes('build an app') || 
    query.includes('app idea') || 
    query.includes('make an app') || 
    query.includes('website') || 
    query.includes('web app') ||
    query.includes('custom software') ||
    query.includes('ai agent')
  ) {
    return {
      content: `Absolutely. MEGA AI can help with custom digital development, including apps, websites, AI tools, and automation.

Tell me what you want the app or website to do, what users should be able to accomplish, and whether it requires an AI component or internal business integrations. I can help you map out the idea and development path.`,
      actions: [
        { label: 'Explore Custom Solutions', actionType: 'navigate', target: 'about' },
        { label: 'Custom EA / Systems', actionType: 'navigate', target: 'custom-ea' },
      ]
    };
  }

  // 5. "What book should I start with?" / Ebook query
  if (
    query.includes('what book') || 
    query.includes('which book') || 
    query.includes('book should i start with') ||
    query.includes('ebooks') ||
    query.includes('recommend a book')
  ) {
    return {
      content: `If you're new to building trading bots with AI and MQL5, **The School of AI Trading Architecture** by M. Dinga is the ultimate starting point. It covers a complete 71-page zero-code curriculum across Levels 1 through 8, including hands-on labs, capstone projects, and copy-and-paste prompt templates ($89 USD).
 
 **Vol. 2: The AI Prompt Engineering Handbook for Trading Automation** focuses specifically on systematic AI prompt engineering to generate, debug, and optimize institutional-grade trading systems.`,
       actions: [
         { label: 'View All Books', actionType: 'navigate', target: 'ebooks' },
         { label: 'The School of AI Trading Architecture', actionType: 'navigate', target: 'ebook-detail' },
         { label: 'Vol 2: AI Prompt Handbook', actionType: 'navigate', target: 'ai-prompt-handbook' },
       ]
    };
  }

  // 6. "Can AI really build an EA?"
  if (
    query.includes('can ai really build an ea') || 
    query.includes('can ai build an ea') ||
    query.includes('can ai code') ||
    query.includes('is ai good at trading')
  ) {
    return {
      content: `Yes. AI can assist with generating MQL5 code, structuring strategies, debugging, and accelerating development.

However, the strategy still needs to be clearly defined, tested, and validated. AI-generated code should not be treated as automatically profitable or production-ready without proper risk management, tick-data backtesting, and institutional execution standards. Past or backtested performance does not guarantee future results.`,
      actions: [
        { label: 'Free Academy Lessons', actionType: 'navigate', target: 'academy' },
        { label: 'Try AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
      ]
    };
  }

  // 7. LEARNING INTENT: "How can I learn?" / "Free Academy"
  if (
    query.includes('how to learn') || 
    query.includes('how can i learn') || 
    query.includes('teach me') || 
    query.includes('free academy') ||
    query.includes('course') ||
    query.includes('curriculum')
  ) {
    return {
      content: `The best place to start is our **Free Academy**. It provides structured, comprehensive educational resources designed to take you from core market logic to institutional-grade AI bot development.

You can explore the curriculum at your own pace, complete practical exercises, and learn how to formulate explicit trading recipes before touching any code.`,
      actions: [
        { label: 'Enter Free Academy', actionType: 'navigate', target: 'academy' },
        { label: 'Explore Books', actionType: 'navigate', target: 'ebooks' },
      ]
    };
  }

  // 8. STRATEGY SPECIFICATION / PROMPT BUILDER INTENT
  if (
    query.includes('strategy builder') || 
    query.includes('strategy prompt') || 
    query.includes('prompt architect') ||
    query.includes('have a strategy') ||
    query.includes('trading idea')
  ) {
    return {
      content: `If you have a trading idea, our free **AI Strategy Builder** is the recommended first step. 

You describe your strategy in plain English—including entries, exits, risk rules, and session filters. The tool automatically extracts your parameters and compiles a clean, 10-section AI Strategy Specification that you can copy or send straight to **Build My EA**.`,
      actions: [
        { label: 'Open AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
        { label: 'Build My EA', actionType: 'build-ea' },
      ]
    };
  }

  // 9. PROFITABILITY / GUARANTEE QUERIES (Disclaimer enforcement)
  if (
    query.includes('guarantee') || 
    query.includes('make money') || 
    query.includes('will it make me rich') ||
    query.includes('profit percentage') ||
    query.includes('pass prop firm')
  ) {
    return {
      content: `In financial markets, past or backtested performance does not guarantee future results. 

We never guarantee profitability or promise specific financial returns. An Expert Advisor executes rules deterministically, but long-term performance depends heavily on the underlying strategy, risk management, market volatility, broker execution, and disciplined capital preservation.`,
      actions: [
        { label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' },
        { label: 'View Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
      ]
    };
  }

  // 10. CURRENT VIEW CONTEXTUAL RESPONSES
  if (currentView === 'custom-ea') {
    return {
      content: `You're looking at our **Custom EA** service. If you already have a trading strategy, I can help you understand what information you'll need to provide—such as your target platform (MT5/MT4), instruments, entry/exit criteria, and risk parameters.

Would you like to review the intake requirements or draft your rules in the AI Strategy Builder first?`,
      actions: [
        { label: 'Open Build My EA Form', actionType: 'build-ea' },
        { label: 'Use AI Strategy Builder First', actionType: 'navigate', target: 'prompt-architect' },
      ]
    };
  }

  if (currentView === 'prompt-architect') {
    return {
      content: `You're currently in the **AI Strategy Builder**. You can write your trading idea in plain English in Section 1, and the system will automatically extract your technical requirements, indicators, and timeframes into a formal specification.

Once generated, click **Build This For Me** to carry everything straight into our development pipeline.`,
      actions: [
        { label: 'Send Strategy to Build My EA', actionType: 'build-ea' },
        { label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' },
      ]
    };
  }

  // 11. GENERAL REASONING DEFAULT
  return {
    content: `I'm MEGA AI, your guide to the MEG.AI ecosystem. 

Whether you want to **learn** algorithmic trading through our Free Academy, **structure a strategy** using our AI Strategy Builder, have a **custom EA developed**, or build a **custom web application or AI automation**, I can point you to the right tools and next steps.

What would you like to explore or build today?`,
    actions: [
      { label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' },
      { label: 'AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
      { label: 'Build My EA', actionType: 'build-ea' },
      { label: 'View Books', actionType: 'navigate', target: 'ebooks' },
    ]
  };
}
