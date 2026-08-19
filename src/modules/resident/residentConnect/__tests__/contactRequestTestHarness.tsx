import React from 'react';
import { renderWithProviders } from '../../../../test/testUtils';
import { NewResidentContactRequestScreen } from '../screens/NewResidentContactRequestScreen';

jest.mock('../hooks/useResidentContactData', () => ({
  useResidentDirectoryProfile: jest.fn(() => ({
    data: {
      residentProfileId: 'resident-recipient',
      userId: 'user-recipient',
      societyId: 'society-test',
      unitId: 'unit-b-1204',
      flatNumber: 'B-1204',
      towerOrWing: 'Tower B',
      floorLabel: '12th Floor',
      floorSortOrder: 12,
      displayName: 'A Resident With A Deliberately Long Display Name For Layout Safety',
      occupancyLabel: 'Resident',
      activeOccupancy: true,
      eligibleForContact: true,
      directoryVisible: true,
      displayNameVisible: true,
      contactRequestsAllowed: true,
      isAdult: true,
      blockedResidentProfileIds: [],
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useCreateResidentContactRequest: jest.fn(() => ({
    submit: jest.fn(async () => ({
      ok: true as const,
      data: { requestId: 'request-test' },
    })),
    isSubmitting: false,
    error: null,
    reset: jest.fn(),
  })),
}));

jest.mock('../hooks/useResidentContactScope', () => ({
  useResidentContactScope: jest.fn(() => ({
    societyId: 'society-test',
    activeUnitId: 'unit-a-101',
    authenticatedUserId: 'user-requester',
    residentProfileId: 'resident-requester',
    dataScopeKey: 'society-test:unit-a-101:resident-requester',
    canInitiateResidentContact: true,
  })),
}));

export async function renderContactRequestScreen() {
  const navigation = {
    popTo: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  };

  const result = await renderWithProviders(
    <NewResidentContactRequestScreen
      navigation={navigation as never}
      route={{ params: { residentProfileId: 'resident-recipient' } } as never}
    />,
  );

  return { ...result, navigation };
}
