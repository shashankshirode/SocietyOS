import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    eventRow: {
        flexDirection: 'row',
        minHeight: 48,
    },
    timelineCol: {
        alignItems: 'center',
        width: 24,
        marginRight: 12,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activePulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    line: {
        width: 2,
        flex: 1,
        marginVertical: 4,
        borderRadius: 1,
    },
    eventContent: {
        flex: 1,
        paddingBottom: 16,
        gap: 2,
    },
    timestamp: {
        marginTop: 2,
    },
    safeTextColorFontSizeFontWeight: { color: '#FFFFFF', fontSize: 8, fontWeight: '900' }
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
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
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

