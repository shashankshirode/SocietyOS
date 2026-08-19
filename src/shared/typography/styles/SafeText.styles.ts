import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    base: {
        flexShrink: 1,
        minWidth: 0,
        flexWrap: 'wrap',
        includeFontPadding: false,
    },
});
export function createTextColorTextAlignStyle(colorValue: string, textAlignValue: "center" | "left" | "right") {
    return {
        color: colorValue,
        textAlign: textAlignValue
    } as const;
}

