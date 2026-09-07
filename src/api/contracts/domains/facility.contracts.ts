import type { EndpointDefinition } from '../api.types';
import type { PaginatedResponse } from '../api.types';
import type { Absent } from "../../../shared/types/absence.types";
export interface Facility {
    id: string;
    societyId: string;
    name: string;
    description: string;
    category: 'CLUBHOUSE' | 'GYM' | 'POOL' | 'SPORTS_COURT' | 'HALL' | 'GARDEN' | 'PLAY_AREA' | 'LIBRARY' | 'OTHER';
    location: string;
    capacity: number;
    amenities: string[];
    images: string[];
    rules: string[];
    operatingHours: OperatingHours;
    bookingRules: BookingRules;
    pricing: FacilityPricing;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'BLOCKED';
    requiresApproval: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface OperatingHours {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
    holidays: TimeSlot[];
}
export interface TimeSlot {
    start: string;
    end: string;
    isClosed: boolean;
}
export interface BookingRules {
    advanceBookingDays: number;
    minBookingDuration: number;
    maxBookingDuration: number;
    bufferTime: number;
    cancellationWindow: number;
    maxConcurrentBookings: number;
    allowRecurring: boolean;
    recurringMaxWeeks: number;
}
export interface FacilityPricing {
    basePrice: number;
    priceUnit: 'HOUR' | 'HALF_DAY' | 'FULL_DAY' | 'SESSION';
    memberDiscount: number;
    peakHoursMultiplier: number;
    peakHours: TimeSlot[];
    depositAmount: number;
    taxRate: number;
}
export interface FacilityBooking {
    id: string;
    facilityId: string;
    facilityName: string;
    facilityCategory: Facility['category'];
    unitId: string;
    unitNumber: string;
    tower: string;
    bookedBy: string;
    bookedByName: string;
    bookedByPhone: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    purpose: string;
    numberOfGuests: number;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'CHECKED_IN' | 'CHECKED_OUT';
    totalAmount: number;
    depositAmount: number;
    taxAmount: number;
    paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'PARTIAL_REFUND' | 'WAIVED';
    paymentOrderId?: string | Absent;
    approvedBy?: string | Absent;
    approvedAt?: string | Absent;
    rejectedBy?: string | Absent;
    rejectedAt?: string | Absent;
    rejectionReason?: string | Absent;
    checkedInAt?: string | Absent;
    checkedOutAt?: string | Absent;
    cancelledBy?: string | Absent;
    cancelledAt?: string | Absent;
    cancellationReason?: string | Absent;
    createdAt: string;
    updatedAt: string;
}
export interface CreateBookingRequest {
    facilityId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    numberOfGuests: number;
    specialRequests?: string;
}
export interface UpdateBookingRequest {
    startTime?: string;
    endTime?: string;
    purpose?: string;
    numberOfGuests?: number;
    specialRequests?: string;
}
export interface AvailabilitySlot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    reason?: string;
    existingBookingId?: string;
}
export interface AvailabilityRequest {
    facilityId: string;
    date: string;
    startTime?: string;
    endTime?: string;
}
export const facilityEndpoints = {
    list: {
        method: 'GET' as const,
        path: '/facilities',
        queryParams: ['page', 'pageSize', 'category', 'status'],
        responseBody: {} as PaginatedResponse<Facility>,
        authRequired: true,
    },
    get: {
        method: 'GET' as const,
        path: '/facilities/{facilityId}',
        pathParams: ['facilityId'],
        responseBody: {} as Facility,
        authRequired: true,
    },
    getAvailability: {
        method: 'POST' as const,
        path: '/facilities/{facilityId}/availability',
        pathParams: ['facilityId'],
        requestBody: {} as AvailabilityRequest,
        responseBody: {} as AvailabilitySlot[],
        authRequired: true,
    },
    getBookings: {
        method: 'GET' as const,
        path: '/facility-bookings',
        queryParams: ['page', 'pageSize', 'facilityId', 'status', 'dateFrom', 'dateTo', 'unitId'],
        responseBody: {} as PaginatedResponse<FacilityBooking>,
        authRequired: true,
    },
    getBooking: {
        method: 'GET' as const,
        path: '/facility-bookings/{bookingId}',
        pathParams: ['bookingId'],
        responseBody: {} as FacilityBooking,
        authRequired: true,
    },
    createBooking: {
        method: 'POST' as const,
        path: '/facility-bookings',
        requestBody: {} as CreateBookingRequest,
        responseBody: {} as FacilityBooking,
        authRequired: true,
    },
    updateBooking: {
        method: 'PATCH' as const,
        path: '/facility-bookings/{bookingId}',
        pathParams: ['bookingId'],
        requestBody: {} as UpdateBookingRequest,
        responseBody: {} as FacilityBooking,
        authRequired: true,
    },
    cancelBooking: {
        method: 'POST' as const,
        path: '/facility-bookings/{bookingId}/cancel',
        pathParams: ['bookingId'],
        requestBody: {} as {
            reason: string;
        },
        responseBody: {} as FacilityBooking,
        authRequired: true,
    },
    checkIn: {
        method: 'POST' as const,
        path: '/facility-bookings/{bookingId}/check-in',
        pathParams: ['bookingId'],
        responseBody: {} as FacilityBooking,
        authRequired: true,
    },
    checkOut: {
        method: 'POST' as const,
        path: '/facility-bookings/{bookingId}/check-out',
        pathParams: ['bookingId'],
        responseBody: {} as FacilityBooking,
        authRequired: true,
    },
    submitFeedback: {
        method: 'POST' as const,
        path: '/facility-bookings/{bookingId}/feedback',
        pathParams: ['bookingId'],
        requestBody: {} as {
            rating: number;
            comment?: string;
        },
        responseBody: {} as FacilityBooking,
        authRequired: true,
    },
    getCalendar: {
        method: 'GET' as const,
        path: '/facilities/calendar',
        queryParams: ['facilityId', 'dateFrom', 'dateTo'],
        responseBody: {} as {
            date: string;
            bookings: FacilityBooking[];
        }[],
        authRequired: true,
    },
    getBlockedSlots: {
        method: 'GET' as const,
        path: '/facilities/{facilityId}/blocked-slots',
        pathParams: ['facilityId'],
        queryParams: ['dateFrom', 'dateTo'],
        responseBody: {} as {
            startTime: string;
            endTime: string;
            reason: string;
        }[],
        authRequired: true,
    },
} as const satisfies Record<string, EndpointDefinition>;

