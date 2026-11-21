import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Radius } from "../../../shared/theme/radius";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    padded: {
        padding: Spacing.lg,
        gap: Spacing.lg,
    },
    filterRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    detailCard: {
        borderRadius: Radius.card,
        padding: Spacing.lg,
        marginTop: Spacing.md,
    },
    shimmerBlockMarginTop: { marginTop: Spacing.sm },
    shimmerBlockMarginTop2: { marginTop: Spacing.lg },
    shimmerBlockMarginTop3: { marginTop: Spacing.lg },
    shimmerBlockMarginTop4: { marginTop: Spacing.xs }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

