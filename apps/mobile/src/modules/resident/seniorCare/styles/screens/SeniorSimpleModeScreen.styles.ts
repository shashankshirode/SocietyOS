import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/theme";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
import { Layout } from "../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
    },
    scroll: {
        padding: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h1,
        color: Colors.textPrimary,
        fontSize: 24,
    },
    exitBtn: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
    },
    exitBtnText: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.primary,
    },
    sosBtn: {
        backgroundColor: Colors.danger,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 180,
        marginBottom: Spacing.md,
    },
    sosBtnText: {
        color: Colors.white,
        fontSize: 26,
        fontWeight: '900',
        marginTop: Spacing.xs,
    },
    sosBtnSub: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.85,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    gridCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        width: '47%',
        aspectRatio: 1.1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    cardSub: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontWeight: '500',
        marginTop: 2,
        textAlign: 'center',
    },
});
