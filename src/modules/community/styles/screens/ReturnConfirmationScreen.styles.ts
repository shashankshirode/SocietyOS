import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body,
        color: Colors.neutral,
    },
    container: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: Spacing.md,
    },
    promptTitle: {
        ...Typography.h2,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    promptDesc: {
        ...Typography.body,
        color: Colors.neutral,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.lg,
    },
    detailsCard: {
        width: '100%',
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    buttonContainer: {
        width: '100%',
    },
    errorText: { ...Typography.caption, color: Colors.danger, textAlign: 'center', marginBottom: Spacing.sm },
});
