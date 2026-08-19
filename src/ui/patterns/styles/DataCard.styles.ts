import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
        gap: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12
    },
    body: {
        flex: 1,
        minWidth: 0,
        gap: 3
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8
    },
    titleText: {
        flex: 1
    },
    trailingArea: {
        alignItems: 'flex-end',
        gap: 1
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2
    },
    list: {
        gap: 8
    }
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

