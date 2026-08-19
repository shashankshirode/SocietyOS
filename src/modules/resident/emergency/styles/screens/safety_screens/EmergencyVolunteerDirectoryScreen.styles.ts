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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    regBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: Layout.borderRadius.sm,
        gap: 4,
    },
    regBtnText: {
        color: Colors.white,
        ...Typography.caption,
        fontWeight: '700',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
});
