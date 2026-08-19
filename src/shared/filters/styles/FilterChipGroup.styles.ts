import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    wrapContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md
    },
    scrollContainer: {
        flexGrow: 0,
        marginBottom: Spacing.md
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm
    }
});
