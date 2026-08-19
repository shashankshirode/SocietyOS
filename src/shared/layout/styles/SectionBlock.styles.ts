import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
        width: '100%',
    },
    title: {
        fontWeight: '700',
        flexShrink: 1,
    },
    action: {
        flexShrink: 0,
    },
});
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}

