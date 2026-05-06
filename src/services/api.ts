// API client for Netlify Functions

const API_BASE = '/.netlify/functions';

interface AuthUser {
  uid: string;
  email: string;
  name: string;
}

class APIClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token && !endpoint.includes('/auth')) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: { email: string; password: string; name: string; role?: string; service?: string }) {
    const result = await this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'register', ...data }),
    });
    this.setToken(result.token);
    return result;
  }

  async login(credentials: { email: string; password: string }) {
    const result = await this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', ...credentials }),
    });
    this.setToken(result.token);
    return result;
  }

  signOut() {
    this.setToken(null);
  }

  // User endpoints
  async getProfile(uid?: string) {
    const query = uid ? `?uid=${uid}` : '';
    return this.request(`/users${query}`, { method: 'GET' });
  }

  async createProfile(profile: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // Panne endpoints
  async getPannes() {
    return this.request('/pannes', { method: 'GET' });
  }

  async createPanne(panne: any) {
    return this.request('/pannes', {
      method: 'POST',
      body: JSON.stringify(panne),
    });
  }

  async updatePanne(id: string, updates: any) {
    return this.request('/pannes', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  }

  async deletePanne(id: string) {
    return this.request('/pannes', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }
}

export const apiClient = new APIClient();
