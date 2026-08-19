import { Pressable, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { AppText } from "../../../../shared/components/AppText";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createPressableBackgroundColorStyle } from "../styles/components/SecureAccessButton.styles";
interface SecureAccessButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}
export function SecureAccessButton({ title, onPress, loading = false, disabled = false, }: SecureAccessButtonProps) {
    const { dark } = useAppTheme();
    const scale = useSharedValue(1);
    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 10, stiffness: 200 });
    };
    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    };
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
    const activeColor = '#4F46E5';
    const disabledColor = dark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.06)';
    const buttonBgColor = disabled ? disabledColor : activeColor;
    const textColor = disabled
        ? (dark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(15, 23, 42, 0.35)')
        : '#ffffff';
    return (<Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled || loading} style={[styles.button, createPressableBackgroundColorStyle(buttonBgColor)]} accessibilityRole="button" accessibilityState={{ disabled: disabled || loading }}>
        <View style={styles.content}>
          {loading && <LoadingState compact/>}
          <AppText variant="body" style={createAppTextColorStyle(textColor)}>
            {title}
          </AppText>
          {!loading && <Ionicons name="arrow-forward" size={16} color={textColor}/>}
        </View>
      </Pressable>
    </Animated.View>);
}

