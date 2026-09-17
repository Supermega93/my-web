import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { initDatabase, dbQueries } from './server/db.ts';
import { MEGA_AI_MASTER_SYSTEM_PROMPT } from './server/megaAiPrompt.ts';
import { sendStrategySubmissionNotifications, sendOrderNotification } from './server/emailService.ts';
import {
  persistOrderToSupabase,
  persistLicenseToSupabase,
  syncAcademyProgressToSupabase,
  checkSupabaseOrdersLicensesHealth,
  batchSyncLicensesToSupabase,
  SUPABASE_ORDERS_LICENSES_SCHEMA_SQL,
  SUPABASE_COMPLIMENTARY_ACCESS_SCHEMA_SQL,
  syncComplimentaryAccessToSupabase
} from './server/supabaseSync.ts';
import { interpretStrategyWithGemini } from './server/strategyAiService.ts';
import {
  ensureProtectedPdfExists,
  isValidEmail,
  generateSignedToken,
  verifySignedToken,
  processEmailLead,
  getProtectedPdfPath,
} from './server/ebookProtection.ts';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xbrhalmcvpxutxojemoj.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7UqK_UbkxtEDg_i_drYesw_9pdbJS0c';
const supabaseServer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: key });
  }
  return genAIClient;
}

// Initialize the SQLite database tables and seed data
initDatabase();

// Sync book cover image files and EA badge files if custom images exist
function syncBookCoverImages() {
  try {
    const booksDir = path.join(process.cwd(), 'public', 'assets', 'books');
    if (fs.existsSync(booksDir)) {
      const files = fs.readdirSync(booksDir);
      
      // Check for Vol 1 (Build Trading Bots with AI & MQL5)
      const vol1File = files.find(f => 
        !f.endsWith('.svg') && 
        (f.includes('ltfrdf') || f.includes('vol1') || f.includes('build-trading-bots'))
      );
      if (vol1File) {
        dbQueries.updateProduct('prod_ebook_mql5_guide', {
          image_url: `/assets/books/${vol1File}`
        });
      }

      // Check for Vol 2 (The AI Prompt Engineering Handbook)
      const vol2File = files.find(f => 
        !f.endsWith('.svg') && 
        (f.includes('v49p2q') || f.includes('vol2') || f.includes('ai-prompt') || f.includes('prompt-engineering'))
      );
      if (vol2File) {
        dbQueries.updateProduct('prod_ebook_ai_prompt', {
          image_url: `/assets/books/${vol2File}`
        });
      }
    }

    // Check for Flagship EA (Adaptive Liquidity Pro V1.0)
    const eaDir = path.join(process.cwd(), 'public', 'assets', 'ea');
    if (fs.existsSync(eaDir)) {
      const eaFiles = fs.readdirSync(eaDir);
      const eaBadge = eaFiles.find(f => f.includes('Adaptive_Liquidity') || f.includes('200x200'));
      if (eaBadge) {
        dbQueries.updateProduct('prod_ea_adaptive_liquidity', {
          image_url: `/assets/ea/${eaBadge}`
        });
      }
    }
  } catch (err) {
    console.error('Error syncing book cover images:', err);
  }
}

syncBookCoverImages();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// SECURITY ENFORCEMENT: Strictly block direct public/static paid eBook PDF access.
// Free Academy exercise companion guides are permitted via /api/academy/download and /downloads/.
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (
    (p.endsWith('.pdf') || p.includes('.pdf')) && 
    !p.startsWith('/api/ebooks/download') && 
    !p.startsWith('/api/academy/download') && 
    !p.startsWith('/downloads/')
  ) {
    return res.status(403).json({
      error: 'Direct PDF download forbidden. Access requires submitting your email to receive an authorized temporary download link.',
      code: 'DIRECT_ACCESS_FORBIDDEN',
    });
  }
  next();
});

// Free Academy Exercise Download API (Instant download for Lesson 3.5 & Lesson 3.6 companion guides)
app.get('/api/academy/download/:docType', (req, res) => {
  const { docType } = req.params;
  let filename = '';
  let downloadName = '';
  if (docType === 'indicator' || docType === 'mt5-indicator' || docType === 'lesson-3-6') {
    filename = 'From_Trading_Idea_to_MT5_Indicator_Guide.pdf';
    downloadName = 'From-Trading-Idea-to-MT5-Indicator-Guide.pdf';
  } else if (docType === 'ea' || docType === 'breakout-ea' || docType === 'lesson-3-5' || docType === 'lesson-3-practical') {
    filename = 'From_Trading_Idea_to_MT5_EA_Guide.pdf';
    downloadName = 'From-Trading-Idea-to-MT5-EA-Guide.pdf';
  } else {
    return res.status(404).json({ error: 'Document not found' });
  }

  const filePath = path.join(process.cwd(), 'public', 'downloads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Exercise document not found' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Custom static asset handler with accurate MIME types
app.use('/assets', express.static(path.join(process.cwd(), 'public', 'assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jfif')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.bmp')) {
      res.setHeader('Content-Type', 'image/bmp');
    }
  }
}));

// Route fallback for direct filename requests
app.get(['/:filename(*.jfif)', '/:filename(*.bmp)'], (req, res, next) => {
  const filename = req.params.filename;
  const candidates = [
    path.join(process.cwd(), 'public', filename),
    path.join(process.cwd(), 'public', 'assets', 'books', filename),
    path.join(process.cwd(), 'public', 'assets', 'ea', filename),
    path.join(process.cwd(), 'public', 'assets', filename)
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      if (filename.endsWith('.jfif')) res.setHeader('Content-Type', 'image/jpeg');
      if (filename.endsWith('.bmp')) res.setHeader('Content-Type', 'image/bmp');
      return res.sendFile(p);
    }
  }
  next();
});

// In-memory token store for sessions (simple & secure for full-stack SPA)
const activeSessions = new Map<string, { userId: string; role: string; email: string; name: string }>();

// Seed default sessions for pre-configured accounts
activeSessions.set('token_admin', {
  userId: 'usr_admin_01',
  role: 'admin',
  email: 'admin@ea-automation.com',
  name: 'Alexander Wright'
});
activeSessions.set('token_dev', {
  userId: 'usr_dev_01',
  role: 'developer',
  email: 'dev@ea-automation.com',
  name: 'Marcus Vance'
});
activeSessions.set('token_cust', {
  userId: 'usr_cust_01',
  role: 'customer',
  email: 'supermegafx1@gmail.com',
  name: 'Valued Trader'
});

const ADMIN_EMAILS = [
  (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
  'supermegafx1@gmail.com',
  'admin@ea-automation.com',
  'admin@ea-automation-hub.com'
].filter(Boolean);

function isServerAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// Helper to resolve an authenticated user from session or Supabase JWT token
async function resolveAuthUser(req: Request): Promise<{
  userId: string;
  role: string;
  email: string;
  name: string;
  phone?: string | null;
  isSupabaseUser?: boolean;
} | null> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '').trim();
  if (!token) return null;

  // 1. Check local session storage
  let session = activeSessions.get(token);
  if (!session) {
    const persisted = dbQueries.getSession(token);
    if (persisted) {
      session = persisted;
      activeSessions.set(token, session);
    }
  }

  if (session) {
    return session;
  }

  // 2. Validate Supabase JWT token with Supabase Auth
  try {
    const { data, error } = await supabaseServer.auth.getUser(token);
    if (!error && data?.user) {
      const supaUser = data.user;
      const email = (supaUser.email || '').toLowerCase().trim();
      const isAdmin = isServerAdminEmail(email) || supaUser.user_metadata?.role === 'admin' || supaUser.app_metadata?.role === 'admin';
      const determinedRole = isAdmin ? 'admin' : (supaUser.user_metadata?.role === 'developer' ? 'developer' : 'customer');

      const userProfile = {
        userId: supaUser.id,
        role: determinedRole,
        email: email,
        name: supaUser.user_metadata?.name || email.split('@')[0] || 'Trader',
        phone: supaUser.phone || supaUser.user_metadata?.phone || null,
        isSupabaseUser: true
      };

      // Keep user synchronized in database
      try {
        dbQueries.ensureUser({
          id: supaUser.id,
          name: userProfile.name,
          email,
          phone: userProfile.phone,
          role: determinedRole
        });
      } catch (e) {
        // Non-blocking sync
      }

      return userProfile;
    }
  } catch (supaErr) {
    console.warn('[Server Auth] Supabase auth check error:', supaErr);
  }

  return null;
}

// Authentication middleware supporting Supabase Auth JWTs & sessions
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = await resolveAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Session is invalid or expired. Please log in.' });
  }
  (req as any).user = user;
  return next();
}

function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges for this role.' });
    }
    next();
  };
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'EA Automation Hub' });
});

// -------------------------------------------------------------
// Academy Curriculum & Access-Controlled Lesson Delivery
// -------------------------------------------------------------

// Public course outline: returns all 34 lessons with metadata (CONTENT IS NEVER DELIVERED HERE)
app.get('/api/academy/curriculum', (_req, res) => {
  try {
    const outline = dbQueries.getAllAcademyLessonsOutline();
    res.json({
      lessons: outline,
      totalCount: outline.length,
      freeCount: outline.filter((l: any) => Boolean(l.is_free)).length,
      paidCount: outline.filter((l: any) => !l.is_free).length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve curriculum outline.' });
  }
});

// Access-controlled single lesson endpoint
app.get('/api/academy/lessons/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = dbQueries.getAcademyLessonById(lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const isFree = Boolean(lesson.is_free);

    // Free lessons (Levels 1 to 3) are open to all visitors exploring the curriculum
    if (isFree) {
      return res.json({
        lesson: {
          ...lesson,
          is_free: true,
        },
        accessGranted: true,
        accessType: 'free',
        message: 'Free Academy Lesson'
      });
    }

    // PAID LESSON ACCESS ENFORCEMENT (Levels 4 through 8)
    const user = await resolveAuthUser(req);

    // Unauthenticated user attempting to view paid lesson:
    if (!user) {
      return res.status(403).json({
        error: 'Access Denied: Paid curriculum lesson. Please sign in with an authorized account.',
        accessGranted: false,
        requiresAuth: true,
        requiresPurchase: true,
        accessType: 'none',
        lesson: {
          id: lesson.id,
          uuid: lesson.uuid,
          course_id: lesson.course_id,
          order_index: lesson.order_index,
          level_name: lesson.level_name,
          lesson_number: lesson.lesson_number,
          title: lesson.title,
          summary: lesson.summary,
          duration_minutes: lesson.duration_minutes,
          is_free: false,
          content: '' // ZERO BYTES of proprietary lesson content delivered
        }
      });
    }

    // Check Administrator privileges
    const isAdmin = isServerAdminEmail(user.email) || user.role === 'admin';
    if (isAdmin) {
      return res.json({
        lesson: {
          ...lesson,
          is_free: false,
        },
        accessGranted: true,
        accessType: 'admin',
        message: 'Administrator full access'
      });
    }

    // Check student access status in database (orders and complimentary_access tables)
    const access = dbQueries.getUserAccessStatus(user.userId, user.email);

    if (access.access_status === 'paid') {
      return res.json({
        lesson: {
          ...lesson,
          is_free: false,
        },
        accessGranted: true,
        accessType: 'paid',
        orderId: access.order_id,
        message: 'Masterclass Pro Paid Access'
      });
    }

    if (access.access_status === 'complimentary') {
      return res.json({
        lesson: {
          ...lesson,
          is_free: false,
        },
        accessGranted: true,
        accessType: 'complimentary',
        complimentaryId: access.complimentary_id,
        grantedAt: access.granted_at,
        message: 'Complimentary Masterclass Access'
      });
    }

    // User is signed in but only on Free tier: DENY ACCESS & STRIP CONTENT
    return res.status(403).json({
      error: 'Access Denied: This lesson requires Masterclass Pro or Complimentary Access.',
      accessGranted: false,
      requiresAuth: false,
      requiresPurchase: true,
      accessType: 'free',
      lesson: {
        id: lesson.id,
        uuid: lesson.uuid,
        course_id: lesson.course_id,
        order_index: lesson.order_index,
        level_name: lesson.level_name,
        lesson_number: lesson.lesson_number,
        title: lesson.title,
        summary: lesson.summary,
        duration_minutes: lesson.duration_minutes,
        is_free: false,
        content: '' // ZERO BYTES of proprietary lesson content delivered
      }
    });
  } catch (err: any) {
    console.error('[Academy Lesson API Error]', err);
    res.status(500).json({ error: err.message || 'Server error loading lesson' });
  }
});

// Auth: Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = dbQueries.getUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const assignedRole = role === 'admin' || role === 'developer' ? role : 'customer';
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    dbQueries.createUser({
      id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
      role: assignedRole,
      password_hash: password // In production, bcrypt is used
    });

    const token = `tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const userProfile = { userId: id, role: assignedRole, email: email.toLowerCase().trim(), name: name.trim() };
    activeSessions.set(token, userProfile);
    dbQueries.saveSession({ token, userId: id, role: assignedRole, email: email.toLowerCase().trim(), name: name.trim() });

    res.json({
      success: true,
      token,
      user: {
        id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: assignedRole,
        phone: phone || null
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Registration failed.' });
  }
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = dbQueries.getUserByEmail(email.toLowerCase().trim()) as any;
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = `tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const userProfile = { userId: user.id, role: user.role, email: user.email, name: user.name };
    activeSessions.set(token, userProfile);
    dbQueries.saveSession({ token, userId: user.id, role: user.role, email: user.email, name: user.name });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed.' });
  }
});

// Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (token) {
    activeSessions.delete(token);
    dbQueries.deleteSession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Auth: Me
app.get('/api/auth/me', requireAuth, (req, res) => {
  const sessionUser = (req as any).user;
  const user = dbQueries.getUserById(sessionUser.userId);
  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }
  res.json({ user });
});

// Auth: Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }
  const user = dbQueries.getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    // Return friendly message without exposing existence
    return res.json({ success: true, message: 'If an account exists, a secure reset link has been dispatched.' });
  }

  if (newPassword) {
    dbQueries.updateUserPassword(email.toLowerCase().trim(), newPassword);
    return res.json({ success: true, message: 'Password has been updated successfully. You may now log in.' });
  }

  res.json({ success: true, message: 'Password reset link sent to your email.' });
});

// Products: Public Catalog
app.get('/api/products', (req, res) => {
  try {
    const { type } = req.query;
    if (type && (type === 'ea' || type === 'ebook' || type === 'service')) {
      const products = dbQueries.getProductsByType(type);
      return res.json({ products });
    }
    const products = dbQueries.getAllProducts(false);
    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Products: Get Single
app.get('/api/products/:id', (req, res) => {
  try {
    const product = dbQueries.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Products: Upload Cover Image
app.post('/api/upload-cover', (req, res) => {
  try {
    const { productId, fileName, base64Data } = req.body;
    if (!productId || !base64Data) {
      return res.status(400).json({ error: 'productId and base64Data are required.' });
    }

    const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    // Determine extension
    let ext = path.extname(fileName || '').toLowerCase();
    if (!ext || ext === '') {
      if (base64Data.includes('data:image/png')) ext = '.png';
      else if (base64Data.includes('data:image/webp')) ext = '.webp';
      else ext = '.jfif';
    }

    let targetFileName = `${productId}${ext}`;
    if (productId === 'prod_ebook_mql5_guide') targetFileName = `build-trading-bots-ai-mql5-vol1${ext}`;
    if (productId === 'prod_ebook_ai_prompt') targetFileName = `ai-prompt-engineering-handbook-vol2${ext}`;
    if (productId === 'prod_ebook_free') targetFileName = `traders-guide-understanding-automation${ext}`;

    const publicBooksDir = path.join(process.cwd(), 'public', 'assets', 'books');
    const distBooksDir = path.join(process.cwd(), 'dist', 'assets', 'books');

    if (!fs.existsSync(publicBooksDir)) fs.mkdirSync(publicBooksDir, { recursive: true });
    if (!fs.existsSync(distBooksDir)) fs.mkdirSync(distBooksDir, { recursive: true });

    fs.writeFileSync(path.join(publicBooksDir, targetFileName), buffer);
    fs.writeFileSync(path.join(distBooksDir, targetFileName), buffer);

    const imageUrl = `/assets/books/${targetFileName}?t=${Date.now()}`;
    if (productId !== 'prod_ebook_free') {
      dbQueries.updateProduct(productId, { image_url: imageUrl });
    }

    res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Error uploading cover image:', error);
    res.status(500).json({ error: error.message || 'Failed to process cover image.' });
  }
});

// Orders: Place Order
app.post('/api/orders', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const session = activeSessions.get(token);
      if (session) {
        userId = session.userId;
      }
    }

    const { productId, customerEmail, customerName, amount, tierName, currency } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const product = dbQueries.getProductById(productId) as any;
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // If no authenticated user, find or create customer
    if (!userId) {
      const email = customerEmail || 'guest@ea-hub.com';
      let user = dbQueries.getUserByEmail(email);
      if (!user) {
        const newUserId = `usr_${Date.now()}`;
        dbQueries.createUser({
          id: newUserId,
          email,
          name: customerName || 'Trader Customer',
          password_hash: 'demo_hash',
          role: 'customer'
        });
        userId = newUserId;
      } else {
        userId = String(user.id);
      }
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const orderAmount = typeof amount === 'number' && amount > 0 ? amount : product.price;
    const orderCurrency = currency || product.currency || 'USD';

    const orderRecord = {
      id: orderId,
      user_id: userId,
      product_id: productId,
      amount: orderAmount,
      currency: orderCurrency,
      payment_status: 'paid',
      transaction_id: transactionId
    };

    const result = dbQueries.createOrder(orderRecord);
    const isEa = product.type === 'ea';

    // Persist to Supabase asynchronously (dual persistence with SQLite)
    persistOrderToSupabase(orderRecord, result.license).catch((supaErr) => {
      console.warn('[Order Supabase Sync Graceful Notice]', supaErr?.message || supaErr);
    });

    // Optional email notifications: will never fail or throw if Brevo, SendGrid, or SMTP are unconfigured
    const effectiveEmail = customerEmail || (userId ? dbQueries.getUserById(userId)?.email : 'customer@ea-hub.com');
    sendOrderNotification({
      order: orderRecord,
      product,
      license: result.license,
      customerEmail: effectiveEmail || 'customer@ea-hub.com',
      customerName: customerName || 'Valued Trader'
    }).catch((emailErr) => {
      console.warn('[Order Email Notification Graceful Notice]', emailErr?.message || emailErr);
    });

    res.json({
      success: true,
      message: isEa
        ? 'Order processed successfully. Terminal license key generated. Binary delivery pending administrator review.'
        : 'Order processed successfully.',
      orderId,
      transactionId,
      isEa,
      licenseKey: result.license ? result.license.license_key : undefined,
      deliveryStatus: result.license ? result.license.delivery_status : (isEa ? 'pending' : 'completed'),
      downloadUrl: isEa ? null : product.download_url, // Strict: EA binary itself is NEVER automatically downloadable!
      license: result.license
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Customer: My Dashboard Data
app.get('/api/customer/dashboard-data', requireAuth, (req, res) => {
  try {
    const sessionUser = (req as any).user;
    const orders = dbQueries.getOrdersByUser(sessionUser.userId);
    const eas = dbQueries.getCustomerEAs(sessionUser.userId);
    const ebooks = dbQueries.getCustomerEbooks(sessionUser.userId);
    const projects = dbQueries.getCustomerProjects(sessionUser.userId);

    res.json({
      orders,
      eas,
      ebooks,
      projects
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Customer: My Orders
app.get('/api/customer/orders', requireAuth, (req, res) => {
  try {
    const sessionUser = (req as any).user;
    const orders = dbQueries.getOrdersByUser(sessionUser.userId);
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Customer: My Projects (EA Projects)
app.get('/api/customer/projects', requireAuth, (req, res) => {
  try {
    const sessionUser = (req as any).user;
    const projects = dbQueries.getCustomerProjects(sessionUser.userId);
    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Analytics & Stats
app.get('/api/admin/stats', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const stats = dbQueries.getAdminStats();
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Products List (all including inactive)
app.get('/api/admin/products', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const products = dbQueries.getAllProducts(true);
    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Add Product
app.post('/api/admin/products', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const { name, type, description, short_description, price, platform, image_url, download_url, active, metadata } = req.body;
    if (!name || !type || price === undefined) {
      return res.status(400).json({ error: 'Name, type, and price are required.' });
    }

    const id = `prod_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    dbQueries.createProduct({
      id,
      name,
      type,
      description: description || name,
      short_description,
      price: parseFloat(price),
      currency: 'USD',
      platform,
      image_url,
      download_url,
      active: active !== undefined ? (active ? 1 : 0) : 1,
      metadata: metadata ? JSON.stringify(metadata) : null
    });

    const created = dbQueries.getProductById(id);
    res.json({ success: true, product: created });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update Product
app.put('/api/admin/products/:id', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price);
    }
    if (updates.active !== undefined) {
      updates.active = updates.active ? 1 : 0;
    }
    if (updates.metadata && typeof updates.metadata === 'object') {
      updates.metadata = JSON.stringify(updates.metadata);
    }

    const updated = dbQueries.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ success: true, product: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Orders List
app.get('/api/admin/orders', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const orders = dbQueries.getAllOrders();
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Licenses List (Secure Admin-Only EA License Governance)
app.get('/api/admin/licenses', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const licenses = dbQueries.getAllLicenses();
    res.json({ licenses });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update License Dates, Status, and Delivery Status (Persists to SQLite and Supabase)
app.put('/api/admin/licenses/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { starts_at, expires_at, status, delivery_status, delivery_notes } = req.body;

    // Check license exists
    const existing = dbQueries.getLicenseById(id);
    if (!existing) {
      return res.status(404).json({ error: `License with ID ${id} not found.` });
    }

    // Persist locally in SQLite
    const updated = dbQueries.updateLicense(id, {
      starts_at,
      expires_at,
      status,
      delivery_status,
      delivery_notes
    });

    // Persist to Supabase
    const supaResult = await persistLicenseToSupabase(updated);

    res.json({
      success: true,
      message: 'License updated successfully.',
      license: updated,
      supabaseSynced: supaResult.success,
      supabaseMessage: supaResult.error ? `Supabase sync note: ${supaResult.error}` : 'Persisted to Supabase successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Batch Sync Licenses to Supabase
app.post('/api/admin/licenses/sync-supabase', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const result = await batchSyncLicensesToSupabase();
    res.json({ success: result.success, result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Check Supabase Tables & Get Schema SQL
app.get('/api/admin/supabase-status', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const health = await checkSupabaseOrdersLicensesHealth();
    res.json({
      ...health,
      schemaSql: SUPABASE_ORDERS_LICENSES_SCHEMA_SQL,
      complimentarySchemaSql: SUPABASE_COMPLIMENTARY_ACCESS_SCHEMA_SQL
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Users List with Access Status and Search
app.get('/api/admin/users', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const search = ((req.query.search as string) || '').toLowerCase().trim();
    let users = dbQueries.getAllUsersWithAccessStatus();
    if (search) {
      users = users.filter((u: any) => 
        (u.email && u.email.toLowerCase().includes(search)) || 
        (u.name && u.name.toLowerCase().includes(search)) ||
        (u.phone && u.phone.toLowerCase().includes(search)) ||
        (u.access_status && u.access_status.toLowerCase().includes(search))
      );
    }
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Grant Complimentary Masterclass Access
app.post('/api/admin/users/:userId/complimentary-access', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;
    const adminUser = (req as any).user;

    const targetUser = dbQueries.getUserById(userId) as any;
    const targetEmail = targetUser?.email || req.body.email;
    if (!targetEmail) {
      return res.status(400).json({ error: 'Target user record not found or email is missing.' });
    }

    // Verify current status
    const currentStatus = dbQueries.getUserAccessStatus(userId, targetEmail);
    if (currentStatus.access_status === 'paid') {
      return res.status(400).json({ error: 'User already has Paid Masterclass access from a paid order.' });
    }

    const compId = dbQueries.grantComplimentaryAccess(
      userId,
      targetEmail,
      adminUser.email || 'Admin',
      notes || 'Complimentary Masterclass access granted by administrator'
    );

    // Sync to Supabase complimentary_access table
    let supabaseSynced = false;
    let supabaseMessage = '';
    try {
      const syncResult = await syncComplimentaryAccessToSupabase({
        id: compId,
        user_id: userId,
        user_email: targetEmail,
        access_type: 'masterclass',
        status: 'active',
        granted_at: new Date().toISOString(),
        granted_by: adminUser.email || 'Admin',
        notes: notes || null,
      });
      supabaseSynced = syncResult.synced;
      supabaseMessage = syncResult.synced ? 'Synced to Supabase' : (syncResult.error || 'Supabase table pending schema initialization');
    } catch (e: any) {
      supabaseMessage = e.message;
    }

    res.json({
      success: true,
      message: `Complimentary Masterclass access successfully granted to ${targetEmail}`,
      access_status: 'complimentary',
      complimentary_id: compId,
      supabaseSynced,
      supabaseMessage
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Revoke Complimentary Masterclass Access
app.delete('/api/admin/users/:userId/complimentary-access', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const adminUser = (req as any).user;
    const targetUser = dbQueries.getUserById(userId) as any;
    const targetEmail = targetUser?.email || req.body?.email;

    dbQueries.revokeComplimentaryAccess(userId, adminUser.email || 'Admin');

    let supabaseSynced = false;
    if (targetEmail) {
      try {
        const syncResult = await syncComplimentaryAccessToSupabase({
          id: `rev_${Date.now()}`,
          user_id: userId,
          user_email: targetEmail,
          access_type: 'masterclass',
          status: 'revoked',
          granted_at: new Date().toISOString(),
          granted_by: 'Admin',
          revoked_at: new Date().toISOString(),
          revoked_by: adminUser.email || 'Admin',
          notes: 'Revoked by administrator'
        });
        supabaseSynced = syncResult.synced;
      } catch (e) {
        // Ignored
      }
    }

    res.json({
      success: true,
      message: `Complimentary Masterclass access revoked for user.`,
      access_status: 'free',
      supabaseSynced
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User: Check verified access status from database/Supabase
app.get('/api/user/access-status', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    if (user.role === 'admin') {
      return res.json({
        access_status: 'paid',
        is_admin: true,
        can_access_masterclass: true,
        message: 'Administrator privileges enabled'
      });
    }

    const access = dbQueries.getUserAccessStatus(user.userId, user.email);
    res.json({
      access_status: access.access_status, // 'free' | 'paid' | 'complimentary'
      can_access_masterclass: access.can_access_masterclass,
      details: access
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User: Synchronize Supabase user into database
app.post('/api/users/sync', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { phone } = req.body;
    dbQueries.ensureUser({
      id: user.userId,
      email: user.email,
      name: user.name,
      phone: phone || user.phone || null,
      role: user.role
    });
    const access = dbQueries.getUserAccessStatus(user.userId, user.email);
    res.json({ success: true, user, access });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Developer: Assigned Projects
app.get('/api/developer/projects', requireAuth, requireRole(['developer', 'admin']), (req, res) => {
  try {
    const projects = dbQueries.getAllProjects();
    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Developer: Update Project Status
app.put('/api/developer/projects/:id/status', requireAuth, requireRole(['developer', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }
    const updated = dbQueries.updateProjectStatus(id, status);
    res.json({ success: true, project: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Projects: Submit New Custom EA Request
app.post('/api/projects', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId: string | null = null;
    let sessionUser: any = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const session = activeSessions.get(token);
      if (session) {
        userId = session.userId;
        sessionUser = session;
      }
    }

    const {
      title,
      description,
      raw_strategy_input,
      platform,
      budget_tier,
      customer_email,
      customer_name,
      customer_phone,
      customer_telegram,
      instrument,
      timeframe,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const effectiveEmail = customer_email || sessionUser?.email || 'guest@supermegafx.com';
    const effectiveName = customer_name || sessionUser?.name || 'Trader';
    const effectivePlatform = platform || 'MetaTrader 5 (MQL5)';
    const effectiveInstrument = instrument || 'Multi-Asset';
    const effectiveTimeframe = timeframe || '15-Minute';
    const effectiveTier = budget_tier || 'standard';

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // 1. Persist to SQLite Database
    const created = dbQueries.createProject({
      id: projectId,
      user_id: userId || 'usr_demo_customer',
      title,
      description,
      raw_strategy_input: raw_strategy_input || description,
      platform: effectivePlatform,
      budget_tier: effectiveTier,
      customer_email: effectiveEmail,
      customer_name: effectiveName,
      customer_phone: customer_phone || null,
      customer_telegram: customer_telegram || null,
      instrument: effectiveInstrument,
      timeframe: effectiveTimeframe,
    });

    // 2. Also register in SQLite custom_dev_leads
    try {
      dbQueries.recordCustomDevLead({
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: effectiveEmail,
        name: effectiveName,
        phone: customer_phone || null,
        telegram: customer_telegram || null,
        platform: effectivePlatform,
        instrument: effectiveInstrument,
        timeframe: effectiveTimeframe,
        strategy_idea: raw_strategy_input || description,
        generated_prompt: description,
        status: 'pending_review',
      });
    } catch (leadErr) {
      console.warn('[SQLite Lead Log Warning]', leadErr);
    }

    // 3. Sync to Supabase Postgres (if table exists)
    try {
      await supabaseServer.from('custom_dev_leads').insert({
        email: effectiveEmail,
        name: effectiveName,
        phone: customer_phone || null,
        telegram: customer_telegram || null,
        platform: effectivePlatform,
        instrument: effectiveInstrument,
        timeframe: effectiveTimeframe,
        strategy_idea: raw_strategy_input || description,
        generated_prompt: description,
        status: 'pending_review',
      });
    } catch (supaErr) {
      // Graceful fallback if table is not yet in Supabase schema cache
    }

    // 4. Trigger Email Dispatch (Admin: supermegafx1@gmail.com & Client confirmation)
    sendStrategySubmissionNotifications({
      projectId,
      clientEmail: effectiveEmail,
      clientName: effectiveName,
      clientPhone: customer_phone,
      clientTelegram: customer_telegram,
      platform: effectivePlatform,
      instrument: effectiveInstrument,
      timeframe: effectiveTimeframe,
      packageTier: effectiveTier,
      title,
      strategyDescription: description,
      rawStrategyInput: raw_strategy_input,
      source: 'custom_ea_modal',
    }).catch(emailErr => {
      console.warn('[Email Dispatch Warning]', emailErr);
    });

    res.json({ success: true, project: created });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// DEDICATED STRATEGY SUBMISSIONS PIPELINE
// Decoupled architecture:
// 1. Database persistence (Local SQLite + Supabase PostgreSQL)
// 2. Email notification dispatch (Admin: supermegafx1@gmail.com + Client)
// ==============================================================================
app.post('/api/strategy-submissions', async (req, res) => {
  try {
    const {
      submission_id,
      user_id,
      full_name,
      email,
      phone,
      telegram,
      platform,
      strategy_title,
      original_strategy,
      structured_strategy,
      clear_strategy,
      generated_prompt,
      instrument,
      timeframe,
      direction,
      entry_conditions,
      exit_conditions,
      risk_management,
      trading_conditions,
      trade_management,
      additional_rules,
      missing_information,
      submission_type,
    } = req.body;

    // Validation
    if (!original_strategy || !original_strategy.trim()) {
      return res.status(400).json({ error: 'Original strategy description is required.' });
    }
    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 6) {
      return res.status(400).json({ error: 'Phone / WhatsApp Number is required.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const subId = submission_id || `SUB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const effectivePlatform = platform || 'MT5';
    const effectiveTitle = strategy_title || `Custom ${effectivePlatform} EA: ${instrument || 'Multi-Asset'}`;

    // STEP 1: DATABASE PERSISTENCE (Treat as Operation 1)
    let localSaved: any = null;
    let localError: string | null = null;
    try {
      localSaved = dbQueries.createStrategySubmission({
        id,
        user_id: user_id || null,
        submission_id: subId,
        full_name: full_name || 'Trader',
        email,
        phone,
        telegram: telegram || null,
        platform: effectivePlatform,
        strategy_title: effectiveTitle,
        original_strategy,
        structured_strategy: typeof structured_strategy === 'string' ? structured_strategy : JSON.stringify(structured_strategy || {}),
        clear_strategy: clear_strategy || null,
        generated_prompt: generated_prompt || null,
        instrument: instrument || null,
        timeframe: timeframe || null,
        direction: direction || null,
        entry_conditions: entry_conditions || null,
        exit_conditions: exit_conditions || null,
        risk_management: risk_management || null,
        trading_conditions: trading_conditions || null,
        trade_management: trade_management || null,
        additional_rules: additional_rules || null,
        missing_information: missing_information || null,
        status: 'submitted',
        email_status: 'pending',
      });

      // Also persist to custom_dev_leads and ea_projects for existing UI compatibility
      dbQueries.createProject({
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: user_id || 'usr_demo_customer',
        title: effectiveTitle,
        description: generated_prompt || clear_strategy || original_strategy,
        raw_strategy_input: original_strategy,
        platform: effectivePlatform,
        budget_tier: 'standard',
        customer_email: email,
        customer_name: full_name || 'Trader',
        customer_phone: phone,
        customer_telegram: telegram || null,
        instrument: instrument || 'Multi-Asset',
        timeframe: timeframe || '15-Minute',
      });
    } catch (dbErr: any) {
      console.error('[Database Save Error]', dbErr);
      localError = dbErr.message;
    }

    // Attempt Supabase PostgreSQL persistence
    let supabaseStatus = 'pending';
    let supabaseError: string | null = null;
    try {
      const { error: sbErr } = await supabaseServer.from('strategy_submissions').insert({
        id,
        user_id: user_id || null,
        submission_id: subId,
        full_name: full_name || 'Trader',
        email,
        phone,
        telegram: telegram || null,
        platform: effectivePlatform,
        strategy_title: effectiveTitle,
        original_strategy,
        structured_strategy: structured_strategy || {},
        clear_strategy: clear_strategy || null,
        generated_prompt: generated_prompt || null,
        instrument: instrument || null,
        timeframe: timeframe || null,
        direction: direction || null,
        entry_conditions: entry_conditions || null,
        exit_conditions: exit_conditions || null,
        risk_management: risk_management || null,
        trading_conditions: trading_conditions || null,
        trade_management: trade_management || null,
        additional_rules: additional_rules || null,
        missing_information: missing_information || null,
        status: 'submitted',
        email_status: 'pending',
      });

      if (sbErr) {
        supabaseStatus = 'error';
        supabaseError = sbErr.message;
        console.warn('[Supabase Strategy Sync Notice]', sbErr.message);
      } else {
        supabaseStatus = 'synced';
      }
    } catch (sbEx: any) {
      supabaseStatus = 'error';
      supabaseError = sbEx.message;
    }

    // STEP 2: EMAIL DISPATCH (Treat as Operation 2)
    // Dispatch to ADMIN (supermegafx1@gmail.com) and CLIENT
    let emailStatus = 'pending';
    let emailError: string | null = null;
    let emailSentAt: string | null = null;
    let adminEmailResult: any = null;
    let clientEmailResult: any = null;

    try {
      const dispatchResults = await sendStrategySubmissionNotifications({
        submissionId: subId,
        clientEmail: email,
        clientName: full_name || 'Trader',
        clientPhone: phone,
        clientTelegram: telegram || undefined,
        platform: effectivePlatform,
        strategyTitle: effectiveTitle,
        originalStrategy: original_strategy,
        structuredStrategy: structured_strategy,
        clearStrategy: clear_strategy,
        devPrompt: generated_prompt,
        instrument,
        timeframe,
        direction,
        entryConditions: entry_conditions,
        exitConditions: exit_conditions,
        riskManagement: risk_management,
        tradingConditions: trading_conditions,
        tradeManagement: trade_management,
        additionalRules: additional_rules,
        missingInformation: missing_information,
        submissionType: submission_type || 'AI Strategy Builder Submission',
        source: 'strategy_builder',
      });

      adminEmailResult = dispatchResults.adminResult;
      clientEmailResult = dispatchResults.clientResult;

      emailStatus = adminEmailResult.status;
      if (adminEmailResult.success) {
        emailSentAt = adminEmailResult.sentAt || new Date().toISOString();
      } else {
        emailError = adminEmailResult.error || 'Failed to dispatch email';
      }
    } catch (mailErr: any) {
      console.error('[Email Dispatch Error]', mailErr);
      emailStatus = 'failed';
      emailError = mailErr.message || 'Email service error';
    }

    // Record email status in local database
    try {
      dbQueries.updateStrategySubmissionEmailStatus(id, emailStatus, emailError, emailSentAt);
    } catch (updateErr) {
      console.warn('[DB Email Status Update Error]', updateErr);
    }

    // If Supabase is connected, update Supabase as well
    if (supabaseStatus === 'synced') {
      try {
        await supabaseServer.from('strategy_submissions').update({
          email_status: emailStatus,
          email_error: emailError,
          email_sent_at: emailSentAt,
          updated_at: new Date().toISOString(),
        }).eq('id', id);
      } catch (sbUpdateErr) {
        console.warn('[Supabase Email Status Update Warning]', sbUpdateErr);
      }
    }

    return res.json({
      success: true,
      submission_id: subId,
      id,
      database_saved: true,
      supabase_status: supabaseStatus,
      supabase_error: supabaseError,
      email_status: emailStatus,
      email_error: emailError,
      email_sent_at: emailSentAt,
      admin_notification: adminEmailResult,
      client_notification: clientEmailResult,
    });
  } catch (outerErr: any) {
    console.error('[Strategy Submission Fatal Error]', outerErr);
    return res.status(500).json({ error: outerErr.message || 'Internal submission error' });
  }
});

// Admin: Get all strategy submissions
app.get('/api/strategy-submissions', async (req, res) => {
  try {
    const list = dbQueries.getAllStrategySubmissions();
    res.json({ submissions: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Retry failed email
app.post('/api/strategy-submissions/:id/retry-email', async (req, res) => {
  try {
    const sub = dbQueries.getStrategySubmissionById(req.params.id) as any;
    if (!sub) {
      return res.status(404).json({ error: 'Strategy submission not found' });
    }

    const dispatchResults = await sendStrategySubmissionNotifications({
      submissionId: sub.submission_id,
      clientEmail: sub.email,
      clientName: sub.full_name,
      clientPhone: sub.phone,
      clientTelegram: sub.telegram,
      platform: sub.platform,
      strategyTitle: sub.strategy_title,
      originalStrategy: sub.original_strategy,
      structuredStrategy: sub.structured_strategy ? JSON.parse(sub.structured_strategy) : undefined,
      clearStrategy: sub.clear_strategy,
      devPrompt: sub.generated_prompt,
      instrument: sub.instrument,
      timeframe: sub.timeframe,
      direction: sub.direction,
      entryConditions: sub.entry_conditions,
      exitConditions: sub.exit_conditions,
      riskManagement: sub.risk_management,
      tradingConditions: sub.trading_conditions,
      tradeManagement: sub.trade_management,
      additionalRules: sub.additional_rules,
      missingInformation: sub.missing_information,
      submissionType: 'Manual Admin Retry',
      source: 'strategy_builder',
    });

    const emailStatus = dispatchResults.adminResult.status;
    const emailError = dispatchResults.adminResult.error || null;
    const emailSentAt = dispatchResults.adminResult.success ? new Date().toISOString() : null;

    dbQueries.updateStrategySubmissionEmailStatus(sub.id, emailStatus, emailError, emailSentAt);

    res.json({
      success: dispatchResults.adminResult.success,
      adminResult: dispatchResults.adminResult,
      clientResult: dispatchResults.clientResult,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Phase 2 Strategy Builder early interest registration
app.post('/api/strategy-builder/notify', async (req, res) => {
  const { email, strategyNotes, platform } = req.body;
  console.log(`[Phase 2 Interest Registered] Email: ${email}, Platform: ${platform}`);
  
  if (email) {
    try {
      dbQueries.recordCustomDevLead({
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: email.trim().toLowerCase(),
        name: 'Phase 2 Waitlist Trader',
        platform: platform || 'MetaTrader 5 (MQL5)',
        strategy_idea: strategyNotes || 'Early access reservation for Phase 2 Strategy Builder',
        status: 'waitlist_phase2',
      });
    } catch (dbErr) {
      console.warn('[Phase 2 Lead Log Warning]', dbErr);
    }
  }

  res.json({
    success: true,
    message: 'Thank you! You have been prioritized for the Phase 2 AI Strategy Builder private beta.'
  });
});

// Custom Dev Leads: Prompt Architect "Build This For Me" endpoint
const customDevLeadsStore: Array<any> = [];

app.post('/api/custom-dev-leads', async (req, res) => {
  try {
    const { email, name, phone, telegram, platform, instrument, timeframe, strategy_idea, generated_prompt } = req.body;
    if (!email || !strategy_idea) {
      return res.status(400).json({ error: 'Email and strategy idea are required.' });
    }

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const effectivePlatform = platform || 'MetaTrader 5 (MQL5)';
    const effectiveInstrument = instrument || 'All Forex / Metals';
    const effectiveTimeframe = timeframe || '15-Minute';

    const newLead = {
      id: leadId,
      email: email.trim().toLowerCase(),
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      telegram: telegram?.trim() || null,
      platform: effectivePlatform,
      instrument: effectiveInstrument,
      timeframe: effectiveTimeframe,
      strategy_idea,
      generated_prompt: generated_prompt || null,
      status: 'pending_review',
      created_at: new Date().toISOString()
    };

    customDevLeadsStore.unshift(newLead);
    console.log(`[Custom Dev Lead Registered] ${email} - Platform: ${newLead.platform}`);

    // 1. Record lead in SQLite
    try {
      dbQueries.recordCustomDevLead(newLead);
    } catch (dbErr) {
      console.warn('Could not record lead in local db:', dbErr);
    }

    // 2. Also register as a project in dbQueries for developer/admin visibility
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      dbQueries.createProject({
        id: projectId,
        user_id: 'usr_demo_customer',
        title: `Custom EA Brief: ${effectivePlatform} (${effectiveInstrument})`,
        description: `Lead from ${email} (${name || 'Trader'}):\n\nStrategy Idea:\n${strategy_idea}\n\nGenerated Prompt:\n${generated_prompt || 'N/A'}`,
        raw_strategy_input: strategy_idea,
        platform: effectivePlatform,
        budget_tier: 'Custom',
        customer_email: email.trim().toLowerCase(),
        customer_name: name?.trim() || null,
        customer_phone: phone?.trim() || null,
        customer_telegram: telegram?.trim() || null,
        instrument: effectiveInstrument,
        timeframe: effectiveTimeframe,
      });
    } catch (dbErr) {
      console.warn('Could not auto-create project record in local db:', dbErr);
    }

    // 3. Sync to Supabase
    try {
      await supabaseServer.from('custom_dev_leads').insert({
        email: email.trim().toLowerCase(),
        name: name?.trim() || null,
        phone: phone?.trim() || null,
        telegram: telegram?.trim() || null,
        platform: effectivePlatform,
        instrument: effectiveInstrument,
        timeframe: effectiveTimeframe,
        strategy_idea,
        generated_prompt: generated_prompt || null,
        status: 'pending_review',
      });
    } catch (supaErr) {
      // Graceful fallback if table is not yet in Supabase schema cache
    }

    // 4. Send Email Notifications (Admin + Client Confirmation)
    sendStrategySubmissionNotifications({
      projectId: leadId,
      clientEmail: email.trim().toLowerCase(),
      clientName: name?.trim(),
      clientPhone: phone?.trim(),
      clientTelegram: telegram?.trim(),
      platform: effectivePlatform,
      instrument: effectiveInstrument,
      timeframe: effectiveTimeframe,
      packageTier: 'Custom Development',
      title: `Custom EA Brief: ${effectivePlatform} (${effectiveInstrument})`,
      strategyDescription: strategy_idea,
      rawStrategyInput: strategy_idea,
      devPrompt: generated_prompt,
      source: 'lead_form',
    }).catch(emailErr => {
      console.warn('[Email Dispatch Warning]', emailErr);
    });

    res.json({
      success: true,
      message: 'Your institutional custom development project brief has been submitted.',
      leadId,
      projectId
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record lead.' });
  }
});

app.get('/api/custom-dev-leads', (req, res) => {
  try {
    const dbLeads = dbQueries.getAllCustomDevLeads();
    if (dbLeads && dbLeads.length > 0) {
      return res.json({ leads: dbLeads });
    }
  } catch {
    // fallback to in-memory store
  }
  res.json({ leads: customDevLeadsStore });
});

app.get('/api/admin/email-logs', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const logs = dbQueries.getAllEmailLogs();
    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Academy Student Progress Tracking (Supabase Auth & Database Sync)
// -------------------------------------------------------------

app.post('/api/academy/progress', async (req, res) => {
  try {
    const user = await resolveAuthUser(req);
    const { email, completedLessonIds, quizScores, lastLessonId } = req.body;
    const targetEmail = user?.email || (typeof email === 'string' && email.includes('@') ? email.toLowerCase().trim() : null);
    const targetUserId = user?.userId || null;
    const lessonsList: string[] = Array.isArray(completedLessonIds) ? completedLessonIds : [];

    if (!targetUserId && !targetEmail) {
      return res.status(400).json({ error: 'Authentication or a valid email address is required to track progress.' });
    }

    // 1. Save to user_lesson_progress table in SQLite if user is authenticated
    if (targetUserId) {
      for (const lid of lessonsList) {
        dbQueries.saveUserLessonProgress(targetUserId, lid, true);
      }
    }

    // 2. Save to academy_progress table in SQLite if email is available
    let saved: any = null;
    if (targetEmail) {
      saved = dbQueries.saveAcademyProgress({
        email: targetEmail,
        completedLessonIds: lessonsList,
        quizScores: quizScores || {},
        lastLessonId: lastLessonId || undefined
      });
    }

    // 3. Synchronize to Supabase non-blockingly
    if (targetEmail) {
      syncAcademyProgressToSupabase({
        email: targetEmail,
        completedLessonIds: lessonsList,
        quizScores: quizScores || {},
        lastLessonId: lastLessonId || undefined
      }).catch(err => console.log('[Supabase Progress Sync Notice]', err.message));
    }

    res.json({
      success: true,
      userId: targetUserId,
      email: targetEmail,
      completedLessonIds: targetUserId ? dbQueries.getUserCompletedLessons(targetUserId) : lessonsList,
      progress: saved
    });
  } catch (err: any) {
    console.error('Error saving academy progress:', err);
    res.status(500).json({ error: err.message || 'Failed to save progress.' });
  }
});

app.get('/api/academy/progress', async (req, res) => {
  try {
    const user = await resolveAuthUser(req);
    const queryEmail = (req.query.email as string)?.toLowerCase()?.trim();
    const targetEmail = user?.email || (queryEmail && queryEmail.includes('@') ? queryEmail : null);
    const targetUserId = user?.userId || null;

    let completedLessonIds: string[] = [];
    let progressRecord: any = null;

    if (targetUserId) {
      completedLessonIds = dbQueries.getUserCompletedLessons(targetUserId);
    }

    if (targetEmail) {
      progressRecord = dbQueries.getAcademyProgress(targetEmail);
      if (progressRecord?.completed_lesson_ids) {
        completedLessonIds = Array.from(new Set([...completedLessonIds, ...progressRecord.completed_lesson_ids]));
      }
    }

    if (!targetUserId && !targetEmail) {
      return res.status(400).json({ error: 'Authentication or email query parameter is required.' });
    }

    res.json({
      found: completedLessonIds.length > 0 || !!progressRecord,
      completedLessonIds,
      progress: progressRecord,
      source: targetUserId ? 'user_account' : 'email_tracking'
    });
  } catch (err: any) {
    console.error('Error fetching academy progress:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch progress.' });
  }
});

// -------------------------------------------------------------
// MEGA AI Assistant — Master System Prompt API
// -------------------------------------------------------------

app.post('/api/mega-ai/chat', async (req, res) => {
  try {
    const { message, history = [], currentView } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A valid text message is required.' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback: Signal client to utilize embedded deterministic logic
      return res.json({
        fallback: true,
        reply: null,
        message: 'No GEMINI_API_KEY environment variable provided. Falling back to local intelligence.'
      });
    }

    // Prepare conversational turns
    const contents: any[] = [];

    // Inject situational context if available
    if (currentView) {
      contents.push({
        role: 'user',
        parts: [{ text: `[Context: The visitor is currently browsing the "${currentView}" section of MEG.AI / SuperMegaFX.]` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: `Understood. I will guide the visitor with full awareness that they are viewing "${currentView}".` }]
      });
    }

    // Add recent conversational context
    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    for (const msg of recentHistory) {
      if (msg && msg.content) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(msg.content) }]
        });
      }
    }

    // Add current user turn
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: MEGA_AI_MASTER_SYSTEM_PROMPT,
        temperature: 0.5,
      }
    });

    const reply = response.text || '';
    res.json({ success: true, reply });
  } catch (err: any) {
    console.error('Error invoking Gemini for MEGA AI:', err);
    res.json({
      fallback: true,
      error: err.message || 'Gemini generation error',
      reply: null
    });
  }
});

// -------------------------------------------------------------
// Strategy Architect — Truly AI-Driven Interpretation API
// -------------------------------------------------------------

app.post('/api/strategy/interpret-ai', async (req, res) => {
  try {
    const { buildType = 'EA', description, conversation = [], platform = 'MT5' } = req.body;
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'A valid strategy description is required.' });
    }

    const ai = getGenAI();
    const result = await interpretStrategyWithGemini(ai, {
      buildType: buildType === 'Indicator' ? 'Indicator' : 'EA',
      description,
      conversation,
      platform,
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/strategy/interpret-ai:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Strategy interpretation failed',
    });
  }
});

// -------------------------------------------------------------
// Protected Free eBook Delivery Endpoints
// -------------------------------------------------------------

/**
 * POST /api/ebooks/request-free-download
 * Validates the email, records the email lead in database and Supabase,
 * and generates a time-limited signed download token (valid 15 minutes).
 */
app.post('/api/ebooks/request-free-download', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'A valid email address is required to receive the free eBook.',
        code: 'INVALID_EMAIL',
      });
    }

    // Capture and persist email lead to SQLite and Supabase
    await processEmailLead(email, name);

    // Generate cryptographic HMAC-SHA256 signed token (valid for 15 minutes = 900 seconds)
    const validitySeconds = 900;
    const { token, expiresAt } = generateSignedToken(email, 'free_lead_magnet_traders_guide', validitySeconds);
    const downloadUrl = `/api/ebooks/download?token=${token}`;

    return res.json({
      success: true,
      message: 'Email verified. Your temporary authorized download link is ready.',
      downloadUrl,
      expiresAt,
      validitySeconds,
    });
  } catch (err: any) {
    console.error('Error in /api/ebooks/request-free-download:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process download request. Please try again.',
    });
  }
});

/**
 * GET /api/ebooks/download
 * Verifies that the request has a valid, non-expired cryptographic token.
 * Streams the protected PDF strictly as an attachment with no-cache headers.
 */
app.get('/api/ebooks/download', async (req, res) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      return res.status(403).json({
        error: 'Access denied: Download token is required. Please submit your email on the books page.',
        code: 'TOKEN_REQUIRED',
      });
    }

    const verification = verifySignedToken(token);
    if (!verification.valid || !verification.email) {
      return res.status(403).json({
        error: `Access denied: ${verification.reason || 'Invalid or expired download link'}. Please submit your email to request a new link.`,
        code: 'TOKEN_INVALID_OR_EXPIRED',
      });
    }

    // Ensure protected PDF is ready in private server storage
    const pdfPath = getProtectedPdfPath();
    if (!fs.existsSync(pdfPath)) {
      await ensureProtectedPdfExists();
    }

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({
        error: 'The requested eBook is temporarily unavailable. Please contact support.',
        code: 'FILE_UNAVAILABLE',
      });
    }

    // Track download occurrence in database
    dbQueries.incrementEmailLeadDownload(verification.email);

    // Stream PDF with attachment and strict anti-caching headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="The-Traders-Guide-to-Understanding-Strategy-Automation.pdf"');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);
  } catch (err: any) {
    console.error('Error in /api/ebooks/download:', err);
    return res.status(500).json({
      error: 'Failed to stream protected file.',
      code: 'DOWNLOAD_STREAM_ERROR',
    });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------

async function startServer() {
  // Ensure private eBook storage is provisioned
  await ensureProtectedPdfExists();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EA Automation Hub] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
