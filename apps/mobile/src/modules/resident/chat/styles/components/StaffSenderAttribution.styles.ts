import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({ container: { minWidth: 0, marginTop: 6 } });
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        flexShrink: 1
    } as const;
}

