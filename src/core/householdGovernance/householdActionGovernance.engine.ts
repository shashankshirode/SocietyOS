import type {
  HouseholdActionPolicyDecision,
  HouseholdActionPolicyInput,
  HouseholdNotificationMode,
  NotificationRecipientResolverInput,
  HouseholdNotificationRecipient,
} from './householdActionGovernance.types';

function resolvedAmount(input: HouseholdActionPolicyInput): number {
  return Math.max(0, input.financialImpact ?? 0);
}

export function evaluateHouseholdAction(input: HouseholdActionPolicyInput): HouseholdActionPolicyDecision {
  const notificationMode: HouseholdNotificationMode = input.notificationMode ?? 'OFF';
  const audit = input.auditRequired ?? input.actionClass !== 'PRIVATE';

  if (!input.societyAllowsAction || !input.permissionGranted) {
    return { decision: 'DENY', notificationMode: 'OFF', audit, reason: 'Action is outside effective household permissions.' };
  }

  if (input.actionClass === 'CRITICAL_SAFETY') {
    return { decision: 'CRITICAL_OVERRIDE', notificationMode: 'INSTANT', audit: true, reason: 'Critical safety actions cannot be suppressed.' };
  }

  const exceedsThreshold = input.approvalThreshold !== undefined && resolvedAmount(input) > input.approvalThreshold;
  if (input.requiresApproval || exceedsThreshold) {
    return {
      decision: input.actorRelationship === 'FAMILY_MEMBER' || input.actorRelationship === 'TENANT'
        ? 'REQUIRE_OWNER_APPROVAL'
        : 'REQUIRE_ADMIN_APPROVAL',
      notificationMode: 'INSTANT',
      audit: true,
      reason: exceedsThreshold ? 'Action exceeds the configured approval threshold.' : 'Action requires approval before it is performed.',
    };
  }

  if (notificationMode !== 'OFF') {
    return {
      decision: audit ? 'ALLOW_NOTIFY_AND_AUDIT' : 'ALLOW_AND_NOTIFY',
      notificationMode,
      audit,
      reason: 'Action is allowed under the effective household policy.',
    };
  }

  return { decision: audit ? 'ALLOW_AND_AUDIT' : 'ALLOW_SILENTLY', notificationMode, audit, reason: 'Action is allowed without household notification.' };
}

export function resolveNotificationRecipients(input: NotificationRecipientResolverInput): HouseholdNotificationRecipient[] {
  const candidates: HouseholdNotificationRecipient[] = [];
  const { event } = input;
  const mode = input.sponsorMode ?? 'INSTANT';

  if (event.actionClass === 'CRITICAL_SAFETY' || event.result === 'PENDING_APPROVAL' || event.securityImpact || event.financialImpact > 0 || mode !== 'OFF') {
    const consequentialEvent = event.actionClass === 'CRITICAL_SAFETY' || event.result === 'PENDING_APPROVAL' || event.securityImpact || event.financialImpact > 0;
    const tenantSponsorAllowed = event.actorRelationship !== 'TENANT' || (input.householdSponsor?.relationship === 'TENANT' && consequentialEvent);
    if (tenantSponsorAllowed && input.householdSponsor?.eligibleForApproval && input.householdSponsor.userId !== event.actorUserId) {
      candidates.push({ userId: input.householdSponsor.userId, displayName: input.householdSponsor.displayName, reason: 'HOUSEHOLD_SPONSOR', mode: event.actionClass === 'CRITICAL_SAFETY' ? 'INSTANT' : mode });
    }
  }

  if (input.notifyCoOwners) {
    for (const owner of input.coOwners ?? []) {
      if (owner.eligibleForApproval && owner.userId !== event.actorUserId) {
        candidates.push({ userId: owner.userId, displayName: owner.displayName, reason: 'CO_OWNER', mode });
      }
    }
  }

  if (event.actionClass === 'CRITICAL_SAFETY') {
    candidates.push(...(input.societyResponders ?? []).map((recipient) => ({ ...recipient, mode: 'INSTANT' as const })));
  }
  candidates.push(...(input.configuredRecipients ?? []));

  const seen = new Set<string>();
  return candidates.filter((recipient) => {
    if (seen.has(recipient.userId)) return false;
    seen.add(recipient.userId);
    return true;
  });
}