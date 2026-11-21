import { StyleSheet, type ViewStyle } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 14,
    },
    image: {
        width: '100%',
        height: 140,
        backgroundColor: '#F1F5F9',
    },
    content: {
        padding: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    footer: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
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
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 4
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue,
        marginLeft: 4
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        marginLeft: 4
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorSpread3Style(backgroundColorValue: string, borderColorValue: string, spread3Value: ViewStyle) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        ...spread3Value
    } as const;
}

