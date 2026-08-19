import { apiClient } from '../apiClient';
import { clearTokens, setAccessToken } from '../../auth/tokenStore';
import { createApiSuccess } from '../../../test/mockApiClient';

describe('apiClient', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-29T10:00:00.000Z'));
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => createApiSuccess({ ok: true }),
      status: 200,
      statusText: 'OK',
    })) as jest.Mock;
  });

  afterEach(async () => {
    jest.useRealTimers();
    await clearTokens();
  });

  it('builds GET URL with query params and request headers', async () => {
    await setAccessToken('token-001');
    await apiClient.get('/visitors', { query: { status: 'APPROVED' } });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/visitors?status=APPROVED'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-001',
          'X-Society-Id': 'society-001',
          'X-Unit-Id': 'unit-a-1204',
          'X-Actor-Role': 'RESIDENT_OWNER',
          'X-Correlation-Id': expect.any(String),
        }),
      })
    );
  });

  it('omits auth header when no token exists', async () => {
    await apiClient.post('/complaints', { title: 'Leakage' });
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.body).toBe(JSON.stringify({ title: 'Leakage' }));
  });
});
