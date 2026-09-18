import { useState, useEffect } from 'react';
import { ActiveView, Product } from './types.ts';
import { api } from './services/api.ts';
import { useAuth, AuthProvider } from './context/AuthContext.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { INITIAL_PRODUCTS } from './constants/initialProducts.ts';
import { parseUrlToView, getUrlForView, getTitleForView } from './utils/router.ts';
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
import { AcademyPricingPage } from './components/academy/AcademyPricingPage.tsx';
import { MegaAiChat } from './components/common/MegaAiChat.tsx';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton.tsx';

function AppContent() {
  const { user, loading: authLoading } = useAuth();

  // Parse initial route directly from window.location.pathname on first render
  const initialRoute = typeof window !== 'undefined'
    ? parseUrlToView(window.location.pathname)
    : { view: 'home' as ActiveView };

  const [currentView, setCurrentView] = useState<ActiveView>(initialRoute.view);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(
    initialRoute.productId || 'prod_ea_adaptive_liquidity'
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialRoute.lessonId || 'lesson-1-1'
  );
  const [selectedLevelId, setSelectedLevelId] = useState<string>(
    initialRoute.levelId || '1'
  );
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseProduct, setPurchaseProduct] = useState<Product | null>(null);
  const [isCustomEaModalOpen, setIsCustomEaModalOpen] = useState(false);
  const [customEaPrefill, setCustomEaPrefill] = useState<any>(null);

  // Fetch products from database to hydrate any dynamic changes
  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Ensure document.title matches current view
    document.title = getTitleForView(
      initialRoute.view,
      initialRoute.productId || initialRoute.levelId || initialRoute.lessonId
    );

    // Normalize address bar URL to canonical path without reload
    const canonicalUrl = getUrlForView(
      initialRoute.view,
      initialRoute.productId || initialRoute.levelId || initialRoute.lessonId
    );
    if (window.location.pathname !== canonicalUrl) {
      window.history.replaceState(null, '', canonicalUrl);
    }

    const handlePopState = () => {
      const resolved = parseUrlToView(window.location.pathname);
      if (resolved.productId) {
        setSelectedProductId(resolved.productId);
      }
      if (resolved.lessonId) {
        setSelectedLessonId(resolved.lessonId);
      }
      if (resolved.levelId) {
        setSelectedLevelId(resolved.levelId);
      }
      setCurrentView(resolved.view);
      document.title = getTitleForView(
        resolved.view,
        resolved.productId || resolved.levelId || resolved.lessonId
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route Protection: If unauthenticated user lands on /portal, redirect to /login
  useEffect(() => {
    if (!authLoading && currentView === 'portal' && !user) {
      setCurrentView('login');
      window.history.replaceState(null, '', '/login');
      document.title = getTitleForView('login');
    }
  }, [currentView, user, authLoading]);

  const handleNavigate = (view: ActiveView, extraId?: string) => {
    let targetView = view;
    let targetProductId = selectedProductId;
    let targetLessonId = selectedLessonId;
    let targetLevelId = selectedLevelId;

    if (view === 'lesson-detail' && extraId) {
      targetLessonId = extraId;
      setSelectedLessonId(extraId);
    } else if ((view === 'level-hub' || view === 'levels') && extraId) {
      targetLevelId = extraId;
      setSelectedLevelId(extraId);
    } else if (extraId) {
      targetProductId = extraId;
      setSelectedProductId(extraId);
    }

    if (view === 'ai-prompt-handbook' || (view === 'ebook-detail' && extraId === 'prod_ebook_ai_prompt')) {
      targetView = 'ai-prompt-handbook';
      targetProductId = 'prod_ebook_ai_prompt';
      setSelectedProductId('prod_ebook_ai_prompt');
    } else if (view === 'ebook-detail' && extraId === 'prod_ebook_mql5_guide') {
      targetProductId = 'prod_ebook_mql5_guide';
      setSelectedProductId('prod_ebook_mql5_guide');
    } else if (view === 'ea-detail') {
      const eaId = extraId || selectedProductId || 'prod_ea_adaptive_liquidity';
      targetProductId = eaId;
      setSelectedProductId(eaId);
    }

    if (targetView === 'portal' && !user && !authLoading) {
      targetView = 'login';
    }

    // Determine the extra ID to use for canonical URL generation
    let canonicalParam: string | undefined;
    if (targetView === 'level-hub' || targetView === 'levels') {
      canonicalParam = targetLevelId;
    } else if (targetView === 'lesson-detail' || targetView === 'lessons') {
      canonicalParam = targetLessonId;
    } else if (targetView === 'ea-detail' || targetView === 'ebook-detail') {
      canonicalParam = targetProductId;
    }

    const targetUrl = getUrlForView(targetView, canonicalParam);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }

    document.title = getTitleForView(targetView, canonicalParam);
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

  // Find currently selected product with fallback to INITIAL_PRODUCTS
  const selectedProduct =
    products.find(p => p.id === selectedProductId) ||
    INITIAL_PRODUCTS.find(p => p.id === selectedProductId) ||
    products[0] ||
    INITIAL_PRODUCTS[0];

  const isAcademyView =
    currentView === 'academy' ||
    currentView === 'lesson-detail' ||
    currentView === 'level-hub' ||
    currentView === 'levels' ||
    currentView === 'academy-pricing';

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

        {currentView === 'academy-pricing' && (
          <AcademyPricingPage
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
            onNavigate={handleNavigate}
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

      {/* Floating WhatsApp Contact Button (Bottom-Left) */}
      <WhatsAppFloatingButton />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
