import {
  residenceAccessActionLabels,
  residenceAccessStatusLabels,
} from '../../../messages/en/residenceAccess.messages';
import type {
  ResidenceAccessAction,
  ResidenceAccessActionType,
  ResidenceAccessEligibility,
  ResidenceAccessListItem,
  ResidenceAccessRecord,
  ResidenceAccessStatus,
} from '../models/residenceAccess.types';

const statusOrder: Readonly<Record<ResidenceAccessStatus, number>> = {
  ACTIVE: 1,
  TEMPORARILY_RESTRICTED: 2,
  DOCUMENT_CHANGES_REQUIRED: 3,
  ADDITIONAL_INFORMATION_REQUIRED: 4,
  DOCUMENTS_REQUIRED: 5,
  IDENTITY_DETAILS_REQUIRED: 6,
  OWNER_CONSENT_REQUIRED: 7,
  DOCUMENTS_UNDER_REVIEW: 8,
  OWNER_CONSENT_PENDING: 9,
  SOCIETY_APPROVAL_PENDING: 10,
  APPROVED: 11,
  REACTIVATION_REQUIRED: 12,
  EXPIRED: 13,
  INACTIVE: 14,
  REJECTED: 15,
  SUSPENDED: 16,
  ACCESS_REVOKED: 17,
  UNIT_TRANSFER_PENDING: 18,
  MOVE_OUT_PENDING: 19,
  DISCOVERED: 20,
  CLAIM_NOT_STARTED: 21,
  ARCHIVED: 22,
};

function action(type: ResidenceAccessActionType, enabled = true): ResidenceAccessAction {
  const label = residenceAccessActionLabels[type];
  return {
    type,
    label,
    accessibilityLabel: label,
    enabled,
  };
}

export function resolveResidenceActions(
  record: ResidenceAccessRecord,
  eligibility: ResidenceAccessEligibility,
): { primaryAction: ResidenceAccessAction; secondaryActions: readonly ResidenceAccessAction[] } {
  const recommended = eligibility.nextRecommendedAction ?? 'VIEW_STATUS';
  const primaryAction = action(recommended);
  switch (record.status) {
    case 'ACTIVE':
    case 'TEMPORARILY_RESTRICTED':
      return { primaryAction, secondaryActions: [action('VIEW_STATUS')] };
    case 'DOCUMENTS_REQUIRED':
      return { primaryAction, secondaryActions: [action('VIEW_REQUIREMENTS'), action('CONTACT_SOCIETY')] };
    case 'DOCUMENT_CHANGES_REQUIRED':
    case 'ADDITIONAL_INFORMATION_REQUIRED':
      return { primaryAction, secondaryActions: [action('VIEW_DECISION'), action('CONTACT_SOCIETY')] };
    case 'DOCUMENTS_UNDER_REVIEW':
    case 'SOCIETY_APPROVAL_PENDING':
      return {
        primaryAction,
        secondaryActions: [
          action('SEND_REMINDER', eligibility.canSendReminder),
          action('CONTACT_SOCIETY'),
        ],
      };
    case 'OWNER_CONSENT_REQUIRED':
      return { primaryAction, secondaryActions: [action('VIEW_STATUS'), action('CONTACT_SOCIETY')] };
    case 'OWNER_CONSENT_PENDING':
      return { primaryAction, secondaryActions: [action('RESEND_OWNER_CONSENT'), action('CONTACT_SOCIETY')] };
    case 'REJECTED':
      return {
        primaryAction,
        secondaryActions: [
          action('VIEW_DECISION'),
          action('REQUEST_RECONSIDERATION', eligibility.canAppeal),
        ],
      };
    case 'SUSPENDED':
      return { primaryAction, secondaryActions: [action('CONTACT_SOCIETY'), action('VIEW_HISTORY')] };
    case 'EXPIRED':
      return { primaryAction, secondaryActions: [action('VIEW_PREVIOUS_OCCUPANCY'), action('CONTACT_SOCIETY')] };
    case 'INACTIVE':
    case 'REACTIVATION_REQUIRED':
      return {
        primaryAction,
        secondaryActions: [
          action('VIEW_HISTORY'),
          action('REQUEST_REACTIVATION', eligibility.canRequestReactivation),
        ],
      };
    case 'ACCESS_REVOKED':
      return {
        primaryAction,
        secondaryActions: [action('VIEW_HISTORY'), action('CONTACT_SOCIETY')],
      };
    case 'APPROVED':
    case 'UNIT_TRANSFER_PENDING':
    case 'MOVE_OUT_PENDING':
      return { primaryAction, secondaryActions: [action('CONTACT_SOCIETY')] };
    case 'DISCOVERED':
    case 'CLAIM_NOT_STARTED':
    case 'IDENTITY_DETAILS_REQUIRED':
      return { primaryAction, secondaryActions: [action('CONTACT_SOCIETY')] };
    case 'ARCHIVED':
      return { primaryAction, secondaryActions: [] };
  }
}

export function compareResidenceAccessItems(
  left: ResidenceAccessListItem,
  right: ResidenceAccessListItem,
): number {
  const statusDelta = statusOrder[left.accessRecord.status] - statusOrder[right.accessRecord.status];
  if (statusDelta !== 0) {
    return statusDelta;
  }
  const updatedDelta =
    new Date(right.accessRecord.statusUpdatedAt).getTime() -
    new Date(left.accessRecord.statusUpdatedAt).getTime();
  if (Number.isFinite(updatedDelta) && updatedDelta !== 0) {
    return updatedDelta;
  }
  return left.residence.societyName.localeCompare(right.residence.societyName);
}

export function statusLabelFor(record: ResidenceAccessRecord): string {
  return residenceAccessStatusLabels[record.status];
}
