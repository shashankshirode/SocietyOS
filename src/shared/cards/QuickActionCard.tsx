import { Pressable, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useAppTheme } from "../theme/useAppTheme";
import { AppIconName } from "../icons/icon.types";
import { AppIconBubble } from "../icons/AppIconBubble";
import { SafeText } from "../components/SafeText";
import { styles, createViewBackgroundColorBorderColorStyle, createAnimatedPressableBorderRadiusBackgroundColorBorderColorSpread4Style } from "./styles/QuickActionCard.styles";
export interface QuickActionCardProps {
    title: string;
    subtitle?: string;
    iconName: AppIconName;
    onPress: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning' | 'info';
    badge?: string | number;
    disabled?: boolean;
    style?: ViewStyle;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function QuickActionCard({ title, subtitle, iconName, onPress, variant = 'default', badge, disabled = false, style, }: QuickActionCardProps) {
    const { colors, radius, shadows } = useAppTheme();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    function handlePressIn() {
        if (!disabled) {
            scale.value = withSpring(0.95, { damping: 15, stiffness: 350 });
        }
    }
    function handlePressOut() {
        scale.value = withSpring(1, { damping: 15, stiffness: 350 });
    }
    const toneMap = {
        default: [colors.primary, colors.primarySoft],
        danger: [colors.danger, colors.dangerSoft],
        success: [colors.success, colors.successSoft],
        warning: [colors.warning, colors.warningSoft],
        info: [colors.info, colors.infoSoft],
    } as const;
    const [finalColor, finalBgColor] = toneMap[variant];
    return (<AnimatedPressable onPress={disabled ? undefined : onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled} style={[
            animatedStyle,
            styles.card,
            createAnimatedPressableBorderRadiusBackgroundColorBorderColorSpread4Style(radius.card, colors.surface, colors.border, shadows.card),
            disabled && styles.disabled,
            style,
        ]} accessibilityRole="button" accessibilityLabel={`${title} ${subtitle || ''}`} accessibilityState={{ disabled }}>
      <View style={styles.content}>
        <AppIconBubble name={iconName} size={44} iconSize={20} color={finalColor} backgroundColor={finalBgColor}/>
        
        {badge !== undefined ? (<View style={[styles.badge, createViewBackgroundColorBorderColorStyle(colors.dangerSoft, colors.danger)]}>
            <SafeText variant="tiny" color="danger" align="center">{badge}</SafeText>
          </View>) : null}

        <View style={styles.textWrapper}>
          <SafeText variant="bodyStrong" color="primary" style={styles.title} numberOfLines={2}>
            {title}
          </SafeText>
          {subtitle ? (<SafeText variant="caption" color="secondary" style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </SafeText>) : null}
        </View>
      </View>
    </AnimatedPressable>);
}
export default QuickActionCard;

