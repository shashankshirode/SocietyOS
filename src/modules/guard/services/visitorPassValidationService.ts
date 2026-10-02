import { mockStore } from '../../../core/mockStore/mockStore';
import type { Visitor, VisitorInvitation, CreateVisitorInvitationPayload, VisitorApprovalRequest, ResidentApprovalActionPayload, VisitorApprovalStatus, VisitorEscalationStatus, VisitorApprovalRequest, VisitorInvitationStatus, VisitorStatus, VisitorPassStatus, VisitorType, VisitorCategory, ApprovalSource, Visitor, GateEventType, GateEvent, EntrySource, ApprovalSource, VisitorPassStatus, VisitorEscalationStatus, VisitorApprovalStatus, VisitorInvitationStatus, Visitor, VehicleType, EmergencyType, WatchlistEntry, CreateWatchlistEntryPayload, WatchlistEntry, WatchlistStatus, WatchlistReason, } from '../../../shared/types/visitorPhase8.types';
import type { GatePass, GatePassStatus, GateEntryType } from '../../../shared/types/gate.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { mockStore } from '../../../core/mockStore/mockStore';
import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import { format } from 'date-fns';
const withMockDelay = <T>(data: T, ms = 500): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), ms));
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function generateQrCodeData(visitorId: string, otp: string): string {
    return JSON.stringify({ v: visitorId, o: otp, t: Date.now() });
}
export const visitorApprovalService = {
    async createInvitation(payload: CreateVisitorInvitationPayload, residentId: string, residentName: string, residentUnitId: string, residentUnitNumber: string, societyId: string): Promise<VisitorInvitation> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const now = new Date().toISOString();
                    const validityStartAtIso = payload.validityStartAtIso || new Date().toISOString();
                    const validityEndAtIso = payload.validityEndAtIso || new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString();
                    const otp = generateOtp();
                    const qrCodeData = generateQrCodeData(generateId('vis'), '000000');
                    const qrCodeExpiryAtIso = new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString();
                    const invitation: VisitorInvitation = {
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
                        status: 'SENT' as VisitorInvitationStatus,
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
    async getInvitation(preApprovalId: string): Promise<VisitorInvitation | Absent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const invitation = invitations.find(i => i.preApprovalId === preApprovalId);
                resolve(invitation);
            }, 300);
        });
    },
    async getInvitationByVisitor(visitorId: string): Promise<VisitorInvitation | Absent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const invitation = invitations.find(i => i.visitorId === visitorId);
                resolve(invitation);
            }, 300);
        });
    },
    async revokeInvitation(preApprovalId: string, revokedBy: string, reason: string): Promise<VisitorInvitation | Absent> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const index = invitations.findIndex(i => i.preApprovalId === preApprovalId);
                if (index === -1) {
                    reject(new Error('Invitation not found'));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...invitations[index],
                    status: 'REVOKED' as const,
                    revokedAtIso: new Date().toISOString(),
                    revokedBy,
                    revocationReason: reason,
                    statusChangedAtIso: new Date().toISOString(),
                };
                mockStore.getState().visitorInvitations[index] = updated;
                mockStore.notify();
                resolve(updated);
            }, 400);
        });
    },
    async getInvitationsByResident(residentId: string): Promise<VisitorInvitation[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const filtered = invitations.filter(i => i.residentId === residentId);
                resolve(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }, 300);
        });
    },
    async acceptInvitation(preApprovalId: string): Promise<VisitorInvitation | Absent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const invitations = mockStore.getState().visitorInvitations || [];
                const index = invitations.findIndex(i => i.preApprovalId === preApprovalId);
                if (index === -1) {
                    resolve(undefined);
                    return;
                }
                const updated = {
                    ...invitations[index],
                    status: 'ACCEPTED' as const,
                    acceptedAtIso: new Date().toISOString(),
                    statusChangedAtIso: new Date().toISOString(),
                };
                mockStore.getState().visitorInvitations[index] = updated;
                mockStore.notify();
                resolve(updated);
            }, 300);
        });
    },
    async createApprovalRequest(visitorId: string, visitorName: string, visitorPhone: string, visitorType: string, flatNumber: string, unitId: string, gateId: string, gateName: string, guardId: string, guardName: string, requestType: 'WALK_IN' | 'PRE_APPROVAL_EXPIRED' | 'PASS_EXPIRED' | 'UNKNOWN_VISITOR' | 'EMERGENCY', societyId: string, expiresInMinutes = 10): Promise<VisitorApprovalRequest> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString();
                const expiresAtIso = new Date(Date.now() + 10 * 60 * 1000).toISOString();
                const request: VisitorApprovalRequest = {
                    id: generateId('appr'),
                    visitorId,
                    visitorName,
                    visitorPhone,
                    visitorType: visitorType as any,
                    flatNumber,
                    unitId,
                    gateId,
                    gateName,
                    guardId,
                    guardName,
                    requestType,
                    status: 'PENDING',
                    requestedAtIso: now,
                    respondedAtIso: undefined,
                    respondedBy: undefined,
                    respondedByRole: undefined,
                    decision: undefined,
                    denialReason: undefined,
                    escalationReason: undefined,
                    escalationStatus: 'NOT_ESCALATED',
                    escalatedAtIso: undefined,
                    escalatedBy: undefined,
                    expiresAtIso: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
                    metadata: {},
                    societyId: societyId,
                };
                mockStore.getState().visitorApprovalRequests?.push(request);
                mockStore.notify();
                resolve(request);
            }, 400);
        });
    },
    async getApprovalRequest(requestId: string): Promise<VisitorApprovalRequest | Absent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const request = requests.find(r => r.id === requestId);
                resolve(request);
            }, 300);
        });
    },
    async getPendingApprovalsForUnit(unitId: string): Promise<VisitorApprovalRequest[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter(r => r.unitId === unitId && r.status === 'PENDING');
                resolve(filtered);
            }, 300);
        });
    },
    async getPendingApprovalsForGuard(guardId: string): Promise<VisitorApprovalRequest[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter(r => r.guardId === guardId && r.status === 'PENDING');
                resolve(filtered);
            }, 300);
        });
    },
    async respondToApproval(requestId: string, action: 'APPROVE' | 'DENY', residentId: string, residentRole: string, denialReason?: string): Promise<VisitorApprovalRequest | Absent> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const index = requests.findIndex(r => r.id === requestId);
                if (index === -1) {
                    reject(new Error('Approval request not found'));
                    return;
                }
                const request = requests[index];
                if (request.status !== 'PENDING') {
                    reject(new Error('Request already processed'));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...request,
                    status: action === 'APPROVE' ? 'APPROVED' : 'DENIED',
                    respondedAtIso: now,
                    respondedBy: residentId,
                    respondedByRole: 'RESIDENT',
                    decision: action === 'APPROVE' ? 'APPROVE' : 'DENY',
                    denialReason: action === 'DENY' ? denialReason : undefined,
                    statusChangedAtIso: now,
                };
                mockStore.getState().visitorApprovalRequests[index] = updated;
                mockStore.notify();
                if (action === 'APPROVE') {
                    const visitors = mockStore.getState().visitors || [];
                    const visitorIndex = visitors.findIndex(v => v.id === requests[index].visitorId);
                    if (visitorIndex !== -1) {
                        const visitor = visitors[visitorIndex];
                        visitors[visitorIndex] = {
                            ...visitor,
                            status: 'APPROVED',
                            approvalStatus: 'APPROVED',
                            approvalSource: 'RESIDENT',
                            approvedAtIso: now,
                            approvedBy: residentId,
                        };
                        mockStore.notify();
                    }
                }
                resolve(updated);
            }, 500);
        });
    },
    async escalateRequest(requestId: string, escalatedBy: string, escalationReason: string, escalationStatus: 'ESCALATED_TO_SECURITY' | 'ESCALATED_TO_SUPERVISOR' | 'ESCALATED_TO_COMMITTEE'): Promise<VisitorApprovalRequest | Absent> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const index = requests.findIndex(r => r.id === requestId);
                if (index === -1) {
                    reject(new Error('Approval request not found'));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...requests[index],
                    escalationStatus: escalationStatus as any,
                    escalationReason,
                    escalatedAtIso: new Date().toISOString(),
                    escalatedBy,
                    statusChangedAtIso: now,
                };
                mockStore.getState().visitorApprovalRequests[index] = updated;
                mockStore.notify();
                resolve(updated);
            }, 400);
        });
    },
};
export const visitorPassValidationService = {
    async validatePass(context: {
        passCode: string;
        gateId: string;
        guardId: string;
        societyId: string;
        currentTime: string;
        entrySource: 'QR' | 'OTP' | 'MANUAL' | 'OFFLINE';
        deviceId?: string;
        deviceInfo?: string;
    }): Promise<{
        isValid: boolean;
        pass?: any;
        denialReason?: string;
        watchlistWarning?: boolean;
        watchlistId?: string;
        watchlistReason?: string;
        requiresApproval?: boolean;
        approvalRequestId?: string;
        status: 'VALID' | 'INVALID' | 'EXPIRED' | 'REVOKED' | 'PENDING_APPROVAL' | 'WATCHLIST_MATCH';
        message?: string;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const passes = mockStore.getState().visitors || [];
                    const pass = passes.find(p => p.otp === context.passCode || p.id === context.passCode);
                    if (!pass) {
                        resolve({
                            isValid: false,
                            denialReason: 'Invalid pass code',
                            status: 'INVALID',
                            message: 'Invalid pass code. Please verify and try again.',
                        });
                        return;
                    }
                    const watchlist = mockStore.getState().watchlistEntries || [];
                    const watchlistMatch = watchlist.find(w => w.visitorPhone === pass.phone || w.visitorId === pass.id);
                    if (watchlistMatch && watchlistMatch.status === 'ACTIVE') {
                        if (watchlistMatch.autoDenyEntry) {
                            resolve({
                                isValid: false,
                                denialReason: 'Visitor is on watchlist',
                                watchlistWarning: true,
                                watchlistId: watchlistMatch.id,
                                watchlistReason: watchlistMatch.reason,
                                status: 'WATCHLIST_MATCH',
                                message: 'Visitor is on watchlist. Entry denied.',
                            });
                            return;
                        }
                    }
                    const passStatus = pass.status as any;
                    if (!['APPROVED', 'CHECKED_IN', 'PRESENTED', 'EXPECTED'].includes(passStatus)) {
                        resolve({
                            isValid: false,
                            denialReason: `Pass status: ${passStatus}`,
                            status: 'INVALID',
                            message: `Pass is not valid for entry. Current status: ${passStatus}`,
                        });
                        return;
                    }
                    const now = new Date();
                    const validityEnd = pass.validityEndAtIso ? new Date(pass.validityEndAtIso) : null;
                    if (validityEnd && validityEnd < new Date()) {
                        resolve({
                            isValid: false,
                            denialReason: 'Pass expired',
                            status: 'EXPIRED',
                            message: 'Visitor pass has expired.',
                        });
                        return;
                    }
                    if (pass.actualEntryAtIso && !pass.actualExitAtIso) {
                        resolve({
                            isValid: false,
                            denialReason: 'Visitor already inside',
                            status: 'INVALID',
                            message: 'Visitor is already checked in.',
                        });
                        return;
                    }
                    resolve({
                        isValid: true,
                        pass: {
                            id: pass.id,
                            visitorName: pass.name,
                            visitorPhone: pass.phone,
                            visitorType: pass.type,
                            visitingFlat: pass.flatNumber,
                            residentName: 'Resident',
                            residentPhone: pass.phone,
                            expectedTime: pass.expectedTime,
                            expectedDate: pass.expectedDate,
                            validityWindow: pass.validityWindowMinutes ? `${pass.validityWindowMinutes} min` : '4 Hours',
                            otp: pass.otp,
                            approvalStatus: pass.status as any,
                            approvalSource: 'PRE_APPROVED',
                            vehicleNumber: pass.vehicleNumber,
                            purpose: pass.purpose,
                            peopleCount: 1,
                            specialInstructions: undefined,
                            watchlistWarning: !!watchlistMatch,
                            watchlistId: watchlistMatch?.id,
                            watchlistReason: watchlistMatch?.reason,
                            previousVisitCount: pass.previousVisitCount || 0,
                            actualEntryTime: pass.actualEntryTime,
                            actualExitTime: pass.actualExitTime,
                            validityStartAtIso: pass.validityStartAtIso,
                            validityEndAtIso: pass.validityEndAtIso,
                            validityWindowMinutes: pass.validityWindowMinutes,
                        },
                        status: 'VALID',
                        message: 'Pass validated successfully',
                    });
                }
                catch (error) {
                    resolve({
                        isValid: false,
                        denialReason: 'Validation error',
                        status: 'INVALID',
                        message: 'An error occurred during validation',
                    });
                }
            }, 500);
        });
    },
    async validatePassByQr(qrCode: string, context: any): Promise<any> {
        return this.validatePass({ ...context, passCode: qrCode });
    },
    async checkWatchlist(visitorPhone: string, visitorId?: string): Promise<{
        match: boolean;
        watchlistId?: string;
        reason?: string;
        autoDeny: boolean;
        requiresEscort: boolean;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const watchlist = mockStore.getState().watchlistEntries || [];
                const match = watchlist.find(w => w.visitorPhone === visitorPhone ||
                    (visitorId && w.visitorId === visitorId));
                if (match && match.status === 'ACTIVE') {
                    resolve({
                        match: true,
                        watchlistId: match.id,
                        reason: match.reason,
                        autoDeny: match.autoDenyEntry,
                        requiresEscort: match.requiresEscort,
                    });
                }
                else {
                    resolve({ match: false, autoDeny: false });
                }
            }, 200);
        });
    },
    async getVisitorCurrentStatus(visitorId: string): Promise<{
        isInside: boolean;
        status: string;
        entryTime?: string;
        exitTime?: string;
        currentGate?: string;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const visitor = visitors.find(v => v.id === visitorId);
                if (!visitor) {
                    resolve({ isInside: false, status: 'NOT_FOUND' });
                    return;
                }
                const isInside = ['CHECKED_IN', 'PRESENTED', 'ESCALATED'].includes(visitor.status as any);
                resolve({
                    isInside,
                    status: visitor.status as string,
                    entryTime: visitor.actualEntryAtIso,
                    exitTime: visitor.actualExitAtIso,
                    currentGate: visitor.checkInGateId,
                });
            }, 200);
        });
    },
};

