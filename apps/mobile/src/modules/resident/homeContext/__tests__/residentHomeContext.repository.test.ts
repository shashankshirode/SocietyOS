import { residentHomeContextRepository } from '../data/residentHomeContext.repository';

describe('residentHomeContextRepository', () => {
  it('fetches contexts via mock source', async () => {
    const list = await residentHomeContextRepository.getHomeContexts();
    expect(list.ok).toBe(true);
    if (list.ok) {
      expect(list.data.length).toBe(8);
    }
  });

  it('retrieves active context structure', async () => {
    const active = await residentHomeContextRepository.getActiveHomeContext();
    expect(active.ok).toBe(true);
    if (active.ok) {
      expect(active.data.homeContextId).toBeDefined();
      expect(active.data.societyId).toBeDefined();
    }
  });

  it('validates a switch without mutating active state before the caller commits it', async () => {
    const before = await residentHomeContextRepository.getActiveHomeContext();
    const switched = await residentHomeContextRepository.switchHomeContext({
      homeContextId: 'context-004',
    });
    const after = await residentHomeContextRepository.getActiveHomeContext();

    expect(switched.ok).toBe(true);
    expect(before.ok && after.ok && after.data.homeContextId).toBe(
      before.ok ? before.data.homeContextId : undefined
    );
  });

  it('rejects pending homes but allows partially restricted homes', async () => {
    const pending = await residentHomeContextRepository.switchHomeContext({
      homeContextId: 'context-005',
    });
    const restricted = await residentHomeContextRepository.switchHomeContext({
      homeContextId: 'context-006',
    });

    expect(pending.ok).toBe(false);
    expect(restricted.ok).toBe(true);
    if (restricted.ok) {
      expect(restricted.data.activeContext.status).toBe('accessRestricted');
    }
  });
});
