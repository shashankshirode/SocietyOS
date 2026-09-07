import React, { createContext, useContext, useEffect } from 'react';
import { AccessibilityInfo, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation, Easing, type SharedValue, } from 'react-native-reanimated';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { Radius } from '../../shared/theme/radius';
import { motionTokens } from '../../shared/theme/motion';
import { societySkeletonTokens } from '../../shared/theme/societyTheme';
import type { Absent } from "../../shared/types/absence.types";
const ShimmerContext = createContext<SharedValue<number> | null>(null);
export function SkeletonProvider({ children, animate = true }: {
    readonly children: React.ReactNode;
    readonly animate?: boolean;
}) {
    const shimmerValue = useSharedValue(0.4);
    useEffect(() => {
        let cancelled = false;
        AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
            if (cancelled)
                return;
            if (reduceMotion || !animate) {
                shimmerValue.value = 0.5;
            }
            else {
                shimmerValue.value = withRepeat(withTiming(0.72, {
                    duration: motionTokens.duration.shimmer,
                    easing: Easing.inOut(Easing.ease),
                }), -1, true);
            }
        });
        return () => {
            cancelled = true;
            cancelAnimation(shimmerValue);
        };
    }, [animate, shimmerValue]);
    return <ShimmerContext.Provider value={shimmerValue}>{children}</ShimmerContext.Provider>;
}
export function useSkeletonShimmerValue(): SharedValue<number> | null {
    return useContext(ShimmerContext);
}
export interface SkeletonProps {
    readonly width?: DimensionValue | Absent;
    readonly height?: DimensionValue | Absent;
    readonly borderRadius?: number | Absent;
    readonly style?: StyleProp<ViewStyle> | Absent;
    readonly testID?: string | Absent;
    readonly animate?: boolean | Absent;
}
export function Skeleton({ width = '100%', height = 16, borderRadius = Radius.sm, style, testID, animate = true, }: SkeletonProps) {
    const { isDark } = useAppTheme();
    const contextValue = useSkeletonShimmerValue();
    const localValue = useSharedValue(0.5);
    useEffect(() => {
        if (contextValue || !animate)
            return;
        let cancelled = false;
        AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
            if (cancelled)
                return;
            if (reduceMotion) {
                localValue.value = 0.5;
            }
            else {
                localValue.value = withRepeat(withTiming(0.72, {
                    duration: motionTokens.duration.shimmer,
                    easing: Easing.inOut(Easing.ease),
                }), -1, true);
            }
        });
        return () => {
            cancelled = true;
            cancelAnimation(localValue);
        };
    }, [animate, contextValue, localValue]);
    const opacityValue = contextValue ?? localValue;
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacityValue.value,
    }));
    const tokenScheme = isDark ? societySkeletonTokens.dark : societySkeletonTokens.light;
    const baseBackgroundColor = tokenScheme.surface;
    return (<Animated.View testID={testID} style={[
            {
                width,
                height,
                borderRadius,
                backgroundColor: baseBackgroundColor,
            },
            animate && contextValue !== null ? animatedStyle : null,
            style,
        ]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"/>);
}
export default Skeleton;

