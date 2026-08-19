import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    leftCol: {
        alignItems: 'center',
        width: 16,
        marginRight: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
        zIndex: 2,
    },
    line: {
        width: 2,
        flex: 1,
        minHeight: 30,
        zIndex: 1,
        marginTop: 2,
    },
    rightCol: {
        flex: 1,
        paddingBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    description: {
        marginTop: 4,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        fontWeight: '700',
        color: colorValue,
        flex: 1
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
export function createViewBackgroundColorStyle2(backgroundColorValue: "#E5E7EB" | "#253149") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

