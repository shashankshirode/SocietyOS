import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppButton } from '../../../../shared/components/AppButton';
import { EmptyStatePanel } from '../../../../shared/components/EmptyStatePanel';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { DetailBlockSkeleton } from '../../../../shared/feedback/Skeleton';
import { StickyFooter } from '../../../../shared/layout/StickyFooter';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { FacilitySlotStatus } from '../models/facilityBooking.enums';
import { useFacilityAvailability } from '../hooks/useFacilityAvailability';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import {
  useHoldFacilitySlot,
  useJoinFacilityWaitlist,
  useReleaseFacilitySlot,
} from '../hooks/useFacilityBookingMutations';
import {
  facilityBookingDraftStore,
  useFacilityBookingDraft,
} from '../state/facilityBookingDraftStore';
import {
  dateKeyForTimezone,
  formatHoldCountdown,
  formatFacilityLongDate,
  formatFacilityMonth,
  formatFacilityShortDate,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { FacilitySlotCard } from '../components/FacilitySlotCard';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilitySlotAvailability'>;

export function FacilitySlotAvailabilityScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const locale = activeContext.locale ?? 'en-IN';
  const timezone = activeContext.timezone ?? 'Asia/Kolkata';
  const startDate = useMemo(() => new Date(Date.now() - 86_400_000).toISOString(), []);
  const endDate = useMemo(() => new Date(Date.now() + 45 * 86_400_000).toISOString(), []);
  const resource = useFacilityAvailability(route.params.facilityId, startDate, endDate);
  const facilityResource = useFacilityDetails(route.params.facilityId);
  const draft = useFacilityBookingDraft();
  const holdMutation = useHoldFacilitySlot();
  const releaseMutation = useReleaseFacilitySlot();
  const waitlistMutation = useJoinFacilityWaitlist();
  const releaseSlot = releaseMutation.mutate;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const slots = useMemo(() => resource.data?.slots ?? [], [resource.data?.slots]);
  const dates = useMemo(() => Array.from(new Set(slots.map((slot) => dateKeyForTimezone(slot.startsAt, { locale, timezone })))), [locale, slots, timezone]);
  const activeDate = selectedDate ?? dates[0] ?? null;
  const visibleSlots = slots.filter((slot) => dateKeyForTimezone(slot.startsAt, { locale, timezone }) === activeDate);
  const selectedSlotId = draft?.residenceId === activeContext.homeContextId && draft.facilityId === route.params.facilityId
    ? draft.slotId
    : null;
  const holdRemaining = draft?.holdExpiresAt ? Date.parse(draft.holdExpiresAt) - now : 0;

  useEffect(() => {
    if (!draft?.holdExpiresAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(interval);
  }, [draft?.holdExpiresAt]);

  useEffect(() => {
    if (!draft?.holdId || holdRemaining > 0) return;
    void releaseSlot({ residenceId: draft.residenceId, holdId: draft.holdId });
    facilityBookingDraftStore.clear();
  }, [draft?.holdId, draft?.residenceId, holdRemaining, releaseSlot]);

  async function selectSlot(slotId: string): Promise<void> {
    if (draft?.holdId && draft.slotId !== slotId) {
      await releaseSlot({ residenceId: draft.residenceId, holdId: draft.holdId });
    }
    const hold = await holdMutation.mutate({
      societyId: activeContext.societyId,
      residenceId: activeContext.homeContextId,
      unitId: activeContext.unitId,
      facilityId: route.params.facilityId,
      slotId,
    });
    if (!hold) return;
    facilityBookingDraftStore.start({
      residenceId: activeContext.homeContextId,
      societyId: activeContext.societyId,
      unitId: activeContext.unitId,
      facilityId: route.params.facilityId,
      contactNumber: '+919876543210',
    });
    facilityBookingDraftStore.update({
      slotId,
      holdId: hold.id,
      holdExpiresAt: hold.expiresAt,
    });
  }

  async function joinWaitlist(slotId: string): Promise<void> {
    await waitlistMutation.mutate({
      residenceId: activeContext.homeContextId,
      unitId: activeContext.unitId,
      facilityId: route.params.facilityId,
      slotId,
    });
  }

  const footer = (
    <StickyFooter>
      <AppButton
        title={labels.slots.continueAction}
        onPress={() => {
          if (!selectedSlotId) return;
          navigation.navigate('CreateFacilityBooking', {
            facilityId: route.params.facilityId,
            selectedSlotId,
          });
        }}
        disabled={!selectedSlotId || holdRemaining <= 0}
        fullWidth
      />
    </StickyFooter>
  );

  if (resource.isLoading || facilityResource.isLoading) {
    return (
      <FacilityScreenLayout title={labels.slots.title} onBack={navigation.goBack}>
        <DetailBlockSkeleton />
        <DetailBlockSkeleton />
      </FacilityScreenLayout>
    );
  }
  if (resource.error || facilityResource.error || !facilityResource.data) {
    return (
      <FacilityScreenLayout title={labels.slots.title} onBack={navigation.goBack}>
        <ErrorState
          title={labels.states.loadSlotsTitle}
          message={labels.states.loadSlotsDescription}
          onRetry={() => void resource.refresh()}
          retryLabel={labels.states.retry}
        />
      </FacilityScreenLayout>
    );
  }
  const facility = facilityResource.data;
  return (
    <FacilityScreenLayout
      title={labels.slots.title}
      subtitle={labels.slots.subtitle(facility.name)}
      onBack={navigation.goBack}
      footer={footer}
      testID="facility-slot-screen"
    >
      {activeDate ? (
        <View style={styles.section}>
          <View style={styles.calendarHeader}>
            <SafeText variant="title">{formatFacilityMonth(`${activeDate}T12:00:00.000Z`, { locale, timezone })}</SafeText>
            <Ionicons name="calendar-outline" size={22} color={colors.primary} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStripContent}>
            {dates.map((date) => {
              const selected = date === activeDate;
              return (
                <Pressable
                  key={date}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={formatFacilityLongDate(`${date}T12:00:00.000Z`, { locale, timezone })}
                  onPress={() => setSelectedDate(date)}
                  style={[
                    styles.dateButton,
                    backgroundBorderStyle(selected ? colors.primarySoft : colors.surface, selected ? colors.primary : colors.border),
                  ]}
                >
                  <SafeText variant="tiny" color={selected ? 'info' : 'muted'}>{formatFacilityShortDate(`${date}T12:00:00.000Z`, { locale, timezone })}</SafeText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
      {draft?.holdExpiresAt && selectedSlotId && holdRemaining > 0 ? (
        <View style={[styles.holdBanner, backgroundBorderStyle(colors.infoSoft, colors.info)]}>
          <Ionicons name="timer-outline" size={20} color={colors.info} />
          <SafeText variant="caption" style={styles.grow}>{labels.slots.holdMessage(formatHoldCountdown(holdRemaining))}</SafeText>
        </View>
      ) : null}
      {holdRemaining <= 0 && draft?.holdExpiresAt ? (
        <View style={[styles.holdBanner, backgroundBorderStyle(colors.dangerSoft, colors.danger)]}>
          <Ionicons name="time-outline" size={20} color={colors.danger} />
          <SafeText variant="caption" color="danger" style={styles.grow}>{labels.slots.holdExpiredDescription}</SafeText>
        </View>
      ) : null}
      {visibleSlots.length === 0 ? (
        <EmptyStatePanel
          title={labels.slots.noAvailabilityTitle}
          description={labels.slots.noAvailabilityDescription}
          icon="calendar"
        />
      ) : (
        <View style={styles.section} accessibilityRole="radiogroup">
          <SafeText variant="title">{activeDate ? formatFacilityLongDate(`${activeDate}T12:00:00.000Z`, { locale, timezone }) : labels.selectDate}</SafeText>
          {visibleSlots.map((slot) => (
            <FacilitySlotCard
              key={slot.id}
              slot={slot}
              locale={locale}
              timezone={timezone}
              currencyCode={facility.currencyCode}
              selected={selectedSlotId === slot.id}
              onSelect={() => void selectSlot(slot.id)}
              {...includeWhenPresent('onJoinWaitlist', slot.status === FacilitySlotStatus.Full && facility.waitlistEnabled ? () => void joinWaitlist(slot.id) : undefined)}
            />
          ))}
        </View>
      )}
      {holdMutation.error || releaseMutation.error || waitlistMutation.error ? (
        <ErrorState message={labels.states.mutationFailed} onRetry={() => void resource.refresh()} />
      ) : null}
      {waitlistMutation.data ? (
        <View style={[styles.holdBanner, backgroundBorderStyle(colors.successSoft, colors.success)]}>
          <Ionicons name="notifications-outline" size={20} color={colors.success} />
          <SafeText variant="caption">{labels.slots.waitlistPosition(waitlistMutation.data.position)}</SafeText>
        </View>
      ) : null}
    </FacilityScreenLayout>
  );
}
