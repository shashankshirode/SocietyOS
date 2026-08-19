import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 16,
    },
    card: {
        padding: 16,
    },
    title: {
        marginBottom: 8,
    },
    desc: {
        marginBottom: 20,
    },
    cardWrapper: {
        marginTop: 16,
    },
    submitBtn: {
        marginTop: 20,
    },
});
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

