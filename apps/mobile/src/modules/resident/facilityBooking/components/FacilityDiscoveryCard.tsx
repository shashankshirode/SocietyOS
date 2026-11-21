import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppCard } from '../../../../shared/cards/AppCard';
import { SafeText } from '../../../../shared/components/SafeText';
import { ResponsiveImage } from '../../../../ui/components/ResponsiveImage';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { Facility } from '../models/facilityBooking.models';
import { FacilityAvailabilityStatus } from '../models/facilityBooking.enums';
import { resolveFacilityImage } from '../media/resolveFacilityImage';
import { FacilityStatusBadge } from './FacilityStatusBadge';
import {
  formatFacilityCurrency,
  formatFacilityOperatingHours,
  formatFacilityShortDate,
  formatFacilityTime,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';

interface FacilityDiscoveryCardProps {
  readonly facility: Facility;
  readonly locale: string;
  readonly timezone: string;
  readonly onPress: () => void;
}

export function FacilityDiscoveryCard({
  facility,
  locale,
  timezone,
  onPress,
}: FacilityDiscoveryCardProps) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const firstSchedule = facility.operatingSchedule.find((schedule) => !schedule.closed);
  const operatingHours = firstSchedule
    ? formatFacilityOperatingHours(firstSchedule.opensAtLocalTime, firstSchedule.closesAtLocalTime, locale)
    : labels.availability.TEMPORARILY_CLOSED;
  const nextAvailable = facility.nextAvailableAt
    ? `${formatFacilityShortDate(facility.nextAvailableAt, { locale, timezone })} · ${formatFacilityTime(facility.nextAvailableAt, { locale, timezone })}`
    : labels.discovery.unavailable;
  const actionLabel = facility.availabilityStatus === FacilityAvailabilityStatus.FullyBooked && facility.waitlistEnabled
    ? labels.discovery.joinWaitlist
    : facility.bookingEnabled ? labels.discovery.viewSlots : labels.discovery.viewDetails;
  return (
    <AppCard
      padding="none"
      variant="elevated"
      onPress={onPress}
      pressable
      style={styles.facilityCard}
      testID={`facility-card-${facility.id}`}
    >
      <ResponsiveImage
        image={resolveFacilityImage(facility)}
        aspectRatio={16 / 8}
        style={styles.facilityCardImage}
      />
      <View style={styles.facilityCardContent}>
        <View style={styles.rowBetween}>
          <View style={styles.grow}>
            <SafeText variant="bodyStrong">{facility.name}</SafeText>
            <SafeText variant="tiny" color="muted">{labels.categories[facility.category]}</SafeText>
          </View>
          <FacilityStatusBadge status={facility.availabilityStatus} />
        </View>
        <SafeText variant="caption" color="secondary" numberOfLines={2}>{facility.description}</SafeText>
        <View style={styles.facilityCardMeta}>
          <View style={styles.iconText}>
            <Ionicons name="location-outline" size={15} color={colors.textMuted} />
            <SafeText variant="tiny" color="muted">{facility.locationName}</SafeText>
          </View>
          <View style={styles.iconText}>
            <Ionicons name="people-outline" size={15} color={colors.textMuted} />
            <SafeText variant="tiny" color="muted">{labels.details.guests(facility.maximumGuests)}</SafeText>
          </View>
          <View style={styles.iconText}>
            <Ionicons name="time-outline" size={15} color={colors.textMuted} />
            <SafeText variant="tiny" color="muted">{operatingHours}</SafeText>
          </View>
        </View>
        <View style={[styles.mutedDivider, backgroundColorStyle(colors.divider)]} />
        <View style={styles.rowBetween}>
          <View style={styles.grow}>
            <SafeText variant="tiny" color="muted">{labels.discovery.nextAvailable}</SafeText>
            <SafeText variant="caption">{nextAvailable}</SafeText>
          </View>
          <View>
            <SafeText variant="tiny" color="muted" align="right">{labels.discovery.rate}</SafeText>
            <SafeText variant="caption" align="right">
              {facility.baseFeeInMinorUnits > 0
                ? formatFacilityCurrency(facility.baseFeeInMinorUnits, facility.currencyCode, locale)
                : labels.free}
            </SafeText>
          </View>
        </View>
        <SafeText variant="tiny" color="info">{actionLabel}</SafeText>
      </View>
    </AppCard>
  );
}
