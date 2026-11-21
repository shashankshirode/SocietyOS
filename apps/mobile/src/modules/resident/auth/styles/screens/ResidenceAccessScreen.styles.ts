import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    scroll: {
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xxl,
        gap: Spacing.xl
    },
    tabletScroll: {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%'
    },
    header: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.xs,
        alignItems: 'flex-start'
    },
    eyebrow: {
        fontWeight: '800',
        fontSize: 9.5,
        letterSpacing: 0.8
    },
    footerRow: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
        marginTop: Spacing.md
    }
});
export function createScreenScaffoldBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '800',
        marginTop: 2
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

