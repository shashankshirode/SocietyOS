import { StyleSheet } from "react-native";
import { Radius, Shadows, Spacing } from "../../../../../shared/theme";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    unavailableContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 8,
    },
    tabContainer: {
        paddingTop: 18,
        paddingBottom: 14,
    },
    tabScroll: {
        paddingHorizontal: 20,
        gap: 10,
        flexGrow: 1,
    },
    tabChip: {
        flex: 1,
        minWidth: 112,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
    },
    scrollContent: {
        paddingBottom: 132,
    },
    arrivalHero: {
        marginBottom: 22,
        padding: 22,
        borderRadius: 24,
        gap: 8,
    },
    fabContainer: {
        position: 'absolute',
        right: Spacing.xl,
    },
    fab: {
        minWidth: 164,
        height: 56,
        borderRadius: Radius.pill,
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floating,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 16
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        textAlign: 'center',
        marginTop: 8
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBottomStyle(bottomValue: number) {
    return {
        bottom: bottomValue
    } as const;
}
export function createPressableScaleBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollPaddingBottomStyle(paddingBottomValue: number) {
    return { paddingBottom: paddingBottomValue } as const;
}
