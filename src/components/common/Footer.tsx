import React, { useState } from 'react';
import { ActiveView } from '../../types.ts';
import { AlertTriangle, ShieldCheck, Mail, ArrowRight, X, Shield, Lock, CreditCard } from 'lucide-react';
import { Button } from './Button.tsx';
import { MegAiLogoIcon } from './MegAiLogo.tsx';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onTriggerBuildMyEa: () => void;
}

export function Footer({ onNavigate, onOpenAuth, onTriggerBuildMyEa }: FooterProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="w-full bg-[#0B1320] border-t border-slate-800/80 text-slate-400 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-slate-900 via-[#0A101D] to-slate-950 border border-slate-700/70 flex items-center justify-center shadow-md shadow-slate-950/20 group-hover:border-cyan-500/50 group-hover:scale-105 transition-all">
                <MegAiLogoIcon size={24} />
              </div>
              <div>
                <div className="flex items-baseline leading-none">
                  <span className="font-black text-white text-base tracking-tight font-sans">
                    MEG<span className="text-cyan-400 font-black">.</span>AI
                  </span>
                  <span className="font-black text-xs tracking-wider ml-1 text-slate-400 uppercase">
                    LABS
                  </span>
                  <span className="text-[9px] font-bold text-cyan-400 ml-0.5 align-super font-mono leading-none">
                    ™
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-0.5 font-semibold block">
                  AI Trading Technology & Automation
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Institutional Expert Advisors, algorithmic prompt engineering, and custom quantitative MQL5 development built around your trading edge.
            </p>

            <div className="pt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Institutional MQL5 Frameworks</span>
            </div>
          </div>

          {/* 1. Products */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
              Academy & Systems
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('academy')}
                  className="text-emerald-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Free Strategy Academy (1–8)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('prompt-architect')}
                  className="text-teal-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>AI Strategy Builder</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono uppercase">
                    Free
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('eas')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Flagship Trading Robot
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ebooks')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Handbook & E-Books
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('free-ebook')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Free Strategy Guide
                </button>
              </li>
            </ul>
          </div>

          {/* 2. Services */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
              Services & Tools
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('custom-ea')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Custom EA Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('prompt-architect')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  AI Strategy Builder (Free Tool)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('coaching')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>1-on-1 Consultation</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono uppercase">
                    Waitlist
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Company */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About & Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => setContactOpen(true)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact Desk
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Account */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
              Account & Portal
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Client Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portal')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Downloads Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Security & Trust Row */}
        <div className="mt-12 p-6 rounded-3xl bg-[#080E18] border border-slate-800/90 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Security &amp; Trust Assurance
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Institutional protocols protecting your transactions, trading intellectual property, and data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full w-fit shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Merchant • 256-Bit SSL Protected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
            {/* 1. SSL Encryption */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400 shadow-inner">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    256-Bit SSL Encryption
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                    TLS 1.3
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All traffic, digital downloads, and checkout requests are encrypted end-to-end using bank-grade cryptographic certificates.
                </p>
              </div>
            </div>

            {/* 2. Secure Payments */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-emerald-400 shadow-inner">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Secure Payments
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                    PCI-DSS
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compliant checkout processing via PayPal, Visa, Mastercard, and direct verified Standard Bank EFT with zero hidden fees.
                </p>
              </div>
            </div>

            {/* 3. Data Privacy */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-indigo-400 shadow-inner">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Strict Data Privacy
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                    NDA Protected
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your trading strategy architecture, setfiles, and personal details remain 100% private. We never sell or share client data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Risk Disclaimer Box */}
        <div className="mt-12 p-5 sm:p-6 rounded-3xl bg-[#080E18] border border-slate-800 text-slate-400 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-semibold uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Quantitative Trading Risk Disclosure</span>
          </div>
          <p>
            Trading foreign exchange, indices, and CFDs with automated Expert Advisors carries substantial financial risk and is not suitable for all investors. Past performance, backtests, and simulation metrics do not guarantee future live execution results. All software, code templates, and educational materials are provided for systematic research and informational purposes.
          </p>
        </div>

        {/* Bottom Legal Links & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MEG.AI LABS. All rights reserved.</p>

          <div className="flex items-center gap-5 text-xs font-mono">
            <button 
              onClick={() => setLegalModal('privacy')} 
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => setLegalModal('terms')} 
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Contact & Support</h3>
                <p className="text-xs text-slate-500">Quantitative Development Desk</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Have questions about an Expert Advisor, custom development quotation, or coaching waitlist? Reach our engineering team directly:
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-emerald-800 font-bold select-all">
              support@ea-automation.com
            </div>

            <p className="text-[11px] text-slate-500">
              Developer replies within 24 business hours. Monday – Friday (London Session).
            </p>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setContactOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 capitalize">
              {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    At EA Automation Hub, we take intellectual property and algorithmic discretion with utmost confidentiality. Any client-submitted strategies, indicators, or parameters are protected under strict Non-Disclosure Protocols.
                  </p>
                  <p>
                    We never sell, rent, or share your proprietary trading strategies, email addresses, or transaction data with third parties.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All Expert Advisors and downloadable materials sold through EA Automation Hub are licensed for single-user execution on designated MetaTrader terminals. Reverse-engineering, decompilation, and unauthorized redistribution are strictly prohibited.
                  </p>
                  <p>
                    All products are provided "as-is" for algorithmic research. Users are solely responsible for compliance with their broker and prop firm terms.
                  </p>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setLegalModal(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
