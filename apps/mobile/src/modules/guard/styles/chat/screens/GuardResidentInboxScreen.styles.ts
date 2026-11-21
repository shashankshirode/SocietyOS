import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({ root: { flex: 1 } });
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

