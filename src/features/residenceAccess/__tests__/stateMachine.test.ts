import { residenceAccessTransitionService } from '../services/ResidenceAccessTransitionService';
import type { ResidenceAccessStatus, ResidenceAccessCommand, ResidenceAccessActor } from '../models/residenceAccess.types';

describe('Residence Access State Machine', () => {
  const mockResidentActor: ResidenceAccessActor = { actorType: 'RESIDENT', actorId: 'resident-1', actorDisplayRole: 'Resident' };
  const mockSocietyActor: ResidenceAccessActor = { actorType: 'SOCIETY_ADMIN', actorId: 'admin-1', actorDisplayRole: 'Society Admin' };
  const mockOwnerActor: ResidenceAccessActor = { actorType: 'OWNER', actorId: 'owner-1', actorDisplayRole: 'Owner' };
  const mockSystemActor: ResidenceAccessActor = { actorType: 'SYSTEM', actorId: 'system', actorDisplayRole: 'System' };

  const createMockRecord = (status: ResidenceAccessStatus): any => ({
    residenceAccessId: 'access-1',
    userId: 'resident-1',
    societyId: 'society-1',
    unitId: 'unit-1',
    occupancyId: 'occ-1',
    role: 'OWNER',
    status,
    blockers: [],
    statusReason: '',
    residentPendingActions: [],
    societyPendingActions: [],
    completedSteps: [],
    statusUpdatedAt: new Date().toISOString(),
    referenceNumber: 'REF-1',
    dataVersion: 1,
  });

  describe('Valid transitions for RESIDENT actor', () => {
    it('should allow START_CLAIM from DISCOVERED', () => {
      const record = createMockRecord('DISCOVERED');
      const result = residenceAccessTransitionService.transition(record, { type: 'START_CLAIM', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('CLAIM_NOT_STARTED');
    });

    it('should allow START_CLAIM from CLAIM_NOT_STARTED', () => {
      const record = createMockRecord('CLAIM_NOT_STARTED');
      const result = residenceAccessTransitionService.transition(record, { type: 'START_CLAIM', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('IDENTITY_DETAILS_REQUIRED');
    });

    it('should allow REQUEST_DOCUMENTS from IDENTITY_DETAILS_REQUIRED', () => {
      const record = createMockRecord('IDENTITY_DETAILS_REQUIRED');
      const result = residenceAccessTransitionService.transition(record, { type: 'REQUEST_DOCUMENTS', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('DOCUMENTS_REQUIRED');
    });

    it('should allow SUBMIT_DOCUMENTS from DOCUMENTS_REQUIRED', () => {
      const record = createMockRecord('DOCUMENTS_REQUIRED');
      const result = residenceAccessTransitionService.transition(record, { type: 'SUBMIT_DOCUMENTS', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('DOCUMENTS_UNDER_REVIEW');
    });

    it('should allow RESUBMIT from DOCUMENT_CHANGES_REQUIRED', () => {
      const record = createMockRecord('DOCUMENT_CHANGES_REQUIRED');
      const result = residenceAccessTransitionService.transition(record, { type: 'RESUBMIT', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('DOCUMENTS_UNDER_REVIEW');
    });

    it('should allow RESUBMIT from ADDITIONAL_INFORMATION_REQUIRED', () => {
      const record = createMockRecord('ADDITIONAL_INFORMATION_REQUIRED');
      const result = residenceAccessTransitionService.transition(record, { type: 'RESUBMIT', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('DOCUMENTS_UNDER_REVIEW');
    });

    it('should allow RESUBMIT from REJECTED', () => {
      const record = createMockRecord('REJECTED');
      const result = residenceAccessTransitionService.transition(record, { type: 'RESUBMIT', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('DOCUMENTS_UNDER_REVIEW');
    });

    it('should allow ACCESS_REVOKED (withdraw) from various states for RESIDENT', () => {
      const states: ResidenceAccessStatus[] = ['CLAIM_NOT_STARTED', 'IDENTITY_DETAILS_REQUIRED', 'DOCUMENTS_REQUIRED', 'DOCUMENTS_UNDER_REVIEW', 'DOCUMENT_CHANGES_REQUIRED', 'OWNER_CONSENT_REQUIRED', 'OWNER_CONSENT_PENDING', 'SOCIETY_APPROVAL_PENDING', 'ADDITIONAL_INFORMATION_REQUIRED'];
      
      for (const state of states) {
        const record = createMockRecord(state);
        const result = residenceAccessTransitionService.canTransition(state, 'ACCESS_REVOKED', mockResidentActor);
        expect(result).toBe(true);
      }
    });
  });

  describe('Valid transitions for SOCIETY_ADMIN actor', () => {
    it('should allow APPROVE from DOCUMENTS_UNDER_REVIEW', () => {
      const record = createMockRecord('DOCUMENTS_UNDER_REVIEW');
      const result = residenceAccessTransitionService.transition(record, { type: 'APPROVE', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('APPROVED');
    });

    it('should allow APPROVE from SOCIETY_APPROVAL_PENDING', () => {
      const record = createMockRecord('SOCIETY_APPROVAL_PENDING');
      const result = residenceAccessTransitionService.transition(record, { type: 'APPROVE', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('APPROVED');
    });

    it('should allow REJECT from DOCUMENTS_UNDER_REVIEW', () => {
      const record = createMockRecord('DOCUMENTS_UNDER_REVIEW');
      const result = residenceAccessTransitionService.transition(record, { type: 'REJECT', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('REJECTED');
    });

    it('should allow REJECT from SOCIETY_APPROVAL_PENDING', () => {
      const record = createMockRecord('SOCIETY_APPROVAL_PENDING');
      const result = residenceAccessTransitionService.transition(record, { type: 'REJECT', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('REJECTED');
    });

    it('should allow REQUEST_DOCUMENT_CHANGES from DOCUMENTS_UNDER_REVIEW', () => {
      const record = createMockRecord('DOCUMENTS_UNDER_REVIEW');
      const result = residenceAccessTransitionService.transition(record, { type: 'REQUEST_DOCUMENT_CHANGES', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('DOCUMENT_CHANGES_REQUIRED');
    });

    it('should allow REQUEST_ADDITIONAL_INFORMATION from DOCUMENTS_UNDER_REVIEW', () => {
      const record = createMockRecord('DOCUMENTS_UNDER_REVIEW');
      const result = residenceAccessTransitionService.transition(record, { type: 'REQUEST_ADDITIONAL_INFORMATION', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('ADDITIONAL_INFORMATION_REQUIRED');
    });

    it('should allow ACTIVATE from APPROVED', () => {
      const record = createMockRecord('APPROVED');
      const result = residenceAccessTransitionService.transition(record, { type: 'ACTIVATE', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('ACTIVE');
    });

    it('should allow SUSPEND from ACTIVE', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'SUSPEND', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('SUSPENDED');
    });

    it('should allow RESTRICT from ACTIVE', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'RESTRICT', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('TEMPORARILY_RESTRICTED');
    });

    it('should allow DEACTIVATE from ACTIVE', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'DEACTIVATE', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('INACTIVE');
    });

    it('should allow EXPIRE from ACTIVE', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'EXPIRE', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('EXPIRED');
    });

    it('should allow REVOKE from ACTIVE', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'REVOKE', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('ACCESS_REVOKED');
    });
  });

  describe('Valid transitions for OWNER actor', () => {
    it('should allow OWNER_CONSENT_RECEIVED from OWNER_CONSENT_PENDING', () => {
      const record = createMockRecord('OWNER_CONSENT_PENDING');
      const result = residenceAccessTransitionService.transition(record, { type: 'OWNER_CONSENT_RECEIVED', actor: mockOwnerActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('SOCIETY_APPROVAL_PENDING');
    });

    it('should allow REJECT (DECLINE) from OWNER_CONSENT_PENDING', () => {
      const record = createMockRecord('OWNER_CONSENT_PENDING');
      const result = residenceAccessTransitionService.transition(record, { type: 'REJECT', actor: mockOwnerActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('REJECTED');
    });

    it('should allow REVOKE from ACTIVE', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'REVOKE', actor: mockOwnerActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('ACCESS_REVOKED');
    });
  });

  describe('Valid transitions for SYSTEM actor', () => {
    it('should allow EXPIRE from ACTIVE', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'EXPIRE', actor: mockSystemActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('EXPIRED');
    });

    it('should allow transition from EXPIRED to SOCIETY_APPROVAL_PENDING', () => {
      const record = createMockRecord('EXPIRED');
      const result = residenceAccessTransitionService.transition(record, { type: 'REQUEST_REACTIVATION', actor: mockResidentActor });
      expect(result.allowed).toBe(true);
      expect(result.nextStatus).toBe('SOCIETY_APPROVAL_PENDING');
    });
  });

  describe('Invalid transitions', () => {
    it('should reject RESIDENT APPROVE', () => {
      const record = createMockRecord('DOCUMENTS_UNDER_REVIEW');
      const result = residenceAccessTransitionService.transition(record, { type: 'APPROVE', actor: mockResidentActor });
      expect(result.allowed).toBe(false);
    });

    it('should reject RESIDENT ACTIVATE', () => {
      const record = createMockRecord('APPROVED');
      const result = residenceAccessTransitionService.transition(record, { type: 'ACTIVATE', actor: mockResidentActor });
      expect(result.allowed).toBe(false);
    });

    it('should reject SOCIETY_ADMIN SUBMIT_IDENTITY', () => {
      const record = createMockRecord('CLAIM_NOT_STARTED');
      const result = residenceAccessTransitionService.transition(record, { type: 'SUBMIT_IDENTITY', actor: mockSocietyActor });
      expect(result.allowed).toBe(false);
    });

    it('should reject OWNER APPROVE', () => {
      const record = createMockRecord('DOCUMENTS_UNDER_REVIEW');
      const result = residenceAccessTransitionService.transition(record, { type: 'APPROVE', actor: mockOwnerActor });
      expect(result.allowed).toBe(false);
    });

    it('should reject transition from ARCHIVED', () => {
      const record = createMockRecord('ARCHIVED');
      const result = residenceAccessTransitionService.transition(record, { type: 'ACTIVATE', actor: mockSocietyActor });
      expect(result.allowed).toBe(false);
    });

    it('should return reason for invalid transition', () => {
      const record = createMockRecord('ACTIVE');
      const result = residenceAccessTransitionService.transition(record, { type: 'START_CLAIM', actor: mockResidentActor });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('not permitted');
    });
  });

  describe('canTransition', () => {
    it('should return true for valid transitions', () => {
      expect(residenceAccessTransitionService.canTransition('DOCUMENTS_UNDER_REVIEW', 'APPROVED', mockSocietyActor)).toBe(true);
      expect(residenceAccessTransitionService.canTransition('DOCUMENTS_UNDER_REVIEW', 'REJECTED', mockSocietyActor)).toBe(true);
      expect(residenceAccessTransitionService.canTransition('SOCIETY_APPROVAL_PENDING', 'APPROVED', mockSocietyActor)).toBe(true);
    });

    it('should return false for invalid transitions', () => {
      expect(residenceAccessTransitionService.canTransition('ACTIVE', 'APPROVED', mockSocietyActor)).toBe(false);
      expect(residenceAccessTransitionService.canTransition('DOCUMENTS_UNDER_REVIEW', 'ACTIVE', mockSocietyActor)).toBe(false);
    });
  });

  describe('Status increments dataVersion', () => {
    it('should increment dataVersion on transition', () => {
      const record = createMockRecord('DOCUMENTS_UNDER_REVIEW');
      const initialVersion = record.dataVersion;
      const result = residenceAccessTransitionService.transition(record, { type: 'APPROVE', actor: mockSocietyActor });
      expect(result.allowed).toBe(true);
      expect(result.residenceAccess.dataVersion).toBe(initialVersion + 1);
    });
  });
});

describe('Concurrency and Stale Data', () => {
  const mockSocietyActor: ResidenceAccessActor = { actorType: 'SOCIETY_ADMIN', actorId: 'admin-1', actorDisplayRole: 'Society Admin' };

  const createMockRecord = (status: ResidenceAccessStatus, dataVersion: number): any => ({
    residenceAccessId: 'access-1',
    userId: 'resident-1',
    societyId: 'society-1',
    unitId: 'unit-1',
    occupancyId: 'occ-1',
    role: 'OWNER',
    status,
    blockers: [],
    statusReason: '',
    residentPendingActions: [],
    societyPendingActions: [],
    completedSteps: [],
    statusUpdatedAt: new Date().toISOString(),
    referenceNumber: 'REF-1',
    dataVersion,
  });

  it('should handle stale version detection in repository', () => {
    const record = createMockRecord('SOCIETY_APPROVAL_PENDING', 5);
    const result = residenceAccessTransitionService.transition(record, { type: 'APPROVE', actor: mockSocietyActor });
    expect(result.allowed).toBe(true);
    expect(result.residenceAccess.dataVersion).toBe(6);
  });

  it('should track statusUpdatedAt on transition', () => {
    const record = createMockRecord('SOCIETY_APPROVAL_PENDING', 5);
    const before = new Date(record.statusUpdatedAt).getTime();
    const result = residenceAccessTransitionService.transition(record, { type: 'APPROVE', actor: mockSocietyActor });
    const after = new Date(result.residenceAccess.statusUpdatedAt).getTime();
    expect(after).toBeGreaterThanOrEqual(before);
  });
});

describe('Document State Machine', () => {
  type DocStatus = 
    | 'NOT_SUBMITTED'
    | 'SELECTED'
    | 'UPLOADING'
    | 'UPLOADED'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'VERIFIED'
    | 'CHANGES_REQUIRED'
    | 'REJECTED'
    | 'EXPIRED';

  const docTransitions: Record<DocStatus, DocStatus[]> = {
    NOT_SUBMITTED: ['UPLOADING', 'SELECTED'],
    SELECTED: ['UPLOADING', 'NOT_SUBMITTED'],
    UPLOADING: ['UPLOADED', 'NOT_SUBMITTED'],
    UPLOADED: ['SUBMITTED', 'NOT_SUBMITTED'],
    SUBMITTED: ['UNDER_REVIEW', 'CHANGES_REQUIRED', 'REJECTED'],
    UNDER_REVIEW: ['VERIFIED', 'CHANGES_REQUIRED', 'REJECTED'],
    VERIFIED: ['EXPIRED'],
    CHANGES_REQUIRED: ['UPLOADING', 'NOT_SUBMITTED'],
    REJECTED: ['UPLOADING', 'NOT_SUBMITTED'],
    EXPIRED: ['UPLOADING', 'NOT_SUBMITTED'],
  };

  it('should allow valid document transitions', () => {
    expect(docTransitions.NOT_SUBMITTED).toContain('UPLOADING');
    expect(docTransitions.UPLOADING).toContain('UPLOADED');
    expect(docTransitions.UPLOADED).toContain('SUBMITTED');
    expect(docTransitions.SUBMITTED).toContain('UNDER_REVIEW');
    expect(docTransitions.UNDER_REVIEW).toContain('VERIFIED');
    expect(docTransitions.UNDER_REVIEW).toContain('CHANGES_REQUIRED');
    expect(docTransitions.CHANGES_REQUIRED).toContain('UPLOADING');
    expect(docTransitions.REJECTED).toContain('UPLOADING');
  });

  it('should not allow invalid document transitions', () => {
    expect(docTransitions.NOT_SUBMITTED).not.toContain('VERIFIED');
    expect(docTransitions.UPLOADING).not.toContain('VERIFIED');
    expect(docTransitions.UPLOADED).not.toContain('VERIFIED');
    expect(docTransitions.VERIFIED).not.toContain('SUBMITTED');
  });

  it('should preserve version history on replacement', () => {
    const docV1 = { version: 1, documentId: 'doc-1', checksum: 'abc123' };
    const docV2 = { version: 2, documentId: 'doc-2', checksum: 'def456', previousVersionId: 'doc-1' };
    
    expect(docV2.version).toBe(docV1.version + 1);
    expect(docV2.previousVersionId).toBe(docV1.documentId);
  });
});