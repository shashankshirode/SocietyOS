import { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { authAssets } from "../data/authAssets";
import { SocietyOSBrandLockup } from "./SocietyOSBrandLockup";
import { ResidenceActivityPreviewRail } from "./ResidenceActivityPreviewRail";
import { styles } from "../styles/components/ResidenceVisualPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface ResidenceVisualPanelProps {
    isKeyboardActive?: boolean;
    isPhoneValid?: boolean;
}
export function ResidenceVisualPanel({ isKeyboardActive = false, isPhoneValid = false, }: ResidenceVisualPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const scale = useSharedValue(1.03);
    const opacity = useSharedValue(1);
    useEffect(() => {
        scale.value = withTiming(1.00, { duration: 900, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    }, [scale]);
    useEffect(() => {
        opacity.value = withTiming(isKeyboardActive ? 0 : 1, { duration: 200 });
    }, [isKeyboardActive, opacity]);
    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
    const animatedTagsStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });
    return (<View style={styles.container}>
      
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedImageStyle]}>
        <Image source={{ uri: authAssets.lobby.uri }} style={styles.image} accessibilityLabel={authAssets.lobby.accessibilityLabel}/>
      </Animated.View>

      
      <View style={[styles.gradientOverlay, styles.topLeftGradient]}/>

      
      <View style={[styles.gradientOverlay, styles.rightIndigoMesh]}/>

      
      <View style={styles.ambientGlow}/>

      
      <View style={[styles.gradientOverlay, styles.bottomSoftFade]}/>

      
      <View style={styles.brandOverlay}>
        <SocietyOSBrandLockup variant="hero" showTagline={true} animated={true} accessibilityLabel={localizedUiText.m_3a9ae27980fe} isPhoneValid={isPhoneValid}/>
      </View>

      
      <Animated.View style={[styles.railOverlay, animatedTagsStyle]}>
        <ResidenceActivityPreviewRail />
      </Animated.View>
    </View>);
}

