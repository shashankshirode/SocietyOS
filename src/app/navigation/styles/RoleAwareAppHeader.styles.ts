import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        paddingBottom: 12
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56
    },
    leftAction: {
        marginRight: 12
    },
    titleContainer: {
        flex: 1
    },
    rightAction: {
        marginLeft: 12
    }
});
export function createViewPaddingTopStyle(paddingTopValue: number) {
    return {
        paddingTop: paddingTopValue
    } as const;
}

