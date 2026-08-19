import { StyleSheet } from "react-native";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    text: {
        ...Typography.bodySmall,
        fontStyle: 'italic',
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

