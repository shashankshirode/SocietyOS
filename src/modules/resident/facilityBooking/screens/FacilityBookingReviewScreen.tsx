import { useState } from 'react';
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
import { useResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useBookingEligibility } from '../hooks/useBookingEligibility';
import { useFacilityAvailability } from '../hooks/useFacilityAvailability';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import { useSubmitFacilityBooking } from '../hooks/useFacilityBookingMutations';
import { useFacilityBookingDraft } from '../state/facilityBookingDraftStore';
import {
  formatFacilityLongDate,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { BookingInfoRow } from '../components/BookingInfoRow';
import { BookingPriceBreakdown } from '../components/BookingPriceBreakdown';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { performBackNavigation } from '../../../../shared/navigation/performBackNavigation';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityBookingReview'>;

export function FacilityBookingReviewScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { isTablet } = useResponsiveLayout();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const draft = useFacilityBookingDraft();
  const facilityResource = useFacilityDetails(draft?.facilityId ?? '');
  const availability = useFacilityAvailability(
    draft?.facilityId ?? '',
    new Date(Date.now() - 86_400_000).toISOString(),
    new Date(Date.now() + 45 * 86_400_000).toISOString(),
  );
  const bookingMutation = useSubmitFacilityBooking();
  const [idempotencyKey] = useState(() => Crypto.randomUUID());
  const eligibility = useBookingEligibility({
    facilityId: draft?.facilityId ?? '',
    slotId: draft?.slotId ?? null,
    guestCount: draft?.guestCount ?? 0,
    consentAccepted: draft?.consentAccepted ?? false,
    paymentMethodAvailable: true,
  });
  const facility = facilityResource.data;
  const slot = availability.data?.slots.find((item) => item.id === draft?.slotId) ?? null;
  const locale = activeContext.locale ?? 'en-IN';
  const timezone = facility?.timezone ?? activeContext.timezone ?? 'Asia/Kolkata';
  const validDraft = draft
    && draft.residenceId === activeContext.homeContextId
    && draft.quote
    && draft.quoteId === draft.quote.id
    && draft.holdId
    && draft.slotId
    && draft.consentAccepted
    && Date.parse(draft.holdExpiresAt ?? '') > Date.now();

  async function confirmBooking(): Promise<void> {
    if (!validDraft || !draft || !draft.quote || !eligibility.data?.eligible) return;
    const booking = await bookingMutation.mutate({
      idempotencyKey,
      userId: activeContext.residentId,
      societyId: draft.societyId,
      residenceId: draft.residenceId,
      unitId: draft.unitId,
      facilityId: draft.facilityId,
      slotId: draft.slotId ?? '',
      holdId: draft.holdId ?? '',
      quoteId: draft.quote.id,
      purpose: draft.purpose,
      guestCount: draft.guestCount,
      contactNumber: draft.contactNumber,
      additionalInstructions: draft.additionalInstructions,
      guestDetails: draft.guestDetails,
      setupSelections: draft.setupSelections,
      consentAccepted: draft.consentAccepted,
      acceptedRuleIds: draft.acceptedRuleIds,
    });
    if (!booking) return;
    if (booking.quote.breakdown.totalPayableInMinorUnits > 0) {
      navigation.replace('FacilityPayment', { bookingId: booking.id });
    } else {
      navigation.replace('FacilityBookingConfirmation', { bookingId: booking.id });
    }
  }

  if (!validDraft || !draft || !facility || !slot) {
    return (
      <FacilityScreenLayout title={labels.review.title} onBack={() => performBackNavigation(navigation, { fallbackRoute: 'FacilityBookingConsent', currentRouteName: 'FacilityBookingReview' })}>
        <ErrorState
          title={labels.review.residenceChangedTitle}
          message={labels.review.residenceChangedDescription}
          onRetry={() => navigation.navigate('FacilityHome', { unitId: activeContext.unitId })}
          retryLabel={labels.success.backToFacilities}
        />
      </FacilityScreenLayout>
    );
  }
  const quote = draft.quote;
  const blocked = eligibility.data && !eligibility.data.eligible;
  const footer = (
    <StickyFooter>
      <AppButton
        title={quote.breakdown.totalPayableInMinorUnits > 0 ? labels.review.proceedToPayment : labels.review.confirmBooking}
        onPress={() => void confirmBooking()}
        disabled={!eligibility.data?.eligible}
        loading={bookingMutation.isPending}
        fullWidth
      />
    </StickyFooter>
  );
  const bookingSummary = (
    <AppCard variant="outlined" style={styles.summaryCard}>
      <SafeText variant="bodyStrong">{labels.review.facilitySummary}</SafeText>
      <BookingInfoRow label={labels.facilityLabel} value={facility.name} />
      <BookingInfoRow label={labels.review.date} value={formatFacilityLongDate(slot.startsAt, { locale, timezone })} />
      <BookingInfoRow label={labels.review.time} value={formatFacilityTimeRange(slot.startsAt, slot.endsAt, { locale, timezone })} />
      <BookingInfoRow label={labels.review.guests} value={String(draft.guestCount)} />
      <BookingInfoRow label={labels.review.purpose} value={draft.purpose} isLast />
    </AppCard>
  );
  return (
    <FacilityScreenLayout
      title={labels.review.title}
      subtitle={labels.review.subtitle}
      onBack={() => performBackNavigation(navigation, { fallbackRoute: 'FacilityBookingConsent', currentRouteName: 'FacilityBookingReview' })}
      footer={footer}
      testID="facility-booking-review-screen"
    >
      <View style={isTablet ? styles.tabletColumns : styles.section}>
        <View style={isTablet ? styles.tabletPrimary : styles.section}>
          {bookingSummary}
          <AppCard variant="outlined" style={styles.summaryCard}>
            <SafeText variant="bodyStrong">{labels.review.residentSummary}</SafeText>
            <BookingInfoRow label={labels.review.resident} value={activeContext.residentId} />
            <BookingInfoRow label={labels.review.residence} value={activeContext.societyName} />
            <BookingInfoRow label={labels.review.unit} value={activeContext.displayUnitName} />
            <BookingInfoRow label={labels.review.contact} value={draft.contactNumber} isLast />
          </AppCard>
          <AppCard variant="success" style={styles.summaryCard}>
            <View style={styles.rowBetween}>
              <SafeText variant="bodyStrong">{labels.review.consentStatus}</SafeText>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.success} />
            </View>
            <SafeText variant="caption">{labels.review.accepted}</SafeText>
          </AppCard>
        </View>
        <View style={isTablet ? styles.tabletSecondary : styles.section}>
          <BookingPriceBreakdown breakdown={quote.breakdown} currencyCode={quote.currencyCode} locale={locale} />
        </View>
      </View>
      {eligibility.data?.warnings.map((warning) => (
        <View key={warning.code} style={[styles.holdBanner, backgroundBorderStyle(colors.warningSoft, colors.warning)]}>
          <Ionicons name="warning-outline" size={20} color={colors.warning} />
          <SafeText variant="caption" style={styles.grow}>{labels.eligibilityWarnings[warning.code]}</SafeText>
        </View>
      ))}
      {blocked ? (
        <AppCard variant="danger" style={styles.summaryCard}>
          {eligibility.data?.blockingReasons.map((reason) => (
            <SafeText key={reason.code} variant="caption" color="danger">{labels.eligibilityReasons[reason.code]}</SafeText>
          ))}
        </AppCard>
      ) : null}
      {bookingMutation.error ? <ErrorState message={labels.states.mutationFailed} /> : null}
    </FacilityScreenLayout>
  );
}
