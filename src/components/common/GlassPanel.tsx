import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'purple' | 'default' | 'elevated' | 'subtle';
  rounded?: '2xl' | '3xl' | '4xl' | 'full';
  className?: string;
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  variant = 'purple',
  rounded = '3xl',
  className = '',
  glow = false,
  ...props
}) => {
  const roundedClasses = {
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    '4xl': 'rounded-[2.5rem]',
    'full': 'rounded-full',
  }[rounded];

  const variantClasses = {
    purple: 'bg-[#120824]/70 border border-purple-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl',
    default: 'bg-[#0f0a1c]/80 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl',
    elevated: 'bg-gradient-to-b from-[#180c32]/85 to-[#0e061f]/90 border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(168,85,247,0.12)] backdrop-blur-2xl',
    subtle: 'bg-white/[0.04] border border-white/10 shadow-sm backdrop-blur-md',
  }[variant];

  const glowClass = glow ? 'shadow-[0_0_40px_rgba(168,85,247,0.2)]' : '';

  return (
    <div
      className={`${roundedClasses} ${variantClasses} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
