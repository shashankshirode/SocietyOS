import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginHorizontal: 20,
        marginTop: 12,
        gap: 10,
    },
    shimmerIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    shimmerText: {
        flex: 1,
        height: 12,
        borderRadius: 6,
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
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

