import { StyleSheet, Animated } from "react-native";
import type { Absent } from "../../../../../shared/types/absence.types";
export const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transparentModalContent: {
        backgroundColor: 'transparent',
    },
    centerOverlay: {
        zIndex: 1001,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    floatingDock: {
        position: 'absolute',
        width: '90%',
        maxWidth: 340,
        borderRadius: 20,
        borderWidth: 1,
        padding: 16,
        zIndex: 1000,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    compactTray: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        padding: 20,
        paddingBottom: 34,
        zIndex: 1000,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 12,
    },
    dragHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E4E7EC',
        alignSelf: 'center',
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    titleArea: {
        flex: 1,
        paddingRight: 8,
    },
    title: {
        fontWeight: '800',
        fontSize: 16,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 10,
        lineHeight: 14,
    },
    closeIcon: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridContainer: {
        gap: 10,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 10,
    },
    dialogCard: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 20,
        borderWidth: 1,
        padding: 24,
        alignItems: 'center',
        gap: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    dialogTitle: {
        fontWeight: '800',
        fontSize: 18,
        textAlign: 'center',
    },
    dialogBtn: {
        width: '100%',
        marginTop: 8,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        justifyContent: 'center',
        marginTop: 8,
    },
    retryBtn: {
        minHeight: 44,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    cancelBtn: {
        minHeight: 44,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle3(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle8(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue,
        borderWidth: 1
    } as const;
}
export function createSafeTextColorStyle9(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle10(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAnimatedViewBottomRightAlignSelfStyle(bottomValue: number, rightValue: number | Absent, alignSelfValue: "auto" | "center") {
    return {
        bottom: bottomValue,
        right: rightValue,
        alignSelf: alignSelfValue
    } as const;
}
export function createAnimatedViewBackgroundColorBorderColorOpacityTransformStyle(backgroundColorValue: string, borderColorValue: string, opacityValue: Animated.AnimatedInterpolation<string | number>, transformValue: {
    translateY: Animated.AnimatedInterpolation<string | number>;
}[]) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        opacity: opacityValue,
        transform: transformValue
    } as const;
}
export function createAnimatedViewTranslateYStyle(translateYValue: Animated.AnimatedInterpolation<string | number>) {
    return {
        translateY: translateYValue
    } as const;
}

