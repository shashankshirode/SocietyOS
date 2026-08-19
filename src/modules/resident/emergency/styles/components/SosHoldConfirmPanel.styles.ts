import { StyleSheet, Animated } from "react-native";
export const styles = StyleSheet.create({
    container: {
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        gap: 16,
        width: '100%',
        maxWidth: 320,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    confirmRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        justifyContent: 'center',
    },
    confirmBtn: {
        minHeight: 44,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        minHeight: 44,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    holdButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
    },
    progressBarFill: {
        height: '100%',
    },
    cancelBtnText: {
        minHeight: 44,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    safeTextFontWeight: { fontWeight: '600' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700',
        marginTop: 8
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
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
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAnimatedViewBackgroundColorWidthStyle(backgroundColorValue: string, widthValue: Animated.AnimatedInterpolation<string | number>) {
    return {
        backgroundColor: backgroundColorValue,
        width: widthValue
    } as const;
}

