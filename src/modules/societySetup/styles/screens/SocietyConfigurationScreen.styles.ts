import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 16,
    },
    title: {
        marginBottom: 20,
    },
    btn: {
        marginTop: 20,
    },
});
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

