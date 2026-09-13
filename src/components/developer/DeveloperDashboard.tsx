import { useState, useEffect } from 'react';
import { EaProject } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../common/Button.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { 
  Code2, 
  Terminal, 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  ShieldAlert, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface DeveloperDashboardProps {
  onBackToHome: () => void;
}

export function DeveloperDashboard({ onBackToHome }: DeveloperDashboardProps) {
  const { user, isDeveloper, isAdmin, quickLogin } = useAuth();
  const [projects, setProjects] = useState<EaProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDeveloperData = async () => {
    if (!isDeveloper && !isAdmin) return;
    try {
      setLoading(true);
      const res = await api.getDeveloperProjects();
      setProjects(res);
    } catch (err) {
      console.error('Failed to load developer projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeveloperData();
  }, [isDeveloper, isAdmin]);

  if (!isDeveloper && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-cyan-900/50 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Developer Terminal Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your current role ({user?.role || 'Guest'}) does not have quantitative developer privileges.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => quickLogin('developer')}
            >
              Switch to Test Developer Account
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToHome}
            >
              Return to Store
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (projectId: string, nextStatus: string) => {
    try {
      await api.updateProjectStatus(projectId, nextStatus);
      loadDeveloperData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#111827] border border-cyan-900/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                MQL5 Engineering Workbench
              </span>
              <StatusBadge status={user?.role || 'developer'} type="role" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Developer Project Queue
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Signed in: {user?.email} • MQL5 / C++ / Python Environment
            </p>
          </div>

          <button
            onClick={loadDeveloperData}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors self-start md:self-auto"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Active Builds Assigned ({projects.length})</span>
            <span>Architecture: Phase 1 Pre-Seed</span>
          </div>

          {projects.length === 0 ? (
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-10 text-center space-y-3">
              <Code2 className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No projects currently assigned</h3>
              <p className="text-xs text-slate-500">New strategy intake submissions will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">{proj.id}</span>
                        <StatusBadge status={proj.status} size="sm" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mt-1">{proj.title}</h3>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      Client ID: <span className="text-slate-200">{proj.user_id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                      <span className="font-mono uppercase text-[10px] text-slate-500 block font-semibold">
                        Client Strategy Description
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {proj.strategy_description || 'Custom technical breakout system based on London open liquidity.'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                      <span className="font-mono uppercase text-[10px] text-slate-500 block font-semibold">
                        Platform & Parameters
                      </span>
                      <p className="text-slate-300 font-mono">
                        Platform: {proj.platform || 'MetaTrader 5'}
                        <br />
                        Quote Status: {proj.quote_status || 'Approved'} (${proj.quote_amount?.toFixed(2) || '0.00'})
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">Update Status:</span>
                      {['in_development', 'testing', 'delivered'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(proj.id, st)}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors ${
                            proj.status === st
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      Phase 1 Manual Handoff Mode
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
