import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { alignItems: 'center', marginVertical: 8 },
    pill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
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

