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
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
        window.location.href = '/admin/login';
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
