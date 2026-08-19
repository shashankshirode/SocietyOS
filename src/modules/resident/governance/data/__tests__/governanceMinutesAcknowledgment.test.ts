import { mockResidentHomeContexts } from '../../../homeContext/data/residentHomeContext.mockData';
import type { ResidentRepositoryRequestContext } from '../../../homeContext/data/residentHomeContext.types';
import { mapContextToActive } from '../../../homeContext/state/residentHomeContext.store';
import { governanceMockSource } from '../governance.mockSource';

function context(homeContextId: string): ResidentRepositoryRequestContext {
  const home = mockResidentHomeContexts.find((candidate) => candidate.homeContextId === homeContextId);
  if (!home) throw new Error('TEST_HOME_CONTEXT_MISSING');
  const activeHome = mapContextToActive(home);
  return { activeHome, dataScopeKey: activeHome.dataScopeKey };
}

describe('meeting-minutes acknowledgment', () => {
  it('persists idempotently without leaking across residence contexts', async () => {
    const ownerResidence = context('context-004');
    const tenantResidence = context('context-003');

    const ownerBefore = await governanceMockSource.getMeetingMinutes('meet-003', ownerResidence);
    const tenantBefore = await governanceMockSource.getMeetingMinutes('meet-003', tenantResidence);
    expect(ownerBefore.ok && ownerBefore.data?.acknowledged).toBe(false);
    expect(tenantBefore.ok && tenantBefore.data?.acknowledged).toBe(false);

    const first = await governanceMockSource.acknowledgeMeetingMinutes('mom-003', ownerResidence);
    const duplicate = await governanceMockSource.acknowledgeMeetingMinutes('mom-003', ownerResidence);
    expect(first.ok).toBe(true);
    expect(duplicate.ok).toBe(true);
    if (!first.ok || !duplicate.ok) return;
    expect(duplicate.data.acknowledgedAt).toBe(first.data.acknowledgedAt);

    const ownerAfter = await governanceMockSource.getMeetingMinutes('meet-003', ownerResidence);
    const tenantAfter = await governanceMockSource.getMeetingMinutes('meet-003', tenantResidence);
    expect(ownerAfter.ok && ownerAfter.data?.acknowledgedAt).toBe(first.data.acknowledgedAt);
    expect(tenantAfter.ok && tenantAfter.data?.acknowledged).toBe(false);
  });

  it('rejects an acknowledgment for missing minutes', async () => {
    const result = await governanceMockSource.acknowledgeMeetingMinutes('missing-minutes', context('context-004'));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('MINUTES_NOT_FOUND');
  });
});
