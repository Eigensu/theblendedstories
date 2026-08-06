export class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

export const apiClient = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, { ...options, headers });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        if (refreshToken && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const refreshRes = await fetch(`${getBaseUrl()}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
              });
              const refreshData = await refreshRes.json();
              
              if (refreshRes.ok && refreshData.success) {
                localStorage.setItem('admin_token', refreshData.data.access_token);
                localStorage.setItem('admin_refresh_token', refreshData.data.refresh_token);
                onRefreshed(refreshData.data.access_token);
                // Retry the original request
                return this.fetch<T>(endpoint, options);
              } else {
                throw new Error('Refresh failed');
              }
            } catch (err) {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_refresh_token');
              window.location.href = '/admin/login';
              throw new ApiError(401, 'Session expired');
            } finally {
              isRefreshing = false;
            }
          } else {
            // Queue this request until refresh is done
            return new Promise((resolve) => {
              subscribeTokenRefresh((newToken) => {
                // Retry once we have the new token
                resolve(this.fetch<T>(endpoint, options));
              });
            });
          }
        } else {
          // No refresh token, or the refresh itself failed
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_refresh_token');
          window.location.href = '/admin/login';
        }
      }
      throw new ApiError(response.status, data?.detail || data?.message || 'API request failed');
    }

    // Backend standardized format: { success, message, data }
    if (data && typeof data === 'object' && 'success' in data) {
      if (!data.success) {
        throw new ApiError(response.status, data.message || 'API request failed');
      }
      return data.data as T;
    }

    return data as T;
  },

  get<T>(endpoint: string, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  put<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
