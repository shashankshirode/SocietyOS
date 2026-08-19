import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    gridRow: {
        flexDirection: 'row',
        width: '100%',
    },
    gridColumn: {
        flex: 1,
    },
});
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewGapStyle2(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewMarginTopStyle(marginTopValue: number) {
    return {
        marginTop: marginTopValue
    } as const;
}

