import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import * as Crypto from 'expo-crypto';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { StickyFooter } from '../../../../shared/layout/StickyFooter';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityAvailability } from '../hooks/useFacilityAvailability';
import { useFacilityBookingDetail } from '../hooks/useFacilityBookingDetail';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import {
  useHoldFacilitySlot,
  useReleaseFacilitySlot,
  useRescheduleFacilityReservation,
} from '../hooks/useFacilityBookingMutations';
import { FacilityBookingStatus, FacilitySlotStatus } from '../models/facilityBooking.enums';
import type { FacilitySlotHold } from '../models/facilityBooking.models';
import {
  calculateFacilityBookingPrice,
  calculateQuoteDifferenceInMinorUnits,
} from '../services/facilityBookingCalculator';
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
import { FacilitySlotCard } from '../components/FacilitySlotCard';

type Props = NativeStackScreenProps<FacilityStackParamList, 'RescheduleFacilityBooking'>;

export function RescheduleFacilityBookingScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const bookingResource = useFacilityBookingDetail(route.params.bookingId);
  const booking = bookingResource.data;
  const facilityResource = useFacilityDetails(booking?.facilityId ?? '');
  const availability = useFacilityAvailability(
    booking?.facilityId ?? '',
    new Date(Date.now() - 86_400_000).toISOString(),
    new Date(Date.now() + 45 * 86_400_000).toISOString(),
  );
  const holdMutation = useHoldFacilitySlot();
  const releaseMutation = useReleaseFacilitySlot();
  const rescheduleMutation = useRescheduleFacilityReservation();
  const [newHold, setNewHold] = useState<FacilitySlotHold | null>(null);
  const [idempotencyKey] = useState(() => Crypto.randomUUID());
  const committed = useRef(false);
  const newHoldRef = useRef<FacilitySlotHold | null>(null);
  const locale = activeContext.locale ?? 'en-IN';
  const facility = facilityResource.data;
  const selectedSlot = availability.data?.slots.find((slot) => slot.id === newHold?.slotId) ?? null;
  const slots = (availability.data?.slots ?? []).filter((slot) => slot.id !== booking?.quote.slotId);
  const release = releaseMutation.mutate;

  useEffect(() => {
    newHoldRef.current = newHold;
  }, [newHold]);

  useEffect(() => () => {
    const pendingHold = newHoldRef.current;
    if (!committed.current && pendingHold) {
      void release({ residenceId: pendingHold.residenceId, holdId: pendingHold.id });
    }
  }, [release]);

  async function selectSlot(slotId: string): Promise<void> {
    if (!booking) return;
    if (newHold) await release({ residenceId: newHold.residenceId, holdId: newHold.id });
    const hold = await holdMutation.mutate({
      societyId: activeContext.societyId,
      residenceId: activeContext.homeContextId,
      unitId: activeContext.unitId,
      facilityId: booking.facilityId,
      slotId,
    });
    if (hold) setNewHold(hold);
  }

  async function confirmReschedule(): Promise<void> {
    if (!booking || !newHold) return;
    const updated = await rescheduleMutation.mutate({
      idempotencyKey,
      residenceId: activeContext.homeContextId,
      bookingId: booking.id,
      newSlotId: newHold.slotId,
      newHoldId: newHold.id,
    });
    if (!updated) return;
    committed.current = true;
    if (updated.status === FacilityBookingStatus.PaymentPending) {
      navigation.replace('FacilityPayment', { bookingId: updated.id });
    } else {
      navigation.replace('FacilityBookingDetail', { bookingId: updated.id });
    }
  }

  if (bookingResource.isLoading || facilityResource.isLoading || availability.isLoading || !booking && !bookingResource.error) {
    return <FacilityScreenLayout title={labels.reschedule.title} onBack={navigation.goBack}><AppCard><SafeText>{labels.states.loadingAvailability}</SafeText></AppCard></FacilityScreenLayout>;
  }
  if (bookingResource.error || facilityResource.error || availability.error || !booking || !facility) {
    return (
      <FacilityScreenLayout title={labels.reschedule.title} onBack={navigation.goBack}>
        <ErrorState title={labels.states.loadSlotsTitle} message={labels.states.loadSlotsDescription} onRetry={() => void availability.refresh()} />
      </FacilityScreenLayout>
    );
  }
  const nextBreakdown = selectedSlot ? calculateFacilityBookingPrice({
    facility,
    slot: selectedSlot,
    guestCount: booking.guestCount,
    setupSelections: booking.setupSelections,
    discountInMinorUnits: booking.quote.breakdown.discountInMinorUnits,
  }) : null;
  const difference = nextBreakdown ? calculateQuoteDifferenceInMinorUnits(booking.quote.breakdown, nextBreakdown) : 0;
  const differenceLabel = difference > 0
    ? labels.reschedule.additionalPayment
    : difference < 0 ? labels.reschedule.refundableDifference : labels.reschedule.noChange;
  const footer = (
    <StickyFooter>
      <AppButton
        title={labels.reschedule.confirm}
        onPress={() => void confirmReschedule()}
        disabled={!newHold || Date.parse(newHold.expiresAt) <= Date.now()}
        loading={rescheduleMutation.isPending}
        fullWidth
      />
    </StickyFooter>
  );
  return (
    <FacilityScreenLayout
      title={labels.reschedule.title}
      subtitle={labels.reschedule.subtitle}
      onBack={navigation.goBack}
      footer={footer}
      testID="reschedule-facility-booking-screen"
    >
      <AppCard variant="outlined" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.reschedule.currentBooking}</SafeText>
        <BookingInfoRow label={labels.facilityLabel} value={booking.facilityName} />
        <BookingInfoRow label={labels.review.date} value={formatFacilityLongDate(booking.startsAt, { locale, timezone: booking.timezone })} />
        <BookingInfoRow label={labels.review.time} value={formatFacilityTimeRange(booking.startsAt, booking.endsAt, { locale, timezone: booking.timezone })} isLast />
      </AppCard>
      <View style={styles.section}>
        <SafeText variant="title">{labels.reschedule.newSlot}</SafeText>
        {slots.filter((slot) => [FacilitySlotStatus.Available, FacilitySlotStatus.Limited].includes(slot.status) || slot.id === newHold?.slotId).map((slot) => (
          <FacilitySlotCard
            key={slot.id}
            slot={slot}
            locale={locale}
            timezone={booking.timezone}
            currencyCode={booking.quote.currencyCode}
            selected={newHold?.slotId === slot.id}
            onSelect={() => void selectSlot(slot.id)}
          />
        ))}
      </View>
      {selectedSlot ? (
        <View style={[styles.refundHighlight, backgroundBorderStyle(difference > 0 ? colors.warningSoft : colors.successSoft, difference > 0 ? colors.warning : colors.success)]}>
          <View style={styles.rowBetween}>
            <SafeText variant="bodyStrong">{labels.reschedule.priceDifference}</SafeText>
            <Ionicons name={difference > 0 ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline'} size={22} color={difference > 0 ? colors.warning : colors.success} />
          </View>
          <SafeText variant="caption">{differenceLabel}</SafeText>
          <SafeText variant="title">{formatFacilityCurrency(Math.abs(difference), booking.quote.currencyCode, locale)}</SafeText>
        </View>
      ) : null}
      {holdMutation.error || releaseMutation.error || rescheduleMutation.error ? <ErrorState message={labels.states.mutationFailed} /> : null}
    </FacilityScreenLayout>
  );
}
