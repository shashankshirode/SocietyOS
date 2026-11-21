import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 44,
        gap: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 2,
        minWidth: 0,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        flexShrink: 1,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    subtitle: {
        fontSize: 11,
    },
    rightAction: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewPaddingTopBackgroundColorBorderBottomColorStyle(paddingTopValue: number, backgroundColorValue: string, borderBottomColorValue: string) {
    return {
        paddingTop: paddingTopValue,
        backgroundColor: backgroundColorValue,
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "rgba(129,140,248,0.2)" | "rgba(67,56,202,0.1)") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

