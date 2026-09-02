import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    surface: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderTopWidth: 1,
        flex: 1,
        minHeight: 390,
    },
    contextMarker: {
        width: 34,
        height: 4,
        borderRadius: 2,
        marginTop: Spacing.sm,
        marginBottom: Spacing.sm,
        alignSelf: 'center',
    },
    body: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
        gap: Spacing.md,
        flex: 1,
    },
    headerBlock: {
        gap: Spacing.xs,
        alignItems: 'flex-start',
    },
    eyebrow: {
        fontWeight: '800',
        fontSize: 9.5,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    title: {
        fontWeight: '800',
        fontSize: 24,
        letterSpacing: -0.2,
    },
    subtitle: {
        lineHeight: 18,
    },
    childrenContainer: {
        gap: Spacing.md,
    },
    footerContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        marginHorizontal: Spacing.xl,
        marginTop: 'auto',
        paddingBottom: Spacing.lg,
        paddingTop: Spacing.sm,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue
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
export function createAppTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
