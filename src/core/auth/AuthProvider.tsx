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
  loginWithPhone: (mobileNumber: string, otp: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string; session?: AuthSession }>;
  requestOtp: (mobileNumber: string) => Promise<{ success: boolean; challengeId?: string; error?: string; retryAfterSeconds?: number; demoOtp?: string }>;
  registerNewUser: (mobileNumber: string, fullName: string, email?: string) => Promise<{ success: boolean; error?: string; session?: AuthSession }>;
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

  const requestOtp = useCallback(async (mobileNumber: string) => {
    const cleanNumber = mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    if (cleanNumber === '9999999999' || cleanNumber === '0000000000') {
      return { success: false, error: 'Your account has been suspended by the society administration.' };
    }

    const challengeId = `otp-challenge-${Date.now()}`;
    return {
      success: true,
      challengeId,
      retryAfterSeconds: 30,
      demoOtp: '123456',
    };
  }, []);

  const loginWithPhone = useCallback(async (mobileNumber: string, otp: string) => {
    const cleanNumber = mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    if (otp !== '123456') {
      return { success: false, error: 'Invalid verification code. Please enter the valid 6-digit code (Demo: 123456).' };
    }

    const { lookupIdentityByPhone } = await import('../identity/identityResolver');
    const lookup = lookupIdentityByPhone(cleanNumber);

    if (lookup.status === 'SUSPENDED') {
      return { success: false, error: lookup.message };
    }

    if (lookup.status === 'NEW_USER') {
      return { success: true, isNewUser: true };
    }

    const { identity } = lookup;
    const sessionObj: AuthSession = {
      userId: identity.user.id,
      name: identity.person.preferredName || `${identity.person.firstName} ${identity.person.lastName}`,
      role: identity.activeRole,
      personaKey: identity.personaKey || 'rohan',
      societyId: identity.membership?.societyId,
      societyName: identity.membership?.societyName,
      unitId: identity.unitRelationship?.unitId,
      unitLabel: identity.unitRelationship?.unitNumber,
      isHouseholdAdmin: identity.isHouseholdAdmin,
      isMockSession: true,
      token: `mock-token-${identity.user.id}`,
    };

    await setCurrentSession(sessionObj);
    return { success: true, isNewUser: false, session: sessionObj };
  }, []);

  const registerNewUser = useCallback(async (mobileNumber: string, fullName: string, email?: string) => {
    if (!fullName.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }

    const { registerNewUserAccount } = await import('../identity/identityResolver');
    const identity = registerNewUserAccount({
      mobileNumber,
      fullName,
      ...(email !== undefined ? { email } : {}),
    });

    const sessionObj: AuthSession = {
      userId: identity.user.id,
      name: identity.person.preferredName || `${identity.person.firstName} ${identity.person.lastName}`.trim(),
      role: identity.activeRole,
      personaKey: 'rohan',
      isHouseholdAdmin: false,
      isMockSession: true,
      token: `mock-token-${identity.user.id}`,
    };

    await setCurrentSession(sessionObj);
    return { success: true, session: sessionObj };
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
    loginWithPhone,
    requestOtp,
    registerNewUser,
    logout,
    restoreSession,
    setMockSession,
  }), [session, status, login, loginWithPhone, requestOtp, registerNewUser, logout, restoreSession, setMockSession]);

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