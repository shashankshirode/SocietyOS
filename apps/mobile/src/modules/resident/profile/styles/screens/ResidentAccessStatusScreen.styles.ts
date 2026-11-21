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
        marginBottom: 16,
    },
    statusBox: {
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 16,
    },
    btn: {
        marginTop: 10,
    },
});
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

