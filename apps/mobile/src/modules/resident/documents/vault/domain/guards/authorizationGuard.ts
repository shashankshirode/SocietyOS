import { hasPermission } from '../../../../../../core/permissions/rolePermissionMap';
import type { Permission } from '../../../../../../core/permissions/permission.types';
import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  DocumentAction,
  DocumentPolicySet,
  HistoricalAccessPolicy,
  SensitivityPolicy,
} from '../types/policy.types';
import { findSensitivityPolicy } from '../types/policy.types';
import type {
  DocumentCategoryGroup,
  DocumentRecord,
  DocumentSensitivity,
  DocumentVisibility,
} from '../types/document.types';
import type {
  AccessEvaluation,
  AccessOutcome,
  AccessRequest,
  RetrievalTicket,
} from '../types/access.types';
import type {
  DocumentVaultViolation,
  VaultActor,
  VaultClock,
  VaultDecision,
} from '../types/primitives';
import { allowedWith, denied, isFreshSession, violation } from '../types/primitives';

export type VaultActionPermission = {
  readonly action: DocumentAction;
  readonly permissions: readonly Permission[];
  readonly anyOf: boolean;
};

const ACTION_PERMISSIONS: readonly VaultActionPermission[] = [
  { action: 'VIEW_METADATA', permissions: ['DOCUMENT_VIEW_OWN', 'DOCUMENT_VIEW_SOCIETY', 'DOCUMENT_VIEW_RESTRICTED'], anyOf: true },
  { action: 'VIEW_CONTENT', permissions: ['DOCUMENT_VIEW_OWN', 'DOCUMENT_VIEW_SOCIETY', 'DOCUMENT_VIEW_RESTRICTED'], anyOf: true },
  { action: 'DOWNLOAD', permissions: ['DOCUMENT_DOWNLOAD'], anyOf: false },
  { action: 'UPLOAD', permissions: ['DOCUMENT_UPLOAD'], anyOf: false },
  { action: 'REPLACE_VERSION', permissions: ['DOCUMENT_REPLACE_VERSION', 'DOCUMENT_UPLOAD'], anyOf: true },
  { action: 'SUBMIT_FOR_VERIFICATION', permissions: ['DOCUMENT_UPLOAD', 'DOCUMENT_REPLACE_VERSION'], anyOf: true },
  { action: 'REVIEW_VERIFICATION', permissions: ['DOCUMENT_VERIFY'], anyOf: false },
  { action: 'REQUEST_RESUBMISSION', permissions: ['DOCUMENT_VERIFY'], anyOf: false },
  { action: 'SIGN', permissions: ['DOCUMENT_SIGN'], anyOf: false },
  { action: 'ARCHIVE', permissions: ['DOCUMENT_ARCHIVE'], anyOf: false },
  { action: 'VIEW_ACCESS_LOG', permissions: ['DOCUMENT_ACCESS_LOG_VIEW'], anyOf: false },
  { action: 'REQUEST_ACCESS', permissions: ['DOCUMENT_VIEW_OWN', 'DOCUMENT_VIEW_SOCIETY', 'DOCUMENT_VIEW_RESTRICTED'], anyOf: true },
  { action: 'APPLY_RETENTION', permissions: ['DOCUMENT_MANAGE_RETENTION'], anyOf: false },
  { action: 'PLACE_LEGAL_HOLD', permissions: ['DOCUMENT_MANAGE_LEGAL_HOLD'], anyOf: false },
  { action: 'RELEASE_LEGAL_HOLD', permissions: ['DOCUMENT_MANAGE_LEGAL_HOLD'], anyOf: false },
];

const APPROVER_ROLES = ['SOCIETY_ADMIN', 'CHAIRPERSON', 'SECRETARY', 'COMMITTEE_MEMBER', 'AUDITOR', 'SUPER_ADMIN'] as const;
const COMMITTEE_ROLES = ['SOCIETY_ADMIN', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SUPER_ADMIN'] as const;
const SENSITIVITY_RANK: Readonly<Record<DocumentSensitivity, number>> = {
  PUBLIC: 0,
  INTERNAL: 1,
  RESIDENT: 2,
  CONFIDENTIAL: 3,
  SENSITIVE: 4,
  HIGHLY_SENSITIVE: 5,
  RESTRICTED: 6,
};

const VISIBILITY_RANK: Readonly<Record<DocumentVisibility, number>> = {
  OWN_ENTITY_ONLY: 0,
  HOUSEHOLD: 1,
  CURRENT_OCCUPANT: 2,
  SOCIETY_COMMITTEE: 3,
  SOCIETY_STAFF: 4,
  AUDITOR_ONLY: 5,
};

export function isApproverRole(actor: VaultActor): boolean {
  return (APPROVER_ROLES as readonly string[]).includes(actor.role);
}

export function isCommitteeRole(actor: VaultActor): boolean {
  return (COMMITTEE_ROLES as readonly string[]).includes(actor.role);
}

export function permissionRuleFor(action: DocumentAction): VaultActionPermission | Absent {
  return ACTION_PERMISSIONS.find((rule) => rule.action === action);
}

export function evaluateActionPermission(
  actor: VaultActor,
  action: DocumentAction,
): VaultDecision {
  const rule = permissionRuleFor(action);
  if (rule === undefined) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `action.${action}`,
        `No permission rule is defined for action ${action}; the request fails closed.`,
      ),
    ]);
  }
  const results = rule.permissions.map((permission) => hasPermission([actor.role], permission));
  const satisfied = rule.anyOf ? results.some(Boolean) : results.every(Boolean);
  if (!satisfied) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `action.${action}`,
        `Role ${actor.role} does not hold the required permission for ${action}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateTenantBoundary(
  actor: VaultActor,
  document: DocumentRecord,
): VaultDecision {
  if (actor.societyId !== document.scope.societyId) {
    return denied([
      violation(
        'CROSS_SOCIETY_BLOCKED',
        'scope.societyId',
        'The document belongs to a different society.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateFreshSession(
  actor: VaultActor,
  clock: VaultClock,
  policy: DocumentPolicySet,
  now: Date,
): VaultDecision {
  if (actor.authenticatedAt.trim().length === 0) {
    return denied([
      violation('ACTOR_NOT_AUTHENTICATED', 'actor.authenticatedAt', 'No authenticated session is bound to the request.'),
    ]);
  }
  if (!isFreshSession(actor, clock, policy.maximumRetrievalTtlSeconds * 1000)) {
    return denied([
      violation('ACTOR_SESSION_STALE', 'actor.authenticatedAt', 'The bound session is no longer fresh; re-authentication is required.'),
    ]);
  }
  if (Date.parse(actor.authenticatedAt) > now.getTime()) {
    return denied([
      violation('ACTOR_SESSION_STALE', 'actor.authenticatedAt', 'The bound session timestamp is in the future.'),
    ]);
  }
  return allowedWith([]);
}

export function isOwningActor(actor: VaultActor, document: DocumentRecord): boolean {
  return document.ownerUserId === actor.userId;
}

export function evaluateEntityBinding(
  actor: VaultActor,
  document: DocumentRecord,
  activeUnitId: string | Absent,
): VaultDecision {
  if (isOwningActor(actor, document)) {
    return allowedWith([]);
  }
  if (isCommitteeRole(actor)) {
    return allowedWith([]);
  }
  if (document.scope.owningEntityType === 'UNIT') {
    if (activeUnitId !== undefined && document.scope.owningEntityId === activeUnitId) {
      return allowedWith([]);
    }
    return denied([
      violation(
        'IDOR_BLOCKED',
        'scope.owningEntityId',
        'The active unit does not own this document.',
      ),
    ]);
  }
  if (document.scope.owningEntityType === 'RESIDENT' || document.scope.owningEntityType === 'USER') {
    return denied([
      violation(
        'IDOR_BLOCKED',
        'scope.owningEntityId',
        'Resident-owned documents are visible only to their owner or the society committee.',
      ),
    ]);
  }
  return denied([
    violation(
      'IDOR_BLOCKED',
      'scope.owningEntityId',
      'No active relationship binds this actor to the owning entity.',
    ),
  ]);
}

export function evaluateVisibility(
  actor: VaultActor,
  document: DocumentRecord,
  policy: DocumentPolicySet,
  activeUnitId: string | Absent,
  isFormerOccupant: boolean,
): VaultDecision {
  if (isCommitteeRole(actor)) {
    return allowedWith([]);
  }
  if (actor.role === 'AUDITOR' || actor.role === 'SUPER_ADMIN') {
    return allowedWith([]);
  }
  if (isOwningActor(actor, document)) {
    return allowedWith([]);
  }
  const visibility = document.visibility;
  if (visibility === 'OWN_ENTITY_ONLY') {
    return denied([
      violation('ACTOR_NOT_AUTHORIZED', 'document.visibility', 'This document is restricted to its owning entity.'),
    ]);
  }
  if (visibility === 'HOUSEHOLD' || visibility === 'CURRENT_OCCUPANT') {
    if (activeUnitId !== undefined && document.scope.owningEntityId === activeUnitId) {
      return allowedWith([]);
    }
    if (isFormerOccupant) {
      return evaluateHistoricalAccess(actor, document, policy.historicalAccess);
    }
    return denied([
      violation('HISTORICAL_PRIVACY_BLOCKED', 'document.visibility', 'No active occupancy links this actor to the document.'),
    ]);
  }
  if (visibility === 'SOCIETY_COMMITTEE' || visibility === 'SOCIETY_STAFF' || visibility === 'AUDITOR_ONLY') {
    if (isCommitteeRole(actor)) {
      return allowedWith([]);
    }
    return denied([
      violation('ACTOR_NOT_AUTHORIZED', 'document.visibility', `Visibility ${visibility} excludes role ${actor.role}.`),
    ]);
  }
  return denied([
    violation('ACTOR_NOT_AUTHORIZED', 'document.visibility', 'Visibility could not be evaluated; the request fails closed.'),
  ]);
}

export function evaluateHistoricalAccess(
  actor: VaultActor,
  document: DocumentRecord,
  policy: HistoricalAccessPolicy,
): VaultDecision {
  if (policy.committeeAlwaysAllowed && isCommitteeRole(actor)) {
    return allowedWith([]);
  }
  if (policy.auditorAlwaysAllowed && (actor.role === 'AUDITOR' || actor.role === 'SUPER_ADMIN')) {
    return allowedWith([]);
  }
  if (policy.formerOccupantMayAccessOwnSubmitted && isOwningActor(actor, document)) {
    return allowedWith([]);
  }
  const predecessorGroups: readonly DocumentCategoryGroup[] =
    policy.currentOccupantMayAccessPredecessorDocuments;
  if (predecessorGroups.includes(document.categoryGroup)) {
    return denied([
      violation(
        'HISTORICAL_PRIVACY_BLOCKED',
        'document.categoryGroup',
        'This document belongs to a predecessor occupant and requires an approved access request.',
      ),
    ]);
  }
  return denied([
    violation(
      'HISTORICAL_PRIVACY_BLOCKED',
      'document.categoryGroup',
      'Former occupants retain no default access to this document category.',
    ),
  ]);
}

export function evaluateSensitivity(
  actor: VaultActor,
  document: DocumentRecord,
  policy: DocumentPolicySet,
  action: DocumentAction,
): VaultDecision {
  const sensitivityPolicy = findSensitivityPolicy(policy, document.sensitivity);
  if (sensitivityPolicy === undefined) {
    return denied([
      violation(
        'POLICY_CONFIG_INVALID',
        'document.sensitivity',
        `No sensitivity policy is configured for ${document.sensitivity}; the request fails closed.`,
      ),
    ]);
  }
  if (!sensitivityPolicy.permittedActions.includes(action)) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        'document.sensitivity',
        `Sensitivity ${document.sensitivity} does not permit ${action}.`,
      ),
    ]);
  }
  if (document.sensitivity === 'RESTRICTED' && !isCommitteeRole(actor) && actor.role !== 'AUDITOR' && actor.role !== 'SUPER_ADMIN') {
    return denied([
      violation('ACTOR_NOT_AUTHORIZED', 'document.sensitivity', 'Restricted documents are limited to the committee and auditors.'),
    ]);
  }
  const requiredRank = SENSITIVITY_RANK[document.sensitivity];
  const actorCeiling = sensitivityCeilingFor(actor);
  if (actorCeiling !== null && actorCeiling < requiredRank) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        'document.sensitivity',
        `Role ${actor.role} may not reach sensitivity ${document.sensitivity}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

function sensitivityCeilingFor(actor: VaultActor): number | null {
  if (actor.role === 'SUPER_ADMIN' || actor.role === 'AUDITOR') {
    return SENSITIVITY_RANK.RESTRICTED;
  }
  if (isCommitteeRole(actor)) {
    return SENSITIVITY_RANK.HIGHLY_SENSITIVE;
  }
  if (actor.role === 'FACILITY_MANAGER' || actor.role === 'STAFF_USER' || actor.role === 'VENDOR_USER') {
    return SENSITIVITY_RANK.INTERNAL;
  }
  if (actor.role === 'RESIDENT_OWNER' || actor.role === 'RESIDENT_TENANT' || actor.role === 'RESIDENT_FAMILY') {
    return SENSITIVITY_RANK.SENSITIVE;
  }
  if (actor.role === 'SECURITY_GUARD' || actor.role === 'SECURITY_SUPERVISOR') {
    return SENSITIVITY_RANK.INTERNAL;
  }
  return SENSITIVITY_RANK.INTERNAL;
}

export function evaluateDocumentUsability(document: DocumentRecord): VaultDecision {
  if (document.storageLifecycle !== 'AVAILABLE') {
    return denied([
      violation(
        'OBJECT_NOT_AVAILABLE',
        'document.storageLifecycle',
        `Document object is ${document.storageLifecycle} and cannot be retrieved.`,
      ),
    ]);
  }
  if (document.legalHoldIds.length > 0) {
    return denied([
      violation('RETENTION_HOLD_ACTIVE', 'document.legalHoldIds', 'A legal hold is active on this document.'),
    ]);
  }
  if (document.retentionLifecycle === 'DISPOSED' || document.retentionLifecycle === 'ANONYMISED') {
    return denied([
      violation('OBJECT_NOT_AVAILABLE', 'document.retentionLifecycle', 'Retention processing has removed retrievable content.'),
    ]);
  }
  if (document.expiryLifecycle === 'EXPIRED' || document.expiryLifecycle === 'REVOCATION_PENDING') {
    return denied([
      violation('EXPIRY_REVOCATION_REQUIRED', 'document.expiryLifecycle', 'The document has expired and is pending revocation.'),
    ]);
  }
  return allowedWith([]);
}

export function evaluateAccess(
  input: {
    actor: VaultActor;
    document: DocumentRecord;
    action: DocumentAction;
    policy: DocumentPolicySet;
    clock: VaultClock;
    activeUnitId: string | Absent;
    isFormerOccupant: boolean;
    reason: string | Absent;
    now: Date;
  },
): { decision: VaultDecision; evaluation: AccessEvaluation } {
  const violations: DocumentVaultViolation[] = [];
  const checks: readonly VaultDecision[] = [
    evaluateActionPermission(input.actor, input.action),
    evaluateTenantBoundary(input.actor, input.document),
    evaluateFreshSession(input.actor, input.clock, input.policy, input.now),
    evaluateEntityBinding(input.actor, input.document, input.activeUnitId),
    evaluateVisibility(input.actor, input.document, input.policy, input.activeUnitId, input.isFormerOccupant),
    evaluateSensitivity(input.actor, input.document, input.policy, input.action),
  ];
  for (const check of checks) {
    if (!check.allowed) {
      violations.push(...check.violations);
    }
  }

  const sensitivityPolicy: SensitivityPolicy | Absent = findSensitivityPolicy(
    input.policy,
    input.document.sensitivity,
  );
  const usable = evaluateDocumentUsability(input.document);

  if (input.action === 'VIEW_CONTENT' || input.action === 'DOWNLOAD') {
    if (!usable.allowed) {
      violations.push(...usable.violations);
    }
  }

  const requiresReason =
    sensitivityPolicy?.requiresReasonForExport === true &&
    (input.action === 'DOWNLOAD' || input.action === 'SIGN');
  if (requiresReason && (input.reason === undefined || input.reason.trim().length === 0)) {
    violations.push(
      violation('VALIDATION_FAILED', 'access.reason', 'A reason is required for this export action.'),
    );
  }

  if (violations.length > 0) {
    return {
      decision: denied(violations),
      evaluation: {
        outcome: 'DENIED',
        policy: sensitivityPolicy,
        reason: violations[0]?.code ?? 'ACCESS_DENIED',
        requiresReason,
        maximumTtlSeconds: sensitivityPolicy?.maximumRetrievalTtlSeconds ?? 0,
        redactionRequired: sensitivityPolicy?.redactActorPII === true,
      },
    };
  }

  const warnings: DocumentVaultViolation[] = [];
  if (sensitivityPolicy?.requiresFreshAuthorization === true) {
    warnings.push({
      code: 'ACTOR_SESSION_STALE',
      field: 'access.authorization',
      blocking: false,
      detail: 'A fresh authorization decision is required for this sensitivity.',
    });
  }

  return {
    decision: allowedWith(warnings),
    evaluation: {
      outcome: requiresReason ? 'ALLOWED_WITH_REASON' : 'GRANTED',
      policy: sensitivityPolicy,
      reason: 'AUTHORIZED',
      requiresReason,
      maximumTtlSeconds: sensitivityPolicy?.maximumRetrievalTtlSeconds ?? 0,
      redactionRequired: sensitivityPolicy?.redactActorPII === true,
    },
  };
}

export function evaluateTtl(
  requestedTtlSeconds: number,
  evaluation: AccessEvaluation,
  policy: DocumentPolicySet,
): VaultDecision {
  if (requestedTtlSeconds <= 0) {
    return denied([violation('RETRIEVAL_TTL_TOO_LONG', 'retrieval.ttlSeconds', 'Retrieval TTL must be positive.')]);
  }
  const ceiling = Math.min(evaluation.maximumTtlSeconds, policy.maximumRetrievalTtlSeconds);
  if (ceiling <= 0) {
    return denied([
      violation('RETRIEVAL_TTL_TOO_LONG', 'retrieval.ttlSeconds', 'Policy does not permit any retrieval TTL for this sensitivity.'),
    ]);
  }
  if (requestedTtlSeconds > ceiling) {
    return denied([
      violation(
        'RETRIEVAL_TTL_TOO_LONG',
        'retrieval.ttlSeconds',
        `Requested TTL ${requestedTtlSeconds}s exceeds the permitted ceiling ${ceiling}s.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function assertTicketUsable(
  ticket: RetrievalTicket,
  actor: VaultActor,
  action: DocumentAction,
  clock: VaultClock,
): VaultDecision {
  if (ticket.revokedAt !== undefined) {
    return denied([violation('OBJECT_NOT_AVAILABLE', 'retrievalTicket.revokedAt', 'The retrieval ticket has been revoked.')]);
  }
  if (ticket.issuedToUserId !== actor.userId) {
    return denied([
      violation('IDOR_BLOCKED', 'retrievalTicket.issuedToUserId', 'The retrieval ticket was issued to a different user.'),
    ]);
  }
  if (ticket.scope.societyId !== actor.societyId) {
    return denied([violation('CROSS_SOCIETY_BLOCKED', 'retrievalTicket.scope', 'The retrieval ticket belongs to a different society.')]);
  }
  if (ticket.grantedAction !== action) {
    return denied([
      violation('ACTOR_NOT_AUTHORIZED', 'retrievalTicket.grantedAction', `The ticket does not grant ${action}.`),
    ]);
  }
  if (Date.parse(ticket.expiresAt) <= clock.now().getTime()) {
    return denied([violation('RETRIEVAL_TICKET_EXPIRED', 'retrievalTicket.expiresAt', 'The retrieval ticket has expired.')]);
  }
  if (ticket.singleUse && ticket.consumedAt !== undefined) {
    return denied([violation('RETRIEVAL_TICKET_CONSUMED', 'retrievalTicket.consumedAt', 'The retrieval ticket has already been used.')]);
  }
  return allowedWith([]);
}

export function isAccessRequestOpen(request: AccessRequest): boolean {
  return request.state === 'PENDING';
}

export function visibilityRank(visibility: DocumentVisibility): number {
  return VISIBILITY_RANK[visibility];
}

export function sensitivityRank(sensitivity: DocumentSensitivity): number {
  return SENSITIVITY_RANK[sensitivity];
}

export function outcomeForDecision(decision: VaultDecision): AccessOutcome {
  return decision.allowed ? 'GRANTED' : 'DENIED';
}
