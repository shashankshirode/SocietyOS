import type { GateActivityLog, GatePass, OfflineQueueItem } from '../../../shared/types/gate.types';
import type { GuardProfile, ShiftSummary } from '../../../shared/types/guard.types';
import type { StaffMember } from '../../../shared/types/staff.types';
import type { GateActivityLogDto, GatePassDto, GuardDashboard, GuardDashboardDto, GuardProfileDto, OfflineQueueItemDto, ShiftSummaryDto, StaffMemberDto, } from './gate.dto';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export function mapGatePassDtoToDomain(dto: GatePassDto): GatePass {
    return {
        id: dto.id,
        visitorName: dto.visitorName ?? 'Visitor',
        ...includeWhenPresent("visitorPhone", dto.visitorPhone),
        visitorType: dto.visitorType ?? 'GUEST',
        visitingFlat: dto.visitingFlat ?? '',
        residentName: dto.residentName ?? '',
        ...includeWhenPresent("residentPhone", dto.residentPhone),
        expectedTime: dto.expectedTime ?? '',
        expectedDate: dto.expectedDate ?? '',
        validityWindow: dto.validityWindow ?? '',
        otp: dto.otp ?? '',
        approvalStatus: dto.approvalStatus ?? 'EXPECTED',
        approvalSource: dto.approvalSource ?? 'SYSTEM',
        ...includeWhenPresent("vehicleNumber", dto.vehicleNumber),
        ...includeWhenPresent("purpose", dto.purpose),
        ...includeWhenPresent("peopleCount", dto.peopleCount),
        ...includeWhenPresent("specialInstructions", dto.specialInstructions),
        ...includeWhenPresent("watchlistWarning", dto.watchlistWarning),
        ...includeWhenPresent("previousVisitCount", dto.previousVisitCount),
        ...includeWhenPresent("actualEntryTime", dto.actualEntryTime),
        ...includeWhenPresent("actualExitTime", dto.actualExitTime)
    };
}
export function mapGateActivityDtoToDomain(dto: GateActivityLogDto): GateActivityLog {
    return {
        id: dto.id,
        activityType: dto.activityType ?? 'GUEST',
        personName: dto.personName ?? '',
        flatOrCommon: dto.flatOrCommon ?? '',
        gateName: dto.gateName ?? '',
        time: dto.time ?? '',
        guardName: dto.guardName ?? '',
        status: dto.status ?? 'EXPECTED',
        entrySource: dto.entrySource ?? 'MANUAL',
        approvalSource: dto.approvalSource ?? 'SYSTEM',
        ...includeWhenPresent("vehicleNumber", dto.vehicleNumber),
        ...includeWhenPresent("passCode", dto.passCode)
    };
}
export function mapOfflineQueueDtoToDomain(dto: OfflineQueueItemDto): OfflineQueueItem {
    return {
        id: dto.id,
        entryType: dto.entryType ?? 'GUEST',
        personName: dto.personName ?? '',
        flatNumber: dto.flatNumber ?? '',
        createdTime: dto.createdTime ?? '',
        retryCount: dto.retryCount ?? 0,
        syncStatus: dto.syncStatus ?? 'PENDING_SYNC',
        ...includeWhenPresent("errorMessage", dto.errorMessage)
    };
}
export function mapStaffMemberDtoToDomain(dto: StaffMemberDto): StaffMember {
    return {
        id: dto.id,
        name: dto.name ?? '',
        staffType: dto.staffType ?? 'OTHER',
        linkedFlats: dto.linkedFlats ?? [],
        verificationStatus: dto.verificationStatus ?? 'PENDING',
        attendanceStatus: dto.attendanceStatus ?? 'NOT_CHECKED_IN',
        ...includeWhenPresent("lastCheckIn", dto.lastCheckIn),
        idBadgeNumber: dto.idBadgeNumber ?? '',
        ...includeWhenPresent("phone", dto.phone),
        ...includeWhenPresent("photoUrl", dto.photoUrl),
        ...includeWhenPresent("expiryDate", dto.expiryDate)
    };
}
export function mapGuardProfileDtoToDomain(dto: GuardProfileDto): GuardProfile {
    return {
        id: dto.id,
        name: dto.name ?? 'Guard',
        role: dto.role ?? 'SECURITY_GUARD',
        societyName: dto.societyName ?? '',
        gateName: dto.gateName ?? '',
        shiftName: dto.shiftName ?? '',
        shiftTime: dto.shiftTime ?? '',
        supervisorName: dto.supervisorName ?? '',
        deviceStatus: dto.deviceStatus ?? 'ONLINE'
    };
}
export function mapShiftSummaryDtoToDomain(dto: ShiftSummaryDto): ShiftSummary {
    return {
        guardName: dto.guardName ?? '',
        gateName: dto.gateName ?? '',
        shiftTime: dto.shiftTime ?? '',
        totalVisitorEntries: dto.totalVisitorEntries ?? 0,
        deliveries: dto.deliveries ?? 0,
        cabs: dto.cabs ?? 0,
        vendors: dto.vendors ?? 0,
        staffCheckIns: dto.staffCheckIns ?? 0,
        rejectedEntries: dto.rejectedEntries ?? 0,
        pendingOfflineSync: dto.pendingOfflineSync ?? 0,
        openIssues: dto.openIssues ?? 0,
        emergencyIncidents: dto.emergencyIncidents ?? 0
    };
}
export function mapGuardDashboardDtoToDomain(dto: GuardDashboardDto): GuardDashboard {
    const offlineQueue = dto.offlineQueue.map(mapOfflineQueueDtoToDomain);
    return {
        profile: mapGuardProfileDtoToDomain(dto.profile),
        activityLogs: dto.activityLogs.map(mapGateActivityDtoToDomain),
        offlinePendingCount: offlineQueue.filter((item) => item.syncStatus === 'PENDING_SYNC' || item.syncStatus === 'FAILED').length
    };
}

