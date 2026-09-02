import { Pressable, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { AppText } from "../../../../shared/components/AppText";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createPressableBackgroundColorStyle, createViewBackgroundColorStyle } from "../styles/components/SecureAccessButton.styles";
interface SecureAccessButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}
export function SecureAccessButton({ title, onPress, loading = false, disabled = false, }: SecureAccessButtonProps) {
    const { colors } = useAppTheme();
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
    const buttonBgColor = disabled ? colors.primarySoft : colors.primary;
    const textColor = disabled ? colors.textDisabled : colors.textInverse;
    return (<Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled || loading} style={[styles.button, createPressableBackgroundColorStyle(buttonBgColor)]} accessibilityRole="button" accessibilityState={{ disabled: disabled || loading }}>
        <View style={styles.content}>
          {loading && <LoadingState compact/>}
          <AppText variant="body" style={[styles.label, createAppTextColorStyle(textColor)]}>
            {title}
          </AppText>
          {!loading && <View style={[styles.commandIcon, createViewBackgroundColorStyle(disabled ? colors.surfaceMuted : colors.primaryPressed)]}>
              <Ionicons name="arrow-forward" size={16} color={textColor}/>
            </View>}
        </View>
      </Pressable>
    </Animated.View>);
}
