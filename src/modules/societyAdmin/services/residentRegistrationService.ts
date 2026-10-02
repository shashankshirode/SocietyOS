import { mockStore } from '../../../core/mockStore/mockStore';
import type {
  ResidentRegistration,
  CreateResidentRegistrationRequest,
  UpdateResidentRegistrationRequest,
  ResidentRegistrationFilters,
  ResidentInvitation,
  CreateResidentInvitationRequest,
  DuplicateDetectionResult,
  ResidentRegistrationDetail,
  ResidentDocument,
  SubmitDocumentsRequest,
  DocumentRequirement,
  ResidentRegistrationStatus,
} from '../data/residentRegistration.types';
import type { Unit } from '../../societySetup/data/societyProperty.types';
import type { Absent } from '../../../shared/types/absence.types';

const withMockDelay = <T>(data: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getMockUnits(): Unit[] {
  return mockStore.getState().societyUnits as Unit[];
}

function getRequiredDocuments(relationshipType: string): DocumentRequirement[] {
  const baseRequirements: DocumentRequirement[] = [
    {
      type: 'identity_proof',
      label: 'Identity Proof (Aadhaar/PAN/Passport)',
      description: 'Government issued photo ID',
      mandatory: true,
      acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSizeMB: 5,
    },
    {
      type: 'address_proof',
      label: 'Address Proof',
      description: 'Recent utility bill or bank statement',
      mandatory: true,
      acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSizeMB: 5,
    },
  ];

  if (relationshipType === 'TENANT') {
    baseRequirements.push(
      {
        type: 'rent_agreement',
        label: 'Rent Agreement',
        description: 'Signed rental agreement with owner',
        mandatory: true,
        acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSizeMB: 10,
      },
      {
        type: 'police_verification',
        label: 'Police Verification',
        description: 'Police verification certificate',
        mandatory: true,
        acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSizeMB: 5,
      }
    );
  }

  if (relationshipType === 'OWNER' || relationshipType === 'CO_OWNER') {
    baseRequirements.push({
      type: 'ownership_proof',
      label: 'Ownership Proof',
      description: 'Sale deed or property tax receipt',
      mandatory: true,
      acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSizeMB: 10,
    });
  }

  return baseRequirements;
}

export const residentRegistrationService = {
  async checkDuplicate(
    societyId: string,
    mobile: string,
    email: string,
    excludeRegistrationId?: string
  ): Promise<DuplicateDetectionResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const existingMobile = registrations.find(
          (r) => r.societyId === societyId && r.mobile === mobile && r.id !== excludeRegistrationId
        );
        if (existingMobile) {
          resolve({
            hasDuplicate: true,
            duplicateField: 'mobile',
            existingRegistrationId: existingMobile.id,
            existingRegistrationName: `${existingMobile.firstName} ${existingMobile.lastName}`,
            message: `A registration with mobile ${mobile} already exists for ${existingMobile.firstName} ${existingMobile.lastName}`,
          });
          return;
        }

        const existingEmail = registrations.find(
          (r) => r.societyId === societyId && r.email === email && r.id !== excludeRegistrationId
        );
        if (existingEmail) {
          resolve({
            hasDuplicate: true,
            duplicateField: 'email',
            existingRegistrationId: existingEmail.id,
            existingRegistrationName: `${existingEmail.firstName} ${existingEmail.lastName}`,
            message: `A registration with email ${email} already exists for ${existingEmail.firstName} ${existingEmail.lastName}`,
          });
          return;
        }

        resolve({ hasDuplicate: false, message: 'No duplicate found' });
      }, 300);
    });
  },

  async createRegistration(
    request: CreateResidentRegistrationRequest
  ): Promise<ResidentRegistration> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const duplicate = mockStore
          .getState()
          .residentRegistrations?.find(
            (r) =>
              r.societyId === request.societyId &&
              (r.mobile === request.mobile || r.email === request.email)
          );
        if (duplicate) {
          reject(new Error('Duplicate mobile or email found'));
          return;
        }

        const unit = getMockUnits().find((u) => u.id === request.unitId);
        const now = new Date().toISOString();

        const registration: ResidentRegistration = {
          id: generateId('reg'),
          societyId: request.societyId,
          unitId: request.unitId,
          unitNumber: unit?.unitNumber || '',
          towerName: unit?.towerId
            ? getMockUnits().find((u) => u.id === request.unitId)?.towerId
            : undefined,
          wingName: unit?.wingId,
          floorNumber: unit?.floorId ? parseInt(unit.floorId.replace('floor-', '')) : undefined,
          relationshipType: request.relationshipType,
          familyRelationshipSubType: request.familyRelationshipSubType,
          firstName: request.firstName,
          lastName: request.lastName,
          mobile: request.mobile,
          email: request.email,
          status: 'INVITED',
          verificationStatus: 'PENDING',
          invitedAt: now,
          createdBy: request.createdBy,
          createdAt: now,
          updatedAt: now,
        };

        mockStore.getState().residentRegistrations?.push(registration);
        mockStore.notify();
        resolve(registration);
      }, 400);
    });
  },

  async getRegistrations(filters: ResidentRegistrationFilters): Promise<ResidentRegistration[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let registrations = mockStore.getState().residentRegistrations || [];
        registrations = registrations.filter((r) => r.societyId === filters.societyId);

        if (filters.status) {
          registrations = registrations.filter((r) => r.status === filters.status);
        }
        if (filters.unitId) {
          registrations = registrations.filter((r) => r.unitId === filters.unitId);
        }
        if (filters.relationshipType) {
          registrations = registrations.filter((r) => r.relationshipType === filters.relationshipType);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          registrations = registrations.filter(
            (r) =>
              `${r.firstName} ${r.lastName}`.toLowerCase().includes(search) ||
              r.mobile.includes(search) ||
              r.email.toLowerCase().includes(search) ||
              r.unitNumber.toLowerCase().includes(search)
          );
        }

        resolve(registrations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, 300);
    });
  },

  async getRegistrationById(id: string): Promise<ResidentRegistration | Absent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const registration = registrations.find((r) => r.id === id);
        resolve(registration);
      }, 300);
    });
  },

  async getRegistrationDetail(id: string): Promise<ResidentRegistrationDetail | Absent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const registration = registrations.find((r) => r.id === id);
        if (!registration) {
          resolve(undefined);
          return;
        }

        const documents = (mockStore.getState().residentDocuments || []).filter(
          (d) => d.registrationId === id
        );
        const invitation = (mockStore.getState().residentInvitations || []).find(
          (i) => i.registrationId === id
        );

        const detail: ResidentRegistrationDetail = {
          ...registration,
          invitation,
          documents,
          requiredDocuments: getRequiredDocuments(registration.relationshipType),
          unit: {
            id: registration.unitId,
            unitNumber: registration.unitNumber,
            towerName: registration.towerName,
            wingName: registration.wingName,
            floorNumber: registration.floorNumber,
          },
        };
        resolve(detail);
      }, 300);
    });
  },

  async updateRegistration(request: UpdateResidentRegistrationRequest): Promise<ResidentRegistration> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const index = registrations.findIndex((r) => r.id === request.id);
        if (index === -1) {
          reject(new Error('Registration not found'));
          return;
        }

        const duplicate = registrations.find(
          (r) =>
            r.id !== request.id &&
            r.societyId === registrations[index].societyId &&
            ((request.mobile && r.mobile === request.mobile) || (request.email && r.email === request.email))
        );
        if (duplicate) {
          reject(new Error('Duplicate mobile or email found'));
          return;
        }

        const updated = { ...registrations[index], ...request, updatedAt: new Date().toISOString() };
        mockStore.getState().residentRegistrations[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 400);
    });
  },

  async transitionStatus(
    id: string,
    newStatus: ResidentRegistrationStatus,
    additionalData?: Partial<ResidentRegistration>
  ): Promise<ResidentRegistration> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const index = registrations.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error('Registration not found'));
          return;
        }

        const current = registrations[index];
        if (!canTransition(current.status, newStatus)) {
          reject(new Error(`Invalid status transition from ${current.status} to ${newStatus}`));
          return;
        }

        const now = new Date().toISOString();
        const updates: Partial<ResidentRegistration> = { status: newStatus, updatedAt: now, ...additionalData };

        if (newStatus === 'REGISTERED') updates.registeredAt = now;
        if (newStatus === 'IDENTITY_VERIFIED') {
          updates.verificationStatus = 'VERIFIED';
          updates.verificationCompletedAt = now;
        }
        if (newStatus === 'DOCUMENTS_SUBMITTED') updates.documentsSubmittedAt = now;
        if (newStatus === 'ADMIN_REVIEW') updates.submittedForReviewAt = now;
        if (newStatus === 'APPROVED') updates.approvedAt = now;
        if (newStatus === 'REJECTED') updates.rejectedAt = now;
        if (newStatus === 'ACTIVE') updates.activatedAt = now;

        const updated = { ...current, ...updates };
        mockStore.getState().residentRegistrations[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 400);
    });
  },

  async createInvitation(request: CreateResidentInvitationRequest): Promise<ResidentInvitation> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitation: ResidentInvitation = {
          id: generateId('inv'),
          registrationId: request.registrationId,
          societyId: request.societyId,
          societyName: request.societyName,
          unitId: request.unitId,
          unitNumber: request.unitNumber,
          relationshipType: request.relationshipType,
          familyRelationshipSubType: request.familyRelationshipSubType,
          recipientMobile: request.recipientMobile,
          recipientEmail: request.recipientEmail,
          token: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        };

        mockStore.getState().residentInvitations?.push(invitation);
        mockStore.notify();
        resolve(invitation);
      }, 400);
    });
  },

  async getInvitationByToken(token: string): Promise<ResidentInvitation | Absent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations = mockStore.getState().residentInvitations || [];
        const invitation = invitations.find((i) => i.token === token);
        resolve(invitation);
      }, 300);
    });
  },

  async acceptInvitation(token: string): Promise<ResidentInvitation | Absent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations = mockStore.getState().residentInvitations || [];
        const index = invitations.findIndex((i) => i.token === token);
        if (index === -1) {
          resolve(undefined);
          return;
        }

        const invitation = invitations[index];
        if (invitation.status !== 'PENDING') {
          resolve(undefined);
          return;
        }

        if (new Date(invitation.expiresAt) < new Date()) {
          resolve(undefined);
          return;
        }

        const updated = { ...invitation, status: 'ACCEPTED' as const, acceptedAt: new Date().toISOString() };
        mockStore.getState().residentInvitations[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 400);
    });
  },

  async getRequiredDocuments(relationshipType: ResidentRelationshipType): Promise<DocumentRequirement[]> {
    return withMockDelay(getRequiredDocuments(relationshipType));
  },

  async submitDocuments(request: SubmitDocumentsRequest): Promise<ResidentDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const documents: ResidentDocument[] = request.documents.map((d) => ({
          id: generateId('doc'),
          registrationId: request.registrationId,
          type: d.type,
          fileName: d.fileName,
          fileSize: d.fileSize,
          mimeType: d.mimeType,
          status: 'SUBMITTED',
          uploadedAt: now,
          submittedAt: now,
          url: d.url,
        }));

        mockStore.getState().residentDocuments?.push(...documents);
        mockStore.notify();
        resolve(documents);
      }, 500);
    });
  },

  async getDocuments(registrationId: string): Promise<ResidentDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const documents = (mockStore.getState().residentDocuments || []).filter(
          (d) => d.registrationId === registrationId
        );
        resolve(documents);
      }, 300);
    });
  },

  async approveRegistration(id: string, adminId: string): Promise<ResidentRegistration> {
    return this.transitionStatus(id, 'APPROVED', { reviewedAt: new Date().toISOString() });
  },

  async rejectRegistration(id: string, adminId: string, reason: string): Promise<ResidentRegistration> {
    return this.transitionStatus(id, 'REJECTED', { reviewedAt: new Date().toISOString(), rejectionReason: reason });
  },

  async requestResubmission(id: string, adminId: string): Promise<ResidentRegistration> {
    return this.transitionStatus(id, 'RESUBMIT', { reviewedAt: new Date().toISOString() });
  },

  async activateRegistration(id: string): Promise<ResidentRegistration> {
    return this.transitionStatus(id, 'ACTIVE');
  },
};

function canTransition(from: ResidentRegistrationStatus, to: ResidentRegistrationStatus): boolean {
  const transitions: Record<ResidentRegistrationStatus, ResidentRegistrationStatus[]> = {
    INVITED: ['REGISTERED'],
    REGISTERED: ['IDENTITY_VERIFIED'],
    IDENTITY_VERIFIED: ['DOCUMENTS_SUBMITTED'],
    DOCUMENTS_SUBMITTED: ['ADMIN_REVIEW'],
    ADMIN_REVIEW: ['APPROVED', 'RESUBMIT', 'REJECTED'],
    APPROVED: ['ACTIVE'],
    RESUBMIT: ['DOCUMENTS_SUBMITTED'],
    REJECTED: ['DOCUMENTS_SUBMITTED'],
    ACTIVE: [],
  };
  return transitions[from]?.includes(to) ?? false;
}