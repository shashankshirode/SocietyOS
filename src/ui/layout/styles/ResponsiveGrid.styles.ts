import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
    },
});
export function createViewWidthFlexBasisStyle(widthValue: `${number}%`, flexBasisValue: `${number}%`) {
    return {
        width: widthValue,
        flexBasis: flexBasisValue
    } as const;
}
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}

