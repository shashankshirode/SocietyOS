import { useState, useEffect, useCallback } from 'react';
import type { Visitor, VisitorType, VisitorStatus } from '../../../../shared/types/visitor.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import { walkInApprovalService } from '../../../guard/services/walkInApprovalService';
import type { VisitorApprovalRequest } from '../../../../shared/types/visitorPhase8.types';

function mapStoreVisitorToActiveRecord(v: Visitor): ActiveVisitorRecord {
    return {
        id: v.id,
        passCode: v.otp || v.id.slice(-6).toUpperCase(),
        name: v.name,
        phone: v.phone,
        type: v.type,
        purpose: v.purpose || 'Visit',
        flatNumber: v.flatNumber || 'A-1204',
        tower: v.flatNumber ? `Tower ${v.flatNumber[0] || 'A'}` : 'Tower A',
        expectedWindow: `${v.expectedDate || 'Today'} · ${v.expectedTime || '10:00 AM'}`,
        status: v.status,
        ...(v.actualEntryTime ? { entryTime: v.actualEntryTime } : {}),
        ...(v.actualExitTime ? { exitTime: v.actualExitTime } : {}),
        qrPayload: `SOC-OS:PASS:${v.otp || v.id}:${v.name.toUpperCase()}:${v.flatNumber || 'A-1204'}`,
        createdAt: v.createdAt || new Date().toISOString(),
        ...(v.vehicleNumber ? { vehicleNumber: v.vehicleNumber } : {}),
    };
}
export interface VisitorPassDraft {
    id?: string;
    name: string;
    phone: string;
    type: VisitorType;
    purpose: string;
    expectedDate: string;
    expectedTimeFrom: string;
    expectedTimeTo: string;
    durationHours: number;
    isRecurring: boolean;
    recurringFrequency?: 'Daily' | 'Weekly' | 'Custom';
    hasVehicle: boolean;
    vehicleType?: 'Car' | 'Bike' | 'Other';
    vehicleNumber?: string;
    vehicleColor?: string;
    flatNumber: string;
    tower: string;
    notes?: string;
}
export interface GateActivityEvent {
    id: string;
    visitorPassId: string;
    visitorName: string;
    visitorType: VisitorType;
    flatNumber: string;
    gateId: string;
    gateName?: string;
    eventType: 'ENTRY' | 'EXIT' | 'DENIED' | 'EMERGENCY_BYPASS';
    timestampIso: string;
    vehicleNumber?: string;
    guardName: string;
    bypassReason?: string;
    isOfflineQueued?: boolean;
}
export interface ActiveVisitorRecord {
    id: string;
    passCode: string;
    name: string;
    phone: string;
    type: VisitorType;
    purpose: string;
    flatNumber: string;
    tower: string;
    expectedWindow: string;
    vehicleNumber?: string;
    status: VisitorStatus;
    entryTime?: string;
    entryGate?: string;
    exitTime?: string;
    exitGate?: string;
    durationString?: string;
    qrPayload: string;
    createdAt: string;
    walkInApprovalState?: 'PENDING_RESIDENT' | 'APPROVED' | 'DENIED' | 'UNREACHABLE';
}
export type VisitorPassRecord = ActiveVisitorRecord;
export interface ParcelCustodyRecord {
    id: string;
    unitId: string;
    flatNumber: string;
    recipientName: string;
    deliveryPartner: string;
    trackingNumber?: string;
    receivedAt: string;
    guardName: string;
    gateName: string;
    status: 'WAITING_COLLECTION' | 'COLLECTED' | 'RETURNED';
    collectedAt?: string;
    collectedBy?: string;
}
const INITIAL_PARCELS: ParcelCustodyRecord[] = [
    {
        id: 'pkg-001',
        unitId: 'unit_402',
        flatNumber: 'A-1204',
        recipientName: 'Aarav Sharma',
        deliveryPartner: 'Amazon Delivery',
        trackingNumber: 'AMZ-IN-889421',
        receivedAt: 'Today · 2:15 PM',
        guardName: 'Ramesh Shinde',
        gateName: 'Gate 01',
        status: 'WAITING_COLLECTION',
    },
    {
        id: 'pkg-002',
        unitId: 'unit_402',
        flatNumber: 'A-1204',
        recipientName: 'Aarav Sharma',
        deliveryPartner: 'Blue Dart Courier',
        trackingNumber: 'BD-882190',
        receivedAt: 'Yesterday · 11:30 AM',
        guardName: 'Ramesh Shinde',
        gateName: 'Gate 01',
        status: 'COLLECTED',
        collectedAt: 'Yesterday · 6:00 PM',
        collectedBy: 'Aarav Sharma',
    },
];
const INITIAL_VISITORS: ActiveVisitorRecord[] = [
    {
        id: 'pass-001',
        passCode: 'GH-902',
        name: 'Rahul Kulkarni',
        phone: '+91 98200 11234',
        type: 'GUEST',
        purpose: 'Dinner & Family Visit',
        flatNumber: 'A-1204',
        tower: 'Tower A',
        expectedWindow: 'Today · 7:00 PM – 10:00 PM',
        vehicleNumber: 'MH 12 QX 4048',
        status: 'APPROVED',
        qrPayload: 'SOC-OS:PASS:GH-902:RAHUL:A-1204',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'vis-2',
        passCode: 'GH-903',
        name: 'Amazon Delivery',
        phone: '+91 98111 22334',
        type: 'DELIVERY',
        purpose: 'Package Delivery',
        flatNumber: 'A-1204',
        tower: 'Tower A',
        expectedWindow: 'Today · 2:00 PM – 4:00 PM',
        status: 'APPROVED',
        qrPayload: 'SOC-OS:PASS:GH-903:AMAZON:A-1204',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'vis-3',
        passCode: 'GH-880',
        name: 'Priya Shah',
        phone: '+91 98333 44556',
        type: 'GUEST',
        purpose: 'Casual visit',
        flatNumber: 'A-1204',
        tower: 'Tower A',
        expectedWindow: 'Yesterday · 6:20 PM – 8:30 PM',
        vehicleNumber: 'MH 14 CD 9988',
        status: 'CHECKED_OUT',
        entryTime: '6:20 PM',
        entryGate: 'Gate 01',
        exitTime: '8:05 PM',
        exitGate: 'Gate 01',
        durationString: '1h 45m',
        qrPayload: 'SOC-OS:PASS:GH-880:PRIYA:A-1204',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'pass-expired-001',
        passCode: 'EX-401',
        name: 'Karan Mehra',
        phone: '+91 98444 55667',
        type: 'GUEST',
        purpose: 'Past visit',
        flatNumber: 'A-1204',
        tower: 'Tower A',
        expectedWindow: 'Yesterday · 10:00 AM – 1:00 PM',
        status: 'EXPIRED',
        qrPayload: 'SOC-OS:PASS:EX-401:KARAN:A-1204',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'pass-revoked-001',
        passCode: 'RV-502',
        name: 'Vikram Joshi',
        phone: '+91 98555 66778',
        type: 'VENDOR',
        purpose: 'Cancelled work',
        flatNumber: 'A-1204',
        tower: 'Tower A',
        expectedWindow: 'Today · 11:00 AM – 2:00 PM',
        status: 'CANCELLED',
        qrPayload: 'SOC-OS:PASS:RV-502:VIKRAM:A-1204',
        createdAt: new Date().toISOString(),
    },
];
let globalVisitors: ActiveVisitorRecord[] = [...INITIAL_VISITORS];
let globalParcels: ParcelCustodyRecord[] = [...INITIAL_PARCELS];
let globalGateLogs: GateActivityEvent[] = [];
let globalOfflineQueue: GateActivityEvent[] = [];
let globalOfflineMode = false;
let globalListeners: (() => void)[] = [];
function notifyListeners() {
    globalListeners.forEach((l) => l());
}
export const visitorLifecycleStore = {
    getVisitors: () => {
        const storeVisitors = mockStore.getState().visitors.map(mapStoreVisitorToActiveRecord);
        const existingIds = new Set(globalVisitors.map(v => v.id));
        const merged = [...globalVisitors];
        for (const sv of storeVisitors) {
            if (!existingIds.has(sv.id)) {
                merged.push(sv);
            } else {
                const idx = merged.findIndex(v => v.id === sv.id);
                const target = idx !== -1 ? merged[idx] : undefined;
                if (target && idx !== -1) merged[idx] = { ...target, status: sv.status };
            }
        }
        return merged;
    },
    getGateLogs: () => [...globalGateLogs],
    getOfflineQueue: () => [...globalOfflineQueue],
    createPass: (draft: Partial<VisitorPassDraft> & { name?: string; visitorName?: string }): ActiveVisitorRecord => {
        const randomNum = Math.floor(100 + Math.random() * 900);
        const passCode = `GH-${randomNum}`;
        const name = draft.name || (draft as unknown as { visitorName?: string }).visitorName || 'Visitor';
        const rawType = (draft.type as string) || 'guest';
        const type = rawType.toUpperCase() as ActiveVisitorRecord['type'];
        const timeFrom = draft.expectedTimeFrom || '10:00 AM';
        const timeTo = draft.expectedTimeTo || '12:00 PM';
        const expectedDate = draft.expectedDate || '2026-07-15';
        const newRecord: ActiveVisitorRecord = {
            id: `vis-${Date.now()}`,
            passCode,
            name,
            phone: draft.phone || '9876543210',
            type,
            purpose: draft.purpose || 'Visit',
            flatNumber: draft.flatNumber || 'A-1204',
            tower: draft.tower || 'Tower A',
            expectedWindow: `${expectedDate} · ${timeFrom} – ${timeTo}`,
            ...((draft.hasVehicle || draft.vehicleNumber) && draft.vehicleNumber ? { vehicleNumber: draft.vehicleNumber } : {}),
            status: 'APPROVED',
            qrPayload: `SOC-OS:PASS:${passCode}:${name.toUpperCase()}:${draft.flatNumber || 'A-1204'}`,
            createdAt: new Date().toISOString(),
        };
        globalVisitors = [newRecord, ...globalVisitors];
        mockStore.addVisitor({
            id: newRecord.id,
            name: newRecord.name,
            phone: newRecord.phone,
            type: newRecord.type,
            status: newRecord.status,
            flatNumber: newRecord.flatNumber,
            societyName: 'Greenwood Heights',
            expectedDate,
            expectedTime: `${timeFrom} – ${timeTo}`,
            purpose: newRecord.purpose,
            otp: newRecord.passCode,
            createdAt: newRecord.createdAt,
            ...(newRecord.vehicleNumber ? { vehicleNumber: newRecord.vehicleNumber } : {}),
        });
        notifyListeners();
        return newRecord;
    },
    revokePass: (passId: string): boolean => {
        let found = false;
        globalVisitors = globalVisitors.map((v) => {
            if (v.id === passId || v.passCode === passId) {
                found = true;
                return { ...v, status: 'CANCELLED' as VisitorStatus };
            }
            return v;
        });
        mockStore.updateVisitor(passId, { status: 'CANCELLED' });
        notifyListeners();
        return found;
    },
    findPass: (query?: string | null): ActiveVisitorRecord | null => {
        if (!query || typeof query !== 'string') return null;
        const clean = query.trim().toUpperCase();
        const fromGlobal = globalVisitors.find((v) => v.id === query ||
            v.id.toUpperCase() === clean ||
            v.passCode.toUpperCase() === clean ||
            v.qrPayload.toUpperCase().includes(clean) ||
            v.name.toUpperCase().includes(clean) ||
            v.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')));
        if (fromGlobal) return fromGlobal;
        const storeVisitor = mockStore.getState().visitors.find((v) =>
            v.id === query ||
            v.id.toUpperCase() === clean ||
            (v.otp && v.otp.toUpperCase() === clean) ||
            v.name.toUpperCase().includes(clean) ||
            v.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, ''))
        );
        if (storeVisitor) {
            const record = mapStoreVisitorToActiveRecord(storeVisitor);
            globalVisitors = [record, ...globalVisitors.filter(v => v.id !== record.id)];
            return record;
        }
        return null;
    },
    allowEntry: (passId: string, options?: {
        gateId?: string;
        gateName?: string;
        guardName?: string;
        operatorName?: string;
        observedVehicleNumber?: string;
        vehicleNumber?: string;
        isOffline?: boolean;
    }): {
        success: boolean;
        error?: string;
        record?: ActiveVisitorRecord;
        event?: GateActivityEvent;
    } => {
        const visitor = globalVisitors.find((v) => v.id === passId || v.passCode === passId);
        if (!visitor) {
            return { success: false, error: 'No visitor pass found.' };
        }
        if (visitor.status === 'CHECKED_IN') {
            return { success: false, error: 'Visitor already inside society.' };
        }
        if (visitor.status === 'CANCELLED' || (visitor.status as string) === 'REVOKED') {
            return { success: false, error: 'This visitor pass was revoked by the resident.' };
        }
        if (visitor.status === 'EXPIRED') {
            return { success: false, error: 'This visitor pass has expired.' };
        }
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const gateId = options?.gateName || options?.gateId || 'Gate 01';
        const guardName = options?.operatorName || options?.guardName || 'Security Guard (Desk 1)';
        const vehicle = options?.vehicleNumber || options?.observedVehicleNumber || visitor.vehicleNumber;
        const isVehicleMismatch = !!visitor.vehicleNumber && !!vehicle && visitor.vehicleNumber !== vehicle;
        const updatedRecord: ActiveVisitorRecord = {
            ...visitor,
            status: 'CHECKED_IN',
            entryTime: timeStr,
            entryGate: gateId,
            ...(vehicle ? { vehicleNumber: vehicle } : {}),
        };
        globalVisitors = globalVisitors.map((v) => (v.id === visitor.id ? updatedRecord : v));
        const event: GateActivityEvent & {
            vehicleMismatch?: boolean;
        } = {
            id: `evt-${Date.now()}`,
            visitorPassId: visitor.id,
            visitorName: visitor.name,
            visitorType: visitor.type,
            flatNumber: visitor.flatNumber,
            gateId,
            gateName: gateId,
            eventType: 'ENTRY',
            timestampIso: now.toISOString(),
            ...(updatedRecord.vehicleNumber ? { vehicleNumber: updatedRecord.vehicleNumber } : {}),
            guardName,
            isOfflineQueued: options?.isOffline ?? globalOfflineMode,
            vehicleMismatch: isVehicleMismatch,
        };
        if (options?.isOffline ?? globalOfflineMode) {
            globalOfflineQueue.push(event);
        }
        else {
            globalGateLogs = [event, ...globalGateLogs];
        }
        mockStore.updateVisitor(visitor.id, {
            status: 'CHECKED_IN',
            actualEntryTime: timeStr,
        });
        mockStore.addGateLog({
            id: event.id,
            visitorId: visitor.id,
            visitorName: visitor.name,
            entryTime: timeStr,
            guardName,
            gateNumber: gateId,
            flatNumber: visitor.flatNumber,
            visitorType: visitor.type,
        });
        notifyListeners();
        return { success: true, record: updatedRecord, event };
    },
    recordExit: (passId: string, options?: {
        gateId?: string;
        gateName?: string;
        guardName?: string;
        isOffline?: boolean;
    }): {
        success: boolean;
        error?: string;
        record?: ActiveVisitorRecord;
        durationString?: string;
        event?: GateActivityEvent;
    } => {
        const visitor = globalVisitors.find((v) => v.id === passId || v.passCode === passId);
        if (!visitor) {
            return { success: false, error: 'Visitor not found.' };
        }
        if (visitor.status !== 'CHECKED_IN') {
            return { success: false, error: 'Visitor is not currently marked inside.' };
        }
        const now = new Date();
        const exitTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const gateId = options?.gateId || 'Gate 01';
        const guardName = options?.guardName || 'Security Guard (Desk 1)';
        const duration = '1h 17m';
        const updatedRecord: ActiveVisitorRecord = {
            ...visitor,
            status: 'CHECKED_OUT',
            exitTime: exitTimeStr,
            exitGate: gateId,
            durationString: duration,
        };
        globalVisitors = globalVisitors.map((v) => (v.id === visitor.id ? updatedRecord : v));
        const event: GateActivityEvent = {
            id: `evt-${Date.now()}`,
            visitorPassId: visitor.id,
            visitorName: visitor.name,
            visitorType: visitor.type,
            flatNumber: visitor.flatNumber,
            gateId,
            gateName: gateId,
            eventType: 'EXIT',
            timestampIso: now.toISOString(),
            ...(visitor.vehicleNumber ? { vehicleNumber: visitor.vehicleNumber } : {}),
            guardName,
            isOfflineQueued: options?.isOffline ?? false,
        };
        if (options?.isOffline ?? globalOfflineMode) {
            globalOfflineQueue.push(event);
        }
        else {
            globalGateLogs = [event, ...globalGateLogs];
        }
        mockStore.updateVisitor(visitor.id, {
            status: 'CHECKED_OUT',
            actualExitTime: exitTimeStr,
        });
        mockStore.addGateLog({
            id: event.id,
            visitorId: visitor.id,
            visitorName: visitor.name,
            entryTime: visitor.entryTime || exitTimeStr,
            exitTime: exitTimeStr,
            guardName,
            gateNumber: gateId,
            flatNumber: visitor.flatNumber,
            visitorType: visitor.type,
        });
        notifyListeners();
        return { success: true, record: updatedRecord, durationString: duration, event };
    },
    recordEmergencyBypass: (input: {
        reason: string;
        operatorName: string;
        gateId: string;
        vehicleNumber?: string;
        emergencyType?: string;
    }): GateActivityEvent & {
        emergencyType?: string;
        reason?: string;
        operatorName?: string;
        gateName?: string;
    } => {
        const now = new Date();
        const event: GateActivityEvent & {
            emergencyType?: string;
            reason?: string;
            operatorName?: string;
            gateName?: string;
        } = {
            id: `EMG-${Date.now()}`,
            visitorPassId: 'EMERGENCY',
            visitorName: `EMERGENCY: ${input.reason}`,
            visitorType: 'EMERGENCY' as VisitorType,
            flatNumber: 'ALL_CAMPUS',
            gateId: input.gateId || 'Gate 01',
            gateName: input.gateId || 'Gate 01',
            eventType: 'EMERGENCY_BYPASS' as const,
            timestampIso: now.toISOString(),
            ...(input.vehicleNumber ? { vehicleNumber: input.vehicleNumber } : {}),
            guardName: input.operatorName || 'Officer In-Charge',
            operatorName: input.operatorName || 'Officer In-Charge',
            bypassReason: input.reason,
            reason: input.reason,
            emergencyType: input.emergencyType || 'AMBULANCE',
        };
        globalGateLogs = [event, ...globalGateLogs];
        notifyListeners();
        return event;
    },
    emergencyBypass: (input: {
        emergencyType?: string;
        reason: string;
        operatorName?: string;
        gateName?: string;
        gateId?: string;
        vehicleNumber?: string;
        targetUnit?: string;
    }) => {
        return visitorLifecycleStore.recordEmergencyBypass({
            reason: input.reason,
            operatorName: input.operatorName || 'Officer In-Charge',
            gateId: input.gateName || input.gateId || 'Gate 01',
            ...(input.vehicleNumber ? { vehicleNumber: input.vehicleNumber } : {}),
            ...(input.emergencyType ? { emergencyType: input.emergencyType } : {}),
        });
    },
    setOfflineMode: (offline: boolean) => {
        globalOfflineMode = offline;
        if (!offline) {
            visitorLifecycleStore.syncOfflineQueue();
        }
        notifyListeners();
    },
    get offlineMode() {
        return globalOfflineMode;
    },
    get offlineQueue() {
        return globalOfflineQueue;
    },
    get gateEvents() {
        return globalGateLogs;
    },
    syncOfflineQueue: (): number => {
        const count = globalOfflineQueue.length;
        if (count > 0) {
            for (const item of globalOfflineQueue) {
                if (item.eventType === 'ENTRY') {
                    const pass = globalVisitors.find(v => v.id === item.visitorPassId);
                    if (pass && pass.status !== 'CANCELLED' && (pass.status as string) !== 'REVOKED' && pass.status !== 'EXPIRED') {
                        pass.status = 'CHECKED_IN';
                        pass.entryTime = pass.entryTime || new Date(item.timestampIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        mockStore.updateVisitor(pass.id, { status: 'CHECKED_IN', actualEntryTime: pass.entryTime });
                    }
                } else if (item.eventType === 'EXIT') {
                    const pass = globalVisitors.find(v => v.id === item.visitorPassId);
                    if (pass) {
                        pass.status = 'CHECKED_OUT';
                        pass.exitTime = pass.exitTime || new Date(item.timestampIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        mockStore.updateVisitor(pass.id, { status: 'CHECKED_OUT', actualExitTime: pass.exitTime });
                    }
                }
            }
            globalGateLogs = [...globalOfflineQueue, ...globalGateLogs];
            globalOfflineQueue = [];
            globalOfflineMode = false;
            notifyListeners();
        }
        return count;
    },
    getParcels: (flatNumber?: string): ParcelCustodyRecord[] => {
        if (!flatNumber) return [...globalParcels];
        return globalParcels.filter(p => p.flatNumber === flatNumber || p.flatNumber.toLowerCase() === flatNumber.toLowerCase());
    },
    receiveParcel: (input: {
        flatNumber: string;
        recipientName?: string;
        deliveryPartner?: string;
        partner?: string;
        trackingNumber?: string;
        guardName?: string;
        gateName?: string;
        deliveryPersonName?: string;
        deliveryPersonPhone?: string;
        numberOfPackages?: number;
        notes?: string;
    }): ParcelCustodyRecord => {
        const id = `pkg-${Date.now()}`;
        const partner = input.deliveryPartner || input.partner || 'Courier';
        const newParcel: ParcelCustodyRecord = {
            id,
            unitId: 'unit-active',
            flatNumber: input.flatNumber,
            recipientName: input.recipientName || 'Resident',
            deliveryPartner: partner,
            trackingNumber: input.trackingNumber || `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
            receivedAt: 'Just now',
            guardName: input.guardName || 'Security Desk',
            gateName: input.gateName || 'Gate 01',
            status: 'WAITING_COLLECTION',
        };
        globalParcels = [newParcel, ...globalParcels];
        const now = new Date();
        const event: GateActivityEvent = {
            id: `evt-pkg-${Date.now()}`,
            visitorPassId: id,
            visitorName: `${partner} (Parcel)`,
            visitorType: 'DELIVERY',
            flatNumber: input.flatNumber,
            gateId: input.gateName || 'Gate 01',
            gateName: input.gateName || 'Gate 01',
            eventType: 'ENTRY',
            timestampIso: now.toISOString(),
            guardName: input.guardName || 'Security Desk',
        };
        globalGateLogs = [event, ...globalGateLogs];
        mockStore.addGateLog({
            id: event.id,
            visitorId: id,
            visitorName: `${partner} (Parcel)`,
            entryTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            guardName: input.guardName || 'Security Desk',
            gateNumber: input.gateName || 'Gate 01',
            flatNumber: input.flatNumber,
            visitorType: 'DELIVERY',
        });
        notifyListeners();
        return newParcel;
    },
    confirmParcelPickup: (parcelId: string, collectedBy?: string): boolean => {
        let found = false;
        globalParcels = globalParcels.map(p => {
            if (p.id === parcelId) {
                found = true;
                return {
                    ...p,
                    status: 'COLLECTED',
                    collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    collectedBy: collectedBy || 'Resident',
                };
            }
            return p;
        });
        notifyListeners();
        return found;
    },
    checkInStaff: (input: {
        staffId: string;
        staffName: string;
        role?: string;
        gateName?: string;
        guardName?: string;
        isSuspended?: boolean;
    }): { success: boolean; event?: GateActivityEvent; error?: string } => {
        if (input.isSuspended) {
            return { success: false, error: 'Staff member is currently suspended or blocked from campus entry' };
        }
        const event: GateActivityEvent = {
            id: `evt-stf-${Date.now()}`,
            visitorPassId: input.staffId,
            visitorName: input.staffName,
            visitorType: 'SERVICE' as any,
            flatNumber: 'Campus Staff',
            gateId: input.gateName || 'Gate 01',
            gateName: input.gateName || 'Gate 01',
            eventType: 'ENTRY',
            timestampIso: new Date().toISOString(),
            guardName: input.guardName || 'Security Gate 1',
        };
        (event as any).staffName = input.staffName;
        globalGateLogs = [event, ...globalGateLogs];
        notifyListeners();
        return { success: true, event };
    },
    recordCabEntry: (input: {
        cabRegistration?: string;
        vehicleNumber?: string;
        provider?: string;
        driverName?: string;
        flatNumber: string;
        guardName?: string;
        gateName?: string;
    }): { success: boolean; event?: GateActivityEvent; pass?: ActiveVisitorRecord } => {
        const reg = (input.cabRegistration || input.vehicleNumber || 'MH-12-CAB-0000').toUpperCase();
        const pass = visitorLifecycleStore.createPass({
            name: input.driverName || (input.provider ? `${input.provider} Cab Driver` : 'Cab Driver'),
            phone: '9800000000',
            type: 'CAB' as any,
            purpose: input.provider ? `${input.provider} Drop-off` : 'Cab Drop-off',
            expectedDate: new Date().toISOString().split('T')[0] || 'Today',
            expectedTimeFrom: 'Now',
            expectedTimeTo: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            durationHours: 1,
            isRecurring: false,
            hasVehicle: true,
            vehicleNumber: reg,
            flatNumber: input.flatNumber,
            tower: `Tower ${input.flatNumber[0] || 'A'}`,
        });
        const res = visitorLifecycleStore.allowEntry(pass.id, {
            gateName: input.gateName || 'Gate 01',
            guardName: input.guardName || 'Officer Gate 1',
            vehicleNumber: reg,
        });
        const updatedPass = visitorLifecycleStore.findPass(pass.id) || pass;
        return {
            success: res.success,
            ...(res.event ? { event: res.event } : {}),
            pass: updatedPass,
        };
    },
    getPendingApprovals: (flatNumber?: string): VisitorApprovalRequest[] => {
        const all = mockStore.getState().visitorApprovalRequests || [];
        const pending = all.filter(r => r.status === 'PENDING');
        if (!flatNumber) return pending;
        return pending.filter(r => r.flatNumber === flatNumber || r.flatNumber.toLowerCase() === flatNumber.toLowerCase());
    },
    respondToWalkIn: async (requestId: string, action: 'APPROVE' | 'DENY', residentId = 'res-001', denialReason?: string) => {
        const result = await walkInApprovalService.respondToApproval({
            requestId,
            action,
            residentId,
            residentRole: 'OWNER',
            ...(denialReason ? { denialReason } : {}),
        });
        notifyListeners();
        return result;
    },
    reset: () => {
        visitorLifecycleStore.resetForTesting();
    },
    resetForTesting: () => {
        globalVisitors = [...INITIAL_VISITORS];
        globalGateLogs = [];
        globalOfflineQueue = [];
        globalOfflineMode = false;
        globalParcels = [...INITIAL_PARCELS];
        notifyListeners();
    },
};
export function useVisitorLifecycle() {
    const [, setTick] = useState(0);
    useEffect(() => {
        const listener = () => setTick((t) => t + 1);
        globalListeners.push(listener);
        return () => {
            globalListeners = globalListeners.filter((l) => l !== listener);
        };
    }, []);
    const allVisitors = visitorLifecycleStore.getVisitors();
    const expectedToday = allVisitors.filter((v) => v.status === 'APPROVED');
    const currentlyInside = allVisitors.filter((v) => v.status === 'CHECKED_IN');
    const recentExits = allVisitors.filter((v) => v.status === 'CHECKED_OUT');
    return {
        allVisitors,
        passes: allVisitors,
        expectedToday,
        currentlyInside,
        currentVisitors: currentlyInside,
        recentExits,
        createPass: visitorLifecycleStore.createPass,
        revokePass: visitorLifecycleStore.revokePass,
        findPass: visitorLifecycleStore.findPass,
        allowEntry: visitorLifecycleStore.allowEntry,
        recordExit: visitorLifecycleStore.recordExit,
        recordEmergencyBypass: visitorLifecycleStore.recordEmergencyBypass,
        emergencyBypass: visitorLifecycleStore.emergencyBypass,
        syncOfflineQueue: visitorLifecycleStore.syncOfflineQueue,
        setOfflineMode: visitorLifecycleStore.setOfflineMode,
        offlineMode: globalOfflineMode,
        offlineQueue: globalOfflineQueue,
        gateLogs: globalGateLogs,
        gateEvents: globalGateLogs,
        parcels: visitorLifecycleStore.getParcels(),
        getParcels: visitorLifecycleStore.getParcels,
        receiveParcel: visitorLifecycleStore.receiveParcel,
        confirmParcelPickup: visitorLifecycleStore.confirmParcelPickup,
        checkInStaff: visitorLifecycleStore.checkInStaff,
        recordCabEntry: visitorLifecycleStore.recordCabEntry,
        getPendingApprovals: visitorLifecycleStore.getPendingApprovals,
        respondToWalkIn: visitorLifecycleStore.respondToWalkIn,
    };
}

