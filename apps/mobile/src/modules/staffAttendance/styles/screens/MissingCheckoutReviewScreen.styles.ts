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
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    listContent: {
        paddingBottom: Spacing.xl,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    staffName: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    code: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    shiftName: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.primary,
    },
    details: {
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginBottom: Spacing.sm,
        gap: 4,
    },
    detailText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Layout.borderRadius.sm,
        gap: 4,
    },
    btnText: {
        ...Typography.caption,
        color: Colors.white,
        fontWeight: '600',
    },
    pressed: { opacity: 0.8 },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: Spacing.sm,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.neutral,
    },
});
