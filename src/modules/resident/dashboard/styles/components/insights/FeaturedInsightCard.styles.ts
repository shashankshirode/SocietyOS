import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 3
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        gap: 8
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    categoryLabel: {
        fontWeight: '700',
        fontSize: 11,
        textTransform: 'uppercase'
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16
    },
    iconContainer: {
        width: 24,
        alignItems: 'center',
        paddingTop: 2
    },
    heroText: {
        flex: 1,
        gap: 6
    },
    title: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
        letterSpacing: -0.2
    },
    description: {
        fontSize: 14,
        lineHeight: 20
    },
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 12,
        gap: 4
    },
    sourceText: {
        fontWeight: '600'
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    metadataText: {
        fontWeight: '500'
    },
    bullet: {
        marginHorizontal: 4
    }
});
export function createAnimatedViewBackgroundColorBorderColorShadowColorStyle(backgroundColorValue: string, borderColorValue: string, shadowColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        shadowColor: shadowColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue
    } as const;
}

