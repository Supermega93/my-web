import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveView } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { CoverUploader } from '../common/CoverUploader.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { requestFreeEbookDownload } from '../../services/ebookService.ts';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Check, 
  HelpCircle, 
  Download, 
  Sparkles, 
  Cpu, 
  Code2, 
  GraduationCap, 
  ShieldCheck, 
  FileText, 
  Layers,
  AlertCircle,
  ExternalLink,
  Clock,
  Loader2,
  Mail
} from 'lucide-react';

interface FreeEbookPageProps {
  onNavigate: (view: ActiveView, productId?: string) => void;
  onTriggerBuildMyEa: () => void;
}

export function FreeEbookPage({ onNavigate, onTriggerBuildMyEa }: FreeEbookPageProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [downloadReady, setDownloadReady] = useState(false);
  const [signedDownloadUrl, setSignedDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [coverUrl, setCoverUrl] = useState<string>(STOREFRONT_MEDIA.freeEbook.coverUrl);

  // Interactive 5-Question Automation-Ready Checklist state
  const [checklistAnswers, setChecklistAnswers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

  const checklistQuestions = [
    {
      id: 1,
      question: 'Do you know the exact entry trigger?',
      explanation: 'An automated system cannot interpret "it feels like resistance" or "looks like momentum." It requires deterministic conditions—such as a specific candlestick close, a mathematically calculated liquidity purge, or a defined indicator threshold.',
    },
    {
      id: 2,
      question: 'Do you know where the Stop Loss goes?',
      explanation: 'Every automated order requires a predefined stop-loss level before or immediately upon transmission. Hardcoded risk parameters prevent runaway losses and emotional trade holding.',
    },
    {
      id: 3,
      question: 'Do you know when the trade should exit?',
      explanation: 'Whether an exit is triggered by a fixed profit target, dynamic ATR trailing stop, opposite signal block, or end-of-session time, the logic must be explicit.',
    },
    {
      id: 4,
      question: 'Do you know how much you want to risk per trade?',
      explanation: 'Reliable systems calculate position size dynamically based on account balance and stop-loss distance (e.g. 0.5% or 1.0% equity risk per execution).',
    },
    {
      id: 5,
      question: 'Do you know when the strategy should NOT trade?',
      explanation: 'Knowing when to avoid the market—such as during high-impact CPI/FOMC releases, outside of specific London/New York session windows, or during illiquid spread spikes—is just as crucial as entry logic.',
    },
  ];

  const handleToggleChecklist = (id: number, answer: boolean) => {
    setChecklistAnswers(prev => ({
      ...prev,
      [id]: prev[id] === answer ? null : answer,
    }));
  };

  const answeredCount = Object.values(checklistAnswers).filter(v => v !== null).length;
  const yesCount = Object.values(checklistAnswers).filter(v => v === true).length;

  const handleGetDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestFreeEbookDownload(cleanEmail, firstName);
      if (res.success && res.downloadUrl) {
        setSignedDownloadUrl(res.downloadUrl);
        setDownloadReady(true);

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (_) {}

        // Automatically trigger browser download
        const tempLink = document.createElement('a');
        tempLink.href = res.downloadUrl;
        tempLink.setAttribute('download', 'The-Traders-Guide-to-Understanding-Strategy-Automation.pdf');
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      } else {
        setErrorMessage(res.error || 'Failed to authorize download. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('JSON') || msg.includes('json') || msg.includes('Response') || msg.includes('SyntaxError')) {
        setErrorMessage('Download service is preparing your link. Please click download once more.');
      } else {
        setErrorMessage(msg || 'An error occurred while authorizing your download.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28 space-y-20">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </button>

        {/* 1. HERO / BOOK SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Book Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col items-center gap-3"
          >
            <div className="relative group max-w-xs sm:max-w-sm w-full flex flex-col items-center">
              {coverUrl ? (
                <div className="relative w-full flex items-center justify-center py-2">
                  <div className="absolute inset-x-8 bottom-2 h-14 bg-slate-300/60 blur-2xl rounded-full pointer-events-none -z-0" />
                  <img
                    src={coverUrl}
                    alt="The Trader's Guide to Understanding Strategy Automation by M. Dinga"
                    className="w-full h-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500 z-10"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[3/4] max-w-[280px] sm:max-w-[320px] rounded-2xl p-7 bg-white border border-slate-200 shadow-xl flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      FREE LEAD MAGNET
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">PDF REPORT</span>
                  </div>

                  <div className="space-y-4 my-auto py-4">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      SYSTEMATIC BLUEPRINT
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                      The Trader's Guide <br />
                      <span className="text-emerald-700">To Understanding</span> <br />
                      Strategy Automation
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Discretionary to Systematic Transformation • 5-Point Automation-Ready Checklist
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-mono text-slate-400">AUTHOR</div>
                      <div className="text-xs font-mono font-bold text-slate-800">M. DINGA</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-slate-400">MEDIA STATUS</div>
                      <div className="text-[10px] font-mono font-semibold text-emerald-700">OFFICIAL RELEASE</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Underlying depth shadow glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl -z-10 group-hover:opacity-100 transition-opacity opacity-70" />
            </div>

            <CoverUploader
              productId="prod_ebook_free"
              bookTitle="The Trader's Guide to Understanding Trading Automation"
              onUploaded={(newUrl) => setCoverUrl(newUrl)}
              buttonLabel="Upload Exact Cover (.jfif / .jpg / .png)"
              className="w-full max-w-xs"
            />
          </motion.div>

          {/* Lead Magnet Copy & Instant Download Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono tracking-wider uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official Free Strategy Handbook</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                The Trader's Guide To Understanding Strategy Automation
              </h1>
              <p className="text-lg text-emerald-800 font-medium">
                Discover whether the trading strategy you're using today could potentially become an automated system.
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Written by <strong>M. DINGA</strong>, this practical guide addresses the foundational question every discretionary trader faces: 
              <em> Can my manual trading approach actually be coded into an automated Expert Advisor?</em>
            </p>

            {/* Core Principle Quote Pill */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-emerald-800 text-sm font-mono flex items-center gap-3 shadow-xs">
              <div className="w-1.5 h-8 bg-emerald-600 rounded-full shrink-0" />
              <span>&ldquo;Automation begins when ideas become rules.&rdquo;</span>
            </div>

            {/* Download Form / Success State */}
            <div className="pt-2">
              {!downloadReady ? (
                <form onSubmit={handleGetDownload} className="space-y-4 bg-white border border-slate-200/90 p-6 rounded-3xl max-w-lg shadow-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-900 font-semibold">
                      Instant Free Download (PDF &amp; Blueprint)
                    </div>
                    <p className="text-xs text-slate-500">
                      No credit card required. Receive immediate download access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1 font-semibold">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Alexander"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1 font-semibold">
                        Email Address <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@quant.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying & Generating Secure Access...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 group-hover:scale-105 transition-transform" />
                          <span>Get Free eBook</span>
                          <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                        </>
                      )}
                    </button>

                    <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Authorized server delivery • No password required</span>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-6 rounded-3xl bg-white border border-emerald-300 max-w-lg space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Your Free Guide Is Ready & Sent!</h3>
                      <p className="text-xs text-slate-600">
                        Authorized download unlocked for <span className="font-semibold text-slate-800">{email}</span>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 space-y-1.5">
                    <div className="flex items-center gap-2 font-medium">
                      <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Copy dispatched to <strong>{email}</strong></span>
                    </div>
                    <p className="text-[11px] text-emerald-800/80 pl-6 leading-relaxed">
                      Check your inbox (and spam folder) for the permanent guide link and study notes.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct temporary link valid for 15 minutes</span>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {signedDownloadUrl && (
                      <a
                        href={signedDownloadUrl}
                        download="The-Traders-Guide-to-Understanding-Strategy-Automation.pdf"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Again</span>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('eas')}
                    >
                      Explore Ready-to-use EAs
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 2. WHAT THE GUIDE COVERS */}
        <section className="pt-10 border-t border-slate-200 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Practical Strategy Deconstruction
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What This Free Guide Covers
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto font-normal">
              A straightforward breakdown designed to bridge the gap between human intuition and computer code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              {
                title: 'Turning Trading Ideas into Clear Rules',
                desc: 'How to convert discretionary charts into deterministic conditions a machine can execute without hesitation.',
              },
              {
                title: 'Understanding Whether a Strategy Is Automation-Ready',
                desc: 'Diagnose subjective biases, ambiguity in triggers, and how to verify if rules can be coded.',
              },
              {
                title: 'Defining Precise Entry Triggers',
                desc: 'Why exact candlestick close conditions, liquidity sweep points, or indicator math must replace gut feelings.',
              },
              {
                title: 'Defining Stop-Loss Locations',
                desc: 'Hard rules for defensive stops, ATR multipliers, and swing high/low references upon trade placement.',
              },
              {
                title: 'Defining Exits & Profit Taking',
                desc: 'Trailing stops, partial scale-outs (TP1/TP2), break-even offsets, and structural liquidity targets.',
              },
              {
                title: 'Defining Risk Per Trade',
                desc: 'Dynamic lot-sizing formulas based on balance and stop-loss distance to ensure capital longevity.',
              },
              {
                title: 'Understanding When NOT to Trade',
                desc: 'Filtering out high-impact news spikes (CPI/FOMC), session boundary rollovers, and toxic spread expansions.',
              },
              {
                title: 'How Automation Delivers Consistent Execution',
                desc: 'Eliminating FOMO, fear, fatigue, and revenge trading by letting disciplined logic govern execution 24/5.',
              },
              {
                title: 'How AI Has Transformed Strategy Development',
                desc: 'How modern LLMs and prompt engineering can assist in prototyping, debugging, and backtest analysis.',
              },
              {
                title: 'Learning Automation vs. Commissioning Custom EAs',
                desc: 'Deciding whether to master MQL5 coding yourself or partner with quantitative engineers to build your robot.',
              },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all flex gap-4 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. INTERACTIVE 5-QUESTION CHECKLIST */}
        <section className="pt-10 border-t border-slate-200 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Interactive Self-Assessment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Automation-Ready Checklist
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto font-normal">
              Test your current manual strategy against the 5 essential questions outlined in the guide.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {checklistQuestions.map((q) => {
              const status = checklistAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    status === true
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : status === false
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-white border-slate-200/90 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-emerald-800 font-semibold">
                        QUESTION #{q.id}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{q.question}</h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(q.id, true)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          status === true
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(q.id, false)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          status === false
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        NOT YET
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed font-normal">
                    {q.explanation}
                  </p>
                </div>
              );
            })}

            {/* Checklist Feedback Card */}
            {answeredCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3 text-center sm:text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase text-emerald-800 font-semibold">
                      ASSESSMENT STATUS: {yesCount} / 5 CLARIFIED
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                      {yesCount === 5 ? (
                        'Your Strategy Is Automation-Ready!'
                      ) : (
                        'Almost There — A Few Rules Need Sharpening'
                      )}
                    </h4>
                  </div>

                  {yesCount === 5 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onTriggerBuildMyEa}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Build My EA Now
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('ebooks')}
                    >
                      Study MQL5 Guides
                    </Button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {yesCount === 5
                    ? 'Because you have deterministic entry, stop loss, exit, sizing, and session conditions, your strategy possesses the structural foundation required for an automated Expert Advisor. (Note: Automation guarantees disciplined execution of your rules, not future market profitability).'
                    : 'If any of these conditions are still vague or intuitive, reading the full free handbook will help you define explicit mathematical rules for every phase of your setup.'}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* 4. THREE PATHS FROM THE FREE EBOOK */}
        <section className="pt-10 border-t border-slate-200 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Where to Go Next
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three Paths From This Guide
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto font-normal">
              Choose the pathway that matches your current development goals and technical background.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Path 1: WANT TO LEARN */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between space-y-6 shadow-sm group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">PATHWAY 01</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Want to Learn?</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    Master MQL5 coding and AI prompt engineering with our in-depth handbooks and downloadable source templates.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onNavigate('ebooks')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Explore Ebooks
              </Button>
            </div>

            {/* Path 2: WANT TO AUTOMATE (FEATURED DEEP EMERALD) */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 border border-emerald-700 text-white hover:border-emerald-600 transition-all flex flex-col justify-between space-y-6 shadow-2xl shadow-emerald-950/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold rounded-bl-xl uppercase">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center border border-white/20">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-300 font-semibold">PATHWAY 02</span>
                  <h3 className="text-xl font-bold text-white mt-1">Want to Automate Your Strategy?</h3>
                  <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed font-normal">
                    Work directly with our quantitative developers to turn your validated strategy into a private, proprietary MT5 Expert Advisor.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={onTriggerBuildMyEa}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="font-bold bg-white text-emerald-950 hover:bg-emerald-50"
              >
                Build My EA
              </Button>
            </div>

            {/* Path 3: WANT TO GO DEEPER */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between space-y-6 shadow-sm group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">PATHWAY 03</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 uppercase font-semibold border border-purple-200">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Want to Go Deeper?</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    1-on-1 coaching, systematic strategy audits, and advanced prop-firm quantitative risk modeling.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onNavigate('coaching')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Join Coaching Waitlist
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FreeEbookPage;
