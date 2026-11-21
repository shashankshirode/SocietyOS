import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    grid3: {},
    tileWrapper: {
        flexBasis: '48%',
        flexGrow: 1,
        minWidth: 140
    },
    tile: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 14,
        gap: 8
    },
    tileIconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    badgeTag: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 8
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    }
});
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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

