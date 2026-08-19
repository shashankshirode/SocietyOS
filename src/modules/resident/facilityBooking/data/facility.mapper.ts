import type { Facility, FacilityBlockedSlot, FacilityCalendarDay, FacilityRules, FacilitySlot } from '../../../../shared/types/facility.types';
import type { FacilityBooking, FacilityCheckInPass, FacilityDepositRefund, FacilityHome, FacilityUsageHistory } from '../../../../shared/types/facilityBooking.types';
import type {
  FacilityBlockedSlotDto,
  FacilityBookingDto,
  FacilityCalendarDayDto,
  FacilityCheckInPassDto,
  FacilityDepositRefundDto,
  FacilityDto,
  FacilityHomeDto,
  FacilityRulesDto,
  FacilitySlotDto,
  FacilityUsageHistoryDto,
} from './facility.dto';

export const mapFacilityDtoToDomain = (dto: FacilityDto): Facility => ({ ...dto });
export const mapFacilitySlotDtoToDomain = (dto: FacilitySlotDto): FacilitySlot => ({ ...dto });
export const mapFacilityBookingDtoToDomain = (dto: FacilityBookingDto): FacilityBooking => ({ ...dto });
export const mapFacilityHomeDtoToDomain = (dto: FacilityHomeDto): FacilityHome => ({ ...dto });
export const mapFacilityRulesDtoToDomain = (dto: FacilityRulesDto): FacilityRules => ({ ...dto });
export const mapFacilityBlockedSlotDtoToDomain = (dto: FacilityBlockedSlotDto): FacilityBlockedSlot => ({ ...dto });
export const mapFacilityDepositRefundDtoToDomain = (dto: FacilityDepositRefundDto): FacilityDepositRefund => ({ ...dto });
export const mapFacilityCheckInPassDtoToDomain = (dto: FacilityCheckInPassDto): FacilityCheckInPass => ({ ...dto });
export const mapFacilityCalendarDayDtoToDomain = (dto: FacilityCalendarDayDto): FacilityCalendarDay => ({ ...dto });
export const mapFacilityUsageHistoryDtoToDomain = (dto: FacilityUsageHistoryDto): FacilityUsageHistory => ({ ...dto });
