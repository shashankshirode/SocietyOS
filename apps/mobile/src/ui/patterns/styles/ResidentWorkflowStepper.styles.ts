import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    stepItem: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    node: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeText: {
        fontSize: 11,
        fontWeight: '800',
    },
    label: {
        fontSize: 9,
        textAlign: 'center',
        maxWidth: 60,
    },
    line: {
        height: 2,
        flex: 1.5,
        marginTop: -16,
        marginHorizontal: -8,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorFontWeightStyle(colorValue: string, fontWeightValue: "500" | "700") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

