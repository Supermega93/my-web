import { useState, useEffect } from 'react';
import { CustomerDashboardData, ActiveView } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../common/Button.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { TradingPortfolioView } from './TradingPortfolioView.tsx';
import { 
  User, 
  ShoppingBag, 
  Cpu, 
  BookOpen, 
  FolderGit2, 
  Settings, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  Clock, 
  AlertCircle, 
  Activity, 
  Camera, 
  Upload, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigate: (view: ActiveView, productId?: string) => void;
  onTriggerBuildMyEa: () => void;
  initialTab?: 'eas' | 'portfolio' | 'ebooks' | 'orders' | 'projects' | 'settings';
}

export function CustomerDashboard({
  onNavigate,
  onTriggerBuildMyEa,
  initialTab,
}: CustomerDashboardProps) {
  const { user, isGoogleUser, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'eas' | 'portfolio' | 'ebooks' | 'orders' | 'projects' | 'settings'>(initialTab || 'eas');
  const [data, setData] = useState<CustomerDashboardData>({
    orders: [],
    eas: [],
    ebooks: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || user?.photoURL || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState('');

  useEffect(() => {
    if (user?.avatar_url || user?.photoURL) {
      setAvatarUrl(user.avatar_url || user.photoURL || '');
    }
  }, [user]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      setAvatarSuccess('');
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const base64Data = ev.target?.result as string;
          if (!base64Data) return;
          const res = await api.uploadAvatar(base64Data, file.name);
          if (res.success && res.avatarUrl) {
            setAvatarUrl(res.avatarUrl);
            setAvatarSuccess('Profile photo uploaded successfully!');
            setTimeout(() => setAvatarSuccess(''), 4000);
          }
        } catch (err: any) {
          alert(err.message || 'Failed to upload profile photo');
        } finally {
          setUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingAvatar(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomerDashboardData();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      setPasswordError('Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please verify.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from your current password.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordSuccess('Password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.error || 'Failed to update password');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Error updating password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const triggerMockDownload = (filename: string) => {
    if (filename.startsWith('http')) {
      window.open(filename, '_blank');
      return;
    }
    const blob = new Blob([`EA Automation Hub Official Delivery Package\nFile: ${filename}\nLicensed User: ${user?.name} (${user?.email})\nTimestamp: ${new Date().toISOString()}\nStatus: Verified MQL5 / Digital Asset`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.split('/').pop() || 'download.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Ambient Studio Lighting */}
      <div className="absolute -top-10 -right-10 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/12 via-fuchsia-500/8 to-transparent rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-24 left-10 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-purple-600/8 via-fuchsia-400/5 to-transparent blur-[140px] pointer-events-none -z-0" />

      {/* Subtle Technical Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f040_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f040_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || 'User Avatar'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-2xl text-emerald-700 shrink-0 shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  Client Dashboard
                </span>
                <StatusBadge status={user?.role || 'customer'} type="role" size="sm" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Welcome back, {user?.name || 'Trader'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-mono">
                Account: <span className="text-slate-800 font-semibold">{user?.email}</span>
                {user?.id && <span className="text-slate-400"> • ID: {user.id.substring(0, 8)}...</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="header-portfolio-btn"
              onClick={() => setActiveTab('portfolio')}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Trading Portfolio</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={onTriggerBuildMyEa}
              icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
            >
              Build My EA
            </Button>
          </div>
        </div>

        {/* Section Tabs (Segmented Control Pill Style) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-full sm:w-fit overflow-x-auto shadow-xs">
          <button
            onClick={() => setActiveTab('eas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'eas'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>My EAs ({data.eas.length})</span>
          </button>

          <button
            id="tab-trading-portfolio"
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'portfolio'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Trading Portfolio</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('ebooks')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ebooks'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>My Ebooks ({data.ebooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>My Orders ({data.orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-600" />
            <span>My Projects ({data.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Tab 1: MY EAS */}
        {activeTab === 'eas' && (
          <div className="space-y-6">
            {data.eas.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-10 sm:p-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
                  <Cpu className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">No Expert Advisors in your account yet</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Explore our ready-to-use institutional automated trading robots, or have a custom EA engineered for your personal strategy.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Button variant="primary" size="sm" onClick={() => onNavigate('eas')}>
                    Explore Trading EAs
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab('portfolio')}
                    icon={<Activity className="w-4 h-4 text-emerald-600" />}
                  >
                    Open Trading Portfolio
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {data.eas.map((ea) => (
                  <div
                    key={ea.id}
                    className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="space-y-3 max-w-xl">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="ea" type="type" size="sm" />
                        <span className="text-xs text-slate-500 font-mono">{ea.platform || 'MetaTrader 5'}</span>
                        <StatusBadge status={ea.license_status || 'active'} size="sm" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-950">{ea.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{ea.short_description || ea.description}</p>

                      {/* License Key Box */}
                      {ea.license_key && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                                Terminal License Key
                              </span>
                              <span className="font-mono text-xs font-bold text-emerald-800">
                                {ea.license_key}
                              </span>
                            </div>
                            <button
                              onClick={() => copyLicenseKey(ea.license_key!)}
                              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-950 transition-colors shadow-xs cursor-pointer"
                              title="Copy License Key"
                            >
                              {copiedKey === ea.license_key ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {/* License Dates */}
                          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                              <span className="text-slate-500">Starts:</span>
                              <span className="text-slate-800">{ea.starts_at ? new Date(ea.starts_at).toLocaleDateString() : 'Instant'}</span>
                            </div>
                            <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                              <span className="text-slate-500">Expires:</span>
                              <span className="text-slate-800">{ea.expires_at ? new Date(ea.expires_at).toLocaleDateString() : 'Lifetime'}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-400" />
                              Dates managed securely by Administrator
                            </span>
                            <span className="text-slate-600">
                              Status: <strong className="text-emerald-700 uppercase">{ea.license_status || 'active'}</strong>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Delivery Status */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            EA Delivery Status:
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                            ea.delivery_status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ea.delivery_status === 'processing'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {ea.delivery_status === 'delivered'
                              ? 'Delivered by Admin'
                              : ea.delivery_status === 'processing'
                              ? 'Compiling & Binding'
                              : 'Pending Admin Delivery'}
                          </span>
                        </div>

                        {ea.delivery_notes && (
                          <div className="text-[11px] text-amber-900 font-mono bg-amber-50 border border-amber-200 p-2 rounded-lg mt-1">
                            <strong>Admin Note:</strong> {ea.delivery_notes}
                          </div>
                        )}

                        <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                          Institutional Policy: Expert Advisor binaries (.EX5) are compiled and provisioned securely by our engineering team to protect proprietary code.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('ea-detail', ea.id)}
                      >
                        Documentation &amp; Sets
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: TRADING PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <TradingPortfolioView
              userEas={data.eas}
              onNavigateToEas={() => onNavigate('eas')}
              onTriggerBuildMyEa={onTriggerBuildMyEa}
            />
          </div>
        )}

        {/* Tab 2: MY EBOOKS */}
        {activeTab === 'ebooks' && (
          <div className="space-y-6">
            {data.ebooks.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-10 sm:p-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">No trading ebooks purchased yet</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Master MQL5 programming and quantitative AI automation with our comprehensive guides and prompt libraries.
                </p>
                <div className="pt-2 flex justify-center">
                  <Button variant="primary" size="sm" onClick={() => onNavigate('ebooks')}>
                    Browse Ebook Library
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.ebooks.map((ebook) => (
                  <div
                    key={ebook.id}
                    className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="ebook" type="type" size="sm" />
                        <span className="text-xs text-slate-500 font-mono">PDF &amp; EPUB</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-950">{ebook.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ebook.short_description || ebook.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">Purchased &amp; Verified</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const targetUrl = ebook.id === 'prod_ebook_mql5_guide'
                            ? STOREFRONT_MEDIA.paidEbook1.downloadUrl
                            : (ebook.id === 'prod_ebook_ai_prompt'
                              ? STOREFRONT_MEDIA.paidEbook2.downloadUrl
                              : (ebook.download_url || STOREFRONT_MEDIA.paidEbook1.downloadUrl));
                          triggerMockDownload(targetUrl);
                        }}
                        icon={<Download className="w-3.5 h-3.5 text-white" />}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h2 className="text-base font-bold text-slate-950">Order &amp; Billing History</h2>
              <span className="text-xs font-mono text-slate-500">{data.orders.length} Records</span>
            </div>

            {data.orders.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-500">
                No orders recorded on this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Order ID / Date</th>
                      <th className="px-6 py-3.5">Product</th>
                      <th className="px-6 py-3.5">Transaction ID</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {data.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono">
                          <div className="font-semibold text-slate-900">{order.id}</div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {order.product_name || order.product_id}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">
                          {order.transaction_id}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-950">
                          ${order.amount.toFixed(2)} {order.currency}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.payment_status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: MY PROJECTS */}
        {activeTab === 'projects' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-10 sm:p-12 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
              <FolderGit2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-extrabold text-slate-950">
                No EA projects yet.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Have an indicator combination, chart pattern, or proprietary execution strategy you want transformed into a production-grade Expert Advisor? Start your custom development build today.
              </p>
            </div>

            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={onTriggerBuildMyEa}
                icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
              >
                Build My EA
              </Button>
            </div>

            <div className="pt-6 border-t border-slate-100 text-[11px] font-mono text-slate-400 max-w-md mx-auto">
              *Full automated project workspace tracking and specification pipelines will unlock in Phase 2.
            </div>
          </div>
        )}

        {/* Tab 5: ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Account Profile</span>
              </h2>

              {/* Avatar Profile Photo Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <div className="relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || 'User Avatar'}
                      className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/30 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-lg text-emerald-700">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    title="Upload profile photo"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                    disabled={uploadingAvatar}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-900 block">Profile Photo</span>
                  <label
                    htmlFor="avatar-file-input"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>Change Photo</span>
                      </>
                    )}
                  </label>
                  {avatarSuccess && (
                    <span className="text-[11px] text-emerald-700 font-mono block">
                      {avatarSuccess}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Full Name</span>
                  <span className="text-slate-900 font-semibold">{user?.name || 'Trader'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Email Address</span>
                  <span className="text-slate-900 font-mono">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Account Role</span>
                  <div className="mt-1">
                    <StatusBadge status={user?.role || 'customer'} type="role" size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Registered Since</span>
                  <span className="text-slate-600 font-mono">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Member'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Security &amp; Password</span>
                </h2>
                {!isGoogleUser && (
                  <span className="text-[10px] font-mono text-slate-500">Min 6 chars</span>
                )}
              </div>

              {isGoogleUser ? (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-bold text-slate-900">Google Authentication Active</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-bold">
                          Managed by Google
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        You are signed in with Google OAuth (<strong className="text-slate-900">{user?.email}</strong>). Security verification and password resets are managed directly through Google.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  {passwordSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-slate-600 font-mono mb-1">
                      Current Password <span className="text-emerald-700">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                        className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        title={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 font-mono mb-1">
                      New Password <span className="text-emerald-700">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        autoComplete="new-password"
                        className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 font-mono mb-1">
                      Confirm New Password <span className="text-emerald-700">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <Button variant="primary" size="sm" type="submit" disabled={passwordLoading}>
                    {passwordLoading ? 'Updating Password...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
