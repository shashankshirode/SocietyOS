import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { HouseholdOverviewScreen } from '../screens/HouseholdOverviewScreen';
import type { HouseholdSummary } from '../data/residentHousehold.types';

const mockRefetch = jest.fn();

const mockData: HouseholdSummary = {
  residenceId: 'residence-1',
  societyId: 'society-1',
  unitId: 'unit-1',
  occupancyStatus: 'tenantOccupied',
  familyMemberCount: 2,
  activeAccessCount: 3,
  emergencyContactCount: 1,
  pendingActionCount: 1,
  familyMembers: [
    { id: 'm1', fullName: 'Asha Deshmukh', relationship: 'Mother', statusLabel: 'Senior citizen', accessLabel: 'Active', isEmergencyContact: true },
  ],
  tenantSummary: { name: 'Rohan Mehta', moveInLabel: '12 April 2026', verificationLabel: 'Verified' },
  emergencyContacts: [{ id: 'e1', name: 'Asha Deshmukh', relationship: 'Primary contact', verificationLabel: 'Verified', isPrimary: true }],
  accessSummary: { activeAccessCount: 3, permissions: [{ label: 'Visitor approval', value: '2 members' }] },
  pendingActions: [{ id: 'p1', title: 'Police verification pending', description: 'Needs review', severity: 'high', actionLabel: 'View', onPress: () => undefined }],
  readiness: { status: 'actionRequired', progress: 60, completedItems: 6, totalItems: 10, message: 'Action required' },
  residenceLabel: 'Flat 102, Willow Heights',
  societyName: 'Green Valley Society',
  unitLabel: 'A-102',
  residenceContext: 'Tenant occupied',
};

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      canGoBack: () => false,
      goBack: jest.fn(),
      dispatch: jest.fn(),
      navigate: jest.fn(),
    }),
  };
});

jest.mock('../hooks/useHouseholdOverview', () => ({
  useHouseholdOverview: () => ({
    data: mockData,
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  }),
}));

describe('HouseholdOverviewScreen', () => {
  it('renders readiness and household detail sections for the resident overview', async () => {
    await renderWithProviders(<HouseholdOverviewScreen navigation={{ navigate: jest.fn() } as never} route={{} as never} />);

    expect(screen.getAllByText('Emergency contacts').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pending actions').length).toBeGreaterThan(0);
  });
});
