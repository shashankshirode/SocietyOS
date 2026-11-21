import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { facilityBookingMockBookings } from '../mock/facilityBookingMockData';
import { useFacilityBookings } from '../hooks/useFacilityBookings';
import { MyFacilityBookingsScreen } from '../screens/MyFacilityBookingsScreen';

jest.mock('../hooks/useFacilityBookings', () => ({
  useFacilityBookings: jest.fn(),
}));

jest.mock('../hooks/useFacilityBookingMutations', () => ({
  useLeaveFacilityWaitlist: () => ({
    data: null,
    error: null,
    isPending: false,
    mutate: jest.fn(),
    reset: jest.fn(),
  }),
}));

jest.mock('../hooks/useFacilityNetworkStatus', () => ({
  useFacilityNetworkStatus: () => ({ isOffline: false, isChecking: false }),
}));

describe('MyFacilityBookingsScreen', () => {
  const navigation = {
    navigate: jest.fn(),
    canGoBack: jest.fn(() => true),
    goBack: jest.fn(),
  };
  const route = { params: { unitId: 'unit-gv-a-1204' } };
  const baseResult = {
    bookings: [],
    waitlistEntries: [],
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
    hasMore: false,
    error: null,
    nextPageError: null,
    refresh: jest.fn(),
    loadMore: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state', async () => {
    jest.mocked(useFacilityBookings).mockReturnValue({ ...baseResult, isLoading: true });
    await renderWithProviders(<MyFacilityBookingsScreen navigation={navigation} route={route} />);
    expect(screen.queryByText('No upcoming bookings')).toBeNull();
  });

  it('renders a retryable repository error', async () => {
    const refresh = jest.fn().mockResolvedValue(undefined);
    jest.mocked(useFacilityBookings).mockReturnValue({ ...baseResult, error: new Error('failed'), refresh });
    await renderWithProviders(<MyFacilityBookingsScreen navigation={navigation} route={route} />);
    expect(screen.getByText('Unable to load bookings')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: 'Try Again' }));
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('renders the scoped upcoming empty state', async () => {
    jest.mocked(useFacilityBookings).mockReturnValue(baseResult);
    await renderWithProviders(<MyFacilityBookingsScreen navigation={navigation} route={route} />);
    expect(screen.getByText('No upcoming bookings')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: 'Explore Facilities' }));
    expect(navigation.navigate).toHaveBeenCalledWith('FacilityList');
  });

  it('renders a booking and opens its detail', async () => {
    const booking = facilityBookingMockBookings[0];
    if (!booking) throw new Error('Facility booking fixture is required.');
    jest.mocked(useFacilityBookings).mockReturnValue({ ...baseResult, bookings: [booking] });
    await renderWithProviders(<MyFacilityBookingsScreen navigation={navigation} route={route} />);
    expect(screen.getByTestId('facility-booking-tab-UPCOMING')).toBeOnTheScreen();
    expect(screen.getByText(booking.facilityName)).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: 'View Booking' }));
    expect(navigation.navigate).toHaveBeenCalledWith('FacilityBookingDetail', { bookingId: booking.id });
  });
});
