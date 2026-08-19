import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    panel: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.md,
    },
    ownerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ownerText: {
        flex: 1,
        gap: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
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

