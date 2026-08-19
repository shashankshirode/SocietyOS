import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 11,
        marginTop: 2,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

