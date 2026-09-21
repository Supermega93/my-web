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
 * Saves the email lead to SQLite and Supabase, delivers the eBook to the user's email, and notifies Admin.
 */
export async function processEmailLead(email: string, name?: string | null, downloadUrl?: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const displayName = name?.trim() || 'Trader';
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

  // 2. Attempt to record lead in Supabase custom_dev_leads or email_leads if table exists (non-blocking with timeout)
  try {
    const supabaseClient = supabaseAdmin || supabaseAnon;
    const insertPromise = supabaseClient.from('email_leads').insert([
      {
        id: leadId,
        email: cleanEmail,
        name: name || null,
        source: 'free_ebook_download',
        book_id: 'The Trader\'s Guide to Understanding Strategy Automation',
        created_at: new Date().toISOString(),
      },
    ]);
    // 3 second safety timeout for Supabase lead recording
    await Promise.race([
      insertPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase lead insert timeout')), 3000)),
    ]);
  } catch {
    // If email_leads table does not exist in Supabase schema yet, try custom_dev_leads
    try {
      const supabaseClient = supabaseAdmin || supabaseAnon;
      await supabaseClient.from('custom_dev_leads').insert([
        {
          id: leadId,
          email: cleanEmail,
          name: displayName,
          strategy_idea: 'Free eBook Download: The Trader\'s Guide to Understanding Strategy Automation',
          status: 'ebook_downloaded',
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      // Graceful fallback; local SQLite persistence has captured the lead
    }
  }

  // 3. Dispatch eBook delivery email directly to the USER
  try {
    const fallbackUrl = 'https://ai.studio';
    const activeDownloadLink = downloadUrl || fallbackUrl;

    await dispatchEmail({
      to: cleanEmail,
      subject: `Your Free Copy: The Trader's Guide to Understanding Strategy Automation (PDF)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f17; color: #e2e8f0; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
          <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%); padding: 30px; text-align: left;">
            <span style="display: inline-block; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; background: rgba(0,0,0,0.35); color: #6ee7b7; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; font-weight: bold;">
              Official Blueprint Delivery
            </span>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
              The Trader's Guide to Understanding Strategy Automation
            </h1>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #a7f3d0; font-family: monospace;">
              By M. Dinga &bull; MEG.AI Quantitative Research
            </p>
          </div>

          <div style="padding: 26px 30px;">
            <p style="font-size: 15px; color: #cbd5e1; margin-top: 0; line-height: 1.6;">
              Hello <strong>${escapeHtml(displayName)}</strong>,
            </p>
            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
              Thank you for requesting your complimentary copy of <strong>The Trader's Guide to Understanding Strategy Automation</strong>. Your authorized electronic edition is ready for instant download.
            </p>

            <!-- CALL TO ACTION BUTTON -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${activeDownloadLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: bold; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                ⬇️ Download eBook (PDF) Now
              </a>
              <p style="font-size: 11px; color: #64748b; margin-top: 10px; font-family: monospace;">
                Link valid for immediate download &bull; Save to your computer or phone
              </p>
            </div>

            <!-- CORE BLUEPRINT SUMMARY -->
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #10b981; margin: 0 0 12px 0; letter-spacing: 1px; font-weight: bold;">
                WHAT YOU WILL LEARN INSIDE:
              </h2>
              <ul style="font-size: 13px; color: #cbd5e1; line-height: 1.7; padding-left: 20px; margin: 0;">
                <li><strong>The 5 Core Algorithmic Tenets:</strong> Turning vague discretionary "market feel" into mathematically testable rules.</li>
                <li><strong>Avoiding Over-Optimization:</strong> Why curve-fitting to historical data destroys live trading accounts and how to run walk-forward tests.</li>
                <li><strong>Dynamic Risk Management:</strong> Calculating true lot sizes using real-time equity and ATR rather than static arbitrary lots.</li>
                <li><strong>High-Impact Event Shields:</strong> Programmatic filters that avoid spreads during FOMC, NFP, and CPI releases.</li>
                <li><strong>Transition to MQL5 & Python:</strong> How to format your strategy specifications for institutional developers or coding.</li>
              </ul>
            </div>

            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 16px; font-size: 13px; color: #a7f3d0; line-height: 1.5;">
              💡 <strong>Next Step:</strong> Want to build your first Expert Advisor without coding? Check out the interactive <strong>Strategy Architect Academy</strong> in our platform for free step-by-step masterclasses.
            </div>

            <div style="border-top: 1px solid #1e293b; margin-top: 26px; padding-top: 18px; font-size: 12px; color: #64748b; text-align: center;">
              Need support or custom EA development? Reply directly to this email or reach us at <a href="mailto:supermegafx1@gmail.com" style="color: #10b981; text-decoration: none;">supermegafx1@gmail.com</a>.
            </div>
          </div>
        </div>
      `,
      source: 'ebook_user_delivery',
      referenceId: leadId,
    });
  } catch (userEmailErr) {
    console.warn('[EbookProtection] User delivery email warning:', userEmailErr);
  }

  // 4. Send notification to admin email
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
            <li><strong>Name:</strong> ${displayName}</li>
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

function escapeHtml(text?: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Returns the path to the protected PDF file.
 */
export function getProtectedPdfPath(): string {
  return EBOOK_FILE_PATH;
}
