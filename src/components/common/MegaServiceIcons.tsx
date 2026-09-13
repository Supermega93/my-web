import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  Terminal, 
  Code2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Bot, 
  FileText,
  Activity,
  Sliders,
  DollarSign,
  TrendingUp,
  Lock,
  Copy
} from 'lucide-react';

interface MegaIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emerald' | 'cyan' | 'slate' | 'gold' | 'purple';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 p-1.5',
  md: 'w-10 h-10 p-2',
  lg: 'w-12 h-12 p-2.5',
  xl: 'w-14 h-14 p-3',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
};

const variantClasses = {
  emerald: {
    container: 'bg-gradient-to-b from-emerald-900/90 to-slate-950 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    glow: 'bg-emerald-500/10',
    ring: 'border-emerald-400/30',
  },
  cyan: {
    container: 'bg-gradient-to-b from-cyan-950/90 to-slate-950 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    glow: 'bg-cyan-500/10',
    ring: 'border-cyan-400/30',
  },
  slate: {
    container: 'bg-gradient-to-b from-slate-800 to-slate-950 border-slate-700 text-slate-200 shadow-md',
    glow: 'bg-slate-500/10',
    ring: 'border-slate-600/30',
  },
  gold: {
    container: 'bg-gradient-to-b from-amber-950/90 to-slate-950 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    glow: 'bg-amber-500/10',
    ring: 'border-amber-400/30',
  },
  purple: {
    container: 'bg-gradient-to-b from-purple-950/90 to-slate-950 border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    glow: 'bg-purple-500/10',
    ring: 'border-purple-400/30',
  },
};

export const MegaBadgeWrapper: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emerald' | 'cyan' | 'slate' | 'gold' | 'purple';
  className?: string;
}> = ({ children, size = 'md', variant = 'emerald', className = '' }) => {
  const v = variantClasses[variant];
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer ambient glow */}
      <div className={`absolute -inset-1 rounded-2xl ${v.glow} blur-sm pointer-events-none`} />
      
      {/* Main beveled badge */}
      <div className={`relative rounded-2xl border flex items-center justify-center ${sizeClasses[size]} ${v.container}`}>
        {/* Specular highlight rim */}
        <div className={`absolute inset-0 rounded-2xl border ${v.ring} pointer-events-none`} />
        {children}
      </div>
    </div>
  );
};

// 1. Academy Service Icon
export const MegaAcademyIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'emerald', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <GraduationCap size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);

// 2. Books & Literature Icon
export const MegaBooksIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'cyan', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <BookOpen size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);

// 3. Flagship EA / Algo Engine Icon
export const MegaAlgoIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'gold', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <Cpu size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);

// 4. Free AI Strategy Prompt Architect Icon
export const MegaPromptIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'emerald', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <Terminal size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);

// 5. Custom EA Development Service Icon
export const MegaCustomDevIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'cyan', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <Code2 size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);

// 6. Quantitative Strategy Engine Icon
export const MegaQuantEngineIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'emerald', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <Activity size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);

// 7. Locked Benefit Icon
export const MegaLockIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'gold', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <Lock size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);

// 8. Copy Complete Prompt CTA Icon
export const MegaCopyIcon: React.FC<MegaIconProps> = ({ size = 'md', variant = 'emerald', className = '' }) => (
  <MegaBadgeWrapper size={size} variant={variant} className={className}>
    <Copy size={iconSizes[size]} className="drop-shadow" />
  </MegaBadgeWrapper>
);
