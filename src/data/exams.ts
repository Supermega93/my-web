export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
  levelOrigin: string;
}

export interface MasterExam {
  id: string;
  title: string;
  subtitle: string;
  levelRange: string;
  tier: 'free' | 'paid';
  associatedLessonId: string;
  passingScorePercent: number;
  certificateTitle: string;
  questions: ExamQuestion[];
}

// Dedicated Master Examination for Foundational Architecture (Levels 1–3)
// Kept strictly separate from individual lesson practice quizzes
export const LEVEL1_3_MASTER_EXAM: MasterExam = {
  id: 'master-exam-level-1-3',
  title: 'Level 1–3 Master Examination: Foundational AI Architecture',
  subtitle: 'Official 10-Question Comprehensive Assessment across Preschool, Kindergarten, and Elementary',
  levelRange: 'Levels 1–3 (Preschool to Elementary)',
  tier: 'free',
  associatedLessonId: 'lesson-3-bonus',
  passingScorePercent: 80,
  certificateTitle: 'Certified Junior Strategy Architect (Foundations)',
  questions: [
    {
      id: 'me-1',
      question: 'What happens if you give an AI coding assistant a vague prompt such as "build me a trading bot that buys breakouts"?',
      options: [
        'A) The AI will pause and ask you 10 clarifying questions about your risk and timeframe.',
        'B) The AI will refuse to write code until you upload a computer science degree.',
        'C) The AI will not ask clarifying questions; it will simply guess parameters, risking your capital.',
        'D) The AI will automatically connect to your broker and run a backtest.'
      ],
      correctIndex: 2,
      explanation: 'Correct Answer: C! AI models do not ask clarifying questions when prompts are ambiguous. They fill in missing information by guessing parameters, which leads to unaligned rules and losing code.',
      conceptTag: 'Vague Prompts vs. Literal Machine',
      levelOrigin: 'Level 1: Preschool'
    },
    {
      id: 'me-2',
      question: 'Which of the following represents a strict "Machine Fact" that an AI can code without guessing?',
      options: [
        'A) "Buy when EURUSD looks oversold and ready to bounce."',
        'B) "Enter a Buy order when the 10 EMA crosses above the 50 EMA and candle 1 closes green."',
        'C) "Place a safe, sensible stop loss based on market feel."',
        'D) "Buy whenever the market is trending strongly upward."'
      ],
      correctIndex: 1,
      explanation: 'Correct Answer: B! Option B removes all human subjectivity by specifying exact moving average periods, timeframe, crossover logic, and candle positions. Options A, C, and D contain subjective "guru words" like "oversold," "safe," and "trending strongly".',
      conceptTag: 'Machine Facts vs. Eyeball Rules',
      levelOrigin: 'Level 1: Preschool'
    },
    {
      id: 'me-3',
      question: 'What is an "AI Hallucination" in MQL5 development?',
      options: [
        'A) When an AI model invents a fake code command or function that does not exist in MQL5.',
        'B) When MetaTrader 5 displays colored candlestick patterns on the chart.',
        'C) When a trading robot makes a winning trade during news events.',
        'D) When an AI model refuses to generate code due to copyright rules.'
      ],
      correctIndex: 0,
      explanation: 'Correct Answer: A! AI models are "people-pleasers". When they encounter a gap in their training data regarding MQL5 syntax, they invent non-existent functions that cause compiler errors.',
      conceptTag: 'AI Hallucinations & Safety Protocols',
      levelOrigin: 'Level 1: Preschool'
    },
    {
      id: 'me-4',
      question: 'You want to create a user setting in your EA that allows traders to turn a News Filter ON or OFF. Which type of variable (labelled box) must the AI use?',
      options: [
        'A) int (Whole Number Box)',
        'B) double (Precision Decimal Box)',
        'C) bool (Light Switch Box holding true or false)',
        'D) string (Sticky Note Box)'
      ],
      correctIndex: 2,
      explanation: 'Correct Answer: C! A bool (Boolean) variable acts like a light switch, holding strictly true (ON) or false (OFF), making it ideal for feature toggles like filters.',
      conceptTag: 'Variables & Data Types',
      levelOrigin: 'Level 2: Kindergarten'
    },
    {
      id: 'me-5',
      question: 'In decision checklists (conditions), what is the primary difference between an AND guard and an OR guard?',
      options: [
        'A) AND requires all conditions to be true; OR executes if any single condition is true.',
        'B) AND works only on daily charts; OR works on 1-minute charts.',
        'C) AND is used for lot sizing; OR is used for trade comments.',
        'D) AND causes the computer to crash if a rule fails.'
      ],
      correctIndex: 0,
      explanation: 'Correct Answer: A! The AND operator requires every condition on the checklist to evaluate to true before proceeding. The OR operator executes if any single condition evaluates to true.',
      conceptTag: 'Decision Checklists & Logic Guards',
      levelOrigin: 'Level 2: Kindergarten'
    },
    {
      id: 'me-6',
      question: 'In our kitchen appliance analogy for programming functions, what represent the "Parameters"?',
      options: [
        'A) The electricity bill paid at the end of the month.',
        'B) The raw input ingredients fed into the function so it can calculate a result.',
        'C) The error messages displayed in MetaTrader.',
        'D) The speed at which the CPU processes ticks.'
      ],
      correctIndex: 1,
      explanation: 'Correct Answer: B! In a modular function (kitchen appliance), parameters are the raw input ingredients (e.g., account equity, risk %, stop loss pips) passed into the function so it can calculate and return an output.',
      conceptTag: 'Modular Functions & Inputs',
      levelOrigin: 'Level 2: Kindergarten'
    },
    {
      id: 'me-7',
      question: 'You want to build a tool that calculates Average Daily Range and draws custom support lines on your chart, but you want to guarantee it can NEVER accidentally place a trade. Which program type should you specify?',
      options: [
        'A) Expert Advisor (EA)',
        'B) Custom Indicator',
        'C) Service',
        'D) Library'
      ],
      correctIndex: 1,
      explanation: 'Correct Answer: B! Custom Indicators calculate and display visual elements on chart buffers, but they are hard-coded in MQL5 to be incapable of sending trade orders. EAs can execute trades, making indicators the safer choice for visual-only tools.',
      conceptTag: 'MQL5 Program Types',
      levelOrigin: 'Level 3: Elementary'
    },
    {
      id: 'me-8',
      question: 'Where should one-time startup code (such as loading indicator handles and validating user risk settings) be placed inside an Expert Advisor?',
      options: [
        'A) Inside OnTick(), so it recalculates on every price movement.',
        'B) Inside OnInit(), so it executes cleanly once when attached to the chart.',
        'C) Inside OnDeinit(), right as the bot is removed from the chart.',
        'D) Inside an external text file on your desktop.'
      ],
      correctIndex: 1,
      explanation: 'Correct Answer: B! OnInit() is the event handler that executes exactly once when an EA is loaded onto a chart, making it the correct location for startup and preparation tasks.',
      conceptTag: 'EA Lifecycle & OnInit()',
      levelOrigin: 'Level 3: Elementary'
    },
    {
      id: 'me-9',
      question: 'What happens if an AI puts indicator handle initialization inside OnTick() instead of OnInit()?',
      options: [
        'A) The EA trades twice as fast.',
        'B) The EA re-initializes memory on every price tick, causing platform lag and potential execution bugs.',
        'C) MetaTrader 5 automatically deletes the currency pair chart.',
        'D) The broker doubles your leverage.'
      ],
      correctIndex: 1,
      explanation: 'Correct Answer: B! OnTick() executes every time a new price tick arrives (often multiple times per second). Placing setup or handle allocation logic inside OnTick() forces memory allocation on every tick, causing memory leaks and platform freezing.',
      conceptTag: 'Critical AI Bug Patterns',
      levelOrigin: 'Level 3: Elementary'
    },
    {
      id: 'me-10',
      question: 'Which module of the 4 Lego Blocks Architecture is responsible for checking spread limits, trading hours, and new candle rules to tell the robot when NOT to trade?',
      options: [
        'A) 🧠 Block 1: The Brain',
        'B) 🛡️ Block 2: The Shield',
        'C) 👓 Block 3: The Glasses',
        'D) 🖐️ Block 4: The Hands'
      ],
      correctIndex: 2,
      explanation: 'Correct Answer: C! 👓 The Glasses (Block 3) scan market conditions (spread, session hours, news, new bar checks) to act as execution guards, instructing the bot when market conditions are unfavorable for trading.',
      conceptTag: 'The 4 Lego Blocks Architecture',
      levelOrigin: 'Level 3: Elementary'
    }
  ]
};

export const MASTER_EXAMS: Record<string, MasterExam> = {
  [LEVEL1_3_MASTER_EXAM.id]: LEVEL1_3_MASTER_EXAM,
  'lesson-3-bonus': LEVEL1_3_MASTER_EXAM
};

export function getMasterExamForLesson(lessonId: string): MasterExam | null {
  if (MASTER_EXAMS[lessonId]) {
    return MASTER_EXAMS[lessonId];
  }
  const found = Object.values(MASTER_EXAMS).find(e => e.associatedLessonId === lessonId);
  return found || null;
}
