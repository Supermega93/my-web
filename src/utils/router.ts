import { ActiveView } from '../types.ts';

export interface RouteResolution {
  view: ActiveView;
  productId?: string;
  lessonId?: string;
  levelId?: string;
}

/**
 * Normalizes a URL pathname by stripping query parameters, hash fragments,
 * and trailing slashes.
 */
export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  
  // Extract path part before ? or #
  let clean = pathname.split('?')[0].split('#')[0];
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // If malformed URI, continue with raw string
  }

  // Trim whitespace
  clean = clean.trim();

  // Strip trailing slashes, but ensure root is '/'
  clean = clean.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

/**
 * Parses any incoming URL pathname into the corresponding application view and parameters.
 * Supports direct links, social post links (including aliases), and deep-nested routes.
 */
export function parseUrlToView(pathname: string): RouteResolution {
  const path = normalizePath(pathname);

  // 1. Root and Home
  if (path === '/' || path === '/home') {
    return { view: 'home' };
  }

  // 2. Free MQL5 Indicator & Strategy Automation Guide (Social links & direct deep links)
  if (
    path === '/free-guide' ||
    path === '/free-ebook' ||
    path === '/free-mql5-indicator-guide' ||
    path === '/mql5-indicator-guide' ||
    path === '/free-indicator-guide' ||
    path === '/indicator-guide' ||
    path === '/free-mql5-guide' ||
    path === '/free-mql5' ||
    path === '/guide'
  ) {
    return { view: 'free-ebook' };
  }

  // 3. AI Strategy Prompt Architect (Free Tools)
  if (
    path === '/prompt-architect' ||
    path === '/free-tools' ||
    path === '/strategy-builder' ||
    path === '/prompt-builder'
  ) {
    return { view: 'prompt-architect' };
  }

  // 4. Academy & Courses
  if (path === '/academy/pricing' || path === '/academy-pricing' || path === '/academy/plans') {
    return { view: 'academy-pricing' };
  }
  if (path === '/academy' || path === '/course' || path === '/courses') {
    return { view: 'academy' };
  }

  // 5. Academy Lessons Deep Links
  if (path.startsWith('/lessons/')) {
    const lessonId = path.replace('/lessons/', '').trim();
    return {
      view: 'lesson-detail',
      lessonId: lessonId || 'lesson-1-1',
    };
  }
  if (path === '/lessons') {
    return {
      view: 'lesson-detail',
      lessonId: 'lesson-1-1',
    };
  }

  // 6. Academy Levels Deep Links
  if (path.startsWith('/levels/')) {
    const levelId = path.replace('/levels/', '').trim();
    return {
      view: 'level-hub',
      levelId: levelId || '1',
    };
  }
  if (path === '/levels') {
    return {
      view: 'level-hub',
      levelId: '1',
    };
  }

  // 7. Trading EAs (Storefront Catalog)
  if (path === '/trading-eas' || path === '/eas' || path === '/robots' || path === '/ea') {
    return { view: 'eas' };
  }

  // 8. Flagship EA Detail Deep Links
  if (
    path === '/eas/adaptive-liquidity-pro' ||
    path === '/liquidity-pro-ea' ||
    path === '/eas/prod_ea_adaptive_liquidity' ||
    path === '/eas/adaptive-liquidity' ||
    path === '/products/adaptive-liquidity-pro' ||
    path === '/products/prod_ea_adaptive_liquidity'
  ) {
    return {
      view: 'ea-detail',
      productId: 'prod_ea_adaptive_liquidity',
    };
  }
  if (path.startsWith('/eas/')) {
    const eaId = path.replace('/eas/', '').trim();
    return {
      view: 'ea-detail',
      productId: eaId || 'prod_ea_adaptive_liquidity',
    };
  }

  // 9. E-Books Catalog
  if (path === '/ebooks' || path === '/books' || path === '/handbooks') {
    return { view: 'ebooks' };
  }

  // 10. AI Prompt Handbook (Volume 2)
  if (
    path === '/ebooks/ai-prompt-engineering-handbook' ||
    path === '/ebooks/ai-prompt-handbook' ||
    path === '/ebooks/prompt-handbook' ||
    path === '/ebooks/prod_ebook_ai_prompt' ||
    path === '/books/ai-prompt-engineering-handbook' ||
    path === '/books/prod_ebook_ai_prompt'
  ) {
    return {
      view: 'ai-prompt-handbook',
      productId: 'prod_ebook_ai_prompt',
    };
  }

  // 11. The School of AI Trading Architecture
  if (
    path === '/ebooks/the-school-of-ai-trading-architecture' ||
    path === '/ebooks/school-of-ai-trading-architecture' ||
    path === '/books/the-school-of-ai-trading-architecture' ||
    path === '/books/school-of-ai-trading-architecture' ||
    path === '/ebooks/build-trading-bots-with-ai-mql5' ||
    path === '/ebooks/build-trading-bots' ||
    path === '/ebooks/mql5-guide' ||
    path === '/ebooks/prod_ebook_mql5_guide' ||
    path === '/books/build-trading-bots-with-ai-mql5' ||
    path === '/books/prod_ebook_mql5_guide'
  ) {
    return {
      view: 'ebook-detail',
      productId: 'prod_ebook_mql5_guide',
    };
  }

  // 12. Generic /ebooks/:id or /books/:id
  if (path.startsWith('/ebooks/') || path.startsWith('/books/')) {
    const rawId = path.replace(/^\/(?:ebooks|books)\//, '').trim();
    if (rawId === 'prod_ebook_ai_prompt' || rawId.includes('prompt')) {
      return {
        view: 'ai-prompt-handbook',
        productId: 'prod_ebook_ai_prompt',
      };
    }
    return {
      view: 'ebook-detail',
      productId: rawId || 'prod_ebook_mql5_guide',
    };
  }

  // 13. Custom EA Development
  if (path === '/custom-ea' || path === '/custom-eas' || path === '/build-ea') {
    return { view: 'custom-ea' };
  }

  // 14. 1-on-1 Consultation / Coaching
  if (path === '/coaching' || path === '/consultation') {
    return { view: 'coaching' };
  }

  // 15. About MEG.AI Labs
  if (path === '/about' || path === '/about-us') {
    return { view: 'about' };
  }

  // 16. How It Works
  if (path === '/how-it-works' || path === '/process') {
    return { view: 'how-it-works' };
  }

  // 17. Client Dashboard / My Projects
  if (
    path === '/dashboard' ||
    path === '/customer-dashboard' ||
    path === '/my-projects' ||
    path === '/my-orders'
  ) {
    return { view: 'customer-dashboard' };
  }

  // 18. Authentication / Login
  if (
    path === '/login' ||
    path === '/signin' ||
    path === '/auth' ||
    path === '/register'
  ) {
    return { view: 'login' };
  }

  // 19. Client Portal
  if (path === '/portal' || path === '/hub') {
    return { view: 'portal' };
  }

  // 20. Admin Console
  if (
    path === '/admin' ||
    path === '/admin-dashboard' ||
    path === '/admin-console'
  ) {
    return { view: 'admin' };
  }

  // 21. Developer Dashboard
  if (path === '/developer' || path === '/dev') {
    return { view: 'developer' };
  }

  // 22. Strategy Builder Coming Soon
  if (path === '/strategy-builder-coming-soon') {
    return { view: 'strategy-builder-coming-soon' };
  }

  // Default fallback to home
  return { view: 'home' };
}

/**
 * Returns the canonical URL path for a given application view and parameters.
 */
export function getUrlForView(view: ActiveView, extraId?: string): string {
  switch (view) {
    case 'home':
      return '/';

    case 'free-ebook':
      return '/free-guide';

    case 'prompt-architect':
      return '/prompt-architect';

    case 'academy':
      return '/academy';

    case 'academy-pricing':
      return '/academy/pricing';

    case 'levels':
    case 'level-hub':
      return extraId ? `/levels/${extraId}` : '/levels/1';

    case 'lessons':
    case 'lesson-detail':
      return extraId ? `/lessons/${extraId}` : '/lessons/lesson-1-1';

    case 'eas':
      return '/trading-eas';

    case 'ea-detail':
      return extraId === 'prod_ea_adaptive_liquidity' || !extraId
        ? '/eas/adaptive-liquidity-pro'
        : `/eas/${extraId}`;

    case 'ebooks':
      return '/ebooks';

    case 'ai-prompt-handbook':
      return '/ebooks/ai-prompt-engineering-handbook';

    case 'ebook-detail':
      if (extraId === 'prod_ebook_ai_prompt') {
        return '/ebooks/ai-prompt-engineering-handbook';
      }
      if (extraId === 'prod_ebook_mql5_guide') {
        return '/ebooks/the-school-of-ai-trading-architecture';
      }
      return extraId ? `/ebooks/${extraId}` : '/ebooks';

    case 'custom-ea':
      return '/custom-ea';

    case 'coaching':
      return '/coaching';

    case 'about':
      return '/about';

    case 'how-it-works':
      return '/how-it-works';

    case 'dashboard':
    case 'customer-dashboard':
    case 'my-projects':
      return '/dashboard';

    case 'login':
      return '/login';

    case 'portal':
      return '/portal';

    case 'admin':
      return '/admin';

    case 'developer':
      return '/developer';

    case 'strategy-builder-coming-soon':
      return '/strategy-builder-coming-soon';

    default:
      return '/';
  }
}

/**
 * Returns the page title matching the view for document.title sync.
 */
export function getTitleForView(view: ActiveView, extraId?: string): string {
  switch (view) {
    case 'free-ebook':
      return 'Free MQL5 Indicator & Strategy Automation Guide | MEG.AI LABS';

    case 'prompt-architect':
      return 'AI Strategy Prompt Architect (Free Tool) | MEG.AI LABS';

    case 'academy':
      return 'Free Strategy Academy (Levels 1–8) | MEG.AI LABS';

    case 'academy-pricing':
      return 'Academy Masterclass & Membership Pricing | MEG.AI LABS';

    case 'levels':
    case 'level-hub':
      return extraId
        ? `Academy Level ${extraId} Hub | MEG.AI LABS`
        : 'Academy Level Hub | MEG.AI LABS';

    case 'lessons':
    case 'lesson-detail':
      return extraId
        ? `Academy Lesson (${extraId}) | MEG.AI LABS`
        : 'Academy Lesson | MEG.AI LABS';

    case 'eas':
      return 'Algorithmic Trading Robots & Expert Advisors | MEG.AI LABS';

    case 'ea-detail':
      return 'Adaptive Liquidity Pro V1.0 MT5 | MEG.AI LABS';

    case 'ebooks':
      return 'Algorithmic Trading Handbooks & E-Books | MEG.AI LABS';

    case 'ai-prompt-handbook':
      return 'The AI Prompt Engineering Handbook (Vol 2) | MEG.AI LABS';

    case 'ebook-detail':
      if (extraId === 'prod_ebook_ai_prompt') {
        return 'The AI Prompt Engineering Handbook (Vol 2) | MEG.AI LABS';
      }
      return 'The School of AI Trading Architecture | MEG.AI LABS';

    case 'custom-ea':
      return 'Custom EA Development & Algorithmic Engineering | MEG.AI LABS';

    case 'coaching':
      return '1-on-1 Trading Automation Consultation | MEG.AI LABS';

    case 'about':
      return 'About MEG.AI LABS | Quantitative Engineering';

    case 'how-it-works':
      return 'How It Works | MEG.AI LABS';

    case 'dashboard':
    case 'customer-dashboard':
    case 'my-projects':
      return 'Client Terminal Dashboard | MEG.AI LABS';

    case 'login':
      return 'Client & Administrator Login | MEG.AI LABS';

    case 'portal':
      return 'Client Portal & License Hub | MEG.AI LABS';

    case 'admin':
      return 'Admin Console & License Governance | MEG.AI LABS';

    case 'developer':
      return 'Developer Workspace | MEG.AI LABS';

    case 'strategy-builder-coming-soon':
      return 'AI Strategy Builder | MEG.AI LABS';

    case 'home':
    default:
      return 'EA Automation Hub | MEG.AI LABS';
  }
}
