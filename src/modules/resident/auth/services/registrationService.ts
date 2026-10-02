import { mockStore } from '../../../../core/mockStore/mockStore';
import type {
  ResidentRegistration,
  ResidentRegistrationDetail,
  RegistrationInvitation,
  RegistrationDocumentRequirement,
  RegistrationDocument,
  RegistrationRequirementResolution,
  RegistrationFilters,
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
  SubmitRegistrationRequest,
  ResubmitRegistrationRequest,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
  RequestResubmissionRequest,
  ActivateRegistrationRequest,
  WithdrawRegistrationRequest,
  DuplicateDetectionResult,
  RegistrationTimelineEvent,
  SocietyRegistrationPolicy,
  NormalizedContact,
} from '../data/registration.types';
import { canTransitionRegistration, REGISTRATION_STATUS_TRANSITIONS } from '../data/registration.types';
import { normalizeContact, detectDuplicateRegistration } from './identityNormalization';
import { resolveRequirements, getAllDocumentsForRelationship } from './requirementEngine';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import type { Absent } from '../../../../shared/types/absence.types';

const withMockDelay = <T>(data: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function getSocietyPolicy(societyId: string): SocietyRegistrationPolicy {
  return {
    societyId,
    openRegistrationEnabled: true,
    requiresAdminApproval: true,
    requiresOwnerConsentForTenant: true,
    requiresPoliceVerificationForTenant: true,
    allowedRelationshipTypes: ['OWNER', 'CO_OWNER', 'TENANT', 'FAMILY_MEMBER'],
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
}

function getMockUnits(): readonly { id: string; unitNumber: string; towerId?: string; wingId?: string; floorId?: string; occupancyStatus: string }[] {
  return mockStore.getState().societyUnits || [];
}

export const registrationService = {
  async checkDuplicate(
    societyId: string,
    mobile: string,
    email: string,
    countryCode: string,
    excludeRegistrationId?: string
  ): Promise<DuplicateDetectionResult> {
    return withMockDelay(
      (() => {
        const normalized = normalizeContact(mobile, countryCode as any, email);
        if (!normalized) {
          return { hasDuplicate: false, message: 'Invalid contact format', requiresManualReview: false };
        }
        const registrations = mockStore.getState().residentRegistrations || [];
        return detectDuplicateRegistration(normalized, registrations, societyId, excludeRegistrationId);
      })()
    );
  },

  async createRegistration(request: CreateRegistrationRequest): Promise<ResidentRegistration> {
    return withMockDelay(
      (() => {
        const normalized = normalizeContact(request.mobileNumber, request.countryCode, request.email);
        if (!normalized) {
          throw new Error('Invalid contact format');
        }

        const existingRegistrations = mockStore.getState().residentRegistrations || [];
        const duplicateCheck = detectDuplicateRegistration(normalized, existingRegistrations, request.societyId);
        if (duplicateCheck.hasDuplicate && !duplicateCheck.requiresManualReview) {
          throw new Error(duplicateCheck.message);
        }

        const unit = getMockUnits().find((u) => u.id === request.unitId);
        const policy = getSocietyPolicy(request.societyId);
        const requirements = getAllDocumentsForRelationship(
          request.societyId,
          request.unitId,
          request.claimedRelationship,
          policy
        );

        const now = nowIso();
        const registration: ResidentRegistration = {
          registrationId: generateId('reg'),
          userId: `user-${request.mobileNumber.slice(-4)}`,
          societyId: request.societyId,
          societyName: policy.societyId,
          unitId: request.unitId,
          unitNumber: unit?.unitNumber || '',
          towerName: unit?.towerId,
          wingName: unit?.wingId,
          floorNumber: unit?.floorId ? parseInt(unit.floorId.replace('floor-', '')) : undefined,
          claimedRelationship: request.claimedRelationship,
          familyRelationshipSubType: request.familyRelationshipSubType,
          entryMode: request.entryMode,
          profile: {
            fullName: request.fullName,
            email: request.email,
          },
          verifiedContact: normalized,
          status: 'REGISTERED',
          verificationStatus: 'PENDING',
          registeredAt: now,
          createdAt: now,
          updatedAt: now,
          dataVersion: 1,
        };

        const state = mockStore.getState();
        state.residentRegistrations = [...(state.residentRegistrations || []), registration];
        state.registrationRequirements = [...(state.registrationRequirements || []), ...requirements];
        mockStore.notify();

        return registration;
      })()
    );
  },

  async getRegistrations(filters: RegistrationFilters): Promise<ResidentRegistration[]> {
    return withMockDelay(
      (() => {
        let registrations = mockStore.getState().residentRegistrations || [];
        registrations = registrations.filter((r) => r.societyId === filters.societyId);

        if (filters.status) {
          registrations = registrations.filter((r) => r.status === filters.status);
        }
        if (filters.unitId) {
          registrations = registrations.filter((r) => r.unitId === filters.unitId);
        }
        if (filters.relationshipType) {
          registrations = registrations.filter((r) => r.claimedRelationship === filters.relationshipType);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          registrations = registrations.filter(
            (r) =>
              r.profile.fullName.toLowerCase().includes(search) ||
              r.verifiedContact.mobileNumber.includes(search) ||
              r.verifiedContact.email.toLowerCase().includes(search) ||
              r.unitNumber.toLowerCase().includes(search)
          );
        }

        return registrations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })()
    );
  },

  async getRegistrationById(id: string): Promise<ResidentRegistration | Absent> {
    return withMockDelay(
      (() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        return registrations.find((r) => r.registrationId === id);
      })()
    );
  },

  async getRegistrationDetail(id: string): Promise<ResidentRegistrationDetail | Absent> {
    return withMockDelay(
      (() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const registration = registrations.find((r) => r.registrationId === id);
        if (!registration) return undefined;

        const documents = (mockStore.getState().registrationDocuments || []).filter(
          (d) => d.registrationId === id
        );
        const invitation = (mockStore.getState().registrationInvitations || []).find(
          (i) => i.registrationId === id
        );
        const requirements = (mockStore.getState().registrationRequirements || []).filter(
          (r) => r.registrationId === id || (r.societyId === registration.societyId && r.unitId === registration.unitId && r.relationshipType === registration.claimedRelationship)
        );
        const timeline = (mockStore.getState().registrationTimeline || []).filter(
          (t) => t.registrationId === id
        );

        return {
          ...registration,
          invitation,
          documents,
          requirements,
          unit: {
            id: registration.unitId,
            unitNumber: registration.unitNumber,
            towerName: registration.towerName,
            wingName: registration.wingName,
            floorNumber: registration.floorNumber,
            occupancyStatus: 'VACANT',
          },
          timeline: timeline.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()),
        };
      })()
    );
  },

  async updateRegistration(request: UpdateRegistrationRequest): Promise<ResidentRegistration> {
    return withMockDelay(
      (() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const index = registrations.findIndex((r) => r.registrationId === request.registrationId);
        if (index === -1) throw new Error('Registration not found');

        const current = registrations[index];
        
        if (request.profile?.email || request.profile?.fullName) {
          const normalized = normalizeContact(
            current.verifiedContact.mobileNumber,
            current.verifiedContact.countryCode,
            request.profile.email || current.verifiedContact.email
          );
          if (!normalized) throw new Error('Invalid contact format');

          const duplicateCheck = detectDuplicateRegistration(
            normalized,
            registrations,
            current.societyId,
            request.registrationId
          );
          if (duplicateCheck.hasDuplicate && !duplicateCheck.requiresManualReview) {
            throw new Error(duplicateCheck.message);
          }
        }

        const updated: ResidentRegistration = {
          ...current,
          ...request,
          profile: { ...current.profile, ...request.profile },
          verifiedContact: request.profile?.email
            ? normalizeContact(current.verifiedContact.mobileNumber, current.verifiedContact.countryCode, request.profile.email) || current.verifiedContact
            : current.verifiedContact,
          claimedRelationship: request.claimedRelationship ?? current.claimedRelationship,
          familyRelationshipSubType: request.familyRelationshipSubType ?? current.familyRelationshipSubType,
          updatedAt: nowIso(),
          dataVersion: current.dataVersion + 1,
        };

        mockStore.getState().residentRegistrations[index] = updated;
        mockStore.notify();
        return updated;
      })()
    );
  },

  async transitionStatus(
    registrationId: string,
    newStatus: ResidentRegistration['status'],
    additionalData?: Partial<ResidentRegistration>
  ): Promise<ResidentRegistration> {
    return withMockDelay(
      (() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const index = registrations.findIndex((r) => r.registrationId === registrationId);
        if (index === -1) throw new Error('Registration not found');

        const current = registrations[index];
        if (!canTransitionRegistration(current.status, newStatus)) {
          throw new Error(`Invalid status transition from ${current.status} to ${newStatus}`);
        }

        const updates: Partial<ResidentRegistration> = { status: newStatus, updatedAt: nowIso(), dataVersion: current.dataVersion + 1, ...additionalData };

        if (newStatus === 'IDENTITY_VERIFIED') {
          updates.verificationStatus = 'VERIFIED';
          updates.verificationCompletedAt = nowIso();
          updates.identityVerifiedAt = nowIso();
        }
        if (newStatus === 'DOCUMENTS_SUBMITTED') updates.documentsSubmittedAt = nowIso();
        if (newStatus === 'ADMIN_REVIEW') updates.submittedForReviewAt = nowIso();
        if (newStatus === 'APPROVED') updates.approvedAt = nowIso();
        if (newStatus === 'REJECTED') {
          updates.rejectedAt = nowIso();
          updates.rejectionReason = additionalData?.rejectionReason;
        }
        if (newStatus === 'ACTIVE') updates.activatedAt = nowIso();

        const updated = { ...current, ...updates };
        mockStore.getState().residentRegistrations[index] = updated;
        mockStore.notify();
        return updated;
      })()
    );
  },

  async submitRegistration(request: SubmitRegistrationRequest): Promise<ResidentRegistration> {
    return this.transitionStatus(request.registrationId, 'DOCUMENTS_SUBMITTED', {
      submittedForReviewAt: nowIso(),
    });
  },

  async requestResubmission(request: ResubmitRegistrationRequest): Promise<ResidentRegistration> {
    return this.transitionStatus(request.registrationId, 'RESUBMIT');
  },

  async approveRegistration(request: ApproveRegistrationRequest): Promise<ResidentRegistration> {
    const registration = await this.transitionStatus(request.registrationId, 'APPROVED', {
      reviewedAt: nowIso(),
    });
    return this.transitionStatus(request.registrationId, 'ACTIVE');
  },

  async rejectRegistration(request: RejectRegistrationRequest): Promise<ResidentRegistration> {
    return this.transitionStatus(request.registrationId, 'REJECTED', {
      reviewedAt: nowIso(),
      rejectionReason: request.reason,
    });
  },

  async requestResubmissionAdmin(request: RequestResubmissionRequest): Promise<ResidentRegistration> {
    return this.transitionStatus(request.registrationId, 'RESUBMIT', {
      reviewedAt: nowIso(),
    });
  },

  async activateRegistration(request: ActivateRegistrationRequest): Promise<ResidentRegistration> {
    return this.transitionStatus(request.registrationId, 'ACTIVE');
  },

  async withdrawRegistration(request: WithdrawRegistrationRequest): Promise<ResidentRegistration> {
    return this.transitionStatus(request.registrationId, 'REJECTED', {
      rejectionReason: {
        code: 'OTHER',
        residentVisibleReason: request.reason || 'Request withdrawn by applicant',
      },
    });
  },

  async createInvitation(request: {
    registrationId: string;
    societyId: string;
    societyName: string;
    unitId: string;
    unitNumber: string;
    towerName?: string;
    wingName?: string;
    floorNumber?: number;
    claimedRelationship: ClaimedRelationshipType;
    familyRelationshipSubType?: FamilyRelationshipSubType;
    recipientMobile: string;
    recipientEmail: string;
  }): Promise<RegistrationInvitation> {
    return withMockDelay(
      (() => {
        const now = nowIso();
        const invitation: RegistrationInvitation = {
          invitationId: generateId('inv'),
          registrationId: request.registrationId,
          societyId: request.societyId,
          societyName: request.societyName,
          unitId: request.unitId,
          unitNumber: request.unitNumber,
          towerName: request.towerName,
          wingName: request.wingName,
          floorNumber: request.floorNumber,
          claimedRelationship: request.claimedRelationship,
          familyRelationshipSubType: request.familyRelationshipSubType,
          recipientMobile: request.recipientMobile,
          recipientEmail: request.recipientEmail,
          token: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
        };

        mockStore.getState().registrationInvitations = [...(mockStore.getState().registrationInvitations || []), invitation];
        mockStore.notify();
        return invitation;
      })()
    );
  },

  async getInvitationByToken(token: string): Promise<RegistrationInvitation | Absent> {
    return withMockDelay(
      (() => {
        const invitations = mockStore.getState().registrationInvitations || [];
        return invitations.find((i) => i.token === token);
      })()
    );
  },

  async acceptInvitation(token: string): Promise<RegistrationInvitation | Absent> {
    return withMockDelay(
      (() => {
        const invitations = mockStore.getState().registrationInvitations || [];
        const index = invitations.findIndex((i) => i.token === token);
        if (index === -1) return undefined;

        const invitation = invitations[index];
        if (invitation.status !== 'PENDING') return undefined;

        if (new Date(invitation.expiresAt) < new Date()) {
          return undefined;
        }

        const updated = { ...invitation, status: 'ACCEPTED' as const, acceptedAt: nowIso() };
        mockStore.getState().registrationInvitations[index] = updated;
        mockStore.notify();
        return updated;
      })()
    );
  },

  async getRequirements(
    societyId: string,
    unitId: string,
    relationshipType: ClaimedRelationshipType,
    existingDocuments: readonly { requirementId: string; status: string }[] = []
  ): Promise<RegistrationRequirementResolution> {
    return withMockDelay(
      resolveRequirements(getSocietyPolicy(societyId), relationshipType, unitId, existingDocuments)
    );
  },

  async uploadDocument(
    registrationId: string,
    requirementId: string,
    file: { fileName: string; fileSize: number; mimeType: string; uri: string },
    idempotencyKey: string
  ): Promise<RegistrationDocument> {
    return withMockDelay(
      (() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        const registration = registrations.find((r) => r.registrationId === registrationId);
        if (!registration) throw new Error('Registration not found');

        const requirements = mockStore.getState().registrationRequirements || [];
        const requirement = requirements.find((r) => r.requirementId === requirementId);
        if (!requirement) throw new Error('Requirement not found');

        const documents = mockStore.getState().registrationDocuments || [];
        const existingVersion = documents.filter((d) => d.requirementId === requirementId).sort((a, b) => b.version - a.version)[0];
        const version = (existingVersion?.version || 0) + 1;
        const previousVersionId = existingVersion?.documentId;

        const checksum = `${file.fileName.toLowerCase()}-${file.fileSize}`;

        const document: RegistrationDocument = {
          documentId: generateId('doc'),
          registrationId,
          requirementId,
          documentType: requirement.documentType,
          fileName: file.fileName,
          fileSize: file.fileSize,
          mimeType: file.mimeType as any,
          status: 'UPLOADED',
          uploadedAt: nowIso(),
          checksum,
          version,
          previousVersionId,
          storageReference: `mock://documents/${registrationId}/${requirementId}/${generateId('file')}`,
        };

        mockStore.getState().registrationDocuments = [...documents, document];
        mockStore.notify();
        return document;
      })()
    );
  },

  async submitDocument(registrationId: string, requirementId: string): Promise<RegistrationDocument> {
    return withMockDelay(
      (() => {
        const documents = mockStore.getState().registrationDocuments || [];
        const index = documents.findIndex((d) => d.registrationId === registrationId && d.requirementId === requirementId);
        if (index === -1) throw new Error('Document not found');

        const updated = { ...documents[index], status: 'SUBMITTED' as const, submittedAt: nowIso() };
        mockStore.getState().registrationDocuments[index] = updated;
        mockStore.notify();
        return updated;
      })()
    );
  },

  async replaceDocument(
    registrationId: string,
    requirementId: string,
    file: { fileName: string; fileSize: number; mimeType: string; uri: string },
    idempotencyKey: string
  ): Promise<RegistrationDocument> {
    return withMockDelay(
      (() => {
        const documents = mockStore.getState().registrationDocuments || [];
        const existingVersions = documents.filter((d) => d.registrationId === registrationId && d.requirementId === requirementId);
        const latestVersion = existingVersions.sort((a, b) => b.version - a.version)[0];
        
        const requirement = (mockStore.getState().registrationRequirements || []).find((r) => r.requirementId === requirementId);
        if (!requirement) throw new Error('Requirement not found');

        const checksum = `${file.fileName.toLowerCase()}-${file.fileSize}`;
        const version = (latestVersion?.version || 0) + 1;

        const document: RegistrationDocument = {
          documentId: generateId('doc'),
          registrationId,
          requirementId,
          documentType: requirement.documentType,
          fileName: file.fileName,
          fileSize: file.fileSize,
          mimeType: file.mimeType as any,
          status: 'UPLOADED',
          uploadedAt: nowIso(),
          checksum,
          version,
          previousVersionId: latestVersion?.documentId,
          storageReference: `mock://documents/${registrationId}/${requirementId}/${generateId('file')}`,
        };

        mockStore.getState().registrationDocuments = [...documents, document];
        mockStore.notify();
        return document;
      })()
    );
  },

  async getDocuments(registrationId: string): Promise<RegistrationDocument[]> {
    return withMockDelay(
      (() => {
        const documents = mockStore.getState().registrationDocuments || [];
        return documents.filter((d) => d.registrationId === registrationId);
      })()
    );
  },

  async getTimeline(registrationId: string): Promise<RegistrationTimelineEvent[]> {
    return withMockDelay(
      (() => {
        const timeline = mockStore.getState().registrationTimeline || [];
        return timeline
          .filter((t) => t.registrationId === registrationId)
          .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
      })()
    );
  },

  async addTimelineEvent(event: Omit<RegistrationTimelineEvent, 'eventId'>): Promise<RegistrationTimelineEvent> {
    return withMockDelay(
      (() => {
        const timeline = mockStore.getState().registrationTimeline || [];
        const newEvent: RegistrationTimelineEvent = {
          ...event,
          eventId: generateId('evt'),
        };
        mockStore.getState().registrationTimeline = [...timeline, newEvent];
        mockStore.notify();
        return newEvent;
      })()
    );
  },

  async getUnitsForSociety(societyId: string): Promise<readonly { id: string; unitNumber: string; towerId?: string; wingId?: string; floorId?: string; occupancyStatus: string }[]> {
    return withMockDelay(getMockUnits().filter((u) => u.societyId === societyId));
  },

  async getDuplicateRegistrations(
    societyId: string,
    mobile: string,
    email: string
  ): Promise<ResidentRegistration[]> {
    return withMockDelay(
      (() => {
        const registrations = mockStore.getState().residentRegistrations || [];
        return registrations.filter(
          (r) => r.societyId === societyId && (r.verifiedContact.mobileNumber === mobile || r.verifiedContact.email === email)
        );
      })()
    );
  },
};