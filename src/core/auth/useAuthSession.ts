import * as React from 'react';
import type { RootStackParamList } from '../../app/navigation/navigation.types';
import type { AppRole } from '../permissions/permission.types';
import type { AuthSession } from './authSession.types';
import { logoutCurrentSession } from './logout';
import { createMockSessionForPersona, createMockSessionForRoute, getMockSessionSeedForRole } from './mockSession';
import {
  getCurrentSession,
  setCurrentSession,
  subscribeToSession,
} from './sessionStore';

export function useAuthSession() {
  const session = React.useSyncExternalStore(
    subscribeToSession,
    getCurrentSession,
    getCurrentSession
  );

  const startMockSessionForPersona = React.useCallback(async (personaKey: string) => {
    const mockSession = createMockSessionForPersona(personaKey as any);
    await setCurrentSession(mockSession);
    return mockSession;
  }, []);

  const startMockSessionForRoute = React.useCallback(async (routeName: keyof RootStackParamList) => {
    const mockSession = createMockSessionForRoute(routeName);
    if (mockSession) {
      await setCurrentSession(mockSession);
    }
    return mockSession;
  }, []);

  const startMockSessionForRole = React.useCallback(async (role: AppRole): Promise<AuthSession> => {
    const mockSession = getMockSessionSeedForRole(role);
    await setCurrentSession(mockSession);
    return mockSession;
  }, []);

  const logout = React.useCallback(async () => {
    await logoutCurrentSession();
  }, []);

  return {
    session,
    isAuthenticated: Boolean(session),
    startMockSessionForPersona,
    startMockSessionForRoute,
    startMockSessionForRole,
    logout,
  };
}
