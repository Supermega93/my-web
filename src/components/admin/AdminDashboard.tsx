import React, { useState, useEffect } from 'react';
import { AdminStats, Product, Order, User, ProductType, License, AdminUserRecord } from '../../types.ts';
import { api, StrategySubmission } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../common/Button.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { Modal } from '../common/Modal.tsx';
import { LicenseManagementTab } from './LicenseManagementTab.tsx';
import { EditLicenseModal } from './EditLicenseModal.tsx';
import { UserManagementTab } from './UserManagementTab.tsx';
import { 
  ShieldAlert, 
  ShieldCheck,
  DollarSign, 
  Users, 
  ShoppingBag, 
  Cpu, 
  BookOpen, 
  FolderGit2, 
  Plus, 
  Edit3, 
  Power, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Database,
  Copy,
  ExternalLink,
  Download,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Eye,
  X,
  CheckCircle,
  Search,
  Key
} from 'lucide-react';
import { checkSupabaseLessonsSync, syncLessonsToSupabase } from '../../services/academy.ts';
import { 
  SUPABASE_SYNC_SQL, 
  SUPABASE_MISSING_LESSONS_SQL, 
  SUPABASE_LEVELS_4_TO_8_SQL,
  SUPABASE_MISSING_LESSONS_CSV,
  SUPABASE_LEVELS_4_TO_8_CSV,
  SUPABASE_ALL_LESSONS_CSV,
  MISSING_LESSONS,
  LEVELS_4_TO_8_LESSONS
} from '../../data/supabaseSqlScript.ts';
import { FALLBACK_LESSONS } from '../../data/lessonsData.ts';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export function AdminDashboard({ onBackToHome }: AdminDashboardProps) {
  const { user, isAdmin, quickLogin } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    eaSales: 0,
    ebookSales: 0,
    customProjects: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'licenses' | 'users' | 'strategy-submissions' | 'supabase-sync'>('products');
  const [submissions, setSubmissions] = useState<StrategySubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StrategySubmission | null>(null);
  const [retryingEmailId, setRetryingEmailId] = useState<string | null>(null);
  const [retryFeedback, setRetryFeedback] = useState<{ id: string; success: boolean; message: string } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [submissionSearch, setSubmissionSearch] = useState('');

  // Supabase sync states
  const [syncStatus, setSyncStatus] = useState<{
    connected: boolean;
    remoteCount: number;
    localCount: number;
    isSynced: boolean;
    statusMessage: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedActive, setCopiedActive] = useState(false);
  const [activeScriptFormat, setActiveScriptFormat] = useState<
    'missing_sql' | 'levels48_sql' | 'all_sql' | 'missing_csv' | 'levels48_csv' | 'all_csv'
  >('missing_csv');

  const checkSync = async () => {
    try {
      const res = await checkSupabaseLessonsSync();
      setSyncStatus(res);
    } catch (err: any) {
      console.warn('Sync check error:', err);
    }
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncLessonsToSupabase();
      if (res.success) {
        setSyncFeedback({ success: true, message: `Successfully synced ${res.insertedCount} lessons into Supabase.` });
      } else {
        setSyncFeedback({ 
          success: false, 
          message: res.error?.includes('row-level security') 
            ? 'Supabase Row Level Security (RLS) is enabled. Run the provided SQL script in your Supabase SQL Editor to grant permissions and sync all lessons.'
            : (res.error || 'Sync could not complete.') 
        });
      }
      await checkSync();
    } catch (err: any) {
      setSyncFeedback({ success: false, message: err.message || 'Sync failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const getActiveContent = (): { content: string; filename: string; mimeType: string; label: string } => {
    switch (activeScriptFormat) {
      case 'missing_sql':
        return {
          content: SUPABASE_MISSING_LESSONS_SQL,
          filename: 'supabase_missing_lessons.sql',
          mimeType: 'application/sql',
          label: 'Missing Lessons SQL (6.4, 7.4, 8.1–8.4)',
        };
      case 'levels48_sql':
        return {
          content: SUPABASE_LEVELS_4_TO_8_SQL,
          filename: 'supabase_levels_4_to_8.sql',
          mimeType: 'application/sql',
          label: 'Levels 4 to 8 SQL (20 Lessons)',
        };
      case 'all_sql':
        return {
          content: SUPABASE_SYNC_SQL,
          filename: 'supabase_sync_all_curriculum.sql',
          mimeType: 'application/sql',
          label: `Full Curriculum SQL (All ${FALLBACK_LESSONS.length} Lessons)`,
        };
      case 'missing_csv':
        return {
          content: SUPABASE_MISSING_LESSONS_CSV,
          filename: 'supabase_missing_lessons.csv',
          mimeType: 'text/csv',
          label: 'Missing Lessons CSV (6.4, 7.4, 8.1–8.4)',
        };
      case 'levels48_csv':
        return {
          content: SUPABASE_LEVELS_4_TO_8_CSV,
          filename: 'supabase_levels_4_to_8.csv',
          mimeType: 'text/csv',
          label: 'Levels 4 to 8 CSV (20 Lessons)',
        };
      case 'all_csv':
      default:
        return {
          content: SUPABASE_ALL_LESSONS_CSV,
          filename: 'supabase_all_curriculum.csv',
          mimeType: 'text/csv',
          label: `Full Curriculum CSV (All ${FALLBACK_LESSONS.length} Lessons)`,
        };
    }
  };

  const handleCopyActive = () => {
    const { content } = getActiveContent();
    navigator.clipboard.writeText(content);
    setCopiedActive(true);
    setTimeout(() => setCopiedActive(false), 3000);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Add/Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    type: 'ea' as ProductType,
    price: 99,
    platform: 'MetaTrader 5 (MQL5)',
    description: '',
    short_description: '',
    image_url: '',
    download_url: '',
    active: 1,
  });

  const loadAdminData = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, usersRes, submissionsRes, licensesRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminProducts(),
        api.getAdminOrders(),
        api.getAdminUsers(),
        api.getStrategySubmissions().catch(() => []),
        api.getAdminLicenses().catch(() => []),
      ]);
      setStats(statsRes);
      setProducts(productsRes);
      setOrders(ordersRes);
      setUsersList(usersRes);
      setSubmissions(submissionsRes);
      setLicenses(licensesRes);
      checkSync();
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryEmail = async (sub: StrategySubmission) => {
    setRetryingEmailId(sub.id);
    setRetryFeedback(null);
    try {
      const res = await api.retryStrategySubmissionEmail(sub.id);
      if (res.success) {
        setRetryFeedback({
          id: sub.id,
          success: true,
          message: 'Notification email successfully dispatched to supermegafx1@gmail.com and client!',
        });
      } else {
        const errMsg = res.adminResult?.error || 'Provider not configured or rejected transmission';
        setRetryFeedback({
          id: sub.id,
          success: false,
          message: `Delivery attempt failed: ${errMsg}`,
        });
      }
      const updated = await api.getStrategySubmissions().catch(() => []);
      setSubmissions(updated);
      if (selectedSubmission && selectedSubmission.id === sub.id) {
        const curr = updated.find(s => s.id === sub.id);
        if (curr) setSelectedSubmission(curr);
      }
    } catch (err: any) {
      setRetryFeedback({
        id: sub.id,
        success: false,
        message: err.message || 'Network error while attempting to retry delivery.',
      });
    } finally {
      setRetryingEmailId(null);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  // Access Control Guard
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-rose-900/50 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Restricted Administrator Area</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Role-Based Access Control (RBAC) enforced. Your current account role ({user?.role || 'Guest'}) does not possess administrative privileges.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => quickLogin('admin')}
            >
              Switch to Test Admin Account
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToHome}
            >
              Return to Public Store
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      type: 'ea',
      price: 199,
      platform: 'MetaTrader 5 (MQL5)',
      description: '',
      short_description: '',
      image_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80',
      download_url: '/downloads/new-ea-binary.zip',
      active: 1,
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      type: product.type,
      price: product.price,
      platform: product.platform || '',
      description: product.description,
      short_description: product.short_description || '',
      image_url: product.image_url || '',
      download_url: product.download_url || '',
      active: product.active,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
      } else {
        await api.createProduct(productForm);
      }
      setIsProductModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const toggleProductActive = async (product: Product) => {
    try {
      const nextActive = product.active === 1 ? 0 : 1;
      await api.updateProduct(product.id, { active: nextActive });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-purple-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Admin Control Center
              </span>
              <span className="text-xs text-slate-500 font-mono">Verified Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-400">
              Manage live product inventory, customer orders, and telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={openAddModal}
              icon={<Plus className="w-4 h-4 text-slate-950" />}
            >
              Add New Product
            </Button>
          </div>
        </div>

        {/* 6 Core Admin Stats Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Users</span>
            <span className="text-2xl font-bold font-mono text-slate-100">{stats.totalUsers}</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Orders</span>
            <span className="text-2xl font-bold font-mono text-slate-100">{stats.totalOrders}</span>
          </div>

          <div className="bg-[#111827] border border-emerald-900/40 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Revenue</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">${stats.totalRevenue.toFixed(2)}</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">EA Sales</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">{stats.eaSales}</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Ebook Sales</span>
            <span className="text-2xl font-bold font-mono text-purple-400">{stats.ebookSales}</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Custom Projects</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{stats.customProjects}</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'products'
                ? 'border-purple-400 text-purple-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Product Management ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'orders'
                ? 'border-purple-400 text-purple-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Order Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('licenses')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'licenses'
                ? 'border-purple-400 text-purple-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            EA License Controls ({licenses.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-purple-400 text-purple-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Users & Access Controls ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('strategy-submissions')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'strategy-submissions'
                ? 'border-purple-400 text-purple-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Strategy & EA Submissions ({submissions.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('supabase-sync');
              checkSync();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'supabase-sync'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Supabase Content Sync
            {syncStatus && (
              <span className={`px-1.5 py-0.2 text-[9px] rounded font-mono ${
                syncStatus.isSynced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {syncStatus.remoteCount}/{syncStatus.localCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-100">Live Inventory</h2>
                <p className="text-xs text-slate-400">Manage digital products, pricing, and active status.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={openAddModal}
                icon={<Plus className="w-3.5 h-3.5 text-slate-950" />}
              >
                Add Product
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Platform</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200">{prod.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{prod.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={prod.type} type="type" size="sm" />
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {prod.platform || 'General'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-100">
                        ${prod.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            prod.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {prod.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleProductActive(prod)}
                          className={`px-2.5 py-1 rounded border transition-colors ${
                            prod.active
                              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/40'
                              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/40'
                          }`}
                        >
                          {prod.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-slate-100">Customer Transactions</h2>
              <p className="text-xs text-slate-400">All completed and pending orders recorded in SQLite.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer Email</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                        {ord.id}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <div>{ord.user_name || 'Customer'}</div>
                        <div className="font-mono text-[11px] text-slate-500">{ord.user_email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {ord.product_name || ord.product_id}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                        ${ord.amount.toFixed(2)} {ord.currency}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ord.payment_status} size="sm" />
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                        {ord.transaction_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: EA LICENSE CONTROLS */}
        {activeTab === 'licenses' && (
          <LicenseManagementTab
            licenses={licenses}
            onRefresh={loadAdminData}
            onEditLicense={(lic) => {
              setEditingLicense(lic);
              setIsLicenseModalOpen(true);
            }}
          />
        )}

        {/* TAB 3: USERS & MASTERCLASS ACCESS CONTROLS */}
        {activeTab === 'users' && (
          <UserManagementTab
            users={usersList}
            onRefresh={loadAdminData}
          />
        )}

        {/* TAB 4: STRATEGY & EA SUBMISSIONS */}
        {activeTab === 'strategy-submissions' && (
          <div className="space-y-6">
            {/* Top Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Submissions</span>
                <span className="text-2xl font-bold font-mono text-slate-100">{submissions.length}</span>
                <span className="text-[10px] text-slate-500 block font-mono">Persisted in SQLite & Supabase</span>
              </div>

              <div className="bg-[#111827] border border-emerald-900/40 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Phone / WhatsApp Contacts</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {submissions.filter(s => s.phone && s.phone.trim().length >= 6).length}
                </span>
                <span className="text-[10px] text-emerald-500/80 block font-mono">100% Direct Contact Ready</span>
              </div>

              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Email Delivered</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {submissions.filter(s => s.email_status === 'delivered').length}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">Sent to supermegafx1@gmail.com</span>
              </div>

              <div className="bg-[#111827] border border-amber-900/30 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Delivery Pending / Retry</span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {submissions.filter(s => s.email_status !== 'delivered').length}
                </span>
                <span className="text-[10px] text-amber-500/80 block font-mono">One-click re-dispatch enabled</span>
              </div>
            </div>

            {/* Retry Feedback Alert */}
            {retryFeedback && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  retryFeedback.success
                    ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                    : 'bg-amber-950/50 border-amber-800 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {retryFeedback.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>{retryFeedback.message}</span>
                </div>
                <button
                  onClick={() => setRetryFeedback(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Submissions Table Box */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-100">Customer Strategy Intake Records</h2>
                  <p className="text-xs text-slate-400">
                    Incoming custom EA requests and AI Strategy Builder briefs with complete client parameters.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={submissionSearch}
                      onChange={(e) => setSubmissionSearch(e.target.value)}
                      placeholder="Filter by name, email, phone, or pair..."
                      className="w-64 pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-purple-500 font-mono"
                    />
                  </div>
                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Reload Submissions"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs font-mono">
                  No strategy submissions recorded yet. Submissions from the Strategy Builder or Custom EA modal will appear here immediately.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="px-6 py-3">ID / Date</th>
                        <th className="px-6 py-3">Client Contact</th>
                        <th className="px-6 py-3">Platform & Instrument</th>
                        <th className="px-6 py-3">Strategy Description</th>
                        <th className="px-6 py-3">Email Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {submissions
                        .filter((s) => {
                          if (!submissionSearch.trim()) return true;
                          const q = submissionSearch.toLowerCase();
                          return (
                            s.full_name?.toLowerCase().includes(q) ||
                            s.email?.toLowerCase().includes(q) ||
                            s.phone?.toLowerCase().includes(q) ||
                            s.instrument?.toLowerCase().includes(q) ||
                            s.platform?.toLowerCase().includes(q) ||
                            s.submission_id?.toLowerCase().includes(q)
                          );
                        })
                        .map((s) => {
                          const cleanDigits = (s.phone || '').replace(/\D/g, '');
                          const isDelivered = s.email_status === 'delivered';
                          return (
                            <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-mono font-bold text-slate-200 text-xs">
                                  {s.submission_id || s.id}
                                </div>
                                <div className="text-[11px] font-mono text-slate-500">
                                  {new Date(s.created_at).toLocaleDateString()} {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-100">{s.full_name}</div>
                                <div className="text-[11px] font-mono text-slate-400">
                                  <a href={`mailto:${s.email}`} className="hover:text-purple-300 underline">
                                    {s.email}
                                  </a>
                                </div>
                                {s.phone && (
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono text-[11px] flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-emerald-400" />
                                      <a href={`tel:${s.phone}`} className="hover:underline">
                                        {s.phone}
                                      </a>
                                    </span>
                                    {cleanDigits.length >= 6 && (
                                      <a
                                        href={`https://wa.me/${cleanDigits}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-1.5 py-0.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-[10px] font-bold inline-flex items-center gap-0.5"
                                        title="Chat on WhatsApp"
                                      >
                                        <MessageSquare className="w-2.5 h-2.5" />
                                        WA
                                      </a>
                                    )}
                                  </div>
                                )}
                                {s.telegram && (
                                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                    TG: {s.telegram}
                                  </div>
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 font-mono font-bold text-[11px]">
                                    {s.platform || 'MT5'}
                                  </span>
                                  <span className="font-mono font-bold text-slate-200">
                                    {s.instrument || 'Multi-Asset'}
                                  </span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                  TF: {s.timeframe || 'Any'} {s.direction ? `• ${s.direction}` : ''}
                                </div>
                              </td>

                              <td className="px-6 py-4 max-w-xs">
                                <p className="text-slate-300 line-clamp-2 text-xs">
                                  {s.original_strategy || s.strategy_title || 'No description provided'}
                                </p>
                              </td>

                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                      isDelivered
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    }`}
                                  >
                                    {isDelivered ? (
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <AlertCircle className="w-3 h-3 text-amber-400" />
                                    )}
                                    {s.email_status === 'delivered'
                                      ? 'DELIVERED'
                                      : s.email_status === 'failed_no_provider'
                                      ? 'NO PROVIDER'
                                      : s.email_status?.toUpperCase() || 'PENDING'}
                                  </span>
                                  {s.email_sent_at && (
                                    <div className="text-[10px] font-mono text-slate-500">
                                      {new Date(s.email_sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setSelectedSubmission(s)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                                    <span>Brief</span>
                                  </button>

                                  <button
                                    onClick={() => handleRetryEmail(s)}
                                    disabled={retryingEmailId === s.id}
                                    title="Send or retry email notification to supermegafx1@gmail.com and client"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/50 text-slate-300 hover:text-purple-300 transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    <Send
                                      className={`w-3.5 h-3.5 ${
                                        retryingEmailId === s.id ? 'animate-spin text-purple-400' : ''
                                      }`}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SUPABASE CONTENT SYNC & PARITY */}
        {activeTab === 'supabase-sync' && (
          <div className="space-y-6">
            {/* Top Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Supabase Connection</span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-sm font-bold font-mono text-emerald-400">Connected</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block truncate">xbrhalmcvpxutxojemoj</span>
              </div>

              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Content Parity</span>
                <span className="text-xl font-bold font-mono text-cyan-400">{FALLBACK_LESSONS.length} / {FALLBACK_LESSONS.length} Lessons</span>
                <span className="text-[10px] text-slate-400 block">8 Complete Levels (100% Fidelity)</span>
              </div>

              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Remote Database Rows</span>
                <span className="text-xl font-bold font-mono text-purple-400">
                  {syncStatus ? `${syncStatus.remoteCount} Active` : 'Checking...'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {syncStatus?.isSynced ? 'Fully Synced with Cloud' : 'Fallback active if empty'}
                </span>
              </div>

              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Target Missing Lessons</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold font-mono text-amber-300">6 Lessons Prepared</span>
                </div>
                <span className="text-[10px] text-slate-400 block">6.4, 7.4, 8.1, 8.2, 8.3, 8.4</span>
              </div>
            </div>

            {/* Sync Feedback Message */}
            {syncFeedback && (
              <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                syncFeedback.success 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                  : 'bg-amber-950/40 border-amber-800 text-amber-200'
              }`}>
                {syncFeedback.success ? <Check className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />}
                <div className="space-y-1">
                  <p className="font-semibold">{syncFeedback.success ? 'Sync Successful' : 'Supabase Synchronization Notice'}</p>
                  <p className="leading-relaxed">{syncFeedback.message}</p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Supabase Curriculum Synchronization
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Directly export or sync missing lessons (6.4, 7.4, 8.1–8.4) or the full 29-lesson curriculum into your cloud PostgreSQL database.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkSync}
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Refresh Status
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTriggerSync}
                    disabled={isSyncing}
                    icon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
                  >
                    {isSyncing ? 'Syncing...' : 'Attempt Cloud Sync'}
                  </Button>
                </div>
              </div>

              {/* Format Selector Pills */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 font-semibold">Select Export Format & Scope:</div>
                <div className="flex items-center gap-2 p-1.5 bg-slate-950/70 border border-slate-800/80 rounded-xl w-fit flex-wrap">
                  {/* CSV Options */}
                  <button
                    type="button"
                    onClick={() => setActiveScriptFormat('missing_csv')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeScriptFormat === 'missing_csv'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
                    Missing Lessons CSV (6.4, 7.4, 8.1–8.4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScriptFormat('levels48_csv')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeScriptFormat === 'levels48_csv'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
                    Levels 4–8 CSV (20 Lessons)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScriptFormat('all_csv')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeScriptFormat === 'all_csv'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
                    Full Curriculum CSV (All {FALLBACK_LESSONS.length} Lessons)
                  </button>

                  <div className="w-[1px] h-5 bg-slate-800 hidden sm:block"></div>

                  {/* SQL Options */}
                  <button
                    type="button"
                    onClick={() => setActiveScriptFormat('missing_sql')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeScriptFormat === 'missing_sql'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    Missing Lessons SQL (6.4, 7.4, 8.1–8.4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScriptFormat('levels48_sql')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeScriptFormat === 'levels48_sql'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    Levels 4–8 SQL (20 Lessons)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScriptFormat('all_sql')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeScriptFormat === 'all_sql'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    Full Curriculum SQL (All {FALLBACK_LESSONS.length} Lessons)
                  </button>
                </div>
              </div>

              {/* Step-by-Step Instructions based on format */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">i</span>
                    {activeScriptFormat.endsWith('_csv') 
                      ? `Instructions for CSV Import (${getActiveContent().label}):`
                      : `Instructions for SQL Query Execution (${getActiveContent().label}):`}
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const active = getActiveContent();
                        handleDownloadFile(active.content, active.filename, active.mimeType);
                      }}
                      className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" /> Download {getActiveContent().filename}
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCopyActive}
                      icon={copiedActive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedActive ? 'Copied to Clipboard!' : `Copy ${activeScriptFormat.endsWith('_csv') ? 'CSV' : 'SQL'} Text`}
                    </Button>
                  </div>
                </div>

                {activeScriptFormat.endsWith('_csv') ? (
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-xs leading-relaxed">
                    <li>Click <strong className="text-purple-300">"Download {getActiveContent().filename}"</strong> or <strong className="text-slate-200">"Copy CSV Text"</strong>.</li>
                    <li>Open your <a href="https://supabase.com/dashboard/project/xbrhalmcvpxutxojemoj/editor" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline inline-flex items-center gap-0.5">Supabase Table Editor <ExternalLink className="w-3 h-3 inline" /></a> and select the <code className="font-mono text-slate-200">lessons</code> table.</li>
                    <li>Click <strong className="text-slate-200">"Insert" &rarr; "Import data from CSV"</strong>.</li>
                    <li>Upload your downloaded CSV or paste CSV data. The columns (<code className="font-mono text-slate-300">id, course_id, order_index, level_name, lesson_number, title, content, is_free</code>) map 1:1 automatically!</li>
                    <li>Once imported, click <strong className="text-emerald-300">"Refresh Status"</strong> above to verify live parity!</li>
                  </ol>
                ) : (
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-xs leading-relaxed">
                    <li>Click <strong className="text-emerald-300">"Copy SQL Text"</strong> above or <strong className="text-slate-200">"Download {getActiveContent().filename}"</strong>.</li>
                    <li>Open your <a href="https://supabase.com/dashboard/project/xbrhalmcvpxutxojemoj/sql" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-0.5">Supabase SQL Editor <ExternalLink className="w-3 h-3 inline" /></a>.</li>
                    <li>Paste the SQL script into a new query tab and click <strong className="text-emerald-300">"Run"</strong>.</li>
                    <li>The script configures table structures, sets RLS public read policies, and upserts all targeted rows with deterministic UUIDs.</li>
                    <li>Click <strong className="text-emerald-300">"Refresh Status"</strong> above to confirm all records are recognized!</li>
                  </ol>
                )}
              </div>

              {/* Script Viewer Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {getActiveContent().label} Preview ({Math.round(getActiveContent().content.length / 1024)} KB)
                  </span>
                  <button
                    onClick={handleCopyActive}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedActive ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto max-h-56 scrollbar-thin">
                  {getActiveContent().content.slice(0, 2400) + '...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        <Modal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          subtitle="Changes are committed directly to the SQLite products table."
          maxWidth="lg"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Product Name</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                placeholder="e.g. Trend Matrix EA V2.0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Product Type</label>
                <select
                  value={productForm.type}
                  onChange={(e) => setProductForm({ ...productForm, type: e.target.value as ProductType })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="ea">Expert Advisor (EA)</option>
                  <option value="ebook">Trading Ebook</option>
                  <option value="service">Development Service</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Platform</label>
              <input
                type="text"
                value={productForm.platform}
                onChange={(e) => setProductForm({ ...productForm, platform: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                placeholder="MetaTrader 5 (MQL5) or PDF / EPUB"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Short Description</label>
              <input
                type="text"
                value={productForm.short_description}
                onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                placeholder="Brief one-line summary for cards"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Full Description</label>
              <textarea
                rows={3}
                required
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                placeholder="Comprehensive technical breakdown"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Image URL</label>
              <input
                type="text"
                value={productForm.image_url}
                onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="product-active"
                checked={productForm.active === 1}
                onChange={(e) => setProductForm({ ...productForm, active: e.target.checked ? 1 : 0 })}
                className="rounded bg-slate-900 border-slate-800 text-purple-600 focus:ring-0"
              />
              <label htmlFor="product-active" className="text-slate-300 font-mono">
                Product Active & Visible in Public Store
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsProductModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
              >
                {editingProduct ? 'Update Product' : 'Save & Publish Product'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: STRATEGY SPECIFICATION BRIEF INSPECTOR */}
        {selectedSubmission && (
          <Modal
            isOpen={!!selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            title={`Strategy Intake Brief: ${selectedSubmission.submission_id || selectedSubmission.id}`}
          >
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 text-xs">
              {/* Client Contact Quick Action Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">
                      Client Contact Channels
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{selectedSubmission.full_name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 font-mono font-bold text-xs">
                      {selectedSubmission.platform || 'MT5'}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs">
                      {selectedSubmission.instrument || 'Multi-Asset'} • {selectedSubmission.timeframe || 'Any TF'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center gap-2 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{selectedSubmission.email}</span>
                  </a>

                  {selectedSubmission.phone ? (
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 hover:border-emerald-700 text-emerald-300 flex items-center gap-2 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate font-mono">{selectedSubmission.phone}</span>
                    </a>
                  ) : (
                    <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800 text-slate-500 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span>No phone provided</span>
                    </div>
                  )}

                  {selectedSubmission.phone && selectedSubmission.phone.replace(/\D/g, '').length >= 6 ? (
                    <a
                      href={`https://wa.me/${selectedSubmission.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedSubmission.full_name}, this is MegaFX Automation regarding your ${selectedSubmission.platform || 'MT5'} strategy intake (${selectedSubmission.submission_id}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Notification & Dispatch Status */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Email Pipeline Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        selectedSubmission.email_status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {selectedSubmission.email_status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Admin Notification: supermegafx1@gmail.com
                    {selectedSubmission.email_sent_at && ` • Sent: ${new Date(selectedSubmission.email_sent_at).toLocaleString()}`}
                  </div>
                  {selectedSubmission.email_error && (
                    <div className="text-[11px] font-mono text-rose-400">
                      Error: {selectedSubmission.email_error}
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRetryEmail(selectedSubmission)}
                  disabled={retryingEmailId === selectedSubmission.id}
                  icon={
                    <Send
                      className={`w-3.5 h-3.5 ${
                        retryingEmailId === selectedSubmission.id ? 'animate-spin' : ''
                      }`}
                    />
                  }
                >
                  {retryingEmailId === selectedSubmission.id ? 'Sending...' : 'Send / Retry Email'}
                </Button>
              </div>

              {/* Original Trader Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Original Strategy (As Submitted by Trader)
                </label>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedSubmission.original_strategy}
                </div>
              </div>

              {/* Structured Parameters Breakdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Structured Specification Breakdown
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                      Entry Rules
                    </span>
                    <p className="text-slate-300 text-xs">
                      {selectedSubmission.entry_conditions || '—'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                      Exit / Take Profit Rules
                    </span>
                    <p className="text-slate-300 text-xs">
                      {selectedSubmission.exit_conditions || '—'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                      Risk Management & Stop Loss
                    </span>
                    <p className="text-slate-300 text-xs">
                      {selectedSubmission.risk_management || '—'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                      Trade Management & Execution
                    </span>
                    <p className="text-slate-300 text-xs">
                      {selectedSubmission.trade_management || selectedSubmission.trading_conditions || '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clarifications / Missing Info */}
              {selectedSubmission.missing_information && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                    Clarification Questions Needed
                  </span>
                  <p className="text-amber-200 text-xs">
                    {selectedSubmission.missing_information}
                  </p>
                </div>
              )}

              {/* Developer / AI Prompt */}
              {selectedSubmission.generated_prompt && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Generated Quant Engineering Prompt
                    </label>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedSubmission.generated_prompt || '');
                        setCopiedPrompt(true);
                        setTimeout(() => setCopiedPrompt(false), 2500);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedPrompt ? 'Copied' : 'Copy Prompt'}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {selectedSubmission.generated_prompt}
                  </pre>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close Brief
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal: Edit EA License & Delivery Governance */}
        {isLicenseModalOpen && editingLicense && (
          <EditLicenseModal
            isOpen={isLicenseModalOpen}
            onClose={() => {
              setIsLicenseModalOpen(false);
              setEditingLicense(null);
            }}
            license={editingLicense}
            onSaveSuccess={async (updated) => {
              setLicenses((prev) =>
                prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
              );
              await loadAdminData();
            }}
          />
        )}
      </div>
    </div>
  );
}
