import { mockStore } from '../../../core/mockStore/mockStore';
import type { Gate, CreateGatePayload, GateEvent, CreateGateEventPayload, GateEventType, GateType, GateStatus, EntrySource, ApprovalSource, VisitorVehicle, CreateVisitorVehiclePayload, CurrentVisitorPresence, VisitorType, VehicleType, VisitorPassStatus, } from '../../../shared/types/visitorPhase8.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { mockStore } from '../../../core/mockStore/mockStore';
import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import { currentVisitorPresenceService } from './currentVisitorPresenceService';
import { gateIdempotencyService } from './gateIdempotencyService';
import { visitorStateMachine } from './visitorStateMachine';
const withMockDelay = <T>(data: T, ms = 400): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), ms));
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
export const gateService = {
    async getAllGates(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const gates = mockStore.getState().gates || [];
                const filtered = gates.filter(g => g.societyId === societyId);
                resolve(filtered);
            }, 300);
        });
    },
    async getGate(gateId: string): Promise<any | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const gates = mockStore.getState().gates || [];
                const gate = gates.find(g => g.id === gateId);
                resolve(gate || null);
            }, 200);
        });
    },
    async getActiveGates(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const gates = mockStore.getState().gates || [];
                const filtered = gates.filter(g => g.societyId === societyId && g.status === 'ACTIVE');
                resolve(filtered);
            }, 300);
        });
    },
    async createGate(payload: CreateGatePayload, createdBy: string, societyId: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString();
                const gate = {
                    id: `gate-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    name: payload.name,
                    code: payload.code,
                    type: payload.type,
                    status: 'ACTIVE',
                    location: payload.location,
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    allowedVisitorTypes: payload.allowedVisitorTypes,
                    allowedEntrySources: payload.allowedEntrySources,
                    requiresGuard: payload.requiresGuard,
                    hasBarrier: payload.hasBarrier,
                    hasQrScanner: payload.hasQrScanner,
                    hasOtpReader: payload.hasOtpReader,
                    hasNfcReader: payload.hasNfcReader,
                    hasRfidReader: payload.hasRfidReader,
                    emergencyBypassEnabled: payload.emergencyBypassEnabled,
                    maxConcurrentVisitors: payload.maxConcurrentVisitors,
                    currentOccupancy: 0,
                    operatingHoursStart: payload.operatingHoursStart,
                    operatingHoursEnd: payload.operatingHoursEnd,
                    is24Hours: payload.is24Hours,
                    assignedGuards: payload.assignedGuards,
                    supervisorId: payload.supervisorId,
                    createdAt: now,
                    updatedAt: now,
                    createdBy,
                    metadata: {},
                    societyId,
                };
                mockStore.getState().gates?.push(gate);
                mockStore.notify();
                resolve(gate);
            }, 500);
        });
    },
    async updateGate(gateId: string, updates: Partial<any>): Promise<any | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const gates = mockStore.getState().gates || [];
                const index = gates.findIndex(g => g.id === gateId);
                if (index === -1) {
                    resolve(null);
                    return;
                }
                const updated = { ...gates[index], ...updates, updatedAt: new Date().toISOString() };
                mockStore.getState().gates[index] = updated;
                mockStore.notify();
                resolve(updated);
            }, 400);
        });
    },
    async deleteGate(gateId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const gates = mockStore.getState().gates || [];
                const index = gates.findIndex(g => g.id === gateId);
                if (index === -1) {
                    resolve(false);
                    return;
                }
                mockStore.getState().gates.splice(index, 1);
                mockStore.notify();
                resolve(true);
            }, 400);
        });
    },
    async getGatesByType(societyId: string, type: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const gates = mockStore.getState().gates || [];
                const filtered = gates.filter(g => g.societyId === societyId && g.type === type);
                resolve(filtered);
            }, 300);
        });
    },
    async recordGateEvent(payload: CreateGateEventPayload, guardId: string, guardName: string, guardRole: string, societyId: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    const events = mockStore.getState().gateEvents || [];
                    const existingEvent = events.find(e => e.idempotencyKey === payload.idempotencyKey);
                    if (existingEvent) {
                        resolve({ ...existingEvent, duplicate: true });
                        return;
                    }
                    const now = new Date().toISOString();
                    const event = {
                        id: `gate-event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        eventType: payload.eventType,
                        gateId: payload.gateId,
                        gateName: '',
                        gateCode: '',
                        visitorId: payload.visitorId,
                        visitorName: payload.visitorName,
                        visitorPhone: payload.visitorPhone,
                        visitorType: payload.visitorType,
                        visitorPassId: payload.visitorPassId,
                        visitorPassCode: payload.visitorPassCode,
                        unitId: payload.unitId,
                        unitNumber: '',
                        flatNumber: payload.flatNumber,
                        eventTimestamp: payload.eventTimestamp || new Date().toISOString(),
                        deviceTimestamp: payload.deviceTimestamp,
                        guardId: guardId,
                        guardName: guardName,
                        guardRole: guardRole,
                        entrySource: payload.entrySource,
                        approvalSource: payload.approvalSource,
                        vehicleId: payload.vehicleRegistration,
                        vehicleRegistration: payload.vehicleRegistration,
                        vehicleType: payload.vehicleType,
                        vehicleColor: payload.vehicleColor,
                        eventStatus: 'SUCCESS',
                        approvalSource: payload.approvalSource,
                        approvalStatus: undefined,
                        denialReason: undefined,
                        escalationTriggered: false,
                        escalationType: undefined,
                        watchlistMatch: false,
                        watchlistId: undefined,
                        watchlistReason: undefined,
                        emergencyBypassUsed: payload.eventType === 'EMERGENCY_BYPASS',
                        emergencyType: payload.emergencyType,
                        emergencyDescription: payload.emergencyDescription,
                        emergencyContactName: payload.emergencyContactName,
                        emergencyContactPhone: payload.emergencyContactPhone,
                        idempotencyKey: payload.idempotencyKey,
                        deviceId: payload.deviceId,
                        deviceInfo: payload.deviceInfo,
                        appVersion: payload.appVersion,
                        networkType: payload.networkType,
                        syncStatus: 'SYNCED',
                        createdAt: now,
                        createdBy: guardId,
                        metadata: {},
                        societyId: societyId,
                    };
                    mockStore.getState().gateEvents?.push(event);
                    mockStore.notify();
                    createAuditEntry({
                        actorUserId: guardId,
                        actorType: 'GUARD',
                        societyId,
                        action: `GATE_EVENT_${payload.eventType}`,
                        entityType: 'GATE_EVENT',
                        entityId: event.id,
                        newState: { eventType: payload.eventType, gateId: payload.gateId, visitorId: payload.visitorId },
                        idempotencyKey: payload.idempotencyKey,
                        source: 'GATE_DEVICE',
                        outcome: 'SUCCESS',
                    });
                    resolve(event);
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async getGateEvents(gateId: string, dateFrom?: string, dateTo?: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                let filtered = events.filter(e => e.gateId === gateId);
                if (dateFrom) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) >= new Date(dateFrom));
                }
                if (dateTo) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) <= new Date(dateTo));
                }
                resolve(filtered.sort((a, b) => new Date(b.eventTimestamp).getTime() - new Date(a.eventTimestamp).getTime()));
            }, 300);
        });
    },
    async getEventsByVisitor(visitorId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                const filtered = events.filter(e => e.visitorId === visitorId);
                resolve(filtered.sort((a, b) => new Date(b.eventTimestamp).getTime() - new Date(a.eventTimestamp).getTime()));
            }, 300);
        });
    },
    async getEventsByUnit(unitId: string, dateFrom?: string, dateTo?: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                let filtered = events.filter(e => e.unitId === unitId);
                if (dateFrom) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) >= new Date(dateFrom));
                }
                if (dateTo) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) <= new Date(dateTo));
                }
                resolve(filtered.sort((a, b) => new Date(b.eventTimestamp).getTime() - new Date(a.eventTimestamp).getTime()));
            }, 300);
        });
    },
    async getCurrentOccupancy(gateId: string): Promise<number> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                const gateEvents = events.filter(e => e.gateId === gateId);
                let occupancy = 0;
                gateEvents.forEach(e => {
                    if (['CHECK_IN', 'WALK_IN_REGISTRATION', 'EMERGENCY_BYPASS'].includes(e.eventType)) {
                        occupancy++;
                    }
                    else if (['CHECK_OUT'].includes(e.eventType)) {
                        occupancy = Math.max(0, occupancy - 1);
                    }
                });
                resolve(Math.max(0, occupancy));
            }, 200);
        });
    },
    async getCurrentPresence(societyId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const gateEvents = mockStore.getState().gateEvents || [];
                const presence = currentVisitorPresenceService.derivePresence(visitors, gateEvents);
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
    async getVisitorVehicles(visitorId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const vehicles = mockStore.getState().visitorVehicles || [];
                const filtered = vehicles.filter(v => v.visitorId === visitorId);
                resolve(filtered);
            }, 300);
        });
    },
    async associateVehicle(payload: CreateVisitorVehiclePayload): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString();
                const vehicle = {
                    id: `veh-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    visitorId: payload.visitorId,
                    visitorPassId: payload.visitorPassId,
                    registrationNumber: payload.registrationNumber,
                    vehicleType: payload.vehicleType,
                    color: payload.color,
                    make: payload.make,
                    model: payload.model,
                    driverName: payload.driverName,
                    driverPhone: payload.driverPhone,
                    driverLicenseNumber: payload.driverLicenseNumber,
                    status: 'ACTIVE',
                    entryAtIso: undefined,
                    entryGateId: undefined,
                    entryGateName: undefined,
                    exitAtIso: undefined,
                    exitGateId: undefined,
                    exitGateName: undefined,
                    parkingSlotId: payload.parkingSlotId,
                    parkingSlotNumber: undefined,
                    isVisitorVehicle: payload.isVisitorVehicle,
                    isResidentVehicle: payload.isResidentVehicle,
                    residentId: payload.residentId,
                    parkingSlotId: payload.parkingSlotId,
                    createdAt: now,
                    updatedAt: now,
                    createdBy: 'current-user',
                    metadata: {},
                    societyId: 'society-id',
                };
                mockStore.getState().visitorVehicles?.push(vehicle);
                mockStore.notify();
                resolve(vehicle);
            }, 500);
        });
    },
    async updateVehicleStatus(vehicleId: string, status: string, updates: any = {}): Promise<any | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const vehicles = mockStore.getState().visitorVehicles || [];
                const index = vehicles.findIndex(v => v.id === vehicleId);
                if (index === -1) {
                    resolve(null);
                    return;
                }
                const updated = {
                    ...vehicles[index],
                    status: status as any,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
                mockStore.getState().visitorVehicles[index] = updated;
                mockStore.notify();
                resolve(updated);
            }, 300);
        });
    },
    async getVehiclesByGate(gateId: string, dateFrom?: string, dateTo?: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                const gateEvents = events.filter(e => e.gateId === gateId && e.vehicleRegistration);
                let filtered = gateEvents;
                if (dateFrom) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) >= new Date(dateFrom));
                }
                if (dateTo) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) <= new Date(dateTo));
                }
                const vehicles = new Map();
                filtered.forEach(e => {
                    if (e.vehicleRegistration && !vehicles.has(e.vehicleRegistration)) {
                        vehicles.set(e.vehicleRegistration, {
                            registrationNumber: e.vehicleRegistration,
                            vehicleType: e.vehicleType,
                            entryCount: (vehicles.get(e.vehicleRegistration)?.entryCount || 0) + 1,
                            lastEntryAt: e.eventTimestamp,
                            lastGateId: e.gateId,
                            lastGateName: e.gateName,
                        });
                    }
                });
                resolve(Array.from(vehicles.values()));
            }, 300);
        });
    },
    async getGateStats(gateId: string, dateFrom?: string, dateTo?: string): Promise<{
        totalEntries: number;
        totalExits: number;
        currentlyInside: number;
        deniedEntries: number;
        byType: Record<string, number>;
        byHour: Record<string, number>;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = mockStore.getState().gateEvents || [];
                let filtered = events.filter(e => e.gateId === gateId);
                if (dateFrom) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) >= new Date(dateFrom));
                }
                if (dateTo) {
                    filtered = filtered.filter(e => new Date(e.eventTimestamp) <= new Date(dateTo));
                }
                const stats = {
                    totalEntries: 0,
                    totalExits: 0,
                    currentlyInside: 0,
                    deniedEntries: 0,
                    byType: {} as Record<string, number>,
                    byHour: {} as Record<string, number>,
                };
                filtered.forEach(e => {
                    const hour = new Date(e.eventTimestamp).getHours().toString().padStart(2, '0');
                    stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
                    if (e.visitorType) {
                        stats.byType[e.visitorType] = (stats.byType[e.visitorType] || 0) + 1;
                    }
                    if (['CHECK_IN', 'WALK_IN_REGISTRATION', 'EMERGENCY_BYPASS'].includes(e.eventType)) {
                        stats.totalEntries++;
                    }
                    else if (e.eventType === 'CHECK_OUT') {
                        stats.totalExits++;
                    }
                    else if (e.eventType === 'DENIED' || e.eventType === 'DENIED_ENTRY') {
                        stats.deniedEntries++;
                    }
                });
                const visitors = mockStore.getState().visitors || [];
                stats.currentlyInside = visitors.filter(v => v.checkInGateId === gateId &&
                    ['CHECKED_IN', 'PRESENTED', 'ESCALATED'].includes(v.status as any)).length;
                resolve(stats);
            }, 300);
        });
    },
};
export const gateMockSource = {
    async getAllGates(societyId: string): Promise<any> {
        const gates = mockStore.getState().gates || [];
        const filtered = gates.filter(g => g.societyId === societyId);
        return { success: true, data: filtered };
    },
    async getGate(gateId: string): Promise<any> {
        const gates = mockStore.getState().gates || [];
        const gate = gates.find(g => g.id === gateId);
        return { success: true, data: gate || null };
    },
    async createGate(payload: any, createdBy: string, societyId: string): Promise<any> {
        const now = new Date().toISOString();
        const gate = {
            id: `gate-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: payload.name,
            code: payload.code,
            type: payload.type,
            status: 'ACTIVE',
            location: payload.location,
            latitude: payload.latitude,
            longitude: payload.longitude,
            allowedVisitorTypes: payload.allowedVisitorTypes,
            allowedEntrySources: payload.allowedEntrySources,
            requiresGuard: payload.requiresGuard,
            hasBarrier: payload.hasBarrier,
            hasQrScanner: payload.hasQrScanner,
            hasOtpReader: payload.hasOtpReader,
            hasNfcReader: payload.hasNfcReader,
            hasRfidReader: payload.hasRfidReader,
            emergencyBypassEnabled: payload.emergencyBypassEnabled,
            maxConcurrentVisitors: payload.maxConcurrentVisitors,
            currentOccupancy: 0,
            operatingHoursStart: payload.operatingHoursStart,
            operatingHoursEnd: payload.operatingHoursEnd,
            is24Hours: payload.is24Hours,
            assignedGuards: payload.assignedGuards,
            supervisorId: payload.supervisorId,
            createdAt: now,
            updatedAt: now,
            createdBy,
            metadata: {},
            societyId,
        };
        mockStore.getState().gates?.push(gate);
        return { success: true, data: gate };
    },
    async updateGate(gateId: string, updates: any): Promise<any> {
        const gates = mockStore.getState().gates || [];
        const index = gates.findIndex(g => g.id === gateId);
        if (index === -1) {
            return { success: false, error: 'Gate not found' };
        }
        const updated = { ...gates[index], ...updates, updatedAt: new Date().toISOString() };
        gates[index] = updated;
        return { success: true, data: updated };
    },
    async deleteGate(gateId: string): Promise<any> {
        const gates = mockStore.getState().gates || [];
        const index = gates.findIndex(g => g.id === gateId);
        if (index === -1) {
            return { success: false, error: 'Gate not found' };
        }
        gates.splice(index, 1);
        return { success: true };
    },
    async getGateEvents(gateId: string, dateFrom?: string, dateTo?: string): Promise<any> {
        const events = mockStore.getState().gateEvents || [];
        let filtered = events.filter(e => e.gateId === gateId);
        if (dateFrom) {
            filtered = filtered.filter(e => new Date(e.eventTimestamp) >= new Date(dateFrom));
        }
        if (dateTo) {
            filtered = filtered.filter(e => new Date(e.eventTimestamp) <= new Date(dateTo));
        }
        filtered.sort((a, b) => new Date(b.eventTimestamp).getTime() - new Date(a.eventTimestamp).getTime());
        return { success: true, data: filtered };
    },
    async recordGateEvent(payload: any, guardId: string, guardName: string, guardRole: string, societyId: string): Promise<any> {
        const now = new Date().toISOString();
        const event = {
            id: `gate-event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            eventType: payload.eventType,
            gateId: payload.gateId,
            gateName: '',
            gateCode: '',
            visitorId: payload.visitorId,
            visitorName: payload.visitorName,
            visitorPhone: payload.visitorPhone,
            visitorType: payload.visitorType,
            visitorPassId: payload.visitorPassId,
            visitorPassCode: payload.visitorPassCode,
            unitId: payload.unitId,
            unitNumber: '',
            flatNumber: payload.flatNumber,
            eventTimestamp: payload.eventTimestamp || new Date().toISOString(),
            deviceTimestamp: payload.deviceTimestamp,
            guardId: 'guard-id',
            guardName: 'Guard',
            guardRole: 'GUARD',
            entrySource: payload.entrySource,
            approvalSource: payload.approvalSource,
            vehicleId: payload.vehicleRegistration,
            vehicleRegistration: payload.vehicleRegistration,
            vehicleType: payload.vehicleType,
            vehicleColor: payload.vehicleColor,
            eventStatus: 'SUCCESS',
            approvalSource: payload.approvalSource,
            approvalStatus: undefined,
            denialReason: undefined,
            escalationTriggered: false,
            escalationType: undefined,
            watchlistMatch: false,
            watchlistId: undefined,
            watchlistReason: undefined,
            emergencyBypassUsed: payload.eventType === 'EMERGENCY_BYPASS',
            emergencyType: payload.emergencyType,
            emergencyDescription: payload.emergencyDescription,
            emergencyContactName: payload.emergencyContactName,
            emergencyContactPhone: payload.emergencyContactPhone,
            idempotencyKey: payload.idempotencyKey,
            deviceId: payload.deviceId,
            deviceInfo: payload.deviceInfo,
            appVersion: payload.appVersion,
            networkType: payload.networkType,
            syncStatus: 'SYNCED',
            createdAt: now,
            createdBy: 'guard-id',
            metadata: {},
            societyId,
        };
        mockStore.getState().gateEvents?.push(event);
        return { success: true, data: event };
    },
    async getCurrentOccupancy(gateId: string): Promise<any> {
        const events = mockStore.getState().gateEvents || [];
        const gateEvents = events.filter(e => e.gateId === gateId);
        let occupancy = 0;
        gateEvents.forEach(e => {
            if (['CHECK_IN', 'WALK_IN_REGISTRATION', 'EMERGENCY_BYPASS'].includes(e.eventType)) {
                occupancy++;
            }
            else if (['CHECK_OUT'].includes(e.eventType)) {
                occupancy = Math.max(0, occupancy - 1);
            }
        });
        return { success: true, data: Math.max(0, occupancy) };
    },
    async getCurrentPresence(societyId: string): Promise<any> {
        const visitors = mockStore.getState().visitors || [];
        const gateEvents = mockStore.getState().gateEvents || [];
        const presence = currentVisitorPresenceService.derivePresence(visitors, gateEvents);
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
        return { success: true, data: formattedPresence };
    },
    async getVisitorVehicles(visitorId: string): Promise<any> {
        const vehicles = mockStore.getState().visitorVehicles || [];
        const filtered = vehicles.filter(v => v.visitorId === visitorId);
        return { success: true, data: filtered };
    },
    async associateVehicle(payload: any): Promise<any> {
        const now = new Date().toISOString();
        const vehicle = {
            id: `veh-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            visitorId: payload.visitorId,
            visitorPassId: payload.visitorPassId,
            registrationNumber: payload.registrationNumber,
            vehicleType: payload.vehicleType,
            color: payload.color,
            make: payload.make,
            model: payload.model,
            driverName: payload.driverName,
            driverPhone: payload.driverPhone,
            driverLicenseNumber: payload.driverLicenseNumber,
            status: 'ACTIVE',
            entryAtIso: undefined,
            entryGateId: undefined,
            entryGateName: undefined,
            exitAtIso: undefined,
            exitGateId: undefined,
            exitGateName: undefined,
            parkingSlotId: payload.parkingSlotId,
            parkingSlotNumber: undefined,
            isVisitorVehicle: payload.isVisitorVehicle,
            isResidentVehicle: payload.isResidentVehicle,
            residentId: payload.residentId,
            parkingSlotId: payload.parkingSlotId,
            createdAt: now,
            updatedAt: now,
            createdBy: 'current-user',
            metadata: {},
            societyId: 'society-id',
        };
        mockStore.getState().visitorVehicles?.push(vehicle);
        return { success: true, data: vehicle };
    },
    async updateVehicleStatus(vehicleId: string, status: string, updates: any = {}): Promise<any> {
        const vehicles = mockStore.getState().visitorVehicles || [];
        const index = vehicles.findIndex(v => v.id === vehicleId);
        if (index === -1) {
            return { success: false, error: 'Vehicle not found' };
        }
        const updated = {
            ...vehicles[index],
            status: status as any,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        vehicles[index] = updated;
        return { success: true, data: updated };
    },
};

