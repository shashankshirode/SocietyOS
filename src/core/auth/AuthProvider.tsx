import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentSession, restoreCurrentSession, setCurrentSession, clearCurrentSession, subscribeToSession } from './sessionStore';
import { logoutCurrentSession } from './logout';
import type { AuthSession } from './authSession.types';
import type { AppRole } from '../permissions/permission.types';
import { getMockSessionSeedForRole } from './mockSession';

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

interface AuthContextValue {
  session: AuthSession | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  userRole: AppRole | null;
  societyId: string | null;
  societyName: string | null;
  unitId: string | null;
  login: (role: AppRole, credentials?: { societyId?: string; unitId?: string }) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setMockSession: (role: AppRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const updateSession = useCallback((newSession: AuthSession | null) => {
    setSessionState(newSession);
    setStatus(newSession ? 'authenticated' : 'unauthenticated');
  }, []);

  useEffect(() => {
    let mounted = true;
    restoreCurrentSession().then((restored) => {
      if (mounted) {
        updateSession(restored);
      }
    });
    return () => { mounted = false; };
  }, [updateSession]);

  useEffect(() => {
    const unsubscribe = subscribeToSession(() => {
      const current = getCurrentSession();
      updateSession(current);
    });
    return unsubscribe;
  }, [updateSession]);

  const login = useCallback(async (role: AppRole, credentials?: { societyId?: string; unitId?: string }) => {
    setStatus('loading');
    const mockSession = getMockSessionSeedForRole(role);
    if (credentials?.societyId) {
      mockSession.societyId = credentials.societyId;
    }
    if (credentials?.unitId) {
      mockSession.unitId = credentials.unitId;
    }
    await setCurrentSession(mockSession);
  }, []);

  const logout = useCallback(async () => {
    await logoutCurrentSession();
    updateSession(null);
  }, [updateSession]);

  const restoreSession = useCallback(async () => {
    setStatus('loading');
    const restored = await restoreCurrentSession();
    updateSession(restored);
  }, [updateSession]);

  const setMockSession = useCallback(async (role: AppRole) => {
    setStatus('loading');
    const mockSession = getMockSessionSeedForRole(role);
    await setCurrentSession(mockSession);
  }, []);

  const value = useMemo(() => ({
    session,
    status,
    isAuthenticated: Boolean(session),
    userRole: session?.role ?? null,
    societyId: session?.societyId ?? null,
    societyName: session?.societyName ?? null,
    unitId: session?.unitId ?? null,
    login,
    logout,
    restoreSession,
    setMockSession,
  }), [session, status, login, logout, restoreSession, setMockSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}