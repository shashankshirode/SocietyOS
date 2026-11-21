export type FacilityCategory =
  | 'CLUBHOUSE'
  | 'SPORTS'
  | 'FITNESS'
  | 'EVENT_SPACE'
  | 'GUEST_ROOM'
  | 'KIDS'
  | 'COMMUNITY'
  | 'OTHER';

export type FacilityStatus =
  | 'AVAILABLE'
  | 'PARTIALLY_AVAILABLE'
  | 'BOOKED'
  | 'CLOSED'
  | 'UNDER_MAINTENANCE'
  | 'RESTRICTED';

export type FacilityBookingType =
  | 'HOURLY'
  | 'HALF_DAY'
  | 'FULL_DAY'
  | 'OVERNIGHT'
  | 'CUSTOM';

export type FacilitySlotStatus =
  | 'AVAILABLE'
  | 'BOOKED'
  | 'BLOCKED'
  | 'MAINTENANCE'
  | 'PENDING_APPROVAL'
  | 'SELECTED';

export type FacilityMaintenanceStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'EXTENDED'
  | 'CANCELLED';

export type Facility = {
  id: string;
  societyId: string;
  name: string;
  category: FacilityCategory;
  location: string;
  capacity: number;
  availabilityToday: string;
  bookingType: FacilityBookingType;
  chargeAmount: number;
  depositAmount: number;
  approvalRequired: boolean;
  operatingHours: string;
  status: FacilityStatus;
  durationOptions: string[];
  cancellationPolicySummary: string;
  rulesSummary: string;
  amenitiesIncluded: string[];
  allowedUserRoles: string[];
  todayAvailabilityPreview: string;
  maintenanceNotice?: string;
};

export type FacilitySlot = {
  id: string;
  facilityId: string;
  facilityName: string;
  date: string;
  timeRange: string;
  status: FacilitySlotStatus;
  price: number;
  depositRequired: number;
  capacityAvailable: number;
  conflictWarning?: string;
};

export type FacilityBlockedSlot = {
  id: string;
  facilityId: string;
  facilityName: string;
  blockedDate: string;
  blockedTime: string;
  reason: string;
  responsibleTeam: string;
  expectedReopening: string;
  status: FacilityMaintenanceStatus;
};

export type FacilityRules = {
  generalRules: string[];
  cancellationRules: string[];
  refundDepositRules: string[];
  guestLimitRules: string[];
  damagePolicy: string[];
  noiseTimingRules: string[];
  foodCateringRules: string[];
  cleaningRules: string[];
  sportsEquipmentRules: string[];
  guestRoomRules: string[];
};

export type FacilityCalendarDay = {
  date: string;
  facilityName: string;
  bookingCount: number;
  availableSlotCount: number;
  userBookingCount: number;
  isFullyBooked: boolean;
  hasMaintenanceBlock: boolean;
};
