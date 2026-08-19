import { StyleSheet } from "react-native";
import { Radius } from "../../../../../shared/theme/radius";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    card: {
        borderWidth: 1.5,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerInfo: {
        gap: 2,
        flex: 1,
    },
    unitText: {
        fontSize: 16,
    },
    buildingText: {
        fontSize: 12,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    contextLabelRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginTop: Spacing.sm,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.06)',
        paddingTop: Spacing.sm,
    },
    statChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radius.md,
    },
    safeTextColorFontWeight: { color: '#DC2626', fontWeight: '600' },
    safeTextColorFontWeight2: { color: '#D97706', fontWeight: '600' },
    viewBackgroundColor: { backgroundColor: '#FEE2E2' },
    viewBackgroundColor2: { backgroundColor: '#FEF3C7' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorOpacityStyle(backgroundColorValue: string, borderColorValue: string, opacityValue: 1 | 0.6) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        opacity: opacityValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

