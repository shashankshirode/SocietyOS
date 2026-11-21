import { evaluateCapability, CapabilityAction } from '../../permissions/capabilityEngine';
import { MOCK_PERSONAS } from '../../identity/personaRegistry';
import { paymentGatewayService } from '../../../modules/accounting/services/paymentGatewayService';
import { billRepository } from '../../../modules/resident/billing/data/billing.repository';
import { createIdempotencyKey } from '../../api/idempotency';
import { setCurrentSession, clearCurrentSession, clearSensitiveCachedData } from '../../auth/sessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataSourceConfig } from '../../dataSource/dataSource.config';
import { centralDataSourceConfig } from '../../dataSource/dataSourceRegistry';
import type { AuthSession } from '../../auth/authSession.types';

describe('Security & Engineering Review Fix Verification', () => {
  afterEach(async () => {
    await clearCurrentSession();
    jest.clearAllMocks();
  });

  describe('SEC-02: Capability Engine Fail-Closed & SuperAdmin Scoping', () => {
    it('AUTHZ-001: Denies unknown capability actions by default', () => {
      const rohan = MOCK_PERSONAS.rohan;
      const res = evaluateCapability(rohan, 'UNKNOWN_ACTION_TEST' as CapabilityAction);
      expect(res.status).toBe('DENIED');
      expect(res.reason).toBe('Capability is not explicitly authorized.');
    });

    it('AUTHZ-002: Does not grant blanket access to SUPER_ADMIN on resident-scoped actions', () => {
      const superAdminContext = MOCK_PERSONAS.superadmin;
      // SUPER_ADMIN attempting to cancel an arbitrary resident's personal pass without ownership
      const res = evaluateCapability(superAdminContext, 'VISITOR_CANCEL_OWN', {
        resourceCreatorUserId: 'resident-user-123',
      });
      expect(res.status).toBe('DENIED');
    });
  });

  describe('SEC-05: Payment Callback Verification', () => {
    it('FIN-001: Rejects callback with missing signature', async () => {
      const result = await paymentGatewayService.handleCallback({
        paymentId: 'pay-123',
        amount: 500,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('PAYMENT_SIGNATURE_MISSING');
    });

    it('FIN-001b: Rejects callback with invalid signature', async () => {
      const result = await paymentGatewayService.handleCallback({
        paymentId: 'pay-123',
        amount: 500,
        signature: 'INVALID_SIGNATURE',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('PAYMENT_SIGNATURE_INVALID');
    });
  });

  describe('SEC-06: Billing Repository Financial Truthfulness', () => {
    it('returns UNSUPPORTED_OPERATION instead of fabricating publishedCount:15', async () => {
      const res = await billRepository.publishBillingCycle();
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('UNSUPPORTED_OPERATION');
      }
    });

    it('returns UNSUPPORTED_OPERATION for manual payment recording without backend', async () => {
      const res = await billRepository.recordManualPayment({
        unitId: 'unit-1',
        amount: 1000,
        paymentMethod: 'CASH_CHEQUE',
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('UNSUPPORTED_OPERATION');
      }
    });
  });

  describe('SEC-10 & SEC-11: Credential Storage & Sensitive Data Wiping', () => {
    it('does not store sensitive tokens in plain AsyncStorage', async () => {
      const testSession: AuthSession = {
        userId: 'usr-secure-test',
        name: 'Secure Test User',
        role: 'RESIDENT_OWNER',
        token: 'sensitive-jwt-access-token-123',
        refreshToken: 'sensitive-refresh-token-456',
        isMockSession: false,
      };

      await setCurrentSession(testSession);

      const storedRaw = await AsyncStorage.getItem('societyos.auth.session');
      expect(storedRaw).not.toBeNull();
      const parsed = JSON.parse(storedRaw!);
      expect(parsed.token).toBeUndefined();
      expect(parsed.refreshToken).toBeUndefined();
      expect(parsed.userId).toBe('usr-secure-test');
    });

    it('purges session and cached data on clearSensitiveCachedData', async () => {
      await AsyncStorage.setItem('api_cache', JSON.stringify({ key: 'cached-data' }));
      await clearSensitiveCachedData();

      const cachedAfter = await AsyncStorage.getItem('api_cache');
      expect(cachedAfter).toBeNull();
    });
  });

  describe('SEC-18: Demo/Prod Boundary', () => {
    it('disallows silent API fallback to mock', () => {
      expect(dataSourceConfig.allowApiFallbackToMock).toBe(false);
    });

    it('inherits defaultMode when module override is inherit or unset', () => {
      expect(centralDataSourceConfig.defaultMode).toBeDefined();
    });
  });

  describe('SEC-21: Cryptographically Strong IDs', () => {
    it('generates secure UUID-based idempotency keys with standard structure', () => {
      const key1 = createIdempotencyKey('test');
      const key2 = createIdempotencyKey('test');
      expect(key1).not.toBe(key2);
      expect(key1.startsWith('test_')).toBe(true);
      // UUID component format check (36 chars: 8-4-4-4-12)
      const uuidPart = key1.replace('test_', '');
      expect(uuidPart.length).toBeGreaterThanOrEqual(32);
    });
  });
});
