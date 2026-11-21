import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        justifyContent: 'space-between',
        minHeight: 180,
        gap: 14
    },
    contentGroup: {
        gap: 8
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    categoryLabel: {
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    summaryText: {
        lineHeight: 16
    },
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 10,
        gap: 8
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8
    },
    footerStacked: {
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    metadataGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0
    },
    timestamp: {
        fontWeight: '500',
        flexShrink: 0
    },
    attachmentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        flexShrink: 0
    },
    attachmentText: {
        fontSize: 10
    },
    badgeLeftAlign: {
        alignSelf: 'flex-start'
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createPressableScaleWidthStyle(widthValue: number) {
    return {
        width: widthValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

