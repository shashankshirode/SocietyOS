import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
        minHeight: 56,
    },
    reorderIcon: {
        marginRight: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    initials: {
        fontSize: 13,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        gap: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
    },
    badges: {
        flexDirection: 'row',
        gap: 4,
        marginLeft: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 3,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
    },
    safeTextColor: { color: '#3B82F6' },
    viewBackgroundColor: { backgroundColor: '#10B981' + '18' },
    safeTextColor2: { color: '#10B981' },
    viewBackgroundColor2: { backgroundColor: '#6B7280' + '18' },
    safeTextColor3: { color: '#6B7280' }
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

