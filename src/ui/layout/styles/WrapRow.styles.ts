import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}

