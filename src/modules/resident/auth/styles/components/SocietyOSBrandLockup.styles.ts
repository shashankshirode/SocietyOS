import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { residentColors } from "../../../../../shared/theme/residentColors";
export const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    heroLayout: {
        gap: Spacing.xs,
    },
    compactLayout: {
        gap: 0,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    customShield: {
        borderWidth: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    heroSize: {
        width: 32,
        height: 38,
    },
    compactSize: {
        width: 20,
        height: 24,
        borderWidth: 1.5,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    doorwaySpace: {
        width: '50%',
        height: '60%',
        borderWidth: 1.5,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        position: 'absolute',
        bottom: 0,
        borderBottomWidth: 0,
    },
    accessDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        position: 'absolute',
        bottom: '40%',
    },
    wordmarkRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    wordmarkBase: {
        fontWeight: '500',
        letterSpacing: -0.5,
    },
    wordmarkOS: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    heroText: {
        fontSize: 26,
        lineHeight: 32,
    },
    compactText: {
        fontSize: 18,
        lineHeight: 24,
    },
    taglineBlock: {
        gap: 3,
        marginTop: 4,
    },
    tagline: {
        color: residentColors.onBrandStrong,
        fontWeight: '600',
        fontSize: 15,
        lineHeight: 21,
    },
    trustLine: {
        color: residentColors.onBrandMedium,
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 16,
    },
});
export function createAnimatedViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createAnimatedViewBorderColorStyle2(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createAnimatedViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
