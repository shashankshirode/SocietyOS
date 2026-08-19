import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createAnimatedPressableBackgroundColorBorderColorStyle } from "./styles/BackNavigationButton.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
interface BackNavigationButtonProps {
    onPress: () => void;
    lightContrast?: boolean;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function BackNavigationButton({ onPress, lightContrast = true }: BackNavigationButtonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
    const handlePressIn = () => {
        scale.value = withSpring(0.9, { damping: 10, stiffness: 200 });
    };
    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    };
    return (<AnimatedPressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[
            styles.circle,
            animatedStyle,
            createAnimatedPressableBackgroundColorBorderColorStyle(lightContrast ? 'rgba(255, 255, 255, 0.2)' : colors.backgroundSoft, lightContrast ? 'rgba(255, 255, 255, 0.1)' : colors.border),
        ]} accessibilityRole="button" accessibilityLabel={localizedUiText.m_6aadac2f2b7a} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name="chevron-back" size={22} color={lightContrast ? '#FFFFFF' : colors.textPrimary}/>
    </AnimatedPressable>);
}

