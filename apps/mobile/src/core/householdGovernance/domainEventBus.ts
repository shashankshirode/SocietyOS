import { createCorrelationId } from '../api/requestContext';
import { authorizeResidentAction, type ResidentAction } from './actionAuthorization';
import { mockIdentityStore } from './mockIdentityStore';
import type { HouseholdActionClass, HouseholdActionEvent, HouseholdPrivacyClass } from './householdActionGovernance.types';

export type EmitActionInput = {
  membershipId: string;
  action: ResidentAction;
  actionType: string;
  domain: string;
  entityType: string;
  entityId: string;
  actionClass: HouseholdActionClass;
  privacyClass: HouseholdPrivacyClass;
  financialImpact?: number;
  securityImpact?: boolean;
  approvalRequired?: boolean;
  societyAllowsAction?: boolean;
  metadata?: Record<string, string | number | boolean>;
  deepLink?: string;
};

const events: HouseholdActionEvent[] = [];
let sequence = 0;

function sanitizeMetadata(metadata: EmitActionInput['metadata']): Record<string, string | number | boolean> {
  const privateKey = /(phone|mobile|email|token|password|card|upi|medical|health|message)/i;
  return Object.fromEntries(Object.entries(metadata ?? {}).filter(([key]) => !privateKey.test(key)));
}

export const householdDomainEventBus = {
  emit(input: EmitActionInput): HouseholdActionEvent {
    const identity = mockIdentityStore.getIdentity(input.membershipId);
    const authorization = authorizeResidentAction({
      membership: identity.membership,
      action: input.action,
      ...(input.approvalRequired === undefined ? {} : { approvalRequired: input.approvalRequired }),
      ...(input.societyAllowsAction === undefined ? {} : { societyAllowsAction: input.societyAllowsAction }),
    });
    const result: HouseholdActionEvent['result'] = authorization === 'DENIED' || authorization === 'SOCIETY_POLICY_CONTROLLED'
      ? 'DENIED'
      : authorization === 'REQUIRES_HOUSEHOLD_APPROVAL' ? 'PENDING_APPROVAL' : 'SUCCEEDED';
    sequence += 1;
    const event: HouseholdActionEvent = {
      eventId: `domain-event-${sequence}`,
      correlationId: createCorrelationId('domain'),
      societyId: identity.membership.societyId,
      unitId: identity.membership.unitId,
      actorUserId: identity.user.userId,
      actorMembershipId: identity.membership.membershipId,
      actorPersonId: identity.person.personId,
      actorDisplayName: identity.person.preferredName,
      actorRelationship: identity.membership.relationship,
      actorRole: identity.membership.relationship,
      actionType: input.actionType,
      domain: input.domain,
      entityType: input.entityType,
      entityId: input.entityId,
      timestamp: new Date().toISOString(),
      actionClass: input.actionClass,
      privacyClass: input.privacyClass,
      financialImpact: Math.max(0, input.financialImpact ?? 0),
      securityImpact: input.securityImpact ?? false,
      metadata: sanitizeMetadata(input.metadata),
      ...(input.deepLink === undefined ? {} : { deepLink: input.deepLink }),
      result,
    };
    events.push(event);
    return event;
  },
  list(filter?: { residenceId?: string; actorUserId?: string }): HouseholdActionEvent[] {
    return events.filter((event) => (filter?.residenceId === undefined || `${event.societyId}:${event.unitId}` === filter.residenceId) && (filter?.actorUserId === undefined || event.actorUserId === filter.actorUserId));
  },
  reset(): void {
    events.length = 0;
    sequence = 0;
  },
};