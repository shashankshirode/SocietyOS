import { mockStore } from '../../../../core/mockStore/mockStore';
import { addMinutesToIso } from '../utils/visitorExitPolicyResolver';
import { visitorExitAssuranceMockNowIso } from '../data/visitorExitPolicy';
import { visitorsMockSource } from '../data/visitors.mockSource';

describe('visitorsMockSource assurance actions', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  it('returns current unresolved assurance alerts from mock data', async () => {
    const result = await visitorsMockSource.getVisitorExitAlerts();

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data).toHaveLength(5);
    expect(
      result.data.every((alert) => alert.visitorPassId.startsWith('context-001:visitors:'))
    ).toBe(true);
  });

  it('records resident confirmation that the visitor has left', async () => {
    const result = await visitorsMockSource.confirmVisitorLeft({
      visitorPassId: 'vis-ola-cab-overdue',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.exitTracking).toMatchObject({
      exitStatus: 'residentConfirmedLeft',
      alertStatus: 'acknowledged',
      residentResponse: 'left',
    });
  });

  it('records resident confirmation that the visitor remains inside', async () => {
    const result = await visitorsMockSource.confirmVisitorStillInside({
      visitorPassId: 'vis-amazon-delivery-overdue',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.exitTracking).toMatchObject({
      exitStatus: 'residentConfirmedStillInside',
      alertStatus: 'acknowledged',
      residentResponse: 'stillInside',
    });
  });

  it('extends the resident selected timing and snoozes the alert state', async () => {
    const nextExitAtIso = addMinutesToIso(visitorExitAssuranceMockNowIso, 45);
    const result = await visitorsMockSource.extendVisitorExpectedExit({
      visitorPassId: 'vis-blue-dart-parcel-overdue',
      expectedExitAtIso: nextExitAtIso,
      reason: 'Resident requested more time',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.exitTracking).toMatchObject({
      expectedExitAtIso: nextExitAtIso,
      extendedExpectedExitAtIso: nextExitAtIso,
      exitStatus: 'extended',
      alertStatus: 'snoozed',
      residentResponse: 'extended',
    });
  });

  it('escalates unresolved assurance work to security', async () => {
    const result = await visitorsMockSource.contactSecurityForVisitorExit({
      visitorPassId: 'vis-amazon-delivery-overdue',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data).toEqual({
      visitorPassId: 'vis-amazon-delivery-overdue',
      alertStatus: 'escalated',
      exitStatus: 'escalatedToSecurity',
    });
  });
});
