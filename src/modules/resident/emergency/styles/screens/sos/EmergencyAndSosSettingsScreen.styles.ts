import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        gap: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    sectionsContainer: {
        gap: 2,
    },
    sectionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 8,
        minHeight: 68,
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sectionContent: {
        flex: 1,
        gap: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    countBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginRight: 8,
    },
    countText: {
        fontSize: 12,
        fontWeight: '700',
    },
    viewBackgroundColor: { backgroundColor: '#3B82F6' + '18' },
    safeTextColor: { color: '#3B82F6' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorOpacityStyle(backgroundColorValue: string, borderColorValue: string, opacityValue: 1 | 0.5) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        opacity: opacityValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

