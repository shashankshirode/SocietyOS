import { useState } from 'react';
import { Share, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingDetail } from '../hooks/useFacilityBookingDetail';
import { useUpdateFacilityCalendarLink } from '../hooks/useFacilityBookingMutations';
import { facilityBookingDraftStore } from '../state/facilityBookingDraftStore';
import {
  addFacilityBookingToCalendar,
  type FacilityCalendarResult,
} from '../services/facilityCalendarService';
import {
  formatFacilityCurrency,
  formatFacilityLongDate,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { BookingInfoRow } from '../components/BookingInfoRow';
import { BookingQrCard } from '../components/BookingQrCard';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityBookingConfirmation'>;

export function FacilityBookingConfirmationScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const resource = useFacilityBookingDetail(route.params.bookingId);
  const calendarLink = useUpdateFacilityCalendarLink();
  const [calendarStatus, setCalendarStatus] = useState<FacilityCalendarResult['status'] | null>(null);
  const booking = resource.data;
  const locale = activeContext.locale ?? 'en-IN';

  async function addToCalendar(): Promise<void> {
    if (!booking) return;
    const result = await addFacilityBookingToCalendar(booking, activeContext.societyName);
    setCalendarStatus(result.status);
    if (result.status === 'ADDED') {
      await calendarLink.mutate({
        residenceId: activeContext.homeContextId,
        bookingId: booking.id,
        calendarEventId: result.eventId,
      });
    }
  }

  async function shareBooking(): Promise<void> {
    if (!booking) return;
    await Share.share({
      message: labels.success.shareMessage(
        booking.facilityName,
        formatFacilityLongDate(booking.startsAt, { locale, timezone: booking.timezone }),
        formatFacilityTimeRange(booking.startsAt, booking.endsAt, { locale, timezone: booking.timezone }),
        booking.bookingReference,
      ),
    });
  }

  if (resource.isLoading || !booking && !resource.error) {
    return <FacilityScreenLayout title={labels.success.title} onBack={() => navigation.navigate('FacilityHome', { unitId: activeContext.unitId })}><AppCard><SafeText>{labels.states.loadingBooking}</SafeText></AppCard></FacilityScreenLayout>;
  }
  if (resource.error || !booking) {
    return (
      <FacilityScreenLayout title={labels.success.title} onBack={() => navigation.navigate('FacilityHome', { unitId: activeContext.unitId })}>
        <ErrorState title={labels.states.loadBookingTitle} message={labels.states.loadBookingDescription} onRetry={() => void resource.refresh()} />
      </FacilityScreenLayout>
    );
  }
  const calendarFeedback = calendarStatus ? {
    ADDED: { title: labels.calendar.addedTitle, description: labels.calendar.addedDescription, variant: 'success' as const },
    ALREADY_ADDED: { title: labels.calendar.existingTitle, description: labels.calendar.existingDescription, variant: 'info' as const },
    PERMISSION_DENIED: { title: labels.calendar.permissionTitle, description: labels.calendar.permissionDescription, variant: 'warning' as const },
    UNAVAILABLE: { title: labels.calendar.unavailableTitle, description: labels.calendar.unavailableDescription, variant: 'warning' as const },
    FAILED: { title: labels.calendar.failedTitle, description: labels.calendar.failedDescription, variant: 'danger' as const },
  }[calendarStatus] : null;
  return (
    <FacilityScreenLayout
      title={labels.success.title}
      subtitle={labels.success.subtitle}
      onBack={() => navigation.navigate('FacilityHome', { unitId: activeContext.unitId })}
      testID="facility-booking-success-screen"
    >
      <View style={styles.successHero}>
        <View style={[styles.successIcon, backgroundColorStyle(colors.successSoft)]}>
          <Ionicons name="checkmark-circle" size={48} color={colors.success} />
        </View>
        <BookingStatusBadge status={booking.status} />
        <SafeText variant="h2" align="center">{labels.success.title}</SafeText>
        <SafeText variant="caption" color="secondary" align="center">{labels.success.subtitle}</SafeText>
        <SafeText variant="tiny" color="muted">{labels.success.reference}</SafeText>
        <SafeText variant="title" style={styles.qrCodeText}>{booking.bookingReference}</SafeText>
      </View>
      <AppCard variant="outlined" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.success.reservationDetails}</SafeText>
        <BookingInfoRow label={labels.facilityLabel} value={booking.facilityName} />
        <BookingInfoRow label={labels.review.date} value={formatFacilityLongDate(booking.startsAt, { locale, timezone: booking.timezone })} />
        <BookingInfoRow label={labels.review.time} value={formatFacilityTimeRange(booking.startsAt, booking.endsAt, { locale, timezone: booking.timezone })} />
        <BookingInfoRow label={labels.success.bookedFor} value={booking.unitLabel} />
        <BookingInfoRow label={labels.success.guests} value={String(booking.guestCount)} />
        <BookingInfoRow label={labels.success.purpose} value={booking.purpose} isLast />
      </AppCard>
      {booking.qrPass ? <BookingQrCard pass={booking.qrPass} locale={locale} timezone={booking.timezone} /> : (
        <AppCard variant="info" style={styles.summaryCard}>
          <SafeText variant="bodyStrong">{labels.success.checkIn}</SafeText>
          <SafeText variant="caption" color="secondary">{labels.success.checkInReference}</SafeText>
        </AppCard>
      )}
      <AppCard variant="outlined" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.success.paymentSummary}</SafeText>
        <BookingInfoRow
          label={labels.success.totalPaid}
          value={booking.quote.breakdown.totalPayableInMinorUnits > 0
            ? formatFacilityCurrency(booking.payment.amountPaidInMinorUnits, booking.quote.currencyCode, locale)
            : labels.success.noPayment}
        />
        <BookingInfoRow
          label={labels.success.deposit}
          value={formatFacilityCurrency(booking.quote.breakdown.refundableDepositInMinorUnits, booking.quote.currencyCode, locale)}
          isLast
        />
      </AppCard>
      <AppCard variant="info" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.success.instructions}</SafeText>
        {[labels.success.arriveOnTime, labels.success.followCapacity, labels.success.leaveOnTime, labels.success.reportIssues].map((instruction) => (
          <View key={instruction} style={styles.instructionRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.info} />
            <SafeText variant="caption" style={styles.grow}>{instruction}</SafeText>
          </View>
        ))}
      </AppCard>
      {calendarFeedback ? (
        <AppCard variant={calendarFeedback.variant} style={styles.summaryCard}>
          <SafeText variant="bodyStrong">{calendarFeedback.title}</SafeText>
          <SafeText variant="caption" color="secondary">{calendarFeedback.description}</SafeText>
        </AppCard>
      ) : null}
      <View style={styles.stickyButtons}>
        <AppButton title={labels.success.viewBooking} onPress={() => navigation.navigate('FacilityBookingDetail', { bookingId: booking.id })} fullWidth />
        <View style={styles.stickyButtonRow}>
          <AppButton title={labels.success.addToCalendar} onPress={() => void addToCalendar()} loading={calendarLink.isPending} variant="outline" style={styles.stickyButton} />
          <AppButton title={labels.success.shareHousehold} onPress={() => void shareBooking()} variant="outline" style={styles.stickyButton} />
        </View>
        <AppButton
          title={labels.success.backToFacilities}
          onPress={() => {
            facilityBookingDraftStore.clear();
            navigation.navigate('FacilityHome', { unitId: activeContext.unitId });
          }}
          variant="ghost"
          fullWidth
        />
      </View>
    </FacilityScreenLayout>
  );
}
