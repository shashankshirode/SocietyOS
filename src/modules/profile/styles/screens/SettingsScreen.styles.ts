import { StyleSheet } from "react-native";
import { Layout } from "../../../../shared/theme/layout";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: {
        paddingTop: 16,
        paddingHorizontal: 20,
    },
    responsiveContainer: {
        width: '100%',
        maxWidth: Layout.maxTabletContentWidth,
        alignSelf: 'center',
    },
    logoutBtn: {
        margin: 16,
        height: 48,
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createPressableBackgroundColorBorderColorOpacityStyle(backgroundColorValue: string, borderColorValue: string, opacityValue: 1 | 0.7) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        opacity: opacityValue
    } as const;
}

