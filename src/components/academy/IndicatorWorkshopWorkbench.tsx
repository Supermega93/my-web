import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  RotateCcw, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Lightbulb, 
  Code2, 
  Laptop, 
  FileText, 
  ArrowRight, 
  AlertTriangle,
  Award,
  Layers,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface IndicatorWorkshopWorkbenchProps {
  onComplete: () => void;
  isCompleted: boolean;
  onNavigateToMasterclass?: () => void;
}

export function IndicatorWorkshopWorkbench({
  onComplete,
  isCompleted,
  onNavigateToMasterclass
}: IndicatorWorkshopWorkbenchProps) {
  // Active step in the 8-step workflow
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Checkpoints completed state
  const [completedSteps, setCompletedSteps] = useState<number[]>(isCompleted ? [1, 2, 3, 4, 5, 6, 7, 8] : [1]);

  // Interactive step 3: Accept / Modify / Delete simulation states
  const [adrDays, setAdrDays] = useState<number>(10);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [enableAlerts, setEnableAlerts] = useState<boolean>(true);

  // Interactive step 7: MT5 Chart Simulator states
  const [simPrice, setSimPrice] = useState<number>(1.08850);
  const [highReached, setHighReached] = useState<boolean>(false);
  const [lowReached, setLowReached] = useState<boolean>(false);
  const [alertTriggered, setAlertTriggered] = useState<string | null>(null);
  const [simulatedCandles, setSimulatedCandles] = useState<Array<{ open: number; high: number; low: number; close: number; color: 'bull' | 'bear' }>>([
    { open: 1.08500, high: 1.08720, low: 1.08480, close: 1.08680, color: 'bull' },
    { open: 1.08680, high: 1.08840, low: 1.08610, close: 1.08790, color: 'bull' },
    { open: 1.08790, high: 1.08910, low: 1.08700, close: 1.08850, color: 'bull' },
  ]);

  // Base facts for simulation
  const dailyOpen = 1.08500;
  const adrPips = adrDays === 10 ? 85.0 : 70.0;
  const adrOffset = adrPips * 0.0001;
  const adrHigh = dailyOpen + adrOffset;
  const adrLow = dailyOpen - adrOffset;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const markStepDone = (stepNum: number) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps((prev) => [...prev, stepNum]);
    }
    if (stepNum < 8) {
      setActiveStep(stepNum + 1);
    }
  };

  // Chart simulation actions
  const handleSimulateBullish = () => {
    const newPrice = Number((simPrice + 0.0025).toFixed(5));
    setSimPrice(newPrice);
    setSimulatedCandles((prev) => [
      ...prev,
      { open: simPrice, high: Math.max(simPrice, newPrice) + 0.0008, low: simPrice - 0.0004, close: newPrice, color: 'bull' }
    ]);
    if (newPrice >= adrHigh && !highReached) {
      setHighReached(true);
      if (enableAlerts) {
        setAlertTriggered(`🔔 ALERT: EURUSD ADR High (${adrHigh.toFixed(5)}) REACHED! (+${adrPips} pips)`);
      }
    }
  };

  const handleSimulateBreakHigh = () => {
    const targetPrice = Number((adrHigh + 0.0008).toFixed(5));
    setSimPrice(targetPrice);
    setSimulatedCandles((prev) => [
      ...prev,
      { open: simPrice, high: targetPrice + 0.0005, low: simPrice - 0.0003, close: targetPrice, color: 'bull' }
    ]);
    setHighReached(true);
    if (enableAlerts) {
      setAlertTriggered(`🔔 ALERT: EURUSD ADR High (${adrHigh.toFixed(5)}) REACHED! Target hit on chart.`);
    }
  };

  const handleSimulateBearish = () => {
    const newPrice = Number((simPrice - 0.0030).toFixed(5));
    setSimPrice(newPrice);
    setSimulatedCandles((prev) => [
      ...prev,
      { open: simPrice, high: simPrice + 0.0004, low: Math.min(simPrice, newPrice) - 0.0006, close: newPrice, color: 'bear' }
    ]);
    if (newPrice <= adrLow && !lowReached) {
      setLowReached(true);
      if (enableAlerts) {
        setAlertTriggered(`🔔 ALERT: EURUSD ADR Low (${adrLow.toFixed(5)}) REACHED! (-${adrPips} pips)`);
      }
    }
  };

  const handleSimulateBreakLow = () => {
    const targetPrice = Number((adrLow - 0.0008).toFixed(5));
    setSimPrice(targetPrice);
    setSimulatedCandles((prev) => [
      ...prev,
      { open: simPrice, high: simPrice + 0.0003, low: targetPrice - 0.0005, close: targetPrice, color: 'bear' }
    ]);
    setLowReached(true);
    if (enableAlerts) {
      setAlertTriggered(`🔔 ALERT: EURUSD ADR Low (${adrLow.toFixed(5)}) REACHED! Target hit on chart.`);
    }
  };

  const handleResetSimulation = () => {
    setSimPrice(1.08850);
    setHighReached(false);
    setLowReached(false);
    setAlertTriggered(null);
    setSimulatedCandles([
      { open: 1.08500, high: 1.08720, low: 1.08480, close: 1.08680, color: 'bull' },
      { open: 1.08680, high: 1.08840, low: 1.08610, close: 1.08790, color: 'bull' },
      { open: 1.08790, high: 1.08910, low: 1.08700, close: 1.08850, color: 'bull' },
    ]);
  };

  const pipsToHigh = Math.max(0, ((adrHigh - simPrice) / 0.0001)).toFixed(1);
  const pipsToLow = Math.max(0, ((simPrice - adrLow) / 0.0001)).toFixed(1);

  const ROUGH_IDEA_PROMPT = `Create specifications for me to tell AI to build an MT5 ADR indicator that is based on X number of days. It's calculated from the opening price of the day to the high or low of the day, and it should draw dotted lines every day after market open, and when it's reached, it should give a notification, and it should also show the number of days used. I want a notification on screen when reached, and it should show the number of pips to reach the level. Make it clear and simple to understand.`;

  const BRIDGE_PROMPT = `Now take this finalized specification and create a detailed coding prompt for Claude to build this MT5 indicator in MQL5.`;

  const CLAUDE_CODING_PROMPT = `ROLE: Senior MQL5 Indicator Software Architect for MetaTrader 5.

CONTEXT: I need a clean, compilable MT5 Custom Indicator (.mq5) that calculates and displays Average Daily Range (ADR) breakout levels from the Daily Open.

SPECIFICATION:
1. Program Type: Custom Indicator (.mq5), indicator_chart_window, 0 plot buffers (uses graphical line and text objects).
2. Inputs:
   - InpADRDays = 10 (int, number of previous completed daily candles to calculate ADR)
   - InpColorHigh = clrDodgerBlue (color, ADR High line color)
   - InpColorLow = clrCrimson (color, ADR Low line color)
   - InpColorOpen = clrGoldenrod (color, Daily Open line color)
   - InpEnableAlerts = true (bool, audio and popup notification)
3. Calculation Logic:
   - Retrieve the last InpADRDays completed daily bars (from bar index 1 to InpADRDays).
   - ADR = Sum of (High[i] - Low[i]) / InpADRDays.
   - Day Open = iOpen(_Symbol, PERIOD_D1, 0).
   - ADR High Level = Day Open + ADR.
   - ADR Low Level = Day Open - ADR.
4. Chart Visuals:
   - Draw a solid horizontal line for Daily Open.
   - Draw a dotted horizontal line (STYLE_DOT) for ADR High Level.
   - Draw a dotted horizontal line (STYLE_DOT) for ADR Low Level.
   - Display an on-chart information panel showing:
     * Number of ADR days used
     * Daily Open price
     * ADR High price, remaining pips, and REACHED status
     * ADR Low price, remaining pips, and REACHED status
5. Alerts:
   - When Bid >= ADR High Level, send on-screen alert once per day.
   - When Bid <= ADR Low Level, send on-screen alert once per day.
   - Do NOT spam alert on every tick.
6. Memory Management:
   - Delete all created chart objects cleanly in OnDeinit().

FORMAT: Output complete, self-contained, error-free MQL5 code ready to compile in MetaEditor.`;

  const DEBUG_PROMPT_TEMPLATE = `MetaEditor produced the following error(s). Please fix them and provide the complete corrected MQL5 code:
[Paste your exact compiler error from the Errors tab here]`;

  const IMPROVEMENT_PROMPT = `The indicator is working, but the notification is appearing multiple times. I only want one notification when the level is reached during the day. Please modify the code to store a boolean flag that resets only when a new day opens.`;

  const MQL5_CODE = `//+------------------------------------------------------------------+
//|                                                   ADR_Levels.mq5 |
//|                                  Copyright 2025, Strategy Architect |
//|                                     https://school.strategyarchitect |
//+------------------------------------------------------------------+
#property copyright "Strategy Architect"
#property link      "https://school.strategyarchitect"
#property version   "1.00"
#property indicator_chart_window
#property indicator_plots 0

//--- Input Parameters
input group "=== ADR Calculation Settings ==="
input int      InpADRDays       = 10;            // Number of Days for ADR
input group "=== Visual Settings ==="
input color    InpColorHigh     = clrDodgerBlue; // ADR High Line Color
input color    InpColorLow      = clrCrimson;    // ADR Low Line Color
input color    InpColorOpen     = clrGoldenrod;  // Daily Open Line Color
input int      InpLineWidth     = 1;             // Line Width
input group "=== Alert Settings ==="
input bool     InpEnableAlerts  = true;          // Enable Notifications
input bool     InpPushAlerts    = false;         // Send Push Notifications

//--- Global Variables
double   g_adr          = 0.0;
double   g_dayOpen      = 0.0;
double   g_adrHigh      = 0.0;
double   g_adrLow       = 0.0;
datetime g_currentDay   = 0;
bool     g_highNotified = false;
bool     g_lowNotified  = false;
string   g_prefix       = "ADR_Ind_";

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
{
   if(InpADRDays <= 0)
   {
      Print("[ADR Indicator] Error: ADR Days must be greater than 0.");
      return(INIT_PARAMETERS_FAIL);
   }

   g_currentDay   = 0;
   g_highNotified = false;
   g_lowNotified  = false;

   // Initial calculation
   CalculateADR();

   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Custom indicator deinitialization function                       |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   // Clean up all graphical objects created by this indicator
   ObjectsDeleteAll(0, g_prefix);
   Comment("");
}

//+------------------------------------------------------------------+
//| Custom indicator iteration function                              |
//+------------------------------------------------------------------+
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
   // Check if a new day has started
   datetime todayOpenTime = iTime(_Symbol, PERIOD_D1, 0);

   if(todayOpenTime != g_currentDay)
   {
      g_currentDay   = todayOpenTime;
      g_highNotified = false;
      g_lowNotified  = false;

      // Recalculate ADR and new daily levels
      CalculateADR();
      DrawLevels();
   }

   // Update live status and check alert triggers on every tick
   UpdateLiveInfo();
   CheckAlerts();

   return(rates_total);
}

//+------------------------------------------------------------------+
//| Calculate the Average Daily Range over specified completed days  |
//+------------------------------------------------------------------+
void CalculateADR()
{
   double totalRange = 0.0;
   int validDays = 0;

   // Loop through completed days (index 1 to InpADRDays)
   for(int i = 1; i <= InpADRDays; i++)
   {
      double dHigh = iHigh(_Symbol, PERIOD_D1, i);
      double dLow  = iLow(_Symbol, PERIOD_D1, i);

      if(dHigh > 0 && dLow > 0)
      {
         totalRange += (dHigh - dLow);
         validDays++;
      }
   }

   if(validDays > 0)
      g_adr = totalRange / validDays;
   else
      g_adr = 0.0;

   // Get today's opening price
   g_dayOpen = iOpen(_Symbol, PERIOD_D1, 0);

   // Calculate key ADR breakout levels
   g_adrHigh = g_dayOpen + g_adr;
   g_adrLow  = g_dayOpen - g_adr;
}

//+------------------------------------------------------------------+
//| Draw visual horizontal level lines on the chart                  |
//+------------------------------------------------------------------+
void DrawLevels()
{
   // Draw Daily Open Line
   CreateOrUpdateLine(g_prefix + "DayOpen", g_dayOpen, InpColorOpen, STYLE_SOLID, InpLineWidth, "Daily Open");

   // Draw ADR High Dotted Line
   CreateOrUpdateLine(g_prefix + "ADRHigh", g_adrHigh, InpColorHigh, STYLE_DOT, InpLineWidth, "ADR High");

   // Draw ADR Low Dotted Line
   CreateOrUpdateLine(g_prefix + "ADRLow", g_adrLow, InpColorLow, STYLE_DOT, InpLineWidth, "ADR Low");
}

//+------------------------------------------------------------------+
//| Helper to create or move a horizontal chart line                 |
//+------------------------------------------------------------------+
void CreateOrUpdateLine(string name, double price, color clr, ENUM_LINE_STYLE style, int width, string tooltip)
{
   if(ObjectFind(0, name) < 0)
   {
      ObjectCreate(0, name, OBJ_HLINE, 0, 0, price);
      ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
      ObjectSetInteger(0, name, OBJPROP_STYLE, style);
      ObjectSetInteger(0, name, OBJPROP_WIDTH, width);
      ObjectSetInteger(0, name, OBJPROP_BACK, false);
      ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
      ObjectSetString(0, name, OBJPROP_TOOLTIP, tooltip);
   }
   else
   {
      ObjectMove(0, name, 0, 0, price);
   }
}

//+------------------------------------------------------------------+
//| Update on-chart information panel with live pip distances        |
//+------------------------------------------------------------------+
void UpdateLiveInfo()
{
   double currentBid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double pointValue = _Point;
   double pipFactor  = (_Digits == 3 || _Digits == 5) ? 10.0 * pointValue : pointValue;

   double pipsToHigh = (g_adrHigh - currentBid) / pipFactor;
   double pipsToLow  = (currentBid - g_adrLow) / pipFactor;
   double adrInPips  = g_adr / pipFactor;

   string highStatus = (currentBid >= g_adrHigh) ? "REACHED [!]" : StringFormat("%.1f pips away", pipsToHigh);
   string lowStatus  = (currentBid <= g_adrLow)  ? "REACHED [!]" : StringFormat("%.1f pips away", pipsToLow);

   string panelText = StringFormat(
      "==============================\\n" +
      "  ADR LEVELS INDICATOR (%d Days)\\n" +
      "==============================\\n" +
      "  Daily Open : %s\\n" +
      "  ADR Range  : %.1f pips\\n" +
      "------------------------------\\n" +
      "  ADR High   : %s  [%s]\\n" +
      "  ADR Low    : %s  [%s]\\n" +
      "==============================",
      InpADRDays,
      DoubleToString(g_dayOpen, _Digits),
      adrInPips,
      DoubleToString(g_adrHigh, _Digits), highStatus,
      DoubleToString(g_adrLow, _Digits), lowStatus
   );

   Comment(panelText);
}

//+------------------------------------------------------------------+
//| Check and fire notifications once per breach                     |
//+------------------------------------------------------------------+
void CheckAlerts()
{
   if(!InpEnableAlerts) return;

   double currentBid = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   // Check High breach
   if(!g_highNotified && currentBid >= g_adrHigh)
   {
      g_highNotified = true;
      string msg = StringFormat("[ADR Alert] %s reached ADR HIGH level at %s!", 
                                _Symbol, DoubleToString(g_adrHigh, _Digits));
      Alert(msg);
      if(InpPushAlerts) SendNotification(msg);
   }

   // Check Low breach
   if(!g_lowNotified && currentBid <= g_adrLow)
   {
      g_lowNotified = true;
      string msg = StringFormat("[ADR Alert] %s reached ADR LOW level at %s!", 
                                _Symbol, DoubleToString(g_adrLow, _Digits));
      Alert(msg);
      if(InpPushAlerts) SendNotification(msg);
   }
}
//+------------------------------------------------------------------+`;

  const STEPS_NAV = [
    { num: 1, label: 'Idea', icon: Lightbulb },
    { num: 2, label: 'Specification', icon: FileText },
    { num: 3, label: 'Filter', icon: Sliders },
    { num: 4, label: 'Prompt', icon: Sparkles },
    { num: 5, label: 'MQL5 Code', icon: Code2 },
    { num: 6, label: 'MetaEditor', icon: Terminal },
    { num: 7, label: 'Simulator', icon: Laptop },
    { num: 8, label: 'Milestone', icon: Award },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden my-8">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/50 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Interactive Hands-On Workshop
            </span>
            <span className="text-xs text-slate-400 font-mono">16-Step AI Automation Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>The MT5 Indicator Architecture Workbench</span>
            <span className="text-emerald-400 text-sm font-mono font-normal">ADR_Levels.mq5</span>
          </h2>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Workshop Completed</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-mono">
            Progress: <span className="text-emerald-400 font-bold">{completedSteps.length} / 8 Checkpoints</span>
          </div>
        )}
      </div>

      {/* 8-Step Navigation Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-3 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {STEPS_NAV.map((step) => {
            const isCurrent = activeStep === step.num;
            const isDone = completedSteps.includes(step.num);
            const Icon = step.icon;

            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : isDone
                    ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30 hover:bg-slate-850'
                    : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                  isCurrent
                    ? 'bg-slate-950 text-emerald-400'
                    : isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {isDone ? '✓' : step.num}
                </div>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Panels */}
      <div className="p-5 sm:p-8 space-y-6">

        {/* STEP 1: ROUGH IDEA */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Part 1: Start With the Rough Idea</h3>
                <p className="text-xs text-slate-400 font-sans">
                  The first rule of trading automation: Explain what you want in normal, human English. No MQL5 code needed yet!
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-400">
                  Step 1 Prompt Given to ChatGPT (The Specification Assistant)
                </span>
                <button
                  onClick={() => copyToClipboard(ROUGH_IDEA_PROMPT, 'rough_idea')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all"
                >
                  {copiedKey === 'rough_idea' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm font-mono text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-lg border border-slate-800/60">
                "{ROUGH_IDEA_PROMPT}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-300 space-y-1">
                <div className="font-bold">Why this works:</div>
                <p className="text-slate-300 leading-relaxed">
                  Notice that this prompt contains <strong>zero programming code</strong>. You are simply answering:
                  <em> "What do I want this tool to do?"</em> You specify the calculation reference (opening price of day),
                  the visual element (dotted lines), the alert (notification on screen), and key info (pips away).
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepDone(1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <span>Complete Step 1 & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHATGPT SPECIFICATION */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Part 2: Let ChatGPT Help Structure the Idea</h3>
                <p className="text-xs text-slate-400 font-sans">
                  ChatGPT transforms your messy thoughts into a structured 6-pillar specification blueprint.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-sky-400">1. Information Needed From You</span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Number of days for ADR calculation (default: 10)</li>
                  <li>Line colors (High, Low, Open)</li>
                  <li>Alert options (sound, popup notification on/off)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-sky-400">2. What It Should Calculate</span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>ADR = Average of (High - Low) of past X completed days</li>
                  <li>ADR High = Today's Opening Price + ADR</li>
                  <li>ADR Low = Today's Opening Price - ADR</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-sky-400">3. What Appears On Chart</span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Solid horizontal line for Day Open</li>
                  <li>Dotted horizontal line for ADR High</li>
                  <li>Dotted horizontal line for ADR Low</li>
                  <li>On-chart summary box with live data</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-sky-400">4. When Level Is Reached</span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Current Price touches or exceeds ADR High</li>
                  <li>Current Price touches or breaches ADR Low</li>
                  <li>Update on-chart status from "Pending" to "REACHED"</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-sky-400">5. Notifications Required</span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>On-screen alert box with sound</li>
                  <li>Must trigger <strong>only once</strong> per breach (no tick-by-tick spam)</li>
                  <li>Optional mobile push notification</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-sky-400">6. Displayed Information</span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Daily Open price and number of days used</li>
                  <li>ADR range in pips & points</li>
                  <li>Remaining distance in pips to High and Low</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepDone(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <span>Accept Specification & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ACCEPT / MODIFY / DELETE */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Part 3 & 4: Review, Accept, Modify, or Delete</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Do not blindly accept everything the AI creates! You are the Strategist. Customize your tool right here.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
              <div className="text-xs font-mono font-bold uppercase text-purple-400">
                Interactive Decision Playground (Modify or Delete Features)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Modify ADR Days */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">1. Modify Lookback Days</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{adrDays} Days</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Switch between 5-day short-term momentum or 10-day completed institutional range.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdrDays(5)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        adrDays === 5 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      5 Days
                    </button>
                    <button
                      onClick={() => setAdrDays(10)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        adrDays === 10 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      10 Days (Spec)
                    </button>
                  </div>
                </div>

                {/* Delete Historical Display */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">2. Historical Lines</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      !showHistory ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {!showHistory ? 'Deleted (Clean Chart)' : 'Show Past Days'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Rule from PDF: Delete messy past lines; keep only the current trading session active.
                  </p>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-mono text-slate-300 hover:text-white transition-all"
                  >
                    {showHistory ? 'Click to Delete Past Lines ✕' : 'Past Lines Deleted ✓'}
                  </button>
                </div>

                {/* Accept Level Alerts */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">3. Level Reach Alerts</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      enableAlerts ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {enableAlerts ? 'Accepted (Active)' : 'Muted'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Accept screen popup alert when ADR High or Low is reached.
                  </p>
                  <button
                    onClick={() => setEnableAlerts(!enableAlerts)}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-mono text-slate-300 hover:text-white transition-all"
                  >
                    {enableAlerts ? 'Alerts Enabled 🔔' : 'Alerts Disabled 🔕'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepDone(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <span>Confirm Final Spec & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DON'T CODE YET - CODING PROMPT */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Part 6 & 7: Don't Ask to Code Yet — The Coding Prompt</h3>
                <p className="text-xs text-slate-400 font-sans">
                  The #1 rookie mistake: Taking a rough idea straight to Claude. Instead, use ChatGPT to turn your specification into a structured developer directive!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  The Bridge Prompt (ChatGPT $\longrightarrow$ Claude Directive)
                </span>
                <button
                  onClick={() => copyToClipboard(BRIDGE_PROMPT, 'bridge_prompt')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all"
                >
                  {copiedKey === 'bridge_prompt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bridge Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-900/90 p-3.5 rounded-lg border border-slate-800/80">
                "{BRIDGE_PROMPT}"
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                  The Result: The Master Claude Coding Prompt (Ready to Copy)
                </span>
                <button
                  onClick={() => copyToClipboard(CLAUDE_CODING_PROMPT, 'claude_prompt')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
                >
                  {copiedKey === 'claude_prompt' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Prompt Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Coding Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 max-h-72 overflow-y-auto text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {CLAUDE_CODING_PROMPT}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepDone(4)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <span>Inspect Generated Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: MQL5 SOURCE CODE */}
        {activeStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Part 8: The MQL5 Source Code (Generated by Claude)</h3>
                <p className="text-xs text-slate-400 font-sans">
                  The complete, verified source code for <code className="text-emerald-400 font-mono">ADR_Levels.mq5</code>. Notice the clean separation of functions!
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-slate-300 font-bold">ADR_Levels.mq5 (210 Lines • 0 Errors)</span>
                </div>
                <button
                  onClick={() => copyToClipboard(MQL5_CODE, 'mql5_code')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
                >
                  {copiedKey === 'mql5_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Code Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Complete MQL5 Source</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-h-96 overflow-y-auto text-xs font-mono text-slate-300 whitespace-pre leading-relaxed">
                {MQL5_CODE}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-400 font-mono">1. OnInit()</div>
                <div className="text-slate-400 mt-1">Validates input parameters and performs the initial ADR calculation cleanly.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-sky-400 font-mono">2. OnCalculate()</div>
                <div className="text-slate-400 mt-1">Checks for new day rollover, updates live on-chart HUD, and tracks alert triggers.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-purple-400 font-mono">3. OnDeinit()</div>
                <div className="text-slate-400 mt-1">Uses ObjectsDeleteAll() to remove all lines and labels, keeping your chart clean.</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepDone(5)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <span>Learn MetaEditor & Error Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: METAEDITOR & DEBUGGING */}
        {activeStep === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Part 9 & 10: Move Code Into MT5 & The "Don't Guess" Error Protocol</h3>
                <p className="text-xs text-slate-400 font-sans">
                  How to paste, compile, and fix any compiler errors without needing to understand the C++ syntax yourself.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="text-xs font-mono font-bold uppercase text-rose-400">
                The 4-Step MetaEditor Deployment
              </div>
              <ol className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  <span>In MetaTrader 5, press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-emerald-400">F4</kbd> to launch MetaEditor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  <span>Click <strong className="text-white">New &gt; Custom Indicator (template)</strong>. Name the file <code className="text-emerald-400 font-mono">ADR_Levels</code> and click Finish.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  <span>Select all existing template text (<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Ctrl+A</kbd>), press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Delete</kbd>, and paste the Claude MQL5 code.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0">4</span>
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-emerald-400">F7</kbd> to compile. Look at the bottom "Errors" tab.</span>
                </li>
              </ol>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>The "Don't Guess" Error Protocol Prompt</span>
                </div>
                <button
                  onClick={() => copyToClipboard(DEBUG_PROMPT_TEMPLATE, 'debug_prompt')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all"
                >
                  {copiedKey === 'debug_prompt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Fix Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If MetaEditor outputs an error, <strong>never try to guess or edit the code manually</strong>. Right-click the error message in MetaEditor, select <em>Copy</em>, and paste it into Claude using this exact formula:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800/80">
                {DEBUG_PROMPT_TEMPLATE}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepDone(6)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <span>Launch Interactive Chart Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: INTERACTIVE MT5 CHART SIMULATOR */}
        {activeStep === 7 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Part 11: Behavioral Chart Verification (Figure 1)</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Compiling is not the end! Test whether the levels, HUD data, and breach notifications execute with 100% precision.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Chart</span>
              </button>
            </div>

            {/* Alert Banner Simulation */}
            {alertTriggered && (
              <div className="p-4 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 text-amber-200 flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
                  <Bell className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{alertTriggered}</span>
                </div>
                <button
                  onClick={() => setAlertTriggered(null)}
                  className="px-2 py-1 rounded bg-amber-500/30 hover:bg-amber-500/50 text-white text-xs font-mono"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Simulated MT5 Chart Window (Figure 1) */}
            <div className="relative rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl">
              {/* Chart Title Header */}
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-white font-bold">EURUSD, M15</span>
                  <span className="text-slate-400">• MetaTrader 5 Live Chart Simulation</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>Current Bid: <strong className="text-emerald-400">{simPrice.toFixed(5)}</strong></span>
                  <span>ADR: <strong className="text-sky-400">{adrPips} pips ({adrDays} Days)</strong></span>
                </div>
              </div>

              {/* Chart Visual Surface */}
              <div className="relative h-80 bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 grid grid-rows-6 opacity-10 pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border-b border-slate-600 w-full" />
                  ))}
                </div>

                {/* ADR HIGH Level Line */}
                <div className="relative z-10 flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                      ADR HIGH: {adrHigh.toFixed(5)} (+{adrPips} pips)
                    </span>
                    {highReached && (
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-mono font-bold text-[10px] animate-bounce">
                        REACHED 🔔
                      </span>
                    )}
                  </div>
                  <div className="border-b-2 border-dashed border-sky-400 flex-1 mx-3" />
                  <span className="text-[10px] font-mono text-sky-300">
                    {simPrice >= adrHigh ? 'BREACHED' : `${pipsToHigh} pips away`}
                  </span>
                </div>

                {/* Candles Simulation Area */}
                <div className="relative z-10 flex items-end justify-center gap-3 h-36 my-auto">
                  {simulatedCandles.slice(-10).map((c, i) => {
                    const isBull = c.color === 'bull';
                    const heightPct = Math.min(100, Math.max(15, Math.abs(c.close - c.open) * 15000));
                    return (
                      <div key={i} className="flex flex-col items-center justify-end h-full">
                        {/* Upper wick */}
                        <div className={`w-0.5 h-3 ${isBull ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {/* Candle body */}
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-4 rounded-sm border ${
                            isBull
                              ? 'bg-emerald-500/80 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                              : 'bg-rose-500/80 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                          }`}
                        />
                        {/* Lower wick */}
                        <div className={`w-0.5 h-3 ${isBull ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      </div>
                    );
                  })}
                </div>

                {/* DAILY OPEN Level Line */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                      DAILY OPEN: {dailyOpen.toFixed(5)}
                    </span>
                  </div>
                  <div className="border-b-2 border-solid border-amber-400/80 flex-1 mx-3" />
                  <span className="text-[10px] font-mono text-amber-300">Reference Baseline</span>
                </div>

                {/* ADR LOW Level Line */}
                <div className="relative z-10 flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                      ADR LOW: {adrLow.toFixed(5)} (-{adrPips} pips)
                    </span>
                    {lowReached && (
                      <span className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 font-mono font-bold text-[10px] animate-bounce">
                        REACHED 🔔
                      </span>
                    )}
                  </div>
                  <div className="border-b-2 border-dashed border-rose-400 flex-1 mx-3" />
                  <span className="text-[10px] font-mono text-rose-300">
                    {simPrice <= adrLow ? 'BREACHED' : `${pipsToLow} pips away`}
                  </span>
                </div>

                {/* On-Chart HUD Overlay (Matches Figure 1 in PDF) */}
                <div className="absolute top-3 right-3 z-20 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono shadow-xl backdrop-blur-sm pointer-events-none">
                  <div className="text-emerald-400 font-bold border-b border-slate-700 pb-1 mb-1.5 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3" />
                    <span>ADR LEVELS INDICATOR</span>
                  </div>
                  <div className="space-y-0.5 text-slate-300">
                    <div>Days: <strong className="text-white">{adrDays}</strong></div>
                    <div>Daily Open: <strong className="text-amber-400">{dailyOpen.toFixed(5)}</strong></div>
                    <div>ADR Range: <strong className="text-white">{adrPips} pips</strong></div>
                    <div className="pt-1 border-t border-slate-800">
                      ADR High: <span className={highReached ? 'text-sky-400 font-bold' : 'text-slate-300'}>
                        {adrHigh.toFixed(5)} [{highReached ? 'REACHED!' : `${pipsToHigh} pips`}]
                      </span>
                    </div>
                    <div>
                      ADR Low: <span className={lowReached ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {adrLow.toFixed(5)} [{lowReached ? 'REACHED!' : `${pipsToLow} pips`}]
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Controls Bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-400 font-bold">
                  Interactive Market Simulation:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSimulateBullish}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-all"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Push Up (+25 pips)</span>
                  </button>

                  <button
                    onClick={handleSimulateBreakHigh}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-mono transition-all"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Hit ADR High Level 🚀</span>
                  </button>

                  <button
                    onClick={handleSimulateBearish}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono transition-all"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Push Down (-30 pips)</span>
                  </button>

                  <button
                    onClick={handleSimulateBreakLow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 border border-rose-500/50 text-xs font-mono transition-all"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Hit ADR Low Level 📉</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepDone(7)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <span>Proceed to Master Examination & Graduation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: GOLDEN RULES & MASTERCLASS TRANSITION */}
        {activeStep === 8 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Part 12 & Conclusion: The 3 Golden Rules & Masterclass Transition</h3>
                <p className="text-xs text-slate-400 font-sans">
                  You have mastered the complete workflow from idea to specification to coding prompt to MQL5 to behavioral testing!
                </p>
              </div>
            </div>

            {/* The 3 Golden Rules from PDF */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">Golden Rule #1</span>
                <h4 className="text-sm font-bold text-white">Idea First, Code Last</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Never jump straight to writing code or asking an AI to code before your idea is fully structured into unambiguous Machine Facts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Golden Rule #2</span>
                <h4 className="text-sm font-bold text-white">Don't Blindly Trust AI</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Always review the specification, verify the prompt, and audit the output. You are the Master Chef; the AI is your kitchen assistant.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase">Golden Rule #3</span>
                <h4 className="text-sm font-bold text-white">Test the Behaviour</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compiling without errors does not mean the code is right. Attach it to a live chart, verify the levels, and confirm notification timing.
                </p>
              </div>
            </div>

            {/* Who Does What Matrix */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                The 4-Way Collaboration Matrix
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-amber-400 block font-mono">1. YOU (Strategist)</strong>
                  <span className="text-slate-400 text-[11px]">The Idea, Decisions, Review, MT5 Chart Testing, and Verification.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-sky-400 block font-mono">2. ChatGPT (Assistant)</strong>
                  <span className="text-slate-400 text-[11px]">Structures the idea, creates the specification, and drafts the Claude prompt.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-emerald-400 block font-mono">3. Claude (Coder)</strong>
                  <span className="text-slate-400 text-[11px]">Writes the MQL5 code, fixes compiler errors, and refines logic.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-purple-400 block font-mono">4. MT5 (Environment)</strong>
                  <span className="text-slate-400 text-[11px]">Compiles code in MetaEditor, plots visuals, and tests behavior on ticks.</span>
                </div>
              </div>
            </div>

            {/* Completion & Transition Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Award className="w-8 h-8" />
              </div>

              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Free Academy Completed! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Congratulations, Strategy Architect! You have now completed all foundational theory (Levels 1–3),
                  the Master Examination, the Breakout EA Workshop (3.5), and the MT5 Indicator Workshop (3.6).
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onComplete();
                    markStepDone(8);
                    if (onNavigateToMasterclass) {
                      onNavigateToMasterclass();
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Mark Lesson 3.6 Done & Enter Masterclass 🚀</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
