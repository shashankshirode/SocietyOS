import { StyleSheet } from "react-native";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    value: {
        ...Typography.bodySmall,
        fontWeight: '500',
        textAlign: 'right',
        minWidth: 0
    },
    bold: {
        fontWeight: '700'
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

