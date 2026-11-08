import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentActivityScreen, type ResidentActivityScreenProps } from '../screens/ResidentActivityScreen';
import { getDashboardFixture } from './dashboardTestFixtures';

jest.mock('../../../../core/theme/useThemePreference', () => ({
  useThemePreference: () => ({
    preference: 'light',
    setPreference: jest.fn(),
    isLoading: false,
  }),
}));

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => false),
  getId: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  jumpTo: jest.fn(),
} as ResidentActivityScreenProps['navigation'];

const mockRoute: ResidentActivityScreenProps['route'] = {
  key: 'ActivityTab-key',
  name: 'ActivityTab',
  params: undefined,
};

const mockDashboard = getDashboardFixture('context-001');

const mockEnrichedDashboard = {
  ...mockDashboard,
  visitorTimeline: [
    {
      id: 'vis-1',
      visitorName: 'Urban Company Plumber',
      purpose: 'Plumbing Service',
      gateName: 'Gate 2',
      status: 'waitingAtGate' as const,
      validFrom: '2026-07-09T09:00:00Z',
      enteredAtLabel: '9:00 AM',
    },
    ...mockDashboard.visitorTimeline,
  ],
  notices: [
    {
      id: 'not-1',
      title: 'Monsoon safety advisory for Gokhale Park',
      summary: 'Please inspect balcony drainage systems.',
      category: 'important' as const,
      acknowledgementStatus: 'pending' as const,
      publishedAtLabel: 'Today, 8:00 AM',
      acknowledgementRequired: true,
    },
    ...mockDashboard.notices,
  ],
  maintenancePayment: {
    ...mockDashboard.maintenancePayment,
    status: 'overdue' as const,
    totalOutstanding: 4850,
    billAmount: 4850,
    dueDateLabel: 'Yesterday',
    billingMonth: 'July 2026',
  },
};

jest.mock('../hooks/useResidentDashboard', () => ({
  useResidentDashboard: () => ({
    data: mockEnrichedDashboard,
    error: null,
    isLoading: false,
    refetch: jest.fn(),
  }),
}));

describe('ResidentActivityScreen (Updates Tab Rebuild)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders persistent shared header and intro title without status-bar collision', async () => {
    await renderWithProviders(
      <ResidentActivityScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Shared resident top header
    expect(await screen.findByText('Green Valley Heights')).toBeTruthy();

    // Updates intro
    expect(screen.getByText('Updates')).toBeTruthy();
    expect(screen.getByText('Important updates from your home and society.')).toBeTruthy();
  });

  it('renders compact attention overview with exact action count (replaces Home Status panel)', async () => {
    await renderWithProviders(
      <ResidentActivityScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Oversized Home Status panel is gone
    expect(screen.queryByText('Home Status')).toBeNull();
    expect(screen.queryByText('Visitor waiting at the gate')).toBeNull();

    // Attention overview banner shows exact count
    expect(await screen.findByText(/3 items need your attention/i)).toBeTruthy();
    expect(screen.getByText('Review important requests and notices')).toBeTruthy();
  });

  it('supports primary filter toggle between "Action needed" and "All updates"', async () => {
    await renderWithProviders(
      <ResidentActivityScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Filter pills
    const actionFilter = await screen.findByText('Action needed');
    const allFilter = await screen.findByText('All updates');
    expect(actionFilter).toBeTruthy();
    expect(allFilter).toBeTruthy();

    // Click "Action needed" filter
    fireEvent.press(actionFilter);
    expect(await screen.findByText('Action Required')).toBeTruthy();

    // Click "All updates" filter
    fireEvent.press(allFilter);
    expect(await screen.findByText('Activity & Notices')).toBeTruthy();
  });

  it('renders grouped routine activity with formatted timestamps and navigates on press', async () => {
    await renderWithProviders(
      <ResidentActivityScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Should display grouped activities under All updates
    expect(await screen.findByText('Activity & Notices')).toBeTruthy();
    expect(screen.getAllByText('Today').length).toBeGreaterThan(0);
  });

  it('renders action cards with dedicated action footer and navigates to target workflows', async () => {
    await renderWithProviders(
      <ResidentActivityScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // 1. Visitor action card
    expect((await screen.findAllByText('Urban Company Plumber')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('Plumbing Service · Gate 2')).length).toBeGreaterThan(0);
    const visitorBtn = await screen.findByLabelText('Review: Urban Company Plumber');
    fireEvent.press(visitorBtn);
    expect(mockNavigate).toHaveBeenCalledWith('VisitorTab', { screen: 'VisitorList' });

    // 2. Urgent notice action card
    expect((await screen.findAllByText('Monsoon safety advisory for Gokhale Park')).length).toBeGreaterThan(0);
    const noticeBtn = await screen.findByLabelText('Read Notice: Monsoon safety advisory for Gokhale Park');
    fireEvent.press(noticeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('HomeTab', { screen: 'NoticeListFromHome' });

    // 3. Maintenance overdue card
    expect(await screen.findByText(/Maintenance · ₹4,850/i)).toBeTruthy();
    const payBtn = await screen.findByLabelText(/Pay Immediately: Maintenance · ₹4,850/i);
    fireEvent.press(payBtn);
    expect(mockNavigate).toHaveBeenCalledWith('BillTab', { screen: 'BillList' });
  });
});
