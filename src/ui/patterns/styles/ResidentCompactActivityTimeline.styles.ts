import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        gap: 12
    },
    card: {
        marginHorizontal: 20,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBlock: {
        flex: 1,
        gap: 3
    },
    rowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    title: {
        flex: 1,
        fontWeight: '800'
    },
    time: {
        maxWidth: 86
    },
    dateGroup: {
        paddingHorizontal: 14,
        paddingTop: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    empty: {
        padding: 24,
        alignItems: 'center',
        gap: 8
    }
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue,
        borderTopWidth: 1
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

