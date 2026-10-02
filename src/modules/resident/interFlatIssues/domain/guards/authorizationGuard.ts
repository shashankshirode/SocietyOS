import { hasPermission } from '../../../../../core/permissions/rolePermissionMap';
import type { AppRole, Permission } from '../../../../../core/permissions/permission.types';
import type { Absent } from '../../../../../shared/types/absence.types';
import type { DisputeCase, DisputeParty } from '../types/case.types';
import { findPartyByUserId } from '../types/case.types';
import type { EvidenceRecord, EvidenceVisibility } from '../types/evidence.types';
import type { TimelineEvent, TimelineAudience } from '../types/timeline.types';
import type {
  DisputeActorType,
  DisputeDecision,
  DisputeViolation,
} from '../types/primitives';
import type { DisputeAction, DisputeVisibilityPolicy } from '../types/policy.types';
import { allowedWith, denied, violation, warning } from '../types/primitives';
import { actionsForActor } from '../types/policy.types';

export type DisputeActionPermission = {
  readonly action: DisputeAction;
  readonly permissions: readonly Permission[];
  readonly anyOf: boolean;
};

export const ACTION_PERMISSIONS: readonly DisputeActionPermission[] = [
  { action: 'OPEN_CASE', permissions: ['INTER_FLAT_CREATE'], anyOf: true },
  { action: 'RECORD_CLAIM', permissions: ['INTER_FLAT_CREATE', 'INTER_FLAT_RESPOND', 'INTER_FLAT_VIEW_ALL'], anyOf: true },
  { action: 'VIEW_CASE_SUMMARY', permissions: ['INTER_FLAT_VIEW_OWN', 'INTER_FLAT_VIEW_INVOLVED', 'INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_VIEW'], anyOf: true },
  { action: 'VIEW_PARTY_DETAILS', permissions: ['INTER_FLAT_VIEW_INVOLVED', 'INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_VIEW'], anyOf: true },
  { action: 'VIEW_ALL_CLAIMS', permissions: ['INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_VIEW'], anyOf: true },
  { action: 'VIEW_INTERNAL_NOTES', permissions: ['INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_VIEW'], anyOf: true },
  { action: 'ATTACH_EVIDENCE', permissions: ['INTER_FLAT_CREATE', 'INTER_FLAT_RESPOND', 'INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'RECORD_RESPONSE', permissions: ['INTER_FLAT_RESPOND'], anyOf: true },
  { action: 'REQUEST_INSPECTION', permissions: ['INTER_FLAT_CREATE', 'INTER_FLAT_RESPOND', 'INTER_FLAT_ESCALATE', 'INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'ASSIGN_INSPECTOR', permissions: ['INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'COMPLETE_INSPECTION', permissions: ['INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'REQUEST_MEDIATION', permissions: ['INTER_FLAT_ESCALATE', 'INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'ASSIGN_MEDIATOR', permissions: ['DISPUTE_MEDIATION_MANAGE'], anyOf: false },
  { action: 'RECORD_MEDIATOR_NOTE', permissions: ['DISPUTE_MEDIATION_MANAGE', 'DISPUTE_MEDIATION_VIEW'], anyOf: true },
  { action: 'PROPOSE_RESOLUTION', permissions: ['DISPUTE_MEDIATION_MANAGE', 'INTER_FLAT_VIEW_ALL'], anyOf: true },
  { action: 'ACCEPT_PROPOSAL', permissions: ['INTER_FLAT_VIEW_OWN', 'INTER_FLAT_VIEW_INVOLVED', 'INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'REJECT_PROPOSAL', permissions: ['INTER_FLAT_VIEW_OWN', 'INTER_FLAT_VIEW_INVOLVED', 'INTER_FLAT_VIEW_ALL', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'SUBMIT_CLOSURE_PROOF', permissions: ['INTER_FLAT_VIEW_OWN', 'INTER_FLAT_VIEW_INVOLVED', 'INTER_FLAT_VIEW_ALL', 'INTER_FLAT_CLOSE'], anyOf: true },
  { action: 'VERIFY_CLOSURE_PROOF', permissions: ['INTER_FLAT_CLOSE', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'CLOSE_CASE', permissions: ['INTER_FLAT_CLOSE', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'ESCALATE_CASE', permissions: ['INTER_FLAT_ESCALATE', 'DISPUTE_MEDIATION_MANAGE'], anyOf: true },
  { action: 'VIEW_AUDIT_TRAIL', permissions: ['INTER_FLAT_AUDIT_VIEW', 'INTER_FLAT_VIEW_ALL'], anyOf: true },
  { action: 'REQUEST_FINANCE_LINK', permissions: ['INTER_FLAT_ESCALATE', 'INTER_FLAT_VIEW_ALL'], anyOf: true },
  { action: 'APPLY_RETENTION', permissions: ['INTER_FLAT_CLOSE'], anyOf: true },
  { action: 'PLACE_LEGAL_HOLD', permissions: ['INTER_FLAT_AUDIT_VIEW', 'INTER_FLAT_VIEW_ALL'], anyOf: true },
];

const COMMITTEE_ACTOR_TYPES: readonly DisputeActorType[] = [
  'SOCIETY_ADMIN',
  'SOCIETY_SECRETARY',
  'SOCIETY_CHAIRPERSON',
  'COMMITTEE_MEMBER',
];

export function isCommitteeActor(actorType: DisputeActorType): boolean {
  return COMMITTEE_ACTOR_TYPES.includes(actorType);
}

export function isAuditActor(actorType: DisputeActorType): boolean {
  return actorType === 'AUDITOR' || actorType === 'TREASURER';
}

export function permissionRuleFor(action: DisputeAction): DisputeActionPermission | Absent {
  return ACTION_PERMISSIONS.find((rule) => rule.action === action);
}

export function evaluateActionPermission(
  actorType: DisputeActorType,
  role: AppRole,
  action: DisputeAction,
): DisputeDecision {
  const rule = permissionRuleFor(action);
  if (rule === undefined) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `action.${action}`,
        `No permission rule is defined for ${action}; the request fails closed.`,
      ),
    ]);
  }

  const actorAllowed = actionsForActor(actorType).includes(action);
  if (!actorAllowed) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `action.${action}`,
        `Actor type ${actorType} may not perform ${action} on a dispute case.`,
      ),
    ]);
  }

  const results = rule.permissions.map((permission) => hasPermission([role], permission));
  const satisfied = rule.anyOf ? results.some(Boolean) : results.every(Boolean);
  if (!satisfied) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `action.${action}`,
        `Role does not hold a permission permitting ${action}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateSocietyBoundary(
  actorSocietyId: string,
  disputeCase: DisputeCase,
): DisputeDecision {
  if (actorSocietyId !== disputeCase.societyId) {
    return denied([
      violation(
        'CROSS_SOCIETY_BLOCKED',
        'case.societyId',
        'The dispute case belongs to a different society.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function partyOfCase(
  disputeCase: DisputeCase,
  userId: string,
): DisputeParty | Absent {
  return findPartyByUserId(disputeCase, userId);
}

export function evaluatePartyMembership(
  actorType: DisputeActorType,
  actorUserId: string,
  disputeCase: DisputeCase,
  action: DisputeAction,
): DisputeDecision {
  if (isCommitteeActor(actorType) || isAuditActor(actorType)) {
    return allowedWith([]);
  }
  if (actorType === 'MEDIATOR') {
    return allowedWith([]);
  }
  if (actorType === 'FACILITY_MANAGER' || actorType === 'INSPECTOR' || actorType === 'SECURITY_GUARD') {
    return allowedWith([]);
  }
  const party = partyOfCase(disputeCase, actorUserId);
  if (party === undefined) {
    return denied([
      violation(
        'NOT_A_PARTY',
        'case.parties',
        'Only registered parties, the committee, or an assigned official may act on this case.',
      ),
    ]);
  }
  if (action === 'RECORD_RESPONSE' && party.role !== 'RESPONDENT' && party.role !== 'AFFECTED_PARTY') {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        'party.role',
        'Only the respondent or an affected party may record a response.',
      ),
    ]);
  }
  return allowedWith([]);
}

export type ActorContext = {
  readonly userId: string;
  readonly role: AppRole;
  readonly actorType: DisputeActorType;
  readonly societyId: string;
  readonly sessionId: string;
  readonly authenticatedAt: string;
};

export function evaluateCaseAccess(
  context: ActorContext,
  disputeCase: DisputeCase,
  action: DisputeAction,
): DisputeDecision {
  const checks: readonly DisputeDecision[] = [
    evaluateSocietyBoundary(context.societyId, disputeCase),
    evaluateActionPermission(context.actorType, context.role, action),
    evaluatePartyMembership(context.actorType, context.userId, disputeCase, action),
  ];

  const violations = checks.filter((check) => !check.allowed).flatMap((check) => check.violations);
  if (violations.length > 0) {
    return denied(violations);
  }

  const warnings: DisputeViolation[] = [];
  if (isAuditActor(context.actorType)) {
    warnings.push(
      warning(
        'ACTOR_NOT_AUTHORIZED',
        'case.audit',
        'Audit access is read-only; every view of this case is itself audited.',
      ),
    );
  }
  if (isCommitteeActor(context.actorType) && context.userId === disputeCase.reporterUserId) {
    warnings.push(
      warning(
        'IDOR_BLOCKED',
        'case.oversight',
        'Oversight on a case you reported is logged to prevent self-review.',
      ),
    );
  }
  return allowedWith(warnings);
}

export function evidenceVisibilityAllowed(
  actorType: DisputeActorType,
  visibility: EvidenceVisibility,
): DisputeDecision {
  if (visibility === 'PARTIES_ONLY') {
    return allowedWith([]);
  }
  if (visibility === 'COMMITTEE_AND_MEDIATOR') {
    if (isCommitteeActor(actorType) || actorType === 'MEDIATOR' || actorType === 'AUDITOR') {
      return allowedWith([]);
    }
    return denied([
      violation(
        'EVIDENCE_VISIBILITY_DENIED',
        'evidence.visibility',
        'This evidence is restricted to the committee and mediator.',
      ),
    ]);
  }
  if (visibility === 'MEDIATOR_ONLY') {
    if (actorType === 'MEDIATOR') {
      return allowedWith([]);
    }
    return denied([
      violation(
        'EVIDENCE_VISIBILITY_DENIED',
        'evidence.visibility',
        'This evidence is restricted to the assigned mediator.',
      ),
    ]);
  }
  if (visibility === 'INSPECTOR_ONLY') {
    if (actorType === 'INSPECTOR' || actorType === 'FACILITY_MANAGER') {
      return allowedWith([]);
    }
    return denied([
      violation(
        'EVIDENCE_VISIBILITY_DENIED',
        'evidence.visibility',
        'This evidence is restricted to the assigned inspector.',
      ),
    ]);
  }
  return denied([
    violation(
      'EVIDENCE_VISIBILITY_DENIED',
      'evidence.visibility',
      'Evidence visibility could not be evaluated; the request fails closed.',
    ),
  ]);
}

export function timelineAudienceAllowed(
  actorType: DisputeActorType,
  audience: TimelineAudience,
): DisputeDecision {
  if (audience === 'ALL_PARTIES') {
    return allowedWith([]);
  }
  if (audience === 'COMMITTEE_AND_MEDIATOR') {
    if (isCommitteeActor(actorType) || actorType === 'MEDIATOR' || actorType === 'AUDITOR') {
      return allowedWith([]);
    }
    return denied([
      violation(
        'IDOR_BLOCKED',
        'timeline.audience',
        'This timeline entry is restricted to the committee and mediator.',
      ),
    ]);
  }
  if (audience === 'MEDIATOR_ONLY') {
    if (actorType === 'MEDIATOR') {
      return allowedWith([]);
    }
    return denied([
      violation(
        'IDOR_BLOCKED',
        'timeline.audience',
        'This timeline entry is restricted to the assigned mediator.',
      ),
    ]);
  }
  if (audience === 'SYSTEM_ONLY') {
    if (actorType === 'AUDITOR' || isCommitteeActor(actorType)) {
      return allowedWith([]);
    }
    return denied([
      violation('IDOR_BLOCKED', 'timeline.audience', 'System timeline entries are visible to oversight roles only.'),
    ]);
  }
  return denied([
    violation('IDOR_BLOCKED', 'timeline.audience', 'Timeline audience could not be evaluated; the request fails closed.'),
  ]);
}

export function visibleTimelineFor(
  events: readonly TimelineEvent[],
  actorType: DisputeActorType,
): readonly TimelineEvent[] {
  return events.filter((event) => timelineAudienceAllowed(actorType, event.audience).allowed);
}

export function visibleEvidenceFor(
  records: readonly EvidenceRecord[],
  actorType: DisputeActorType,
): readonly EvidenceRecord[] {
  return records.filter(
    (record) =>
      record.lifecycle === 'VERIFIED' &&
      record.withdrawnAt === undefined &&
      evidenceVisibilityAllowed(actorType, record.visibility).allowed,
  );
}

export type RedactedPartyView = {
  readonly partyId: string;
  readonly role: string;
  readonly displayLabel: string;
  readonly redacted: boolean;
};

export function partyViewFor(
  disputeCase: DisputeCase,
  actorType: DisputeActorType,
  policy: DisputeVisibilityPolicy,
  actorUserId: string,
): readonly RedactedPartyView[] {
  const maySeeAll = isCommitteeActor(actorType) || isAuditActor(actorType) || actorType === 'MEDIATOR';
  return disputeCase.parties.map((party) => {
    const selfVisible = party.userId === actorUserId || maySeeAll;
    return {
      partyId: party.partyId,
      role: party.role,
      displayLabel: selfVisible ? party.displayLabel : policy.redactedPartyLabel,
      redacted: !selfVisible,
    };
  });
}
