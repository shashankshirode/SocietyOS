import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import * as Crypto from 'expo-crypto';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { FormField } from '../../../../shared/forms/FormField';
import { StickyFooter } from '../../../../shared/layout/StickyFooter';
import { ConfirmModal } from '../../../../ui/modal/ConfirmModal';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useCancelFacilityReservation } from '../hooks/useFacilityBookingMutations';
import { useFacilityBookingDetail } from '../hooks/useFacilityBookingDetail';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import { FacilityBookingCancellationReason } from '../models/facilityBooking.enums';
import { calculateFacilityRefund } from '../services/facilityRefundCalculator';
import {
  formatFacilityCurrency,
  formatFacilityLongDate,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { BookingInfoRow } from '../components/BookingInfoRow';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { performBackNavigation } from '../../../../shared/navigation/performBackNavigation';

type Props = NativeStackScreenProps<FacilityStackParamList, 'CancelFacilityBooking'>;
const reasons = Object.values(FacilityBookingCancellationReason);

export function CancelFacilityBookingScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const bookingResource = useFacilityBookingDetail(route.params.bookingId);
  const facilityResource = useFacilityDetails(bookingResource.data?.facilityId ?? '');
  const mutation = useCancelFacilityReservation();
  const [reason, setReason] = useState<FacilityBookingCancellationReason | null>(null);
  const [notes, setNotes] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [idempotencyKey] = useState(() => Crypto.randomUUID());
  const booking = bookingResource.data;
  const facility = facilityResource.data;
  const locale = activeContext.locale ?? 'en-IN';
  const preview = useMemo(() => booking && facility ? calculateFacilityRefund({
    booking,
    cancellationPolicy: facility.cancellationPolicy,
    cancelledAt: new Date().toISOString(),
    cancelledBySociety: false,
  }) : null, [booking, facility]);

  async function confirmCancellation(): Promise<void> {
    if (!booking || !reason) return;
    const result = await mutation.mutate({
      idempotencyKey,
      residenceId: activeContext.homeContextId,
      bookingId: booking.id,
      reason,
      notes: notes.trim(),
    });
    if (!result) return;
    setConfirmationVisible(false);
    navigation.replace('FacilityBookingDetail', { bookingId: result.booking.id });
  }

  if (bookingResource.isLoading || facilityResource.isLoading || !booking && !bookingResource.error) {
    return <FacilityScreenLayout title={labels.cancellation.title} onBack={() => performBackNavigation(navigation, { fallbackRoute: 'FacilityBookingDetail', currentRouteName: 'CancelFacilityBooking' })}><AppCard><SafeText>{labels.states.loadingBooking}</SafeText></AppCard></FacilityScreenLayout>;
  }
  if (bookingResource.error || facilityResource.error || !booking || !facility || !preview) {
    return (
      <FacilityScreenLayout title={labels.cancellation.title} onBack={() => performBackNavigation(navigation, { fallbackRoute: 'FacilityBookingDetail', currentRouteName: 'CancelFacilityBooking' })}>
        <ErrorState title={labels.states.loadBookingTitle} message={labels.states.loadBookingDescription} onRetry={() => void bookingResource.refresh()} />
      </FacilityScreenLayout>
    );
  }
  const cutoff = new Date(Date.parse(booking.startsAt) - facility.cancellationCutoffMinutes * 60_000).toISOString();
  const nonRefundable = Math.max(0, booking.payment.amountPaidInMinorUnits - preview.amountInMinorUnits);
  const footer = (
    <StickyFooter>
      <View style={styles.stickyButtonRow}>
        <AppButton title={labels.cancellation.keep} onPress={() => performBackNavigation(navigation, { fallbackRoute: 'FacilityBookingDetail', currentRouteName: 'CancelFacilityBooking' })} variant="outline" style={styles.stickyButton} />
        <AppButton title={labels.cancellation.confirm} onPress={() => setConfirmationVisible(true)} variant="danger" disabled={!reason} style={styles.stickyButton} />
      </View>
    </StickyFooter>
  );
  return (
    <FacilityScreenLayout
      title={labels.cancellation.title}
      subtitle={booking.bookingReference}
      onBack={() => performBackNavigation(navigation, { fallbackRoute: 'FacilityBookingDetail', currentRouteName: 'CancelFacilityBooking' })}
      footer={footer}
      testID="cancel-facility-booking-screen"
    >
      <AppCard variant="warning" style={styles.summaryCard}>
        <View style={styles.rowBetween}>
          <SafeText variant="bodyStrong">{labels.cancellation.message}</SafeText>
          <Ionicons name="warning-outline" size={22} color={colors.warning} />
        </View>
        <BookingInfoRow label={labels.facilityLabel} value={booking.facilityName} />
        <BookingInfoRow label={labels.review.date} value={formatFacilityLongDate(booking.startsAt, { locale, timezone: booking.timezone })} />
        <BookingInfoRow label={labels.review.time} value={formatFacilityTimeRange(booking.startsAt, booking.endsAt, { locale, timezone: booking.timezone })} isLast />
      </AppCard>
      <View style={[styles.refundHighlight, backgroundBorderStyle(colors.infoSoft, colors.info)]}>
        <SafeText variant="bodyStrong">{labels.depositRefund}</SafeText>
        <BookingInfoRow label={labels.cancellation.refundable} value={formatFacilityCurrency(preview.amountInMinorUnits, booking.quote.currencyCode, locale)} />
        <BookingInfoRow label={labels.cancellation.nonRefundable} value={formatFacilityCurrency(nonRefundable, booking.quote.currencyCode, locale)} />
        <BookingInfoRow label={labels.cancellation.cutoff} value={`${formatFacilityLongDate(cutoff, { locale, timezone: booking.timezone })} · ${formatFacilityTimeRange(cutoff, booking.startsAt, { locale, timezone: booking.timezone })}`} isLast />
      </View>
      <View style={styles.section}>
        <SafeText variant="title">{labels.cancellation.reason}</SafeText>
        {reasons.map((item) => {
          const selected = reason === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setReason(item)}
              style={[
                styles.cancellationChoice,
                backgroundBorderStyle(selected ? colors.primarySoft : colors.surface, selected ? colors.primary : colors.border),
              ]}
            >
              <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? colors.primary : colors.textMuted} />
              <SafeText variant="caption">{labels.cancellation.reasons[item]}</SafeText>
            </Pressable>
          );
        })}
      </View>
      <FormField
        label={labels.cancellation.notes}
        value={notes}
        onChangeText={setNotes}
        placeholder={labels.cancellation.notesPlaceholder}
        multiline
        numberOfLines={3}
        maxLength={300}
      />
      {mutation.error ? <ErrorState message={labels.states.mutationFailed} /> : null}
      <ConfirmModal
        visible={confirmationVisible}
        title={labels.cancellation.title}
        message={labels.cancellation.message}
        confirmLabel={labels.cancellation.confirm}
        cancelLabel={labels.cancellation.keep}
        tone="danger"
        loading={mutation.isPending}
        icon={<Ionicons name="trash-outline" size={24} color={colors.danger} />}
        onConfirm={() => void confirmCancellation()}
        onCancel={() => setConfirmationVisible(false)}
      />
    </FacilityScreenLayout>
  );
}
