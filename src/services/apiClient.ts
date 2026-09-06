import { DESTINATIONS, PACKAGES, QUOTES } from '../data/mockData';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export class ApiClient {
  private static getHeaders() {
    const token = localStorage.getItem('traveller_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

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
    } catch (e) {
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
    } catch (e) {
      console.warn('⚠️ API offline or unreachable, using local data fallback.');
    }
    return PACKAGES.filter((p) => {
      const matchesDest = !destination || destination === 'All' || p.destination.includes(destination);
      const matchesPrice = !maxPrice || p.pricePerPerson <= maxPrice;
      return matchesDest && matchesPrice;
    });
  }

  // 3. AI Intent Extraction & Trip Request Creation
  static async createTripRequest(tripData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/trip-requests`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(tripData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('⚠️ API offline, fallback simulation executed.');
    }
    return {
      id: 'req-' + Date.now(),
      requestCode: 'TR-2026-' + Math.floor(100000 + Math.random() * 900000),
      status: 'QUOTES_RECEIVED',
      ...tripData,
    };
  }

  // 4. Quotations API
  static async fetchQuotesForRequest(requestId?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/trip-requests/${requestId || 'seed-id'}/quotes`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('⚠️ API offline, using fallback quotes.');
    }
    return QUOTES;
  }

  // 5. Razorpay Booking Payment Order & Verification
  static async createAndVerifyBooking(quoteId: string, totalAmount: number) {
    try {
      const orderRes = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ quoteId, totalAmount }),
      });
      if (orderRes.ok) {
        const json = await orderRes.json();
        return json.data;
      }
    } catch (e) {
      console.warn('⚠️ API offline, executing local escrow booking fallback.');
    }
    return {
      bookingCode: 'TRV-2026-SK892',
      status: 'CONFIRMED',
      grossAmount: totalAmount,
    };
  }

  // 6. User Auth APIs
  static async loginUser(credentials: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.accessToken) {
          localStorage.setItem('traveller_access_token', json.data.accessToken);
        }
        return json.data;
      }
    } catch (e) {
      console.warn('⚠️ Backend login API offline, simulating auth.');
    }
    return { user: { email: credentials.email, role: 'TRAVELLER' } };
  }

  // 7. Agency Lead Inbox API
  static async fetchAgencyLeads() {
    try {
      const res = await fetch(`${API_BASE_URL}/agency/leads`, { headers: this.getHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('⚠️ API offline, using fallback.');
    }
    return [];
  }

  // 8. Agency Wallet Payout API
  static async requestAgencyPayout(amount: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/agency/payouts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('⚠️ API offline, simulating payout.');
    }
    return { balance: 156000, escrowHold: 42000 };
  }

  // 9. Admin Analytics API
  static async fetchAdminAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/analytics`, { headers: this.getHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('⚠️ API offline, fallback stats.');
    }
    return {
      totalGmv: 4850000.0,
      platformFeeEarned: 485000.0,
      totalUsers: 1240,
      verifiedAgencies: 52,
    };
  }
}
