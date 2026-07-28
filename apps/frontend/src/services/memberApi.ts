/**
 * API client for signed-in site members.
 *
 * Deliberately separate from `app/admin/services/api.ts`, which hardcodes the
 * `admin_token` storage keys. Sharing one client would mean a member session and
 * a CMS admin session reading and writing each other's tokens — the storage keys
 * below are the boundary that prevents that.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const MEMBER_TOKEN_KEY = 'tbs_member_token';
export const MEMBER_REFRESH_KEY = 'tbs_member_refresh_token';

export type Member = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  newsletter_subscribed: boolean;
};

export class MemberApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function getStoredTokens() {
  if (typeof window === 'undefined') return { access: null, refresh: null };
  return {
    access: localStorage.getItem(MEMBER_TOKEN_KEY),
    refresh: localStorage.getItem(MEMBER_REFRESH_KEY),
  };
}

export function storeTokens(access: string, refresh: string) {
  localStorage.setItem(MEMBER_TOKEN_KEY, access);
  localStorage.setItem(MEMBER_REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(MEMBER_TOKEN_KEY);
  localStorage.removeItem(MEMBER_REFRESH_KEY);
}

// One refresh at a time. Without this queue, several 401s landing together each
// start their own refresh and all but the last get invalidated.
let refreshInFlight: Promise<string | null> | null = null;

async function refreshSession(): Promise<string | null> {
  const { refresh } = getStoredTokens();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE}/members/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const body = await response.json();
  if (!body?.success) {
    clearTokens();
    return null;
  }

  storeTokens(body.data.access_token, body.data.refresh_token);
  return body.data.access_token as string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOn401 = true
): Promise<T> {
  const { access } = getStoredTokens();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    },
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    // A 204 or an HTML error page — handled by the status check below.
  }

  if (response.status === 401 && retryOn401) {
    refreshInFlight = refreshInFlight ?? refreshSession();
    const newToken = await refreshInFlight;
    refreshInFlight = null;

    // Retry once. `false` here is what stops a persistent 401 from looping.
    if (newToken) return request<T>(endpoint, options, false);
  }

  if (!response.ok) {
    throw new MemberApiError(
      response.status,
      body?.detail || body?.message || 'Request failed'
    );
  }

  // Backend envelope: { success, message, data }
  if (body && typeof body === 'object' && 'success' in body) {
    if (!body.success) throw new MemberApiError(response.status, body.message);
    return body.data as T;
  }
  return body as T;
}

export const memberApi = {
  signInWithGoogle(code: string) {
    return request<{ access_token: string; refresh_token: string; user: Member }>(
      '/members/auth/google',
      { method: 'POST', body: JSON.stringify({ code }) },
      false
    );
  },

  getMe() {
    return request<Member>('/members/me');
  },

  setNewsletterPreference(subscribed: boolean) {
    return request<Member>('/members/me/newsletter', {
      method: 'PATCH',
      body: JSON.stringify({ subscribed }),
    });
  },

  subscribeToNewsletter(email: string, name?: string) {
    return request<null>(
      '/newsletter/subscribe',
      { method: 'POST', body: JSON.stringify({ email, name: name || null }) },
      false
    );
  },
};
