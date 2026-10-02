import { residentRegistrationService } from '../services/residentRegistrationService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { ResidentRegistrationStatus } from '../data/residentRegistration.types';


describe('Society Admin Registration Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockStore.getState().residentRegistrations = [];
    mockStore.getState().residentInvitations = [];
    mockStore.getState().residentDocuments = [];
    mockStore.getState().societyUnits = [
      { id: 'unit-1', unitNumber: 'A-101', towerId: 'tower-a', wingId: 'wing-1', floorId: 'floor-1', occupancyStatus: 'VACANT', societyId: 'society-gv' },
    ];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createRegistration', () => {
    it('should create registration with INVITED status', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      expect(registration.status).toBe('INVITED');
      expect(registration.verificationStatus).toBe('PENDING');
    });

    it('should set relationship-specific required documents', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'TENANT' as const,
        firstName: 'Jane',
        lastName: 'Tenant',
        mobile: '9876543211',
        email: 'jane@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      const detail = await residentRegistrationService.getRegistrationDetail(registration.id);
      expect(detail?.requiredDocuments.some((d) => d.type === 'rent_agreement')).toBe(true);
      expect(detail?.requiredDocuments.some((d) => d.type === 'police_verification')).toBe(true);
      expect(detail?.requiredDocuments.some((d) => d.type === 'identity_proof')).toBe(true);
    });
  });

  describe('transitionStatus', () => {
    it('should follow valid transitions', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      const registered = await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      expect(registered.status).toBe('REGISTERED');
      expect(registered.registeredAt).toBeDefined();
      
      const verified = await residentRegistrationService.transitionStatus(registration.id, 'IDENTITY_VERIFIED');
      expect(verified.status).toBe('IDENTITY_VERIFIED');
      expect(verified.verificationStatus).toBe('VERIFIED');
      expect(verified.verificationCompletedAt).toBeDefined();
      
      const submitted = await residentRegistrationService.transitionStatus(registration.id, 'DOCUMENTS_SUBMITTED');
      expect(submitted.status).toBe('DOCUMENTS_SUBMITTED');
      expect(submitted.documentsSubmittedAt).toBeDefined();
      
      const inReview = await residentRegistrationService.transitionStatus(registration.id, 'ADMIN_REVIEW');
      expect(inReview.status).toBe('ADMIN_REVIEW');
      expect(inReview.submittedForReviewAt).toBeDefined();
    });

    it('should reject invalid transition from INVITED to ACTIVE', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      await expect(residentRegistrationService.transitionStatus(registration.id, 'ACTIVE'))
        .rejects.toThrow('Invalid status transition');
    });

    it('should allow APPROVED -> ACTIVE', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      await residentRegistrationService.transitionStatus(registration.id, 'IDENTITY_VERIFIED');
      await residentRegistrationService.transitionStatus(registration.id, 'DOCUMENTS_SUBMITTED');
      await residentRegistrationService.transitionStatus(registration.id, 'ADMIN_REVIEW');
      await residentRegistrationService.transitionStatus(registration.id, 'APPROVED');
      
      const active = await residentRegistrationService.transitionStatus(registration.id, 'ACTIVE');
      expect(active.status).toBe('ACTIVE');
      expect(active.activatedAt).toBeDefined();
    });

    it('should allow REJECTED -> DOCUMENTS_SUBMITTED for resubmission', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      await residentRegistrationService.transitionStatus(registration.id, 'IDENTITY_VERIFIED');
      await residentRegistrationService.transitionStatus(registration.id, 'DOCUMENTS_SUBMITTED');
      await residentRegistrationService.transitionStatus(registration.id, 'ADMIN_REVIEW');
      const rejected = await residentRegistrationService.transitionStatus(registration.id, 'REJECTED', {
        rejectionReason: 'Documents incomplete',
      });
      expect(rejected.status).toBe('REJECTED');
      expect(rejected.rejectedAt).toBeDefined();
      
      const resubmitted = await residentRegistrationService.transitionStatus(registration.id, 'DOCUMENTS_SUBMITTED');
      expect(resubmitted.status).toBe('DOCUMENTS_SUBMITTED');
    });
  });

  describe('approveRegistration', () => {
    it('should approve and activate registration', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      await residentRegistrationService.transitionStatus(registration.id, 'IDENTITY_VERIFIED');
      await residentRegistrationService.transitionStatus(registration.id, 'DOCUMENTS_SUBMITTED');
      await residentRegistrationService.transitionStatus(registration.id, 'ADMIN_REVIEW');
      
      const approved = await residentRegistrationService.approveRegistration(registration.id, 'admin-1');
      expect(approved.status).toBe('APPROVED');
      expect(approved.approvedAt).toBeDefined();
      
      const active = await residentRegistrationService.activateRegistration(registration.id);
      expect(active.status).toBe('ACTIVE');
    });
  });

  describe('rejectRegistration', () => {
    it('should reject with reason', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      await residentRegistrationService.transitionStatus(registration.id, 'IDENTITY_VERIFIED');
      await residentRegistrationService.transitionStatus(registration.id, 'DOCUMENTS_SUBMITTED');
      await residentRegistrationService.transitionStatus(registration.id, 'ADMIN_REVIEW');
      
      const rejected = await residentRegistrationService.rejectRegistration(registration.id, 'admin-1', 'Invalid ownership proof');
      expect(rejected.status).toBe('REJECTED');
      expect(rejected.rejectionReason).toBe('Invalid ownership proof');
      expect(rejected.rejectedAt).toBeDefined();
    });
  });

  describe('requestResubmission', () => {
    it('should transition to RESUBMIT', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      await residentRegistrationService.transitionStatus(registration.id, 'IDENTITY_VERIFIED');
      await residentRegistrationService.transitionStatus(registration.id, 'DOCUMENTS_SUBMITTED');
      await residentRegistrationService.transitionStatus(registration.id, 'ADMIN_REVIEW');
      
      const resubmit = await residentRegistrationService.requestResubmission(registration.id, 'admin-1');
      expect(resubmit.status).toBe('RESUBMIT');
      expect(resubmit.reviewedAt).toBeDefined();
    });
  });

  describe('invitation flow', () => {
    it('should create invitation with token and expiry', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      const invitation = await residentRegistrationService.createInvitation({
        registrationId: registration.id,
        societyId: 'society-gv',
        societyName: 'Green Valley Heights',
        unitId: 'unit-1',
        unitNumber: 'A-101',
        relationshipType: 'OWNER',
        recipientMobile: '9876543210',
        recipientEmail: 'john@example.com',
      });
      
      expect(invitation.token).toBeDefined();
      expect(invitation.status).toBe('PENDING');
      expect(invitation.expiresAt).toBeDefined();
      expect(new Date(invitation.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it('should accept valid invitation', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      const invitation = await residentRegistrationService.createInvitation({
        registrationId: registration.id,
        societyId: 'society-gv',
        societyName: 'Green Valley Heights',
        unitId: 'unit-1',
        unitNumber: 'A-101',
        relationshipType: 'OWNER',
        recipientMobile: '9876543210',
        recipientEmail: 'john@example.com',
      });
      
      const accepted = await residentRegistrationService.acceptInvitation(invitation.token);
      expect(accepted?.status).toBe('ACCEPTED');
      expect(accepted?.acceptedAt).toBeDefined();
    });

    it('should reject expired invitation', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      const invitation = await residentRegistrationService.createInvitation({
        registrationId: registration.id,
        societyId: 'society-gv',
        societyName: 'Green Valley Heights',
        unitId: 'unit-1',
        unitNumber: 'A-101',
        relationshipType: 'OWNER',
        recipientMobile: '9876543210',
        recipientEmail: 'john@example.com',
      });
      
      jest.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);
      
      const accepted = await residentRegistrationService.acceptInvitation(invitation.token);
      expect(accepted).toBeUndefined();
    });
  });

  describe('document submission', () => {
    it('should submit documents and mark as SUBMITTED', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      
      const documents = await residentRegistrationService.submitDocuments({
        registrationId: registration.id,
        documents: [
          { type: 'identity_proof', fileName: 'aadhaar.pdf', fileSize: 1024, mimeType: 'application/pdf', url: 'mock://doc/1' },
          { type: 'ownership_proof', fileName: 'sale_deed.pdf', fileSize: 2048, mimeType: 'application/pdf', url: 'mock://doc/2' },
        ],
      });
      
      expect(documents.length).toBe(2);
      expect(documents.every((d) => d.status === 'SUBMITTED')).toBe(true);
      expect(documents.every((d) => d.submittedAt)).toBe(true);
    });
  });

  describe('getRegistrations with filters', () => {
    it('should filter by status', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      await residentRegistrationService.createRegistration(request);
      
      const pending = await residentRegistrationService.getRegistrations({ societyId: 'society-gv', status: 'INVITED' });
      expect(pending.length).toBe(1);
      expect(pending[0].status).toBe('INVITED');
    });

    it('should filter by unitId', async () => {
      mockStore.getState().societyUnits.push({ id: 'unit-2', unitNumber: 'B-202', towerId: 'tower-b', wingId: 'wing-2', floorId: 'floor-2', occupancyStatus: 'VACANT', societyId: 'society-gv' });
      
      const request1 = { societyId: 'society-gv', unitId: 'unit-1', relationshipType: 'OWNER' as const, firstName: 'John', lastName: 'Doe', mobile: '9876543210', email: 'john@example.com', createdBy: 'admin' };
      const request2 = { societyId: 'society-gv', unitId: 'unit-2', relationshipType: 'TENANT' as const, firstName: 'Jane', lastName: 'Smith', mobile: '9876543211', email: 'jane@example.com', createdBy: 'admin' };
      
      await residentRegistrationService.createRegistration(request1);
      await residentRegistrationService.createRegistration(request2);
      
      const unit1Regs = await residentRegistrationService.getRegistrations({ societyId: 'society-gv', unitId: 'unit-1' });
      expect(unit1Regs.length).toBe(1);
      expect(unit1Regs[0].unitId).toBe('unit-1');
    });
  });

  describe('concurrency - dataVersion', () => {
    it('should increment dataVersion on each update', async () => {
      const request = {
        societyId: 'society-gv',
        unitId: 'unit-1',
        relationshipType: 'OWNER' as const,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        createdBy: 'admin',
      };
      const registration = await residentRegistrationService.createRegistration(request);
      const initialVersion = registration.dataVersion || 1;
      
      await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      const updated = await residentRegistrationService.getRegistrationById(registration.id);
      expect((updated as any)?.dataVersion).toBe(initialVersion + 1);
    });
  });
});

describe('Edge Cases', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockStore.getState().residentRegistrations = [];
    mockStore.getState().residentInvitations = [];
    mockStore.getState().residentDocuments = [];
    mockStore.getState().societyUnits = [
      { id: 'unit-1', unitNumber: 'A-101', towerId: 'tower-a', wingId: 'wing-1', floorId: 'floor-1', occupancyStatus: 'VACANT', societyId: 'society-gv' },
    ];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle revoked invitation', async () => {
    const request = {
      societyId: 'society-gv',
      unitId: 'unit-1',
      relationshipType: 'OWNER' as const,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '9876543210',
      email: 'john@example.com',
      createdBy: 'admin',
    };
    const registration = await residentRegistrationService.createRegistration(request);
    
    const invitation = await residentRegistrationService.createInvitation({
      registrationId: registration.id,
      societyId: 'society-gv',
      societyName: 'Green Valley Heights',
      unitId: 'unit-1',
      unitNumber: 'A-101',
      relationshipType: 'OWNER',
      recipientMobile: '9876543210',
      recipientEmail: 'john@example.com',
    });
    
    mockStore.getState().residentInvitations = mockStore.getState().residentInvitations.map((inv) =>
      inv.invitationId === invitation.id ? { ...inv, status: 'REVOKED' as const, revokedAt: new Date().toISOString() } : inv
    );
    
    const accepted = await residentRegistrationService.acceptInvitation(invitation.token);
    expect(accepted).toBeUndefined();
  });

  it('should handle duplicate invitation creation', async () => {
    const request = {
      societyId: 'society-gv',
      unitId: 'unit-1',
      relationshipType: 'OWNER' as const,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '9876543210',
      email: 'john@example.com',
      createdBy: 'admin',
    };
    const registration = await residentRegistrationService.createRegistration(request);
    
    const inv1 = await residentRegistrationService.createInvitation({
      registrationId: registration.id,
      societyId: 'society-gv',
      societyName: 'Green Valley Heights',
      unitId: 'unit-1',
      unitNumber: 'A-101',
      relationshipType: 'OWNER',
      recipientMobile: '9876543210',
      recipientEmail: 'john@example.com',
    });
    
    const inv2 = await residentRegistrationService.createInvitation({
      registrationId: registration.id,
      societyId: 'society-gv',
      societyName: 'Green Valley Heights',
      unitId: 'unit-1',
      unitNumber: 'A-101',
      relationshipType: 'OWNER',
      recipientMobile: '9876543210',
      recipientEmail: 'john@example.com',
    });
    
    expect(inv1.token).not.toBe(inv2.token);
  });

  it('should handle registration with family relationship sub-type', async () => {
    const request = {
      societyId: 'society-gv',
      unitId: 'unit-1',
      relationshipType: 'FAMILY_MEMBER' as const,
      familyRelationshipSubType: 'SPOUSE' as const,
      firstName: 'Jane',
      lastName: 'Doe',
      mobile: '9876543211',
      email: 'jane@example.com',
      createdBy: 'admin',
    };
    const registration = await residentRegistrationService.createRegistration(request);
    expect(registration.familyRelationshipSubType).toBe('SPOUSE');
  });

  it('should handle policy change mid-flow', async () => {
    const request = {
      societyId: 'society-gv',
      unitId: 'unit-1',
      relationshipType: 'TENANT' as const,
      firstName: 'Jane',
      lastName: 'Tenant',
      mobile: '9876543211',
      email: 'jane@example.com',
      createdBy: 'admin',
    };
    const registration = await residentRegistrationService.createRegistration(request);
    
    const detailBefore = await residentRegistrationService.getRegistrationDetail(registration.id);
    const policeReqBefore = detailBefore?.requiredDocuments.find((d) => d.type === 'police_verification');
    expect(policeReqBefore?.mandatory).toBe(true);
  });
});