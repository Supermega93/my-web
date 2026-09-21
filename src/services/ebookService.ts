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
  try {
    const res = await fetch('/api/ebooks/request-free-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        name: name?.trim() || undefined,
      }),
    });

    // Safely parse response body avoiding JSON syntax crashes on empty or unexpected payloads
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok || !data || !data.success) {
      return {
        success: false,
        error: data?.error || (res.status === 404 
          ? 'Download service temporarily unavailable. Please try again shortly.' 
          : 'Failed to request download authorization. Please try again.'),
      };
    }

    return {
      success: true,
      downloadUrl: data.downloadUrl,
      expiresAt: data.expiresAt,
      validitySeconds: data.validitySeconds || 900,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error while requesting secure download.',
    };
  }
}
