import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        padding: Spacing.md,
    },
    header: {
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h1,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.neutral,
        marginTop: 2,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    actionCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        width: '47%',
        aspectRatio: 1.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        position: 'relative',
    },
    actionLabel: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        top: Spacing.xs,
        right: Spacing.xs,
        backgroundColor: Colors.danger,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
    punchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    punchInfo: {
        flex: 1,
    },
    punchName: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    punchMeta: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    punchTimeBox: {
        alignItems: 'flex-end',
    },
    punchTime: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    punchType: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.success,
    },
});
