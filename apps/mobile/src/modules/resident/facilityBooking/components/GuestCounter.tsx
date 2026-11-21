import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';

interface GuestCounterProps {
  readonly value: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly decrementLabel: string;
  readonly incrementLabel: string;
  readonly onChange: (value: number) => void;
}

export function GuestCounter({
  value,
  minimum,
  maximum,
  decrementLabel,
  incrementLabel,
  onChange,
}: GuestCounterProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.guestCounter, backgroundBorderStyle(colors.inputBackground, colors.inputBorder)]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={decrementLabel}
        accessibilityState={{ disabled: value <= minimum }}
        disabled={value <= minimum}
        onPress={() => onChange(Math.max(minimum, value - 1))}
        style={styles.counterButton}
      >
        <Ionicons name="remove" size={22} color={value <= minimum ? colors.disabled : colors.primary} />
      </Pressable>
      <View style={styles.counterValue}>
        <SafeText variant="title">{value}</SafeText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={incrementLabel}
        accessibilityState={{ disabled: value >= maximum }}
        disabled={value >= maximum}
        onPress={() => onChange(Math.min(maximum, value + 1))}
        style={styles.counterButton}
      >
        <Ionicons name="add" size={22} color={value >= maximum ? colors.disabled : colors.primary} />
      </Pressable>
    </View>
  );
}
