import React, { createContext, useContext, useEffect } from "react";
import { AccessibilityInfo } from "react-native";
import type { DimensionValue, ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation, Easing, SharedValue } from "react-native-reanimated";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { Radius } from "../../shared/theme/radius";
import { createAnimatedViewWidthHeightBorderRadiusBackgroundColorStyle } from "./styles/ShimmerBlock.styles";
const ShimmerContext = createContext<SharedValue<number> | null>(null);
export function ShimmerProvider({ children }: {
    children: React.ReactNode;
}) {
    const shimmerValue = useSharedValue(0.3);
    useEffect(() => {
        let cancelled = false;
        AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
            if (cancelled)
                return;
            if (reduceMotion) {
                shimmerValue.value = 0.5;
            }
            else {
                shimmerValue.value = withRepeat(withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
            }
        });
        return () => {
            cancelled = true;
            cancelAnimation(shimmerValue);
        };
    }, [shimmerValue]);
    return (<ShimmerContext.Provider value={shimmerValue}>
      {children}
    </ShimmerContext.Provider>);
}
export function useShimmerValue() {
    return useContext(ShimmerContext);
}
interface ShimmerBlockProps {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}
export function ShimmerBlock({ width = '100%', height = 16, borderRadius = Radius.sm, style, }: ShimmerBlockProps) {
    const { colors } = useAppTheme();
    const contextValue = useShimmerValue();
    const localValue = useSharedValue(0.3);
    useEffect(() => {
        if (contextValue)
            return;
        let cancelled = false;
        AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
            if (cancelled)
                return;
            if (reduceMotion) {
                localValue.value = 0.5;
            }
            else {
                localValue.value = withRepeat(withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
            }
        });
        return () => {
            cancelled = true;
            cancelAnimation(localValue);
        };
    }, [contextValue, localValue]);
    const opacityValue = contextValue ?? localValue;
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacityValue.value,
    }));
    return (<Animated.View style={[
            createAnimatedViewWidthHeightBorderRadiusBackgroundColorStyle(width, height, borderRadius, colors.surfaceMuted),
            animatedStyle,
            style,
        ]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"/>);
}
export default ShimmerBlock;

