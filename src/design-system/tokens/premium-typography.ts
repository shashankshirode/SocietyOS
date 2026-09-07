export const typography = {
    fontFamily: {
        display: 'SF Pro Display',
        text: 'SF Pro Text',
        mono: 'SF Mono',
        fallback: 'System',
    },
    fontWeight: {
        ultraLight: '200',
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        heavy: '800',
    },
    fontSize: {
        xxs: 10,
        xs: 11,
        sm: 13,
        base: 15,
        md: 15,
        lg: 17,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 34,
        '5xl': 45,
        '6xl': 57,
    },
    size: {
        xxs: 10,
        xs: 11,
        sm: 13,
        base: 15,
        md: 15,
        lg: 17,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 34,
        '5xl': 45,
        '6xl': 57,
    },
    lineHeight: {
        none: 1,
        tight: 1.1,
        snug: 1.25,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },
    letterSpacing: {
        tighter: -0.03,
        tight: -0.02,
        normal: 0,
        wide: 0.02,
        wider: 0.04,
        widest: 0.08,
    },
    display: {
        large: {
            fontSize: 57,
            fontWeight: '400',
            lineHeight: 64,
            letterSpacing: -0.025,
        },
        medium: {
            fontSize: 45,
            fontWeight: '400',
            lineHeight: 52,
            letterSpacing: -0.02,
        },
        small: {
            fontSize: 36,
            fontWeight: '500',
            lineHeight: 44,
            letterSpacing: -0.015,
        },
        xs: {
            fontSize: 28,
            fontWeight: '500',
            lineHeight: 36,
            letterSpacing: -0.01,
        },
    },
    heading: {
        h1: {
            fontSize: 34,
            fontWeight: '700',
            lineHeight: 41,
            letterSpacing: -0.015,
        },
        h2: {
            fontSize: 28,
            fontWeight: '700',
            lineHeight: 34,
            letterSpacing: -0.01,
        },
        h3: {
            fontSize: 24,
            fontWeight: '600',
            lineHeight: 30,
            letterSpacing: -0.005,
        },
        h4: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 26,
            letterSpacing: 0,
        },
        h5: {
            fontSize: 17,
            fontWeight: '600',
            lineHeight: 22,
            letterSpacing: 0,
        },
        h6: {
            fontSize: 15,
            fontWeight: '600',
            lineHeight: 20,
            letterSpacing: 0,
        },
    },
    body: {
        large: {
            fontSize: 17,
            fontWeight: '400',
            lineHeight: 24,
            letterSpacing: -0.004,
        },
        medium: {
            fontSize: 15,
            fontWeight: '400',
            lineHeight: 22,
            letterSpacing: -0.002,
        },
        small: {
            fontSize: 13,
            fontWeight: '400',
            lineHeight: 20,
            letterSpacing: 0,
        },
        xs: {
            fontSize: 11,
            fontWeight: '400',
            lineHeight: 16,
            letterSpacing: 0.02,
        },
    },
    bodyStrong: {
        large: {
            fontSize: 17,
            fontWeight: '500',
            lineHeight: 24,
            letterSpacing: -0.004,
        },
        medium: {
            fontSize: 15,
            fontWeight: '500',
            lineHeight: 22,
            letterSpacing: -0.002,
        },
        small: {
            fontSize: 13,
            fontWeight: '500',
            lineHeight: 20,
            letterSpacing: 0,
        },
    },
    label: {
        large: {
            fontSize: 15,
            fontWeight: '500',
            lineHeight: 20,
            letterSpacing: 0.01,
            textTransform: 'uppercase' as const,
        },
        medium: {
            fontSize: 13,
            fontWeight: '500',
            lineHeight: 18,
            letterSpacing: 0.02,
            textTransform: 'uppercase' as const,
        },
        small: {
            fontSize: 11,
            fontWeight: '600',
            lineHeight: 14,
            letterSpacing: 0.05,
            textTransform: 'uppercase' as const,
        },
    },
    button: {
        large: {
            fontSize: 17,
            fontWeight: '600',
            lineHeight: 22,
            letterSpacing: -0.004,
        },
        medium: {
            fontSize: 15,
            fontWeight: '600',
            lineHeight: 20,
            letterSpacing: -0.002,
        },
        small: {
            fontSize: 13,
            fontWeight: '600',
            lineHeight: 18,
            letterSpacing: 0,
        },
    },
    caption: {
        medium: {
            fontSize: 13,
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0,
        },
        small: {
            fontSize: 11,
            fontWeight: '400',
            lineHeight: 14,
            letterSpacing: 0.02,
        },
        xs: {
            fontSize: 10,
            fontWeight: '400',
            lineHeight: 12,
            letterSpacing: 0.04,
        },
    },
    number: {
        display: {
            fontSize: 48,
            fontWeight: '700',
            lineHeight: 56,
            letterSpacing: -0.02,
        },
        large: {
            fontSize: 32,
            fontWeight: '700',
            lineHeight: 40,
            letterSpacing: -0.015,
        },
        medium: {
            fontSize: 24,
            fontWeight: '600',
            lineHeight: 32,
            letterSpacing: -0.01,
        },
        small: {
            fontSize: 17,
            fontWeight: '600',
            lineHeight: 24,
            letterSpacing: -0.005,
        },
        xs: {
            fontSize: 13,
            fontWeight: '600',
            lineHeight: 18,
            letterSpacing: 0,
        },
    },
    mono: {
        large: {
            fontSize: 15,
            fontWeight: '400',
            lineHeight: 22,
            letterSpacing: 0,
        },
        medium: {
            fontSize: 13,
            fontWeight: '400',
            lineHeight: 20,
            letterSpacing: 0,
        },
        small: {
            fontSize: 11,
            fontWeight: '400',
            lineHeight: 16,
            letterSpacing: 0,
        },
    },
} as const;
export type PremiumTypography = typeof typography;
export const createTextStyle = (token: keyof PremiumTypography, overrides: Partial<TextStyle> = {}) => {
    return overrides;
};
export type TextStyle = {
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
    letterSpacing: number;
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    fontFamily?: string;
};

