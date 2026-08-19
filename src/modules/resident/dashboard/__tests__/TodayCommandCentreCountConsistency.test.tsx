import React from 'react';
import { screen } from '@testing-library/react-native';
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

describe('TodayCommandCentreCountConsistency', () => {
  beforeEach(() => {
    activeHomeStore.setActiveContextId('context-001');
    jest.spyOn(residentDashboardRepository, 'getDashboardSections').mockImplementation((context) => {
      return Promise.resolve(repositorySuccess(getScopedDashboardData(context)));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('aligns the attention count in the identity header and the Today Command Centre dynamically', async () => {
    await renderWithProviders(
      <ResidentHomeScreen
        navigation={mockNavigation}
        route={{ key: 'resident-home-test', name: 'ResidentHome' }}
      />
    );

    
    await screen.findByTestId('resident-dashboard-name');

    
    const elements = await screen.findAllByText(/attention/i);
    expect(elements.length).toBeGreaterThan(0);

    
    const headerElement = elements.find((el) => {
      const text = String(el.props.children || '');
      return /\d+/.test(text) && text.toLowerCase().includes('need');
    });

    expect(headerElement).toBeTruthy();
    const textContent = String(headerElement!.props.children);
    const match = textContent.match(/(\d+)/);
    expect(match).toBeTruthy();
    const count = match ? match[1] : '0';

    
    const badgeLabel = `${count} ${count === '1' ? 'item needs' : 'items need'} attention`;
    const badgeElement = await screen.findByLabelText(badgeLabel);
    expect(badgeElement).toBeTruthy();
  });
});
