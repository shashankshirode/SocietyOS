import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    screenContent: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    listContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    headerContent: {
        gap: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    intro: {
        gap: Spacing.xs,
    },
    eyebrow: {
        letterSpacing: 1,
    },
    search: {
        minHeight: 50,
        borderWidth: 1,
        borderRadius: Radius.input,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        minHeight: 48,
        fontSize: 15,
    },
    filterRow: {
        gap: Spacing.sm,
        paddingBottom: Spacing.sm,
    },
    filterChip: {
        minHeight: 38,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notice: {
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.xs,
    },
    sectionHeader: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    itemSeparator: {
        height: Spacing.lg,
    },
    sectionSeparator: {
        height: Spacing.md,
    },
    footer: {
        gap: Spacing.sm,
        paddingTop: Spacing.xl,
    },
    loadingMore: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
});
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

