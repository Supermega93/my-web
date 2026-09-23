import { Lesson } from '../../types.ts';

export const LEVEL1_LESSONS: Lesson[] = [
  {
    id: 'lesson-1-0',
    course_id: '00000000-0000-0000-0000-000000000001',
    order_index: 1,
    level_name: 'Level 1: Preschool — Strategy Architect Mindset',
    lesson_number: 1,
    title: 'Orientation: Welcome to the School of AI Trading Architecture!',
    summary: 'Welcome aboard, future Strategy Architect! Learn what trading automation really is and why your superpower in the AI era is knowing what to ask for and how to verify it.',
    duration_minutes: 10,
    is_free: true,
    video_url: 'https://www.youtube.com/watch?v=POVEstXyCkg',
    video_id: 'POVEstXyCkg',
    video_title: 'Level 1 Masterclass: Strategy Architect Mindset & Foundations',
    video_subtitle: 'Watch the orientation masterclass before working through the foundational lesson and quiz below.',
    video_badge: 'Level 1 Video Masterclass',
    content: `
# Welcome to the School of Strategy Architect!

Welcome aboard, future Strategy Architect! You are taking the very first step toward transforming from a frustrated, emotional discretionary trader into a systematic, disciplined quantitative algorithmic operator.

Before we write a single prompt or inspect a single algorithmic trading rule, let's establish the foundational ground rule of this university:

> **You do NOT need a degree in Computer Science, and you do NOT need to memorize thousands of lines of C++ code to build world-class automated trading robots.**

In the modern era of Artificial Intelligence, the bottleneck of trading automation is no longer typing syntax. The true superpower is knowing **what to build, how to specify it without ambiguity, and how to verify that the generated code respects mathematical risk controls.**

---

## 🏛️ What Trading Automation Actually Is (And What It Isn't)

Most retail traders have a completely backwards mental model of trading bots:

* ❌ **The Fantasy**: You click a button, download a magical black-box robot from Telegram, go to sleep on a beach in Bali, and wake up a millionaire.
* ✅ **The Institutional Reality**: A trading robot is simply an **automated decision checklist** executed with millisecond precision and zero human emotion.

When you trade manually, you suffer from:
1. **Dopamine Addiction & Overtrading**: Taking trades out of boredom or revenge after a loss.
2. **Execution Lag & Fear**: Hesitating on valid entries because your hands are shaking.
3. **Inconsistent Risk Management**: Moving your stop loss wider when a trade moves against you because you "hope" it will turn around.

A machine has no fear, no greed, no boredom, and no ego. It will never move a stop loss out of despair. It executes your mathematical rules with robotic, unflinching discipline.

---

## 👨‍🍳 The Master Chef and the Kitchen Assistant Analogy

To become a top-tier Strategy Architect, adopt this mental model:

Imagine a three-star Michelin restaurant kitchen:
* **The Master Chef (YOU)**: Decides the recipe, selects the premium ingredients, sets cooking temperatures, and tastes every dish before it leaves the pass.
* **The Kitchen Assistant (The AI)**: Chops the onions at lightning speed, washes the pans, and follows your exact recipe instructions to the letter.

If the Master Chef tells the assistant: *"Make something tasty,"* the assistant might serve chocolate sauce on top of raw salmon. That isn't the assistant's fault—it's because the recipe was vague!

When you prompt an AI model (ChatGPT, Claude, Gemini, or our Strategy Prompt Architect) with:
> *"Write me a profitable scalping EA for Gold."*

You are telling the assistant to make "something tasty." The AI has to guess: What timeframe? What session? What lot size? What stop loss? What exit condition? When an AI guesses your rules in financial markets, **you lose real money**.

Your job as an Architect is to provide an exact, mathematically defined blueprint.

---

## 🎓 The 8-Tier University Curriculum Overview

Our curriculum is structured like an elite university engineering degree, taking you step-by-step from zero programming knowledge to institutional-grade execution:

1. **Course 1: Preschool — Strategy Architect Mindset (Free Core)**
   Understanding the literal machine, translating human eyeball rules into machine facts, and the safety testing protocol.
2. **Course 2: Elementary — Indicator Math & Signal Logic (Free Core)**
   Moving average mathematics, Hull Moving Average, dynamic ATR volatility bands, and multi-indicator confluence architecture.
3. **Course 3: Middle School — Risk Management & Capital Preservation (Free Core)**
   Fixed fractional lot sizing, structural invalidation stops, daily loss circuit breakers, and automated kill-switches.
4. **Course 4: High School — Institutional Liquidity & Smart Money Logic (Masterclass Pro)**
   Liquidity sweeps, Fair Value Gaps (FVG), order blocks, and multi-timeframe Optimal Trade Entry (OTE).
5. **Course 5: Undergraduate — MetaTrader 5 & MQL5 System Architecture (Masterclass Pro)**
   OnInit, OnTick, CTrade execution routing, slippage control, and Object-Oriented state machines.
6. **Course 6: Graduate — Walk-Forward Backtesting & Monte Carlo Validation (Masterclass Pro)**
   99.9% real-tick data, preventing curve fitting, and 10,000-run Monte Carlo ruin simulations.
7. **Course 7: Doctorate — Low-Latency Execution & VPS Infrastructure (Masterclass Pro)**
   Equinix LD4/NY4 fiber cross-connects, sub-2ms routing, Windows Server kernel tuning, and broker bridges.
8. **Course 8: Fellowship — Prop Firm Risk Engines & Multi-Asset Portfolios (Masterclass Pro)**
   Passing $400K prop firm trailing drawdown rules, multi-asset portfolio balancing, and VPS failover daemons.

---

## 🎯 Key Takeaways

* An AI model is a literal executor, not a mind-reader.
* You are the Architect; the AI is your junior developer.
* A profitable robot is the direct reflection of clear, unambiguous rules and mathematical risk controls.

Complete the Orientation Quick Quiz below to lock in your understanding and unlock Lesson 1.1!
`
  },
  {
    id: 'lesson-1-1',
    course_id: '00000000-0000-0000-0000-000000000001',
    order_index: 2,
    level_name: 'Level 1: Preschool — Strategy Architect Mindset',
    lesson_number: 2,
    title: 'The AI Is a Literal Machine: Why Vague Prompts Equal Lost Money',
    summary: 'Discover why AI coding models do not think or use common sense, why vague prompts produce catastrophic trading code, and how to write prompt specifications that eliminate guesswork.',
    duration_minutes: 12,
    is_free: true,
    video_url: 'https://www.youtube.com/watch?v=POVEstXyCkg',
    video_id: 'POVEstXyCkg',
    video_title: 'Level 1 Masterclass: Strategy Architect Mindset & Foundations',
    video_subtitle: 'Watch the orientation masterclass before working through the foundational lesson and quiz below.',
    video_badge: 'Level 1 Video Masterclass',
    content: `
# Lesson 1.1: The AI Is a Literal Machine

Why do 95% of traders who attempt to use AI to generate trading robots end up with buggy, non-compiling, or account-blowing code?

The answer is simple: **They treat the AI like a seasoned Wall Street quant trader, when in reality, the AI is a literal text-prediction engine.**

---

## 🤖 The Nature of Large Language Models

An AI language model (such as GPT-4, Claude 3.5 Sonnet, or Gemini 1.5 Pro) does not have feelings, market intuition, or financial fear. It does not know that losing $5,000 on EURUSD hurts your real-world bank account.

When you ask an AI:
> *"Create an EA that buys when the trend is strong and cuts losses quickly."*

Here is what happens inside the AI's neural network:
1. It looks up what words statistically follow "trend is strong." It might pick a 14-period RSI, or an EMA cross, or Bollinger Bands.
2. It looks up "cuts losses quickly." It might pick a random 10-pip stop loss, or it might forget the stop loss entirely and assume you will close manually!
3. It outputs code that *looks* syntactically plausible, but has zero coherent trading logic.

The AI will **NEVER** reply:
> *"Excuse me trader, what indicator do you use to define 'strong trend'? What timeframe? What is your maximum risk percentage per trade? What broker spread tolerance do you accept?"*

Instead of asking clarifying questions, the AI will simply **guess the answers for you.** In financial markets, whenever a machine guesses, your trading account pays the bill.

---

## 🔬 Anatomy of a Disaster: The Vague Prompt vs. The Architect Prompt

Let's contrast what an amateur trader writes versus what a trained Strategy Architect writes:

### ❌ The Amateur Vague Prompt
\`\`\`text
"Write an MQL5 bot for EURUSD that buys when price breaks resistance and sells when it breaks support. Make sure it has good risk management."
\`\`\`

**Why this prompt guarantees financial ruin:**
* What constitutes "resistance"? A swing high of 5 candles? 50 candles? A horizontal trendline? A daily pivot?
* When does the buy happen? When price pierces resistance by 0.1 pip? Or when a 15-minute candle closes completely above it?
* What is "good risk management"? Fixed 0.1 lots? 1% of equity? 5% of balance? What about maximum daily loss?

---

### ✅ The Architect Blueprint Prompt
\`\`\`text
"Develop an MQL5 Expert Advisor for EURUSD on the 15-Minute (M15) timeframe.

ENTRY RULES:
1. Define Resistance as the highest High of the previous 20 completed M15 candles (ignoring the currently forming candle).
2. Enter BUY STOP at Resistance Price + 2 Points spread buffer.
3. Condition: Entry is only valid if the 200-period Exponential Moving Average (EMA) on the M15 chart is sloping upward (EMA[1] > EMA[2]) AND the 14-period ATR is above 0.0008 (8 pips).

RISK MANAGEMENT:
1. Account Risk: Exactly 1.0% of current Account Equity per trade.
2. Stop Loss: Set exactly 1.5 × ATR(14) below the Resistance entry level.
3. Calculate dynamic lot size based on Stop Loss distance and tick value using CTrade.
4. Take Profit: 2.0 × Stop Loss distance (1:2 Risk-to-Reward).
5. Daily Kill Switch: If total daily realized loss reaches 3.0% of starting equity, halt all trading until the next server day."
\`\`\`

Notice the radical difference:
* Zero ambiguity.
* Every variable is tied to a mathematical definition.
* No room for the AI to guess or hallucinate.

---

## 💡 The "No-Guessing Rule"

As a Strategy Architect, commit this law to memory:

> **The Golden Law of AI Automation:**
> If you have not defined the parameter in your prompt, you have given the AI permission to guess it. Never let the machine guess your money.

---

## 🎯 Key Takeaways

1. AI models are literal pattern completers; they do not possess trading common sense.
2. Vague words like "support," "trend," and "good risk" lead directly to catastrophic code.
3. Every rule must specify: **Trigger, Timeframe, Exact Condition, and Mathematical Exit.**
`
  },
  {
    id: 'lesson-1-2',
    course_id: '00000000-0000-0000-0000-000000000001',
    order_index: 3,
    level_name: 'Level 1: Preschool — Strategy Architect Mindset',
    lesson_number: 3,
    title: 'Human Words vs. Machine Facts: Translating Discretionary Ideas to Code',
    summary: 'Learn the exact step-by-step translation framework to convert discretionary "gut feeling" trader language into precise, testable algorithmic machine facts.',
    duration_minutes: 14,
    is_free: true,
    content: `
# Lesson 1.2: Human Words vs. Machine Facts

Every successful discretionary trader uses mental shortcuts when looking at charts. You might glance at a EURUSD chart and say:
* *"The market looks tired."*
* *"Gold is consolidating tightly before the New York open."*
* *"Bitcoin just bounced off support."*

These eyeball statements work for human intuition, but a computer chip cannot execute "tired" or "bounced." A computer chip understands only boolean facts: **TRUE or FALSE, numbers greater than or less than other numbers.**

To be a Strategy Architect, you must master the **Translation Dictionary**: converting human descriptive words into machine-readable facts.

---

## 📖 The Architect's Translation Dictionary

| Human Word | Why It Confuses the AI | Machine Fact Translation |
| :--- | :--- | :--- |
| **"Market is trending up"** | How fast? Over what window? | \`Close[1] > EMA(50, 1) AND EMA(50, 1) > EMA(200, 1)\` |
| **"Bounced off support"** | Did it wick through? Did it touch? | \`Low[1] <= SupportLevel AND Close[1] > SupportLevel + (0.5 * ATR(14))\` |
| **"Consolidating / Squeezing"** | What does tight mean? | \`BollingerBandsWidth(20, 2) < (0.75 * AverageBBWidth(50))\` |
| **"Strong breakout candle"** | How big is strong? | \`Abs(Close[1] - Open[1]) >= (1.8 * ATR(14)) AND Close[1] > High[2]\` |
| **"Cut loss quickly"** | What is quick? Seconds? Pips? | \`StopLoss = Ask - (1.2 * ATR(14))\` |
| **"Overbought"** | Is 70 RSI overbought? 80? | \`RSI(14, PRICE_CLOSE)[1] >= 75.0\` |

---

## 🧱 The 3 Components of Every Machine Fact

Whenever you formulate an entry or exit condition for an AI bot, ensure it contains these three specific pillars:

### 1. The Metric (What are we measuring?)
Never say "price." Specify:
* Is it the \`Close\` price of candle 1?
* The \`Bid\` price?
* The \`Ask\` price?
* An indicator buffer value (e.g. \`EMA[1]\`)?

### 2. The Operator (What is the mathematical comparison?)
* Greater than (\`>\`)
* Less than (\`<\`)
* Greater than or equal to (\`>=\`)
* Crosses above (\`Close[2] <= EMA[2] AND Close[1] > EMA[1]\`)

### 3. The Threshold (What is the exact target?)
* A fixed constant (e.g. \`50.0\`)
* A dynamic volatility multiple (e.g. \`2.0 * ATR(14)\`)
* A previous structural pivot (e.g. \`HighestHigh(20)\`)

---

## 🛠️ Practical Exercise: Discretionary to Machine Fact

Let's take a common retail strategy:
> *"I buy when RSI is oversold, the moving average is pointing up, and a green candle appears."*

### Translating to Architect Blueprint:
1. **Condition 1 (Oversold)**: \`RSI(14, Close)[1] < 30.0\`
2. **Condition 2 (Trend)**: \`EMA(200, Close)[1] > EMA(200, Close)[5]\` (verifying upward trajectory over the last 5 bars).
3. **Condition 3 (Green Trigger Candle)**: \`Close[1] > Open[1]\` AND \`Close[1] > High[2]\` (confirming an engulfing bullish close).

When you feed this translated blueprint to an AI coding tool, you receive bug-free, deterministic code on the first attempt!

---

## 🎯 Key Takeaways

1. Discretionary terms like "bounced" or "trending" must be converted into numerical conditions.
2. Every machine fact requires a Metric, an Operator, and a Threshold.
3. If an eyeball rule cannot be stated as an equation, it cannot be reliably automated.
`
  },
  {
    id: 'lesson-1-3',
    course_id: '00000000-0000-0000-0000-000000000001',
    order_index: 4,
    level_name: 'Level 1: Preschool — Strategy Architect Mindset',
    lesson_number: 4,
    title: 'The Safety Testing Protocol: How to Catch Hallucinations Before They Cost You Money',
    summary: 'Master the 4-step verification audit to catch AI code hallucinations, unhandled slippage bugs, and infinite order loops before attaching any bot to a live account.',
    duration_minutes: 15,
    is_free: true,
    content: `
# Lesson 1.3: The Safety Testing Protocol

Congratulations on reaching the final lesson of Level 1: Preschool! 

By now, you understand that the AI is a literal machine and you know how to write prompts using machine facts. But what happens **after** the AI generates 500 lines of MQL5 or Python code?

> ⚠️ **The Fatal Mistake:** Never copy code from an AI directly into a live trading terminal and hit "AutoTrading" without executing the **4-Step Safety Testing Protocol**.

AI models can "hallucinate"—they might invent an MQL5 function that doesn't exist, calculate lot sizes using account balance instead of equity, or forget to update ticket numbers, causing the bot to open 100 orders in 3 seconds!

Here is your institutional shield against hallucinations.

---

## 🛡️ Step 1: The "Explain It To Me" Prompt Audit

Before you even open MetaEditor or compile the code, paste the generated code back into the AI in a fresh chat session with this exact prompt:

\`\`\`text
"Analyze this MQL5 code as a Senior Quantitative Auditor. 
Do NOT edit the code yet. Answer these 5 questions in plain English:
1. Under what exact mathematical conditions does this EA open a BUY order?
2. Under what exact conditions does it open a SELL order?
3. How is the Lot Size calculated? Does it verify broker minimum/maximum lot limits and lot step size?
4. What happens if the broker returns an error (such as TRADE_RETCODE_REQUOTE or INVALID_STOPS)?
5. Does this code contain any loops that could trigger multiple orders on the same candle?"
\`\`\`

If the AI's explanation does not match what you asked for in your original blueprint, you have caught a hallucination before it reached your chart!

---

## 🛡️ Step 2: Zero-Warning MetaEditor Compilation

Open MetaEditor 5 (press \`F4\` in MetaTrader 5), create a new Expert Advisor, paste the code, and press \`F7\` (Compile).

* **Errors (Red)**: The code cannot execute. The AI used incorrect syntax or outdated functions.
* **Warnings (Yellow)**: The code compiles, but has potential memory leaks, typecasting issues (e.g. converting float to int), or uninitialized variables.
* ✅ **Architect Standard**: **Zero Errors, Zero Warnings.** If warnings appear, prompt the AI:
  \`"Fix these compilation warnings so the code compiles with 0 errors and 0 warnings: [paste warnings]"\`

---

## 🛡️ Step 3: Visual Mode Strategy Tester on Demo Data

Press \`Ctrl + R\` in MetaTrader 5 to open the Strategy Tester:
1. Select your EA.
2. Choose your symbol and timeframe (e.g., EURUSD, M15).
3. Set the date range to the last 30 days.
4. Check **"Visual mode with display of charts, indicators and trade"**.
5. Click **Start**.

Watch the bot execute trades on the simulated chart:
* Does the stop loss appear immediately upon order fill?
* Does it trade only once per signal candle?
* Are the entry indicators drawn correctly on the visual chart?

---

## 🛡️ Step 4: The 2-Week Forward Demo Incubation

Even if a backtest looks phenomenal, live market microstructure (variable spreads, slippage, rollover fees, news liquidity blackouts) behaves differently.

Run the compiled robot on a **free demo account on a VPS** for a minimum of 10 business days (covering at least two London and New York overlaps, and at least one high-impact economic release like CPI or NFP).

Verify that:
* Slippage logs are acceptable.
* No reconnect errors occur in the MetaTrader Journal tab.
* The Daily Max Loss kill switch engages if triggered.

---

## 🎓 Level 1 Graduation Certificate Checklist

To complete Level 1: Preschool and earn your Strategy Architect Foundation badge:
- [x] Understand that AI is a literal assistant requiring explicit recipes.
- [x] Translate subjective human terms into machine facts (Metric, Operator, Threshold).
- [x] Execute the 4-Step Safety Testing Protocol on every generated script.

Complete the Level 1 final quiz below to unlock Level 2: Elementary!
`
  }
];
