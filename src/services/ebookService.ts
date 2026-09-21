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
  emailDispatched?: boolean;
  emailDelivery?: {
    status: string;
    provider?: string;
    id?: string;
    error?: string;
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

    // Safely process JSON response using response.json()
    let data: any;
    try {
      data = await res.json();
    } catch (parseError: any) {
      console.error('[EbookService] Failed to parse JSON response from server:', parseError);
      return {
        success: false,
        error: `Email delivery server returned an unexpected response (HTTP ${res.status}).`,
        code: 'INVALID_JSON_RESPONSE',
      };
    }

    if (res.ok && data?.success) {
      return {
        success: true,
        message: data.message || 'Ebook email sent successfully',
        downloadUrl: data.downloadUrl,
        expiresAt: data.expiresAt,
        validitySeconds: data.validitySeconds || 900,
        leadId: data.leadId,
        emailDispatched: true,
      };
    }

    return {
      success: false,
      error: data?.error || `Email delivery could not be completed (HTTP ${res.status}).`,
      code: data?.code || 'DELIVERY_FAILED',
      leadId: data?.leadId,
      emailDispatched: false,
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
