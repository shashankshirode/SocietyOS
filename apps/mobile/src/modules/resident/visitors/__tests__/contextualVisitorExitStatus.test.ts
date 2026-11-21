import type { Visitor } from '../../../../shared/types/visitor.types';
import { deriveVisitorExitAlert } from '../utils/contextualVisitorExitStatus';

function buildVisitor(overrides: Partial<Visitor> = {}): Visitor {
  return {
    id: 'vis-test-cab',
    name: 'Cab Test',
    phone: '9000000000',
    type: 'CAB',
    status: 'APPROVED',
    expectedDate: '2026-07-09',
    expectedTime: '11:15 AM',
    flatNumber: 'A-1204',
    societyName: 'Green Valley Heights',
    purpose: 'Cab pickup',
    otp: '123456',
    createdAt: '2026-07-09T10:50:00.000Z',
    visitorCategory: 'cab',
    exitTracking: {
      expectedEntryAtIso: '2026-07-09T11:15:00.000Z',
      actualEntryAtIso: '2026-07-09T11:15:00.000Z',
      expectedExitAtIso: '2026-07-09T11:45:00.000Z',
      gracePeriodMinutes: 10,
      exitStatus: 'overdue',
      alertStatus: 'sent',
      alertDueAtIso: '2026-07-09T11:55:00.000Z',
      timeline: [],
    },
    ...overrides,
  };
}

describe('contextualVisitorExitStatus', () => {
  it('creates an actionable alert after the grace window', () => {
    const alert = deriveVisitorExitAlert(buildVisitor(), '2026-07-09T12:00:00.000Z');

    expect(alert).toMatchObject({
      visitorPassId: 'vis-test-cab',
      visitorName: 'Cab Test',
      visitorCategory: 'cab',
      priority: 'high',
      status: 'sent',
    });
  });

  it('suppresses alerts after gate closure or resident resolution', () => {
    expect(
      deriveVisitorExitAlert(
        buildVisitor({
          status: 'COMPLETED',
        }),
        '2026-07-09T12:00:00.000Z'
      )
    ).toBeUndefined();

    expect(
      deriveVisitorExitAlert(
        buildVisitor({
          exitTracking: {
            ...buildVisitor().exitTracking!,
            alertStatus: 'resolved',
            actualExitAtIso: '2026-07-09T11:50:00.000Z',
          },
        }),
        '2026-07-09T12:00:00.000Z'
      )
    ).toBeUndefined();
  });
});
