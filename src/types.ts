export type UserRole = 'customer' | 'admin' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ProductType = 'ebook' | 'ea' | 'service';

export interface ProductMetadata {
  version?: string;
  timeframes?: string[];
  compatibleMarkets?: string[];
  recommendedDeposit?: string;
  recommendedLeverage?: string;
  strategyType?: string;
  features?: string[];
  tradingLogic?: string;
  riskManagement?: string;
  stats?: {
    winRate?: string;
    profitFactor?: string;
    maxHistoricalDrawdown?: string;
    backtestSpan?: string;
  };
  faq?: Array<{ q: string; a: string }>;
  pages?: number;
  format?: string;
  skillLevel?: string;
  tableOfContents?: string[];
  highlights?: string[];
  turnaround?: string;
  deliverables?: string[];
  supportedPlatforms?: string[];
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  short_description?: string | null;
  price: number;
  currency: string;
  platform?: string | null;
  image_url?: string | null;
  download_url?: string | null;
  active: number;
  metadata?: string | null;
  created_at: string;
  updated_at: string;
  parsedMetadata?: ProductMetadata;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  currency: string;
  payment_status: 'paid' | 'pending' | 'refunded' | 'failed';
  transaction_id: string;
  created_at: string;
  updated_at: string;
  product_name?: string;
  product_type?: ProductType;
  product_platform?: string;
  product_image?: string;
  user_name?: string;
  user_email?: string;
}

export interface Download {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  download_url: string;
  download_count: number;
  created_at: string;
}

export interface License {
  id: string;
  user_id: string;
  product_id: string;
  license_key: string;
  license_type: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  expires_at?: string | null;
}

export interface EAProject {
  id: string;
  user_id: string;
  project_name: string;
  title?: string;
  platform: string;
  status: 'draft' | 'review' | 'quote_ready' | 'in_development' | 'testing' | 'completed' | 'delivered' | 'cancelled';
  complexity?: string | null;
  strategy_description?: string;
  quote_status?: string;
  quote_amount?: number;
  estimated_price?: number | null;
  final_price?: number | null;
  created_at: string;
  updated_at: string;
}

export type EaProject = EAProject;

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  eaSales: number;
  ebookSales: number;
  customProjects: number;
}

export interface CustomerDashboardData {
  orders: Order[];
  eas: Array<Product & { license_key?: string; license_status?: string; license_type?: string; download_url?: string; download_count?: number; purchased_at?: string }>;
  ebooks: Array<Product & { download_url?: string; download_count?: number; purchased_at?: string }>;
  projects: EAProject[];
}

export type ActiveView = 
  | 'home'
  | 'eas'
  | 'ea-detail'
  | 'ebooks'
  | 'ebook-detail'
  | 'ai-prompt-handbook'
  | 'free-ebook'
  | 'custom-ea'
  | 'coaching'
  | 'about'
  | 'strategy-builder-coming-soon'
  | 'how-it-works'
  | 'my-projects'
  | 'dashboard'
  | 'customer-dashboard'
  | 'developer'
  | 'admin'
  | 'login'
  | 'portal'
  | 'academy'
  | 'levels'
  | 'level-hub'
  | 'lessons'
  | 'lesson-detail'
  | 'prompt-architect';

export interface LevelMeta {
  id: string;
  levelNumber: number;
  schoolName: string;
  technicalTitle: string;
  courseOrder: string;
  description: string;
  isFree: boolean;
  hasNewEditionBadge?: boolean;
}

export interface Lesson {
  id: string;
  uuid?: string;
  course_id: string;
  order_index: number;
  level_name: string;
  lesson_number: number;
  title: string;
  content: string;
  is_free: boolean;
  duration_minutes?: number;
  summary?: string;
}

export interface CustomDevLead {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  telegram?: string;
  platform?: string;
  instrument?: string;
  timeframe?: string;
  strategy_idea: string;
  generated_prompt?: string;
  status?: string;
  created_at?: string;
}
