import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { SpaceHorizon } from '../components/SpaceHorizon';
import { SpaceObject } from '../components/SpaceObject';
import { FacilityAvailabilityStatus, FacilityCategory, FacilityCheckInMode } from '../models/facilityBooking.enums';
import type { Facility } from '../models/facilityBooking.models';

const mockFacility: Facility = {
  id: 'fac-1',
  societyId: 'soc-001',
  name: 'Swimming Pool',
  category: FacilityCategory.Sports,
  description: 'Olympic size temperature-controlled pool',
  locationName: 'Pool Deck',
  floorOrZone: 'Garden Level',
  images: [],
  amenities: [{ id: 'a-1', name: 'Lifeguard', iconName: 'shield' }],
  operatingSchedule: [{ dayOfWeek: 1, opensAtLocalTime: '06:00', closesAtLocalTime: '22:00', closed: false }],
  capacity: 20,
  minimumGuests: 1,
  maximumGuests: 4,
  minimumBookingDurationMinutes: 60,
  maximumBookingDurationMinutes: 120,
  bookingIntervalMinutes: 60,
  minimumAdvanceBookingMinutes: 60,
  maximumAdvanceBookingDays: 45,
  cancellationCutoffMinutes: 120,
  checkInStartOffsetMinutes: 15,
  checkInEndOffsetMinutes: 30,
  cleanupBufferMinutes: 15,
  baseFeeInMinorUnits: 0,
  refundableDepositInMinorUnits: 0,
  includedGuestCount: 2,
  guestSurchargeInMinorUnits: 0,
  taxRateBasisPoints: 0,
  convenienceFeeInMinorUnits: 0,
  currencyCode: 'INR',
  timezone: 'Asia/Kolkata',
  availabilityStatus: FacilityAvailabilityStatus.UnderMaintenance,
  bookingEnabled: false,
  waitlistEnabled: false,
  rescheduleEnabled: false,
  recurringBookingEnabled: false,
  requiresPayment: false,
  requiresConsent: false,
  requiresGuestDetails: false,
  checkInMode: FacilityCheckInMode.Qr,
  rules: [{ id: 'r-1', title: 'Proper swimwear required', description: 'Nylon swimwear is mandatory', required: true }],
  setupOptions: [],
  eligibilityPolicy: {
    allowedRoles: ['owner', 'tenant'],
    requiresVerifiedResidence: true,
    requiresCompletedDocuments: false,
    blockWhenDuesOutstanding: false,
    dailyLimitPerUnit: 2,
    weeklyLimitPerUnit: 5,
    monthlyLimitPerUnit: 15,
  },
  cancellationPolicy: {
    fullRefundCutoffMinutes: 120,
    partialRefundCutoffMinutes: 60,
    partialRefundPercentage: 50,
    depositRefundable: true,
    convenienceFeeRefundable: false,
    noShowRefundPercentage: 0,
  },
  nextAvailableAt: null,
};

describe('SpaceHorizon and SpaceObject Components', () => {
  it('renders SpaceHorizon with maintenance indicator', async () => {
    const onSelect = jest.fn();
    await renderWithProviders(
      <SpaceHorizon facilities={[mockFacility]} onSelectFacility={onSelect} />
    );

    expect(screen.getByText("AVAILABILITY HORIZON · TODAY")).toBeTruthy();
    expect(screen.getByText('Swimming Pool')).toBeTruthy();
    expect(screen.getByText('Maintenance Today')).toBeTruthy();
    fireEvent.press(screen.getByText('Swimming Pool'));
    expect(onSelect).toHaveBeenCalledWith('fac-1');
  });

  it('renders SpaceObject in featured and compact variants', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <SpaceObject facility={mockFacility} variant="featured" onPress={onPress} />
    );

    expect(screen.getByText('Maintenance Today')).toBeTruthy();
    expect(screen.getByText('Swimming Pool')).toBeTruthy();
    expect(screen.getByText('Free access')).toBeTruthy();
  });
});
