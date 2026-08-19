import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 14,
        flexDirection: 'row',
        gap: 12,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        gap: 5,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 5,
    },
    stepText: {
        flex: 1,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

