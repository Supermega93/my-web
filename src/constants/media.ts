// Centralized Supabase Storage URLs for Storefront Media & Asset Downloads
// Hardcoded exact URLs as instructed in Phase UI Override

export const SUPABASE_STOREFRONT_BUCKET =
  'https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media';

export const STOREFRONT_MEDIA = {
  // 1. FREE EBOOK LEAD MAGNET (The Trader's Guide...)
  // Protected server-side asset: Download URL is strictly generated after verified email submission.
  freeEbook: {
    id: 'free_lead_magnet_traders_guide',
    title: "The Trader's Guide to Understanding Strategy Automation",
    author: 'M. Dinga',
    // Exact Supabase Image src
    coverUrl: `${SUPABASE_STOREFRONT_BUCKET}/Gemini_Generated_Image_yxy52byxy52byxy5.jfif`,
    // Protected server-side asset (requires email verification)
    isProtected: true,
  },

  // 2. PAID EBOOK 1 (Build Trading Bots with AI & MQL5)
  paidEbook1: {
    id: 'prod_ebook_mql5_guide',
    title: 'Build Trading Bots with AI & MQL5 (Vol 1)',
    author: 'M. Dinga',
    // Exact Supabase Image src
    coverUrl: `${SUPABASE_STOREFRONT_BUCKET}/Gemini_Generated_Image_ltfrdfltfrdfltfr.jfif`,
    // Exact Supabase Download href
    downloadUrl: `${SUPABASE_STOREFRONT_BUCKET}/Vol1-AI%20assisted%20mql5%20Development.pdf`,
  },

  // 3. PAID EBOOK 2 (The AI Prompt Engineering Handbook)
  paidEbook2: {
    id: 'prod_ebook_ai_prompt',
    title: 'The AI Prompt Engineering Handbook for Trading Automation (Vol 2)',
    author: 'M. Dinga',
    // Exact Supabase Image src
    coverUrl: `${SUPABASE_STOREFRONT_BUCKET}/Gemini_Generated_Image_v49p2qv49p2qv49p.jfif`,
    // Exact Supabase Download href
    downloadUrl: `${SUPABASE_STOREFRONT_BUCKET}/The%20AI%20Prompt%20Engineering%20Handbook.pdf`,
  },

  // 4. FLAGSHIP TRADING EA (Adaptive Liquidity Pro)
  flagshipEa: {
    id: 'prod_ea_adaptive_liquidity',
    title: 'Adaptive Liquidity Pro V1.0',
    // Exact Supabase Image src: 200x200 1:1 square badge
    imageUrl: `${SUPABASE_STOREFRONT_BUCKET}/Adaptive_Liquidity_Pro_EA_MT5_200x200.bmp`,
    // Subtle 8px border radius
    borderRadiusClass: 'rounded-[8px]', // exact 8px
  },
} as const;

export default STOREFRONT_MEDIA;
