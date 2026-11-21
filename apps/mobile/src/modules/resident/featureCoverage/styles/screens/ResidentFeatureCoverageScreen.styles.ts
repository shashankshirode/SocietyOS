import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
import { Typography } from "../../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSection: {
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.screenTitle,
        marginBottom: Spacing.lg,
    },
    statsCard: {
        borderRadius: Radius.card,
        padding: Spacing.lg,
        gap: Spacing.sm,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLabel: {
        ...Typography.body,
    },
    statValue: {
        ...Typography.sectionTitle,
        fontSize: 18,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginTop: Spacing.sm,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    percentText: {
        ...Typography.caption,
        textAlign: 'center',
        marginTop: Spacing.xs,
        fontWeight: '600',
    },
    featureCard: {
        borderRadius: Radius.sm,
        padding: Spacing.md,
    },
    featureHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    featureName: {
        ...Typography.body,
        flex: 1,
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radius.pill,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    featureMeta: {
        marginTop: Spacing.xs,
        marginLeft: Spacing.xl,
    },
    metaText: {
        fontSize: 11,
    },
    viewHeight: { height: Spacing.sm }
});
export function createFlatListPaddingTopPaddingBottomStyle(paddingTopValue: number, paddingBottomValue: number) {
    return {
        padding: Spacing.lg,
        paddingTop: paddingTopValue,
        paddingBottom: paddingBottomValue
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
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
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
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
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
        color: colorValue
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
        color: colorValue
    } as const;
}
export function createTextColorStyle24(colorValue: string) {
    return {
        color: colorValue
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
export function createTextColorStyle29(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle30(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle6(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewWidthBackgroundColorStyle(widthValue: `${number}%`, backgroundColorValue: string) {
    return {
        width: widthValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle31(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

