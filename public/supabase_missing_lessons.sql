-- =========================================================================
-- SUPABASE SQL SCRIPT: ADD MISSING LESSONS (6.4, 7.4, 8.1, 8.2, 8.3, 8.4)
-- Run this in your Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. Ensure Table Structure & RLS
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_free BOOLEAN DEFAULT false
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on courses" ON public.courses;
CREATE POLICY "Allow public read access on courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on lessons" ON public.lessons;
CREATE POLICY "Allow public read access on lessons" ON public.lessons FOR SELECT USING (true);


-- Upsert Course Records (The 8 University Levels)
INSERT INTO public.courses (id, title, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Level 1: Preschool — Strategy Architect Mindset', 'The foundation of AI Trading Architecture: understanding why the AI is a literal machine, translating eyeball rules into machine facts, avoiding hallucinations, and safety testing.'),
  ('00000000-0000-0000-0000-000000000002', 'Level 2: Kindergarten — Programming Concepts in Plain English', 'Demystifying variables, booleans, functions, and loops through everyday visual analogies before touching a single line of MQL5 code.'),
  ('00000000-0000-0000-0000-000000000003', 'Level 3: Elementary — Robot Architecture & Blueprints', 'The 5 MQL5 program types, the robot lifecycle (OnInit, OnTick, OnDeinit), and assembling the 4 Modular Lego Blocks (Brain, Shield, Hands, Senses).'),
  ('00000000-0000-0000-0000-000000000004', 'Level 4: Middle School — Indicator Math & Signal Logic', 'Deconstructing moving average lag, dynamic ATR volatility bands, and multi-indicator confluence architecture without statistical multicollinearity.'),
  ('00000000-0000-0000-0000-000000000005', 'Level 5: High School — Institutional Liquidity & Smart Money Logic', 'Algorithmic detection of liquidity sweeps, Fair Value Gaps (FVG), order block absorption, and multi-timeframe Optimal Trade Entry (OTE) discount zones.'),
  ('00000000-0000-0000-0000-000000000006', 'Level 6: Undergraduate — Visual Tools & On-Screen Dashboards', 'Custom indicators, pushpin buffers, smart mobile push alerts, ADR volatility fuel gauges, session boxes, on-screen interactive HUD panels, and TradingView Pine Script v6 automation.'),
  ('00000000-0000-0000-0000-000000000007', 'Level 7: Senior Year — Debugging & Code Audits Without Reading Code', 'The "Explain It To Me" pre-flight audit protocol, syntax compiler errors vs silent logic errors, the 4 common AI hallucination patterns, and 2-stage out-of-sample backtesting against curve-fitting.'),
  ('00000000-0000-0000-0000-000000000008', 'Level 8: Graduation Capstone — Real-World Practical Projects', '4 production-grade capstone projects: The Volatility Exhaustion Bot, The Automated Trade Manager, The Prop Firm Challenge EA, and The Multi-Bot Control Dashboard, plus official graduation certification.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;


-- 2. Safely remove any outdated / partial records for these specific lessons
DELETE FROM public.lessons 
WHERE (course_id = '00000000-0000-0000-0000-000000000006' AND lesson_number = 4)
   OR (course_id = '00000000-0000-0000-0000-000000000007' AND lesson_number = 4)
   OR (course_id = '00000000-0000-0000-0000-000000000008' AND lesson_number IN (1, 2, 3, 4));

-- 3. Insert Missing Lessons (6.4, 7.4, 8.1, 8.2, 8.3, 8.4)

INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '00000006-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000006',
  21,
  $BODY$Level 6: Undergraduate — Visual Tools & On-Screen Dashboards$BODY$,
  4,
  $BODY$Lesson 6.4: Bonus — TradingView Pine Script v6 Automation 🌲$BODY$,
  $BODY$# Lesson 6.4: Bonus — TradingView Pine Script v6 Automation 🌲

While MetaTrader 5 is the undisputed king of automated order execution, millions of traders love TradingView for its sleek charting, social scripts, and cloud alerts.

As a Strategy Architect, your prompt engineering skills are **100% universal**! You can use the exact same 5-Ingredient Master Prompt recipe to generate TradingView Pine Script v6 code!

---

## 🌲 MQL5 vs. TradingView Pine Script v6

| Feature | MetaTrader 5 (MQL5) 🤖 | TradingView (Pine Script v6) 🌲 |
| :--- | :--- | :--- |
| **Primary Use** | Direct Order Execution & MT5 EAs | Chart Analysis, Cloud Backtesting, & Webhooks |
| **Execution** | Runs on local MT5 terminal / VPS | Runs in TradingView's Cloud |
| **Strategy Logic** | Event-driven (`OnTick()`) | Series-based calculation (`strategy()`) |
| **Bridging** | Directly manages MT5 broker account | Sends Webhook JSON alerts to MT5 / Prop Firm Bridges |

---

## 🔗 Webhook Automation: The TradingView-to-MT5 Bridge

How do you execute trades on MetaTrader or a Prop Firm using a TradingView Pine Script strategy?

1. **Pine Script Strategy**: Generates a buy signal on TradingView's cloud.
2. **Webhook Alert**: TradingView sends a structured JSON message over the internet to a bridge service (like PineConnector or TraderPost).
3. **MT5 Receiver**: The bridge receiver instantly executes the order on your MetaTrader 5 broker account in less than 100 milliseconds!

```text
TradingView Cloud 🌲  ───►  JSON Webhook Alert 📡  ───►  MT5 Broker Account 🤖
```

---

## 💬 The Pine Script v6 Prompt Directive

> 💬 **Strategy Architect Directive**:
> *"ROLE: Act as an expert Pine Script v6 developer. OBJECTIVE: Write a complete Pine Script v6 strategy that buys when the 9 EMA crosses above the 21 EMA. CONSTRAINTS: Include strategy.entry() and strategy.exit() with a 1:2 Risk/Reward ratio. Format webhook alert messages in JSON format for automated bridge execution."*

---

## 🧠 Pop Quiz 6.4!

**Question**: How does a TradingView Pine Script strategy automatically trigger live trades on a MetaTrader 5 broker account?
* A) By printing the chart out on paper and mailing it to the broker.
* B) By sending automated Webhook JSON alert messages over the internet to a bridge receiver.
* C) TradingView and MT5 are the exact same program so no bridge is needed.

🎯 **Answer & Celebration**:
* **Correct Answer**: **B) By sending automated Webhook JSON alert messages over the internet to a bridge receiver!**
* 🎉 **CONGRATULATIONS! YOU HAVE GRADUATED FROM LEVEL 6: UNDERGRADUATE!**

---

## 🏆 Level 6 Master Recap

You've just unlocked **The Vision System**—transforming raw charts into high-tech visual flight cockpits!
* 🔔 **Custom Indicators & Smart Alerts**: Visual pushpin buffers and mobile phone push notifications via `SendNotification()`.
* ⏱️ **Volatility & Session Panels**: Measuring ADR daily fuel usage and highlighting institutional trading session boxes.
* 🖥️ **On-Screen Control Dashboards**: Interactive HUD panels with mouse-clickable buttons via `OnChartEvent()`.
* 🌲 **TradingView Pine Script v6**: Extending your prompt architecture skills to Pine Script v6 and webhook bridge automation.

💡 Ready to advance to **Level 7: Senior Year (Debugging & Code Audits Without Reading Code)**? Continue below!$BODY$,
  false
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;


INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '00000007-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000007',
  25,
  $BODY$Level 7: Senior Year — Debugging & Code Audits Without Reading Code$BODY$,
  4,
  $BODY$Lesson 7.4: Out-of-Sample Backtesting & Curve-Fitting Verification 📈$BODY$,
  $BODY$# Lesson 7.4: Out-of-Sample Backtesting & Curve-Fitting Verification 📈

Imagine a student who gets access to the exact questions and answers for a math exam two weeks in advance. They memorize every answer and score 100%!

Does that mean they are a math genius? No! It just means they memorized the past test. If you give them a new pop quiz with different numbers, they will fail completely!

In algorithmic trading, this trap is called **Curve-Fitting (Over-Optimization)**.

```text
                  ┌────────────────────────────────────────────────────────┐
                  │                 THE 2-STAGE BACKTEST                   │
                  └───────────────────────────┬────────────────────────────┘
                                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              ▼                                                               ▼
  ┌───────────────────────┐                                       ┌───────────────────────┐
  │ Stage 1: IN-SAMPLE    │                                       │ Stage 2: OUT-OF-SAMPLE│
  │ (2020 - 2023 Data)    │                                       │ (2024 - 2025 Data)    │
  ├───────────────────────┤                                       ├───────────────────────┤
  │ • Optimize Parameters │                                       │ • SECRET ACID TEST!   │
  │ • Find Best Settings  │ ────────────────────────────────────► │ • ZERO Rule Changes!  │
  │ • Curve-Fit Setup     │                                       │ • MUST STAY PROFITABLE│
  └───────────────────────┘                                       └───────────────────────┘
```

---

## 🧪 The In-Sample vs. Out-of-Sample Protocol

To ensure your EA has a genuine market edge and hasn't just memorized historical price noise, follow this 2-stage backtest pipeline:

### Stage 1: In-Sample Optimization (Historical Training Data)
* **Date Range**: e.g., January 2020 to December 2023.
* **What You Do**: Run the MT5 Strategy Tester across this 4-year period. Adjust moving average periods, stop loss distances, and session filters to find the most robust settings.

### Stage 2: Out-of-Sample Acid Test (Unseen Future Data)
* **Date Range**: e.g., January 2024 to Present.
* **CRUCIAL RULE**: **Do NOT change a single input setting!**
* **What You Do**: Run the EA across this reserved, unseen data range.
* **The Verdict**:
  * If the performance curve stays steady and profitable ➔ The strategy has a real market edge! ✅
  * If the performance curve instantly nose-dives ➔ The strategy was curve-fitted! ❌ Throw out the settings and rebuild.

---

## 💬 The Out-of-Sample Directive

> 💬 **Strategy Architect Directive**:
> *"When validating strategy performance in the MT5 Strategy Tester, reserve the most recent 20% of historical data as an Out-of-Sample test window. Never adjust input settings after running the Out-of-Sample test."*

---

## 🧠 Pop Quiz 7.4!

**Question**: What is the purpose of running an "Out-of-Sample" backtest on reserved, unseen historical data?
* A) To make backtests run in 3D graphic mode.
* B) To prove that the EA has a real market edge rather than just memorizing (curve-fitting) past price noise.
* C) To bypass broker spread fees.

🎯 **Answer & Celebration**:
* **Correct Answer**: **B) To prove that the EA has a real market edge rather than just memorizing (curve-fitting) past price noise!**
* 🎉 **CONGRATULATIONS! YOU HAVE GRADUATED FROM LEVEL 7: SENIOR YEAR!**

---

## 🏆 Level 7 Master Recap

You are now a certified software auditor!
* ✈️ **Pre-Flight Audit**: Forcing the AI to explain trade and risk logic in plain English before opening MetaEditor.
* 🚦 **Compiler vs. Logic Errors**: Fixing syntax typos via error logs vs. diagnosing silent math bugs using Expected vs. Actual directives.
* 🕵️‍♂️ **4 AI Mistake Patterns**: Auditing for OnTick() setup bloat, hardcoded point values (0.0001), missing MagicNumbers, and infinite loops.
* 📈 **Out-of-Sample Testing**: Reserving unseen historical data to destroy curve-fitted strategies before risking capital.

💡 Ready for the ultimate final level: **Level 8: Graduation Capstone (4 Real-World Projects)**? Continue below!$BODY$,
  false
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;


INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '00000008-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000008',
  26,
  $BODY$Level 8: Graduation Capstone — Real-World Practical Projects$BODY$,
  1,
  $BODY$Lesson 8.1: Project 1 — The Volatility Exhaustion Bot ⛽$BODY$,
  $BODY$# Level 8: Graduation Capstone — Real-World Practical Projects

WELCOME TO THE ULTIMATE FINAL LEVEL! 🎉

You’ve conquered every theoretical layer of the School of AI Trading Architecture. You know how to translate human eyeball setups into machine facts, design modular Lego blocks, run surgical code fixes, build safety shields, and audit AI code without reading syntax.

In Level 8: Graduation Capstone, you put everything together by building 4 complete, production-grade real-world trading projects drawn directly from the case studies in *The AI Prompt Engineering Handbook* and *Build Trading Bots with AI & MQL5*.

---

# Lesson 8.1: Project 1 — The Volatility Exhaustion Bot ⛽

## ❌ The Problem It Solves

Manual traders frequently lose money buying late breakouts. You see price spiking upward, jump into a Buy trade, and price immediately reverses! Why? Because the market ran out of fuel—the symbol already used up 100% of its average daily price movement.

---

## 🧱 The Architecture

This bot pairs a **Block 1 (Brain)** breakout trigger with a **Block 3 (Glasses)** volatility guard:
* **Entry Trigger**: Buy when a candle closes above the highest high of the last 20 candles on the 1-Hour chart.
* **Volatility Filter**: Calculate the 5-day Average Daily Range (ADR). If today's high-to-low move has already consumed more than 70% of the 5-day ADR, **BLOCK new trade entries**!
* **Risk Shield**: Calculate position size dynamically risking 1% of account equity, setting the Stop Loss at the recent 5-candle low.

```text
20-Candle Breakout Signal 📈  ───►  Check 5-Day ADR Usage  ───►  [ > 70% Used? BLOCK TRADE 🛑 ]
                                                          ───►  [ < 70% Used? EXECUTE BUY ✅ ]
```

---

## 💬 The Master Capstone Prompt 8.1

> 💬 **Prompt**:
> *"ROLE: Act as a senior MT5 developer.
> CONTEXT: I am building a breakout Expert Advisor for EURUSD H1.
> OBJECTIVE:
> 1. Buy when the candle closes above the highest high of the last 20 candles.
> 2. Calculate 5-Day ADR. If today's high-to-low range exceeds 70% of 5-Day ADR, block new entries.
> 3. Calculate lot size dynamically based on 1% account risk with Stop Loss at the recent 5-candle low.
> CONSTRAINTS: Include user inputs for ADR limit %, Magic Number, and Risk %.
> FORMAT: Provide the complete MQL5 script with plain-English comments next to key functions."*

---

## 🧠 Pop Quiz 8.1!

**Question**: Why does the Volatility Exhaustion Bot block buy signals when today's range exceeds 70% of the 5-day ADR?
* A) To prevent buying at the top of a market move when price has already exhausted its average daily range.
* B) To force MetaTrader 5 to close for the weekend.
* C) Because ADR indicators only work on demo accounts.

🎯 **Answer & Celebration**:
* **Correct Answer**: **A) To prevent buying at the top of a market move when price has already exhausted its average daily range!**
* 🎉 **BOOM! You're an execution guardian!** Filtering out tired moves saves you from buying the absolute high of the day!$BODY$,
  false
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;


INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '00000008-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000008',
  27,
  $BODY$Level 8: Graduation Capstone — Real-World Practical Projects$BODY$,
  2,
  $BODY$Lesson 8.2: Project 2 — The Automated Trade Manager 🖐️$BODY$,
  $BODY$# Lesson 8.2: Project 2 — The Automated Trade Manager 🖐️

## ❌ The Problem It Solves

Many traders prefer analyzing charts and picking entry setups manually, but struggle with emotional trade management—getting greedy, moving stop losses further away, or failing to lock in profit while away from the desk.

---

## 🧱 The Architecture

This tool is a **pure background utility EA with ZERO entry logic**. It sits on your chart, monitors manual orders, and automatically manages trade exits:
* **Target Filter**: Scans open positions on the chart and manages trades containing the word "Manual" in their trade comment.
* **Break-Even Trigger**: When profit reaches 1.5x the initial Stop Loss distance, auto-move the Stop Loss to Entry Price + 10 points buffer.
* **Partial Close**: When profit hits 2.0x the initial Stop Loss distance, auto-close 50% of the lot size.
* **ATR Trailing Stop**: Trail the Stop Loss 20 pips behind current price once active.

---

## 💬 The Master Capstone Prompt 8.2

> 💬 **Prompt**:
> *"ROLE: Act as an MT5 developer.
> OBJECTIVE: Write an MT5 Expert Advisor that has NO entry logic. It only manages open manual trades.
> MANAGEMENT RULES:
> 1. Target positions on the chart matching the trade comment 'Manual'.
> 2. Move Stop Loss to Entry + 10 points buffer when profit reaches 1.5x initial SL distance.
> 3. Close 50% of trade volume when profit reaches 2.0x initial SL distance.
> 4. Trail Stop Loss 20 pips behind price after Break-Even is active.
> CONSTRAINTS: Fire partial closes strictly ONCE per trade ticket so it doesn't repeat partial closes on subsequent ticks."*

---

## 🧠 Pop Quiz 8.2!

**Question**: Why must an Automated Trade Manager check ticket numbers before executing a partial close?
* A) To prevent the bot from repeatedly closing 50% of the remaining volume on every single tick.
* B) To change the chart color to yellow.
* C) To notify your broker that you are taking a lunch break.

🎯 **Answer & Celebration**:
* **Correct Answer**: **A) To prevent the bot from repeatedly closing 50% of the remaining volume on every single tick!**
* 🎉 **HIGH FIVE! Spot on!** Firing management functions strictly once per ticket guarantees clean, hands-free profit protection!$BODY$,
  false
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;


INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '00000008-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000008',
  28,
  $BODY$Level 8: Graduation Capstone — Real-World Practical Projects$BODY$,
  3,
  $BODY$Lesson 8.3: Project 3 — The Prop Firm Challenge EA 🛡️$BODY$,
  $BODY$# Lesson 8.3: Project 3 — The Prop Firm Challenge EA 🛡️

## ❌ The Problem It Solves

Prop-firm evaluations demand strict discipline. A single emotional trade or news spike can wipe out a 5% daily limit and fail a funded challenge instantly.

---

## 🧱 The Architecture

This project combines all 9 steps of our development pipeline into a complete funded-account robot:
* **Daily Equity Shield**: Records starting balance at 00:00 server time. If daily floating + closed loss hits 4.0% (a 1% safety buffer below the firm's 5.0% cap), close all positions and lock the bot until midnight.
* **Total Drawdown Shield**: If total account loss reaches 9.0% from initial balance, close all positions and permanently halt trading.
* **Dynamic Lot Sizing**: Auto-calculates position size based on exact 1.0% account risk using `OrderCalcProfit` to verify real broker pip values.

```text
00:00 Server Time ➔ Store Day Balance ──► Floating Drawdown Hits 4.0% ──► Close Trades & Lock Until Midnight 🛡️
```

---

## 💬 The Master Capstone Prompt 8.3

> 💬 **Prompt**:
> *"ROLE: Act as a professional MT5 developer specializing in prop-firm systems.
> OBJECTIVE: Build a prop-firm compliant EA for EURUSD H1 using 9/21 EMA crossover entry signals.
> RISK SHIELD:
> 1. Record starting day balance at 00:00 server time.
> 2. Daily Loss Limit: Close all trades and lock entries if daily drawdown hits 4.0%.
> 3. Total Drawdown: Permanently stop trading if total loss hits 9.0% of initial balance.
> 4. Auto-calculate lot size based on 1.0% risk per trade.
> FORMAT: Provide complete, modular MQL5 code."*

---

## 🧠 Pop Quiz 8.3!

**Question**: Why do Strategy Architects include a 1% safety buffer on prop-firm daily loss limits (setting the EA shield at 4% when the firm's limit is 5%)?
* A) To protect against slippage and spread widening during fast market moves so you never breach the hard limit.
* B) Because prop firms pay extra bonuses for EAs set at 4%.
* C) MetaTrader 5 only calculates even numbers.

🎯 **Answer & Celebration**:
* **Correct Answer**: **A) To protect against slippage and spread widening during fast market moves so you never breach the hard limit!**
* 🎉 **YOU ARE A MASTER ARCHITECT!** Safety buffers are the secret weapon behind funded-account longevity!$BODY$,
  false
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;


INSERT INTO public.lessons (id, course_id, order_index, level_name, lesson_number, title, content, is_free)
VALUES (
  '00000008-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000008',
  29,
  $BODY$Level 8: Graduation Capstone — Real-World Practical Projects$BODY$,
  4,
  $BODY$Lesson 8.4: Project 4 — The Multi-Bot Control Dashboard 🖥️$BODY$,
  $BODY$# Lesson 8.4: Project 4 — The Multi-Bot Control Dashboard 🖥️

## ❌ The Problem It Solves

When running multiple EAs across different pairs, tracking individual strategy performance in the standard MT5 trade tab is cluttered and confusing.

---

## 🧱 The Architecture

An on-screen HUD Table Indicator overlaying the top-left corner of your chart canvas:
* **Multi-Magic Tracking**: Reads open positions and history across Magic Numbers 10001 (Scalper), 20002 (Breakout), and 30003 (Trend).
* **Real-Time Data Display**: Displays open position count, today's P&L in dollars, and status (ACTIVE in green, or HALTED in red) for each Magic Number.
* **Summary Row**: Displays total account equity change at the bottom.

```text
┌─────────────────────────────────────────────────────────────┐
│ 📊 MULTI-BOT DASHBOARD                                      │
├──────────┬─────────────┬────────────────┬───────────────────┤
│ MAGIC    │ BOT NAME    │ OPEN TRADES    │ TODAY P&L ($)     │
├──────────┼─────────────┼────────────────┼───────────────────┤
│ 10001    │ Scalper     │ 1              │ +$45.00  🟢       │
│ 20002    │ Breakout    │ 0              │ +$110.00 🟢       │
│ 30003    │ Trend EA    │ 2              │ -$25.00  🔴       │
├──────────┴─────────────┴────────────────┴───────────────────┤
│ TOTAL DAILY EQUITY CHANGE: +$130.00 (Pass 🟢)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 💬 The Master Capstone Prompt 8.4

> 💬 **Prompt**:
> *"ROLE: Act as an MQL5 dashboard developer.
> OBJECTIVE: Write an MQL5 dashboard indicator that displays in the top-left corner of my chart.
> SPECIFICATION: Create a table tracking Magic Numbers 10001, 20002, and 30003. Display: EA Name, Open Position Count, Today's Closed P&L in dollars, and Status (ACTIVE/HALTED). Add a bottom summary row displaying total account daily equity change."*

---

## 🧠 Pop Quiz 8.4!

**Question**: How does a Multi-Bot Control Dashboard separate the performance of three different EAs running on the same account?
* A) By filtering open orders and trade history by each EA's unique Magic Number.
* B) By changing the chart timeframe every 10 seconds.
* C) By sending an email to MetaQuotes support.

🎯 **Answer & Celebration**:
* **Correct Answer**: **A) By filtering open orders and trade history by each EA's unique Magic Number!**
* 🎉 **CONGRATULATIONS! YOU HAVE COMPLETED ALL 8 LEVELS OF THE SCHOOL OF AI TRADING ARCHITECTURE!**

---

## 🎓 OFFICIAL GRADUATION DIPLOMA

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                        SCHOOL OF AI TRADING ARCHITECTURE                     │
│                                                                              │
│   THIS CERTIFIES THAT YOU HAVE SUCCESSFULLY MASTERED THE ART AND SCIENCE OF  │
│                   AI-ASSISTED MQL5 & STRATEGY ARCHITECTURE                   │
│                                                                              │
│   LEVEL 1: PRESCHOOL     ➔ Mindset & Translating Ideas to Rules               │
│   LEVEL 2: KINDERGARTEN  ➔ Variables, Conditions, Functions & Loops           │
│   LEVEL 3: ELEMENTARY    ➔ MQL5 Program Types & 4 Lego Blocks                 │
│   LEVEL 4: MIDDLE SCHOOL ➔ 5-Ingredient Prompts & Surgical Code Fixes         │
│   LEVEL 5: HIGH SCHOOL   ➔ Auto-Lot Sizing & Prop Firm Shields               │
│   LEVEL 6: UNDERGRADUATE ➔ Custom Indicators, HUD Dashboards & Pine Script    │
│   LEVEL 7: SENIOR YEAR   ➔ Plain-English Audits & Out-of-Sample Backtests     │
│   LEVEL 8: GRADUATION    ➔ 4 Real-World Production Capstones                  │
│                                                                              │
│             OFFICIALLY CERTIFIED: STRATEGY ARCHITECT 🚀                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 What Would You Like to Do Next?

Now that you hold your Strategy Architect Diploma, here are three ways we can continue working together:
1. 🧪 **Build Your Custom EA Blueprint**: Share your specific manual trading setup with me, and we'll draft your complete 5-Ingredient Master Prompt step-by-step!
2. 🛠️ **Explore Custom Development**: Have our expert engineering team build, test, and deliver a bug-free MetaTrader 5 EA directly for you.
3. 📈 **Deploy Adaptive Liquidity Pro EA**: Explore our flagship, ready-to-run automated trading robot equipped with institutional liquidity tracking and built-in prop-firm safety shields.

Congratulations once again, Professor! What is our next move?$BODY$,
  false
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  order_index = EXCLUDED.order_index,
  level_name = EXCLUDED.level_name,
  lesson_number = EXCLUDED.lesson_number,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_free = EXCLUDED.is_free;
