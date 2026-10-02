import { mockStore } from '../../../core/mockStore/mockStore';
import type { OfflineGateEvent, GateEntry, GateExit, VisitorPass, OfflineSyncStatus, } from '../../../../shared/types/visitorPhase5';
import { unifiedVisitorStateMachine } from './unifiedVisitorStateMachine';
import { auditService, createAuditEntry } from '../../../core/audit';
import { createIdempotencyKey } from '../../../core/api/idempotency';
export interface ReconciliationResult {
    readonly eventId: string;
    readonly status: 'ACCEPTED' | 'DUPLICATE' | 'REJECTED' | 'REQUIRES_REVIEW' | 'CONFLICT';
    readonly serverEventId?: string;
    readonly errorCode?: string;
    readonly errorMessage?: string;
}
export interface ReconciliationSummary {
    readonly total: number;
    readonly accepted: number;
    readonly duplicates: number;
    readonly rejected: number;
    readonly conflicts: number;
    readonly requiresReview: number;
}
export class OfflineSyncReconciliationService {
    private static instance: OfflineSyncReconciliationService;
    static getInstance(): OfflineSyncReconciliationService {
        if (!OfflineSyncReconciliationService.instance) {
            OfflineSyncReconciliationService.instance = new OfflineSyncReconciliationService();
        }
        return OfflineSyncReconciliationService.instance;
    }
    async reconcileBatch(events: OfflineGateEvent[]): Promise<{
        results: ReconciliationResult[];
        summary: ReconciliationSummary;
    }> {
        const results: ReconciliationResult[] = [];
        for (const event of events) {
            const result = await this.reconcileEvent(event);
            results.push(result);
            event.syncStatus = result.status === 'ACCEPTED' ? 'SYNCED' :
                result.status === 'DUPLICATE' ? 'SYNCED' :
                    result.status === 'REJECTED' ? 'FAILED' : 'PENDING_SYNC';
            if (result.serverEventId) {
                (event as any).serverEventId = result.serverEventId;
            }
        }
        mockStore.notify();
        const summary: ReconciliationSummary = {
            total: results.length,
            accepted: results.filter(r => r.status === 'ACCEPTED').length,
            duplicates: results.filter(r => r.status === 'DUPLICATE').length,
            rejected: results.filter(r => r.status === 'REJECTED').length,
            conflicts: results.filter(r => r.status === 'CONFLICT').length,
            requiresReview: results.filter(r => r.status === 'REQUIRES_REVIEW').length,
        };
        return { results, summary };
    }
    private async reconcileEvent(event: OfflineGateEvent): Promise<ReconciliationResult> {
        const gateEntries = mockStore.getState().gateEntries || [];
        const gateExits = mockStore.getState().gateExits || [];
        if (event.syncStatus === 'SYNCED') {
            return { eventId: event.eventId, status: 'DUPLICATE', errorMessage: 'Event already synced' };
        }
        switch (event.eventType) {
            case 'ENTRY':
                return this.reconcileEntry(event);
            case 'EXIT':
                return this.reconcileExit(event);
            case 'EMERGENCY_BYPASS':
                return this.reconcileEmergencyBypass(event);
            case 'WALK_IN_REGISTRATION':
                return this.reconcileWalkInRegistration(event);
            default:
                return { eventId: event.eventId, status: 'REJECTED', errorCode: 'UNKNOWN_EVENT_TYPE', errorMessage: 'Unknown event type' };
        }
    }
    private async reconcileEntry(event: OfflineGateEvent): Promise<ReconciliationResult> {
        const payload = event.payload;
        const passId = payload.passId as string;
        const gateId = payload.gateId as string;
        const gateEntries = mockStore.getState().gateEntries || [];
        const existingEntry = gateEntries.find(e => e.passId === passId &&
            e.gateId === gateId &&
            Math.abs(new Date(e.entryAt).getTime() - new Date(event.localTimestamp).getTime()) < 5 * 60 * 1000);
        if (existingEntry) {
            return { eventId: event.eventId, status: 'DUPLICATE', serverEventId: existingEntry.entryId, errorMessage: 'Entry already recorded' };
        }
        const visitors = mockStore.getState().visitors || [];
        const pass = visitors.find(v => v.passId === passId);
        if (!pass) {
            return { eventId: event.eventId, status: 'REJECTED', errorCode: 'PASS_NOT_FOUND', errorMessage: 'Visitor pass not found on server' };
        }
        if (pass.status === 'CHECKED_IN') {
            const existingEntry = gateEntries.find(e => e.passId === passId && e.status === 'CHECKED_IN');
            if (existingEntry) {
                return { eventId: event.eventId, status: 'DUPLICATE', serverEventId: existingEntry.entryId, errorMessage: 'Visitor already checked in' };
            }
        }
        if (pass.status === 'REVOKED' || pass.status === 'EXPIRED' || pass.status === 'CANCELLED') {
            if (pass.status === 'REVOKED' && pass.actualEntryAt && new Date(pass.actualEntryAt) > new Date(event.localTimestamp)) {
                return { eventId: event.eventId, status: 'CONFLICT', errorCode: 'REVOCATION_BEFORE_ENTRY', errorMessage: 'Pass was revoked before offline entry', requiresReview: true };
            }
            return { eventId: event.eventId, status: 'REJECTED', errorCode: 'PASS_INVALID_STATUS', errorMessage: `Pass is ${pass.status.toLowerCase()}` };
        }
        if (!unifiedVisitorStateMachine.isVisitorPassActive(pass.status)) {
            return { eventId: event.eventId, status: 'REJECTED', errorCode: 'PASS_INVALID_STATUS', errorMessage: `Pass is ${pass.status.toLowerCase()}` };
        }
        const serverEntryId = `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const serverEntry: GateEntry = {
            entryId: serverEntryId,
            passId: pass.passId,
            personId: pass.personId,
            visitorName: payload.personName as string,
            visitorPhone: payload.visitorPhone as string,
            visitorCategory: payload.visitorCategory as any,
            flatNumber: payload.flatNumber as string,
            unitId: pass.unitId,
            gateId: payload.gateId as string,
            gateName: payload.gateName as string,
            guardId: event.guardId,
            guardName: event.guardName,
            entryType: 'PRE_APPROVED',
            entrySource: payload.entrySource as any,
            approvalSource: payload.approvalSource as any,
            status: 'CHECKED_IN',
            entryAt: event.localTimestamp,
            vehicleRegistration: payload.vehicleRegistration as string,
            vehicleType: payload.vehicleType as any,
            isOfflineCapture: true,
            offlineEventId: event.eventId,
            dataVersion: 1,
            societyId: event.societyId,
            unitId: pass.unitId,
            createdAt: event.localTimestamp,
            updatedAt: event.localTimestamp,
        };
        mockStore.getState().gateEntries = [...gateEntries, serverEntry];
        const visitors = mockStore.getState().visitors || [];
        const passIndex = visitors.findIndex(v => v.passId === passId);
        if (passIndex !== -1) {
            visitors[passIndex] = {
                ...visitors[passIndex],
                status: 'CHECKED_IN',
                actualEntryAt: event.localTimestamp,
                entryGateId: payload.gateId as string,
                entryGateName: payload.gateName as string,
                dataVersion: (visitors[passIndex].dataVersion || 0) + 1,
            };
        }
        mockStore.notify();
        return { eventId: event.eventId, status: 'ACCEPTED', serverEventId: serverEntryId };
    }
    private async reconcileExit(event: OfflineGateEvent): Promise<ReconciliationResult> {
        const payload = event.payload;
        const passId = payload.passId as string;
        const gateId = payload.gateId as string;
        const gateExits = mockStore.getState().gateExits || [];
        const existingExit = gateExits.find(e => e.passId === passId &&
            e.gateId === gateId &&
            Math.abs(new Date(e.exitAt).getTime() - new Date(event.localTimestamp).getTime()) < 5 * 60 * 1000);
        if (existingExit) {
            return { eventId: event.eventId, status: 'DUPLICATE', serverEventId: existingExit.exitId, errorMessage: 'Exit already recorded' };
        }
        const visitors = mockStore.getState().visitors || [];
        const pass = visitors.find(v => v.passId === passId);
        if (!pass) {
            return { eventId: event.eventId, status: 'REJECTED', errorCode: 'PASS_NOT_FOUND', errorMessage: 'Visitor pass not found on server' };
        }
        if (pass.status !== 'CHECKED_IN') {
            return { eventId: event.eventId, status: 'REJECTED', errorCode: 'NOT_CHECKED_IN', errorMessage: 'Visitor is not currently checked in' };
        }
        const entryTime = pass.actualEntryAt ? new Date(pass.actualEntryAt) : new Date(event.localTimestamp);
        const exitTime = new Date(event.localTimestamp);
        const durationMinutes = Math.floor((exitTime.getTime() - entryTime.getTime()) / 60000);
        const serverExitId = `exit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const serverExit: GateExit = {
            exitId: serverExitId,
            entryId: '',
            passId: pass.passId,
            gateId,
            gateName: payload.gateName as string,
            guardId: event.guardId,
            guardName: event.guardName,
            exitAt: event.localTimestamp,
            durationMinutes,
            isOfflineCapture: true,
            offlineEventId: event.eventId,
            dataVersion: 1,
            societyId: event.societyId,
            unitId: pass.unitId,
            createdAt: event.localTimestamp,
            updatedAt: event.localTimestamp,
        };
        mockStore.getState().gateExits = [...gateExits, serverExit];
        const visitors = mockStore.getState().visitors || [];
        const passIndex = visitors.findIndex(v => v.passId === passId);
        if (passIndex !== -1) {
            visitors[passIndex] = {
                ...visitors[passIndex],
                status: 'CHECKED_OUT',
                actualExitAt: event.localTimestamp,
                exitGateId: gateId,
                exitGateName: payload.gateName as string,
                dataVersion: (visitors[passIndex].dataVersion || 0) + 1,
            };
        }
        mockStore.notify();
        return { eventId: event.eventId, status: 'ACCEPTED', serverEventId: serverExitId };
    }
    private async reconcileEmergencyBypass(event: OfflineGateEvent): Promise<ReconciliationResult> {
        const payload = event.payload;
        const gateEntries = mockStore.getState().gateEntries || [];
        const existingEntry = gateEntries.find(e => e.entryType === 'EMERGENCY_BYPASS' &&
            e.gateId === payload.gateId &&
            Math.abs(new Date(e.entryAt).getTime() - new Date(event.localTimestamp).getTime()) < 5 * 60 * 1000);
        if (existingEntry) {
            return { eventId: event.eventId, status: 'DUPLICATE', serverEventId: existingEntry.entryId, errorMessage: 'Emergency bypass already recorded' };
        }
        const serverEntryId = `emergency-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const serverEntry: GateEntry = {
            entryId: serverEntryId,
            passId: 'EMERGENCY',
            visitorName: `EMERGENCY: ${payload.reason}`,
            visitorCategory: 'EMERGENCY',
            flatNumber: 'ALL_CAMPUS',
            unitId: 'ALL',
            gateId: payload.gateId as string,
            gateName: payload.gateName as string,
            guardId: event.guardId,
            guardName: event.guardName,
            entryType: 'EMERGENCY_BYPASS',
            entrySource: 'EMERGENCY_BYPASS',
            approvalSource: 'SYSTEM_POLICY',
            status: 'CHECKED_IN',
            entryAt: event.localTimestamp,
            vehicleRegistration: payload.vehicleRegistration as string,
            vehicleType: payload.vehicleType as any,
            isOfflineCapture: true,
            offlineEventId: event.eventId,
            dataVersion: 1,
            societyId: event.societyId,
            unitId: 'ALL',
            createdAt: event.localTimestamp,
            updatedAt: event.localTimestamp,
        };
        mockStore.getState().gateEntries = [...gateEntries, serverEntry];
        mockStore.notify();
        return { eventId: event.eventId, status: 'ACCEPTED', serverEventId: serverEntryId };
    }
    private async reconcileWalkInRegistration(event: OfflineGateEvent): Promise<ReconciliationResult> {
        const payload = event.payload;
        const approvalRequests = mockStore.getState().visitorApprovalRequests || [];
        const existingRequest = approvalRequests.find(r => r.visitorName === payload.personName &&
            r.flatNumber === payload.flatNumber &&
            r.gateId === payload.gateId &&
            r.status === 'PENDING' &&
            Math.abs(new Date(r.requestedAtIso).getTime() - new Date(event.localTimestamp).getTime()) < 5 * 60 * 1000);
        if (existingRequest) {
            return { eventId: event.eventId, status: 'DUPLICATE', serverEventId: existingRequest.id, errorMessage: 'Walk-in approval request already exists' };
        }
        return { eventId: event.eventId, status: 'ACCEPTED' };
    }
}
export const offlineSyncReconciliationService = OfflineSyncReconciliationService.getInstance();

