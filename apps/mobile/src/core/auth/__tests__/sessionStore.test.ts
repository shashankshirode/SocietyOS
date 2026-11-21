import { getAccessToken } from '../tokenStore';
import { logoutCurrentSession } from '../logout';
import { getCurrentSession, setCurrentSession } from '../sessionStore';
import type { AuthSession } from '../authSession.types';

const mockSession: AuthSession = {
  userId: 'resident-test',
  name: 'Test Resident',
  role: 'RESIDENT_OWNER',
  societyId: 'society-test',
  unitId: 'unit-test',
  token: 'mock-token-test',
  refreshToken: 'mock-refresh-test',
  isMockSession: true,
};

describe('sessionStore', () => {
  afterEach(async () => {
    await logoutCurrentSession();
  });

  it('stores the current mock session and token placeholder', async () => {
    await setCurrentSession(mockSession);

    expect(getCurrentSession()).toEqual(mockSession);
    await expect(getAccessToken()).resolves.toBe('mock-token-test');
  });

  it('logoutCurrentSession clears session and token placeholder', async () => {
    await setCurrentSession(mockSession);

    await logoutCurrentSession();

    expect(getCurrentSession()).toBeNull();
    await expect(getAccessToken()).resolves.toBeNull();
  });
});
