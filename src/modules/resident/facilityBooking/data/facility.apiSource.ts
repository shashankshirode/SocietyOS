import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Facility, FacilityBlockedSlot, FacilityCalendarDay, FacilityRules, FacilitySlot } from '../../../../shared/types/facility.types';
import type { CancelFacilityBookingInput, CreateFacilityBookingInput, FacilityBooking, FacilityCheckInPass, FacilityDepositRefund, FacilityHome, FacilityUsageHistory, GuestRoomBookingInput, RescheduleFacilityBookingInput, } from '../../../../shared/types/facilityBooking.types';
import type { FacilityBlockedSlotDto, FacilityBookingDto, FacilityBookingListParams, FacilityCalendarDayDto, FacilityCheckInPassDto, FacilityDepositRefundDto, FacilityDto, FacilityHomeDto, FacilityListParams, FacilityRulesDto, FacilitySlotDto, FacilityUsageHistoryDto, } from './facility.dto';
import { mapFacilityBlockedSlotDtoToDomain, mapFacilityBookingDtoToDomain, mapFacilityCalendarDayDtoToDomain, mapFacilityCheckInPassDtoToDomain, mapFacilityDepositRefundDtoToDomain, mapFacilityDtoToDomain, mapFacilityHomeDtoToDomain, mapFacilityRulesDtoToDomain, mapFacilitySlotDtoToDomain, mapFacilityUsageHistoryDtoToDomain, } from './facility.mapper';
import type { Absent } from "../../../../shared/types/absence.types";
const SOCIETY_ID = 'society-001';
export const facilityApiSource = {
    async getFacilityHome(unitId: string): Promise<RepositoryResult<FacilityHome>> {
        try {
            const dto = await apiClient.get<FacilityHomeDto>(apiEndpoints.facilities.bookings, { query: { unitId } });
            return repositorySuccess(mapFacilityHomeDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getFacilities(params: FacilityListParams = {}): Promise<RepositoryResult<Facility[]>> {
        try {
            const dtos = await apiClient.get<FacilityDto[]>(apiEndpoints.facilities.list(SOCIETY_ID), { query: params });
            return repositorySuccess(dtos.map(mapFacilityDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getFacilityDetail(facilityId: string): Promise<RepositoryResult<Facility | Absent>> {
        try {
            const dto = await apiClient.get<FacilityDto>(apiEndpoints.facilities.detail(SOCIETY_ID, facilityId));
            return repositorySuccess(mapFacilityDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getFacilityAvailability(facilityId: string, date: string): Promise<RepositoryResult<FacilitySlot[]>> {
        try {
            const dtos = await apiClient.get<FacilitySlotDto[]>(apiEndpoints.facilities.availability(SOCIETY_ID, facilityId), { query: { date } });
            return repositorySuccess(dtos.map(mapFacilitySlotDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createFacilityBooking(input: CreateFacilityBookingInput): Promise<RepositoryResult<FacilityBooking>> {
        try {
            const dto = await apiClient.post<FacilityBookingDto>(apiEndpoints.facilities.bookings, input, { idempotencyKey: createIdempotencyKey('facility-booking') });
            return repositorySuccess(mapFacilityBookingDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getMyBookings(params: FacilityBookingListParams = {}): Promise<RepositoryResult<FacilityBooking[]>> {
        try {
            const dtos = await apiClient.get<FacilityBookingDto[]>(apiEndpoints.facilities.bookings, { query: params });
            return repositorySuccess(dtos.map(mapFacilityBookingDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getBookingDetail(bookingId: string): Promise<RepositoryResult<FacilityBooking | Absent>> {
        try {
            const dto = await apiClient.get<FacilityBookingDto>(apiEndpoints.facilities.bookingDetail(bookingId));
            return repositorySuccess(mapFacilityBookingDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async cancelBooking(bookingId: string, input: CancelFacilityBookingInput): Promise<RepositoryResult<FacilityBooking | Absent>> {
        try {
            const dto = await apiClient.post<FacilityBookingDto>(apiEndpoints.facilities.cancelBooking(bookingId), input, { idempotencyKey: createIdempotencyKey('facility-cancel') });
            return repositorySuccess(mapFacilityBookingDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async rescheduleBooking(bookingId: string, input: RescheduleFacilityBookingInput): Promise<RepositoryResult<FacilityBooking | Absent>> {
        try {
            const dto = await apiClient.post<FacilityBookingDto>(apiEndpoints.facilities.rescheduleBooking(bookingId), input, { idempotencyKey: createIdempotencyKey('facility-reschedule') });
            return repositorySuccess(mapFacilityBookingDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getDepositRefund(bookingId: string): Promise<RepositoryResult<FacilityDepositRefund | Absent>> {
        try {
            const dto = await apiClient.get<FacilityDepositRefundDto>(apiEndpoints.facilities.depositRefund(bookingId));
            return repositorySuccess(mapFacilityDepositRefundDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getCheckInPass(bookingId: string): Promise<RepositoryResult<FacilityCheckInPass | Absent>> {
        try {
            const dto = await apiClient.get<FacilityCheckInPassDto>(apiEndpoints.facilities.checkInPass(bookingId));
            return repositorySuccess(mapFacilityCheckInPassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async simulateCheckIn(bookingId: string): Promise<RepositoryResult<FacilityCheckInPass | Absent>> {
        try {
            const dto = await apiClient.post<FacilityCheckInPassDto>(apiEndpoints.facilities.checkIn(bookingId), {}, { idempotencyKey: createIdempotencyKey('facility-check-in') });
            return repositorySuccess(mapFacilityCheckInPassDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createGuestRoomBooking(input: GuestRoomBookingInput): Promise<RepositoryResult<FacilityBooking>> {
        try {
            const dto = await apiClient.post<FacilityBookingDto>(apiEndpoints.facilities.guestRoomBookings, input, { idempotencyKey: createIdempotencyKey('guest-room-booking') });
            return repositorySuccess(mapFacilityBookingDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getFacilityRules(facilityId = 'facility-1'): Promise<RepositoryResult<FacilityRules>> {
        try {
            const dto = await apiClient.get<FacilityRulesDto>(apiEndpoints.facilities.rules(SOCIETY_ID, facilityId));
            return repositorySuccess(mapFacilityRulesDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getFacilityCalendar(date: string): Promise<RepositoryResult<FacilityCalendarDay[]>> {
        try {
            const dtos = await apiClient.get<FacilityCalendarDayDto[]>(apiEndpoints.facilities.calendar(SOCIETY_ID), { query: { date } });
            return repositorySuccess(dtos.map(mapFacilityCalendarDayDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getBlockedSlots(facilityId = 'facility-1'): Promise<RepositoryResult<FacilityBlockedSlot[]>> {
        try {
            const dtos = await apiClient.get<FacilityBlockedSlotDto[]>(apiEndpoints.facilities.blockedSlots(SOCIETY_ID, facilityId));
            return repositorySuccess(dtos.map(mapFacilityBlockedSlotDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getUsageHistory(): Promise<RepositoryResult<FacilityUsageHistory[]>> {
        try {
            const dtos = await apiClient.get<FacilityUsageHistoryDto[]>(apiEndpoints.facilities.usageHistory);
            return repositorySuccess(dtos.map(mapFacilityUsageHistoryDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async listFacilities(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async listAvailableFacilitySlots(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async approveFacilityBooking(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async cancelFacilityBooking(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async createFacilityQrCheckInPlaceholder(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
};

