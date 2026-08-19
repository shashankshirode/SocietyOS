import { StyleSheet } from "react-native";
import { Radius } from "../../../../../shared/theme/radius";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.md
    },
    avatar: {
        width: 46,
        minHeight: 46,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xs
    },
    copy: {
        flex: 1,
        minWidth: 0,
        gap: Spacing.xs
    }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

