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
    scrollContent: {
        padding: Spacing.md,
        gap: Spacing.md,
    },
    errorContainer: {
        backgroundColor: Colors.dangerLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.dangerLight,
    },
    errorText: {
        ...Typography.body,
        color: Colors.danger,
        fontWeight: '500',
    },
    itemSummary: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        gap: 2,
    },
    summaryLabel: {
        ...Typography.caption,
        color: Colors.neutral,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    summaryOwner: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 4,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    successIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.successLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    successEmoji: {
        fontSize: 40,
    },
    successTitle: {
        ...Typography.h2,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    successDescription: {
        ...Typography.body,
        color: Colors.neutral,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: Spacing.md,
    },
    successButtonContainer: {
        marginTop: Spacing.xl * 1.5,
        width: '100%',
    },
});
