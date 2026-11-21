import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 8,
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    titleCol: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 2,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export function createViewBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableScaleBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

