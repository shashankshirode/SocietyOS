import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    statsCard: {
        marginHorizontal: Spacing.md,
        marginTop: Spacing.xs,
        padding: Spacing.md,
        borderRadius: 12,
        borderWidth: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    statsTitle: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statsCount: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    statsPercent: {
        fontSize: 24,
        fontWeight: '800',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    breakdownGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    breakdownItem: {
        alignItems: 'center',
        minWidth: '18%',
    },
    breakdownLabel: {
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
    breakdownVal: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.md,
        marginVertical: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        height: 44,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: Spacing.xs,
        fontSize: 14,
    },
    filtersPanel: {
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
    },
    filterTitle: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    filterScroll: {
        flexDirection: 'row',
        marginBottom: Spacing.xs,
    },
    filterChip: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: Spacing.xs,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    listContainer: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    card: {
        borderRadius: 10,
        borderWidth: 1,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleCol: {
        flex: 1,
        marginRight: Spacing.xs,
    },
    featureName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: 6,
        marginBottom: Spacing.xs,
    },
    phaseTag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    phaseTagText: {
        fontSize: 10,
        fontWeight: '700',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
    summaryItem: {
        fontSize: 11,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
        gap: Spacing.sm,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createTouchableOpacityBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle7(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle8(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle9(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: 'bold'
    } as const;
}
export function createTextColorStyle10(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextColorStyle11(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle12(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle13(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorWidthStyle(backgroundColorValue: string, widthValue: `${number}%`) {
    return {
        backgroundColor: backgroundColorValue,
        width: widthValue
    } as const;
}
export function createTextColorStyle14(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle15(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle16(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle17(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle18(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle19(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle20(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle21(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle22(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle23(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: 'bold'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
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
export function createTextColorStyle24(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTouchableOpacityBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle25(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle26(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTouchableOpacityBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle27(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle28(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

