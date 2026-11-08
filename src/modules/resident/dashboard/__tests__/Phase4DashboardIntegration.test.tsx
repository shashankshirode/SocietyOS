import React from 'react';
import { screen, fireEvent, cleanup } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeScreen } from '../screens/ResidentHomeScreen';
import { activeHomeStore } from '../../homeContext/data/activeHomeStore';
import { residentDashboardRepository, getScopedDashboardData } from '../data/dashboard.repository';
import { repositorySuccess } from '../../../../core/repositories/repository.types';
import type { ResidentHomeScreenProps } from '../../../../app/navigation/navigation.types';

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native');
  return {
    ...original,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useNavigationState: () => 'Dashboard',
  };
});

const mockNavigation: ResidentHomeScreenProps['navigation'] = {
  navigate: jest.fn(),
  navigateDeprecated: jest.fn(),
  preload: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(),
  getState: jest.fn(),
  setParams: jest.fn(),
  replaceParams: jest.fn(),
  setOptions: jest.fn(),
  removeListener: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popTo: jest.fn(),
  popToTop: jest.fn(),
  jumpTo: jest.fn(),
  addListener: jest.fn(() => () => {}),
  isFocused: () => true,
  getParent: jest.fn(() => ({
    navigate: jest.fn(),
  })) as ResidentHomeScreenProps['navigation']['getParent'],
};

describe('Phase 4 Living Home Dashboard Integration', () => {
  beforeEach(() => {
    activeHomeStore.setActiveContextId('context-001');
    jest
      .spyOn(residentDashboardRepository, 'getDashboardSections')
      .mockImplementation((context) => {
        return Promise.resolve(repositorySuccess(getScopedDashboardData(context)));
      });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it('renders complete Living Home experience with intelligent hierarchy', async () => {
    await renderWithProviders(
      <ResidentHomeScreen
        navigation={mockNavigation}
        route={{ key: 'resident-home-phase4', name: 'ResidentHome' }}
      />,
    );

    expect(await screen.findByTestId('resident-dashboard-name')).toBeTruthy();
    expect(screen.getAllByText('Green Valley Heights').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Home Pulse')).toBeTruthy();
    expect(screen.getByText('Invite Guest')).toBeTruthy();
    expect(screen.getByText('Around your home')).toBeTruthy();
    expect(screen.getByText('In your community')).toBeTruthy();
  });

  it('opens residence switcher sheet when clicking current residence in header', async () => {
    await renderWithProviders(
      <ResidentHomeScreen
        navigation={mockNavigation}
        route={{ key: 'resident-home-phase4', name: 'ResidentHome' }}
      />,
    );

    const switchBtn = await screen.findByLabelText(/Current residence:/);
    fireEvent.press(switchBtn);

    expect(await screen.findByTestId('resident-home-switcher-sheet')).toBeTruthy();
    expect(screen.getByText('Switch residence')).toBeTruthy();
  });

  it('navigates to create visitor pass when pressing Invite Guest', async () => {
    await renderWithProviders(
      <ResidentHomeScreen
        navigation={mockNavigation}
        route={{ key: 'resident-home-phase4', name: 'ResidentHome' }}
      />,
    );

    const inviteBtn = await screen.findByLabelText('Invite Guest: Create a visitor pass');
    fireEvent.press(inviteBtn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateVisitorFromHome');
  });

  it('navigates to create complaint when pressing Raise Issue', async () => {
    await renderWithProviders(
      <ResidentHomeScreen
        navigation={mockNavigation}
        route={{ key: 'resident-home-phase4', name: 'ResidentHome' }}
      />,
    );

    const complaintBtn = await screen.findByLabelText(
      'Raise Request: Report a maintenance issue or complaint',
    );
    fireEvent.press(complaintBtn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateComplaintFromHome');
  });
});
