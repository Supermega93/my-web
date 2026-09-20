import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  Award, 
  Cpu, 
  Zap, 
  Bot, 
  Clock, 
  Users, 
  CheckCircle2, 
  Star,
  Lock,
  MessageSquareCode
} from 'lucide-react';
import { ActiveView } from '../../types.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../common/Button.tsx';
import { AcademyNav } from './AcademyNav.tsx';
import { setActiveStudentTier, StudentTier, getActiveStudentTier } from '../../services/academyAccess.ts';
import { api } from '../../services/api.ts';

interface AcademyPricingPageProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
}

export function AcademyPricingPage({ onNavigate, onOpenAuth }: AcademyPricingPageProps) {
  const { currentCurrency, formatPrice, convertAmount } = useCurrency();
  const { user, isAdmin } = useAuth();
  const [selectedTierId, setSelectedTierId] = useState<string>('masterclass-ea');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStudentTier, setCurrentStudentTier] = useState<StudentTier>(() => getActiveStudentTier(user, isAdmin));

  // The 3 Required Masterclass Pricing Packages
  const packages = [
    {
      id: 'masterclass',
      name: 'Masterclass',
      badge: 'CORE CURRICULUM',
      popular: false,
      usdPrice: 159,
      displayPrice: formatPrice(159),
      tagline: 'Complete mastery of Levels 4 through 8, advanced AI prompt engineering & certification.',
      features: [
        'The School of AI Trading Architecture (Complete 71-Page Course Book included · $89 value)',
        'Full access to all remaining levels (Levels 4 through 8)',
        'Junior High, High School, Undergraduate, Masters & PhD tiers',
        'Advanced prompt engineering templates for ChatGPT & Claude',
        'All future curriculum updates & newly published modules',
        'Private Discord student community access',
        'Official Strategy Architect Certificate of Completion',
      ],
      notIncluded: [
        'Adaptive Liquidity Pro EA license',
        '1-on-1 strategy architecture reviews',
        'VIP coaching community access',
      ],
      ctaText: 'Enroll in Masterclass',
      theme: 'standard',
    },
    {
      id: 'masterclass-ea',
      name: 'Masterclass + Adaptive Liquidity Pro',
      badge: 'BEST VALUE • MOST POPULAR',
      popular: true,
      usdPrice: 199,
      displayPrice: formatPrice(199),
      tagline: 'The complete Masterclass combined with our flagship institutional trading robot.',
      features: [
        'Everything in Masterclass (Levels 4 through 8)',
        'Adaptive Liquidity Pro EA included',
        '2-month live MT5 licence for Adaptive Liquidity Pro',
        'Access to proprietary EA set files & presets',
        'Live Strategy Implementation Workshop recording',
        'Priority technical & development support',
        'Private Discord student community & EA channels',
        'Official Strategy Architect Certificate of Completion',
      ],
      notIncluded: [
        '1-on-1 strategy architecture reviews',
        'VIP private coaching channel',
      ],
      ctaText: 'Get Masterclass + EA',
      theme: 'popular',
    },
    {
      id: 'premium',
      name: 'Premium VIP Masterclass',
      badge: 'VIP ARCHITECT TIER',
      popular: false,
      usdPrice: 299,
      displayPrice: formatPrice(299),
      tagline: 'The ultimate professional trading architecture mentorship with extended EA license.',
      features: [
        'Everything in Masterclass + Adaptive Liquidity Pro',
        '4-month live MT5 licence for Adaptive Liquidity Pro',
        '1-on-1 strategy architecture review session with the creator',
        'VIP coaching community & private mentorship office hours',
        'Custom EA code review (audit your automated bots)',
        'Early access to new EAs, indicators, and AI tools',
        'Highest priority dedicated developer support',
        'Lifetime access to all future levels & tool updates',
      ],
      notIncluded: [],
      ctaText: 'Join Premium VIP',
      theme: 'vip',
    },
  ];

  const activeSelectedPackage = packages.find((p) => p.id === selectedTierId) || packages[1];

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    setSelectedTierId(pkg.id);
    setCheckoutModalOpen(true);
  };

  const handleConfirmEnrollment = async () => {
    try {
      setLoading(true);
      const convertedAmount = convertAmount(activeSelectedPackage.usdPrice);
      await api.createOrder({
        productId: activeSelectedPackage.id,
        amount: currentCurrency.code === 'USD' ? activeSelectedPackage.usdPrice : convertedAmount,
        currency: currentCurrency.code,
        customerEmail: user?.email || 'student@academy.com',
        customerName: user?.name || 'Academy Student',
        paymentMethod: 'card',
        tierName: activeSelectedPackage.name,
      });
    } catch (e) {
      console.warn('Enrollment order record:', e);
    } finally {
      // Elevate active session tier to paid
      setActiveStudentTier('paid');
      setCurrentStudentTier('paid');
      setEnrolledSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setCheckoutModalOpen(false);
        setEnrolledSuccess(false);
        onNavigate('level-hub', '4');
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Academy Navigation */}
      <AcademyNav onNavigate={onNavigate} activeTab="pricing" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ACADEMY MASTERCLASS & BUNDLES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Unlock the Full Trading Architecture Curriculum
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Graduate from manual retail trading into algorithmic strategy architecture. Access Levels 4 through 8, production-ready MQL5 templates, and pair your education with our flagship Adaptive Liquidity Pro EA.
          </p>

          {/* Current Tier Status Notice */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-mono">
            <span className="text-slate-500">Your Current Status:</span>
            <span
              className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                currentStudentTier === 'paid' || currentStudentTier === 'complimentary'
                  ? 'bg-cyan-100 border border-cyan-300 text-cyan-900'
                  : 'bg-slate-200 border border-slate-300 text-slate-700'
              }`}
            >
              {currentStudentTier === 'paid' ? 'Paid Masterclass Active' : currentStudentTier === 'complimentary' ? 'Complimentary Access' : 'Free Tier (Levels 1–3)'}
            </span>
          </div>

          {/* Included Course Book Callout Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                  Included With All Masterclass Enrollments
                </div>
                <div className="text-sm font-bold text-slate-900">
                  The School of AI Trading Architecture (Complete 71-Page Course Book · $89 Standalone Value)
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ebook-detail', 'prod_ebook_mql5_guide')}
              className="text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer shrink-0"
            >
              Preview Course Book →
            </button>
          </div>
        </div>

        {/* 3 PRICING CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isSelected = selectedTierId === pkg.id;
            const isPopular = pkg.popular;
            const isVip = pkg.id === 'premium';

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedTierId(pkg.id)}
                className={`rounded-3xl p-8 transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? isVip
                      ? 'bg-white border-2 border-slate-900 shadow-xl ring-2 ring-slate-900/10'
                      : 'bg-white border-2 border-emerald-700 shadow-xl ring-2 ring-emerald-600/10'
                    : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular / VIP Floating Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{pkg.badge}</span>
                  </div>
                )}
                {isVip && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                      {pkg.id === 'masterclass' ? 'Single Product' : pkg.id === 'masterclass-ea' ? 'All-in-One Bundle' : 'Mentorship Tier'}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{pkg.tagline}</p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                        {pkg.displayPrice}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">one-time</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {currentCurrency.code} • Base USD ${pkg.usdPrice}
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                      What is Included:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-medium text-slate-700">{feat}</span>
                        </li>
                      ))}
                      {pkg.notIncluded.map((feat, fIdx) => (
                        <li key={`not-${fIdx}`} className="flex items-start gap-2.5 opacity-40">
                          <span className="w-4 text-center text-slate-400 font-bold shrink-0 mt-0.5">✕</span>
                          <span className="leading-relaxed line-through">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-8 mt-6 border-t border-slate-100">
                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    size="md"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPackage(pkg);
                    }}
                    className={`font-bold shadow-sm transition-all ${
                      isSelected
                        ? isVip
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : ''
                    }`}
                  >
                    {pkg.ctaText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPARISON & TRUST SECTION */}
        <div className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              Curriculum Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Upgrade to Masterclass?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Free students learn the fundamental building blocks in Levels 1–3. The Masterclass equips you with the complete engineering toolset for institutional deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-emerald-800 uppercase font-semibold">Levels 4–5</span>
              <h4 className="text-base font-bold text-slate-900">Advanced Architecture</h4>
              <p className="text-xs text-slate-600">State machines, multi-timeframe engines, ATR volatility filtering & automated risk throttles.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-cyan-800 uppercase font-semibold">Levels 6–7</span>
              <h4 className="text-base font-bold text-slate-900">Quant Verification</h4>
              <p className="text-xs text-slate-600">Walk-forward optimization, Monte Carlo stress testing, and real tick modeling against slippage.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-teal-800 uppercase font-semibold">Flagship EA</span>
              <h4 className="text-base font-bold text-slate-900">Adaptive Liquidity Pro</h4>
              <p className="text-xs text-slate-600">Included directly in Package 2 & 3 with licensed access, curated presets, and live setup files.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-indigo-800 uppercase font-semibold">Certification</span>
              <h4 className="text-base font-bold text-slate-900">Official Credential</h4>
              <p className="text-xs text-slate-600">Verify your algorithmic competencies with a verifiable Certificate of Completion.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-slate-200/80 max-w-3xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Can I continue on the Free Tier?</h4>
              <p>Yes, absolutely. Levels 1 through 3, the Free Capstone (Lesson 3.5 Breakout EA), the Indicator Workshop (Lesson 3.6), and both companion exercise PDFs are 100% free forever for all students.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">How does the currency conversion work?</h4>
              <p>All prices are converted dynamically using institutional FX rates from the base USD amounts ($159, $199, and $299). You pay in your local currency with zero conversion markup.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">What happens after I enroll?</h4>
              <p>Your student tier is instantly elevated to Paid Masterclass. All locked levels (Levels 4 to 8) and advanced bonus chapters unlock immediately in your portal.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout / Enrollment Confirmation Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl space-y-6 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {enrolledSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Welcome to Masterclass!</h3>
                <p className="text-xs text-slate-600">
                  Your account has been upgraded to Paid Tier. Redirecting you to Level 4...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Enrollment Checkout
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {activeSelectedPackage.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-lg p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Selected Package:</span>
                    <span className="font-bold text-slate-900">{activeSelectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Total Amount:</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono text-base">{activeSelectedPackage.displayPrice}</span>
                      {currentCurrency.code !== 'USD' && (
                        <span className="text-[10px] text-slate-500 font-mono block">Base: ${activeSelectedPackage.usdPrice.toFixed(2)} USD</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Access Period:</span>
                    <span className="text-emerald-700 font-semibold font-mono">Lifetime Curriculum Access</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                    Confirm Account:
                  </span>
                  {user ? (
                    <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{user.email}</span>
                      <span className="text-[10px] font-mono text-emerald-800 font-bold">LOGGED IN ✓</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
                      <p className="text-amber-900">
                        You are currently browsing as a guest. You can enroll now or sign in to link your certificate to your profile.
                      </p>
                      {onOpenAuth && (
                        <button
                          onClick={() => {
                            setCheckoutModalOpen(false);
                            onOpenAuth('login');
                          }}
                          className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                        >
                          Sign In / Register First →
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleConfirmEnrollment}
                    className="font-bold bg-emerald-700 hover:bg-emerald-600 text-white shadow-md"
                  >
                    Confirm & Activate Masterclass ({activeSelectedPackage.displayPrice})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => setCheckoutModalOpen(false)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="text-[11px] text-slate-400 text-center font-mono">
                  🔒 Secure transaction • 100% Satisfaction Guarantee
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
