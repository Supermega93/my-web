import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  iconPosition = 'right',
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm',
    lg: 'px-8 sm:px-9 py-4 text-sm sm:text-base',
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-white text-zinc-950 font-bold tracking-tight shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${sizeClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

export default PrimaryButton;
