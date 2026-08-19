import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
    },
});
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}

