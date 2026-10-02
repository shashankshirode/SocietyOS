import { apiClient } from '../../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../../core/api/apiEndpoints';
import { occupancyApiSource } from '../occupancy.apiSource';

jest.mock('../../../../../core/api/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.MockedFunction<typeof apiClient.get>;
const postMock = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
const patchMock = apiClient.patch as jest.MockedFunction<typeof apiClient.patch>;

const scope = { societyId: 'soc-1', unitId: 'unit-1' };

describe('occupancyApiSource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps well formed occupancy rows', async () => {
    getMock.mockResolvedValue([
      {
        id: 'occ-1',
        unitId: 'unit-1',
        flatNumber: 'A-101',
        occupantName: 'Asha Rao',
        occupantType: 'OWNER',
        leaseStartDate: '2026-01-01',
        documentStatus: 'APPROVED',
      },
    ] as never);

    const result = await occupancyApiSource.getOccupancyRecords();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.flatNumber).toBe('A-101');
      expect(result.data[0]?.occupantType).toBe('OWNER');
    }
  });

  it('drops rows that lack a required id or unitId instead of inventing them', async () => {
    getMock.mockResolvedValue([
      { id: 'occ-1', unitId: 'unit-1' },
      { unitId: 'unit-2' },
      { id: 'occ-3' },
      'not-an-object',
      null,
    ] as never);

    const result = await occupancyApiSource.getOccupancyRecords();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.id).toBe('occ-1');
    }
  });

  it('defaults an unrecognised occupant type and document status conservatively', async () => {
    getMock.mockResolvedValue([{ id: 'occ-1', unitId: 'unit-1', occupantType: 'ALIEN', documentStatus: 'MAYBE' }] as never);

    const result = await occupancyApiSource.getOccupancyRecords();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]?.occupantType).toBe('OWNER');
      expect(result.data[0]?.documentStatus).toBe('PENDING');
    }
  });

  it('tolerates a non array payload by returning no records rather than throwing', async () => {
    getMock.mockResolvedValue({ unexpected: true } as never);

    const result = await occupancyApiSource.getOccupancyRecords();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([]);
    }
  });

  it('does not invent a backend route for occupancy document status approval', async () => {
    const result = await occupancyApiSource.updateOccupancyStatus('occ-1', 'APPROVED');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INTEGRATION_UNAVAILABLE');
      expect(result.error.category).toBe('INTEGRATION_UNAVAILABLE');
    }
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('reads the occupancy timeline for a unit', async () => {
    getMock.mockResolvedValue({ entries: [] } as never);

    const result = await occupancyApiSource.listOccupancyHistoryByUnit(scope);

    expect(result.ok).toBe(true);
    expect(getMock).toHaveBeenCalledWith(apiEndpoints.occupancy.occupancyTimeline('soc-1', 'unit-1'));
  });

  it('reads owner and tenant history for a unit', async () => {
    getMock.mockResolvedValue([] as never);

    const owners = await occupancyApiSource.listOwnerHistoryByUnit(scope);
    const tenants = await occupancyApiSource.listTenantHistoryByUnit(scope);

    expect(owners.ok).toBe(true);
    expect(tenants.ok).toBe(true);
    expect(getMock).toHaveBeenNthCalledWith(1, apiEndpoints.occupancy.ownerHistory('soc-1', 'unit-1'));
    expect(getMock).toHaveBeenNthCalledWith(2, apiEndpoints.occupancy.tenantHistory('soc-1', 'unit-1'));
  });

  it('reads the flat occupancy overview for a unit', async () => {
    getMock.mockResolvedValue({ timeline: [] } as never);

    const result = await occupancyApiSource.getFlatTimeline(scope);

    expect(result.ok).toBe(true);
    expect(getMock).toHaveBeenCalledWith(apiEndpoints.occupancy.occupancyOverview('soc-1', 'unit-1'));
  });

  it('reads previous resident documents', async () => {
    getMock.mockResolvedValue([] as never);

    const result = await occupancyApiSource.listPreviousResidentDocuments({
      ...scope,
      residentHistoryId: 'rh-1',
    });

    expect(result.ok).toBe(true);
    expect(getMock).toHaveBeenCalledWith(apiEndpoints.occupancy.prevResidentDocs('soc-1', 'unit-1', 'rh-1'));
  });

  it('rejects a request without a unit scope instead of fabricating history', async () => {
    const withoutScope = await occupancyApiSource.listOccupancyHistoryByUnit(null);

    expect(withoutScope.ok).toBe(false);
    if (!withoutScope.ok) {
      expect(withoutScope.error.code).toBe('VALIDATION_FAILED');
      expect(withoutScope.error.category).toBe('VALIDATION');
    }
    expect(getMock).not.toHaveBeenCalled();
  });

  it('rejects a scope that is missing the unitId', async () => {
    const result = await occupancyApiSource.getFlatTimeline({ societyId: 'soc-1' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION_FAILED');
    }
    expect(getMock).not.toHaveBeenCalled();
  });

  it('rejects previous resident documents without a resident history id', async () => {
    const result = await occupancyApiSource.listPreviousResidentDocuments({ societyId: 'soc-1', unitId: 'unit-1' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION_FAILED');
    }
    expect(getMock).not.toHaveBeenCalled();
  });

  it('creates move in and move out requests with idempotency keys', async () => {
    postMock.mockResolvedValue({ id: 'mi-1' } as never);
    const moveIn = await occupancyApiSource.createMoveInRequest({ societyId: 'soc-1' });
    expect(moveIn.ok).toBe(true);
    const [moveInPath, , moveInOptions] = postMock.mock.calls[0] ?? [];
    expect(moveInPath).toBe(apiEndpoints.occupancy.createMoveInRequest);
    expect((moveInOptions as { idempotencyKey: string }).idempotencyKey).toMatch(/^occupancy-move-in_/);

    postMock.mockResolvedValue({ id: 'mo-1' } as never);
    const moveOut = await occupancyApiSource.createMoveOutRequest({ societyId: 'soc-1' });
    expect(moveOut.ok).toBe(true);
    const [moveOutPath, , moveOutOptions] = postMock.mock.calls[1] ?? [];
    expect(moveOutPath).toBe('/move-out-requests');
    expect((moveOutOptions as { idempotencyKey: string }).idempotencyKey).toMatch(/^occupancy-move-out_/);
  });

  it('activates and revokes resident access with idempotency keys', async () => {
    postMock.mockResolvedValue({ status: 'ACTIVE' } as never);
    const activated = await occupancyApiSource.activateResidentAccess(scope);
    expect(activated.ok).toBe(true);
    const [activatePath, , activateOptions] = postMock.mock.calls[0] ?? [];
    expect(activatePath).toBe(apiEndpoints.occupancy.accessActivate('soc-1', 'unit-1'));
    expect((activateOptions as { idempotencyKey: string }).idempotencyKey).toMatch(/^occupancy-access-activate_/);

    postMock.mockResolvedValue({ status: 'REVOKED' } as never);
    const revoked = await occupancyApiSource.revokeResidentAccess(scope);
    expect(revoked.ok).toBe(true);
    const [revokePath, , revokeOptions] = postMock.mock.calls[1] ?? [];
    expect(revokePath).toBe(apiEndpoints.occupancy.accessRevoke('soc-1', 'unit-1'));
    expect((revokeOptions as { idempotencyKey: string }).idempotencyKey).toMatch(/^occupancy-access-revoke_/);
  });

  it('returns a failure instead of throwing when the backend is down', async () => {
    getMock.mockRejectedValue({ code: 'INTEGRATION_UNAVAILABLE', message: 'gateway down' });

    const result = await occupancyApiSource.getFlatTimeline(scope);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INTEGRATION_UNAVAILABLE');
    }
  });
});
