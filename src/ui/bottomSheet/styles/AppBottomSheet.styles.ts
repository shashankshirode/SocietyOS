import { StyleSheet, Animated } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: '100%',
        maxHeight: '90%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    tabletSheet: {
        maxWidth: 760,
        alignSelf: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        bottom: 40,
    },
    gestureZone: {
        width: '100%',
        alignItems: 'center',
    },
});
export function createAnimatedViewBackgroundColorOpacityStyle(backgroundColorValue: string, opacityValue: Animated.Value) {
    return {
        backgroundColor: backgroundColorValue,
        opacity: opacityValue
    } as const;
}
export function createAnimatedViewBackgroundColorTransformPaddingBottomStyle(backgroundColorValue: string, transformValue: {
    translateY: Animated.Value;
}[], paddingBottomValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        transform: transformValue,
        paddingBottom: paddingBottomValue
    } as const;
}
export function createAnimatedViewTranslateYStyle(translateYValue: Animated.Value) {
    return {
        translateY: translateYValue
    } as const;
}

