import type { HouseholdNotificationMode, HouseholdNotificationRecipient, HouseholdSponsor } from './householdActionGovernance.types';

export type EmergencyCategory = 'MEDICAL' | 'FIRE' | 'SECURITY' | 'LIFT' | 'CARE' | 'GENERIC_SOS';
export type EmergencyResponder = HouseholdNotificationRecipient & { escalationOrder: number; mandatory: boolean };

export type EmergencyRoutingPolicy = {
  version: number;
  mandatoryResponders: EmergencyResponder[];
  categoryResponders?: Partial<Record<EmergencyCategory, EmergencyResponder[]>>;
  householdAlwaysIncluded?: boolean;
};

export type EmergencyIncident = {
  incidentId: string;
  eventId: string;
  societyId: string;
  unitId: string;
  actorUserId: string;
  actorMembershipId: string;
  actorDisplayName: string;
  category: EmergencyCategory;
  status: 'CREATED' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED' | 'CANCELLED';
  routingPolicyVersion: number;
  resolvedRecipients: EmergencyResponder[];
  createdAt: string;
  acknowledgements: { recipientId: string; acknowledgedAt: string }[];
};

let incidentSequence = 0;

export function resolveEmergencyRecipients(input: {
  policy: EmergencyRoutingPolicy;
  category: EmergencyCategory;
  actorUserId: string;
  actorRelationship: 'OWNER' | 'CO_OWNER' | 'TENANT' | 'FAMILY_MEMBER' | 'AUTHORIZED_OCCUPANT' | 'SOCIETY_STAFF';
  householdSponsor?: HouseholdSponsor;
  householdRecipients?: EmergencyResponder[];
}): EmergencyResponder[] {
  const recipients: EmergencyResponder[] = [...input.policy.mandatoryResponders, ...(input.policy.categoryResponders?.[input.category] ?? [])];
  const shouldIncludeHousehold = input.actorRelationship !== 'TENANT' && (input.policy.householdAlwaysIncluded ?? true);
  if (shouldIncludeHousehold && input.householdSponsor && input.householdSponsor.userId !== input.actorUserId) {
    recipients.push({ userId: input.householdSponsor.userId, displayName: input.householdSponsor.displayName, reason: 'HOUSEHOLD_SPONSOR', mode: 'INSTANT', escalationOrder: Number.MAX_SAFE_INTEGER, mandatory: false });
  }
  if (input.actorRelationship !== 'TENANT') recipients.push(...(input.householdRecipients ?? []));
  const seen = new Set<string>();
  return recipients
    .filter((recipient) => {
      if (seen.has(recipient.userId)) return false;
      seen.add(recipient.userId);
      return true;
    })
    .sort((left, right) => left.escalationOrder - right.escalationOrder)
    .map((recipient) => ({ ...recipient, mode: 'INSTANT' as HouseholdNotificationMode }));
}

export function createEmergencyIncident(input: {
  eventId: string;
  societyId: string;
  unitId: string;
  actorUserId: string;
  actorMembershipId: string;
  actorDisplayName: string;
  actorRelationship: 'OWNER' | 'CO_OWNER' | 'TENANT' | 'FAMILY_MEMBER' | 'AUTHORIZED_OCCUPANT' | 'SOCIETY_STAFF';
  category: EmergencyCategory;
  policy: EmergencyRoutingPolicy;
  householdSponsor?: HouseholdSponsor;
  householdRecipients?: EmergencyResponder[];
}): EmergencyIncident {
  incidentSequence += 1;
  return {
    incidentId: `incident-${incidentSequence}`,
    eventId: input.eventId,
    societyId: input.societyId,
    unitId: input.unitId,
    actorUserId: input.actorUserId,
    actorMembershipId: input.actorMembershipId,
    actorDisplayName: input.actorDisplayName,
    category: input.category,
    status: 'CREATED',
    routingPolicyVersion: input.policy.version,
    resolvedRecipients: resolveEmergencyRecipients(input),
    createdAt: new Date().toISOString(),
    acknowledgements: [],
  };
}

export function acknowledgeEmergencyIncident(incident: EmergencyIncident, recipientId: string, acknowledgedAt = new Date().toISOString()): EmergencyIncident {
  if (!incident.resolvedRecipients.some((recipient) => recipient.userId === recipientId)) throw new Error('Recipient is not part of the incident routing snapshot');
  if (incident.acknowledgements.some((acknowledgement) => acknowledgement.recipientId === recipientId)) return incident;
  return { ...incident, status: 'ACKNOWLEDGED', acknowledgements: [...incident.acknowledgements, { recipientId, acknowledgedAt }] };
}

export function resetEmergencySequence(): void {
  incidentSequence = 0;
}