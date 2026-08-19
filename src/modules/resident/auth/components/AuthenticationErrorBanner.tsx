import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/components/AuthenticationErrorBanner.styles";
interface AuthenticationErrorBannerProps {
    message: string;
    visible: boolean;
}
export function AuthenticationErrorBanner({ message, visible, }: AuthenticationErrorBannerProps) {
    const { colors } = useAppTheme();
    const translateY = useSharedValue(-150);
    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 12 });
        }
        else {
            translateY.value = withSpring(-150);
        }
    }, [visible, translateY]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });
    return (<Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.banner, createViewBackgroundColorBorderColorStyle(colors.dangerSoft, colors.danger)]}>
        <Ionicons name="close-circle" size={18} color={colors.danger}/>
        <AppText variant="caption" style={createAppTextColorStyle(colors.danger)}>
          {message}
        </AppText>
      </View>
    </Animated.View>);
}

