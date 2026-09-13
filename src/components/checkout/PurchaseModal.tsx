import React, { useState } from 'react';
import { Product } from '../../types.ts';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { 
  CheckCircle2, 
  Download, 
  Key, 
  Copy, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onPurchaseSuccess: () => void;
}

export function PurchaseModal({
  isOpen,
  onClose,
  product,
  onPurchaseSuccess,
}: PurchaseModalProps) {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    transactionId: string;
    licenseKey?: string;
    downloadUrl?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!product) return null;

  const formatPrice = (price: number, currency: string = 'USD') => {
    return `$${price.toFixed(2)}`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !agreedToTerms) return;

    try {
      setLoading(true);
      const res = await api.createOrder({
        productId: product.id,
        amount: product.price,
        currency: product.currency || 'USD',
        customerEmail,
        customerName: customerName || 'Trader',
        paymentMethod,
      });

      setOrderResult({
        orderId: res.orderId,
        transactionId: res.transactionId,
        licenseKey: res.licenseKey,
        downloadUrl: res.downloadUrl,
      });

      onPurchaseSuccess();
    } catch (err: any) {
      alert(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    if (orderResult?.licenseKey) {
      navigator.clipboard.writeText(orderResult.licenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleDownload = () => {
    const filename = orderResult?.downloadUrl || `${product.name.toLowerCase().replace(/\s+/g, '-')}-delivery.zip`;
    const blob = new Blob([
      `EA Automation Hub - Official Product Delivery\n` +
      `Product: ${product.name}\n` +
      `Order ID: ${orderResult?.orderId}\n` +
      `Transaction ID: ${orderResult?.transactionId}\n` +
      `License Key: ${orderResult?.licenseKey || 'N/A'}\n` +
      `Recipient: ${customerName} (${customerEmail})\n` +
      `Verified by EA Automation Hub Core Server.\n`
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.split('/').pop() || 'delivery.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleModalClose = () => {
    setOrderResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={orderResult ? 'Order Confirmed!' : `Purchase ${product.name}`}
      subtitle={
        orderResult
          ? 'Your order has been verified and provisioned in your account.'
          : 'Instant automated digital delivery with license verification.'
      }
      maxWidth="md"
    >
      {orderResult ? (
        <div className="space-y-6 text-slate-100 py-2">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Successful</h3>
            <p className="text-xs text-slate-400 font-mono">
              Transaction ID: <span className="text-slate-300">{orderResult.transactionId}</span>
            </p>
          </div>

          {/* License Key Box (for EAs) */}
          {orderResult.licenseKey && (
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 space-y-2">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                Your Single Terminal License Key:
              </span>
              <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                <span className="font-mono text-xs font-bold text-slate-100 truncate">
                  {orderResult.licenseKey}
                </span>
                <button
                  onClick={copyKey}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                  title="Copy Key"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Enter this key into your EA input parameter <code className="text-emerald-400 font-mono">InpLicenseKey</code> inside MetaTrader 5.
              </p>
            </div>
          )}

          {/* Download CTA */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleDownload}
              icon={<Download className="w-4 h-4 text-slate-950" />}
            >
              Download Package Now (.EX5 / PDF)
            </Button>
            <p className="text-[11px] text-slate-500 text-center font-mono">
              This package is also permanently archived in your Customer Dashboard.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Button variant="outline" size="sm" onClick={handleModalClose}>
              Done & Return to App
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCheckout} className="space-y-4 text-xs">
          {/* Order Summary Summary Box */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-200 font-bold block">{product.name}</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {product.type === 'ea' ? 'Lifetime Single Terminal License' : 'Digital PDF & EPUB Edition'}
              </span>
            </div>
            <div className="text-right font-mono">
              <span className="text-lg font-bold text-emerald-400">{formatPrice(product.price, product.currency)}</span>
              <span className="text-[10px] text-slate-400 block uppercase">{product.currency || 'USD'}</span>
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Email (License & Delivery)</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="trader@example.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-slate-400 font-mono mb-1.5">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 font-mono transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card / Stripe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 font-mono transition-colors ${
                  paymentMethod === 'crypto'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Crypto (USDT/BTC)</span>
              </button>
            </div>
          </div>

          {/* Risk acknowledgment checkbox */}
          <div className="pt-2 space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0"
              />
              <span className="text-[11px] text-slate-400 leading-snug">
                I understand that trading involves substantial risk of loss. Past performance and backtests do not guarantee future results. I accept the Digital Terms of Service and End-User License Agreement.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={loading || !agreedToTerms}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-slate-950" />}
            >
              {loading ? 'Authorizing...' : `Confirm & Pay $${product.price.toFixed(2)}`}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
