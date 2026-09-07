import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { DetailBlockSkeleton } from '../../../../shared/feedback/Skeleton';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingDetail } from '../hooks/useFacilityBookingDetail';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import { FacilityBookingStatus } from '../models/facilityBooking.enums';
import { resolveFacilityBookingActions } from '../services/facilityBookingActionResolver';
import {
  formatFacilityCurrency,
  formatFacilityLongDate,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import { facilityBookingStyles as styles } from '../styles/facilityBooking.styles';
import { BookingInfoRow } from '../components/BookingInfoRow';
import { BookingPriceBreakdown } from '../components/BookingPriceBreakdown';
import { BookingQrCard } from '../components/BookingQrCard';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { BookingTimeline } from '../components/BookingTimeline';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { performBackNavigation } from '../../../../shared/navigation/performBackNavigation';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityBookingDetail'>;

export function FacilityBookingDetailScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const resource = useFacilityBookingDetail(route.params.bookingId);
  const facilityResource = useFacilityDetails(resource.data?.facilityId ?? '');
  const booking = resource.data;
  const facility = facilityResource.data;
  const locale = activeContext.locale ?? 'en-IN';
  if (resource.isLoading || !booking && !resource.error) {
    return (
      <FacilityScreenLayout title={labels.bookingDetail.title} onBack={() => performBackNavigation(navigation, { fallbackRoute: 'MyFacilityBookings', currentRouteName: 'FacilityBookingDetail' })}>
        <DetailBlockSkeleton /><DetailBlockSkeleton /><DetailBlockSkeleton />
      </FacilityScreenLayout>
    );
  }
  if (resource.error || !booking) {
    return (
      <FacilityScreenLayout title={labels.bookingDetail.title} onBack={() => performBackNavigation(navigation, { fallbackRoute: 'MyFacilityBookings', currentRouteName: 'FacilityBookingDetail' })}>
        <ErrorState title={labels.states.loadBookingTitle} message={labels.states.loadBookingDescription} onRetry={() => void resource.refresh()} />
      </FacilityScreenLayout>
    );
  }
  const actions = facility ? resolveFacilityBookingActions(booking, facility, new Date().toISOString()) : null;
  const cancelledBySociety = booking.status === FacilityBookingStatus.CancelledBySociety;
  return (
    <FacilityScreenLayout
      title={labels.bookingDetail.title}
      subtitle={booking.bookingReference}
      onBack={() => performBackNavigation(navigation, { fallbackRoute: 'MyFacilityBookings', currentRouteName: 'FacilityBookingDetail' })}
      testID="facility-booking-detail-screen"
    >
      <AppCard variant="outlined" style={styles.summaryCard}>
        <View style={styles.rowBetween}>
          <View style={styles.grow}>
            <SafeText variant="h2">{booking.facilityName}</SafeText>
            <SafeText variant="caption" color="muted">{booking.facilityLocation}</SafeText>
          </View>
          <BookingStatusBadge status={booking.status} />
        </View>
        <BookingInfoRow label={labels.success.reference} value={booking.bookingReference} />
        <BookingInfoRow label={labels.review.date} value={formatFacilityLongDate(booking.startsAt, { locale, timezone: booking.timezone })} />
        <BookingInfoRow label={labels.review.time} value={formatFacilityTimeRange(booking.startsAt, booking.endsAt, { locale, timezone: booking.timezone })} />
        <BookingInfoRow label={labels.review.guests} value={String(booking.guestCount)} />
        <BookingInfoRow label={labels.review.purpose} value={booking.purpose} isLast />
      </AppCard>
      {cancelledBySociety ? (
        <AppCard variant="danger" style={styles.summaryCard}>
          <View style={styles.rowBetween}>
            <SafeText variant="bodyStrong">{labels.bookingDetail.societyCancellation}</SafeText>
            <Ionicons name="warning-outline" size={22} color={colors.danger} />
          </View>
          <SafeText variant="caption" color="secondary">{booking.societyCancellationReason ?? labels.bookingStatus.CANCELLED_BY_SOCIETY}</SafeText>
          <SafeText variant="caption">{labels.bookingDetail.refundAmount}: {formatFacilityCurrency(booking.refund.amountInMinorUnits, booking.quote.currencyCode, locale)}</SafeText>
        </AppCard>
      ) : null}
      {booking.qrPass && actions?.canViewQr ? (
        <View style={styles.section}>
          <SafeText variant="title">{labels.bookingDetail.checkIn}</SafeText>
          <BookingQrCard pass={booking.qrPass} locale={locale} timezone={booking.timezone} />
        </View>
      ) : (
        <AppCard variant="muted"><SafeText variant="caption" color="muted">{labels.bookingDetail.noQr}</SafeText></AppCard>
      )}
      <BookingPriceBreakdown breakdown={booking.quote.breakdown} currencyCode={booking.quote.currencyCode} locale={locale} />
      <AppCard variant="outlined" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.bookingDetail.payment}</SafeText>
        <BookingInfoRow label={labels.bookingDetail.status} value={labels.paymentStatus[booking.payment.status]} />
        <BookingInfoRow label={labels.bookingDetail.refundAmount} value={formatFacilityCurrency(booking.refund.amountInMinorUnits, booking.quote.currencyCode, locale)} />
        <BookingInfoRow label={labels.bookingDetail.refundExplanation} value={labels.refundStatus[booking.refund.status]} isLast />
      </AppCard>
      <AppCard variant="outlined" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.bookingDetail.bookedBy}</SafeText>
        <BookingInfoRow label={labels.review.resident} value={booking.residentName} />
        <BookingInfoRow label={labels.review.unit} value={booking.unitLabel} />
        <BookingInfoRow label={labels.review.contact} value={booking.contactNumber} isLast />
      </AppCard>
      {booking.rescheduleHistory.length > 0 ? (
        <AppCard variant="info" style={styles.summaryCard}>
          <SafeText variant="bodyStrong">{labels.reschedule.successTitle}</SafeText>
          {booking.rescheduleHistory.map((record) => (
            <SafeText key={record.id} variant="caption" color="secondary">
              {formatFacilityLongDate(record.nextStartsAt, { locale, timezone: booking.timezone })} · {formatFacilityCurrency(record.priceDifferenceInMinorUnits, booking.quote.currencyCode, locale)}
            </SafeText>
          ))}
        </AppCard>
      ) : null}
      <AppCard variant="outlined" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.bookingDetail.timeline}</SafeText>
        <BookingTimeline items={booking.timeline} locale={locale} timezone={booking.timezone} />
      </AppCard>
      <View style={styles.stickyButtons}>
        {actions?.canPay ? <AppButton title={labels.bookings.completePayment} onPress={() => navigation.navigate('FacilityPayment', { bookingId: booking.id })} fullWidth /> : null}
        {actions?.canCheckIn ? <AppButton title={labels.bookings.checkIn} onPress={() => navigation.navigate('FacilityQrCheckIn', { bookingId: booking.id })} variant="success" fullWidth /> : null}
        <View style={styles.stickyButtonRow}>
          {actions?.canReschedule ? <AppButton title={labels.bookings.reschedule} onPress={() => navigation.navigate('RescheduleFacilityBooking', { bookingId: booking.id })} variant="outline" style={styles.stickyButton} /> : null}
          {actions?.canCancel ? <AppButton title={labels.bookings.cancel} onPress={() => navigation.navigate('CancelFacilityBooking', { bookingId: booking.id })} variant="danger" style={styles.stickyButton} /> : null}
        </View>
        {actions?.canBookAgain ? <AppButton title={labels.bookingDetail.bookAgain} onPress={() => navigation.navigate('FacilityDetail', { facilityId: booking.facilityId })} variant="outline" fullWidth /> : null}
      </View>
    </FacilityScreenLayout>
  );
}
