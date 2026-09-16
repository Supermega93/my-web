import React, { useState, useMemo } from 'react';
import { AdminUserRecord, UserAccessStatus } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Button } from '../common/Button.tsx';
import { Modal } from '../common/Modal.tsx';
import { 
  Search, 
  Users, 
  ShieldCheck, 
  Gift, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  Unlock, 
  BookOpen, 
  Crown, 
  DollarSign, 
  Mail, 
  FileCode,
  Sparkles,
  Info
} from 'lucide-react';

interface UserManagementTabProps {
  users: AdminUserRecord[];
  onRefresh: () => void | Promise<void>;
}

const SUPABASE_COMPLIMENTARY_TABLE_SQL = `-- Supabase Complimentary Access Table & Row Level Security
CREATE TABLE IF NOT EXISTS public.complimentary_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    granted_by TEXT DEFAULT 'admin',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complimentary_user_id ON public.complimentary_access(user_id);
CREATE INDEX IF NOT EXISTS idx_complimentary_email ON public.complimentary_access(email);

ALTER TABLE public.complimentary_access ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own complimentary access status
CREATE POLICY "Users view own complimentary access" 
ON public.complimentary_access FOR SELECT 
TO authenticated 
USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = email);

-- Allow service role / backend server to manage complimentary access
CREATE POLICY "Service role full access on complimentary_access" 
ON public.complimentary_access FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);`;

export function UserManagementTab({ users, onRefresh }: UserManagementTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'paid' | 'complimentary'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Grant Modal state
  const [grantTargetUser, setGrantTargetUser] = useState<AdminUserRecord | null>(null);
  const [grantNotes, setGrantNotes] = useState('');
  const [isGranting, setIsGranting] = useState(false);

  // Revoke Modal state
  const [revokeTargetUser, setRevokeTargetUser] = useState<AdminUserRecord | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // SQL Script Drawer state
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setFeedback(null);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter users by search term and status tab
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        (u.complimentary_details?.notes && u.complimentary_details.notes.toLowerCase().includes(q));

      const matchesStatus = 
        statusFilter === 'all' ? true : u.access_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Compute counts
  const totalCount = users.length;
  const freeCount = users.filter((u) => u.access_status === 'free').length;
  const paidCount = users.filter((u) => u.access_status === 'paid').length;
  const compCount = users.filter((u) => u.access_status === 'complimentary').length;

  // Handle Grant action
  const handleOpenGrantModal = (user: AdminUserRecord) => {
    setGrantTargetUser(user);
    setGrantNotes('');
  };

  const handleConfirmGrant = async () => {
    if (!grantTargetUser) return;
    setIsGranting(true);
    setFeedback(null);
    try {
      const res = await api.grantComplimentaryAccess(
        grantTargetUser.id,
        grantTargetUser.email,
        grantNotes.trim() || undefined
      );

      setFeedback({
        success: true,
        message: `Complimentary Masterclass access successfully granted to ${grantTargetUser.email}. ${res.supabaseSynced ? 'Synchronized with Supabase.' : ''}`,
      });
      setGrantTargetUser(null);
      await onRefresh();
    } catch (err: any) {
      setFeedback({
        success: false,
        message: err.message || 'Failed to grant complimentary access',
      });
    } finally {
      setIsGranting(false);
    }
  };

  // Handle Revoke action
  const handleOpenRevokeModal = (user: AdminUserRecord) => {
    setRevokeTargetUser(user);
  };

  const handleConfirmRevoke = async () => {
    if (!revokeTargetUser) return;
    setIsRevoking(true);
    setFeedback(null);
    try {
      await api.revokeComplimentaryAccess(
        revokeTargetUser.id,
        revokeTargetUser.email
      );

      setFeedback({
        success: true,
        message: `Complimentary Masterclass access revoked for ${revokeTargetUser.email}. The user is now returned to Free Academy only.`,
      });
      setRevokeTargetUser(null);
      await onRefresh();
    } catch (err: any) {
      setFeedback({
        success: false,
        message: err.message || 'Failed to revoke complimentary access',
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Registered Users</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-slate-100">{totalCount}</span>
            <Users className="w-5 h-5 text-slate-500" />
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">Supabase Auth & Database</span>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Free Academy Only</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-slate-300">{freeCount}</span>
            <BookOpen className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">Curriculum Levels 1–3</span>
        </div>

        <div className="bg-[#111827] border border-emerald-900/40 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-emerald-400 block">Paid Masterclass</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">{paidCount}</span>
            <Crown className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-emerald-500/80 block font-mono">Standard paid customers</span>
        </div>

        <div className="bg-[#111827] border border-purple-900/40 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-purple-400 block">Complimentary Masterclass</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-purple-300">{compCount}</span>
            <Gift className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-[10px] text-purple-400/80 block font-mono">Admin-granted complimentary</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            feedback.success
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/50 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Bar & Search Filter */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Registered Accounts & Masterclass Access Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              View registered users, search by email, and grant or revoke complimentary Masterclass access without requiring payment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>{showSqlSchema ? 'Hide Supabase Schema' : 'Supabase Table SQL'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Users'}
            </Button>
          </div>
        </div>

        {/* Supabase Schema Helper Card */}
        {showSqlSchema && (
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-purple-300">
                  Supabase Complimentary Access Schema & RLS Policy
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(SUPABASE_COMPLIMENTARY_TABLE_SQL)}
                className="px-2.5 py-1 rounded bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Complimentary access status is stored in the <code className="text-purple-300 font-mono">complimentary_access</code> table in Supabase. Run this SQL in your Supabase SQL Editor if you ever need to manually verify or provision the table.
            </p>
            <pre className="p-3 bg-slate-900/90 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto max-h-48 border border-slate-800/80">
              {SUPABASE_COMPLIMENTARY_TABLE_SQL}
            </pre>
          </div>
        )}

        {/* Search Bar & Filter Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          {/* Email Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by email, name, or ID..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Users ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'free'
                  ? 'bg-slate-700/50 text-slate-200 border border-slate-600/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Free Academy ({freeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'paid'
                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paid Masterclass ({paidCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('complimentary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'complimentary'
                  ? 'bg-purple-900/50 text-purple-300 border border-purple-600/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Complimentary ({compCount})
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Account / Access Status</th>
                <th className="px-5 py-3.5">Complimentary / Access Details</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 space-y-2">
                    <Users className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-mono text-xs">No registered users matched the selected criteria.</p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-purple-400 underline hover:text-purple-300 cursor-pointer"
                      >
                        Clear search query
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isComplimentary = u.access_status === 'complimentary';
                  const isPaid = u.access_status === 'paid';
                  const isFree = u.access_status === 'free' || !u.access_status;

                  return (
                    <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Name & ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isComplimentary
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-100 block">{u.name || 'Trader'}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-500">
                                {u.id.substring(0, 10)}...
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(u.id, u.id)}
                                title="Copy user ID"
                                className="text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
                              >
                                {copiedId === u.id ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <a
                            href={`mailto:${u.email}`}
                            className="font-mono text-slate-200 hover:text-purple-300 hover:underline flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{u.email}</span>
                          </a>
                          {u.phone && (
                            <span className="text-[10px] font-mono text-slate-500 block">
                              Tel: {u.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Access Status Badge */}
                      <td className="px-5 py-4">
                        {isPaid && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                            <Crown className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Paid Masterclass</span>
                          </span>
                        )}

                        {isComplimentary && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            <Gift className="w-3.5 h-3.5 text-purple-400" />
                            <span>Complimentary Masterclass</span>
                          </span>
                        )}

                        {isFree && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <span>Free Academy only</span>
                          </span>
                        )}
                      </td>

                      {/* Complimentary / Order Details */}
                      <td className="px-5 py-4">
                        {isComplimentary && u.complimentary_details ? (
                          <div className="space-y-1">
                            <div className="text-[11px] font-mono text-purple-300">
                              Granted: {u.complimentary_details.granted_at ? new Date(u.complimentary_details.granted_at).toLocaleDateString() : 'Active'}
                            </div>
                            {u.complimentary_details.notes && (
                              <div className="text-[10px] text-slate-400 italic bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 max-w-xs truncate">
                                "{u.complimentary_details.notes}"
                              </div>
                            )}
                          </div>
                        ) : isPaid ? (
                          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Full Paid Lifetime Access</span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">
                            Standard free tier (Levels 1–3)
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="px-5 py-4 font-mono text-slate-400 text-xs">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>

                      {/* Action Button */}
                      <td className="px-5 py-4 text-right">
                        {isComplimentary ? (
                          <button
                            type="button"
                            onClick={() => handleOpenRevokeModal(u)}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 text-rose-400" />
                            <span>Revoke Access</span>
                          </button>
                        ) : isFree ? (
                          <button
                            type="button"
                            onClick={() => handleOpenGrantModal(u)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/50 text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <Gift className="w-3.5 h-3.5 text-purple-400" />
                            <span>Grant Complimentary</span>
                          </button>
                        ) : (
                          <span
                            title="User has paid for Masterclass; access cannot be revoked."
                            className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-500 border border-slate-800 text-xs font-mono inline-flex items-center gap-1 cursor-default"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span>Paid Verified</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Complimentary Access Modal */}
      <Modal
        isOpen={Boolean(grantTargetUser)}
        onClose={() => !isGranting && setGrantTargetUser(null)}
        title="Grant Complimentary Masterclass Access"
        maxWidth="lg"
      >
        {grantTargetUser && (
          <div className="space-y-5 text-slate-200">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400 shrink-0" />
                <span className="text-sm font-bold text-purple-200">
                  Complimentary Access Overview
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Granting complimentary access unlocks the full Masterclass curriculum (Levels 4–8) for this user without requiring any payment. This status is recorded in Supabase and persists across sessions.
              </p>
            </div>

            {/* Target User Info */}
            <div className="space-y-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Name:</span>
                <span className="text-slate-200 font-bold">{grantTargetUser.name || 'Trader'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-purple-300 font-bold">{grantTargetUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-slate-300 capitalize">{grantTargetUser.access_status || 'free'}</span>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Administrative Notes (Optional):</span>
                <span className="text-[10px] text-slate-500 font-mono">Auditable record</span>
              </label>
              <textarea
                value={grantNotes}
                onChange={(e) => setGrantNotes(e.target.value)}
                placeholder="e.g. VIP community giveaway winner, promotional partner, tester..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGrantTargetUser(null)}
                disabled={isGranting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmGrant}
                disabled={isGranting}
                icon={
                  isGranting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Gift className="w-3.5 h-3.5 text-slate-950" />
                  )
                }
              >
                {isGranting ? 'Granting Access...' : 'Confirm & Grant Access'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Revoke Complimentary Access Modal */}
      <Modal
        isOpen={Boolean(revokeTargetUser)}
        onClose={() => !isRevoking && setRevokeTargetUser(null)}
        title="Revoke Complimentary Masterclass Access"
        maxWidth="md"
      >
        {revokeTargetUser && (
          <div className="space-y-5 text-slate-200">
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-sm font-bold text-rose-200">
                  Confirm Access Revocation
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to revoke complimentary Masterclass access for{' '}
                <strong className="text-white">{revokeTargetUser.email}</strong>?
              </p>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                The user will immediately return to <strong>Free Academy only</strong> (Levels 1–3) and will no longer be able to open Masterclass lessons.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevokeTargetUser(null)}
                disabled={isRevoking}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={isRevoking}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRevoking ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>{isRevoking ? 'Revoking Access...' : 'Yes, Revoke Access'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserManagementTab;
