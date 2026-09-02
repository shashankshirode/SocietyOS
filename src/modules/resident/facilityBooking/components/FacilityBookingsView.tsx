import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { EmptyStatePanel } from '../../../../shared/components/EmptyStatePanel';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { DetailBlockSkeleton } from '../../../../shared/feedback/Skeleton';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookings } from '../hooks/useFacilityBookings';
import { useLeaveFacilityWaitlist } from '../hooks/useFacilityBookingMutations';
import {
  FacilityBookingFilter,
  FacilityBookingStatus,
} from '../models/facilityBooking.enums';
import type { FacilityBooking } from '../models/facilityBooking.models';
import {
  formatFacilityLongDate,
  formatFacilityTime,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { FacilityBookingCard } from './FacilityBookingCard';
import { FacilityScreenLayout } from './FacilityScreenLayout';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';

interface FacilityBookingsViewProps {
  readonly initialFilter: FacilityBookingFilter;
  readonly onBack: () => void;
  readonly onExplore: () => void;
  readonly onView: (bookingId: string) => void;
  readonly onPay: (bookingId: string) => void;
  readonly onCheckIn: (bookingId: string) => void;
  readonly onReschedule: (bookingId: string) => void;
  readonly onBookAgain: (facilityId: string) => void;
}

function actionForBooking(booking: FacilityBooking, labels: ReturnType<typeof useMessages>['resident']['facilityBooking']['bookings']) {
  if (booking.status === FacilityBookingStatus.PaymentPending) return labels.completePayment;
  if (booking.status === FacilityBookingStatus.Confirmed && booking.qrPass?.active) {
    const now = Date.now();
    if (now >= Date.parse(booking.qrPass.validFrom) && now <= Date.parse(booking.qrPass.validUntil)) return labels.checkIn;
    return labels.reschedule;
  }
  if ([
    FacilityBookingStatus.Completed,
    FacilityBookingStatus.CancelledByResident,
    FacilityBookingStatus.CancelledBySociety,
    FacilityBookingStatus.NoShow,
    FacilityBookingStatus.Refunded,
    FacilityBookingStatus.PartiallyRefunded,
  ].includes(booking.status)) return labels.bookAgain;
  return null;
}

export function FacilityBookingsView({
  initialFilter,
  onBack,
  onExplore,
  onView,
  onPay,
  onCheckIn,
  onReschedule,
  onBookAgain,
}: FacilityBookingsViewProps) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const msg = labels.spaces;
  const { activeContext } = useActiveResidentHome();
  const [filter, setFilter] = useState(initialFilter);
  const resource = useFacilityBookings(filter);
  const leaveMutation = useLeaveFacilityWaitlist();
  const locale = activeContext.locale ?? 'en-IN';

  const filters = [
    { id: FacilityBookingFilter.Upcoming, label: labels.bookings.filters.UPCOMING.toUpperCase() },
    { id: FacilityBookingFilter.Waitlisted, label: labels.bookings.filters.WAITLISTED.toUpperCase() },
    { id: FacilityBookingFilter.Past, label: labels.bookings.filters.PAST.toUpperCase() },
    { id: FacilityBookingFilter.Cancelled, label: labels.bookings.filters.CANCELLED.toUpperCase() },
  ];

  function handleAction(booking: FacilityBooking): void {
    if (booking.status === FacilityBookingStatus.PaymentPending) onPay(booking.id);
    else if (booking.status === FacilityBookingStatus.Confirmed && booking.qrPass?.active) {
      const now = Date.now();
      if (now >= Date.parse(booking.qrPass.validFrom) && now <= Date.parse(booking.qrPass.validUntil)) onCheckIn(booking.id);
      else onReschedule(booking.id);
    } else onBookAgain(booking.facilityId);
  }

  const nextBooking = filter === FacilityBookingFilter.Upcoming && resource.bookings.length > 0
    ? resource.bookings[0]
    : null;

  const subsequentBookings = nextBooking
    ? resource.bookings.slice(1)
    : resource.bookings;

  const emptyCopy = {
    [FacilityBookingFilter.Upcoming]: { title: labels.bookings.noUpcomingTitle, description: labels.bookings.noUpcomingDescription },
    [FacilityBookingFilter.Past]: { title: labels.bookings.noPastTitle, description: labels.bookings.noPastDescription },
    [FacilityBookingFilter.Cancelled]: { title: labels.bookings.noCancelledTitle, description: labels.bookings.noCancelledDescription },
    [FacilityBookingFilter.Waitlisted]: { title: labels.bookings.noWaitlistTitle, description: labels.bookings.noWaitlistDescription },
  }[filter];

  return (
    <FacilityScreenLayout
      title={msg.myTimeTitle}
      subtitle={msg.myTimeSubtitle}
      onBack={onBack}
      testID="my-facility-bookings-screen"
    >
      {/* Lifecycle Navigation Rail */}
      <View style={styles.tabs} accessibilityRole="tablist">
        {filters.map((item) => {
          const selected = filter === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              testID={`facility-booking-tab-${item.id}`}
              onPress={() => setFilter(item.id)}
              style={[
                styles.tab,
                backgroundBorderStyle(
                  selected ? colors.primarySoft : colors.surface,
                  selected ? colors.primary : colors.border
                ),
              ]}
            >
              <SafeText variant="tiny" style={{ fontWeight: selected ? '700' : '500' }} color={selected ? 'info' : 'secondary'} align="center">
                {item.label}
              </SafeText>
            </Pressable>
          );
        })}
      </View>

      {resource.isLoading ? (
        <View style={styles.section}>
          <DetailBlockSkeleton />
          <DetailBlockSkeleton />
        </View>
      ) : resource.error ? (
        <ErrorState
          title={labels.states.loadBookingsTitle}
          message={labels.states.loadBookingsDescription}
          onRetry={() => void resource.refresh()}
          retryLabel={labels.states.retry}
        />
      ) : resource.bookings.length === 0 && resource.waitlistEntries.length === 0 ? (
        <EmptyStatePanel
          title={emptyCopy.title}
          description={emptyCopy.description}
          icon="calendar"
          actionArea={<AppButton title={labels.bookings.explore} onPress={onExplore} />}
        />
      ) : (
        <View style={styles.section}>
          {/* Spotlight Hero for NEXT booking */}
          {nextBooking ? (
            <View style={{ gap: 8, marginBottom: 8 }}>
              <SafeText variant="tiny" color="primary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                {msg.nextUp}
              </SafeText>
              <FacilityBookingCard
                booking={nextBooking}
                locale={locale}
                onView={() => onView(nextBooking.id)}
                {...includeWhenPresent('actionLabel', actionForBooking(nextBooking, labels.bookings) ?? undefined)}
                {...includeWhenPresent('onAction', actionForBooking(nextBooking, labels.bookings) ? () => handleAction(nextBooking) : undefined)}
              />
            </View>
          ) : null}

          {/* Subsequent Chronological Bookings */}
          {subsequentBookings.length > 0 ? (
            <View style={{ gap: 12 }}>
              {nextBooking ? (
                <SafeText variant="tiny" color="secondary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                  {msg.laterReservations}
                </SafeText>
              ) : null}
              {subsequentBookings.map((booking) => {
                const actionLabel = actionForBooking(booking, labels.bookings);
                return (
                  <FacilityBookingCard
                    key={booking.id}
                    booking={booking}
                    locale={locale}
                    onView={() => onView(booking.id)}
                    {...includeWhenPresent('actionLabel', actionLabel ?? undefined)}
                    {...includeWhenPresent('onAction', actionLabel ? () => handleAction(booking) : undefined)}
                  />
                );
              })}
            </View>
          ) : null}

          {/* Waitlist Entries */}
          {resource.waitlistEntries.map((entry) => (
            <AppCard key={entry.id} variant="warning" style={styles.summaryCard}>
              <View style={styles.rowBetween}>
                <View style={styles.waitlistPosition}>
                  <SafeText variant="title">{entry.position}</SafeText>
                </View>
                <View style={styles.grow}>
                  <SafeText variant="bodyStrong">{labels.waitlist.title}</SafeText>
                  <SafeText variant="tiny" color="secondary">{labels.waitlist.position}: {entry.position}</SafeText>
                  <SafeText variant="tiny" color="muted">{labels.waitlist.expiry}: {formatFacilityLongDate(entry.expiresAt, { locale, timezone: activeContext.timezone ?? 'Asia/Kolkata' })} · {formatFacilityTime(entry.expiresAt, { locale, timezone: activeContext.timezone ?? 'Asia/Kolkata' })}</SafeText>
                </View>
              </View>
              <SafeText variant="caption" color="secondary">{labels.waitlist.notification}</SafeText>
              <AppButton
                title={labels.waitlist.leave}
                onPress={() => void leaveMutation.mutate({ residenceId: activeContext.homeContextId, waitlistId: entry.id })}
                loading={leaveMutation.isPending}
                variant="outline"
              />
            </AppCard>
          ))}

          {resource.hasMore ? (
            <AppButton title={labels.bookings.retryMore} onPress={() => void resource.loadMore()} loading={resource.isLoadingMore} variant="outline" />
          ) : null}
          {resource.nextPageError ? <SafeText variant="tiny" color="danger">{labels.bookings.nextPageError}</SafeText> : null}
          {resource.isRefreshing ? <ActivityIndicator color={colors.primary} /> : null}
        </View>
      )}
      {leaveMutation.error ? (
        <View style={[styles.holdBanner, backgroundBorderStyle(colors.dangerSoft, colors.danger)]}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
          <SafeText variant="caption" color="danger">{labels.states.mutationFailed}</SafeText>
        </View>
      ) : null}
    </FacilityScreenLayout>
  );
}
