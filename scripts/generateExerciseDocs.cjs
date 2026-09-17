const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function buildIndicatorPdf(outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true,
    });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Helpers
    const primaryColor = '#059669'; // Emerald
    const darkSlate = '#0f172a';
    const bodyColor = '#334155';
    const lightBg = '#f8fafc';
    const borderColor = '#cbd5e1';

    // Cover Page
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('AI-ASSISTED TRADING AUTOMATION', { align: 'left' });
    doc.moveDown(0.5);
    doc.fillColor(darkSlate).fontSize(26).font('Helvetica-Bold').text('From Trading Idea to MT5 Indicator');
    doc.moveDown(0.3);
    doc.fillColor('#64748b').fontSize(13).font('Helvetica-Oblique').text('A Practical, Step-by-Step Guide to Turning a Trading Idea Into Working MT5 Code Using AI');
    doc.moveDown(1);
    doc.strokeColor(borderColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(2);

    // Introduction
    doc.fillColor(darkSlate).fontSize(16).font('Helvetica-Bold').text('Introduction');
    doc.moveDown(0.5);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica').lineGap(3).text(
      'You do not need to be a programmer to start automating your trading strategy.\n\n' +
      'The first step is not writing code. The first step is explaining what you want to build.\n\n' +
      'AI can help you take a simple trading idea and turn it into a clear specification that a coding AI can understand. The process is simple:\n\n' +
      'IDEA → SPECIFICATION → CODING PROMPT → CODE → MT5 → TEST → IMPROVE\n\n' +
      'In this guide we use one worked example — an MT5 Average Daily Range (ADR) indicator — to demonstrate the full process from idea to finished tool. The goal here is not to teach you how ADR works as a trading concept. The goal is to show you how to take an idea from your head and use AI to turn it into a working MT5 indicator running live on an MT5 chart.'
    );
    doc.moveDown(1.5);

    // Part 1
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Part 1 — Start With the Idea');
    doc.moveDown(0.5);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica').text(
      "When you have an idea for an indicator or Expert Advisor, don't start by thinking about programming. Start by asking:\n\n" +
      '“What do I want this tool to do?”\n\n' +
      "You can explain your idea in normal language. You don't need to know MQL5. You don't need to know programming terminology. You simply describe what you want to see and how you want the tool to behave."
    );
    doc.moveDown(1);

    // Callout: Case study
    doc.rect(50, doc.y, 495, 80).fillAndStroke('#eff6ff', '#bfdbfe');
    doc.fillColor('#1e40af').fontSize(9).font('Helvetica-Bold').text('STEP 1 — YOUR ROUGH IDEA (GIVEN TO CHATGPT)', 60, doc.y - 70);
    doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text(
      'Create specifications for me to tell AI to build an MT5 ADR indicator that is based on X number of days. It\'s calculated from the opening price of the day to the high or low of the day, and it should draw dotted lines every day after market open, and when it\'s reached, it should give a notification, and it should also show the number of days used. I want a notification on screen when reached, and it should show the number of pips to reach the level. Make it clear and simple to understand.',
      60, doc.y + 4, { width: 475 }
    );
    doc.y += 35;
    doc.moveDown(1);

    // Part 2 - 5
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Part 2 — Let ChatGPT Help Structure the Idea');
    doc.moveDown(0.5);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica').text(
      'Now ChatGPT\'s job is to take your rough idea and turn it into a clearer specification. It can help identify things such as:\n' +
      '• What information the indicator needs from you.\n' +
      '• What it should calculate.\n' +
      '• What should appear on the chart.\n' +
      '• What should happen when a level is reached.\n' +
      '• What notifications are required.\n' +
      '• What information should be displayed to you.\n\n' +
      'This is where AI becomes your specification assistant. You are not asking it to decide your trading strategy — you are asking it to help you clearly describe your strategy or idea.'
    );
    doc.moveDown(1);

    doc.addPage();
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Part 3 & 4 — Review, Accept, Modify or Delete');
    doc.moveDown(0.5);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica').text(
      'This is one of the most important parts of the process. Do not automatically accept everything AI gives you. Read through the specification carefully and ask yourself:\n\n' +
      '“Is this actually what I want?”\n\n' +
      'When reviewing the AI response, you have three simple choices:\n' +
      '1. Accept: If AI understood your idea correctly, keep it.\n' +
      '2. Modify: If something is almost correct but needs to change, tell AI (e.g., "Change this so indicator uses 10 days instead of 5").\n' +
      '3. Delete: If AI added something you don\'t want, remove it (e.g., "Remove the historical chart display. I only want the current day\'s levels").'
    );
    doc.moveDown(1);

    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Part 5 & 6 — Finalize Specification & Coding Prompt');
    doc.moveDown(0.5);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica').text(
      'Once you have reviewed everything, you have a final specification. This becomes the blueprint for your indicator.\n\n' +
      'Now move to the next stage. Instead of taking your original rough request directly to a coding AI, use ChatGPT to prepare a proper coding prompt for Claude:\n\n' +
      'Prompt: "Now take this finalized specification and create a detailed coding prompt for Claude to build this MT5 indicator in MQL5."'
    );
    doc.moveDown(1);

    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('The 16-Step AI Automation Workflow');
    doc.moveDown(0.5);
    const steps = [
      '1. Idea: You have a trading idea.',
      '2. ChatGPT: Explain the idea in normal language.',
      '3. Brainstorm: ChatGPT helps turn idea into structured specification.',
      '4. Review: Read what AI created.',
      '5. Accept / Modify / Delete: Keep what is correct, remove what you don\'t want.',
      '6. Finalize: Create the final specification.',
      '7. Coding Prompt: Ask ChatGPT to turn specification into prompt for Claude.',
      '8. Review Prompt: Ensure Claude will understand exactly what to build.',
      '9. Claude: Give the prompt to Claude.',
      '10. MQL5 Code: Claude generates the code (see Appendix A).',
      '11. MT5 / MetaEditor: Put the code into MetaEditor.',
      '12. Compile: Check whether the code compiles.',
      '13. Debug: If errors, send exact compiler error text back to Claude.',
      '14. Test: Run indicator on live/demo chart in MT5.',
      '15. Validate: Compare actual behaviour with original specification.',
      '16. Improve: Make changes where necessary.'
    ];
    steps.forEach(s => {
      doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text(s);
      doc.moveDown(0.2);
    });

    doc.addPage();
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Three Golden Rules');
    doc.moveDown(0.5);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica-Bold').text('Rule 1 — Idea First, Code Last');
    doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text('Never start by asking AI to write code when you haven\'t clearly defined what you want. Start with the idea. Turn the idea into a specification. Then create the code.\n');
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica-Bold').text('Rule 2 — Don\'t Blindly Trust AI');
    doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text('AI can misunderstand you. AI can make assumptions. AI can add things you never requested. Always review the output. You are the decision-maker.\n');
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica-Bold').text('Rule 3 — Test the Behaviour');
    doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text('A green compilation message is not proof that your strategy has been automated correctly. Always test the actual result against your original idea.\n');
    doc.moveDown(1);

    // Appendix A Header
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Appendix A — Complete MQL5 Source Code: ADR_Levels.mq5');
    doc.moveDown(0.4);
    doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text('This is the complete MQL5 code generated for the ADR indicator case study. Copy and paste into MetaEditor as a Custom Indicator:');
    doc.moveDown(0.5);

    const code = `//+------------------------------------------------------------------+
//|                                                   ADR_Levels.mq5 |
//|                          Case Study: AI-Assisted Trading Automation |
//|       Average Daily Range (ADR) breakout-level indicator for MT5 |
//+------------------------------------------------------------------+
#property copyright "Case Study - AI-Assisted Trading Automation"
#property link      ""
#property version   "1.00"
#property indicator_chart_window
#property indicator_plots 0

//--- Input parameters ------------------------------------------------
input group "ADR Settings"
input int    InpADRDays         = 4;     // Number of previous completed days used for ADR
input double InpBufferPoints    = 0;     // Extra buffer added to each level (points)
input bool   InpShowDailyOpen   = true;  // Draw a line at today's opening price

input group "Notifications"
input bool   InpAlertPopup      = true;  // Show a terminal Alert() popup
input bool   InpAlertPush       = false; // Send a push notification to mobile
input bool   InpAlertSound      = true;  // Play a sound when a level is reached
input string InpAlertSoundFile  = "alert.wav";

input group "Appearance"
input color  InpColorHigh       = clrDeepSkyBlue;
input color  InpColorLow        = clrOrangeRed;
input color  InpColorOpen       = clrGray;
input color  InpColorHitHigh    = clrLime;
input color  InpColorHitLow     = clrRed;
input int    InpFontSize        = 9;
input int    InpLineWidth       = 1;

//--- Internal state ----------------------------------------------------
double   g_adrHighLevel = 0.0;
double   g_adrLowLevel  = 0.0;
double   g_todayOpen    = 0.0;
datetime g_todayStart   = 0;
bool     g_highReached  = false;
bool     g_lowReached   = false;
double   g_pointFactor  = 1.0;
string   g_prefix;

int OnInit()
{
   g_prefix = "ADR_" + _Symbol + "_";
   g_pointFactor = (_Digits == 3 || _Digits == 5) ? 10.0 : 1.0;
   CalculateADR();
   DrawLevels();
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   ObjectsDeleteAll(0, g_prefix);
   Comment("");
}

int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   datetime barDayStart = iTime(_Symbol, PERIOD_D1, 0);
   if(barDayStart != g_todayStart)
   {
      g_todayStart  = barDayStart;
      g_highReached = false;
      g_lowReached  = false;
      CalculateADR();
      DrawLevels();
   }
   UpdateLiveInfo();
   return(rates_total);
}

void CalculateADR()
{
   double sumUp = 0.0, sumDown = 0.0;
   int counted = 0;
   for(int i = 1; i <= InpADRDays; i++)
   {
      double dOpen = iOpen(_Symbol, PERIOD_D1, i);
      double dHigh = iHigh(_Symbol, PERIOD_D1, i);
      double dLow  = iLow(_Symbol, PERIOD_D1, i);
      if(dOpen == 0.0) continue;
      sumUp   += (dHigh - dOpen);
      sumDown += (dOpen - dLow);
      counted++;
   }
   if(counted == 0) return;
   double avgUp   = sumUp / counted;
   double avgDown = sumDown / counted;
   double buffer  = InpBufferPoints * _Point;

   g_todayOpen    = iOpen(_Symbol, PERIOD_D1, 0);
   g_adrHighLevel = g_todayOpen + avgUp + buffer;
   g_adrLowLevel  = g_todayOpen - avgDown - buffer;
}

void DrawLevels()
{
   datetime startTime = g_todayStart;
   datetime endTime   = startTime + PeriodSeconds(PERIOD_D1) * 2;
   DrawDottedLine(g_prefix + "High", startTime, endTime, g_adrHighLevel, InpColorHigh);
   DrawDottedLine(g_prefix + "Low",  startTime, endTime, g_adrLowLevel,  InpColorLow);
   if(InpShowDailyOpen)
      DrawDottedLine(g_prefix + "Open", startTime, endTime, g_todayOpen, InpColorOpen);
   UpdateLabel(g_prefix + "HighLabel", g_adrHighLevel, InpColorHigh,
      StringFormat("ADR HIGH (%d-day) %s", InpADRDays, DoubleToString(g_adrHighLevel, _Digits)));
   UpdateLabel(g_prefix + "LowLabel", g_adrLowLevel, InpColorLow,
      StringFormat("ADR LOW (%d-day) %s", InpADRDays, DoubleToString(g_adrLowLevel, _Digits)));
}

void DrawDottedLine(string name, datetime t1, datetime t2, double price, color clr)
{
   if(ObjectFind(0, name) < 0)
      ObjectCreate(0, name, OBJ_TREND, 0, t1, price, t2, price);
   else
      ObjectMove(0, name, 0, t1, price);
   ObjectSetInteger(0, name, OBJPROP_TIME, 1, t2);
   ObjectSetDouble(0, name, OBJPROP_PRICE, 1, price);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_DOT);
   ObjectSetInteger(0, name, OBJPROP_WIDTH, InpLineWidth);
   ObjectSetInteger(0, name, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

void UpdateLabel(string name, double price, color clr, string text)
{
   if(ObjectFind(0, name) < 0)
      ObjectCreate(0, name, OBJ_TEXT, 0, TimeCurrent(), price);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetInteger(0, name, OBJPROP_TIME, TimeCurrent());
   ObjectSetDouble(0, name, OBJPROP_PRICE, price);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, InpFontSize);
   ObjectSetInteger(0, name, OBJPROP_ANCHOR, ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

void UpdateLiveInfo()
{
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double pipsToHigh = (g_adrHighLevel - bid) / _Point / g_pointFactor;
   double pipsToLow  = (bid - g_adrLowLevel) / _Point / g_pointFactor;

   if(!g_highReached && bid >= g_adrHighLevel)
   {
      g_highReached = true;
      NotifyLevelReached("ADR HIGH", g_adrHighLevel);
      UpdateLabel(g_prefix + "HighLabel", g_adrHighLevel, InpColorHitHigh,
         StringFormat("ADR HIGH +%s pts - REACHED", DoubleToString((g_adrHighLevel - g_todayOpen) / _Point, 1)));
   }
   if(!g_lowReached && bid <= g_adrLowLevel)
   {
      g_lowReached = true;
      NotifyLevelReached("ADR LOW", g_adrLowLevel);
      UpdateLabel(g_prefix + "LowLabel", g_adrLowLevel, InpColorHitLow,
         StringFormat("ADR LOW -%s pts - REACHED", DoubleToString((g_todayOpen - g_adrLowLevel) / _Point, 1)));
   }

   string panel = StringFormat(
      "ADR (%d-Day) Indicator\\n" +
      "Daily Open : %s\\n" +
      "ADR High   : %s (%s)\\n" +
      "ADR Low    : %s (%s)\\n" +
      "Pips to High: %s\\n" +
      "Pips to Low : %s",
      InpADRDays,
      DoubleToString(g_todayOpen, _Digits),
      DoubleToString(g_adrHighLevel, _Digits), (g_highReached ? "REACHED" : "pending"),
      DoubleToString(g_adrLowLevel, _Digits), (g_lowReached ? "REACHED" : "pending"),
      (g_highReached ? "-" : DoubleToString(MathMax(pipsToHigh, 0), 1)),
      (g_lowReached ? "-" : DoubleToString(MathMax(pipsToLow, 0), 1))
   );
   Comment(panel);
}

void NotifyLevelReached(string levelName, double levelPrice)
{
   string msg = StringFormat("%s: %s level reached at %s (%s)",
      _Symbol, levelName, DoubleToString(levelPrice, _Digits),
      TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES));
   if(InpAlertPopup) Alert(msg);
   if(InpAlertPush)  SendNotification(msg);
   if(InpAlertSound) PlaySound(InpAlertSoundFile);
   Print(msg);
}`;

    doc.addPage();
    doc.fillColor('#0284c7').fontSize(11).font('Helvetica-Bold').text('Source Code Listing: ADR_Levels.mq5');
    doc.moveDown(0.3);
    doc.fillColor('#1e293b').fontSize(7.5).font('Courier').lineGap(1).text(code, { width: 495 });

    // Page numbers
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text(
        `AI-Assisted Trading Automation | From Trading Idea to MT5 Indicator — Page ${i + 1} of ${range.count}`,
        50, 790, { align: 'center', width: 495 }
      );
    }

    doc.end();
    stream.on('finish', () => resolve(true));
    stream.on('error', reject);
  });
}

function buildEaPdf(outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true,
    });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const primaryColor = '#059669';
    const darkSlate = '#0f172a';
    const bodyColor = '#334155';
    const borderColor = '#cbd5e1';

    // Cover Page
    doc.fillColor('#b45309').fontSize(11).font('Helvetica-Bold').text('ALGORITHMIC TRADING WITH AI — COURSE MATERIAL', { align: 'left' });
    doc.moveDown(0.5);
    doc.fillColor(darkSlate).fontSize(26).font('Helvetica-Bold').text('FROM TRADING IDEA TO MT5 EA WITH AI');
    doc.moveDown(0.3);
    doc.fillColor('#64748b').fontSize(13).font('Helvetica-Oblique').text('A Practical Step-by-Step Guide to Turning a Trading Idea Into a Working MT5 Expert Advisor');
    doc.moveDown(0.5);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica').text('How to use ChatGPT and Claude to transform a simple trading idea into an MT5 Expert Advisor — without writing the code yourself.');
    doc.moveDown(1);
    doc.fillColor('#0369a1').fontSize(9).font('Helvetica-Bold').text('PREPARED FOR LEARNERS\nWorked example: Previous-Day High/Low Breakout EA (MQL5)\nEdition — September 2026');
    doc.moveDown(1);
    doc.strokeColor(borderColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1.5);

    // Section 1: Introduction & Principle
    doc.fillColor(darkSlate).fontSize(15).font('Helvetica-Bold').text('1 INTRODUCTION');
    doc.moveDown(0.4);
    doc.fillColor(bodyColor).fontSize(10).font('Helvetica').lineGap(3).text(
      'You do not need to be an experienced programmer to begin turning your trading ideas into automated trading systems. Modern AI tools can help you move from an idea written in plain English to a working Expert Advisor (EA) for MetaTrader 5.\n\n' +
      'KEY PRINCIPLE: AI does not replace the thinking required to design a trading strategy. You still need to explain, precisely, what you want the robot to do.\n\n' +
      'The process taught in this guide is therefore not "ask AI to make me a trading robot." Instead, we follow a structured process:\n' +
      'Trading Idea → Specification → Review → Coding Prompt → MQL5 Code → MetaEditor → Compilation → Backtest → Verification'
    );
    doc.moveDown(1);

    // Section 2: Roles
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('2 THE AI TRADING ROBOT WORKFLOW');
    doc.moveDown(0.4);
    doc.fillColor(bodyColor).fontSize(9.5).font('Helvetica').text(
      '• ChatGPT — the strategy partner: developing the idea, asking clarifying questions, turning idea into technical specification, creating coding prompt for Claude.\n' +
      '• Claude — the coding partner: turning specification into MQL5 code, producing the complete EA, fixing compilation errors, producing fresh complete code versions.\n' +
      '• MetaEditor — the build environment: where we create the EA file, paste MQL5 code, compile it, and identify compiler errors.\n' +
      '• MT5 Strategy Tester — the proving ground: run EA against historical tick data, verify trade logic, and examine drawdown/execution.'
    );
    doc.moveDown(1);

    doc.addPage();
    // Strategy Design Phase
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('3 PHASE 1 — STRATEGY DESIGN: WORKED EXAMPLE');
    doc.moveDown(0.4);
    doc.fillColor(bodyColor).fontSize(9.5).font('Helvetica').text(
      'Our worked example is the Previous-Day High/Low Breakout EA:\n\n' +
      '1. At the beginning of each trading day, identify yesterday\'s High and Low from completed D1 bar.\n' +
      '2. Buy when price genuinely crosses above yesterday\'s High.\n' +
      '3. Sell when price genuinely crosses below yesterday\'s Low.\n' +
      '4. Use fixed-pip Stop Loss and Take Profit.\n' +
      '5. Allow configurable number of trades per direction per day (e.g., max 3 Buys, max 3 Sells).\n' +
      '6. Allow Buy and Sell trades independently of one another.\n' +
      '7. Filter trades by maximum allowable spread.\n' +
      '8. Enter immediately upon crossing the level (no candle-close delay).\n' +
      '9. Reset levels, baseline, and counters at broker 00:00.'
    );
    doc.moveDown(1);

    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('4 & 5 PHASES 2 & 3 — CODING & METAEDITOR COMPILATION');
    doc.moveDown(0.4);
    doc.fillColor(bodyColor).fontSize(9.5).font('Helvetica').text(
      '1. Request complete code from Claude using structured prompt.\n' +
      '2. In MetaEditor: Tools → MetaQuotes Language Editor → File → New → Expert Advisor (template).\n' +
      '3. Name file PrevDayBreakoutEA.mq5, delete template code, paste Claude\'s code, press Compile (F7).\n' +
      '4. Goal: "0 errors, 0 warnings" in MetaEditor Errors tab.'
    );
    doc.moveDown(1);

    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('6 & 7 PHASES 4 & 5 — DEBUGGING & STRATEGY TESTER');
    doc.moveDown(0.4);
    doc.fillColor(bodyColor).fontSize(9.5).font('Helvetica').text(
      'If errors occur, never guess. Copy the full compiler error message, return to Claude, and prompt:\n' +
      '"The EA does not compile in MetaEditor. Here are the compilation errors: [paste errors]. Please fix all errors and provide the complete fresh MQL5 code."\n\n' +
      'Once compiled with 0 errors, open MT5 Strategy Tester (Ctrl+R / View → Strategy Tester):\n' +
      '• Select PrevDayBreakoutEA.ex5\n' +
      '• Select Symbol (e.g. EURUSD, GBPUSD)\n' +
      '• Timeframe: H1 (or your choice)\n' +
      '• Enable Visual Mode to inspect trades step by step on chart.'
    );
    doc.moveDown(1);

    // Checklist
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Final Verification Checklist');
    doc.moveDown(0.4);
    const checklist = [
      '[ ] Is the trading idea clearly defined in plain English?',
      '[ ] Did ChatGPT turn the idea into a detailed specification with SL/TP/limits?',
      '[ ] Did you personally review, modify, or approve the specification?',
      '[ ] Did Claude generate the complete, compilable MQL5 source code?',
      '[ ] Does MetaEditor compile with 0 errors?',
      '[ ] Does the EA open trades only upon genuine breakout crossing?',
      '[ ] Are Stop Loss and Take Profit placed at exact pip distances?',
      '[ ] Does the daily trade counter reset properly on a new trading day?'
    ];
    checklist.forEach(item => {
      doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text(item);
      doc.moveDown(0.2);
    });

    // Appendix A Header
    doc.addPage();
    doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('Appendix A — Complete MQL5 Source Code: PrevDayBreakoutEA.mq5');
    doc.moveDown(0.3);
    doc.fillColor(bodyColor).fontSize(8.5).font('Helvetica').text('This is the complete, working MQL5 Expert Advisor implementing the Previous-Day High/Low Breakout strategy. Ready to compile directly in MetaEditor:');
    doc.moveDown(0.5);

    const eaCode = `//+------------------------------------------------------------------+
//|                                           PrevDayBreakoutEA.mq5 |
//|                     Previous Day High/Low Breakout Expert Advisor |
//|                                                                  |
//| Strategy:                                                        |
//| - At start of each broker day, read completed previous D1 candle |
//|   and store High/Low as fixed breakout levels for current day.   |
//| - Open a BUY the instant price crosses above Previous Day High.   |
//| - Open a SELL the instant price crosses below Previous Day Low.  |
//| - Independent configurable max trades per direction per day.     |
//| - Fixed pip SL/TP, fixed lot size, max spread filter.            |
//+------------------------------------------------------------------+
#property copyright "Generated EA"
#property version   "1.00"
#property strict

#include <Trade\\Trade.mqh>

//====================================================================
// INPUTS
//====================================================================
input double LotSize              = 0.10;     // Fixed lot size
input int    MaxBuyTradesPerDay   = 3;        // Max BUY trades per day
input int    MaxSellTradesPerDay  = 3;        // Max SELL trades per day
input double StopLossPips         = 20;       // Stop Loss in pips
input double TakeProfitPips       = 40;       // Take Profit in pips
input double MaxSpreadPips        = 3.0;      // Max allowed spread in pips
input long   MagicNumber          = 20260917; // Unique magic number

//====================================================================
// GLOBALS
//====================================================================
CTrade   g_trade;
double   g_pipSize = 0.0;
double   g_point   = 0.0;
int      g_digits  = 0;
datetime g_currentDayStart = 0;
double   g_prevDayHigh = 0.0;
double   g_prevDayLow  = 0.0;
int      g_buyCountToday  = 0;
int      g_sellCountToday = 0;
double   g_prevBid = 0.0;
double   g_prevAsk = 0.0;
bool     g_priceBaselineSet = false;
string   g_objPrefix = "";
string   g_statusText = "Initializing";

double CalcPipSize()
{
   int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   if(digits == 3 || digits == 5) return point * 10.0;
   return point;
}

datetime DayStart(datetime t)
{
   MqlDateTime mt;
   TimeToStruct(t, mt);
   mt.hour = 0; mt.min = 0; mt.sec = 0;
   return StructToTime(mt);
}

double ValidateLot(double lots)
{
   double minLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   if(lotStep <= 0.0) lotStep = 0.01;
   double steps = MathRound(lots / lotStep);
   double normalized = steps * lotStep;
   if(normalized < minLot) normalized = minLot;
   if(normalized > maxLot) normalized = maxLot;
   return NormalizeDouble(normalized, 2);
}

double GetSpreadPips()
{
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   if(g_pipSize <= 0.0) return 0.0;
   return (ask - bid) / g_pipSize;
}

void RecalculateDailyCounts()
{
   g_buyCountToday = 0;
   g_sellCountToday = 0;
   datetime fromTime = g_currentDayStart;
   datetime toTime   = TimeTradeServer() + 60;
   if(!HistorySelect(fromTime, toTime)) return;
   int total = HistoryDealsTotal();
   for(int i = 0; i < total; i++)
   {
      ulong dealTicket = HistoryDealGetTicket(i);
      if(dealTicket == 0) continue;
      if(HistoryDealGetInteger(dealTicket, DEAL_MAGIC) != MagicNumber) continue;
      if(HistoryDealGetString(dealTicket, DEAL_SYMBOL) != _Symbol) continue;
      if(HistoryDealGetInteger(dealTicket, DEAL_ENTRY) != DEAL_ENTRY_IN) continue;
      if((datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME) < g_currentDayStart) continue;

      long dealType = HistoryDealGetInteger(dealTicket, DEAL_TYPE);
      if(dealType == DEAL_TYPE_BUY)       g_buyCountToday++;
      else if(dealType == DEAL_TYPE_SELL) g_sellCountToday++;
   }
}

bool LoadPreviousDayLevels()
{
   double highs[], lows[];
   ArraySetAsSeries(highs, true);
   ArraySetAsSeries(lows, true);
   if(Bars(_Symbol, PERIOD_D1) < 2) return false;
   if(CopyHigh(_Symbol, PERIOD_D1, 1, 1, highs) <= 0) return false;
   if(CopyLow(_Symbol,  PERIOD_D1, 1, 1, lows)  <= 0) return false;
   g_prevDayHigh = highs[0];
   g_prevDayLow  = lows[0];
   return true;
}

void CheckNewDay()
{
   datetime todayStart = DayStart(TimeTradeServer());
   if(todayStart == g_currentDayStart && g_currentDayStart != 0) return;
   g_currentDayStart = todayStart;
   if(!LoadPreviousDayLevels()) { g_statusText = "Waiting for D1 data"; return; }
   RecalculateDailyCounts();
   g_priceBaselineSet = false;
   g_statusText = "Running";
}

void OpenBuyTrade(double entryPrice)
{
   double lots = ValidateLot(LotSize);
   double sl = (StopLossPips > 0)   ? NormalizeDouble(entryPrice - StopLossPips * g_pipSize, g_digits) : 0.0;
   double tp = (TakeProfitPips > 0) ? NormalizeDouble(entryPrice + TakeProfitPips * g_pipSize, g_digits) : 0.0;
   g_trade.SetExpertMagicNumber(MagicNumber);
   if(g_trade.Buy(lots, _Symbol, 0.0, sl, tp, "PrevDayBreakout-Buy"))
      g_buyCountToday++;
}

void OpenSellTrade(double entryPrice)
{
   double lots = ValidateLot(LotSize);
   double sl = (StopLossPips > 0)   ? NormalizeDouble(entryPrice + StopLossPips * g_pipSize, g_digits) : 0.0;
   double tp = (TakeProfitPips > 0) ? NormalizeDouble(entryPrice - TakeProfitPips * g_pipSize, g_digits) : 0.0;
   g_trade.SetExpertMagicNumber(MagicNumber);
   if(g_trade.Sell(lots, _Symbol, 0.0, sl, tp, "PrevDayBreakout-Sell"))
      g_sellCountToday++;
}

void CheckBreakouts()
{
   if(g_prevDayHigh <= 0.0 || g_prevDayLow <= 0.0) return;
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   if(bid <= 0.0 || ask <= 0.0) return;

   if(!g_priceBaselineSet)
   {
      g_prevBid = bid;
      g_prevAsk = ask;
      g_priceBaselineSet = true;
      return;
   }

   bool spreadOk = (GetSpreadPips() <= MaxSpreadPips);
   bool buyCross  = (g_prevAsk <= g_prevDayHigh && ask > g_prevDayHigh);
   bool sellCross = (g_prevBid >= g_prevDayLow  && bid < g_prevDayLow);

   if(buyCross && g_buyCountToday < MaxBuyTradesPerDay && spreadOk)
      OpenBuyTrade(ask);

   if(sellCross && g_sellCountToday < MaxSellTradesPerDay && spreadOk)
      OpenSellTrade(bid);

   g_prevBid = bid;
   g_prevAsk = ask;
}

int OnInit()
{
   g_digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   g_point  = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   g_pipSize = CalcPipSize();
   g_objPrefix = "PDBO_" + IntegerToString(MagicNumber) + "_";
   g_trade.SetExpertMagicNumber(MagicNumber);
   g_trade.SetDeviationInPoints(10);
   g_trade.SetTypeFilling(ORDER_FILLING_FOK);

   if(LotSize <= 0.0) return(INIT_PARAMETERS_INCORRECT);
   g_currentDayStart = 0;
   g_priceBaselineSet = false;
   CheckNewDay();
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) {}

void OnTick()
{
   CheckNewDay();
   CheckBreakouts();
}`;

    doc.fillColor('#1e293b').fontSize(7.5).font('Courier').lineGap(1).text(eaCode, { width: 495 });

    // Page numbers
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text(
        `Algorithmic Trading with AI | PrevDayBreakoutEA — Page ${i + 1} of ${range.count}`,
        50, 790, { align: 'center', width: 495 }
      );
    }

    doc.end();
    stream.on('finish', () => resolve(true));
    stream.on('error', reject);
  });
}

async function run() {
  const p1 = path.join(__dirname, '..', 'public', 'downloads', 'From_Trading_Idea_to_MT5_Indicator_Guide.pdf');
  const p2 = path.join(__dirname, '..', 'public', 'downloads', 'From_Trading_Idea_to_MT5_EA_Guide.pdf');

  console.log('Generating Indicator PDF...');
  await buildIndicatorPdf(p1);
  console.log('Generating EA PDF...');
  await buildEaPdf(p2);
  console.log('Both PDFs generated successfully in public/downloads!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
