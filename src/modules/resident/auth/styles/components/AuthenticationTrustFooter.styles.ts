import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: Spacing.xs,
        paddingTop: Spacing.sm,
    },
    shieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.lg,
    },
    trustText: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 11,
    },
    linksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    link: {
        fontWeight: '600',
        fontSize: 12,
    },
});
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
        color: colorValue
    } as const;
}

