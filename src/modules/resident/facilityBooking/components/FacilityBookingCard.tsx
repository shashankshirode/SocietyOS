import React from 'react';
import { View, Pressable } from 'react-native';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ResponsiveImage } from '../../../../ui/components/ResponsiveImage';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { FacilityBooking } from '../models/facilityBooking.models';
import {
  formatFacilityShortDate,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import { resolveFacilityBookingImage } from '../media/resolveFacilityImage';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { BookingStatusBadge } from './BookingStatusBadge';
import { FacilityBookingStatus } from '../models/facilityBooking.enums';

interface FacilityBookingCardProps {
  readonly booking: FacilityBooking;
  readonly locale: string;
  readonly onView: () => void;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function FacilityBookingCard({ booking, locale, onView, actionLabel, onAction }: FacilityBookingCardProps) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking.bookings;
  const msg = useMessages().resident.facilityBooking.spaces;
  const context = { locale, timezone: booking.timezone };
  const isPaymentPending = booking.status === FacilityBookingStatus.PaymentPending;

  return (
    <AppCard
      variant={isPaymentPending ? 'warning' : 'outlined'}
      style={[styles.bookingCard, { padding: 14 }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        {/* Fixed image container to prevent width: 100% expansion */}
        <View style={{ width: 68, height: 68, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.surfaceMuted }}>
          <ResponsiveImage
            image={resolveFacilityBookingImage(booking.facilityId)}
            aspectRatio={1}
            width={68}
            height={68}
            style={{ width: 68, height: 68, borderRadius: 10 }}
          />
        </View>

        {/* Content details */}
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <SafeText variant="bodyStrong" color="primary" numberOfLines={1} style={{ flexShrink: 1, fontWeight: '700' }}>
              {booking.facilityName}
            </SafeText>
            <BookingStatusBadge status={booking.status} />
          </View>

          <SafeText variant="caption" color="secondary">
            {formatFacilityShortDate(booking.startsAt, context)} · {formatFacilityTimeRange(booking.startsAt, booking.endsAt, context)}
          </SafeText>

          <SafeText variant="tiny" color="muted">
            {labels.reference}: {booking.bookingReference}
          </SafeText>
        </View>
      </View>

      {/* In-Place Payment Warning Callout */}
      {isPaymentPending ? (
        <View
          style={[
            styles.paymentCallout,
            backgroundBorderStyle(colors.warningSoft, colors.warning),
          ]}
        >
          <SafeText variant="tiny" color="warning" style={{ fontWeight: '700' }}>
            {msg.paymentRequiredCallout}
          </SafeText>
          {onAction ? (
            <Pressable onPress={onAction} accessibilityRole="button">
              <SafeText variant="tiny" color="warning" style={{ fontWeight: '800', textDecorationLine: 'underline' }}>
                {msg.completePaymentAction}
              </SafeText>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {/* Action buttons */}
      <View style={styles.bookingActions}>
        <AppButton title={labels.viewBooking} onPress={onView} variant="outline" size="sm" />
        {actionLabel && onAction && !isPaymentPending ? (
          <AppButton title={actionLabel} onPress={onAction} size="sm" />
        ) : null}
      </View>
    </AppCard>
  );
}
