import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    list: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    card: {
        padding: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    appNum: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    priority: {
        ...Typography.caption,
        fontWeight: '700',
    },
    typeLabel: {
        ...Typography.sectionTitle,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    desc: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
        borderTopWidth: 1,
        borderColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    metaText: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appButtonFlex: { flex: 1 },
    appButtonFlex2: { flex: 1 },
    controlsContainer: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
        backgroundColor: Colors.background,
    },
    searchContainer: {
        marginBottom: Spacing.sm,
    },
    searchInput: {
        backgroundColor: Colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        ...Typography.bodySmall,
        color: Colors.textPrimary,
    },
    tabsScrollView: {
        flexDirection: 'row',
        marginBottom: Spacing.xs,
    },
    tabChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: Spacing.sm,
    },
    tabChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    tabChipText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    tabChipTextActive: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.surface,
    },
    countHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.xs,
    },
    countHeaderText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
    }
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

