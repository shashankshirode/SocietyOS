import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({});
export function createViewFlexDirectionGapStyle(flexDirectionValue: "row" | "column", gapValue: number) {
    return {
        flexDirection: flexDirectionValue,
        gap: gapValue,
        minWidth: 0,
        width: '100%'
    } as const;
}

