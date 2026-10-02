import { apiClient } from '../../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../../core/api/apiEndpoints';
import { moveLifecycleApiSource } from '../moveLifecycle.apiSource';

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

function ok<T>(value: T): { ok: true; data: T } {
  return { ok: true, data: value };
}

const moveInCreateBody = {
  societyId: 'soc-1',
  unitId: 'unit-1',
  residentId: 'res-1',
  occupancyRelationshipId: 'rel-1',
  relationshipType: 'OWNER',
  occupancyStartDate: '2026-11-01',
  partyCount: 2,
  vehicleCount: 1,
  requiresLiftSlot: false,
  requiresParking: true,
};

function failure(code: string, message: string): { error: { code: string; message: string } } {
  return { error: { code, message } };
}

describe('moveLifecycleApiSource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists move in requests and maps every dto', async () => {
    getMock.mockResolvedValue([
      { id: 'mi-1', status: 'REQUESTED' },
      { id: 'mi-2', status: 'VERIFIED' },
    ] as never);

    const result = await moveLifecycleApiSource.listMoveInRequests();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0]?.moveInRequestId).toBe('mi-1');
      expect(result.data[1]?.status).toBe('VERIFIED');
    }
    expect(getMock).toHaveBeenCalledWith(apiEndpoints.move.createMoveIn);
  });

  it('reads a single move in request by id', async () => {
    getMock.mockResolvedValue({ id: 'mi-9', status: 'SCHEDULED' } as never);

    const result = await moveLifecycleApiSource.getMoveInRequest('mi-9');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.moveInRequestId).toBe('mi-9');
      expect(result.data.status).toBe('SCHEDULED');
    }
    expect(getMock).toHaveBeenCalledWith(apiEndpoints.move.moveInDetail('mi-9'));
  });

  it('attaches a fresh idempotency key when creating a move in request', async () => {
    postMock.mockResolvedValue({ id: 'mi-10', status: 'REQUESTED' } as never);

    const result = await moveLifecycleApiSource.createMoveInRequest(moveInCreateBody);

    expect(result.ok).toBe(true);
    expect(postMock).toHaveBeenCalledTimes(1);
    const [path, body, options] = postMock.mock.calls[0] ?? [];
    expect(path).toBe(apiEndpoints.move.createMoveIn);
    const sentBody = body as Record<string, string>;
    const sentKey = (options as { idempotencyKey: string }).idempotencyKey;
    expect(sentBody.idempotencyKey).toBe(sentKey);
    expect(sentKey).toMatch(/^move-in_/);
    expect(sentBody.societyId).toBe('soc-1');
  });

  it('submits a move in request with an idempotency key and no body', async () => {
    postMock.mockResolvedValue({ id: 'mi-11', status: 'APPROVED' } as never);

    const result = await moveLifecycleApiSource.submitMoveInRequest('mi-11');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('APPROVED');
    }
    const [path, body, options] = postMock.mock.calls[0] ?? [];
    expect(path).toBe(apiEndpoints.occupancy.submitMoveInRequest('mi-11'));
    expect(body).toBeUndefined();
    expect((options as { idempotencyKey: string }).idempotencyKey).toMatch(/^move-in-submit_/);
  });

  it('cancels a move in request forwarding the reason key', async () => {
    postMock.mockResolvedValue({ id: 'mi-12', status: 'CANCELLED' } as never);

    const result = await moveLifecycleApiSource.cancelMoveInRequest('mi-12', 'reason.withdrawn');
    expect(postMock).toHaveBeenCalledTimes(1);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('CANCELLED');
    }
    const [path, body] = postMock.mock.calls[0] ?? [];
    expect(path).toBe(apiEndpoints.occupancy.cancelMoveInRequest('mi-12'));
    expect((body as Record<string, string>).reasonKey).toBe('reason.withdrawn');
  });

  it('lists and reads move out requests', async () => {
    getMock.mockResolvedValue([{ id: 'mo-1', status: 'SIGNED' }] as never);
    const listed = await moveLifecycleApiSource.listMoveOutRequests();
    expect(listed.ok).toBe(true);
    if (listed.ok) {
      expect(listed.data[0]?.status).toBe('SIGNED');
    }

    getMock.mockResolvedValue({ id: 'mo-2', status: 'ARCHIVED' } as never);
    const single = await moveLifecycleApiSource.getMoveOutRequest('mo-2');
    expect(single.ok).toBe(true);
    if (single.ok) {
      expect(single.data.status).toBe('ARCHIVED');
    }
  });

  it('submits and cancels a move out request', async () => {
    postMock.mockResolvedValue({ id: 'mo-3', status: 'CLEARANCE_CHECK' } as never);
    const submitted = await moveLifecycleApiSource.submitMoveOutRequest('mo-3');
    expect(submitted.ok).toBe(true);
    const [submitPath] = postMock.mock.calls[0] ?? [];
    expect(submitPath).toBe(apiEndpoints.move.submitMoveOut('mo-3'));

    postMock.mockResolvedValue({ id: 'mo-4', status: 'CANCELLED' } as never);
    const cancelled = await moveLifecycleApiSource.cancelMoveOutRequest('mo-4', 'reason.relocated');
    expect(cancelled.ok).toBe(true);
    expect(postMock).toHaveBeenCalledTimes(2);
    const [cancelPath, cancelBody] = postMock.mock.calls[1] ?? [];
    expect(cancelPath).toBe(apiEndpoints.move.cancelMoveOut('mo-4'));
    expect((cancelBody as Record<string, string>).reasonKey).toBe('reason.relocated');
  });

  it('reads the move out clearance checklist', async () => {
    const checklist = { requestId: 'mo-5', items: [], generatedAt: '2026-10-01T00:00:00.000Z' };
    getMock.mockResolvedValue(checklist as never);

    const result = await moveLifecycleApiSource.getMoveOutClearanceChecklist('mo-5');

    expect(result).toEqual(ok(checklist));
    expect(getMock).toHaveBeenCalledWith(apiEndpoints.move.moveOutClearanceChecklist('mo-5'));
  });

  it('lists and reads noc requests', async () => {
    getMock.mockResolvedValue([{ id: 'noc-1', status: 'APPROVED' }] as never);
    const listed = await moveLifecycleApiSource.listNocRequests();
    expect(listed.ok).toBe(true);
    if (listed.ok) {
      expect(listed.data[0]?.nocRequestId).toBe('noc-1');
    }

    getMock.mockResolvedValue({ id: 'noc-2', status: 'ISSUED' } as never);
    const single = await moveLifecycleApiSource.getNocRequest('noc-2');
    expect(single.ok).toBe(true);
    if (single.ok) {
      expect(single.data.status).toBe('ISSUED');
    }
  });

  it('never throws and maps a transport error to a repository failure', async () => {
    getMock.mockRejectedValue(new Error('network unreachable'));

    const result = await moveLifecycleApiSource.getMoveInRequest('mi-1');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBeDefined();
    }
  });

  it('preserves a server error code and message instead of masking it', async () => {
    postMock.mockRejectedValue({ code: 'VALIDATION_FAILED', message: 'unit is occupied' });

    const result = await moveLifecycleApiSource.createMoveInRequest(moveInCreateBody);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION_FAILED');
      expect(result.error.message).toBe('unit is occupied');
    }
  });

  it('surfaces a not found error rather than returning an empty list', async () => {
    getMock.mockRejectedValue({ code: 'NOT_FOUND', message: 'missing move in' });

    const result = await moveLifecycleApiSource.listMoveInRequests();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NOT_FOUND');
    }
  });

  it('does not fall back to mock data when the api fails', async () => {
    getMock.mockRejectedValue({ code: 'INTEGRATION_UNAVAILABLE', message: 'down' });

    const result = await moveLifecycleApiSource.listMoveOutRequests();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.category).toBe('INTEGRATION_UNAVAILABLE');
    }
    expect(failure('INTEGRATION_UNAVAILABLE', 'down').error.code).toBe('INTEGRATION_UNAVAILABLE');
  });
});
