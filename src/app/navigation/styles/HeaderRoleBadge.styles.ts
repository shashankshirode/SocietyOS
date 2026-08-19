import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    viewBackgroundColor: { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

