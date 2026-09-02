import { StyleSheet } from "react-native";
import { Radius, Shadows, Spacing } from "../../../../../shared/theme";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    tabContainer: { paddingVertical: 12 },
    tabChip: { minHeight: 34, paddingHorizontal: 12, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    loading: { paddingTop: 8 },
    scrollContent: { paddingBottom: 80 },
    list: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    cardWrapper: { width: '100%' },
    tabletCardWrapper: { width: '48.8%' },
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 16, gap: 12 },
    slaRibbon: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    catIconWrap: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    headerInfo: { flex: 1, gap: 3 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 10, marginTop: 4 },
    fabContainer: { position: 'absolute', right: Spacing.xl },
    fab: { minWidth: 168, height: 56, borderRadius: Radius.pill, flexDirection: 'row', gap: 8, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', ...Shadows.floating },
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
        color: colorValue
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue
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
