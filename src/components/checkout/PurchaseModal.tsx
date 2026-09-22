import React, { useState, useEffect } from 'react';
import { Product } from '../../types.ts';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { api } from '../../services/api.ts';
import { 
  CheckCircle2, 
  Download, 
  Key, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  ExternalLink,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  tier?: {
    id: string;
    name: string;
    price: number;
    currency?: string;
    displayPrice?: string;
    tagline?: string;
  } | null;
  onPurchaseSuccess?: () => void;
  verifiedResult?: {
    order?: any;
    product?: any;
    license?: any;
    downloadUrl?: string;
    studentTier?: string | null;
  } | null;
}

export function PurchaseModal({
  isOpen,
  onClose,
  product,
  tier,
  onPurchaseSuccess,
  verifiedResult,
}: PurchaseModalProps) {
  const { user } = useAuth();
  const { currentCurrency, formatPrice: formatCurrencyPrice } = useCurrency();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);

  // Sync user defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user?.name && !customerName) setCustomerName(user.name);
      if (user?.email && !customerEmail) setCustomerEmail(user.email);
      setErrorMessage(null);
      setLoading(false);
      setPendingRedirectUrl(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Resolved product data (fallback to verified result if available)
  const activeProduct = product || (verifiedResult?.product as Product | null);
  if (!activeProduct && !verifiedResult) return null;

  const isEa = activeProduct?.type === 'ea';
  const isEbook = activeProduct?.type === 'ebook' || activeProduct?.id?.startsWith('prod_ebook_');
  const isMasterclass = activeProduct?.id?.startsWith('masterclass') || activeProduct?.id === 'bundle' || activeProduct?.id === 'premium';

  // Dynamic pricing with tier override
  const zarRate = 18.25;
  const basePriceUsd = tier?.price ?? activeProduct?.price ?? 89;
  const zarAmount = (tier?.currency || activeProduct?.currency) === 'ZAR' 
    ? basePriceUsd 
    : Math.round(basePriceUsd * zarRate * 100) / 100;
  const formattedZar = zarAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const displayProductName = tier?.name ? `${activeProduct?.name} — ${tier.name}` : (activeProduct?.name || 'Digital Trading Asset');

  const handleCopyLicense = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleContinueToYoco = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive your order receipt and access.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service and Risk Disclosure to continue.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const amountInCents = Math.round(zarAmount * 100);
      const res = await api.createYocoCheckout({
        productId: activeProduct!.id,
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim() || 'Trader Customer',
        tierName: tier?.name || activeProduct!.name,
        amountInCents
      });

      if (res.success && res.redirectUrl) {
        setPendingRedirectUrl(res.redirectUrl);
        // Seamless handoff to Yoco Hosted Payment Page
        window.location.href = res.redirectUrl;
      } else {
        setErrorMessage(res.error || 'Failed to create Yoco checkout session. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('[Yoco Checkout Request Error]:', err);
      setErrorMessage(err.message || 'Unable to connect to Yoco payment gateway.');
      setLoading(false);
    }
  };

  // ==========================================
  // VIEW: Verified Order Confirmation
  // ==========================================
  if (verifiedResult) {
    const licenseKey = verifiedResult.license?.license_key;
    const downloadUrl = verifiedResult.downloadUrl || '/downloads/the-school-of-ai-trading-architecture-vol1.pdf';
    const orderId = verifiedResult.order?.id || `ord_${Date.now()}`;
    const txId = verifiedResult.order?.transaction_id || `yoco_tx_${Date.now()}`;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="lg"
        title="Payment Verified"
        subtitle="Your order has been authorized and confirmed by Yoco"
      >
        <div className="space-y-5 p-1">
          {/* Header confirmation badge */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-100">
                  Payment Verified via Yoco
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wide uppercase">
                  Confirmed
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Thank you for your purchase. Your payment has been securely verified and access has been granted immediately.
              </p>
            </div>
          </div>

          {/* Order Details Summary */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Product</span>
              <span className="text-slate-100 font-bold">{activeProduct?.name || 'Digital Trading Asset'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Payment Provider</span>
              <span className="text-sky-400 font-bold flex items-center gap-1">
                <span>🇿🇦 Yoco Hosted Checkout</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Transaction ID</span>
              <span className="text-slate-300 font-mono">{txId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Order ID</span>
              <span className="text-slate-300 font-mono">{orderId}</span>
            </div>
          </div>

          {/* Product Specific Action: E-Book */}
          {isEbook && (
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h5 className="text-sm font-bold text-slate-100">Course Book Access Ready</h5>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your 71-page comprehensive manual &quot;{activeProduct?.name}&quot; is ready for instant download and online reading.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-sky-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Course Book</span>
                </a>
              </div>
            </div>
          )}

          {/* Product Specific Action: EA */}
          {isEa && licenseKey && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">Terminal License Key</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyLicense(licenseKey)}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl font-mono text-xs text-emerald-300 select-all tracking-wider text-center">
                {licenseKey}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                ℹ️ Terminal license is active. Institutional binary compilation will be provisioned to your MetaTrader Account ID via customer portal.
              </p>
            </div>
          )}

          {/* Product Specific Action: Masterclass */}
          {isMasterclass && (
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-3">
              <h5 className="text-sm font-bold text-slate-100">Masterclass Levels 4–8 Unlocked</h5>
              <p className="text-xs text-slate-300">
                Your student profile has been upgraded to active Masterclass status. You can now access all advanced curriculum modules.
              </p>
              <a
                href="/academy"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Enter Masterclass Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Close button */}
          <div className="pt-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Window
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // ==========================================
  // VIEW: Checkout & Yoco Handoff (Main Modal)
  // ==========================================
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`Purchase ${displayProductName}`}
      subtitle={tier?.tagline || activeProduct?.short_description || activeProduct?.description || 'Complete your purchase securely via Yoco'}
    >
      <form onSubmit={handleContinueToYoco} className="space-y-4 p-1">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {pendingRedirectUrl && (
          <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-500/40 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sky-300 font-semibold">
              <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Redirecting to Yoco Hosted Checkout...</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              If your browser or pop-up blocker prevents automatic redirect, please click the button below:
            </p>
            <a
              href={pendingRedirectUrl}
              target="_top"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <span>Open Yoco Payment Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* -------------------------------- */}
        {/* Order Summary                    */}
        {/* -------------------------------- */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Order Summary
          </div>
          
          <div className="flex items-start justify-between gap-4 pt-1">
            <div>
              <div className="text-sm font-bold text-slate-100 leading-snug">
                {displayProductName}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {tier?.tagline || (
                  <>
                    {isEbook && 'Complete 71-Page Digital Course Book (PDF Edition)'}
                    {isEa && 'Terminal License + Continuous Logic Updates'}
                    {isMasterclass && 'Complete Academy Access + Levels 4–8 Curriculum'}
                  </>
                )}
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <div className="text-base font-extrabold text-sky-400 font-mono">
                R {formattedZar} ZAR
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                ${basePriceUsd.toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Your Details                     */}
        {/* -------------------------------- */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Your Details
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Email Address <span className="text-slate-500 font-sans">(For instant license &amp; receipt)</span>
            </label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="trader@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors font-sans"
            />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Payment (Powered by Yoco)        */}
        {/* -------------------------------- */}
        <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Payment</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">🇿🇦 South Africa</span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Secure payment powered by Yoco</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your payment will be completed securely on Yoco&apos;s hosted checkout. You do not need to enter card details on this website.
            </p>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Terms / Risk Acknowledgement    */}
        {/* -------------------------------- */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 leading-relaxed select-none">
              I understand that trading involves substantial risk of loss. Past performance does not guarantee future results. I accept the Digital Terms of Service and End-User License Agreement.
            </span>
          </label>
        </div>

        {/* -------------------------------- */}
        {/* Action Buttons                   */}
        {/* -------------------------------- */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <button
            type="submit"
            disabled={loading || !agreedToTerms || !customerEmail}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              loading || !agreedToTerms || !customerEmail
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Redirecting to Yoco...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Continue to Yoco (R {formattedZar} ZAR)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
