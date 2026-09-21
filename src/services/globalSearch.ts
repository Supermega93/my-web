import { ActiveView, Lesson, Product, LevelMeta } from '../types.ts';
import { INITIAL_PRODUCTS } from '../constants/initialProducts.ts';
import { FALLBACK_LESSONS, LEVELS_META } from '../services/academy.ts';

export type SearchCategory = 'all' | 'ea' | 'lesson' | 'doc' | 'tool';

export interface SearchResultItem {
  id: string;
  category: 'ea' | 'lesson' | 'doc' | 'tool';
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  badge?: string;
  badgeColor?: 'emerald' | 'cyan' | 'purple' | 'amber' | 'slate';
  view: ActiveView;
  extraId?: string;
  actionLabel?: string;
}

export interface DocumentationTopic {
  id: string;
  title: string;
  category: 'Architecture' | 'Workflow' | 'Risk & Prop Firms' | 'MQL5 & Pine' | 'Academy Curriculum' | 'Platform Setup';
  summary: string;
  keywords: string[];
  targetView: ActiveView;
  targetExtraId?: string;
  anchor?: string;
}

export const DOCUMENTATION_TOPICS: DocumentationTopic[] = [
  {
    id: 'doc-4-lego-blocks',
    title: 'The 4 Lego Blocks Architecture',
    category: 'Architecture',
    summary: 'The standard modular system for trading robots: The Brain (entry/exit logic), The Shield (risk & drawdown protection), The Glasses (indicators/filters), and The Hands (order execution).',
    keywords: ['lego blocks', 'architecture', 'brain', 'shield', 'glasses', 'hands', 'modular', 'robot structure', 'OnInit', 'OnTick'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-3-2',
  },
  {
    id: 'doc-ai-prompt-recipe',
    title: 'The 5-Ingredient Master Prompt Recipe',
    category: 'Architecture',
    summary: 'How to write zero-ambiguity prompts for LLMs (ChatGPT, Claude, DeepSeek): Role, Context, Objective, Constraints (The "Do Not Do This" Shield), and Output Format.',
    keywords: ['prompt engineering', '5-ingredient', 'prompt recipe', 'master prompt', 'claude', 'chatgpt', 'instructions', 'constraints', 'shield'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-4-1',
  },
  {
    id: 'doc-prop-firm-risk-shield',
    title: 'Prop Firm Safety Nets & Daily Loss Protection',
    category: 'Risk & Prop Firms',
    summary: 'Daily equity snapshots, midnight reset tracking, automated 4.0% daily loss limits, and 9.0% maximum trailing drawdown circuit breakers.',
    keywords: ['prop firm', 'funded account', 'daily loss', 'drawdown', 'trailing drawdown', 'risk management', 'circuit breaker', 'ftmo', 'max loss'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-5-2',
  },
  {
    id: 'doc-lot-sizing-clamping',
    title: 'Dynamic Lot Sizing & Volume Clamping',
    category: 'Risk & Prop Firms',
    summary: 'Calculating exact lot sizes using 1.0% account risk and Stop Loss distance, clamped automatically against broker VOLUME_MIN, VOLUME_MAX, and VOLUME_STEP.',
    keywords: ['lot sizing', 'volume clamping', 'risk percentage', 'tick value', 'volume min', 'volume max', 'volume step', 'account balance', 'equity'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-5-1',
  },
  {
    id: 'doc-custom-ea-workflow',
    title: 'Custom EA Development Workflow (Step-by-Step)',
    category: 'Workflow',
    summary: 'From strategy description to AI logic synthesis, senior quantitative audit, milestone quote, and modular MQL5 compilation with full source code.',
    keywords: ['custom ea', 'development workflow', 'mql5 developer', 'how it works', 'quote', 'build my ea', 'turnaround', 'specifications'],
    targetView: 'how-it-works',
  },
  {
    id: 'doc-backtesting-curve-fitting',
    title: '2-Stage Backtesting & Overfitting Prevention',
    category: 'Architecture',
    summary: 'Preventing curve-fitting using In-Sample (optimization) and Out-of-Sample (validation) historical data with 99.9% real tick data modelling.',
    keywords: ['backtesting', 'curve fitting', 'overfitting', 'out of sample', 'in sample', 'walk forward', 'tick data suite', 'modeling quality'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-7-4',
  },
  {
    id: 'doc-filter-stack',
    title: 'The 3-Layer Execution Filter Stack',
    category: 'Architecture',
    summary: 'Blocking bad fills with Max Spread Guard, Session Windows (London/NY overlap), and the isNewBar single-tick execution safeguard.',
    keywords: ['filter stack', 'spread guard', 'session filter', 'isnewbar', 'new bar', 'london session', 'new york session', 'slippage'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-5-3',
  },
  {
    id: 'doc-active-trade-management',
    title: 'Active Trade Management & Trailing Stops',
    category: 'Risk & Prop Firms',
    summary: 'Hands-free position management: Break-Even + Buffer, ATR Dynamic Trailing Stops, and partial scaling-out profit locks.',
    keywords: ['break even', 'trailing stop', 'atr trailing', 'partial close', 'scaling out', 'profit protection', 'trade manager'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-5-4',
  },
  {
    id: 'doc-5-program-types',
    title: 'The 5 MQL5 Program Types',
    category: 'MQL5 & Pine',
    summary: 'Understanding the differences between Expert Advisors (EAs), Custom Indicators, Utility Scripts, Include Files (.mqh), and Services.',
    keywords: ['program types', 'ea vs indicator', 'mql5 scripts', 'include files', 'mqh', 'services', 'mt5 structure'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-3-1',
  },
  {
    id: 'doc-ai-debugging-protocol',
    title: 'AI Code Debugging & Pre-Flight Audits',
    category: 'Architecture',
    summary: 'The "Explain It To Me" audit protocol, diagnosing syntax compiler errors vs silent logic errors, and correcting AI hallucination loops without reading code.',
    keywords: ['debugging', 'compiler errors', 'silent logic errors', 'hallucinations', 'code audit', 'pre-flight audit', 'syntax errors'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-7-1',
  },
  {
    id: 'doc-on-screen-hud-dashboards',
    title: 'On-Screen HUD Panels & Custom Indicators',
    category: 'MQL5 & Pine',
    summary: 'Constructing interactive chart HUD panels, buffer plotting, mobile push notifications, and TradingView Pine Script v6 strategy conversion.',
    keywords: ['hud', 'dashboard', 'on screen panels', 'indicators', 'pine script', 'tradingview', 'push alerts', 'adr fuel gauge'],
    targetView: 'lesson-detail',
    targetExtraId: 'lesson-6-1',
  },
  {
    id: 'doc-academy-curriculum-overview',
    title: 'School of AI Trading Architecture (Curriculum 1–8)',
    category: 'Academy Curriculum',
    summary: 'Complete 8-level zero-code educational pathway from Preschool foundations to Graduation Capstones, including quizzes, labs, and certification.',
    keywords: ['academy', 'curriculum', 'levels', 'courses', 'school of ai', 'education', 'certifications', 'masterclass', 'preschool', 'graduation'],
    targetView: 'academy',
  },
  {
    id: 'doc-strategy-prompt-architect',
    title: 'Free AI Strategy Prompt Architect Tool',
    category: 'Platform Setup',
    summary: 'Interactive web utility that structures raw trading concepts into production-grade prompts formatted for AI code generators.',
    keywords: ['prompt architect', 'generator', 'free tool', 'strategy prompt', 'prompt builder', 'converter', 'ai architect'],
    targetView: 'prompt-architect',
  },
  {
    id: 'doc-licensing-installation',
    title: 'EA Installation, MT5 Setup & Licensing Portal',
    category: 'Platform Setup',
    summary: 'How to install .ex5 robots in MT5, configure automated trading permissions, enable WebRequests, and activate hardware-locked licenses in your portal.',
    keywords: ['installation', 'mt5 setup', 'licensing', 'portal', 'webrequest', 'algo trading button', 'dll', 'activation'],
    targetView: 'portal',
  },
  {
    id: 'doc-adaptive-liquidity-logic',
    title: 'Adaptive Liquidity Pro V1.0 Architecture & Strategy',
    category: 'Architecture',
    summary: 'How Adaptive Liquidity Pro combines institutional liquidity sweeps, ADR volatility normalization, 50/200 EMA trend filtering, and 1:5 risk-to-reward.',
    keywords: ['adaptive liquidity', 'liquidity pro', 'strategy logic', 'gold', 'xauusd', 'win rate', 'profit factor', 'backtest'],
    targetView: 'ea-detail',
    targetExtraId: 'prod_ea_adaptive_liquidity',
  },
];

/**
 * Searches across EAs, educational lessons, documentation topics, and interactive tools.
 */
export function performGlobalSearch(
  query: string,
  category: SearchCategory = 'all',
  customProducts?: Product[],
  customLessons?: Lesson[]
): SearchResultItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResultItem[] = [];
  const searchTerms = q.split(/\s+/).filter(Boolean);

  const matchesText = (text?: string | null): boolean => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return searchTerms.some((term) => lower.includes(term));
  };

  const calculateScore = (
    title: string,
    description: string,
    keywords: string[] = []
  ): number => {
    let score = 0;
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();

    // Exact whole query match
    if (lowerTitle.includes(q)) score += 100;
    if (lowerDesc.includes(q)) score += 40;

    for (const term of searchTerms) {
      if (lowerTitle.startsWith(term)) score += 40;
      else if (lowerTitle.includes(term)) score += 25;

      if (keywords.some((k) => k.toLowerCase().includes(term))) score += 20;
      if (lowerDesc.includes(term)) score += 10;
    }

    return score;
  };

  // 1. Search EAs & Products (Storefront Products)
  if (category === 'all' || category === 'ea') {
    const productsList = customProducts && customProducts.length > 0 ? customProducts : INITIAL_PRODUCTS;
    for (const prod of productsList) {
      const isEA = prod.type === 'ea';
      const isEbook = prod.type === 'ebook';
      const features = prod.parsedMetadata?.features || [];
      const highlights = prod.parsedMetadata?.highlights || [];
      const textToSearch = [
        prod.name,
        prod.description,
        prod.short_description || '',
        prod.platform || '',
        prod.parsedMetadata?.strategyType || '',
        ...features,
        ...highlights,
      ].join(' ');

      if (matchesText(textToSearch)) {
        const score = calculateScore(prod.name, prod.description, [
          ...(prod.parsedMetadata?.compatibleMarkets || []),
          prod.type,
          prod.platform || '',
        ]);

        results.push({
          id: `product-${prod.id}`,
          category: isEA ? 'ea' : 'tool',
          title: prod.name,
          subtitle: isEA
            ? `Trading Robot · ${prod.platform || 'MetaTrader 5'}`
            : `Comprehensive Course Book · ${prod.parsedMetadata?.pages || 71} Pages`,
          description: prod.short_description || prod.description.slice(0, 140) + '...',
          tags: [
            isEA ? 'MT5 Robot' : 'Course Book',
            ...(prod.parsedMetadata?.timeframes || []),
            ...(prod.parsedMetadata?.compatibleMarkets?.slice(0, 2) || []),
            `$${prod.price}`,
          ].filter(Boolean),
          badge: isEA ? 'Flagship EA' : 'Ebook & Code',
          badgeColor: isEA ? 'emerald' : 'cyan',
          view: isEA ? 'ea-detail' : prod.id === 'prod_ebook_ai_prompt' ? 'ai-prompt-handbook' : 'ebook-detail',
          extraId: prod.id,
          actionLabel: isEA ? 'View EA Specifications' : 'View Book Details',
        });
      }
    }
  }

  // 2. Search Educational Lessons (Levels 1-8 Academy Curriculum)
  if (category === 'all' || category === 'lesson') {
    const lessonsList = customLessons && customLessons.length > 0 ? customLessons : FALLBACK_LESSONS;
    for (const lesson of lessonsList) {
      const textToSearch = [
        lesson.title,
        lesson.summary || '',
        lesson.level_name,
        lesson.content || '',
      ].join(' ');

      if (matchesText(textToSearch)) {
        const levelMatch = lesson.level_name.match(/Level\s*(\d+)/i);
        const levelNum = levelMatch ? parseInt(levelMatch[1], 10) : 1;
        const levelMeta = LEVELS_META.find((l) => l.levelNumber === levelNum);

        results.push({
          id: `lesson-${lesson.id}`,
          category: 'lesson',
          title: lesson.title,
          subtitle: `${lesson.level_name} · ${lesson.duration_minutes || 15} min read`,
          description: lesson.summary || `Part of Course ${levelNum} of 8 (${levelMeta?.schoolName || 'Academy'}).`,
          tags: [
            `Course ${levelNum} of 8`,
            lesson.is_free ? 'Free Lesson' : 'Masterclass',
            `${lesson.duration_minutes || 15} min`,
          ],
          badge: lesson.is_free ? 'Free Level' : 'Masterclass',
          badgeColor: lesson.is_free ? 'emerald' : 'purple',
          view: 'lesson-detail',
          extraId: lesson.id,
          actionLabel: 'Open Lesson',
        });
      }
    }
  }

  // 3. Search Documentation Topics (Institutional Guides, Architecture & Workflow)
  if (category === 'all' || category === 'doc') {
    for (const doc of DOCUMENTATION_TOPICS) {
      const textToSearch = [
        doc.title,
        doc.summary,
        doc.category,
        ...doc.keywords,
      ].join(' ');

      if (matchesText(textToSearch)) {
        results.push({
          id: doc.id,
          category: 'doc',
          title: doc.title,
          subtitle: `Documentation · ${doc.category}`,
          description: doc.summary,
          tags: [doc.category, ...doc.keywords.slice(0, 3)],
          badge: doc.category,
          badgeColor: doc.category === 'Risk & Prop Firms' ? 'amber' : 'cyan',
          view: doc.targetView,
          extraId: doc.targetExtraId,
          actionLabel: 'Read Documentation',
        });
      }
    }
  }

  // 4. Search Interactive Tools & Academy Pages
  if (category === 'all' || category === 'tool') {
    const tools = [
      {
        id: 'tool-prompt-architect',
        title: 'AI Strategy Prompt Architect',
        subtitle: 'Interactive Free Web Tool',
        description: 'Transform trading rules, entry/exit indicators, and risk setups into copy-and-paste AI coding prompts for ChatGPT, Claude, and DeepSeek.',
        keywords: ['prompt architect', 'ai prompt', 'strategy builder', 'free tool', 'prompt generator'],
        view: 'prompt-architect' as ActiveView,
        badge: 'Free Tool',
        badgeColor: 'cyan' as const,
      },
      {
        id: 'tool-custom-ea-builder',
        title: 'Custom EA Development Service',
        subtitle: 'Bespoke MQL5 Engineering',
        description: 'Submit your custom discretionary trading strategy for quantitative review, quote estimation, and automated EA programming.',
        keywords: ['custom ea', 'order ea', 'build robot', 'hire developer', 'mql5 coding'],
        view: 'custom-ea' as ActiveView,
        badge: 'Service',
        badgeColor: 'emerald' as const,
      },
      {
        id: 'tool-academy-pricing',
        title: 'Masterclass All-Access & Lifetime Passes',
        subtitle: 'Academy Levels 4–8 Enrollment',
        description: 'Unlock Middle School through Graduation Capstones, real-world MQL5 source files, labs, and certified graduation credentials.',
        keywords: ['pricing', 'masterclass', 'enroll', 'buy academy', 'levels 4-8', 'lifetime pass', 'cost'],
        view: 'academy-pricing' as ActiveView,
        badge: 'Masterclass',
        badgeColor: 'purple' as const,
      },
      {
        id: 'tool-free-ebook',
        title: 'Free Trading Automation Starter Guide',
        subtitle: 'Complimentary PDF & Starter Prompts',
        description: 'Download the free foundational guide with core MQL5 concepts and starter prompts for automated trading.',
        keywords: ['free ebook', 'pdf download', 'starter guide', 'free download', 'beginner book'],
        view: 'free-ebook' as ActiveView,
        badge: 'Free PDF',
        badgeColor: 'emerald' as const,
      },
      {
        id: 'tool-about-platform',
        title: 'About MEG.AI Labs — Institutional Principles',
        subtitle: 'Our Methodology & Core Architecture',
        description: 'Explore our 4 institutional pillars: Discretionary Trading insight, Systematic Automation, Clean Modular Development, and Institutional Education.',
        keywords: ['about', 'principles', 'mission', 'methodology', 'meg ai labs'],
        view: 'about' as ActiveView,
        badge: 'About Us',
        badgeColor: 'slate' as const,
      },
    ];

    for (const tool of tools) {
      const textToSearch = [
        tool.title,
        tool.subtitle,
        tool.description,
        ...tool.keywords,
      ].join(' ');

      if (matchesText(textToSearch)) {
        results.push({
          id: tool.id,
          category: 'tool',
          title: tool.title,
          subtitle: tool.subtitle,
          description: tool.description,
          tags: tool.keywords.slice(0, 3),
          badge: tool.badge,
          badgeColor: tool.badgeColor,
          view: tool.view,
          actionLabel: 'Launch Tool',
        });
      }
    }
  }

  // Sort results by relevance: exact match in title first, then starts with, etc.
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(q) ? 1 : 0;
    const bTitleMatch = b.title.toLowerCase().includes(q) ? 1 : 0;
    if (aTitleMatch !== bTitleMatch) return bTitleMatch - aTitleMatch;
    return a.title.localeCompare(b.title);
  });

  return results;
}
