import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useReducedMotion } from '../../shared/motion/useReducedMotion';
import { motionTokens, MotionIntent } from '../../shared/theme/motion';

export interface FocusTransitionProps {
  readonly children: React.ReactNode;
  readonly intent?: MotionIntent;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function FocusTransition({
  children,
  intent = MotionIntent.FOCUS_ENTER,
  style,
  testID,
}: FocusTransitionProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <Animated.View testID={testID} style={[{ flex: 1 }, style]}>
        {children}
      </Animated.View>
    );
  }

  const duration =
    intent === MotionIntent.WORLD_TRANSITION
      ? motionTokens.duration.world
      : motionTokens.duration.focus;

  return (
    <Animated.View
      testID={testID}
      entering={FadeIn.duration(duration)}
      exiting={FadeOut.duration(duration)}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </Animated.View>
  );
}

export default FocusTransition;
