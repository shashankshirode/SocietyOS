import { useState, useEffect, useCallback } from 'react';
import type { Visitor, VisitorType, VisitorStatus } from '../../../../shared/types/visitor.types';
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
let globalGateLogs: GateActivityEvent[] = [];
let globalOfflineQueue: GateActivityEvent[] = [];
let globalOfflineMode = false;
let globalListeners: Array<() => void> = [];
function notifyListeners() {
    globalListeners.forEach((l) => l());
}
export const visitorLifecycleStore = {
    getVisitors: () => [...globalVisitors],
    getGateLogs: () => [...globalGateLogs],
    getOfflineQueue: () => [...globalOfflineQueue],
    createPass: (draft: VisitorPassDraft): ActiveVisitorRecord => {
        const randomNum = Math.floor(100 + Math.random() * 900);
        const passCode = `GH-${randomNum}`;
        const newRecord: ActiveVisitorRecord = {
            id: `vis-${Date.now()}`,
            passCode,
            name: draft.name,
            phone: draft.phone,
            type: draft.type,
            purpose: draft.purpose || 'Visit',
            flatNumber: draft.flatNumber || 'A-1204',
            tower: draft.tower || 'Tower A',
            expectedWindow: `${draft.expectedDate} · ${draft.expectedTimeFrom} – ${draft.expectedTimeTo}`,
            ...(draft.hasVehicle && draft.vehicleNumber ? { vehicleNumber: draft.vehicleNumber } : {}),
            status: 'APPROVED',
            qrPayload: `SOC-OS:PASS:${passCode}:${draft.name.toUpperCase()}:${draft.flatNumber || 'A-1204'}`,
            createdAt: new Date().toISOString(),
        };
        globalVisitors = [newRecord, ...globalVisitors];
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
        notifyListeners();
        return found;
    },
    findPass: (query: string): ActiveVisitorRecord | null => {
        const clean = query.trim().toUpperCase();
        return (globalVisitors.find((v) => v.id === query ||
            v.id.toUpperCase() === clean ||
            v.passCode.toUpperCase() === clean ||
            v.qrPayload.toUpperCase().includes(clean) ||
            v.name.toUpperCase().includes(clean) ||
            v.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, ''))) || null);
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
        notifyListeners();
        return { success: true, record: updatedRecord, event };
    },
    recordExit: (passId: string, options?: {
        gateId?: string;
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
            globalGateLogs = [...globalOfflineQueue, ...globalGateLogs];
            globalOfflineQueue = [];
            globalOfflineMode = false;
            notifyListeners();
        }
        return count;
    },
    reset: () => {
        visitorLifecycleStore.resetForTesting();
    },
    resetForTesting: () => {
        globalVisitors = [...INITIAL_VISITORS];
        globalGateLogs = [];
        globalOfflineQueue = [];
        globalOfflineMode = false;
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
    };
}

