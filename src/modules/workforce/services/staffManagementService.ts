import { mockStore } from '../../../core/mockStore/mockStore';
import type {
    StaffProfile,
    StaffDocument,
    StaffAssignment,
    StaffVerificationRecord,
    StaffExitRecord,
    StaffOnboardingRecord,
    StaffTransferRecord,
    StaffSuspensionRecord,
    StaffPerformanceRecord,
    StaffStatus,
    StaffEmploymentType,
    StaffCategory,
    StaffEmploymentStatus,
    StaffVerificationStatus,
    RegisterStaffInput,
    ShiftAssignmentInput,
} from '../../../shared/types/workforcePhase11.types';
import type { StaffMember } from '../../../shared/types/staff.types';
import type { JsonObject } from '../../../core/api/api.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { canTransitionStaffStatus, isStaffStatusActive } from '../../../shared/types/workforcePhase11.types';

function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function toStaffProfile(member: StaffMember): StaffProfile {
    return {
        id: member.id,
        staffCode: member.staffCode || '',
        name: member.name,
        category: (member.category as StaffCategory) || 'OTHER',
        employmentType: (member.employmentType as StaffEmploymentType) || 'DIRECT_EMPLOYEE',
        employmentStatus: (member.employmentStatus as StaffStatus) || 'ACTIVE',
        verificationStatus: (typeof member.verificationStatus === 'string' && member.verificationStatus.length > 0 ? member.verificationStatus : 'NOT_STARTED') as StaffVerificationStatus,
        societyId: member.societyId || '',
        mobile: member.mobile || member.phone || '',
        assignedLocation: member.assignedLocation || '',
        assignedAreas: member.assignedAreas || [],
        joiningDate: member.joiningDate || new Date().toISOString(),
        effectiveFrom: member.effectiveFrom || member.joiningDate || new Date().toISOString(),
        documents: member.documents || [],
        assignments: member.assignments || [],
        createdAt: member.createdAt || new Date().toISOString(),
        updatedAt: member.updatedAt || new Date().toISOString(),
        createdBy: member.createdBy || 'SYSTEM',
        ...(member.vendorId ? { vendorId: member.vendorId } : {}),
        ...(member.vendorName ? { vendorName: member.vendorName } : {}),
        ...(member.emergencyContact ? { emergencyContact: member.emergencyContact } : {}),
        ...(member.shiftId ? { shiftId: member.shiftId } : {}),
        ...(member.shiftName ? { shiftName: member.shiftName } : {}),
        ...(member.effectiveTo ? { effectiveTo: member.effectiveTo } : {}),
        ...(member.exitDate ? { exitDate: member.exitDate } : {}),
        ...(member.verificationExpiryDate ? { verificationExpiryDate: member.verificationExpiryDate } : {}),
        ...(member.biometricEmployeeCode ? { biometricEmployeeCode: member.biometricEmployeeCode } : {}),
        ...(member.biometricDeviceId ? { biometricDeviceId: member.biometricDeviceId } : {}),
        ...(member.verificationRecord ? { verificationRecord: member.verificationRecord } : {}),
        ...(member.homeContextId ? { homeContextId: member.homeContextId } : {}),
        ...(member.unitId ? { unitId: member.unitId } : {}),
        ...(member.dataScopeKey ? { dataScopeKey: member.dataScopeKey } : {}),
    };
}

export const staffManagementService = {
    async registerStaff(input: RegisterStaffInput, createdBy: string, societyId: string): Promise<StaffProfile> {
        const existing = mockStore.getState().staff?.find(s => s.staffCode === input.staffCode);
        if (existing) {
            throw new Error('Staff code already exists');
        }
        const now = new Date().toISOString();
        const staff: StaffProfile = {
            id: generateId('staff'),
            staffCode: input.staffCode,
            name: input.name,
            category: input.category,
            employmentType: 'DIRECT_EMPLOYEE',
            employmentStatus: 'INVITED',
            verificationStatus: 'NOT_STARTED',
            societyId,
            mobile: input.mobile,
            assignedLocation: input.assignedLocation,
            assignedAreas: [],
            joiningDate: input.joiningDate,
            effectiveFrom: input.joiningDate,
            documents: [],
            assignments: [],
            createdAt: now,
            updatedAt: now,
            createdBy,
            metadata: {},
            ...(input.emergencyContact ? { emergencyContact: input.emergencyContact } : {}),
            ...(input.shiftId ? { shiftId: input.shiftId } : {}),
        };
        const staffList = mockStore.getState().staff;
        if (staffList) {
            staffList.push(staff);
        } else {
            mockStore.getState().staff = [staff];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId,
            action: 'STAFF_REGISTERED',
            entityType: 'STAFF_PROFILE',
            entityId: staff.id,
            newState: { staffCode: staff.staffCode, name: staff.name, category: staff.category },
            idempotencyKey: createIdempotencyKey(`staff_register_${staff.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return staff;
    },

    async getStaff(staffId: string): Promise<StaffProfile | null> {
        const s = mockStore.getState().staff?.find(item => item.id === staffId);
        return s ? toStaffProfile(s) : null;
    },

    async getStaffList(filters: {
        societyId?: string;
        status?: StaffStatus;
        category?: StaffCategory;
        employmentType?: string;
        vendorId?: string;
    }): Promise<StaffProfile[]> {
        let staff = mockStore.getState().staff || [];
        if (filters.societyId) {
            staff = staff.filter(s => s.societyId === filters.societyId);
        }
        if (filters.status) {
            staff = staff.filter(s => s.employmentStatus === filters.status);
        }
        if (filters.category) {
            staff = staff.filter(s => s.category === filters.category);
        }
        if (filters.employmentType) {
            staff = staff.filter(s => s.employmentType === filters.employmentType);
        }
        if (filters.vendorId) {
            staff = staff.filter(s => s.vendorId === filters.vendorId);
        }
        return staff.map(toStaffProfile);
    },

    async updateStaff(staffId: string, updates: Partial<StaffProfile>, updatedBy: string): Promise<StaffProfile | null> {
        const staffList = mockStore.getState().staff;
        if (!staffList) return null;
        const index = staffList.findIndex(s => s.id === staffId);
        if (index === -1) return null;
        const current = staffList[index];
        if (!current) return null;

        const profile = toStaffProfile(current);
        const updated: StaffProfile = {
            ...profile,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        staffList[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: updatedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: current.societyId ?? '',
            action: 'STAFF_UPDATED',
            entityType: 'STAFF_PROFILE',
            entityId: staffId,
            newState: { staffId, updatedBy },
            idempotencyKey: createIdempotencyKey(`staff_update_${staffId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async transitionStaffStatus(staffId: string, newStatus: StaffStatus, actorId: string, reason?: string): Promise<StaffProfile | null> {
        const staffList = mockStore.getState().staff;
        if (!staffList) return null;
        const index = staffList.findIndex(s => s.id === staffId);
        if (index === -1) return null;
        const staff = staffList[index];
        if (!staff) return null;

        const currentStatus = (staff.employmentStatus as StaffStatus) || 'ACTIVE';
        if (!canTransitionStaffStatus(currentStatus, newStatus)) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
        const now = new Date().toISOString();
        const profile = toStaffProfile(staff);
        const updated: StaffProfile = {
            ...profile,
            employmentStatus: newStatus,
            updatedAt: now,
            ...(newStatus === 'EXITED' ? { exitDate: now } : {}),
        };
        staffList[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: actorId,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_UPDATED',
            entityType: 'STAFF_PROFILE',
            entityId: staffId,
            previousState: { status: staff.employmentStatus || 'ACTIVE' },
            newState: { status: newStatus, ...(reason ? { reason } : {}) },
            idempotencyKey: createIdempotencyKey(`staff_status_${staff.id}_${newStatus}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async uploadDocument(
        staffId: string,
        document: Omit<StaffDocument, 'id' | 'staffId' | 'uploadedAt' | 'status'>,
        uploadedBy: string
    ): Promise<StaffDocument> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');

        if (!staff.documents) {
            staff.documents = [];
        }

        const documentRecord: StaffDocument = {
            id: generateId('doc'),
            staffId,
            ...document,
            status: 'PENDING',
            uploadedAt: new Date().toISOString(),
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
        };
        staff.documents.push(documentRecord);
        mockStore.notify();

        createAuditEntry({
            actorUserId: uploadedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_DOCUMENT_UPLOADED',
            entityType: 'STAFF_DOCUMENT',
            entityId: documentRecord.id,
            newState: { staffId, documentType: document.type, status: 'PENDING' },
            idempotencyKey: createIdempotencyKey(`staff_doc_${documentRecord.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return documentRecord;
    },

    async verifyDocument(
        staffId: string,
        documentId: string,
        verifiedBy: string,
        status: 'VERIFIED' | 'REJECTED',
        rejectionReason?: string
    ): Promise<StaffDocument | null> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff || !staff.documents) return null;
        const docIndex = staff.documents.findIndex(d => d.id === documentId);
        if (docIndex === -1) return null;
        const currentDoc = staff.documents[docIndex];
        if (!currentDoc) return null;

        const now = new Date().toISOString();
        const updatedDoc: StaffDocument = {
            ...currentDoc,
            status: status === 'VERIFIED' ? 'VALID' : 'REJECTED',
            verifiedAt: now,
            verifiedBy,
            ...(rejectionReason ? { notes: rejectionReason } : {}),
        };
        staff.documents[docIndex] = updatedDoc;
        mockStore.notify();

        createAuditEntry({
            actorUserId: verifiedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: status === 'VERIFIED' ? 'STAFF_DOCUMENT_VERIFIED' : 'STAFF_UPDATED',
            entityType: 'STAFF_DOCUMENT',
            entityId: documentId,
            previousState: { status: currentDoc.status },
            newState: { status: updatedDoc.status, ...(rejectionReason ? { rejectionReason } : {}) },
            idempotencyKey: createIdempotencyKey(`staff_doc_${documentId}_${status}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updatedDoc;
    },

    async submitVerification(staffId: string, submittedBy: string): Promise<StaffVerificationRecord> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');
        if (!staff.documents) staff.documents = [];

        const now = new Date().toISOString();
        const verification: StaffVerificationRecord = {
            id: generateId('ver'),
            staffId,
            status: 'SUBMITTED',
            submittedAt: now,
            documentsVerified: staff.documents.filter(d => d.status === 'VALID').map(d => d.id),
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
        };
        staff.verificationStatus = 'PENDING';
        staff.verificationRecord = verification;
        mockStore.notify();

        createAuditEntry({
            actorUserId: submittedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_VERIFICATION_SUBMITTED',
            entityType: 'STAFF_VERIFICATION',
            entityId: verification.id,
            newState: { status: 'SUBMITTED' },
            idempotencyKey: createIdempotencyKey(`staff_verification_${verification.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return verification;
    },

    async verifyStaff(
        staffId: string,
        verifiedBy: string,
        documentsVerified: string[],
        rejectionReason?: string
    ): Promise<StaffVerificationRecord | null> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) return null;

        const now = new Date().toISOString();
        const approved = !rejectionReason;
        const verification: StaffVerificationRecord = {
            id: generateId('ver'),
            staffId,
            status: approved ? 'VERIFIED' : 'REJECTED',
            submittedAt: staff.verificationRecord?.submittedAt || now,
            reviewedAt: now,
            reviewedBy: verifiedBy,
            documentsVerified,
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
            ...(rejectionReason ? { rejectionReason } : {}),
        };
        staff.verificationStatus = approved ? 'VERIFIED' : 'REJECTED';
        if (approved) {
            staff.employmentStatus = 'ACTIVE';
        }
        staff.verificationRecord = verification;
        mockStore.notify();

        createAuditEntry({
            actorUserId: verifiedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: approved ? 'STAFF_VERIFICATION_APPROVED' : 'STAFF_UPDATED',
            entityType: 'STAFF_VERIFICATION',
            entityId: verification.id,
            previousState: { status: 'PENDING' },
            newState: { status: verification.status, ...(rejectionReason ? { rejectionReason } : {}) },
            idempotencyKey: createIdempotencyKey(`staff_verification_${verification.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return verification;
    },

    async assignStaff(staffId: string, input: ShiftAssignmentInput, assignedBy: string): Promise<StaffAssignment> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');
        if (!staff.assignments) staff.assignments = [];

        const assignment: StaffAssignment = {
            id: generateId('assign'),
            staffId,
            type: 'SHIFT',
            referenceId: input.shiftId,
            referenceName: '',
            effectiveFrom: input.effectiveFrom,
            isPrimary: true,
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
            ...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
            ...(input.notes ? { notes: input.notes } : {}),
        };
        staff.assignments.push(assignment);
        staff.shiftId = input.shiftId;
        staff.assignedLocation = input.location;
        staff.assignedAreas = [input.location];
        mockStore.notify();

        createAuditEntry({
            actorUserId: assignedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_ASSIGNED',
            entityType: 'STAFF_ASSIGNMENT',
            entityId: assignment.id,
            newState: { shiftId: input.shiftId, location: input.location },
            idempotencyKey: createIdempotencyKey(`staff_assign_${staffId}_${input.shiftId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return assignment;
    },

    async transferStaff(
        staffId: string,
        input: Omit<StaffTransferRecord, 'id' | 'staffId' | 'societyId' | 'createdAt' | 'updatedAt'>,
        approvedBy: string
    ): Promise<StaffTransferRecord> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');

        const transfer: StaffTransferRecord = {
            id: generateId('transfer'),
            staffId,
            ...input,
            approvedAt: new Date().toISOString(),
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
        };
        if (input.toAssignmentId && staff.assignments) {
            const newAssignment = staff.assignments.find(a => a.id === input.toAssignmentId);
            if (newAssignment) {
                newAssignment.effectiveFrom = input.effectiveFrom;
                newAssignment.isPrimary = true;
            }
        }
        if (input.toLocation) {
            staff.assignedLocation = input.toLocation;
        }
        if (input.toShiftId) {
            staff.shiftId = input.toShiftId;
        }

        const transfers = mockStore.getState().staffTransfers;
        if (transfers) {
            transfers.push(transfer);
        } else {
            mockStore.getState().staffTransfers = [transfer];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_TRANSFERRED',
            entityType: 'STAFF_TRANSFER',
            entityId: transfer.id,
            newState: { fromLocation: input.fromLocation, toLocation: input.toLocation, reason: input.reason },
            idempotencyKey: createIdempotencyKey(`staff_transfer_${staffId}_${transfer.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return transfer;
    },

    async suspendStaff(
        staffId: string,
        input: Omit<StaffSuspensionRecord, 'id' | 'staffId' | 'societyId' | 'createdAt' | 'updatedAt'>,
        suspendedBy: string
    ): Promise<StaffSuspensionRecord> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');
        const currentStatus = (staff.employmentStatus as StaffStatus) || 'ACTIVE';
        if (!isStaffStatusActive(currentStatus)) {
            throw new Error('Cannot suspend inactive staff');
        }

        const suspension: StaffSuspensionRecord = {
            id: generateId('susp'),
            staffId,
            ...input,
            suspendedAt: new Date().toISOString(),
            suspendedBy,
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
        };

        staff.employmentStatus = 'SUSPENDED';
        staff.updatedAt = new Date().toISOString();

        const suspensions = mockStore.getState().staffSuspensions;
        if (suspensions) {
            suspensions.push(suspension);
        } else {
            mockStore.getState().staffSuspensions = [suspension];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: suspendedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_SUSPENDED',
            entityType: 'STAFF_SUSPENSION',
            entityId: suspension.id,
            newState: { reason: input.reason },
            idempotencyKey: createIdempotencyKey(`staff_suspend_${staffId}_${suspension.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return suspension;
    },

    async liftSuspension(staffId: string, liftedBy: string, notes?: string): Promise<StaffSuspensionRecord | null> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) return null;
        if (staff.employmentStatus !== 'SUSPENDED') {
            throw new Error('Staff is not suspended');
        }

        const suspension = mockStore.getState().staffSuspensions?.find(s => s.staffId === staffId && s.status === 'ACTIVE');
        if (!suspension) return null;

        const now = new Date().toISOString();
        suspension.status = 'LIFTED';
        suspension.reactivatedAt = now;
        suspension.reactivatedBy = liftedBy;
        if (notes) {
            suspension.reactivationReason = notes;
        }

        staff.employmentStatus = 'ACTIVE';
        staff.updatedAt = now;
        mockStore.notify();

        createAuditEntry({
            actorUserId: liftedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_REACTIVATED',
            entityType: 'STAFF_SUSPENSION',
            entityId: suspension.id,
            newState: { status: 'LIFTED', reactivatedAt: now },
            idempotencyKey: createIdempotencyKey(`staff_lift_susp_${suspension.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return suspension;
    },

    async getSuspensionHistory(staffId: string): Promise<StaffSuspensionRecord[]> {
        return mockStore.getState().staffSuspensions?.filter(s => s.staffId === staffId) || [];
    },

    async getActiveSuspension(staffId: string): Promise<StaffSuspensionRecord | null> {
        const suspension = mockStore.getState().staffSuspensions?.find(s => s.staffId === staffId && s.status === 'ACTIVE');
        return suspension || null;
    },

    async requestExit(
        staffId: string,
        input: Omit<StaffExitRecord, 'id' | 'staffId' | 'societyId' | 'createdAt' | 'updatedAt'>,
        requestedBy: string
    ): Promise<StaffExitRecord> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');

        const exit: StaffExitRecord = {
            id: generateId('exit'),
            staffId,
            ...input,
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
        };

        staff.employmentStatus = 'EXIT_REQUESTED';
        staff.updatedAt = new Date().toISOString();

        const exits = mockStore.getState().staffExits;
        if (exits) {
            exits.push(exit);
        } else {
            mockStore.getState().staffExits = [exit];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: requestedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_EXIT_REQUESTED',
            entityType: 'STAFF_EXIT',
            entityId: exit.id,
            newState: { exitDate: input.exitDate, reason: input.reason },
            idempotencyKey: createIdempotencyKey(`staff_exit_${staffId}_${exit.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return exit;
    },

    async completeExit(staffId: string, completedBy: string): Promise<StaffExitRecord | null> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) return null;
        const exit = mockStore.getState().staffExits?.find(e => e.staffId === staffId && e.clearanceStatus !== 'COMPLETED');
        if (!exit) return null;

        const now = new Date().toISOString();
        const updatedExit: StaffExitRecord = {
            ...exit,
            clearanceStatus: 'COMPLETED',
            clearanceCompletedAt: now,
            clearanceCompletedBy: completedBy,
            accessRevoked: true,
            accessRevokedAt: now,
        };

        staff.employmentStatus = 'EXITED';
        staff.exitDate = now;
        staff.updatedAt = now;

        const exits = mockStore.getState().staffExits;
        if (exits) {
            const exitIndex = exits.findIndex(e => e.id === exit.id);
            if (exitIndex !== -1) {
                exits[exitIndex] = updatedExit;
            }
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: completedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_EXIT_COMPLETED',
            entityType: 'STAFF_EXIT',
            entityId: exit.id,
            previousState: { clearanceStatus: exit.clearanceStatus },
            newState: { clearanceStatus: 'COMPLETED', accessRevoked: true },
            idempotencyKey: createIdempotencyKey(`staff_exit_complete_${exit.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updatedExit;
    },

    async createOnboardingRecord(
        staffId: string,
        step: StaffOnboardingRecord['step'],
        completedBy: string
    ): Promise<StaffOnboardingRecord> {
        const staff = mockStore.getState().staff?.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');

        const record: StaffOnboardingRecord = {
            id: generateId('onboard'),
            staffId,
            step,
            completedAt: new Date().toISOString(),
            completedBy,
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
        };

        const records = mockStore.getState().staffOnboarding;
        if (records) {
            records.push(record);
        } else {
            mockStore.getState().staffOnboarding = [record];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: completedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_ONBOARDING_STEP_COMPLETED',
            entityType: 'STAFF_ONBOARDING',
            entityId: record.id,
            newState: { step },
            idempotencyKey: createIdempotencyKey(`staff_onboard_${staffId}_${record.step}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return record;
    },

    async createPerformanceRecord(
        input: Omit<StaffPerformanceRecord, 'id'>,
        createdBy: string
    ): Promise<StaffPerformanceRecord> {
        const record: StaffPerformanceRecord = {
            id: generateId('perf'),
            ...input,
        };

        const records = mockStore.getState().staffPerformance;
        if (records) {
            records.push(record);
        } else {
            mockStore.getState().staffPerformance = [record];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: input.societyId ?? '',
            action: 'STAFF_PERFORMANCE_RECORDED',
            entityType: 'STAFF_PERFORMANCE',
            entityId: record.id,
            newState: { staffId: input.staffId, period: input.period, rating: input.rating },
            idempotencyKey: createIdempotencyKey(`staff_perf_${input.staffId}_${input.period}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return record;
    },

    async getDashboardMetrics(societyId: string): Promise<{
        totalStaff: number;
        activeStaff: number;
        verificationPending: number;
        suspended: number;
        inactive: number;
        exited: number;
        byCategory: Record<string, number>;
        byEmploymentType: Record<string, number>;
        onboardingProgress: Record<string, number>;
    }> {
        const staff = mockStore.getState().staff?.filter(s => s.societyId === societyId) || [];
        const byCategory: Record<string, number> = {};
        const byEmploymentType: Record<string, number> = {};
        let totalStaff = 0;
        let activeStaff = 0;
        let verificationPending = 0;
        let suspended = 0;
        let inactive = 0;
        let exited = 0;

        for (const s of staff) {
            totalStaff++;
            const cat = s.category || 'OTHER';
            byCategory[cat] = (byCategory[cat] || 0) + 1;
            const empType = s.employmentType || 'DIRECT_EMPLOYEE';
            byEmploymentType[empType] = (byEmploymentType[empType] || 0) + 1;
            switch (s.employmentStatus) {
                case 'ACTIVE':
                    activeStaff++;
                    break;
                case 'VERIFICATION_PENDING':
                    verificationPending++;
                    break;
                case 'SUSPENDED':
                    suspended++;
                    break;
                case 'INACTIVE':
                    inactive++;
                    break;
                case 'EXITED':
                    exited++;
                    break;
            }
        }

        return {
            totalStaff,
            activeStaff,
            verificationPending,
            suspended,
            inactive,
            exited,
            byCategory,
            byEmploymentType,
            onboardingProgress: {
                DRAFT: 0,
                INVITED: 0,
                VERIFICATION_PENDING: verificationPending,
                ACTIVE: activeStaff,
            },
        };
    },
};

export default staffManagementService;
