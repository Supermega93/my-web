import { Lesson } from '../../types.ts';

export const LEVEL6_LESSONS: Lesson[] = [
  {
    id: 'lesson-6-1',
    course_id: '00000000-0000-0000-0000-000000000006',
    order_index: 22,
    level_name: 'Level 6: Undergraduate — Visual Tools & On-Screen Dashboards',
    lesson_number: 1,
    title: 'Lesson 6.1: Custom Indicators & Smart Alerts (Chart Glasses & Alarms) 🔔',
    summary: 'The difference between EAs and indicators, indicator buffers as color-coded pushpins, and adding SendNotification() smart mobile push alerts.',
    duration_minutes: 20,
    is_free: false,
    content: `
# Lesson 6.1: Custom Indicators & Smart Alerts (Chart Glasses & Alarms) 🔔

Welcome to Level 6: Undergraduate! 📊

In Level 5, you built The Safety Shield to automate risk management and daily drawdown limits. Now, it's time to build **The Vision System**!

Whether you trade manually or monitor multiple automated bots, you need clear visual feedback directly on your charts. In Level 6, you will learn how to build Custom Indicators, Smart Phone Alerts, Volatility & Session Panels, On-Screen Control Dashboards, and even TradingView Pine Script v6 strategies!

Let's turn your charts into a high-tech flight cockpit!

---

## 👓 The Difference Between EAs and Custom Indicators

Let's review the core distinction from Level 3:
* **Expert Advisors (EAs)**: Self-driving cars that execute trades automatically.
* **Custom Indicators**: High-tech dashboard gauges that analyze data and draw visual signals on your chart.

> ⚠️ **CRUCIAL RULE**: Custom Indicators **NEVER** place trades! They exist purely to give you visual clarity and send instant alerts when market conditions align.

---

## 📌 How Custom Indicators Draw on Your Chart (Buffers = Color-Coded Pushpins)

When an indicator calculates a Moving Average or an RSI value, how does it show up on your screen?

It uses **Indicator Buffers**!

Think of an indicator buffer like a box of color-coded pushpins on a giant corkboard calendar:
* **Buffer #1 (Green Pins)**: Placed at the exact low price of every candle where a Buy signal occurs.
* **Buffer #2 (Red Pins)**: Placed at the exact high price of every candle where a Sell signal occurs.

When you ask an AI to write a custom indicator, it sets up these buffers to draw lines, arrows, or color-coded bands directly over your candles!

---

## 📱 Smart Mobile Push Notifications

You don't want to sit in front of your computer screen 14 hours a day waiting for an indicator crossover.

By adding a single smart alert function—\`SendNotification()\`—your custom indicator will automatically ping your smartphone via the MetaTrader mobile app the exact second a setup occurs!

\`\`\`text
📲 MOBILE ALERT: "EURUSD H1: 9/21 EMA Buy Crossover Detected! Check chart for entry."
\`\`\`

---

## 💬 The Custom Indicator Prompt Directive

> 💬 **Strategy Architect Directive**:
> *"Write an MQL5 Custom Indicator that calculates a 14-period RSI. Draw a green arrow buffer under the candle when RSI crosses above 30, and a red arrow buffer above the candle when RSI crosses below 70. Send a smartphone push notification via SendNotification() on the candle close."*

`
  },
  {
    id: 'lesson-6-2',
    course_id: '00000000-0000-0000-0000-000000000006',
    order_index: 23,
    level_name: 'Level 6: Undergraduate — Visual Tools & On-Screen Dashboards',
    lesson_number: 2,
    title: 'Lesson 6.2: Volatility & Session Boxes (ADR & Market Timers) ⏱️',
    summary: 'Measuring fuel in the tank with Average Daily Range (ADR) panels and visualizing Asian, London, and New York session liquidity boxes.',
    duration_minutes: 22,
    is_free: false,
    content: `
# Lesson 6.2: Volatility & Session Boxes (ADR & Market Timers) ⏱️

Have you ever bought a breakout at the very top of the day, only for price to instantly reverse and hit your stop loss?

That happens because **the market ran out of fuel**!

In Lesson 6.2, we build two visual execution guards: **Average Daily Range (ADR) Panels** and **Session Highlight Boxes**.

---

## ⛽ 1. Average Daily Range (ADR) — Measuring Fuel in the Tank

Every currency pair has an average daily distance it moves from its high to its low over a 5-day period. This is its Average Daily Range (ADR).

Think of ADR like the fuel tank of a car:
* If EURUSD has a 5-day ADR of 100 pips, and today it has already moved 90 pips from the daily low to high, the fuel tank is 90% full!
* Buying a breakout when 90% of the daily fuel is already spent is extremely high risk.

By having your AI build an ADR Panel, your chart will instantly display:

\`\`\`text
┌──────────────────────────────────────────┐
│ ⛽ ADR STATS (EURUSD)                     │
│ 5-Day ADR: 100 Pips                      │
│ Today's Range: 90 Pips (90% Used!)       │
│ STATUS: ⚠️ VOLATILITY EXHAUSTION WARNING │
└──────────────────────────────────────────┘
\`\`\`

---

## 📦 2. Session Highlight Boxes (Asian, London, New York)

Institutional banks move the market during specific time windows.

A Session Box Indicator automatically draws colored background boxes on your chart:
* 🟨 **Asian Session Box (00:00 - 08:00)**: Consolidating range.
* 🟦 **London Session Box (08:00 - 16:00)**: High-volume liquidity expansion.
* 🟩 **New York Session Box (13:00 - 21:00)**: Overlap volatility.

Seeing these session boxes visually helps manual traders spot Asian range liquidity sweeps before the London expansion!

---

## 💬 The ADR & Session Panel Prompt Directive

> 💬 **Strategy Architect Directive**:
> *"Create a Custom Indicator for MT5 that calculates the 5-Day Average Daily Range (ADR). Display an on-screen visual panel showing Today's Range vs 5-Day ADR Percentage. Change panel color to Red if ADR usage exceeds 85%."*

`
  },
  {
    id: 'lesson-6-3',
    course_id: '00000000-0000-0000-0000-000000000006',
    order_index: 24,
    level_name: 'Level 6: Undergraduate — Visual Tools & On-Screen Dashboards',
    lesson_number: 3,
    title: 'Lesson 6.3: Multi-Bot On-Screen Control Dashboards 🖥️',
    summary: 'Building Heads-Up Display (HUD) cockpits with chart objects and interactive mouse-clickable buttons via OnChartEvent().',
    duration_minutes: 24,
    is_free: false,
    content: `
# Lesson 6.3: Multi-Bot On-Screen Control Dashboards 🖥️

If you run three different Expert Advisors across five currency pairs, logging into each chart settings box to check performance is slow and frustrating.

Professional strategy architects order the AI to build an **On-Screen Heads-Up Display (HUD) Control Dashboard**.

---

## 🏎️ The Cockpit Heads-Up Display (HUD)

An on-screen dashboard uses MetaTrader Chart Objects (rectangles, text labels, and color-coded buttons) overlaying your chart canvas.

Here is what a professional EA HUD looks like right on your chart:

\`\`\`text
┌──────────────────────────────────────────────────────────┐
│ 🤖 STRATEGY ARCHITECT CONTROL PANEL                      │
├──────────────────────────────────────────────────────────┤
│  Bot Status:      🟢 ACTIVE (Running)                    │
│  Magic Number:    100201 (EURUSD Trend EA)              │
│  Account Equity:  $10,450.00                              │
│  Floating P&L:    +$120.00 [2 Open Trades]              │
│  Daily Drawdown:  -0.8% / -4.0% (Shield Safe 🛡️)         │
│  Spread Guard:    12 Points (Pass 🟢)                    │
├──────────────────────────────────────────────────────────┤
│  [ CLOSE ALL TRADES ]   [ PAUSE EA ]   [ RESET DAILY ]   │
└──────────────────────────────────────────────────────────┘
\`\`\`

---

## 🔘 Adding Interactive Chart Buttons

Did you know you can tell your AI to build clickable buttons right on your MetaTrader chart?

Using the \`OnChartEvent()\` event handler, the AI can add interactive buttons:
* **[ CLOSE ALL TRADES ] Button**: Click it with your mouse to instantly close all open positions on the chart!
* **[ PAUSE EA ] Button**: Click it to temporarily suspend entry scanning before high-impact news releases without removing the EA from the chart!

---

## 💬 The Control Dashboard Prompt Directive

> 💬 **Strategy Architect Directive**:
> *"Add an on-screen HUD Control Dashboard to the top-left corner of the chart using chart labels. Display: Bot Status, Magic Number, Floating P&L, Daily Drawdown %, and Spread. Include an interactive [CLOSE ALL] button that triggers trade closure when clicked using OnChartEvent()."*

`
  },
  {
    id: 'lesson-6-4',
    course_id: '00000000-0000-0000-0000-000000000006',
    order_index: 25,
    level_name: 'Level 6: Undergraduate — Visual Tools & On-Screen Dashboards',
    lesson_number: 4,
    title: 'Lesson 6.4: Bonus — TradingView Pine Script v6 Automation 🌲',
    summary: 'Universal prompt architecture applied to TradingView Pine Script v6: cloud backtesting, strategy.entry(), and webhook JSON bridges to MetaTrader 5.',
    duration_minutes: 25,
    is_free: false,
    content: `
# Lesson 6.4: Bonus — TradingView Pine Script v6 Automation 🌲

While MetaTrader 5 is the undisputed king of automated order execution, millions of traders love TradingView for its sleek charting, social scripts, and cloud alerts.

As a Strategy Architect, your prompt engineering skills are **100% universal**! You can use the exact same 5-Ingredient Master Prompt recipe to generate TradingView Pine Script v6 code!

---

## 🌲 MQL5 vs. TradingView Pine Script v6

| Feature | MetaTrader 5 (MQL5) 🤖 | TradingView (Pine Script v6) 🌲 |
| :--- | :--- | :--- |
| **Primary Use** | Direct Order Execution & MT5 EAs | Chart Analysis, Cloud Backtesting, & Webhooks |
| **Execution** | Runs on local MT5 terminal / VPS | Runs in TradingView's Cloud |
| **Strategy Logic** | Event-driven (\`OnTick()\`) | Series-based calculation (\`strategy()\`) |
| **Bridging** | Directly manages MT5 broker account | Sends Webhook JSON alerts to MT5 / Prop Firm Bridges |

---

## 🔗 Webhook Automation: The TradingView-to-MT5 Bridge

How do you execute trades on MetaTrader or a Prop Firm using a TradingView Pine Script strategy?

1. **Pine Script Strategy**: Generates a buy signal on TradingView's cloud.
2. **Webhook Alert**: TradingView sends a structured JSON message over the internet to a bridge service (like PineConnector or TraderPost).
3. **MT5 Receiver**: The bridge receiver instantly executes the order on your MetaTrader 5 broker account in less than 100 milliseconds!

\`\`\`text
TradingView Cloud 🌲  ───►  JSON Webhook Alert 📡  ───►  MT5 Broker Account 🤖
\`\`\`

---

## 💬 The Pine Script v6 Prompt Directive

> 💬 **Strategy Architect Directive**:
> *"ROLE: Act as an expert Pine Script v6 developer. OBJECTIVE: Write a complete Pine Script v6 strategy that buys when the 9 EMA crosses above the 21 EMA. CONSTRAINTS: Include strategy.entry() and strategy.exit() with a 1:2 Risk/Reward ratio. Format webhook alert messages in JSON format for automated bridge execution."*

---

## 🏆 Level 6 Master Recap

You've just unlocked **The Vision System**—transforming raw charts into high-tech visual flight cockpits!
* 🔔 **Custom Indicators & Smart Alerts**: Visual pushpin buffers and mobile phone push notifications via \`SendNotification()\`.
* ⏱️ **Volatility & Session Panels**: Measuring ADR daily fuel usage and highlighting institutional trading session boxes.
* 🖥️ **On-Screen Control Dashboards**: Interactive HUD panels with mouse-clickable buttons via \`OnChartEvent()\`.
* 🌲 **TradingView Pine Script v6**: Extending your prompt architecture skills to Pine Script v6 and webhook bridge automation.

💡 Ready to advance to **Level 7: Senior Year (Debugging & Code Audits Without Reading Code)**? Continue below!
`
  }
];
