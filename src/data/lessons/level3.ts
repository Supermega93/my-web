import { Lesson } from '../../types.ts';

export const LEVEL3_LESSONS: Lesson[] = [
  {
    id: 'lesson-3-1',
    course_id: '00000000-0000-0000-0000-000000000003',
    order_index: 9,
    level_name: 'Level 3: Elementary — Robot Architecture & Blueprints',
    lesson_number: 1,
    title: 'Lesson 3.1: The 5 Program Types (Robots vs. Gauges vs. Helpers) 🚘',
    summary: 'Distinguish between the 5 distinct MQL5 program types: Expert Advisors (EAs), Custom Indicators, Utility Scripts, Include Files (.mqh), and Services.',
    duration_minutes: 15,
    is_free: true,
    content: `
# Welcome to Level 3: Elementary!

You have officially reached the grand finale of our Free Academy Tier!

By now, you understand that an AI is a literal machine, you know how to turn vague "guru words" into exact machine facts, and you can speak the language of variables, conditions, functions, and loops.

Now, it’s time to assemble these concepts into a complete, professional-grade software blueprint. In Level 3, you will learn the five different types of trading programs, how a robot's event-driven heartbeat works, and how to structure your strategy using the 4 Lego Blocks Architecture!

---

# Lesson 3.1: The 5 Program Types (Robots vs. Gauges vs. Helpers) 🚘

When you open MetaTrader 5 (MT5) or ask an AI assistant to build software, you must first answer a fundamental question: **What kind of program do you actually need?**

In MQL5, trading programs are not all created equal. There are five distinct program types, and telling your AI assistant exactly which one you want is the single highest-leverage habit you can build to prevent structural code errors!

Think of it like choosing a vehicle from an automotive showroom:

\`\`\`text
┌──────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
│   1. Expert Advisor      │    │   2. Custom Indicator    │    │    3. Utility Script     │
│  [ Fully Autonomous Car ]│    │ [ Dashboard Speedometer ]│    │ [ One-Click Remote Key ] │
└──────────────────────────┘    └──────────────────────────┘    └──────────────────────────┘
\`\`\`

### 1. Expert Advisors (EAs) 🤖 — The Autonomous Self-Driving Car
* **What It Is**: A full trading robot that runs continuously on your chart.
* **What It Does**: It reads price tick data, calculates indicators, evaluates buy/sell logic, and automatically opens, manages, and closes trades on your account.
* **When to Ask for It**: Whenever you want to automate a trading strategy from start to finish without human intervention.

### 2. Custom Indicators 📊 — The Dashboard Speedometer
* **What It Is**: A visual tool that draws lines, bands, arrows, or color-coded boxes on your price chart.
* **What It Does**: It performs mathematical calculations and stores them in visual memory blocks called *buffers* to draw custom indicators (like moving average crossovers or support levels).
* **CRUCIAL RULE**: **Custom Indicators can NEVER place trades!** They are visual tools only. If you want to see visual signals and place automated trades, you must build an EA that reads an Indicator.

### 3. Utility Scripts ⚡ — The One-Click Remote Key
* **What It Is**: A single-task helper program that executes once and then immediately shuts down.
* **What It Does**: Instead of running continuously, a script performs an instant job when dragged onto a chart—such as *"Close All Open Orders,"* *"Delete All Pending Orders,"* or *"Calculate Position Size for a $500 Risk."*
* **When to Ask for It**: When you trade manually but want instant, one-click automated helpers.

### 4. Libraries & Include Files (.mqh) 🧰 — The Universal Parts Toolbox
* **What It Is**: Reusable collections of functions stored in separate files.
* **What It Does**: Instead of asking the AI to re-write risk management code for every single EA you build, you save that logic inside an Include file. Your EAs simply plug into this toolbox whenever needed!

### 5. Services 🕵️‍♂️ — The Background Security Guard
* **What It Is**: Background utility programs that run across your entire MT5 terminal rather than sitting on a specific chart.
* **What It Does**: Typically used for account monitoring, multi-account logging, or external communications.

---

## 💡 Strategy Architect Directive

Before typing your prompt into an AI, always state the exact program type in sentence #1:
> 💬 *"Write an MQL5 Expert Advisor for MetaTrader 5 that..."*  
> 💬 *"Write an MQL5 Custom Indicator that draws..."*

`
  },
  {
    id: 'lesson-3-2',
    course_id: '00000000-0000-0000-0000-000000000003',
    order_index: 10,
    level_name: 'Level 3: Elementary — Robot Architecture & Blueprints',
    lesson_number: 2,
    title: "Lesson 3.2: The Robot's Heartbeat (The EA Lifecycle) 💓",
    summary: 'Master the event-driven architecture of MetaTrader: OnInit() startup, OnTick() heartbeat, OnTimer() clock checks, and OnDeinit() cleanup.',
    duration_minutes: 16,
    is_free: true,
    content: `
# Lesson 3.2: The Robot's Heartbeat (The EA Lifecycle) 💓

A common mistake beginner traders make is assuming an Expert Advisor runs like a movie playing from start to finish.

In reality, MT5 trading robots operate on an **event-driven framework**. The EA sits quietly on your chart, waiting for specific market events to occur before waking up, executing a chunk of code, and going back to sleep!

These event trigger points are called **Event Handlers**, and they form the heartbeat of your Expert Advisor!

\`\`\`text
                    ┌──────────────────────────────────────────────┐
                    │               OnInit() - Startup             │
                    │        (Fires ONCE when attached)            │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │               OnTick() - Heartbeat           │
                    │      (Fires every time price changes!)       │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │              OnDeinit() - Shutdown           │
                    │        (Fires ONCE when removed)             │
                    └──────────────────────────────────────────────┘
\`\`\`

---

## 💓 The Core Events of the EA Lifecycle

Here are the main events that govern every Expert Advisor:

### 1. OnInit() — The Morning Startup Alarm
* **When It Fires**: Exactly once when the EA is attached to a chart, MT5 is restarted, or you change input parameters.
* **What Belongs Here**: One-time preparation tasks—such as checking user risk settings, loading indicator handles, and creating trade objects.

### 2. OnTick() — The Heartbeat of the EA
* **When It Fires**: Every single time a new price tick arrives for your currency pair (which can happen multiple times per second!).
* **What Belongs Here**: Your active strategy rules! Checking entry conditions, calculating live stop loss levels, and managing open positions.

### 3. OnTimer() — The Clock Check
* **When It Fires**: At fixed time intervals defined by you (e.g., every 60 seconds), regardless of whether price is moving.
* **What Belongs Here**: Non-tick tasks, like checking an economic news schedule or resetting daily loss counters at midnight.

### 4. OnTrade() / OnTradeTransaction() — The Security Guard
* **When It Fires**: The moment an order is opened, modified, filled, or closed on your trading account.

### 5. OnDeinit() — Bedtime Cleanup
* **When It Fires**: Exactly once when the EA is removed from the chart or MT5 closes.
* **What Belongs Here**: Housekeeping duties—removing custom chart buttons and printing final performance summaries.

---

## 🚨 The #1 AI Hallucination Bug to Catch!

One of the most frequent bugs generated by AI tools is putting one-time setup tasks (like loading indicator handles or checking account balance limits) inside \`OnTick()\` instead of \`OnInit()\`.

Because \`OnTick()\` executes thousands of times a day, placing setup code inside \`OnTick()\` forces your EA to re-initialize its memory every single second! This bogs down your platform, causes lag during trade execution, and triggers unexpected bugs.

**How to Catch It**: When running your "Explain It To Me" Safety Check, ask the AI:
> 💬 *"Confirm whether your initialization setup happens inside OnInit(), and ensure OnTick() only evaluates live price logic."*

`
  },
  {
    id: 'lesson-3-3',
    course_id: '00000000-0000-0000-0000-000000000003',
    order_index: 11,
    level_name: 'Level 3: Elementary — Robot Architecture & Blueprints',
    lesson_number: 3,
    title: 'Lesson 3.3: The 4 Lego Blocks Architecture 🧱 & Graduation',
    summary: 'Construct complete Expert Advisors using The Brain (Entry/Exit), The Shield (Risk/Safety), The Glasses (Filters/Guards), and The Hands (Active Management), followed by the Free Academy Graduation.',
    duration_minutes: 20,
    is_free: true,
    content: `
# Lesson 3.3: The 4 Lego Blocks Architecture 🧱

Trying to ask an AI to write a complete, 500-line trading robot in a single prompt is a recipe for disaster. This triggers the "One-Shot Trap", causing the AI to mix up stop loss calculations, forget safety filters, or drop risk rules.

As a Strategy Architect, you avoid this trap by building your trading robot using **four modular Lego blocks**!

\`\`\`text
┌────────────────────────────────────────────────────────────────────────┐
│  🧱 THE 4 LEGO BLOCKS OF A PROFESSIONAL EXPERT ADVISOR                │
├────────────────────────────────────────────────────────────────────────┤
│  🧠 Block 1: THE BRAIN    ➔ Entry Triggers & Take Profit Logic         │
│  🛡️ Block 2: THE SHIELD   ➔ Auto Lot-Sizing & Daily Loss Safety        │
│  👓 Block 3: THE GLASSES  ➔ Spread Filters, Sessions, & News Guards    │
│  🖐️ Block 4: THE HANDS    ➔ Trailing Stops & Break-Even Triggers       │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 🧠 Block 1: The Brain (Entry & Exit Triggers)
* **What It Does**: Contains the pure mathematical conditions required to open and close a position.
* **Strategy Architect Checklist Rules**:
  * Exact Timeframe & Pair (e.g., EURUSD H1).
  * Entry Trigger (e.g., 9 EMA crosses above 21 EMA on candle close).
  * Exit / Take Profit Trigger (e.g., Fixed 1:2 Risk-to-Reward ratio).

---

## 🛡️ Block 2: The Shield (Risk Management & Safety)
* **What It Does**: Calculates your position size dynamically and protects your capital against catastrophic losses.
* **Strategy Architect Checklist Rules**:
  * Dynamic Risk Sizing (e.g., Risk exactly 1.0% of free equity per trade).
  * Max Daily Loss Protection (e.g., Halt all trading if daily drawdown reaches 4.0%).
  * Max Open Trades (e.g., Limit account to 1 open trade at a time).

---

## 👓 Block 3: The Glasses (Execution Filters & Guards)
* **What It Does**: Scans market conditions and tells the robot when NOT to trade!
* **Strategy Architect Checklist Rules**:
  * Max Spread Guard (e.g., Block trades if current spread exceeds 20 points).
  * Trading Session Filter (e.g., Only allow trade entries between 08:00 and 17:00 broker server time).
  * New Candle Rule (e.g., Evaluate entry rules strictly once per candle open).

---

## 🖐️ Block 4: The Hands (Active Position Management)
* **What It Does**: Manages open trades after they have entered the market.
* **Strategy Architect Checklist Rules**:
  * Break-Even Trigger (e.g., Move Stop Loss to Entry + 2 pips once profit hits 20 pips).
  * ATR Trailing Stop (e.g., Trail Stop Loss behind price using 2x ATR).
  * Partial Close (e.g., Close 50% of trade volume at 1:1 Risk/Reward).

---

## 💡 Why Building Modular Blocks Guarantees Success

When you build your bot block-by-block, you can test each module individually. If your trailing stop isn't working, you don't rewrite your entry rules! You simply tell the AI to adjust **Block 4 (The Hands)** while leaving the rest of your system working perfectly!

---

# 🎓 The Free Academy Graduation & Your Next Step

\`\`\`text
   ┌────────────────────────────────────────────────────────────────────────┐
   │                                                                        │
   │      🥳 CONGRATULATIONS! YOU HAVE OFFICIALLY GRADUATED FROM           │
   │             THE SCHOOL OF AI TRADING ARCHITECTURE!                     │
   │                         (FREE ACADEMY TIER)                            │
   │                                                                        │
   └────────────────────────────────────────────────────────────────────────┘
\`\`\`

Take a moment to give yourself a massive high-five! 🖐️

You have successfully completed Levels 1, 2, and 3 of the School of AI Trading Architecture. Look at how far you've come:
1. **Level 1 (Preschool)**: You shed the non-coder fear, discovered that AI is a literal machine, and learned how to replace subjective "guru words" with exact machine facts.
2. **Level 2 (Kindergarten)**: You mastered variables as labelled boxes, conditions as decision checklists, functions as kitchen appliances, and loops as conveyor belts.
3. **Level 3 (Elementary)**: You learned the 5 MQL5 program types, mastered the EA's event-driven heartbeat, and discovered how to architect bots using the 4 Lego Blocks!

You now possess more practical knowledge about AI software design than 95% of retail traders trying to automate their strategies!

---

## 🚦 The Architect’s Crossroads: Choose Your Path!

Now that you have mastered the foundational theory, you stand at a crossroads. How do you want to apply your new superpowers?

Choose the path that best aligns with your goals:

\`\`\`text
                               THE ARCHITECT'S CROSSROADS
                                            │
       ┌────────────────────────────────────┼────────────────────────────────────┐
       │                                    │                                    │
       ▼                                    ▼                                    ▼
  🎓 PATH 1                            🛠️ PATH 2                            📈 PATH 3
  The Masterclass                      Custom Development                   Adaptive Liquidity Pro
  (Levels 4–8)                         (We Build It For You)                (Ready-Made EA)
\`\`\`

### 🎓 Path 1: The Masterclass (Paid Academy & Training eBooks)
* **Best For**: Traders who want to master AI prompt engineering step-by-step and build their own custom EAs, indicators, and prop-firm challenge bots.
* **What You Unlock in Levels 4–8**:
  * **The 5-Ingredient Master Prompt Library**: Over 150 ready-to-use, battle-tested prompt templates for ChatGPT, Claude, and Gemini.
  * **Prop Firm Challenge Shields**: Advanced drawdown limiters, equity caps, and news-blocking rules engineered for funded accounts.
  * **Custom Indicators & TradingView Pine Script v6**: Building visual dashboards, multi-timeframe alerts, and Pine Script strategies.
  * **4 Graduation Capstone Projects**: Complete, step-by-step builds including the Volatility Exhaustion Bot, Automated Trade Manager, Prop Firm Challenge EA, and Multi-Bot Control Dashboard.

### 🛠️ Path 2: Let Us Build It For You (Custom EA Development)
* **Best For**: Traders who have a winning manual strategy or rulebook, but don't have the time to write prompts, test code, or debug scripts themselves.
* **How It Works**:
  1. Sit down with our engineering team to review your strategy blueprint.
  2. Our expert developers build, test, and optimize a professional, bug-free MetaTrader 5 Expert Advisor tailored strictly to your rules.
  3. Receive a complete, ready-to-deploy EA complete with risk shields, user documentation, and source code.

### 📈 Path 3: Plug-and-Play Instantly (Adaptive Liquidity Pro EA)
* **Best For**: Traders who want a battle-tested, professional trading robot running on their MetaTrader 5 account today—without building or designing anything from scratch!
* **Key Features**:
  * **Institutional Liquidity Tracking**: Automated market-structure logic designed to capitalize on institutional order flow.
  * **Built-in Prop Firm Safety Shields**: Hardcoded max daily loss protection, equity trailing limits, and automated spread filters.
  * **Fully Automated Execution**: Plug it into MT5, select your risk preset, and let the software manage execution around the clock.

---

## 🌟 Final Words from Your Head Instructor

No matter which path you choose today, remember this: The era of manual execution errors, emotional trading, and coder-gatekeeping is officially over. You now hold the keys to AI trading architecture.

Keep thinking like an Architect, keep verifying your rules, and welcome to the future of automated trading! 🚀
`
  },
  {
    id: 'lesson-3-bonus',
    course_id: '00000000-0000-0000-0000-000000000003',
    order_index: 12,
    level_name: 'Level 3: Elementary — Robot Architecture & Blueprints',
    lesson_number: 4,
    title: 'Masterclass Bonus Chapter: Foundational Architecture & Master Examination (Levels 1–3)',
    summary: 'Integrate the foundational theory from Preschool, Kindergarten, and Elementary into actionable prompt blueprints, output auditing checklists, and the official 10-question Master Examination.',
    duration_minutes: 30,
    is_free: true,
    content: `
# 🎓 Masterclass Bonus Chapter: Foundational Architecture (Levels 1–3)

Welcome to the Masterclass Bonus Chapter for Levels 1–3 of the School of AI Trading Architecture.

This guide integrates the foundational theory from **Preschool (Level 1)**, **Kindergarten (Level 2)**, and **Elementary (Level 3)** into actionable AI prompt blueprints. It provides exact prompt templates, detailed breakdowns of what to expect from the AI's output, and a comprehensive Master Examination to verify your understanding.

---

## 🎓 Section 1: Level 1 (Preschool) — Strategy Architect Mindset & Safety Systems

### 1. Core Architectural Concepts

* **The AI is a Literal Machine**: Large language models have zero common sense. If you give a vague instruction (e.g., *"buy when the trend goes up"*), the AI will not ask clarifying questions; it will simply guess parameters like timeframe, indicator settings, and lot sizing.
* **Machine Facts vs. Eyeball Rules**: Human traders rely on subjective "eyeball" observations. Strategy Architects translate these setups into exact, mathematical "machine facts" using specific candle numbers, price levels, and indicator values so the AI never guesses.
* **The "People-Pleaser" Bug & Safety Protocol**: AI models want to provide code so badly that when they do not know an MQL5 function, they invent fake commands (AI hallucinations). You do not need to read MQL5 code to spot hallucinations; you enforce the "Explain It To Me" Safety Check in plain English before copying code into MetaTrader 5. Always follow the safety pipeline:
  $$\\text{Plain-English Check} \\longrightarrow \\text{MT5 Strategy Tester Backtest} \\longrightarrow \\text{Free Demo Forward Test} \\longrightarrow \\text{Live Account}$$

---

### 2. Level 1 Prompts

#### 💬 Prompt 1.1: Machine Fact Translation Directive

\`\`\`text
ROLE: Act as a senior MQL5 software architect for MetaTrader 5.

CONTEXT: I am converting a manual trading setup into an automated Expert Advisor.

OBJECTIVE: Take my manual trading rules below and identify any vague "eyeball" terms. Rewrite them into exact, unambiguous "Machine Facts" using specific price levels, candle numbers, and indicator parameters.

MANUAL RULES:
1. "Buy when the trend is strong on EURUSD."
2. "Enter on a bounce off support."
3. "Use a safe stop loss and a good profit target."

FORMAT: Output a comparison table with 3 columns: [Subjective Eyeball Rule 🛑], [Machine Fact Rule ✅], and [MQL5 Implementation Logic]. Do not generate full code yet—only the translated logic agreement.
\`\`\`

#### 💬 Prompt 1.2: The "Explain It To Me" Safety Check Directive

\`\`\`text
ROLE: Act as an MQL5 code auditor and trading instructor.

OBJECTIVE: Audit the generated MQL5 code before deployment.

DIRECTIVE: Before I copy and paste this code into MetaTrader 5, explain to me in 3 concise bullet points:
1. Exactly what market condition causes this code to open a Buy or Sell trade.
2. How the code calculates the position size and where the Stop Loss and Take Profit are placed.
3. Confirm whether any setup logic is placed inside OnTick() vs. OnInit().

CONSTRAINT: Do not use technical programming jargon. Explain it to me as if I am a beginner trader. If you used any assumed default values, list them explicitly.
\`\`\`

---

### 3. What is Expected After the Prompt

**Expected AI Output for Prompt 1.1**:
* The AI will present a structured table replacing vague terms with exact parameters:
  * *"Trend is strong"* $\\longrightarrow$ *"Price is above the 200-period EMA on the H1 timeframe."*
  * *"Bounce off support"* $\\longrightarrow$ *"Low of candle 1 touches the 50-period EMA and candle 1 closes green."*
  * *"Safe stop loss / good target"* $\\longrightarrow$ *"Stop Loss placed at lowest low of last 5 candles; Take Profit set to 1:2 Risk-to-Reward ratio."*
* **Verification Check**: Confirm that no subjective words like *"feels overbought"* or *"looks like support"* remain.

**Expected AI Output for Prompt 1.2**:
* A plain-English summary of the trade entry triggers and risk rules.
* Explicit confirmation that startup tasks are handled in \`OnInit()\` and live execution occurs in \`OnTick()\`.
* **Red Flags to Reject**: If the AI admits it guessed risk percentages (e.g., default 5% risk) or put indicator initialization inside \`OnTick()\`, command it to fix those parameters immediately before proceeding.

---

## 🎓 Section 2: Level 2 (Kindergarten) — Code Mechanics in Plain English

### 1. Core Architectural Concepts

* **Variables (Labelled Storage Boxes)**: Storage containers sitting on a shelf. The four primary types are \`int\` (whole numbers like trade counts), \`double\` (decimals like lot sizes and entry prices), \`bool\` (light switches holding true or false), and \`string\` (text notes).
* **Conditions (Decision Checklists)**: \`if / else\` checklists evaluated on price ticks. Rules are linked using **AND** (all rules must be true to enter) or **OR** (if any rule triggers, the action executes).
* **Functions (Kitchen Appliances)**: Modular mini-machines (like a toaster) designed for specific tasks. They accept raw ingredients (Parameters/Inputs), process them internally, and output a finished result (e.g., \`CalculateLotSize()\` takes balance, risk %, and stop pips to output exact lot size).
* **Loops (Conveyor Belts)**: Fast scanning engines that iterate through historical chart candles or active open orders in milliseconds.

---

### 2. Level 2 Prompts

#### 💬 Prompt 2.1: Labelled Boxes & Checklist Builder Directive

\`\`\`text
ROLE: Act as an MQL5 software developer.

OBJECTIVE: Define the input variables and decision checklist for a MetaTrader 5 EA.

SPECIFICATION:
1. Labelled Boxes (Variables):
   - Whole Number (int): MaxOpenTrades = 1, MagicNumber = 10001.
   - Precision Decimal (double): RiskPercent = 1.0, StopLossPips = 25.0, TakeProfitPips = 50.0.
   - Light Switch (bool): UseSpreadFilter = true, AllowLongTrades = true.
   - Sticky Note (string): TradeComment = "Breakout EA v1".
2. Decision Checklist (Conditions):
   - IF (10 EMA > 50 EMA) AND (Spread < 20 points) AND (No active open trades exist) --> Action: Open Buy Order.
   - ELSE --> Action: Remain flat and wait for next tick.

FORMAT: Provide the MQL5 input parameter block and the clear if/else condition block with comments explaining each variable type.
\`\`\`

#### 💬 Prompt 2.2: Modular Function & Conveyor Belt Loop Directive

\`\`\`text
ROLE: Act as a senior MQL5 developer.

OBJECTIVE: Write two self-contained, modular MQL5 functions for MT5.

FUNCTION 1 (Kitchen Appliance - Lot Size Calculator):
- Name: CalculateLotSize(double riskPct, int slPips)
- Ingredients: Account Equity, Risk Percentage, Stop Loss Pips.
- Output: Clamped lot size normalized to SYMBOL_VOLUME_STEP and bounded by SYMBOL_VOLUME_MIN and SYMBOL_VOLUME_MAX.

FUNCTION 2 (Conveyor Belt - Historical High Scanner):
- Name: GetHighestPrice(int lookbackCandles)
- Logic: Run a loop scanning from Candle 1 back through lookbackCandles (e.g., 20 candles). Compare candle highs and return the single highest price double value.

CONSTRAINT: Write clean, modular functions that can be pasted directly into an Include file (.mqh).
\`\`\`

---

### 3. What is Expected After the Prompt

**Expected AI Output for Prompt 2.1**:
* MQL5 input code using input keywords: \`input int MaxOpenTrades = 1;\`, \`input double RiskPercent = 1.0;\`, \`input bool UseSpreadFilter = true;\`, \`input string TradeComment = "...";\`.
* An \`if / else\` structure checking all conditions linked with \`&&\` operators.

**Expected AI Output for Prompt 2.2**:
* A standalone \`CalculateLotSize()\` function returning a \`double\` value that calls \`SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP)\` to prevent invalid lot errors.
* A \`for\` loop (\`for(int i=1; i<=lookbackCandles; i++)\`) scanning \`iHigh(_Symbol, _Period, i)\` and updating a tracker variable.
* **Verification Check**: Confirm the loop starts at candle index 1 (completed candle) rather than 0 (unclosed live candle) to avoid repainting errors.

---

## 🎓 Section 3: Level 3 (Elementary) — Robot Architecture & The 4 Lego Blocks

### 1. Core Architectural Concepts

* **The 5 MQL5 Program Types**: State the exact program type in sentence #1 of every prompt:
  * **Expert Advisor (EA)**: Fully autonomous trading robot.
  * **Custom Indicator**: Visual chart tools drawing lines or bands; can never place trades.
  * **Utility Script**: One-click helper executing once and shutting down.
  * **Include File (.mqh)**: Reusable toolbox of functions.
  * **Service**: Background terminal utility.
* **The Robot's Heartbeat (EA Lifecycle)**: MT5 EAs are event-driven. \`OnInit()\` fires once at startup. \`OnTick()\` fires on every price tick. \`OnDeinit()\` fires at shutdown.
* **The #1 AI Bug**: Putting setup tasks (like indicator handle loading) inside \`OnTick()\` re-initializes memory every second, freezing the platform. Always keep setup in \`OnInit()\`.
* **The 4 Lego Blocks Architecture**: Avoid the "One-Shot Trap" (asking for a 500-line EA in one prompt) by building modularly:
  * 🧠 **Block 1: The Brain** (Entry & Exit Triggers).
  * 🛡️ **Block 2: The Shield** (Auto Lot-Sizing & Risk Rules).
  * 👓 **Block 3: The Glasses** (Spread Filters & Session Guards).
  * 🖐️ **Block 4: The Hands** (Trailing Stops & Break-Even).

---

### 2. Level 3 Master Blueprint Prompt

#### 💬 Prompt 3.1: The 4 Lego Blocks Master EA Directive

\`\`\`text
ROLE: Act as a senior MT5 MQL5 software architect.

OBJECTIVE: Build a complete, modular Expert Advisor for EURUSD H1 using the 4 Lego Blocks Architecture.

PROGRAM TYPE: Expert Advisor (.mq5).

MODULE BREAKDOWN:
1. 🧠 BLOCK 1 (THE BRAIN):
   - Entry: Buy when 10 EMA crosses above 50 EMA on candle close (candle [1]).
   - Exit: Fixed 1:2 Risk-to-Reward ratio.

2. 🛡️ BLOCK 2 (THE SHIELD):
   - Risk 1.0% of Account Equity per trade. Calculate lot size dynamically.
   - Halt trading if daily account equity drawdown reaches 4.0%.

3. 👓 BLOCK 3 (THE GLASSES):
   - Max Spread Filter: Block entries if current spread > 20 points.
   - New Bar Rule: Evaluate trade logic strictly once per new candle open (isNewBar).

4. 🖐️ BLOCK 4 (THE HANDS):
   - Move Stop Loss to Break-Even (Entry + 2 pips) when trade reaches +1.5R floating profit.

LIFECYCLE CONSTRAINTS:
- Initialize all indicator handles and inputs strictly inside OnInit().
- Evaluate strategy logic inside OnTick() ONLY when a new bar opens.
- Clean up indicator handles inside OnDeinit().
\`\`\`

---

### 3. What is Expected After the Prompt

**Expected AI Output for Prompt 3.1**:
* A complete, structured \`.mq5\` file containing distinct sections for \`OnInit()\`, \`OnTick()\`, and \`OnDeinit()\`.
* Indicator handle calls (\`iMA()\`) located inside \`OnInit()\`, assigned to global variables.
* A \`isNewBar()\` helper check at the top of \`OnTick()\` to prevent tick-chatter execution.
* Separate, modular function blocks representing each Lego Block (\`CheckEntryConditions()\`, \`CheckRiskShield()\`, \`ApplyBreakEven()\`).
* **Verification Check**: Ensure the code compiles cleanly in MetaTrader 5 MetaEditor with 0 errors and 0 warnings.

---

## 🧠 Section 4: The Level 1–3 Master Examination

You have completed the foundational architecture review across Levels 1–3!

Below, complete the official **10-Question Master Examination** to test your knowledge, verify your institutional readiness, and earn your Foundational Architecture Mastery credentials.

Once you have verified your foundational knowledge through the exam, proceed to our grand finale practical capstone: **Lesson 3.5: Build Your First Breakout EA Workshop**!
`
  },
  {
    id: 'lesson-3-practical',
    course_id: '00000000-0000-0000-0000-000000000003',
    order_index: 13,
    level_name: 'Level 3: Elementary — Robot Architecture & Blueprints',
    lesson_number: 5,
    title: 'Lesson 3.5: Practical Workshop: Build Your First Breakout EA 🛠️',
    summary: 'The Free Tier Capstone Workshop: Transform a manual breakout strategy into a fully functional, compilable MetaTrader 5 Expert Advisor (.mq5) using AI assistance, the 4 Lego Blocks, and the Strategy Tester.',
    duration_minutes: 25,
    is_free: true,
    content: `
# Practical Exercise: Build Your First Breakout EA 🛠️

Welcome to your first hands-on build workshop!

Up to this point, you've learned how a Strategy Architect thinks, how programming mechanics translate to plain English, and how to structure a trading robot into 4 clean Lego Blocks.

Now it's time to put the tools in your hands. In this capstone exercise, you will transform a manual breakout setup into a working, compilable MetaTrader 5 Expert Advisor (.mq5) using AI assistance.

Remember our core rule: **You do not need to be a software developer to build institutional trading bots. You need to be a Strategy Architect who speaks plain English with mathematical precision.**

---

## 1. Lesson Overview & Objectives

The objective of this lesson is to transform a manual breakout strategy into a fully functional, compilable MetaTrader 5 Expert Advisor (\`.mq5\`) using AI assistance. As a Strategy Architect, you are moving beyond manual execution into the realm of algorithmic precision, ensuring your rules are executed with 100% consistency.

### 🏛️ The Strategy Architect Framework:
1. **I Learned**: Grounding the strategy in the 4 Lego Blocks and MQL5 lifecycle events.
2. **I Built**: Using a 5-ingredient master prompt to generate clean, modular code.
3. **I Tested**: Running the EA through the Strategy Tester to verify the "Machine Facts."
4. **I Verified**: Confirming logic via the "Explain It To Me" protocol and visual inspection.

### 📋 Prerequisite Check
This exercise is grounded in the Levels 1–3 architecture. You must apply:
* **The Preschool Mindset (Level 1)**: Converting eyeball rules and subjective "guru words" into unambiguous Machine Facts.
* **The Kindergarten Mechanics (Level 2)**: Structuring Variables, Conditions, and Functions.
* **The Elementary Structure (Level 3)**: Organizing the program into the 4 Lego Blocks: Brain, Shield, Glasses, and Hands.

\`\`\`text
   ┌────────────────────────────────────────────────────────────────────────┐
   │                    THE 4 LEGO BLOCKS IN ACTION                         │
   ├────────────────────────────────────────────────────────────────────────┤
   │  🧠 BLOCK 1: THE BRAIN    ➔ 20-Candle High Breakout + 1:2 R:R Target   │
   │  🛡️ BLOCK 2: THE SHIELD   ➔ 1.0% Equity Risk + Volume Clamping (Min/Max│
   │  👓 BLOCK 3: THE GLASSES  ➔ isNewBar() Check + 20-Point Spread Filter  │
   │  🖐️ BLOCK 4: THE HANDS    ➔ Break-Even (+2 pips) Lock at +1.0R Profit  │
   └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 2. Step 1: Defining the Strategy — From Eyeball Rules to Machine Facts

To get clean, production-ready code from an AI model, you must first eliminate subjective "guru words." An AI cannot code "buy when price looks strong" or "use a safe stop loss." Below is the translation of a standard breakout setup into mathematical facts that the machine can execute.

### 📊 Strategy Translation Table

| Subjective Eyeball Rule 🛑 | Machine Fact Rule ✅ |
| :--- | :--- |
| *"Buy when price breaks out."* | **Buy Trigger**: Candle [1] Close > Highest High of Candles [2] through [21]. |
| *"Use a safe stop loss."* | **Stop Loss**: Lowest Low of Candles [1] through [5]. |
| *"Set a good profit target."* | **Take Profit**: Entry Price + ((Entry Price - Stop Loss Price) * 2). (1:2 Risk/Reward). |
| *"Risk a small amount."* | **Risk**: Risk exactly 1.0% of Account Equity per trade. |
| *"Filter for high spreads."* | **Spread Guard**: Block entries if current spread > 20 points. |

### 📝 Machine Fact Specification

* **Program Type**: Expert Advisor (\`.mq5\`) for EURUSD H1.
* **Brain (Block 1)**:
  * **Buy Trigger**: Candle [1] Close > Highest High of Candles [2] through [21].
  * **Stop Loss**: Lowest Low of Candles [1] through [5].
  * **Take Profit**: 1:2 Risk/Reward ratio (Price distance from entry to TP is 2x the distance from entry to SL).
* **Shield (Block 2)**:
  * **Risk**: 1.0% of Account Equity per trade.
  * **Volume**: Dynamic lot sizing with broker volume clamping (\`SYMBOL_VOLUME_MIN\`, \`SYMBOL_VOLUME_MAX\`, \`SYMBOL_VOLUME_STEP\`) and normalization.
  * **Limit**: Maximum of one open trade allowed at any time (Magic Number \`123456\`).
* **Glasses (Block 3)**:
  * **Spread Filter**: Maximum 20 points (2 pips on standard accounts).
  * **Timing**: \`isNewBar()\` logic to ensure entry calculations run only once per candle open.
* **Hands (Block 4)**:
  * **Break-Even Logic**: Move Stop Loss to (Entry Price + 20 points / 2 pips) when floating profit reaches +1.0R (the distance of the initial risk).

---

## 3. Step 2: Prompt Engineering — The 5-Ingredient Master Prompt Recipe

Before generating a single line of code, we communicate our strategy to the AI in structured, unambiguous English. We use the **5-Ingredient Master Prompt Recipe**:

1. **👤 Role**: Define the AI as a **Senior MQL5 Software Architect**.
2. **🎬 Context**: Explain that you are converting a EURUSD H1 breakout setup into a modular MT5 Expert Advisor.
3. **🎯 Objective**: State the goal of generating clean, production-ready, compilable source code.
4. **🚧 Constraints**: Enforce the separation of \`OnInit()\` (for handles and setup) and \`OnTick()\` (for logic). Explicitly demand memory management: no indicator handles or expensive re-initializations inside the OnTick heartbeat. Mandate proper cleanup inside \`OnDeinit()\`.
5. **📄 Format**: Require structured code with comments identifying each of the 4 Lego Blocks.

---

## 4. Step 3: The Copy-and-Paste Master Prompt

Copy the prompt below into your AI assistant (ChatGPT, Claude, or Gemini). It incorporates all Machine Facts and architectural constraints defined above:

\`\`\`text
ROLE: Senior MQL5 Software Architect.

CONTEXT: I am building a Breakout Expert Advisor for EURUSD on the H1 timeframe.

OBJECTIVE: Generate a complete, modular, and compilable MQL5 Expert Advisor (.mq5) based on the 4 Lego Blocks Architecture.

MACHINE FACTS & SPECIFICATIONS:
1. BLOCK 1 (BRAIN): Buy when Candle [1] Close > Highest High of Candles [2] through [21]. Use handles for price/indicator data initialized in OnInit(). Set Stop Loss at the Lowest Low of Candles [1] to [5]. Set Take Profit at a 1:2 Risk/Reward ratio (Entry + (Risk * 2)).
2. BLOCK 2 (SHIELD): Risk 1.0% of Account Equity per trade. Calculate lot size dynamically, clamped by SYMBOL_VOLUME_MIN, MAX, and STEP. Limit to 1 open trade with Magic Number 123456.
3. BLOCK 3 (GLASSES): Max Spread Filter of 20 points. Use isNewBar() logic to ensure trade logic runs only once per candle open.
4. BLOCK 4 (HANDS): Break-Even logic: Move Stop Loss to (Entry Price + 20 points) once floating profit reaches +1.0R (the distance of the initial risk).

CONSTRAINTS:
- Use OnInit() to initialize all indicator handles or global data structures.
- OnTick() must strictly use isNewBar() and must NOT initialize handles.
- Use OnDeinit() for proper memory cleanup.
- Code must be modular with functions: CheckEntry(), CalculateLotSize(), GetHighestHigh(), GetLowestLow(), and ApplyBreakEven().
- Use comments to label the 4 Lego Blocks.

FORMAT: Provide the full .mq5 source code.
\`\`\`

---

## 5. Step 4: Safety Check & MetaEditor Deployment Protocol

### 🛡️ Safety Review: The "Explain It To Me" Protocol
Before copying generated code into your trading terminal, run this safety audit prompt. If the AI cannot explain its logic in plain English, do not run the code!

> 💬 **Copy & Paste this Safety Check into your AI**:  
> *"Before I copy and paste this code into MetaTrader, explain to me in three bullet points exactly how this code decides to open a trade, and how it decides how much money to risk. Do not use technical jargon; explain it to me like I am a beginner trader."*

### 💻 Deployment Guide
1. Open MetaTrader 5 and press **F4** to launch MetaEditor.
2. In MetaEditor, click **New > Expert Advisor (template)** and click Next.
3. Name your file: \`Breakout_EA_Level1to3\` and click Finish.
4. Select all existing template code (\`Ctrl+A\`) and press Delete.
5. Paste your AI-generated MQL5 code into the blank file.
6. Press **F7** to compile.

### 🔍 Debugging Checklist
* [ ] Does the "Errors" tab at the bottom show **0 Errors, 0 Warnings**?
* [ ] Are all global variables or initialization calls located inside \`OnInit()\`?
* [ ] Does the \`OnTick()\` heartbeat contain the \`isNewBar()\` check at the top?
* [ ] Are the 4 Lego Blocks clearly labeled with comments?

---

## 6. Step 5: Testing & Behaviour Verification in MT5 Strategy Tester

Now comes the moment of truth: verifying that the robot executes your Machine Facts in real market simulation!

### ⚙️ Strategy Tester Setup
1. In MetaTrader 5, press **Ctrl+R** to open the Strategy Tester panel.
2. Select \`Breakout_EA_Level1to3.ex5\` from the Expert Advisor dropdown.
3. Set Symbol to **EURUSD** and Period to **H1**.
4. Set Date range to **1 Year** (or "Last Year").
5. Choose Execution model: **"Every tick based on real ticks"** or **"1-minute OHLC"** for fast initial screening.
6. Click **Start** and switch between the **Graph** tab (equity curve) and **Journal** tab (trade logs).

### ✅ Success Criteria Checklist
* [ ] **Entry Accuracy**: Did trades trigger only when candle [1] closed above the 20-candle high?
* [ ] **Spread Guard**: Did the EA skip entries when spread was wider than 20 points?
* [ ] **Risk Shield**: Was the lot size dynamically calculated to risk exactly 1.0% of equity per trade?
* [ ] **Hands Logic**: Did the Stop Loss jump to Break-Even (Entry + 2 pips) once the position reached +1.0R floating profit?
* [ ] **Bar Timing**: Did the \`isNewBar()\` filter prevent duplicate trades on the same hourly candle?

---

## 7. Step 6: Reference Answer Key & Complete MQL5 Source Code

Below is the verified institutional reference code. Use this answer key to inspect your AI's output, compare modular function blocks, and verify proper MQL5 syntax.

### 📖 Strategy Summary
This EA identifies high-probability breakout momentum on EURUSD H1. It uses a lookback of 20 candles for the breakout trigger and 5 candles for the initial stop loss. It incorporates a robust **Shield** to dynamically size lots according to 1.0% equity risk, a **Glasses** filter to block high-spread conditions and tick chatter, and active **Hands** to lock in +2 pips at +1.0R profit.

### 💻 Verified Code Block (\`Breakout_EA_Level1to3.mq5\`)

\`\`\`mql5
//+------------------------------------------------------------------+
//|                                     Breakout_EA_Level1to3.mq5    |
//|                                  Senior MQL5 Software Architect  |
//+------------------------------------------------------------------+
#property strict

// --- Input Parameters
input int      InpLookback  = 20;         // Brain: Breakout Lookback (Candles)
input int      InpSLCount   = 5;          // Brain: Stop Loss Lookback (Candles)
input double   InpRiskPct   = 1.0;        // Shield: Risk Percentage per Trade
input int      InpMaxSpread = 20;         // Glasses: Max Spread Filter (Points)
input int      InpMagic     = 123456;     // Shield: Magic Number

// --- Global Variables
datetime g_lastBar;

//+------------------------------------------------------------------+
//| OnInit: Startup logic                                            |
//+------------------------------------------------------------------+
int OnInit()
{
   g_lastBar = 0;
   // Ensure symbol is synced
   SymbolSelect(_Symbol, true);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| OnTick: Main heartbeat                                           |
//+------------------------------------------------------------------+
void OnTick()
{
   // --- Block 4: The Hands (Manage existing trade even on same bar)
   ApplyBreakEven();

   // --- Block 3: The Glasses (New Bar Check)
   if(!isNewBar()) return;
   
   // --- Block 3: The Glasses (Spread Filter)
   if(SymbolInfoInteger(_Symbol, SYMBOL_SPREAD) > InpMaxSpread) return;

   // --- Block 2: The Shield (One Trade Limit)
   if(PositionSelectByMagic(InpMagic)) return;

   // --- Block 1: The Brain (Entry Logic)
   CheckEntry();
}

//+------------------------------------------------------------------+
//| Block 1: The Brain - Entry Logic                                 |
//+------------------------------------------------------------------+
void CheckEntry()
{
   double highLevel = GetHighestHigh(InpLookback);
   double close1 = iClose(_Symbol, _Period, 1);
   
   if(close1 > highLevel)
   {
      double sl = GetLowestLow(InpSLCount);
      if(sl >= close1) return; // Safety check
      
      double riskAmount = close1 - sl;
      double tp = close1 + (riskAmount * 2.0); // 1:2 R/R Rule
      
      double lots = CalculateLotSize(InpRiskPct, riskAmount);
      
      MqlTradeRequest request={};
      MqlTradeResult  result={};
      
      request.action       = TRADE_ACTION_DEAL;
      request.symbol       = _Symbol;
      request.volume       = lots;
      request.type         = ORDER_TYPE_BUY;
      request.price        = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
      request.sl           = sl;
      request.tp           = tp;
      request.deviation    = 10;
      request.magic        = InpMagic;
      request.comment      = "Breakout Level 1-3";
      request.type_filling = ORDER_FILLING_FOK;
      
      if(!OrderSend(request, result))
         Print("OrderSend failed with error: ", GetLastError());
   }
}

//+------------------------------------------------------------------+
//| Block 1: The Brain - Data Access Functions                       |
//+------------------------------------------------------------------+
double GetHighestHigh(int count)
{
   double highBuffer[];
   ArraySetAsSeries(highBuffer, true);
   if(CopyHigh(_Symbol, _Period, 2, count, highBuffer) != count) return 0;
   return highBuffer[ArrayMaximum(highBuffer)];
}

double GetLowestLow(int count)
{
   double lowBuffer[];
   ArraySetAsSeries(lowBuffer, true);
   if(CopyLow(_Symbol, _Period, 1, count, lowBuffer) != count) return 0;
   return lowBuffer[ArrayMinimum(lowBuffer)];
}

//+------------------------------------------------------------------+
//| Block 2: The Shield - Lot Sizing                                 |
//+------------------------------------------------------------------+
double CalculateLotSize(double riskPct, double slDistance)
{
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double riskMoney = equity * (riskPct / 100.0);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   
   if(slDistance <= 0) return 0;
   double lots = riskMoney / (slDistance / tickSize * tickValue);
   
   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   lots = MathFloor(lots / step) * step;
   lots = MathMax(SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN), MathMin(SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX), lots));
   
   return lots;
}

//+------------------------------------------------------------------+
//| Block 3: The Glasses - Bar Timing                                |
//+------------------------------------------------------------------+
bool isNewBar()
{
   datetime currentBar = iTime(_Symbol, _Period, 0);
   if(currentBar != g_lastBar)
   {
      g_lastBar = currentBar;
      return true;
   }
   return false;
}

//+------------------------------------------------------------------+
//| Block 4: The Hands - Management Logic                            |
//+------------------------------------------------------------------+
void ApplyBreakEven()
{
   for(int i=PositionsTotal()-1; i>=0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(PositionSelectByTicket(ticket))
      {
         if(PositionGetInteger(POSITION_MAGIC) == InpMagic && PositionGetString(POSITION_SYMBOL) == _Symbol)
         {
            double entry = PositionGetDouble(POSITION_PRICE_OPEN);
            double sl = PositionGetDouble(POSITION_SL);
            double curPrice = PositionGetDouble(POSITION_PRICE_CURRENT);
            double initialRisk = MathAbs(entry - sl);
            
            // Move to BE + 2 pips (20 points) if profit >= 1.0R
            if(curPrice >= entry + initialRisk && sl < entry)
            {
               MqlTradeRequest request={};
               MqlTradeResult  result={};
               request.action = TRADE_ACTION_SLTP;
               request.position = ticket;
               request.sl = entry + (20 * _Point); // Corrected pip-to-point math
               request.tp = PositionGetDouble(POSITION_TP);
               
               if(!OrderSend(request, result))
                  Print("BreakEven failed with error: ", GetLastError());
            }
         }
      }
   }
}

// Helper to check for existing trade
bool PositionSelectByMagic(long magic)
{
   for(int i=PositionsTotal()-1; i>=0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(PositionSelectByTicket(ticket) && PositionGetInteger(POSITION_MAGIC) == magic)
         return true;
   }
   return false;
}
\`\`\`

---

## 🏆 The Milestone: You Didn't Just Watch Lessons, You Built Something!

Pause for a second and appreciate this moment.

When you first entered Preschool (Level 1), the idea of building an automated trading robot probably felt intimidating, complicated, and reserved only for computer science PhDs.

Look at where you are right now:
* You translated a discretionary trading idea into strict, mathematical **Machine Facts**.
* You engineered a **5-Ingredient Master Prompt** that instructed an AI model with institutional precision.
* You audited the code using the **"Explain It To Me" Safety Protocol** before touching a live terminal.
* You compiled the source code inside MetaTrader 5 MetaEditor with **0 Errors and 0 Warnings**.
* You loaded the \`.ex5\` robot into the **MT5 Strategy Tester** and verified real trade execution on a historical price feed.

> 🌟 **The Architect's Milestone**:  
> **"You didn't just watch lessons, you built something."**  
> You have graduated from being a passive consumer of trading theories into an active **Strategy Architect** capable of creating automated trading tools.

### 🚀 What Lies Ahead: Levels 4 Through 8
You have now completed the entire **Free Tier** of the School of AI Trading Architecture!

In the upcoming Paid Masterclass levels, you will unlock the institutional playbook:
* **Level 4 (Middle School)**: Advanced Prompt Engineering formulas, the "Do Not Do This" Shield, Numbered Rule Checklists, and Surgical Bug Fixing without restarting.
* **Level 5 (High School)**: Prop Firm Safety Shields, Daily Drawdown Circuit Breakers, Floating Equity Trailing Shields, and News Filter integrations.
* **Level 6 (Undergraduate)**: Custom On-Screen HUD Dashboards, Multi-Day ADR Volatility Gauges, and TradingView Pine Script v6 automation.
* **Level 7 (Senior Year)**: Advanced Code Audits, Hallucination Hunting, and 2-Stage Out-of-Sample Curve-Fitting Defense.
* **Level 8 (Graduation Capstone)**: 4 Production Capstones (Volatility Exhaustion Bot, Automated Trade Manager, Prop Firm Challenge EA, and Multi-Bot Control Dashboard) plus official graduation certification.

Take your momentum, celebrate this build, and when you're ready, let's take your architecture skills to the institutional level!
`
  }
];
