import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeScreen } from '../../dashboard/screens/ResidentHomeScreen';
import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';
import { activeHomeStore } from '../data/activeHomeStore';
import { residentDashboardMockData as mockResidentDashboardData } from '../../dashboard/data/dashboard.mockData';

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native');
  return {
    ...original,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useNavigationState: () => 'ResidentHome',
  };
});

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  function MockModal({ children, visible }: React.PropsWithChildren<{ visible?: boolean }>) {
    if (!visible) return null;
    return <rn.View>{children}</rn.View>;
  }
  MockModal.displayName = 'MockModal';
  rn.Modal = MockModal;
  return rn;
});

jest.mock('../../dashboard/hooks/useResidentDashboard', () => {
  return {
    useResidentDashboard: () => ({
      data: mockResidentDashboardData,
      error: null,
      refetch: jest.fn(),
      acceptContactRequest: jest.fn(),
      rejectContactRequest: jest.fn(),
    }),
  };
});

describe('ResidentDashboard context integration', () => {
  beforeEach(() => {
    activeHomeStore.setActiveContextId('context-001');
  });

  it('greets the active home context flat and society details', async () => {
    await renderWithProviders(
      <MockStoreProvider>
        <ResidentHomeScreen
          navigation={{ navigate: jest.fn(), goBack: jest.fn(), getParent: jest.fn() } as never}
          route={{} as never}
        />
      </MockStoreProvider>
    );

    expect(screen.getByText('Green Valley Heights')).toBeTruthy();
  });
});
