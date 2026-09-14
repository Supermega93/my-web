import React from 'react';
import { LucideIcon } from 'lucide-react';

export type PillVariant = 
  | 'emerald' 
  | 'green' 
  | 'blue' 
  | 'sky' 
  | 'purple' 
  | 'indigo' 
  | 'violet' 
  | 'orange' 
  | 'amber' 
  | 'red' 
  | 'rose' 
  | 'slate' 
  | 'charcoal' 
  | 'teal' 
  | 'cyan'
  | 'magenta'
  | 'dark';

interface PillIconBadgeProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  label: string;
  variant?: PillVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  id?: string;
}

const variantStyles: Record<PillVariant, { pill: string; iconColor: string }> = {
  green: { pill: 'bg-[#70b82c] text-white', iconColor: 'text-[#70b82c]' },
  emerald: { pill: 'bg-[#10b981] text-white', iconColor: 'text-[#10b981]' },
  blue: { pill: 'bg-[#0284c7] text-white', iconColor: 'text-[#0284c7]' },
  sky: { pill: 'bg-[#0ea5e9] text-white', iconColor: 'text-[#0ea5e9]' },
  purple: { pill: 'bg-[#8b5cf6] text-white', iconColor: 'text-[#8b5cf6]' },
  indigo: { pill: 'bg-[#6366f1] text-white', iconColor: 'text-[#6366f1]' },
  violet: { pill: 'bg-[#7c3aed] text-white', iconColor: 'text-[#7c3aed]' },
  orange: { pill: 'bg-[#f97316] text-white', iconColor: 'text-[#f97316]' },
  amber: { pill: 'bg-[#f59e0b] text-white', iconColor: 'text-[#f59e0b]' },
  red: { pill: 'bg-[#e11d48] text-white', iconColor: 'text-[#e11d48]' },
  rose: { pill: 'bg-[#f43f5e] text-white', iconColor: 'text-[#f43f5e]' },
  magenta: { pill: 'bg-[#c026d3] text-white', iconColor: 'text-[#c026d3]' },
  slate: { pill: 'bg-[#334155] text-white', iconColor: 'text-[#334155]' },
  charcoal: { pill: 'bg-[#1e293b] text-white', iconColor: 'text-[#1e293b]' },
  teal: { pill: 'bg-[#0d9488] text-white', iconColor: 'text-[#0d9488]' },
  cyan: { pill: 'bg-[#06b6d4] text-white', iconColor: 'text-[#06b6d4]' },
  dark: { pill: 'bg-[#0f172a] text-white border border-slate-700/60', iconColor: 'text-[#0f172a]' }
};

const sizeStyles = {
  sm: {
    container: 'pl-1 pr-3 py-0.5 text-[11px]',
    iconCircle: 'w-5 h-5',
    iconSize: 'w-3 h-3',
  },
  md: {
    container: 'pl-1 pr-3.5 py-1 text-xs',
    iconCircle: 'w-6 h-6',
    iconSize: 'w-3.5 h-3.5',
  },
  lg: {
    container: 'pl-1.5 pr-4 py-1.5 text-sm',
    iconCircle: 'w-7 h-7 sm:w-8 sm:h-8',
    iconSize: 'w-4 h-4',
  },
};

/**
 * High-Contrast Rounded Pill Icon Badge / Button matching the attached design spec:
 * Features a solid white circular disc on the left enclosing the icon in the pill's theme color,
 * paired with bold uppercase tracking typography on the colored pill body.
 */
export const PillIconBadge: React.FC<PillIconBadgeProps> = ({
  icon: Icon,
  label,
  variant = 'emerald',
  size = 'md',
  className = '',
  onClick,
  id,
}) => {
  const { pill, iconColor } = variantStyles[variant] || variantStyles.emerald;
  const { container, iconCircle, iconSize } = sizeStyles[size];

  return (
    <span
      id={id}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full font-bold uppercase tracking-wider shadow-sm transition-all select-none ${pill} ${container} ${
        onClick ? 'cursor-pointer hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${className}`}
    >
      <span
        className={`${iconCircle} rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs ${iconColor}`}
      >
        <Icon className={iconSize} />
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
};
