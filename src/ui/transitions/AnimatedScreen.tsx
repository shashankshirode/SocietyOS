import React from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useReducedMotion } from "../../shared/motion/useReducedMotion";
import { MotionIntent } from "../../shared/theme/motion";
import { resolveMotionIntentSpec, useExperienceRuntime } from '../../core/experience';
import { styles } from "./styles/AnimatedScreen.styles";

export interface AnimatedScreenProps {
    readonly children: React.ReactNode;
    readonly intent?: MotionIntent;
    readonly testID?: string;
}

export function AnimatedScreen({
    children,
    intent = MotionIntent.WORLD_TRANSITION,
    testID = "animated-screen-view",
}: AnimatedScreenProps) {
    const reducedMotion = useReducedMotion();
    const { profile } = useExperienceRuntime();
    if (reducedMotion) {
        return <Animated.View testID={testID} style={styles.animatedViewFlex}>{children}</Animated.View>;
    }

    const duration = resolveMotionIntentSpec(intent, profile).durationMs;

    return (
        <Animated.View
            entering={FadeIn.duration(duration)}
            exiting={FadeOut.duration(duration)}
            style={styles.animatedViewFlex2}
            testID={testID}
        >
            {children}
        </Animated.View>
    );
}

export default AnimatedScreen;


