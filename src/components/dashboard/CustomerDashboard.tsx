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
  TrendingUp
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'eas' | 'portfolio' | 'ebooks' | 'orders' | 'projects' | 'settings'>(initialTab || 'eas');
  const [data, setData] = useState<CustomerDashboardData>({
    orders: [],
    eas: [],
    ebooks: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
    if (!newPassword || !user?.email) return;
    try {
      await api.resetPassword(user.email, newPassword);
      setPasswordSuccess('Password updated successfully.');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update password');
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
          <div className="space-y-2">
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
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>Security & Password</span>
              </h2>

              <form onSubmit={handlePasswordUpdate} className="space-y-3">
                {passwordSuccess && (
                  <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300">
                    {passwordSuccess}
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <Button variant="secondary" size="sm" type="submit">
                  Update Password
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
