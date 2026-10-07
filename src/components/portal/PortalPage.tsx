import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ActiveView } from '../../types.ts';
import { STOREFRONT_MEDIA } from '../../constants/media.ts';
import { 
  Shield, 
  Download, 
  Key, 
  Bot, 
  BookOpen, 
  ExternalLink, 
  LogOut, 
  User as UserIcon, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  Copy,
  Check,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface PortalPageProps {
  onNavigate: (view: ActiveView, productId?: string) => void;
  onTriggerBuildMyEa?: () => void;
}

export function PortalPage({ onNavigate, onTriggerBuildMyEa }: PortalPageProps) {
  const { user, loading, logout, isAdmin, isGoogleUser, changePassword } = useAuth();
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'downloads' | 'licenses' | 'projects' | 'session'>('downloads');
  const [downloadingFreeEbook, setDownloadingFreeEbook] = useState(false);

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

  const handleChangePassword = async (e: React.FormEvent) => {
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

    setPasswordLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordSuccess(res.message || 'Your password has been changed successfully!');
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

  const handleDownloadFreeEbook = () => {
    setDownloadingFreeEbook(true);
    try {
      const link = document.createElement('a');
      link.href = '/api/ebooks/download';
      link.setAttribute('download', 'The-Traders-Guide-to-Understanding-Strategy-Automation.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingFreeEbook(false);
    }
  };

  // Route Protection: If logged out, instantly redirect to /login
  useEffect(() => {
    if (!loading && !user) {
      onNavigate('login');
    }
  }, [user, loading, onNavigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FAFBFD] flex flex-col items-center justify-center text-slate-700">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-xs font-mono tracking-wider uppercase text-slate-500">
          Verifying Authenticated Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const sampleLicenseKey = `EAH-ALP-${user.id.substring(0, 8).toUpperCase()}-PRO`;

  const copyLicense = () => {
    navigator.clipboard.writeText(sampleLicenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('login');
  };

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-slate-900 overflow-hidden font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* 1. Ambient Studio Lighting harmonized with Homepage */}
      <div className="absolute -top-10 -right-10 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/12 via-fuchsia-500/8 to-transparent rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-24 left-10 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-purple-600/8 via-fuchsia-400/5 to-transparent blur-[140px] pointer-events-none -z-0" />

      {/* 2. Subtle Technical Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f040_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f040_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Top Welcome Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-xs text-emerald-700">
              <UserIcon className="w-7 h-7 text-emerald-700" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  Welcome to Your Portal
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active Session
                </span>
                {isAdmin && (
                  <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-mono font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-purple-700" />
                    Administrator
                  </span>
                )}
              </div>

              <p className="text-xs font-mono text-slate-500 mt-1.5">
                Account: <span className="text-slate-800 font-semibold">{user.email}</span>
                {user.name && <span className="text-slate-600"> • {user.name}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Shield className="w-3.5 h-3.5 text-purple-700" />
                <span>Admin Console</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Administrator Recognition Banner */}
        {isAdmin && (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 border border-purple-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Administrator Privileges Recognized</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono font-bold">
                    Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Your email (<span className="text-purple-900 font-mono font-semibold">{user.email}</span>) is recognized as the platform administrator. You have full access to product configurations, orders, and customer management.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-[0.98]"
            >
              <span>Access Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Portal Segmented Pill Tabs (Homepage Style) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-full sm:w-fit overflow-x-auto shadow-xs">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Downloads &amp; Ebooks</span>
          </button>

          <button
            onClick={() => setActiveTab('licenses')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'licenses'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-600" />
            <span>EA License Keys</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>Custom Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'session'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Account &amp; Security</span>
          </button>
        </div>

        {/* Tab Content: Downloads */}
        {activeTab === 'downloads' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600" />
                <span>Available Digital Downloads</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">Instant Unlocked Access</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Flagship EA Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={STOREFRONT_MEDIA.flagshipEa.imageUrl}
                        alt={STOREFRONT_MEDIA.flagshipEa.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 leading-tight group-hover:text-emerald-700 transition-colors">
                        {STOREFRONT_MEDIA.flagshipEa.title}
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-800 font-semibold uppercase tracking-wider">
                        MetaTrader 5 Expert Advisor
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Production binary (.ex5), calibrated parameter setfiles (.set), and institutional liquidity strategy template.
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">v1.0.0 • ZIP</span>
                  <button
                    onClick={() => onNavigate('eas')}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>View System</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Free Lead Magnet Ebook */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={STOREFRONT_MEDIA.freeEbook.coverUrl}
                        alt={STOREFRONT_MEDIA.freeEbook.title}
                        referrerPolicy="no-referrer"
                        className="h-full object-contain rounded shadow-xs"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 leading-tight group-hover:text-emerald-700 transition-colors">
                        The Trader&apos;s Guide to Automation
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-800 font-semibold uppercase tracking-wider">
                        Free Master Ebook
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    By M. Dinga. Learn to transition from discretionary chart-watching to structured algorithmic automation.
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">DRM-Free PDF</span>
                  <button
                    onClick={handleDownloadFreeEbook}
                    disabled={downloadingFreeEbook}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {downloadingFreeEbook ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Volume 2 Prompt Handbook */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={STOREFRONT_MEDIA.paidEbook2.coverUrl}
                        alt={STOREFRONT_MEDIA.paidEbook2.title}
                        referrerPolicy="no-referrer"
                        className="h-full object-contain rounded shadow-xs"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 leading-tight group-hover:text-emerald-700 transition-colors">
                        AI Prompt Handbook (Vol 2)
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-800 font-semibold uppercase tracking-wider">
                        By M. Dinga
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    The 5-Ingredient Master Prompt framework, 150+ tested prompt templates, and modular Lego-block bots.
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">Digital PDF</span>
                  <a
                    href={STOREFRONT_MEDIA.paidEbook2.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Access PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Licenses */}
        {activeTab === 'licenses' && (
          <div className="space-y-5">
            <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" />
              <span>Active Machine Licenses</span>
            </h2>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-950">Adaptive Liquidity Pro V1.0</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase font-semibold">
                      Standard License
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                    <span>Key:</span>
                    <span className="text-emerald-800 font-bold tracking-wider">{sampleLicenseKey}</span>
                  </div>
                </div>

                <button
                  onClick={copyLicense}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed font-sans pt-1">
                Paste this key into the <code className="text-emerald-800 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">InpLicenseKey</code> parameter in MetaTrader 5 when attaching the Expert Advisor to your chart.
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-600" />
                <span>Custom EA Projects</span>
              </h2>

              {onTriggerBuildMyEa && (
                <button
                  onClick={onTriggerBuildMyEa}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Request New Bot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-700 shadow-xs">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No active custom EA projects in queue</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Have a proprietary trading concept or discretionary strategy you want automated in MetaTrader 5 or TradingView?
              </p>
              {onTriggerBuildMyEa && (
                <button
                  onClick={onTriggerBuildMyEa}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build My Custom EA</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Session & Security Info */}
        {activeTab === 'session' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>Account Credentials &amp; Authentication</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Overview of your platform credentials, active session tokens, and security profile.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 font-mono text-xs space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">User ID (UUID):</span>
                  <span className="text-slate-800 text-xs font-semibold break-all">{user.id}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Email Address:</span>
                  <span className="text-emerald-800 text-xs font-semibold">{user.email}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Role / Status:</span>
                  <span className="text-slate-900 text-xs font-bold uppercase">{user.role}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Authentication Method:</span>
                  <span className="text-slate-800 text-xs font-bold flex items-center gap-1.5 mt-0.5">
                    {isGoogleUser ? (
                      <span className="text-blue-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        Google OAuth
                      </span>
                    ) : (
                      <span className="text-emerald-800 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Firebase Email / Password
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-sans">
                  Session secured with Firebase Authentication &amp; encrypted tokens
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Password Management */}
            {isGoogleUser ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900">Google Authentication Active</h3>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold">
                        Managed by Google
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You are signed in with your Google Account (<strong className="text-slate-900">{user.email}</strong>). Because Google OAuth manages your authentication credentials, your password and security verification are handled safely directly through Google.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Change Account Password</h3>
                      <p className="text-xs text-slate-500">
                        Securely update your password using Firebase Authentication.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 self-start sm:self-center font-medium">
                    Min 6 characters
                  </span>
                </div>

                {passwordSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-sans">{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-sans">{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1">
                      Current Password <span className="text-emerald-700">*</span>
                    </label>
                    <div className="relative max-w-lg">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        autoComplete="current-password"
                        className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs font-mono transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        New Password <span className="text-emerald-700">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 chars"
                          autoComplete="new-password"
                          className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs font-mono transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          aria-label="Toggle password visibility"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Confirm Password <span className="text-emerald-700">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          autoComplete="new-password"
                          className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs font-mono transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          aria-label="Toggle password visibility"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PortalPage;
