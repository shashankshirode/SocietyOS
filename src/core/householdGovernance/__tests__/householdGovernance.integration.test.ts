import { householdDomainEventBus } from '../domainEventBus';
import { createNotificationIntents } from '../notificationPolicy';
import { mockIdentityStore } from '../mockIdentityStore';
import { createEmergencyIncident, acknowledgeEmergencyIncident, type EmergencyRoutingPolicy } from '../emergencyRouting';

const societyPolicy: EmergencyRoutingPolicy = {
  version: 3,
  mandatoryResponders: [
    { userId: 'gate-security', displayName: 'Main Gate Security', reason: 'SOCIETY_RESPONDER', mode: 'INSTANT', escalationOrder: 1, mandatory: true },
    { userId: 'emergency-primary', displayName: 'Society Emergency Team', reason: 'SOCIETY_RESPONDER', mode: 'INSTANT', escalationOrder: 2, mandatory: true },
  ],
  householdAlwaysIncluded: true,
};

describe('household governance cross-account flows', () => {
  beforeEach(() => {
    householdDomainEventBus.reset();
    mockIdentityStore.reset();
  });

  it('attributes Sunita facility booking and creates a household notification', () => {
    const event = householdDomainEventBus.emit({
      membershipId: 'membership-sunita-green', action: 'BOOK_FACILITY', actionType: 'FACILITY_BOOKED', domain: 'facility', entityType: 'booking', entityId: 'booking-1',
      actionClass: 'RESERVATION', privacyClass: 'STANDARD', metadata: { facilityName: 'Badminton Court', phoneNumber: 'redacted' },
    });

    expect(event.actorUserId).toBe('user-sunita');
    expect(event.actorMembershipId).toBe('membership-sunita-green');
    expect(event.actorDisplayName).toBe('Sunita');
    expect(event.metadata).toEqual({ facilityName: 'Badminton Court' });

    const intents = createNotificationIntents({
      event,
      householdSponsor: { userId: 'user-rohan', displayName: 'Rohan', relationship: 'OWNER', eligibleForApproval: true },
      sponsorMode: 'INSTANT',
    });
    expect(intents).toHaveLength(1);
    expect(intents[0]?.recipientUserId).toBe('user-rohan');
  });

  it('keeps the same person residence-scoped across Green Valley and Maple', () => {
    expect(mockIdentityStore.getMembershipFor('user-sunita', 'home-green-b804').relationship).toBe('FAMILY_MEMBER');
    expect(mockIdentityStore.getMembershipFor('user-sunita', 'home-maple-p301').relationship).toBe('OWNER');
  });

  it('routes Amit SOS to society fallback and preserves the snapshot', () => {
    const event = householdDomainEventBus.emit({
      membershipId: 'membership-amit-green', action: 'TRIGGER_SOS', actionType: 'SOS_TRIGGERED', domain: 'emergency', entityType: 'incident', entityId: 'incident-1',
      actionClass: 'CRITICAL_SAFETY', privacyClass: 'SENSITIVE', securityImpact: true,
    });
    const incident = createEmergencyIncident({
      eventId: event.eventId, societyId: event.societyId, unitId: event.unitId, actorUserId: event.actorUserId, actorMembershipId: event.actorMembershipId,
      actorDisplayName: event.actorDisplayName, actorRelationship: event.actorRelationship, category: 'MEDICAL', policy: societyPolicy,
      householdSponsor: { userId: 'user-rohan', displayName: 'Rohan', relationship: 'OWNER', eligibleForApproval: true },
    });

    expect(incident.resolvedRecipients.map((recipient) => recipient.userId)).toEqual(['gate-security', 'emergency-primary', 'user-rohan']);
    expect(incident.routingPolicyVersion).toBe(3);
    const acknowledged = acknowledgeEmergencyIncident(incident, 'gate-security', '2026-08-23T17:09:00.000Z');
    expect(acknowledged.status).toBe('ACKNOWLEDGED');
    expect(acknowledged.acknowledgements).toHaveLength(1);
    expect(acknowledged.routingPolicyVersion).toBe(3);
  });

  it('keeps tenant household SOS private from the landlord while retaining society response', () => {
    const incident = createEmergencyIncident({
      eventId: 'event-tenant', societyId: 'society-green', unitId: 'unit-b804', actorUserId: 'user-tenant', actorMembershipId: 'membership-tenant', actorDisplayName: 'Priya',
      actorRelationship: 'TENANT', category: 'CARE', policy: societyPolicy,
      householdSponsor: { userId: 'user-landlord', displayName: 'Landlord', relationship: 'OWNER', eligibleForApproval: true },
    });

    expect(incident.resolvedRecipients.map((recipient) => recipient.userId)).toEqual(['gate-security', 'emergency-primary']);
  });
});