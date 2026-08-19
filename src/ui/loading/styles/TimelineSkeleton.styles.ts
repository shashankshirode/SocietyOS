import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        paddingLeft: Spacing.sm,
    },
    row: {
        flexDirection: 'row',
        minHeight: 64,
    },
    dotCol: {
        width: 24,
        alignItems: 'center',
    },
    line: {
        width: 2,
        flex: 1,
        marginVertical: Spacing.xs,
    },
    content: {
        flex: 1,
        paddingLeft: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    shimmerBlockMarginTop: { marginTop: Spacing.xs },
    shimmerBlockMarginTop2: { marginTop: Spacing.xs }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

