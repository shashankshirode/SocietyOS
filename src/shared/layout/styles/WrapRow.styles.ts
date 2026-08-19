import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
});
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}

