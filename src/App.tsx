import { useState, useEffect } from 'react';
import { ActiveView, Product } from './types.ts';
import { api } from './services/api.ts';
import { useAuth, AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { HomePage } from './components/home/HomePage.tsx';
import { TradingEasPage } from './components/products/TradingEasPage.tsx';
import { EaProductDetail } from './components/products/EaProductDetail.tsx';
import { EbooksPage } from './components/products/EbooksPage.tsx';
import { EbookProductDetail } from './components/products/EbookProductDetail.tsx';
import { AiPromptHandbookPage } from './components/ebooks/AiPromptHandbookPage.tsx';
import { FreeEbookPage } from './components/ebooks/FreeEbookPage.tsx';
import { CustomEaPage } from './components/custom-ea/CustomEaPage.tsx';
import { CoachingPage } from './components/coaching/CoachingPage.tsx';
import { AboutPage } from './components/about/AboutPage.tsx';
import { CustomEaRequestModal } from './components/custom-ea/CustomEaRequestModal.tsx';
import { StrategyBuilderComingSoon } from './components/custom-ea/StrategyBuilderComingSoon.tsx';
import { HowItWorksPage } from './components/how-it-works/HowItWorksPage.tsx';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { DeveloperDashboard } from './components/developer/DeveloperDashboard.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { LoginPage } from './components/auth/LoginPage.tsx';
import { PortalPage } from './components/portal/PortalPage.tsx';
import { PurchaseModal } from './components/checkout/PurchaseModal.tsx';
import { AcademyHomePage } from './components/academy/AcademyHomePage.tsx';
import { LessonViewerPage } from './components/academy/LessonViewerPage.tsx';
import { PromptArchitectPage } from './components/academy/PromptArchitectPage.tsx';
import { LevelHubPage } from './components/academy/LevelHubPage.tsx';
import { MegaAiChat } from './components/common/MegaAiChat.tsx';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>('prod_ea_adaptive_liquidity');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('lesson-1-1');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('1');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseProduct, setPurchaseProduct] = useState<Product | null>(null);
  const [isCustomEaModalOpen, setIsCustomEaModalOpen] = useState(false);
  const [customEaPrefill, setCustomEaPrefill] = useState<any>(null);

  // Fetch products from database
  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Check pathname on mount
    const path = window.location.pathname;
    if (path === '/prompt-architect' || path === '/free-tools') {
      setCurrentView('prompt-architect');
    } else if (path.startsWith('/lessons/')) {
      const id = path.replace('/lessons/', '').trim();
      setSelectedLessonId(id || 'lesson-1-1');
      setCurrentView('lesson-detail');
    } else if (path.startsWith('/levels/')) {
      const id = path.replace('/levels/', '').trim();
      setSelectedLevelId(id || '1');
      setCurrentView('level-hub');
    } else if (path === '/levels') {
      setSelectedLevelId('1');
      setCurrentView('level-hub');
    } else if (path === '/academy') {
      setCurrentView('academy');
    } else if (path === '/ebooks/ai-prompt-engineering-handbook') {
      setCurrentView('ai-prompt-handbook');
      setSelectedProductId('prod_ebook_ai_prompt');
    } else if (path === '/free-guide') {
      setCurrentView('free-ebook');
    } else if (path === '/trading-eas') {
      setCurrentView('eas');
    } else if (path === '/ebooks') {
      setCurrentView('ebooks');
    } else if (path === '/custom-ea') {
      setCurrentView('custom-ea');
    } else if (path === '/coaching') {
      setCurrentView('coaching');
    } else if (path === '/about') {
      setCurrentView('about');
    } else if (path === '/how-it-works') {
      setCurrentView('how-it-works');
    } else if (path === '/dashboard') {
      setCurrentView('customer-dashboard');
    } else if (path === '/login') {
      setCurrentView('login');
    } else if (path === '/portal') {
      if (!user && !authLoading) {
        setCurrentView('login');
        window.history.replaceState(null, '', '/login');
      } else {
        setCurrentView('portal');
      }
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/prompt-architect' || currentPath === '/free-tools') {
        setCurrentView('prompt-architect');
      } else if (currentPath.startsWith('/lessons/')) {
        const id = currentPath.replace('/lessons/', '').trim();
        setSelectedLessonId(id || 'lesson-1-1');
        setCurrentView('lesson-detail');
      } else if (currentPath.startsWith('/levels/')) {
        const id = currentPath.replace('/levels/', '').trim();
        setSelectedLevelId(id || '1');
        setCurrentView('level-hub');
      } else if (currentPath === '/levels') {
        setSelectedLevelId('1');
        setCurrentView('level-hub');
      } else if (currentPath === '/academy') {
        setCurrentView('academy');
      } else if (currentPath === '/ebooks/ai-prompt-engineering-handbook') {
        setCurrentView('ai-prompt-handbook');
        setSelectedProductId('prod_ebook_ai_prompt');
      } else if (currentPath === '/free-guide') {
        setCurrentView('free-ebook');
      } else if (currentPath === '/trading-eas') {
        setCurrentView('eas');
      } else if (currentPath === '/ebooks') {
        setCurrentView('ebooks');
      } else if (currentPath === '/login') {
        setCurrentView('login');
      } else if (currentPath === '/portal') {
        if (!user && !authLoading) {
          setCurrentView('login');
          window.history.replaceState(null, '', '/login');
        } else {
          setCurrentView('portal');
        }
      } else if (currentPath === '/') {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, authLoading]);

  // Route Protection: If unauthenticated user lands on /portal, instantly redirect to /login
  useEffect(() => {
    if (!authLoading && currentView === 'portal' && !user) {
      setCurrentView('login');
      window.history.replaceState(null, '', '/login');
    }
  }, [currentView, user, authLoading]);

  const handleNavigate = (view: ActiveView, extraId?: string) => {
    let targetView = view;
    if (view === 'lesson-detail' && extraId) {
      setSelectedLessonId(extraId);
      window.history.pushState(null, '', `/lessons/${extraId}`);
    } else if ((view === 'level-hub' || view === 'levels') && extraId) {
      setSelectedLevelId(extraId);
      window.history.pushState(null, '', `/levels/${extraId}`);
    } else if (view === 'level-hub' || view === 'levels') {
      window.history.pushState(null, '', `/levels/${selectedLevelId}`);
    } else if (extraId) {
      setSelectedProductId(extraId);
    }

    if (view === 'prompt-architect') {
      window.history.pushState(null, '', '/prompt-architect');
    } else if (view === 'academy') {
      window.history.pushState(null, '', '/academy');
    } else if (view === 'ai-prompt-handbook' || (view === 'ebook-detail' && extraId === 'prod_ebook_ai_prompt')) {
      targetView = 'ai-prompt-handbook';
      setSelectedProductId('prod_ebook_ai_prompt');
      window.history.pushState(null, '', '/ebooks/ai-prompt-engineering-handbook');
    } else if (view === 'free-ebook') {
      window.history.pushState(null, '', '/free-guide');
    } else if (view === 'eas') {
      window.history.pushState(null, '', '/trading-eas');
    } else if (view === 'ebooks') {
      window.history.pushState(null, '', '/ebooks');
    } else if (view === 'login') {
      window.history.pushState(null, '', '/login');
    } else if (view === 'portal') {
      if (!user && !authLoading) {
        targetView = 'login';
        window.history.pushState(null, '', '/login');
      } else {
        window.history.pushState(null, '', '/portal');
      }
    } else if (view === 'home') {
      window.history.pushState(null, '', '/');
    }

    setCurrentView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When clicking "Build My EA", open the clean custom EA request form modal
  const handleTriggerBuildMyEa = (prefillData?: any) => {
    if (prefillData) {
      setCustomEaPrefill(prefillData);
    }
    setIsCustomEaModalOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    setPurchaseProduct(product);
    setIsPurchaseOpen(true);
  };

  const handlePurchaseSuccess = () => {
    loadProducts();
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    handleNavigate('login');
  };

  // Find currently selected product
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const isAcademyView = currentView === 'academy' || currentView === 'lesson-detail';

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Primary Navigation Bar (Sticky, FundingPips/AquaFunded quality) */}
      {!isAcademyView && (
        <Navbar
          currentView={currentView}
          activeView={currentView}
          onNavigate={handleNavigate}
          onOpenAuth={openAuth}
          onTriggerBuildMyEa={handleTriggerBuildMyEa}
        />
      )}

      {/* Main Viewport */}
      <main className="flex-grow">
        {currentView === 'academy' && (
          <AcademyHomePage
            onNavigate={handleNavigate}
          />
        )}

        {(currentView === 'level-hub' || currentView === 'levels') && (
          <LevelHubPage
            levelId={selectedLevelId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'lesson-detail' && (
          <LessonViewerPage
            lessonId={selectedLessonId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'prompt-architect' && (
          <PromptArchitectPage
            onNavigate={handleNavigate}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}

        {currentView === 'home' && (
          <HomePage
            products={products}
            onNavigate={handleNavigate}
            onBuyNow={handleBuyNow}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}

        {currentView === 'eas' && (
          <TradingEasPage
            products={products}
            onNavigate={handleNavigate}
            onBuyNow={handleBuyNow}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}

        {currentView === 'ea-detail' && selectedProduct && (
          <EaProductDetail
            product={selectedProduct}
            onBack={() => handleNavigate('eas')}
            onBuyNow={handleBuyNow}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}

        {currentView === 'ebooks' && (
          <EbooksPage
            products={products}
            onNavigate={handleNavigate}
            onBuyNow={handleBuyNow}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}

        {currentView === 'ai-prompt-handbook' && (
          <AiPromptHandbookPage
            product={products.find(p => p.id === 'prod_ebook_ai_prompt') || selectedProduct}
            onBack={() => handleNavigate('ebooks')}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentView === 'ebook-detail' && selectedProduct && (
          selectedProduct.id === 'prod_ebook_ai_prompt' ? (
            <AiPromptHandbookPage
              product={selectedProduct}
              onBack={() => handleNavigate('ebooks')}
              onBuyNow={handleBuyNow}
            />
          ) : (
            <EbookProductDetail
              product={selectedProduct}
              onBack={() => handleNavigate('ebooks')}
              onBuyNow={handleBuyNow}
              onTriggerBuildMyEa={handleTriggerBuildMyEa}
            />
          )
        )}

        {currentView === 'free-ebook' && (
          <FreeEbookPage
            onNavigate={handleNavigate}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}

        {currentView === 'custom-ea' && (
          <CustomEaPage
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
            onExploreEas={() => handleNavigate('eas')}
          />
        )}

        {currentView === 'coaching' && (
          <CoachingPage
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
            onExploreEas={() => handleNavigate('eas')}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
            onExploreEas={() => handleNavigate('eas')}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
            onExploreEas={() => handleNavigate('eas')}
          />
        )}

        {(currentView === 'customer-dashboard' || currentView === 'dashboard' || currentView === 'my-projects') && (
          <CustomerDashboard
            onNavigate={handleNavigate}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'developer' && (
          <DeveloperDashboard
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'strategy-builder-coming-soon' && (
          <StrategyBuilderComingSoon
            onBack={() => handleNavigate('home')}
            onExploreEas={() => handleNavigate('eas')}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            initialMode={authMode}
          />
        )}

        {currentView === 'portal' && (
          <PortalPage
            onNavigate={handleNavigate}
            onTriggerBuildMyEa={handleTriggerBuildMyEa}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAuth={openAuth}
        onTriggerBuildMyEa={handleTriggerBuildMyEa}
      />

      {/* Custom EA Request Form Modal */}
      <CustomEaRequestModal
        isOpen={isCustomEaModalOpen}
        onClose={() => {
          setIsCustomEaModalOpen(false);
          setCustomEaPrefill(null);
        }}
        initialPackage="Custom"
        initialData={customEaPrefill}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />

      {/* Purchase / Checkout Modal */}
      <PurchaseModal
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        product={purchaseProduct}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

      {/* Interactive MEGA AI Assistant Widget */}
      <MegaAiChat
        currentView={currentView}
        onNavigate={handleNavigate}
        onTriggerBuildMyEa={handleTriggerBuildMyEa}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
