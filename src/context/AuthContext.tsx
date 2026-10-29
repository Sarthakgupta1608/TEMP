import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ApiClient, type PortalRole } from '../services/apiClient';

export interface UserSession {
  id: string;
  email: string;
  role: string;
  agencyId?: string;
  profile?: {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
  };
  agency?: {
    id: string;
    companyName: string;
    slug: string;
    operatingRegion?: string;
    ratingAverage?: number;
    reviewCount?: number;
  };
}

export interface SessionsState {
  traveller: UserSession | null;
  agency: UserSession | null;
  admin: UserSession | null;
}

interface AuthContextType {
  sessions: SessionsState;
  loading: boolean;
  login: (role: PortalRole, credentials: { email: string; password: string }) => Promise<UserSession>;
  register: (role: PortalRole, data: any) => Promise<UserSession>;
  logout: (role: PortalRole) => Promise<void>;
  refreshSession: (role: PortalRole) => Promise<UserSession | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<SessionsState>({
    traveller: null,
    agency: null,
    admin: null,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const restoreRoleSession = async (role: PortalRole): Promise<UserSession | null> => {
    const token = ApiClient.getToken(role);
    if (!token) return null;

    try {
      const user = await ApiClient.getCurrentUser(role);
      return user;
    } catch {
      ApiClient.setToken(role, null);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const restoreAllSessions = async () => {
      try {
        const [traveller, agency, admin] = await Promise.all([
          restoreRoleSession('traveller'),
          restoreRoleSession('agency'),
          restoreRoleSession('admin'),
        ]);

        if (isMounted) {
          setSessions({ traveller, agency, admin });
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreAllSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (role: PortalRole, credentials: { email: string; password: string }) => {
    const result = await ApiClient.loginUser(credentials, role);
    const user = result.user;
    setSessions((prev) => ({ ...prev, [role]: user }));
    return user;
  };

  const register = async (role: PortalRole, data: any) => {
    const result = await ApiClient.registerUser(data, role);
    const user = result.user;
    setSessions((prev) => ({ ...prev, [role]: user }));
    return user;
  };

  const logout = async (role: PortalRole) => {
    await ApiClient.logoutUser(role);
    setSessions((prev) => ({ ...prev, [role]: null }));
  };

  const refreshSession = async (role: PortalRole): Promise<UserSession | null> => {
    try {
      const res = await ApiClient.refreshToken(role);
      const user = res.user;
      setSessions((prev) => ({ ...prev, [role]: user }));
      return user;
    } catch {
      setSessions((prev) => ({ ...prev, [role]: null }));
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ sessions, loading, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
