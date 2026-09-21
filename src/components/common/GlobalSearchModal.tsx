import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Terminal, 
  GraduationCap, 
  FileText, 
  Wrench, 
  ArrowRight, 
  Sparkles, 
  CornerDownLeft, 
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { ActiveView, Lesson, Product } from '../../types.ts';
import { 
  performGlobalSearch, 
  SearchResultItem, 
  SearchCategory,
  DOCUMENTATION_TOPICS 
} from '../../services/globalSearch.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ActiveView, extraId?: string) => void;
  products?: Product[];
  lessons?: Lesson[];
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onNavigate,
  products,
  lessons,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input on open & lock background scroll
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCategory('all');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle results search query
  const results = useMemo(() => {
    return performGlobalSearch(query, category, products, lessons);
  }, [query, category, products, lessons]);

  // Keep selected index in bounds when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length, category]);

  // Keyboard navigation within the modal: Arrow Up, Arrow Down, Enter, Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        if (results.length > 0 && results[selectedIndex]) {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelectResult = (item: SearchResultItem) => {
    onNavigate(item.view, item.extraId);
    onClose();
  };

  if (!isOpen) return null;

  const categoryTabs: Array<{ key: SearchCategory; label: string; icon: React.ReactNode }> = [
    { key: 'all', label: 'All', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'ea', label: 'Trading EAs', icon: <Terminal className="w-3.5 h-3.5" /> },
    { key: 'lesson', label: 'Lessons', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { key: 'doc', label: 'Docs & Guides', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'tool', label: 'Tools & Books', icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

  const popularSearches = [
    { label: 'Adaptive Liquidity Pro', category: 'ea' as SearchCategory },
    { label: '4 Lego Blocks', category: 'doc' as SearchCategory },
    { label: '5-Ingredient Prompt', category: 'lesson' as SearchCategory },
    { label: 'Prop Firm Risk Shield', category: 'doc' as SearchCategory },
    { label: 'Dynamic Lot Sizing', category: 'lesson' as SearchCategory },
    { label: 'AI Strategy Prompt Architect', category: 'tool' as SearchCategory },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 sm:pt-16 md:pt-20">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Search Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] z-10"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 bg-white gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
            <Search className="w-4 h-4 text-slate-600" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search EAs, lessons, prompt guides, risk rules, or docs..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-mono transition-colors shrink-0 flex items-center gap-1"
            title="Close (Esc)"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 px-4 sm:px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCategory(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                category === tab.key
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Results / Default State Area */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 min-h-[220px]"
        >
          {query.trim() === '' ? (
            <div className="py-4 px-2 sm:px-3 space-y-6">
              {/* Popular Suggested Searches */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Popular Topics & Resources</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setQuery(item.label);
                        setCategory(item.category);
                      }}
                      className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-xs font-medium text-slate-700 hover:text-emerald-900 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <Search className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Jump Suggestions */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  <span>Quick Architecture Documentation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCUMENTATION_TOPICS.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onNavigate(doc.targetView, doc.targetExtraId);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-white border border-slate-200/70 hover:border-emerald-300 hover:bg-slate-50/70 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        <span className="truncate">{doc.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {doc.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No results found for "{query}"</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader terms like "breakout", "prompt", "risk", "lot size", or "MQL5".
              </p>
              <button
                onClick={() => setCategory('all')}
                className="mt-2 text-xs font-semibold text-emerald-600 hover:underline"
              >
                Reset category filters
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="px-2 py-1 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>{results.length} results found</span>
                <span>Use ↑ ↓ keys to navigate</span>
              </div>

              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isEa = item.category === 'ea';
                const isLesson = item.category === 'lesson';
                const isDoc = item.category === 'doc';
                const isTool = item.category === 'tool';

                return (
                  <div
                    key={item.id}
                    data-index={index}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.005]'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Category Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                          isSelected
                            ? 'bg-slate-800 border-slate-700 text-emerald-400'
                            : isEa
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : isLesson
                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                            : isDoc
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-cyan-50 border-cyan-200 text-cyan-700'
                        }`}
                      >
                        {isEa && <Terminal className="w-4 h-4" />}
                        {isLesson && <GraduationCap className="w-4 h-4" />}
                        {isDoc && <FileText className="w-4 h-4" />}
                        {isTool && <Wrench className="w-4 h-4" />}
                      </div>

                      {/* Info & Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4
                            className={`text-xs sm:text-sm font-bold truncate ${
                              isSelected ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {item.title}
                          </h4>

                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full font-bold ${
                                isSelected
                                  ? 'bg-emerald-400 text-slate-950'
                                  : item.badgeColor === 'emerald'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.badgeColor === 'purple'
                                  ? 'bg-purple-100 text-purple-800'
                                  : item.badgeColor === 'amber'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-cyan-100 text-cyan-800'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs line-clamp-2 leading-relaxed ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* Subtitle / Tags */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px]">
                          <span
                            className={`font-mono font-medium ${
                              isSelected ? 'text-slate-400' : 'text-slate-400'
                            }`}
                          >
                            {item.subtitle}
                          </span>
                          {item.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`px-1.5 py-0.2 rounded-md ${
                                isSelected
                                  ? 'bg-slate-800 text-slate-300'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Hint / Arrow */}
                    <div className="shrink-0 self-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-400 text-slate-950 scale-110'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info & keyboard shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs font-bold text-[10px]">
                ↑
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs font-bold text-[10px]">
                ↓
              </span>
              <span className="hidden sm:inline">Navigate</span>
            </span>

            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs font-bold text-[10px]">
                ↵
              </span>
              <span className="hidden sm:inline">Select</span>
            </span>

            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs font-bold text-[10px]">
                ESC
              </span>
              <span className="hidden sm:inline">Close</span>
            </span>
          </div>

          <div className="text-right text-[10px] text-slate-400">
            <span>Instant Universal Index</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
