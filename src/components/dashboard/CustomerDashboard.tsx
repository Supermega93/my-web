import { useState, useEffect } from 'react';
import { CustomerDashboardData, ActiveView, Order, Product } from '../../types.ts';
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
  Key, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Lock,
  Clock,
  AlertCircle,
  Activity,
  TrendingUp,
  Camera,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2
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
            setAvatarSuccess('Profile photo uploaded to Supabase Storage!');
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
        setPasswordSuccess(res.message || 'Your password has been changed successfully. Use your new password the next time you sign in.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.error || 'Failed to update password. Please check your credentials.');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'An unexpected error occurred while updating your password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const triggerMockDownload = (filename: string) => {
    // If it's a real Supabase/HTTP URL, open directly in a new tab for immediate PDF delivery
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      window.open(filename, '_blank', 'noopener,noreferrer');
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
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || 'User Avatar'}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/40 shrink-0 shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xl text-emerald-400 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Customer Portal
                </span>
                <StatusBadge status={user?.role || 'customer'} type="role" size="sm" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {user?.name || 'Trader'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Account: {user?.email} • ID: {user?.id}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="header-portfolio-btn"
              onClick={() => setActiveTab('portfolio')}
              className="px-3.5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Trading Portfolio</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={onTriggerBuildMyEa}
              icon={<Sparkles className="w-4 h-4 text-slate-950" />}
            >
              Build My EA
            </Button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('eas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'eas'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>My EAs ({data.eas.length})</span>
          </button>

          <button
            id="tab-trading-portfolio"
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Trading Portfolio</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('ebooks')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'ebooks'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Ebooks ({data.ebooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({data.orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>My Projects ({data.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Tab 1: MY EAS */}
        {activeTab === 'eas' && (
          <div className="space-y-6">
            {data.eas.length === 0 ? (
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-10 text-center space-y-4">
                <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">No Expert Advisors in your account yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
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
                    icon={<Activity className="w-4 h-4 text-emerald-400" />}
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
                    className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg"
                  >
                    <div className="space-y-3 max-w-xl">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="ea" type="type" size="sm" />
                        <span className="text-xs text-slate-400 font-mono">{ea.platform || 'MetaTrader 5'}</span>
                        <StatusBadge status={ea.license_status || 'active'} size="sm" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-100">{ea.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{ea.short_description || ea.description}</p>

                      {/* License Key Box */}
                      {ea.license_key && (
                        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                                Terminal License Key
                              </span>
                              <span className="font-mono text-xs font-bold text-emerald-400">
                                {ea.license_key}
                              </span>
                            </div>
                            <button
                              onClick={() => copyLicenseKey(ea.license_key!)}
                              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                              title="Copy License Key"
                            >
                              {copiedKey === ea.license_key ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {/* License Dates - Read Only for Customers */}
                          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="bg-slate-900/60 px-2 py-1.5 rounded border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-500">Starts:</span>
                              <span className="text-slate-200">{ea.starts_at ? new Date(ea.starts_at).toLocaleDateString() : 'Instant (Purchase Date)'}</span>
                            </div>
                            <div className="bg-slate-900/60 px-2 py-1.5 rounded border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-500">Expires:</span>
                              <span className="text-slate-200">{ea.expires_at ? new Date(ea.expires_at).toLocaleDateString() : 'Lifetime (No Expiry)'}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-500" />
                              Dates managed securely by Administrator
                            </span>
                            <span className="text-slate-400">
                              Status: <strong className="text-emerald-400 uppercase">{ea.license_status || 'active'}</strong>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Delivery Status & Security Governance */}
                      <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            EA Delivery Status:
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                            ea.delivery_status === 'delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : ea.delivery_status === 'processing'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {ea.delivery_status === 'delivered'
                              ? 'Delivered by Admin'
                              : ea.delivery_status === 'processing'
                              ? 'Compiling & Binding'
                              : 'Pending Admin Delivery'}
                          </span>
                        </div>

                        {ea.delivery_notes && (
                          <div className="text-[11px] text-amber-300/90 font-mono bg-amber-500/10 border border-amber-500/20 p-2 rounded mt-1">
                            <strong>Admin Note:</strong> {ea.delivery_notes}
                          </div>
                        )}

                        <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                          Institutional Policy: Expert Advisor binaries (.EX5) are compiled and delivered manually by our engineering team to protect proprietary code. Binaries are never automatically downloadable.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('ea-detail', ea.id)}
                      >
                        Documentation & Sets
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
          <TradingPortfolioView
            userEas={data.eas}
            onNavigateToEas={() => onNavigate('eas')}
            onTriggerBuildMyEa={onTriggerBuildMyEa}
          />
        )}

        {/* Tab 2: MY EBOOKS */}
        {activeTab === 'ebooks' && (
          <div className="space-y-6">
            {data.ebooks.length === 0 ? (
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-10 text-center space-y-4">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">No trading ebooks purchased yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
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
                    className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="ebook" type="type" size="sm" />
                        <span className="text-xs text-slate-400 font-mono">PDF & EPUB</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100">{ebook.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ebook.short_description || ebook.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400">Purchased & Verified</span>
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
                        icon={<Download className="w-3.5 h-3.5 text-slate-950" />}
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
          <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100">Order & Billing History</h2>
              <span className="text-xs font-mono text-slate-400">{data.orders.length} Records</span>
            </div>

            {data.orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No orders recorded on this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="px-6 py-3">Order ID / Date</th>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Transaction ID</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {data.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-mono">
                          <div className="font-semibold text-slate-200">{order.id}</div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-200">
                          {order.product_name || order.product_id}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400">
                          {order.transaction_id}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-100">
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

        {/* Tab 4: MY PROJECTS (Strict user requirement) */}
        {activeTab === 'projects' && (
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-10 text-center space-y-6 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <FolderGit2 className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-slate-100">
                No EA projects yet.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have an indicator combination, chart pattern, or proprietary execution strategy you want transformed into a production-grade Expert Advisor? Start your custom development build today.
              </p>
            </div>

            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={onTriggerBuildMyEa}
                icon={<Sparkles className="w-4 h-4 text-slate-950" />}
              >
                Build My EA
              </Button>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 max-w-md mx-auto">
              *Full automated project workspace tracking and specification pipelines will unlock in Phase 2.
            </div>
          </div>
        )}

        {/* Tab 5: ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Account Profile</span>
              </h2>

              {/* Avatar Profile Photo Upload (Supabase Storage avatars bucket) */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
                <div className="relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || 'User Avatar'}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/50 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-emerald-400">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    title="Upload profile photo to Supabase"
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
                  <span className="text-xs font-semibold text-slate-200 block">Profile Photo</span>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Stored in Supabase Storage (`avatars` bucket)
                  </p>
                  <label
                    htmlFor="avatar-file-input"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
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
                    <span className="text-[11px] text-emerald-400 font-mono block animate-pulse">
                      {avatarSuccess}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Full Name</span>
                  <span className="text-slate-200 font-medium">{user?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Email Address</span>
                  <span className="text-slate-200 font-mono">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Account Role</span>
                  <div className="mt-1">
                    <StatusBadge status={user?.role || 'customer'} type="role" size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">Registered Since</span>
                  <span className="text-slate-400 font-mono">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Member'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Security & Password</span>
                </h2>
                {!isGoogleUser && (
                  <span className="text-[10px] font-mono text-slate-500">Min 6 chars</span>
                )}
              </div>

              {isGoogleUser ? (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-bold text-slate-100">Google Authentication Active</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                          Managed by Google
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        You are signed in with your Google Account (<strong className="text-slate-200">{user?.email}</strong>). Because Google OAuth manages your authentication credentials, your password, security verification, and two-factor authentication are handled safely directly through Google.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-3.5">
                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{passwordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-slate-400 font-mono mb-1">
                      Current Password <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        autoComplete="current-password"
                        className="w-full px-3 py-2 pr-10 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
                        title={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-mono mb-1">
                      New Password <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 pr-10 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-mono mb-1">
                      Confirm New Password <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 pr-10 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <Button variant="secondary" size="sm" type="submit" disabled={passwordLoading}>
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
