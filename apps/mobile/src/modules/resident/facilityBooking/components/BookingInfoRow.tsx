import { View } from 'react-native';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import {
  backgroundColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';

interface BookingInfoRowProps {
  readonly label: string;
  readonly value: string;
  readonly isLast?: boolean;
}

export function BookingInfoRow({ label, value, isLast = false }: BookingInfoRowProps) {
  const { colors } = useAppTheme();
  return (
    <>
      <View style={styles.infoRow}>
        <SafeText variant="caption" color="muted" style={styles.infoLabel}>{label}</SafeText>
        <SafeText variant="caption" align="right" style={styles.infoValue}>{value}</SafeText>
      </View>
      {!isLast ? <View style={[styles.mutedDivider, backgroundColorStyle(colors.divider)]} /> : null}
    </>
  );
}
