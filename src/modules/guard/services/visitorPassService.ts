import { mockStore } from '../../../core/mockStore/mockStore';
import type { Visitor, VisitorPass, VisitorInvitation, CreateVisitorPayload, VisitorPassStatus, VisitorStatus, VisitorType, VisitorCategory, ApprovalSource, EntrySource, VisitorVehicle, VehicleType, EmergencyType, GateEvent, GateEventType, WatchlistEntry, } from '../../../shared/types/visitorPhase8.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import { visitorStateMachine } from './visitorStateMachine';
import { visitorPassValidationService } from './visitorPassValidationServiceNew';
import { offlineGateSyncService } from './offlineGateSyncService';
import { gateIdempotencyService } from './gateIdempotencyService';
import { currentVisitorPresenceService } from './currentVisitorPresenceService';
import { visitorNotificationService } from './visitorNotificationService';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function generateQrCodeData(visitorId: string, otp: string): string {
    return JSON.stringify({ v: visitorId, o: otp, t: Date.now() });
}
export const visitorPassService = {
    async createVisitorPass(payload: CreateVisitorPayload, createdBy: string, societyId: string): Promise<Visitor> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const now = new Date().toISOString();
                    const validityStartAtIso = payload.validityStartAtIso || now;
                    const validityEndAtIso = payload.validityEndAtIso ||
                        new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString();
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    const qrCodeData = generateQrCodeData(generateId('vis'), generateOtp());
                    const qrCodeExpiryAtIso = new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString();
                    const visitor: Visitor = {
                        id: generateId('vis'),
                        name: payload.name,
                        phone: payload.phone,
                        email: payload.email,
                        type: payload.type,
                        category: payload.category || 'guest',
                        status: 'EXPECTED' as VisitorStatus,
                        expectedDate: payload.expectedDate,
                        expectedTime: payload.expectedTime,
                        expectedEntryAtIso: payload.expectedEntryAtIso || new Date(payload.validityStartAtIso || Date.now()).toISOString(),
                        expectedExitAtIso: payload.expectedExitAtIso || new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString(),
                        actualEntryAtIso: undefined,
                        actualExitAtIso: undefined,
                        flatNumber: payload.flatNumber || '',
                        societyName: '',
                        purpose: payload.purpose,
                        vehicleNumber: payload.vehicleNumber,
                        otp: generateOtp(),
                        qrCode: `qr-${generateId('qr')}`,
                        qrCodeData: generateQrCodeData(generateId('vis'), generateOtp()),
                        qrCodeExpiryAtIso: new Date(Date.now() + (payload.validityWindowMinutes || 240) * 60 * 1000).toISOString(),
                        createdAt: now,
                        createdByUserId: createdBy,
                        createdByDisplayName: '',
                        visitorCategory: payload.visitorCategory,
                        exitTracking: undefined,
                        cancellationReason: undefined,
                        cancellationNotes: undefined,
                        cancelledAt: undefined,
                        cancelledBy: undefined,
                        approvalSource: 'PRE_APPROVED' as ApprovalSource,
                        approvalStatus: 'EXPECTED' as VisitorPassStatus,
                        validityWindowMinutes: payload.validityWindowMinutes || 240,
                        validityStartAtIso: validityStartAtIso,
                        validityEndAtIso: validityEndAtIso,
                        description: undefined,
                        invitedByResidentId: '',
                        invitedByResidentName: '',
                        preApprovalId: undefined,
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
                        emergencyType: payload.emergencyType,
                        emergencyDescription: payload.emergencyDescription,
                        emergencyContactName: payload.emergencyContactName,
                        emergencyContactPhone: payload.emergencyContactPhone,
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
                        tags: payload.tags,
                        metadata: payload.metadata,
                        societyId,
                    };
                    mockStore.getState().visitors?.push(visitor);
                    mockStore.notify();
                    resolve(visitor);
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async getVisitor(visitorId: string): Promise<Visitor | Absent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const visitor = visitors.find(v => v.id === visitorId);
                resolve(visitor);
            }, 200);
        });
    },
    async getVisitors(filters: {
        societyId?: string;
        unitId?: string;
        visitorId?: string;
        visitorName?: string;
        visitorPhone?: string;
        visitorType?: VisitorType;
        status?: VisitorStatus;
        dateFrom?: string;
        dateTo?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: Visitor[];
        total: number;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let visitors = mockStore.getState().visitors || [];
                if (filters.societyId) {
                    visitors = visitors.filter(v => v.societyId === filters.societyId);
                }
                if (filters.unitId) {
                    visitors = visitors.filter(v => v.flatNumber === filters.unitId);
                }
                if (filters.visitorId) {
                    visitors = visitors.filter(v => v.id === filters.visitorId);
                }
                if (filters.visitorName) {
                    const search = filters.visitorName.toLowerCase();
                    visitors = visitors.filter(v => v.name.toLowerCase().includes(search));
                }
                if (filters.visitorPhone) {
                    visitors = visitors.filter(v => v.phone.includes(filters.visitorPhone!));
                }
                if (filters.visitorType) {
                    visitors = visitors.filter(v => v.type === filters.visitorType);
                }
                if (filters.status) {
                    visitors = visitors.filter(v => v.status === filters.status);
                }
                if (filters.dateFrom) {
                    visitors = visitors.filter(v => new Date(v.createdAt) >= new Date(filters.dateFrom!));
                }
                if (filters.dateTo) {
                    visitors = visitors.filter(v => new Date(v.createdAt) <= new Date(filters.dateTo!));
                }
                const total = visitors.length;
                const page = filters.page || 1;
                const pageSize = filters.pageSize || 20;
                const start = (page - 1) * pageSize;
                const items = visitors.slice(start, start + pageSize);
                resolve({ items, total });
            }, 300);
        });
    },
    async updateVisitor(visitorId: string, updates: Partial<Visitor>): Promise<Visitor | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const index = visitors.findIndex(v => v.id === visitorId);
                if (index === -1) {
                    resolve(null);
                    return;
                }
                const updated = { ...visitors[index], ...updates, updatedAt: new Date().toISOString() };
                mockStore.getState().visitors[index] = updated;
                mockStore.notify();
                resolve(updated);
            }, 400);
        });
    },
    async transitionVisitorStatus(visitorId: string, newStatus: VisitorStatus, additionalUpdates: Partial<Visitor> = {}, context?: {
        actorUserId: string;
        actorType: 'RESIDENT' | 'GUARD' | 'SECURITY_SUPERVISOR' | 'SYSTEM' | 'SOCIETY_ADMIN';
        societyId: string;
        reason?: string;
    }): Promise<Visitor | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const index = visitors.findIndex(v => v.id === visitorId);
                if (index === -1) {
                    reject(new Error('Visitor not found'));
                    return;
                }
                const current = visitors[index];
                if (!visitorStateMachine.canTransitionVisitorStatus(current.status as VisitorStatus, newStatus)) {
                    reject(new Error(`Invalid status transition from ${current.status} to ${newStatus}`));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...visitors[index],
                    status: newStatus,
                    ...additionalUpdates,
                    updatedAt: now,
                };
                if (newStatus === 'CHECKED_IN') {
                    (updated as any).actualEntryAtIso = now;
                    (updated as any).checkInAtIso = now;
                }
                if (newStatus === 'CHECKED_OUT') {
                    (updated as any).actualExitAtIso = now;
                    (updated as any).checkOutAtIso = now;
                }
                if (newStatus === 'APPROVED') {
                    (updated as any).approvedAtIso = now;
                }
                if (newStatus === 'REVOKED') {
                    (updated as any).revokedAtIso = now;
                }
                if (newStatus === 'DENIED') {
                    (updated as any).deniedAtIso = now;
                }
                if (newStatus === 'ESCALATED') {
                    (updated as any).escalatedAtIso = now;
                }
                if (newStatus === 'CANCELLED') {
                    (updated as any).cancelledAt = now;
                }
                if (newStatus === 'EXPIRED') {
                    (updated as any).expiredAtIso = now;
                }
                mockStore.getState().visitors[index] = updated;
                mockStore.notify();
                if (context) {
                    visitorStateMachine.logTransition({
                        visitorId,
                        societyId: context.societyId,
                        actorUserId: context.actorUserId,
                        actorType: context.actorType,
                        reason: context.reason,
                    }, 'VISITOR', current.status, newStatus, `VISITOR_STATUS_${current.status}_TO_${newStatus}`);
                }
                resolve(updated);
            }, 500);
        });
    },
    async checkInVisitor(visitorId: string, gateId: string, gateName: string, entrySource: 'QR' | 'OTP' | 'MANUAL' | 'OFFLINE' | 'NFC' | 'RFID', approvalSource: ApprovalSource, guardId: string, guardName: string, societyId: string, vehicleRegistration?: string, vehicleType?: string, vehicleColor?: string, idempotencyKey?: string): Promise<{
        visitor: Visitor;
        gateEvent: any;
    } | null> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    const visitors = mockStore.getState().visitors || [];
                    const index = visitors.findIndex(v => v.id === visitorId);
                    if (index === -1) {
                        reject(new Error('Visitor not found'));
                        return;
                    }
                    const visitor = visitors[index];
                    if (!['APPROVED', 'EXPECTED', 'PRESENTED'].includes(visitor.status as any)) {
                        reject(new Error(`Cannot check in visitor with status: ${visitor.status}`));
                        return;
                    }
                    const key = idempotencyKey || gateIdempotencyService.generateKey('checkin', { visitorId, gateId });
                    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, societyId);
                    if (idempotencyResult.exists && idempotencyResult.record?.status === 'COMPLETED') {
                        resolve({ visitor, gateEvent: idempotencyResult.record.responsePayload });
                        return;
                    }
                    const watchlist = mockStore.getState().watchlistEntries || [];
                    const gates = new Map<string, {
                        id: string;
                        allowedVisitorTypes: VisitorType[];
                    }>();
                    const gateConfig = mockStore.getState().gates?.find(g => g.id === gateId);
                    if (gateConfig) {
                        gates.set(gateId, { id: gateConfig.id, allowedVisitorTypes: gateConfig.allowedVisitorTypes });
                    }
                    const validation = await visitorPassValidationService.validatePass({
                        passCode: visitor.otp,
                        gateId,
                        guardId,
                        societyId,
                        currentTime: new Date().toISOString(),
                        entrySource,
                    }, visitors, watchlist, gates);
                    if (!validation.isValid) {
                        reject(new Error(validation.denialReason || 'Pass validation failed'));
                        return;
                    }
                    const now = new Date().toISOString();
                    const updated = {
                        ...visitors[index],
                        status: 'CHECKED_IN' as VisitorStatus,
                        actualEntryAtIso: now,
                        checkInAtIso: now,
                        checkInGateId: gateId,
                        checkInGateName: gateName,
                        approvalSource: approvalSource,
                        updatedAt: now,
                    };
                    mockStore.getState().visitors[index] = updated;
                    const gateEvent = {
                        id: `gate-event-${Date.now()}`,
                        eventType: 'CHECK_IN' as GateEventType,
                        gateId: gateId,
                        gateName: gateName,
                        gateCode: '',
                        visitorId: visitorId,
                        visitorName: visitor.name,
                        visitorPhone: visitor.phone,
                        visitorType: visitor.type,
                        visitorPassId: visitor.id,
                        visitorPassCode: visitor.otp,
                        unitId: visitor.unitId,
                        unitNumber: visitor.flatNumber,
                        flatNumber: visitor.flatNumber,
                        eventTimestamp: now,
                        deviceTimestamp: now,
                        guardId: guardId,
                        guardName: guardName,
                        guardRole: 'GUARD',
                        entrySource: entrySource,
                        approvalSource: approvalSource,
                        vehicleId: vehicleRegistration,
                        vehicleRegistration: vehicleRegistration,
                        vehicleType: vehicleType as VehicleType,
                        vehicleColor: vehicleColor,
                        eventStatus: 'SUCCESS',
                        approvalSource: approvalSource,
                        approvalStatus: 'CHECKED_IN' as VisitorPassStatus,
                        denialReason: undefined,
                        escalationTriggered: false,
                        escalationType: undefined,
                        watchlistMatch: validation.watchlistWarning || false,
                        watchlistId: validation.watchlistId,
                        watchlistReason: validation.watchlistReason,
                        emergencyBypassUsed: false,
                        emergencyType: undefined,
                        emergencyDescription: undefined,
                        emergencyContactName: undefined,
                        emergencyContactPhone: undefined,
                        idempotencyKey: key,
                        deviceId: undefined,
                        deviceInfo: undefined,
                        appVersion: undefined,
                        networkType: undefined,
                        syncStatus: 'SYNCED',
                        createdAt: now,
                        createdBy: guardId,
                        metadata: {},
                        societyId: societyId,
                    };
                    mockStore.getState().visitors[index] = updated;
                    mockStore.getState().gateEvents?.push(gateEvent);
                    mockStore.notify();
                    await gateIdempotencyService.completeIdempotency(key, societyId, gateEvent.id, gateEvent);
                    const residentUserIds = mockStore.getState().residents
                        ?.filter(r => r.flatNumber === visitor.flatNumber)
                        .map(r => r.id) || [];
                    if (residentUserIds.length > 0) {
                        await visitorNotificationService.sendVisitorCheckedIn(visitor, gateName, residentUserIds, societyId);
                    }
                    visitorStateMachine.logTransition({
                        visitorId,
                        societyId,
                        actorUserId: guardId,
                        actorType: 'GUARD',
                    }, 'VISITOR', visitor.status, 'CHECKED_IN', 'VISITOR_CHECK_IN');
                    resolve({ visitor: updated, gateEvent });
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async checkOutVisitor(visitorId: string, gateId: string, gateName: string, guardId: string, guardName: string, societyId: string, vehicleRegistration?: string, idempotencyKey?: string): Promise<{
        visitor: Visitor;
        gateEvent: any;
    } | null> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    const visitors = mockStore.getState().visitors || [];
                    const index = visitors.findIndex(v => v.id === visitorId);
                    if (index === -1) {
                        reject(new Error('Visitor not found'));
                        return;
                    }
                    const visitor = visitors[index];
                    if (visitor.status !== 'CHECKED_IN') {
                        reject(new Error(`Cannot check out visitor with status: ${visitor.status}`));
                        return;
                    }
                    const key = idempotencyKey || gateIdempotencyService.generateKey('checkout', { visitorId, gateId });
                    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, societyId);
                    if (idempotencyResult.exists && idempotencyResult.record?.status === 'COMPLETED') {
                        resolve({ visitor, gateEvent: idempotencyResult.record.responsePayload });
                        return;
                    }
                    const now = new Date().toISOString();
                    const updated = {
                        ...visitors[index],
                        status: 'CHECKED_OUT' as VisitorStatus,
                        actualExitAtIso: now,
                        checkOutAtIso: now,
                        checkOutGateId: gateId,
                        checkOutGateName: gateName,
                        updatedAt: now,
                    };
                    mockStore.getState().visitors[index] = updated;
                    const gateEvent = {
                        id: `gate-event-${Date.now()}`,
                        eventType: 'CHECK_OUT' as GateEventType,
                        gateId: gateId,
                        gateName: gateName,
                        gateCode: '',
                        visitorId: visitorId,
                        visitorName: visitor.name,
                        visitorPhone: visitor.phone,
                        visitorType: visitor.type,
                        visitorPassId: visitor.id,
                        visitorPassCode: visitor.otp,
                        unitId: visitor.unitId,
                        unitNumber: visitor.flatNumber,
                        flatNumber: visitor.flatNumber,
                        eventTimestamp: now,
                        deviceTimestamp: now,
                        guardId: guardId,
                        guardName: guardName,
                        guardRole: 'GUARD',
                        entrySource: 'MANUAL' as EntrySource,
                        approvalSource: visitor.approvalSource || 'PRE_APPROVED',
                        vehicleId: vehicleRegistration,
                        vehicleRegistration: vehicleRegistration,
                        vehicleType: undefined,
                        vehicleColor: undefined,
                        eventStatus: 'SUCCESS',
                        approvalSource: visitor.approvalSource || 'PRE_APPROVED',
                        approvalStatus: 'CHECKED_OUT' as VisitorPassStatus,
                        denialReason: undefined,
                        escalationTriggered: false,
                        escalationType: undefined,
                        watchlistMatch: false,
                        watchlistId: undefined,
                        watchlistReason: undefined,
                        emergencyBypassUsed: false,
                        emergencyType: undefined,
                        emergencyDescription: undefined,
                        emergencyContactName: undefined,
                        emergencyContactPhone: undefined,
                        idempotencyKey: key,
                        deviceId: undefined,
                        deviceInfo: undefined,
                        appVersion: undefined,
                        networkType: undefined,
                        syncStatus: 'SYNCED',
                        createdAt: now,
                        createdBy: guardId,
                        metadata: {},
                        societyId: societyId,
                    };
                    mockStore.getState().visitors[index] = updated;
                    mockStore.getState().gateEvents?.push(gateEvent);
                    mockStore.notify();
                    await gateIdempotencyService.completeIdempotency(key, societyId, gateEvent.id, gateEvent);
                    const residentUserIds = mockStore.getState().residents
                        ?.filter(r => r.flatNumber === visitor.flatNumber)
                        .map(r => r.id) || [];
                    if (residentUserIds.length > 0) {
                        await visitorNotificationService.sendVisitorCheckedOut(visitor, residentUserIds, societyId);
                    }
                    visitorStateMachine.logTransition({
                        visitorId,
                        societyId,
                        actorUserId: guardId,
                        actorType: 'GUARD',
                    }, 'VISITOR', 'CHECKED_IN', 'CHECKED_OUT', 'VISITOR_CHECK_OUT');
                    resolve({ visitor: updated, gateEvent });
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async revokeVisitorPass(visitorId: string, revokedBy: string, reason: string, societyId: string, actorType: 'RESIDENT' | 'GUARD' | 'SECURITY_SUPERVISOR' | 'SYSTEM' | 'SOCIETY_ADMIN' = 'RESIDENT'): Promise<Visitor | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const index = visitors.findIndex(v => v.id === visitorId);
                if (index === -1) {
                    reject(new Error('Visitor not found'));
                    return;
                }
                const current = visitors[index];
                if (!visitorStateMachine.canTransitionVisitorStatus(current.status as VisitorStatus, 'REVOKED')) {
                    reject(new Error(`Cannot revoke visitor with status: ${current.status}`));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...visitors[index],
                    status: 'REVOKED' as VisitorStatus,
                    revokedAtIso: now,
                    revokedBy,
                    revocationReason: reason,
                    updatedAt: now,
                };
                mockStore.getState().visitors[index] = updated;
                mockStore.notify();
                visitorStateMachine.logTransition({
                    visitorId,
                    societyId,
                    actorUserId: revokedBy,
                    actorType,
                    reason,
                }, 'VISITOR', current.status, 'REVOKED', 'VISITOR_REVOKED');
                const residentUserIds = mockStore.getState().residents
                    ?.filter(r => r.flatNumber === current.flatNumber)
                    .map(r => r.id) || [];
                if (residentUserIds.length > 0) {
                    visitorNotificationService.sendVisitorRevoked(current, reason, residentUserIds, societyId);
                }
                resolve(updated);
            }, 400);
        });
    },
    async cancelVisitorPass(visitorId: string, cancelledBy: string, reason: string, societyId: string, actorType: 'RESIDENT' | 'GUARD' | 'SECURITY_SUPERVISOR' | 'SYSTEM' | 'SOCIETY_ADMIN' = 'RESIDENT'): Promise<Visitor | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const index = visitors.findIndex(v => v.id === visitorId);
                if (index === -1) {
                    reject(new Error('Visitor not found'));
                    return;
                }
                const current = visitors[index];
                if (!visitorStateMachine.canTransitionVisitorStatus(current.status as VisitorStatus, 'CANCELLED')) {
                    reject(new Error(`Cannot cancel visitor with status: ${current.status}`));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...visitors[index],
                    status: 'CANCELLED' as VisitorStatus,
                    cancellationReason: reason,
                    cancelledAt: now,
                    cancelledBy,
                    updatedAt: now,
                };
                mockStore.getState().visitors[index] = updated;
                mockStore.notify();
                visitorStateMachine.logTransition({
                    visitorId,
                    societyId,
                    actorUserId: cancelledBy,
                    actorType,
                    reason,
                }, 'VISITOR', current.status, 'CANCELLED', 'VISITOR_CANCELLED');
                resolve(updated);
            }, 400);
        });
    },
    async getVisitorPassDetails(visitorId: string): Promise<any | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const visitor = visitors.find(v => v.id === visitorId);
                if (!visitor) {
                    resolve(null);
                    return;
                }
                const pass = {
                    id: visitor.id,
                    visitorName: visitor.name,
                    visitorPhone: visitor.phone,
                    visitorType: visitor.type,
                    visitingFlat: visitor.flatNumber,
                    residentName: 'Resident',
                    residentPhone: visitor.phone,
                    expectedTime: visitor.expectedTime,
                    expectedDate: visitor.expectedDate,
                    validityWindow: visitor.validityWindowMinutes ? `${visitor.validityWindowMinutes} min` : '4 Hours',
                    otp: visitor.otp,
                    qrCode: visitor.qrCode,
                    qrCodeData: visitor.qrCodeData,
                    qrCodeExpiryAtIso: visitor.qrCodeExpiryAtIso,
                    approvalStatus: visitor.approvalStatus,
                    approvalSource: visitor.approvalSource,
                    vehicleNumber: visitor.vehicleNumber,
                    vehicleType: visitor.vehicleNumber ? 'CAR' as any : undefined,
                    purpose: visitor.purpose,
                    peopleCount: 1,
                    specialInstructions: undefined,
                    watchlistWarning: visitor.watchlistWarning,
                    watchlistId: visitor.watchlistId,
                    watchlistReason: visitor.watchlistReason,
                    previousVisitCount: visitor.previousVisitCount,
                    actualEntryTime: visitor.actualEntryTime,
                    actualExitTime: visitor.actualExitTime,
                    validityStartAtIso: visitor.validityStartAtIso,
                    validityEndAtIso: visitor.validityEndAtIso,
                    validityWindowMinutes: visitor.validityWindowMinutes,
                };
                resolve(pass);
            }, 200);
        });
    },
    async getVisitorHistory(visitorId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                const visitorEvents = events.filter(e => e.visitorId === visitorId);
                resolve(visitorEvents.sort((a, b) => new Date(b.eventTimestamp).getTime() - new Date(a.eventTimestamp).getTime()));
            }, 300);
        });
    },
    async getExpiringPasses(societyId: string, withinMinutes = 60): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const now = new Date();
                const threshold = new Date(now.getTime() + withinMinutes * 60 * 1000);
                const expiring = visitors.filter(v => v.societyId === societyId &&
                    v.validityEndAtIso &&
                    new Date(v.validityEndAtIso) <= threshold &&
                    new Date(v.validityEndAtIso) > now &&
                    ['EXPECTED', 'APPROVED', 'WAITING_APPROVAL'].includes(v.status as any));
                resolve(expiring);
            }, 300);
        });
    },
    async getOverdueVisitors(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const now = new Date();
                const overdue = visitors.filter(v => v.societyId === societyId &&
                    v.expectedExitAtIso &&
                    new Date(v.expectedExitAtIso) < now &&
                    ['CHECKED_IN', 'PRESENTED'].includes(v.status as any));
                resolve(overdue);
            }, 300);
        });
    },
    async searchPasses(query: string, societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const normalized = query.trim().toLowerCase();
                const results = visitors.filter(v => v.societyId === societyId &&
                    (v.otp === query.trim() ||
                        v.name.toLowerCase().includes(normalized) ||
                        v.phone.includes(query.trim()) ||
                        v.flatNumber.toLowerCase().includes(normalized) ||
                        v.id.toLowerCase().includes(normalized)));
                resolve(results.map(v => ({
                    id: v.id,
                    visitorName: v.name,
                    visitorPhone: v.phone,
                    visitorType: v.type,
                    visitingFlat: v.flatNumber,
                    residentName: 'Resident',
                    residentPhone: v.phone,
                    expectedTime: v.expectedTime,
                    expectedDate: v.expectedDate,
                    validityWindow: v.validityWindowMinutes ? `${v.validityWindowMinutes} min` : '4 Hours',
                    otp: v.otp,
                    approvalStatus: v.approvalStatus,
                    approvalSource: v.approvalSource,
                    vehicleNumber: v.vehicleNumber,
                    purpose: v.purpose,
                    peopleCount: 1,
                    specialInstructions: undefined,
                    watchlistWarning: v.watchlistWarning,
                    watchlistId: v.watchlistId,
                    watchlistReason: v.watchlistReason,
                    previousVisitCount: v.previousVisitCount,
                    actualEntryTime: v.actualEntryTime,
                    actualExitTime: v.actualExitTime,
                })));
            }, 300);
        });
    },
    async getVisitorStats(societyId: string): Promise<{
        total: number;
        expected: number;
        approved: number;
        checkedIn: number;
        checkedOut: number;
        completed: number;
        expired: number;
        rejected: number;
        cancelled: number;
        byType: Record<string, number>;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const filtered = visitors.filter(v => v.societyId === societyId);
                const stats = {
                    total: filtered.length,
                    expected: 0,
                    approved: 0,
                    checkedIn: 0,
                    checkedOut: 0,
                    completed: 0,
                    expired: 0,
                    rejected: 0,
                    cancelled: 0,
                    byType: {} as Record<string, number>,
                };
                filtered.forEach(v => {
                    const status = v.status as string;
                    switch (status) {
                        case 'EXPECTED':
                            stats.expected++;
                            break;
                        case 'APPROVED':
                            stats.approved++;
                            break;
                        case 'CHECKED_IN':
                            stats.checkedIn++;
                            break;
                        case 'CHECKED_OUT':
                            stats.checkedOut++;
                            break;
                        case 'COMPLETED':
                            stats.completed++;
                            break;
                        case 'EXPIRED':
                            stats.expired++;
                            break;
                        case 'REJECTED':
                            stats.rejected++;
                            break;
                        case 'CANCELLED':
                            stats.cancelled++;
                            break;
                    }
                    const type = v.type as string;
                    stats.byType[type] = (stats.byType[type] || 0) + 1;
                });
                resolve(stats);
            }, 300);
        });
    },
    async getCurrentInside(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const gateEvents = mockStore.getState().gateEvents || [];
                const presence = currentVisitorPresenceService.derivePresence(visitors, gateEvents, { societyId });
                const formattedPresence = presence.map(p => ({
                    visitorId: p.visitorId,
                    visitorName: p.visitorName,
                    visitorPhone: p.visitorPhone,
                    visitorType: p.visitorType,
                    unitNumber: p.unitNumber,
                    unitId: p.unitId,
                    entryAtIso: p.entryAtIso,
                    entryGateId: p.entryGateId,
                    entryGateName: p.entryGateName,
                    entrySource: p.entrySource,
                    approvalSource: p.approvalSource,
                    expectedExitAtIso: p.expectedExitAtIso,
                    actualExitAtIso: p.actualExitAtIso,
                    vehicleRegistration: p.vehicleRegistration,
                    vehicleType: p.vehicleType,
                    isInside: p.isInside,
                    durationMinutes: p.durationMinutes,
                    isOverdue: p.isOverdue,
                    isExtended: p.isExtended,
                    escalationStatus: p.escalationStatus,
                    lastMovementAtIso: p.lastMovementAtIso,
                }));
                resolve(formattedPresence);
            }, 300);
        });
    },
    async extendVisitorStay(visitorId: string, newExpectedExitAtIso: string, reason: string, extendedBy: string): Promise<any | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const index = visitors.findIndex(v => v.id === visitorId);
                if (index === -1) {
                    reject(new Error('Visitor not found'));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...visitors[index],
                    expectedExitAtIso: newExpectedExitAtIso,
                    exitTracking: {
                        ...visitors[index].exitTracking,
                        exitStatus: 'extended' as any,
                        alertStatus: 'snoozed' as any,
                        extendedExpectedExitAtIso: newExpectedExitAtIso,
                        extensionReason: reason,
                        alertDueAtIso: addMinutesToIso(newExpectedExitAtIso, 30),
                    },
                    escalationStatus: 'NOT_ESCALATED' as any,
                    updatedAt: now,
                };
                mockStore.getState().visitors[index] = updated;
                mockStore.notify();
                resolve(updated);
            }, 500);
        });
    },
    async createEmergencyBypass(payload: {
        gateId: string;
        emergencyType: EmergencyType;
        emergencyDescription: string;
        visitorName: string;
        visitorPhone?: string;
        visitorType: VisitorType;
        flatNumber: string;
        unitId?: string;
        vehicleRegistration?: string;
        vehicleType?: VehicleType;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
    }, guardId: string, guardName: string, societyId: string, idempotencyKey?: string): Promise<{
        visitor: Visitor;
        gateEvent: any;
    } | null> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    const key = idempotencyKey || gateIdempotencyService.generateKey('emergency_bypass', { gateId: payload.gateId, guardId });
                    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, societyId);
                    if (idempotencyResult.exists && idempotencyResult.record?.status === 'COMPLETED') {
                        const visitors = mockStore.getState().visitors || [];
                        const visitor = visitors.find(v => v.id === idempotencyResult.record.entityId);
                        if (visitor) {
                            resolve({ visitor, gateEvent: idempotencyResult.record.responsePayload });
                            return;
                        }
                    }
                    const now = new Date().toISOString();
                    const visitor: Visitor = {
                        id: `vis-${Date.now()}`,
                        name: payload.visitorName,
                        phone: payload.visitorPhone || '',
                        email: undefined,
                        type: payload.visitorType,
                        category: 'emergency',
                        status: 'EMERGENCY_BYPASS',
                        expectedDate: new Date().toISOString().split('T')[0],
                        expectedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                        expectedEntryAtIso: now,
                        expectedExitAtIso: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                        actualEntryAtIso: now,
                        actualExitAtIso: undefined,
                        flatNumber: payload.flatNumber,
                        societyName: '',
                        purpose: payload.emergencyDescription,
                        vehicleNumber: payload.vehicleRegistration,
                        otp: 'EMRGNCY',
                        qrCode: `qr-emergency-${Date.now()}`,
                        qrCodeData: `emergency-${Date.now()}`,
                        qrCodeExpiryAtIso: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                        createdAt: now,
                        createdByUserId: guardId,
                        createdByDisplayName: guardName,
                        visitorCategory: 'emergency',
                        exitTracking: undefined,
                        cancellationReason: undefined,
                        cancellationNotes: undefined,
                        cancelledAt: undefined,
                        cancelledBy: undefined,
                        approvalSource: 'EMERGENCY' as ApprovalSource,
                        approvalStatus: 'EMERGENCY_BYPASS' as VisitorPassStatus,
                        validityWindowMinutes: 240,
                        validityStartAtIso: now,
                        validityEndAtIso: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                        description: payload.emergencyDescription,
                        invitedByResidentId: undefined,
                        invitedByResidentName: undefined,
                        preApprovalId: undefined,
                        deliveryBrand: undefined,
                        deliveryTrackingId: undefined,
                        cabCompany: undefined,
                        cabDriverName: undefined,
                        vendorCompany: undefined,
                        vendorContactPerson: undefined,
                        vendorServiceType: undefined,
                        materialDescription: undefined,
                        materialQuantity: undefined,
                        materialWeightKg: undefined,
                        emergencyType: payload.emergencyType,
                        emergencyDescription: payload.emergencyDescription,
                        emergencyContactName: payload.emergencyContactName,
                        emergencyContactPhone: payload.emergencyContactPhone,
                        gateId: payload.gateId,
                        gateName: '',
                        checkInAtIso: now,
                        checkInGateId: payload.gateId,
                        checkInGateName: '',
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
                        tags: ['emergency'],
                        metadata: { emergencyType: payload.emergencyType, bypassedBy: guardId },
                        societyId,
                        unitId: payload.unitId,
                    };
                    mockStore.getState().visitors?.push(visitor);
                    const gateEvent = {
                        id: `gate-event-${Date.now()}`,
                        eventType: 'EMERGENCY_BYPASS' as GateEventType,
                        gateId: payload.gateId,
                        gateName: '',
                        gateCode: '',
                        visitorId: visitor.id,
                        visitorName: payload.visitorName,
                        visitorPhone: payload.visitorPhone,
                        visitorType: payload.visitorType,
                        visitorPassId: visitor.id,
                        visitorPassCode: 'EMRGNCY',
                        unitId: payload.unitId,
                        unitNumber: payload.flatNumber,
                        flatNumber: payload.flatNumber,
                        eventTimestamp: now,
                        deviceTimestamp: now,
                        guardId,
                        guardName: guardName,
                        guardRole: 'GUARD',
                        entrySource: 'MANUAL' as EntrySource,
                        approvalSource: 'EMERGENCY' as ApprovalSource,
                        vehicleId: payload.vehicleRegistration,
                        vehicleRegistration: payload.vehicleRegistration,
                        vehicleType: payload.vehicleType,
                        vehicleColor: undefined,
                        eventStatus: 'SUCCESS',
                        approvalSource: 'EMERGENCY' as ApprovalSource,
                        approvalStatus: 'EMERGENCY_BYPASS' as VisitorPassStatus,
                        denialReason: undefined,
                        escalationTriggered: false,
                        escalationType: undefined,
                        watchlistMatch: false,
                        watchlistId: undefined,
                        watchlistReason: undefined,
                        emergencyBypassUsed: true,
                        emergencyType: payload.emergencyType,
                        emergencyDescription: payload.emergencyDescription,
                        emergencyContactName: payload.emergencyContactName,
                        emergencyContactPhone: payload.emergencyContactPhone,
                        idempotencyKey: key,
                        deviceId: undefined,
                        deviceInfo: undefined,
                        appVersion: undefined,
                        networkType: undefined,
                        syncStatus: 'SYNCED',
                        createdAt: now,
                        createdBy: guardId,
                        metadata: {},
                        societyId: societyId,
                    };
                    mockStore.getState().visitors?.push(visitor);
                    mockStore.getState().gateEvents?.push(gateEvent);
                    mockStore.notify();
                    await gateIdempotencyService.completeIdempotency(key, societyId, gateEvent.id, gateEvent);
                    const securityUserIds = mockStore.getState().residents
                        ?.filter(r => r.role === 'SECURITY_GUARD' || r.role === 'SECURITY_SUPERVISOR')
                        .map(r => r.id) || [];
                    if (securityUserIds.length > 0) {
                        await visitorNotificationService.sendEmergencyBypass(visitor, payload.gateId, payload.emergencyDescription, securityUserIds, societyId);
                    }
                    createAuditEntry({
                        actorUserId: guardId,
                        actorType: 'GUARD',
                        societyId,
                        action: 'EMERGENCY_BYPASS',
                        entityType: 'VISITOR',
                        entityId: visitor.id,
                        newState: { emergencyType: payload.emergencyType, reason: payload.emergencyDescription, gateId: payload.gateId },
                        idempotencyKey: key,
                        source: 'GATE_DEVICE',
                        outcome: 'SUCCESS',
                    });
                    resolve({ visitor, gateEvent });
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async getVisitorPassByQr(qrCode: string): Promise<any | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const visitor = visitors.find(v => v.qrCode === qrCode || v.qrCodeData?.includes(qrCode));
                if (!visitor) {
                    resolve(null);
                    return;
                }
                const pass = {
                    id: visitor.id,
                    visitorName: visitor.name,
                    visitorPhone: visitor.phone,
                    visitorType: visitor.type,
                    visitingFlat: visitor.flatNumber,
                    residentName: 'Resident',
                    residentPhone: visitor.phone,
                    expectedTime: visitor.expectedTime,
                    expectedDate: visitor.expectedDate,
                    validityWindow: visitor.validityWindowMinutes ? `${visitor.validityWindowMinutes} min` : '4 Hours',
                    otp: visitor.otp,
                    qrCode: visitor.qrCode,
                    qrCodeData: visitor.qrCodeData,
                    qrCodeExpiryAtIso: visitor.qrCodeExpiryAtIso,
                    approvalStatus: visitor.approvalStatus,
                    approvalSource: visitor.approvalSource,
                    vehicleNumber: visitor.vehicleNumber,
                    vehicleType: visitor.vehicleNumber ? 'CAR' as any : undefined,
                    purpose: visitor.purpose,
                    peopleCount: 1,
                    specialInstructions: undefined,
                    watchlistWarning: visitor.watchlistWarning,
                    watchlistId: visitor.watchlistId,
                    watchlistReason: visitor.watchlistReason,
                    previousVisitCount: visitor.previousVisitCount,
                    actualEntryTime: visitor.actualEntryTime,
                    actualExitTime: visitor.actualExitTime,
                    validityStartAtIso: visitor.validityStartAtIso,
                    validityEndAtIso: visitor.validityEndAtIso,
                    validityWindowMinutes: visitor.validityWindowMinutes,
                };
                resolve(pass);
            }, 200);
        });
    },
    async checkAndExpirePasses(societyId: string): Promise<number> {
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                const visitors = mockStore.getState().visitors || [];
                const now = new Date();
                let expiredCount = 0;
                for (const visitor of visitors) {
                    if (visitor.societyId === societyId &&
                        visitor.validityEndAtIso &&
                        new Date(visitor.validityEndAtIso) < now &&
                        ['EXPECTED', 'APPROVED', 'WAITING_APPROVAL', 'PRESENTED'].includes(visitor.status as any)) {
                        if (visitorStateMachine.canTransitionVisitorStatus(visitor.status as VisitorStatus, 'EXPIRED')) {
                            const index = mockStore.getState().visitors?.findIndex(v => v.id === visitor.id);
                            if (index !== undefined && index >= 0) {
                                mockStore.getState().visitors[index] = {
                                    ...visitor,
                                    status: 'EXPIRED' as VisitorStatus,
                                    expiredAtIso: now.toISOString(),
                                    updatedAt: now.toISOString(),
                                };
                                expiredCount++;
                                visitorStateMachine.logTransition({
                                    visitorId: visitor.id,
                                    societyId,
                                    actorUserId: 'SYSTEM',
                                    actorType: 'SYSTEM',
                                    reason: 'Pass expired',
                                }, 'VISITOR', visitor.status, 'EXPIRED', 'VISITOR_EXPIRED');
                                const residentUserIds = mockStore.getState().residents
                                    ?.filter(r => r.flatNumber === visitor.flatNumber)
                                    .map(r => r.id) || [];
                                if (residentUserIds.length > 0) {
                                    await visitorNotificationService.sendVisitorExpired(visitor, residentUserIds, societyId);
                                }
                            }
                        }
                    }
                }
                if (expiredCount > 0) {
                    mockStore.notify();
                }
                resolve(expiredCount);
            }, 300);
        });
    },
    async checkRevocationOnEntry(visitorId: string, societyId: string): Promise<{
        isRevoked: boolean;
        revocationReason?: string;
        revokedAtIso?: string;
        revokedBy?: string;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const visitor = visitors.find(v => v.id === visitorId && v.societyId === societyId);
                if (!visitor) {
                    resolve({ isRevoked: false });
                    return;
                }
                const isRevoked = ['REVOKED', 'CANCELLED'].includes(visitor.status as any);
                resolve({
                    isRevoked,
                    revocationReason: isRevoked ? visitor.revocationReason || visitor.cancellationReason : undefined,
                    revokedAtIso: isRevoked ? visitor.revokedAtIso || visitor.cancelledAt : undefined,
                    revokedBy: isRevoked ? visitor.revokedBy || visitor.cancelledBy : undefined,
                });
            }, 200);
        });
    },
    async getRevokedPasses(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const revoked = visitors.filter(v => v.societyId === societyId &&
                    ['REVOKED', 'CANCELLED'].includes(v.status as any));
                resolve(revoked);
            }, 300);
        });
    },
    async scheduleExpiryCheck(societyId: string, intervalMinutes = 5): Promise<() => void> {
        const interval = setInterval(async () => {
            await this.checkAndExpirePasses(societyId);
        }, intervalMinutes * 60 * 1000);
        return () => clearInterval(interval);
    },
};
function addMinutesToIso(iso: string, minutes: number): string {
    return new Date(new Date(iso).getTime() + minutes * 60 * 1000).toISOString();
}

