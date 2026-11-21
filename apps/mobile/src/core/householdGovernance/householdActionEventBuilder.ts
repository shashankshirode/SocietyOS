import { createCorrelationId, getMockRequestContext } from '../api/requestContext';
import type { HouseholdActionEvent, HouseholdActionPolicyDecision, HouseholdActionPolicyInput } from './householdActionGovernance.types';

const sensitiveMetadataKey = /(token|mobile|phone|email|aadhaar|pan|password|payment|card|upi|message|chat|medical|health)/i;
let eventSequence = 0;

function sanitizeMetadata(metadata?: Record<string, string | number | boolean>): Record<string, string | number | boolean> {
  return Object.fromEntries(Object.entries(metadata ?? {}).filter(([key]) => !sensitiveMetadataKey.test(key)));
}

export type BuildHouseholdActionEventInput = {
  actorPersonId: string;
  actorDisplayName: string;
  actorRelationship: HouseholdActionEvent['actorRelationship'];
  actionType: string;
  domain: string;
  entityType: string;
  entityId: string;
  actionClass: HouseholdActionEvent['actionClass'];
  privacyClass: HouseholdActionEvent['privacyClass'];
  financialImpact?: number;
  securityImpact?: boolean;
  metadata?: Record<string, string | number | boolean>;
  deepLink?: string;
  result?: HouseholdActionEvent['result'];
};

export function buildHouseholdActionEvent(input: BuildHouseholdActionEventInput): HouseholdActionEvent {
  const context = getMockRequestContext();
  eventSequence += 1;
  return {
    eventId: `action-event-${eventSequence}`,
    correlationId: context.correlationId ?? createCorrelationId('action'),
    societyId: context.societyId ?? 'unknown-society',
    unitId: context.unitId ?? 'unknown-unit',
    actorUserId: context.actorUserId ?? 'unknown-user',
    actorMembershipId: 'unknown-membership',
    actorPersonId: input.actorPersonId,
    actorDisplayName: input.actorDisplayName,
    actorRelationship: input.actorRelationship,
    actorRole: context.activeRole ?? 'UNKNOWN',
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
    result: input.result ?? 'SUCCEEDED',
  };
}

export function buildEventFromPolicy(
  input: BuildHouseholdActionEventInput,
  policyInput: HouseholdActionPolicyInput,
  decision: HouseholdActionPolicyDecision,
): HouseholdActionEvent {
  const result: HouseholdActionEvent['result'] = decision.decision === 'DENY'
    ? 'DENIED'
    : decision.decision === 'REQUIRE_OWNER_APPROVAL' || decision.decision === 'REQUIRE_ADMIN_APPROVAL'
      ? 'PENDING_APPROVAL'
      : 'SUCCEEDED';
  return buildHouseholdActionEvent({
    ...input,
    actionClass: policyInput.actionClass,
    privacyClass: policyInput.privacyClass,
    ...(policyInput.financialImpact === undefined ? {} : { financialImpact: policyInput.financialImpact }),
    ...(policyInput.securityImpact === undefined ? {} : { securityImpact: policyInput.securityImpact }),
    result,
  });
}