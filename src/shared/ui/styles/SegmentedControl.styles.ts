import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 2,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    segment: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    text: {
        fontSize: 13,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 2
    } as const;
}
export function createSafeTextColorFontWeightStyle(colorValue: string, fontWeightValue: "500" | "700") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue
    } as const;
}

