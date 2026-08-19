import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    sheetHeader: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xs,
        paddingBottom: Spacing.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.input,
        borderWidth: 1.5,
        borderColor: '#E4E7EC',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 2,
    },
    list: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.sm,
        borderWidth: 1.5,
        marginBottom: Spacing.xs,
        minHeight: 48,
    },
    flag: {
        fontSize: 20,
        width: 28,
        textAlign: 'center',
    },
    infoCol: {
        flex: 1,
    },
});
export function createAppTextColorFontWeightStyle(colorValue: string, fontWeightValue: "400" | "600") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        fontWeight: '700',
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

