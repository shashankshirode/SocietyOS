import { evaluateHouseholdAction, resolveNotificationRecipients } from '../householdActionGovernance.engine';
import { buildHouseholdActionEvent } from '../householdActionEventBuilder';
import type { HouseholdActionEvent } from '../householdActionGovernance.types';

const event: HouseholdActionEvent = {
  eventId: 'event-1',
  correlationId: 'correlation-1',
  societyId: 'society-1',
  unitId: 'unit-1',
  actorUserId: 'user-sunita',
  actorMembershipId: 'membership-sunita-green',
  actorPersonId: 'person-sunita',
  actorDisplayName: 'Sunita',
  actorRelationship: 'FAMILY_MEMBER',
  actorRole: 'RESIDENT_FAMILY',
  actionType: 'FACILITY_BOOKING_CREATED',
  domain: 'facility',
  entityType: 'facilityBooking',
  entityId: 'booking-1',
  timestamp: '2026-08-23T19:00:00.000Z',
  actionClass: 'RESERVATION',
  privacyClass: 'STANDARD',
  financialImpact: 0,
  securityImpact: false,
  metadata: {},
  result: 'SUCCEEDED',
};

describe('household action governance', () => {
  it('requires approval for a paid family action above the configured threshold', () => {
    expect(evaluateHouseholdAction({
      actorRelationship: 'FAMILY_MEMBER',
      actionClass: 'RESERVATION',
      privacyClass: 'STANDARD',
      financialImpact: 8000,
      permissionGranted: true,
      societyAllowsAction: true,
      approvalThreshold: 5000,
      notificationMode: 'INSTANT',
    }).decision).toBe('REQUIRE_OWNER_APPROVAL');
  });

  it('forces instant critical notification and includes society responders', () => {
    const criticalEvent = { ...event, actionClass: 'CRITICAL_SAFETY' as const };
    const recipients = resolveNotificationRecipients({
      event: criticalEvent,
      householdSponsor: { userId: 'user-rohan', displayName: 'Rohan', relationship: 'OWNER', eligibleForApproval: true },
      societyResponders: [{ userId: 'gate-role', displayName: 'Gate Security', reason: 'SOCIETY_RESPONDER', mode: 'OFF' }],
      sponsorMode: 'OFF',
    });

    expect(recipients.map((recipient) => recipient.userId)).toEqual(['user-rohan', 'gate-role']);
    expect(recipients.every((recipient) => recipient.mode === 'INSTANT')).toBe(true);
  });

  it('does not route tenant household activity to the landlord', () => {
    const recipients = resolveNotificationRecipients({
      event: { ...event, actorRelationship: 'TENANT' },
      householdSponsor: { userId: 'user-amit', displayName: 'Amit', relationship: 'TENANT', eligibleForApproval: true },
    });

    expect(recipients).toEqual([]);
  });

  it('deduplicates a sponsor also present in configured recipients', () => {
    const recipients = resolveNotificationRecipients({
      event: { ...event, financialImpact: 100 },
      householdSponsor: { userId: 'user-rohan', displayName: 'Rohan', relationship: 'OWNER', eligibleForApproval: true },
      configuredRecipients: [{ userId: 'user-rohan', displayName: 'Rohan', reason: 'CONFIGURED_CONTACT', mode: 'INSTANT' }],
    });

    expect(recipients).toHaveLength(1);
  });

  it('builds an attributed event without copying sensitive metadata', () => {
    const built = buildHouseholdActionEvent({
      actorPersonId: 'person-sunita',
      actorDisplayName: 'Sunita',
      actorRelationship: 'FAMILY_MEMBER',
      actionType: 'DOCUMENT_UPDATED',
      domain: 'documents',
      entityType: 'document',
      entityId: 'document-1',
      actionClass: 'PROPERTY_OPERATION',
      privacyClass: 'SENSITIVE',
      metadata: { documentType: 'POLICE_VERIFICATION', phoneNumber: '5555555555' },
    });

    expect(built.actorDisplayName).toBe('Sunita');
    expect(built.actorPersonId).toBe('person-sunita');
    expect(built.metadata).toEqual({ documentType: 'POLICE_VERIFICATION' });
  });
});