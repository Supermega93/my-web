import { dbQueries } from './db.ts';
import nodemailer from 'nodemailer';

export interface StrategyEmailPayload {
  submissionId?: string;
  projectId?: string;
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  clientTelegram?: string;
  platform: string;
  strategyTitle?: string;
  title?: string;
  strategyDescription?: string;
  rawStrategyInput?: string;
  originalStrategy?: string;
  structuredStrategy?: any;
  clearStrategy?: string;
  devPrompt?: string;
  instrument?: string;
  timeframe?: string;
  direction?: string;
  entryConditions?: string;
  exitConditions?: string;
  riskManagement?: string;
  tradingConditions?: string;
  tradeManagement?: string;
  additionalRules?: string;
  missingInformation?: string;
  submissionType?: string;
  packageTier?: string;
  budgetTier?: string;
  source: 'strategy_builder' | 'custom_ea_modal' | 'lead_form';
}

export interface EmailDispatchResult {
  success: boolean;
  status: 'sent' | 'failed' | 'failed_no_provider';
  error?: string;
  id?: string;
  sentAt?: string;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'supermegafx1@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.RESEND_FROM || 'MegaFX Automation <onboarding@resend.dev>';

/**
 * Dispatch strategy development notification to both Admin and Client
 */
export async function sendStrategySubmissionNotifications(payload: StrategyEmailPayload): Promise<{
  adminResult: EmailDispatchResult;
  clientResult?: EmailDispatchResult;
}> {
  const submissionId = payload.submissionId || payload.projectId || `SUB-${Date.now()}`;
  const submissionDate = new Date().toUTCString();

  // 1. Compile Admin Notification
  const adminSubject = `[MEGA AI Lead] Custom ${payload.platform} EA: ${payload.instrument || 'Multi-Asset'} (${payload.timeframe || 'M15'}) — ${payload.clientName || payload.clientEmail}`;

  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; background: #0b0f17; color: #e2e8f0; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%); padding: 30px; text-align: left;">
        <span style="display: inline-block; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; background: rgba(0,0,0,0.35); color: #6ee7b7; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; font-weight: bold;">
          New Strategy Submission
        </span>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">
          ${payload.strategyTitle || `Custom ${payload.platform} EA: ${payload.instrument || 'Multi-Asset'}`}
        </h1>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #a7f3d0; font-family: monospace;">
          Reference ID: <strong>${submissionId}</strong> &bull; ${submissionDate}
        </p>
      </div>

      <div style="padding: 26px 30px;">
        <!-- CLIENT INFORMATION -->
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #10b981; margin: 0 0 14px 0; letter-spacing: 1px; font-weight: bold;">
            CLIENT INFORMATION
          </h2>
          <table style="width: 100%; font-size: 13px; color: #cbd5e1; border-collapse: collapse;">
            <tr><td style="padding: 5px 0; color: #64748b; width: 160px; font-weight: 600;">Full Name:</td><td><strong style="color: #ffffff;">${payload.clientName || 'Trader'}</strong></td></tr>
            <tr><td style="padding: 5px 0; color: #64748b; font-weight: 600;">Email Address:</td><td><strong style="color: #38bdf8;">${payload.clientEmail}</strong></td></tr>
            <tr><td style="padding: 5px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td><td><strong style="color: #34d399; font-size: 14px;">${payload.clientPhone}</strong></td></tr>
            ${payload.clientTelegram ? `<tr><td style="padding: 5px 0; color: #64748b; font-weight: 600;">Telegram:</td><td><strong style="color: #38bdf8;">${payload.clientTelegram}</strong></td></tr>` : ''}
            <tr><td style="padding: 5px 0; color: #64748b; font-weight: 600;">Target Platform:</td><td><span style="background: #1e293b; color: #34d399; padding: 2px 8px; border-radius: 6px; font-family: monospace; font-weight: bold;">${payload.platform}</span></td></tr>
          </table>
        </div>

        <!-- SUBMISSION INFORMATION -->
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #10b981; margin: 0 0 14px 0; letter-spacing: 1px; font-weight: bold;">
            SUBMISSION TELEMETRY
          </h2>
          <table style="width: 100%; font-size: 13px; color: #cbd5e1; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b; width: 160px;">Submission ID:</td><td style="font-family: monospace; color: #a7f3d0;">${submissionId}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Date & Time:</td><td>${submissionDate}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Submission Type:</td><td>${payload.submissionType || 'AI Strategy Builder Submission'}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Asset / Instrument:</td><td><strong>${payload.instrument || 'Not specified'}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Timeframe:</td><td><strong>${payload.timeframe || 'Not specified'}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Direction:</td><td>${payload.direction || 'Both (Long & Short)'}</td></tr>
          </table>
        </div>

        <!-- 1. ORIGINAL CLIENT STRATEGY (PRIMARY SOURCE OF TRUTH) -->
        <div style="background: #111827; border: 1px solid #059669; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #34d399; margin: 0; letter-spacing: 1px; font-weight: bold;">
              ORIGINAL CLIENT STRATEGY (SOURCE OF TRUTH)
            </h2>
            <span style="font-size: 10px; font-family: monospace; color: #6ee7b7; background: #064e3b; padding: 2px 6px; border-radius: 4px;">VERBATIM USER INPUT</span>
          </div>
          <div style="background: #090d14; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.65; color: #f1f5f9; white-space: pre-wrap;">${escapeHtml(payload.originalStrategy)}</div>
        </div>

        <!-- 2. TECHNICAL SPECIFICATIONS & DERIVED RULES -->
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #10b981; margin: 0 0 14px 0; letter-spacing: 1px; font-weight: bold;">
            STRATEGY RULES BREAKDOWN
          </h2>
          
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-bottom: 4px; font-weight: bold;">ENTRY CONDITIONS:</div>
            <div style="background: #090d14; padding: 10px; border-radius: 6px; font-size: 12px; color: #e2e8f0;">${escapeHtml(payload.entryConditions || 'See original description')}</div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-bottom: 4px; font-weight: bold;">EXIT CONDITIONS & TARGETS:</div>
            <div style="background: #090d14; padding: 10px; border-radius: 6px; font-size: 12px; color: #e2e8f0;">${escapeHtml(payload.exitConditions || 'See original description')}</div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-bottom: 4px; font-weight: bold;">RISK MANAGEMENT:</div>
            <div style="background: #090d14; padding: 10px; border-radius: 6px; font-size: 12px; color: #e2e8f0;">${escapeHtml(payload.riskManagement || 'Standard 1% risk per trade')}</div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-bottom: 4px; font-weight: bold;">TRADE MANAGEMENT (BE / TRAILING):</div>
            <div style="background: #090d14; padding: 10px; border-radius: 6px; font-size: 12px; color: #e2e8f0;">${escapeHtml(payload.tradeManagement || 'Standard static Stop Loss / Take Profit')}</div>
          </div>

          ${payload.tradingConditions ? `
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-bottom: 4px; font-weight: bold;">TRADING SESSIONS & FILTERS:</div>
            <div style="background: #090d14; padding: 10px; border-radius: 6px; font-size: 12px; color: #e2e8f0;">${escapeHtml(payload.tradingConditions)}</div>
          </div>` : ''}

          ${payload.additionalRules ? `
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-bottom: 4px; font-weight: bold;">ADDITIONAL RULES:</div>
            <div style="background: #090d14; padding: 10px; border-radius: 6px; font-size: 12px; color: #e2e8f0;">${escapeHtml(payload.additionalRules)}</div>
          </div>` : ''}

          ${payload.missingInformation ? `
          <div style="margin-bottom: 4px;">
            <div style="font-size: 11px; font-family: monospace; color: #f59e0b; margin-bottom: 4px; font-weight: bold;">CLARIFICATION REQUIREMENTS / MISSING INFO:</div>
            <div style="background: #1c1917; border: 1px solid #78350f; padding: 10px; border-radius: 6px; font-size: 12px; color: #fde68a;">${escapeHtml(payload.missingInformation)}</div>
          </div>` : ''}
        </div>

        ${payload.clearStrategy ? `
        <!-- 3. HUMAN-READABLE CLEAR EXPLANATION -->
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #38bdf8; margin: 0 0 12px 0; letter-spacing: 1px; font-weight: bold;">
            CLEAR STRATEGY EXPLANATION (STRUCTURED)
          </h2>
          <pre style="background: #090d14; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${escapeHtml(payload.clearStrategy)}</pre>
        </div>` : ''}

        ${payload.devPrompt ? `
        <!-- 4. GENERATED AI DEVELOPMENT PROMPT -->
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h2 style="font-size: 12px; text-transform: uppercase; font-family: monospace; color: #a78bfa; margin: 0 0 12px 0; letter-spacing: 1px; font-weight: bold;">
            GENERATED MQL5 DEVELOPMENT PROMPT
          </h2>
          <pre style="background: #090d14; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; font-size: 11px; line-height: 1.5; color: #94a3b8; white-space: pre-wrap; font-family: monospace; overflow-x: auto;">${escapeHtml(payload.devPrompt)}</pre>
        </div>` : ''}

        <div style="text-align: center; padding-top: 10px; border-top: 1px solid #1f2937;">
          <p style="font-size: 11px; color: #64748b; margin: 0;">
            SuperMegaFX &bull; Automated Algorithmic Intake Pipeline &bull; Developer Notification
          </p>
        </div>
      </div>
    </div>
  `;

  // Dispatch to Admin
  const adminResult = await dispatchEmail({
    to: ADMIN_EMAIL,
    subject: adminSubject,
    html: adminHtml,
    source: payload.source || 'strategy_builder',
    referenceId: submissionId,
  });

  // 2. Client Confirmation Email
  let clientResult: EmailDispatchResult | undefined;
  if (payload.clientEmail && payload.clientEmail.includes('@')) {
    const clientSubject = `Your Custom EA Specification Received [${submissionId}] — MEGA AI / SuperMegaFX`;
    const clientHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f17; color: #e2e8f0; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%); padding: 26px 30px; text-align: left;">
          <span style="display: inline-block; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; background: rgba(0,0,0,0.3); color: #6ee7b7; padding: 3px 10px; border-radius: 9999px; margin-bottom: 10px;">
            Confirmation of Receipt
          </span>
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">Strategy Received For Development</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0; font-family: monospace;">
            Reference ID: <strong>${submissionId}</strong>
          </p>
        </div>

        <div style="padding: 24px 30px;">
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            Hello <strong>${payload.clientName || 'Trader'}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            Thank you for submitting your custom <strong>${payload.platform}</strong> Expert Advisor strategy specification. Our senior quantitative development team has received your submission.
          </p>

          <div style="background: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 18px; margin: 20px 0; font-size: 13px;">
            <div style="margin-bottom: 8px; color: #cbd5e1;"><strong>Target Platform:</strong> <span style="color: #34d399; font-family: monospace;">${payload.platform}</span></div>
            <div style="margin-bottom: 8px; color: #cbd5e1;"><strong>Asset / Instrument:</strong> ${payload.instrument || 'Multi-Asset'}</div>
            <div style="margin-bottom: 8px; color: #cbd5e1;"><strong>Timeframe:</strong> ${payload.timeframe || '15-Minute'}</div>
            <div style="margin-bottom: 8px; color: #cbd5e1;"><strong>Registered Phone:</strong> ${payload.clientPhone}</div>
            <div><strong>Status:</strong> <span style="color: #34d399; font-weight: bold;">Specification In Review</span></div>
          </div>

          <h3 style="font-size: 13px; text-transform: uppercase; font-family: monospace; color: #10b981; margin: 18px 0 8px 0;">
            What Happens Next:
          </h3>
          <ul style="font-size: 13px; color: #94a3b8; line-height: 1.6; padding-left: 20px; margin: 0 0 20px 0;">
            <li><strong>Logic Audit:</strong> We audit your indicator rules, entry/exit triggers, and risk management parameters for algorithmic feasibility.</li>
            <li><strong>Clarification & Roadmap:</strong> If any edge conditions require clarification, we will message you via WhatsApp/Phone or Telegram.</li>
            <li><strong>Proposal & Timeline:</strong> You will receive a fixed-price development quotation and delivery timeline within 24–48 business hours.</li>
          </ul>

          <div style="border-top: 1px solid #1e293b; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #64748b;">
            Questions? Contact support at <a href="mailto:support@supermegafx.com" style="color: #34d399; text-decoration: none;">support@supermegafx.com</a> quoting reference <strong style="font-family: monospace;">${submissionId}</strong>.
          </div>
        </div>
      </div>
    `;

    clientResult = await dispatchEmail({
      to: payload.clientEmail,
      subject: clientSubject,
      html: clientHtml,
      source: payload.source || 'strategy_builder',
      referenceId: submissionId,
    });
  }

  return { adminResult, clientResult };
}

/**
 * Universal email dispatcher supporting:
 * 1. Resend API (HTTPS REST)
 * 2. Brevo API (HTTPS REST)
 * 3. SendGrid API (HTTPS REST)
 * 4. SMTP / Gmail App Password (via nodemailer)
 * 5. Database Queue Logging (when no outbound provider is configured)
 */
export async function dispatchEmail(options: {
  to: string;
  subject: string;
  html: string;
  source: string;
  referenceId: string;
}): Promise<EmailDispatchResult> {
  const emailId = `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // 1. Resend API (HTTPS REST on port 443)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        dbQueries.logEmail({
          id: emailId,
          recipient: options.to,
          subject: options.subject,
          body: options.html,
          source: options.source,
          status: 'sent_resend',
        });
        console.log(`[Email Sent via Resend] To: ${options.to} (ID: ${json.id || emailId})`);
        return { success: true, status: 'sent', id: json.id || emailId, sentAt: now };
      } else {
        const errText = await res.text();
        console.error(`[Resend Error ${res.status}]`, errText);
        dbQueries.logEmail({
          id: emailId,
          recipient: options.to,
          subject: options.subject,
          body: options.html,
          source: options.source,
          status: `failed_resend_${res.status}`,
        });
        return { success: false, status: 'failed', error: `Resend error: ${errText}`, id: emailId };
      }
    } catch (resendErr: any) {
      console.error('[Resend Exception]', resendErr);
      return { success: false, status: 'failed', error: resendErr.message || 'Resend connection failed', id: emailId };
    }
  }

  // 2. Brevo API (HTTPS REST on port 443)
  if (process.env.BREVO_API_KEY) {
    try {
      const senderEmail = process.env.BREVO_FROM || process.env.FROM_EMAIL || ADMIN_EMAIL;
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: 'MegaFX Automation', email: senderEmail },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        dbQueries.logEmail({
          id: emailId,
          recipient: options.to,
          subject: options.subject,
          body: options.html,
          source: options.source,
          status: 'sent_brevo',
        });
        console.log(`[Email Sent via Brevo] To: ${options.to}`);
        return { success: true, status: 'sent', id: json.messageId || emailId, sentAt: now };
      } else {
        const errText = await res.text();
        console.error(`[Brevo Error ${res.status}]`, errText);
        return { success: false, status: 'failed', error: `Brevo error: ${errText}`, id: emailId };
      }
    } catch (brevoErr: any) {
      console.error('[Brevo Exception]', brevoErr);
      return { success: false, status: 'failed', error: brevoErr.message || 'Brevo connection failed', id: emailId };
    }
  }

  // 3. SendGrid API (HTTPS REST on port 443)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sendgridFrom = process.env.SENDGRID_FROM || process.env.FROM_EMAIL || ADMIN_EMAIL;
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: options.to }] }],
          from: { email: sendgridFrom, name: 'MegaFX Automation' },
          subject: options.subject,
          content: [{ type: 'text/html', value: options.html }],
        }),
      });

      if (res.ok || res.status === 202) {
        dbQueries.logEmail({
          id: emailId,
          recipient: options.to,
          subject: options.subject,
          body: options.html,
          source: options.source,
          status: 'sent_sendgrid',
        });
        console.log(`[Email Sent via SendGrid] To: ${options.to}`);
        return { success: true, status: 'sent', id: emailId, sentAt: now };
      } else {
        const errText = await res.text();
        console.error(`[SendGrid Error ${res.status}]`, errText);
        return { success: false, status: 'failed', error: `SendGrid error: ${errText}`, id: emailId };
      }
    } catch (sgErr: any) {
      console.error('[SendGrid Exception]', sgErr);
      return { success: false, status: 'failed', error: sgErr.message || 'SendGrid connection failed', id: emailId };
    }
  }

  // 4. Standard SMTP / Gmail App Password (nodemailer)
  if (process.env.SMTP_HOST || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD) {
    try {
      const host = process.env.SMTP_HOST || 'smtp.gmail.com';
      const port = Number(process.env.SMTP_PORT) || 587;
      const user = process.env.SMTP_USER || process.env.ADMIN_EMAIL || 'supermegafx1@gmail.com';
      const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from: `MEGA AI Automation <${user}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      dbQueries.logEmail({
        id: emailId,
        recipient: options.to,
        subject: options.subject,
        body: options.html,
        source: options.source,
        status: 'sent_smtp',
      });
      console.log(`[Email Sent via SMTP] To: ${options.to} (${info.messageId})`);
      return { success: true, status: 'sent', id: info.messageId || emailId, sentAt: now };
    } catch (smtpErr: any) {
      console.error('[SMTP Exception]', smtpErr);
      return { success: false, status: 'failed', error: `SMTP error: ${smtpErr.message}`, id: emailId };
    }
  }

  // 5. No provider configured in environment
  const noProviderMsg = 'No live email provider configured in environment. Please configure RESEND_API_KEY, BREVO_API_KEY, SENDGRID_API_KEY, or SMTP_PASS in Settings to dispatch live emails to inbox.';
  
  dbQueries.logEmail({
    id: emailId,
    recipient: options.to,
    subject: options.subject,
    body: options.html,
    source: options.source,
    status: 'failed_no_provider',
  });

  console.warn(`[EMAIL NOTICE] No email provider configured. Submission logged to database queue for ${options.to} (${options.subject}).`);

  return {
    success: false,
    status: 'failed_no_provider',
    error: noProviderMsg,
    id: emailId,
  };
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
