import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/theme";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
    },
    scroll: {
        padding: Spacing.md,
    },
    header: {
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h1,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    notice: {
        marginBottom: Spacing.md,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    linkText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
    sosRow: {
        marginBottom: Spacing.md,
    },
    sosBtn: {
        backgroundColor: Colors.danger,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    sosBtnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '800',
        fontSize: 18,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    rowGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    careCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
    },
    careLabel: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
});
