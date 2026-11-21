import { ViewStyle, Platform } from 'react-native';
export const premiumElevation = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 6,
    6: 8,
    7: 10,
    8: 12,
    9: 14,
    10: 16,
    11: 18,
    12: 20,
    13: 22,
    14: 24,
    15: 26,
    16: 28,
    17: 30,
    18: 34,
    19: 36,
    20: 38,
    21: 40,
    22: 44,
    23: 46,
    24: 48,
    25: 50,
    floating: 24,
    sticky: 8,
} as const;
const createShadow = (color: string, offsetX: number, offsetY: number, blur: number, spread: number = 0, opacity: number): ViewStyle => {
    const iosStyle: ViewStyle = {
        shadowColor: color,
        shadowOffset: { width: offsetX, height: offsetY },
        shadowOpacity: opacity,
        shadowRadius: blur / 2,
    };
    const androidElevation = Math.round((blur + Math.abs(offsetY)) / 2);
    const androidStyle: ViewStyle = {
        elevation: androidElevation,
    };
    return Platform.select({ ios: iosStyle, android: androidStyle }) as ViewStyle;
};
export const shadows = {
    none: Platform.select({
        ios: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0 },
        android: { elevation: 0 },
    }) as ViewStyle,
    xs: createShadow('#0F172A', 0, 1, 2, 0, 0.04),
    sm: createShadow('#0F172A', 0, 2, 4, 0, 0.06),
    md: createShadow('#0F172A', 0, 4, 8, -1, 0.08),
    lg: createShadow('#0F172A', 0, 8, 16, -2, 0.10),
    xl: createShadow('#0F172A', 0, 16, 24, -4, 0.12),
    '2xl': createShadow('#0F172A', 0, 24, 32, -6, 0.14),
    '3xl': createShadow('#0F172A', 0, 32, 40, -8, 0.16),
    inner: createShadow('#0F172A', 0, 2, 4, 0, 0.06),
    innerLg: createShadow('#0F172A', 0, 4, 8, 0, 0.08),
    card: {
        rest: createShadow('#0F172A', 0, 2, 8, 0, 0.06),
        hover: createShadow('#0F172A', 0, 8, 24, -4, 0.10),
        pressed: createShadow('#0F172A', 0, 2, 6, 0, 0.05),
        drag: createShadow('#0F172A', 0, 12, 32, -6, 0.14),
    },
    floating: {
        sm: createShadow('#0F172A', 0, 4, 12, -2, 0.10),
        md: createShadow('#0F172A', 0, 12, 28, -4, 0.12),
        lg: createShadow('#0F172A', 0, 20, 40, -8, 0.14),
        xl: createShadow('#0F172A', 0, 24, 48, -10, 0.16),
    },
    modal: {
        backdrop: createShadow('#0F172A', 0, 0, 0, 0, 0.40),
        sheet: createShadow('#0F172A', 0, -4, 24, 0, 0.12),
        center: createShadow('#0F172A', 0, 16, 40, -8, 0.18),
        fullScreen: createShadow('#0F172A', 0, 24, 64, -12, 0.20),
    },
    popover: createShadow('#0F172A', 0, 4, 16, -2, 0.10),
    dropdown: createShadow('#0F172A', 0, 6, 18, -3, 0.10),
    navBar: createShadow('#0F172A', 0, 1, 4, 0, 0.06),
    tabBar: createShadow('#0F172A', 0, -1, 4, 0, 0.05),
    stickyHeader: createShadow('#0F172A', 0, 2, 8, 0, 0.06),
    colored: {
        primary: createShadow('#3B82F6', 0, 4, 16, 0, 0.35),
        primaryHover: createShadow('#3B82F6', 0, 8, 24, -2, 0.40),
        success: createShadow('#10B981', 0, 4, 16, 0, 0.35),
        danger: createShadow('#EF4444', 0, 4, 16, 0, 0.35),
        warning: createShadow('#F59E0B', 0, 4, 16, 0, 0.35),
        focus: createShadow('#3B82F6', 0, 0, 0, 3, 0.40),
    },
    glass: {
        subtle: createShadow('#0F172A', 0, 1, 3, 0, 0.05),
        regular: createShadow('#0F172A', 0, 4, 12, -1, 0.08),
        strong: createShadow('#0F172A', 0, 8, 24, -2, 0.12),
    },
    sticky: {
        top: createShadow('#0F172A', 0, 2, 8, 0, 0.06),
        bottom: createShadow('#0F172A', 0, -2, 8, 0, 0.05),
    },
} as const;
export type PremiumShadows = typeof shadows;
export type ShadowKey = keyof typeof shadows;

