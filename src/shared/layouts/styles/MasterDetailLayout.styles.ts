import { StyleSheet } from "react-native";
import { Colors } from "../../theme";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    splitRow: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        backgroundColor: Colors.background,
    },
    masterPane: {
        height: '100%',
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: Colors.border,
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.borderStrong,
    },
    detailPane: {
        height: '100%',
        backgroundColor: Colors.surface,
    },
});
export function createViewFlexStyle(flexValue: number) {
    return {
        flex: flexValue
    } as const;
}
export function createViewFlexStyle2(flexValue: number) {
    return {
        flex: flexValue
    } as const;
}

