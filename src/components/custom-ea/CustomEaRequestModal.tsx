import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Sparkles } from 'lucide-react';
import { StrategyIntakeWorkflow } from '../strategy/StrategyIntakeWorkflow.tsx';
import { StructuredStrategyData } from '../../lib/strategyEngine.ts';

export interface CustomEaInitialData {
  projectName?: string;
  platform?: 'MT5' | 'MT4' | 'cTrader';
  instruments?: string;
  timeframe?: string;
  entryRules?: string;
  exitRules?: string;
  stopLoss?: string;
  takeProfit?: string;
  riskManagement?: string;
  tradeManagement?: string;
  otherRequirements?: string;
  strategyDescription?: string;
  structuredData?: StructuredStrategyData;
  promptText?: string;
}

interface CustomEaRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: string;
  onSuccess?: () => void;
  initialData?: CustomEaInitialData | null;
}

export function CustomEaRequestModal({
  isOpen,
  onClose,
  initialPackage = 'Standard',
  onSuccess,
  initialData,
}: CustomEaRequestModalProps) {
  if (!isOpen) return null;

  // Prepare initial structured values from initialData if passed
  const prefilledStructured: Partial<StructuredStrategyData> = initialData?.structuredData || {
    instrument: initialData?.instruments,
    timeframe: initialData?.timeframe,
    entryRules: initialData?.entryRules,
    exitRules: initialData?.exitRules,
    stopLoss: initialData?.stopLoss,
    takeProfit: initialData?.takeProfit,
  };

  const initialDescription = initialData?.strategyDescription || initialData?.entryRules || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-[#FAFBFD] border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Build My EA — Custom Strategy Intake
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200 font-bold">
                  {initialPackage} Tier
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Institutional MQL5 / MQL4 Quantitative Engineering
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Unified Strategy Intake Workflow in custom-ea mode */}
        <div className="p-4 sm:p-8 max-h-[82vh] overflow-y-auto">
          <StrategyIntakeWorkflow
            mode="custom-ea"
            initialPackage={initialPackage}
            initialDescription={initialDescription}
            initialStructuredData={prefilledStructured}
            onCustomEaSubmitted={(id) => {
              if (onSuccess) onSuccess();
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default CustomEaRequestModal;
