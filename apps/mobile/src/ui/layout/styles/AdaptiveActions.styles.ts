import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    stacked: {
        flexDirection: 'column',
        gap: Spacing.sm,
    },
});
