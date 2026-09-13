import { Lesson } from '../../types.ts';

export const LEVEL4_LESSONS: Lesson[] = [
  {
    id: 'lesson-4-1',
    course_id: '00000000-0000-0000-0000-000000000004',
    order_index: 14,
    level_name: 'Level 4: Middle School — Mastering AI Prompt Engineering',
    lesson_number: 1,
    title: 'Lesson 4.1: The 5-Ingredient Master Prompt Recipe 🍳',
    summary: 'The 5 mandatory ingredients of a bulletproof prompt: Role, Context, Objective, Constraints, and Format, plus the Master Fill-in-the-Blank Template.',
    duration_minutes: 15,
    is_free: false,
    content: `
# 🎓 Level 4: Middle School — Mastering AI Prompt Engineering

Welcome to Level 4: Middle School! 🚀

You've officially entered the Paid Masterclass tier of the School of AI Trading Architecture!

In Levels 1 through 3, you learned how a strategy architect thinks, how programming concepts work using everyday household analogies, and how an Expert Advisor's lifecycle is structured.

Now, it's time to learn the exact secret formulas used by professional prompt engineers. In Level 4, you will master the 5-Ingredient Master Prompt Recipe, the "Do Not Do This" Shield, Numbered Rule Checklists, and Surgical Code Fixes!

---

# Lesson 4.1: The 5-Ingredient Master Prompt Recipe 🍳

Have you ever tried baking a cake and accidentally forgot the flour or the baking powder? The result is an inedible, soggy mess!

The exact same thing happens when prompting an AI model. If you leave out key instructions, the AI will silently fill in the blanks with generic guesses—and as we know, guesses lose money.

Every bulletproof prompt used by professional strategy architects relies on 5 mandatory ingredients:

\`\`\`text
   ┌────────────────────────────────────────────────────────────────────────┐
   │                   THE 5-INGREDIENT MASTER PROMPT RECIPE               │
   ├────────────────────────────────────────────────────────────────────────┤
   │  1. 👤 ROLE         ➔ Who is the AI? (Senior MT5 Developer)            │
   │  2. 🎬 CONTEXT      ➔ What are we building & why? (Prop Firm EA)       │
   │  3. 🎯 OBJECTIVE    ➔ What exact feature do you want right now?        │
   │  4. 🚧 CONSTRAINTS ➔ What boundaries MUST the AI respect?              │
   │  5. 📄 FORMAT      ➔ How should the AI deliver the answer?             │
   └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 🧪 Breaking Down the 5 Ingredients

### 1. 👤 Role (Who is the AI?)
Tell the AI exactly what persona to adopt. Setting a professional role forces the AI to draw from institutional trading desk standards rather than messy internet forum snippets.
* **Example**: *"Act as a professional MT5 developer who specializes in safe, institutional trading bots."*

### 2. 🎬 Context (Setting the Scene)
Give the AI the background environment so it understands your trading goals.
* **Example**: *"I am building an EA for a prop-firm account where I cannot lose more than 5% in a single day."*

### 3. 🎯 Objective (The Specific Job)
State the exact task or feature you need created right now. Keep it focused on one specific job!
* **Example**: *"I need a risk management function that calculates lot size automatically based on my Stop Loss distance."*

### 4. 🚧 Constraints (The Guardrails)
Define strict boundaries and rules the AI must never break.
* **Example**: *"Never allow the bot to risk more than 1% of the account balance per trade, and never hardcode fixed lot sizes."*

### 5. 📄 Format (The Output Style)
Specify exactly how you want the response delivered.
* **Example**: *"Provide the complete MQL5 code block for this feature with plain-English comments next to every line."*

---

## 📝 The Master Fill-in-the-Blank Template

Whenever you open ChatGPT, Claude, or Gemini, copy and paste this fill-in-the-blank recipe:

> 💬 **Prompt**:
> *"ROLE: Act as a professional MT5 developer specializing in safe trading software.*  
> *CONTEXT: I am building an EA for INSERT PAIR & ACCOUNT TYPE, e.g., EURUSD H1 Prop Account.*  
> *OBJECTIVE: Write code to INSERT FEATURE, e.g., Auto-calculate lot size based on 1% risk.*  
> *CONSTRAINTS: INSERT BOUNDARIES, e.g., Do not use fixed lots, do not leave Stop Loss at 0.*  
> *FORMAT: Provide the complete MQL5 code with plain-English comments."*

`
  },
  {
    id: 'lesson-4-2',
    course_id: '00000000-0000-0000-0000-000000000004',
    order_index: 15,
    level_name: 'Level 4: Middle School — Mastering AI Prompt Engineering',
    lesson_number: 2,
    title: 'Lesson 4.2: The "Do Not Do This" Rule (Negative Constraints) 🛡️',
    summary: 'Using negative constraints as your shield to block 4 common AI habits: hardcoded pip values, missing Stop Losses, touching manual trades, and outdated MT4 syntax.',
    duration_minutes: 15,
    is_free: false,
    content: `
# Lesson 4.2: The "Do Not Do This" Rule (Negative Constraints) 🛡️

When training a puppy, telling it "Good boy!" when it sits is great—but telling it "NO!" when it chews on your shoes is what saves your wardrobe!

In AI prompt engineering, Negative Constraints are your shield. Telling the AI what NOT to do is just as crucial as telling it what to do!

\`\`\`text
                    ┌──────────────────────────────────────────────┐
                    │          THE NEGATIVE CONSTRAINT SHIELD      │
                    ├──────────────────────────────────────────────┤
                    │  🚫 Do NOT use fixed lot sizes!              │
                    │  🚫 Do NOT leave Stop Loss at 0!             │
                    │  🚫 Do NOT touch manual trades!              │
                    │  🚫 Do NOT use outdated MT4 functions!       │
                    └──────────────────────────────────────────────┘
\`\`\`

---

## 🚨 Common AI Habits You Must Block

AI models have several default habits that can create silent disasters in live trading accounts. Here are four negative constraints you should always include in your prompt shield:

1. 🚫 **"Do NOT hardcode fixed lot sizes or pip values!"**  
   *Why*: The AI often defaults to hardcoded pip values (like 0.0001). That works for EURUSD, but on JPY pairs 1 pip is 0.01, and on Gold (XAUUSD) it's 0.10. Hardcoding 0.0001 will completely distort your stop loss distances and position sizing on metals and Yen pairs. Always force the AI to use dynamic broker tick math.

2. 🚫 **"Do NOT leave Stop Loss at 0!"**  
   *Why*: If you don't explicitly demand a stop loss, the AI will often generate order execution code with Stop Loss set to 0. Entering the market naked with no safety net is the fastest way to get wiped out on a sudden news spike.

3. 🚫 **"Do NOT close or modify trades opened manually!"**  
   *Why*: Always mandate that the robot checks its unique **Magic Number** (the bot's digital fingerprint). Without this check, your bot will blindly modify or close trades you placed manually from your phone or trades managed by other robots on the same account.

4. 🚫 **"Do NOT use outdated MT4 syntax!"**  
   *Why*: AI models love mixing old MetaTrader 4 commands (like \`OrdersTotal()\`) with MetaTrader 5 commands (like \`PositionsTotal()\`). In MT5, orders are requests while positions are live open market trades. Mixing them up causes compiler errors.

---

## 💬 The Negative Constraint Guard Prompt

Check out how a Strategy Architect uses negative constraints to protect trade execution:

> 💬 **Prompt**:  
> *"Write a function that closes all trades if daily account drawdown hits 3.0%.*  
> *CONSTRAINTS:*  
> *1. Do NOT close trades opened manually by me (verify the Magic Number matches).*  
> *2. Do NOT reset the daily equity tracker inside this function.*  
> *3. Do NOT use outdated MT4 commands like OrdersTotal(); use MT5 PositionsTotal()."*

`
  },
  {
    id: 'lesson-4-3',
    course_id: '00000000-0000-0000-0000-000000000004',
    order_index: 16,
    level_name: 'Level 4: Middle School — Mastering AI Prompt Engineering',
    lesson_number: 3,
    title: 'Lesson 4.3: Rule Checklists & The Blueprint Agreement 📜',
    summary: 'Formatting requirements with numbered rule checklists to prevent AI skipping, and using the Blueprint Agreement prompt before writing code.',
    duration_minutes: 15,
    is_free: false,
    content: `
# Lesson 4.3: Rule Checklists & The Blueprint Agreement 📜

If you hand someone a giant, messy 3-page wall of text with zero bullet points or paragraphs, their eyes will glaze over and they'll probably miss half the details!

AI models behave the exact same way. Dense blocks of text cause AI models to skip instructions, mix up Stop Loss rules with entry signals, or drop time filters entirely.

To get 100% accuracy, Strategy Architects use two powerful formatting tools: **Numbered Rule Checklists** and **The Blueprint Agreement**.

---

## 1. Numbered Rule Checklists 📋

Instead of writing a long paragraph, break every complex requirement into a clear, numbered list. Numbered lists force the AI to process each rule as an isolated, mandatory step!

\`\`\`text
  ❌ BAD (Wall of Text):
  "I want an EA that buys when EMA crosses and also check if spread is good and don't trade during news 15 mins before or after and only trade London session."


  ✅ GOOD (Numbered Checklist):
  "Add a trade filter stack with these exact numbered rules:
   1. Check if server time is between 08:00 and 16:00 (London Session).
   2. Check if current spread is less than 20 points.
   3. Check if a high-impact news event is within 15 minutes.
   4. Evaluate the 9/21 EMA entry crossover."
\`\`\`

---

## 2. The Blueprint Agreement Prompt 🤝

Never let the AI rush into writing code on step #1! Triggering the One-Shot Trap by asking for an entire multi-indicator bot in one prompt leads to chaotic code.

Instead, use The Blueprint Agreement to force the AI to confirm the development plan with you before writing a single line of code:

> 💬 **Prompt**:  
> *"I want to build a MetaTrader 5 Expert Advisor step-by-step so we avoid mistakes. Here is our development roadmap:*  
> *Step 1: Entry & Exit Signal Logic*  
> *Step 2: Risk Management & Auto Lot Sizing*  
> *Step 3: Spread & Session Filters*  
> *Step 4: Active Trade Management (Trailing Stop)*  
> *Do you understand this plan? If so, reply ONLY with 'Ready, Architect!' and I will give you the rules for Step 1."*

`
  },
  {
    id: 'lesson-4-4',
    course_id: '00000000-0000-0000-0000-000000000004',
    order_index: 17,
    level_name: 'Level 4: Middle School — Mastering AI Prompt Engineering',
    lesson_number: 4,
    title: 'Lesson 4.4: Surgical Code Fixes (Don\'t Hit Reset!) 🔬',
    summary: 'The 80/20 Surgical Fix protocol using Expected vs Actual outcome directives, handling compiler errors, and graduating from Level 4.',
    duration_minutes: 20,
    is_free: false,
    content: `
# Lesson 4.4: Surgical Code Fixes (Don't Hit Reset!) 🔬

Picture this: You’ve been working with an AI assistant to build an Expert Advisor.

The entry rules work great, the lot sizing is spot on, and the risk shield is working perfectly. But when you test the trailing stop, it moves 5 pips too early.

What do most beginners do? They panic, hit reset, copy the entire strategy back into the AI, and say: "Rewrite the whole bot!" 😱

This is a massive mistake! Re-generating the entire file introduces brand-new bugs into code that was already working!

---

## 🔬 The 80/20 Rule: Surgical Revisions

If 80% of your trading bot works, do not touch the 80% that works! Use a Surgical Fix Prompt to target only the 20% that needs adjustment.

\`\`\`text
   ┌────────────────────────────────────────────────────────────────────────┐
   │                    THE SURGICAL FIX PROTOCOL                          │
   ├────────────────────────────────────────────────────────────────────────┤
   │  1. 📌 Isolate the Bug  ➔ Name the exact function that failed.         │
   │  2. 🎯 State Expected   ➔ "Expected: Trailing stop activates at +30."  │
   │  3. 🔍 State Actual     ➔ "Actual: Trailing stop activates at +5."     │
   │  4. 🔒 Lock Other Code  ➔ "Do NOT modify any other lines!"             │
   └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 💬 The Surgical Fix Prompt Template

When fixing a compiler error or a logic flaw, provide the AI with your Expected vs. Actual outcome and lock the rest of the code:

> 💬 **Prompt**:  
> *"In the code you just generated, there is a small flaw in the manageTrailingStop() function.*  
> *EXPECTED: The trailing stop should only activate after floating profit reaches 30 pips.*  
> *ACTUAL: The trailing stop is activating immediately on tick 1.*  
> *DIRECTIVE: Change ONLY the manageTrailingStop() function to fix this timing issue. Keep every other line of code in the EA exactly the same!"*

---

## 🐞 Handling MetaTrader Compiler Errors

If MetaEditor displays a bright red error when you press F7, don't panic! Copy the exact error line and paste it back to the AI using this template:

> 💬 **Prompt**:  
> *"I pasted your code into MetaEditor and received this compiler error on Line 42:*  
> *[PASTE METATRADER ERROR MSG HERE, e.g., ';' - semicolon expected]*  
> *Here is the OnInit() function where the error occurred. Explain what caused the typo in plain English, and provide ONLY the corrected function block."*

---

## 🏆 Level 4 Master Recap

You have just unlocked the exact prompt engineering toolkit used by professional AI software architects!
* 🍳 **The 5-Ingredient Recipe**: Role, Context, Objective, Constraints, and Format remove all AI guesswork.
* 🛡️ **Negative Constraints**: Shielding your code by explicitly telling the AI what NOT to do.
* 📜 **Checklists & Agreements**: Formatting requirements into numbered lists and locking in a step-by-step blueprint first.
* 🔬 **Surgical Code Fixes**: Targeting individual bugged functions using Expected vs. Actual directives without breaking working code.
`
  }
];
