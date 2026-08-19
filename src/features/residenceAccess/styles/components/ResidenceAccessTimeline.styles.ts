import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        gap: 0,
    },
    empty: {
        gap: Spacing.xs,
    },
    eventRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        minHeight: 74,
    },
    markerColumn: {
        width: 12,
        alignItems: 'center',
    },
    marker: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    line: {
        width: 2,
        flex: 1,
        marginVertical: 4,
    },
    eventContent: {
        flex: 1,
        gap: 3,
        paddingBottom: Spacing.md,
    },
    expandButton: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
    },
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

