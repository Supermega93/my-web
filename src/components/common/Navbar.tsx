import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveView, Lesson, Product } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from './Button.tsx';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  ArrowRight,
  Sparkles,
  Search,
  Command
} from 'lucide-react';
import { MegAiLogoIcon } from './MegAiLogo.tsx';
import { CurrencySelector } from './CurrencySelector.tsx';
import { GlobalSearchModal } from './GlobalSearchModal.tsx';

interface NavbarProps {
  currentView?: ActiveView;
  activeView?: ActiveView;
  onNavigate: (view: ActiveView, productId?: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onTriggerBuildMyEa: () => void;
  products?: Product[];
  lessons?: Lesson[];
}

export function Navbar({
  currentView,
  activeView,
  onNavigate,
  onOpenAuth,
  onTriggerBuildMyEa,
  products,
  lessons,
}: NavbarProps) {
  const current = currentView || activeView || 'home';
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut: Cmd+K or Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: Array<{ label: string; view: ActiveView; badge?: string; productId?: string }> = [
    { label: 'Home', view: 'home' },
    { label: 'Academy', view: 'academy', badge: 'Free' },
    { label: 'Books', view: 'ebooks' },
    { label: 'Free Tools', view: 'prompt-architect' },
    { label: 'Custom EA', view: 'custom-ea' },
    { label: 'Liquidity Pro EA', view: 'ea-detail', productId: 'prod_ea_adaptive_liquidity' },
    { label: 'About', view: 'about' },
  ];

  const handleNavClick = (item: { label: string; view: ActiveView; productId?: string }) => {
    onNavigate(item.view, item.productId);
    setMobileMenuOpen(false);
  };

  const isItemActive = (item: { label: string; view: ActiveView; productId?: string }) => {
    if (item.view === 'home' && current === 'home') return true;
    if (item.view === 'ea-detail' && (current === 'ea-detail' || current === 'eas')) return true;
    if (item.view === 'eas' && (current === 'eas' || current === 'ea-detail')) return true;
    if (item.view === 'academy' && (current === 'academy' || current === 'level-hub' || current === 'lesson-detail' || current === 'academy-pricing')) return true;
    if (item.view === 'ebooks' && (current === 'ebooks' || current === 'ebook-detail' || current === 'free-ebook' || current === 'ai-prompt-handbook')) return true;
    if (item.view === 'prompt-architect' && current === 'prompt-architect') return true;
    if (item.view === 'custom-ea' && (current === 'custom-ea' || current === 'strategy-builder-coming-soon')) return true;
    if (item.view === 'about' && (current === 'about' || current === 'how-it-works')) return true;
    return current === item.view;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'pt-2 sm:pt-2.5' : 'pt-3.5 sm:pt-4'
      }`}>
        <div className={`pointer-events-auto mx-auto max-w-6xl rounded-full transition-all duration-300 flex items-center justify-between border ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-4 sm:px-6 py-2'
            : 'bg-white/75 backdrop-blur-lg border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-4 sm:px-6 py-2 sm:py-2.5'
        }`}>
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick({ label: 'Home', view: 'home' })}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-b from-slate-900 via-[#0A101D] to-slate-950 border border-slate-700/70 text-white flex items-center justify-center shadow-sm group-hover:border-slate-500 group-hover:scale-102 transition-all">
              <MegAiLogoIcon size={24} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors font-sans leading-none">
                  MEG<span className="text-cyan-500 font-black">.</span>AI
                </span>
                <span className="font-extrabold text-xs tracking-wider ml-1 text-slate-500 uppercase">
                  LABS
                </span>
              </div>
              <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase mt-0.5 font-medium leading-none">
                AI Trading Technology
              </span>
            </div>
          </div>

          {/* Center Navigation Menu Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold leading-none ${
                      active ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions (CTA + Account + Currency Selector + Global Search) */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Quick Global Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-all cursor-pointer text-xs select-none shadow-2xs active:scale-[0.98]"
              title="Search EAs, lessons, docs, and prompts (Ctrl/Cmd + K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              <span className="hidden xl:inline text-xs font-medium text-slate-600 group-hover:text-slate-900">
                Search...
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-400 group-hover:text-slate-600 shadow-2xs">
                <Command className="w-2.5 h-2.5 inline" />K
              </span>
            </button>

            <CurrencySelector />

            {/* Login or Account Portal */}
            {!user ? (
              <button
                onClick={() => onNavigate('login')}
                className="text-xs font-medium text-slate-700 hover:text-slate-950 px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('portal')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    current === 'portal'
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Portal</span>
                  {isAdmin && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 uppercase font-bold">
                      Admin
                    </span>
                  )}
                </button>

                <button
                  onClick={() => logout()}
                  className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Apple-Inspired Understated CTA Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('academy')}
              className="font-medium px-4 py-1.5 text-xs shadow-xs hover:shadow-md"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full bg-slate-100/80 border border-slate-200/80 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <CurrencySelector variant="compact" />

            <button
              onClick={() => onNavigate('academy')}
              className="px-3 py-1.5 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center gap-1 shadow-xs active:scale-[0.98]"
            >
              <span>Start</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-slate-100/80 border border-slate-200/80 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto mt-2 max-w-6xl mx-auto rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl p-4 space-y-3 text-slate-800"
            >
              {/* Mobile Search Bar inside dropdown */}
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-slate-500 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Search EAs, lessons, docs...</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-400 border border-slate-200">
                  Ctrl+K
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item)}
                      className={`text-left px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        active 
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          active ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {!user ? (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                    icon={<UserIcon className="w-4 h-4 text-slate-600" />}
                  >
                    Login / Account
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-xs font-mono text-slate-600 flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="truncate max-w-[200px]">{user.email}</span>
                      <span className="text-emerald-700 font-bold uppercase">
                        {isAdmin ? '[Admin]' : '[Portal]'}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => { onNavigate('portal'); setMobileMenuOpen(false); }}
                      icon={<UserIcon className="w-4 h-4" />}
                    >
                      My Portal
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      size="sm"
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      icon={<LogOut className="w-4 h-4" />}
                    >
                      Logout
                    </Button>
                  </div>
                )}

                {/* Currency Selector for Mobile */}
                <div className="pt-1 flex items-center justify-between bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500">Currency:</span>
                  <CurrencySelector />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
        products={products}
        lessons={lessons}
      />
    </header>
  );
}

export default Navbar;

