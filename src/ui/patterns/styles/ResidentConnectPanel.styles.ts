import { StyleSheet } from "react-native";
import { residentColors } from "../../../shared/theme/residentColors";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    content: { paddingHorizontal: 20, gap: 10 },
    privacyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12
    },
    requestCard: {
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        gap: 10
    },
    requestHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    requestIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    requestText: { flex: 1, gap: 1 },
    requestActions: { flexDirection: 'row', gap: 8 },
    acceptBtn: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10
    },
    rejectBtn: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10
    },
    requestDone: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12
    },
    chatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chatItem: { width: '48%', flexGrow: 1 },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8
    },
    chatIcon: {
        width: 32,
        height: 32,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatLabel: { flex: 1, fontSize: 12, fontWeight: '600' },
    unreadBadge: {
        backgroundColor: residentColors.danger,
        borderRadius: 8,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4
    },
    unreadText: { color: residentColors.lightSurface, fontSize: 10, fontWeight: '800' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

