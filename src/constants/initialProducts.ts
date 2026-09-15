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
    name: 'Build Trading Bots with AI & MQL5 (Vol 1)',
    type: 'ebook',
    description:
      'Learn to create professional Expert Advisors and custom indicators with AI and MQL5 — no coding experience required. This comprehensive master handbook bridges the gap between discretionary trading concepts and production-grade automated execution.',
    short_description:
      'Learn to Create Professional Expert Advisors & Custom Indicators — No Coding Experience Required. By M. Dinga.',
    price: 49.0,
    currency: 'USD',
    platform: 'PDF & EPUB (Immediate Download)',
    image_url: STOREFRONT_MEDIA.paidEbook1.coverUrl,
    download_url: STOREFRONT_MEDIA.paidEbook1.downloadUrl,
    active: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parsedMetadata: {
      pages: 342,
      format: 'PDF, EPUB & Interactive Code Repository',
      skillLevel: 'Beginner to Advanced',
      tableOfContents: [
        'Chapter 1: Foundations of Algorithmic Trading Architecture',
        'Chapter 2: MQL5 Language Core & Object-Oriented Design',
        'Chapter 3: Custom Indicators & Buffer Mathematical Models',
        'Chapter 4: Trade Execution, Slippage Mitigation & Order Managers',
        'Chapter 5: Walk-Forward Optimization & Avoiding Overfitting',
        'Chapter 6: Deploying to Cloud VPS & Monitoring Systems'
      ],
      highlights: [
        'Includes 12 complete, production-ready MQL5 EA code templates',
        'Real-world backtesting data analysis spreadsheets',
        'Step-by-step guidance on bridging TradingView alerts to MT5'
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
