import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { padding: 20, gap: 20, paddingBottom: 24 },
    disclaimer: { paddingHorizontal: 12 },
});
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

