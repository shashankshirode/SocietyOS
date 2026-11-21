import type {
  ResidenceAccessEligibility,
  ResidenceAccessRecord,
  ResidenceNavigationDestination,
  ResidenceNavigationGuard,
} from '../models/residenceAccess.types';

export const residenceNavigationGuard: ResidenceNavigationGuard = {
  resolveDestination(
    residenceAccess: ResidenceAccessRecord,
    eligibility: ResidenceAccessEligibility,
  ): ResidenceNavigationDestination {
    if (eligibility.canEnterResidence) {
      return 'RESIDENT_DASHBOARD';
    }
    switch (residenceAccess.status) {
      case 'DOCUMENTS_REQUIRED':
      case 'DOCUMENTS_UNDER_REVIEW':
        return residenceAccess.status === 'DOCUMENTS_REQUIRED'
          ? 'DOCUMENT_REQUIREMENTS'
          : 'APPROVAL_PROGRESS';
      case 'DOCUMENT_CHANGES_REQUIRED':
      case 'ADDITIONAL_INFORMATION_REQUIRED':
        return 'CORRECTION_REQUIRED';
      case 'OWNER_CONSENT_REQUIRED':
      case 'OWNER_CONSENT_PENDING':
        return 'OWNER_CONSENT';
      case 'SOCIETY_APPROVAL_PENDING':
      case 'UNIT_TRANSFER_PENDING':
      case 'MOVE_OUT_PENDING':
        return 'APPROVAL_PROGRESS';
      case 'APPROVED':
        return 'RESIDENCE_ACCESS_OVERVIEW';
      case 'REJECTED':
        return 'REJECTION_DECISION';
      case 'ACCESS_REVOKED':
        return 'RESIDENCE_ACCESS_OVERVIEW';
      case 'SUSPENDED':
        return 'SUSPENSION_RESOLUTION';
      case 'EXPIRED':
        return 'ACCESS_RENEWAL';
      case 'INACTIVE':
      case 'REACTIVATION_REQUIRED':
        return 'REACTIVATION_STATUS';
      case 'DISCOVERED':
      case 'CLAIM_NOT_STARTED':
      case 'IDENTITY_DETAILS_REQUIRED':
      case 'ACTIVE':
      case 'TEMPORARILY_RESTRICTED':
      case 'ARCHIVED':
        return 'RESIDENCE_ACCESS_OVERVIEW';
    }
  },
};
