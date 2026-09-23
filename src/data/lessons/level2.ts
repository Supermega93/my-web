import { Lesson } from '../../types.ts';

export const LEVEL2_LESSONS: Lesson[] = [
  {
    id: 'lesson-2-1',
    course_id: '00000000-0000-0000-0000-000000000002',
    order_index: 5,
    level_name: 'Level 2: Kindergarten — Programming Concepts in Plain English',
    lesson_number: 1,
    title: 'Lesson 2.1: Labelled Boxes (Variables) 📦',
    summary: 'Master the four main types of storage boxes your trading bot uses: int (whole numbers), double (precision decimals), bool (light switches), and string (sticky notes).',
    duration_minutes: 10,
    is_free: true,
    video_url: 'https://www.youtube.com/watch?v=sQBo6OO0JOo',
    video_id: 'sQBo6OO0JOo',
    video_title: 'Level 2 Masterclass: Programming Concepts in Plain English',
    video_subtitle: 'Watch the visual walkthrough on variables and programming building blocks before working through the lesson below.',
    video_badge: 'Level 2 Video Masterclass',
    content: `
# Welcome to Level 2: Kindergarten!

Now that you have the mindset of a Strategy Architect, it’s time to pull back the curtain on how trading programs actually think.

Don't worry—you won't be writing cryptic lines of C++ or MQL5 code! Instead, we are going to master the four core building blocks of programming using simple everyday items you already have in your house: labelled boxes, decision checklists, kitchen appliances, and conveyor belts.

Let's dive in!

---

# Lesson 2.1: Labelled Boxes (Variables) 📦

When a trading robot runs on your chart, it needs a place to remember important information—like your account risk, the lot size, or whether a trailing stop is turned on.

In programming, these storage spots are called **Variables**. But as a Strategy Architect, you can simply think of them as **Labelled Storage Boxes** sitting on a shelf.

\`\`\`text
   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
   │    int (Whole)   │    │  double (Decimal)│    │   bool (Switch)  │    │   string (Text)  │
   │  [ MaxTrades: 3 ]│    │ [ LotSize: 0.15 ]│    │ [ UseTrail: TRUE]│    │["Breakout Buy"]  │
   └──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
\`\`\`

Each box has a label written on the front so the robot knows what's inside, and a specific shape that determines what kind of data fits inside it.

Here are the four main types of storage boxes your trading bot uses:

### 1. The Whole Number Box (int / Integer)
This box can only hold whole numbers—no decimals allowed!
* **Label Example**: \`MaxOpenTrades\` or \`MagicNumber\`
* **What's Inside**: \`1\`, \`5\`, \`100\`, or \`-3\`
* **Real-World Rule**: You can't open 1.5 trades; you either open 1 trade or 2 trades. Whole number boxes keep counts clean!

### 2. The Precision Decimal Box (double / Double)
This box is designed to hold precise numbers with decimal points.
* **Label Example**: \`LotSize\`, \`EntryPrice\`, or \`StopLossPips\`
* **What's Inside**: \`0.01\`, \`1.0850\`, or \`15.5\`
* **Real-World Rule**: Currency prices and lot sizes always require exact decimals. A decimal box ensures your price levels aren't rounded off by accident!

### 3. The Light Switch Box (bool / Boolean)
This is a simple binary box that holds only one of two values: \`true\` (ON) or \`false\` (OFF).
* **Label Example**: \`UseTrailingStop\` or \`AllowNewsTrading\`
* **What's Inside**: \`true\` or \`false\`
* **Real-World Rule**: Think of this like a toggle switch on your bot's user interface. Flip it to \`true\` to turn a feature on, or \`false\` to shut it down!

### 4. The Sticky Note Box (string / String)
This box holds words, labels, and text messages.
* **Label Example**: \`TradeComment\` or \`TelegramAlertHeader\`
* **What's Inside**: \`"EURUSD Breakout Buy"\` or \`"Daily Loss Limit Reached!"\`
* **Real-World Rule**: Used whenever your robot needs to stamp a text note on an order or send a readable alert to your phone!

---

## 💡 Why This Matters to You

When prompting an AI assistant, you don't need to write code syntax. You simply tell the AI:
> *"Create a light-switch setting called UseTrailingStop set to true, and a precision decimal box called LotSize set to 0.10."*

The AI will build the exact storage boxes for you!

`
  },
  {
    id: 'lesson-2-2',
    course_id: '00000000-0000-0000-0000-000000000002',
    order_index: 6,
    level_name: 'Level 2: Kindergarten — Programming Concepts in Plain English',
    lesson_number: 2,
    title: 'Lesson 2.2: Decision Checklists (Conditions) 📋',
    summary: 'Discover how trading programs evaluate decisions using if/else statements, Yes-or-No checklists, and how to combine rules with AND/OR guards.',
    duration_minutes: 12,
    is_free: true,
    content: `
# Lesson 2.2: Decision Checklists (Conditions) 📋

Have you ever looked at a set of trading rules and thought, "How does a computer actually make a trade decision?"

It uses **Conditions**!

In coding, conditions are written as \`if\` / \`else\` statements. But to keep things simple, just picture a **Yes-or-No Decision Checklist**.

\`\`\`text
                           ┌─────────────────────────────┐
                           │   Is 10 EMA above 50 EMA?   │
                           └──────────────┬──────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
                     [ YES ]                            [ NO ]
                         │                                 │
                         ▼                                 ▼
           ┌───────────────────────────┐       ┌──────────────────────┐
           │ Is Spread < 20 Points?    │       │ Do Nothing & Wait    │
           └─────────────┬─────────────┘       └──────────────────────┘
                         │
                 ┌───────┴───────┐
                 ▼               ▼
             [ YES ]          [ NO ]
                 │               │
                 ▼               ▼
           ┌───────────┐   ┌───────────┐
           │ OPEN BUY! │   │ WAIT...   │
           └───────────┘   └───────────┘
\`\`\`

---

## ☕ The Everyday Example

Think about how you decide what to wear in the morning:
* **IF** it is raining outside = **YES** ➔ Put on a raincoat.
* **ELSE** (it is not raining) = **NO** ➔ Wear sunglasses.

---

## 📈 How Trading Bots Use Checklists

A trading robot runs through this exact same \`if\` / \`else\` logic on every single price tick:

\`\`\`text
IF (10 EMA is above 50 EMA) AND (Spread is less than 20 points)
    --> ACTION: Open a Buy Trade!
ELSE
    --> ACTION: Do nothing, stay on sidelines, and wait for the next candle.
\`\`\`

---

## 🔗 Combining Rules with AND / OR

As a Strategy Architect, you can link multiple items on your checklist together:

### 1. The "AND" Guard (All Must Be True):
> *"Open a Buy ONLY IF RSI is below 30 AND price touches the 200 EMA."*
*(If even one rule fails, no trade is taken!)*

### 2. The "OR" Guard (Any Can Be True):
> *"Close the trade IF Daily Loss hits 4% OR Equity drops below $9,500."*
*(If either condition triggers, the safety mechanism fires instantly!)*

`
  },
  {
    id: 'lesson-2-3',
    course_id: '00000000-0000-0000-0000-000000000002',
    order_index: 7,
    level_name: 'Level 2: Kindergarten — Programming Concepts in Plain English',
    lesson_number: 3,
    title: 'Lesson 2.3: Kitchen Appliances (Functions) 🍞',
    summary: 'Understand how modular functions work like kitchen appliances: feeding in parameters (ingredients), running an internal process, and spitting out the finished output.',
    duration_minutes: 12,
    is_free: true,
    content: `
# Lesson 2.3: Kitchen Appliances (Functions) 🍞

Imagine if every time you wanted a slice of toast in the morning, you had to manually construct the heating wires, wire up a plug, assemble a metal box, and plug it into the wall.

That would be exhausting!

Instead, you buy a toaster. You put your bread inside, press the lever down, and out pops delicious, warm toast.

In programming, a **Function** is just like a **Kitchen Appliance**!

\`\`\`text
     [ Raw Ingredients ]                 [ The Machine ]                [ Finished Result ]
     (Account Balance: $10,000)   ───►   ┌─────────────────┐   ───►    ( Calculated Lot Size: )
     (Risk Percent: 1.0%)                │ CalculateLot()  │           (      0.10 Lots       )
     (Stop Loss: 20 Pips)                └─────────────────┘
\`\`\`

---

## ⚙️ How a Function Works

A function is a self-contained mini-machine built to perform one specific task over and over again whenever called upon.

It has three simple parts:
1. **Ingredients (Parameters / Inputs)**: What you feed into the machine (e.g., bread).
2. **The Internal Process**: The magic work happening inside the appliance (e.g., heating up).
3. **The Output (Return Value)**: What pops out when the job is done (e.g., toast!).

---

## 🧮 A Trading Example: The Lot Size Calculator

Instead of cluttering your core trading strategy with heavy mathematical formulas, your bot calls a specialized function called \`CalculateLotSize()\`.
* **Ingredients (Inputs)**: Account Balance ($10,000), Risk Percentage (1.0%), and Stop Loss Distance (20 pips).
* **The Internal Process**: The function multiplies your balance by 1%, divides by the pip value, and rounds down to broker limits.
* **The Output (Return Value)**: \`0.10 lots\`!

---

## 🧱 Why Functions Are Your Best Friend

Functions allow you to build your bot using **modular Lego blocks**.

If you want to change how your lot size is calculated later on, you don't have to rebuild your entire trading robot! You simply tell the AI to update the single \`CalculateLotSize()\` appliance, leaving the rest of your system untouched and bug-free!

`
  },
  {
    id: 'lesson-2-4',
    course_id: '00000000-0000-0000-0000-000000000002',
    order_index: 8,
    level_name: 'Level 2: Kindergarten — Programming Concepts in Plain English',
    lesson_number: 4,
    title: 'Lesson 2.4: Repetitive Tasks (Loops) 🔄',
    summary: 'Learn how loops act like conveyor belts in a factory, scanning through historical candles and managing open trades in less than a millisecond.',
    duration_minutes: 14,
    is_free: true,
    content: `
# Lesson 2.4: Repetitive Tasks (Loops) 🔄

Imagine you are hired as a quality control inspector at a tennis ball factory. A conveyor belt carries thousands of tennis balls past your desk every hour.

Your job is to inspect the last 20 tennis balls to make sure none of them are flat.

Would you build 20 separate inspection stations with 20 different workers? Of course not! You would sit at one station and let a conveyor belt loop the balls past you one by one.

In programming, this conveyor belt is called a **Loop**!

\`\`\`text
                    ┌──────────────────────────────────────────────┐
                    │               THE CONVEYOR BELT              │
                    └──────┬────────────────────────────────┬──────┘
                           │                                │
                           ▼                                ▼
                     Candle [1]                        Candle [2]
               (Is High > Previous?)             (Is High > Previous?)
                           │                                │
                           └───────────────┬────────────────┘
                                           │
                                           ▼
                                   Save Highest Price!
\`\`\`

---

## 🔍 How Trading Bots Use Loops

A chart in MetaTrader is just a long line of historical price candles numbered backwards from right to left:
* **Candle 0**: The current live candle moving right now.
* **Candle 1**: The candle that just closed 5 minutes ago.
* **Candle 2**: The candle from 10 minutes ago... and so on.

If you want your trading robot to find the highest price over the last 20 candles, you don't write 20 repetitive instructions.

Instead, you tell the AI to run a **Loop**:
> 💬 **Strategy Architect Directive**: *"Run a loop from Candle 1 back to Candle 20. Check the high price of each candle, compare them, and remember the highest price found."*

The robot fires up its loop conveyor belt, scans all 20 candles in less than 0.0001 seconds, and hands you the exact highest price level!

---

## 🛡️ Other Cool Uses for Loops

Loops aren't just for scanning price charts! They are also used to:
1. **Manage Open Positions**: Scan through all active trades on your account to find which ones need their stop loss moved to break-even.
2. **Filter History**: Scan past closed trades to calculate how many winning trades your bot took today.

By using loops, your code remains short, clean, and ultra-fast!

---

## 🏆 Level 2 Master Recap

You've just unlocked the core mechanics of computer programming without typing a single line of syntax!
* 📦 **Variables (Labelled Boxes)**: Storage spots for whole numbers (\`int\`), decimals (\`double\`), light-switches (\`bool\`), and text notes (\`string\`).
* 📋 **Conditions (Decision Checklists)**: \`if\` / \`else\` rules that evaluate whether to enter a trade or stay safe on the sidelines.
* 🍞 **Functions (Kitchen Appliances)**: Self-contained mini-machines that take input ingredients and return a finished result.
* 🔄 **Loops (Conveyor Belts)**: Lightning-fast loops that scan through candles and open orders in milliseconds.

💡 Ready to move up to **Level 3: Elementary (Lesson 3.1: The 5 Program Types & EA Lifecycles)**? Continue below!
`
  }
];
