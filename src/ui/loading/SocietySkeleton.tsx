import React, { createContext, useContext, useEffect } from 'react';
import { AccessibilityInfo, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { Radius } from '../../shared/theme/radius';
import { motionTokens } from '../../shared/theme/motion';
import { societySkeletonTokens } from '../../shared/theme/societyTheme';

const ShimmerContext = createContext<SharedValue<number> | null>(null);

export function SocietyShimmerProvider({ children, animate = true }: { readonly children: React.ReactNode; readonly animate?: boolean }) {
  const shimmerValue = useSharedValue(0.4);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion || !animate) {
        shimmerValue.value = 0.5;
      } else {
        shimmerValue.value = withRepeat(
          withTiming(0.72, {
            duration: motionTokens.duration.shimmer,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        );
      }
    });

    return () => {
      cancelled = true;
      cancelAnimation(shimmerValue);
    };
  }, [animate, shimmerValue]);

  return <ShimmerContext.Provider value={shimmerValue}>{children}</ShimmerContext.Provider>;
}

export function useSocietyShimmerValue(): SharedValue<number> | null {
  return useContext(ShimmerContext);
}

export interface SocietySkeletonProps {
  readonly width?: DimensionValue;
  readonly height?: DimensionValue;
  readonly borderRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
  readonly animate?: boolean;
}

export function SocietySkeleton({
  width = '100%',
  height = 16,
  borderRadius = Radius.sm,
  style,
  testID,
  animate = true,
}: SocietySkeletonProps) {
  const { isDark } = useAppTheme();
  const contextValue = useSocietyShimmerValue();
  const localValue = useSharedValue(0.5);

  useEffect(() => {
    if (contextValue || !animate) return;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        localValue.value = 0.5;
      } else {
        localValue.value = withRepeat(
          withTiming(0.72, {
            duration: motionTokens.duration.shimmer,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        );
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

  return (
    <Animated.View
      testID={testID}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseBackgroundColor,
        },
        animate && contextValue !== null ? animatedStyle : null,
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export default SocietySkeleton;
