import React from 'react';
import { motion } from 'motion/react';
import { Product, ActiveView } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { Button } from '../common/Button.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { 
  BookOpen, 
  ArrowRight, 
  Check, 
  Sparkles, 
  FileText, 
  GraduationCap,
  Layers,
  ChevronRight,
  Download
} from 'lucide-react';

interface EbooksPageProps {
  products: Product[];
  onNavigate: (view: ActiveView, productId?: string) => void;
  onBuyNow: (product: Product) => void;
  onTriggerBuildMyEa: () => void;
}

export function EbooksPage({
  products,
  onNavigate,
  onBuyNow,
  onTriggerBuildMyEa,
}: EbooksPageProps) {
  const { formatPrice, currentCurrency } = useCurrency();
  const ebookProducts = products.filter(p => p.type === 'ebook' && p.active === 1);

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono tracking-wider uppercase font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Master Engineering Handbooks</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Trading Automation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800">
              Knowledge
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            In-depth architectural guides, algorithmic principles, and prompt engineering manuals for quantitative traders.
          </p>
        </motion.div>

        {/* 100% FREE EBOOK HIGHLIGHT BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Free Ebook Cover with Subtle Depth Shadow */}
          <div className="relative w-40 sm:w-48 shrink-0 flex items-center justify-center">
            <div className="relative">
              <img
                src={STOREFRONT_MEDIA.freeEbook.coverUrl}
                alt="The Trader's Guide to Understanding Strategy Automation by M. Dinga"
                referrerPolicy="no-referrer"
                className="h-56 sm:h-64 w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Underlying subtle glow */}
            <div className="absolute -inset-1 bg-emerald-500/10 rounded-xl blur-lg -z-10 opacity-70" />
          </div>

          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% FREE GUIDE • BY M. DINGA</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug uppercase">
              The Trader's Guide To Understanding Trading Automation
            </h2>

            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              Discover whether the trading strategy you're using today could potentially become an automated system. Includes the 5-point Automation-Ready Checklist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => onNavigate('free-ebook')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Get Free eBook</span>
            </button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('free-ebook')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* EBOOKS PREMIUM CARDS GRID */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ebookProducts.map((ebook) => {
            const coverImage = ebook.id === 'prod_ebook_mql5_guide'
              ? STOREFRONT_MEDIA.paidEbook1.coverUrl
              : (ebook.id === 'prod_ebook_ai_prompt'
                ? STOREFRONT_MEDIA.paidEbook2.coverUrl
                : (ebook.image_url || STOREFRONT_MEDIA.paidEbook1.coverUrl));

            return (
            <motion.div
              key={ebook.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all shadow-md hover:shadow-xl flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle card glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

              <div className="space-y-6">
                {/* 3D Book Mockup Display: natural aspect ratio, no cropping, uniform display height */}
                <div className="relative h-80 rounded-2xl bg-slate-50 flex items-center justify-center p-6 border border-slate-200 group-hover:border-emerald-200 transition-all overflow-visible">
                  {/* Subtle soft depth glow behind the book */}
                  <div className="absolute inset-x-8 bottom-4 h-16 bg-slate-300/50 blur-xl rounded-full pointer-events-none -z-0" />
                  
                  <motion.div 
                    whileHover={{ scale: 1.04, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 flex items-center justify-center h-full w-full"
                  >
                    <img
                      src={coverImage}
                      alt={ebook.name}
                      referrerPolicy="no-referrer"
                      className="max-h-64 sm:max-h-72 w-auto max-w-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.15)]"
                    />
                  </motion.div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-emerald-800 uppercase tracking-widest font-semibold z-20 shadow-xs">
                    {ebook.platform || 'Digital PDF'}
                  </div>
                </div>

                {/* Title & Short Description */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {ebook.name}
                  </h3>

                  <p className="text-sm text-slate-600 font-normal leading-relaxed">
                    {ebook.short_description || ebook.description}
                  </p>
                </div>
              </div>

              {/* Price & Dual CTA Buttons */}
              <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    {formatPrice(ebook.price, 'USD')}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {currentCurrency.code} • DRM-Free • Lifetime Access
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => onNavigate('ebook-detail', ebook.id)}
                  >
                    View Book
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onBuyNow(ebook)}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="font-bold"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Custom Development CTA */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-900">Want us to program the strategy for you?</h4>
            <p className="text-xs text-slate-500 font-normal">
              Skip the manual coding—our quantitative engineers develop custom Expert Advisors around your strategy rules.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={onTriggerBuildMyEa}
            icon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 font-bold"
          >
            Build My EA
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EbooksPage;
