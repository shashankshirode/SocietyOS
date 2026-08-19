import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
});
export function createViewWidthPaddingStyle(widthValue: `${number}%`, paddingValue: number) {
    return {
        width: widthValue,
        flexGrow: 1,
        padding: paddingValue
    } as const;
}

