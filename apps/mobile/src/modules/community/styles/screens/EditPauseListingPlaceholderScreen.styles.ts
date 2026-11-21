import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        ...Typography.body,
        color: Colors.neutral
    },
    scrollContent: {
        padding: Spacing.md,
        gap: Spacing.md
    },
    errorContainer: {
        backgroundColor: Colors.dangerLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.dangerLight
    },
    errorText: {
        ...Typography.body,
        color: Colors.danger,
        fontWeight: '500'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    buttonContainer: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl
    }
});
