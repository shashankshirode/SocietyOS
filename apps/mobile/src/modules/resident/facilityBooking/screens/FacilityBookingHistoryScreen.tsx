import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { FacilityBookingsView } from '../components/FacilityBookingsView';
import { FacilityBookingFilter } from '../models/facilityBooking.enums';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityBookingHistory'>;

export function FacilityBookingHistoryScreen({ navigation }: Props) {
  return (
    <FacilityBookingsView
      initialFilter={FacilityBookingFilter.Past}
      onBack={navigation.goBack}
      onExplore={() => navigation.navigate('FacilityList')}
      onView={(bookingId) => navigation.navigate('FacilityBookingDetail', { bookingId })}
      onPay={(bookingId) => navigation.navigate('FacilityPayment', { bookingId })}
      onCheckIn={(bookingId) => navigation.navigate('FacilityQrCheckIn', { bookingId })}
      onReschedule={(bookingId) => navigation.navigate('RescheduleFacilityBooking', { bookingId })}
      onBookAgain={(facilityId) => navigation.navigate('FacilityDetail', { facilityId })}
    />
  );
}
