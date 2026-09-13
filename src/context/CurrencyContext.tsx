import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // multiplier from USD
  symbolPosition: 'before' | 'after';
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.0, symbolPosition: 'before', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92, symbolPosition: 'before', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.79, symbolPosition: 'before', decimals: 2 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', rate: 18.25, symbolPosition: 'before', decimals: 0 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.36, symbolPosition: 'before', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.52, symbolPosition: 'before', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 154.5, symbolPosition: 'before', decimals: 0 },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', rate: 1580.0, symbolPosition: 'before', decimals: 0 },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', rate: 130.0, symbolPosition: 'before', decimals: 0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 83.5, symbolPosition: 'before', decimals: 0 },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.67, symbolPosition: 'before', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.35, symbolPosition: 'before', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc', flag: '🇨🇭', rate: 0.90, symbolPosition: 'before', decimals: 2 },
};

function detectUserCurrency(): string {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = (navigator.language || '').toLowerCase();

    // South Africa
    if (timeZone.includes('Johannesburg') || lang.endsWith('-za')) return 'ZAR';

    // United Kingdom
    if (timeZone.includes('London') || lang.endsWith('-gb') || lang === 'en-gb') return 'GBP';

    // Eurozone
    const euroZones = ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Brussels', 'Vienna', 'Dublin', 'Athens', 'Lisbon', 'Helsinki'];
    if (euroZones.some(city => timeZone.includes(city))) return 'EUR';

    // Canada
    if (timeZone.includes('Toronto') || timeZone.includes('Vancouver') || timeZone.includes('Montreal') || lang.endsWith('-ca')) return 'CAD';

    // Australia
    if (timeZone.includes('Sydney') || timeZone.includes('Melbourne') || timeZone.includes('Brisbane') || timeZone.includes('Perth') || lang.endsWith('-au')) return 'AUD';

    // Japan
    if (timeZone.includes('Tokyo') || lang.startsWith('ja')) return 'JPY';

    // Nigeria
    if (timeZone.includes('Lagos') || lang.endsWith('-ng')) return 'NGN';

    // Kenya
    if (timeZone.includes('Nairobi') || lang.endsWith('-ke')) return 'KES';

    // India
    if (timeZone.includes('Kolkata') || timeZone.includes('Calcutta') || lang.endsWith('-in')) return 'INR';

    // UAE
    if (timeZone.includes('Dubai')) return 'AED';

    // Singapore
    if (timeZone.includes('Singapore') || lang.endsWith('-sg')) return 'SGD';

    // Switzerland
    if (timeZone.includes('Zurich') || lang.endsWith('-ch')) return 'CHF';

    return 'USD';
  } catch {
    return 'USD';
  }
}

interface CurrencyContextType {
  currentCurrency: CurrencyConfig;
  setCurrency: (currencyCode: string) => void;
  formatPrice: (usdAmount?: number, customCurrencyCode?: string) => string;
  formatPriceWithUsd: (usdAmount?: number) => string;
  convertAmount: (usdAmount: number, targetCurrencyCode?: string) => number;
  isAutoDetected: boolean;
  resetToAutoDetect: () => void;
  supportedCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState<string>('USD');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem('mega_preferred_currency');
    if (saved && SUPPORTED_CURRENCIES[saved]) {
      setSelectedCode(saved);
      setIsAutoDetected(false);
    } else {
      const detected = detectUserCurrency();
      if (SUPPORTED_CURRENCIES[detected]) {
        setSelectedCode(detected);
        setIsAutoDetected(true);
      }
    }
  }, []);

  const setCurrency = (currencyCode: string) => {
    if (SUPPORTED_CURRENCIES[currencyCode]) {
      setSelectedCode(currencyCode);
      setIsAutoDetected(false);
      localStorage.setItem('mega_preferred_currency', currencyCode);
    }
  };

  const resetToAutoDetect = () => {
    localStorage.removeItem('mega_preferred_currency');
    const detected = detectUserCurrency();
    setSelectedCode(detected);
    setIsAutoDetected(true);
  };

  const currentCurrency = SUPPORTED_CURRENCIES[selectedCode] || SUPPORTED_CURRENCIES.USD;

  const convertAmount = (usdAmount: number, targetCurrencyCode?: string): number => {
    const target = targetCurrencyCode 
      ? (SUPPORTED_CURRENCIES[targetCurrencyCode] || currentCurrency) 
      : currentCurrency;
    return usdAmount * target.rate;
  };

  const formatPrice = (usdAmount?: number, customCurrencyCode?: string): string => {
    if (usdAmount === undefined || usdAmount === null) return '$0.00';
    
    const target = customCurrencyCode 
      ? (SUPPORTED_CURRENCIES[customCurrencyCode] || currentCurrency) 
      : currentCurrency;

    const converted = usdAmount * target.rate;
    const formattedNumber = converted.toLocaleString(undefined, {
      minimumFractionDigits: target.decimals,
      maximumFractionDigits: target.decimals,
    });

    if (target.symbolPosition === 'after') {
      return `${formattedNumber} ${target.symbol.trim()}`;
    }
    return `${target.symbol}${formattedNumber}`;
  };

  const formatPriceWithUsd = (usdAmount?: number): string => {
    if (usdAmount === undefined || usdAmount === null) return '$0.00 USD';
    if (currentCurrency.code === 'USD') {
      return `$${usdAmount.toFixed(2)} USD`;
    }
    const localStr = formatPrice(usdAmount);
    return `${localStr} ${currentCurrency.code} (~$${usdAmount.toFixed(2)} USD)`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        formatPrice,
        formatPriceWithUsd,
        convertAmount,
        isAutoDetected,
        resetToAutoDetect,
        supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
