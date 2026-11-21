import { View } from 'react-native';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { FacilityBookingTimelineItem } from '../models/facilityBooking.models';
import { formatFacilityShortDate, formatFacilityTime } from '../services/facilityDateTimeFormatter';
import {
  backgroundColorStyle,
  borderColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';

interface BookingTimelineProps {
  readonly items: readonly FacilityBookingTimelineItem[];
  readonly locale: string;
  readonly timezone: string;
}

export function BookingTimeline({ items, locale, timezone }: BookingTimelineProps) {
  const { colors } = useAppTheme();
  const context = { locale, timezone };
  return (
    <View style={styles.timeline}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.timelineRow}>
          <View style={styles.timelineMarkerColumn}>
            <View style={[
              styles.timelineMarker,
              borderColorStyle(item.completed ? colors.success : colors.border),
              backgroundColorStyle(item.completed ? colors.successSoft : colors.surface),
            ]} />
            {index < items.length - 1
              ? <View style={[styles.timelineLine, backgroundColorStyle(colors.border)]} />
              : null}
          </View>
          <View style={styles.timelineContent}>
            <SafeText variant="caption">{item.title}</SafeText>
            <SafeText variant="tiny" color="secondary">{item.description}</SafeText>
            <SafeText variant="tiny" color="muted">
              {formatFacilityShortDate(item.occurredAt, context)} · {formatFacilityTime(item.occurredAt, context)}
            </SafeText>
          </View>
        </View>
      ))}
    </View>
  );
}
