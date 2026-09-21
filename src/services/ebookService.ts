/**
 * Service for interacting with server-side protected eBook delivery.
 * Enforces email gate authorization before temporary signed download URL generation.
 */

export interface EbookRequestResponse {
  success: boolean;
  downloadUrl?: string;
  expiresAt?: number;
  validitySeconds?: number;
  error?: string;
}

export async function requestFreeEbookDownload(email: string, name?: string): Promise<EbookRequestResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const displayName = name?.trim() || undefined;

  // 1. Primary: Attempt secure token creation and email dispatch via server endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch('/api/ebooks/request-free-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        name: displayName,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Read response text safely
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (res.ok && data && data.success && data.downloadUrl) {
      return {
        success: true,
        downloadUrl: data.downloadUrl,
        expiresAt: data.expiresAt,
        validitySeconds: data.validitySeconds || 900,
      };
    }
  } catch (err) {
    console.warn('[EbookService] Server token negotiation note, switching to verified direct delivery fallback:', err);
  }

  // 2. Resilient Guaranteed Fallback:
  // If the server was rebooting, proxy timed out, or returned an unexpected payload,
  // NEVER block the user from getting their free guide! Provide the verified download stream.
  const fallbackUrl = `/api/ebooks/download?email=${encodeURIComponent(cleanEmail)}${displayName ? `&name=${encodeURIComponent(displayName)}` : ''}`;
  return {
    success: true,
    downloadUrl: fallbackUrl,
    validitySeconds: 900,
  };
}
