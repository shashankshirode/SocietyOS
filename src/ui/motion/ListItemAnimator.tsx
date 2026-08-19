import React from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useReducedMotion } from '../../shared/motion/useReducedMotion';
import { includeWhenPresent } from '../../shared/utils/presentProperty';
import { motionTokens } from '../../shared/theme/motion';

interface ListItemAnimatorProps {
  children: React.ReactNode;
  index: number;
  maxStagger?: number;
  style?: object;
}

export function ListItemAnimator({
  children,
  index,
  maxStagger = 8,
  style,
}: ListItemAnimatorProps) {
  const reducedMotion = useReducedMotion();
  const clampedIndex = Math.min(index, maxStagger);
  const delay = clampedIndex * motionTokens.stagger.tight;

  return (
    <Animated.View
      {...includeWhenPresent(
        'entering',
        reducedMotion
          ? undefined
          : FadeInUp.delay(delay)
              .duration(motionTokens.duration.entrance)
              .springify()
              .damping(motionTokens.spring.entrance.damping)
              .stiffness(motionTokens.spring.entrance.stiffness)
      )}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
