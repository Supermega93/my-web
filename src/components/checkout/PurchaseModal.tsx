import React, { useState, useEffect } from 'react';
import { Product } from '../../types.ts';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { api } from '../../services/api.ts';
import { 
  EFT_BANKING_DETAILS, 
  buildEftWhatsAppUrl, 
  generateEftReference 
} from '../../constants/eftBankingDetails.ts';
import { auth, db } from '../../lib/firebase.ts';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  CheckCircle2, 
  Download, 
  Key, 
  Copy, 
  Check, 
  Lock, 
  AlertCircle,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Building2,
  CreditCard,
  MessageCircle,
  Clock,
  ShieldAlert,
  RefreshCw,
  Info
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
  const [customerPhone, setCustomerPhone] = useState('');

  // Generates official order payment reference e.g. MAL-7K4Q9X
  const generateMalReference = (): string => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'MAL-' + rand;
  };
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);

  // Payment method selection: 'paypal' (Instant Online Card/PayPal) or 'manual_eft' (Standard Bank Transfer)
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'manual_eft'>('manual_eft');

  // EFT Pending Order State (once created by customer)
  const [eftPendingOrder, setEftPendingOrder] = useState<{
    orderId: string;
    reference: string;
    amountZar: number;
    productName: string;
    bankingDetails: typeof EFT_BANKING_DETAILS;
  } | null>(null);

  // Status check state when polling for admin verification
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeVerifiedResult, setActiveVerifiedResult] = useState<any>(verifiedResult || null);

  // Sync user defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user?.name && !customerName) setCustomerName(user.name);
      if (user?.email && !customerEmail) setCustomerEmail(user.email);
      if ((user as any)?.phone && !customerPhone) setCustomerPhone((user as any).phone);
      setErrorMessage(null);
      setLoading(false);
      setPendingRedirectUrl(null);
      setEftPendingOrder(null);
      setStatusMessage(null);
      setActiveVerifiedResult(verifiedResult || null);
    }
  }, [isOpen, user, verifiedResult]);

  if (!isOpen) return null;

  // Resolved product data (fallback to verified result if available)
  const activeProduct = product || (activeVerifiedResult?.product as Product | null);
  if (!activeProduct && !activeVerifiedResult) return null;

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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleCopyLicense = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // 1. Submit Payment Handoff (PayPal Instant Online Checkout)
  const handleContinueToPayPal = async () => {
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

      // Create PayPal payment order
      const createRes = await api.createPayPalOrder({
        productId: activeProduct!.id,
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim() || 'Trader Customer',
        tierName: tier?.name || activeProduct!.name,
        amountUsd: basePriceUsd
      });

      if (!createRes.success) {
        setErrorMessage(createRes.error || 'Failed to create PayPal payment order.');
        setLoading(false);
        return;
      }

      // Capture & fulfill PayPal payment
      const captureRes = await api.capturePayPalOrder({
        paypalOrderId: createRes.orderId,
        productId: activeProduct!.id,
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim() || 'Trader Customer',
        tierName: tier?.name || activeProduct!.name,
        amountUsd: basePriceUsd
      });

      if (captureRes.success && captureRes.verified) {
        // Dual Persistence to Firestore if user is currently authenticated in Firebase Auth
        if (auth.currentUser && captureRes.order?.id) {
          try {
            const orderRef = doc(db, 'orders', captureRes.order.id);
            await setDoc(orderRef, {
              id: captureRes.order.id,
              userId: auth.currentUser.uid,
              productId: activeProduct!.id,
              productName: displayProductName,
              amount: basePriceUsd,
              currency: 'USD',
              paymentStatus: 'paid',
              transactionId: captureRes.order.transaction_id || createRes.orderId,
              paymentMethod: 'paypal',
              notes: 'Paid via PayPal instant checkout',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } catch (fbErr) {
            console.warn('[Firestore PayPal Order Sync Notice]:', fbErr);
          }
        }

        setActiveVerifiedResult({
          order: captureRes.order,
          product: activeProduct,
          license: captureRes.license,
          downloadUrl: isEa ? null : (activeProduct?.download_url || '/downloads/the-school-of-ai-trading-architecture-vol1.pdf'),
          studentTier: captureRes.studentTier
        });
        onPurchaseSuccess?.();
      } else {
        setErrorMessage(captureRes.error || 'PayPal payment authorization could not be completed.');
      }
    } catch (err: any) {
      console.error('[PayPal Checkout Error]:', err);
      setErrorMessage(err.message || 'Unable to connect to PayPal.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Manual EFT / Bank Transfer Order
  // Direct write to Firestore orders collection using Firebase client SDK (no /api route called)
  const handleCreateManualEftOrder = async () => {
    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address so the administrator can link your transfer.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service and Risk Disclosure to continue.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const reference = generateMalReference();
      const orderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const nowIso = new Date().toISOString();

      // Save directly to Firestore orders collection using Firebase client SDK
      const orderDocRef = doc(db, 'orders', orderId);
      const orderData = {
        id: orderId,
        name: customerName.trim() || 'Trader Customer',
        email: customerEmail.trim().toLowerCase(),
        phone: customerPhone.trim() || '',
        product: displayProductName,
        amount: zarAmount,
        currency: 'ZAR',
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'manual_eft',
        reference: reference,
        transactionId: reference,
        productId: activeProduct?.id || 'prod_custom',
        productName: displayProductName,
        userId: auth.currentUser?.uid || 'guest',
        notes: 'Manual EFT order for ' + displayProductName + '. Awaiting WhatsApp proof of payment.',
        createdAt: nowIso,
        updatedAt: nowIso
      };

      await setDoc(orderDocRef, orderData);

      setEftPendingOrder({
        orderId: orderId,
        reference: reference,
        amountZar: zarAmount,
        productName: displayProductName,
        bankingDetails: EFT_BANKING_DETAILS
      });
    } catch (err: any) {
      console.error('[Create EFT Order Firestore Error]:', err);
      setErrorMessage(err.message || 'Failed to save order to database. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Customer Check Status Button (Polls Firestore directly - no /api route)
  const handleCheckEftStatus = async () => {
    if (!eftPendingOrder) return;
    setCheckingStatus(true);
    setStatusMessage(null);
    try {
      const orderSnap = await getDoc(doc(db, 'orders', eftPendingOrder.orderId));
      if (orderSnap.exists()) {
        const orderData = orderSnap.data();
        const isPaid = orderData.status === 'paid' || orderData.paymentStatus === 'paid';
        if (isPaid) {
          setStatusMessage('Payment verified! Granting access now...');
          setActiveVerifiedResult({
            order: orderData,
            product: activeProduct,
            license: orderData.license || null,
            downloadUrl: isEa ? null : (activeProduct?.download_url || '/downloads/the-school-of-ai-trading-architecture-vol1.pdf'),
            studentTier: isMasterclass ? 'paid' : null
          });
          onPurchaseSuccess?.();
        } else if (orderData.status === 'failed' || orderData.status === 'rejected') {
          setStatusMessage('Your EFT payment verification was rejected or cancelled by administrator. Please contact support on WhatsApp.');
        } else {
          setStatusMessage('Status: PENDING VERIFICATION. Our administrator has not confirmed receipt in Standard Bank yet. Please ensure you sent your POP via WhatsApp.');
        }
      } else {
        setStatusMessage('Status: PENDING VERIFICATION. Order is recorded. Awaiting admin review.');
      }
    } catch (err: any) {
      console.warn('[EFT Order Status Read Notice]:', err);
      setStatusMessage('Order is awaiting verification. Please send your proof on WhatsApp.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === 'paypal') {
      handleContinueToPayPal();
    } else {
      handleCreateManualEftOrder();
    }
  };

  // ==========================================
  // VIEW 1: Verified Order Confirmation (Paid)
  // ==========================================
  if (activeVerifiedResult) {
    const licenseKey = activeVerifiedResult.license?.license_key;
    const downloadUrl = activeVerifiedResult.downloadUrl || '/downloads/the-school-of-ai-trading-architecture-vol1.pdf';
    const orderId = activeVerifiedResult.order?.id || `ord_${Date.now()}`;
    const txId = activeVerifiedResult.order?.transaction_id || activeVerifiedResult.order?.eft_reference || `tx_${Date.now()}`;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="lg"
        title="Payment Verified & Access Granted"
        subtitle="Your order has been authorized and confirmed by Mega AI Labs"
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
                  Payment Officially Verified
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wide uppercase">
                  PAID &amp; ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Thank you for your purchase. Your payment has been confirmed by our administration team and product access is now active.
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
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>
                  {activeVerifiedResult.order?.payment_method === 'manual_eft' 
                    ? '🏦 Manual EFT / Standard Bank' 
                    : (activeVerifiedResult.order?.payment_method === 'paypal' 
                      ? '🅿️ PayPal Instant Payment' 
                      : '💳 Online Payment')}
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Transaction / Reference</span>
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

  // =========================================================
  // VIEW 2: EFT Pending Order Details & Proof Submission
  // =========================================================
  if (eftPendingOrder) {
    // Pre-filled message on existing WhatsApp link
    const whatsAppMessage = 'Hi, I\'ve paid for ' + eftPendingOrder.productName + '. Reference: ' + eftPendingOrder.reference + '. Name: ' + (customerName.trim() || 'Customer') + '. Proof attached.';
    const whatsAppUrl = 'https://wa.me/' + EFT_BANKING_DETAILS.whatsAppNumber + '?text=' + encodeURIComponent(whatsAppMessage);
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="lg"
        title="Manual EFT / Bank Transfer Details"
        subtitle="Your order record has been created with PENDING status"
      >
        <div className="space-y-4 p-1">
          {/* Status Alert Banner */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-200">Order Status: PENDING VERIFICATION</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Pending POP
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                Please complete the manual bank transfer to Standard Bank and send your Proof of Payment (POP) via WhatsApp. Paid access and terminal licenses are unlocked once an authorized administrator verifies receipt.
              </p>
            </div>
          </div>

          {/* Payment Reference & Exact Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Payment Reference (Required)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(eftPendingOrder.reference, 'ref')}
                  className="text-[10px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedItem === 'ref' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedItem === 'ref' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-base font-extrabold text-white tracking-wider select-all">
                {eftPendingOrder.reference}
              </div>
              <p className="text-[10px] text-slate-400">
                Use this reference as the recipient beneficiary reference so we can instantly identify your payment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Total Amount to Transfer
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(formattedZar, 'amt')}
                  className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedItem === 'amt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedItem === 'amt' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-base font-extrabold text-emerald-400">
                R {formattedZar} ZAR
              </div>
              <p className="text-[10px] text-slate-400">
                Equivalent to ${basePriceUsd.toFixed(2)} USD. Transfer the exact ZAR amount.
              </p>
            </div>
          </div>

          {/* Centralized Official Standard Bank Account Details */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Mega AI Labs Official Bank Details
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Standard Bank South Africa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Bank Name</span>
                <span className="font-semibold text-slate-200 block">{EFT_BANKING_DETAILS.bankName}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono block">Account Holder</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(EFT_BANKING_DETAILS.accountHolder, 'holder')}
                    className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedItem === 'holder' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedItem === 'holder' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="font-semibold text-slate-200 block">{EFT_BANKING_DETAILS.accountHolder}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono block">Account Number</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(EFT_BANKING_DETAILS.accountNumber.replace(/\s+/g, ''), 'acc')}
                    className="text-[10px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    {copiedItem === 'acc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedItem === 'acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="font-mono font-bold text-sky-300 tracking-wider block select-all">
                  {EFT_BANKING_DETAILS.accountNumber}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Account Type</span>
                <span className="font-semibold text-slate-200 block">{EFT_BANKING_DETAILS.accountType}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono block">Universal Branch Code</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(EFT_BANKING_DETAILS.universalBranchCode || '051001', 'branch')}
                    className="text-[10px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    {copiedItem === 'branch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedItem === 'branch' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="font-mono font-bold text-emerald-300 tracking-wider block select-all">
                  {EFT_BANKING_DETAILS.universalBranchCode || '051001'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono block">SWIFT / BIC Code</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(EFT_BANKING_DETAILS.swiftBicCode || 'SBZAZAJJ', 'swift')}
                    className="text-[10px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    {copiedItem === 'swift' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedItem === 'swift' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="font-mono font-bold text-sky-300 tracking-wider block select-all">
                  {EFT_BANKING_DETAILS.swiftBicCode || 'SBZAZAJJ'}
                </span>
              </div>
            </div>

            {/* Overseas SWIFT guidance */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>International / Overseas Transfers:</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {EFT_BANKING_DETAILS.swiftBicNote || 'If you are receiving money from overseas, use SBZAZAJJ.'} Universal Branch Code: <strong className="text-slate-200">051001</strong>.
              </p>
            </div>
          </div>

          {/* Action Step 1: Send Proof via WhatsApp */}
          <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 space-y-3">
            <div className="flex items-center gap-2 text-slate-100">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#25D366]">
                Step 2: Send Proof of Payment (POP) via WhatsApp
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Once you have transferred <strong className="text-white">R {formattedZar} ZAR</strong> from your banking app, send your official bank proof (PDF download or screenshot) to our WhatsApp support line at <strong className="text-[#25D366]">{EFT_BANKING_DETAILS.whatsAppDisplay}</strong>.
            </p>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20 active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>SEND PAYMENT PROOF ON WHATSAPP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Verification Status Feedback / Polling */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCheckEftStatus}
              disabled={checkingStatus}
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
              <span>{checkingStatus ? 'Checking Bank Statement...' : 'Check If Admin Approved'}</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Close &amp; Complete Later
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // ==========================================
  // VIEW 3: Main Checkout Form (Selection)
  // ==========================================
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`Purchase ${displayProductName}`}
      subtitle={tier?.tagline || activeProduct?.short_description || activeProduct?.description || 'Select Manual EFT / Bank Transfer or PayPal'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
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
        {/* Payment Method Selector          */}
        {/* -------------------------------- */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Choose Payment Method
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Option A: Manual EFT / Bank Transfer */}
            <button
              type="button"
              onClick={() => setSelectedMethod('manual_eft')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                selectedMethod === 'manual_eft'
                  ? 'bg-amber-950/20 border-amber-500/80 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                selectedMethod === 'manual_eft' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-400'
              }`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-100">Manual EFT / Bank</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold uppercase">
                    Standard Bank
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Direct transfer &amp; send POP via WhatsApp. Branch 051001.
                </p>
              </div>
            </button>

            {/* Option B: PayPal & Card Instant Online Checkout */}
            <button
              type="button"
              onClick={() => setSelectedMethod('paypal')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                selectedMethod === 'paypal'
                  ? 'bg-blue-950/20 border-blue-500/80 shadow-md shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                selectedMethod === 'paypal' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-900 text-slate-400'
              }`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-100">PayPal / Cards</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono font-bold uppercase">
                    Instant
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  PayPal account, Visa, Mastercard. Instant digital unlock.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Method Explanation Note */}
        {selectedMethod === 'manual_eft' ? (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              <span>How Manual EFT Works:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              1. Submit your details to generate your official Order &amp; Payment Reference.<br />
              2. Transfer <strong className="text-white">R {formattedZar} ZAR</strong> to Standard Bank (Universal Branch: <strong className="text-white">051001</strong> | SWIFT: <strong className="text-white">SBZAZAJJ</strong>).<br />
              3. Send proof of payment via WhatsApp. Your order will be set to <strong className="text-amber-300">PENDING</strong> until an authorized administrator verifies receipt and activates your access.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-blue-400">
              <Lock className="w-3.5 h-3.5" />
              <span>PayPal Worldwide Online Checkout:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Instant activation for international cards, debit cards, and PayPal wallet balances. Billed in USD (<strong className="text-white">${basePriceUsd.toFixed(2)} USD</strong>). Digital licenses and downloads unlock automatically upon confirmation.
            </p>
          </div>
        )}

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
              Email Address <span className="text-slate-500 font-sans">(For order verification &amp; access)</span>
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

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Phone / WhatsApp Number <span className="text-slate-500 font-sans">(For payment confirmation &amp; WhatsApp proof)</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. +27 64 461 1412"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors font-sans"
            />
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
              I understand that trading involves substantial risk of loss. Past performance does not guarantee future results. I accept the Digital Terms of Service and understand EFT orders require manual admin verification before access is granted.
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

          {selectedMethod === 'manual_eft' ? (
            <button
              type="submit"
              disabled={loading || !agreedToTerms || !customerEmail}
              className={`min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loading || !agreedToTerms || !customerEmail
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Creating Pending EFT Order...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Get Standard Bank EFT Details (R {formattedZar} ZAR)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !agreedToTerms || !customerEmail}
              className={`min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loading || !agreedToTerms || !customerEmail
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing PayPal Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay with PayPal (${basePriceUsd.toFixed(2)} USD)</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
