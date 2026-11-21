import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { Motion } from '../../shared/theme/motion';
import { useReducedMotion } from '../../shared/motion/useReducedMotion';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
type SlideInProps = {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    delay?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};
export function SlideIn({ children, direction = 'left', delay = 0, style, testID }: SlideInProps) {
    const reducedMotion = useReducedMotion();
    const entering = direction === 'left'
        ? SlideInLeft.delay(delay).duration(Motion.duration.normal).springify()
        : SlideInRight.delay(delay).duration(Motion.duration.normal).springify();
    return (<Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : entering)} {...includeWhenPresent("style", style)} {...includeWhenPresent("testID", testID)}>
      {children}
    </Animated.View>);
}

