import { mockStore } from '../../../core/mockStore/mockStore';
import type { Visitor, VisitorStatus, VisitorPassStatus, VisitorType, VisitorCategory, ApprovalSource, EntrySource, VehicleType, EmergencyType, GateEvent, GateEventType, EntrySource, ApprovalSource, VehicleType, } from '../../../shared/types/visitorPhase8.types';
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
export const visitorExitService = {
    async recordExit(visitorId: string, gateId: string, gateName: string, guardId: string, guardName: string, vehicleRegistration?: string): Promise<{
        visitor: any;
        gateEvent: any;
    } | null> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                const visitors = mockStore.getState().visitors || [];
                const index = visitors.findIndex((v) => v.id === visitorId);
                if (index === -1) {
                    reject(new Error('Visitor not found'));
                    return;
                }
                const visitor = visitors[index];
                if (visitor.status !== 'CHECKED_IN') {
                    reject(new Error(`Cannot check out visitor with status: ${visitor.status}`));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...visitor,
                    status: 'CHECKED_OUT' as const,
                    actualExitAtIso: now,
                    checkOutAtIso: now,
                    checkOutGateId: gateId,
                    checkOutGateName: gateName,
                    updatedAt: now,
                };
                mockStore.getState().visitors[index] = updated;
                const gateEvent = {
                    id: `gate-event-${Date.now()}`,
                    eventType: 'CHECK_OUT' as const,
                    gateId,
                    gateName: '',
                    gateCode: '',
                    visitorId,
                    visitorName: visitor.name,
                    visitorPhone: visitor.phone,
                    visitorType: visitor.type,
                    visitorPassId: visitor.id,
                    visitorPassCode: visitor.otp,
                    unitId: '',
                    unitNumber: '',
                    flatNumber: visitor.flatNumber,
                    eventTimestamp: now,
                    deviceTimestamp: now,
                    guardId: 'guard-id',
                    guardName: 'Guard',
                    guardRole: 'GUARD',
                    entrySource: 'MANUAL' as const,
                    approvalSource: 'PRE_APPROVED' as const,
                    vehicleId: vehicleRegistration,
                    vehicleRegistration: vehicleRegistration,
                    vehicleType: undefined,
                    vehicleColor: undefined,
                    eventStatus: 'SUCCESS',
                    approvalSource: 'PRE_APPROVED' as const,
                    approvalStatus: 'CHECKED_OUT' as const,
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
                    idempotencyKey: generateId('idem'),
                    deviceId: undefined,
                    deviceInfo: undefined,
                    appVersion: undefined,
                    networkType: undefined,
                    syncStatus: 'SYNCED',
                    createdAt: now,
                    createdBy: 'guard-id',
                    metadata: {},
                    societyId: '',
                };
                mockStore.getState().visitors[index] = updated;
                mockStore.getState().gateEvents?.push(gateEvent);
                mockStore.notify();
                createAuditEntry({
                    actorUserId: 'SYSTEM',
                    actorType: 'SYSTEM',
                    societyId: '',
                    action: 'VISITOR_EXIT_NOTIFICATION',
                    entityType: 'VISITOR_EXIT',
                    entityId: visitor.id,
                    newState: { visitorName: visitor.name, exitTime: now },
                    idempotencyKey: `exit_notif_${visitor.id}`,
                    source: 'SYSTEM',
                    outcome: 'SUCCESS',
                });
                resolve({ visitor: updated, gateEvent });
            }, 500);
        });
    },
    async notifyResidentOfExit(visitorId: string, exitTime: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    },
    async getExitHistory(visitorId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                const events = events.filter((e) => e.visitorId === visitorId && e.eventType === 'CHECK_OUT');
                resolve(events);
            }, 300);
        });
    },
    async getCurrentlyInside(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const inside = visitors.filter((v) => v.societyId === societyId && ['CHECKED_IN', 'PRESENTED', 'ESCALATED'].includes(v.status as string));
                const presence = inside.map((v) => ({
                    visitorId: v.id,
                    visitorName: v.name,
                    visitorPhone: v.phone,
                    visitorType: v.type,
                    unitNumber: v.flatNumber,
                    unitId: '',
                    entryAtIso: v.actualEntryAtIso || v.expectedEntryAtIso,
                    entryGateId: v.checkInGateId,
                    entryGateName: v.checkInGateName,
                    entrySource: 'MANUAL' as const,
                    approvalSource: v.approvalSource || 'PRE_APPROVED',
                    expectedExitAtIso: v.expectedExitAtIso,
                    actualExitAtIso: v.actualExitAtIso,
                    vehicleRegistration: v.vehicleNumber,
                    vehicleType: v.vehicleNumber ? 'CAR' as any : undefined,
                    isInside: true,
                    durationMinutes: v.actualEntryAtIso ? Math.floor((Date.now() - new Date(v.actualEntryAtIso).getTime()) / 60000) : 0,
                    isOverdue: v.expectedExitAtIso ? new Date(v.expectedExitAtIso) < new Date() : false,
                    isExtended: v.exitTracking?.exitStatus === 'extended',
                    escalationStatus: v.escalationStatus,
                    lastMovementAtIso: v.actualEntryAtIso,
                }));
                resolve(presence);
            }, 300);
        });
    },
    async notifyResidentOfEntry(visitorId: string, entryTime: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    },
    async notifyResidentOfExit(visitorId: string, exitTime: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    },
    async notifyResidentOfOverdue(visitorId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    },
    async getOverdueVisitors(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const now = new Date();
                const overdue = visitors.filter((v) => v.societyId === societyId &&
                    v.status === 'CHECKED_IN' &&
                    v.expectedExitAtIso &&
                    new Date(v.expectedExitAtIso) < now);
                const overdue = visitors.filter((v) => v.societyId === societyId &&
                    v.status === 'CHECKED_IN' &&
                    v.expectedExitAtIso &&
                    new Date(v.expectedExitAtIso) < now).map((v) => ({
                    visitorId: v.id,
                    visitorName: v.name,
                    visitorPhone: v.phone,
                    visitorType: v.type,
                    unitNumber: v.flatNumber,
                    unitId: v.unitId || '',
                    entryAtIso: v.actualEntryAtIso || v.expectedEntryAtIso,
                    entryGateId: v.checkInGateId,
                    entryGateName: v.checkInGateName,
                    expectedExitAtIso: v.expectedExitAtIso,
                    overdueMinutes: v.expectedExitAtIso ? Math.floor((Date.now() - new Date(v.expectedExitAtIso).getTime()) / 60000) : 0,
                    vehicleRegistration: v.vehicleNumber,
                    vehicleType: v.vehicleNumber ? 'CAR' as any : undefined,
                    isExtended: v.exitTracking?.exitStatus === 'extended',
                    escalationStatus: v.escalationStatus,
                }));
                resolve(overdue);
            }, 300);
        });
    },
    async notifyResidentOfOverdue(visitorId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    },
};


