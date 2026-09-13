import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'type' | 'role' | 'tag';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, type = 'status', size = 'md' }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/_/g, ' ');

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (type === 'role') {
    if (normalized === 'admin') colorClasses = 'bg-purple-950/80 text-purple-300 border-purple-800/80';
    else if (normalized === 'developer') colorClasses = 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80';
    else colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
  } else if (type === 'type') {
    if (normalized === 'ea') colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
    else if (normalized === 'ebook') colorClasses = 'bg-blue-950/80 text-blue-300 border-blue-800/80';
    else if (normalized === 'service') colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-800/80';
  } else {
    // Status
    if (normalized === 'active' || normalized === 'paid' || normalized === 'completed') {
      colorClasses = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/70';
    } else if (normalized === 'pending' || normalized === 'review' || normalized === 'in development') {
      colorClasses = 'bg-amber-950/70 text-amber-300 border-amber-800/70';
    } else if (normalized === 'draft') {
      colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
    } else if (normalized === 'refunded' || normalized === 'failed' || normalized === 'revoked' || normalized === 'cancelled') {
      colorClasses = 'bg-rose-950/70 text-rose-300 border-rose-800/70';
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase ${sizeClasses} ${colorClasses} whitespace-nowrap`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {normalized}
    </span>
  );
}
