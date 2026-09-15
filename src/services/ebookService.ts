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

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to request download authorization.',
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
