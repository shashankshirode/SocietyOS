import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { FacilityBookingsView } from '../components/FacilityBookingsView';
import { FacilityBookingFilter } from '../models/facilityBooking.enums';
import { performBackNavigation } from '../../../../shared/navigation/performBackNavigation';

interface Props {
  readonly navigation: Pick<NativeStackNavigationProp<FacilityStackParamList>, 'navigate' | 'goBack'>;
  readonly route: { readonly params: FacilityStackParamList['MyFacilityBookings'] };
}

export function MyFacilityBookingsScreen({ navigation }: Props) {
  return (
    <FacilityBookingsView
      initialFilter={FacilityBookingFilter.Upcoming}
      onBack={() => performBackNavigation(navigation, { fallbackRoute: 'FacilityList', currentRouteName: 'MyFacilityBookings' })}
      onExplore={() => navigation.navigate('FacilityList')}
      onView={(bookingId) => navigation.navigate('FacilityBookingDetail', { bookingId })}
      onPay={(bookingId) => navigation.navigate('FacilityPayment', { bookingId })}
      onCheckIn={(bookingId) => navigation.navigate('FacilityQrCheckIn', { bookingId })}
      onReschedule={(bookingId) => navigation.navigate('RescheduleFacilityBooking', { bookingId })}
      onBookAgain={(facilityId) => navigation.navigate('FacilityDetail', { facilityId })}
    />
  );
}
