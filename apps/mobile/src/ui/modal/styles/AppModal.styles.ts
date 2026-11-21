import { StyleSheet, Animated } from "react-native";
import { modalTokens } from "../modalTokens";
import type { Absent } from "../../../shared/types/absence.types";
export const styles = StyleSheet.create({
    flex: { flex: 1 },
    overlay: {
        flex: 1,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    bottomSheet: {
        justifyContent: 'flex-end',
    },
    content: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 16,
    },
    fullScreenContent: {
        flex: 1,
        width: '100%',
        maxWidth: '100%',
        borderRadius: 0,
        paddingBottom: 0,
    },
    dragHandleRow: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 4,
    },
    dragHandle: {
        width: modalTokens.dragHandleWidth,
        height: modalTokens.dragHandleHeight,
        borderRadius: 2,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAnimatedViewBackgroundColorOpacityStyle(backgroundColorValue: string, opacityValue: Animated.Value) {
    return {
        backgroundColor: backgroundColorValue,
        opacity: opacityValue
    } as const;
}
export function createAnimatedViewBackgroundColorBorderRadiusBorderTopLeftRadiusBorderStyle(backgroundColorValue: string, borderRadiusValue: 24 | Absent, borderTopLeftRadiusValue: 24, borderTopRightRadiusValue: 24, borderBottomLeftRadiusValue: 0 | 24, borderBottomRightRadiusValue: 0 | 24, paddingBottomValue: number, maxWidthValue: 480 | Absent, widthValue: "100%" | "90%", opacityValue: Animated.Value, transformValue: ({
    translateY: Animated.AnimatedInterpolation<string | number>;
} | {
    scale: Animated.AnimatedInterpolation<string | number>;
})[]) {
    return {
        backgroundColor: backgroundColorValue,
        borderRadius: borderRadiusValue,
        borderTopLeftRadius: borderTopLeftRadiusValue,
        borderTopRightRadius: borderTopRightRadiusValue,
        borderBottomLeftRadius: borderBottomLeftRadiusValue,
        borderBottomRightRadius: borderBottomRightRadiusValue,
        paddingBottom: paddingBottomValue,
        maxWidth: maxWidthValue,
        width: widthValue,
        opacity: opacityValue,
        transform: transformValue
    } as const;
}
export function createAnimatedViewTranslateYStyle(translateYValue: Animated.AnimatedInterpolation<string | number>) {
    return {
        translateY: translateYValue
    } as const;
}
export function createAnimatedViewScaleStyle(scaleValue: Animated.AnimatedInterpolation<string | number>) {
    return {
        scale: scaleValue
    } as const;
}

