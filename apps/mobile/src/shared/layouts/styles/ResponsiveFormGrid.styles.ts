import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    col: {
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
export function createViewGapStyle3(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}

