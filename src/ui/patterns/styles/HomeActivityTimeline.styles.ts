import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    card: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8
    },
    item: { flexDirection: 'row', gap: 12, minHeight: 56 },
    timelineLeft: { alignItems: 'center', width: 28 },
    node: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
    },
    line: { width: 2, flex: 1, marginVertical: 2 },
    content: {
        flex: 1,
        paddingBottom: 14,
        gap: 2
    },
    contentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    safeTextFontWeightFlex: { fontWeight: '600', flex: 1 },
    viewMinHeight: { minHeight: 40 },
    viewPaddingBottom: { paddingBottom: 0 }
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
export function createViewBackgroundColorStyle2(backgroundColorValue: "#E5E7EB" | "#253149") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

