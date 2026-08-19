import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingBottom: Spacing['3xl'] },
    content: { gap: Spacing.lg },
});
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

