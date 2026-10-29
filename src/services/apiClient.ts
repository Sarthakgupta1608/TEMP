import { DESTINATIONS, PACKAGES, QUOTES } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export type PortalRole = 'traveller' | 'agency' | 'admin';

export interface ApiError {
  statusCode: number;
  message: string;
  errorCode?: string;
  data?: any;
}

export class ApiClient {
  static getToken(role: PortalRole): string | null {
    return localStorage.getItem(`${role}_access_token`);
  }

  static setToken(role: PortalRole, token: string | null) {
    if (token) {
      localStorage.setItem(`${role}_access_token`, token);
    } else {
      localStorage.removeItem(`${role}_access_token`);
    }
  }

  private static getHeaders(role?: PortalRole) {
    const token = role ? this.getToken(role) : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Authenticated fetch helper with automatic 401 silent refresh and retry.
   * Throws real errors on 401/403/500 without mock fallback.
   */
  static async fetchWithAuth(url: string, options: RequestInit = {}, role: PortalRole): Promise<any> {
    const headers = {
      ...this.getHeaders(role),
      ...(options.headers || {}),
    };

    let res = await fetch(url, { ...options, headers, credentials: 'include' });

    // Handle 401 with silent refresh
    if (res.status === 401) {
      try {
        const refreshResult = await this.refreshToken(role);
        if (refreshResult?.accessToken) {
          this.setToken(role, refreshResult.accessToken);
          const retryHeaders = {
            ...this.getHeaders(role),
            ...(options.headers || {}),
          };
          res = await fetch(url, { ...options, headers: retryHeaders, credentials: 'include' });
        }
      } catch {
        // Refresh failed; clear token
        this.setToken(role, null);
      }
    }

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error: ApiError = {
        statusCode: res.status,
        message: json.message || `Request failed with status ${res.status}`,
        errorCode: json.errorCode || 'REQUEST_FAILED',
        data: json.data,
      };
      throw error;
    }

    return json.data;
  }

  // ==========================================
  // Public Read APIs (with mock fallbacks)
  // ==========================================

  // 1. Destinations API
  static async fetchDestinations() {
    try {
      const res = await fetch(`${API_BASE_URL}/destinations`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      console.warn('⚠️ API offline or unreachable, using local data fallback.');
    }
    return DESTINATIONS;
  }

  // 2. Packages API
  static async fetchPackages(destination?: string, maxPrice?: number) {
    try {
      let url = `${API_BASE_URL}/packages?`;
      if (destination) url += `destination=${encodeURIComponent(destination)}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.packages) {
          return json.data.packages;
        }
      }
    } catch {
      console.warn('⚠️ API offline or unreachable, using local data fallback.');
    }
    return PACKAGES.filter((p) => {
      const matchesDest = !destination || destination === 'All' || p.destination.includes(destination);
      const matchesPrice = !maxPrice || p.pricePerPerson <= maxPrice;
      return matchesDest && matchesPrice;
    });
  }

  // ==========================================
  // Authentication APIs
  // ==========================================

  static async loginUser(credentials: { email: string; password: string; role?: string; portal?: string }, portalRole: PortalRole) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...credentials, portal: portalRole.toUpperCase() }),
      credentials: 'include',
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw {
        statusCode: res.status,
        message: json.message || 'Login failed',
        errorCode: json.errorCode || 'LOGIN_FAILED',
      };
    }

    if (json.data?.accessToken) {
      this.setToken(portalRole, json.data.accessToken);
    }
    return json.data;
  }

  static async registerUser(data: any, portalRole: PortalRole) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, role: portalRole.toUpperCase() }),
      credentials: 'include',
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw {
        statusCode: res.status,
        message: json.message || 'Registration failed',
        errorCode: json.errorCode || 'REGISTRATION_FAILED',
      };
    }

    if (json.data?.accessToken) {
      this.setToken(portalRole, json.data.accessToken);
    }
    return json.data;
  }

  static async getCurrentUser(portalRole: PortalRole) {
    const data = await this.fetchWithAuth(`${API_BASE_URL}/auth/me`, {}, portalRole);
    return data?.user;
  }

  static async refreshToken(portalRole: PortalRole) {
    const res = await fetch(`${API_BASE_URL}/auth/refresh?role=${portalRole}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw {
        statusCode: res.status,
        message: json.message || 'Token refresh failed',
        errorCode: json.errorCode || 'REFRESH_FAILED',
      };
    }

    if (json.data?.accessToken) {
      this.setToken(portalRole, json.data.accessToken);
    }
    return json.data;
  }

  static async logoutUser(portalRole: PortalRole) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: portalRole }),
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      this.setToken(portalRole, null);
    }
  }

  // ==========================================
  // Trip Requests & Quotes (Authenticated)
  // ==========================================

  static async createTripRequest(tripData: any) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/trip-requests`,
      {
        method: 'POST',
        body: JSON.stringify(tripData),
      },
      'traveller'
    );
  }

  static async fetchQuotesForRequest(requestId?: string) {
    if (!requestId || requestId === 'seed-id') {
      try {
        const token = this.getToken('traveller');
        if (token) {
          const data = await this.fetchWithAuth(`${API_BASE_URL}/trip-requests/${requestId || 'seed-id'}/quotes`, {}, 'traveller');
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch {
        // Fall back to pre-built quotes if seed trip request not found
      }
      return QUOTES;
    }

    return this.fetchWithAuth(`${API_BASE_URL}/trip-requests/${requestId}/quotes`, {}, 'traveller');
  }

  // ==========================================
  // Bookings & Payments (Authenticated)
  // ==========================================

  static async createBooking(data: { quoteId?: string; packageId?: string; startDate?: string; endDate?: string; pax?: number }) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/bookings`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      'traveller'
    );
  }

  static async fetchMyBookings() {
    return this.fetchWithAuth(`${API_BASE_URL}/bookings/my`, {}, 'traveller');
  }

  static async fetchAgencyBookings() {
    return this.fetchWithAuth(`${API_BASE_URL}/agency/bookings`, {}, 'agency');
  }

  static async fetchBookingById(id: string, role: PortalRole) {
    return this.fetchWithAuth(`${API_BASE_URL}/bookings/${id}`, {}, role);
  }

  // ==========================================
  // Agency Portal APIs (Authenticated)
  // ==========================================

  static async fetchAgencyLeads() {
    return this.fetchWithAuth(`${API_BASE_URL}/agency/leads`, {}, 'agency');
  }

  static async requestAgencyPayout(amount: number) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/agency/payouts`,
      {
        method: 'POST',
        body: JSON.stringify({ amount }),
      },
      'agency'
    );
  }

  // ==========================================
  // Admin Portal APIs (Authenticated)
  // ==========================================

  static async fetchAdminAnalytics() {
    return this.fetchWithAuth(`${API_BASE_URL}/admin/analytics`, {}, 'admin');
  }
}
