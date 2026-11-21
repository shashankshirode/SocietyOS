import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 4,
    },
    left: {
        flex: 1,
        marginRight: 12,
    },
    subtitle: {
        marginTop: 2,
    },
    action: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}

