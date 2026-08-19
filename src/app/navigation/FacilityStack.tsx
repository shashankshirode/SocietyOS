import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from './navigation.types';
import { FacilityHomeScreen } from '../../modules/resident/facilityBooking/screens/FacilityHomeScreen';
import { FacilityListScreen } from '../../modules/resident/facilityBooking/screens/FacilityListScreen';
import { FacilityDetailScreen } from '../../modules/resident/facilityBooking/screens/FacilityDetailScreen';
import { FacilitySlotAvailabilityScreen } from '../../modules/resident/facilityBooking/screens/FacilitySlotAvailabilityScreen';
import { CreateFacilityBookingScreen } from '../../modules/resident/facilityBooking/screens/CreateFacilityBookingScreen';
import { FacilityBookingReviewScreen } from '../../modules/resident/facilityBooking/screens/FacilityBookingReviewScreen';
import { FacilityBookingConfirmationScreen } from '../../modules/resident/facilityBooking/screens/FacilityBookingConfirmationScreen';
import { MyFacilityBookingsScreen } from '../../modules/resident/facilityBooking/screens/MyFacilityBookingsScreen';
import { FacilityBookingDetailScreen } from '../../modules/resident/facilityBooking/screens/FacilityBookingDetailScreen';
import { CancelFacilityBookingScreen } from '../../modules/resident/facilityBooking/screens/CancelFacilityBookingScreen';
import { RescheduleFacilityBookingScreen } from '../../modules/resident/facilityBooking/screens/RescheduleFacilityBookingScreen';
import { FacilityQrCheckInScreen } from '../../modules/resident/facilityBooking/screens/FacilityQrCheckInScreen';
import { FacilityBookingConsentScreen } from '../../modules/resident/facilityBooking/screens/FacilityBookingConsentScreen';
import { FacilityPaymentScreen } from '../../modules/resident/facilityBooking/screens/FacilityPaymentScreen';
import { FacilityBookingHistoryScreen } from '../../modules/resident/facilityBooking/screens/FacilityBookingHistoryScreen';

const Stack = createNativeStackNavigator<FacilityStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function FacilityStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="FacilityHome" component={FacilityHomeScreen} />
      <Stack.Screen name="FacilityList" component={FacilityListScreen} />
      <Stack.Screen name="FacilityDetail" component={FacilityDetailScreen} />
      <Stack.Screen name="FacilitySlotAvailability" component={FacilitySlotAvailabilityScreen} />
      <Stack.Screen name="CreateFacilityBooking" component={CreateFacilityBookingScreen} />
      <Stack.Screen name="FacilityBookingConsent" component={FacilityBookingConsentScreen} />
      <Stack.Screen name="FacilityBookingReview" component={FacilityBookingReviewScreen} />
      <Stack.Screen name="FacilityPayment" component={FacilityPaymentScreen} />
      <Stack.Screen name="FacilityBookingConfirmation" component={FacilityBookingConfirmationScreen} />
      <Stack.Screen name="MyFacilityBookings" component={MyFacilityBookingsScreen} />
      <Stack.Screen name="FacilityBookingDetail" component={FacilityBookingDetailScreen} />
      <Stack.Screen name="CancelFacilityBooking" component={CancelFacilityBookingScreen} />
      <Stack.Screen name="RescheduleFacilityBooking" component={RescheduleFacilityBookingScreen} />
      <Stack.Screen name="FacilityQrCheckIn" component={FacilityQrCheckInScreen} />
      <Stack.Screen name="FacilityBookingHistory" component={FacilityBookingHistoryScreen} />
    </Stack.Navigator>
  );
}
