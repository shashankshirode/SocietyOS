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
export const emergencyBypassService = {
    async createEmergencyBypass(payload: {
        gateId: string;
        emergencyType: EmergencyType;
        emergencyDescription: string;
        visitorName: string;
        visitorPhone?: string;
        visitorType: VisitorType;
        flatNumber: string;
        vehicleRegistration?: string;
        vehicleType?: VehicleType;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
    }, guardId: string, guardName: string, societyId: string): Promise<{
        visitor: any;
        gateEvent: any;
    } | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const now = new Date().toISOString();
                    const visitor = {
                        id: `vis-${Date.now()}`,
                        name: payload.visitorName,
                        phone: payload.visitorPhone || '',
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
                        approvalSource: 'EMERGENCY' as any,
                        approvalStatus: 'EMERGENCY_BYPASS' as any,
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
                    };
                    mockStore.getState().visitors?.push(visitor);
                    const gateEvent = {
                        id: `gate-event-${Date.now()}`,
                        eventType: 'EMERGENCY_BYPASS' as any,
                        gateId: payload.gateId,
                        gateName: '',
                        gateCode: '',
                        visitorId: visitor.id,
                        visitorName: payload.visitorName,
                        visitorPhone: payload.visitorPhone,
                        visitorType: payload.visitorType,
                        visitorPassId: visitor.id,
                        visitorPassCode: 'EMRGNCY',
                        unitId: '',
                        unitNumber: '',
                        flatNumber: payload.flatNumber,
                        eventTimestamp: now,
                        deviceTimestamp: now,
                        guardId: guardId,
                        guardName: guardName,
                        guardRole: 'GUARD',
                        entrySource: 'MANUAL' as any,
                        approvalSource: 'EMERGENCY' as any,
                        vehicleId: payload.vehicleRegistration,
                        vehicleRegistration: payload.vehicleRegistration,
                        vehicleType: payload.vehicleType,
                        vehicleColor: undefined,
                        eventStatus: 'SUCCESS',
                        approvalSource: 'EMERGENCY' as any,
                        approvalStatus: 'EMERGENCY_BYPASS' as any,
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
                        idempotencyKey: generateId('idem'),
                        deviceId: undefined,
                        deviceInfo: undefined,
                        appVersion: undefined,
                        networkType: undefined,
                        syncStatus: 'SYNCED',
                        createdAt: now,
                        createdBy: guardId,
                        metadata: {},
                        societyId,
                    };
                    mockStore.getState().visitors?.push(visitor);
                    mockStore.getState().gateEvents?.push(gateEvent);
                    mockStore.notify();
                    resolve({ visitor, gateEvent });
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async getEmergencyBypassHistory(societyId: string, dateFrom?: string, dateTo?: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const filtered = visitors.filter((v) => v.societyId === societyId &&
                    v.emergencyType &&
                    (!dateFrom || new Date(v.createdAt) >= new Date(dateFrom)) &&
                    (!dateTo || new Date(v.createdAt) <= new Date(dateTo)));
                resolve(filtered);
            }, 300);
        });
    },
    async getEmergencyBypassStats(societyId: string): Promise<{
        total: number;
        byType: Record<string, number>;
        byGate: Record<string, number>;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const visitors = mockStore.getState().visitors || [];
                const emergencyVisitors = visitors.filter((v) => v.societyId === societyId && v.emergencyType);
                const byType: Record<string, number> = {};
                const byGate: Record<string, number> = {};
                emergencyVisitors.forEach((v) => {
                    byType[v.emergencyType || 'UNKNOWN'] = (byType[v.emergencyType || 'UNKNOWN'] || 0) + 1;
                    byGate[v.gateId || 'UNKNOWN'] = (byGate[v.gateId || 'UNKNOWN'] || 0) + 1;
                });
                resolve({
                    total: emergencyVisitors.length,
                    byType,
                    byGate,
                });
            }, 300);
        });
    },
};


