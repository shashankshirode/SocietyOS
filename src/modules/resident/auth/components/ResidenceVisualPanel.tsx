import { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SocietyOSBrandLockup } from "./SocietyOSBrandLockup";
import { styles } from "../styles/components/ResidenceVisualPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { AppText } from "../../../../shared/components/AppText";
import { residentColors } from "../../../../shared/theme/residentColors";
import { authMessages } from "../messages/auth.messages";
interface ResidenceVisualPanelProps {
    isKeyboardActive?: boolean;
    isPhoneValid?: boolean;
}
export function ResidenceVisualPanel({ isKeyboardActive = false, isPhoneValid = false, }: ResidenceVisualPanelProps) {
    const insets = useSafeAreaInsets();
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const scale = useSharedValue(1.03);
    const detailOpacity = useSharedValue(1);
    const safeTop = Math.max(insets.top, 20) + 12;
    useEffect(() => {
        scale.value = withTiming(1.00, {
            duration: 240,
            ...(typeof Easing?.bezier === 'function' ? { easing: Easing.bezier(0.25, 0.1, 0.25, 1) } : {}),
        });
    }, [scale]);
    useEffect(() => {
        detailOpacity.value = withTiming(isKeyboardActive ? 0 : 1, { duration: 180 });
    }, [detailOpacity, isKeyboardActive]);
    const animatedOrbitStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
    const animatedDetailsStyle = useAnimatedStyle(() => {
        return {
            opacity: detailOpacity.value,
        };
    });
    return (<View style={styles.container}>
      <View style={[styles.brandOverlay, { top: safeTop }]}>
        <SocietyOSBrandLockup variant="hero" showTagline={true} animated={true} accessibilityLabel={localizedUiText.m_3a9ae27980fe} isPhoneValid={isPhoneValid}/>
      </View>

      <Animated.View
        style={[styles.orbitField, { top: safeTop + 50 }, animatedOrbitStyle, animatedDetailsStyle]}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <View style={[styles.orbit, styles.orbitOuter]}/>
        <View style={[styles.orbit, styles.orbitMiddle]}/>
        <View style={[styles.orbit, styles.orbitInner]}/>
        <View style={styles.homeNode}>
          <Ionicons name="home-outline" size={22} color={residentColors.brandInk}/>
        </View>
        <View style={[styles.signalNode, styles.signalNodeTop]}/>
        <View style={[styles.signalNode, styles.signalNodeRight]}/>
        <View style={[styles.signalNode, styles.signalNodeBottom]}/>
      </Animated.View>

      <Animated.View style={[styles.contextLine, animatedDetailsStyle]}>
        <AppText variant="caption" style={styles.contextEyebrow}>{authMessages.contextEyebrow}</AppText>
        <AppText variant="bodySmall" style={styles.contextCopy}>
          {authMessages.contextDescription}
        </AppText>
      </Animated.View>
    </View>);
}
