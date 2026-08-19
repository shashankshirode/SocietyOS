import { View } from 'react-native';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ResponsiveImage } from '../../../../ui/components/ResponsiveImage';
import { useMessages } from '../../../../messages/useMessages';
import type { FacilityBooking } from '../models/facilityBooking.models';
import {
  formatFacilityShortDate,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import { resolveFacilityBookingImage } from '../media/resolveFacilityImage';
import { facilityBookingStyles as styles } from '../styles/facilityBooking.styles';
import { BookingStatusBadge } from './BookingStatusBadge';

interface FacilityBookingCardProps {
  readonly booking: FacilityBooking;
  readonly locale: string;
  readonly onView: () => void;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function FacilityBookingCard({ booking, locale, onView, actionLabel, onAction }: FacilityBookingCardProps) {
  const labels = useMessages().resident.facilityBooking.bookings;
  const context = { locale, timezone: booking.timezone };
  return (
    <AppCard variant="outlined" style={styles.bookingCard}>
      <View style={styles.row}>
        <ResponsiveImage image={resolveFacilityBookingImage(booking.facilityId)} aspectRatio={1} style={styles.bookingImage} />
        <View style={styles.bookingCardContent}>
          <View style={styles.rowBetween}>
            <SafeText variant="bodyStrong" style={styles.grow}>{booking.facilityName}</SafeText>
            <BookingStatusBadge status={booking.status} />
          </View>
          <SafeText variant="tiny" color="muted">
            {formatFacilityShortDate(booking.startsAt, context)} · {formatFacilityTimeRange(booking.startsAt, booking.endsAt, context)}
          </SafeText>
          <SafeText variant="tiny" color="secondary">{labels.reference}: {booking.bookingReference}</SafeText>
        </View>
      </View>
      <View style={styles.bookingActions}>
        <AppButton title={labels.viewBooking} onPress={onView} variant="outline" size="sm" />
        {actionLabel && onAction ? <AppButton title={actionLabel} onPress={onAction} size="sm" /> : null}
      </View>
    </AppCard>
  );
}
