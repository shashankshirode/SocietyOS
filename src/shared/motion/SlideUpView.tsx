import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Motion } from '../theme/motion';
import { useReducedMotion } from './useReducedMotion';
import { includeWhenPresent } from "../utils/presentProperty";
type SlideUpViewProps = {
    children: React.ReactNode;
    delay?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};
export function SlideUpView({ children, delay = 0, style, testID }: SlideUpViewProps) {
    const reducedMotion = useReducedMotion();
    return (<Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInUp.delay(delay).duration(Motion.duration.normal).springify())} {...includeWhenPresent("style", style)} {...includeWhenPresent("testID", testID)}>
      {children}
    </Animated.View>);
}

