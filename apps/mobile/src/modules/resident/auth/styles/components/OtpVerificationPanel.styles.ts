import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        gap: Spacing.md,
        width: '100%',
    },
    inputWrapper: {
        marginVertical: Spacing.xs,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 32,
    },
    changeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    resendArea: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    disclaimer: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 11,
        marginTop: Spacing.xs,
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
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createAppTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createAppTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

