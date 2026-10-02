import {
  RegistrationStatus,
  REGISTRATION_STATUS_TRANSITIONS,
  canTransitionRegistration,
  ClaimedRelationshipType,
  RegistrationDocumentRequirement,
  ResidenceDocumentType,
  ResidenceDocumentMimeType,
} from '../data/registration.types';
import { resolveRequirements, getAllDocumentsForRelationship } from '../services/requirementEngine';
import { normalizeContact, normalizeIndianMobile, detectDuplicateRegistration, areContactsEquivalent, formatMobileForDisplay } from '../services/identityNormalization';

describe('Registration State Machine', () => {
  describe('REGISTRATION_STATUS_TRANSITIONS', () => {
    it('should define all valid transitions', () => {
      expect(REGISTRATION_STATUS_TRANSITIONS.INVITED).toEqual(['REGISTERED']);
      expect(REGISTRATION_STATUS_TRANSITIONS.REGISTERED).toEqual(['IDENTITY_VERIFIED']);
      expect(REGISTRATION_STATUS_TRANSITIONS.IDENTITY_VERIFIED).toEqual(['DOCUMENTS_SUBMITTED']);
      expect(REGISTRATION_STATUS_TRANSITIONS.DOCUMENTS_SUBMITTED).toEqual(['ADMIN_REVIEW']);
      expect(REGISTRATION_STATUS_TRANSITIONS.ADMIN_REVIEW).toEqual(['APPROVED', 'RESUBMIT', 'REJECTED']);
      expect(REGISTRATION_STATUS_TRANSITIONS.APPROVED).toEqual(['ACTIVE']);
      expect(REGISTRATION_STATUS_TRANSITIONS.RESUBMIT).toEqual(['DOCUMENTS_SUBMITTED', 'ADMIN_REVIEW']);
      expect(REGISTRATION_STATUS_TRANSITIONS.REJECTED).toEqual(['DOCUMENTS_SUBMITTED']);
      expect(REGISTRATION_STATUS_TRANSITIONS.ACTIVE).toEqual([]);
    });
  });

  describe('canTransitionRegistration', () => {
    it('should allow valid transitions', () => {
      expect(canTransitionRegistration('INVITED', 'REGISTERED')).toBe(true);
      expect(canTransitionRegistration('REGISTERED', 'IDENTITY_VERIFIED')).toBe(true);
      expect(canTransitionRegistration('IDENTITY_VERIFIED', 'DOCUMENTS_SUBMITTED')).toBe(true);
      expect(canTransitionRegistration('DOCUMENTS_SUBMITTED', 'ADMIN_REVIEW')).toBe(true);
      expect(canTransitionRegistration('ADMIN_REVIEW', 'APPROVED')).toBe(true);
      expect(canTransitionRegistration('ADMIN_REVIEW', 'RESUBMIT')).toBe(true);
      expect(canTransitionRegistration('ADMIN_REVIEW', 'REJECTED')).toBe(true);
      expect(canTransitionRegistration('APPROVED', 'ACTIVE')).toBe(true);
      expect(canTransitionRegistration('RESUBMIT', 'DOCUMENTS_SUBMITTED')).toBe(true);
      expect(canTransitionRegistration('RESUBMIT', 'ADMIN_REVIEW')).toBe(true);
      expect(canTransitionRegistration('REJECTED', 'DOCUMENTS_SUBMITTED')).toBe(true);
    });

    it('should reject invalid transitions', () => {
      expect(canTransitionRegistration('INVITED', 'ACTIVE')).toBe(false);
      expect(canTransitionRegistration('REGISTERED', 'ACTIVE')).toBe(false);
      expect(canTransitionRegistration('IDENTITY_VERIFIED', 'ACTIVE')).toBe(false);
      expect(canTransitionRegistration('DOCUMENTS_SUBMITTED', 'ACTIVE')).toBe(false);
      expect(canTransitionRegistration('ADMIN_REVIEW', 'REGISTERED')).toBe(false);
      expect(canTransitionRegistration('APPROVED', 'REJECTED')).toBe(false);
      expect(canTransitionRegistration('ACTIVE', 'APPROVED')).toBe(false);
    });

    it('should not allow transitions from terminal state', () => {
      expect(canTransitionRegistration('ACTIVE', 'ACTIVE')).toBe(false);
      expect(canTransitionRegistration('ACTIVE', 'REJECTED')).toBe(false);
    });
  });
});

describe('Requirement Engine', () => {
  const mockPolicy = {
    societyId: 'society-gv',
    openRegistrationEnabled: true,
    requiresAdminApproval: true,
    requiresOwnerConsentForTenant: true,
    requiresPoliceVerificationForTenant: true,
    allowedRelationshipTypes: ['OWNER', 'CO_OWNER', 'TENANT', 'FAMILY_MEMBER'] as ClaimedRelationshipType[],
    documentRequirements: [],
    invitationExpiryDays: 7,
    reminderPolicy: {
      enabled: true,
      minimumIntervalHours: 48,
      maximumRemindersWithinWindow: 3,
      reminderWindowDays: 7,
      allowResidentNote: true,
    },
  };

  const mockExistingDocuments: readonly { requirementId: string; status: string }[] = [];

  it('should return base requirements for all relationship types', () => {
    const result = resolveRequirements(mockPolicy, 'OWNER', 'unit-1', mockExistingDocuments);
    expect(result.required.length).toBeGreaterThanOrEqual(2);
    const identityReq = result.required.find((r) => r.documentType === 'IDENTITY_PROOF');
    const addressReq = result.required.find((r) => r.documentType === 'ADDRESS_PROOF');
    expect(identityReq).toBeDefined();
    expect(addressReq).toBeDefined();
    expect(identityReq?.mandatory).toBe(true);
    expect(addressReq?.mandatory).toBe(true);
  });

  it('should add ownership proof for OWNER', () => {
    const result = resolveRequirements(mockPolicy, 'OWNER', 'unit-1', mockExistingDocuments);
    const ownershipReq = result.required.find((r) => r.documentType === 'OWNERSHIP_PROOF');
    expect(ownershipReq).toBeDefined();
    expect(ownershipReq?.mandatory).toBe(true);
  });

  it('should add ownership proof for CO_OWNER', () => {
    const result = resolveRequirements(mockPolicy, 'CO_OWNER', 'unit-1', mockExistingDocuments);
    const ownershipReq = result.required.find((r) => r.documentType === 'OWNERSHIP_PROOF');
    expect(ownershipReq).toBeDefined();
  });

  it('should add rent agreement and tenant KYC for TENANT', () => {
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', mockExistingDocuments);
    const rentReq = result.required.find((r) => r.documentType === 'RENT_AGREEMENT');
    const kycReq = result.required.find((r) => r.documentType === 'TENANT_KYC');
    expect(rentReq).toBeDefined();
    expect(kycReq).toBeDefined();
    expect(rentReq?.mandatory).toBe(true);
    expect(kycReq?.mandatory).toBe(true);
  });

  it('should add police verification for TENANT when policy requires', () => {
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', mockExistingDocuments);
    const policeReq = result.required.find((r) => r.documentType === 'POLICE_VERIFICATION');
    expect(policeReq).toBeDefined();
    expect(policeReq?.mandatory).toBe(true);
  });

  it('should add owner consent for TENANT when policy requires', () => {
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', mockExistingDocuments);
    const consentReq = result.required.find((r) => r.documentType === 'OWNER_CONSENT');
    expect(consentReq).toBeDefined();
    expect(consentReq?.mandatory).toBe(true);
  });

  it('should add relationship proof for FAMILY_MEMBER', () => {
    const result = resolveRequirements(mockPolicy, 'FAMILY_MEMBER', 'unit-1', mockExistingDocuments);
    const relReq = result.required.find((r) => r.documentType === 'RELATIONSHIP_PROOF');
    expect(relReq).toBeDefined();
    expect(relReq?.mandatory).toBe(true);
  });

  it('should mark incomplete requirements when documents missing', () => {
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', []);
    expect(result.complete).toBe(false);
    expect(result.incompleteRequirements.length).toBeGreaterThan(0);
  });

  it('should mark complete when all mandatory documents submitted', () => {
    const docs = [
      { requirementId: 'req-society-gv-unit-1-TENANT-IDENTITY_PROOF-0', status: 'VERIFIED' },
      { requirementId: 'req-society-gv-unit-1-TENANT-ADDRESS_PROOF-1', status: 'VERIFIED' },
      { requirementId: 'req-society-gv-unit-1-TENANT-RENT_AGREEMENT-2', status: 'VERIFIED' },
      { requirementId: 'req-society-gv-unit-1-TENANT-TENANT_KYC-3', status: 'VERIFIED' },
      { requirementId: 'req-society-gv-unit-1-TENANT-POLICE_VERIFICATION-4', status: 'VERIFIED' },
      { requirementId: 'req-society-gv-unit-1-TENANT-OWNER_CONSENT-5', status: 'VERIFIED' },
    ];
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', docs);
    expect(result.complete).toBe(true);
    expect(result.incompleteRequirements.length).toBe(0);
  });

  it('should track under review requirements', () => {
    const docs = [
      { requirementId: 'req-society-gv-unit-1-TENANT-IDENTITY_PROOF-0', status: 'UNDER_REVIEW' },
      { requirementId: 'req-society-gv-unit-1-TENANT-ADDRESS_PROOF-1', status: 'VERIFIED' },
    ];
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', docs);
    expect(result.underReviewRequirements).toContain('req-society-gv-unit-1-TENANT-IDENTITY_PROOF-0');
  });

  it('should track changes required requirements', () => {
    const docs = [
      { requirementId: 'req-society-gv-unit-1-TENANT-IDENTITY_PROOF-0', status: 'CHANGES_REQUIRED' },
      { requirementId: 'req-society-gv-unit-1-TENANT-ADDRESS_PROOF-1', status: 'VERIFIED' },
    ];
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', docs);
    expect(result.changesRequiredRequirements).toContain('req-society-gv-unit-1-TENANT-IDENTITY_PROOF-0');
  });

  it('should separate required and optional requirements', () => {
    const result = resolveRequirements(mockPolicy, 'TENANT', 'unit-1', mockExistingDocuments);
    expect(result.required.every((r) => r.mandatory)).toBe(true);
    expect(result.optional.every((r) => !r.mandatory)).toBe(true);
  });
});

describe('Identity Normalization', () => {
  describe('normalizeIndianMobile', () => {
    it('should normalize various Indian mobile formats', () => {
      expect(normalizeIndianMobile('9876543210')).toEqual({ normalized: '9876543210', countryCode: '+91' });
      expect(normalizeIndianMobile('+919876543210')).toEqual({ normalized: '9876543210', countryCode: '+91' });
      expect(normalizeIndianMobile('+91 98765 43210')).toEqual({ normalized: '9876543210', countryCode: '+91' });
      expect(normalizeIndianMobile('919876543210')).toEqual({ normalized: '9876543210', countryCode: '+91' });
      expect(normalizeIndianMobile('09876543210')).toEqual({ normalized: '9876543210', countryCode: '+91' });
    });

    it('should reject invalid formats', () => {
      expect(normalizeIndianMobile('1234567890')).toBeNull();
      expect(normalizeIndianMobile('987654321')).toBeNull();
      expect(normalizeIndianMobile('+911234567890')).toBeNull();
    });
  });

  describe('normalizeContact', () => {
    it('should normalize phone and email', () => {
      const result = normalizeContact('9876543210', '+91', 'User@Example.COM');
      expect(result).toEqual({
        mobileNumber: '9876543210',
        countryCode: '+91',
        email: 'user@example.com',
      });
    });

    it('should handle email with plus addressing', () => {
      const result = normalizeContact('9876543210', '+91', 'user+tag@example.com');
      expect(result?.email).toBe('user@example.com');
    });
  });

  describe('areContactsEquivalent', () => {
    it('should return true for identical contacts', () => {
      const c1 = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'user@example.com' };
      const c2 = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'user@example.com' };
      expect(areContactsEquivalent(c1, c2)).toBe(true);
    });

    it('should return false for different phones', () => {
      const c1 = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'user@example.com' };
      const c2 = { mobileNumber: '9876543211', countryCode: '+91' as const, email: 'user@example.com' };
      expect(areContactsEquivalent(c1, c2)).toBe(false);
    });

    it('should return false for different emails', () => {
      const c1 = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'user@example.com' };
      const c2 = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'other@example.com' };
      expect(areContactsEquivalent(c1, c2)).toBe(false);
    });
  });

  describe('formatMobileForDisplay', () => {
    it('should format Indian mobile with spacing', () => {
      expect(formatMobileForDisplay('9876543210', '+91')).toBe('+91 98765 43210');
    });
  });

  describe('detectDuplicateRegistration', () => {
    const existingRegistrations = [
      {
        id: 'reg-1',
        mobileNumber: '9876543210',
        countryCode: '+91' as const,
        email: 'user@example.com',
        fullName: 'John Doe',
        societyId: 'society-gv',
      },
      {
        id: 'reg-2',
        mobileNumber: '9876543211',
        countryCode: '+91' as const,
        email: 'other@example.com',
        fullName: 'Jane Smith',
        societyId: 'society-gv',
      },
    ];

    it('should detect exact match in same society', () => {
      const newContact = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'user@example.com' };
      const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-gv');
      expect(result.hasDuplicate).toBe(true);
      expect(result.duplicateType).toBe('EXACT_MATCH');
      expect(result.existingRegistrationId).toBe('reg-1');
      expect(result.requiresManualReview).toBe(false);
    });

    it('should detect phone match in same society', () => {
      const newContact = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'different@example.com' };
      const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-gv');
      expect(result.hasDuplicate).toBe(true);
      expect(result.duplicateType).toBe('PHONE_MATCH');
      expect(result.requiresManualReview).toBe(true);
    });

    it('should detect email match in same society', () => {
      const newContact = { mobileNumber: '9876543212', countryCode: '+91' as const, email: 'user@example.com' };
      const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-gv');
      expect(result.hasDuplicate).toBe(true);
      expect(result.duplicateType).toBe('EMAIL_MATCH');
      expect(result.requiresManualReview).toBe(true);
    });

    it('should detect exact match in different society', () => {
      const newContact = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'user@example.com' };
      const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-other');
      expect(result.hasDuplicate).toBe(true);
      expect(result.duplicateType).toBe('EXACT_MATCH');
      expect(result.existingSocietyId).toBe('society-gv');
      expect(result.requiresManualReview).toBe(false);
    });

    it('should detect phone match in different society', () => {
      const newContact = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'different@example.com' };
      const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-other');
      expect(result.hasDuplicate).toBe(true);
      expect(result.duplicateType).toBe('PHONE_MATCH');
      expect(result.requiresManualReview).toBe(true);
    });

    it('should return no duplicate for new contact', () => {
      const newContact = { mobileNumber: '9876543212', countryCode: '+91' as const, email: 'new@example.com' };
      const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-gv');
      expect(result.hasDuplicate).toBe(false);
    });

    it('should exclude specific registration from check', () => {
      const newContact = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'user@example.com' };
      const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-gv', 'reg-1');
      expect(result.hasDuplicate).toBe(false);
    });
  });
});

describe('Edge Cases and Security', () => {
  it('should not allow unsafe merge on similar names', () => {
    const existingRegistrations = [
      {
        id: 'reg-1',
        mobileNumber: '9876543210',
        countryCode: '+91' as const,
        email: 'user@example.com',
        fullName: 'John Doe',
        societyId: 'society-gv',
      },
    ];
    const newContact = { mobileNumber: '9876543211', countryCode: '+91' as const, email: 'user2@example.com' };
    const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-gv');
    expect(result.hasDuplicate).toBe(false);
  });

  it('should flag recycled phone scenario', () => {
    const existingRegistrations = [
      {
        id: 'reg-1',
        mobileNumber: '9876543210',
        countryCode: '+91' as const,
        email: 'olduser@example.com',
        fullName: 'Old User',
        societyId: 'society-gv',
      },
    ];
    const newContact = { mobileNumber: '9876543210', countryCode: '+91' as const, email: 'newuser@example.com' };
    const result = detectDuplicateRegistration(newContact, existingRegistrations, 'society-gv');
    expect(result.hasDuplicate).toBe(true);
    expect(result.duplicateType).toBe('PHONE_MATCH');
    expect(result.requiresManualReview).toBe(true);
  });
});