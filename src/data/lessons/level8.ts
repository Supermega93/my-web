import { Lesson } from '../../types.ts';

export const LEVEL8_LESSONS: Lesson[] = [
  {
    id: 'lesson-8-1',
    course_id: '00000000-0000-0000-0000-000000000008',
    order_index: 30,
    level_name: 'Level 8: Graduation Capstone — Real-World Practical Projects',
    lesson_number: 1,
    title: 'Lesson 8.1: Project 1 — The Volatility Exhaustion Bot ⛽',
    summary: 'Building a 20-candle breakout bot with a 5-day Average Daily Range (ADR) fuel guard and dynamic 1% account equity risk shield.',
    duration_minutes: 30,
    is_free: false,
    content: `
# Level 8: Graduation Capstone — Real-World Practical Projects

WELCOME TO THE ULTIMATE FINAL LEVEL! 🎉

You’ve conquered every foundational step of the School of AI Trading Architecture. You know how to translate eyeball setups into cold machine facts, design modular Lego blocks, execute surgical code fixes without touching working code, build safety shields, and audit AI outputs without getting lost in programming syntax.

In Level 8: Graduation Capstone, you put everything together by building 4 complete, production-grade real-world trading projects drawn directly from real prop desk playbooks and the case studies in *The AI Prompt Engineering Handbook* and *Build Trading Bots with AI & MQL5*.

---

# Lesson 8.1: Project 1 — The Volatility Exhaustion Bot ⛽

## ❌ The Problem It Solves

Chasing late breakouts is where retail traders bleed capital. You see price ripping upward on your 1-Hour chart, green candles stacking up, so you jump in with a Buy order. Almost immediately, the market stalls out and reverses hard into your stop loss!

Why did that happen? You didn't misread the trend—the market simply ran out of gas. Every currency pair and commodity has an **Average Daily Range (ADR)**, which is the typical distance in pips it travels from high to low each day (like the size of a car's fuel tank). If today's price action has already burned through 70% or more of its average daily fuel tank, buying the breakout is financial suicide.

---

## 🧱 The Architecture

This robot pairs an entry trigger from **Block 1 (The Brain)** with a market fuel gauge from **Block 3 (The Glasses)**:
* **Entry Trigger**: Buy when an hourly candle closes above the highest high of the last 20 candles on the 1-Hour chart.
* **Volatility Filter (The Fuel Gauge)**: Calculate the 5-day Average Daily Range (ADR). If today's high-to-low move has already consumed more than 70% of that 5-day ADR, **BLOCK new trade entries**!
* **Risk Shield**: Dynamically calculate your position size so you risk exactly 1% of account equity, setting your Stop Loss at the recent 5-candle low.

\`\`\`text
20-Candle Breakout Signal 📈  ───►  Check 5-Day ADR Usage  ───►  [ > 70% Used? BLOCK TRADE 🛑 ]
                                                          ───►  [ < 70% Used? EXECUTE BUY ✅ ]
\`\`\`

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

`
  },
  {
    id: 'lesson-8-2',
    course_id: '00000000-0000-0000-0000-000000000008',
    order_index: 31,
    level_name: 'Level 8: Graduation Capstone — Real-World Practical Projects',
    lesson_number: 2,
    title: 'Lesson 8.2: Project 2 — The Automated Trade Manager 🖐️',
    summary: 'A background trade management EA that monitors manual orders, executing break-even buffers, 50% partial close scaling, and dynamic ATR trailing.',
    duration_minutes: 30,
    is_free: false,
    content: `
# Lesson 8.2: Project 2 — The Automated Trade Manager 🖐️

## ❌ The Problem It Solves

Many traders are great at reading charts and picking high-probability manual entries. Where they struggle is trade management—getting greedy, moving stop losses further away, cutting winning trades too early, or giving back hard-won profits while away from the desk.

---

## 🧱 The Architecture

This tool is a **pure background utility EA with ZERO entry logic**. It sits quietly on your chart, monitors manual orders you place yourself, and manages exits with machine-like discipline:
* **Target Filter**: Scans open positions on the chart and manages trades containing the word "Manual" in their trade comment.
* **Break-Even Trigger**: When open profit reaches 1.5x your initial Stop Loss distance (1.5R), automatically slide your Stop Loss to Entry Price plus a 10-point cushion. From that moment on, you're playing with house money—the trade is mathematically risk-free.
* **Partial Close**: When profit reaches 2.0x your initial Stop Loss distance (2R), automatically close 50% of the trade volume to lock cash into your account while letting the rest run.
* **ATR Trailing Stop**: Average True Range (ATR) measures how wildly candles are fluctuating. The bot trails your Stop Loss 20 pips behind current price once break-even is active, locking in extra gains as the trend runs.

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

`
  },
  {
    id: 'lesson-8-3',
    course_id: '00000000-0000-0000-0000-000000000008',
    order_index: 32,
    level_name: 'Level 8: Graduation Capstone — Real-World Practical Projects',
    lesson_number: 3,
    title: 'Lesson 8.3: Project 3 — The Prop Firm Challenge EA 🛡️',
    summary: 'A complete funded-account challenge EA with a 00:00 midnight starting balance tracker, 4.0% daily loss shield, and 9.0% total drawdown kill-switch.',
    duration_minutes: 32,
    is_free: false,
    content: `
# Lesson 8.3: Project 3 — The Prop Firm Challenge EA 🛡️

## ❌ The Problem It Solves

Prop-firm evaluations demand ironclad risk discipline. The challenge isn't just picking winning trades; it's surviving the firm's strict drawdown rules. A single emotional revenge trade or an unexpected news spike can wipe out a 5% daily limit and fail a $100,000 funded challenge in minutes.

---

## 🧱 The Architecture

This project combines all 9 steps of our development pipeline into a complete, funded-account trading robot:
* **Daily Equity Shield**: Prop firms measure your daily loss starting from your account balance at midnight (00:00 server time). If your daily loss (both closed losses and active floating drawdown) touches 4.0%—giving you a built-in 1.0% safety cushion before the firm's fatal 5.0% limit—the shield immediately closes all open orders and locks down the robot until the clock resets at midnight.
* **Total Drawdown Shield**: Drawdown is the overall dip from your peak starting balance. If total account loss ever touches 9.0%, the bot pulls the plug permanently so you never breach the firm's 10% hard stop.
* **Dynamic Lot Sizing**: Auto-calculates your exact position size on every trade to risk precisely 1.0% of account equity, using \`OrderCalcProfit\` to verify real broker pip values.

\`\`\`text
00:00 Server Time ➔ Store Day Balance ──► Floating Drawdown Hits 4.0% ──► Close Trades & Lock Until Midnight 🛡️
\`\`\`

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

`
  },
  {
    id: 'lesson-8-4',
    course_id: '00000000-0000-0000-0000-000000000008',
    order_index: 33,
    level_name: 'Level 8: Graduation Capstone — Real-World Practical Projects',
    lesson_number: 4,
    title: 'Lesson 8.4: Project 4 — The Multi-Bot Control Dashboard 🖥️',
    summary: 'An on-screen HUD table tracking multiple Magic Numbers simultaneously, displaying position counts, P&L, status, and overall account equity change.',
    duration_minutes: 35,
    is_free: false,
    content: `
# Lesson 8.4: Project 4 — The Multi-Bot Control Dashboard 🖥️

## ❌ The Problem It Solves

When running multiple trading robots across different currency pairs, trying to track your live risk in the default MetaTrader trade tab is like reading a phone book in a storm. You have dozens of open tickets, fluctuating numbers, and no easy way to know which strategy is performing.

---

## 🧱 The Architecture

Every automated trading bot uses a unique digital ID number called a **Magic Number** (for example, 10001 for a Scalper, 20002 for a Breakout bot, and 30003 for a Trend follower). 

This project builds an on-screen heads-up display (HUD) table in the top-left corner of your chart:
* **Multi-Magic Tracking**: Reads open positions and history across Magic Numbers 10001 (Scalper), 20002 (Breakout), and 30003 (Trend).
* **Real-Time Data Display**: Displays open position count, today's P&L in dollars, and status (ACTIVE in green, or HALTED in red) for each strategy.
* **Summary Row**: Displays total account daily equity change at the bottom so you know your overall portfolio health at a single glance.

\`\`\`text
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
\`\`\`

---

## 💬 The Master Capstone Prompt 8.4

> 💬 **Prompt**:
> *"ROLE: Act as an MQL5 dashboard developer.
> OBJECTIVE: Write an MQL5 dashboard indicator that displays in the top-left corner of my chart.
> SPECIFICATION: Create a table tracking Magic Numbers 10001, 20002, and 30003. Display: EA Name, Open Position Count, Today's Closed P&L in dollars, and Status (ACTIVE/HALTED). Add a bottom summary row displaying total account daily equity change."*

---

## 🎓 OFFICIAL GRADUATION DIPLOMA

\`\`\`text
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
\`\`\`

---

## 🌟 What Would You Like to Do Next?

Now that you hold your Strategy Architect Diploma, here are three ways we can continue working together:
1. 🧪 **Build Your Custom EA Blueprint**: Share your specific manual trading setup with me, and we'll draft your complete 5-Ingredient Master Prompt step-by-step!
2. 🛠️ **Explore Custom Development**: Have our expert engineering team build, test, and deliver a bug-free MetaTrader 5 EA directly for you.
3. 📈 **Deploy Adaptive Liquidity Pro EA**: Explore our flagship, ready-to-run automated trading robot equipped with institutional liquidity tracking and built-in prop-firm safety shields.

Congratulations once again, Professor! What is our next move?
`
  },
  {
    id: 'lesson-8-bonus',
    course_id: '00000000-0000-0000-0000-000000000008',
    order_index: 34,
    level_name: 'Level 8: Graduation Capstone — Real-World Practical Projects',
    lesson_number: 5,
    title: "Bonus Chapter Master Class: Creator's Workshop — Applied AI Prompt Engineering & Institutional Architecture Blueprint",
    summary: 'Move beyond theory into applied masterclass prompt directives: institutional core engines, adaptive ADR volatility routing, custom chart HUDs, and dedicated prop firm safety shields.',
    duration_minutes: 40,
    is_free: false,
    content: `
# 🚀 Bonus Chapter Master Class: Creator's Workshop — Applied AI Prompt Engineering & Institutional Architecture Blueprint

Welcome to the Creator's Workshop. We’re stepping out of the classroom and onto the trading desk. 

The goal of this bonus chapter is to show you how to command AI tools like ChatGPT, Claude, and Gemini to write battle-tested, production-grade MetaTrader 5 code—without the AI hallucinating imaginary functions or butchering your trading rules.

By using the **5-Ingredient Master Prompt Recipe** (Role, Context, Objective, Constraints, and Format), you can instruct an AI to construct each modular piece of an institutional trading engine: trap detectors, volatility filters that adapt to market conditions, live chart dashboards, and bulletproof safety shields built specifically for prop firm challenges.

---

## 🧠 Section 1: The AI Prompting Framework (Commanding the Code Engine)

If you walk onto a trading desk and tell a junior trader, *"buy me some Gold,"* they'll immediately stop you and ask: *How much? At what price? Where is the stop loss? What timeframe are we looking at?*

An AI model won't ask those clarifying questions. When you give it a vague prompt like *"write me a Gold bot,"* it silently fills in the blanks by guessing—and in trading, guessing blows up accounts. It might invent imaginary technical indicators, forget to attach a hard Stop Loss, or calculate pip values completely wrong.

To keep the AI laser-focused and error-free, every prompt directive in this workshop uses five foundational elements:

1. **Role**: Tell the AI exactly who it is (a veteran institutional MQL5 software architect).
2. **Context & Symbol**: Give it the exact market arena (MetaTrader 5, 1-Hour chart, EURUSD or Gold).
3. **Mathematical Logic**: Feed it clear, rulebook trading logic—not vague feelings like "buy strong momentum."
4. **Negative Constraints**: Give it strict "do-not-touch" rules (e.g., evaluate rules only on a new candle open so it doesn't spasm on every tick).
5. **Output Format**: Demand clean, modular functions that plug directly into your EA without breaking your existing code blocks.

---

## 📐 Section 2: Institutional Core Trading Engine Prompts

### Module 1: Two-Tier Moving Average Alignment & Structural Flip

* **The Problem**: Buying breakouts against the major macro trend is a rookie mistake with a terrible win rate. But waiting for standard moving average crossovers (like the 50 crossing the 200) is way too slow—by the time they cross, the best part of the move is already in the rearview mirror.
* **The Logic**: 
  * **Exponential Moving Averages (EMAs)** smooth out price noise to show the true trend direction, giving extra weight to recent price action. We use two: the 50 EMA for medium-term trend rhythm and the 200 EMA for the big-picture macro trend.
  * **Engine A (Trend Rider)**: Only allows breakout buys when price is riding comfortably above both the 50 EMA and the 200 EMA on the 1-Hour chart.
  * **Engine B (The Counter-Punch)**: When buyers push up to the previous week's high, get rejected twice, and an hourly candle rolls back below the 50 EMA, that confirms big institutional buyers have abandoned the push. That's our cue to stop buying breakouts and short the reversal.

\`\`\`text
ROLE: Act as a senior MT5 MQL5 developer.

OBJECTIVE: Build a two-tier Moving Average execution guard for an EA trading EURUSD or Gold.

SPECIFICATION:
1. Create handles for a 50-period EMA and a 200-period EMA on the H1 chart inside OnInit().
2. Macro Filter: Allow Engine A Breakout Buys ONLY when Close[1] > 50 EMA AND 50 EMA > 200 EMA.
3. Trap Flip Guard: Trigger an Engine B Mean-Reversion Sell order when price touches the Previous Week High, fails 2 times, and the current H1 candle body closes below the 50 EMA (Close[1] < 50 EMA).

CONSTRAINTS: Evaluate these EMA checks strictly on new candle opens (isNewBar) to avoid intra-candle tick chatter.
\`\`\`

---

### Module 2: Fake Breakout & Weekly Squeeze Trap Engine

* **The Problem**: Every Monday and Tuesday, retail breakout traders cluster around the previous week's high and low. When price nudges above last week's high, retail traders eagerly pile into breakout buys. Institutional desks know this—they push price just high enough to trigger those orders, grab the liquidity, and violently slam the market back down, trapping breakout buyers.
* **The Logic**: 
  * We track the **Previous Week High** (the highest price reached during the prior week, where retail stop losses congregate).
  * If price pushes up, pokes through that level, and closes back below it twice (\`Weekly_Squeeze_Max_Losses = 2\`), while the **Relative Strength Index (RSI)**—a 0 to 100 momentum gauge—is sitting above 70 in overbought territory, we declare an Institutional Trap.
  * The bot immediately locks out all breakout buys and fires a sell trade the second an hourly candle closes below the 50 EMA.

\`\`\`text
ROLE: Act as an expert MQL5 developer.

OBJECTIVE: Build a Weekly Squeeze Reversal Trap Engine for MT5.

LOGIC:
1. Store the Previous Week High: iHigh(_Symbol, PERIOD_W1, 1).
2. Track rejections: Increment a counter RejectionCount whenever H1 price touches the Weekly High but closes below it.
3. Trap Condition: IF RejectionCount >= 2 AND RSI(14) > 70 (Overbought), set IsInstitutionalTrap = true.
4. Execution: When IsInstitutionalTrap == true, block all Breakout Buys. Trigger an Engine B Sell order the moment an H1 candle closes below the 50 EMA.
\`\`\`

---

### Module 3: RSI Exhaustion & Daily Structural Rollover Override

* **The Problem ("The RSI Lockout Bug")**: Traditional trading books tell you: *"RSI over 70 means overbought—never buy!"* But every experienced trader knows that during a roaring bull trend, RSI can stay pinned above 70 for days while price rips higher by hundreds of pips. If your bot rigidly blocks buys whenever RSI is above 70, you sit on your hands and miss the most profitable runners of the year.
* **The Logic**: 
  * We respect RSI overbought (>70) and oversold (<30) during calm, ranging markets.
  * But the moment a daily candle body structurally breaks and closes above yesterday's high (\`iClose(D1, 1) > iHigh(D1, 2)\`), real market structure trumps the indicator. Price action is king.
  * The bot overrides and cancels the RSI block immediately, allowing you to ride the powerful breakout.

\`\`\`text
ROLE: Act as an MQL5 developer.

OBJECTIVE: Build an RSI Overbought/Oversold filter with a Daily Structural Rollover Override.

LOGIC:
1. Calculate 14-period RSI on H1. Block Buy orders if RSI > 70 (Overbought).
2. STRUCTURAL ROLLOVER OVERRIDE: Check if current Daily Candle Body closed above Yesterday's High:
   iClose(_Symbol, PERIOD_D1, 1) > iHigh(_Symbol, PERIOD_D1, 2).
3. If the structural daily break is TRUE, override and cancel the RSI block immediately, allowing breakout trades to execute.
\`\`\`

---

### Module 4: Profit Recycling & Stacking Distance Delay

* **The Problem ("The Whipsaw Paradox")**: When a trade is winning, traders love to "pyramid" or stack additional orders to maximize gains. But if you open a new position the moment your first trade is slightly in profit, you usually buy right at the peak of a temporary impulse move—just before a normal pullback hits your stop loss.
* **The Logic**: 
  * We risk 1.0% on our initial Master trade.
  * When open profit reaches **+1.5R** (1.5 times whatever dollar amount you originally risked), the bot moves the Stop Loss to **Break-Even** (entry price plus 2 pips) so the trade is completely risk-free.
  * Next comes the stacking delay: instead of buying immediately, the bot requires price to travel an extra **+0.5R** past that break-even mark (\`StackingDelay_R_Multiple = 0.5\`) before opening a Follower trade.
  * You only add to winners with proven, explosive momentum, and total account risk never exceeds your initial 1.0%.

\`\`\`text
ROLE: Act as a senior MQL5 developer.

OBJECTIVE: Build a Profit Recycling Engine with Stacking Distance Delay.

LOGIC:
1. Master Trade: Open initial trade risking 1.0% of account equity (RiskPercent = 1.0).
2. Break-Even: When floating profit hits 1.5R (Ratio_BreakEven_SL = 1.5), move Master Trade Stop Loss to Entry + 2 pips.
3. Stacking Delay: Monitor price distance. Open a 'Follower Trade' ONLY when price travels an additional +0.5R past the Break-Even trigger line (StackingDelay_R_Multiple = 0.5).
4. Ensure total account risk never exceeds the initial 1.0% at any point in the cycle.
\`\`\`

---

## ⛽ Section 3: Adaptive ADR Risk Management Filter

### Detailed System Architecture

A fixed 30-pip stop loss makes sense on a quiet Tuesday morning, but it gets shredded when economic news drops and the daily candle range doubles from 80 pips to 250 pips. Unanchored fixed stops fail when market volatility explodes.

Adaptive ADR solves this by calculating the **4-Day Average Daily Range (ADR)**—the market's recent breathing room—on every single tick. As the market's daily range expands or contracts, your order buffers and stop loss distances automatically adjust with active market conditions:

* **Dynamic Entry Buffer**: Places pending orders slightly past the day's high/low (e.g., 7% of 4-Day ADR) to filter out fakeouts and random wick sweeps.
* **Dynamic SL & Geometric R:R Multiplier**: Sizes your Stop Loss to the active daily volatility, then derives your Take Profit target by multiplying the stop distance by your fixed Risk/Reward ratio (e.g., 1:6 R:R). If volatility widens your stop from 20 to 30 pips, your target automatically widens from 120 to 180 pips, keeping your payout math rock-solid in all market conditions.

\`\`\`text
ROLE: Act as an expert MQL5 developer.

OBJECTIVE: Implement an Adaptive ADR Risk Management Filter using 4-Day ADR volatility routing.

LOGIC:
1. Calculate 4-Day ADR: Sum the daily high-to-low ranges of the last 4 completed daily candles and divide by 4.
2. Dynamic Entry Buffer: Set pending order entry buffers to a user-defined percentage (e.g., 7% of 4-Day ADR) past the daily high/low.
3. Dynamic Volatility SL/TP: Dynamically adjust Stop Loss distance based on active ADR volatility. Derive Take Profit distance by multiplying the dynamic SL distance by the Ratio_RiskReward parameter (e.g. 1:6 R:R).
4. Recalculate entry offsets, SL, and TP values automatically on every tick as ADR expands or contracts.
\`\`\`

---

## 📊 Section 4: Chart Indicators & Visual Utility Prompts

### High/Low of Previous Day Dotted Line Indicator

Yesterday's high and low are key liquidity zones where market opens react. This indicator plots clean blue dotted lines extending from yesterday's boundaries into today's session, giving you instant visual context on your 5-minute and 15-minute charts.

\`\`\`text
ROLE: Act as a senior MQL5 indicator developer.

OBJECTIVE: Create a custom MQL5 chart indicator that draws Previous Day High and Previous Day Low lines on MT5.

SPECIFICATION:
1. Inputs: InpLookbackDays (number of historical days to draw, default = 5), InpLineColor (default = clrDodgerBlue), InpLineStyle (default = STYLE_DOT).
2. Logic: For each day in the lookback range, retrieve Previous Day High (iHigh(_Symbol, PERIOD_D1, i)) and Previous Day Low (iLow(_Symbol, PERIOD_D1, i)).
3. Drawing: Create horizontal trendlines or ray lines extending from the start of the current day to the end of the session marking the Previous Day High and Low levels.
4. Clean Up: Properly delete and redraw line objects on chart initialization and timeframe changes to avoid object clutter.
\`\`\`

### Multi-Day ADR Volatility Indicator

This indicator acts as a live fuel gauge on your chart. It calculates today's price range against the 5-day average and flashes a clear warning if 75% or more of the daily fuel tank has already been consumed, protecting you from chasing exhausted moves.

\`\`\`text
ROLE: Act as an MQL5 indicator specialist.

OBJECTIVE: Build a Multi-Day ADR Volatility Indicator for MT5.

SPECIFICATION:
1. Calculate 4-Day ADR and 5-Day ADR using daily bar ranges: (High - Low).
2. Calculate Current Day Range: (iHigh(_Symbol, PERIOD_D1, 0) - iLow(_Symbol, PERIOD_D1, 0)).
3. Calculate Range Consumption Percentage: (Current Day Range / 5-Day ADR) * 100.
4. Visual Output: Display an on-screen visual gauge or comment block showing:
   - Active 4-Day ADR (in pips/points)
   - Current Day Range (in pips/points)
   - Consumption Percentage (%)
   - If Range Consumption >= 75%, display a prominent visual alert: 'VOLATILITY EXHAUSTION WARNING'.
\`\`\`

---

## 💻 Section 5: Dual-Panel Dashboard Prompts (Static & Non-Static)

### Static Diagnostic Dashboard Prompt (Right-Side Data Feed)

A clean heads-up display (HUD) on the top-right corner of your chart showing your market vitals at a glance—current ADR, spread in points, active engine status, and calculated stop/target distances—without bogging down your chart or terminal with heavy interactive buttons.

\`\`\`text
ROLE: Act as an MQL5 GUI developer.

OBJECTIVE: Create a Static Diagnostic Dashboard overlay on the top-right corner of the MT5 chart.

SPECIFICATION:
1. Create a transparent or dark panel background using CCanvas or chart label objects.
2. Display real-time data feeds updated on every tick:
   - 4-Day ADR and ATR Values
   - Active Engine Status (Engine A: Active / Engine B: Trap Declared)
   - Current Spread (in points) vs Max Spread Limit
   - Calculated Dynamic Entry Buffer, SL, and TP distances
   - Active Exhaustion Block Status (NORMAL / EXHAUSTED)
3. Ensure objects update smoothly without causing chart flickering.
\`\`\`

### Interactive Non-Static Control Panel Prompt (Left-Side Interactive GUI)

A cockpit control panel on the top-left corner of your chart with clickable buttons. You can dial your Risk % up or down, toggle Engine A (Breakouts) and Engine B (Trap Reversals) on or off, or hit an emergency **[CLOSE ALL POSITIONS]** / **[MASTER KILL SWITCH]** to instantly flatten all trades if unexpected news hits the wires.

\`\`\`text
ROLE: Act as an expert MQL5 GUI developer.

OBJECTIVE: Build an Interactive On-Chart Control Panel on the top-left corner of the MT5 terminal.

SPECIFICATION:
1. Create a dark-themed UI container with interactive button objects using OnChartEvent().
2. Interactive Controls:
   - [+] and [-] buttons to dynamically increase or decrease Risk% (e.g. 1.0%, 2.0%, 3.0%).
   - Toggle buttons to switch Engine A (Breakout) and Engine B (Trap Reversal) ON or OFF.
   - [CLOSE ALL POSITIONS] button: Instantly closes all open positions associated with the EA's Magic Number.
   - [MASTER KILL SWITCH]: Pauses all new order entries and cancels pending orders.
3. Event Handler: Process CHARTEVENT_OBJECT_CLICK events securely to update EA parameters in real time.
\`\`\`

---

## 🛡️ Section 6: Dedicated Prop Firm Protection Suite

Proprietary trading firms don't make their money when traders pass challenges; they profit from reset fees when traders break rules. Their three biggest traps are daily drawdown limits, trailing equity caps, and profit consistency rules. Here's how our safety suite protects your funded account:

\`\`\`text
┌────────────────────────────────────────────────────────┐
│            DEDICATED PROP FIRM PROTECTION SUITE        │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ CONSISTENCY  │    │ DAILY EQUITY │    │ SAFE POSITION│
│ PROTECTOR    │    │ SHIELD (4.0%)│    │ SIZING & LOT │
│ (30% Cap)    │    │ (Midnight)   │    │ CLAMPING     │
└──────────────┘    └──────────────┘    └──────────────┘
\`\`\`

### 1. Prop Firm Consistency Protector
Many prop firms will fail your challenge if a single massive day accounts for more than ~30% of your total profit target. This module monitors your daily profit, trims your Take Profit lines as you approach the cap, and locks in gains before you breach the rule.

\`\`\`text
ROLE: Act as a senior MQL5 developer specializing in prop-firm systems.

OBJECTIVE: Build a Prop Firm Consistency Protector module.

LOGIC:
1. Input: ConsistencyMaxDayPercent (e.g. 30% of total challenge target), Consistency_BufferAmount (dollar safety margin).
2. Track accumulated daily closed profit plus floating equity gain starting at server time 00:00.
3. If single-day profit reaches the ConsistencyMaxDayPercent threshold minus Consistency_BufferAmount:
   - Dynamically scale down Take Profit lines (Consistency_ScaleTP) on active positions to prevent over-shooting the limit.
   - Halt all new order entries for the remainder of the trading day.
\`\`\`

### 2. Automated Daily Equity Shield
Prop firm servers track your daily loss starting from your balance at midnight (00:00 server time). If your daily loss (both closed losses and active floating drawdown) touches 4.0%—giving you a built-in 1.0% safety cushion before the firm's fatal 5.0% limit—the shield immediately closes all open orders and locks down the robot until the clock resets at midnight.

\`\`\`text
ROLE: Act as an expert MQL5 risk engineering developer.

OBJECTIVE: Build an Automated Daily Equity Shield for prop-firm challenges.

LOGIC:
1. At server time 00:00 (new daily bar open), record the active Account Equity as MidnightEquity.
2. On every tick, calculate current Daily Equity Drawdown:
   DailyDrawdownPercent = ((MidnightEquity - CurrentEquity) / MidnightEquity) * 100.
3. Circuit Breaker: IF DailyDrawdownPercent >= 4.0%:
   - Immediately close all open positions.
   - Cancel all pending orders.
   - Block all new trade execution until the next 00:00 server time reset.
\`\`\`

### 3. Maximum Drawdown Cap Guard
Monitors total account drawdown relative to your initial starting balance. If total equity loss ever approaches the prop firm's hard cap (like 8.0% or 10.0%), it permanently shuts down trading to save the account from disqualification.

\`\`\`text
ROLE: Act as an MQL5 safety systems developer.

OBJECTIVE: Implement a Maximum Drawdown Cap Guard.

LOGIC:
1. Record InitialAccountBalance on EA initialization or first deployment.
2. Track total account drawdown: TotalDrawdownPercent = ((InitialAccountBalance - CurrentEquity) / InitialAccountBalance) * 100.
3. Hard Stop: If TotalDrawdownPercent reaches MaxAllowedTotalDrawdown (e.g. 8.0%), close all trades, delete all pending orders, and trigger a permanent execution lockout requiring manual reset.
\`\`\`

### 4. Prop-Firm Safe Position Sizing & Lot Clamping
Auto-calculates your exact position size on every trade to risk precisely 1.0% of account equity, then checks and clamps the volume against broker rules (\`VOLUME_MIN\`, \`VOLUME_MAX\`, \`VOLUME_STEP\`) so your orders never fail with an "invalid volume" error.

\`\`\`text
ROLE: Act as an MQL5 developer.

OBJECTIVE: Build a Prop-Firm Safe Position Sizing & Lot Clamping function.

LOGIC:
1. Input: RiskPercent (default = 1.0%), StopLossPips.
2. Sizing Formula: Calculate monetary risk amount = AccountEquity * (RiskPercent / 100.0). Derive raw lot size using symbol tick value and StopLossPips.
3. Lot Clamping:
   - Normalize lot size to SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP).
   - Clamp lot size so it is never less than SYMBOL_VOLUME_MIN.
   - Clamp lot size so it never exceeds SYMBOL_VOLUME_MAX or user MaxLotCap.
4. Return verified, clamped lot size for order execution.
\`\`\`

---

## 🚀 Section 7: Implementation Pathways

Now that you hold the prompt engineering blueprints behind these institutional modules, you have three clear pathways to move forward:

* 📂 **Path A (Source Code Inspection - .mq5)**: Inspect the full, unencrypted source code to study how these prompt directives translate into compiled MQL5 arrays, event handlers, and 3D chart HUDs.
* ⚙️ **Path B (Plug-and-Play Executable - .ex5)**: Deploy a ready-to-use executable pre-configured with Profit Recycling, Dynamic Volatility Routing, and Prop Firm Safe Mode directly onto your MetaTrader 5 terminal.
* 🤝 **Path C (1-on-1 Architecture Session)**: Book a direct strategy session to audit your manual rules, map out custom bot logic, or review AI prompt engineering structures with our team.
`
  }
];
