import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    header: {
        width: '100%',
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 12,
    },
    headerTitle: { flex: 1 },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 28,
        gap: 10,
    },
    dateGroup: {
        marginTop: 8,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
    },
    icon: {
        width: 38,
        height: 38,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    copy: {
        flex: 1,
        gap: 3,
    },
});
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorOpacityStyle(backgroundColorValue: string, borderColorValue: string, opacityValue: 1 | 0.82) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        opacity: opacityValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

