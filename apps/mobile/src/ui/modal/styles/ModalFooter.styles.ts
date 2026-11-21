import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        gap: Spacing.md
    },
    button: {
        flex: 1
    }
});
