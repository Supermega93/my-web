import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { api } from '../../services/api.ts';
import { 
  EFT_BANKING_DETAILS, 
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
  ShieldCheck,
  RefreshCw,
  Info,
  X,
  Shield
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

// Crisp Vector Badges for Payment Brands (fintech presentation)
function VisaLogo({ className = 'h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.1 1.2L12.5 15.2H8.3L5.1 4.1C4.9 3.3 4.7 3 4.1 2.6C3.1 2.1 1.5 1.6 0 1.3L0.1 0.8H6.9C7.8 0.8 8.6 1.4 8.8 2.4L10.4 11.2L14.7 1.2H19.1ZM35.8 10.7C35.8 6.6 30.1 6.4 30.2 4.6C30.2 4 30.7 3.4 31.9 3.2C32.5 3.1 34.1 3.1 35.8 3.9L36.5 0.9C35.5 0.5 34.3 0.2 32.7 0.2C28.7 0.2 25.9 2.3 25.8 5.4C25.7 7.7 27.7 9 29.3 9.8C30.9 10.6 31.5 11.1 31.5 11.8C31.5 12.9 30.2 13.3 29 13.4C26.9 13.4 25.7 12.8 24.8 12.4L24 15.5C25 16 26.8 16.4 28.7 16.4C33 16.4 35.8 14.3 35.8 10.7ZM46.4 15.2H50.1L46.8 1.2H43.4C42.6 1.2 41.9 1.6 41.6 2.4L35.5 15.2H39.8L40.7 12.8H45.9L46.4 15.2ZM41.8 9.8L43.9 4.1L45.1 9.8H41.8ZM24.9 1.2L21.6 15.2H17.5L20.8 1.2H24.9Z" fill="#1434CB" />
    </svg>
  );
}

function MastercardLogo({ className = 'h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="4" fill="#0A0E17" />
      <circle cx="14" cy="12" r="7" fill="#EB001B" />
      <circle cx="22" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9" />
    </svg>
  );
}

function MaestroLogo({ className = 'h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="4" fill="#0A0E17" />
      <circle cx="14" cy="12" r="7" fill="#EB001B" />
      <circle cx="22" cy="12" r="7" fill="#00A2E5" fillOpacity="0.88" />
    </svg>
  );
}

function DiscoverLogo({ className = 'h-4' }: { className?: string }) {
  return (
    <div className={`flex items-center font-black tracking-tighter text-[11px] font-sans text-slate-200 ${className}`}>
      DISC<span className="text-amber-500 font-extrabold mx-0.5">●</span>VER
    </div>
  );
}

function PayPalMark({ className = 'h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 84 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8 2.5C9.9 2.5 9.1 3.1 9 4.1L6.7 18.2C6.6 18.7 7 19.2 7.5 19.2H10.4C10.9 19.2 11.3 18.8 11.4 18.3L12.3 12.8C12.4 12.3 12.8 11.9 13.3 11.9H15.1C18.6 11.9 20.8 10.2 21.4 6.9C21.7 5.3 21.3 4.1 20.3 3.3C19.2 2.6 17.3 2.5 14.8 2.5H10.8Z" fill="#003087" />
      <path d="M14.6 6.9C14.3 8.7 12.8 8.7 11.5 8.7L10.3 16.3H8.2L10.1 4.5C10.1 4.5 10.2 4.5 10.3 4.5H13C14.8 4.5 15.8 4.6 16.3 5.1C16.8 5.6 16.8 6.4 14.6 6.9Z" fill="#0079C1" />
      <text x="26" y="16" fill="#003087" fontFamily="sans-serif" fontSize="15" fontWeight="900" fontStyle="italic">PayPal</text>
    </svg>
  );
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
  const { currentCurrency } = useCurrency();
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

  // Payment method selection: 'paypal' (Instant Online Card/PayPal) or 'manual_eft' (Standard Bank Transfer)
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'manual_eft'>('paypal');

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

  // Keyboard shortcut (Escape) & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sync user defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user?.name && !customerName) setCustomerName(user.name);
      if (user?.email && !customerEmail) setCustomerEmail(user.email);
      if ((user as any)?.phone && !customerPhone) setCustomerPhone((user as any).phone);
      setErrorMessage(null);
      setLoading(false);
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

  // 3. Customer Check Status Button (Polls Firestore directly)
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

  // Quick PayPal trigger directly from top button
  const handleDirectPayPalClick = () => {
    if (selectedMethod !== 'paypal') {
      setSelectedMethod('paypal');
    }
    if (!customerEmail || !agreedToTerms) {
      setErrorMessage('Please confirm your email address and accept the terms below to complete PayPal checkout.');
      // Scroll to inputs if needed
      return;
    }
    handleContinueToPayPal();
  };

  // ==========================================
  // VIEW 1: Verified Order Confirmation (Paid)
  // ==========================================
  if (activeVerifiedResult) {
    const licenseKey = activeVerifiedResult.license?.license_key;
    const downloadUrl = activeVerifiedResult.downloadUrl || '/downloads/the-school-of-ai-trading-architecture-vol1.pdf';
    const orderId = activeVerifiedResult.order?.id || `ord_${Date.now()}`;
    const txId = activeVerifiedResult.order?.transaction_id || activeVerifiedResult.order?.eft_reference || `tx_${Date.now()}`;

    return createPortal(
      <div 
        className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-center"
        onClick={onClose}
      >
        <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
        
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg my-auto bg-[#0B0F17] text-slate-100 rounded-3xl border border-emerald-500/30 shadow-2xl shadow-black/90 overflow-hidden text-left"
        >
          {/* Top Bar with Close Button */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between bg-slate-950/50">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Authorized &amp; Verified</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Access Provisioned
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Your order is officially confirmed by Mega AI Labs
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Confirmation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Payment Confirmed</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Your transaction has cleared successfully. Product access and licenses are now unlocked for your account.
                </p>
              </div>
            </div>

            {/* Receipt Table */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono text-[11px]">Product Asset</span>
                <span className="text-white font-bold text-right">{activeProduct?.name || 'Digital Trading Asset'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono text-[11px]">Provider</span>
                <span className="text-emerald-400 font-bold">
                  {activeVerifiedResult.order?.payment_method === 'manual_eft' 
                    ? '🏦 Standard Bank EFT' 
                    : '🅿️ PayPal Instant Payment'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono text-[11px]">Order ID</span>
                <span className="text-slate-300 font-mono text-[11px]">{orderId}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800/80 pt-2">
                <span className="text-slate-400 font-mono text-[11px]">Reference / TX</span>
                <span className="text-slate-200 font-mono text-[11px]">{txId}</span>
              </div>
            </div>

            {/* Product Specific Action: E-Book */}
            {isEbook && (
              <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Course Book Ready for Download
                  </h5>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your 71-page comprehensive curriculum manual &quot;{activeProduct?.name}&quot; is ready.
                </p>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-sky-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Course Book</span>
                </a>
              </div>
            )}

            {/* Product Specific Action: EA License */}
            {isEa && licenseKey && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white">Terminal License Key</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyLicense(licenseKey)}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl font-mono text-xs text-emerald-300 select-all tracking-wider text-center font-bold">
                  {licenseKey}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Terminal license is verified. Binary compilation (.ex5) and setfiles will be linked to your MT5 account.
                </p>
              </div>
            )}

            {/* Product Specific Action: Masterclass */}
            {isMasterclass && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Masterclass Levels 4–8 Unlocked
                </h5>
                <p className="text-xs text-slate-300">
                  Your student status is active. You can now access all advanced course modules.
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

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Done / Close Window
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // =========================================================
  // VIEW 2: EFT Pending Order Details & Proof Submission
  // =========================================================
  if (eftPendingOrder) {
    const whatsAppMessage = 'Hi, I\'ve paid for ' + eftPendingOrder.productName + '. Reference: ' + eftPendingOrder.reference + '. Name: ' + (customerName.trim() || 'Customer') + '. Proof attached.';
    const whatsAppUrl = 'https://wa.me/' + EFT_BANKING_DETAILS.whatsAppNumber + '?text=' + encodeURIComponent(whatsAppMessage);

    return createPortal(
      <div 
        className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-center"
        onClick={onClose}
      >
        <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
        
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg my-auto bg-[#0B0F17] text-slate-100 rounded-3xl border border-amber-500/30 shadow-2xl shadow-black/90 overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between bg-slate-950/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Pending Verification</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Bank Transfer (EFT) Instructions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete your transfer to Standard Bank and share proof via WhatsApp
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Reference & Amount Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Payment Reference */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Beneficiary Reference
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(eftPendingOrder.reference, 'ref')}
                    className="text-[10px] font-mono text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedItem === 'ref' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedItem === 'ref' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-lg font-black text-white tracking-wider select-all">
                  {eftPendingOrder.reference}
                </div>
                <p className="text-[10px] text-slate-400">
                  Required: Put this in your bank payment reference field.
                </p>
              </div>

              {/* Exact Amount */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Exact Amount to Transfer
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(formattedZar, 'amt')}
                    className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedItem === 'amt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedItem === 'amt' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-lg font-black text-emerald-400 tracking-tight">
                  R {formattedZar} ZAR
                </div>
                <p className="text-[10px] text-slate-400">
                  Equal to ${basePriceUsd.toFixed(2)} USD. Transfer exact ZAR amount.
                </p>
              </div>
            </div>

            {/* Standard Bank Account Details */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Standard Bank South Africa
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Official MAL Account</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Account Holder */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Account Holder</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(EFT_BANKING_DETAILS.accountHolder, 'holder')}
                      className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedItem === 'holder' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedItem === 'holder' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{EFT_BANKING_DETAILS.accountHolder}</span>
                </div>

                {/* Account Number */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Account Number</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(EFT_BANKING_DETAILS.accountNumber.replace(/\s+/g, ''), 'acc')}
                      className="text-[10px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      {copiedItem === 'acc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedItem === 'acc' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-mono font-bold text-sky-300 tracking-wider mt-0.5 block select-all">
                    {EFT_BANKING_DETAILS.accountNumber}
                  </span>
                </div>

                {/* Universal Branch Code */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Universal Branch Code</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(EFT_BANKING_DETAILS.universalBranchCode || '051001', 'branch')}
                      className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedItem === 'branch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedItem === 'branch' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-mono font-bold text-emerald-300 tracking-wider mt-0.5 block select-all">
                    {EFT_BANKING_DETAILS.universalBranchCode || '051001'}
                  </span>
                </div>

                {/* SWIFT / BIC */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">SWIFT / BIC Code</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(EFT_BANKING_DETAILS.swiftBicCode || 'SBZAZAJJ', 'swift')}
                      className="text-[10px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      {copiedItem === 'swift' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedItem === 'swift' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-mono font-bold text-sky-300 tracking-wider mt-0.5 block select-all">
                    {EFT_BANKING_DETAILS.swiftBicCode || 'SBZAZAJJ'}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp POP Submission */}
            <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 space-y-2.5">
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#25D366]">
                  Step 2: Send Payment Proof (POP) via WhatsApp
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Send your official bank confirmation to <strong className="text-white">{EFT_BANKING_DETAILS.whatsAppDisplay}</strong>. An administrator verifies receipt and unlocks your product access.
              </p>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/20 active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>SEND PAYMENT PROOF ON WHATSAPP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Polling Feedback */}
            {statusMessage && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCheckEftStatus}
                disabled={checkingStatus}
                className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
                <span>{checkingStatus ? 'Checking Statement...' : 'Check If Admin Approved'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Close &amp; Complete Later
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // ==========================================
  // VIEW 3: Main Checkout Form (Selection & Details)
  // Inspired by reference popu2.png fintech styling
  // ==========================================
  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      
      {/* Modal Dialog Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg my-auto bg-[#0B0F17] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl shadow-black/90 overflow-hidden text-left flex flex-col max-h-[92vh]"
      >
        {/* Top Header: Price & Product Breakdown (inspired by popu2.png) */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-transparent shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Secure Checkout</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug pt-1">
                {displayProductName}
              </h3>
              <p className="text-xs text-slate-400 leading-tight">
                {tier?.tagline || (isEa ? 'MetaTrader 5 Automated System • Pre-Calibrated Setfiles' : isEbook ? 'Digital Curriculum • 71 Pages + MQL5 Labs' : 'Institutional Trading Architecture')}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pricing Highlight Strip (like "Price per day / Total" in popu2.png) */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                Investment Total
              </span>
              <span className="text-xs text-slate-500 font-sans">
                One-time payment • Lifetime access terms
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-none">
                ${basePriceUsd.toFixed(2)} <span className="text-xs font-bold text-slate-400 font-sans">USD</span>
              </div>
              <div className="text-xs text-emerald-400 font-mono font-semibold mt-1">
                ≈ R {formattedZar} ZAR
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Fast Express Checkout Option: PayPal Buy Now (Inspired by popu2.png) */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDirectPayPalClick}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#FFC439] hover:bg-[#F4B41A] text-[#003087] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FFC439]/15 active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <PayPalMark className="h-5" />
              <span className="font-extrabold text-[#003087] text-sm">Buy Now</span>
              <span className="text-xs font-bold text-[#003087]/80 ml-1">(${basePriceUsd.toFixed(2)} USD)</span>
            </button>

            {/* Clean 'or' Divider with Card Network Badges (Inspired by popu2.png) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-xs font-mono text-slate-500 lowercase">or choose method</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Supported Card Networks Bar */}
            <div className="flex items-center justify-center gap-3 py-1 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <VisaLogo className="h-3.5 opacity-90" />
              <div className="w-px h-3 bg-slate-800" />
              <MastercardLogo className="h-4 opacity-90" />
              <div className="w-px h-3 bg-slate-800" />
              <MaestroLogo className="h-4 opacity-90" />
              <div className="w-px h-3 bg-slate-800" />
              <DiscoverLogo className="h-3.5 opacity-90" />
            </div>
          </div>

          {/* 2. Payment Method Segmented Selector */}
          <div className="space-y-2 pt-1">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Payment Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option A: PayPal / Online Cards */}
              <button
                type="button"
                onClick={() => setSelectedMethod('paypal')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedMethod === 'paypal'
                    ? 'bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  selectedMethod === 'paypal' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">PayPal / Cards</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold uppercase">
                      Instant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Visa, Mastercard, Amex, PayPal. Instant digital delivery.
                  </p>
                </div>
              </button>

              {/* Option B: Manual EFT / Bank Transfer */}
              <button
                type="button"
                onClick={() => setSelectedMethod('manual_eft')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedMethod === 'manual_eft'
                    ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  selectedMethod === 'manual_eft' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Bank Transfer (EFT)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold uppercase">
                      Standard Bank
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Transfer in ZAR (R {formattedZar}) &amp; send WhatsApp POP.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Method Context Tip */}
          {selectedMethod === 'paypal' ? (
            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span className="text-[11px] text-slate-300 leading-relaxed">
                Billed internationally in USD (<strong className="text-white">${basePriceUsd.toFixed(2)} USD</strong>). Supports debit, credit cards, and PayPal account balances. Immediate automated license unlock.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[11px] text-slate-300 leading-relaxed">
                Submit below to generate your official Reference. Transfer <strong className="text-white">R {formattedZar} ZAR</strong> to Standard Bank and share your POP on WhatsApp for rapid admin approval.
              </span>
            </div>
          )}

          {/* 3. Customer Information Inputs (Fintech Form Card) */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Account &amp; Delivery Details</span>
                <span className="text-[10px] text-slate-500 font-sans normal-case">Digital product destination</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Michael Dinga"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-sans placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Email Address <span className="text-emerald-400 font-mono text-[10px]">*Required for licenses</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="trader@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-sans placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  WhatsApp / Phone <span className="text-slate-500 font-sans text-[10px]">(Optional — for fast setup assistance)</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +27 64 461 1412"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-sans placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Terms and Risk Disclosure */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0 w-4 h-4 cursor-pointer accent-emerald-500"
                />
                <span className="text-[11px] text-slate-400 leading-relaxed select-none">
                  I accept the Terms of Service &amp; Risk Disclosure. I understand financial trading carries substantial risk and past performance does not guarantee future results.
                </span>
              </label>
            </div>

            {/* 4. High-Converting Primary Action Button (Inspired by popu2.png) */}
            <div className="pt-2">
              {selectedMethod === 'paypal' ? (
                <button
                  type="submit"
                  disabled={loading || !agreedToTerms || !customerEmail}
                  className={`w-full py-4 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                    loading || !agreedToTerms || !customerEmail
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:brightness-110 text-white shadow-blue-600/25 active:scale-[0.99]'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing PayPal Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Continue to Secure Payment (${basePriceUsd.toFixed(2)} USD)</span>
                      <ArrowRight className="w-4 h-4 opacity-80" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !agreedToTerms || !customerEmail}
                  className={`w-full py-4 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                    loading || !agreedToTerms || !customerEmail
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 shadow-amber-500/20 active:scale-[0.99]'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Generating Bank Reference...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Get Standard Bank Details (R {formattedZar} ZAR)</span>
                      <ArrowRight className="w-4 h-4 opacity-80" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* 5. Trust & Security Footer (Inspired by popu2.png) */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your payment is secured with 256-bit encryption</span>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                PCI-DSS Level 1
              </span>
              <span>•</span>
              <span>Verified Merchant</span>
              <span>•</span>
              <span>Instant Digital Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
