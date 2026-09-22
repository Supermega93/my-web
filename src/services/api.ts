import { Product, Order, AdminStats, CustomerDashboardData, User, EAProject, License, AdminUserRecord, UserAccessStatus } from '../types.ts';
import { auth } from '../lib/firebase.ts';

const TOKEN_KEY = 'ea_auth_token';

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  // Fallback to Supabase auth session token in localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed?.access_token) {
            return parsed.access_token;
          }
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }
  return null;
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = getStoredToken();

  // If token is not present in storage but Firebase is signed in, get fresh token
  if (!token && auth?.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
      if (token) {
        setStoredToken(token);
      }
    } catch {
      // Non-blocking fallback
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(endpoint, {
    ...options,
    headers,
  });

  // If response is 401 Unauthorized and user is logged into Firebase, attempt token refresh and retry once
  if (response.status === 401 && auth?.currentUser) {
    try {
      const refreshedToken = await auth.currentUser.getIdToken(true);
      if (refreshedToken) {
        setStoredToken(refreshedToken);
        headers['Authorization'] = `Bearer ${refreshedToken}`;
        response = await fetch(endpoint, {
          ...options,
          headers,
        });
      }
    } catch {
      // Non-blocking retry fallback
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to execute request`);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string):Promise<{ user: User; token: string }> {
    const data = await request<{ success: boolean; user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async register(userData: { name: string; email: string; password: string; phone?: string; role?: string }): Promise<{ user: User; token: string }> {
    const data = await request<{ success: boolean; user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setStoredToken(data.token);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network failure on logout
    } finally {
      setStoredToken(null);
    }
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/me');
  },

  async resetPassword(email: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  },

  // Products
  async getProducts(type?: string): Promise<Product[]> {
    const query = type ? `?type=${type}` : '';
    const res = await request<{ products: Product[] }>(`/api/products${query}`);
    return res.products.map(p => ({
      ...p,
      parsedMetadata: p.metadata ? safeJsonParse(p.metadata) : undefined
    }));
  },

  async getProductById(id: string): Promise<Product> {
    const res = await request<{ product: Product }>(`/api/products/${id}`);
    return {
      ...res.product,
      parsedMetadata: res.product.metadata ? safeJsonParse(res.product.metadata) : undefined
    };
  },

  // Orders
  async createOrder(payload: string | { productId: string; amount?: number; currency?: string; tierName?: string; customerEmail?: string; customerName?: string; paymentMethod?: string }): Promise<{
    success: boolean;
    orderId: string;
    transactionId: string;
    licenseKey?: string;
    downloadUrl?: string;
    license?: any;
  }> {
    const body = typeof payload === 'string' ? { productId: payload } : payload;
    return request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Customer Dashboard
  async getCustomerDashboardData(): Promise<CustomerDashboardData> {
    return request<CustomerDashboardData>('/api/customer/dashboard-data');
  },

  // Projects
  async createProject(projectData: {
    title: string;
    description: string;
    raw_strategy_input?: string;
    platform?: string;
    budget_tier?: string;
    user_id?: string;
    customer_email?: string;
    customer_name?: string;
    customer_phone?: string;
    customer_telegram?: string;
    instrument?: string;
    timeframe?: string;
  }): Promise<EAProject> {
    const res = await request<{ success: boolean; project: EAProject }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return res.project;
  },

  async submitCustomDevLead(leadData: {
    email: string;
    name?: string;
    phone?: string;
    telegram?: string;
    platform?: string;
    instrument?: string;
    timeframe?: string;
    strategy_idea: string;
    generated_prompt?: string;
  }): Promise<{ success: boolean; leadId: string }> {
    return request('/api/custom-dev-leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // Developer
  async getDeveloperProjects(): Promise<EAProject[]> {
    const res = await request<{ projects: EAProject[] }>('/api/developer/projects');
    return res.projects;
  },

  async updateProjectStatus(projectId: string, status: string): Promise<{ project: EAProject }> {
    return request(`/api/developer/projects/${projectId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    const res = await request<{ stats: AdminStats }>('/api/admin/stats');
    return res.stats;
  },

  async getAdminProducts(): Promise<Product[]> {
    const res = await request<{ products: Product[] }>('/api/admin/products');
    return res.products.map(p => ({
      ...p,
      parsedMetadata: p.metadata ? safeJsonParse(p.metadata) : undefined
    }));
  },

  async createProduct(productData: Partial<Product>): Promise<{ product: Product }> {
    return request('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ product: Product }> {
    return request(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getAdminOrders(): Promise<Order[]> {
    const res = await request<{ orders: Order[] }>('/api/admin/orders');
    return res.orders;
  },

  async getAdminLicenses(): Promise<License[]> {
    const res = await request<{ licenses: License[] }>('/api/admin/licenses');
    return res.licenses;
  },

  async updateAdminLicense(
    id: string,
    updates: {
      starts_at?: string | null;
      expires_at?: string | null;
      status?: string;
      delivery_status?: string;
      delivery_notes?: string | null;
    }
  ): Promise<{ success: boolean; license: License; supabaseSynced: boolean; supabaseMessage: string }> {
    return request(`/api/admin/licenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async syncLicensesToSupabase(): Promise<{ success: boolean; result: any }> {
    return request('/api/admin/licenses/sync-supabase', {
      method: 'POST',
    });
  },

  async getAdminSupabaseStatus(): Promise<any> {
    return request('/api/admin/supabase-status');
  },

  async getAdminUsers(search?: string): Promise<AdminUserRecord[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await request<{ users: AdminUserRecord[] }>(`/api/admin/users${query}`);
    return res.users;
  },

  async grantComplimentaryAccess(
    userId: string,
    email: string,
    notes?: string
  ): Promise<{ success: boolean; message: string; access_status: UserAccessStatus; complimentary_id?: string; supabaseSynced: boolean; supabaseMessage?: string }> {
    return request(`/api/admin/users/${userId}/complimentary-access`, {
      method: 'POST',
      body: JSON.stringify({ email, notes }),
    });
  },

  async revokeComplimentaryAccess(
    userId: string,
    email?: string
  ): Promise<{ success: boolean; message: string; access_status: UserAccessStatus; supabaseSynced: boolean }> {
    return request(`/api/admin/users/${userId}/complimentary-access`, {
      method: 'DELETE',
      body: JSON.stringify({ email }),
    });
  },

  async getUserAccessStatus(): Promise<{
    access_status: UserAccessStatus;
    can_access_masterclass: boolean;
    is_admin?: boolean;
    details?: any;
  }> {
    return request('/api/user/access-status');
  },

  async syncUserWithBackend(phone?: string): Promise<{ success: boolean; user: any; access: any }> {
    return request('/api/users/sync', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Phase 2 early interest
  async notifyInterest(payload: { email: string; platform?: string; strategyNotes?: string }): Promise<{ success: boolean; message: string }> {
    return request('/api/strategy-builder/notify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Book cover upload
  async uploadCover(productId: string, fileName: string, base64Data: string): Promise<{ success: boolean; imageUrl: string }> {
    return request('/api/upload-cover', {
      method: 'POST',
      body: JSON.stringify({ productId, fileName, base64Data }),
    });
  },

  // Strategy & EA Submissions
  async getStrategySubmissions(): Promise<StrategySubmission[]> {
    const res = await request<{ submissions: StrategySubmission[] }>('/api/strategy-submissions');
    return res.submissions || [];
  },

  async retryStrategySubmissionEmail(id: string): Promise<any> {
    return request(`/api/strategy-submissions/${id}/retry-email`, {
      method: 'POST',
    });
  },

  // AI Strategy Architect
  async interpretStrategyAi(payload: {
    buildType: 'EA' | 'Indicator';
    description: string;
    conversation?: Array<{ role: 'user' | 'assistant'; content: string }>;
    platform?: 'MT5' | 'MT4' | 'cTrader';
  }): Promise<any> {
    return request('/api/strategy/interpret-ai', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export interface StrategySubmission {
  id: string;
  user_id?: string;
  submission_id: string;
  full_name: string;
  email: string;
  phone: string;
  telegram?: string;
  platform: string;
  strategy_title?: string;
  original_strategy: string;
  structured_strategy?: string;
  clear_strategy?: string;
  generated_prompt?: string;
  instrument?: string;
  timeframe?: string;
  direction?: string;
  entry_conditions?: string;
  exit_conditions?: string;
  risk_management?: string;
  trading_conditions?: string;
  trade_management?: string;
  additional_rules?: string;
  missing_information?: string;
  status: string;
  email_status: string;
  email_sent_at?: string;
  email_error?: string;
  created_at: string;
  updated_at: string;
}

function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}
