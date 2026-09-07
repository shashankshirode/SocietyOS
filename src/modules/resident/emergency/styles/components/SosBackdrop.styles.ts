import { StyleSheet, Animated } from "react-native";
export const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFill,
    },
    backdropPressable: {
        ...StyleSheet.absoluteFill,
    },
});
export function createAnimatedViewOpacityStyle(opacityValue: Animated.AnimatedInterpolation<string | number>) {
    return {
        backgroundColor: '#000000',
        opacity: opacityValue
    } as const;
}

