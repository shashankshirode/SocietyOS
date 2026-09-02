export enum FacilityCategory {
  Clubhouse = 'CLUBHOUSE',
  Sports = 'SPORTS',
  Fitness = 'FITNESS',
  EventSpace = 'EVENT_SPACE',
  GuestStay = 'GUEST_STAY',
  Outdoor = 'OUTDOOR',
  Community = 'COMMUNITY',
}

export enum FacilityAvailabilityStatus {
  Available = 'AVAILABLE',
  LimitedSlots = 'LIMITED_SLOTS',
  FullyBooked = 'FULLY_BOOKED',
  UnderMaintenance = 'UNDER_MAINTENANCE',
  TemporarilyClosed = 'TEMPORARILY_CLOSED',
  Restricted = 'RESTRICTED',
}

export enum FacilitySlotStatus {
  Available = 'AVAILABLE',
  Limited = 'LIMITED',
  Full = 'FULL',
  Maintenance = 'MAINTENANCE',
  Closed = 'CLOSED',
  Held = 'HELD',
  Blackout = 'BLACKOUT',
}

export enum FacilityBookingStatus {
  Draft = 'DRAFT',
  SlotHeld = 'SLOT_HELD',
  PaymentPending = 'PAYMENT_PENDING',
  Confirmed = 'CONFIRMED',
  Waitlisted = 'WAITLISTED',
  CheckedIn = 'CHECKED_IN',
  InUse = 'IN_USE',
  Completed = 'COMPLETED',
  CancelledByResident = 'CANCELLED_BY_RESIDENT',
  CancelledBySociety = 'CANCELLED_BY_SOCIETY',
  Rejected = 'REJECTED',
  NoShow = 'NO_SHOW',
  Expired = 'EXPIRED',
  RefundPending = 'REFUND_PENDING',
  Refunded = 'REFUNDED',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
}

export enum FacilityPaymentStatus {
  NotRequired = 'NOT_REQUIRED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Paid = 'PAID',
  Failed = 'FAILED',
  Refunded = 'REFUNDED',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
}

export enum FacilityRefundStatus {
  NotApplicable = 'NOT_APPLICABLE',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Refunded = 'REFUNDED',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  NotRefundable = 'NOT_REFUNDABLE',
}

export enum FacilityBookingAction {
  Continue = 'CONTINUE',
  View = 'VIEW',
  Pay = 'PAY',
  Reschedule = 'RESCHEDULE',
  Cancel = 'CANCEL',
  CheckIn = 'CHECK_IN',
  ViewQr = 'VIEW_QR',
  JoinWaitlist = 'JOIN_WAITLIST',
  LeaveWaitlist = 'LEAVE_WAITLIST',
  BookAgain = 'BOOK_AGAIN',
  AddToCalendar = 'ADD_TO_CALENDAR',
}

export enum FacilityBookingCancellationReason {
  PlansChanged = 'PLANS_CHANGED',
  IncorrectDateOrTime = 'INCORRECT_DATE_OR_TIME',
  GuestCountChanged = 'GUEST_COUNT_CHANGED',
  FacilityNoLongerRequired = 'FACILITY_NO_LONGER_REQUIRED',
  Emergency = 'EMERGENCY',
  Other = 'OTHER',
}

export enum FacilityBookingFilter {
  Upcoming = 'UPCOMING',
  Past = 'PAST',
  Cancelled = 'CANCELLED',
  Waitlisted = 'WAITLISTED',
}

export enum FacilityDiscoveryFilter {
  All = 'ALL',
  AvailableToday = 'AVAILABLE_TODAY',
  Sports = 'SPORTS',
  Events = 'EVENTS',
  Fitness = 'FITNESS',
  GuestStay = 'GUEST_STAY',
  Outdoor = 'OUTDOOR',
}

export enum FacilityEligibilityCode {
  ActiveResidenceRequired = 'ACTIVE_RESIDENCE_REQUIRED',
  ResidenceAccessRequired = 'RESIDENCE_ACCESS_REQUIRED',
  WrongSociety = 'WRONG_SOCIETY',
  FeatureDisabled = 'FEATURE_DISABLED',
  RoleRestricted = 'ROLE_RESTRICTED',
  FacilityUnavailable = 'FACILITY_UNAVAILABLE',
  ResidenceSuspended = 'RESIDENCE_SUSPENDED',
  AccountInactive = 'ACCOUNT_INACTIVE',
  VerificationPending = 'VERIFICATION_PENDING',
  DocumentsPending = 'DOCUMENTS_PENDING',
  OutstandingDues = 'OUTSTANDING_DUES',
  UnitBlockedByAdmin = 'UNIT_BLOCKED_BY_ADMIN',
  TowerBlockedByAdmin = 'TOWER_BLOCKED_BY_ADMIN',
  BookingLimitReached = 'BOOKING_LIMIT_REACHED',
  OverlappingBooking = 'OVERLAPPING_BOOKING',
  SlotUnavailable = 'SLOT_UNAVAILABLE',
  GuestCapacityExceeded = 'GUEST_CAPACITY_EXCEEDED',
  AdvanceWindowInvalid = 'ADVANCE_WINDOW_INVALID',
  DurationInvalid = 'DURATION_INVALID',
  OutsideOperatingHours = 'OUTSIDE_OPERATING_HOURS',
  BufferConflict = 'BUFFER_CONFLICT',
  PastSlot = 'PAST_SLOT',
  BlackoutPeriod = 'BLACKOUT_PERIOD',
  ConsentRequired = 'CONSENT_REQUIRED',
  PaymentMethodRequired = 'PAYMENT_METHOD_REQUIRED',
}

export enum FacilityEligibilityWarningCode {
  LimitedAvailability = 'LIMITED_AVAILABILITY',
  CancellationCutoffNear = 'CANCELLATION_CUTOFF_NEAR',
  ApprovalRequired = 'APPROVAL_REQUIRED',
  RefundRestriction = 'REFUND_RESTRICTION',
}

export enum FacilityCheckInMode {
  Qr = 'QR',
  Reference = 'REFERENCE',
  NotRequired = 'NOT_REQUIRED',
}

export enum FacilityCheckInResultCode {
  Success = 'SUCCESS',
  TooEarly = 'TOO_EARLY',
  TooLate = 'TOO_LATE',
  InvalidStatus = 'INVALID_STATUS',
  InvalidToken = 'INVALID_TOKEN',
}

export enum FacilityPaymentMethod {
  Upi = 'UPI',
  Card = 'CARD',
  NetBanking = 'NET_BANKING',
}

export enum FacilityAgeCategory {
  Adult = 'ADULT',
  Child = 'CHILD',
  Senior = 'SENIOR',
}
