import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 8
    },
    preview: {
        marginTop: -8,
        marginBottom: 8,
        fontWeight: '700',
        paddingLeft: 4
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

