import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppCard } from '../../../../shared/cards/AppCard';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useMessages } from '../../../../messages/useMessages';
import { FacilitySlotStatus } from '../models/facilityBooking.enums';
import type { FacilitySlot } from '../models/facilityBooking.models';
import {
  formatFacilityCurrency,
  formatFacilityTimeRange,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundColorStyle,
  borderColorStyle,
  facilityBookingStyles as styles,
  selectedBorderStyle,
} from '../styles/facilityBooking.styles';

interface FacilitySlotCardProps {
  readonly slot: FacilitySlot;
  readonly locale: string;
  readonly timezone: string;
  readonly currencyCode: string;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly onJoinWaitlist?: () => void;
}

export function FacilitySlotCard({
  slot,
  locale,
  timezone,
  currencyCode,
  selected,
  onSelect,
  onJoinWaitlist,
}: FacilitySlotCardProps) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const isSelectable = slot.status === FacilitySlotStatus.Available
    || slot.status === FacilitySlotStatus.Limited
    || slot.status === FacilitySlotStatus.Held && selected;
  const durationMinutes = Math.max(0, Math.round((Date.parse(slot.endsAt) - Date.parse(slot.startsAt)) / 60_000));
  const statusColor = isSelectable ? colors.success : colors.textMuted;
  return (
    <Pressable
      onPress={isSelectable ? onSelect : onJoinWaitlist}
      disabled={!isSelectable && !onJoinWaitlist}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: !isSelectable && !onJoinWaitlist }}
      accessibilityLabel={`${formatFacilityTimeRange(slot.startsAt, slot.endsAt, { locale, timezone })}, ${labels.slotStatus[slot.status]}`}
    >
      <AppCard
        variant="outlined"
        style={[
          styles.slotCard,
          selectedBorderStyle(selected ? colors.primary : colors.border, selected ? colors.primarySoft : colors.surface),
          !isSelectable && styles.opacityMuted,
        ]}
      >
        <View style={styles.rowBetween}>
          <View style={styles.grow}>
            <SafeText variant="bodyStrong">
              {formatFacilityTimeRange(slot.startsAt, slot.endsAt, { locale, timezone })}
            </SafeText>
            <SafeText variant="tiny" color="muted">
              {labels.details.minutes(durationMinutes)} · {labels.slots.remainingCapacity(slot.remainingCapacity)}
            </SafeText>
          </View>
          <View style={[
            styles.slotSelectIndicator,
            borderColorStyle(selected ? colors.primary : statusColor),
          ]}>
            {selected ? <View style={[styles.slotSelectInner, backgroundColorStyle(colors.primary)]} /> : null}
          </View>
        </View>
        <View style={styles.rowBetween}>
          <View style={styles.iconText}>
            <Ionicons name={isSelectable ? 'checkmark-circle-outline' : 'ban-outline'} size={16} color={statusColor} />
            <SafeText variant="tiny" color={isSelectable ? 'success' : 'muted'}>{labels.slotStatus[slot.status]}</SafeText>
          </View>
          <SafeText variant="caption">
            {slot.slotFeeInMinorUnits > 0
              ? formatFacilityCurrency(slot.slotFeeInMinorUnits, currencyCode, locale)
              : labels.free}
          </SafeText>
        </View>
      </AppCard>
    </Pressable>
  );
}
