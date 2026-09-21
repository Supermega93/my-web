import React, { useState, useEffect } from 'react';
import { 
  TradingAccount, 
  TradingAccountType, 
  TradingPlatform, 
  TradingAccountStatus, 
  Product 
} from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  subscribeToTradingAccounts, 
  saveTradingAccountToFirestore, 
  updateTradingAccountInFirestore, 
  deleteTradingAccountFromFirestore, 
  simulateEaMetricTick 
} from '../../services/firestoreService.ts';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Play, 
  Pause, 
  RefreshCw, 
  Copy, 
  Check, 
  Zap, 
  BarChart2, 
  DollarSign, 
  Cpu, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Server, 
  Radio,
  X,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface TradingPortfolioViewProps {
  userEas: Array<Product & { license_key?: string }>;
  onNavigateToEas: () => void;
  onTriggerBuildMyEa: () => void;
}

const DEFAULT_POPULAR_BROKERS = [
  'IC Markets',
  'FTMO',
  'Exness',
  'Pepperstone',
  'Funding Pips',
  'OANDA',
  'Tickmill'
];

const DEFAULT_EA_NAMES = [
  'Titan Trend Scalper Pro',
  'Neural Grid Master',
  'Apex Momentum EA',
  'London Breakout Engine',
  'Midnight Range Scalper',
  'Custom MQL5 Robot'
];

export function TradingPortfolioView({
  userEas,
  onNavigateToEas,
  onTriggerBuildMyEa,
}: TradingPortfolioViewProps) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'demo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<TradingAccount | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [formAccountId, setFormAccountId] = useState('');
  const [formAccountType, setFormAccountType] = useState<TradingAccountType>('live');
  const [formPlatform, setFormPlatform] = useState<TradingPlatform>('MT5');
  const [formBroker, setFormBroker] = useState('IC Markets');
  const [formServer, setFormServer] = useState('');
  const [formEaName, setFormEaName] = useState(
    userEas.length > 0 ? userEas[0].name : 'Titan Trend Scalper Pro'
  );
  const [formCurrency, setFormCurrency] = useState('USD');
  const [formInitialBalance, setFormInitialBalance] = useState('10000');
  const [formSaving, setFormSaving] = useState(false);

  // Real-time Firestore Subscription
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToTradingAccounts(
      user.id,
      (fetchedAccounts) => {
        setAccounts(fetchedAccounts);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Failed to stream trading accounts:', err);
        setError('Failed to establish real-time sync with Firestore.');
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingAccount(null);
    setFormAccountId('');
    setFormAccountType('live');
    setFormPlatform('MT5');
    setFormBroker('IC Markets');
    setFormServer('ICMarketsSC-Live02');
    setFormEaName(userEas.length > 0 ? userEas[0].name : 'Titan Trend Scalper Pro');
    setFormCurrency('USD');
    setFormInitialBalance('10000');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (account: TradingAccount) => {
    setEditingAccount(account);
    setFormAccountId(account.accountId);
    setFormAccountType(account.accountType);
    setFormPlatform(account.platform);
    setFormBroker(account.broker);
    setFormServer(account.server || '');
    setFormEaName(account.eaName);
    setFormCurrency(account.currency || 'USD');
    setFormInitialBalance(String(account.initialBalance));
    setIsModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!formAccountId.trim()) {
      alert('Please enter an Account ID or Account Number.');
      return;
    }

    setFormSaving(true);
    try {
      const initBalance = Math.max(100, parseFloat(formInitialBalance) || 10000);

      if (editingAccount) {
        await updateTradingAccountInFirestore(user.id, editingAccount.id, {
          accountId: formAccountId.trim(),
          accountType: formAccountType,
          platform: formPlatform,
          broker: formBroker.trim(),
          server: formServer.trim() || undefined,
          eaName: formEaName.trim(),
          currency: formCurrency.toUpperCase(),
          initialBalance: initBalance,
        });
        setActionSuccess('Account updated successfully.');
      } else {
        const docId = `acc_${Date.now()}`;
        const newAccount: Omit<TradingAccount, 'createdAt' | 'updatedAt'> = {
          id: docId,
          userId: user.id,
          accountId: formAccountId.trim(),
          accountType: formAccountType,
          platform: formPlatform,
          broker: formBroker.trim() || 'IC Markets',
          server: formServer.trim() || `${formBroker}-Main`,
          eaName: formEaName.trim() || 'Titan Trend Scalper Pro',
          currency: formCurrency.toUpperCase() || 'USD',
          initialBalance: initBalance,
          currentBalance: initBalance,
          equity: initBalance,
          profit: 0,
          profitPercentage: 0,
          dailyProfit: 0,
          dailyProfitPercentage: 0,
          winRate: 0,
          profitFactor: 0,
          maxDrawdown: 0,
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          openPositions: 0,
          status: 'active',
          lastSyncAt: new Date().toISOString(),
        };

        await saveTradingAccountToFirestore(user.id, newAccount);
        setActionSuccess(`Account ${formAccountId} connected to portfolio.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      console.error('Error saving trading account:', err);
      alert(err.message || 'Failed to save account to Firestore');
    } finally {
      setFormSaving(false);
    }
  };

  const handleToggleStatus = async (account: TradingAccount) => {
    if (!user?.id) return;
    const nextStatus: TradingAccountStatus = account.status === 'active' ? 'paused' : 'active';
    try {
      await updateTradingAccountInFirestore(user.id, account.id, {
        status: nextStatus,
      });
      setActionSuccess(`EA execution ${nextStatus === 'active' ? 'resumed' : 'paused'} for #${account.accountId}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (account: TradingAccount) => {
    if (!user?.id) return;
    if (!confirm(`Are you sure you want to disconnect account #${account.accountId}? This will stop real-time EA tracking.`)) {
      return;
    }
    try {
      await deleteTradingAccountFromFirestore(user.id, account.id);
      setActionSuccess(`Account #${account.accountId} removed.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert('Failed to remove account: ' + err.message);
    }
  };

  const handleSimulateTick = async (account: TradingAccount) => {
    if (!user?.id) return;
    setSimulatingId(account.id);
    try {
      await simulateEaMetricTick(user.id, account);
      setActionSuccess(`Live trade simulated on #${account.accountId}. Real-time metrics updated.`);
      setTimeout(() => setActionSuccess(null), 2500);
    } catch (err: any) {
      alert('Simulate error: ' + err.message);
    } finally {
      setSimulatingId(null);
    }
  };

  const handleQuickAddDemoAccount = async () => {
    if (!user?.id) return;
    const demoNumber = Math.floor(10000000 + Math.random() * 90000000);
    const docId = `acc_${Date.now()}`;
    const initialDeposit = 10000;
    const initialProfit = 840.50;

    const quickDemoAccount: Omit<TradingAccount, 'createdAt' | 'updatedAt'> = {
      id: docId,
      userId: user.id,
      accountId: `${demoNumber}`,
      accountType: 'demo',
      platform: 'MT5',
      broker: 'FTMO',
      server: 'FTMO-Demo02',
      eaName: userEas.length > 0 ? userEas[0].name : 'Titan Trend Scalper Pro',
      currency: 'USD',
      initialBalance: initialDeposit,
      currentBalance: initialDeposit + initialProfit,
      equity: initialDeposit + initialProfit + 64.20,
      profit: initialProfit + 64.20,
      profitPercentage: Number((((initialProfit + 64.20) / initialDeposit) * 100).toFixed(2)),
      dailyProfit: 124.80,
      dailyProfitPercentage: 1.25,
      winRate: 72.4,
      profitFactor: 2.14,
      maxDrawdown: 3.8,
      totalTrades: 58,
      winningTrades: 42,
      losingTrades: 16,
      openPositions: 2,
      status: 'active',
      lastSyncAt: new Date().toISOString(),
    };

    try {
      await saveTradingAccountToFirestore(user.id, quickDemoAccount);
      setActionSuccess(`Demo MT5 Account #${demoNumber} added with live EA metrics!`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert('Failed to add demo account: ' + err.message);
    }
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    if (filter === 'live') return acc.accountType === 'live';
    if (filter === 'demo') return acc.accountType === 'demo';
    return true;
  });

  // Calculate aggregated portfolio metrics
  const totalEquity = accounts.reduce((sum, acc) => sum + (acc.equity || 0), 0);
  const totalInitial = accounts.reduce((sum, acc) => sum + (acc.initialBalance || 0), 0);
  const totalNetProfit = accounts.reduce((sum, acc) => sum + (acc.profit || 0), 0);
  const totalReturnPct = totalInitial > 0 ? (totalNetProfit / totalInitial) * 100 : 0;
  const totalTodayProfit = accounts.reduce((sum, acc) => sum + (acc.dailyProfit || 0), 0);
  const totalOpenPositions = accounts.reduce((sum, acc) => sum + (acc.openPositions || 0), 0);
  const activeEaCount = accounts.filter((acc) => acc.status === 'active').length;

  const totalTradesCount = accounts.reduce((sum, acc) => sum + (acc.totalTrades || 0), 0);
  const totalWinningTrades = accounts.reduce((sum, acc) => sum + (acc.winningTrades || 0), 0);
  const avgWinRate = totalTradesCount > 0 
    ? ((totalWinningTrades / totalTradesCount) * 100) 
    : (accounts.length > 0 ? (accounts.reduce((sum, a) => sum + a.winRate, 0) / accounts.length) : 0);

  return (
    <div id="trading-portfolio-view" className="space-y-6">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Real-time Status & Action Bar */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Firestore Sync
            </span>
            <span className="text-xs text-slate-400">
              {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'} Linked
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Trading Accounts & EA Performance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Connect your live or demo MT5/MT4 account IDs to monitor robot equity, drawdown, and win rates in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="quick-demo-account-btn"
            onClick={handleQuickAddDemoAccount}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors"
            title="Add a sample Demo MT5 account with pre-filled EA performance"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+ One-Click Demo</span>
          </button>
          <Button
            id="connect-account-btn"
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            icon={<Plus className="w-4 h-4 text-slate-950" />}
          >
            Connect Account
          </Button>
        </div>
      </div>

      {/* Aggregate Portfolio KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Equity */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Portfolio Equity</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Initial:</span>
            <span className="text-slate-300 font-mono">${totalInitial.toLocaleString('en-US')}</span>
          </div>
        </div>

        {/* Net Profit & ROI */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Net Profit / Return</span>
            {totalNetProfit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${totalNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalNetProfit >= 0 ? '+' : ''}${totalNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className={`font-mono font-medium ${totalReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}%
            </span>
            <span className="text-slate-500">all-time ROI</span>
          </div>
        </div>

        {/* Today's Daily P&L */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Today's P&L</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${totalTodayProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalTodayProfit >= 0 ? '+' : ''}${totalTodayProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>{totalOpenPositions} open market {totalOpenPositions === 1 ? 'position' : 'positions'}</span>
          </div>
        </div>

        {/* Global Win Rate & Active EAs */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Overall Win Rate</span>
            <BarChart2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {avgWinRate > 0 ? `${avgWinRate.toFixed(1)}%` : '—'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">{activeEaCount} EA{activeEaCount === 1 ? '' : 's'} Active</span>
            <span className="text-slate-500">across brokers</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Accounts ({accounts.length})
          </button>
          <button
            onClick={() => setFilter('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'live'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Accounts ({accounts.filter((a) => a.accountType === 'live').length})
          </button>
          <button
            onClick={() => setFilter('demo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'demo'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Demo Accounts ({accounts.filter((a) => a.accountType === 'demo').length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Real-time onSnapshot listener active</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && accounts.length === 0 ? (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-300">Connecting to real-time portfolio stream...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        /* Empty State */
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {filter === 'all' 
                ? 'No Trading Accounts Connected Yet' 
                : `No ${filter.toUpperCase()} Accounts Found`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Add your live or demo MT5, MT4, or cTrader account number to start tracking real-time EA execution metrics, live floating equity, and win rate analytics.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              id="empty-connect-btn"
              variant="primary"
              size="sm"
              onClick={handleOpenAddModal}
              icon={<Plus className="w-4 h-4 text-slate-950" />}
            >
              Connect My Account ID
            </Button>
            <button
              onClick={handleQuickAddDemoAccount}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Sample Demo Account</span>
            </button>
          </div>
        </div>
      ) : (
        /* Accounts Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAccounts.map((account) => {
            const isProfit = account.profit >= 0;
            const isDailyProfit = account.dailyProfit >= 0;
            const isSimulating = simulatingId === account.id;

            return (
              <div 
                key={account.id}
                id={`account-card-${account.accountId}`}
                className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-5 transition-all shadow-md flex flex-col justify-between"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
                        account.accountType === 'live'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {account.accountType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {account.platform}
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                        <span className="text-slate-400">ID:</span>
                        <span className="font-bold text-white">#{account.accountId}</span>
                        <button
                          onClick={() => copyToClipboard(account.accountId, account.id)}
                          className="text-slate-400 hover:text-white transition-colors ml-1"
                          title="Copy Account ID"
                        >
                          {copiedId === account.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Server className="w-3.5 h-3.5 text-slate-500" />
                      <span>{account.broker}</span>
                      {account.server && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 font-mono">{account.server}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(account)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-colors ${
                        account.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                      title={account.status === 'active' ? 'Click to Pause EA' : 'Click to Resume EA'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        account.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`} />
                      <span>{account.status.toUpperCase()}</span>
                    </button>
                  </div>
                </div>

                {/* Assigned EA Robot Banner */}
                <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Assigned Robot</div>
                      <div className="text-xs font-bold text-slate-200">{account.eaName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Open Positions</div>
                    <div className="text-xs font-mono font-bold text-white">
                      {account.openPositions} Active
                    </div>
                  </div>
                </div>

                {/* Primary Financial Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">Current Equity</div>
                    <div className="text-lg font-extrabold text-white">
                      ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Bal: ${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">Total Net P&L</div>
                    <div className={`text-lg font-extrabold flex items-center gap-1 ${
                      isProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isProfit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{isProfit ? '+' : ''}${account.profit.toFixed(2)}</span>
                    </div>
                    <div className={`text-[10px] font-mono ${isProfit ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                      {isProfit ? '+' : ''}{account.profitPercentage.toFixed(2)}% ROI
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[11px] text-slate-400 font-mono">Today's P&L</div>
                    <div className={`text-lg font-extrabold ${isDailyProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isDailyProfit ? '+' : ''}${account.dailyProfit.toFixed(2)}
                    </div>
                    <div className={`text-[10px] font-mono ${isDailyProfit ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                      {isDailyProfit ? '+' : ''}{account.dailyProfitPercentage.toFixed(2)}% today
                    </div>
                  </div>
                </div>

                {/* Institutional Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Win Rate</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {account.winRate > 0 ? `${account.winRate}%` : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {account.winningTrades}W / {account.losingTrades}L
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Profit Factor</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {account.profitFactor > 0 ? account.profitFactor.toFixed(2) : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Gross Gain/Loss</div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Max Drawdown</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">
                      {account.maxDrawdown > 0 ? `${account.maxDrawdown}%` : '0%'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Relative Peak</div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Sync: {new Date(account.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Sim Tick Button */}
                    <button
                      onClick={() => handleSimulateTick(account)}
                      disabled={isSimulating}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="Simulate a real-time EA execution trade tick"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : ''}`} />
                      <span>{isSimulating ? 'Executing...' : 'Simulate Tick'}</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(account)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Account Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(account)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-900/60 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Disconnect Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Cpu className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {editingAccount ? 'Edit Trading Account' : 'Connect Trading Account'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  {editingAccount 
                    ? `Update configuration for account #${editingAccount.accountId}` 
                    : 'Input your live or demo account ID to track EA performance metrics in real-time.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              {/* Account Environment (Live vs Demo) */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Account Environment
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormAccountType('live')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold font-mono uppercase transition-all flex items-center justify-center gap-2 ${
                      formAccountType === 'live'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formAccountType === 'live' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    Live Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormAccountType('demo')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold font-mono uppercase transition-all flex items-center justify-center gap-2 ${
                      formAccountType === 'demo'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formAccountType === 'demo' ? 'bg-amber-400' : 'bg-slate-500'}`} />
                    Demo Account
                  </button>
                </div>
              </div>

              {/* Account ID / Number */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Account ID / Login Number *
                </label>
                <input
                  id="form-account-id"
                  type="text"
                  required
                  placeholder="e.g. 89201948 or MT5-DEMO-771"
                  value={formAccountId}
                  onChange={(e) => setFormAccountId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Platform & Broker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Platform
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as TradingPlatform)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="MT5">MetaTrader 5 (MT5)</option>
                    <option value="MT4">MetaTrader 4 (MT4)</option>
                    <option value="cTrader">cTrader</option>
                    <option value="TradingView">TradingView Webhook</option>
                    <option value="Other">Other Broker API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Broker / Prop Firm
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IC Markets, FTMO, Exness"
                    value={formBroker}
                    onChange={(e) => setFormBroker(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Popular Broker Quick Select */}
              <div className="space-y-1">
                <div className="text-[11px] text-slate-400">Quick select broker:</div>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_POPULAR_BROKERS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormBroker(b)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Broker Server (Optional) */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Server Name <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ICMarketsSC-Live02 or FTMO-Demo"
                  value={formServer}
                  onChange={(e) => setFormServer(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Assigned EA Robot */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Assigned Expert Advisor
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Titan Trend Scalper Pro"
                  value={formEaName}
                  onChange={(e) => setFormEaName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                {/* Available purchased EAs or popular ones */}
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {userEas.map((ea) => (
                    <button
                      key={ea.id}
                      type="button"
                      onClick={() => setFormEaName(ea.name)}
                      className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:border-emerald-500/40"
                    >
                      {ea.name}
                    </button>
                  ))}
                  {userEas.length === 0 && DEFAULT_EA_NAMES.slice(0, 3).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormEaName(name)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency & Initial Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Account Currency
                  </label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Starting Capital / Balance
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={formInitialBalance}
                    onChange={(e) => setFormInitialBalance(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <Button
                  id="submit-trading-account-btn"
                  variant="primary"
                  size="md"
                  disabled={formSaving}
                  icon={<Check className="w-4 h-4 text-slate-950" />}
                >
                  {formSaving ? 'Saving to Firestore...' : editingAccount ? 'Update Account' : 'Connect Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
