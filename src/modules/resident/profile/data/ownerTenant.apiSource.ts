import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult, } from '../../../../core/repositories/repository.types';
import type { OwnerInfo, TenantInfo, FamilyMember, Vehicle, MoveInRequest, ResidentHistoryRecord, UnitDocumentSummary } from '../../../../shared/types/ownerTenant.types';
import type { OccupancyOverview, OccupancyTimelineEvent } from '../../../../shared/types/occupancy.types';
import type { UnitAccessStatusInfo } from '../../../../shared/types/unitAccess.types';
import { mapOwnerDtoToDomain, mapTenantDtoToDomain, mapFamilyMemberDtoToDomain, mapVehicleDtoToDomain, mapTimelineEventDtoToDomain, mapMoveInRequestDtoToDomain, } from './ownerTenant.mapper';
import type { TenantInfoDto, FamilyMemberDto, VehicleDto, OccupancyTimelineEventDto, MoveInRequestDto, CurrentOwnerDto, PreviousResidentDocumentDto, ResidentHistoryRecordDto, UnitAccessStatusDto, UnitDocumentSummaryDto, UnitOccupancyOverviewDto, } from './ownerTenant.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
const SOCIETY_ID_PLACEHOLDER = 'society-001';
export const ownerTenantApiSource = {
    async getUnitOccupancyOverview(unitId: string): Promise<RepositoryResult<OccupancyOverview>> {
        try {
            const dto = await apiClient.get<UnitOccupancyOverviewDto>(apiEndpoints.occupancy.occupancyOverview(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess({
                unitDetails: {
                    id: dto.unit_details.id,
                    societyId: dto.unit_details.society_id,
                    tower: dto.unit_details.tower,
                    floor: dto.unit_details.floor,
                    flatNumber: dto.unit_details.flat_number,
                    unitType: dto.unit_details.unit_type,
                    occupancyStatus: dto.unit_details.occupancy_status,
                    carpetAreaSqFt: dto.unit_details.carpet_area_sq_ft,
                    parkingSlots: dto.unit_details.parking_slots
                },
                societyName: dto.society_name,
                ...includeWhenPresent("currentOwner", dto.current_owner ? mapOwnerDtoToDomain(dto.current_owner) : undefined),
                ...includeWhenPresent("currentTenant", dto.current_tenant ? mapTenantDtoToDomain(dto.current_tenant) : undefined),
                familyMembersCount: dto.family_members_count,
                vehiclesCount: dto.vehicles_count,
                documentsCompletionCount: dto.documents_completion_count,
                documentsPendingCount: dto.documents_pending_count,
                previousOwnersCount: dto.previous_owners_count,
                previousTenantsCount: dto.previous_tenants_count,
                ...includeWhenPresent("lastOwnershipChangeDate", dto.last_ownership_change_date),
                ...includeWhenPresent("lastTenancyChangeDate", dto.last_tenancy_change_date)
            });
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getCurrentOwner(unitId: string): Promise<RepositoryResult<{
        primary: OwnerInfo;
        coOwner?: OwnerInfo;
    }>> {
        try {
            const dto = await apiClient.get<CurrentOwnerDto>(apiEndpoints.occupancy.currentOwner(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess({
                primary: mapOwnerDtoToDomain(dto.primary),
                ...includeWhenPresent("coOwner", dto.co_owner ? mapOwnerDtoToDomain(dto.co_owner) : undefined)
            });
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getCurrentTenant(unitId: string): Promise<RepositoryResult<TenantInfo | Absent>> {
        try {
            const dto = await apiClient.get<TenantInfoDto>(apiEndpoints.occupancy.currentTenant(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess(dto ? mapTenantDtoToDomain(dto) : undefined);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getFamilyMembers(unitId: string): Promise<RepositoryResult<FamilyMember[]>> {
        try {
            const dtos = await apiClient.get<FamilyMemberDto[]>(apiEndpoints.occupancy.familyMembers(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess(dtos.map(mapFamilyMemberDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getVehicles(unitId: string): Promise<RepositoryResult<Vehicle[]>> {
        try {
            const dtos = await apiClient.get<VehicleDto[]>(apiEndpoints.occupancy.vehicles(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess(dtos.map(mapVehicleDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getOwnerHistory(unitId: string): Promise<RepositoryResult<ResidentHistoryRecord[]>> {
        try {
            const dtos = await apiClient.get<ResidentHistoryRecordDto[]>(apiEndpoints.occupancy.ownerHistory(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess(dtos.map((d) => ({
                id: d.id,
                name: d.name,
                residentType: 'OWNER',
                occupancyStartDate: d.occupancy_start_date,
                occupancyEndDate: d.occupancy_end_date,
                ...includeWhenPresent("transferReason", d.transfer_reason),
                ...includeWhenPresent("transferReferenceMasked", d.transfer_reference_masked),
                policeVerificationStatus: d.police_verification_status,
                moveOutNocStatus: d.move_out_noc_status,
                duesClearanceStatus: d.dues_clearance_status,
                documentsCount: d.documents_count,
                accessStatus: d.access_status,
                ...includeWhenPresent("notes", d.notes)
            })));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getTenantHistory(unitId: string): Promise<RepositoryResult<ResidentHistoryRecord[]>> {
        try {
            const dtos = await apiClient.get<ResidentHistoryRecordDto[]>(apiEndpoints.occupancy.tenantHistory(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess(dtos.map((d) => ({
                id: d.id,
                name: d.name,
                residentType: 'TENANT',
                occupancyStartDate: d.occupancy_start_date,
                occupancyEndDate: d.occupancy_end_date,
                ...includeWhenPresent("agreementPeriod", d.agreement_period),
                policeVerificationStatus: d.police_verification_status,
                moveOutNocStatus: d.move_out_noc_status,
                duesClearanceStatus: d.dues_clearance_status,
                documentsCount: d.documents_count,
                accessStatus: d.access_status,
                ...includeWhenPresent("notes", d.notes)
            })));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getOccupancyTimeline(unitId: string): Promise<RepositoryResult<OccupancyTimelineEvent[]>> {
        try {
            const dtos = await apiClient.get<OccupancyTimelineEventDto[]>(apiEndpoints.occupancy.occupancyTimeline(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess(dtos.map(mapTimelineEventDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getPreviousResidentDetail(unitId: string, residentHistoryId: string): Promise<RepositoryResult<ResidentHistoryRecord | Absent>> {
        try {
            const d = await apiClient.get<ResidentHistoryRecordDto>(apiEndpoints.occupancy.ownerHistoryDetail(SOCIETY_ID_PLACEHOLDER, unitId, residentHistoryId));
            return repositorySuccess({
                id: d.id,
                name: d.name,
                residentType: d.resident_type,
                occupancyStartDate: d.occupancy_start_date,
                occupancyEndDate: d.occupancy_end_date,
                ...includeWhenPresent("transferReason", d.transfer_reason),
                ...includeWhenPresent("transferReferenceMasked", d.transfer_reference_masked),
                ...includeWhenPresent("agreementPeriod", d.agreement_period),
                policeVerificationStatus: d.police_verification_status,
                moveOutNocStatus: d.move_out_noc_status,
                duesClearanceStatus: d.dues_clearance_status,
                documentsCount: d.documents_count,
                accessStatus: d.access_status,
                ...includeWhenPresent("notes", d.notes)
            });
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getPreviousResidentDocuments(unitId: string, residentHistoryId: string): Promise<RepositoryResult<{
        id: string;
        title: string;
        category: string;
        sensitivity: string;
    }[]>> {
        try {
            const list = await apiClient.get<PreviousResidentDocumentDto[]>(apiEndpoints.occupancy.prevResidentDocs(SOCIETY_ID_PLACEHOLDER, unitId, residentHistoryId));
            return repositorySuccess(list.map((item) => ({
                id: item.id,
                title: item.title,
                category: item.category,
                sensitivity: item.sensitivity
            })));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createMoveInRequest(input: Partial<MoveInRequest>): Promise<RepositoryResult<MoveInRequest>> {
        try {
            const dto = await apiClient.post<MoveInRequestDto>(apiEndpoints.occupancy.createMoveInRequest, input, { idempotencyKey: createIdempotencyKey('move-in-request') });
            return repositorySuccess(mapMoveInRequestDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getUnitAccessStatus(unitId: string): Promise<RepositoryResult<UnitAccessStatusInfo>> {
        try {
            const dto = await apiClient.get<UnitAccessStatusDto>(apiEndpoints.occupancy.accessStatus(SOCIETY_ID_PLACEHOLDER, unitId));
            return repositorySuccess({
                unitId: dto.unit_id,
                residentId: dto.resident_id,
                residentName: dto.resident_name,
                residentType: dto.resident_type,
                accessStatus: dto.access_status,
                capabilities: dto.capabilities.map((c) => ({
                    capability: c.capability,
                    label: c.label,
                    description: c.description,
                    isAllowed: c.is_allowed
                })),
                lastModifiedDate: dto.last_modified_date,
                lastModifiedBy: dto.last_modified_by,
                ...includeWhenPresent("warningNote", dto.warning_note)
            });
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getUnitDocuments(unitId: string): Promise<RepositoryResult<UnitDocumentSummary[]>> {
        try {
            const dtos = await apiClient.get<UnitDocumentSummaryDto[]>(`/occupancy/units/${unitId}/documents`);
            return repositorySuccess(dtos.map(d => ({
                id: d.id,
                title: d.title,
                category: d.category,
                status: d.status,
                expiry: d.expiry
            })));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    }
};

