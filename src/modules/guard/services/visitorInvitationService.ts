import { mockStore } from '../../../core/mockStore/mockStore';
import type { VisitorInvitation, CreateVisitorInvitationPayload, VisitorInvitationStatus, Visitor, VisitorStatus, VisitorPassStatus, VisitorType, VisitorCategory, ApprovalSource, VehicleType, EmergencyType, } from '../../../shared/types/visitorPhase8.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { repositorySuccess, type RepositoryResult } from '../../../core/repositories/repository.types';
const withMockDelay = <T>(data: T, ms = 400): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), ms));
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function generateQrCodeData(visitorId: string, otp: string): string {
    return JSON.stringify({ v: visitorId, o: otp, t: Date.now() });
}
export const visitorInvitationService = {
    async createInvitation(payload: any, residentId: string, residentName: string, residentUnitId: string, residentUnitNumber: string, societyId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const now = new Date().toISOString();
                    const validityStartAtIso = payload.validityStartAtIso || now;
                    const validityEndAtIso = payload.validityEndAtIso || new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString();
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    const qrCodeData = JSON.stringify({ v: generateId('vis'), o: otp, t: Date.now() });
                    const qrCodeExpiryAtIso = new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString();
                    const invitation = {
                        id: generateId('inv'),
                        preApprovalId: `pre-${Date.now()}`,
                        visitorId: undefined,
                        residentId,
                        residentName,
                        residentUnitId,
                        residentUnitNumber,
                        visitorName: payload.visitorName,
                        visitorPhone: payload.visitorPhone,
                        visitorEmail: payload.visitorEmail,
                        visitorType: payload.visitorType,
                        visitorCategory: payload.visitorCategory,
                        status: 'SENT' as const,
                        validityStartAtIso,
                        validityEndAtIso,
                        validityWindowMinutes: payload.validityWindowMinutes || 240,
                        otp: generateOtp(),
                        qrCode: `qr-${generateId('qr')}`,
                        qrCodeData: generateQrCodeData(generateId('vis'), generateOtp()),
                        qrCodeExpiryAtIso,
                        vehicleNumber: payload.vehicleNumber,
                        vehicleType: payload.vehicleType,
                        purpose: payload.purpose,
                        deliveryBrand: payload.deliveryBrand,
                        deliveryTrackingId: payload.deliveryTrackingId,
                        cabCompany: payload.cabCompany,
                        cabDriverName: payload.cabDriverName,
                        vendorCompany: payload.vendorCompany,
                        vendorContactPerson: payload.vendorContactPerson,
                        vendorServiceType: payload.vendorServiceType,
                        materialDescription: payload.materialDescription,
                        materialQuantity: payload.materialQuantity,
                        materialWeightKg: payload.materialWeightKg,
                        createdAt: now,
                        createdBy: payload.flatNumber || '',
                        sentAtIso: now,
                        acceptedAtIso: undefined,
                        revokedAtIso: undefined,
                        revokedBy: undefined,
                        revocationReason: undefined,
                        usedAtIso: undefined,
                        statusChangedAtIso: now,
                        metadata: {},
                        societyId: societyId,
                    };
                    mockStore.getState().visitorInvitations?.push(invitation);
                    mockStore.notify();
                    createAuditEntry({
                        actorUserId: residentId,
                        actorType: 'RESIDENT',
                        societyId,
                        action: 'CREATE_VISITOR_INVITATION',
                        entityType: 'VISITOR_INVITATION',
                        entityId: invitation.id,
                        newState: { visitorName: invitation.visitorName, visitorType: invitation.visitorType },
                        idempotencyKey: `invitation_${invitation.id}`,
                        source: 'MOBILE',
                        outcome: 'SUCCESS',
                    });
                    resolve(invitation);
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async getInvitation(preApprovalId: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const invitation = invitations.find((i) => i.preApprovalId === preApprovalId);
                resolve(invitation);
            }, 300);
        });
    },
    async getInvitationByVisitor(visitorId: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const invitation = invitations.find((i) => i.visitorId === visitorId);
                resolve(invitation);
            }, 300);
        });
    },
    async revokeInvitation(preApprovalId: string, revokedBy: string, reason: string): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const index = invitations.findIndex((i) => i.preApprovalId === preApprovalId);
                if (index === -1) {
                    reject(new Error('Invitation not found'));
                    return;
                }
                const now = new Date().toISOString();
                const current = invitations[index];
                if (!current) {
                    reject(new Error('Invitation not found'));
                    return;
                }
                const updated: VisitorInvitation = {
                    ...current,
                    status: 'REVOKED' as const,
                    revokedAtIso: now,
                    revokedBy,
                    revocationReason: reason,
                    statusChangedAtIso: now,
                };
                const storeInvs = mockStore.getState().visitorInvitations;
                if (storeInvs) {
                    storeInvs[index] = updated;
                }
                mockStore.notify();
                resolve(updated);
            }, 400);
        });
    },
    async getInvitationsByResident(residentId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const filtered = invitations.filter((i) => i.residentId === residentId);
                resolve(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }, 300);
        });
    },
    async acceptInvitation(preApprovalId: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const index = invitations.findIndex((i) => i.preApprovalId === preApprovalId);
                if (index === -1) {
                    resolve(undefined);
                    return;
                }
                const current = invitations[index];
                if (!current) {
                    resolve(undefined);
                    return;
                }
                const updated: VisitorInvitation = {
                    ...current,
                    status: 'ACCEPTED' as const,
                    acceptedAtIso: new Date().toISOString(),
                    statusChangedAtIso: new Date().toISOString(),
                };
                const storeInvs = mockStore.getState().visitorInvitations;
                if (storeInvs) {
                    storeInvs[index] = updated;
                }
                mockStore.notify();
                resolve(updated);
            }, 300);
        });
    },
    async validateAndAcceptInvitation(preApprovalId: string): Promise<{
        success: boolean;
        visitor?: any;
        error?: string;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const invitation = invitations.find((i) => i.preApprovalId === preApprovalId);
                if (!invitation) {
                    resolve({ success: false, error: 'Invalid invitation code' });
                    return;
                }
                if (invitation.status !== 'SENT') {
                    resolve({ success: false, error: `Invitation is ${invitation.status.toLowerCase()}` });
                    return;
                }
                if (new Date(invitation.validityEndAtIso) < new Date()) {
                    resolve({ success: false, error: 'Invitation has expired' });
                    return;
                }
                const updated: VisitorInvitation = {
                    ...invitation,
                    status: 'ACCEPTED' as const,
                    acceptedAtIso: new Date().toISOString(),
                    statusChangedAtIso: new Date().toISOString(),
                };
                mockStore.getState().visitorInvitations = (mockStore.getState().visitorInvitations || []).map((i) => i.preApprovalId === preApprovalId ? updated : i);
                resolve({ success: true });
            }, 400);
        });
    },
    async getInvitationByCode(preApprovalId: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const invitation = invitations.find((i) => i.preApprovalId === preApprovalId);
                resolve(invitation);
            }, 300);
        });
    },
    async useInvitation(preApprovalId: string): Promise<{
        success: boolean;
        visitor?: any;
        error?: string;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const index = invitations.findIndex((i) => i.preApprovalId === preApprovalId);
                if (index === -1) {
                    resolve({ success: false, error: 'Invalid invitation' });
                    return;
                }
                const invitation = invitations[index];
                if (!invitation) {
                    resolve({ success: false, error: 'Invalid invitation' });
                    return;
                }
                if (invitation.status !== 'SENT' && invitation.status !== 'ACCEPTED') {
                    resolve({ success: false, error: `Invitation is ${invitation.status.toLowerCase()}` });
                    return;
                }
                if (new Date(invitation.validityEndAtIso) < new Date()) {
                    resolve({ success: false, error: 'Invitation has expired' });
                    return;
                }
                const now = new Date().toISOString();
                const updated: VisitorInvitation = {
                    ...invitation,
                    status: 'USED' as const,
                    usedAtIso: now,
                    statusChangedAtIso: now,
                };
                const storeInvs = mockStore.getState().visitorInvitations;
                if (storeInvs) {
                    storeInvs[index] = updated;
                }
                const visitor: Visitor = {
                    id: generateId('vis'),
                    name: invitation.visitorName,
                    phone: invitation.visitorPhone,
                    email: invitation.visitorEmail,
                    type: invitation.visitorType,
                    category: invitation.visitorCategory,
                    status: 'APPROVED',
                    expectedDate: invitation.validityStartAtIso?.split('T')[0] || '',
                    expectedTime: invitation.validityStartAtIso?.split('T')[1]?.substring(0, 5) || '',
                    expectedEntryAtIso: invitation.validityStartAtIso || new Date().toISOString(),
                    expectedExitAtIso: invitation.validityEndAtIso || new Date(Date.now() + 240 * 60 * 1000).toISOString(),
                    actualEntryAtIso: undefined,
                    actualExitAtIso: undefined,
                    flatNumber: invitation.residentUnitNumber || '',
                    societyName: '',
                    purpose: invitation.purpose,
                    vehicleNumber: invitation.vehicleNumber,
                    otp: Math.floor(100000 + Math.random() * 900000).toString(),
                    qrCode: `qr-${generateId('qr')}`,
                    qrCodeData: `qr-${generateId('qr')}`,
                    qrCodeExpiryAtIso: new Date(Date.now() + 240 * 60 * 1000).toISOString(),
                    createdAt: now,
                    createdByUserId: 'visitor',
                    createdByDisplayName: invitation.visitorName,
                    visitorCategory: invitation.visitorCategory,
                    exitTracking: undefined,
                    cancellationReason: undefined,
                    cancellationNotes: undefined,
                    cancelledAt: undefined,
                    cancelledBy: undefined,
                    approvalSource: 'PRE_APPROVED',
                    approvalStatus: 'APPROVED',
                    validityWindowMinutes: invitation.validityWindowMinutes || 240,
                    validityStartAtIso: invitation.validityStartAtIso,
                    validityEndAtIso: invitation.validityEndAtIso,
                    description: undefined,
                    invitedByResidentId: invitation.residentId,
                    invitedByResidentName: invitation.residentName,
                    preApprovalId: invitation.preApprovalId,
                    deliveryBrand: invitation.deliveryBrand,
                    deliveryTrackingId: invitation.deliveryTrackingId,
                    cabCompany: invitation.cabCompany,
                    cabDriverName: invitation.cabDriverName,
                    vendorCompany: invitation.vendorCompany,
                    vendorContactPerson: invitation.vendorContactPerson,
                    vendorServiceType: invitation.vendorServiceType,
                    materialDescription: invitation.materialDescription,
                    materialQuantity: invitation.materialQuantity,
                    materialWeightKg: invitation.materialWeightKg,
                    emergencyType: invitation.emergencyType,
                    emergencyDescription: invitation.emergencyDescription,
                    emergencyContactName: invitation.emergencyContactName,
                    emergencyContactPhone: invitation.emergencyContactPhone,
                    gateId: undefined,
                    gateName: undefined,
                    checkInAtIso: undefined,
                    checkInGateId: undefined,
                    checkInGateName: undefined,
                    checkOutAtIso: undefined,
                    checkOutGateId: undefined,
                    checkOutGateName: undefined,
                    deniedAtIso: undefined,
                    deniedBy: undefined,
                    deniedReason: undefined,
                    escalatedAtIso: undefined,
                    escalatedBy: undefined,
                    escalationReason: undefined,
                    escalationStatus: undefined,
                    revokedAtIso: undefined,
                    revokedBy: undefined,
                    revocationReason: undefined,
                    watchlistWarning: false,
                    watchlistId: undefined,
                    watchlistReason: undefined,
                    previousVisitCount: 0,
                    lastVisitAtIso: undefined,
                    tags: ['invited'],
                    metadata: {},
                    societyId: invitation.societyId,
                };
                mockStore.getState().visitors?.push(visitor);
                mockStore.notify();
                resolve({ success: true, visitor });
            }, 500);
        });
    },
};

