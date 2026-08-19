import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    outer: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
    },
    tabletContainer: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
        borderLeftWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: '#E4E7EC',
    },
    scroll: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    header: {
        marginBottom: Spacing.xl,
        gap: Spacing.xs,
    },
    body: {
        gap: Spacing.lg,
    },
    footer: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderTopWidth: 1.5,
        gap: Spacing.sm,
    },
    btnRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    flexBtn: {
        flex: 1,
    },
    skipBtn: {
        alignSelf: 'center',
    },
});
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderTopColorStyle(backgroundColorValue: string, borderTopColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderTopColor: borderTopColorValue
    } as const;
}

