import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { marginTop: -4 },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        gap: 10,
    },
    card: {
        width: 200,
        borderRadius: 14,
        padding: 14,
        gap: 6,
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    title: {
        fontWeight: "700",
        fontSize: 13,
        flex: 1,
    },
    desc: {
        fontSize: 11,
        lineHeight: 15,
    },
    action: {
        fontWeight: "700",
        fontSize: 11,
        marginTop: 2,
    },
});
export function createScrollViewPaddingHorizontalStyle(paddingHorizontalValue: number) {
    return {
        paddingHorizontal: paddingHorizontalValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        opacity: 0.7
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

