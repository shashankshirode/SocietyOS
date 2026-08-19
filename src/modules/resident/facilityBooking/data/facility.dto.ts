import type { Facility, FacilityBlockedSlot, FacilityCalendarDay, FacilityRules, FacilitySlot } from '../../../../shared/types/facility.types';
import type {
  CancelFacilityBookingInput,
  CreateFacilityBookingInput,
  FacilityBooking,
  FacilityCheckInPass,
  FacilityDepositRefund,
  FacilityHome,
  FacilityUsageHistory,
  GuestRoomBookingInput,
  RescheduleFacilityBookingInput,
} from '../../../../shared/types/facilityBooking.types';

export type FacilityDto = Facility;
export type FacilitySlotDto = FacilitySlot;
export type FacilityBookingDto = FacilityBooking;
export type FacilityHomeDto = FacilityHome;
export type FacilityRulesDto = FacilityRules;
export type FacilityBlockedSlotDto = FacilityBlockedSlot;
export type FacilityDepositRefundDto = FacilityDepositRefund;
export type FacilityCheckInPassDto = FacilityCheckInPass;
export type FacilityCalendarDayDto = FacilityCalendarDay;
export type FacilityUsageHistoryDto = FacilityUsageHistory;
export type CreateFacilityBookingRequestDto = CreateFacilityBookingInput;
export type CancelFacilityBookingRequestDto = CancelFacilityBookingInput;
export type RescheduleFacilityBookingRequestDto = RescheduleFacilityBookingInput;
export type GuestRoomBookingRequestDto = GuestRoomBookingInput;

export type FacilityListParams = {
  query?: string;
  filter?: string;
};

export type FacilityBookingListParams = {
  unitId?: string;
  status?: string;
  query?: string;
};
