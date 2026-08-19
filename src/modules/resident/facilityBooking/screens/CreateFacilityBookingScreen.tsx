import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { FormField } from '../../../../shared/forms/FormField';
import { StickyFooter } from '../../../../shared/layout/StickyFooter';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityAvailability } from '../hooks/useFacilityAvailability';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import { useCreateFacilityQuote } from '../hooks/useFacilityBookingMutations';
import { FacilityAgeCategory } from '../models/facilityBooking.enums';
import type { FacilityBookingSetupSelection } from '../models/facilityBooking.models';
import {
  facilityBookingDraftStore,
  useFacilityBookingDraft,
} from '../state/facilityBookingDraftStore';
import {
  formatFacilityCurrency,
  formatFacilityLongDate,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import {
  validateBookingPurpose,
  validateContactNumber,
} from '../services/facilityBookingValidator';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { BookingInfoRow } from '../components/BookingInfoRow';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { GuestCounter } from '../components/GuestCounter';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';

type Props = NativeStackScreenProps<FacilityStackParamList, 'CreateFacilityBooking'>;

export function CreateFacilityBookingScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const { isTablet } = useResponsiveLayout();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const draft = useFacilityBookingDraft();
  const facilityId = draft?.facilityId ?? route.params.facilityId ?? '';
  const facilityResource = useFacilityDetails(facilityId);
  const availability = useFacilityAvailability(
    facilityId,
    new Date(Date.now() - 86_400_000).toISOString(),
    new Date(Date.now() + 45 * 86_400_000).toISOString(),
  );
  const quoteMutation = useCreateFacilityQuote();
  const [purpose, setPurpose] = useState(draft?.purpose ?? '');
  const [guestCount, setGuestCount] = useState(draft?.guestCount ?? 1);
  const [contactNumber, setContactNumber] = useState(draft?.contactNumber ?? '');
  const [additionalInstructions, setAdditionalInstructions] = useState(draft?.additionalInstructions ?? '');
  const [setupSelections, setSetupSelections] = useState<readonly FacilityBookingSetupSelection[]>(draft?.setupSelections ?? []);
  const [guestName, setGuestName] = useState(draft?.guestDetails[0]?.name ?? '');
  const [guestPhone, setGuestPhone] = useState(draft?.guestDetails[0]?.phoneNumber ?? '');
  const [submitted, setSubmitted] = useState(false);
  const facility = facilityResource.data;
  const slot = availability.data?.slots.find((item) => item.id === draft?.slotId) ?? null;
  const locale = activeContext.locale ?? 'en-IN';
  const timezone = facility?.timezone ?? activeContext.timezone ?? 'Asia/Kolkata';
  const purposeValid = validateBookingPurpose(purpose);
  const contactValid = validateContactNumber(contactNumber);
  const guestsValid = facility ? guestCount >= facility.minimumGuests && guestCount <= facility.maximumGuests : false;
  const guestDetailsValid = !facility?.requiresGuestDetails || validateBookingPurpose(guestName) && validateContactNumber(guestPhone);
  const draftValid = draft
    && draft.residenceId === activeContext.homeContextId
    && draft.holdId
    && draft.holdExpiresAt
    && Date.parse(draft.holdExpiresAt) > Date.now()
    && slot;

  function toggleSetup(optionId: string): void {
    if (!facility) return;
    const existing = setupSelections.find((item) => item.optionId === optionId);
    if (existing) {
      setSetupSelections((current) => current.filter((item) => item.optionId !== optionId));
      return;
    }
    const option = facility.setupOptions.find((item) => item.id === optionId);
    if (!option) return;
    setSetupSelections((current) => [...current, {
      optionId: option.id,
      name: option.name,
      quantity: 1,
      feeInMinorUnits: option.feeInMinorUnits,
    }]);
  }

  async function continueBooking(): Promise<void> {
    setSubmitted(true);
    if (!draftValid || !draft || !facility || !purposeValid || !contactValid || !guestsValid || !guestDetailsValid) return;
    const quote = await quoteMutation.mutate({
      residenceId: draft.residenceId,
      facilityId: draft.facilityId,
      slotId: draft.slotId ?? '',
      holdId: draft.holdId ?? '',
      guestCount,
      setupSelections,
      discountInMinorUnits: 0,
    });
    if (!quote) return;
    const guestDetails = facility.requiresGuestDetails ? [{
      id: `guest-${Date.now()}`,
      name: guestName.trim(),
      phoneNumber: guestPhone.trim(),
      ageCategory: FacilityAgeCategory.Adult,
      vehicleNumber: null,
    }] : [];
    facilityBookingDraftStore.update({
      purpose: purpose.trim(),
      guestCount,
      contactNumber: contactNumber.trim(),
      additionalInstructions: additionalInstructions.trim(),
      setupSelections,
      guestDetails,
      quoteId: quote.id,
      quote,
    });
    navigation.navigate('FacilityBookingConsent');
  }

  if (facilityResource.isLoading || availability.isLoading) {
    return <FacilityScreenLayout title={labels.information.title} onBack={navigation.goBack}><AppCard><SafeText>{labels.states.loadingDetails}</SafeText></AppCard></FacilityScreenLayout>;
  }
  if (!draftValid || !draft || !facility || !slot) {
    return (
      <FacilityScreenLayout title={labels.information.title} onBack={navigation.goBack}>
        <ErrorState
          title={labels.slots.holdExpiredTitle}
          message={labels.slots.holdExpiredDescription}
          onRetry={() => navigation.navigate('FacilityDetail', { facilityId })}
          retryLabel={labels.details.viewAllSlots}
        />
      </FacilityScreenLayout>
    );
  }
  const summary = (
    <AppCard variant="outlined" style={styles.summaryCard}>
      <SafeText variant="bodyStrong">{facility.name}</SafeText>
      <BookingInfoRow label={labels.review.date} value={formatFacilityLongDate(slot.startsAt, { locale, timezone })} />
      <BookingInfoRow label={labels.review.time} value={formatFacilityTimeRange(slot.startsAt, slot.endsAt, { locale, timezone })} />
      <BookingInfoRow
        label={labels.discovery.rate}
        value={facility.baseFeeInMinorUnits > 0 ? formatFacilityCurrency(facility.baseFeeInMinorUnits, facility.currencyCode, locale) : labels.free}
        isLast
      />
    </AppCard>
  );
  const footer = (
    <StickyFooter>
      <AppButton
        title={labels.information.continueAction}
        onPress={() => void continueBooking()}
        loading={quoteMutation.isPending}
        fullWidth
      />
    </StickyFooter>
  );
  return (
    <FacilityScreenLayout
      title={labels.information.title}
      subtitle={labels.information.subtitle}
      onBack={navigation.goBack}
      footer={footer}
      testID="facility-booking-information-screen"
    >
      <View style={isTablet ? styles.tabletColumns : styles.section}>
        <View style={isTablet ? styles.tabletPrimary : styles.section}>
          <AppCard variant="outlined" style={styles.formCard}>
            <FormField
              label={labels.information.purpose}
              value={purpose}
              onChangeText={setPurpose}
              placeholder={labels.information.purposePlaceholder}
              helperText={labels.information.purposeHelper}
              {...includeWhenPresent('error', submitted && !purposeValid ? labels.information.purposeError : undefined)}
              maxLength={120}
              required
            />
            <View style={styles.section}>
              <SafeText variant="caption">{labels.information.guests}</SafeText>
              <SafeText variant="tiny" color="muted">{labels.information.maximumCapacity(facility.maximumGuests)}</SafeText>
              <GuestCounter
                value={guestCount}
                minimum={facility.minimumGuests}
                maximum={facility.maximumGuests}
                decrementLabel={labels.accessibilityLabels.decrementGuests}
                incrementLabel={labels.accessibilityLabels.incrementGuests}
                onChange={setGuestCount}
              />
              {submitted && !guestsValid ? <SafeText variant="tiny" color="danger">{labels.information.guestError(facility.minimumGuests, facility.maximumGuests)}</SafeText> : null}
            </View>
            <FormField
              label={labels.information.contact}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder={labels.contactNumberPlaceholder}
              {...includeWhenPresent('error', submitted && !contactValid ? labels.information.contactError : undefined)}
              keyboardType="phone-pad"
              required
            />
            <FormField
              label={labels.information.notes}
              value={additionalInstructions}
              onChangeText={setAdditionalInstructions}
              placeholder={labels.information.notesPlaceholder}
              multiline
              numberOfLines={3}
              maxLength={300}
            />
          </AppCard>
          {facility.requiresGuestDetails ? (
            <AppCard variant="outlined" style={styles.formCard}>
              <SafeText variant="bodyStrong">{labels.information.guestDetails}</SafeText>
              <FormField
                label={labels.information.guestName}
                value={guestName}
                onChangeText={setGuestName}
                {...includeWhenPresent('error', submitted && !validateBookingPurpose(guestName) ? labels.information.purposeError : undefined)}
                required
              />
              <FormField
                label={labels.information.guestPhone}
                value={guestPhone}
                onChangeText={setGuestPhone}
                {...includeWhenPresent('error', submitted && !validateContactNumber(guestPhone) ? labels.information.contactError : undefined)}
                keyboardType="phone-pad"
                required
              />
            </AppCard>
          ) : null}
          {facility.setupOptions.length > 0 ? (
            <AppCard variant="outlined" style={styles.formCard}>
              <SafeText variant="bodyStrong">{labels.information.setupOptions}</SafeText>
              <SafeText variant="tiny" color="muted">{labels.information.setupDescription}</SafeText>
              {facility.setupOptions.map((option) => {
                const selected = setupSelections.some((item) => item.optionId === option.id);
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    onPress={() => toggleSetup(option.id)}
                    style={styles.setupOption}
                  >
                    <View style={[
                      styles.checkbox,
                      backgroundBorderStyle(selected ? colors.primary : colors.surface, selected ? colors.primary : colors.border),
                    ]}>
                      {selected ? <Ionicons name="checkmark" size={18} color={colors.textOnPrimary} /> : null}
                    </View>
                    <View style={styles.grow}>
                      <SafeText variant="caption">{option.name}</SafeText>
                      <SafeText variant="tiny" color="muted">{option.description}</SafeText>
                    </View>
                    <SafeText variant="caption">{formatFacilityCurrency(option.feeInMinorUnits, facility.currencyCode, locale)}</SafeText>
                  </Pressable>
                );
              })}
            </AppCard>
          ) : null}
        </View>
        <View style={isTablet ? styles.tabletSecondary : styles.section}>{summary}</View>
      </View>
      {quoteMutation.error ? (
        <View style={[styles.holdBanner, backgroundBorderStyle(colors.dangerSoft, colors.danger)]}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
          <SafeText variant="caption" color="danger" style={styles.grow}>{labels.states.mutationFailed}</SafeText>
        </View>
      ) : null}
    </FacilityScreenLayout>
  );
}
