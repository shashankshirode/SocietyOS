import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.xxl,
        width: '100%',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    required: {
        fontSize: 14,
        fontWeight: '700',
    },
    control: {
        width: '100%',
    },
    message: {
        marginTop: Spacing.sm,
    },
    characterCount: {
        marginTop: Spacing.xs,
        minHeight: 16,
        textAlign: 'right',
    },
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

