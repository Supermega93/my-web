import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveView } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from './Button.tsx';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MegAiLogoIcon } from './MegAiLogo.tsx';

interface NavbarProps {
  currentView?: ActiveView;
  activeView?: ActiveView;
  onNavigate: (view: ActiveView, productId?: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onTriggerBuildMyEa: () => void;
}

export function Navbar({
  currentView,
  activeView,
  onNavigate,
  onOpenAuth,
  onTriggerBuildMyEa,
}: NavbarProps) {
  const current = currentView || activeView || 'home';
  const { user, logout, quickLogin, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: Array<{ label: string; view: ActiveView; badge?: string }> = [
    { label: 'Home', view: 'home' },
    { label: 'FREE ACADEMY', view: 'academy', badge: 'FREE' },
    { label: 'BOOKS', view: 'ebooks' },
    { label: 'FREE TOOLS', view: 'prompt-architect' },
    { label: 'CUSTOM EA', view: 'custom-ea' },
    { label: 'ABOUT', view: 'about' },
  ];

  const handleNavClick = (view: ActiveView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const isItemActive = (item: { label: string; view: ActiveView }) => {
    if (item.view === 'home' && current === 'home') return true;
    if (item.view === 'academy' && (current === 'academy' || current === 'level-hub' || current === 'lesson-detail')) return true;
    if (item.view === 'ebooks' && (current === 'ebooks' || current === 'ebook-detail' || current === 'free-ebook' || current === 'ai-prompt-handbook')) return true;
    if (item.view === 'prompt-architect' && current === 'prompt-architect') return true;
    if (item.view === 'custom-ea' && (current === 'custom-ea' || current === 'strategy-builder-coming-soon')) return true;
    if (item.view === 'about' && (current === 'about' || current === 'how-it-works')) return true;
    return current === item.view;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'pt-2.5 sm:pt-3' : 'pt-4 sm:pt-5'
      }`}>
        <div className={`pointer-events-auto mx-auto max-w-6xl rounded-full transition-all duration-300 flex items-center justify-between border ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-slate-200/90 shadow-[0_14px_35px_-10px_rgba(6,78,59,0.12),0_4px_10px_rgba(0,0,0,0.04)] px-4 sm:px-6 py-2'
            : 'bg-white/90 backdrop-blur-lg border-slate-200/75 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.03)] px-4 sm:px-6 py-2.5 sm:py-3'
        }`}>
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-slate-900 via-[#0A101D] to-slate-950 border border-slate-700/70 text-white flex items-center justify-center shadow-md shadow-slate-950/20 group-hover:border-cyan-500/60 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-all">
              <MegAiLogoIcon size={26} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors font-sans leading-none">
                  MEG<span className="text-cyan-500 font-black">.</span>AI
                </span>
                <span className="font-black text-xs sm:text-sm tracking-wider ml-1 text-slate-500 uppercase">
                  LABS
                </span>
                <span className="text-[9px] font-bold text-cyan-600 ml-0.5 align-super font-mono leading-none">
                  ™
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-slate-500 uppercase mt-0.5 font-semibold leading-none">
                AI Trading Technology
              </span>
            </div>
          </div>

          {/* Center Navigation Menu Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold tracking-tight transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold leading-none">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="activePillGlow"
                      className="absolute inset-0 rounded-full border border-emerald-300/60 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions (CTA + Account + Role Tester) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Role Tester Pill for testing without disrupting preview */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full text-[10px] font-mono">
              <span className="text-slate-400 mr-0.5">Role:</span>
              <button
                onClick={() => quickLogin('customer')}
                className={`px-1.5 py-0.5 rounded-full transition-colors ${
                  user?.role === 'customer'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to customer demo role"
              >
                Cust
              </button>
              <button
                onClick={() => quickLogin('developer')}
                className={`px-1.5 py-0.5 rounded-full transition-colors ${
                  user?.role === 'developer'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to developer demo role"
              >
                Dev
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className={`px-1.5 py-0.5 rounded-full transition-colors ${
                  user?.role === 'admin'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to admin demo role"
              >
                Admin
              </button>
            </div>

            {/* Login or Account Portal */}
            {!user ? (
              <button
                onClick={() => onNavigate('login')}
                className="text-xs font-semibold text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('portal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    current === 'portal'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                      : 'bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Portal</span>
                  {isAdmin && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 uppercase font-bold">
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

            {/* Premium Deep Emerald CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('academy')}
              className="relative group overflow-hidden rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 shadow-[0_4px_16px_rgba(5,150,105,0.28)] hover:shadow-[0_6px_22px_rgba(5,150,105,0.4)] transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-600/30"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('academy')}
              className="px-3 py-1.5 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
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
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto mt-2 max-w-6xl mx-auto rounded-3xl bg-white/98 backdrop-blur-2xl border border-slate-200/90 shadow-2xl p-5 space-y-4 text-slate-800"
            >
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.view)}
                      className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                        active 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                {!user ? (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                    icon={<UserIcon className="w-4 h-4 text-emerald-700" />}
                  >
                    Login / Account
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-xs font-mono text-slate-600 flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200">
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

                {/* Role Switcher in Mobile */}
                <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span>Role Switcher:</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => quickLogin('customer')} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700">Cust</button>
                    <button onClick={() => quickLogin('developer')} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700">Dev</button>
                    <button onClick={() => quickLogin('admin')} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700">Admin</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;

