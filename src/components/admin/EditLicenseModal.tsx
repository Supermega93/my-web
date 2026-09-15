import React, { useState, useEffect } from 'react';
import { License, LicenseStatus, LicenseDeliveryStatus } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { 
  Key, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle, 
  Database, 
  FileText,
  User,
  ShoppingBag
} from 'lucide-react';

interface EditLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  onSaveSuccess: (updated: License) => void;
}

export function EditLicenseModal({
  isOpen,
  onClose,
  license,
  onSaveSuccess,
}: EditLicenseModalProps) {
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isLifetime, setIsLifetime] = useState(true);
  const [status, setStatus] = useState<LicenseStatus>('active');
  const [deliveryStatus, setDeliveryStatus] = useState<LicenseDeliveryStatus>('pending');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (license) {
      // Format start date to YYYY-MM-DD for date input
      if (license.starts_at) {
        setStartsAt(license.starts_at.slice(0, 10));
      } else if (license.created_at) {
        setStartsAt(license.created_at.slice(0, 10));
      } else {
        setStartsAt(new Date().toISOString().slice(0, 10));
      }

      // Format expiry date
      if (license.expires_at) {
        setExpiresAt(license.expires_at.slice(0, 10));
        setIsLifetime(false);
      } else {
        setExpiresAt('');
        setIsLifetime(true);
      }

      setStatus(license.status || 'active');
      setDeliveryStatus(license.delivery_status || 'pending');
      setDeliveryNotes(license.delivery_notes || '');
      setFeedback(null);
    }
  }, [license]);

  if (!license) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(license.license_key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleApplyPreset = (days: number | 'lifetime') => {
    if (days === 'lifetime') {
      setIsLifetime(true);
      setExpiresAt('');
      return;
    }
    setIsLifetime(false);
    const base = startsAt ? new Date(startsAt) : new Date();
    base.setDate(base.getDate() + days);
    setExpiresAt(base.toISOString().slice(0, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        starts_at: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
        expires_at: isLifetime ? null : (expiresAt ? new Date(expiresAt).toISOString() : null),
        status,
        delivery_status: deliveryStatus,
        delivery_notes: deliveryNotes.trim() || null,
      };

      const res = await api.updateAdminLicense(license.id, payload);

      if (res.success) {
        setFeedback({
          success: true,
          message: res.supabaseSynced 
            ? 'License updated and successfully synced to Supabase.' 
            : `License updated in SQLite (${res.supabaseMessage}).`,
        });
        onSaveSuccess(res.license);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setFeedback({
          success: false,
          message: 'Failed to update license.',
        });
      }
    } catch (err: any) {
      setFeedback({
        success: false,
        message: err.message || 'Error updating license.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage EA License & Delivery Governance"
      subtitle={`License Key: ${license.license_key}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-slate-100 py-1">
        {/* License Reference Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-slate-200 truncate">
                {license.license_key}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyKey}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey ? 'Copied' : 'Copy Key'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-900 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Customer</span>
              <span className="text-slate-200 font-semibold">{license.user_name || 'Trader'}</span>
              <span className="text-slate-400 block text-[11px] truncate">{license.user_email || license.user_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Product</span>
              <span className="text-slate-200 font-semibold truncate block">{license.product_name || license.product_id}</span>
              <span className="text-emerald-400 block text-[11px]">{license.product_platform || 'MT5'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Order Ref</span>
              <span className="text-slate-200 font-semibold">{license.order_id || 'Direct'}</span>
              <span className="text-slate-400 block text-[11px]">
                {license.order_amount ? `$${license.order_amount} ${license.order_currency || 'USD'}` : 'Provisioned'}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.success
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}>
            {feedback.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Section 1: Validity Dates */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>1. License Validity Period (Admin Controlled)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">
                Start Date:
              </label>
              <input
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 block">Date customer terminal activation begins.</span>
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400">
                  Expiry Date:
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-emerald-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLifetime}
                    onChange={(e) => {
                      setIsLifetime(e.target.checked);
                      if (e.target.checked) setExpiresAt('');
                    }}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                  />
                  <span>Lifetime (No Expiry)</span>
                </label>
              </div>

              <input
                type="date"
                value={expiresAt}
                disabled={isLifetime}
                onChange={(e) => {
                  setExpiresAt(e.target.value);
                  setIsLifetime(false);
                }}
                className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono ${
                  isLifetime 
                    ? 'border-slate-800 text-slate-500 cursor-not-allowed bg-slate-950' 
                    : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              <span className="text-[10px] text-slate-500 block">
                {isLifetime ? 'License will never automatically expire.' : 'After this date, the EA will cease execution.'}
              </span>
            </div>
          </div>

          {/* Date Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] uppercase font-mono text-slate-500">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset(30)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono transition-colors"
            >
              +30 Days (Evaluation)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(90)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono transition-colors"
            >
              +90 Days (Quarterly)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(365)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono transition-colors"
            >
              +1 Year (Annual)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('lifetime')}
              className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-colors ${
                isLifetime 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              Lifetime (No Expiry)
            </button>
          </div>
        </div>

        {/* Section 2: License Status & Delivery Status */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2. Authorization & Binary Delivery Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* License Status */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">
                License Authorization Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LicenseStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="active">Active (Full Execution Allowed)</option>
                <option value="pending">Pending (Awaiting Verification)</option>
                <option value="suspended">Suspended (Temporarily Halted)</option>
                <option value="expired">Expired (Validity Period Over)</option>
                <option value="revoked">Revoked (Permanently Cancelled)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">Controlled solely by administrators.</span>
            </div>

            {/* Delivery Status */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">
                EA Delivery Status (Manual Provisioning):
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value as LicenseDeliveryStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="pending">Pending (Awaiting Admin Delivery)</option>
                <option value="processing">Processing (Compiling & Binding)</option>
                <option value="delivered">Delivered (Sent to Customer)</option>
                <option value="revoked">Revoked (Delivery Withheld)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">EAs are never automatically downloadable.</span>
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs text-slate-400 block flex items-center justify-between">
              <span>Admin Delivery Notes / Audit Log:</span>
              <span className="text-[10px] text-slate-500 font-mono">Visible on customer dashboard</span>
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g., Compiled MT5 v3.1 build bound to terminal account #9102847. Delivered via email on 2025-09-15."
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono resize-none placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Cloud Persistence Notice */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3 text-xs">
          <Database className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-slate-300 font-medium block">Dual Cloud & SQLite Persistence</span>
            <span className="text-[11px] text-slate-500 block">
              Saving updates the local database and automatically synchronizes to Supabase <code className="text-emerald-400 font-mono">public.licenses</code>. Customers have read-only access.
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={saving}
            icon={<ShieldCheck className="w-4 h-4 text-slate-950" />}
          >
            Save & Sync to Supabase
          </Button>
        </div>
      </form>
    </Modal>
  );
}
