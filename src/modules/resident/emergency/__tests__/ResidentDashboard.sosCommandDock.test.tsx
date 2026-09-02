import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeScreen } from '../../dashboard/screens/ResidentHomeScreen';
import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';
import { residentDashboardMockData as mockResidentDashboardData } from '../../dashboard/data/dashboard.mockData';
import { sosEventMockSource } from '../data/sosEvent.mockSource';

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

describe('ResidentDashboard Crisis Mode integration', () => {
  beforeEach(() => sosEventMockSource._resetAll());
  it('enters Crisis Mode and requires a deliberate response confirmation', async () => {
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

    
    expect(await screen.findByText('What do you need right now?')).toBeTruthy();
    expect(screen.getByText('MEDICAL')).toBeTruthy();

    
    const securityBtn = screen.getByLabelText('SECURITY. I need security now');
    fireEvent.press(securityBtn);

    
    expect(await screen.findByText('I need security now')).toBeTruthy();
    expect(screen.getByText('REQUEST SECURITY HELP')).toBeTruthy();

    
    const confirmBtn = screen.getByText('REQUEST SECURITY HELP');
    fireEvent.press(confirmBtn);

    // 5. Emergency Lens transforms into Response Field constellation
    await waitFor(() => {
      expect(screen.getByText('LIVE RESPONSE CONSTELLATION')).toBeTruthy();
      expect(screen.getAllByText('Return to Society OS').length).toBeGreaterThan(0);
      expect(screen.getByText('False alarm · cancel request')).toBeTruthy();
    }, { timeout: 3000 });
  });
});
