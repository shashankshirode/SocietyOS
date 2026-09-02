import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ParkingIncidentListScreen } from '../screens/ParkingIncidentListScreen';
import type { ParkingIncident } from '../../../../shared/types/parking.types';

const mockIncidents: ParkingIncident[] = [
  {
    id: 'inc-1',
    societyId: 'society-1',
    unitId: 'unit-1',
    incidentNumber: 'PKG-2026-0001',
    issueType: 'PARKED_IN_MY_SLOT',
    status: 'SECURITY_NOTIFIED',
    priority: 'HIGH',
    location: 'Basement 2 · Slot P-114',
    vehicleNumber: 'MH12 AB 1234',
    reportedBy: 'Asha Deshmukh',
    reportedFlat: 'A-1204',
    description: 'Car parked in my reserved slot without permission.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    assignedTeam: 'Main Gate Security',
    timeline: [
      {
        id: 'tl-1',
        title: 'Report Submitted',
        note: 'Reported by resident Asha Deshmukh',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'tl-2',
        title: 'Security Dispatched',
        note: 'Guard dispatched to inspect slot P-114',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: 'inc-2',
    societyId: 'society-1',
    unitId: 'unit-1',
    incidentNumber: 'PKG-2026-0002',
    issueType: 'BLOCKING_EXIT',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    location: 'Basement 2 · Ramp exit',
    vehicleNumber: 'MH14 JK 5522',
    reportedBy: 'Amit Roy',
    reportedFlat: 'B-302',
    description: 'Vehicle parked across exit ramp blocking vehicles from leaving.',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    assignedTeam: 'Patrolling Security',
    timeline: [],
  },
  {
    id: 'inc-3',
    societyId: 'society-1',
    unitId: 'unit-1',
    incidentNumber: 'PKG-2026-0003',
    issueType: 'VISITOR_IN_RESIDENT_SLOT',
    status: 'RESOLVED',
    priority: 'NORMAL',
    location: 'Podium Level · Slot C-42',
    vehicleNumber: 'DL01 XY 9999',
    reportedBy: 'Rohan Mehta',
    reportedFlat: 'A-1204',
    description: 'Visitor parked here for 3 hours.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    assignedTeam: 'Tower Security',
    timeline: [],
  },
];

let mockIsTablet = false;

jest.mock('../../../../ui/layout/useResponsiveLayout', () => ({
  useResponsiveLayout: () => ({
    isCompactPhone: false,
    isPhone: !mockIsTablet,
    isTablet: mockIsTablet,
    isFold: false,
    isDesktop: false,
    contentMaxWidth: 1040,
  }),
}));

jest.mock('../data/useParkingIncidents', () => ({
  useParkingIncidents: () => ({
    data: mockIncidents,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

describe('ParkingIncidentListScreen UI & Navigation Correction', () => {
  const mockNavigation: any = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
  };

  beforeEach(() => {
    mockIsTablet = false;
    jest.clearAllMocks();
  });

  it('renders global Society OS header with ResidenceBeacon and IdentityOrb', async () => {
    const screen = await renderWithProviders(
      <ParkingIncidentListScreen navigation={mockNavigation} route={{ params: { unitId: 'unit-1' } } as any} />
    );

    expect(screen.getByTestId('resident-header-container')).toBeTruthy();
    expect(screen.getByTestId('resident-residence-beacon')).toBeTruthy();
    expect(screen.getByTestId('resident-identity-orb')).toBeTruthy();
  });

  it('renders resident narrative headline and subtitle', async () => {
    const screen = await renderWithProviders(
      <ParkingIncidentListScreen navigation={mockNavigation} route={{ params: { unitId: 'unit-1' } } as any} />
    );

    expect(screen.getByText('Parking Incidents')).toBeTruthy();
    expect(
      screen.getByText('Track reports and follow-ups around your vehicle and parking spaces.')
    ).toBeTruthy();
  });

  it('renders active incident cards with human narratives, vehicle numbers, and status indicators', async () => {
    const screen = await renderWithProviders(
      <ParkingIncidentListScreen navigation={mockNavigation} route={{ params: { unitId: 'unit-1' } } as any} />
    );

    expect(screen.getByText('Vehicle parked in your allocated slot')).toBeTruthy();
    expect(screen.getByText('Vehicle is blocking the exit ramp')).toBeTruthy();
    expect(screen.getByText('MH12 AB 1234')).toBeTruthy();
    expect(screen.getByText('MH14 JK 5522')).toBeTruthy();
    expect(screen.getByText('Security Notified')).toBeTruthy();
    expect(screen.getByText('Security Checking')).toBeTruthy();
    expect(screen.getAllByText('URGENT').length).toBeGreaterThan(0);
  });

  it('filters incidents when switching to Resolved filter chip', async () => {
    const screen = await renderWithProviders(
      <ParkingIncidentListScreen navigation={mockNavigation} route={{ params: { unitId: 'unit-1' } } as any} />
    );

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: /Resolved filter/i }));
    });

    expect(screen.getByText('Visitor parked in a resident slot')).toBeTruthy();
    expect(screen.getByText('DL01 XY 9999')).toBeTruthy();
    expect(screen.queryByText('Vehicle is blocking the exit ramp')).toBeNull();
  });

  it('filters incidents via search query', async () => {
    const screen = await renderWithProviders(
      <ParkingIncidentListScreen navigation={mockNavigation} route={{ params: { unitId: 'unit-1' } } as any} />
    );

    const searchInput = screen.getByPlaceholderText('Search incident, vehicle, or location...');
    await act(async () => {
      fireEvent.changeText(searchInput, 'MH14');
    });

    expect(screen.getByText('Vehicle is blocking the exit ramp')).toBeTruthy();
    expect(screen.queryByText('Vehicle parked in your allocated slot')).toBeNull();
  });

  it('navigates to incident detail on card press on phone', async () => {
    const screen = await renderWithProviders(
      <ParkingIncidentListScreen navigation={mockNavigation} route={{ params: { unitId: 'unit-1' } } as any} />
    );

    fireEvent.press(screen.getByTestId('incident-object-inc-1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ParkingIncidentDetail', {
      incidentId: 'inc-1',
    });
  });

  it('renders split layout with side focus panel on tablet', async () => {
    mockIsTablet = true;
    const screen = await renderWithProviders(
      <ParkingIncidentListScreen navigation={mockNavigation} route={{ params: { unitId: 'unit-1' } } as any} />
    );

    expect(screen.getByText('Activity & Security Trace')).toBeTruthy();
    expect(screen.getByText('Mark Cleared / Resolved')).toBeTruthy();
  });
});
