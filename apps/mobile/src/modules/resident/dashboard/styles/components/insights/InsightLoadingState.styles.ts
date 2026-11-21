import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        gap: 16,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    heroText: {
        flex: 1,
    },
    metadataContainer: {
        gap: 6,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 12,
    },
    recommendationPanel: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        gap: 8,
        marginTop: 8,
    },
    recommendationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    shimmerBlockMarginBottom: { marginBottom: 6 },
    shimmerBlockMarginBottom2: { marginBottom: 6 }
});
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

