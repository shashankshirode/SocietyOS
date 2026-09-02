import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16,
    },
    list: {
        gap: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    leftCol: {
        alignItems: 'center',
        width: 24,
        marginRight: 12,
    },
    iconWrap: {
        zIndex: 2,
        backgroundColor: 'transparent',
        height: 24,
        justifyContent: 'center',
    },
    connector: {
        width: 2,
        height: 36,
        zIndex: 1,
        marginTop: -2,
    },
    rightCol: {
        flex: 1,
        paddingBottom: 16,
    },
    instructionBox: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        gap: 8,
        alignItems: 'center',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        flex: 1,
        color: colorValue
    } as const;
}
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
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

