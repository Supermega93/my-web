import { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { CoverUploader } from '../common/CoverUploader.tsx';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Check, 
  FileText, 
  Users, 
  GraduationCap, 
  Info, 
  ChevronDown,
  Lock,
  Download
} from 'lucide-react';

interface EbookProductDetailProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (product: Product) => void;
  onTriggerBuildMyEa: () => void;
}

export function EbookProductDetail({
  product,
  onBack,
  onBuyNow,
  onTriggerBuildMyEa,
}: EbookProductDetailProps) {
  const isPromptHandbook = product.id === 'prod_ebook_ai_prompt';
  const defaultCover = isPromptHandbook
    ? STOREFRONT_MEDIA.paidEbook2.coverUrl
    : STOREFRONT_MEDIA.paidEbook1.coverUrl;

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [coverUrl, setCoverUrl] = useState<string>(product.image_url || defaultCover);

  const parsed = product.parsedMetadata || {};
  const chapters = parsed.tableOfContents || [
    'Chapter 1: Foundations of Algorithmic Trading Architecture',
    'Chapter 2: MQL5 Object-Oriented Frameworks & Event Handlers',
    'Chapter 3: Custom Indicators & Multi-Timeframe Buffer Math',
    'Chapter 4: Trade Execution, Slippage Mitigation & Order Managers',
    'Chapter 5: Walk-Forward Optimization & Avoiding Overfitting',
    'Chapter 6: Cloud VPS Deployment & Health Monitoring'
  ];

  const whoItsFor = [
    'Discretionary traders seeking to automate repetitive chart strategies',
    'MQL5 and Python developers building automated trading bots',
    'Prop firm traders needing disciplined rule enforcement without emotional fatigue'
  ];

  const whatYoullLearn = [
    'How to design bulletproof order management with trailing stops and hard stop losses',
    'How to build multi-threaded backtests that avoid curve-fitting and lookahead bias',
    'Production techniques for sub-5ms execution and slippage protection',
    'Step-by-step MQL5 code templates ready to compile in MetaEditor'
  ];

  const faqs = [
    {
      q: 'What formats are included in the download?',
      a: 'You receive high-resolution PDF and EPUB files, plus full access to the downloadable source code repository containing all complete .mq5 project files.'
    },
    {
      q: 'Do I need prior C++ or MQL5 programming knowledge?',
      a: 'The book begins from algorithmic fundamentals and builds sequentially into advanced object-oriented programming. Even traders with zero prior coding experience can follow the step-by-step templates.'
    },
    {
      q: 'Is there DRM or can I read it on any device?',
      a: 'All our ebooks are 100% DRM-free. You can read them on your computer, iPad, Kindle, or mobile device anytime.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#070B12] text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[450px] bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 space-y-20">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL EBOOKS</span>
        </button>

        {/* 1. HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Large Book Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col items-center gap-3"
          >
            {/* 3D Book Mockup: Natural aspect ratio, uncropped edges, soft background depth shadow */}
            <div className="relative w-full max-w-xs sm:max-w-sm flex items-center justify-center py-2">
              <div className="absolute inset-x-8 bottom-2 h-14 bg-black/90 blur-2xl rounded-full pointer-events-none -z-0" />
              <img
                src={coverUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-500 z-10"
              />
            </div>

            <CoverUploader
              productId={product.id}
              bookTitle={product.name}
              onUploaded={(newUrl) => setCoverUrl(newUrl)}
              buttonLabel="Upload Exact Cover (.jfif / .jpg / .png)"
              className="w-full max-w-xs"
            />
          </motion.div>

          {/* Title, Short Description, Price, Buy Now */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>DRM-Free Digital Edition + Source Code</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              {product.short_description || product.description}
            </p>

            {/* Price & Buy Now */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
              <div>
                <div className="text-4xl font-black text-white font-mono">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 font-mono">Instant download • Includes code templates</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onBuyNow(product)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-lg shadow-cyan-500/20"
                >
                  Buy Now
                </Button>
                <a
                  href={STOREFRONT_MEDIA.paidEbook1.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-mono font-bold transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Direct PDF Access</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2. WHAT'S INSIDE (Visual Chapter Breakdown) */}
        <div className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Curriculum & Outline
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              What's Inside
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {chapters.map((ch: string, index: number) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#0D1420] border border-slate-800 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                  {index + 1}
                </div>
                <span className="text-xs text-slate-300 leading-snug">{ch}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. WHO IT'S FOR & 4. WHAT YOU'LL LEARN (Visual Two-Column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-800/80">
          {/* Who It's For */}
          <div className="p-8 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Who It's For</h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              {whoItsFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You'll Learn */}
          <div className="p-8 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">What You'll Learn</h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              {whatYoullLearn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. BOOK DETAILS (Compact Specifications Strip) */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Format</div>
            <div className="text-base font-bold text-white mt-1">PDF & EPUB</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Pages</div>
            <div className="text-base font-bold text-white mt-1">340+ Pages</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Code Included</div>
            <div className="text-base font-bold text-emerald-400 mt-1">12 MQL5 Templates</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Licensing</div>
            <div className="text-base font-bold text-white mt-1">DRM-Free</div>
          </div>
        </div>

        {/* 6. FREQUENTLY ASKED QUESTIONS */}
        <div className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Ebook FAQ
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#0D1420] border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Purchase Bar */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101826] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-white">{product.name}</div>
            <div className="text-xs text-slate-400">Immediate download link generated upon payment</div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => onBuyNow(product)}
            icon={<ArrowRight className="w-4 h-4" />}
            className="font-bold shadow-lg shadow-cyan-500/25"
          >
            Buy Now — ${product.price.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default EbookProductDetail;
