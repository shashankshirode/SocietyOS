import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxl,
        gap: Spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.md,
    },
    text: {
        flex: 1,
        gap: 2,
    },
});
