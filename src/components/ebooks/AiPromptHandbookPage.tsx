import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { CoverUploader } from '../common/CoverUploader.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  FileText,
  Sparkles,
  Layers,
  Terminal,
  ShieldAlert,
  Download,
  Check
} from 'lucide-react';

interface AiPromptHandbookPageProps {
  product?: Product;
  onBack: () => void;
  onBuyNow: (product: Product) => void;
}

export function AiPromptHandbookPage({
  product,
  onBack,
  onBuyNow,
}: AiPromptHandbookPageProps) {
  const [openChapter, setOpenChapter] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [coverUrl, setCoverUrl] = useState<string>(product?.image_url || STOREFRONT_MEDIA.paidEbook2.coverUrl);
  const contentRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();

  // Admin-editable price variable with fallback
  const priceDisplay = formatPrice(product?.price || 59.00);

  const defaultProduct: Product = product || {
    id: 'prod_ebook_ai_prompt',
    name: 'The AI Prompt Engineering Handbook for Trading Automation (Vol 2)',
    type: 'ebook',
    description: 'Learn how to direct AI models with the precision of a senior software architect.',
    short_description: 'Build Trading Robots & Indicators Using Purely AI. By M. Dinga.',
    price: 59.00,
    currency: 'USD',
    platform: 'Digital PDF (Instant Download)',
    image_url: STOREFRONT_MEDIA.paidEbook2.coverUrl,
    download_url: STOREFRONT_MEDIA.paidEbook2.downloadUrl,
    active: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const whatYoullLearn = [
    {
      title: 'The 5-Ingredient Master Prompt',
      desc: 'Structure every AI request using Role, Context, Objective, Constraints, and Format to eliminate generic or hallucinated code.'
    },
    {
      title: 'The "Lego Block" Method',
      desc: 'Build bots modularly across separate components—Entry & Exit Rules, Risk Management, Filters, and Trade Management.'
    },
    {
      title: 'Negative Constraint Guarding',
      desc: 'Apply the "Do Not Do This" rule to prevent dangerous AI defaults like hardcoded lot sizes, missing stop losses, or obsolete MT4 syntax.'
    },
    {
      title: 'Visual Indicator & Dashboard Creation',
      desc: 'Prompt AI to generate moving averages, RSI/MACD alerts, Average Daily Range (ADR) panels, session boxes, and automated support/resistance zones.'
    },
    {
      title: 'Prop-Firm-Compliant Safety Nets',
      desc: 'Prompt dynamic auto-lot calculators, daily loss limit safeguards, equity trailing buffers, and consistency-rule protectors.'
    },
    {
      title: 'Non-Coder Error Resolution',
      desc: 'Diagnose and resolve compiler errors, runaway multi-trade logic loops, and CPU lag using surgical follow-up prompts.'
    },
    {
      title: 'TradingView Pine Script v6',
      desc: 'Generate non-repainting multi-timeframe indicators, strategy backtesters, and webhook-ready alert payloads.'
    },
    {
      title: 'Legacy Code Migration',
      desc: 'Convert older MT4 code and indicators to modern MT5 CTrade implementations safely.'
    },
    {
      title: '150+ Categorized Master Prompts',
      desc: 'Instant access to tested prompts covering inputs, trend tools, oscillators, volatility, execution filters, and trade managers.'
    }
  ];

  const whoThisBookIsFor = [
    {
      title: 'Manual Traders',
      desc: 'Traders with a defined strategy who want to automate execution without spending years learning programming.'
    },
    {
      title: 'Prop Firm Traders',
      desc: 'Traders needing automated risk layers, maximum daily loss buffers, and consistency guards to protect evaluation accounts.'
    },
    {
      title: 'Aspiring Strategy Architects',
      desc: 'Anyone wanting to build, test, and deploy automated trading tools using AI assistants systematically.'
    },
    {
      title: 'TradingView & MetaTrader Users',
      desc: 'Traders working across MT5 and Pine Script v6 who need clean, non-repainting code generated rapidly.'
    }
  ];

  const chapters = [
    'Part 1: Introduction to AI-Assisted Trading Software Development',
    'Part 2: Prompt Engineering Basics',
    'Part 3: Speaking the AI\'s Language (Without Coding)',
    'Part 4: Building Indicators with AI',
    'Part 5: Building Expert Advisors (Trading Bots)',
    'Part 6: Fixing Errors (Without Reading Code)',
    'Part 7: Professional Prompt Templates',
    'Part 8: TradingView Pine Script (Bonus Reference)',
    'Part 9: Real Client Projects (Case Studies)',
    'Part 10: The Complete AI Prompt Library (150+ Prompts)'
  ];

  const faqs = [
    {
      q: 'How do I receive the handbook?',
      a: 'This is a digital product. You will receive immediate download access on the checkout confirmation screen, along with an automated email receipt containing your permanent download link.'
    },
    {
      q: 'Do I need prior coding experience?',
      a: 'No. The handbook is built specifically for non-programmers. It teaches you how to describe trading rules in precise, plain English and direct AI tools to handle syntax and compilation.'
    },
    {
      q: 'Which AI models does this book cover?',
      a: 'The prompting architecture is tested and optimized across OpenAI ChatGPT, Anthropic Claude, and Google Gemini.'
    },
    {
      q: 'Can I use these prompts for MetaTrader 4?',
      a: 'While the handbook focuses on modern MetaTrader 5 (MQL5) standards, it explicitly covers prompting formulas for safely converting legacy MT4 EAs and indicators to MT5.'
    }
  ];

  const handlePurchase = () => {
    onBuyNow(defaultProduct);
  };

  return (
    <div className="relative min-h-screen bg-[#070B12] text-slate-100 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 space-y-24">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL EBOOKS</span>
        </button>

        {/* 2. HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Book Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col items-center gap-3"
          >
            {/* 3D Book Mockup on Shelf: Natural aspect ratio, uncropped edges, soft depth shadow */}
            <div className="relative w-full max-w-xs sm:max-w-sm flex items-center justify-center py-2">
              <div className="absolute inset-x-8 bottom-2 h-14 bg-black/90 blur-2xl rounded-full pointer-events-none -z-0" />
              <img
                src={coverUrl}
                alt={defaultProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-500 z-10"
              />
            </div>

            <CoverUploader
              productId="prod_ebook_ai_prompt"
              bookTitle={defaultProduct.name}
              onUploaded={(newUrl) => setCoverUrl(newUrl)}
              buttonLabel="Upload Exact Cover (.jfif / .jpg / .png)"
              className="w-full max-w-xs"
            />
          </motion.div>

          {/* Hero Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Badge/Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Guide & Prompt Playbook</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              The AI Prompt Engineering Handbook for Trading Automation
            </h1>

            {/* Subtitle */}
            <h2 className="text-lg sm:text-xl text-purple-200/90 font-medium">
              Build Expert Advisors, Indicators & Pine Script Strategies with ChatGPT, Claude & Gemini
            </h2>

            {/* Author */}
            <div className="text-sm font-mono text-slate-400">
              Author: <span className="text-slate-200 font-semibold">M. Dinga</span>{' '}
              <span className="text-slate-400">(A Companion Volume to Build Trading Bots with AI & MQL5)</span>
            </div>

            {/* Short Value Proposition */}
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed pt-2">
              Learn how to direct AI models with the precision of a senior software architect. This practical playbook shows non-coders how to translate trading rules into production-ready MetaTrader 5 EAs, custom indicators, and TradingView Pine Script strategies—complete with a master library of 150+ copy-and-paste prompts.
            </p>

            {/* Price & Primary CTA */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
              <div>
                <div className="text-4xl font-black text-white font-mono">
                  {priceDisplay}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  USD • Instant Digital Download
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePurchase}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-lg shadow-purple-500/25 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none"
                >
                  Get the Ebook
                </Button>
                <a
                  href={STOREFRONT_MEDIA.paidEbook2.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-mono font-bold transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Direct PDF Access</span>
                </a>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => contentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Outline
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. ABOUT THE BOOK */}
        <div ref={contentRef} className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              About the Book
            </h2>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0D131F] border border-slate-800/80 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              You do not need to learn C++ or spend years studying syntax to build automated trading software. You only need to know how to translate your market strategy into unambiguous rules and verify what the AI generates before it touches real capital.
            </p>
            <p>
              The AI Prompt Engineering Handbook for Trading Automation breaks down the exact communication framework required to turn ChatGPT, Claude, and Gemini into disciplined junior developers. Instead of falling into the "one-shot trap" where an AI hallucinates broken code, this guide introduces modular development: building your bot stage-by-stage using The Brain (rules), The Shield (risk), The Glasses (filters), and The Hands (trade management). Every concept is paired with tested prompt templates, negative constraints, and practical verification steps to keep execution safe and disciplined.
            </p>
          </div>
        </div>

        {/* 4. WHAT YOU'LL LEARN */}
        <div className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              Master Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What You'll Learn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYoullLearn.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0B101A] border border-slate-800 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>0{idx + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. WHO THIS BOOK IS FOR */}
        <div className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              Target Audience
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Who This Book Is For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whoThisBookIsFor.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D1421] border border-slate-800 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. CONTENT / CHAPTERS */}
        <div className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              Curriculum Structure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Content / Chapters
            </h2>
          </div>

          <div className="space-y-3 max-w-4xl">
            {chapters.map((chapter, index) => {
              const isOpen = openChapter === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#0D1420] border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenChapter(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-purple-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-purple-400 font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{chapter}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-purple-400' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      Complete module including tested prompts, negative constraint safeguards, copy-and-paste syntax templates, and non-coder verification procedures.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. FORMAT & WHAT'S INCLUDED */}
        <div className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              Deliverables
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Format & What's Included
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0D1421] border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase font-semibold">Format</span>
              <h4 className="text-sm font-bold text-white">Digital PDF (Instant Download)</h4>
              <p className="text-xs text-slate-400">High-resolution DRM-free digital manual.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1421] border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase font-semibold">Compatibility</span>
              <h4 className="text-sm font-bold text-white">Multi-Model & Multi-Platform</h4>
              <p className="text-xs text-slate-400">ChatGPT, Claude, Gemini, MetaTrader 5 (MQL5), TradingView (Pine Script v6)</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1421] border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase font-semibold">Included Tools</span>
              <h4 className="text-sm font-bold text-white">150+ Tested Prompt Library</h4>
              <p className="text-xs text-slate-400">Curated copy-and-paste vault & real client case studies.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1421] border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase font-semibold">Delivery</span>
              <h4 className="text-sm font-bold text-white">Immediate Access</h4>
              <p className="text-xs text-slate-400">Immediate download access upon checkout + email backup link.</p>
            </div>
          </div>
        </div>

        {/* 8. FAQ */}
        <div className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 max-w-4xl">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#0D1420] border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-purple-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-purple-400' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 9. FINAL CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0E1524] to-indigo-950/60 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Master the Art of AI-Assisted Trading Automation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Get immediate download access to the complete digital guide, 150+ master prompt library, and real client case studies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-black text-white font-mono">{priceDisplay}</div>
              <div className="text-[10px] text-purple-300 font-mono">DRM-Free • Instant Access</div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handlePurchase}
                icon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-lg shadow-purple-500/25 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none"
              >
                Get the Ebook
              </Button>
              <a
                href={STOREFRONT_MEDIA.paidEbook2.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-mono font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Direct PDF</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AiPromptHandbookPage;
