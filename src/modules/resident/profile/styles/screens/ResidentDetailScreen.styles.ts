import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 16,
    },
    card: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
        alignItems: 'center',
    },
    btn: {
        marginTop: 16,
    },
});
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

