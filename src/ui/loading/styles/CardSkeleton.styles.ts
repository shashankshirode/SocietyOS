import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Radius } from "../../../shared/theme/radius";
export const styles = StyleSheet.create({
    card: {
        borderRadius: Radius.card,
        padding: Spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: Spacing.md,
    },
    textCol: {
        flex: 1,
        gap: Spacing.xs,
    },
    line: {
        marginTop: Spacing.xs,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

