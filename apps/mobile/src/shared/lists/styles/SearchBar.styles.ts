import { StyleSheet } from "react-native";
import { Colors } from "../../theme";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        borderRadius: Radius.input,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
    },
    input: {
        ...Typography.body,
        color: Colors.textPrimary,
        flex: 1,
        paddingVertical: 0,
    },
});
