import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxl,
        gap: Spacing.lg
    },
    statusHeader: {
        gap: Spacing.sm
    },
    roleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.md,
        flexWrap: 'wrap'
    },
    metadataCard: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.sm
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.md
    },
    metadataLabel: {
        flex: 1
    },
    metadataValue: {
        flex: 1.45,
        textAlign: 'right'
    },
    section: {
        gap: Spacing.sm
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm
    },
    bulletText: {
        flex: 1
    }
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

