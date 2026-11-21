import { Pressable, StyleProp, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../theme/useAppTheme";
import { styles } from "./styles/AppIconButton.styles";
type AppIconButtonVariant = 'ghost' | 'surface' | 'primary' | 'danger';
type AppIconButtonProps = {
    iconName: keyof typeof Ionicons.glyphMap;
    accessibilityLabel: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: AppIconButtonVariant;
    size?: number;
    style?: StyleProp<ViewStyle>;
};
export function AppIconButton({ iconName, accessibilityLabel, onPress, disabled = false, variant = 'surface', size = 22, style, }: AppIconButtonProps) {
    const { colors } = useAppTheme();
    const variantStyles: Record<AppIconButtonVariant, ViewStyle> = {
        ghost: {
            backgroundColor: 'transparent',
        },
        surface: {
            backgroundColor: colors.backgroundSoft,
            borderWidth: 1,
            borderColor: colors.border,
        },
        primary: {
            backgroundColor: colors.primary,
        },
        danger: {
            backgroundColor: colors.dangerSoft,
        },
    };
    const iconColors: Record<AppIconButtonVariant, string> = {
        ghost: colors.textPrimary,
        surface: colors.textPrimary,
        primary: colors.primaryText,
        danger: colors.danger,
    };
    return (<Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityState={{ disabled }} style={({ pressed }) => [
            styles.base,
            variantStyles[variant],
            pressed && !disabled && styles.pressed,
            disabled && styles.disabled,
            style,
        ]} hitSlop={8}>
      <Ionicons name={iconName} size={size} color={iconColors[variant]}/>
    </Pressable>);
}
export default AppIconButton;

