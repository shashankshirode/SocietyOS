import { createMockResidenceAccessData } from '../../repositories/mockResidenceAccessData';
import { resolveResidenceAccessEligibility } from '../ResidenceAccessEligibilityService';
import { residenceAccessTransitionService } from '../ResidenceAccessTransitionService';
import { residenceNavigationGuard } from '../ResidenceNavigationGuardService';
import { resolveResidenceExpiryReminder } from '../ResidenceExpiryReminderService';
import type { ResidenceAccessActor, ResidenceAccessRecord } from '../../models/residenceAccess.types';

const resident: ResidenceAccessActor = {
  actorType: 'RESIDENT',
  actorId: 'resident-test',
  actorDisplayRole: 'Resident',
};

const society: ResidenceAccessActor = {
  actorType: 'SOCIETY_ADMIN',
  actorId: 'society-test',
  actorDisplayRole: 'Society Office',
};

function recordById(residenceAccessId: string): ResidenceAccessRecord {
  const record = createMockResidenceAccessData().records.find((entry) => entry.residenceAccessId === residenceAccessId);
  if (!record) throw new Error(`Missing residence access fixture ${residenceAccessId}`);
  return record;
}

describe('residence access state rules', () => {
  it('allows resident submission but never resident self-approval', () => {
    const documents = recordById('access-documents-required');
    expect(residenceAccessTransitionService.canTransition('DOCUMENTS_REQUIRED', 'SOCIETY_APPROVAL_PENDING', resident)).toBe(true);
    expect(residenceAccessTransitionService.canTransition('SOCIETY_APPROVAL_PENDING', 'APPROVED', resident)).toBe(false);
    expect(residenceAccessTransitionService.canTransition('SOCIETY_APPROVAL_PENDING', 'APPROVED', society)).toBe(true);

    const attemptedApproval = residenceAccessTransitionService.transition(
      { ...documents, status: 'SOCIETY_APPROVAL_PENDING' },
      { type: 'APPROVE', actor: resident },
    );
    expect(attemptedApproval.allowed).toBe(false);
    expect(attemptedApproval.residenceAccess.status).toBe('SOCIETY_APPROVAL_PENDING');
  });

  it('keeps eligibility and dashboard destinations residence-specific', () => {
    const active = recordById('access-active-owner');
    const pending = recordById('access-approval-pending');
    const suspended = recordById('access-suspended-owner');
    const restricted = recordById('access-restricted');
    const future = recordById('access-future-tenant');

    const activeEligibility = resolveResidenceAccessEligibility(active);
    const pendingEligibility = resolveResidenceAccessEligibility(pending);
    const suspendedEligibility = resolveResidenceAccessEligibility(suspended);
    const restrictedEligibility = resolveResidenceAccessEligibility(restricted);
    const futureEligibility = resolveResidenceAccessEligibility(future);

    expect(residenceNavigationGuard.resolveDestination(active, activeEligibility)).toBe('RESIDENT_DASHBOARD');
    expect(residenceNavigationGuard.resolveDestination(restricted, restrictedEligibility)).toBe('RESIDENT_DASHBOARD');
    expect(restrictedEligibility.canEnterResidence).toBe(true);
    expect(restricted.featureRestrictions.length).toBeGreaterThan(0);
    expect(residenceNavigationGuard.resolveDestination(pending, pendingEligibility)).toBe('APPROVAL_PROGRESS');
    expect(residenceNavigationGuard.resolveDestination(suspended, suspendedEligibility)).toBe('SUSPENSION_RESOLUTION');
    expect(residenceNavigationGuard.resolveDestination(future, futureEligibility)).toBe('RESIDENCE_ACCESS_OVERVIEW');
    expect(pendingEligibility.canEnterResidence).toBe(false);
    expect(suspendedEligibility.canEnterResidence).toBe(false);
    expect(futureEligibility.canEnterResidence).toBe(false);
  });

  it('routes rejected, expired, inactive and owner-consent states to distinct experiences', () => {
    const cases = [
      ['access-rejected-family', 'REJECTION_DECISION'],
      ['access-expired-tenant', 'ACCESS_RENEWAL'],
      ['access-inactive-owner', 'REACTIVATION_STATUS'],
      ['access-owner-consent', 'OWNER_CONSENT'],
    ] as const;

    cases.forEach(([id, expected]) => {
      const record = recordById(id);
      expect(
        residenceNavigationGuard.resolveDestination(record, resolveResidenceAccessEligibility(record)),
      ).toBe(expected);
    });
  });

  it('uses configurable expiry milestones and suppresses a milestone already notified', () => {
    const active = recordById('access-active-owner');
    const now = new Date('2026-07-16T00:00:00.000Z');
    const expiring = {
      ...active,
      effectiveUntil: '2026-07-22T00:00:00.000Z',
    };
    const reminder = resolveResidenceExpiryReminder(
      expiring,
      [],
      { enabled: true, thresholdsInDays: [30, 15, 7, 1, 0] },
      now,
    );
    expect(reminder?.thresholdInDays).toBe(7);
    const suppressed = resolveResidenceExpiryReminder(
      expiring,
      [{
        notificationId: `expiry-${active.residenceAccessId}-7`,
        userId: active.userId,
        residenceAccessId: active.residenceAccessId,
        type: 'ACCESS_EXPIRING_SOON',
        title: 'Expiry reminder',
        body: 'Access expires soon.',
        createdAt: now.toISOString(),
        deepLinkDestination: 'ACCESS_RENEWAL',
      }],
      { enabled: true, thresholdsInDays: [30, 15, 7, 1, 0] },
      now,
    );
    expect(suppressed).toBeNull();
  });
});
