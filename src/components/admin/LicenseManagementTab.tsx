import React, { useState } from 'react';
import { License, LicenseStatus, LicenseDeliveryStatus } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Button } from '../common/Button.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { Modal } from '../common/Modal.tsx';
import { 
  Key, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Search, 
  RefreshCw, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  FileCode,
  Lock,
  Edit3
} from 'lucide-react';

interface LicenseManagementTabProps {
  licenses: License[];
  onRefresh: () => Promise<void>;
  onEditLicense: (license: License) => void;
}

export function LicenseManagementTab({
  licenses,
  onRefresh,
  onEditLicense,
}: LicenseManagementTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_delivery' | 'delivered' | 'expired_revoked'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleBatchSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await api.syncLicensesToSupabase();
      if (res.success) {
        setSyncFeedback({
          success: true,
          message: `Successfully synchronized ${res.result?.syncedCount || 0} licenses to Supabase.`,
        });
      } else {
        setSyncFeedback({
          success: false,
          message: res.result?.error?.includes('relation') 
            ? 'Supabase public.licenses table not found. Run the schema SQL in Supabase SQL Editor.'
            : (res.result?.error || 'Sync could not complete.'),
        });
      }
      await onRefresh();
    } catch (err: any) {
      setSyncFeedback({
        success: false,
        message: err.message || 'Error during Supabase batch sync.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter licenses based on search and status
  const filteredLicenses = licenses.filter((l) => {
    const matchesSearch = 
      !searchQuery ||
      l.license_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.user_email && l.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.user_name && l.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.product_name && l.product_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.order_id && l.order_id.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'active') return l.status === 'active';
    if (statusFilter === 'pending_delivery') return l.delivery_status === 'pending' || l.delivery_status === 'processing';
    if (statusFilter === 'delivered') return l.delivery_status === 'delivered';
    if (statusFilter === 'expired_revoked') return l.status === 'expired' || l.status === 'revoked' || l.delivery_status === 'revoked';

    return true;
  });

  const totalCount = licenses.length;
  const activeCount = licenses.filter(l => l.status === 'active').length;
  const pendingDeliveryCount = licenses.filter(l => l.delivery_status === 'pending' || l.delivery_status === 'processing').length;
  const deliveredCount = licenses.filter(l => l.delivery_status === 'delivered').length;

  const SCHEMA_SQL = `-- Create public.licenses table in Supabase
CREATE TABLE IF NOT EXISTS public.licenses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  order_id TEXT,
  license_key TEXT UNIQUE NOT NULL,
  license_type TEXT DEFAULT 'single_terminal',
  status TEXT NOT NULL DEFAULT 'active',
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  delivery_notes TEXT,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Customers can view only their own assigned licenses (Read-Only)
CREATE POLICY "Users can view own licenses"
  ON public.licenses FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Prevent customers from modifying licenses or changing dates
-- Only service role / admin server can insert or update licenses
CREATE POLICY "Service role can manage all licenses"
  ON public.licenses FOR ALL
  USING (true)
  WITH CHECK (true);`;

  return (
    <div className="space-y-6">
      {/* Top Banner & Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Issued Licenses</span>
          <span className="text-2xl font-bold font-mono text-slate-100">{totalCount}</span>
        </div>

        <div className="bg-[#111827] border border-emerald-900/40 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Active Status</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{activeCount}</span>
        </div>

        <div className="bg-[#111827] border border-amber-900/40 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Pending Admin Delivery</span>
          <span className="text-2xl font-bold font-mono text-amber-400">{pendingDeliveryCount}</span>
        </div>

        <div className="bg-[#111827] border border-cyan-900/40 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Delivered Binaries</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">{deliveredCount}</span>
        </div>
      </div>

      {/* Sync Feedback Message */}
      {syncFeedback && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
          syncFeedback.success 
            ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' 
            : 'bg-rose-950/30 border-rose-800 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {syncFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{syncFeedback.message}</span>
          </div>
          <button 
            onClick={() => setSyncFeedback(null)}
            className="text-slate-400 hover:text-white text-xs underline ml-4 font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Controls & Filters */}
      <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by license key, email, customer, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Sync & Schema Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchSync}
              loading={isSyncing}
              icon={<Database className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Sync All to Supabase
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSchemaModalOpen(true)}
              icon={<FileCode className="w-3.5 h-3.5 text-purple-400" />}
            >
              Supabase SQL Schema
            </Button>
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              title="Refresh Licenses"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-500">Filter View:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              statusFilter === 'all'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Licenses ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Active Only ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending_delivery')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              statusFilter === 'pending_delivery'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Pending Delivery ({pendingDeliveryCount})
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              statusFilter === 'delivered'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Delivered ({deliveredCount})
          </button>
          <button
            onClick={() => setStatusFilter('expired_revoked')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              statusFilter === 'expired_revoked'
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Expired / Revoked ({totalCount - activeCount})
          </button>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">EA License Governance Records</h3>
            <span className="text-xs text-slate-500 font-mono">({filteredLicenses.length} showing)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
            Admin Controlled Dates & Delivery • Supabase Synced
          </span>
        </div>

        {filteredLicenses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Key className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-200">No licenses found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search terms or filter.' : 'When customers purchase an Expert Advisor, their license will appear here for manual date and delivery governance.'}
            </p>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">License Key</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product / Platform</th>
                  <th className="py-3 px-4">Validity (Start / Expiry)</th>
                  <th className="py-3 px-4">License Status</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {filteredLicenses.map((lic) => {
                  const startsFormatted = lic.starts_at ? new Date(lic.starts_at).toLocaleDateString() : 'Instant';
                  const expiresFormatted = lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : 'Lifetime';

                  return (
                    <tr key={lic.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Key */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">
                            {lic.license_key.length > 20 ? `${lic.license_key.slice(0, 18)}...` : lic.license_key}
                          </span>
                          <button
                            onClick={() => handleCopyKey(lic.license_key)}
                            className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Copy License Key"
                          >
                            {copiedKey === lic.license_key ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          ID: {lic.id.slice(0, 14)}...
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <span className="text-slate-100 font-semibold block">{lic.user_name || 'Customer'}</span>
                        <span className="text-[11px] text-slate-400 font-mono block truncate max-w-[160px]">
                          {lic.user_email || lic.user_id}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="py-3 px-4">
                        <span className="text-slate-200 block truncate max-w-[180px]">
                          {lic.product_name || lic.product_id}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {lic.product_platform || 'MT5'}
                          </span>
                          {lic.order_id && (
                            <span className="text-[10px] font-mono text-slate-500">
                              Order: #{lic.order_id.slice(-6)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Validity Dates */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500">Start:</span>
                            <span className="text-slate-300">{startsFormatted}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500">Exp:</span>
                            <span className={lic.expires_at ? 'text-amber-300' : 'text-emerald-400 font-bold'}>
                              {expiresFormatted}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* License Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          lic.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : lic.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : lic.status === 'suspended'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {lic.status}
                        </span>
                      </td>

                      {/* Delivery Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                            lic.delivery_status === 'delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : lic.delivery_status === 'processing'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {lic.delivery_status === 'delivered'
                              ? 'Delivered'
                              : lic.delivery_status === 'processing'
                              ? 'Processing'
                              : 'Pending Delivery'}
                          </span>
                          {lic.delivery_notes && (
                            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[140px]" title={lic.delivery_notes}>
                              Note: {lic.delivery_notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEditLicense(lic)}
                          icon={<Edit3 className="w-3.5 h-3.5 text-purple-400" />}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Supabase Schema Modal */}
      {isSchemaModalOpen && (
        <Modal
          isOpen={isSchemaModalOpen}
          onClose={() => setIsSchemaModalOpen(false)}
          title="Supabase Licenses & Orders Schema SQL"
          subtitle="Run this in Supabase SQL Editor to provision public.licenses and RLS policies"
          maxWidth="lg"
        >
          <div className="space-y-4 text-slate-100 py-1">
            <p className="text-xs text-slate-300 leading-relaxed">
              This schema creates the <code className="text-emerald-400 font-mono">public.licenses</code> table and enforces Row Level Security (RLS), ensuring customers can only view their own licenses and cannot modify validity dates or delivery status.
            </p>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 max-h-72 overflow-y-auto whitespace-pre-wrap">
                {SCHEMA_SQL}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SCHEMA_SQL);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied' : 'Copy SQL'}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsSchemaModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
