import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { EmergencyAlertPayload, GateActivityLog, GatePass, OfflineQueueItem } from '../../../shared/types/gate.types';
import type { ShiftSummary } from '../../../shared/types/guard.types';
import type { StaffMember } from '../../../shared/types/staff.types';
import type { EmergencyAlertRequest, EmergencyTypeOption, GateActivityLogDto, GatePassDto, GuardDashboard, GuardDashboardDto, OfflineQueueItemDto, RecordGateEntryPayload, ShiftSummaryDto, StaffMemberDto } from './gate.dto';
import { mapGateActivityDtoToDomain, mapGatePassDtoToDomain, mapGuardDashboardDtoToDomain, mapOfflineQueueDtoToDomain, mapShiftSummaryDtoToDomain, mapStaffMemberDtoToDomain } from './gate.mapper';
import type { Absent } from "../../../shared/types/absence.types";
export const gateApiSource = {
    async getDashboard(): Promise<RepositoryResult<GuardDashboard>> {
        try {
            const dto = await apiClient.get<GuardDashboardDto>(apiEndpoints.gate.passesToday);
            return repositorySuccess(mapGuardDashboardDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async expectedVisitors(): Promise<RepositoryResult<GatePass[]>> {
        try {
            const dtos = await apiClient.get<GatePassDto[]>(apiEndpoints.gate.passesToday);
            return repositorySuccess(dtos.map(mapGatePassDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async searchPass(query: string): Promise<RepositoryResult<GatePass | Absent>> {
        try {
            const dto = await apiClient.get<GatePassDto>(apiEndpoints.gate.passSearch, {
                query: { q: query },
            });
            return repositorySuccess(mapGatePassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async passDetail(passCode?: string): Promise<RepositoryResult<GatePass | Absent>> {
        try {
            if (!passCode) {
                return repositorySuccess(undefined);
            }
            const dto = await apiClient.get<GatePassDto>(apiEndpoints.gate.passDetail(passCode));
            return repositorySuccess(mapGatePassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async gateActivity(): Promise<RepositoryResult<GateActivityLog[]>> {
        try {
            const dtos = await apiClient.get<GateActivityLogDto[]>(apiEndpoints.gate.activity);
            return repositorySuccess(dtos.map(mapGateActivityDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async offlineQueue(): Promise<RepositoryResult<OfflineQueueItem[]>> {
        try {
            const dtos = await apiClient.get<OfflineQueueItemDto[]>(apiEndpoints.gate.offlineQueue);
            return repositorySuccess(dtos.map(mapOfflineQueueDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async staffToday(): Promise<RepositoryResult<StaffMember[]>> {
        try {
            const dtos = await apiClient.get<StaffMemberDto[]>(apiEndpoints.staff.today);
            return repositorySuccess(dtos.map(mapStaffMemberDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async shiftSummary(): Promise<RepositoryResult<ShiftSummary>> {
        try {
            const dto = await apiClient.get<ShiftSummaryDto>(apiEndpoints.gate.shiftHandover);
            return repositorySuccess(mapShiftSummaryDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async emergencyTypes(): Promise<RepositoryResult<EmergencyTypeOption[]>> {
        return repositorySuccess([]);
    },
    async recordGateEntry(payload: RecordGateEntryPayload): Promise<RepositoryResult<GateActivityLog>> {
        try {
            const dto = await apiClient.post<GateActivityLogDto>(apiEndpoints.gate.entries, payload, { idempotencyKey: createIdempotencyKey('gate-entry') });
            return repositorySuccess(mapGateActivityDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async checkInStaff(staffId: string): Promise<RepositoryResult<StaffMember | Absent>> {
        try {
            const dto = await apiClient.post<StaffMemberDto>(apiEndpoints.staff.checkIn(staffId), {}, { idempotencyKey: createIdempotencyKey('staff-check-in') });
            return repositorySuccess(mapStaffMemberDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async sendEmergencyAlert(payload: EmergencyAlertRequest): Promise<RepositoryResult<EmergencyAlertPayload>> {
        try {
            const dto = await apiClient.post<EmergencyAlertPayload>(apiEndpoints.gate.emergencyAlerts, payload, { idempotencyKey: createIdempotencyKey('guard-emergency-alert') });
            return repositorySuccess(dto);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};

