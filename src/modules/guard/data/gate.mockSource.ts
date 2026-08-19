import { repositorySuccess, withMockDelay, type RepositoryResult, } from "../../../core/repositories/repository.types";
import { mockEmergencyTypes } from "../../../shared/mock/emergency.mock";
import { mockGateActivityLogs } from "../../../shared/mock/gateActivity.mock";
import { mockGuardProfile, mockShiftSummary, } from "../../../shared/mock/guard.mock";
import { mockOfflineQueue } from "../../../shared/mock/offlineQueue.mock";
import { mockStaffMembers } from "../../../shared/mock/staff.mock";
import { mockStore } from "../../../core/mockStore/mockStore";
import type { EmergencyAlertPayload, GateActivityLog, GateEntryType, GatePass, GatePassStatus, OfflineQueueItem, } from "../../../shared/types/gate.types";
import type { Visitor, VisitorStatus, } from "../../../shared/types/visitor.types";
import type { ShiftSummary } from "../../../shared/types/guard.types";
import type { StaffMember } from "../../../shared/types/staff.types";
import type { EmergencyAlertRequest, EmergencyTypeOption, GuardDashboard, RecordGateEntryPayload, } from "./gate.dto";
import { mapGuardDashboardDtoToDomain } from "./gate.mapper";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import type { Absent } from "../../../shared/types/absence.types";
function mapVisitorStatus(status: VisitorStatus): GatePassStatus {
    switch (status) {
        case "EXPECTED":
        case "WAITING_APPROVAL":
        case "APPROVED":
        case "CHECKED_IN":
        case "CHECKED_OUT":
        case "REJECTED":
        case "EXPIRED":
            return status;
        case "CANCELLED":
            return "EXPIRED";
        case "COMPLETED":
            return "CHECKED_OUT";
    }
}
function mapActivityType(value?: string): GateEntryType {
    switch (value) {
        case "DELIVERY":
        case "CAB":
        case "VENDOR":
        case "MATERIAL":
        case "STAFF":
        case "DOMESTIC_HELP":
            return value;
        default:
            return "GUEST";
    }
}
function mapStoreGateLogs(): GateActivityLog[] {
    return mockStore.getState().gateLogs.map<GateActivityLog>((log) => ({
        id: log.id,
        activityType: mapActivityType(log.visitorType),
        personName: log.visitorName,
        flatOrCommon: log.flatNumber || "A-1204",
        gateName: log.gateNumber || "Gate 1",
        time: log.entryTime,
        guardName: log.guardName,
        status: "CHECKED_IN",
        entrySource: "MANUAL",
        approvalSource: "PRE_APPROVED"
    }));
}
function mapVisitorToGatePass(visitor: Visitor): GatePass {
    return {
        id: visitor.id,
        visitorName: visitor.name,
        visitorPhone: visitor.phone,
        visitorType: visitor.type,
        visitingFlat: visitor.flatNumber || "A-1204",
        residentName: "Shashank",
        residentPhone: "7276834907",
        expectedTime: visitor.expectedTime || "12:00 PM",
        expectedDate: visitor.expectedDate || "2026-07-05",
        validityWindow: "4 Hours",
        otp: visitor.otp || "",
        approvalStatus: mapVisitorStatus(visitor.status),
        approvalSource: "PRE_APPROVED",
        ...includeWhenPresent("vehicleNumber", visitor.vehicleNumber),
        purpose: visitor.purpose
    };
}
export const gateMockSource = {
    async getDashboard(): Promise<RepositoryResult<GuardDashboard>> {
        await withMockDelay();
        const storeGateLogsMapped = mapStoreGateLogs();
        const mergedLogs = [...storeGateLogsMapped, ...mockGateActivityLogs];
        return repositorySuccess(mapGuardDashboardDtoToDomain({
            profile: mockGuardProfile,
            activityLogs: mergedLogs,
            offlineQueue: mockOfflineQueue
        }));
    },
    async expectedVisitors(): Promise<RepositoryResult<GatePass[]>> {
        await withMockDelay();
        const passes = mockStore.getState().visitors.map(mapVisitorToGatePass);
        return repositorySuccess(passes);
    },
    async searchPass(query: string): Promise<RepositoryResult<GatePass | Absent>> {
        await withMockDelay();
        const normalized = query.trim().toLowerCase();
        const passes = mockStore.getState().visitors.map(mapVisitorToGatePass);
        const matched = passes.find((pass) => pass.otp === query.trim() ||
            pass.visitorName.toLowerCase().includes(normalized) ||
            pass.visitingFlat.toLowerCase().includes(normalized));
        return repositorySuccess(matched);
    },
    async passDetail(passCode?: string): Promise<RepositoryResult<GatePass | Absent>> {
        await withMockDelay();
        const passes = mockStore.getState().visitors.map(mapVisitorToGatePass);
        const matched = passes.find((pass) => pass.otp === passCode || pass.id === passCode);
        return repositorySuccess(matched || passes[0]);
    },
    async gateActivity(): Promise<RepositoryResult<GateActivityLog[]>> {
        await withMockDelay();
        const storeGateLogsMapped = mapStoreGateLogs();
        return repositorySuccess([...storeGateLogsMapped, ...mockGateActivityLogs]);
    },
    async offlineQueue(): Promise<RepositoryResult<OfflineQueueItem[]>> {
        await withMockDelay();
        return repositorySuccess(mockOfflineQueue);
    },
    async staffToday(): Promise<RepositoryResult<StaffMember[]>> {
        await withMockDelay();
        return repositorySuccess(mockStaffMembers);
    },
    async shiftSummary(): Promise<RepositoryResult<ShiftSummary>> {
        await withMockDelay();
        return repositorySuccess(mockShiftSummary);
    },
    async emergencyTypes(): Promise<RepositoryResult<EmergencyTypeOption[]>> {
        await withMockDelay();
        return repositorySuccess(mockEmergencyTypes);
    },
    async recordGateEntry(payload: RecordGateEntryPayload): Promise<RepositoryResult<GateActivityLog>> {
        await withMockDelay();
        mockStore.addGateLog({
            id: `gate-log-${Date.now()}`,
            visitorId: payload.passId || `vis-${Date.now()}`,
            visitorName: payload.personName,
            entryTime: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            guardName: mockGuardProfile.name,
            gateNumber: mockGuardProfile.gateName
        });
        if (payload.passId) {
            mockStore.updateVisitor(payload.passId, { status: "CHECKED_IN" });
        }
        const log: GateActivityLog = {
            id: `gate-log-${Date.now()}`,
            activityType: payload.entryType === "STAFF" ? "STAFF" : "GUEST",
            personName: payload.personName,
            flatOrCommon: payload.flatNumber || "A-1204",
            gateName: mockGuardProfile.gateName,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            guardName: mockGuardProfile.name,
            status: "CHECKED_IN",
            entrySource: "MANUAL",
            approvalSource: "PRE_APPROVED"
        };
        return repositorySuccess(log);
    },
    async checkInStaff(staffId: string): Promise<RepositoryResult<StaffMember | Absent>> {
        await withMockDelay();
        const staff = mockStaffMembers.find((member) => member.id === staffId);
        return repositorySuccess(staff
            ? {
                ...staff,
                attendanceStatus: "CHECKED_IN",
                lastCheckIn: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }
            : undefined);
    },
    async sendEmergencyAlert(payload: EmergencyAlertRequest): Promise<RepositoryResult<EmergencyAlertPayload>> {
        await withMockDelay();
        return repositorySuccess({
            id: `emergency-${Date.now()}`,
            type: payload.type,
            location: payload.location,
            ...includeWhenPresent("description", payload.description),
            severity: "HIGH",
            timestamp: new Date().toISOString(),
            incidentNumber: `INC-${Date.now()}`
        });
    }
};

