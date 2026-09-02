import { repositorySuccess, repositoryFailure, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import { mockFacilityBlockedSlots, mockFacilityCalendar } from '../../../../shared/mock/facilities.mock';
import { mockCheckInPasses, mockDepositRefundRecords } from '../../../../shared/mock/facilityBookings.mock';
import { mockFacilityRules } from '../../../../shared/mock/facilityRules.mock';
import { mockFacilityUsageHistory } from '../../../../shared/mock/facilityUsage.mock';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { Facility, FacilityBlockedSlot, FacilityCalendarDay, FacilityRules, FacilitySlot } from '../../../../shared/types/facility.types';
import type { CancelFacilityBookingInput, CreateFacilityBookingInput, FacilityBooking, FacilityCheckInPass, FacilityDepositRefund, FacilityHome, FacilityUsageHistory, GuestRoomBookingInput, RescheduleFacilityBookingInput, } from '../../../../shared/types/facilityBooking.types';
import type { FacilityBookingListParams, FacilityListParams } from './facility.dto';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { mockResidentFacilityAmenities } from './residentFacilityBooking.mockData';
import { getCurrentSession } from '../../../../core/auth/sessionStore';
import { domainEventBus } from '../../../../core/events/DomainEventBus';
import { getRequiredItem } from '../../../../shared/utils/requiredItem';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { evaluateCapability } from '../../../../core/permissions/capabilityEngine';
import { MOCK_PERSONAS } from '../../../../core/identity/personaRegistry';
function matchesQuery(query: string | Absent, values: string[]) {
    const normalized = query?.trim().toLowerCase();
    return !normalized || values.some((value) => value.toLowerCase().includes(normalized));
}
export function buildScopedFacilities(context: ResidentRepositoryRequestContext): Facility[] {
    const records = getResidentMockRecords(context, 'facilityBooking');
    return records.map((record) => {
        const amenity = getRequiredItem(mockResidentFacilityAmenities, record.ordinal % mockResidentFacilityAmenities.length, 'resident facility amenities');
        const status: Facility['status'] = record.ordinal % 5 === 4 ? 'PARTIALLY_AVAILABLE' : record.ordinal % 6 === 5 ? 'UNDER_MAINTENANCE' : 'AVAILABLE';
        return {
            id: record.id,
            societyId: context.activeHome.societyId,
            name: `${amenity.name} ${record.ordinal >= mockResidentFacilityAmenities.length ? Math.floor(record.ordinal / mockResidentFacilityAmenities.length) + 1 : ''}`.trim(),
            category: amenity.category,
            location: 'Clubhouse Ground Floor',
            capacity: amenity.capacity,
            availabilityToday: amenity.description,
            bookingType: amenity.bookingType,
            chargeAmount: amenity.chargeAmount,
            depositAmount: amenity.depositAmount,
            approvalRequired: amenity.approvalRequired,
            operatingHours: '06:00 AM - 10:00 PM',
            status,
            durationOptions: ['1 Hour Slots'],
            cancellationPolicySummary: 'Full refund up to 24 hours before the booking.',
            rulesSummary: 'Please bring your resident ID card. Clean indoor shoes are mandatory.',
            amenitiesIncluded: ['Air Conditioning', 'Power Backup', 'Drinking Water'],
            allowedUserRoles: ['OWNER', 'TENANT', 'FAMILY_MEMBER'],
            todayAvailabilityPreview: status === 'AVAILABLE' ? 'Multiple slots open today' : 'Limited slots open',
            ...(status === 'UNDER_MAINTENANCE'
                ? { maintenanceNotice: 'Routine maintenance scheduled from 2 PM to 4 PM.' }
                : {})
        };
    });
}
function buildScopedFacilitySlots(context: ResidentRepositoryRequestContext, facilities: readonly Facility[]): FacilitySlot[] {
    if (facilities.length === 0) {
        return [];
    }
    const slots: FacilitySlot[] = [];
    const times = [
        '08:00 AM - 09:00 AM',
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '04:00 PM - 05:00 PM',
        '05:00 PM - 06:00 PM',
        '06:00 PM - 07:00 PM',
    ];
    const statuses: FacilitySlot['status'][] = [
        'AVAILABLE',
        'AVAILABLE',
        'BOOKED',
        'AVAILABLE',
        'BOOKED',
        'MAINTENANCE',
    ];
    const today = '2026-07-11';
    facilities.forEach((facility) => {
        times.forEach((time, index) => {
            slots.push({
                id: `slot-${facility.id}-${index}`,
                facilityId: facility.id,
                facilityName: facility.name,
                date: today,
                timeRange: time,
                status: getRequiredItem(statuses, index, 'facility slot statuses'),
                price: facility.chargeAmount,
                depositRequired: facility.depositAmount,
                capacityAvailable: getRequiredItem(statuses, index, 'facility slot statuses') === 'AVAILABLE'
                    ? facility.capacity
                    : 0
            });
        });
    });
    return slots;
}
export const facilityMockSource = {
    async getFacilityHome(unitId: string): Promise<RepositoryResult<FacilityHome>> {
        await withMockDelay();
        const ctx = resolveRequestContext();
        const active = ctx.activeHome;
        const scopedFacilities = buildScopedFacilities(ctx);
        const scopedSlots = buildScopedFacilitySlots(ctx, scopedFacilities);
        const myBookings = mockStore.getState().facilityBookings.filter((booking) => booking.unitId === unitId || booking.flatNumber === active.flatNumber);
        return repositorySuccess({
            resident: {
                id: active.residentId,
                name: active.residentRole === 'tenant' ? 'Amit' : 'Shashank',
                role: active.residentRole === 'owner' || active.residentRole === 'coOwner'
                    ? 'OWNER'
                    : active.residentRole === 'tenant'
                        ? 'TENANT'
                        : 'FAMILY_MEMBER',
                societyId: active.societyId,
                societyName: active.societyName,
                unitId: active.unitId,
                tower: active.towerName || active.buildingName || 'Tower',
                flatNumber: active.flatNumber,
                city: active.city
            },
            unit: {
                id: active.unitId,
                societyId: active.societyId,
                tower: active.towerName || active.buildingName || 'Tower',
                flatNumber: active.flatNumber,
                occupancyStatus: active.residentRole === 'owner' ? 'OWNER_OCCUPIED' : 'TENANT_OCCUPIED'
            },
            availableTodayCount: scopedFacilities.filter((facility) => facility.status === 'AVAILABLE').length,
            upcomingBookingCount: myBookings.filter((booking) => !['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(booking.status)).length,
            pendingApprovalCount: myBookings.filter((booking) => booking.status === 'PENDING_APPROVAL').length,
            depositRefundPendingCount: mockDepositRefundRecords.filter((record) => record.refundStatus === 'PENDING').length,
            popularFacilities: scopedFacilities.slice(0, 4).map((facility) => facility.name),
            upcomingBookings: myBookings.slice(0, 3),
            slots: scopedSlots.slice(0, 6)
        });
    },
    async getFacilities(params: FacilityListParams = {}): Promise<RepositoryResult<Facility[]>> {
        await withMockDelay();
        const context = resolveRequestContext();
        const filtered = buildScopedFacilities(context).filter((facility) => matchesQuery(params.query, [facility.name, facility.category, facility.location]));
        return repositorySuccess(filtered);
    },
    async getFacilityDetail(facilityId: string): Promise<RepositoryResult<Facility | Absent>> {
        await withMockDelay();
        return repositorySuccess(buildScopedFacilities(resolveRequestContext()).find((facility) => facility.id === facilityId));
    },
    async getFacilityAvailability(facilityId: string, date: string): Promise<RepositoryResult<FacilitySlot[]>> {
        await withMockDelay();
        const context = resolveRequestContext();
        const facilities = buildScopedFacilities(context);
        return repositorySuccess(buildScopedFacilitySlots(context, facilities).filter((slot) => slot.facilityId === facilityId && (!date || slot.date === date)));
    },
    async createFacilityBooking(input: CreateFacilityBookingInput): Promise<RepositoryResult<FacilityBooking>> {
        await withMockDelay();
        const session = getCurrentSession();
        const actorName = session?.name ?? 'Resident';
        const actorId = session?.userId ?? 'usr-resident-01';
        const context = resolveRequestContext();

        // 1. Dynamic permission revalidation
        if (session?.personaKey && MOCK_PERSONAS[session.personaKey as keyof typeof MOCK_PERSONAS]) {
            const persona = MOCK_PERSONAS[session.personaKey as keyof typeof MOCK_PERSONAS];
            const cap = evaluateCapability(
                persona,
                (input.chargeAmount ?? 0) > 0 ? 'FACILITY_BOOK_PAID' : 'FACILITY_BOOK_FREE',
                { bookingCost: input.chargeAmount ?? 0 }
            );
            if (cap.status === 'DENIED') {
                return repositoryFailure({ code: 'PERMISSION_DENIED', message: 'You no longer have permission to book spaces for this home.' });
            }
        }

        // 2. Transactional availability / slot race condition check
        const existingBookings = mockStore.getState().facilityBookings;
        const slotTaken = existingBookings.some(
            (b) =>
                b.facilityId === input.facilityId &&
                b.date === input.date &&
                b.slot === input.slot &&
                b.status !== 'CANCELLED'
        );
        if (slotTaken) {
            return repositoryFailure({ code: 'SLOT_UNAVAILABLE', message: 'This slot is no longer available. Please select another time slot.' });
        }

        const booking: FacilityBooking = {
            id: `facility-booking-${Date.now()}`,
            unitId: input.unitId || context.activeHome.unitId,
            bookingNumber: `FB-GVH-2026-${Date.now().toString().slice(-5)}`,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            bookingType: input.bookingType,
            date: input.date,
            slot: input.slot,
            status: input.approvalRequired ? 'PENDING_APPROVAL' : 'CONFIRMED',
            residentName: actorName,
            createdByUserId: actorId,
            createdByDisplayName: actorName,
            flatNumber: context.activeHome.flatNumber,
            guestCount: input.guestCount,
            purpose: input.purpose,
            chargeAmount: input.chargeAmount,
            depositAmount: input.depositAmount,
            paymentStatus: input.chargeAmount || input.depositAmount ? 'PENDING' : 'NOT_REQUIRED',
            approvalStatus: input.approvalRequired ? 'PENDING' : 'NOT_REQUIRED',
            checkInStatus: 'NOT_OPEN',
            rulesAccepted: input.rulesAccepted,
            damageConsentAccepted: input.damageConsentAccepted,
            cancellationEligibility: 'Allowed until 24 hours before slot.',
            refundEligibility: 'Refund processing will be connected later.',
            ...includeWhenPresent("notes", input.specialRequirements),
            timeline: [{ id: `timeline-${Date.now()}`, title: 'Booking created', note: 'Created in mock mode.', createdAt: new Date().toISOString() }]
        };
        mockStore.addFacilityBooking(booking);

        void domainEventBus.emit({
            eventId: `evt-fb-${booking.id}`,
            eventType: 'facility.booking.confirmed',
            societyId: context.activeHome.societyId,
            unitId: booking.unitId,
            actor: {
                userId: actorId,
                personId: actorId,
                displayName: actorName,
                role: session?.role ?? 'RESIDENT_OWNER',
            },
            subject: {
                entityType: 'FacilityBooking',
                entityId: booking.id,
            },
            severity: 'INFO',
            createdAtIso: new Date().toISOString(),
            correlationId: `corr-${booking.id}`,
            payload: {
                facilityName: booking.facilityName,
                slotTime: `${booking.date} · ${booking.slot}`,
                chargeAmount: booking.chargeAmount,
                unitNumber: booking.flatNumber,
            },
        });

        return repositorySuccess(booking);
    },
    async getMyBookings(params: FacilityBookingListParams = {}): Promise<RepositoryResult<FacilityBooking[]>> {
        await withMockDelay();
        if (params.unitId === 'unit-ra-b-2101') {
            return repositoryFailure({
                code: 'DATABASE_ERROR',
                message: 'We could not retrieve your facility bookings. Check your connection and try again.'
            });
        }
        return repositorySuccess(mockStore.getState().facilityBookings.filter((booking) => (!params.unitId || booking.unitId === params.unitId) && matchesQuery(params.query, [booking.bookingNumber, booking.facilityName])));
    },
    async getBookingDetail(bookingId: string): Promise<RepositoryResult<FacilityBooking | Absent>> {
        await withMockDelay();
        return repositorySuccess(mockStore.getState().facilityBookings.find((booking) => booking.id === bookingId));
    },
    async cancelBooking(bookingId: string, input: CancelFacilityBookingInput): Promise<RepositoryResult<FacilityBooking | Absent>> {
        await withMockDelay();
        mockStore.updateFacilityBooking(bookingId, { status: 'CANCELLED' });
        const matched = mockStore.getState().facilityBookings.find((booking) => booking.id === bookingId);
        return repositorySuccess(matched);
    },
    async checkIn(bookingId: string): Promise<RepositoryResult<FacilityCheckInPass>> {
        await withMockDelay();
        mockStore.updateFacilityBooking(bookingId, { checkInStatus: 'CHECKED_IN' });
        const matched = mockStore.getState().facilityBookings.find(b => b.id === bookingId);
        return repositorySuccess({
            bookingId,
            bookingNumber: matched?.bookingNumber || 'FB-001',
            facilityName: matched?.facilityName || 'Clubhouse',
            date: matched?.date
                ?? getRequiredItem(new Date().toISOString().split('T'), 0, 'ISO date parts'),
            slot: matched?.slot || '10:00 AM - 11:00 AM',
            residentFlat: matched?.flatNumber || 'A-1204',
            checkInCode: `QR-${bookingId}`,
            validityWindow: 'Valid for 15 minutes',
            checkInStatus: 'CHECKED_IN',
            instructions: ['Show this QR code at the gate/counter.']
        });
    },
    async getDepositRefunds(unitId: string): Promise<RepositoryResult<FacilityDepositRefund[]>> {
        await withMockDelay();
        return repositorySuccess(mockDepositRefundRecords.filter((record) => record.unitId === unitId));
    },
    async getFacilityRules(facilityId: string): Promise<RepositoryResult<FacilityRules>> {
        await withMockDelay();
        return repositorySuccess(mockFacilityRules);
    },
    async getDepositRefund(bookingId: string): Promise<RepositoryResult<FacilityDepositRefund | Absent>> {
        await withMockDelay();
        const mockRecord = mockDepositRefundRecords.find(r => r.bookingId === bookingId) || mockDepositRefundRecords[0];
        return repositorySuccess(mockRecord);
    },
    async getCheckInPass(bookingId: string): Promise<RepositoryResult<FacilityCheckInPass | Absent>> {
        await withMockDelay();
        return repositorySuccess(mockCheckInPasses.find(p => p.bookingId === bookingId) || mockCheckInPasses[0]);
    },
    async simulateCheckIn(bookingId: string): Promise<RepositoryResult<FacilityCheckInPass | Absent>> {
        await withMockDelay();
        mockStore.updateFacilityBooking(bookingId, { checkInStatus: 'CHECKED_IN' });
        const pass = mockCheckInPasses.find(p => p.bookingId === bookingId) || mockCheckInPasses[0];
        return repositorySuccess(pass);
    },
    async rescheduleBooking(bookingId: string, input: RescheduleFacilityBookingInput): Promise<RepositoryResult<FacilityBooking | Absent>> {
        await withMockDelay();
        const booking = mockStore.getState().facilityBookings.find((b) => b.id === bookingId);
        if (booking) {
            booking.date = input.newDate;
            booking.slot = input.newSlot;
            return repositorySuccess(booking);
        }
        return repositorySuccess(undefined);
    },
    async getFacilityCalendar(date: string): Promise<RepositoryResult<FacilityCalendarDay[]>> {
        await withMockDelay();
        return repositorySuccess(mockFacilityCalendar);
    },
    async getBlockedSlots(facilityId = 'facility-1'): Promise<RepositoryResult<FacilityBlockedSlot[]>> {
        await withMockDelay();
        return repositorySuccess(mockFacilityBlockedSlots.filter(slot => slot.facilityId === facilityId));
    },
    async getUsageHistory(): Promise<RepositoryResult<FacilityUsageHistory[]>> {
        await withMockDelay();
        return repositorySuccess(mockFacilityUsageHistory);
    },
    async createGuestRoomBooking(input: GuestRoomBookingInput): Promise<RepositoryResult<FacilityBooking>> {
        await withMockDelay();
        const newBooking: FacilityBooking = {
            id: `fb-guest-${Date.now()}`,
            unitId: 'unit-a-1204',
            bookingNumber: `FB-GUEST-${Date.now().toString().slice(-4)}`,
            facilityId: 'facility-guest-room',
            facilityName: 'Guest Room A',
            bookingType: 'OVERNIGHT',
            date: input.checkInDate,
            slot: 'Overnight Stay',
            status: 'CONFIRMED',
            residentName: 'Shashank',
            flatNumber: 'A-1204',
            guestCount: input.guestCount,
            purpose: input.purpose,
            chargeAmount: 2000,
            depositAmount: 1000,
            paymentStatus: 'PENDING',
            approvalStatus: 'NOT_REQUIRED',
            checkInStatus: 'NOT_OPEN',
            rulesAccepted: true,
            damageConsentAccepted: true,
            cancellationEligibility: 'ELIGIBLE_FULL_REFUND',
            refundEligibility: 'ELIGIBLE',
            timeline: [
                {
                    id: 'event-1',
                    title: 'Booking Confirmed',
                    note: 'Booking automatically approved and confirmed.',
                    createdAt: new Date().toISOString()
                },
            ]
        };
        mockStore.addFacilityBooking(newBooking);
        return repositorySuccess(newBooking);
    },
    async getFacilityUsageHistory(facilityId: string): Promise<RepositoryResult<FacilityUsageHistory[]>> {
        await withMockDelay();
        return repositorySuccess(mockFacilityUsageHistory.filter(h => h.facilityId === facilityId));
    },
    async listFacilities(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listAvailableFacilitySlots(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async approveFacilityBooking(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async cancelFacilityBooking(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async createFacilityQrCheckInPlaceholder(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
};

