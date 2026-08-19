import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeScreen } from '../../dashboard/screens/ResidentHomeScreen';
import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';
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
  
  function MockModal({ children, visible }: { children: React.ReactNode; visible: boolean }) {
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

describe('ResidentDashboard SOS Command Dock Integration', () => {
  it('opens SOS command dock and allows safety confirmation triggers', async () => {
    await renderWithProviders(
      <MockStoreProvider>
        <ResidentHomeScreen
          navigation={
            {
              navigate: jest.fn(),
              goBack: jest.fn(),
              getParent: () => ({
                navigate: jest.fn(),
              }),
            } as never
          }
          route={{} as never}
        />
      </MockStoreProvider>
    );

    
    const sosBtn = screen.getByLabelText('Open SOS Command Dock');
    expect(sosBtn).toBeTruthy();

    fireEvent.press(sosBtn);

    
    expect(await screen.findByText('Emergency Command Dock')).toBeTruthy();
    expect(screen.getByText('Medical Assistance')).toBeTruthy();

    
    const securityBtn = screen.getByLabelText('Call security gate intercom');
    fireEvent.press(securityBtn);

    
    expect(await screen.findByText('Trigger Call Security Gate alert?')).toBeTruthy();
    expect(screen.getByText('Confirm')).toBeTruthy();

    
    const confirmBtn = screen.getByLabelText(
      'Confirm calling the security gate'
    );
    fireEvent.press(confirmBtn);

    
    await waitFor(() => {
      expect(screen.getByText('Emergency Dispatched')).toBeTruthy();
    });
  });
});
