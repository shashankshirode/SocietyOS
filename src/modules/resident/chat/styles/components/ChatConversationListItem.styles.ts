import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { minHeight: 82, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth },
    avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, marginLeft: 12 },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    nameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
    bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
    badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        flexShrink: 1
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorFontWeightStyle(colorValue: string, fontWeightValue: "400" | "700") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue,
        flex: 1
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 3
    } as const;
}
export function createPressableBackgroundColorBorderBottomColorStyle(backgroundColorValue: string, borderBottomColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderBottomColor: borderBottomColorValue
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

