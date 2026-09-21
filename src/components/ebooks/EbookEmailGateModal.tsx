import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Mail, Download, ArrowRight, CheckCircle2, Clock, Loader2, Sparkles } from 'lucide-react';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { requestFreeEbookDownload } from '../../services/ebookService.ts';
import confetti from 'canvas-confetti';

interface EbookEmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDownload?: (downloadUrl: string) => void;
}

export function EbookEmailGateModal({
  isOpen,
  onClose,
  onSuccessDownload,
}: EbookEmailGateModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signedDownloadUrl, setSignedDownloadUrl] = useState<string | null>(null);
  const [emailStatusInfo, setEmailStatusInfo] = useState<{
    dispatched: boolean;
    provider?: string;
    message?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('');
      setName('');
      setErrorMessage('');
      setSignedDownloadUrl(null);
      setEmailStatusInfo(null);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestFreeEbookDownload(cleanEmail, name);
      if (response.success && response.downloadUrl) {
        setSignedDownloadUrl(response.downloadUrl);
        setEmailStatusInfo({
          dispatched: !!response.emailDispatched,
          provider: response.emailDelivery?.provider,
          message: response.message,
        });

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (_) {}

        // Notify parent callback if provided
        if (onSuccessDownload) {
          onSuccessDownload(response.downloadUrl);
        }

        // Automatically initiate browser download via temporary anchor
        const tempLink = document.createElement('a');
        tempLink.href = response.downloadUrl;
        tempLink.setAttribute('download', 'The-Traders-Guide-to-Understanding-Strategy-Automation.pdf');
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      } else {
        setErrorMessage(response.error || 'Failed to process request. Please check your email address and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred while communicating with the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10"
        >
          {/* Header Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 w-full" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {!signedDownloadUrl ? (
              /* Phase 1: Email Lead Gate Form */
              <div className="space-y-6">
                {/* Book Header Preview */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <img
                    src={STOREFRONT_MEDIA.freeEbook.coverUrl}
                    alt={STOREFRONT_MEDIA.freeEbook.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-22 object-contain rounded shadow-md shrink-0 bg-slate-50"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>100% Free Master Guide</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                      The Trader's Guide to Understanding Strategy Automation
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">By M. Dinga • PDF Edition</p>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="text-lg font-bold text-slate-900">
                    Where should we send your download access?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Enter your email address below. You will receive immediate server-authorized download access to the complete unredacted guide.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                      Your First Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                      Email Address <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Generating Access...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Get Instant eBook Download</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-sans pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero spam. Direct digital delivery. No password required.</span>
                  </div>
                </form>
              </div>
            ) : (
              /* Phase 2: Authorized Access & Instant Download Granted */
              <div className="text-center py-4 space-y-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold uppercase">
                    Authorized Access Granted
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Your eBook Is Ready!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    Your authorized download for <span className="font-semibold text-slate-800">{email}</span> has been unlocked and downloaded.
                  </p>
                </div>

                {emailStatusInfo && (
                  <div className={`p-3.5 rounded-xl text-xs text-left ${emailStatusInfo.dispatched ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-900'}`}>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                      <div>
                        <p className="font-semibold">
                          {emailStatusInfo.dispatched 
                            ? 'Email Dispatched with PDF Attachment' 
                            : 'Direct Download Unlocked & Lead Recorded'}
                        </p>
                        <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                          {emailStatusInfo.message || (emailStatusInfo.dispatched ? `A copy was sent to ${email}.` : 'Your file download started automatically below.')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Temporary secure link expires in 15 minutes</span>
                  </div>

                  <a
                    href={signedDownloadUrl}
                    download="The-Traders-Guide-to-Understanding-Strategy-Automation.pdf"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer inline-flex"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Again If Not Started</span>
                  </a>
                </div>

                <button
                  onClick={handleClose}
                  className="text-xs font-mono text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer"
                >
                  Close & return to books
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
