import { Lesson } from '../../types.ts';

export const LEVEL7_LESSONS: Lesson[] = [
  {
    id: 'lesson-7-1',
    course_id: '00000000-0000-0000-0000-000000000007',
    order_index: 26,
    level_name: 'Level 7: Senior Year — Debugging & Code Audits Without Reading Code',
    lesson_number: 1,
    title: 'Lesson 7.1: The "Explain It To Me" Pre-Flight Audit ✈️',
    summary: 'The pre-flight audit protocol: forcing the AI to explain entry and risk logic in plain English before copying into MetaEditor to catch hidden bugs instantly.',
    duration_minutes: 20,
    is_free: false,
    content: `
# Lesson 7.1: The "Explain It To Me" Pre-Flight Audit ✈️

Welcome to Level 7: Senior Year! 🔍

In Level 6, you built **The Vision System** with custom indicators, visual dashboards, and mobile alerts. Now, you face the ultimate test of a true Strategy Architect: **Debugging and auditing AI-generated code without reading MQL5 syntax!**

Many beginner traders assume that if code compiles cleanly in MetaEditor with 0 errors, 0 warnings, it is 100% safe to trade. That is a dangerous myth!

AI models can write code that compiles without a single error message, yet contains hidden logic bugs that trade at the wrong time or calculate lot sizes incorrectly. In Level 7, you will learn how to spot these silent traps, diagnose compiler errors, and run out-of-sample backtests like a professional software auditor!

---

## ✈️ The Pre-Flight Audit Protocol

Before an airline pilot takes off, they perform a mandatory pre-flight checklist. They don't just jump in the cockpit and push the throttle!

As a Strategy Architect, your pre-flight audit is the **"Explain It To Me" Safety Check**. You never copy and paste code into MetaTrader until the AI explains its exact decision-making logic to you in plain English!

\`\`\`text
┌────────────────────────────────────────────────────────────────────────┐
│                     THE PRE-FLIGHT AUDIT PROTOCOL                      │
├────────────────────────────────────────────────────────────────────────┤
│  1. AI Generates Code      ➔ STOP! Do NOT copy to MetaTrader yet.     │
│  2. Run Safety Prompt      ➔ Force 3 plain-English summary points.      │
│  3. Audit Trade Decision   ➔ Does entry logic match your blueprint?   │
│  4. Audit Risk Rules       ➔ Are lot sizing & SL distance correct?    │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 💬 The Pre-Flight Safety Audit Prompt

Whenever an AI model generates a complete block of code, reply immediately with this safety check before opening MetaEditor:

> 💬 **Prompt**:
> *"Before I paste this code into MetaEditor, perform a pre-flight audit for me in plain English:
> 1. Explain in 2 bullet points exactly what mathematical conditions MUST be true for a Buy or Sell trade to open.
> 2. Explain how the Stop Loss and Take Profit are calculated.
> 3. Confirm whether dynamic lot sizing or fixed lot sizing is active.
> Do not use technical coding jargon; explain it like I am a beginner trader."*

---

## 💡 Why This Exposes Hidden Bugs Instantly

If the AI made a mistake—such as reversing a Buy condition into a Sell condition, or hardcoding a static 0.10 lot size—its plain-English explanation will expose the flaw immediately!

You can catch and fix the error right in the chat box before touching MetaTrader!

`
  },
  {
    id: 'lesson-7-2',
    course_id: '00000000-0000-0000-0000-000000000007',
    order_index: 27,
    level_name: 'Level 7: Senior Year — Debugging & Code Audits Without Reading Code',
    lesson_number: 2,
    title: 'Lesson 7.2: Compiler Errors vs. Logic Errors 🚦',
    summary: 'Distinguishing syntax typos and missing semicolons from silent logic errors, and resolving them using the Expected vs Actual surgical prompt formula.',
    duration_minutes: 22,
    is_free: false,
    content: `
# Lesson 7.2: Compiler Errors vs. Logic Errors 🚦

When testing software, bugs fall into two completely different categories: **Compiler Errors** and **Logic Errors**. Knowing the difference tells you exactly how to respond!

\`\`\`text
┌────────────────────────────────────────┐   ┌────────────────────────────────────────┐
│         1. COMPILER ERRORS 🔴          │   │           2. LOGIC ERRORS 🟡           │
│  (Spelling Typos & Missing Semis)      │   │     (Silent Flaws & Wrong Math)        │
├────────────────────────────────────────┤   ├────────────────────────────────────────┤
│ • MetaEditor throws RED warning text. │   │ • Code compiles with 0 errors!         │
│ • Program refuses to run.              │   │ • Program runs, but does WRONG thing!  │
│ • EASY FIX: Copy error log to AI.      │   │ • HARD FIX: Requires Expected vs Actual│
└────────────────────────────────────────┘   └────────────────────────────────────────┘
\`\`\`

---

## 🔴 1. Compiler Errors (Syntax Typos)

Think of a compiler error like a spelling mistake on a GPS. If you type "Ney York" instead of "New York", the GPS says "Address Not Found" and refuses to start driving.
* **What Happens**: You press F7 in MetaEditor, and bright red error messages pop up in the Toolbox panel (e.g., \`';' - semicolon expected\` or \`undeclared identifier\`).
* **The Fix**: Extremely simple! You don't need to fix the typo yourself. Copy the red error message, paste it back to the AI, and say: *"Fix this compiler error on Line 42."*

---

## 🟡 2. Logic Errors (The Silent Killers)

A logic error is like giving your GPS the correct spelling for the WRONG city! You wanted to go to Portland, Maine, but the GPS happily drives you to Portland, Oregon.
* **What Happens**: The code compiles with 0 errors, 0 warnings. MetaTrader runs the bot, but during backtesting, the bot buys when it should sell, or risks $500 instead of $100!
* **The Fix**: This requires a Surgical Fix Prompt using the Expected vs. Actual formula from Level 4:
  > 💬 *"EXPECTED: The bot should risk 1.0% per trade ($100). ACTUAL: The bot opened a 5.0 lot trade risking $500. Locate the math error in CalculateLotSize() and fix it."*

`
  },
  {
    id: 'lesson-7-3',
    course_id: '00000000-0000-0000-0000-000000000007',
    order_index: 28,
    level_name: 'Level 7: Senior Year — Debugging & Code Audits Without Reading Code',
    lesson_number: 3,
    title: 'Lesson 7.3: The AI Mistake-Pattern Audit 🕵️‍♂️',
    summary: 'Auditing the 4 recurring AI hallucination patterns: OnTick() setup bloat, hardcoded pip multipliers, missing Magic Numbers, and infinite loop freezing.',
    duration_minutes: 24,
    is_free: false,
    content: `
# Lesson 7.3: The AI Mistake-Pattern Audit 🕵️‍♂️

Over thousands of generated scripts, AI language models repeat specific hallucination patterns. Knowing these 4 common AI mistake patterns allows you to audit your code like a senior software engineer!

\`\`\`text
┌────────────────────────────────────────────────────────────────────────┐
│                    THE 4 AI MISTAKE-PATTERN AUDIT                      │
├────────────────────────────────────────────────────────────────────────┤
│  🐛 Pattern 1: Setup Code Placed Inside OnTick() Instead of OnInit()    │
│  🐛 Pattern 2: Hardcoded Pip Values Breaking JPY & Gold Pairs          │
│  🐛 Pattern 3: Missing MagicNumber Checks (Closing Manual Trades)     │
│  🐛 Pattern 4: Infinite Loops That Freeze MetaTrader Terminal           │
│  🐛 Pattern 5: Missing MagicNumber Verification                        │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 🐛 Pattern #1: Setup Code Placed Inside OnTick()
* **The Flaw**: AI places one-time indicator handle initialization inside \`OnTick()\`.
* **The Impact**: Every time a new price tick arrives (multiple times per second), the EA re-initializes memory, causing platform lag and execution delays.
* **Audit Directive**: *"Ensure all indicator handle setups happen ONCE inside OnInit()."*

---

## 🐛 Pattern #2: Hardcoded Pip Values (0.0001)
* **The Flaw**: AI hardcodes point multipliers assuming 4-digit EURUSD pricing (0.0001).
* **The Impact**: When attached to USDJPY (2-decimal pricing) or Gold (XAUUSD), a 20-pip stop loss becomes 2,000 pips, risking your entire account!
* **Audit Directive**: *"Never hardcode point values like 0.0001. Use _Point and _Digits dynamically."*

---

## 🐛 Pattern #3: Missing MagicNumber Verification
* **The Flaw**: The AI writes a \`CloseAllTrades()\` function that scans positions without checking \`PositionGetInteger(POSITION_MAGIC)\`.
* **The Impact**: The bot closes your personal manual trades alongside its own automated trades!
* **Audit Directive**: *"Verify that ALL order selection and management functions check POSITION_MAGIC == MagicNumber."*

---

## 🐛 Pattern #4: Infinite Loop Freezing
* **The Flaw**: Inside a \`while\` or \`for\` loop scanning order history, the AI forgets to increment the counter index (\`i++\`).
* **The Impact**: MetaTrader 5 completely freezes up and stops responding.
* **Audit Directive**: *"Check all loops to ensure loop counters increment correctly and have safety exit bounds."*

`
  },
  {
    id: 'lesson-7-4',
    course_id: '00000000-0000-0000-0000-000000000007',
    order_index: 29,
    level_name: 'Level 7: Senior Year — Debugging & Code Audits Without Reading Code',
    lesson_number: 4,
    title: 'Lesson 7.4: Out-of-Sample Backtesting & Curve-Fitting Verification 📈',
    summary: 'The 2-stage backtest acid test: In-sample historical parameter optimization vs quarantined out-of-sample forward verification to destroy curve-fitted strategies.',
    duration_minutes: 25,
    is_free: false,
    content: `
# Lesson 7.4: Out-of-Sample Backtesting & Curve-Fitting Verification 📈

Imagine a student who gets access to the exact questions and answers for a math exam two weeks in advance. They memorize every answer and score 100%!

Does that mean they are a math genius? No! It just means they memorized the past test. If you give them a new pop quiz with different numbers, they will fail completely!

In algorithmic trading, this trap is called **Curve-Fitting (Over-Optimization)**.

\`\`\`text
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
\`\`\`

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

## 🏆 Level 7 Master Recap

You are now a certified software auditor!
* ✈️ **Pre-Flight Audit**: Forcing the AI to explain trade and risk logic in plain English before opening MetaEditor.
* 🚦 **Compiler vs. Logic Errors**: Fixing syntax typos via error logs vs. diagnosing silent math bugs using Expected vs. Actual directives.
* 🕵️‍♂️ **4 AI Mistake Patterns**: Auditing for OnTick() setup bloat, hardcoded point values (0.0001), missing MagicNumbers, and infinite loops.
* 📈 **Out-of-Sample Testing**: Reserving unseen historical data to destroy curve-fitted strategies before risking capital.

💡 Ready for the ultimate final level: **Level 8: Graduation Capstone (4 Real-World Projects)**? Continue below!
`
  }
];
