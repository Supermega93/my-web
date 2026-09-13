import { Lesson } from '../../types.ts';

export const LEVEL5_LESSONS: Lesson[] = [
  {
    id: 'lesson-5-1',
    course_id: '00000000-0000-0000-0000-000000000005',
    order_index: 18,
    level_name: 'Level 5: High School — The Safety Shield & Risk Architecture',
    lesson_number: 1,
    title: 'Lesson 5.1: Automatic Lot Sizing & Lot Clamping 🧮',
    summary: 'Dynamic position sizing based on 1.0% account risk and Stop Loss distance, plus broker lot clamping using VOLUME_MIN, VOLUME_MAX, and VOLUME_STEP.',
    duration_minutes: 15,
    is_free: false,
    content: `
# 🎓 Level 5: High School — The Safety Shield & Risk Architecture

Welcome to Level 5: High School! 🛡️

You’ve mastered prompt engineering formulas and surgical bug fixing. Now it's time to build **The Safety Shield**—the automated risk management engine that protects your account capital, keeps prop-firm accounts safe, and prevents catastrophic trading losses!

In manual trading, risk management is where most human traders fail due to fear, greed, or revenge trading. In AI trading architecture, we automate risk management completely so that no trade can ever place your account at risk without your permission.

Let's build your financial armor!

---

# Lesson 5.1: Automatic Lot Sizing & Lot Clamping 🧮

When manual traders start automating, their first mistake is hardcoding a static lot size like 0.10 or 1.00.

Trading a fixed 1.00 lot on a $10,000 account is wildly different from trading 1.00 lot on a $100,000 account. Furthermore, a 30-pip stop loss on EURUSD does not equal a 30-pip stop loss on Gold (XAUUSD) or Bitcoin!

As a Strategy Architect, you must order your AI to use **Dynamic Risk Sizing**.

\`\`\`text
     ┌────────────────────────────────────────────────────────────────────────┐
     │                  THE DYNAMIC LOT SIZING PIPELINE                       │
     ├────────────────────────────────────────────────────────────────────────┤
     │  1. Check Account Equity       ➔ e.g., $10,000                         │
     │  2. Calculate Max $ Risk (1%)  ➔ $10,000 × 1% = $100                   │
     │  3. Check Stop Loss Distance   ➔ e.g., 20 Pips ($10 per pip)           │
     │  4. Calculate Dynamic Lot      ➔ $100 / ($10 × 20) = 0.50 Lots         │
     │  5. Run Lot Clamping Guard    ➔ Round to Broker Step (0.01)            │
     └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 🧮 How Dynamic Lot Sizing Works

Instead of guessing a lot size, the EA auto-calculates the exact lot size for every single trade using three pieces of data:
1. Account Equity (e.g., $10,000)
2. Risk Percentage (e.g., 1.0% = $100 maximum risk)
3. Stop Loss Distance (e.g., 20 pips)

If your Stop Loss is wide (50 pips), the EA automatically shrinks the lot size. If your Stop Loss is tight (10 pips), the EA safely increases the lot size. Either way, you risk exactly $100 (1.0%) on every trade!

---

## 🧱 The "Lot Clamping" Safety Guard

What happens if your math equation calculates a lot size of 0.005 or 125.0 lots?

Your broker will instantly reject the order because every MetaTrader broker has strict volume limits:
* **SYMBOL_VOLUME_MIN**: The smallest order allowed (usually 0.01 lots).
* **SYMBOL_VOLUME_MAX**: The largest single order allowed (e.g., 100.00 lots).
* **SYMBOL_VOLUME_STEP**: The minimum lot increment (usually 0.01).

**Lot Clamping** is a safety function that intercepts the calculated lot size before sending the order to the broker. If the calculated lot is below the broker minimum, it clamps it up to 0.01. If it's above the maximum, it clamps it down to 100.00.

---

## 💬 The Dynamic Lot Sizing Prompt Directive

> 💬 **Strategy Architect Directive**:  
> *"Create a function named CalculateLotSize(). Calculate position size dynamically based on 1.0% account risk and the Stop Loss distance in points. Always apply Lot Clamping using SYMBOL_VOLUME_MIN, SYMBOL_VOLUME_MAX, and SYMBOL_VOLUME_STEP so orders match broker volume rules."*

`
  },
  {
    id: 'lesson-5-2',
    course_id: '00000000-0000-0000-0000-000000000005',
    order_index: 19,
    level_name: 'Level 5: High School — The Safety Shield & Risk Architecture',
    lesson_number: 2,
    title: 'Lesson 5.2: Prop Firm Safety Nets & Daily Loss Limits 🛡️',
    summary: 'The midnight equity snapshot, real-time daily drawdown tracking, and automated 4.0% loss circuit-breaker shutdown for funded accounts.',
    duration_minutes: 18,
    is_free: false,
    content: `
# Lesson 5.2: Prop Firm Safety Nets & Daily Loss Limits 🛡️

The #1 reason traders fail funded account challenges is hitting the prop firm's Maximum Daily Loss Limit (typically 5.0%).

During periods of rapid market volatility or high-impact news, an EA without a daily safety net can take multiple consecutive losses in a matter of minutes, breaching your account rules before you even have time to log in!

As a Strategy Architect, you solve this by building an **Automated Daily Equity Shield**.

\`\`\`text
                           ┌─────────────────────────────┐
                           │   New Trading Day Begins!   │
                           │ (Store Starting Equity: $10k)│
                           └──────────────┬──────────────┘
                                          │
                                          ▼
                           ┌─────────────────────────────┐
                           │   Has Daily Loss Hit 4%?    │
                           │  (Equity Dropped to $9,600) │
                           └──────────────┬──────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
                     [ YES ]                            [ NO ]
                         │                                 │
                         ▼                                 ▼
           ┌───────────────────────────┐       ┌──────────────────────┐
           │ 1. Close All Positions    │       │ Continue Trading     │
           │ 2. Cancel Pending Orders  │       │ Normal Operations    │
           │ 3. LOCK EA Until Midnight │       └──────────────────────┘
           └───────────────────────────┘
\`\`\`

---

## 🛡️ How the Daily Equity Shield Works

* **Midnight Snapshot**: At the start of every new trading day (00:00 server time), the EA stores your starting account equity in memory (e.g., $10,000).
* **Real-Time Drawdown Tracking**: On every single price tick, the EA calculates your current floating equity against the starting equity.
* **The Circuit Breaker**: You set a personal daily loss limit of 4.0% (building a 1.0% safety buffer before the prop firm's 5.0% limit).
* **Automated Shutdown**: If your daily loss hits 4.0% ($9,600 equity), the EA instantly:
  1. Closes all open market positions.
  2. Deletes all pending orders.
  3. Flips a boolean switch (\`IsDailyLocked = true\`) to prevent any new trades until midnight!

---

## 💬 The Daily Loss Shield Prompt Directive

> 💬 **Strategy Architect Directive**:  
> *"Include an automated Daily Loss Shield. Record starting equity at 00:00 server time. If daily equity drops by 4.0%, immediately close all open trades, delete pending orders, and lock the EA from opening new positions until the next trading day."*

`
  },
  {
    id: 'lesson-5-3',
    course_id: '00000000-0000-0000-0000-000000000005',
    order_index: 20,
    level_name: 'Level 5: High School — The Safety Shield & Risk Architecture',
    lesson_number: 3,
    title: 'Lesson 5.3: The Filter Stack (Execution Guards) 👓',
    summary: 'The 3-layer filter stack: Max Spread Guard, Trading Session Windows (London/NY), and the isNewBar single-execution guard.',
    duration_minutes: 15,
    is_free: false,
    content: `
# Lesson 5.3: The Filter Stack (Execution Guards) 👓

Even the best entry logic will lose money if executed during unfavorable market conditions.

Taking trades when spreads blow out during market rollover, or entering during non-liquid hours, destroys your edge. Block 3 (The Glasses) acts as your execution guard, scanning market conditions before allowing a trade to pass.

\`\`\`text
     ┌────────────────────────────────────────────────────────────────────────┐
     │                      THE 3-LAYER FILTER STACK                          │
     ├────────────────────────────────────────────────────────────────────────┤
     │  👓 Layer 1: Max Spread Guard   ➔ Block if Spread > 20 Points          │
     │  👓 Layer 2: Session Window Box ➔ Block if Time Outside 08:00 - 17:00 │
     │  👓 Layer 3: New Candle Guard   ➔ Evaluate ONLY on New Bar Open        │
     └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 👓 The 3 Essential Execution Guards

### 1. The Max Spread Guard
During market open, market close, or major news events, brokers widen spreads significantly. If your strategy expects a 10-pip profit but the spread jumps to 8 pips, your trade is handicapped from the start!
* **How It Works**: The EA checks \`SymbolInfoInteger(_Symbol, SYMBOL_SPREAD)\`. If spread > 20 points, the entry is blocked.

### 2. The Trading Session Box
Volatile market moves occur during major trading sessions (London and New York). Trading during low-volume Asian consolidation often leads to false breakouts.
* **How It Works**: The EA checks server hour and minute. Entries are allowed strictly between specified session hours (e.g., 08:00 to 17:00).

### 3. The New Candle Guard (isNewBar)
By default, \`OnTick()\` executes dozens of times per second. If an indicator crosses back and forth across a boundary on a single volatile candle, an ungoverned EA might open 10 duplicate trades on the same candle!
* **How It Works**: A simple helper function checks if the current candle time is newer than the last recorded candle time. Entry rules are evaluated strictly once per new candle open.

---

## 💬 The Filter Stack Prompt Directive

> 💬 **Strategy Architect Directive**:  
> *"Add a 3-layer filter stack to entry execution:*  
> *1. Max Spread Filter: Block trades if current spread exceeds 20 points.*  
> *2. Session Filter: Allow entries only between 08:00 and 17:00 server time.*  
> *3. New Bar Guard: Ensure strategy logic is evaluated ONCE per candle open."*

`
  },
  {
    id: 'lesson-5-4',
    course_id: '00000000-0000-0000-0000-000000000005',
    order_index: 21,
    level_name: 'Level 5: High School — The Safety Shield & Risk Architecture',
    lesson_number: 4,
    title: 'Lesson 5.4: Active Trade Management (Hands-Free Profit Protection) 🖐️',
    summary: 'Hands-free floating profit protection: Break-Even + Buffer, ATR Trailing Stops, and partial profit taking (scaling out).',
    duration_minutes: 20,
    is_free: false,
    content: `
# Lesson 5.4: Active Trade Management (Hands-Free Profit Protection) 🖐️

Opening a trade is only 20% of the battle. How your robot manages the position after entry determines whether you bank consistent profits!

Block 4 (The Hands) automates trade management while you sleep, using three classic techniques: **Break-Even Triggers**, **Trailing Stops**, and **Partial Closes**.

\`\`\`text
  Price 📈  ───►  Hits +20 Pips Profit  ───►  SL Auto-Moves to Entry + 2 Pips Buffer (Risk Free!)
            ───►  Hits +30 Pips Profit  ───►  Close 50% Position & Trail Remaining Volume!
\`\`\`

---

## 🖐️ 3 Ways to Protect Floating Profits

### 1. Break-Even Trigger + Buffer
Once a trade moves into profit by a specified distance (e.g., +20 pips), the EA automatically moves the Stop Loss to Entry Price + 2 Pips.
* **Why the Buffer?** Placing the Stop Loss exactly on the entry price often gets hit by broker spread during minor pullbacks. Adding a 2-pip buffer covers your commission and turns the trade into a 100% risk-free position!

### 2. Trailing Stop (Fixed Points or ATR)
As price continues to move in your favor, a Trailing Stop ratchets the Stop Loss upward behind price at a fixed distance (or using a volatility measure like 2x ATR).
* **Benefit**: It locks in accrued profits during strong market trends while giving the trade room to breathe.

### 3. Partial Profit Taking (Scaling Out)
When price hits a 1:1 Risk-to-Reward milestone, the EA can automatically close 50% of the trade volume (0.25 lots out of 0.50 lots).
* **Benefit**: You bank real cash into your balance immediately, while letting the remaining half trail toward your final Take Profit target!

---

## 💬 The Active Trade Management Prompt Directive

> 💬 **Strategy Architect Directive**:  
> *"Include active trade management:*  
> *1. Move Stop Loss to Break-Even + 2 pips buffer once floating profit hits 20 pips.*  
> *2. Trail Stop Loss 25 pips behind price once active.*  
> *3. Close 50% of position volume when price reaches 1:1 Risk-to-Reward."*

---

## 🏆 Level 5 Master Recap

You have just mastered The Safety Shield—the risk and safety architecture of professional trading software!
* 🧮 **Dynamic Lot Sizing & Clamping**: Auto-calculating lot size based on 1% account risk and enforcing broker volume limits (VOLUME_MIN/MAX).
* 🛡️ **Prop Firm Daily Shield**: Capturing starting equity at midnight and auto-locking the EA if daily equity drops by 4.0%.
* 👓 **The 3-Layer Filter Stack**: Protecting execution using Spread Guards, Session Windows, and New Bar Open checks.
* 🖐️ **Active Trade Management**: Hands-free profit protection via Break-Even + Buffer, Trailing Stops, and Partial Closes.
`
  }
];
