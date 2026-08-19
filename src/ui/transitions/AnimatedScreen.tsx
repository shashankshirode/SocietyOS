import React from "react";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useReducedMotion } from "../../shared/motion/useReducedMotion";
import { motionDurations } from "../../core/animation/motionTokens";
import { styles } from "./styles/AnimatedScreen.styles";
export interface AnimatedScreenProps {
    children: React.ReactNode;
}
export function AnimatedScreen({ children }: AnimatedScreenProps) {
    const reducedMotion = useReducedMotion();
    if (reducedMotion) {
        return <Animated.View style={styles.animatedViewFlex}>{children}</Animated.View>;
    }
    return (<Animated.View entering={FadeInRight.duration(motionDurations.standard)} exiting={FadeOutLeft.duration(motionDurations.standard)} style={styles.animatedViewFlex2} testID="animated-screen-view">
      {children}
    </Animated.View>);
}
export default AnimatedScreen;

