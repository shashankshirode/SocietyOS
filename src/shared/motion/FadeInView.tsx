import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Motion } from '../theme/motion';
import { useReducedMotion } from './useReducedMotion';
import { includeWhenPresent } from "../utils/presentProperty";
type FadeInViewProps = {
    children: React.ReactNode;
    delay?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};
export function FadeInView({ children, delay = 0, style, testID }: FadeInViewProps) {
    const reducedMotion = useReducedMotion();
    return (<Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeIn.delay(delay).duration(Motion.duration.normal))} {...includeWhenPresent("style", style)} {...includeWhenPresent("testID", testID)}>
      {children}
    </Animated.View>);
}

