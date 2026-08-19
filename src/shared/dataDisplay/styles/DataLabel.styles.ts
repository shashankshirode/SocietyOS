import { StyleSheet } from "react-native";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    label: {
        ...Typography.bodySmall,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

