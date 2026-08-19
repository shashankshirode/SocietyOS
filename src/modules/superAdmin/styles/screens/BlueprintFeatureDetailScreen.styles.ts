import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
        gap: Spacing.md,
    },
    mainCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    phaseLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    infoVal: {
        fontSize: 13,
    },
    section: {
        borderRadius: 12,
        borderWidth: 1,
        padding: Spacing.md,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    successRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: 4,
    },
    successText: {
        fontSize: 13,
        fontWeight: '600',
    },
    issueList: {
        gap: Spacing.xs,
    },
    issueItem: {
        padding: Spacing.sm,
        borderRadius: 8,
        gap: 4,
    },
    issueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    issueSeverity: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    issueMsg: {
        fontSize: 13,
        lineHeight: 18,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
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
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBorderColorBackgroundColorStyle2(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle8(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle9(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle10(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle11(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

