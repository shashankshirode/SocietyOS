export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    none: 0,
    xxxs: 2,
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 36,
    '5xl': 48,
    screenPadding: {
        mobile: 20,
        tablet: 28,
        desktop: 36,
    },
    cardPadding: {
        mobile: 20,
        tablet: 24,
        desktop: 28,
    },
    sectionGap: {
        mobile: 32,
        tablet: 40,
        desktop: 48,
    },
    cardGap: {
        mobile: 16,
        tablet: 20,
        desktop: 24,
    },
    formGap: {
        mobile: 20,
        tablet: 24,
        desktop: 28,
    },
    listGap: {
        mobile: 12,
        tablet: 16,
        desktop: 20,
    },
    inlineGap: {
        xxxs: 2,
        xxs: 4,
        xs: 6,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        '2xl': 24,
    },
    component: {
        buttonPaddingHorizontal: {
            sm: 16,
            md: 20,
            lg: 24,
        },
        buttonPaddingVertical: {
            sm: 8,
            md: 12,
            lg: 16,
        },
        inputPaddingHorizontal: 16,
        inputPaddingVertical: 14,
        cardPadding: 20,
        modalPadding: 24,
        sheetPadding: 20,
        popoverPadding: 16,
        tooltipPadding: 8,
    },
} as const;
export type PremiumSpacing = typeof spacing;
export const getSpacing = (token: keyof PremiumSpacing): number => {
    const value = spacing[token];
    return typeof value === 'number' ? value : spacing.md;
};

