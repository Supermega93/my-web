export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface LessonQuiz {
  lessonId: string;
  lessonNumber: number;
  title: string;
  levelName: string;
  questions: QuizQuestion[];
}

export const LESSON_QUIZZES: Record<string, LessonQuiz> = {
  // =========================================================================
  // LEVEL 1: PRESCHOOL (STRATEGY ARCHITECT MINDSET)
  // =========================================================================
  'lesson-1-0': {
    lessonId: 'lesson-1-0',
    lessonNumber: 1,
    title: 'Orientation Quick Quiz',
    levelName: 'Level 1: Preschool',
    questions: [
      {
        id: 'q1-0-1',
        question: 'What is the primary role of a Strategy Architect in AI-assisted development?',
        options: [
          'A) Writing thousands of lines of C++ code by hand from memory.',
          'B) Translating trading setups into exact plain-English rules and verifying the AI\'s output.',
          'C) Letting the AI make up its own risk management rules and trading setups.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) Translating trading setups into exact plain-English rules and verifying the AI\'s output! 🎉 BOOM! Perfect start! You\'ve already grasped the core philosophy of the school: you are the master chef writing the recipe, and the AI is your kitchen assistant.',
        conceptTag: 'Strategy Architect Role'
      }
    ]
  },

  'lesson-1-1': {
    lessonId: 'lesson-1-1',
    lessonNumber: 2,
    title: 'Lesson 1.1 Quiz: The AI Is a Literal Machine',
    levelName: 'Level 1: Preschool',
    questions: [
      {
        id: 'q1-1-1',
        question: 'Why does giving an AI a vague prompt like "build me a bot that trades breakouts" usually result in losing code?',
        options: [
          'A) Because AI language models refuse to code breakout strategies.',
          'B) Because the AI will not ask clarifying questions; it will simply guess the rules and parameters for you.',
          'C) Because you need a computer science degree to talk to an AI model.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) Because the AI will not ask clarifying questions; it will simply guess the rules and parameters for you! 🎉 HIGH FIVE! You nailed it! Master the first rule of AI Trading Architecture: Never let the AI guess your rules!',
        conceptTag: 'Vague Prompts'
      }
    ]
  },

  'lesson-1-2': {
    lessonId: 'lesson-1-2',
    lessonNumber: 3,
    title: 'Lesson 1.2 Quiz: Human Words vs Machine Facts',
    levelName: 'Level 1: Preschool',
    questions: [
      {
        id: 'q1-2-1',
        question: 'Which of the following is a Machine Fact Rule that an AI can code without guessing?',
        options: [
          'A) "Buy whenever EURUSD feels overbought."',
          'B) "Enter a Buy trade when price touches the 200 EMA and the next candle closes green."',
          'C) "Buy when the market looks like it\'s about to explode upward."'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) Enter a Buy trade when price touches the 200 EMA and the next candle closes green! 🎉 YOU CRUSHED IT! You\'ve mastered the art of replacing vague guru words with exact machine facts!',
        conceptTag: 'Machine Facts'
      }
    ]
  },

  'lesson-1-3': {
    lessonId: 'lesson-1-3',
    lessonNumber: 4,
    title: 'Lesson 1.3 Quiz: The Safety Testing Protocol',
    levelName: 'Level 1: Preschool',
    questions: [
      {
        id: 'q1-3-1',
        question: 'What is the "Explain-It-To-Me" prompt used for after an AI generates code for your trading robot?',
        options: [
          'A) Immediately attach it to a live $50,000 trading account.',
          'B) Run the "Explain It To Me" Safety Check prompt to make the AI explain its logic in plain English.',
          'C) Assume the AI is 100% correct because computer models never make mistakes.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) Run the "Explain It To Me" Safety Check prompt to make the AI explain its logic in plain English! 🎉 YOU ARE UNSTOPPABLE! You now have the ultimate shield against AI hallucinations! You have officially graduated from Level 1: Preschool!',
        conceptTag: 'Safety Testing'
      }
    ]
  },

  // =========================================================================
  // LEVEL 2: KINDERGARTEN (PROGRAMMING CONCEPTS IN PLAIN ENGLISH)
  // =========================================================================
  'lesson-2-1': {
    lessonId: 'lesson-2-1',
    lessonNumber: 1,
    title: 'Lesson 2.1 Pop Quiz: Labelled Boxes (Variables) 📦',
    levelName: 'Level 2: Kindergarten',
    questions: [
      {
        id: 'q2-1-1',
        question: 'You want to create a setting in your trading bot that lets you turn on or off a Spread Filter. Which type of labelled box should the AI use?',
        options: [
          'A) An int (Whole Number Box)',
          'B) A bool (Light Switch Box holding true or false)',
          'C) A string (Sticky Note Box)'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) A bool (Light Switch Box holding true or false)! 🎉 BOOM! You got it! You\'re already organizing data like a veteran software architect! Light switches turn features ON or OFF in a flash!',
        conceptTag: 'Variables & Booleans'
      }
    ]
  },

  'lesson-2-2': {
    lessonId: 'lesson-2-2',
    lessonNumber: 2,
    title: 'Lesson 2.2 Pop Quiz: Decision Checklists (Conditions) 📋',
    levelName: 'Level 2: Kindergarten',
    questions: [
      {
        id: 'q2-2-1',
        question: 'What happens if a trading bot evaluates an if condition and the checklist result is NO (False)?',
        options: [
          'A) The computer crashes and restarts.',
          'B) It skips the if action and executes the else instruction (or simply waits for the next check).',
          'C) It opens a trade anyway because robots don\'t like waiting.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) It skips the if action and executes the else instruction (or simply waits for the next check)! 🎉 HIGH FIVE! You nailed it! You just mastered how decision engines work. If the checklist isn\'t 100% complete, your capital stays safe on the sidelines!',
        conceptTag: 'If/Else Conditions'
      }
    ]
  },

  'lesson-2-3': {
    lessonId: 'lesson-2-3',
    lessonNumber: 3,
    title: 'Lesson 2.3 Pop Quiz: Kitchen Appliances (Functions) 🍞',
    levelName: 'Level 2: Kindergarten',
    questions: [
      {
        id: 'q2-3-1',
        question: 'In our kitchen appliance analogy, what are "Parameters"?',
        options: [
          'A) The electricity bill you pay at the end of the month.',
          'B) The raw ingredients (inputs) you feed into a function so it can do its job.',
          'C) The error messages that pop up on MetaTrader.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) The raw ingredients (inputs) you feed into a function so it can do its job! 🎉 YOU\'RE ON FIRE! You now understand modular architecture! Keep feeding your functions clean ingredients and they\'ll spit out perfect results every time!',
        conceptTag: 'Functions & Parameters'
      }
    ]
  },

  'lesson-2-4': {
    lessonId: 'lesson-2-4',
    lessonNumber: 4,
    title: 'Lesson 2.4 Pop Quiz: Repetitive Tasks (Loops) 🔄',
    levelName: 'Level 2: Kindergarten',
    questions: [
      {
        id: 'q2-4-1',
        question: 'Why do trading robots use loops when checking historical chart data?',
        options: [
          'A) Because loops cause MetaTrader to run in slow motion so you can watch every tick.',
          'B) To automatically scan through multiple candles or open trades without writing repetitive instructions.',
          'C) To force the broker to execute trades with zero spread.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) To automatically scan through multiple candles or open trades without writing repetitive instructions! 🎉 CONGRATULATIONS! YOU HAVE OFFICIALLY GRADUATED FROM LEVEL 2: KINDERGARTEN!',
        conceptTag: 'Loops & Iteration'
      }
    ]
  },

  // =========================================================================
  // LEVEL 3: ELEMENTARY (ROBOT ARCHITECTURE & BLUEPRINTS)
  // =========================================================================
  'lesson-3-1': {
    lessonId: 'lesson-3-1',
    lessonNumber: 1,
    title: 'Lesson 3.1 Pop Quiz: The 5 Program Types 🚘',
    levelName: 'Level 3: Elementary',
    questions: [
      {
        id: 'q3-1-1',
        question: 'You want a custom tool that draws colored support and resistance bands on your chart to help your manual analysis, but you do NOT want it to place trades. Which program type should you ask the AI to build?',
        options: [
          'A) An Expert Advisor (EA)',
          'B) A Custom Indicator',
          'C) A Utility Script'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) A Custom Indicator! 🎉 BOOM! Spot on! Custom Indicators excel at visual chart analysis while keeping your account completely safe from accidental order placement!',
        conceptTag: 'MQL5 Program Types'
      }
    ]
  },

  'lesson-3-2': {
    lessonId: 'lesson-3-2',
    lessonNumber: 2,
    title: 'Lesson 3.2 Pop Quiz: The Robot\'s Heartbeat 💓',
    levelName: 'Level 3: Elementary',
    questions: [
      {
        id: 'q3-2-1',
        question: 'Where should one-time startup code (such as checking input settings and preparing indicator handles) be placed inside an EA?',
        options: [
          'A) Inside OnTick(), so it recalculates on every price movement.',
          'B) Inside OnInit(), so it executes cleanly just once when attached to the chart.',
          'C) Inside OnDeinit(), right as the EA is being removed.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) Inside OnInit(), so it executes cleanly just once when attached to the chart! 🎉 HIGH FIVE! You nailed it! You now understand the lifecycle of an EA better than many self-taught programmers! Keeping startup tasks in OnInit() ensures your bot stays ultra-fast!',
        conceptTag: 'EA Lifecycle Events'
      }
    ]
  },

  'lesson-3-3': {
    lessonId: 'lesson-3-3',
    lessonNumber: 3,
    title: 'Lesson 3.3 Pop Quiz: The 4 Lego Blocks Architecture 🧱',
    levelName: 'Level 3: Elementary',
    questions: [
      {
        id: 'q3-3-1',
        question: 'Which Lego Block is responsible for protecting your account by automatically halting the robot if your daily loss hits 4%?',
        options: [
          'A) The Brain 🧠',
          'B) The Shield 🛡️',
          'C) The Hands 🖐️'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) The Shield 🛡️! 🎉 BOOM! YOU CRUSHED IT! The Shield is your ultimate financial armor, keeping your trading capital safe even when the markets get wild!',
        conceptTag: 'The Shield (Risk Engine)'
      }
    ]
  },

  'lesson-3-practical': {
    lessonId: 'lesson-3-practical',
    lessonNumber: 5,
    title: 'Lesson 3.5 Workshop Checkpoint: Build Your First Breakout EA 🛠️',
    levelName: 'Level 3: Elementary',
    questions: [
      {
        id: 'q3-practical-1',
        question: 'In your Breakout EA workshop, what was the key purpose of adding the isNewBar() check to Block 3 (The Glasses)?',
        options: [
          'A) It increases the lot size dynamically on every tick.',
          'B) It ensures entry and spread checks run strictly once per hourly candle open, preventing the bot from spamming trades on rapid tick movements.',
          'C) It deletes all trade history every weekend.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) It ensures entry and spread checks run strictly once per hourly candle open, preventing the bot from spamming trades on rapid tick movements! 🎉 BOOM! You nailed the Strategy Architect mindset: precision timing protects your account from tick-chatter and duplicate orders!',
        conceptTag: 'Bar Timing & isNewBar'
      }
    ]
  },

  // =========================================================================
  // LEVEL 4: MIDDLE SCHOOL (MASTERING AI PROMPT ENGINEERING)
  // =========================================================================
  'lesson-4-1': {
    lessonId: 'lesson-4-1',
    lessonNumber: 1,
    title: 'Lesson 4.1 Pop Quiz: The 5-Ingredient Recipe 🍳',
    levelName: 'Level 4: Middle School',
    questions: [
      {
        id: 'q4-1-1',
        question: 'Why is the Constraints ingredient so important when writing a master prompt?',
        options: [
          'A) It causes the AI to write code in a different programming language.',
          'B) It sets strict boundaries that stop the AI from making dangerous guesses or using hardcoded assumptions.',
          'C) It forces MetaTrader 5 to run backtests 10 times faster.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) It sets strict boundaries that stop the AI from making dangerous guesses or using hardcoded assumptions! 🎉 BOOM! You\'re cooking like a Master Chef! Adding strict constraints keeps the AI\'s hands off your account risk!',
        conceptTag: 'Master Prompt Recipe'
      }
    ]
  },

  'lesson-4-2': {
    lessonId: 'lesson-4-2',
    lessonNumber: 2,
    title: 'Lesson 4.2 Pop Quiz: The Negative Constraint Shield 🛡️',
    levelName: 'Level 4: Middle School',
    questions: [
      {
        id: 'q4-2-1',
        question: 'What happens if you forget to add a negative constraint regarding MagicNumbers when asking an AI to write a "Close All Trades" feature?',
        options: [
          'A) The AI will automatically lock your account.',
          'B) The bot might accidentally close your manual trades alongside its own automated trades.',
          'C) MetaTrader 5 will refuse to connect to your broker.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) The bot might accidentally close your manual trades alongside its own automated trades! 🎉 HIGH FIVE! You nailed it! Negative constraints act as your financial armor, preventing the AI from touching manual trades!',
        conceptTag: 'Negative Constraints'
      }
    ]
  },

  'lesson-4-3': {
    lessonId: 'lesson-4-3',
    lessonNumber: 3,
    title: 'Lesson 4.3 Pop Quiz: Checklists & The Blueprint Agreement 📜',
    levelName: 'Level 4: Middle School',
    questions: [
      {
        id: 'q4-3-1',
        question: 'Why do Strategy Architects use "The Blueprint Agreement" prompt before generating code?',
        options: [
          'A) To force the AI to agree on a step-by-step development roadmap so it doesn\'t rush into writing a confused, monolithic script.',
          'B) To automatically backtest the strategy across 10 years of historical data.',
          'C) To change MetaEditor\'s background color.'
        ],
        correctIndex: 0,
        explanation: 'Correct Answer: A) To force the AI to agree on a step-by-step development roadmap so it doesn\'t rush into writing a confused, monolithic script! 🎉 YOU ARE UNSTOPPABLE! Forcing the AI to agree on the roadmap keeps your development clean, calm, and structured!',
        conceptTag: 'The Blueprint Agreement'
      }
    ]
  },

  'lesson-4-4': {
    lessonId: 'lesson-4-4',
    lessonNumber: 4,
    title: 'Lesson 4.4 Pop Quiz: Surgical Code Fixes 🔬',
    levelName: 'Level 4: Middle School',
    questions: [
      {
        id: 'q4-4-1',
        question: 'What should you do when 80% of your trading bot is working perfectly, but one small feature has a bug?',
        options: [
          'A) Delete the file and ask the AI to write the entire trading bot from scratch.',
          'B) Use a Surgical Fix prompt specifying Expected vs. Actual behavior, instructing the AI to modify ONLY the bugged function while keeping the rest untouched.',
          'C) Trade manually and give up on automation.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) Use a Surgical Fix prompt specifying Expected vs. Actual behavior, instructing the AI to modify ONLY the bugged function while keeping the rest untouched! 🎉 CONGRATULATIONS! YOU HAVE GRADUATED FROM LEVEL 4: MIDDLE SCHOOL!',
        conceptTag: 'Surgical Bug Fixing'
      }
    ]
  },

  // =========================================================================
  // LEVEL 5: HIGH SCHOOL (THE SAFETY SHIELD & RISK ARCHITECTURE)
  // =========================================================================
  'lesson-5-1': {
    lessonId: 'lesson-5-1',
    lessonNumber: 1,
    title: 'Lesson 5.1 Pop Quiz: Automatic Lot Sizing & Clamping 🧮',
    levelName: 'Level 5: High School',
    questions: [
      {
        id: 'q5-1-1',
        question: 'What is the purpose of "Lot Clamping" in an Expert Advisor?',
        options: [
          'A) To force the broker to execute trades with zero spread.',
          'B) To adjust the calculated lot size so it strictly obeys the broker\'s minimum, maximum, and step size volume limits.',
          'C) To double your position size after every losing trade.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) To adjust the calculated lot size so it strictly obeys the broker\'s minimum, maximum, and step size volume limits! 🎉 BOOM! You got it! Lot clamping keeps your orders execution-ready so your broker never rejects a valid trade setup!',
        conceptTag: 'Lot Clamping'
      }
    ]
  },

  'lesson-5-2': {
    lessonId: 'lesson-5-2',
    lessonNumber: 2,
    title: 'Lesson 5.2 Pop Quiz: Prop Firm Daily Loss Limits 🛡️',
    levelName: 'Level 5: High School',
    questions: [
      {
        id: 'q5-2-1',
        question: 'Why should a Strategy Architect set a daily loss limit of 4.0% if the prop firm\'s limit is 5.0%?',
        options: [
          'A) Because prop firms mandate that you always leave a 1.0% tip.',
          'B) To create a 1.0% safety buffer that protects against slippage or spread widening during market closure.',
          'C) Because MetaTrader 5 cannot calculate numbers ending in 5.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) To create a 1.0% safety buffer that protects against slippage or spread widening during market closure! 🎉 HIGH FIVE! You nailed it! A 1% safety buffer ensures slippage never pushes you over the prop firm\'s hard breach limit!',
        conceptTag: 'Daily Loss Shield'
      }
    ]
  },

  'lesson-5-3': {
    lessonId: 'lesson-5-3',
    lessonNumber: 3,
    title: 'Lesson 5.3 Pop Quiz: The Filter Stack 👓',
    levelName: 'Level 5: High School',
    questions: [
      {
        id: 'q5-3-1',
        question: 'What does the "New Candle Guard" (isNewBar) prevent your Expert Advisor from doing?',
        options: [
          'A) It prevents the EA from running during weekends.',
          'B) It prevents the EA from opening multiple duplicate trades on every tick of the exact same candle.',
          'C) It stops MetaTrader 5 from updating chart colors.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) It prevents the EA from opening multiple duplicate trades on every tick of the exact same candle! 🎉 BOOM! You\'re an execution master! Evaluating rules once per candle open keeps your trade entries clean and disciplined!',
        conceptTag: 'Execution Filters'
      }
    ]
  },

  'lesson-5-4': {
    lessonId: 'lesson-5-4',
    lessonNumber: 4,
    title: 'Lesson 5.4 Pop Quiz: Active Trade Management 🖐️',
    levelName: 'Level 5: High School',
    questions: [
      {
        id: 'q5-4-1',
        question: 'Why do Strategy Architects add a small buffer (e.g., +2 pips) when moving a Stop Loss to Break-Even?',
        options: [
          'A) To force the broker to pay extra interest on the trade.',
          'B) To cover broker spread and trade commissions, ensuring the trade closes with zero loss if price returns to entry.',
          'C) Because MetaTrader 5 does not allow Stop Loss orders at exact entry prices.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B) To cover broker spread and trade commissions, ensuring the trade closes with zero loss if price returns to entry! 🎉 CONGRATULATIONS! YOU HAVE OFFICIALLY GRADUATED FROM LEVEL 5: HIGH SCHOOL!',
        conceptTag: 'Active Trade Management'
      }
    ]
  },

  // =========================================================================
  // LEVEL 6: UNDERGRADUATE (METATRADER 5 & MQL5 SYSTEM ARCHITECTURE)
  // =========================================================================
  // =========================================================================
  // LEVEL 6: UNDERGRADUATE (VISUAL TOOLS & ON-SCREEN DASHBOARDS)
  // =========================================================================
  'lesson-6-1': {
    lessonId: 'lesson-6-1',
    lessonNumber: 1,
    title: 'Lesson 6.1 Pop Quiz: Chart Glasses & Alarms 🔔',
    levelName: 'Level 6: Undergraduate',
    questions: [
      {
        id: 'q6-1-1',
        question: 'Can a Custom Indicator directly open, modify, or close trades on your MetaTrader 5 account?',
        options: [
          'A) Yes, custom indicators trade automatically on every tick.',
          'B) No! Custom indicators are visual analysis tools that draw on charts and send alerts, but CANNOT place trades.',
          'C) Only if your account balance is greater than $10,000.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! Custom indicators are visual analysis tools that draw on charts and send alerts, but CANNOT place trades! 🎉 BOOM! You got it! Indicators give you visual eyes and phone alerts without taking any execution risk!',
        conceptTag: 'Custom Indicators vs EAs'
      }
    ]
  },

  'lesson-6-2': {
    lessonId: 'lesson-6-2',
    lessonNumber: 2,
    title: 'Lesson 6.2 Pop Quiz: Volatility & Session Boxes ⏱️',
    levelName: 'Level 6: Undergraduate',
    questions: [
      {
        id: 'q6-2-1',
        question: 'Why is tracking the Average Daily Range (ADR) percentage crucial before entering a trade?',
        options: [
          'A) Because it tells you what time the broker closes on Friday.',
          'B) Because it measures whether the currency pair has already exhausted its average daily price movement fuel.',
          'C) Because it automatically doubles your leverage.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! Because it measures whether the currency pair has already exhausted its average daily price movement fuel! 🎉 HIGH FIVE! You nailed it! Checking ADR usage stops you from buying the absolute top or selling the absolute bottom of a tired market move!',
        conceptTag: 'Average Daily Range'
      }
    ]
  },

  'lesson-6-3': {
    lessonId: 'lesson-6-3',
    lessonNumber: 3,
    title: 'Lesson 6.3 Pop Quiz: Multi-Bot On-Screen Dashboards 🖥️',
    levelName: 'Level 6: Undergraduate',
    questions: [
      {
        id: 'q6-3-1',
        question: 'Which event handler inside an Expert Advisor detects when a user clicks an on-screen button on their chart?',
        options: [
          'A) OnInit()',
          'B) OnChartEvent()',
          'C) OnDeinit()'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! OnChartEvent()! 🎉 YOU CRUSHED IT! OnChartEvent() turns your static charts into interactive, mouse-clickable control centers!',
        conceptTag: 'Interactive Chart Dashboards'
      }
    ]
  },

  'lesson-6-4': {
    lessonId: 'lesson-6-4',
    lessonNumber: 4,
    title: 'Lesson 6.4 Pop Quiz: TradingView Pine Script v6 Automation 🌲',
    levelName: 'Level 6: Undergraduate',
    questions: [
      {
        id: 'q6-4-1',
        question: 'How does a TradingView Pine Script strategy automatically trigger live trades on a MetaTrader 5 broker account?',
        options: [
          'A) By printing the chart out on paper and mailing it to the broker.',
          'B) By sending automated Webhook JSON alert messages over the internet to a bridge receiver.',
          'C) TradingView and MT5 are the exact same program so no bridge is needed.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! By sending automated Webhook JSON alert messages over the internet to a bridge receiver! 🎉 CONGRATULATIONS! YOU HAVE GRADUATED FROM LEVEL 6: UNDERGRADUATE!',
        conceptTag: 'Pine Script Webhook Bridges'
      }
    ]
  },

  // =========================================================================
  // LEVEL 7: SENIOR YEAR (DEBUGGING & CODE AUDITS WITHOUT READING CODE)
  // =========================================================================
  'lesson-7-1': {
    lessonId: 'lesson-7-1',
    lessonNumber: 1,
    title: 'Lesson 7.1 Pop Quiz: The Pre-Flight Safety Audit ✈️',
    levelName: 'Level 7: Senior Year',
    questions: [
      {
        id: 'q7-1-1',
        question: 'Why should you run the "Explain It To Me" safety audit before copying code into MetaTrader?',
        options: [
          'A) Because MetaTrader 5 will refuse to open unless you type a password in chat.',
          'B) To force the AI to explain its trade and risk logic in plain English, exposing hidden flaws before touching MetaEditor.',
          'C) To turn on automatic 100x leverage on your broker account.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! To force the AI to explain its trade and risk logic in plain English, exposing hidden flaws before touching MetaEditor! 🎉 BOOM! You nailed it! The Pre-Flight Audit is your first line of defense against silent AI mistakes!',
        conceptTag: 'Pre-Flight Code Auditing'
      }
    ]
  },

  'lesson-7-2': {
    lessonId: 'lesson-7-2',
    lessonNumber: 2,
    title: 'Lesson 7.2 Pop Quiz: Compiler Errors vs Logic Errors 🚦',
    levelName: 'Level 7: Senior Year',
    questions: [
      {
        id: 'q7-2-1',
        question: 'Which type of bug is more dangerous: a Compiler Error or a Logic Error?',
        options: [
          'A) A Compiler Error, because red text damages your computer monitor.',
          'B) A Logic Error, because the code compiles cleanly with 0 errors but executes the wrong trading behavior silently.',
          'C) Both are equally impossible to fix with AI.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! A Logic Error, because the code compiles cleanly with 0 errors but executes the wrong trading behavior silently! 🎉 HIGH FIVE! Spot on! Logic errors are silent, which is why a Strategy Architect always verifies trade execution in the Strategy Tester!',
        conceptTag: 'Logic Errors'
      }
    ]
  },

  'lesson-7-3': {
    lessonId: 'lesson-7-3',
    lessonNumber: 3,
    title: 'Lesson 7.3 Pop Quiz: The AI Mistake-Pattern Audit 🕵️‍♂️',
    levelName: 'Level 7: Senior Year',
    questions: [
      {
        id: 'q7-7-1',
        question: 'What happens if an AI writes a trade management function that does NOT check the EA\'s MagicNumber?',
        options: [
          'A) The EA runs 10 times faster.',
          'B) The EA might accidentally modify or close manual trades you opened yourself on the same account.',
          'C) MetaTrader converts your account to a demo account automatically.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! The EA might accidentally modify or close manual trades you opened yourself on the same account! 🎉 YOU CRUSHED IT! Auditing for Magic Numbers ensures your bot stays in its own lane and leaves your manual trades alone!',
        conceptTag: 'MagicNumber Auditing'
      }
    ]
  },

  'lesson-7-4': {
    lessonId: 'lesson-7-4',
    lessonNumber: 4,
    title: 'Lesson 7.4 Pop Quiz: Out-of-Sample Backtesting 📈',
    levelName: 'Level 7: Senior Year',
    questions: [
      {
        id: 'q7-4-1',
        question: 'What is the purpose of running an "Out-of-Sample" backtest on reserved, unseen historical data?',
        options: [
          'A) To make backtests run in 3D graphic mode.',
          'B) To prove that the EA has a real market edge rather than just memorizing (curve-fitting) past price noise.',
          'C) To bypass broker spread fees.'
        ],
        correctIndex: 1,
        explanation: 'Correct Answer: B! To prove that the EA has a real market edge rather than just memorizing (curve-fitting) past price noise! 🎉 CONGRATULATIONS! YOU HAVE GRADUATED FROM LEVEL 7: SENIOR YEAR!',
        conceptTag: 'Out-of-Sample Verification'
      }
    ]
  },

  // =========================================================================
  // LEVEL 8: GRADUATION CAPSTONE (REAL-WORLD PRACTICAL PROJECTS)
  // =========================================================================
  'lesson-8-1': {
    lessonId: 'lesson-8-1',
    lessonNumber: 1,
    title: 'Lesson 8.1 Pop Quiz: Project 1 — Volatility Exhaustion Bot ⛽',
    levelName: 'Level 8: Graduation Capstone',
    questions: [
      {
        id: 'q8-1-1',
        question: 'Why does the Volatility Exhaustion Bot block buy signals when today\'s range exceeds 70% of the 5-day ADR?',
        options: [
          'A) To prevent buying at the top of a market move when price has already exhausted its average daily range.',
          'B) To force MetaTrader 5 to close for the weekend.',
          'C) Because ADR indicators only work on demo accounts.'
        ],
        correctIndex: 0,
        explanation: 'Correct Answer: A! To prevent buying at the top of a market move when price has already exhausted its average daily range! 🎉 BOOM! You\'re an execution guardian! Filtering out tired moves saves you from buying the absolute high of the day!',
        conceptTag: 'Volatility Exhaustion'
      }
    ]
  },

  'lesson-8-2': {
    lessonId: 'lesson-8-2',
    lessonNumber: 2,
    title: 'Lesson 8.2 Pop Quiz: Project 2 — Automated Trade Manager 🖐️',
    levelName: 'Level 8: Graduation Capstone',
    questions: [
      {
        id: 'q8-2-1',
        question: 'Why must an Automated Trade Manager check ticket numbers before executing a partial close?',
        options: [
          'A) To prevent the bot from repeatedly closing 50% of the remaining volume on every single tick.',
          'B) To change the chart color to yellow.',
          'C) To notify your broker that you are taking a lunch break.'
        ],
        correctIndex: 0,
        explanation: 'Correct Answer: A! To prevent the bot from repeatedly closing 50% of the remaining volume on every single tick! 🎉 HIGH FIVE! Spot on! Firing management functions strictly once per ticket guarantees clean, hands-free profit protection!',
        conceptTag: 'Ticket Partial Close'
      }
    ]
  },

  'lesson-8-3': {
    lessonId: 'lesson-8-3',
    lessonNumber: 3,
    title: 'Lesson 8.3 Pop Quiz: Project 3 — Prop Firm Challenge EA 🛡️',
    levelName: 'Level 8: Graduation Capstone',
    questions: [
      {
        id: 'q8-3-1',
        question: 'Why do Strategy Architects include a 1% safety buffer on prop-firm daily loss limits (setting the EA shield at 4% when the firm\'s limit is 5%)?',
        options: [
          'A) To protect against slippage and spread widening during fast market moves so you never breach the hard limit.',
          'B) Because prop firms pay extra bonuses for EAs set at 4%.',
          'C) MetaTrader 5 only calculates even numbers.'
        ],
        correctIndex: 0,
        explanation: 'Correct Answer: A! To protect against slippage and spread widening during fast market moves so you never breach the hard limit! 🎉 YOU ARE A MASTER ARCHITECT! Safety buffers are the secret weapon behind funded-account longevity!',
        conceptTag: 'Prop Firm Safety Buffers'
      }
    ]
  },

  'lesson-8-4': {
    lessonId: 'lesson-8-4',
    lessonNumber: 4,
    title: 'Lesson 8.4 Pop Quiz: Project 4 — Multi-Bot Control Dashboard 🖥️',
    levelName: 'Level 8: Graduation Capstone',
    questions: [
      {
        id: 'q8-4-1',
        question: 'How does a Multi-Bot Control Dashboard separate the performance of three different EAs running on the same account?',
        options: [
          'A) By filtering open orders and trade history by each EA\'s unique Magic Number.',
          'B) By changing the chart timeframe every 10 seconds.',
          'C) By sending an email to MetaQuotes support.'
        ],
        correctIndex: 0,
        explanation: 'Correct Answer: A! By filtering open orders and trade history by each EA\'s unique Magic Number! 🎉 CONGRATULATIONS! YOU HAVE COMPLETED ALL 8 LEVELS OF THE SCHOOL OF AI TRADING ARCHITECTURE!',
        conceptTag: 'Multi-Bot Magic Number Tracking'
      }
    ]
  }
};

export function getQuizForLesson(lessonId: string): LessonQuiz | null {
  if (LESSON_QUIZZES[lessonId]) {
    return LESSON_QUIZZES[lessonId];
  }
  // Try normalizations: e.g. "lesson-2.1" -> "lesson-2-1"
  const normalized = lessonId.toLowerCase().replace('.', '-');
  if (LESSON_QUIZZES[normalized]) {
    return LESSON_QUIZZES[normalized];
  }
  // Match by lessonId field
  const found = Object.values(LESSON_QUIZZES).find(q => q.lessonId === lessonId || q.lessonId === normalized);
  if (found) return found;

  return null;
}
