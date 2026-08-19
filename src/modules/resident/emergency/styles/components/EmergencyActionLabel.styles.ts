import { StyleSheet, Animated } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginRight: 8,
    },
    text: {
        fontWeight: '700',
        fontSize: 10,
        letterSpacing: 0.5,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAnimatedViewOpacityTransformBackgroundColorBorderColorStyle(opacityValue: Animated.AnimatedInterpolation<number>, transformValue: {
    scale: Animated.AnimatedInterpolation<number>;
}[], backgroundColorValue: string, borderColorValue: string) {
    return {
        opacity: opacityValue,
        transform: transformValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createAnimatedViewScaleStyle(scaleValue: Animated.AnimatedInterpolation<number>) {
    return {
        scale: scaleValue
    } as const;
}

