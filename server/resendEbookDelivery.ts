import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Supabase permanent public storage URL for the original eBook
export const ORIGINAL_EBOOK_STORAGE_URL = "https://xbrhalmcvpxutxojemoj.supabase.co/storage/v1/object/public/storefront-media/The%20Trader's%20Guide%20to%20Understanding%20Strategy%20Automation.pdf";

// Local path to the original protected eBook file
const LOCAL_ORIGINAL_PDF_PATH = path.join(process.cwd(), 'server', 'private_storage', 'The_Traders_Guide_to_Understanding_Strategy_Automation.pdf');

export interface SendEbookResult {
  success: boolean;
  messageId?: string;
  error?: string;
  errorCode?: string;
  statusCode?: number;
}

/**
 * Validates Resend configuration and credentials.
 */
export function checkResendConfig(): { configured: boolean; apiKeyPresent: boolean; sender: string } {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM || 'MEGA AI Quantitative <onboarding@resend.dev>';
  return {
    configured: Boolean(apiKey && apiKey.trim().length > 0),
    apiKeyPresent: Boolean(apiKey && apiKey.trim().length > 0),
    sender,
  };
}

/**
 * Sends the Free eBook via Resend to the recipient.
 */
export async function sendFreeEbookWithResend(params: {
  email: string;
  name?: string;
  customDownloadUrl?: string;
}): Promise<SendEbookResult> {
  const cleanEmail = params.email.trim().toLowerCase();
  const displayName = params.name?.trim() || 'Trader';
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    console.error('[Resend Service] RESEND_API_KEY environment variable is not configured.');
    return {
      success: false,
      error: 'Resend email service is not configured. Missing RESEND_API_KEY.',
      errorCode: 'MISSING_API_KEY',
      statusCode: 500,
    };
  }

  // Determine authorized sender
  // In Resend sandbox mode, only onboarding@resend.dev is allowed until a domain is verified.
  const fromSender = process.env.RESEND_FROM || 'MEGA AI Quantitative <onboarding@resend.dev>';

  // Locate the ORIGINAL ebook file for attachment
  let pdfBuffer: Buffer | null = null;
  if (fs.existsSync(LOCAL_ORIGINAL_PDF_PATH)) {
    try {
      pdfBuffer = fs.readFileSync(LOCAL_ORIGINAL_PDF_PATH);
      console.log(`[Resend Service] Located original eBook PDF (${pdfBuffer.length} bytes)`);
    } catch (readErr) {
      console.warn('[Resend Service] Could not read local PDF buffer:', readErr);
    }
  } else {
    console.warn(`[Resend Service] Local original eBook PDF not found at ${LOCAL_ORIGINAL_PDF_PATH}`);
  }

  // Determine production download link
  // MUST point to the actual original ebook.
  // Never localhost, temporary preview URLs, or fake links.
  const downloadButtonUrl = ORIGINAL_EBOOK_STORAGE_URL;

  // Branded HTML email template
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>The Trader's Guide to Understanding Strategy Automation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f17; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; text-align: left;" cellspacing="0" cellpadding="0">
          
          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%); padding: 32px 30px;">
              <span style="display: inline-block; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; background: rgba(0,0,0,0.35); color: #6ee7b7; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; font-weight: bold;">
                Official Blueprint Delivery
              </span>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                The Trader's Guide to Understanding Strategy Automation
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #a7f3d0; font-family: monospace;">
                By M. Dinga &bull; MEGA AI Quantitative Research
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 28px 30px;">
              <p style="font-size: 15px; color: #cbd5e1; margin-top: 0; line-height: 1.6;">
                Hello <strong>${escapeHtml(displayName)}</strong>,
              </p>
              <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
                Your complimentary copy of <strong>The Trader's Guide to Understanding Strategy Automation</strong> is ready.
                ${pdfBuffer ? 'The complete PDF document is attached directly to this email for instant reading.' : 'You can download the full guide below.'}
              </p>

              <!-- DOWNLOAD BUTTON -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${downloadButtonUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 34px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                  Download Your Free Guide
                </a>
                <p style="font-size: 11px; color: #64748b; margin-top: 10px; font-family: monospace;">
                  Original PDF &bull; High-Speed Cloud Storage CDN
                </p>
              </div>

              <!-- BLUEPRINT HIGHLIGHTS -->
              <div style="background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #10b981; margin: 0 0 12px 0; letter-spacing: 1px; font-weight: bold;">
                  WHAT YOU WILL DISCOVER INSIDE:
                </h2>
                <ul style="font-size: 13px; color: #cbd5e1; line-height: 1.7; padding-left: 20px; margin: 0;">
                  <li><strong>The 5 Core Algorithmic Tenets:</strong> Converting discretionary intuition into strict quantitative rules.</li>
                  <li><strong>Avoiding Over-Optimization:</strong> Preventing curve-fitting to historical tick data.</li>
                  <li><strong>Dynamic Risk Management:</strong> Dynamic lot sizing derived from ATR and portfolio equity.</li>
                  <li><strong>News & High-Impact Shields:</strong> Avoiding slippage during major central bank announcements.</li>
                  <li><strong>Translating Rules to MQL5:</strong> Clear specifications for automated Expert Advisors.</li>
                </ul>
              </div>

              <div style="background-color: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 16px; font-size: 13px; color: #a7f3d0; line-height: 1.5;">
                💡 <strong>Next Step:</strong> Explore the <strong>Strategy Architect Academy</strong> on our website to learn how to design, test, and deploy automated trading robots with AI.
              </div>

              <div style="border-top: 1px solid #1e293b; margin-top: 26px; padding-top: 18px; font-size: 12px; color: #64748b; text-align: center;">
                Delivered via Resend Transactional Email &bull; MEGA AI Labs &bull; <a href="mailto:supermegafx1@gmail.com" style="color: #10b981; text-decoration: none;">supermegafx1@gmail.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const resend = new Resend(apiKey);

    console.log(`[Resend Service] Calling Resend API to dispatch eBook email to: ${cleanEmail}`);
    console.log(`[Resend Service] Sender: ${fromSender}`);

    const payload: any = {
      from: fromSender,
      to: [cleanEmail],
      subject: "The Trader's Guide to Understanding Strategy Automation",
      html: emailHtml,
    };

    if (pdfBuffer) {
      payload.attachments = [
        {
          filename: 'The-Traders-Guide-to-Understanding-Strategy-Automation.pdf',
          content: pdfBuffer,
        },
      ];
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error('[Resend Service] Resend rejected the dispatch:', error);

      // Check specific Resend error types
      let clientErrorMessage = error.message || 'Resend was unable to deliver the email.';
      let errorCode = 'RESEND_REJECTED';

      if (error.statusCode === 403 && (error.name === 'validation_error' || error.message?.includes('testing emails'))) {
        clientErrorMessage = `Resend test account restricted to admin email (supermegafx1@gmail.com). To deliver to ${cleanEmail}, verify domain supermegafx.com in Resend at https://resend.com/domains.`;
        errorCode = 'UNVERIFIED_DOMAIN_RESTRICTION';
      } else if (error.statusCode === 401) {
        clientErrorMessage = 'Resend API authentication failed. Please verify RESEND_API_KEY.';
        errorCode = 'INVALID_API_KEY';
      } else if (error.statusCode === 422) {
        clientErrorMessage = `Resend validation error: ${error.message}`;
        errorCode = 'VALIDATION_ERROR';
      }

      return {
        success: false,
        error: clientErrorMessage,
        errorCode,
        statusCode: error.statusCode || 422,
      };
    }

    if (data?.id) {
      console.log(`[Resend Service] Resend successfully accepted email: ID ${data.id}`);
      return {
        success: true,
        messageId: data.id,
      };
    }

    return {
      success: false,
      error: 'Resend did not return a confirmation message ID.',
      errorCode: 'NO_MESSAGE_ID',
      statusCode: 500,
    };
  } catch (err: any) {
    console.error('[Resend Service] Network/API exception calling Resend:', err);
    return {
      success: false,
      error: err.message || 'Network failure communicating with Resend API.',
      errorCode: 'NETWORK_FAILURE',
      statusCode: 502,
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
