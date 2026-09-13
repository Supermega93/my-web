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
  Clock, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  Copy,
  Check
} from 'lucide-react';

interface PortalPageProps {
  onNavigate: (view: ActiveView, productId?: string) => void;
  onTriggerBuildMyEa?: () => void;
}

export function PortalPage({ onNavigate, onTriggerBuildMyEa }: PortalPageProps) {
  const { user, session, loading, logout, isAdmin } = useAuth();
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'downloads' | 'licenses' | 'projects' | 'session'>('downloads');

  // Route Protection: If logged out, instantly redirect to /login
  useEffect(() => {
    if (!loading && !user) {
      onNavigate('login');
    }
  }, [user, loading, onNavigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#070B14] flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-xs font-mono tracking-wider uppercase text-slate-400">
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
    <div className="min-h-screen bg-[#070B14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 bg-[#0B111E] border border-slate-800/90 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-lg">
              <UserIcon className="w-7 h-7 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Welcome to Your Portal
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Session
                </span>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Administrator
                  </span>
                )}
              </div>

              <p className="text-xs font-mono text-slate-400 mt-1">
                Account: <span className="text-slate-200">{user.email}</span>
                {user.name && <span className="text-slate-500"> • {user.name}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Administrator Recognition Banner (Foundation) */}
        {isAdmin && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0B111E] to-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Administrator Privileges Recognized</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 font-mono">
                    Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your email (<span className="text-purple-300 font-mono">{user.email}</span>) is recognized as the platform administrator. You have full access to product configurations, database synchronization, orders, and customer management.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Access Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Portal Tabs */}
        <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'downloads'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Downloads & Ebooks</span>
          </button>

          <button
            onClick={() => setActiveTab('licenses')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'licenses'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>EA License Keys</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Custom Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'session'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Supabase Auth Session</span>
          </button>
        </div>

        {/* Tab Content: Downloads */}
        {activeTab === 'downloads' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Available Digital Downloads</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Flagship EA Card */}
              <div className="bg-[#0B111E] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={STOREFRONT_MEDIA.flagshipEa.imageUrl}
                      alt={STOREFRONT_MEDIA.flagshipEa.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-contain bg-[#070B14] border border-slate-800"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {STOREFRONT_MEDIA.flagshipEa.title}
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        MetaTrader 5 Expert Advisor
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Production binary (.ex5), preset configuration files (.set), and institutional liquidity strategy template.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">v1.0.0 • ZIP</span>
                  <button
                    onClick={() => onNavigate('eas')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View System</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Free Lead Magnet Ebook */}
              <div className="bg-[#0B111E] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={STOREFRONT_MEDIA.freeEbook.coverUrl}
                      alt={STOREFRONT_MEDIA.freeEbook.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-14 object-contain rounded drop-shadow-md"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        The Trader's Guide to Automation
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        Free Master Ebook
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    By M. Dinga. Learn to transition from discretionary chart-watching to structured algorithmic automation.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">DRM-Free PDF</span>
                  <a
                    href={STOREFRONT_MEDIA.freeEbook.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

              {/* Volume 2 Prompt Handbook */}
              <div className="bg-[#0B111E] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={STOREFRONT_MEDIA.paidEbook2.coverUrl}
                      alt={STOREFRONT_MEDIA.paidEbook2.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-14 object-contain rounded drop-shadow-md"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        AI Prompt Handbook (Vol 2)
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">
                        By M. Dinga
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    The 5-Ingredient Master Prompt framework, 150+ tested prompt templates, and modular Lego-block bots.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">Digital PDF</span>
                  <a
                    href={STOREFRONT_MEDIA.paidEbook2.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Access PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Licenses */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Active Machine Licenses</span>
            </h2>

            <div className="bg-[#0B111E] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#070B14] border border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Adaptive Liquidity Pro V1.0</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">
                      Standard License
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span>Key:</span>
                    <span className="text-emerald-400 font-bold tracking-wider">{sampleLicenseKey}</span>
                  </div>
                </div>

                <button
                  onClick={copyLicense}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed">
                Paste this key into the <code className="text-emerald-300 font-mono">InpLicenseKey</code> parameter in MetaTrader 5 when attaching the Expert Advisor to your chart.
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Custom EA Projects</span>
              </h2>

              {onTriggerBuildMyEa && (
                <button
                  onClick={onTriggerBuildMyEa}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Request New Bot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-[#0B111E] border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No active custom EA projects in queue</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Have a proprietary trading concept or discretionary strategy you want automated in MetaTrader 5 or TradingView?
              </p>
              {onTriggerBuildMyEa && (
                <button
                  onClick={onTriggerBuildMyEa}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
                >
                  <span>Build My Custom EA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Session Info */}
        {activeTab === 'session' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Supabase Authentication Details</span>
            </h2>

            <div className="bg-[#0B111E] border border-slate-800 rounded-2xl p-6 font-mono text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">User ID (UUID):</span>
                  <span className="text-slate-200 text-xs break-all">{user.id}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Email Address:</span>
                  <span className="text-emerald-400 text-xs">{user.email}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Role / Status:</span>
                  <span className="text-cyan-400 text-xs font-bold uppercase">{user.role}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Admin State:</span>
                  <span className={`text-xs font-bold ${isAdmin ? 'text-purple-400' : 'text-slate-400'}`}>
                    {isAdmin ? 'TRUE (Administrator)' : 'FALSE (Standard Customer)'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Secured via Supabase Auth client & JWT tokens
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Supabase</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortalPage;
