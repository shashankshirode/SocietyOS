import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    summaryCard: {
        paddingVertical: 24,
        alignItems: 'center',
        width: '100%',
    },
    appCardPaddingHorizontalPaddingVertical: { paddingHorizontal: 16, paddingVertical: 8 },
    appTextFontWeightMarginBottom: { fontWeight: '600', marginBottom: 6 },
    appTextMarginBottom: { marginBottom: 16 }
});
export function createBoxBackgroundColorBorderRadiusStyle(backgroundColorValue: string, borderRadiusValue: 999) {
    return {
        backgroundColor: backgroundColorValue,
        borderRadius: borderRadiusValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700',
        textTransform: 'uppercase'
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        fontWeight: '700',
        color: colorValue
    } as const;
}
export function createAppTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 4
    } as const;
}

