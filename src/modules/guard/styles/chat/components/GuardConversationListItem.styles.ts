import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({ row: { flexDirection: 'row', minHeight: 76, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, alignItems: 'center' }, avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, content: { flex: 1, marginLeft: 12, gap: 4 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 } });
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

