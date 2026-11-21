import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stack: {
        gap: Spacing.md
    },
    confirmBox: {
        borderWidth: 1.5,
        borderRadius: Radius.card,
        padding: Spacing.lg,
        gap: Spacing.xs
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm
    },
    alertBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        padding: Spacing.md,
        borderRadius: Radius.card
    },
    completion: {
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.xl
    },
    appTextFontWeight: { fontWeight: '700' },
    appTextFontWeight2: { fontWeight: '700' }
});
export function createScreenScaffoldBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createScreenScaffoldBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
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
export function createAppTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle6(colorValue: string) {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createAppTextColorStyle7(colorValue: string) {
    return {
        color: colorValue,
        textAlign: 'center'
    } as const;
}
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

