import { mockStore } from '../../../../core/mockStore/mockStore';
import { addMinutesToIso } from '../utils/visitorExitPolicyResolver';
import { visitorExitAssuranceMockNowIso } from '../data/visitorExitPolicy';
import { visitorsMockSource } from '../data/visitors.mockSource';
import { VisitorPassCancellationReason } from '../../../../shared/types/visitor.types';
import { getScopedDashboardData } from '../../dashboard/data/dashboard.mockSource';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import { getRequiredItem } from '../../../../shared/utils/requiredItem';

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

  it('issues a unique credential only after create and invalidates it on cancellation', async () => {
    const result = await visitorsMockSource.create({
      name: 'Rajesh Kulkarni',
      phone: '9876543210',
      type: 'GUEST',
      expectedDate: 'Today',
      expectedTime: '5:30 PM',
      purpose: 'Social visit',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.otp).toMatch(/^\d{6}$/);
    expect(visitorsMockSource.validateCredential(result.data.id, result.data.otp)).toBe('VALID');

    await visitorsMockSource.cancelVisitorPass({
      residenceId: result.data.homeContextId ?? '',
      visitorPassId: result.data.id,
      reason: VisitorPassCancellationReason.PlansChanged,
      notes: null,
      requestedAt: new Date().toISOString(),
    });

    expect(visitorsMockSource.validateCredential(result.data.id, result.data.otp)).toBe('CANCELLED');
  });

  it('projects the authoritative visitor into the matching Home pulse and Activity only', async () => {
    const home = mapContextToActive(getRequiredItem(mockResidentHomeContexts, 0, 'residentVisitors.repository.exitAssurance.test.ts'));
    const created = await visitorsMockSource.create({
      activeHome: home,
      dataScopeKey: home.dataScopeKey,
    }, {
      name: 'Rajesh Pulse Test',
      phone: '9876543210',
      type: 'GUEST',
      expectedDate: 'Today',
      expectedTime: '5:30 PM',
      purpose: 'Social visit',
    });

    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const dashboard = getScopedDashboardData({ activeHome: home, dataScopeKey: home.dataScopeKey });
    expect(dashboard.visitorTimeline.some((visitor) => visitor.id === created.data.id)).toBe(true);
    expect(dashboard.activities.some((activity) => activity.id === `created-activity-${created.data.id}`)).toBe(true);

    const otherHome = mapContextToActive(getRequiredItem(mockResidentHomeContexts, 2, 'residentVisitors.repository.exitAssurance.test.ts'));
    const otherDashboard = getScopedDashboardData({ activeHome: otherHome, dataScopeKey: otherHome.dataScopeKey });
    expect(otherDashboard.visitorTimeline.some((visitor) => visitor.id === created.data.id)).toBe(false);
  });
});
