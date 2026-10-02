import type {
  RegistrationDocumentRequirement,
  ClaimedRelationshipType,
  SocietyRegistrationPolicy,
  RegistrationRequirementResolution,
  ResidenceDocumentType,
  ResidenceDocumentMimeType,
} from '../data/registration.types';

const BASE_DOCUMENT_REQUIREMENTS: Omit<RegistrationDocumentRequirement, 'societyId' | 'unitId' | 'relationshipType' | 'requirementId' | 'displayOrder'>[] = [
  {
    documentType: 'IDENTITY_PROOF',
    title: 'Identity Proof (Aadhaar/PAN/Passport)',
    description: 'Government issued photo identity document',
    mandatory: true,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maximumFileSizeBytes: 5 * 1024 * 1024,
    expiryDateRequired: false,
    frontAndBackRequired: true,
  },
  {
    documentType: 'ADDRESS_PROOF',
    title: 'Address Proof',
    description: 'Recent utility bill or bank statement (not older than 3 months)',
    mandatory: true,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maximumFileSizeBytes: 5 * 1024 * 1024,
    expiryDateRequired: true,
    frontAndBackRequired: false,
  },
];

const TENANT_ADDITIONAL_REQUIREMENTS: Omit<RegistrationDocumentRequirement, 'societyId' | 'unitId' | 'relationshipType' | 'requirementId' | 'displayOrder'>[] = [
  {
    documentType: 'RENT_AGREEMENT',
    title: 'Registered Rent Agreement',
    description: 'Signed and registered rental agreement with the unit owner',
    mandatory: true,
    acceptedFileTypes: ['application/pdf'],
    maximumFileSizeBytes: 10 * 1024 * 1024,
    expiryDateRequired: true,
    frontAndBackRequired: false,
  },
  {
    documentType: 'TENANT_KYC',
    title: 'Tenant KYC Form',
    description: 'Society tenant KYC declaration form',
    mandatory: true,
    acceptedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maximumFileSizeBytes: 5 * 1024 * 1024,
    expiryDateRequired: false,
    frontAndBackRequired: false,
  },
];

const OWNER_ADDITIONAL_REQUIREMENTS: Omit<RegistrationDocumentRequirement, 'societyId' | 'unitId' | 'relationshipType' | 'requirementId' | 'displayOrder'>[] = [
  {
    documentType: 'OWNERSHIP_PROOF',
    title: 'Ownership Proof',
    description: 'Sale deed, possession letter, or property tax receipt',
    mandatory: true,
    acceptedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maximumFileSizeBytes: 10 * 1024 * 1024,
    expiryDateRequired: false,
    frontAndBackRequired: false,
  },
];

const FAMILY_MEMBER_ADDITIONAL_REQUIREMENTS: Omit<RegistrationDocumentRequirement, 'societyId' | 'unitId' | 'relationshipType' | 'requirementId' | 'displayOrder'>[] = [
  {
    documentType: 'RELATIONSHIP_PROOF',
    title: 'Relationship Proof',
    description: 'Document proving relationship with primary resident (marriage certificate, birth certificate, etc.)',
    mandatory: true,
    acceptedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maximumFileSizeBytes: 5 * 1024 * 1024,
    expiryDateRequired: false,
    frontAndBackRequired: false,
  },
];

function createRequirement(
  societyId: string,
  unitId: string,
  relationshipType: ClaimedRelationshipType,
  base: Omit<RegistrationDocumentRequirement, 'societyId' | 'unitId' | 'relationshipType' | 'requirementId' | 'displayOrder'>,
  index: number
): RegistrationDocumentRequirement {
  return {
    ...base,
    societyId,
    unitId,
    relationshipType,
    requirementId: `req-${societyId}-${unitId}-${relationshipType}-${base.documentType}-${index}`,
    displayOrder: index,
  };
}

export function resolveRequirements(
  policy: SocietyRegistrationPolicy,
  relationshipType: ClaimedRelationshipType,
  unitId: string,
  existingDocuments: readonly { requirementId: string; status: string }[]
): RegistrationRequirementResolution {
  const allRequirements: RegistrationDocumentRequirement[] = [];

  let displayOrder = 0;

  for (const base of BASE_DOCUMENT_REQUIREMENTS) {
    allRequirements.push(createRequirement(policy.societyId, unitId, relationshipType, base, displayOrder++));
  }

  let additionalRequirements: typeof BASE_DOCUMENT_REQUIREMENTS = [];

  switch (relationshipType) {
    case 'TENANT':
      additionalRequirements = [...TENANT_ADDITIONAL_REQUIREMENTS];
      if (policy.requiresPoliceVerificationForTenant) {
        additionalRequirements.push({
          documentType: 'POLICE_VERIFICATION',
          title: 'Police Verification Certificate',
          description: 'Police verification certificate for tenant',
          mandatory: true,
          acceptedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maximumFileSizeBytes: 5 * 1024 * 1024,
          expiryDateRequired: true,
          frontAndBackRequired: false,
        });
      }
      if (policy.requiresOwnerConsentForTenant) {
        additionalRequirements.push({
          documentType: 'OWNER_CONSENT',
          title: 'Owner Consent Letter',
          description: 'Written consent from the unit owner for tenancy',
          mandatory: true,
          acceptedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maximumFileSizeBytes: 5 * 1024 * 1024,
          expiryDateRequired: true,
          frontAndBackRequired: false,
        });
      }
      break;
    case 'OWNER':
    case 'CO_OWNER':
      additionalRequirements = [...OWNER_ADDITIONAL_REQUIREMENTS];
      break;
    case 'FAMILY_MEMBER':
      additionalRequirements = [...FAMILY_MEMBER_ADDITIONAL_REQUIREMENTS];
      break;
  }

  for (const base of additionalRequirements) {
    allRequirements.push(createRequirement(policy.societyId, unitId, relationshipType, base, displayOrder++));
  }

  const societySpecificReqs = policy.documentRequirements.filter(
    (req) => req.relationshipType === relationshipType
  );
  for (const req of societySpecificReqs) {
    const existing = allRequirements.find((r) => r.documentType === req.documentType);
    if (!existing) {
      allRequirements.push({ ...req, requirementId: req.requirementId, displayOrder: displayOrder++ });
    }
  }

  const completedStatuses = new Set(['VERIFIED', 'SUBMITTED']);
  const underReviewStatuses = new Set(['UNDER_REVIEW', 'PROCESSING']);
  const changesRequiredStatuses = new Set(['CHANGES_REQUIRED', 'REJECTED']);

  const complete = allRequirements.every((req) => {
    const existing = existingDocuments.find((d) => d.requirementId === req.requirementId);
    if (!existing) return !req.mandatory;
    return completedStatuses.has(existing.status);
  });

  const incompleteRequirements = allRequirements
    .filter((req) => req.mandatory) 
    .filter((req) => {
      const existing = existingDocuments.find((d) => d.requirementId === req.requirementId);
      if (!existing) return true;
      return !completedStatuses.has(existing.status) && !underReviewStatuses.has(existing.status);
    })
    .map((r) => r.requirementId);

  const underReviewRequirements = allRequirements
    .filter((req) => {
      const existing = existingDocuments.find((d) => d.requirementId === req.requirementId);
      return existing && underReviewStatuses.has(existing.status);
    })
    .map((r) => r.requirementId);

  const changesRequiredRequirements = allRequirements
    .filter((req) => {
      const existing = existingDocuments.find((d) => d.requirementId === req.requirementId);
      return existing && changesRequiredStatuses.has(existing.status);
    })
    .map((r) => r.requirementId);

  const required = allRequirements.filter((r) => r.mandatory);
  const optional = allRequirements.filter((r) => !r.mandatory);

  return {
    required,
    optional,
    complete,
    incompleteRequirements,
    underReviewRequirements,
    changesRequiredRequirements,
  };
}

export function getRequiredDocumentsForRelationship(
  societyId: string,
  unitId: string,
  relationshipType: ClaimedRelationshipType,
  policy: SocietyRegistrationPolicy
): RegistrationDocumentRequirement[] {
  return resolveRequirements(policy, relationshipType, unitId, []).required;
}

export function getAllDocumentsForRelationship(
  societyId: string,
  unitId: string,
  relationshipType: ClaimedRelationshipType,
  policy: SocietyRegistrationPolicy
): RegistrationDocumentRequirement[] {
  const resolution = resolveRequirements(policy, relationshipType, unitId, []);
  return [...resolution.required, ...resolution.optional];
}