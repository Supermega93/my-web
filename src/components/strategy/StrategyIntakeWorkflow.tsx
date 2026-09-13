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
  HelpCircle
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
  const { user } = useAuth();

  // Primary strategy description (Source of truth)
  const [description, setDescription] = useState(initialDescription);
  
  // Secondary structured fields (Editable by client, auto-populated from description)
  const [structured, setStructured] = useState<StructuredStrategyData>(() => {
    return extractTechnicalDetailsFromDescription(initialDescription, initialStructuredData).structured;
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

  // Auto-extraction when primary description changes (unless client has manually customized fields)
  useEffect(() => {
    if (description.trim().length > 0 && !hasManuallyEditedStructured) {
      const result = extractTechnicalDetailsFromDescription(description, initialStructuredData);
      setStructured(result.structured);
    }
  }, [description, hasManuallyEditedStructured, initialStructuredData]);

  // Derived analysis result for review
  const analysisResult: StrategyExtractionResult = React.useMemo(() => {
    return extractTechnicalDetailsFromDescription(description, structured);
  }, [description, structured]);

  const devPrompt = React.useMemo(() => {
    return buildDevPrompt(structured);
  }, [structured]);

  const clearStrategy = React.useMemo(() => {
    return buildClearStrategy(structured);
  }, [structured]);

  const handleUpdateStructuredField = (field: keyof StructuredStrategyData, value: any) => {
    setHasManuallyEditedStructured(true);
    setStructured(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCopyOutput = () => {
    const textToCopy = reviewMode === 'prompt' ? devPrompt : clearStrategy;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
          strategy_title: `Custom ${platform} EA: ${structured.instrument} (${structured.timeframe})`,
          original_strategy: description,
          structured_strategy: structured,
          clear_strategy: clearStrategy,
          generated_prompt: devPrompt,
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
          generated_prompt: devPrompt,
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
          strategy_title: `Custom ${platform} EA: ${structured.instrument} (${structured.timeframe})`,
          original_strategy: description,
          structured_strategy: structured,
          clear_strategy: clearStrategy,
          generated_prompt: devPrompt,
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
          {/* SECTION 1: PRIMARY STRATEGY DESCRIPTION (Visually Dominant) */}
          <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  DESCRIBE YOUR STRATEGY
                </h2>
              </div>
              <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold tracking-wider">
                NO CODING REQUIRED
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 mb-5 leading-relaxed font-normal">
              Tell us exactly how your strategy works. You can explain it in your own words — no coding required.
            </p>

            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                placeholder="Describe your trading strategy in as much detail as you can. Include how you identify setups, when you enter, when you exit, how you manage risk, trading sessions, indicators, price action, filters and any other rules you use."
                className="w-full bg-slate-50/80 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base rounded-2xl p-4 sm:p-5 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans leading-relaxed resize-y"
              />

              {description.trim().length > 20 && (
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Primary source of truth captured
                  </span>
                  <span>{description.trim().length} characters</span>
                </div>
              )}
            </div>
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
                      <option value="Not specified">Not specified</option>
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

                {/* Risk Management Section */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    RISK MANAGEMENT
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
                        placeholder="e.g. 3% or Not specified"
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
                        placeholder="e.g. 2 trades or Not specified"
                        className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-2.5 py-2 mt-1 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-slate-500 uppercase">Break Even</span>
                      <input
                        type="text"
                        value={structured.breakEven}
                        onChange={(e) => handleUpdateStructuredField('breakEven', e.target.value)}
                        placeholder="e.g. Move at 1R or Not specified"
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

          {/* Action CTA: Move to Review */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Your description remains the source of truth. Review before submission.</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProceedToReview}
              disabled={!description.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>REVIEW YOUR STRATEGY</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
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

            {/* Clarification Alert Box (Only if genuine ambiguities were identified) */}
            {analysisResult.clarifications.length > 0 && (
              <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Ambiguities to Confirm:</span>
                </div>
                {analysisResult.clarifications.map((item) => (
                  <div key={item.id} className="text-xs text-amber-900 space-y-1.5">
                    <p className="font-semibold">{item.topic}: {item.question}</p>
                    {item.suggestedOptions && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.suggestedOptions.map((opt, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (item.topic.includes('TRIGGER')) {
                                handleUpdateStructuredField('entryTriggerType', opt as any);
                              }
                            }}
                            className="px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-900 text-[11px] font-mono hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs text-slate-400">
              <span className="font-bold text-emerald-400">
                {reviewMode === 'clear' ? 'PLAIN-ENGLISH STRATEGY CONFIRMATION' : 'AI DEVELOPMENT PROMPT'}
              </span>
              <span className="text-[11px] text-slate-500">
                {reviewMode === 'clear' ? 'Human-readable review' : 'Production MQL5 specification'}
              </span>
            </div>

            <pre className="whitespace-pre-wrap font-mono text-slate-200 overflow-x-auto selection:bg-emerald-800 selection:text-white">
              {reviewMode === 'clear' ? clearStrategy : devPrompt}
            </pre>
          </div>

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
                <button
                  type="button"
                  onClick={handleCopyOutput}
                  className="px-5 py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY PROMPT'}</span>
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
    </div>
  );
};
