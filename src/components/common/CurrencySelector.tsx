import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'compact' | 'full' | 'subtle' | 'dark';
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { currentCurrency, setCurrency, supportedCurrencies, isAutoDetected, resetToAutoDetect } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Mobile-optimized native picker overlay for instant, rock-solid touch UX */}
      <select
        value={currentCurrency.code}
        onChange={(e) => setCurrency(e.target.value)}
        className="sm:hidden absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
        aria-label="Select Currency"
      >
        {supportedCurrencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code} ({c.symbol}) - {c.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer border ${
          variant === 'dark'
            ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200 shadow-xs hover:border-slate-600'
            : variant === 'subtle'
            ? 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-300/60 text-slate-700'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs hover:border-slate-300'
        }`}
        title={`Current Currency: ${currentCurrency.name} (${currentCurrency.code})${isAutoDetected ? ' - Auto-detected from region' : ''}`}
      >
        <span className="text-sm leading-none select-none">{currentCurrency.flag}</span>
        <span className="font-mono font-bold text-xs">{currentCurrency.code}</span>
        <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">({currentCurrency.symbol})</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom dropdown for desktop and tablets */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl shadow-xl z-50 overflow-hidden border animate-in fade-in-50 zoom-in-95 duration-150 ${
            variant === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div
            className={`p-3 border-b ${
              variant === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-mono uppercase tracking-wider font-bold flex items-center gap-1 ${
                  variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <Globe className="w-3 h-3 text-emerald-500" />
                Select Currency
              </span>
              {isAutoDetected ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  Auto-detected
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    resetToAutoDetect();
                    setIsOpen(false);
                  }}
                  className="text-[10px] text-emerald-500 hover:text-emerald-400 underline cursor-pointer"
                >
                  Auto-detect
                </button>
              )}
            </div>
            <p className={`text-[10px] mt-0.5 ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Prices convert automatically. Base catalog prices stay USD.
            </p>
          </div>

          <div
            className={`max-h-64 overflow-y-auto py-1 divide-y ${
              variant === 'dark' ? 'divide-slate-800/60' : 'divide-slate-50'
            }`}
          >
            {supportedCurrencies.map((c) => {
              const isSelected = c.code === currentCurrency.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? variant === 'dark'
                        ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                        : 'bg-emerald-50/80 text-emerald-900 font-bold'
                      : variant === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800/70'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none">{c.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold leading-tight">{c.name}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          variant === 'dark' ? 'text-slate-400' : 'text-slate-400'
                        }`}
                      >
                        {c.code} • {c.symbol}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
