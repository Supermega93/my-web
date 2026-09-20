import { Product } from '../types.ts';
import { STOREFRONT_MEDIA } from './media.ts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_ea_adaptive_liquidity',
    name: 'Adaptive Liquidity Pro V1.0',
    type: 'ea',
    description:
      'Adaptive Liquidity Pro is a professional automated trading system developed for MetaTrader 5 (MT5). It is designed to automate structured trading strategies using liquidity, market structure, momentum, volatility, trend alignment and risk-management conditions.',
    short_description:
      'Professional automated trading system for MetaTrader 5 (MT5) utilizing liquidity, market structure, momentum, volatility, and trend alignment.',
    price: 199.0,
    currency: 'USD',
    platform: 'MetaTrader 5 (Windows/PC)',
    image_url: STOREFRONT_MEDIA.flagshipEa.imageUrl,
    download_url: '/downloads/adaptive-liquidity-pro-v1.0.zip',
    active: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parsedMetadata: {
      version: '1.0.0',
      timeframes: ['M15', 'H1', 'H4'],
      compatibleMarkets: ['Forex', 'XAUUSD (Gold)'],
      strategyType: 'Adaptive Liquidity & Market Structure Automation',
      features: [
        'Adaptive liquidity-based trading logic & market structure',
        'Breakout & fake-breakout detection with ADR/ATR volatility filtering',
        'RSI extreme filtering & directional trade blocking',
        '50/200 EMA trend-alignment & 50 EMA reversal/adoption logic',
        '1:5 risk-to-reward framework with dynamic risk management',
        'Prop-firm risk controls & daily loss limit safeguards'
      ],
      tradingLogic:
        'Adaptive Liquidity Pro is a professional automated trading system developed for MetaTrader 5 (MT5). It is designed to automate structured trading strategies using liquidity, market structure, momentum, volatility, trend alignment and risk-management conditions.',
      riskManagement:
        'Dynamic risk management, configurable risk per trade, stop loss and take profit management, 1:5 risk-to-reward framework, break-even and trailing-stop management, prop-firm risk controls, and daily risk/loss controls.',
      stats: {
        winRate: '68.4%',
        profitFactor: '2.14',
        maxHistoricalDrawdown: '6.8%',
        backtestSpan: '2021 - 2026 (Tick Data Suite 99.9% Modelling Quality)'
      },
      faq: [
        {
          q: 'Which MetaTrader platform is supported?',
          a: 'Adaptive Liquidity Pro is built natively for MetaTrader 5 on Windows/PC.'
        },
        {
          q: 'Which markets can I trade?',
          a: 'Forex pairs and XAUUSD (Gold), fully configurable for different symbols and market conditions.'
        },
        {
          q: 'Can I use this on Prop Firm challenge accounts?',
          a: 'Yes. The Professional/Propfirm Version includes dedicated prop-firm risk controls, daily loss limits, and customizable risk per trade.'
        },
        {
          q: 'Is source code available?',
          a: 'Yes. The With Source Code option ($349) provides complete access to the editable MQL5 source code alongside multi-account usage.'
        }
      ]
    }
  },
  {
    id: 'prod_ebook_mql5_guide',
    name: 'The School of AI Trading Architecture',
    type: 'ebook',
    description:
      'A complete, self-contained curriculum for building professional MetaTrader 5 robots with AI — without ever needing to learn traditional coding. Structured from Preschool to Graduation across Levels 1–8 with copy-and-paste prompts, hands-on labs, risk shields, and real-world capstone projects.',
    short_description:
      'A Complete, Zero-Code Course for Building Professional MetaTrader 5 Robots with AI. Levels 1–8 · Prompt Library · Capstones · Labs. By M. Dinga.',
    price: 89.0,
    currency: 'USD',
    platform: 'Digital PDF Course Book (71 Pages · Immediate Download)',
    image_url: STOREFRONT_MEDIA.paidEbook1.coverUrl,
    download_url: STOREFRONT_MEDIA.paidEbook1.downloadUrl,
    active: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parsedMetadata: {
      pages: 71,
      author: 'M. Dinga (Strategy Architect · Trader · Author)',
      subtitle: 'A Complete, Zero-Code Course for Building Professional MetaTrader 5 Robots with AI',
      descriptor: 'Levels 1–8 · Prompt Library · Capstone Projects · Hands-On Labs',
      format: 'Full Color Digital PDF (71 Pages) + Verified MQL5 Source Files',
      skillLevel: 'Preschool to Graduation (Zero Prior Coding Required)',
      curriculumStructure: [
        'PART ONE — THE FOUNDATIONS (Levels 1–3)',
        'Level 1 · Preschool: The Strategy Architect Mindset',
        'Level 2 · Kindergarten: Programming Concepts in Plain English',
        'Level 3 · Elementary: Robot Architecture & Blueprints',
        'Lab 1 · The ADR Indicator: From Trading Idea to Working MT5 Code',
        'Lab 2 · Build Your First Breakout EA: A Complete, Compilable Expert Advisor',
        'Bonus Lab · The Two-AI Workflow: Previous-Day Breakout EA (ChatGPT + Claude)',
        'PART TWO — THE MASTERCLASS (Levels 4–8)',
        'Level 4 · Middle School: Mastering AI Prompt Engineering',
        'Level 5 · High School: The Safety Shield & Risk Architecture',
        'Level 6 · Undergraduate: Visual Tools & On-Screen Dashboards',
        'Level 7 · Senior Year: Debugging & Code Audits Without Reading Code',
        'Level 8 · Graduation Capstone: Four Real-World Production Projects',
        'Appendix A: The Levels 1–3 Master Examination & Answer Key',
        'Appendix B: The Quick-Reference Consolidated Prompt Library'
      ],
      highlights: [
        'Complete 6-step transformation pipeline: Idea ➔ Specification ➔ Coding Prompt ➔ Code ➔ Test ➔ Improve',
        'Core architectural principle: "I will never let the AI guess my rules. I replace every eyeball rule with a machine fact."',
        'The 4 Lego Blocks Architecture: The Brain, The Shield, The Glasses, and The Hands',
        'The 5-Ingredient Master Prompt recipe: Role, Context, Objective, Constraints, and Format',
        'Hands-on Lab builds with verified, zero-error MQL5 source code included in full',
        'Four Capstone Builds: Volatility Exhaustion Bot, Automated Trade Manager, Prop Firm Challenge EA, and Multi-Bot Control Dashboard',
        '10-Question Master Examination with complete answer key & rationale, plus consolidated copy-and-paste Prompt Library'
      ]
    }
  },
  {
    id: 'prod_ebook_ai_prompt',
    name: 'The AI Prompt Engineering Handbook for Trading Automation (Vol 2)',
    type: 'ebook',
    description:
      'Learn how to direct AI models with the precision of a senior software architect. Turn trading ideas into bug-free MQL5 and Pine Script indicators and Expert Advisors using structured prompts.',
    short_description:
      'Build Trading Robots & Indicators Using Purely AI. By M. Dinga.',
    price: 59.0,
    currency: 'USD',
    platform: 'Digital PDF (Instant Download)',
    image_url: STOREFRONT_MEDIA.paidEbook2.coverUrl,
    download_url: STOREFRONT_MEDIA.paidEbook2.downloadUrl,
    active: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parsedMetadata: {
      pages: 280,
      format: 'Digital PDF (Instant Download)',
      skillLevel: 'All Skill Levels (No Coding Required)',
      tableOfContents: [
        'Part 1: Introduction to AI-Assisted Trading Software Development',
        'Part 2: Prompt Engineering Basics',
        'Part 3: Speaking the AI\'s Language (Without Coding)',
        'Part 4: Building Indicators with AI',
        'Part 5: Building Expert Advisors (Trading Bots)',
        'Part 6: Fixing Errors (Without Reading Code)',
        'Part 7: Professional Prompt Templates',
        'Part 8: TradingView Pine Script (Bonus Reference)',
        'Part 9: Real Client Projects (Case Studies)',
        'Part 10: The Complete AI Prompt Library (150+ Prompts)'
      ],
      highlights: [
        'The 5-Ingredient Master Prompt framework',
        'The "Lego Block" Method for modular bot building',
        '150+ Tested Prompt Library covering indicators, EAs, and Pine Script v6'
      ]
    }
  }
];
