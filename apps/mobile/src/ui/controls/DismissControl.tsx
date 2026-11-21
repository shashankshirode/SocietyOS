import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { societyDismissTokens } from '../../shared/theme/societyTheme';
import { createControlStyle, styles } from './styles/DismissControl.styles';

export type DismissControlVariant = 'default' | 'inverse' | 'critical';

export type DismissControlProps = {
  onPress: () => void;
  accessibilityLabel: string;
  variant?: DismissControlVariant;
  testID?: string;
};

export function DismissControl({ onPress, accessibilityLabel, variant = 'default', testID }: DismissControlProps) {
  const theme = useAppTheme();
  const tokens = societyDismissTokens[theme.dark ? 'dark' : 'light'];
  const backgroundColor = variant === 'critical'
    ? tokens.criticalBackground
    : variant === 'inverse'
      ? tokens.inverseBackground
      : tokens.defaultBackground;
  const foregroundColor = variant === 'critical'
    ? tokens.criticalForeground
    : variant === 'inverse'
      ? tokens.inverseForeground
      : tokens.defaultForeground;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} hitSlop={4} testID={testID}>
      {({ pressed }) => (
        <View style={[styles.control, createControlStyle(backgroundColor, pressed ? 0.82 : 1)]}>
          <Ionicons name="close" size={22} color={foregroundColor} />
        </View>
      )}
    </Pressable>
  );
}
