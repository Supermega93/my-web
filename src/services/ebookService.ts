/**
 * Service for interacting with server-side protected eBook delivery.
 * Enforces email gate authorization before temporary signed download URL generation.
 */

export interface EbookRequestResponse {
  success: boolean;
  message?: string;
  downloadUrl?: string;
  expiresAt?: number;
  validitySeconds?: number;
  error?: string;
  code?: string;
  leadId?: string;
  emailDelivery?: {
    status: string;
    provider?: string;
    id?: string;
  };
}

export async function requestFreeEbookDownload(email: string, name?: string): Promise<EbookRequestResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const displayName = name?.trim() || undefined;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch('/api/ebooks/request-free-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        name: displayName,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON response safely
    let data: any = null;
    const text = await res.text();
    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error('[EbookService] JSON parsing error from response body:', text, parseErr);
        return {
          success: false,
          error: 'Received an invalid or malformed response from the email server.',
          code: 'INVALID_JSON_RESPONSE',
        };
      }
    } else {
      return {
        success: false,
        error: `Server returned an empty response (HTTP ${res.status}).`,
        code: 'EMPTY_RESPONSE',
      };
    }

    if (res.ok && data && data.success) {
      return {
        success: true,
        message: data.message,
        downloadUrl: data.downloadUrl,
        expiresAt: data.expiresAt,
        validitySeconds: data.validitySeconds || 900,
        leadId: data.leadId,
        emailDelivery: data.emailDelivery,
      };
    }

    return {
      success: false,
      error: data?.error || `Email delivery could not be completed (HTTP ${res.status}).`,
      code: data?.code || 'DELIVERY_FAILED',
      leadId: data?.leadId,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'The request timed out while communicating with the email delivery service. Please try again.',
        code: 'REQUEST_TIMEOUT',
      };
    }
    return {
      success: false,
      error: err.message || 'Unable to connect to the backend server. Please verify your internet connection.',
      code: 'NETWORK_ERROR',
    };
  }
}
