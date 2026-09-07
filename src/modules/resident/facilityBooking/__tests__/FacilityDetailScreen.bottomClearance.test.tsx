import React from 'react';
import { fireEvent, screen, act } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { FacilityDetailScreen } from '../screens/FacilityDetailScreen';
import { FacilityAvailabilityStatus, FacilityCategory, FacilityCheckInMode } from '../models/facilityBooking.enums';
import type { Facility } from '../models/facilityBooking.models';
const mockFacility: Facility = {
    id: 'fac-detail-1',
    societyId: 'soc-001',
    name: 'Clubhouse Badminton Court',
    category: FacilityCategory.Sports,
    description: 'Indoor wooden court',
    locationName: 'Sports Complex',
    floorOrZone: '1st Floor',
    images: [],
    amenities: [{ id: 'a-1', name: 'Lighting', iconName: 'bulb' }],
    operatingSchedule: [{ dayOfWeek: 1, opensAtLocalTime: '06:00', closesAtLocalTime: '22:00', closed: false }],
    capacity: 4,
    minimumGuests: 1,
    maximumGuests: 4,
    minimumBookingDurationMinutes: 60,
    maximumBookingDurationMinutes: 60,
    bookingIntervalMinutes: 60,
    minimumAdvanceBookingMinutes: 60,
    maximumAdvanceBookingDays: 7,
    cancellationCutoffMinutes: 60,
    checkInStartOffsetMinutes: 10,
    checkInEndOffsetMinutes: 15,
    cleanupBufferMinutes: 0,
    baseFeeInMinorUnits: 20000,
    refundableDepositInMinorUnits: 0,
    includedGuestCount: 2,
    guestSurchargeInMinorUnits: 0,
    taxRateBasisPoints: 0,
    convenienceFeeInMinorUnits: 0,
    currencyCode: 'INR',
    timezone: 'Asia/Kolkata',
    availabilityStatus: FacilityAvailabilityStatus.Available,
    bookingEnabled: true,
    waitlistEnabled: false,
    rescheduleEnabled: true,
    recurringBookingEnabled: false,
    requiresPayment: true,
    requiresConsent: true,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Qr,
    rules: [{ id: 'r-1', title: 'Non-marking shoes mandatory', description: 'Wear proper shoes', required: true }],
    setupOptions: [],
    eligibilityPolicy: {
        allowedRoles: ['owner', 'tenant', 'familyMember'],
        requiresVerifiedResidence: true,
        requiresCompletedDocuments: false,
        blockWhenDuesOutstanding: false,
        dailyLimitPerUnit: 2,
        weeklyLimitPerUnit: 5,
        monthlyLimitPerUnit: 10,
    },
    cancellationPolicy: {
        fullRefundCutoffMinutes: 60,
        partialRefundCutoffMinutes: 30,
        partialRefundPercentage: 50,
        depositRefundable: true,
        convenienceFeeRefundable: false,
        noShowRefundPercentage: 0,
    },
    nextAvailableAt: null,
};
jest.mock('../hooks/useFacilityDetails', () => ({
    useFacilityDetails: () => ({
        data: mockFacility,
        isLoading: false,
        error: null,
        refresh: jest.fn(),
    }),
}));
jest.mock('../hooks/useBookingEligibility', () => ({
    useBookingEligibility: () => ({
        data: { eligible: true, reasons: [] },
        isLoading: false,
        error: null,
        refresh: jest.fn(),
    }),
}));
jest.mock('../hooks/useFacilityNetworkStatus', () => ({
    useFacilityNetworkStatus: () => ({ isOffline: false, isChecking: false }),
}));
describe('FacilityDetailScreen Bottom Clearance & CTA States', () => {
    const navigation = {
        navigate: jest.fn(),
        canGoBack: jest.fn(() => true),
        goBack: jest.fn(),
    };
    const route = { params: { facilityId: 'fac-detail-1' } };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('disables "Reserve an Hour →" button until an hour slot is selected', async () => {
        await renderWithProviders(<FacilityDetailScreen navigation={navigation as any} route={route as any}/>);
        expect(screen.getAllByText('Clubhouse Badminton Court').length).toBeGreaterThan(0);
        const reserveButton = screen.getByRole('button', { name: 'Reserve an Hour →' });
        expect(reserveButton.props.accessibilityState.disabled).toBe(true);
        const slot4PM = screen.getByTestId('slot-4:00 PM');
        await act(async () => {
            fireEvent.press(slot4PM);
        });
        const activeReserveButton = screen.getByRole('button', { name: 'Reserve 4:00 PM →' });
        expect(activeReserveButton.props.accessibilityState.disabled).toBe(false);
        await act(async () => {
            fireEvent.press(activeReserveButton);
        });
        expect(navigation.navigate).toHaveBeenCalledWith('FacilitySlotAvailability', { facilityId: 'fac-detail-1' });
    });
});

