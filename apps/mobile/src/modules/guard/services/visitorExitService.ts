import { mockStore } from '../../../core/mockStore/mockStore';
import type { Visitor, VisitorStatus, VisitorPassStatus, VisitorType, VisitorCategory, ApprovalSource, EntrySource, VehicleType, EmergencyType, GateEvent, GateEventType } from '../../../shared/types/visitorPhase8.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { repositorySuccess, type RepositoryResult } from '../../../core/repositories/repository.types';
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
                const visitor = visitors[index]!;
                if (visitor.status !== 'CHECKED_IN') {
                    reject(new Error(`Cannot check out visitor with status: ${visitor.status}`));
                    return;
                }
                const now = new Date().toISOString();
                const updated: Visitor = {
                    ...visitor,
                    status: 'CHECKED_OUT' as const,
                    actualExitAtIso: now,
                    checkOutAtIso: now,
                    checkOutGateId: gateId,
                    checkOutGateName: gateName,
                    updatedAt: now,
                };
                mockStore.updateVisitor(visitor.id, updated);
                mockStore.addGateLog({
                    id: `gate-log-${Date.now()}`,
                    visitorId: visitor.id,
                    visitorName: visitor.name,
                    entryTime: visitor.actualEntryTime || now,
                    exitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    guardName: guardName || 'Security Guard',
                    gateNumber: gateName || gateId || 'Gate 1',
                    flatNumber: visitor.flatNumber,
                    visitorType: visitor.type,
                });
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
                    approvalStatus: 'CHECKED_OUT' as const,
                    ...(vehicleRegistration ? { vehicleId: vehicleRegistration, vehicleRegistration } : {}),
                    eventStatus: 'SUCCESS',
                    escalationTriggered: false,
                    watchlistMatch: false,
                    emergencyBypassUsed: false,
                    idempotencyKey: generateId('idem'),
                    syncStatus: 'SYNCED',
                    createdAt: now,
                    createdBy: 'guard-id',
                    metadata: {},
                    societyId: '',
                };
                const vList = mockStore.getState().visitors;
                if (vList && vList[index]) {
                    vList[index] = updated;
                }
                const gEvents = mockStore.getState().gateEvents;
                if (gEvents) {
                    gEvents.push(gateEvent as any);
                }
                mockStore.notify();
                createAuditEntry({
                    actorUserId: 'SYSTEM',
                    actorType: 'SYSTEM',
                    societyId: '',
                    action: 'VISITOR_EXIT_NOTIFICATION',
                    entityType: 'GateEvent',
                    entityId: visitor.id,
                    newState: { visitorName: visitor.name, exitTime: now },
                    idempotencyKey: `exit_notif_${visitor.id}`,
                    source: 'GATE_DEVICE',
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
                const allEvents = mockStore.getState().gateEvents || [];
                const filtered = allEvents.filter((e) => e.visitorId === visitorId && e.eventType === 'CHECK_OUT');
                resolve(filtered);
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
                    ...(v.vehicleNumber ? { vehicleType: 'CAR' as const } : {}),
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
                    ...(v.vehicleNumber ? { vehicleType: 'CAR' as const } : {}),
                    isExtended: v.exitTracking?.exitStatus === 'extended',
                    escalationStatus: v.escalationStatus,
                }));
                resolve(overdue);
            }, 300);
        });
    },
};


