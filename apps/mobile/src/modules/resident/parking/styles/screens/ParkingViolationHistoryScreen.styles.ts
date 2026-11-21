import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: 20, gap: 12, paddingBottom: 40, flexGrow: 1 },
    card: { padding: 16, borderWidth: 1, borderRadius: 16, gap: 10 },
    headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    heading: { flex: 1, gap: 3 },
    divider: { height: 1 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

