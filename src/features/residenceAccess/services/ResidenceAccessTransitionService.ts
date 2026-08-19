import type {
  ResidenceAccessActor,
  ResidenceAccessActorType,
  ResidenceAccessCommand,
  ResidenceAccessRecord,
  ResidenceAccessStatus,
  ResidenceAccessTransitionResult,
  ResidenceAccessTransitionService,
} from '../models/residenceAccess.types';

interface TransitionRule {
  readonly from: ResidenceAccessStatus;
  readonly to: ResidenceAccessStatus;
  readonly actors: readonly ResidenceAccessActorType[];
}

const residentActors: readonly ResidenceAccessActorType[] = ['RESIDENT'];
const societyActors: readonly ResidenceAccessActorType[] = [
  'SOCIETY_ADMIN',
  'SOCIETY_COMMITTEE',
  'SECURITY_REVIEW',
  'SYSTEM',
];
const ownerActors: readonly ResidenceAccessActorType[] = ['OWNER', 'SYSTEM'];

const transitionRules: readonly TransitionRule[] = [
  { from: 'DISCOVERED', to: 'CLAIM_NOT_STARTED', actors: residentActors },
  { from: 'CLAIM_NOT_STARTED', to: 'IDENTITY_DETAILS_REQUIRED', actors: residentActors },
  { from: 'IDENTITY_DETAILS_REQUIRED', to: 'DOCUMENTS_REQUIRED', actors: residentActors },
  { from: 'IDENTITY_DETAILS_REQUIRED', to: 'OWNER_CONSENT_REQUIRED', actors: residentActors },
  { from: 'DOCUMENTS_REQUIRED', to: 'DOCUMENTS_UNDER_REVIEW', actors: residentActors },
  { from: 'DOCUMENTS_REQUIRED', to: 'SOCIETY_APPROVAL_PENDING', actors: residentActors },
  { from: 'DOCUMENT_CHANGES_REQUIRED', to: 'DOCUMENTS_UNDER_REVIEW', actors: residentActors },
  { from: 'DOCUMENT_CHANGES_REQUIRED', to: 'SOCIETY_APPROVAL_PENDING', actors: residentActors },
  { from: 'ADDITIONAL_INFORMATION_REQUIRED', to: 'DOCUMENTS_UNDER_REVIEW', actors: residentActors },
  { from: 'ADDITIONAL_INFORMATION_REQUIRED', to: 'SOCIETY_APPROVAL_PENDING', actors: residentActors },
  { from: 'REJECTED', to: 'DOCUMENTS_UNDER_REVIEW', actors: residentActors },
  { from: 'OWNER_CONSENT_REQUIRED', to: 'OWNER_CONSENT_PENDING', actors: residentActors },
  { from: 'OWNER_CONSENT_PENDING', to: 'SOCIETY_APPROVAL_PENDING', actors: ownerActors },
  { from: 'OWNER_CONSENT_PENDING', to: 'REJECTED', actors: ownerActors },
  { from: 'DOCUMENTS_UNDER_REVIEW', to: 'DOCUMENT_CHANGES_REQUIRED', actors: societyActors },
  { from: 'DOCUMENTS_UNDER_REVIEW', to: 'ADDITIONAL_INFORMATION_REQUIRED', actors: societyActors },
  { from: 'DOCUMENTS_UNDER_REVIEW', to: 'SOCIETY_APPROVAL_PENDING', actors: societyActors },
  { from: 'DOCUMENTS_UNDER_REVIEW', to: 'APPROVED', actors: societyActors },
  { from: 'DOCUMENTS_UNDER_REVIEW', to: 'REJECTED', actors: societyActors },
  { from: 'SOCIETY_APPROVAL_PENDING', to: 'ADDITIONAL_INFORMATION_REQUIRED', actors: societyActors },
  { from: 'SOCIETY_APPROVAL_PENDING', to: 'APPROVED', actors: societyActors },
  { from: 'SOCIETY_APPROVAL_PENDING', to: 'REJECTED', actors: societyActors },
  { from: 'APPROVED', to: 'ACTIVE', actors: societyActors },
  { from: 'ACTIVE', to: 'SUSPENDED', actors: societyActors },
  { from: 'ACTIVE', to: 'TEMPORARILY_RESTRICTED', actors: societyActors },
  { from: 'ACTIVE', to: 'INACTIVE', actors: societyActors },
  { from: 'ACTIVE', to: 'EXPIRED', actors: societyActors },
  { from: 'ACTIVE', to: 'ACCESS_REVOKED', actors: [...societyActors, 'OWNER'] },
  { from: 'ACTIVE', to: 'UNIT_TRANSFER_PENDING', actors: [...societyActors, 'RESIDENT'] },
  { from: 'ACTIVE', to: 'MOVE_OUT_PENDING', actors: [...societyActors, 'RESIDENT'] },
  { from: 'TEMPORARILY_RESTRICTED', to: 'ACTIVE', actors: societyActors },
  { from: 'TEMPORARILY_RESTRICTED', to: 'SUSPENDED', actors: societyActors },
  { from: 'TEMPORARILY_RESTRICTED', to: 'EXPIRED', actors: societyActors },
  { from: 'SUSPENDED', to: 'SOCIETY_APPROVAL_PENDING', actors: residentActors },
  { from: 'SUSPENDED', to: 'ACTIVE', actors: societyActors },
  { from: 'SUSPENDED', to: 'ACCESS_REVOKED', actors: societyActors },
  { from: 'EXPIRED', to: 'DOCUMENTS_UNDER_REVIEW', actors: residentActors },
  { from: 'EXPIRED', to: 'SOCIETY_APPROVAL_PENDING', actors: residentActors },
  { from: 'INACTIVE', to: 'REACTIVATION_REQUIRED', actors: residentActors },
  { from: 'INACTIVE', to: 'SOCIETY_APPROVAL_PENDING', actors: residentActors },
  { from: 'REACTIVATION_REQUIRED', to: 'DOCUMENTS_UNDER_REVIEW', actors: residentActors },
  { from: 'REACTIVATION_REQUIRED', to: 'SOCIETY_APPROVAL_PENDING', actors: residentActors },
  { from: 'UNIT_TRANSFER_PENDING', to: 'ACTIVE', actors: societyActors },
  { from: 'UNIT_TRANSFER_PENDING', to: 'INACTIVE', actors: societyActors },
  { from: 'MOVE_OUT_PENDING', to: 'INACTIVE', actors: societyActors },
  { from: 'CLAIM_NOT_STARTED', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'IDENTITY_DETAILS_REQUIRED', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'DOCUMENTS_REQUIRED', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'DOCUMENTS_UNDER_REVIEW', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'DOCUMENT_CHANGES_REQUIRED', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'OWNER_CONSENT_REQUIRED', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'OWNER_CONSENT_PENDING', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'SOCIETY_APPROVAL_PENDING', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'ADDITIONAL_INFORMATION_REQUIRED', to: 'ACCESS_REVOKED', actors: residentActors },
  { from: 'REJECTED', to: 'ARCHIVED', actors: [...societyActors, 'RESIDENT'] },
  { from: 'INACTIVE', to: 'ARCHIVED', actors: [...societyActors, 'RESIDENT'] },
  { from: 'EXPIRED', to: 'ARCHIVED', actors: [...societyActors, 'RESIDENT'] },
  { from: 'ACCESS_REVOKED', to: 'ARCHIVED', actors: societyActors },
];

function resolveNextStatus(
  currentStatus: ResidenceAccessStatus,
  command: ResidenceAccessCommand,
): ResidenceAccessStatus {
  switch (command.type) {
    case 'START_CLAIM':
      return currentStatus === 'DISCOVERED' ? 'CLAIM_NOT_STARTED' : 'IDENTITY_DETAILS_REQUIRED';
    case 'SUBMIT_IDENTITY':
    case 'REQUEST_DOCUMENTS':
      return 'DOCUMENTS_REQUIRED';
    case 'SUBMIT_DOCUMENTS':
      return 'DOCUMENTS_UNDER_REVIEW';
    case 'REQUEST_DOCUMENT_CHANGES':
      return 'DOCUMENT_CHANGES_REQUIRED';
    case 'REQUEST_OWNER_CONSENT':
      return 'OWNER_CONSENT_REQUIRED';
    case 'OWNER_CONSENT_SENT':
      return 'OWNER_CONSENT_PENDING';
    case 'OWNER_CONSENT_RECEIVED':
    case 'SUBMIT_FOR_REVIEW':
      return 'SOCIETY_APPROVAL_PENDING';
    case 'REQUEST_ADDITIONAL_INFORMATION':
      return 'ADDITIONAL_INFORMATION_REQUIRED';
    case 'RESUBMIT':
      return 'DOCUMENTS_UNDER_REVIEW';
    case 'APPROVE':
      return 'APPROVED';
    case 'ACTIVATE':
      return 'ACTIVE';
    case 'REJECT':
      return 'REJECTED';
    case 'SUSPEND':
      return 'SUSPENDED';
    case 'RESTRICT':
      return 'TEMPORARILY_RESTRICTED';
    case 'DEACTIVATE':
      return 'INACTIVE';
    case 'EXPIRE':
      return 'EXPIRED';
    case 'REQUEST_REACTIVATION':
    case 'SUBMIT_SUSPENSION_RESOLUTION':
      return 'SOCIETY_APPROVAL_PENDING';
    case 'REVOKE':
      return 'ACCESS_REVOKED';
    case 'START_UNIT_TRANSFER':
      return 'UNIT_TRANSFER_PENDING';
    case 'START_MOVE_OUT':
      return 'MOVE_OUT_PENDING';
    case 'ARCHIVE':
      return 'ARCHIVED';
  }
}

function ruleExists(
  currentStatus: ResidenceAccessStatus,
  nextStatus: ResidenceAccessStatus,
  actor: ResidenceAccessActor,
): boolean {
  return transitionRules.some(
    (rule) =>
      rule.from === currentStatus &&
      rule.to === nextStatus &&
      rule.actors.includes(actor.actorType),
  );
}

export const residenceAccessTransitionService: ResidenceAccessTransitionService = {
  canTransition(currentStatus, nextStatus, actor) {
    return ruleExists(currentStatus, nextStatus, actor);
  },

  transition(residenceAccess, command) {
    const nextStatus = resolveNextStatus(residenceAccess.status, command);
    const allowed = ruleExists(residenceAccess.status, nextStatus, command.actor);
    if (!allowed) {
      return {
        allowed: false,
        previousStatus: residenceAccess.status,
        nextStatus,
        residenceAccess,
        reason: `Transition ${residenceAccess.status} to ${nextStatus} is not permitted for ${command.actor.actorType}.`,
      };
    }
    return {
      allowed: true,
      previousStatus: residenceAccess.status,
      nextStatus,
      residenceAccess: {
        ...residenceAccess,
        status: nextStatus,
        statusUpdatedAt: new Date().toISOString(),
        dataVersion: residenceAccess.dataVersion + 1,
      },
    };
  },
};

export function transitionResidenceAccess(
  residenceAccess: ResidenceAccessRecord,
  command: ResidenceAccessCommand,
): ResidenceAccessTransitionResult {
  return residenceAccessTransitionService.transition(residenceAccess, command);
}
