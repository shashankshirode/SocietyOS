import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    header: {
        width: '100%',
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 12,
    },
    headerTitle: { flex: 1 },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        gap: 12,
    },
});
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

