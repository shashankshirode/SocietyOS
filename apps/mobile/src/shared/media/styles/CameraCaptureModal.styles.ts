import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Radius } from "../../theme/radius";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    permissionContainer: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    header: {
        height: 48,
        justifyContent: 'center',
    },
    permissionContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.lg,
    },
    permissionText: {
        ...Typography.body,
        textAlign: 'center',
        lineHeight: 22,
    },
    grantBtn: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: Radius.md,
    },
    grantBtnText: {
        ...Typography.bodySmall,
        fontWeight: '700',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    topActions: {
        position: 'absolute',
        left: Spacing.lg,
        right: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorPaddingTopStyle(backgroundColorValue: string, paddingTopValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        paddingTop: paddingTopValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTouchableOpacityBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewPaddingTopStyle(paddingTopValue: number) {
    return {
        paddingTop: paddingTopValue
    } as const;
}
export function createViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}

