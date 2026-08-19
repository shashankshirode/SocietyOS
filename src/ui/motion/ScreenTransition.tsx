import React from 'react';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useReducedMotion } from '../../shared/motion/useReducedMotion';
import { includeWhenPresent } from '../../shared/utils/presentProperty';

interface ScreenTransitionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: object;
}

export function ScreenTransition({
  children,
  delay = 0,
  duration = 300,
  style,
}: ScreenTransitionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      {...includeWhenPresent(
        'entering',
        reducedMotion
          ? undefined
          : FadeInUp.delay(delay).duration(duration).springify().damping(18).stiffness(200)
      )}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function FadeTransition({
  children,
  delay = 0,
  duration = 250,
  style,
}: ScreenTransitionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      {...includeWhenPresent(
        'entering',
        reducedMotion ? undefined : FadeIn.delay(delay).duration(duration)
      )}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
