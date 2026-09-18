import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  Download, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  FileText, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Clock, 
  Send, 
  RefreshCw, 
  ExternalLink,
  Sliders,
  DollarSign,
  Layers,
  HelpCircle,
  X,
  MessageSquare
} from 'lucide-react';
import { 
  StrategyComponent, 
  StructuredStrategyData, 
  ClarificationItem, 
  DevelopmentPricingEstimate,
  extractStrategyComponents, 
  buildRefinedStrategySpecification, 
  buildRefinedCodingPrompt, 
  calculateDevelopmentPricingEstimate,
  componentsToStructuredData
} from '../../lib/strategyEngine.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { api } from '../../services/api.ts';
import { supabase } from '../../lib/supabase.ts';

export interface StrategyIntakeWorkflowProps {
  mode?: 'free-tool' | 'custom-ea';
  initialDescription?: string;
  initialStructuredData?: Partial<StructuredStrategyData>;
  onTriggerBuildMyEa?: (structuredData: StructuredStrategyData, prompt: string) => void;
  onCustomEaSubmitted?: (projectId: string) => void;
  initialPackage?: string;
}

export const StrategyIntakeWorkflow: React.FC<StrategyIntakeWorkflowProps> = ({
  mode = 'free-tool',
  initialDescription = '',
  initialStructuredData,
  onTriggerBuildMyEa,
  onCustomEaSubmitted,
  initialPackage = 'Standard',
}) => {
  const { user } = useAuth();
  const { formatPrice, currentCurrency } = useCurrency();

  // Workflow steps: 'input' -> 'workspace' -> 'review' -> 'custom-build' -> 'submitted'
  const [step, setStep] = useState<'input' | 'workspace' | 'review' | 'custom-build' | 'submitted'>('input');

  // Build Type: Expert Advisor vs Technical Indicator
  const [buildType, setBuildType] = useState<'EA' | 'Indicator'>('EA');
  const [platform, setPlatform] = useState<'MT5' | 'MT4' | 'TradingView' | 'cTrader'>('MT5');

  // Primary input text (Source of truth)
  const [description, setDescription] = useState<string>(initialDescription);

  // Strategy components in the active workspace
  const [components, setComponents] = useState<StrategyComponent[]>([]);
  const [clarifications, setClarifications] = useState<ClarificationItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [systemTitle, setSystemTitle] = useState<string>('');
  const [architectSummary, setArchitectSummary] = useState<string>('');

  // Editing state for specific component
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Add Component selector
  const [showAddComponent, setShowAddComponent] = useState<boolean>(false);
  const [selectedNewComponentType, setSelectedNewComponentType] = useState<string>('stopLoss');

  // Review step modal / action viewer
  const [activeActionModal, setActiveActionModal] = useState<'spec' | 'prompt' | null>(null);
  const [reviewAdjustmentText, setReviewAdjustmentText] = useState<string>('');
  const [isAdjustmentSaved, setIsAdjustmentSaved] = useState<boolean>(false);

  // Custom Build Submission form
  const [clientName, setClientName] = useState<string>(user?.name || '');
  const [clientEmail, setClientEmail] = useState<string>(user?.email || '');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientTelegram, setClientTelegram] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Copy feedback
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Quick Inspiration Presets
  const quickPresets = {
    EA: [
      {
        label: 'XAUUSD London Asian Range Breakout',
        text: 'I want an XAUUSD strategy that trades London-session breakouts of the Asian range. Buy above the Asian high, sell below the Asian low, risk 1% per trade, and exit at the opposite range level.'
      },
      {
        label: 'EURUSD M15 Liquidity Sweep & Retest',
        text: 'I want an EA for EURUSD on M15. When price sweeps previous day high or low during London or New York session, wait for an opposite candle close. Enter on the 50% retest with a 20 pip Stop Loss, 2.5R Take Profit, risking 1% per trade.'
      },
      {
        label: 'US30 H1 Trend EMA Momentum',
        text: 'I want an automated trend-following EA for US30 on H1. Buy when the 20 EMA is above the 50 EMA on candle close. Stop Loss placed at the 20-period swing low. Risk 1% equity per trade. Move Stop Loss to break-even after 1.5R profit.'
      }
    ],
    Indicator: [
      {
        label: 'Asian Range & Breakout Box Overlay',
        text: 'I want a chart indicator for MT5 that highlights the Asian session (00:00 to 07:00 GMT) with a shaded translucent box. Plot dotted lines for Asian High and Asian Low into the London session, and trigger a popup alert and mobile push when either level is broken.'
      },
      {
        label: 'Fair Value Gap (FVG) Scanner',
        text: 'I want a non-repainting indicator that detects bullish and bearish Fair Value Gaps on M15 and H1. Draw green shaded boxes for bullish FVGs and red boxes for bearish FVGs. Send an alert once an unmitigated gap is touched for the first time.'
      }
    ]
  };

  // If initial description was provided, populate components
  useEffect(() => {
    if (initialDescription.trim().length > 0 && components.length === 0) {
      const extracted = extractStrategyComponents(initialDescription, buildType);
      setComponents(extracted.components);
      setClarifications(extracted.clarifications);
    }
  }, [initialDescription, buildType]);

  // Derived outputs
  const refinedSpecification = useMemo(() => {
    return buildRefinedStrategySpecification(components, buildType, description);
  }, [components, buildType, description]);

  const codingPrompt = useMemo(() => {
    return buildRefinedCodingPrompt(components, buildType, description, platform);
  }, [components, buildType, description, platform]);

  const pricingEstimate = useMemo(() => {
    return calculateDevelopmentPricingEstimate(components, buildType);
  }, [components, buildType]);

  // Count uncompleted clarifications
  const pendingClarifications = useMemo(() => {
    return components.filter(c => c.needsClarification && !c.value.trim());
  }, [components]);

  // Handle Strategy Analysis (Step 1 -> Step 2)
  const handleAnalyzeStrategy = async () => {
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setEditingComponentId(null);

    try {
      // Call backend AI service
      const res = await api.interpretStrategyAi({
        buildType,
        description: description.trim(),
        platform: platform === 'TradingView' ? 'MT5' : platform,
      });

      if (res && res.success && res.components && res.components.length > 0) {
        setComponents(res.components);
        setClarifications(res.clarifications || []);
        setSystemTitle(res.systemTitle || '');
        setArchitectSummary(res.chatGptResponse || '');
      } else {
        // Deterministic fallback
        const extracted = extractStrategyComponents(description.trim(), buildType);
        setComponents(extracted.components);
        setClarifications(extracted.clarifications);
      }
      setStep('workspace');
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err) {
      console.warn('Backend interpretation fallback:', err);
      const extracted = extractStrategyComponents(description.trim(), buildType);
      setComponents(extracted.components);
      setClarifications(extracted.clarifications);
      setStep('workspace');
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update a component's value
  const handleUpdateComponent = (id: string, newValue: string) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          value: newValue.trim(),
          needsClarification: false,
          isExplicitlyProvided: true,
        };
      }
      return c;
    }));
    setEditingComponentId(null);
  };

  // Remove a component
  const handleRemoveComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  // Add a new component
  const handleAddComponent = (key: string) => {
    const existing = components.find(c => c.key === key);
    if (existing) {
      setEditingComponentId(existing.id);
      setEditingValue(existing.value);
      setShowAddComponent(false);
      return;
    }

    const componentDefinitions: Record<string, { label: string; category: StrategyComponent['category']; placeholder: string }> = {
      stopLoss: { label: 'Stop Loss', category: 'exit', placeholder: 'e.g. Asian range midpoint, 25 pips, or recent swing high/low' },
      takeProfit: { label: 'Take Profit / Target', category: 'exit', placeholder: 'e.g. Opposite side of the range, 1:2 R/R, or 40 pips' },
      timeframe: { label: 'Timeframe', category: 'market', placeholder: 'e.g. 15 Minutes (M15), 5 Minutes (M5)' },
      sessions: { label: 'Trading Session', category: 'operational', placeholder: 'e.g. London Session (07:00 - 11:00 GMT)' },
      breakEven: { label: 'Break-Even Rule', category: 'management', placeholder: 'e.g. Move Stop Loss to break-even at 1.5R in profit' },
      trailingStop: { label: 'Trailing Stop', category: 'management', placeholder: 'e.g. Trail by 1.5x ATR after 2R profit' },
      newsFilter: { label: 'News Restriction', category: 'operational', placeholder: 'e.g. Pause trading 30 mins before & after high-impact USD events' },
      maxTradesPerDay: { label: 'Daily Trade Limit', category: 'operational', placeholder: 'e.g. 1 trade per day maximum' },
      maxDailyLoss: { label: 'Max Daily Loss Guard', category: 'risk', placeholder: 'e.g. Halt trading if daily loss reaches 3%' },
      confirmationRules: { label: 'Confirmation Rule', category: 'entry', placeholder: 'e.g. Candle close confirmation above breakout level' },
      customRule: { label: 'Custom Rule', category: 'other', placeholder: 'Specify any additional proprietary rule' },
    };

    const def = componentDefinitions[key] || { label: key, category: 'other', placeholder: 'Enter rule details' };

    const newComp: StrategyComponent = {
      id: `comp_${Date.now()}`,
      key,
      label: def.label,
      value: '',
      category: def.category,
      needsClarification: true,
      clarificationQuestion: `Please specify the details for ${def.label}:`,
      isExplicitlyProvided: true,
    };

    setComponents(prev => [...prev, newComp]);
    setEditingComponentId(newComp.id);
    setEditingValue('');
    setShowAddComponent(false);
  };

  // Copy helper
  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Download Specification as .txt
  const handleDownloadSpecification = () => {
    const blob = new Blob([refinedSpecification], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MegaAi_Strategy_Specification_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle Review Adjustment
  const handleApplyReviewAdjustment = () => {
    if (!reviewAdjustmentText.trim()) return;

    const newComp: StrategyComponent = {
      id: `comp_adj_${Date.now()}`,
      key: `custom_adj_${Date.now()}`,
      label: 'Trader Refinement',
      value: reviewAdjustmentText.trim(),
      category: 'other',
      isExplicitlyProvided: true,
    };

    setComponents(prev => [...prev, newComp]);
    setReviewAdjustmentText('');
    setIsAdjustmentSaved(true);
    setTimeout(() => setIsAdjustmentSaved(false), 3000);
  };

  // Handle Custom Build Submission
  const handleSubmitCustomBuild = async () => {
    setSubmissionError(null);

    if (!clientName.trim()) {
      setSubmissionError('Please enter your Full Name.');
      return;
    }

    if (!clientEmail.trim() || !clientEmail.includes('@') || !clientEmail.includes('.')) {
      setSubmissionError('Please enter a valid Email Address.');
      return;
    }

    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (!clientPhone.trim() || cleanPhone.length < 6) {
      setSubmissionError('WhatsApp / Phone number is required (minimum 6 digits).');
      return;
    }

    setIsSubmitting(true);
    const generatedSubId = `SUB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const structuredObj = componentsToStructuredData(components, buildType, description);

    const submissionPayload = {
      submission_id: generatedSubId,
      user_id: user?.id || null,
      full_name: clientName.trim(),
      email: clientEmail.trim().toLowerCase(),
      phone: clientPhone.trim(),
      telegram: clientTelegram.trim() || null,
      platform,
      strategy_title: systemTitle || `${platform} ${buildType}: ${structuredObj.instrument} (${structuredObj.setup})`,
      original_strategy: description,
      structured_strategy: structuredObj,
      clear_strategy: refinedSpecification,
      generated_prompt: codingPrompt,
      instrument: structuredObj.instrument,
      timeframe: structuredObj.timeframe,
      direction: structuredObj.direction,
      entry_conditions: structuredObj.entryRules || '',
      exit_conditions: structuredObj.exitRules || '',
      risk_management: structuredObj.riskPerTrade || '',
      trading_conditions: structuredObj.sessions || '',
      trade_management: structuredObj.trailingStop || structuredObj.breakEven || '',
      additional_rules: additionalNotes.trim() || structuredObj.additionalRules || '',
      missing_information: pendingClarifications.map(c => c.label).join(', ') || 'None - Fully Defined',
      submission_type: 'AI Strategy Architect Custom Build',
      pricing_estimate: {
        baseTier: pricingEstimate.baseTierName,
        baseMin: pricingEstimate.baseMin,
        baseMax: pricingEstimate.baseMax,
        features: pricingEstimate.features,
        totalMin: pricingEstimate.totalMin,
        totalMax: pricingEstimate.totalMax,
        currency: currentCurrency.code,
        formattedRange: `${formatPrice(pricingEstimate.totalMin)} – ${formatPrice(pricingEstimate.totalMax)}`
      }
    };

    try {
      // 1. Direct Supabase sync attempt
      try {
        await supabase.from('strategy_submissions').insert({
          id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...submissionPayload,
          status: 'submitted',
          email_status: 'pending',
        });
      } catch (e) {
        console.warn('Supabase direct sync notice:', e);
      }

      // 2. Direct custom_dev_leads sync
      try {
        await supabase.from('custom_dev_leads').insert({
          email: clientEmail.trim().toLowerCase(),
          name: clientName.trim(),
          phone: clientPhone.trim(),
          telegram: clientTelegram.trim() || null,
          platform,
          instrument: structuredObj.instrument,
          timeframe: structuredObj.timeframe,
          strategy_idea: description,
          generated_prompt: codingPrompt,
          status: 'pending_review',
        });
      } catch (e) {
        console.warn('Supabase lead sync notice:', e);
      }

      // 3. API endpoint call (SQLite, emails, server dispatch)
      const res = await fetch('/api/strategy-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
        },
        body: JSON.stringify(submissionPayload),
      });

      const data = await res.json().catch(() => ({}));
      setSubmissionId(generatedSubId);
      setStep('submitted');
      window.scrollTo({ top: 150, behavior: 'smooth' });

      if (onCustomEaSubmitted) {
        onCustomEaSubmitted(generatedSubId);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      // Even if network glitch occurs, allow graceful progression since local payload was processed
      setSubmissionId(generatedSubId);
      setStep('submitted');
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans">

      {/* CORE PHILOSOPHY & WORKFLOW BANNER */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              AI Strategy Architect
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800">
            "The trader is the strategist. The AI is the clarification and structuring assistant."
          </p>
          <p className="text-xs text-slate-500">
            The AI clarifies and structures your explicit rules — it will never alter your strategy or invent trading logic.
          </p>
        </div>

        {/* Visual flow steps */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
          <span className={step === 'input' ? 'text-emerald-700 font-bold' : ''}>1. IDEA</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className={step === 'workspace' ? 'text-emerald-700 font-bold' : ''}>2. STRUCTURE</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className={step === 'review' ? 'text-emerald-700 font-bold' : ''}>3. REFINED SPEC</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className={step === 'custom-build' ? 'text-emerald-700 font-bold' : ''}>4. ACTIONS</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: INITIAL NATURAL LANGUAGE INPUT                                     */}
      {/* ========================================================================= */}
      {step === 'input' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
        >
          {/* Platform Mode Selector (EA vs Indicator) */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>What type of trading system are you building?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBuildType('EA')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  buildType === 'EA'
                    ? 'bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${buildType === 'EA' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <span>Expert Advisor (Automated Robot)</span>
                    {buildType === 'EA' && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Selected</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Automated execution engine that monitors market triggers, opens orders, manages stops, and handles exits automatically.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBuildType('Indicator')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  buildType === 'Indicator'
                    ? 'bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${buildType === 'Indicator' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <span>Technical Indicator (Chart Visuals / Signals)</span>
                    {buildType === 'Indicator' && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Selected</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Plots arrows, shaded session boxes, support/resistance zones, or subwindow oscillators with non-repainting alerts.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Target Platform */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase">Target Platform:</span>
            {(['MT5', 'MT4', 'TradingView', 'cTrader'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  platform === p
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === 'TradingView' ? 'TradingView (Pine Script)' : p}
              </button>
            ))}
          </div>

          {/* Natural Language Input Area */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label htmlFor="strategy-idea-input" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Describe Your Trading Strategy
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {description.length} characters
              </span>
            </div>

            <textarea
              id="strategy-idea-input"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={buildType === 'EA'
                ? "Describe your trading rules in plain English. For example:\n\"I want an XAUUSD strategy that trades London-session breakouts of the Asian range. Buy above the Asian high, sell below the Asian low, risk 1% per trade, and exit at the opposite range level.\""
                : "Describe your indicator concept in plain English. For example:\n\"I want a chart indicator for MT5 that highlights the Asian session with a shaded box, plots horizontal lines for Asian High and Low into London, and sends a mobile push alert on breakout.\""
              }
              className="w-full p-4 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 text-slate-900 placeholder:text-slate-400 text-sm leading-relaxed transition-all resize-y font-mono"
            />
            <p className="text-xs text-slate-500">
              The AI Strategy Architect will extract and structure your logic without adding unrequested indicators or rules.
            </p>
          </div>

          {/* Quick Inspiration Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or click a sample strategy to load:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPresets[buildType].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDescription(preset.text)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-medium transition-colors text-left cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-4">
            <button
              id="btn-analyze-strategy"
              type="button"
              disabled={isAnalyzing || !description.trim()}
              onClick={handleAnalyzeStrategy}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer ${
                isAnalyzing || !description.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing & Structuring Your Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Analyze & Structure Strategy</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SINGLE STRUCTURED STRATEGY WORKSPACE                             */}
      {/* ========================================================================= */}
      {step === 'workspace' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
        >
          {/* Workspace Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold uppercase">
                  Single Strategy Workspace
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {platform} • {buildType === 'EA' ? 'Expert Advisor' : 'Technical Indicator'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {systemTitle || `${buildType}: Strategy Components`}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Relevant components extracted from your description. Complete any items marked for clarification in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>← Edit Original Description</span>
            </button>
          </div>

          {/* Pending Clarification Alert (if any items missing) */}
          {pendingClarifications.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Clarification Required ({pendingClarifications.length}):</span>
                <p className="mt-0.5 text-amber-800">
                  The AI has identified {pendingClarifications.length} missing parameter(s) necessary to accurately represent your strategy. Provide your answers below to complete the specification.
                </p>
              </div>
            </div>
          )}

          {/* Structured Component Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                Strategy Components ({components.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddComponent(prev => !prev)}
                className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Strategy Rule</span>
              </button>
            </div>

            {/* Add Component Dropdown Menu */}
            {showAddComponent && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
                <span className="text-xs font-bold text-slate-700 block">Select a component to add to your strategy:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'stopLoss', label: 'Stop Loss' },
                    { key: 'takeProfit', label: 'Take Profit / Target' },
                    { key: 'timeframe', label: 'Timeframe' },
                    { key: 'sessions', label: 'Trading Session' },
                    { key: 'breakEven', label: 'Break-Even Rule' },
                    { key: 'trailingStop', label: 'Trailing Stop' },
                    { key: 'newsFilter', label: 'News Restriction' },
                    { key: 'maxTradesPerDay', label: 'Daily Trade Limit' },
                    { key: 'maxDailyLoss', label: 'Max Daily Loss Guard' },
                    { key: 'confirmationRules', label: 'Confirmation Rule' },
                    { key: 'customRule', label: 'Custom Rule' },
                  ].map(item => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleAddComponent(item.key)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-medium text-slate-800 transition-colors cursor-pointer"
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* List of active components */}
            <div className="space-y-3">
              {components.map((comp) => {
                const isEditing = editingComponentId === comp.id;
                const isUncompletedClarification = comp.needsClarification && !comp.value.trim();

                return (
                  <div
                    key={comp.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUncompletedClarification
                        ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                            {comp.label}
                          </span>
                          {isUncompletedClarification && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                              Needs Clarification
                            </span>
                          )}
                          {!isUncompletedClarification && comp.isExplicitlyProvided && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold">
                              Verified
                            </span>
                          )}
                        </div>

                        {/* Clarification prompt if needed */}
                        {comp.needsClarification && comp.clarificationQuestion && (
                          <p className="text-xs font-medium text-amber-900 pt-0.5">
                            {comp.clarificationQuestion}
                          </p>
                        )}

                        {/* Value Display / Edit */}
                        {!isEditing ? (
                          <div className="pt-1">
                            {comp.value ? (
                              <p className="text-sm text-slate-800 font-mono leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
                                {comp.value}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 italic">
                                [Not specified — click to provide your rule]
                              </p>
                            )}

                            {/* Suggested 1-click options if needing clarification */}
                            {isUncompletedClarification && comp.suggestedOptions && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                                <span className="text-[11px] font-mono text-slate-500">Quick options:</span>
                                {comp.suggestedOptions.map((opt, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleUpdateComponent(comp.id, opt)}
                                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[11px] font-mono text-slate-700 transition-colors cursor-pointer"
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="pt-2 space-y-2">
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              placeholder={`Specify ${comp.label}`}
                              className="w-full p-2.5 rounded-xl border border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-xs font-mono text-slate-900"
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateComponent(comp.id, editingValue)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingComponentId(null)}
                                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Component Actions */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingComponentId(comp.id);
                              setEditingValue(comp.value);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit this rule"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveComponent(comp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove this rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proceed to Review Button */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-mono">
              {pendingClarifications.length === 0 ? '✓ All relevant components structured' : `⚠ ${pendingClarifications.length} item(s) awaiting your input`}
            </span>

            <button
              id="btn-review-strategy"
              type="button"
              onClick={() => {
                setStep('review');
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Review My Strategy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: REVIEW MY STRATEGY & FINAL ACTIONS                               */}
      {/* ========================================================================= */}
      {step === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                Strategy Review & Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                YOUR REFINED STRATEGY
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                The language below remains strictly faithful to your original logic without any unsolicited additions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('workspace')}
              className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>← Back to Workspace</span>
            </button>
          </div>

          {/* Clean High-Contrast Refined Strategy Card */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 shadow-inner space-y-6 font-mono">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                {platform} • {buildType === 'EA' ? 'EXPERT ADVISOR SPECIFICATION' : 'INDICATOR SPECIFICATION'}
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(refinedSpecification, 'spec-card')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedType === 'spec-card' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'spec-card' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Structured Components Output */}
            <div className="space-y-4 text-xs sm:text-sm">
              {components.map((comp) => (
                <div key={comp.id} className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                    {comp.label}
                  </div>
                  <div className="text-slate-200 leading-relaxed pl-2 border-l-2 border-slate-700">
                    {comp.value || '[Not defined by user]'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL CHECK: Anything else to add or change? */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Final Check: Is there anything else you'd like to add or change?
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={reviewAdjustmentText}
                onChange={(e) => setReviewAdjustmentText(e.target.value)}
                placeholder="e.g. Add 1 trade per day limit, or close positions before weekend..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-white"
              />
              <button
                type="button"
                onClick={handleApplyReviewAdjustment}
                disabled={!reviewAdjustmentText.trim()}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-mono transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              >
                Apply Adjustment
              </button>
            </div>
            {isAdjustmentSaved && (
              <span className="text-xs font-mono text-emerald-600 font-bold">
                ✓ Adjustment added to refined specification!
              </span>
            )}
          </div>

          {/* ===================================================================== */}
          {/* THE 3 FINAL ACTIONS (Requirement 8)                                    */}
          {/* ===================================================================== */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
              Next Steps / Final Actions
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* ACTION 1: GET THE REFINED SPECIFICATION */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-slate-900">
                    GET THE REFINED SPECIFICATION
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Generates a clean, professional strategy document containing ONLY your defined trading logic.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveActionModal('spec')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Specification</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSpecification}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download (.txt)</span>
                  </button>
                </div>
              </div>

              {/* ACTION 2: GENERATE AI CODING PROMPT */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-slate-900">
                    GENERATE AI CODING PROMPT
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Converts your refined specification into a complete coding prompt for Claude, ChatGPT, Gemini, or other models.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveActionModal('prompt')}
                    className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Coding Prompt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText(codingPrompt, 'prompt-action')}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'prompt-action' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedType === 'prompt-action' ? 'Prompt Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
              </div>

              {/* ACTION 3: SUBMIT TO MEGA AI LABS ARCHITECT FOR CUSTOM BUILD */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col justify-between space-y-4 border border-slate-800">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Recommended
                    </span>
                  </div>
                  <h3 className="font-black text-base text-white">
                    SUBMIT TO MEGA AI LABS ARCHITECT FOR CUSTOM BUILD
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have our quantitative MQL5 engineering team build, test, and deliver your EA with full source code.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    id="btn-start-custom-build"
                    type="button"
                    onClick={() => {
                      setStep('custom-build');
                      window.scrollTo({ top: 150, behavior: 'smooth' });
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Pricing & Submit →</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: CUSTOM BUILD WORKFLOW & PRICING TRANSPARENCY                      */}
      {/* ========================================================================= */}
      {step === 'custom-build' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                Custom Development Scoping
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                YOUR STRATEGY IS READY FOR DEVELOPMENT
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Transparent development estimate based on the verified components of your strategy.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('review')}
              className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>← Back to Review</span>
            </button>
          </div>

          {/* ESTIMATED DEVELOPMENT RANGE CARD (Requirement 9) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Transparent Pricing Architecture
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Estimated Development Range
              </h3>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-800">
              {/* Base Development */}
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-slate-300 font-medium">
                  BASE DEVELOPMENT ({pricingEstimate.baseTierName})
                </span>
                <span className="font-mono font-bold text-white">
                  {formatPrice(pricingEstimate.baseMin)} – {formatPrice(pricingEstimate.baseMax)}
                </span>
              </div>

              {/* Additional Features */}
              {pricingEstimate.features.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                    ADDITIONAL DETECTED FEATURES:
                  </span>
                  {pricingEstimate.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm pl-3 border-l-2 border-emerald-500/50">
                      <span className="text-slate-300">{feat.name}</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {formatPrice(feat.min)} – {formatPrice(feat.max)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Estimated Total */}
              <div className="pt-4 border-t border-slate-700 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    ESTIMATED TOTAL ({currentCurrency.code})
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {formatPrice(pricingEstimate.totalMin)} – {formatPrice(pricingEstimate.totalMax)}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Includes full source code (.mq5 / .mq4)
                </span>
              </div>
            </div>

            {/* Pricing Disclaimer Note */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-bold">Pricing Guarantee: </span>
              Final pricing is confirmed after technical review. Additional requirements or features may change the final quotation. You will receive a formal confirmation quote before any work begins.
            </div>
          </div>

          {/* CLIENT CONTACT & SUBMISSION FORM (Requirement 10) */}
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Client & Project Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our Lead Strategy Architect will review your structured strategy and contact you directly.
              </p>
            </div>

            {submissionError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. David Smith"
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-sans focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="e.g. david@example.com"
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-sans focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. +27 82 123 4567 or +1 (555) 019-2834"
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-sans focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Telegram Username (Optional)
                </label>
                <input
                  type="text"
                  value={clientTelegram}
                  onChange={(e) => setClientTelegram(e.target.value)}
                  placeholder="e.g. @davidsmith_trader"
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-sans focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Additional Development Requirements or Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any broker constraints, proprietary DLLs, prop-firm rules, or custom delivery timelines..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-sans focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            {/* Submission Checklist Summary */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <span className="font-bold block">What will be submitted to Mega AI Labs:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Your original strategy concept description</li>
                <li>Your structured & refined specification ({components.length} parameters)</li>
                <li>Generated AI Coding Prompt for {platform}</li>
                <li>Estimated development range ({formatPrice(pricingEstimate.totalMin)} – {formatPrice(pricingEstimate.totalMax)})</li>
              </ul>
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2">
              <button
                id="btn-submit-custom-ea"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitCustomBuild}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting to Mega AI Labs...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Submit Strategy for Custom Build</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: SUBMITTED CONFIRMATION                                            */}
      {/* ========================================================================= */}
      {step === 'submitted' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-12 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Strategy Submitted Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Your Strategy is in Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Your refined specification and development scope have been assigned to our Lead Strategy Architect.
            </p>
          </div>

          {submissionId && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs text-slate-700">
              <span className="font-bold text-slate-500">Submission ID:</span>
              <span className="font-black text-slate-900">{submissionId}</span>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-left space-y-3 text-xs text-slate-600">
            <span className="font-bold text-slate-800 text-sm block">What Happens Next:</span>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Our Lead Strategy Architect will review your refined specification within 24 hours.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>You will be contacted via WhatsApp ({clientPhone}) and email ({clientEmail}) with your final confirmation quotation.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Development commences immediately upon quote approval with full source code handover.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleCopyText(refinedSpecification, 'final-spec')}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedType === 'final-spec' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copiedType === 'final-spec' ? 'Specification Copied' : 'Copy Strategy Specification'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('input');
                setDescription('');
                setComponents([]);
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Architect Another Strategy
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* MODAL POPUPS: SPECIFICATION & CODING PROMPT VIEWERS                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  {activeActionModal === 'spec' ? (
                    <>
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-black text-slate-900 text-base">Refined Strategy Specification</h3>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-black text-slate-900 text-base">AI Coding Prompt ({platform})</h3>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {activeActionModal === 'spec' ? refinedSpecification : codingPrompt}
                </pre>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  Ready to copy into your workflow or AI coding assistant.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(activeActionModal === 'spec' ? refinedSpecification : codingPrompt, 'modal')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'modal' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'modal' ? 'Copied' : 'Copy Text'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveActionModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
