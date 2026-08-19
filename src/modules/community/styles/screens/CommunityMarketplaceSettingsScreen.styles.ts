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
    sectionTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: Spacing.sm,
    },
    adminRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    adminRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    adminRowTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    adminRowDesc: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    toggleText: {
        flex: 1,
        paddingRight: Spacing.md,
    },
    toggleLabel: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    toggleDesc: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    buttonContainer: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },
});
