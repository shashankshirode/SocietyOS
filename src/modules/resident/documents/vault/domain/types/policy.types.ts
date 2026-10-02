import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  DocumentCategoryGroup,
  DocumentOwningEntityType,
  DocumentSensitivity,
  DocumentVisibility,
} from './document.types';

export type PolicyEffectiveWindow = {
  readonly effectiveFrom: string;
  readonly effectiveTo: string | Absent;
};

export type MimeRule = {
  readonly mimeType: string;
  readonly maxBytes: number;
  readonly requiresMalwareScan: boolean;
  readonly allowsThumbnail: boolean;
};

export type CategoryPolicy = {
  readonly categoryCode: string;
  readonly categoryGroup: DocumentCategoryGroup;
  readonly displayName: string;
  readonly allowedEntityTypes: readonly DocumentOwningEntityType[];
  readonly allowedMimeTypes: readonly MimeRule[];
  readonly requiresVerification: boolean;
  readonly requiresSignature: boolean;
  readonly signatureMethod: SignatureMethodPolicy | Absent;
  readonly defaultSensitivity: DocumentSensitivity;
  readonly allowedVisibilities: readonly DocumentVisibility[];
  readonly expiryApplicable: boolean;
  readonly defaultExpiryDays: number | Absent;
  readonly retentionPolicyId: string;
  readonly minimumRequiredChecklistItems: number;
};

export type SignatureMethodPolicy =
  | 'ADMIN_DIGITAL'
  | 'E_SIGN_PROVIDER'
  | 'DSC_PROVIDER'
  | 'AADHAAR_ESIGN'
  | 'WET_INK_OFFLINE';

export type SignatureMethod = SignatureMethodPolicy;

export type SensitivityPolicy = {
  readonly sensitivity: DocumentSensitivity;
  readonly permittedActions: readonly DocumentAction[];
  readonly requiresFreshAuthorization: boolean;
  readonly maximumRetrievalTtlSeconds: number;
  readonly requiresReasonForExport: boolean;
  readonly redactActorPII: boolean;
};

export type DocumentAction =
  | 'VIEW_METADATA'
  | 'VIEW_CONTENT'
  | 'DOWNLOAD'
  | 'UPLOAD'
  | 'REPLACE_VERSION'
  | 'SUBMIT_FOR_VERIFICATION'
  | 'REVIEW_VERIFICATION'
  | 'REQUEST_RESUBMISSION'
  | 'SIGN'
  | 'ARCHIVE'
  | 'VIEW_ACCESS_LOG'
  | 'REQUEST_ACCESS'
  | 'APPLY_RETENTION'
  | 'PLACE_LEGAL_HOLD'
  | 'RELEASE_LEGAL_HOLD';

export type HistoricalAccessPolicy = {
  readonly formerOccupantMayAccessOwnSubmitted: boolean;
  readonly currentOccupantMayAccessPredecessorDocuments: readonly DocumentCategoryGroup[];
  readonly committeeAlwaysAllowed: boolean;
  readonly auditorAlwaysAllowed: boolean;
  readonly publicSensitivityVisibleToFormerOccupant: boolean;
};

export type DocumentPolicySet = {
  readonly policySetId: string;
  readonly version: number;
  readonly window: PolicyEffectiveWindow;
  readonly categories: readonly CategoryPolicy[];
  readonly sensitivities: readonly SensitivityPolicy[];
  readonly historicalAccess: HistoricalAccessPolicy;
  readonly maximumFileBytes: number;
  readonly maximumVersionsPerDocument: number;
  readonly uploadSessionTtlSeconds: number;
  readonly maximumRetrievalTtlSeconds: number;
  readonly allowedIntegrityAlgorithms: readonly ('SHA-256' | 'SHA-512')[];
  readonly requireQuarantineBeforeAvailability: boolean;
  readonly requireChecksumVerificationOnRetrieval: boolean;
};

export type PolicyResolution =
  | { readonly resolved: true; readonly policy: DocumentPolicySet }
  | {
      readonly resolved: false;
      readonly reason: 'POLICY_NOT_EFFECTIVE' | 'POLICY_CONFIG_INVALID';
      readonly detail: string;
    };

export function isEffectiveAt(
  window: PolicyEffectiveWindow,
  instant: Date,
): boolean {
  const from = Date.parse(window.effectiveFrom);
  if (Number.isNaN(from) || instant.getTime() < from) {
    return false;
  }
  if (window.effectiveTo === undefined) {
    return true;
  }
  const to = Date.parse(window.effectiveTo);
  if (Number.isNaN(to)) {
    return false;
  }
  return instant.getTime() < to;
}

export function resolvePolicySet(
  candidates: readonly DocumentPolicySet[],
  instant: Date,
): PolicyResolution {
  const effective = candidates.filter((candidate) => isEffectiveAt(candidate.window, instant));
  if (effective.length === 0) {
    return {
      resolved: false,
      reason: 'POLICY_NOT_EFFECTIVE',
      detail: 'No document policy set is effective at the requested instant.',
    };
  }
  const invalid = effective.find((candidate) => !isPolicySetWellFormed(candidate));
  if (invalid !== undefined) {
    return {
      resolved: false,
      reason: 'POLICY_CONFIG_INVALID',
      detail: `Policy set ${invalid.policySetId} version ${invalid.version} is not well formed.`,
    };
  }
  const selected = effective.reduce((best, candidate) =>
    candidate.version > best.version ? candidate : best,
  );
  return { resolved: true, policy: selected };
}

export function isPolicySetWellFormed(policy: DocumentPolicySet): boolean {
  if (policy.categories.length === 0) {
    return false;
  }
  if (policy.sensitivities.length === 0) {
    return false;
  }
  if (policy.maximumFileBytes <= 0) {
    return false;
  }
  if (policy.maximumVersionsPerDocument <= 0) {
    return false;
  }
  if (policy.uploadSessionTtlSeconds <= 0) {
    return false;
  }
  if (policy.maximumRetrievalTtlSeconds <= 0) {
    return false;
  }
  if (policy.allowedIntegrityAlgorithms.length === 0) {
    return false;
  }
  return policy.categories.every((category) => {
    if (category.categoryCode.trim().length === 0) {
      return false;
    }
    if (category.allowedEntityTypes.length === 0) {
      return false;
    }
    if (category.allowedMimeTypes.length === 0) {
      return false;
    }
    if (category.allowedVisibilities.length === 0) {
      return false;
    }
    if (category.minimumRequiredChecklistItems < 0) {
      return false;
    }
    if (category.requiresVerification && category.minimumRequiredChecklistItems === 0) {
      return false;
    }
    if (category.requiresSignature && category.signatureMethod === undefined) {
      return false;
    }
    if (category.expiryApplicable && category.defaultExpiryDays === undefined) {
      return false;
    }
    if (category.defaultExpiryDays !== undefined && category.defaultExpiryDays <= 0) {
      return false;
    }
    return category.allowedMimeTypes.every(
      (rule) => rule.mimeType.trim().length > 0 && rule.maxBytes > 0 && rule.maxBytes <= policy.maximumFileBytes,
    );
  });
}

export function findCategoryPolicy(
  policy: DocumentPolicySet,
  categoryCode: string,
): CategoryPolicy | Absent {
  return policy.categories.find((category) => category.categoryCode === categoryCode);
}

export function findMimeRule(
  category: CategoryPolicy,
  mimeType: string,
): MimeRule | Absent {
  return category.allowedMimeTypes.find((rule) => rule.mimeType === mimeType);
}

export function findSensitivityPolicy(
  policy: DocumentPolicySet,
  sensitivity: DocumentSensitivity,
): SensitivityPolicy | Absent {
  return policy.sensitivities.find((entry) => entry.sensitivity === sensitivity);
}
