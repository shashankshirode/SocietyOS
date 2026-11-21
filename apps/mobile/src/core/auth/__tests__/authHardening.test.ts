import { runtimePolicy } from '../../config/runtimePolicy';
import { mockAuthGateway } from '../mockAuthGateway';
import { restAuthGateway } from '../restAuthGateway';
import { getAuthGateway } from '../authGateway';
import {
  setCurrentSession,
  getCurrentSession,
  clearCurrentSession,
  restoreCurrentSession,
  clearSensitiveCachedData,
} from '../sessionStore';
import { secureStorage } from '../../security/secureStorage';
import type { AuthSession } from '../authSession.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Platform, View } from 'react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { act } from '@testing-library/react-native';
import { usePermission } from '../../permissions/usePermission';
import { useAuthSession } from '../useAuthSession';
import { absentValue } from '../../../shared/types/absence.types';

describe('Phase 1A: Auth Hardening & Demo/Production Boundaries', () => {
  beforeEach(async () => {
    await clearSensitiveCachedData();
    runtimePolicy.setEnvironmentOverride('development');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await clearSensitiveCachedData();
    runtimePolicy.setEnvironmentOverride(null);
  });

  describe('Runtime Policy & Gateway Resolution', () => {
    it('resolves MockAuthGateway in development/demo mode', () => {
      runtimePolicy.setEnvironmentOverride('development');
      const gateway = getAuthGateway();
      expect(gateway).toBe(mockAuthGateway);
      expect(runtimePolicy.isDemoAllowed()).toBe(true);
    });

    it('resolves RestAuthGateway in production mode', () => {
      runtimePolicy.setEnvironmentOverride('production');
      const gateway = getAuthGateway();
      expect(gateway).toBe(restAuthGateway);
      expect(runtimePolicy.isDemoAllowed()).toBe(false);
      expect(runtimePolicy.isProduction()).toBe(true);
    });

    it('assertDemoAllowed throws an error in production', () => {
      runtimePolicy.setEnvironmentOverride('production');
      expect(() => {
        runtimePolicy.assertDemoAllowed('TestDemoAction');
      }).toThrow(/is strictly prohibited in production builds/);
    });
  });

  describe('Demo Mode OTP & Authentication', () => {
    it('returns demo OTP (123456) in development/demo mode', async () => {
      runtimePolicy.setEnvironmentOverride('demo');
      const result = await mockAuthGateway.requestOtp({ mobileNumber: '9876543210' });
      expect(result.success).toBe(true);
      expect(result.demoOtp).toBe('123456');
      expect(result.challengeId).toBeDefined();
    });

    it('verifies demo OTP with correct code 123456', async () => {
      runtimePolicy.setEnvironmentOverride('development');
      const result = await mockAuthGateway.verifyOtp({
        mobileNumber: '9876543210',
        otp: '123456',
      });
      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session?.name).toContain('Rohan');
      expect(result.session?.isMockSession).toBe(true);
    });

    it('rejects incorrect OTP in demo mode', async () => {
      runtimePolicy.setEnvironmentOverride('development');
      const result = await mockAuthGateway.verifyOtp({
        mobileNumber: '9876543210',
        otp: '000000',
      });
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('INVALID_OTP');
    });

    it('rejects suspended phone number in demo mode', async () => {
      runtimePolicy.setEnvironmentOverride('development');
      const result = await mockAuthGateway.requestOtp({ mobileNumber: '9999999999' });
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('ACCOUNT_SUSPENDED');
    });
  });

  describe('Production Mode Fail-Closed Security Boundaries', () => {
    it('MockAuthGateway throws in production for OTP requests', async () => {
      runtimePolicy.setEnvironmentOverride('production');
      await expect(
        mockAuthGateway.requestOtp({ mobileNumber: '9876543210' })
      ).rejects.toThrow(/strictly prohibited in production/);
    });

    it('MockAuthGateway throws in production for OTP verification', async () => {
      runtimePolicy.setEnvironmentOverride('production');
      await expect(
        mockAuthGateway.verifyOtp({ mobileNumber: '9876543210', otp: '123456' })
      ).rejects.toThrow(/strictly prohibited in production/);
    });

    it('RestAuthGateway fails closed with BACKEND_UNAVAILABLE when backend is unreachable', async () => {
      runtimePolicy.setEnvironmentOverride('production');
      const result = await restAuthGateway.requestOtp({ mobileNumber: '9876543210' });
      expect(result.success).toBe(false);
      expect(result.errorCode).toBeDefined();
      expect(result.demoOtp).toBeUndefined(); // Never leaks demo OTP in production
    });

    it('setCurrentSession throws if attempting to set a mock session in production', async () => {
      runtimePolicy.setEnvironmentOverride('production');
      const mockSession: AuthSession = {
        userId: 'usr-fake-01',
        name: 'Attacker Impersonating Admin',
        role: 'SUPER_ADMIN',
        isMockSession: true,
      };

      await expect(setCurrentSession(mockSession)).rejects.toThrow(
        /Mock sessions are strictly forbidden in production/
      );
    });

    it('restoreCurrentSession fails closed in production when stored session is a mock session', async () => {
      // Setup a mock session in storage while in dev mode
      runtimePolicy.setEnvironmentOverride('development');
      const mockSession: AuthSession = {
        userId: 'usr-fake-01',
        name: 'Fake Resident',
        role: 'RESIDENT_OWNER',
        isMockSession: true,
      };
      await setCurrentSession(mockSession);

      // Switch to production and attempt restore
      runtimePolicy.setEnvironmentOverride('production');
      const restored = await restoreCurrentSession();
      expect(restored).toBeNull();
      expect(getCurrentSession()).toBeNull();
      // Storage must be purged
      const rawAfter = await AsyncStorage.getItem('societyos.auth.session');
      expect(rawAfter).toBeNull();
    });

    it('restoreCurrentSession fails closed in production when secure refresh token is missing', async () => {
      // Store a production-looking metadata in AsyncStorage without secureStore token
      runtimePolicy.setEnvironmentOverride('development');
      await AsyncStorage.setItem(
        'societyos.auth.session',
        JSON.stringify({
          userId: 'usr-prod-01',
          name: 'Real User',
          role: 'RESIDENT_OWNER',
          isMockSession: false,
        })
      );

      // In production without refresh token
      runtimePolicy.setEnvironmentOverride('production');
      const restored = await restoreCurrentSession();
      expect(restored).toBeNull();
      expect(getCurrentSession()).toBeNull();
    });
  });

  describe('Storage & Token Lifecycle Hardening', () => {
    it('persists sensitive refresh token in secureStorage, not plain AsyncStorage', async () => {
      const session: AuthSession = {
        userId: 'usr-test-99',
        name: 'Storage Test User',
        role: 'RESIDENT_OWNER',
        token: 'access-jwt-token-abc',
        refreshToken: 'refresh-jwt-token-xyz',
        isMockSession: false,
      };

      await act(async () => {
        await setCurrentSession(session);
      });

      const rawAsync = await AsyncStorage.getItem('societyos.auth.session');
      expect(rawAsync).not.toBeNull();
      const parsed = JSON.parse(rawAsync!);
      expect(parsed.token).toBeUndefined();
      expect(parsed.refreshToken).toBeUndefined();

      const secureResult = await secureStorage.getItem('societyos.auth.refreshToken');
      expect(secureResult.value).toBe('refresh-jwt-token-xyz');
    });

    it('logout completely purges session, secure tokens, and memory state', async () => {
      const session: AuthSession = {
        userId: 'usr-test-88',
        name: 'Logout Test User',
        role: 'RESIDENT_TENANT',
        token: 'access-token-88',
        refreshToken: 'refresh-token-88',
        isMockSession: false,
      };

      await act(async () => {
        await setCurrentSession(session);
      });
      expect(getCurrentSession()).not.toBeNull();

      await clearSensitiveCachedData();

      expect(getCurrentSession()).toBeNull();
      expect(await AsyncStorage.getItem('societyos.auth.session')).toBeNull();
      const secureResult = await secureStorage.getItem('societyos.auth.refreshToken');
      expect(secureResult.value).toBeNull();
    });

    it('web production strictly refuses to store refresh tokens in browser storage', async () => {
      const originalOS = Platform.OS;
      try {
        (Platform as { OS: string }).OS = 'web';
        runtimePolicy.setEnvironmentOverride('production');

        const result = await secureStorage.setItem('test-key', 'secret-token');
        expect(result.success).toBe(false);
        expect(result.error).toContain('PERSISTENCE_NOT_SUPPORTED_ON_WEB_PRODUCTION');
      } finally {
        (Platform as { OS: string }).OS = originalOS;
      }
    });

    it('expired session fails closed during restoreCurrentSession', async () => {
      runtimePolicy.setEnvironmentOverride('development');
      const expiredSession: AuthSession = {
        userId: 'usr-expired',
        name: 'Expired User',
        role: 'RESIDENT_OWNER',
        expiresAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isMockSession: true,
      };

      await setCurrentSession(expiredSession);
      const restored = await restoreCurrentSession();
      expect(restored).toBeNull();
      expect(getCurrentSession()).toBeNull();
    });
  });

  describe('Unauthenticated usePermission Fail-Closed', () => {
    it('returns absentValue and denies permissions when no session is active', async () => {
      expect(getCurrentSession()).toBeNull();
      let captured: ReturnType<typeof usePermission> | null = null;
      function TestComp() {
        captured = usePermission({ permission: 'VISITOR_VIEW' });
        return React.createElement(View);
      }
      await renderWithProviders(React.createElement(TestComp));
      expect(captured).not.toBeNull();
      expect(captured!.user).toBe(absentValue);
      expect(captured!.isAllowed).toBe(false);
      expect(captured!.grantedPermissions).toEqual([]);
    });

    it('returns valid permissions only when authenticated session exists', async () => {
      const session: AuthSession = {
        userId: 'usr-owner-1',
        name: 'Owner User',
        role: 'RESIDENT_OWNER',
        isMockSession: true,
      };
      await act(async () => {
        await setCurrentSession(session);
      });

      let captured: ReturnType<typeof usePermission> | null = null;
      function TestComp() {
        captured = usePermission({ permission: 'VISITOR_VIEW' });
        return React.createElement(View);
      }
      await renderWithProviders(React.createElement(TestComp));
      expect(captured).not.toBeNull();
      expect(captured!.user).toBeDefined();
      expect(captured!.user?.id).toBe('usr-owner-1');
      expect(captured!.isAllowed).toBe(true);
    });
  });

  describe('useAuthSession Mock Methods Production Guard', () => {
    it('rejects startMockSessionForPersona in production mode', async () => {
      runtimePolicy.setEnvironmentOverride('production');
      let captured: ReturnType<typeof useAuthSession> | null = null;
      function TestComp() {
        captured = useAuthSession();
        return React.createElement(View);
      }
      await renderWithProviders(React.createElement(TestComp));
      expect(captured).not.toBeNull();
      await expect(
        captured!.startMockSessionForPersona('rohan')
      ).rejects.toThrow(/strictly prohibited in production builds/);
    });

    it('rejects startMockSessionForRoute in production mode', async () => {
      runtimePolicy.setEnvironmentOverride('production');
      let captured: ReturnType<typeof useAuthSession> | null = null;
      function TestComp() {
        captured = useAuthSession();
        return React.createElement(View);
      }
      await renderWithProviders(React.createElement(TestComp));
      expect(captured).not.toBeNull();
      await expect(
        captured!.startMockSessionForRoute('ResidentApp')
      ).rejects.toThrow(/strictly prohibited in production builds/);
    });

    it('rejects startMockSessionForRole in production mode', async () => {
      runtimePolicy.setEnvironmentOverride('production');
      let captured: ReturnType<typeof useAuthSession> | null = null;
      function TestComp() {
        captured = useAuthSession();
        return React.createElement(View);
      }
      await renderWithProviders(React.createElement(TestComp));
      expect(captured).not.toBeNull();
      await expect(
        captured!.startMockSessionForRole('SUPER_ADMIN')
      ).rejects.toThrow(/strictly prohibited in production builds/);
    });
  });
});
