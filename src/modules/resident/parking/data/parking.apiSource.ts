import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult, } from '../../../../core/repositories/repository.types';
import type { AddVehicleInput, GuardVehicleLookupResult, Vehicle } from '../../../../shared/types/vehicle.types';
import type { CreateParkingIncidentInput, CreateVisitorParkingPassInput, ExtendVisitorParkingPassInput, ParkingHardwareActionInput, ParkingHardwareReadiness, ParkingHome, ParkingIncident, ParkingRules, ParkingSlot, ParkingSlotChangeRequestInput, ParkingViolation, StickerRfidRecord, VisitorParkingPass, } from '../../../../shared/types/parking.types';
import type { GuardVehicleLookupResultDto, ParkingHardwareReadinessDto, ParkingHomeDto, ParkingIncidentDto, ParkingIncidentListParams, ParkingRulesDto, ParkingSlotDto, ParkingViolationDto, StickerRfidRecordDto, VehicleDto, VisitorParkingPassDto, } from './parking.dto';
import { mapGuardVehicleLookupDtoToDomain, mapParkingHardwareReadinessDtoToDomain, mapParkingHomeDtoToDomain, mapParkingIncidentDtoToDomain, mapParkingRulesDtoToDomain, mapParkingSlotDtoToDomain, mapParkingViolationDtoToDomain, mapStickerRfidRecordDtoToDomain, mapVehicleDtoToDomain, mapVisitorParkingPassDtoToDomain, } from './parking.mapper';
import type { Absent } from "../../../../shared/types/absence.types";
const DEFAULT_SOCIETY_ID = 'society-001';
export const parkingApiSource = {
    async getParkingHome(unitId: string): Promise<RepositoryResult<ParkingHome>> {
        try {
            const dto = await apiClient.get<ParkingHomeDto>(apiEndpoints.parking.home(DEFAULT_SOCIETY_ID, unitId));
            return repositorySuccess(mapParkingHomeDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getMyVehicles(unitId: string): Promise<RepositoryResult<Vehicle[]>> {
        try {
            const dtos = await apiClient.get<VehicleDto[]>(apiEndpoints.parking.vehicles(DEFAULT_SOCIETY_ID, unitId));
            return repositorySuccess(dtos.map(mapVehicleDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getVehicleDetail(vehicleId: string): Promise<RepositoryResult<Vehicle | Absent>> {
        try {
            const dto = await apiClient.get<VehicleDto>(apiEndpoints.parking.vehicleDetail(DEFAULT_SOCIETY_ID, 'unit-a-1204', vehicleId));
            return repositorySuccess(mapVehicleDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async addVehicle(input: AddVehicleInput): Promise<RepositoryResult<Vehicle>> {
        try {
            const dto = await apiClient.post<VehicleDto>(apiEndpoints.parking.createVehicle(input.societyId, input.unitId), input, { idempotencyKey: createIdempotencyKey('parking-add-vehicle') });
            return repositorySuccess(mapVehicleDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getParkingSlots(unitId: string): Promise<RepositoryResult<ParkingSlot[]>> {
        try {
            const dtos = await apiClient.get<ParkingSlotDto[]>(apiEndpoints.parking.unitSlots(DEFAULT_SOCIETY_ID, unitId));
            return repositorySuccess(dtos.map(mapParkingSlotDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getParkingSlotDetail(slotId: string): Promise<RepositoryResult<ParkingSlot | Absent>> {
        try {
            const dto = await apiClient.get<ParkingSlotDto>(apiEndpoints.parking.slotDetail(DEFAULT_SOCIETY_ID, slotId));
            return repositorySuccess(mapParkingSlotDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async requestParkingSlotChange(input: ParkingSlotChangeRequestInput): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.post(apiEndpoints.parking.requestSlotChange(input.societyId, input.slotId), {}, { idempotencyKey: createIdempotencyKey('parking-slot-change') });
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getVisitorParkingPasses(unitId: string): Promise<RepositoryResult<VisitorParkingPass[]>> {
        try {
            const dtos = await apiClient.get<VisitorParkingPassDto[]>(apiEndpoints.parking.visitorPasses, {
                query: { unitId },
            });
            return repositorySuccess(dtos.map(mapVisitorParkingPassDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createVisitorParkingPass(input: CreateVisitorParkingPassInput): Promise<RepositoryResult<VisitorParkingPass>> {
        try {
            const dto = await apiClient.post<VisitorParkingPassDto>(apiEndpoints.parking.visitorPasses, input, { idempotencyKey: createIdempotencyKey('parking-visitor-pass') });
            return repositorySuccess(mapVisitorParkingPassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getVisitorParkingPassDetail(passId: string): Promise<RepositoryResult<VisitorParkingPass | Absent>> {
        try {
            const dto = await apiClient.get<VisitorParkingPassDto>(apiEndpoints.parking.visitorPassDetail(passId));
            return repositorySuccess(mapVisitorParkingPassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async cancelVisitorParkingPass(passId: string): Promise<RepositoryResult<VisitorParkingPass | Absent>> {
        try {
            const dto = await apiClient.post<VisitorParkingPassDto>(apiEndpoints.parking.cancelVisitorPass(passId), {}, { idempotencyKey: createIdempotencyKey('parking-cancel-visitor-pass') });
            return repositorySuccess(mapVisitorParkingPassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async extendVisitorParkingPass(input: ExtendVisitorParkingPassInput): Promise<RepositoryResult<VisitorParkingPass | Absent>> {
        try {
            const dto = await apiClient.post<VisitorParkingPassDto>(apiEndpoints.parking.extendVisitorPass(input.passId), { hours: input.hours }, { idempotencyKey: createIdempotencyKey('parking-extend-visitor-pass') });
            return repositorySuccess(mapVisitorParkingPassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getParkingIncidents(params: ParkingIncidentListParams = {}): Promise<RepositoryResult<ParkingIncident[]>> {
        try {
            const dtos = await apiClient.get<ParkingIncidentDto[]>(apiEndpoints.parking.incidents, {
                query: params,
            });
            return repositorySuccess(dtos.map(mapParkingIncidentDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getParkingIncidentDetail(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        try {
            const dto = await apiClient.get<ParkingIncidentDto>(apiEndpoints.parking.incidentDetail(incidentId));
            return repositorySuccess(mapParkingIncidentDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createParkingIncident(input: CreateParkingIncidentInput): Promise<RepositoryResult<ParkingIncident>> {
        try {
            const dto = await apiClient.post<ParkingIncidentDto>(apiEndpoints.parking.createIncident, input, { idempotencyKey: createIdempotencyKey('parking-incident') });
            return repositorySuccess(mapParkingIncidentDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async resolveParkingIncident(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        try {
            const dto = await apiClient.post<ParkingIncidentDto>(apiEndpoints.parking.resolveIncident(incidentId), {}, { idempotencyKey: createIdempotencyKey('parking-incident-resolve') });
            return repositorySuccess(mapParkingIncidentDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async escalateParkingIncident(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        try {
            const dto = await apiClient.post<ParkingIncidentDto>(apiEndpoints.parking.escalateIncident(incidentId), {}, { idempotencyKey: createIdempotencyKey('parking-incident-escalate') });
            return repositorySuccess(mapParkingIncidentDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async reportFalseParkingResolution(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        try {
            const dto = await apiClient.post<ParkingIncidentDto>(apiEndpoints.parking.falseResolution(incidentId), {}, { idempotencyKey: createIdempotencyKey('parking-incident-false-resolution') });
            return repositorySuccess(mapParkingIncidentDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getParkingViolationHistory(unitId: string): Promise<RepositoryResult<ParkingViolation[]>> {
        try {
            const dtos = await apiClient.get<ParkingViolationDto[]>(apiEndpoints.parking.violations, {
                query: { unitId },
            });
            return repositorySuccess(dtos.map(mapParkingViolationDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getStickerRfidStatus(unitId: string): Promise<RepositoryResult<StickerRfidRecord[]>> {
        try {
            const dtos = await apiClient.get<StickerRfidRecordDto[]>(apiEndpoints.parking.stickers, {
                query: { unitId },
            });
            return repositorySuccess(dtos.map(mapStickerRfidRecordDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async updateParkingHardware(input: ParkingHardwareActionInput): Promise<RepositoryResult<StickerRfidRecord | Absent>> {
        try {
            const endpoint = input.action === 'REQUEST_STICKER'
                ? apiEndpoints.parking.requestSticker
                : input.action === 'REQUEST_RFID'
                    ? apiEndpoints.parking.requestRfid
                    : apiEndpoints.parking.markStickerLost(input.recordId);
            const dto = await apiClient.post<StickerRfidRecordDto>(endpoint, { recordId: input.recordId, vehicleId: input.vehicleId }, { idempotencyKey: createIdempotencyKey(`parking-hardware-${input.action.toLowerCase()}`) });
            return repositorySuccess(mapStickerRfidRecordDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async lookupVehicleForGuard(query: string): Promise<RepositoryResult<GuardVehicleLookupResult[]>> {
        try {
            const dtos = await apiClient.get<GuardVehicleLookupResultDto[]>(apiEndpoints.parking.guardVehicleLookup, {
                query: { q: query },
            });
            return repositorySuccess(dtos.map(mapGuardVehicleLookupDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getHardwareReadiness(societyId: string): Promise<RepositoryResult<ParkingHardwareReadiness>> {
        try {
            const dto = await apiClient.get<ParkingHardwareReadinessDto>(apiEndpoints.parking.hardwareReadiness(societyId));
            return repositorySuccess(mapParkingHardwareReadinessDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getParkingRules(): Promise<RepositoryResult<ParkingRules>> {
        try {
            const dto = await apiClient.get<ParkingRulesDto>(apiEndpoints.parking.rules);
            return repositorySuccess(mapParkingRulesDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async registerVehicle(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async allocateParkingSlot(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async createTemporaryVehiclePass(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async listParkingViolations(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async getRfidReadinessStatus(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
};

