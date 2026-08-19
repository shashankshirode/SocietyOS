import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
        width: '100%',
        minHeight: 24,
    },
    handle: {
        width: 36,
        height: 5,
        borderRadius: 3,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

