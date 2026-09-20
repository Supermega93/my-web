import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { SERVER_ACADEMY_LESSONS } from './academyCurriculumData.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'ea_automation_hub.db');
export const db = new DatabaseSync(DB_PATH);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables strictly matching the specifications
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('customer', 'admin', 'developer')),
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('ebook', 'ea', 'service')),
      description TEXT NOT NULL,
      short_description TEXT,
      price REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      platform TEXT,
      image_url TEXT,
      download_url TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      payment_status TEXT NOT NULL CHECK(payment_status IN ('paid', 'pending', 'refunded', 'failed')),
      transaction_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS downloads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      order_id TEXT NOT NULL,
      download_url TEXT NOT NULL,
      download_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS licenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      order_id TEXT,
      license_key TEXT NOT NULL UNIQUE,
      license_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      delivery_status TEXT NOT NULL DEFAULT 'pending',
      delivery_notes TEXT,
      starts_at TEXT,
      expires_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ea_projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      project_name TEXT NOT NULL,
      title TEXT,
      description TEXT,
      raw_strategy_input TEXT,
      platform TEXT NOT NULL,
      status TEXT NOT NULL,
      budget_tier TEXT,
      complexity TEXT,
      estimated_price REAL,
      final_price REAL,
      assigned_developer_id TEXT,
      customer_email TEXT,
      customer_name TEXT,
      customer_phone TEXT,
      customer_telegram TEXT,
      instrument TEXT,
      timeframe TEXT,
      quote_status TEXT,
      quote_amount REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS custom_dev_leads (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      telegram TEXT,
      platform TEXT NOT NULL DEFAULT 'MetaTrader 5 (MQL5)',
      instrument TEXT DEFAULT 'All Forex / Metals',
      timeframe TEXT DEFAULT '15-Minute',
      strategy_idea TEXT NOT NULL,
      generated_prompt TEXT,
      status TEXT NOT NULL DEFAULT 'pending_review',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_logs (
      id TEXT PRIMARY KEY,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_leads (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      source TEXT NOT NULL DEFAULT 'free_ebook_download',
      book_id TEXT NOT NULL DEFAULT 'free_lead_magnet_traders_guide',
      download_count INTEGER NOT NULL DEFAULT 0,
      last_downloaded_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS academy_progress (
      email TEXT PRIMARY KEY,
      completed_lesson_ids TEXT NOT NULL,
      quiz_scores TEXT,
      last_lesson_id TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS strategy_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      submission_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      telegram TEXT,
      platform TEXT NOT NULL DEFAULT 'MT5',
      strategy_title TEXT NOT NULL,
      original_strategy TEXT NOT NULL,
      structured_strategy TEXT,
      clear_strategy TEXT,
      generated_prompt TEXT,
      instrument TEXT,
      timeframe TEXT,
      direction TEXT,
      entry_conditions TEXT,
      exit_conditions TEXT,
      risk_management TEXT,
      trading_conditions TEXT,
      trade_management TEXT,
      additional_rules TEXT,
      missing_information TEXT,
      status TEXT NOT NULL DEFAULT 'submitted',
      email_status TEXT NOT NULL DEFAULT 'pending',
      email_sent_at TEXT,
      email_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
    CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id);
    CREATE INDEX IF NOT EXISTS idx_projects_user ON ea_projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_sub_id ON strategy_submissions(submission_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_email ON strategy_submissions(email);

    CREATE TABLE IF NOT EXISTS complimentary_access (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_email TEXT NOT NULL,
      access_type TEXT NOT NULL DEFAULT 'masterclass',
      status TEXT NOT NULL DEFAULT 'active',
      granted_at TEXT NOT NULL,
      granted_by TEXT NOT NULL,
      revoked_at TEXT,
      revoked_by TEXT,
      notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_comp_access_uid ON complimentary_access(user_id);
    CREATE INDEX IF NOT EXISTS idx_comp_access_email ON complimentary_access(user_email);
    CREATE INDEX IF NOT EXISTS idx_comp_access_status ON complimentary_access(status);

    CREATE TABLE IF NOT EXISTS academy_lessons (
      id TEXT PRIMARY KEY,
      uuid TEXT,
      course_id TEXT,
      order_index INTEGER NOT NULL,
      level_name TEXT NOT NULL,
      lesson_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      duration_minutes INTEGER DEFAULT 15,
      is_free INTEGER DEFAULT 0,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 1,
      completed_at TEXT NOT NULL,
      UNIQUE(user_id, lesson_id)
    );

    CREATE INDEX IF NOT EXISTS idx_academy_lessons_order ON academy_lessons(order_index);
    CREATE INDEX IF NOT EXISTS idx_academy_lessons_course ON academy_lessons(course_id);
    CREATE INDEX IF NOT EXISTS idx_ulp_user ON user_lesson_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_ulp_lesson ON user_lesson_progress(lesson_id);
  `);

  // Auto-migrate any existing databases to have all columns on ea_projects
  try {
    const existingCols = (db.prepare('PRAGMA table_info(ea_projects)').all() as any[]).map(c => c.name);
    const colsToAdd = [
      { name: 'title', type: 'TEXT' },
      { name: 'description', type: 'TEXT' },
      { name: 'raw_strategy_input', type: 'TEXT' },
      { name: 'budget_tier', type: 'TEXT' },
      { name: 'assigned_developer_id', type: 'TEXT' },
      { name: 'customer_email', type: 'TEXT' },
      { name: 'customer_name', type: 'TEXT' },
      { name: 'customer_phone', type: 'TEXT' },
      { name: 'customer_telegram', type: 'TEXT' },
      { name: 'instrument', type: 'TEXT' },
      { name: 'timeframe', type: 'TEXT' },
      { name: 'quote_status', type: 'TEXT' },
      { name: 'quote_amount', type: 'REAL' },
    ];
    for (const col of colsToAdd) {
      if (!existingCols.includes(col.name)) {
        db.exec(`ALTER TABLE ea_projects ADD COLUMN ${col.name} ${col.type};`);
      }
    }
  } catch (migErr) {
    console.warn('Migration column check notice:', migErr);
  }

  // Auto-migrate licenses table to include order_id, starts_at, delivery_status, delivery_notes, updated_at
  try {
    const existingLicCols = (db.prepare('PRAGMA table_info(licenses)').all() as any[]).map(c => c.name);
    const licColsToAdd = [
      { name: 'order_id', type: 'TEXT' },
      { name: 'starts_at', type: 'TEXT' },
      { name: 'delivery_status', type: "TEXT NOT NULL DEFAULT 'pending'" },
      { name: 'delivery_notes', type: 'TEXT' },
      { name: 'updated_at', type: 'TEXT' },
    ];
    for (const col of licColsToAdd) {
      if (!existingLicCols.includes(col.name)) {
        db.exec(`ALTER TABLE licenses ADD COLUMN ${col.name} ${col.type};`);
      }
    }
  } catch (licMigErr) {
    console.warn('Licenses migration column check notice:', licMigErr);
  }

  seedInitialData();
}

function seedInitialData() {
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const now = new Date().toISOString();

  if (userCheck.count === 0) {
    // Seed default administrative, developer, and customer accounts
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, phone, role, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'usr_admin_01',
      'Alexander Wright',
      'admin@ea-automation.com',
      '+1 (555) 392-1094',
      'admin',
      'admin123',
      now,
      now
    );

    insertUser.run(
      'usr_dev_01',
      'Marcus Vance',
      'dev@ea-automation.com',
      '+1 (555) 782-4411',
      'developer',
      'dev123',
      now,
      now
    );

    insertUser.run(
      'usr_cust_01',
      'Valued Trader',
      'supermegafx1@gmail.com',
      '+1 (555) 901-2283',
      'customer',
      'trader123',
      now,
      now
    );

    insertUser.run(
      'usr_demo_customer',
      'Valued Trader',
      'trader@supermegafx.com',
      '+1 (555) 901-2283',
      'customer',
      'trader123',
      now,
      now
    );
  } else {
    // Ensure usr_demo_customer exists if users already seeded
    try {
      db.prepare(`
        INSERT OR IGNORE INTO users (id, name, email, phone, role, password_hash, created_at, updated_at)
        VALUES ('usr_demo_customer', 'Valued Trader', 'trader@supermegafx.com', '+1 (555) 901-2283', 'customer', 'trader123', ?, ?)
      `).run(now, now);
    } catch {
      // Ignored if already exists
    }
  }

  const productCheck = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCheck.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, type, description, short_description, price, currency, platform, image_url, download_url, active, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. Featured EA: Adaptive Liquidity Pro V1.0
    const eaMetadata = JSON.stringify({
      version: '1.0.0',
      timeframes: ['M15', 'H1', 'H4'],
      compatibleMarkets: ['Forex', 'XAUUSD (Gold)'],
      supportedPlatform: {
        platform: 'MetaTrader 5',
        os: 'Windows/PC',
        instruments: 'Forex and XAUUSD',
        flexibility: 'Configurable for different symbols and market conditions'
      },
      strategyType: 'Adaptive Liquidity & Market Structure Automation',
      coreFeatures: [
        'Adaptive liquidity-based trading logic',
        'Breakout and fake-breakout detection',
        'RSI extreme filtering and directional trade blocking',
        '50/200 EMA trend-alignment filtering',
        '50 EMA reversal/adoption logic',
        'ADR/ATR volatility filtering',
        'Dynamic risk management',
        'Configurable risk per trade',
        'Stop Loss and Take Profit management',
        '1:5 risk-to-reward framework',
        'Break-even and trailing-stop management',
        'Trading-session controls',
        'Profit-recycling functionality',
        'Prop-firm risk controls',
        'Daily risk/loss controls',
        'Market-specific configuration presets',
        'Backtesting and optimisation support',
        'Customisable EA parameters'
      ],
      features: [
        'Adaptive liquidity-based trading logic & market structure',
        'Breakout & fake-breakout detection with ADR/ATR volatility filtering',
        'RSI extreme filtering & directional trade blocking',
        '50/200 EMA trend-alignment & 50 EMA reversal/adoption logic',
        '1:5 risk-to-reward framework with dynamic risk management',
        'Prop-firm risk controls & daily loss limit safeguards'
      ],
      pricingTiers: [
        { id: 'pc', name: 'PC Version', price: 199, currency: 'USD', displayPrice: '$199', license: 'Standard License: Single user/account' },
        { id: 'propfirm', name: 'Professional/Propfirm Version', price: 249, currency: 'USD', displayPrice: '$249', license: 'Professional License: Full professional feature set' },
        { id: 'source_code', name: 'With Source Code', price: 349, currency: 'USD', displayPrice: '$349', license: 'Multi-Account License + Complete MQL5 Source Code' }
      ],
      marketplaceStructure: [
        { title: 'Standard License', desc: 'Single user/account' },
        { title: 'Professional License', desc: 'Full professional feature set' },
        { title: 'Multi-Account License', desc: 'For users managing multiple trading accounts' },
        { title: 'Lifetime License', desc: 'One-time purchase for lifetime access to the licensed version' },
        { title: 'Future Upgrade/Update Options', desc: 'Available according to the marketplace licensing system' }
      ],
      tradingLogic: 'Adaptive Liquidity Pro is a professional automated trading system developed for MetaTrader 5 (MT5). It is designed to automate structured trading strategies using liquidity, market structure, momentum, volatility, trend alignment and risk-management conditions.',
      riskManagement: 'Dynamic risk management, configurable risk per trade, stop loss and take profit management, 1:5 risk-to-reward framework, break-even and trailing-stop management, prop-firm risk controls, and daily risk/loss controls.',
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
    });

    insertProduct.run(
      'prod_ea_adaptive_liquidity',
      'Adaptive Liquidity Pro V1.0',
      'ea',
      'Adaptive Liquidity Pro is a professional automated trading system developed for MetaTrader 5 (MT5). It is designed to automate structured trading strategies using liquidity, market structure, momentum, volatility, trend alignment and risk-management conditions.',
      'Professional automated trading system for MetaTrader 5 (MT5) utilizing liquidity, market structure, momentum, volatility, and trend alignment.',
      199.00,
      'USD',
      'MetaTrader 5 (Windows/PC)',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Adaptive_Liquidity_Pro_EA_MT5_200x200.bmp',
      '/downloads/adaptive-liquidity-pro-v1.0.zip',
      1,
      eaMetadata,
      now,
      now
    );

    // 2. Ebook 1: The School of AI Trading Architecture
    const ebook1Meta = JSON.stringify({
      pages: 71,
      author: 'M. Dinga (Strategy Architect · Trader · Author)',
      subtitle: 'A Complete, Zero-Code Course for Building Professional MetaTrader 5 Robots with AI',
      descriptor: 'Levels 1–8 · Prompt Library · Capstone Projects · Hands-On Labs',
      format: 'Full Color Digital PDF (71 Pages) + Verified MQL5 Source Files',
      skillLevel: 'Preschool to Graduation (Zero Prior Coding Required)',
      language: 'English',
      tableOfContents: [
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
    });

    insertProduct.run(
      'prod_ebook_mql5_guide',
      'The School of AI Trading Architecture',
      'ebook',
      'A complete, self-contained curriculum for building professional MetaTrader 5 robots with AI — without ever needing to learn traditional coding. Structured from Preschool to Graduation across Levels 1–8 with copy-and-paste prompts, hands-on labs, risk shields, and real-world capstone projects.',
      'A Complete, Zero-Code Course for Building Professional MetaTrader 5 Robots with AI. Levels 1–8 · Prompt Library · Capstones · Labs. By M. Dinga.',
      89.00,
      'USD',
      'Digital PDF Course Book (71 Pages · Immediate Download)',
      '/assets/books/school-of-ai-trading-architecture-cover.svg',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Vol1-AI%20assisted%20mql5%20Development.pdf',
      1,
      ebook1Meta,
      now,
      now
    );

    // 3. Ebook 2: The AI Prompt Engineering Handbook for Trading Automation
    const ebook2Meta = JSON.stringify({
      author: 'M. Dinga (Companion Volume to Build Trading Bots with AI & MQL5)',
      subtitle: 'Build Trading Robots & Indicators Using Purely AI',
      badge: 'Digital Guide & Prompt Playbook',
      format: 'Digital PDF (Instant Download)',
      compatibility: 'ChatGPT, Claude, Gemini, MetaTrader 5 (MQL5), TradingView (Pine Script v6)',
      includedTools: '150+ Tested Prompt Library & Case Studies',
      delivery: 'Immediate download access upon checkout + email backup link.',
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
    });

    insertProduct.run(
      'prod_ebook_ai_prompt',
      'The AI Prompt Engineering Handbook for Trading Automation (Vol 2)',
      'ebook',
      'The AI Prompt Engineering Handbook for Trading Automation (Vol 2) breaks down the exact communication framework required to turn ChatGPT, Claude, and Gemini into disciplined junior developers. Instead of falling into the "one-shot trap" where an AI hallucinates broken code, this guide introduces modular development: building your bot stage-by-stage using The Brain (rules), The Shield (risk), The Glasses (filters), and The Hands (trade management). Every concept is paired with tested prompt templates, negative constraints, and practical verification steps to keep execution safe and disciplined.',
      'Build Trading Robots & Indicators Using Purely AI. By M. Dinga.',
      59.00,
      'USD',
      'Digital PDF (Instant Download)',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Gemini_Generated_Image_v49p2qv49p2qv49p.jfif',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/The%20AI%20Prompt%20Engineering%20Handbook.pdf',
      1,
      ebook2Meta,
      now,
      now
    );

    // 4. Custom EA Development Service placeholder product entry for architecture
    const serviceMeta = JSON.stringify({
      turnaround: '5 - 10 Business Days',
      deliverables: ['Full MQL5 Source Code (.mq5)', 'Compiled Binary (.ex5)', 'Comprehensive User Manual', '14-Day Post-Delivery Revision Guarantee'],
      supportedPlatforms: ['MetaTrader 5', 'MetaTrader 4', 'cTrader']
    });

    insertProduct.run(
      'prod_service_custom_ea',
      'Custom Expert Advisor Development Service',
      'service',
      'Turn your personal trading strategy, indicators, and discretionary rules into a proprietary automated trading robot programmed by verified quantitative engineers.',
      'Full-cycle custom EA development from your strategy rules with source code and verification.',
      375.00,
      'USD',
      'MT5 / MT4 / cTrader',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      null,
      1,
      serviceMeta,
      now,
      now
    );

    // Also seed a sample order, license, and download for the demo customer so they have real dashboard data immediately!
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, user_id, product_id, amount, currency, payment_status, transaction_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertLicense = db.prepare(`
      INSERT INTO licenses (id, user_id, product_id, order_id, license_key, license_type, status, delivery_status, delivery_notes, starts_at, expires_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDownload = db.prepare(`
      INSERT INTO downloads (id, user_id, product_id, order_id, download_url, download_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
      'ord_demo_01',
      'usr_cust_01',
      'prod_ea_adaptive_liquidity',
      399.00,
      'USD',
      'paid',
      'tx_stripe_98418302',
      now,
      now
    );

    insertLicense.run(
      'lic_demo_01',
      'usr_cust_01',
      'prod_ea_adaptive_liquidity',
      'ord_demo_01',
      'EAH-ALPRO-7892-9410-LIFETIME',
      'Lifetime Single Terminal',
      'active',
      'delivered',
      'Initial terminal deployment verified by lead developer.',
      now,
      null,
      now,
      now
    );

    insertDownload.run(
      'dl_demo_01',
      'usr_cust_01',
      'prod_ea_adaptive_liquidity',
      'ord_demo_01',
      '/downloads/adaptive-liquidity-pro-v1.0.zip',
      1,
      now
    );
  }

  // Always keep prod_ea_adaptive_liquidity and prod_ebook_ai_prompt in sync with latest copy and pricing
  try {
    const eaMetadataSync = JSON.stringify({
      version: '13.0.0 (V13 Institutional)',
      author: 'M. Dinga',
      timeframes: ['M15', 'H1', 'H4', 'D1'],
      compatibleMarkets: ['XAUUSD (Gold - Native Algorithmic Engine)', 'Forex / Global Metals'],
      supportedPlatform: {
        platform: 'MetaTrader 5 (MQL5)',
        os: 'Windows/PC / VPS',
        instruments: 'XAUUSD (Gold) Optimized',
        flexibility: 'Configurable for volatile metals and institutional order flows'
      },
      strategyType: 'Dual-Engine Institutional Liquidity Hunting & Trap Evasion',
      corePhilosophy: 'Designed specifically to exploit the liquidity cycles of Gold (XAUUSD). Engineered through extensive data-mining analyzing historical anomalies (such as May Macro Explosions and February Spaghetti Chop). Operates on Liquidity Hunting & Trap Evasion: waits for institutional algorithms to sweep retail stop-losses at key daily and weekly structural levels, engaging only when genuine momentum is mathematically confirmed.',
      dualEngines: {
        engineA: 'The Dynamic Breakout Engine: Tracks Previous Day High/Low with a Dynamic Entry Buffer calculated as % of ADR (Average Daily Range) pushing price deep into Expansion Territory (e.g. 7% of ADR past daily high) before triggering trades, dodging 80% of standard liquidity sweeps. Filtered by 50 EMA & 200 EMA macro alignment.',
        engineB: 'The Weekly Squeeze Mean-Reversion Engine (The Trap): Maps Weekly High/Low and tracks rejections touching weekly levels while above 50 EMA. When a level fails 2+ times with H1/H4 RSI showing extreme exhaustion (>70), the EA declares an Institutional Trap, completely blocks Breakout Buys, and triggers a violent Mean-Reversion Sell once an H1 candle closes back below the 50 EMA.'
      },
      advancedMechanics: [
        'Profit Recycling (Immediate Stacking): Risks 1%, moves SL to Break-Even at 1.5R ($0 risk), and uses house money to dynamically open a Follower trade compounding momentum.',
        'Stacking Distance Delay: Enforces a minimum structural buffer (+0.5R past Break-Even) before executing Follower trade to eliminate whipsaws.',
        'Dynamic Volatility Risk Routing: 4-Day ADR adjusts SL, TP, and Entry Buffers in real-time to match Gold market conditions.',
        'Prop Firm Consistency Protector: Monitors daily profits vs challenge targets, preventing single-day profit cap violations (e.g. 30% cap) by dynamically scaling TP.',
        '1:6 Risk-to-Reward Hardcoded Geometric Math: Anchors TP to ADR limits, widens SL with entry buffer, multiplying final SL by RR ratio.'
      ],
      backtestResults: {
        dataset: '100% Real Ticks on FxPro MT5 (Jan - Sep 2026)',
        baseCapital: '$100,000.00',
        runs: [
          { name: '5% Risk Run (Aggressive Compounding)', netProfit: '$1,144,903.72 (+1,144%)', maxDrawdown: '19.55%', profitFactor: '2.97', winRate: '52.73%' },
          { name: '3.5% Risk Run (Prop Firm Aggressive)', netProfit: '$934,539.60 (+934%)', maxDrawdown: '19.61%', profitFactor: '2.73', winRate: '51.8%' },
          { name: '2.5% Risk Run (Optimal Balance)', netProfit: '+450% to +500% Expected', maxDrawdown: '12.0% - 14.0%', profitFactor: '2.55', winRate: '50.5%' },
          { name: '1% Risk Run (Prop Firm Safe Mode)', netProfit: '+120% to +180% Expected', maxDrawdown: '4.2% - 6.0%', profitFactor: '2.40', winRate: '50.0%' }
        ]
      },
      coreFeatures: [
        'Dual-Engine Architecture: Dynamic Breakout Engine + Weekly Squeeze Mean-Reversion',
        'Institutional Liquidity Hunting & Trap Evasion on XAUUSD (Gold)',
        'Dynamic Entry Buffer (% of ADR) dodging 80% of retail liquidity sweeps',
        'Weekly Squeeze Mean-Reversion with RSI exhaustion (>70) & violent 50 EMA flip',
        'Profit Recycling: 1% initial risk -> 1.5R Break-Even -> Follower compounding on house money',
        'Stacking Distance Delay preventing whipsaws on volatile gold expansions',
        'Dynamic Volatility Risk Routing based on 4-Day Average Daily Range',
        'Prop Firm Consistency Protector with dynamic daily profit & TP scaling',
        '1:6 Geometric Risk-to-Reward framework with mathematical ADR anchor',
        'Zero Martingale / Zero Toxic Grid — Strict mathematical stop-losses on every execution',
        'Interactive Dual-Screen GUI: 3D Control Panel & Real-Time Diagnostic Dashboard',
        'Tested across 100% Real Ticks on FxPro MT5 with verified algorithmic stability'
      ],
      features: [
        'INSTITUTIONAL Adaptive Liquidity Pro V13 for XAUUSD (Gold) by M. Dinga',
        'Dual-Engine Architecture: Dynamic Breakout + Weekly Squeeze Mean-Reversion Trap Evasion',
        'Profit Recycling & Stacking Distance Delay compounding on house money with $0 risk',
        'Dynamic Volatility Risk Routing & Prop Firm Consistency Protector with TP scaling',
        '100% Real Tick verified: +1,144% ($1.14M profit on $100k) with sub-20% drawdown',
        'Prop Firm Safe mode calibrated for FTMO and institutional evaluations (4-6% max DD)'
      ],
      pricingTiers: [
        { id: 'pc', name: 'PC Version', price: 199, currency: 'USD', displayPrice: '$199', license: 'Standard License: Single user/account' },
        { id: 'propfirm', name: 'Professional/Propfirm Version', price: 249, currency: 'USD', displayPrice: '$249', license: 'Professional License: Full professional feature set + Prop Firm Consistency Protector' },
        { id: 'source_code', name: 'With Source Code', price: 349, currency: 'USD', displayPrice: '$349', license: 'Multi-Account License + Complete MQL5 Source Code' }
      ],
      marketplaceStructure: [
        { title: 'Standard License', desc: 'Single user/account on MetaTrader 5' },
        { title: 'Professional License', desc: 'Full professional feature set with Prop Firm Consistency Protector' },
        { title: 'Multi-Account License', desc: 'For users managing multiple trading accounts or prop-firm challenges' },
        { title: 'Lifetime License', desc: 'One-time purchase for lifetime access to the licensed version' },
        { title: 'Future Upgrade/Update Options', desc: 'Available according to the marketplace licensing system' }
      ],
      tradingLogic: 'INSTITUTIONAL Adaptive Liquidity Pro V13 is an advanced algorithmic trading engine for XAUUSD (Gold) developed by M. Dinga. It exploits institutional liquidity cycles via a Dual-Engine strategy: Engine A (Dynamic Breakout with ADR buffers & EMA alignment) and Engine B (Weekly Squeeze Mean-Reversion Trap Evasion with RSI exhaustion and 50 EMA flip).',
      riskManagement: 'Universal money management with dynamic volatility risk routing (4-Day ADR), profit recycling with 1.5R breakeven protection, stacking distance delay, prop firm consistency protector, and 1:6 geometric risk-to-reward ratio.',
      stats: {
        winRate: '52.73%',
        profitFactor: '2.97',
        maxHistoricalDrawdown: '19.55%',
        backtestSpan: '100% Real Ticks on FxPro MT5 (Jan - Sep 2026, $100k Capital: $1,144,903.72 Net Profit)'
      },
      faq: [
        {
          q: 'Which MetaTrader platform is supported?',
          a: 'INSTITUTIONAL Adaptive Liquidity Pro V13 is built natively for MetaTrader 5 (MQL5) on Windows/PC and VPS.'
        },
        {
          q: 'Which market was this EA specifically engineered for?',
          a: 'It was engineered specifically for XAUUSD (Gold), capturing high-volatility liquidity sweeps and avoiding institutional traps. It can also be adapted to other high-liquidity instruments.'
        },
        {
          q: 'Can I use this on Prop Firm challenge accounts (FTMO, etc.)?',
          a: 'Yes. The Professional/Propfirm Version includes dedicated Prop Firm Consistency Protectors, daily profit capping to satisfy challenge rules, and a 1% Risk Prop Firm Safe mode maintaining 4-6% max drawdown.'
        },
        {
          q: 'Does it use Martingale or Grid?',
          a: 'Zero Martingale and Zero Grid. Every position has an immediate algorithmic Stop Loss placed upon entry and manages exposure with strict mathematical geometric risk.'
        },
        {
          q: 'Is source code available?',
          a: 'Yes. The With Source Code tier ($349) provides the full editable MQL5 (.mq5) source code alongside a Multi-Account license.'
        }
      ]
    });

    db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, short_description = ?, price = ?, currency = ?, platform = ?, metadata = ?
      WHERE id = 'prod_ea_adaptive_liquidity'
    `).run(
      'INSTITUTIONAL Adaptive Liquidity Pro V13',
      'An Advanced Algorithmic Trading Engine for XAUUSD (Gold) Developed by M. Dinga. Exploits institutional liquidity cycles through a Dual-Engine architecture (Dynamic Breakout & Weekly Squeeze Mean-Reversion), Profit Recycling, and Prop Firm Consistency Protection.',
      'Institutional algorithmic trading engine for XAUUSD (Gold) developed by M. Dinga. Dual-engine architecture with profit recycling and prop firm consistency protector.',
      199.00,
      'USD',
      'MetaTrader 5 (Windows / VPS)',
      eaMetadataSync
    );

    const ebook2MetaSync = JSON.stringify({
      author: 'M. Dinga (A Companion Volume to Build Trading Bots with AI & MQL5)',
      subtitle: 'Build Expert Advisors, Indicators & Pine Script Strategies with ChatGPT, Claude & Gemini',
      badge: 'Digital Guide & Prompt Playbook',
      format: 'Digital PDF (Instant Download)',
      compatibility: 'ChatGPT, Claude, Gemini, MetaTrader 5 (MQL5), TradingView (Pine Script v6)',
      includedTools: '150+ Tested Prompt Library & Case Studies',
      delivery: 'Immediate download access upon checkout + email backup link.',
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
    });

    db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, short_description = ?, platform = ?, image_url = ?, download_url = ?, metadata = ?
      WHERE id = 'prod_ebook_ai_prompt'
    `).run(
      'The AI Prompt Engineering Handbook for Trading Automation (Vol 2)',
      'The AI Prompt Engineering Handbook for Trading Automation (Vol 2) breaks down the exact communication framework required to turn ChatGPT, Claude, and Gemini into disciplined junior developers. Instead of falling into the "one-shot trap" where an AI hallucinates broken code, this guide introduces modular development: building your bot stage-by-stage using The Brain (rules), The Shield (risk), The Glasses (filters), and The Hands (trade management). Every concept is paired with tested prompt templates, negative constraints, and practical verification steps to keep execution safe and disciplined.',
      'Build Trading Robots & Indicators Using Purely AI. By M. Dinga.',
      'Digital PDF (Instant Download)',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Gemini_Generated_Image_v49p2qv49p2qv49p.jfif',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/The%20AI%20Prompt%20Engineering%20Handbook.pdf',
      ebook2MetaSync
    );

    db.prepare(`
      UPDATE products 
      SET name = ?, short_description = ?, image_url = ?, download_url = ?
      WHERE id = 'prod_ebook_mql5_guide'
    `).run(
      'Build Trading Bots with AI & MQL5 (Vol 1)',
      'Learn to Create Professional Expert Advisors & Custom Indicators — No Coding Experience Required. By M. Dinga.',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Gemini_Generated_Image_ltfrdfltfrdfltfr.jfif',
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Vol1-AI%20assisted%20mql5%20Development.pdf'
    );

    db.prepare(`
      UPDATE products 
      SET image_url = ?
      WHERE id = 'prod_ea_adaptive_liquidity'
    `).run(
      'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Adaptive_Liquidity_Pro_EA_MT5_200x200.bmp'
    );

    // Sync any existing customer downloads to point to verified Supabase PDF storage
    db.prepare(`
      UPDATE downloads
      SET download_url = 'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/Vol1-AI%20assisted%20mql5%20Development.pdf'
      WHERE product_id = 'prod_ebook_mql5_guide'
    `).run();

    db.prepare(`
      UPDATE downloads
      SET download_url = 'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/The%20AI%20Prompt%20Engineering%20Handbook.pdf'
      WHERE product_id = 'prod_ebook_ai_prompt'
    `).run();

    db.prepare(`
      UPDATE products 
      SET price = ?
      WHERE id = 'prod_service_custom_ea'
    `).run(375.00);

    // Seed authoritative academy lessons into SQLite
    try {
      const lessonCheck = db.prepare('SELECT COUNT(*) as count FROM academy_lessons').get() as { count: number };
      if (!lessonCheck || lessonCheck.count < SERVER_ACADEMY_LESSONS.length) {
        const insertLesson = db.prepare(`
          INSERT OR REPLACE INTO academy_lessons (
            id, uuid, course_id, order_index, level_name, lesson_number, title, summary, duration_minutes, is_free, content, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const now = new Date().toISOString();
        for (const l of SERVER_ACADEMY_LESSONS) {
          insertLesson.run(
            l.id,
            l.uuid || null,
            l.course_id,
            l.order_index,
            l.level_name,
            l.lesson_number,
            l.title,
            l.summary || '',
            l.duration_minutes || 15,
            l.is_free ? 1 : 0,
            l.content,
            now,
            now
          );
        }
        console.log(`[Database] Synced ${SERVER_ACADEMY_LESSONS.length} authoritative lessons into SQLite academy_lessons.`);
      }
    } catch (lessonErr) {
      console.warn('[Database] Academy lessons seed notice:', lessonErr);
    }
    // Seed masterclass pricing packages into products table
    const masterclasses = [
      { id: 'masterclass', name: 'Masterclass Core Curriculum', type: 'service', price: 159.0, desc: 'Complete mastery of Levels 4 through 8, advanced AI prompt engineering & certification.' },
      { id: 'masterclass-ea', name: 'Masterclass + Adaptive Liquidity Pro', type: 'service', price: 199.0, desc: 'The complete Masterclass combined with our flagship institutional trading robot.' },
      { id: 'premium', name: 'Premium VIP Masterclass', type: 'service', price: 299.0, desc: 'The ultimate professional trading architecture mentorship with extended EA license.' }
    ];
    for (const mc of masterclasses) {
      const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(mc.id);
      if (!existing) {
        db.prepare(`
          INSERT INTO products (id, name, type, description, short_description, price, currency, platform, active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'USD', 'Academy Web & Discord', 1, ?, ?)
        `).run(mc.id, mc.name, mc.type, mc.desc, mc.desc, mc.price, now, now);
      }
    }
  } catch (err) {
    console.error('Failed to sync product updates:', err);
  }
}

// Database query helpers
export const dbQueries = {
  // Users
  getUserByEmail(email: string) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
  getUserById(id: string) {
    return db.prepare('SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?').get(id);
  },
  createUser(user: { id: string; name: string; email: string; phone?: string; role: string; password_hash: string }) {
    const now = new Date().toISOString();
    return db.prepare(`
      INSERT INTO users (id, name, email, phone, role, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(user.id, user.name, user.email, user.phone || null, user.role, user.password_hash, now, now);
  },
  updateUserPassword(email: string, newPasswordHash: string) {
    const now = new Date().toISOString();
    return db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?').run(newPasswordHash, now, email);
  },
  getAllUsers() {
    return db.prepare('SELECT id, name, email, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC').all();
  },
  ensureUser(user: { id: string; name: string; email: string; phone?: string | null; role?: string }) {
    const existing = db.prepare('SELECT id, role, name, phone FROM users WHERE id = ? OR email = ?').get(user.id, user.email) as any;
    const now = new Date().toISOString();
    if (existing) {
      db.prepare(`
        UPDATE users 
        SET name = COALESCE(?, name), 
            phone = COALESCE(?, phone), 
            role = COALESCE(?, role), 
            updated_at = ?
        WHERE id = ?
      `).run(user.name || null, user.phone || null, user.role || null, now, existing.id);
      return existing.id;
    } else {
      db.prepare(`
        INSERT INTO users (id, name, email, phone, role, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        user.name || user.email.split('@')[0],
        user.email,
        user.phone || null,
        user.role || 'customer',
        'SUPABASE_AUTHENTICATED',
        now,
        now
      );
      return user.id;
    }
  },

  // Complimentary Access Queries
  getComplimentaryAccess(userIdOrEmail: string) {
    return db.prepare(`
      SELECT * FROM complimentary_access 
      WHERE (user_id = ? OR user_email = ?) AND status = 'active'
      ORDER BY granted_at DESC
      LIMIT 1
    `).get(userIdOrEmail, userIdOrEmail) as any;
  },
  getAllComplimentaryAccess() {
    return db.prepare('SELECT * FROM complimentary_access ORDER BY granted_at DESC').all();
  },
  grantComplimentaryAccess(userId: string, email: string, grantedBy: string, notes?: string) {
    const now = new Date().toISOString();
    const id = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    // Check if record exists
    const existing = db.prepare('SELECT id FROM complimentary_access WHERE user_id = ? OR user_email = ?').get(userId, email) as any;
    if (existing) {
      db.prepare(`
        UPDATE complimentary_access 
        SET status = 'active', 
            granted_at = ?, 
            granted_by = ?, 
            revoked_at = NULL, 
            revoked_by = NULL,
            notes = COALESCE(?, notes)
        WHERE id = ?
      `).run(now, grantedBy, notes || null, existing.id);
      return existing.id;
    } else {
      db.prepare(`
        INSERT INTO complimentary_access (id, user_id, user_email, access_type, status, granted_at, granted_by, notes)
        VALUES (?, ?, ?, 'masterclass', 'active', ?, ?, ?)
      `).run(id, userId, email, now, grantedBy, notes || 'Complimentary Masterclass access granted by administrator');
      return id;
    }
  },
  revokeComplimentaryAccess(userId: string, revokedBy: string) {
    const now = new Date().toISOString();
    return db.prepare(`
      UPDATE complimentary_access 
      SET status = 'revoked', 
          revoked_at = ?, 
          revoked_by = ? 
      WHERE (user_id = ? OR user_email = ?) AND status = 'active'
    `).run(now, revokedBy, userId, userId);
  },
  getUserAccessStatus(userId: string, email?: string) {
    const cleanEmail = (email || '').toLowerCase().trim();
    // 1. Check paid orders (by user_id OR user_email)
    const paidOrder = db.prepare(`
      SELECT id, product_id, created_at FROM orders 
      WHERE (user_id = ? OR (user_email IS NOT NULL AND LOWER(user_email) = ?)) AND payment_status = 'paid'
      ORDER BY created_at DESC LIMIT 1
    `).get(userId, cleanEmail || userId) as any;

    if (paidOrder) {
      return {
        access_status: 'paid' as const,
        can_access_masterclass: true,
        order_id: paidOrder.id,
        paid_at: paidOrder.created_at
      };
    }

    // 2. Check complimentary access
    const comp = this.getComplimentaryAccess(cleanEmail || userId);
    if (comp) {
      return {
        access_status: 'complimentary' as const,
        can_access_masterclass: true,
        complimentary_id: comp.id,
        granted_at: comp.granted_at,
        granted_by: comp.granted_by,
        notes: comp.notes
      };
    }

    // 3. Otherwise Free Academy only
    return {
      access_status: 'free' as const,
      can_access_masterclass: false
    };
  },

  // Authoritative Academy Lessons & User Progress (Protected in SQLite)
  getAllAcademyLessonsOutline() {
    return db.prepare(`
      SELECT id, uuid, course_id, order_index, level_name, lesson_number, title, summary, duration_minutes, is_free
      FROM academy_lessons
      ORDER BY order_index ASC
    `).all() as any[];
  },
  getAcademyLessonById(idOrIndex: string) {
    const numericIndex = parseInt(idOrIndex, 10);
    return db.prepare(`
      SELECT * FROM academy_lessons
      WHERE id = ? OR uuid = ? OR order_index = ?
      LIMIT 1
    `).get(idOrIndex, idOrIndex, isNaN(numericIndex) ? -1 : numericIndex) as any;
  },
  saveUserLessonProgress(userId: string, lessonId: string, isCompleted: boolean) {
    const now = new Date().toISOString();
    if (isCompleted) {
      const id = `ulp_${userId}_${lessonId}`;
      db.prepare(`
        INSERT OR REPLACE INTO user_lesson_progress (id, user_id, lesson_id, is_completed, completed_at)
        VALUES (?, ?, ?, 1, ?)
      `).run(id, userId, lessonId, now);
    } else {
      db.prepare(`
        DELETE FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?
      `).run(userId, lessonId);
    }
  },
  getUserCompletedLessons(userId: string) {
    const rows = db.prepare(`
      SELECT lesson_id FROM user_lesson_progress WHERE user_id = ? AND is_completed = 1
    `).all(userId) as any[];
    return rows.map((r: any) => r.lesson_id);
  },
  getAllUsersWithAccessStatus() {
    const users = db.prepare('SELECT id, name, email, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC').all() as any[];
    return users.map((u) => {
      const accessInfo = this.getUserAccessStatus(u.id, u.email);
      const paidOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND payment_status = "paid"').get(u.id) as any;
      return {
        ...u,
        access_status: accessInfo.access_status, // 'free' | 'paid' | 'complimentary'
        can_access_masterclass: accessInfo.can_access_masterclass,
        complimentary_details: accessInfo.access_status === 'complimentary' ? accessInfo : null,
        paid_orders_count: paidOrders?.count || 0,
      };
    });
  },

  // Sessions (Auth persistence across server restarts)
  saveSession(data: { token: string; userId: string; role: string; email: string; name: string }) {
    const now = new Date().toISOString();
    return db.prepare(`
      INSERT OR REPLACE INTO user_sessions (token, user_id, role, email, name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(data.token, data.userId, data.role, data.email, data.name, now);
  },
  getSession(token: string) {
    const row = db.prepare('SELECT token, user_id, role, email, name FROM user_sessions WHERE token = ?').get(token) as any;
    if (!row) return null;
    return {
      userId: row.user_id,
      role: row.role,
      email: row.email,
      name: row.name,
    };
  },
  deleteSession(token: string) {
    return db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
  },

  // Products
  getAllProducts(includeInactive = false) {
    if (includeInactive) {
      return db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    }
    return db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC').all();
  },
  getProductsByType(type: 'ea' | 'ebook' | 'service', includeInactive = false) {
    if (includeInactive) {
      return db.prepare('SELECT * FROM products WHERE type = ? ORDER BY created_at DESC').all(type);
    }
    return db.prepare('SELECT * FROM products WHERE type = ? AND active = 1 ORDER BY created_at DESC').all(type);
  },
  getProductById(id: string) {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
  createProduct(product: {
    id: string;
    name: string;
    type: string;
    description: string;
    short_description?: string;
    price: number;
    currency?: string;
    platform?: string;
    image_url?: string;
    download_url?: string;
    active?: number;
    metadata?: string;
  }) {
    const now = new Date().toISOString();
    return db.prepare(`
      INSERT INTO products (id, name, type, description, short_description, price, currency, platform, image_url, download_url, active, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      product.id,
      product.name,
      product.type,
      product.description,
      product.short_description || null,
      product.price,
      product.currency || 'USD',
      product.platform || null,
      product.image_url || null,
      product.download_url || null,
      product.active !== undefined ? product.active : 1,
      product.metadata || null,
      now,
      now
    );
  },
  updateProduct(id: string, updates: Partial<{
    name: string;
    type: string;
    description: string;
    short_description: string;
    price: number;
    platform: string;
    image_url: string;
    download_url: string;
    active: number;
    metadata: string;
  }>) {
    const current = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, unknown>;
    if (!current) return null;
    const now = new Date().toISOString();
    const merged = { ...current, ...updates, updated_at: now };
    db.prepare(`
      UPDATE products
      SET name = ?, type = ?, description = ?, short_description = ?, price = ?, platform = ?, image_url = ?, download_url = ?, active = ?, metadata = ?, updated_at = ?
      WHERE id = ?
    `).run(
      merged.name,
      merged.type,
      merged.description,
      merged.short_description,
      merged.price,
      merged.platform,
      merged.image_url,
      merged.download_url,
      merged.active,
      merged.metadata,
      merged.updated_at,
      id
    );
    return this.getProductById(id);
  },

  // Orders
  createOrder(order: {
    id: string;
    user_id: string;
    product_id: string;
    amount: number;
    currency?: string;
    payment_status?: string;
    transaction_id: string;
  }) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO orders (id, user_id, product_id, amount, currency, payment_status, transaction_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order.id,
      order.user_id,
      order.product_id,
      order.amount,
      order.currency || 'USD',
      order.payment_status || 'paid',
      order.transaction_id,
      now,
      now
    );

    // If product is an EA, create a license key
    const product = this.getProductById(order.product_id) as { type: string; download_url?: string } | undefined;
    let license = null;
    if (product && product.type === 'ea') {
      const licenseKey = `EAH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const licId = `lic_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      const startsAt = now;
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      const expiresAt = new Date(Date.now() + oneYearMs).toISOString();
      const defaultNotes = 'Order confirmed. EA binary files are compiled securely and provisioned manually by administrators.';

      db.prepare(`
        INSERT INTO licenses (id, user_id, product_id, order_id, license_key, license_type, status, delivery_status, delivery_notes, starts_at, expires_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        licId,
        order.user_id,
        order.product_id,
        order.id,
        licenseKey,
        'Terminal License',
        'active',
        'pending',
        defaultNotes,
        startsAt,
        expiresAt,
        now,
        now
      );

      license = {
        id: licId,
        user_id: order.user_id,
        product_id: order.product_id,
        order_id: order.id,
        license_key: licenseKey,
        license_type: 'Terminal License',
        status: 'active',
        delivery_status: 'pending',
        delivery_notes: defaultNotes,
        starts_at: startsAt,
        expires_at: expiresAt,
        created_at: now,
        updated_at: now
      };
    }

    // Create download record ONLY for non-EAs (e.g. eBooks)
    // The EA itself is NEVER automatically downloadable!
    if (product && product.type !== 'ea' && product.download_url) {
      const dlId = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      db.prepare(`
        INSERT INTO downloads (id, user_id, product_id, order_id, download_url, download_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(dlId, order.user_id, order.product_id, order.id, product.download_url, 0, now);
    }

    return { orderId: order.id, license };
  },
  getOrdersByUser(userId: string) {
    return db.prepare(`
      SELECT o.*, p.name as product_name, p.type as product_type, p.platform as product_platform, p.image_url as product_image
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(userId);
  },
  getAllOrders() {
    return db.prepare(`
      SELECT o.*, u.name as user_name, u.email as user_email, p.name as product_name, p.type as product_type
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `).all();
  },

  // Admin license management queries
  getAllLicenses() {
    return db.prepare(`
      SELECT l.*, 
             u.name as user_name, u.email as user_email,
             p.name as product_name, p.platform as product_platform, p.type as product_type,
             o.payment_status, o.amount as order_amount, o.currency as order_currency, o.transaction_id
      FROM licenses l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN products p ON l.product_id = p.id
      LEFT JOIN orders o ON l.order_id = o.id
      ORDER BY l.created_at DESC
    `).all();
  },
  getLicenseById(id: string) {
    return db.prepare(`
      SELECT l.*, 
             u.name as user_name, u.email as user_email,
             p.name as product_name, p.platform as product_platform, p.type as product_type,
             o.payment_status, o.amount as order_amount, o.currency as order_currency, o.transaction_id
      FROM licenses l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN products p ON l.product_id = p.id
      LEFT JOIN orders o ON l.order_id = o.id
      WHERE l.id = ?
    `).get(id);
  },
  updateLicense(id: string, updates: { starts_at?: string; expires_at?: string; status?: string; delivery_status?: string; delivery_notes?: string }) {
    const current = db.prepare('SELECT * FROM licenses WHERE id = ?').get(id) as any;
    if (!current) {
      throw new Error(`License with ID ${id} not found.`);
    }
    const startsAt = updates.starts_at !== undefined ? updates.starts_at : (current.starts_at || current.created_at);
    const expiresAt = updates.expires_at !== undefined ? updates.expires_at : current.expires_at;
    const status = updates.status !== undefined ? updates.status : current.status;
    const deliveryStatus = updates.delivery_status !== undefined ? updates.delivery_status : (current.delivery_status || 'pending');
    const deliveryNotes = updates.delivery_notes !== undefined ? updates.delivery_notes : current.delivery_notes;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE licenses
      SET starts_at = ?, expires_at = ?, status = ?, delivery_status = ?, delivery_notes = ?, updated_at = ?
      WHERE id = ?
    `).run(startsAt, expiresAt, status, deliveryStatus, deliveryNotes, now, id);

    return this.getLicenseById(id);
  },

  // Customer items
  getCustomerEAs(userId: string) {
    return db.prepare(`
      SELECT p.*, 
             l.id as license_id,
             l.license_key, 
             l.status as license_status, 
             l.license_type,
             l.delivery_status,
             l.delivery_notes,
             l.starts_at,
             l.expires_at,
             NULL as download_url, 
             0 as download_count, 
             o.created_at as purchased_at,
             o.id as order_id,
             o.amount as order_amount,
             o.currency as order_currency
      FROM orders o
      JOIN products p ON o.product_id = p.id
      LEFT JOIN licenses l ON (l.order_id = o.id OR (l.product_id = p.id AND l.user_id = ?))
      WHERE o.user_id = ? AND p.type = 'ea' AND o.payment_status = 'paid'
      GROUP BY p.id
      ORDER BY o.created_at DESC
    `).all(userId, userId);
  },
  getCustomerEbooks(userId: string) {
    return db.prepare(`
      SELECT p.*, d.download_url, d.download_count, o.created_at as purchased_at
      FROM orders o
      JOIN products p ON o.product_id = p.id
      LEFT JOIN downloads d ON d.product_id = p.id AND d.user_id = ?
      WHERE o.user_id = ? AND p.type = 'ebook' AND o.payment_status = 'paid'
      GROUP BY p.id
    `).all(userId, userId);
  },
  getCustomerProjects(userId: string) {
    const rows = db.prepare(`
      SELECT * FROM ea_projects WHERE user_id = ? ORDER BY created_at DESC
    `).all(userId) as any[];
    return rows.map(r => ({
      ...r,
      title: r.title || r.project_name,
      project_name: r.project_name || r.title,
      strategy_description: r.strategy_description || r.description,
    }));
  },
  getAllProjects() {
    const rows = db.prepare(`
      SELECT * FROM ea_projects ORDER BY created_at DESC
    `).all() as any[];
    return rows.map(r => ({
      ...r,
      title: r.title || r.project_name,
      project_name: r.project_name || r.title,
      strategy_description: r.strategy_description || r.description,
    }));
  },
  createProject(data: {
    id: string;
    user_id?: string | null;
    title: string;
    description: string;
    raw_strategy_input?: string;
    platform?: string;
    budget_tier?: string;
    assigned_developer_id?: string | null;
    customer_email?: string | null;
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_telegram?: string | null;
    instrument?: string | null;
    timeframe?: string | null;
  }) {
    const now = new Date().toISOString();
    const titleVal = data.title;

    // Ensure user_id exists to satisfy foreign key constraint
    let validUserId = data.user_id;
    if (validUserId) {
      const u = db.prepare('SELECT id FROM users WHERE id = ?').get(validUserId);
      if (!u) validUserId = undefined;
    }
    if (!validUserId && data.customer_email) {
      const u = db.prepare('SELECT id FROM users WHERE email = ?').get(data.customer_email) as { id: string } | undefined;
      if (u) validUserId = u.id;
    }
    if (!validUserId) {
      // Ensure usr_demo_customer exists
      const demoUser = db.prepare('SELECT id FROM users WHERE id = ?').get('usr_demo_customer');
      if (!demoUser) {
        db.prepare(`
          INSERT OR IGNORE INTO users (id, name, email, role, password_hash, created_at, updated_at)
          VALUES ('usr_demo_customer', 'Valued Trader', 'trader@supermegafx.com', 'customer', 'trader123', ?, ?)
        `).run(now, now);
      }
      validUserId = 'usr_demo_customer';
    }

    db.prepare(`
      INSERT INTO ea_projects (
        id, user_id, project_name, title, description, raw_strategy_input,
        status, platform, budget_tier, assigned_developer_id,
        customer_email, customer_name, customer_phone, customer_telegram,
        instrument, timeframe, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.id,
      validUserId,
      titleVal,
      titleVal,
      data.description,
      data.raw_strategy_input || null,
      'review',
      data.platform || 'MT5',
      data.budget_tier || 'standard',
      data.assigned_developer_id || 'usr_dev_01',
      data.customer_email || null,
      data.customer_name || null,
      data.customer_phone || null,
      data.customer_telegram || null,
      data.instrument || null,
      data.timeframe || null,
      now,
      now
    );
    const row = db.prepare('SELECT * FROM ea_projects WHERE id = ?').get(data.id) as any;
    if (row) {
      return {
        ...row,
        title: row.title || row.project_name,
        project_name: row.project_name || row.title,
        strategy_description: row.strategy_description || row.description,
      };
    }
    return row;
  },
  updateProjectStatus(projectId: string, status: string) {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE ea_projects SET status = ?, updated_at = ? WHERE id = ?
    `).run(status, now, projectId);
    const row = db.prepare('SELECT * FROM ea_projects WHERE id = ?').get(projectId) as any;
    if (row) {
      return {
        ...row,
        title: row.title || row.project_name,
        project_name: row.project_name || row.title,
        strategy_description: row.strategy_description || row.description,
      };
    }
    return row;
  },

  // Custom dev leads methods
  recordCustomDevLead(lead: {
    id: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    telegram?: string | null;
    platform?: string;
    instrument?: string;
    timeframe?: string;
    strategy_idea: string;
    generated_prompt?: string | null;
    status?: string;
  }) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO custom_dev_leads (
        id, email, name, phone, telegram, platform, instrument, timeframe,
        strategy_idea, generated_prompt, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      lead.id,
      lead.email,
      lead.name || null,
      lead.phone || null,
      lead.telegram || null,
      lead.platform || 'MetaTrader 5 (MQL5)',
      lead.instrument || 'All Forex / Metals',
      lead.timeframe || '15-Minute',
      lead.strategy_idea,
      lead.generated_prompt || null,
      lead.status || 'pending_review',
      now
    );
    return db.prepare('SELECT * FROM custom_dev_leads WHERE id = ?').get(lead.id);
  },
  getAllCustomDevLeads() {
    return db.prepare('SELECT * FROM custom_dev_leads ORDER BY created_at DESC').all();
  },

  // Email logs methods
  logEmail(log: {
    id: string;
    recipient: string;
    subject: string;
    body: string;
    source: string;
    status: string;
  }) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO email_logs (id, recipient, subject, body, source, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(log.id, log.recipient, log.subject, log.body, log.source, log.status, now);
  },
  getAllEmailLogs() {
    return db.prepare('SELECT * FROM email_logs ORDER BY created_at DESC').all();
  },

  // Strategy Submissions
  createStrategySubmission(data: {
    id: string;
    user_id?: string | null;
    submission_id: string;
    full_name: string;
    email: string;
    phone: string;
    telegram?: string | null;
    platform: string;
    strategy_title: string;
    original_strategy: string;
    structured_strategy?: string | null;
    clear_strategy?: string | null;
    generated_prompt?: string | null;
    instrument?: string | null;
    timeframe?: string | null;
    direction?: string | null;
    entry_conditions?: string | null;
    exit_conditions?: string | null;
    risk_management?: string | null;
    trading_conditions?: string | null;
    trade_management?: string | null;
    additional_rules?: string | null;
    missing_information?: string | null;
    status?: string;
    email_status?: string;
    email_sent_at?: string | null;
    email_error?: string | null;
  }) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO strategy_submissions (
        id, user_id, submission_id, full_name, email, phone, telegram, platform,
        strategy_title, original_strategy, structured_strategy, clear_strategy,
        generated_prompt, instrument, timeframe, direction, entry_conditions,
        exit_conditions, risk_management, trading_conditions, trade_management,
        additional_rules, missing_information, status, email_status, email_sent_at,
        email_error, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      data.id,
      data.user_id || null,
      data.submission_id,
      data.full_name,
      data.email,
      data.phone,
      data.telegram || null,
      data.platform,
      data.strategy_title,
      data.original_strategy,
      data.structured_strategy || null,
      data.clear_strategy || null,
      data.generated_prompt || null,
      data.instrument || null,
      data.timeframe || null,
      data.direction || null,
      data.entry_conditions || null,
      data.exit_conditions || null,
      data.risk_management || null,
      data.trading_conditions || null,
      data.trade_management || null,
      data.additional_rules || null,
      data.missing_information || null,
      data.status || 'submitted',
      data.email_status || 'pending',
      data.email_sent_at || null,
      data.email_error || null,
      now,
      now
    );
    return db.prepare('SELECT * FROM strategy_submissions WHERE id = ?').get(data.id);
  },

  updateStrategySubmissionEmailStatus(
    submissionId: string,
    emailStatus: string,
    emailError?: string | null,
    emailSentAt?: string | null
  ) {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE strategy_submissions
      SET email_status = ?, email_error = ?, email_sent_at = ?, updated_at = ?
      WHERE id = ? OR submission_id = ?
    `).run(emailStatus, emailError || null, emailSentAt || null, now, submissionId, submissionId);
    return db.prepare('SELECT * FROM strategy_submissions WHERE id = ? OR submission_id = ?').get(submissionId, submissionId);
  },

  getAllStrategySubmissions() {
    return db.prepare('SELECT * FROM strategy_submissions ORDER BY created_at DESC').all();
  },

  getStrategySubmissionById(idOrSubId: string) {
    return db.prepare('SELECT * FROM strategy_submissions WHERE id = ? OR submission_id = ?').get(idOrSubId, idOrSubId);
  },

  // Admin stats
  getAdminStats() {
    const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
    const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number }).count;
    const totalRevenueRow = db.prepare('SELECT SUM(amount) as total FROM orders WHERE payment_status = "paid"').get() as { total: number | null };
    const totalRevenue = totalRevenueRow.total || 0;

    const eaSales = (db.prepare(`
      SELECT COUNT(o.id) as count
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE p.type = 'ea' AND o.payment_status = 'paid'
    `).get() as { count: number }).count;

    const ebookSales = (db.prepare(`
      SELECT COUNT(o.id) as count
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE p.type = 'ebook' AND o.payment_status = 'paid'
    `).get() as { count: number }).count;

    const customProjects = (db.prepare('SELECT COUNT(*) as count FROM ea_projects').get() as { count: number }).count;

    return {
      totalUsers,
      totalOrders,
      totalRevenue,
      eaSales,
      ebookSales,
      customProjects
    };
  },

  // Academy Student Progress Tracking
  saveAcademyProgress(data: {
    email: string;
    completedLessonIds: string[];
    quizScores?: Record<string, number>;
    lastLessonId?: string;
  }) {
    const now = new Date().toISOString();
    const cleanEmail = data.email.trim().toLowerCase();
    const completedStr = JSON.stringify(data.completedLessonIds || []);
    const scoresStr = data.quizScores ? JSON.stringify(data.quizScores) : null;
    const lastLesson = data.lastLessonId || null;

    db.prepare(`
      INSERT INTO academy_progress (email, completed_lesson_ids, quiz_scores, last_lesson_id, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        completed_lesson_ids = excluded.completed_lesson_ids,
        quiz_scores = COALESCE(excluded.quiz_scores, academy_progress.quiz_scores),
        last_lesson_id = COALESCE(excluded.last_lesson_id, academy_progress.last_lesson_id),
        updated_at = excluded.updated_at
    `).run(cleanEmail, completedStr, scoresStr, lastLesson, now);

    return {
      email: cleanEmail,
      completedLessonIds: data.completedLessonIds || [],
      quizScores: data.quizScores || {},
      lastLessonId: lastLesson,
      updatedAt: now
    };
  },

  getAcademyProgress(email: string) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const row = db.prepare('SELECT * FROM academy_progress WHERE email = ?').get(cleanEmail) as any;
    if (!row) return null;
    return {
      email: row.email,
      completedLessonIds: JSON.parse(row.completed_lesson_ids || '[]'),
      quizScores: row.quiz_scores ? JSON.parse(row.quiz_scores) : {},
      lastLessonId: row.last_lesson_id,
      updatedAt: row.updated_at
    };
  },

  // Free eBook email leads methods
  recordEmailLead(lead: {
    id: string;
    email: string;
    name?: string | null;
    source?: string;
    bookId?: string;
  }) {
    const cleanEmail = lead.email.trim().toLowerCase();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO email_leads (id, email, name, source, book_id, download_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = COALESCE(excluded.name, email_leads.name),
        source = excluded.source,
        book_id = excluded.book_id,
        updated_at = excluded.updated_at
    `).run(
      lead.id,
      cleanEmail,
      lead.name || null,
      lead.source || 'free_ebook_download',
      lead.bookId || 'free_lead_magnet_traders_guide',
      now,
      now
    );
    return db.prepare('SELECT * FROM email_leads WHERE email = ?').get(cleanEmail);
  },

  getEmailLead(email: string) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    return db.prepare('SELECT * FROM email_leads WHERE email = ?').get(cleanEmail);
  },

  incrementEmailLeadDownload(email: string) {
    if (!email) return;
    const cleanEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE email_leads
      SET download_count = download_count + 1,
          last_downloaded_at = ?,
          updated_at = ?
      WHERE email = ?
    `).run(now, now, cleanEmail);
  },

  getAllEmailLeads() {
    return db.prepare('SELECT * FROM email_leads ORDER BY created_at DESC').all();
  }
};
