import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Terminal, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Pencil, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Clock, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Wrench,
  HelpCircle,
  Lock,
  Key,
  X,
  ExternalLink,
  Bot,
  Loader2,
  Zap,
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  StructuredStrategyData, 
  StrategyExtractionResult, 
  extractTechnicalDetailsFromDescription, 
  buildDevPrompt, 
  buildClearStrategy 
} from '../../lib/strategyEngine.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { supabase } from '../../lib/supabase.ts';
import { isEcosystemMember, setEcosystemMember } from '../../services/academyAccess.ts';

export interface StrategyIntakeWorkflowProps {
  mode: 'free-tool' | 'custom-ea';
  initialDescription?: string;
  initialStructuredData?: Partial<StructuredStrategyData>;
  onTriggerBuildMyEa?: (structuredData: StructuredStrategyData, prompt: string) => void;
  onCustomEaSubmitted?: (projectId: string) => void;
  initialPackage?: string;
}

export const StrategyIntakeWorkflow: React.FC<StrategyIntakeWorkflowProps> = ({
  mode,
  initialDescription = '',
  initialStructuredData,
  onTriggerBuildMyEa,
  onCustomEaSubmitted,
  initialPackage = 'Standard',
}) => {
  const { user, isAdmin } = useAuth();
  const [isMemberUnlocked, setIsMemberUnlocked] = useState<boolean>(() => isEcosystemMember(user, isAdmin));
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);

  useEffect(() => {
    setIsMemberUnlocked(isEcosystemMember(user, isAdmin));
  }, [user, isAdmin]);

  useEffect(() => {
    const handleEcosystemChange = () => {
      setIsMemberUnlocked(isEcosystemMember(user, isAdmin));
    };
    window.addEventListener('mega-ecosystem-change', handleEcosystemChange);
    window.addEventListener('academy-tier-change', handleEcosystemChange);
    window.addEventListener('storage', handleEcosystemChange);
    return () => {
      window.removeEventListener('mega-ecosystem-change', handleEcosystemChange);
      window.removeEventListener('academy-tier-change', handleEcosystemChange);
      window.removeEventListener('storage', handleEcosystemChange);
    };
  }, [user, isAdmin]);

  // What are you building? ('EA' | 'Indicator')
  const [buildType, setBuildType] = useState<'EA' | 'Indicator'>('EA');

  // AI-Driven Strategy Architect state
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisPhase, setAiAnalysisPhase] = useState<string>('Interpreting natural rules with ChatGPT AI...');
  const [chatGptResponse, setChatGptResponse] = useState<string>('');
  const [systemTitle, setSystemTitle] = useState<string>('');
  const [blueprintMarkdown, setBlueprintMarkdown] = useState<string>('');
  const [aiDevPrompt, setAiDevPrompt] = useState<string>('');
  const [aiClarifications, setAiClarifications] = useState<Array<{
    id: string;
    topic: string;
    question: string;
    status: 'REQUIRES CLARIFICATION';
    suggestedOptions: string[];
  }>>([]);
  const [aiConversation, setAiConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [followUpInput, setFollowUpInput] = useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);

  // Quick inspiration templates for 1-click loading
  const quickTemplates = {
    EA: [
      {
        label: 'XAUUSD London FVG Retest',
        text: 'I want an Expert Advisor for Gold (XAUUSD) on the 15-minute timeframe. During the London session (07:00-11:00 GMT), when price sweeps the Asian high or low and creates a Fair Value Gap on the 5-minute chart in the opposite direction, enter on the FVG retest. Risk 1% per trade, 25 pip Stop Loss, 2.5R Take Profit. Move Stop Loss to break-even at 1.5R profit. Do not trade during high-impact USD news.'
      },
      {
        label: 'Asian Range Liquidity Sweep',
        text: 'I want an EA for EURUSD on M15. Calculate the Asian session high and low between 00:00 and 06:00 GMT. At London open (07:00 GMT), place buy-stop and sell-stop pending orders 5 pips outside the Asian range. Stop loss at the range midpoint. Risk 0.5% per trade. Take profit at 2x the range height. Cancel unfilled orders after 4 hours. Close all open positions on Friday at 20:00 GMT.'
      },
      {
        label: 'US30 Trend Following EMA',
        text: 'I want a trend-following EA for US30 on the H1 timeframe. When the 20 EMA crosses above the 50 EMA and RSI(14) is above 50, enter Buy at market on candle close. When 20 EMA crosses below 50 EMA and RSI is below 50, enter Sell. Stop Loss placed at recent swing high/low (20 bars). Risk 1.5% per trade with 1:2 risk-to-reward. Trailing stop activates at 1R profit trailing by 1.5 ATR.'
      }
    ],
    Indicator: [
      {
        label: 'FVG & Liquidity Scanner',
        text: 'I want a custom indicator for MT5 that detects Fair Value Gaps (FVGs) and Liquidity Pools on M15 and H1. Draw shaded green boxes for bullish FVGs and shaded red boxes for bearish FVGs. When an unmitigated FVG is tapped for the first time, draw an entry arrow and trigger a popup alert and mobile push notification. Mark old zones as mitigated when price passes through them.'
      },
      {
        label: 'Multi-TF RSI Reversal Arrows',
        text: 'I want a multi-timeframe indicator that scans for regular and hidden RSI divergences on M15 confirmed by H1 trend. When bullish divergence occurs with RSI exiting the oversold zone (<30), draw a bright green arrow below the candle and send a sound alert. When bearish divergence occurs with RSI exiting overbought (>70), draw a magenta arrow above the candle.'
      },
      {
        label: 'Asian Range Breakout Box',
        text: 'I want a chart indicator that highlights the Asian session (00:00 to 07:00 GMT) with a translucent shaded box. Plot horizontal dotted lines extending into the London and New York sessions for Asian High and Asian Low. When London breaks the Asian high or low, display an alert banner with the breakout price and direction.'
      }
    ]
  };

  // Primary strategy description (Source of truth)
  const [description, setDescription] = useState(initialDescription);
  
  // Secondary structured fields (Editable by client, auto-populated from description)
  const [structured, setStructured] = useState<StructuredStrategyData>(() => {
    return extractTechnicalDetailsFromDescription(initialDescription, initialStructuredData, 'EA').structured;
  });

  // Track if user manually modified structured fields to preserve their edits
  const [hasManuallyEditedStructured, setHasManuallyEditedStructured] = useState(false);

  // Workflow step: 'input' | 'review' | 'submitted'
  const [step, setStep] = useState<'input' | 'review' | 'submitted'>('input');

  // Review representation mode: 'prompt' | 'clear'
  const [reviewMode, setReviewMode] = useState<'clear' | 'prompt'>('clear');

  // Accordion toggle for original description in review screen
  const [showOriginalInReview, setShowOriginalInReview] = useState(false);

  // Secondary structured fields accordion in input mode
  const [showSecondarySections, setShowSecondarySections] = useState(true);

  // Custom EA specific fields (for submission)
  const [platform, setPlatform] = useState<'MT5' | 'MT4' | 'cTrader'>('MT5');
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState('');
  const [clientTelegram, setClientTelegram] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccessId, setSubmissionSuccessId] = useState<string | null>(null);

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Dedicated handler when user switches between EA and Indicator
  const handleSelectBuildType = (newType: 'EA' | 'Indicator') => {
    if (newType === buildType) return;
    setBuildType(newType);
    if (!hasManuallyEditedStructured) {
      const result = extractTechnicalDetailsFromDescription(description, initialStructuredData, newType);
      setStructured(result.structured);
    } else {
      setStructured(prev => ({
        ...prev,
        buildType: newType,
      }));
    }
  };

  // Auto-extraction when primary description changes (unless client has manually customized fields)
  useEffect(() => {
    if (description.trim().length > 0 && !hasManuallyEditedStructured) {
      const result = extractTechnicalDetailsFromDescription(description, initialStructuredData, buildType);
      setStructured(result.structured);
    }
  }, [description, hasManuallyEditedStructured, initialStructuredData, buildType]);

  // Derived analysis result for review
  const analysisResult: StrategyExtractionResult = React.useMemo(() => {
    return extractTechnicalDetailsFromDescription(description, structured, buildType);
  }, [description, structured, buildType]);

  const devPrompt = React.useMemo(() => {
    return buildDevPrompt(structured);
  }, [structured]);

  const clearStrategy = React.useMemo(() => {
    return buildClearStrategy(structured);
  }, [structured]);

  // Track confirmed ambiguities
  const [confirmedClarifications, setConfirmedClarifications] = useState<Record<string, string>>({});

  const handleUpdateStructuredField = (field: keyof StructuredStrategyData, value: any) => {
    setHasManuallyEditedStructured(true);
    setStructured(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResolveClarification = (item: { id: string; topic: string; question: string; suggestedOptions?: string[] }, option: string) => {
    setConfirmedClarifications(prev => ({
      ...prev,
      [item.id]: option
    }));

    const fullText = `${item.topic} ${item.question} ${item.id}`.toUpperCase();

    if (fullText.includes('STOP LOSS') || fullText.includes('SL')) {
      handleUpdateStructuredField('stopLoss', option);
    } else if (fullText.includes('TAKE PROFIT') || fullText.includes('TP') || fullText.includes('TARGET')) {
      handleUpdateStructuredField('takeProfit', option);
    } else if (fullText.includes('RISK') || fullText.includes('SIZING') || fullText.includes('LOT')) {
      handleUpdateStructuredField('riskPerTrade', option);
      handleUpdateStructuredField('positionSizing', `Dynamic Lot Sizing (${option})`);
    } else if (fullText.includes('TRIGGER') || fullText.includes('TIMING')) {
      handleUpdateStructuredField('entryTriggerType', option as any);
    } else if (fullText.includes('REPAINT')) {
      handleUpdateStructuredField('repaintPolicy', option as any);
    } else if (fullText.includes('ALERT')) {
      handleUpdateStructuredField('alertTypes', option);
    } else if (fullText.includes('TIMEFRAME') || fullText.includes('TF')) {
      handleUpdateStructuredField('timeframe', option);
    } else if (fullText.includes('SESSION') || fullText.includes('HOURS')) {
      handleUpdateStructuredField('sessions', option);
    } else if (fullText.includes('BREAK-EVEN') || fullText.includes('BREAKEVEN')) {
      handleUpdateStructuredField('breakEven', option);
    } else if (fullText.includes('TRAILING')) {
      handleUpdateStructuredField('trailingStop', option);
    } else if (fullText.includes('LOSS LIMIT') || fullText.includes('DAILY LOSS')) {
      handleUpdateStructuredField('maxDailyLoss', option);
    } else {
      handleUpdateStructuredField('additionalRules', `${item.topic}: ${option}`);
    }
  };

  const sanitizeProfessionalOutput = (text: string) => {
    if (!text) return '';
    return text
      .replace(/:\s*Not specified/gi, ': Configurable parameter (client default)')
      .replace(/•\s*([A-Za-z\s]+):\s*Not specified/gi, '• $1: Standard Baseline')
      .replace(/\bNot specified\b/gi, 'Standard Institutional Baseline')
      .replace(/Not specified \(defined by user\)/gi, 'Executes strictly on verified strategy signal triggers');
  };

  const handleCopyOutput = () => {
    if (reviewMode === 'prompt' && !isMemberUnlocked) {
      setShowUnlockModal(true);
      return;
    }
    const textToCopy = reviewMode === 'prompt' 
      ? (aiDevPrompt || devPrompt) 
      : (blueprintMarkdown || clearStrategy);
    navigator.clipboard.writeText(sanitizeProfessionalOutput(textToCopy));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInterpretWithAi = async (overrideText?: string) => {
    const textToAnalyze = (overrideText !== undefined ? overrideText : description).trim();
    if (!textToAnalyze) return;

    if (overrideText !== undefined) {
      setDescription(overrideText);
    }

    const isEa = buildType === 'EA';
    setIsAiAnalyzing(true);
    setAiAnalysisPhase(isEa 
      ? 'Interpreting EA execution rules with Lead Quantitative Architect...' 
      : 'Interpreting Indicator signal logic with Lead Indicator Architect...');

    const phaseTimer1 = setTimeout(() => {
      setAiAnalysisPhase(isEa
        ? 'Analyzing entry triggers, session windows, and risk model...'
        : 'Analyzing visual buffers, non-repainting conditions, and chart window...');
    }, 1200);

    const phaseTimer2 = setTimeout(() => {
      setAiAnalysisPhase(isEa
        ? 'Synthesizing quantitative MQL5 EA architecture and parameters...'
        : 'Synthesizing MQL5 indicator buffers, drawing styles, and alert suite...');
    }, 2400);

    try {
      const res = await api.interpretStrategyAi({
        buildType,
        description: textToAnalyze,
        conversation: aiConversation,
        platform,
      });

      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);

      if (res && res.success) {
        if (res.systemTitle) setSystemTitle(res.systemTitle);
        if (res.chatGptResponse) setChatGptResponse(res.chatGptResponse);
        if (res.blueprintMarkdown) setBlueprintMarkdown(res.blueprintMarkdown);
        if (res.devPrompt) setAiDevPrompt(res.devPrompt);
        if (res.clarifications && res.clarifications.length > 0) {
          setAiClarifications(res.clarifications);
        }
        if (res.structured) {
          setStructured(prev => ({
            ...prev,
            ...res.structured,
            primaryDescription: textToAnalyze,
          }));
        }
        setAiConversation([
          { role: 'user', content: textToAnalyze },
          { role: 'assistant', content: res.chatGptResponse || 'Strategy interpreted.' },
        ]);
        setStep('review');
        window.scrollTo({ top: 180, behavior: 'smooth' });
      } else {
        handleProceedToReview();
      }
    } catch (err) {
      console.error('Failed to interpret with AI:', err);
      handleProceedToReview();
    } finally {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      setIsAiAnalyzing(false);
    }
  };

  const handleSendFollowUp = async () => {
    if (!followUpInput.trim() || isSendingFollowUp) return;
    const userMessage = followUpInput.trim();
    setFollowUpInput('');
    setIsSendingFollowUp(true);

    const updatedConvo = [
      ...aiConversation,
      { role: 'user' as const, content: userMessage },
    ];
    setAiConversation(updatedConvo);

    try {
      const combinedDescription = `${description}\n\n[Trader Refinement / Instruction]: ${userMessage}`;
      const res = await api.interpretStrategyAi({
        buildType,
        description: combinedDescription,
        conversation: updatedConvo,
        platform,
      });

      if (res && res.success) {
        if (res.systemTitle) setSystemTitle(res.systemTitle);
        if (res.chatGptResponse) setChatGptResponse(res.chatGptResponse);
        if (res.blueprintMarkdown) setBlueprintMarkdown(res.blueprintMarkdown);
        if (res.devPrompt) setAiDevPrompt(res.devPrompt);
        if (res.structured) {
          setStructured(prev => ({
            ...prev,
            ...res.structured,
          }));
        }
        if (res.clarifications) {
          setAiClarifications(res.clarifications);
        }
        setAiConversation([
          ...updatedConvo,
          { role: 'assistant', content: res.chatGptResponse || 'Your rules have been updated.' },
        ]);
      }
    } catch (err) {
      console.error('Failed to process follow-up:', err);
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  const handleProceedToReview = () => {
    if (!description.trim()) return;
    // Final sync
    const finalExtraction = extractTechnicalDetailsFromDescription(description, structured);
    setStructured(finalExtraction.structured);
    setStep('review');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleStrategySubmit = async () => {
    setValidationError(null);

    // Validation
    if (!description.trim()) {
      setValidationError('Please provide your strategy description before submitting.');
      return;
    }

    if (!clientName.trim()) {
      setValidationError('Please enter your Full Name.');
      return;
    }

    if (!clientEmail.trim() || !clientEmail.includes('@') || !clientEmail.includes('.')) {
      setValidationError('Please enter a valid Email Address.');
      return;
    }

    // Phone / WhatsApp is strictly required
    const cleanDigits = clientPhone.replace(/\D/g, '');
    if (!clientPhone.trim() || cleanDigits.length < 6) {
      setValidationError('Phone / WhatsApp Number is required (minimum 6 digits).');
      return;
    }

    setIsSubmitting(true);
    const subId = `SUB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    try {
      // 1. Direct Supabase insert attempt (Frontend -> Supabase)
      try {
        await supabase.from('strategy_submissions').insert({
          id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          user_id: user?.id || null,
          submission_id: subId,
          full_name: clientName.trim(),
          email: clientEmail.trim().toLowerCase(),
          phone: clientPhone.trim(),
          telegram: clientTelegram.trim() || null,
          platform,
          strategy_title: systemTitle || (buildType === 'EA' ? `Custom ${platform} EA: ${structured.instrument} (${structured.timeframe})` : `Custom Indicator: ${structured.instrument} (${structured.timeframe})`),
          original_strategy: description,
          structured_strategy: structured,
          clear_strategy: blueprintMarkdown || clearStrategy,
          generated_prompt: aiDevPrompt || devPrompt,
          instrument: structured.instrument,
          timeframe: structured.timeframe,
          direction: structured.direction,
          entry_conditions: structured.entryRules || '',
          exit_conditions: structured.exitRules || '',
          risk_management: structured.riskPerTrade ? `Risk: ${structured.riskPerTrade}, SL: ${structured.stopLoss}, TP: ${structured.takeProfit}` : (structured.stopLoss || ''),
          trading_conditions: structured.sessions || structured.newsFilter ? `Sessions: ${structured.sessions}, News: ${structured.newsFilter}` : '',
          trade_management: structured.trailingStop || structured.breakEven ? `BE: ${structured.breakEven}, Trail: ${structured.trailingStop}` : '',
          additional_rules: structured.additionalRules || '',
          missing_information: analysisResult.clarifications?.map(c => `${c.topic}: ${c.question}`).join('; ') || '',
          status: 'submitted',
          email_status: 'pending',
        });
      } catch (supaErr) {
        console.warn('[Supabase Strategy Direct Sync Notice]', supaErr);
      }

      // Also sync to custom_dev_leads for backwards compatibility
      try {
        await supabase.from('custom_dev_leads').insert({
          email: clientEmail.trim().toLowerCase(),
          name: clientName.trim(),
          phone: clientPhone.trim(),
          telegram: clientTelegram.trim() || null,
          platform,
          instrument: structured.instrument,
          timeframe: structured.timeframe,
          strategy_idea: description,
          generated_prompt: aiDevPrompt || devPrompt,
          status: 'pending_review',
        });
      } catch (leadErr) {
        console.warn('[Supabase Leads Direct Sync Notice]', leadErr);
      }

      // 2. Submit to backend API (/api/strategy-submissions)
      // This guarantees local SQLite persistence + server Supabase sync + email dispatch to supermegafx1@gmail.com and client
      const res = await fetch('/api/strategy-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
        },
        body: JSON.stringify({
          submission_id: subId,
          user_id: user?.id || null,
          full_name: clientName.trim(),
          email: clientEmail.trim().toLowerCase(),
          phone: clientPhone.trim(),
          telegram: clientTelegram.trim() || null,
          platform,
          strategy_title: systemTitle || (buildType === 'EA' ? `Custom ${platform} EA: ${structured.instrument} (${structured.timeframe})` : `Custom Indicator: ${structured.instrument} (${structured.timeframe})`),
          original_strategy: description,
          structured_strategy: structured,
          clear_strategy: blueprintMarkdown || clearStrategy,
          generated_prompt: aiDevPrompt || devPrompt,
          instrument: structured.instrument,
          timeframe: structured.timeframe,
          direction: structured.direction,
          entry_conditions: structured.entryRules || '',
          exit_conditions: structured.exitRules || '',
          risk_management: structured.riskPerTrade ? `Risk: ${structured.riskPerTrade}, SL: ${structured.stopLoss}, TP: ${structured.takeProfit}` : (structured.stopLoss || ''),
          trading_conditions: structured.sessions || structured.newsFilter ? `Sessions: ${structured.sessions}, News: ${structured.newsFilter}` : '',
          trade_management: structured.trailingStop || structured.breakEven ? `BE: ${structured.breakEven}, Trail: ${structured.trailingStop}` : '',
          additional_rules: structured.additionalRules || '',
          missing_information: analysisResult.clarifications?.map(c => `${c.topic}: ${c.question}`).join('; ') || '',
          submission_type: mode === 'free-tool' ? 'Strategy Builder Submission' : 'Custom EA Specification',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server submission error.');
      }

      const finalId = data.submission_id || subId;
      setSubmissionSuccessId(finalId);
      setStep('submitted');
      if (onCustomEaSubmitted) onCustomEaSubmitted(finalId);
    } catch (err: any) {
      console.error('[Strategy Submission Error]', err);
      setValidationError(err.message || 'Submission failed. Please check your network connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomEaSubmit = handleStrategySubmit;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* STEP 1: INPUT & INTELLIGENT STRUCTURING                       */}
      {/* ------------------------------------------------------------- */}
      {step === 'input' && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* SECTION 0: ARCHETYPE SELECTOR (What are you building?) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  WHAT ARE YOU BUILDING?
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                AI Architect Mode
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed font-normal">
              Select your system type. Our AI interprets your description with domain-specific quantitative logic and MQL5 architecture.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Expert Advisor */}
              <button
                type="button"
                onClick={() => handleSelectBuildType('EA')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  buildType === 'EA'
                    ? 'border-emerald-600 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        buildType === 'EA' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm sm:text-base text-slate-900">
                        Expert Advisor (EA)
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      buildType === 'EA' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      AUTO-ROBOT
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated market/limit execution, stop loss, take profit, trailing stops, break-even protection, session windows, and multi-symbol risk control.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-mono text-emerald-700 font-semibold">
                  <span>Full Trade Execution</span>
                  <span>{buildType === 'EA' ? '● SELECTED' : 'Select'}</span>
                </div>
              </button>

              {/* Option 2: Custom Indicator */}
              <button
                type="button"
                onClick={() => handleSelectBuildType('Indicator')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  buildType === 'Indicator'
                    ? 'border-emerald-600 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        buildType === 'Indicator' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm sm:text-base text-slate-900">
                        Custom Indicator
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      buildType === 'Indicator' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      SIGNALS & SCANNER
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    On-chart signal arrows, Fair Value Gap boxes, session high/low markers, multi-timeframe divergence scanners, and sound/push alert triggers.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-mono text-emerald-700 font-semibold">
                  <span>Visual Signals & Alerts</span>
                  <span>{buildType === 'Indicator' ? '● SELECTED' : 'Select'}</span>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION 1: PRIMARY STRATEGY DESCRIPTION (Visually Dominant) */}
          <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  DESCRIBE YOUR {buildType === 'EA' ? 'EXPERT ADVISOR' : 'CUSTOM INDICATOR'}
                </h2>
              </div>
              <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold tracking-wider">
                NATURAL CHATGPT INTERPRETATION
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 mb-3 leading-relaxed font-normal">
              {buildType === 'EA' 
                ? 'Explain how your robot works in plain English — how it finds setups, when it enters, stop loss & take profit rules, trailing stop, and session filters. No coding required.'
                : 'Explain your indicator in plain English — what conditions it identifies, what buffers or shapes it plots on chart, and how alerts should trigger. No coding required.'}
            </p>

            {/* Quick Starter Inspiration Chips */}
            <div className="mb-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Quick Starter Inspiration:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickTemplates[buildType].map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInterpretWithAi(tmpl.text)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>{tmpl.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                placeholder={buildType === 'EA' 
                  ? 'Describe your trading strategy in as much detail as you can. Include how you identify setups, when you enter, when you exit, how you manage risk, trading sessions, indicators, price action, filters and any other rules you use.'
                  : 'Describe your custom indicator. Include the indicators or price action formulas used, exact buffer colors, signal arrow criteria, alert popup/push conditions, and multi-timeframe rules.'}
                className="w-full bg-slate-50/80 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base rounded-2xl p-4 sm:p-5 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans leading-relaxed resize-y"
              />

              {description.trim().length > 20 && (
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Natural description ready for AI interpretation
                  </span>
                  <span>{description.trim().length} characters</span>
                </div>
              )}
            </div>

            {/* AI Analyzing Loading Overlay */}
            {isAiAnalyzing && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-2">
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MEG.AI Quantitative Architect</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight mb-1">
                  Interpreting Your Strategy Like ChatGPT
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md font-mono animate-pulse">
                  {aiAnalysisPhase}
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2: SECONDARY STRUCTURED FIELDS (Auto-populated from Primary Description) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  STRUCTURED PARAMETERS
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Information derived automatically from your description. You can verify and adjust any field below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSecondarySections(!showSecondarySections)}
                className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
              >
                {showSecondarySections ? (
                  <><span>Collapse</span><ChevronUp className="w-4 h-4" /></>
                ) : (
                  <><span>Expand</span><ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            </div>

            {showSecondarySections && (
              <div className="space-y-6">
                {/* Instruments & Timeframe Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      Instrument / Asset
                    </label>
                    <input
                      type="text"
                      value={structured.instrument}
                      onChange={(e) => handleUpdateStructuredField('instrument', e.target.value)}
                      placeholder="e.g. XAUUSD, EURUSD, US30"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      Execution Timeframe
                    </label>
                    <input
                      type="text"
                      value={structured.timeframe}
                      onChange={(e) => handleUpdateStructuredField('timeframe', e.target.value)}
                      placeholder="e.g. M15, H1, M5"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      Direction
                    </label>
                    <select
                      value={structured.direction}
                      onChange={(e) => handleUpdateStructuredField('direction', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                    >
                      <option value="Long & Short">Long & Short</option>
                      <option value="Long Only">Long Only</option>
                      <option value="Short Only">Short Only</option>
                      <option value="Bidirectional">Bidirectional</option>
                    </select>
                  </div>
                </div>

                {/* Entry & Exit Conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      ENTRY CONDITIONS
                    </label>
                    <textarea
                      rows={3}
                      value={structured.entryRules}
                      onChange={(e) => handleUpdateStructuredField('entryRules', e.target.value)}
                      placeholder="Identified triggers, indicator crosses, candlestick patterns..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      EXIT CONDITIONS
                    </label>
                    <textarea
                      rows={3}
                      value={structured.exitRules}
                      onChange={(e) => handleUpdateStructuredField('exitRules', e.target.value)}
                      placeholder="Take profit targets, trailing rules, reversal exits..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed resize-y"
                    />
                  </div>
                </div>

                {/* Archetype Specialized Section: Risk Management for EA vs Visual Plots & Buffers for Indicator */}
                {buildType === 'EA' ? (
                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      EA RISK & ORDER MANAGEMENT
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Risk Per Trade</span>
                        <input
                          type="text"
                          value={structured.riskPerTrade}
                          onChange={(e) => handleUpdateStructuredField('riskPerTrade', e.target.value)}
                          placeholder="e.g. 1% or 0.05 Lots"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Stop Loss</span>
                        <input
                          type="text"
                          value={structured.stopLoss}
                          onChange={(e) => handleUpdateStructuredField('stopLoss', e.target.value)}
                          placeholder="e.g. Below sweep or 25 pips"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Take Profit</span>
                        <input
                          type="text"
                          value={structured.takeProfit}
                          onChange={(e) => handleUpdateStructuredField('takeProfit', e.target.value)}
                          placeholder="e.g. 2R or 50 pips"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Max Daily Loss</span>
                        <input
                          type="text"
                          value={structured.maxDailyLoss}
                          onChange={(e) => handleUpdateStructuredField('maxDailyLoss', e.target.value)}
                          placeholder="e.g. 3% or Standard 4% Daily Drawdown"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Max Trades / Day</span>
                        <input
                          type="text"
                          value={structured.maxTradesPerDay}
                          onChange={(e) => handleUpdateStructuredField('maxTradesPerDay', e.target.value)}
                          placeholder="e.g. 2 trades or Unlimited Signal Driven"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Break Even</span>
                        <input
                          type="text"
                          value={structured.breakEven}
                          onChange={(e) => handleUpdateStructuredField('breakEven', e.target.value)}
                          placeholder="e.g. Move at 1R or 1.5R Target"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Trailing Stop</span>
                        <input
                          type="text"
                          value={structured.trailingStop}
                          onChange={(e) => handleUpdateStructuredField('trailingStop', e.target.value)}
                          placeholder="e.g. 1.5x ATR or Disabled"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      INDICATOR VISUAL SIGNALS & ALERT SUITE
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Window Location</span>
                        <select
                          value={structured.windowType || 'Chart Window'}
                          onChange={(e) => handleUpdateStructuredField('windowType', e.target.value as any)}
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600 font-medium"
                        >
                          <option value="Chart Window">Main Chart Window</option>
                          <option value="Separate Subwindow">Separate Subwindow (Oscillator)</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Repaint & Bar Policy</span>
                        <select
                          value={structured.repaintPolicy || 'Strict Non-Repainting (Bar Close)'}
                          onChange={(e) => handleUpdateStructuredField('repaintPolicy', e.target.value as any)}
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600 font-medium"
                        >
                          <option value="Strict Non-Repainting (Bar Close)">Strict Non-Repainting (Bar Close)</option>
                          <option value="Real-time Bar 0 (Forming)">Live Real-time Bar 0 (Forming)</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Historical Lookback</span>
                        <input
                          type="text"
                          value={structured.maxBarsCalculate || '1000 Bars'}
                          onChange={(e) => handleUpdateStructuredField('maxBarsCalculate', e.target.value)}
                          placeholder="e.g. 1000 Bars"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Visual Plots & Buffers</span>
                        <input
                          type="text"
                          value={structured.indicatorPlots || 'Signal Arrows & Chart Overlay Zones'}
                          onChange={(e) => handleUpdateStructuredField('indicatorPlots', e.target.value)}
                          placeholder="e.g. Signal Arrows, Shaded FVG Boxes, EMA Lines"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Alert Delivery Suite</span>
                        <input
                          type="text"
                          value={structured.alertTypes || 'Terminal Popup, Sound Alert, MT5 Mobile Push'}
                          onChange={(e) => handleUpdateStructuredField('alertTypes', e.target.value)}
                          placeholder="e.g. Terminal Popup, Sound Alert, MT5 Mobile Push"
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Trading Conditions & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      Trading Sessions
                    </label>
                    <input
                      type="text"
                      value={structured.sessions}
                      onChange={(e) => handleUpdateStructuredField('sessions', e.target.value)}
                      placeholder="e.g. London + New York"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      News Filter
                    </label>
                    <input
                      type="text"
                      value={structured.newsFilter}
                      onChange={(e) => handleUpdateStructuredField('newsFilter', e.target.value)}
                      placeholder="e.g. Pause during high-impact"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                      Max Spread
                    </label>
                    <input
                      type="text"
                      value={structured.maxSpread}
                      onChange={(e) => handleUpdateStructuredField('maxSpread', e.target.value)}
                      placeholder="e.g. 1.5 Pips"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>

                {/* Additional Rules */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                    ADDITIONAL RULES & SPECIAL CONDITIONS
                  </label>
                  <textarea
                    rows={2}
                    value={structured.additionalRules}
                    onChange={(e) => handleUpdateStructuredField('additionalRules', e.target.value)}
                    placeholder="Any special operational rules, cancellation conditions, or custom indicators..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action CTA: Interpret with AI or Review */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Your natural description is preserved as the source of truth.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleProceedToReview}
                disabled={!description.trim() || isAiAnalyzing}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Review Manually
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInterpretWithAi()}
                disabled={!description.trim() || isAiAnalyzing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAiAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>INTERPRETING WITH AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>INTERPRET WITH AI (CHATGPT ENGINE)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: REVIEW YOUR STRATEGY (Two Output Modes)               */}
      {/* ------------------------------------------------------------- */}
      {step === 'review' && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Review Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                  STEP 2 OF 2
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  REVIEW YOUR STRATEGY
                </h2>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {analysisResult.status === 'CLARIFICATION REQUIRED' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    CLARIFICATION REQUIRED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    STRATEGY READY FOR REVIEW
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              Please review the strategy below and make sure it accurately represents your rules before continuing.
            </p>

            {/* AI Lead Architect Interpretation Box */}
            {chatGptResponse ? (
              <div className="mt-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 border border-emerald-500/30 text-slate-100 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                        <span>{buildType === 'EA' ? 'MEG.AI Quantitative Architect' : 'MEG.AI Indicator Architect'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {systemTitle || `${buildType === 'EA' ? 'Automated MQL5 EA' : 'Custom Signal Indicator'} Blueprint`}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                    {buildType === 'EA' ? 'EA Execution Engine' : 'Indicator Signal Engine'}
                  </span>
                </div>

                {/* Conversational AI Output */}
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 mb-4">
                  {chatGptResponse}
                </div>

                {/* Follow-up Refinement Bar */}
                <div className="pt-1">
                  <label className="block text-[11px] font-mono text-emerald-400 font-semibold mb-1.5">
                    Refine or give further instructions to ChatGPT:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={followUpInput}
                      onChange={(e) => setFollowUpInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendFollowUp();
                        }
                      }}
                      placeholder={buildType === 'EA'
                        ? "e.g. 'Add a 1.5 ATR trailing stop', 'Only trade London session', 'Close trades Friday at 20:00'..."
                        : "e.g. 'Draw shaded zones for FVGs', 'Add mobile push notifications', 'Calculate on bar close only'..."}
                      className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleSendFollowUp}
                      disabled={!followUpInput.trim() || isSendingFollowUp}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSendingFollowUp ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Refine</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Want deeper AI quantitative interpretation and interactive refinement?</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInterpretWithAi()}
                  disabled={isAiAnalyzing}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isAiAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                  <span>Interpret with ChatGPT</span>
                </button>
              </div>
            )}

            {/* Clarification Alert Box (Interactive & Clickable to Confirm Ambiguities) */}
            {(() => {
              const activeClarifications = (aiClarifications.length > 0 ? aiClarifications : analysisResult.clarifications);
              if (activeClarifications.length === 0) return null;

              const totalCount = activeClarifications.length;
              const resolvedCount = activeClarifications.filter(c => !!confirmedClarifications[c.id]).length;

              return (
                <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/70 pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-950">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Ambiguities to Confirm:</span>
                      <span className="text-[11px] font-normal text-amber-800 lowercase">
                        (click any option to resolve and update strategy specification)
                      </span>
                    </div>

                    <div className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white border border-amber-300 font-semibold text-amber-900">
                      {resolvedCount} of {totalCount} Confirmed
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeClarifications.map((item) => {
                      const confirmedChoice = confirmedClarifications[item.id];
                      const options = (item.suggestedOptions && item.suggestedOptions.length > 0)
                        ? item.suggestedOptions
                        : ['Standard Institutional Baseline', 'Configurable Input Parameter'];

                      return (
                        <div 
                          key={item.id} 
                          className={`p-3 rounded-xl border transition-all ${
                            confirmedChoice
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                              : 'bg-white/80 border-amber-200/80 text-amber-950 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs font-semibold">
                              <span className="font-mono uppercase text-[11px] px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900 mr-1.5">
                                {item.topic}
                              </span>
                              {item.question}
                            </p>

                            {confirmedChoice && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
                                <Check className="w-3 h-3" />
                                Confirmed: {confirmedChoice}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                              Choose baseline:
                            </span>
                            {options.map((opt, i) => {
                              const isSelected = confirmedChoice === opt;

                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleResolveClarification(item, opt)}
                                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                                    isSelected
                                      ? 'bg-emerald-700 border-emerald-800 text-white font-bold shadow-xs'
                                      : 'bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-900'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* TWO REVIEW OUTPUT MODES TOGGLE */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-200/70 border border-slate-300/80">
              <button
                type="button"
                onClick={() => setReviewMode('clear')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                  reviewMode === 'clear'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>VIEW AS CLEAR STRATEGY</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewMode('prompt')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                  reviewMode === 'prompt'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>VIEW AS PROMPT</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>EDIT STRATEGY</span>
              </button>

              <button
                type="button"
                onClick={handleCopyOutput}
                className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-emerald-700" />}
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
          </div>

          {/* MAIN OUTPUT DISPLAY */}
          {reviewMode === 'clear' ? (
            <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs text-slate-400">
                <span className="font-bold text-emerald-400 font-mono">
                  PLAIN-ENGLISH STRATEGY SPECIFICATION
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Human-readable review • Free Specification
                </span>
              </div>

              <pre className="whitespace-pre-wrap font-mono text-slate-200 overflow-x-auto selection:bg-emerald-800 selection:text-white">
                {sanitizeProfessionalOutput(blueprintMarkdown || clearStrategy)}
              </pre>
            </div>
          ) : !isMemberUnlocked ? (
            /* LOCKED PROMPT SCREEN FOR FREE USERS */
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-slate-950 text-slate-100 p-8 sm:p-12 text-center">
              {/* Blurred background preview of the generated prompt */}
              <div className="absolute inset-0 p-6 overflow-hidden opacity-10 filter blur-xs pointer-events-none select-none font-mono text-xs text-left">
                <pre className="whitespace-pre-wrap">{sanitizeProfessionalOutput(aiDevPrompt || devPrompt)}</pre>
              </div>

              <div className="relative z-10 max-w-xl mx-auto space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Exclusive Ecosystem Benefit</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    AI Development Prompt Locked
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    Your strategy has been converted into a professional AI development prompt with detailed instructions, structure, rules, and development requirements.
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                    Available exclusively to MEGA AI Labs Ecosystem members. Unlock your complete prompt and use it with your preferred AI development tools.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowUnlockModal(true)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Key className="w-4 h-4" />
                    <span>Unlock My AI Development Prompt</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setReviewMode('clear')}
                    className="w-full sm:w-auto px-5 py-3 rounded-full border border-slate-700 hover:bg-slate-900 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View Strategy Specification
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Free users can view and copy the plain-English strategy specification at any time.</span>
                </div>
              </div>
            </div>
          ) : (
            /* UNLOCKED STATE FOR PAID ECOSYSTEM MEMBERS */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-200 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">
                      Ecosystem Member Unlocked
                    </div>
                    <p className="text-xs text-slate-200 font-sans mt-0.5">
                      Your complete AI development prompt is ready. Use it with your preferred AI development tool to build your trading system.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyOutput}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'PROMPT COPIED!' : 'Copy Complete Prompt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStrategySubmit}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Have MEGA Build It</span>
                  </button>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs text-slate-400">
                  <span className="font-bold text-emerald-400">AI DEVELOPMENT PROMPT</span>
                  <span className="text-[11px] text-slate-500">Production MQL5 specification</span>
                </div>

                <pre className="whitespace-pre-wrap font-mono text-slate-200 overflow-x-auto selection:bg-emerald-800 selection:text-white">
                  {aiDevPrompt || devPrompt}
                </pre>
              </div>
            </div>
          )}

          {/* ORIGINAL CLIENT STRATEGY ACCORDION (Source of truth preserved) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <button
              type="button"
              onClick={() => setShowOriginalInReview(!showOriginalInReview)}
              className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-600 font-bold cursor-pointer"
            >
              <span>ORIGINAL CLIENT STRATEGY (SOURCE OF TRUTH)</span>
              {showOriginalInReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showOriginalInReview && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-3.5 rounded-xl">
                {description || 'No initial description recorded.'}
              </div>
            )}
          </div>

          {/* CLIENT CONTACT & PLATFORM SPECIFICATION (Required for Review & Developer Dispatch) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
                  Contact Information & Target Platform
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Direct channels for parameter clarification, strategy audit, and development quotation.
                </p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                {(['MT5', 'MT4', 'cTrader'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      platform === p ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  FULL NAME <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  EMAIL ADDRESS <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => {
                    setClientEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="trader@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Phone / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => {
                    setClientPhone(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. +1 555 123 4567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  TELEGRAM USERNAME (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={clientTelegram}
                  onChange={(e) => setClientTelegram(e.target.value)}
                  placeholder="@telegram_handle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-sans">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-medium">{validationError}</span>
              </div>
            )}
          </div>

          {/* SUBMISSION / FINAL ACTIONS SECTION */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep('input')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Back to Strategy Inputs</span>
            </button>

            {/* FREE TOOL ACTIONS */}
            {mode === 'free-tool' && (
              <div className="flex flex-wrap items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-end">
                {reviewMode === 'prompt' ? (
                  !isMemberUnlocked ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowUnlockModal(true)}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Unlock My AI Development Prompt</span>
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStrategySubmit}
                        disabled={isSubmitting}
                        className="px-7 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <span>SUBMITTING STRATEGY...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-emerald-400" />
                            <span>Have MEGA Build It</span>
                          </>
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCopyOutput}
                        className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'PROMPT COPIED!' : 'Copy Complete Prompt'}</span>
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStrategySubmit}
                        disabled={isSubmitting}
                        className="px-7 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <span>SUBMITTING STRATEGY...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-emerald-400" />
                            <span>Have MEGA Build It</span>
                          </>
                        )}
                      </motion.button>
                    </>
                  )
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCopyOutput}
                      className="px-5 py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY SPECIFICATION'}</span>
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStrategySubmit}
                      disabled={isSubmitting}
                      className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span>SUBMITTING STRATEGY...</span>
                      ) : (
                        <>
                          <span>SUBMIT STRATEGY / BUILD THIS FOR ME</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </div>
            )}

            {/* CUSTOM EA MODE ACTIONS */}
            {mode === 'custom-ea' && (
              <div className="w-full sm:w-auto order-1 sm:order-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStrategySubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>SUBMITTING STRATEGY...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SUBMIT STRATEGY FOR DEVELOPMENT</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: SUBMITTED CONFIRMATION (Custom EA)                     */}
      {/* ------------------------------------------------------------- */}
      {step === 'submitted' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-emerald-300 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-lg space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
              Project Specification Received
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Strategy Submitted For Development
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your verified strategy has been logged. Our development team will review the parameters and contact you with confirmation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 max-w-sm mx-auto space-y-1 text-left">
            <div><span className="text-slate-400">Reference:</span> <span className="font-bold text-slate-900">{submissionSuccessId}</span></div>
            <div><span className="text-slate-400">Platform:</span> <span className="font-bold text-slate-900">{platform}</span></div>
            <div><span className="text-slate-400">Asset:</span> <span className="font-bold text-slate-900">{structured.instrument}</span></div>
            <div><span className="text-slate-400">Timeframe:</span> <span className="font-bold text-slate-900">{structured.timeframe}</span></div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopyOutput}
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED SPECIFICATION' : 'COPY SPECIFICATION'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('input');
                setDescription('');
                setHasManuallyEditedStructured(false);
              }}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Submit Another Strategy
            </button>
          </div>
        </motion.div>
      )}

      {/* ECOSYSTEM UNLOCK MODAL */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-slate-950 rounded-3xl border border-amber-500/40 shadow-2xl p-6 sm:p-8 text-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block">
                    MEGA AI Labs Ecosystem
                  </span>
                  <span className="text-sm font-bold text-white">Unlock AI Development Prompt</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                AI Development Prompt Locked
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                Your strategy has been converted into a professional AI development prompt with detailed instructions, structure, rules, and development requirements.
                Available exclusively to MEGA AI Labs Ecosystem members. Unlock your complete prompt and use it with your preferred AI development tools.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Instant Ecosystem Unlock</div>
                    <div className="text-[11px] text-slate-400 font-sans">Unlock prompt immediately for this session</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEcosystemMember(true);
                      setIsMemberUnlocked(true);
                      setShowUnlockModal(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    Unlock Prompt
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Have MEGA Build It</div>
                    <div className="text-[11px] text-slate-400 font-sans">Institutional MQL5 quants will build, backtest & verify it</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUnlockModal(false);
                      handleStrategySubmit();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Get Free Quote
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center font-mono">
                Free users can always view and copy the plain-English strategy specification.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
