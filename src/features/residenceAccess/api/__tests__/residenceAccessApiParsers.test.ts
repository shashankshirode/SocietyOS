import { parseResidenceAccessPage } from '../residenceAccessApiParsers';

describe('residence access API parsers', () => {
  it('maps a newer server status to a protected supported fallback', () => {
    const payload: JsonValue = {
      totalCount: 1,
      dataVersion: 2,
      items: [{
        residence: {
          residenceAccessId: 'access-new-status',
          societyId: 'society-test',
          societyName: 'Test Society',
          unitId: 'unit-test',
          unitNumber: 'A-1',
          buildingName: 'Tower A',
          city: 'Nashik',
          role: 'TENANT',
          image: { fallbackIcon: 'home-outline', accessibilityLabel: 'Test residence' },
        },
        accessRecord: {
          residenceAccessId: 'access-new-status',
          userId: 'resident-test',
          societyId: 'society-test',
          unitId: 'unit-test',
          occupancyId: 'occupancy-test',
          role: 'TENANT',
          status: 'SERVER_STATUS_NOT_IN_THIS_BUILD',
          blockers: [],
          statusReason: 'Server-provided status',
          residentPendingActions: [],
          societyPendingActions: [],
          completedSteps: [],
          statusUpdatedAt: '2026-07-16T00:00:00.000Z',
          referenceNumber: 'RES-TEST-1',
          canWithdraw: false,
          correctionAllowed: false,
          appealAllowed: false,
          reactivationAllowed: false,
          reminderCooldownHours: 24,
          featureRestrictions: [],
          dataVersion: 2,
        },
        eligibility: {
          canEnterResidence: true,
          canViewLimitedResidenceData: true,
          canUploadDocuments: true,
          canEditSubmittedDetails: true,
          canSendReminder: true,
          canRequestOwnerConsent: true,
          canResubmit: true,
          canAppeal: true,
          canRequestReactivation: true,
          canContactSociety: true,
          blockingReasons: [],
          nextRecommendedAction: 'ENTER_RESIDENCE',
        },
        primaryAction: {
          type: 'ENTER_RESIDENCE',
          label: 'Enter residence',
          accessibilityLabel: 'Enter residence',
          enabled: true,
        },
        secondaryActions: [],
        completedRequirementCount: 0,
        totalRequirementCount: 0,
      }],
    };

    const parsed = parseResidenceAccessPage(payload);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.items[0]?.accessRecord.status).toBe('ARCHIVED');
      expect(parsed.data.items[0]?.eligibility.canEnterResidence).toBe(false);
      expect(parsed.data.items[0]?.primaryAction.type).toBe('VIEW_HISTORY');
    }
  });
});
