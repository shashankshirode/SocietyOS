import type { CatalogImage } from '../../../../configuration/residentImageCatalog';
import type { ResidentHomeRole, ResidentHomeStatus } from '../../homeContext/data/residentHomeContext.types';
import {
  FacilityAgeCategory,
  FacilityAvailabilityStatus,
  FacilityBookingCancellationReason,
  FacilityBookingStatus,
  FacilityCategory,
  FacilityCheckInMode,
  FacilityCheckInResultCode,
  FacilityEligibilityCode,
  FacilityEligibilityWarningCode,
  FacilityPaymentMethod,
  FacilityPaymentStatus,
  FacilityRefundStatus,
  FacilitySlotStatus,
} from './facilityBooking.enums';

export interface FacilityImage extends CatalogImage {
  readonly id: string;
  readonly isPrimary: boolean;
}

export interface FacilityAmenity {
  readonly id: string;
  readonly name: string;
  readonly iconName: string;
}

export interface FacilityOperatingSchedule {
  readonly dayOfWeek: number;
  readonly opensAtLocalTime: string;
  readonly closesAtLocalTime: string;
  readonly closed: boolean;
}

export interface FacilityRule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly required: boolean;
}

export interface FacilitySetupOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly feeInMinorUnits: number;
  readonly maximumQuantity: number;
}

export interface FacilityEligibilityPolicy {
  readonly allowedRoles: readonly ResidentHomeRole[];
  readonly requiresVerifiedResidence: boolean;
  readonly requiresCompletedDocuments: boolean;
  readonly blockWhenDuesOutstanding: boolean;
  readonly blockedUnitIds?: readonly string[];
  readonly blockedTowersOrWings?: readonly string[];
  readonly dailyLimitPerUnit: number;
  readonly weeklyLimitPerUnit: number;
  readonly monthlyLimitPerUnit: number;
}

export interface FacilityCancellationPolicy {
  readonly fullRefundCutoffMinutes: number;
  readonly partialRefundCutoffMinutes: number;
  readonly partialRefundPercentage: number;
  readonly depositRefundable: boolean;
  readonly convenienceFeeRefundable: boolean;
  readonly noShowRefundPercentage: number;
}

export interface Facility {
  readonly id: string;
  readonly societyId: string;
  readonly name: string;
  readonly category: FacilityCategory;
  readonly description: string;
  readonly locationName: string;
  readonly floorOrZone: string;
  readonly images: readonly FacilityImage[];
  readonly amenities: readonly FacilityAmenity[];
  readonly operatingSchedule: readonly FacilityOperatingSchedule[];
  readonly capacity: number;
  readonly minimumGuests: number;
  readonly maximumGuests: number;
  readonly minimumBookingDurationMinutes: number;
  readonly maximumBookingDurationMinutes: number;
  readonly bookingIntervalMinutes: number;
  readonly minimumAdvanceBookingMinutes: number;
  readonly maximumAdvanceBookingDays: number;
  readonly cancellationCutoffMinutes: number;
  readonly checkInStartOffsetMinutes: number;
  readonly checkInEndOffsetMinutes: number;
  readonly cleanupBufferMinutes: number;
  readonly baseFeeInMinorUnits: number;
  readonly refundableDepositInMinorUnits: number;
  readonly includedGuestCount: number;
  readonly guestSurchargeInMinorUnits: number;
  readonly taxRateBasisPoints: number;
  readonly convenienceFeeInMinorUnits: number;
  readonly currencyCode: string;
  readonly timezone: string;
  readonly availabilityStatus: FacilityAvailabilityStatus;
  readonly bookingEnabled: boolean;
  readonly waitlistEnabled: boolean;
  readonly rescheduleEnabled: boolean;
  readonly recurringBookingEnabled: boolean;
  readonly requiresPayment: boolean;
  readonly requiresConsent: boolean;
  readonly requiresGuestDetails: boolean;
  readonly checkInMode: FacilityCheckInMode;
  readonly rules: readonly FacilityRule[];
  readonly setupOptions: readonly FacilitySetupOption[];
  readonly eligibilityPolicy: FacilityEligibilityPolicy;
  readonly cancellationPolicy: FacilityCancellationPolicy;
  readonly nextAvailableAt: string | null;
}

export interface FacilitySlot {
  readonly id: string;
  readonly societyId: string;
  readonly residenceId: string;
  readonly facilityId: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly status: FacilitySlotStatus;
  readonly remainingCapacity: number;
  readonly slotFeeInMinorUnits: number;
  readonly heldByResidenceId: string | null;
  readonly holdExpiresAt: string | null;
}

export interface FacilitySlotHold {
  readonly id: string;
  readonly societyId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly facilityId: string;
  readonly slotId: string;
  readonly createdAt: string;
  readonly expiresAt: string;
}

export interface FacilityBookingBlockingReason {
  readonly code: FacilityEligibilityCode;
  readonly message: string;
}

export interface FacilityBookingWarning {
  readonly code: FacilityEligibilityWarningCode;
  readonly message: string;
}

export interface FacilityBookingEligibilityResult {
  readonly eligible: boolean;
  readonly blockingReasons: readonly FacilityBookingBlockingReason[];
  readonly warnings: readonly FacilityBookingWarning[];
}

export interface FacilityBookingPriceBreakdown {
  readonly facilityFeeInMinorUnits: number;
  readonly slotFeeInMinorUnits: number;
  readonly equipmentFeeInMinorUnits: number;
  readonly guestSurchargeInMinorUnits: number;
  readonly taxInMinorUnits: number;
  readonly convenienceFeeInMinorUnits: number;
  readonly discountInMinorUnits: number;
  readonly refundableDepositInMinorUnits: number;
  readonly totalPayableInMinorUnits: number;
}

export interface FacilityBookingQuote {
  readonly id: string;
  readonly residenceId: string;
  readonly facilityId: string;
  readonly slotId: string;
  readonly holdId: string;
  readonly breakdown: FacilityBookingPriceBreakdown;
  readonly currencyCode: string;
  readonly createdAt: string;
  readonly expiresAt: string;
}

export interface FacilityGuestDetail {
  readonly id: string;
  readonly name: string;
  readonly phoneNumber: string;
  readonly ageCategory: FacilityAgeCategory;
  readonly vehicleNumber: string | null;
}

export interface FacilityBookingSetupSelection {
  readonly optionId: string;
  readonly name: string;
  readonly quantity: number;
  readonly feeInMinorUnits: number;
}

export interface FacilityBookingTimelineItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly occurredAt: string;
  readonly completed: boolean;
}

export interface FacilityBookingQrPass {
  readonly token: string;
  readonly fallbackCode: string;
  readonly validFrom: string;
  readonly validUntil: string;
  readonly presentationLocation: string;
  readonly active: boolean;
}

export interface FacilityBookingPayment {
  readonly status: FacilityPaymentStatus;
  readonly method: FacilityPaymentMethod | null;
  readonly transactionId: string | null;
  readonly receiptNumber: string | null;
  readonly paidAt: string | null;
  readonly amountPaidInMinorUnits: number;
}

export interface FacilityBookingRefund {
  readonly status: FacilityRefundStatus;
  readonly amountInMinorUnits: number;
  readonly requestedAt: string | null;
  readonly processedAt: string | null;
  readonly referenceNumber: string | null;
  readonly explanation: string;
}

export interface FacilityBookingRescheduleRecord {
  readonly id: string;
  readonly previousSlotId: string;
  readonly nextSlotId: string;
  readonly previousStartsAt: string;
  readonly nextStartsAt: string;
  readonly changedAt: string;
  readonly priceDifferenceInMinorUnits: number;
}

export interface FacilityBooking {
  readonly id: string;
  readonly bookingReference: string;
  readonly userId: string;
  readonly societyId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly unitLabel: string;
  readonly facilityId: string;
  readonly facilityName: string;
  readonly facilityLocation: string;
  readonly residentName: string;
  readonly contactNumber: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly timezone: string;
  readonly status: FacilityBookingStatus;
  readonly guestCount: number;
  readonly purpose: string;
  readonly additionalInstructions: string;
  readonly guestDetails: readonly FacilityGuestDetail[];
  readonly setupSelections: readonly FacilityBookingSetupSelection[];
  readonly consentAccepted: boolean;
  readonly acceptedRuleIds: readonly string[];
  readonly quote: FacilityBookingQuote;
  readonly payment: FacilityBookingPayment;
  readonly refund: FacilityBookingRefund;
  readonly qrPass: FacilityBookingQrPass | null;
  readonly timeline: readonly FacilityBookingTimelineItem[];
  readonly rescheduleHistory: readonly FacilityBookingRescheduleRecord[];
  readonly cancellationReason: FacilityBookingCancellationReason | null;
  readonly cancellationNotes: string | null;
  readonly cancelledAt: string | null;
  readonly societyCancellationReason: string | null;
  readonly calendarEventId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface FacilityWaitlistEntry {
  readonly id: string;
  readonly userId: string;
  readonly societyId: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly facilityId: string;
  readonly slotId: string;
  readonly position: number;
  readonly joinedAt: string;
  readonly expiresAt: string;
  readonly offeredHoldId: string | null;
}

export interface FacilityBookingAvailableActions {
  readonly canContinue: boolean;
  readonly canPay: boolean;
  readonly canCancel: boolean;
  readonly canReschedule: boolean;
  readonly canCheckIn: boolean;
  readonly canViewQr: boolean;
  readonly canJoinWaitlist: boolean;
  readonly canLeaveWaitlist: boolean;
  readonly canBookAgain: boolean;
  readonly canAddToCalendar: boolean;
}

export interface FacilityCheckInResult {
  readonly code: FacilityCheckInResultCode;
  readonly message: string;
  readonly booking: FacilityBooking;
}

export interface CancelFacilityBookingResult {
  readonly booking: FacilityBooking;
  readonly refund: FacilityBookingRefund;
}

export interface FacilityAvailabilityResult {
  readonly facilityId: string;
  readonly timezone: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly slots: readonly FacilitySlot[];
}

export interface PaginatedResult<TItem> {
  readonly items: readonly TItem[];
  readonly nextCursor: string | null;
  readonly totalCount: number;
}

export interface FacilityBookingResidentScope {
  readonly userId: string;
  readonly societyId: string;
  readonly societyName: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly unitLabel: string;
  readonly residentName: string;
  readonly contactNumber: string;
  readonly role: ResidentHomeRole;
  readonly residenceStatus: ResidentHomeStatus;
  readonly timezone: string;
  readonly locale: string;
  readonly currencyCode: string;
  readonly hasResidenceAccess: boolean;
  readonly isVerified: boolean;
  readonly hasCompletedDocuments: boolean;
  readonly hasOutstandingDues: boolean;
  readonly featureEnabled: boolean;
}

export interface FacilityActivityItem {
  readonly id: string;
  readonly residenceId: string;
  readonly title: string;
  readonly description: string;
  readonly occurredAt: string;
}

export interface FacilityNotificationItem {
  readonly id: string;
  readonly residenceId: string;
  readonly title: string;
  readonly description: string;
  readonly createdAt: string;
  readonly highPriority: boolean;
  readonly read: boolean;
}

export interface FacilityBookingDashboardSummary {
  readonly upcomingCount: number;
  readonly waitlistCount: number;
  readonly refundPendingCount: number;
  readonly nextBooking: FacilityBooking | null;
  readonly recentActivity: readonly FacilityActivityItem[];
  readonly notifications: readonly FacilityNotificationItem[];
}
