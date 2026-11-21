import type {
  ResidenceAccessActionType,
  ResidenceAccessEligibility,
  ResidenceAccessRecord,
} from '../models/residenceAccess.types';

function resolveNextAction(record: ResidenceAccessRecord): ResidenceAccessActionType | null {
  switch (record.status) {
    case 'DISCOVERED':
    case 'CLAIM_NOT_STARTED':
      return 'START_CLAIM';
    case 'IDENTITY_DETAILS_REQUIRED':
      return 'COMPLETE_IDENTITY';
    case 'DOCUMENTS_REQUIRED':
    case 'DOCUMENT_CHANGES_REQUIRED':
    case 'ADDITIONAL_INFORMATION_REQUIRED':
      return 'UPLOAD_DOCUMENTS';
    case 'DOCUMENTS_UNDER_REVIEW':
    case 'SOCIETY_APPROVAL_PENDING':
      return 'VIEW_STATUS';
    case 'OWNER_CONSENT_REQUIRED':
      return 'REQUEST_OWNER_CONSENT';
    case 'OWNER_CONSENT_PENDING':
      return 'VIEW_STATUS';
    case 'APPROVED':
      return 'VIEW_STATUS';
    case 'ACTIVE':
    case 'TEMPORARILY_RESTRICTED':
      return 'ENTER_RESIDENCE';
    case 'REJECTED':
      return record.correctionAllowed ? 'CORRECT_AND_RESUBMIT' : 'VIEW_DECISION';
    case 'SUSPENDED':
      return 'RESOLVE_SUSPENSION';
    case 'INACTIVE':
    case 'REACTIVATION_REQUIRED':
      return record.reactivationAllowed ? 'REQUEST_REACTIVATION' : 'VIEW_HISTORY';
    case 'EXPIRED':
      return 'RENEW_ACCESS';
    case 'ACCESS_REVOKED':
      return record.appealAllowed ? 'REQUEST_RECONSIDERATION' : 'VIEW_HISTORY';
    case 'UNIT_TRANSFER_PENDING':
    case 'MOVE_OUT_PENDING':
      return 'VIEW_STATUS';
    case 'ARCHIVED':
      return 'VIEW_HISTORY';
  }
}

function isEffective(record: ResidenceAccessRecord, now: Date): boolean {
  const from = record.effectiveFrom ? new Date(record.effectiveFrom) : null;
  const until = record.effectiveUntil ? new Date(record.effectiveUntil) : null;
  const validFrom = !from || (!Number.isNaN(from.getTime()) && from.getTime() <= now.getTime());
  const validUntil = !until || (!Number.isNaN(until.getTime()) && until.getTime() >= now.getTime());
  return validFrom && validUntil;
}

export function resolveResidenceAccessEligibility(
  record: ResidenceAccessRecord,
  now: Date = new Date(),
): ResidenceAccessEligibility {
  const effective = isEffective(record, now);
  const canEnterResidence =
    effective && (record.status === 'ACTIVE' || record.status === 'TEMPORARILY_RESTRICTED');
  const limitedStatuses = new Set(record.status === 'ARCHIVED' ? [] : [record.status]);
  const uploadStatuses = new Set([
    'DOCUMENTS_REQUIRED',
    'DOCUMENT_CHANGES_REQUIRED',
    'ADDITIONAL_INFORMATION_REQUIRED',
    'OWNER_CONSENT_REQUIRED',
    'SUSPENDED',
    'EXPIRED',
    'REACTIVATION_REQUIRED',
  ]);
  const reminderStatuses = new Set([
    'DOCUMENTS_UNDER_REVIEW',
    'OWNER_CONSENT_PENDING',
    'SOCIETY_APPROVAL_PENDING',
  ]);
  const editStatuses = new Set([
    'CLAIM_NOT_STARTED',
    'IDENTITY_DETAILS_REQUIRED',
    'DOCUMENTS_REQUIRED',
    'DOCUMENT_CHANGES_REQUIRED',
    'ADDITIONAL_INFORMATION_REQUIRED',
    'REJECTED',
  ]);

  return {
    canEnterResidence,
    canViewLimitedResidenceData: limitedStatuses.size > 0,
    canUploadDocuments: uploadStatuses.has(record.status),
    canEditSubmittedDetails: editStatuses.has(record.status),
    canSendReminder: reminderStatuses.has(record.status),
    canRequestOwnerConsent: record.status === 'OWNER_CONSENT_REQUIRED',
    canResubmit:
      record.correctionAllowed &&
      (record.status === 'REJECTED' || record.status === 'DOCUMENT_CHANGES_REQUIRED'),
    canAppeal:
      record.appealAllowed &&
      (record.status === 'REJECTED' || record.status === 'ACCESS_REVOKED'),
    canRequestReactivation:
      record.reactivationAllowed &&
      (record.status === 'INACTIVE' ||
        record.status === 'EXPIRED' ||
        record.status === 'REACTIVATION_REQUIRED'),
    canContactSociety: record.status !== 'ARCHIVED',
    blockingReasons: canEnterResidence ? [] : record.blockers,
    nextRecommendedAction: resolveNextAction(record),
  };
}

export const residenceAccessEligibilityService = {
  resolve: resolveResidenceAccessEligibility,
};
