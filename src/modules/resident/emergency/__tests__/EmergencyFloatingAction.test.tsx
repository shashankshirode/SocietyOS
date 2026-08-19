import React from 'react';
import {  fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { EmergencyFloatingAction } from '../components/EmergencyFloatingAction';
import type { NavigationState } from '@react-navigation/native';

let mockRouteName = 'Dashboard';

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native');
  return {
    ...original,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useNavigationState: (_selector: (state: NavigationState) => string) => {
      return mockRouteName;
    },
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

describe('EmergencyFloatingAction', () => {
  beforeEach(() => {
    mockRouteName = 'Dashboard';
  });

  it('renders floating SOS trigger button by default', async () => {
    const { getByLabelText } = await renderWithProviders(<EmergencyFloatingAction />);
    expect(getByLabelText('Open SOS Command Dock')).toBeTruthy();
  });

  it('hides button on payment checkout page', async () => {
    mockRouteName = 'MockPaymentConfirmation';
    const { toJSON } = await renderWithProviders(<EmergencyFloatingAction />);
    expect(toJSON()).toBeNull();
  });

  it('opens command dock when trigger button is clicked', async () => {
    const { getByLabelText, findByText } = await renderWithProviders(<EmergencyFloatingAction />);
    const btn = getByLabelText('Open SOS Command Dock');
    fireEvent.press(btn);

    expect(await findByText('Emergency Command Dock')).toBeTruthy();
  });
});
