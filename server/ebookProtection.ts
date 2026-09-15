import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import { createClient } from '@supabase/supabase-js';
import { dbQueries } from './db.js';
import { dispatchEmail } from './emailService.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xbrhalmcvpxutxojemoj.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Master HMAC Secret for signed download URLs (derived from environment or secure fallback)
const EBOOK_SIGNING_SECRET = process.env.EBOOK_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'megai-traders-guide-secure-salt-2026-auth';

// Private storage directory (outside public/ and static web roots)
const PRIVATE_STORAGE_DIR = path.join(process.cwd(), 'server', 'private_storage');
const EBOOK_FILENAME = 'The_Traders_Guide_to_Understanding_Strategy_Automation.pdf';
const EBOOK_FILE_PATH = path.join(PRIVATE_STORAGE_DIR, EBOOK_FILENAME);

// Upstream storage source for initialization/caching if needed
const UPSTREAM_PUBLIC_URL = `https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/The%20Trader's%20Guide%20to%20Understanding%20Strategy%20Automation.pdf`;

// Supabase client (anon and optional admin/service-role)
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || 'dummy_key');
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

/**
 * Ensures the private storage directory and the protected PDF file exist.
 */
export async function ensureProtectedPdfExists(): Promise<boolean> {
  try {
    if (!fs.existsSync(PRIVATE_STORAGE_DIR)) {
      fs.mkdirSync(PRIVATE_STORAGE_DIR, { recursive: true });
    }

    if (fs.existsSync(EBOOK_FILE_PATH) && fs.statSync(EBOOK_FILE_PATH).size > 10000) {
      return true;
    }

    // If file is not yet cached locally, securely fetch and store in private storage
    console.log('[EbookProtection] Initializing private storage for free ebook PDF...');
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(EBOOK_FILE_PATH);
      https.get(UPSTREAM_PUBLIC_URL, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          return reject(new Error(`Failed to fetch upstream PDF: status ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[EbookProtection] Protected PDF cached successfully (${fs.statSync(EBOOK_FILE_PATH).size} bytes)`);
          resolve();
        });
      }).on('error', (err) => {
        try { fs.unlinkSync(EBOOK_FILE_PATH); } catch (_) {}
        reject(err);
      });
    });

    // If Supabase service role key is available, ensure private bucket exists in Supabase
    if (supabaseAdmin) {
      try {
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        const hasProtectedBucket = buckets?.some(b => b.name === 'protected-ebooks');
        if (!hasProtectedBucket) {
          await supabaseAdmin.storage.createBucket('protected-ebooks', { public: false });
          console.log('[EbookProtection] Created private Supabase Storage bucket: protected-ebooks');
        }
        // Upload to private bucket if not exists
        const pdfBuffer = fs.readFileSync(EBOOK_FILE_PATH);
        await supabaseAdmin.storage.from('protected-ebooks').upload(
          'The Trader\'s Guide to Understanding Strategy Automation.pdf',
          pdfBuffer,
          { contentType: 'application/pdf', upsert: true }
        );
      } catch (adminErr: any) {
        console.warn('[EbookProtection] Supabase private bucket sync note:', adminErr?.message || adminErr);
      }
    }

    return true;
  } catch (err) {
    console.error('[EbookProtection] Error ensuring protected PDF exists:', err);
    return false;
  }
}

/**
 * Validates email format strictly.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim();
  if (clean.length < 5 || clean.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(clean);
}

/**
 * Generates a cryptographically signed download token valid for a specific duration (default 15 minutes).
 */
export function generateSignedToken(email: string, bookId: string = 'free_lead_magnet_traders_guide', validitySeconds: number = 900): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + validitySeconds * 1000;
  const payload = JSON.stringify({ email: email.trim().toLowerCase(), bookId, exp: expiresAt });
  const payloadB64 = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', EBOOK_SIGNING_SECRET)
    .update(`${payloadB64}:${expiresAt}`)
    .digest('hex');
  return {
    token: `${payloadB64}.${signature}`,
    expiresAt,
  };
}

/**
 * Verifies a signed token. Returns the decoded email and bookId if valid and not expired.
 */
export function verifySignedToken(token: string): { valid: boolean; email?: string; bookId?: string; reason?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Token missing' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Malformed token structure' };
  }

  const [payloadB64, signature] = parts;
  let decoded: { email: string; bookId: string; exp: number };
  try {
    decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'Invalid token encoding' };
  }

  if (!decoded.email || !decoded.exp) {
    return { valid: false, reason: 'Incomplete token payload' };
  }

  const expectedSignature = crypto.createHmac('sha256', EBOOK_SIGNING_SECRET)
    .update(`${payloadB64}:${decoded.exp}`)
    .digest('hex');

  if (signature !== expectedSignature) {
    return { valid: false, reason: 'Invalid signature' };
  }

  if (Date.now() > decoded.exp) {
    return { valid: false, reason: 'Token expired' };
  }

  return {
    valid: true,
    email: decoded.email,
    bookId: decoded.bookId || 'free_lead_magnet_traders_guide',
  };
}

/**
 * Saves the email lead to SQLite and Supabase, and notifies Admin.
 */
export async function processEmailLead(email: string, name?: string | null): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const leadId = `lead_ebook_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

  // 1. Record in local SQLite persistent database
  try {
    dbQueries.recordEmailLead({
      id: leadId,
      email: cleanEmail,
      name: name || null,
      source: 'free_ebook_email_gate',
      bookId: 'free_lead_magnet_traders_guide',
    });
  } catch (dbErr) {
    console.error('[EbookProtection] Error recording email lead in SQLite:', dbErr);
  }

  // 2. Attempt to record lead in Supabase custom_dev_leads or email_leads if table exists
  try {
    const supabaseClient = supabaseAdmin || supabaseAnon;
    await supabaseClient.from('email_leads').insert([
      {
        id: leadId,
        email: cleanEmail,
        name: name || null,
        source: 'free_ebook_download',
        book_id: 'The Trader\'s Guide to Understanding Strategy Automation',
        created_at: new Date().toISOString(),
      },
    ]);
  } catch {
    // If email_leads table does not exist in Supabase schema yet, try custom_dev_leads
    try {
      const supabaseClient = supabaseAdmin || supabaseAnon;
      await supabaseClient.from('custom_dev_leads').insert([
        {
          id: leadId,
          email: cleanEmail,
          name: name || 'eBook Reader',
          strategy_idea: 'Free eBook Download: The Trader\'s Guide to Understanding Strategy Automation',
          status: 'ebook_downloaded',
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      // Graceful fallback; local SQLite persistence has captured the lead
    }
  }

  // 3. Send notification to admin email
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'supermegafx1@gmail.com';
    await dispatchEmail({
      to: adminEmail,
      subject: `[MEGA AI Lead] New Free eBook Lead: ${cleanEmail}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #047857; margin-top: 0;">New Free eBook Download Captured</h2>
          <p>A new visitor requested the protected guide via the verified email gate.</p>
          <ul style="line-height: 1.8;">
            <li><strong>Email:</strong> ${cleanEmail}</li>
            <li><strong>Name:</strong> ${name || 'Trader'}</li>
            <li><strong>Asset:</strong> The Trader's Guide to Understanding Strategy Automation</li>
            <li><strong>Lead ID:</strong> ${leadId}</li>
            <li><strong>Time:</strong> ${new Date().toUTCString()}</li>
          </ul>
        </div>
      `,
      source: 'ebook_lead_gate',
      referenceId: leadId,
    });
  } catch (emailErr) {
    console.warn('[EbookProtection] Admin notification warning:', emailErr);
  }
}

/**
 * Returns the path to the protected PDF file.
 */
export function getProtectedPdfPath(): string {
  return EBOOK_FILE_PATH;
}
