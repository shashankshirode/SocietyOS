export type ResponsiveClass = 'compact' | 'phone' | 'largePhone' | 'fold' | 'tablet' | 'wide';
export type PageLayoutMode = 'full' | 'reading' | 'focus' | 'split';

export const responsiveBreakpoints = {
  compact: 0,
  phone: 360,
  largePhone: 400,
  fold: 480,
  tablet: 720,
  wide: 1024,
} as const;

export const responsiveLayoutTokens = {
  gutter: {
    compact: 12,
    phone: 16,
    largePhone: 20,
    fold: 24,
    tablet: 28,
    wide: 32,
  },
  maxContentWidth: {
    compact: 360,
    phone: 400,
    largePhone: 480,
    fold: 680,
    tablet: 960,
    wide: 1200,
  },
  focusWidth: {
    compact: 336,
    phone: 376,
    largePhone: 440,
    fold: 620,
    tablet: 680,
    wide: 720,
  },
  readingWidth: {
    compact: 360,
    phone: 400,
    largePhone: 480,
    fold: 680,
    tablet: 760,
    wide: 820,
  },
  sheetWidth: {
    compact: 360,
    phone: 400,
    largePhone: 460,
    fold: 560,
    tablet: 680,
    wide: 760,
  },
  bottomDockClearance: {
    compact: 84,
    phone: 88,
    largePhone: 88,
    fold: 92,
    tablet: 104,
    wide: 104,
  },
  paneGap: {
    compact: 16,
    phone: 20,
    largePhone: 20,
    fold: 24,
    tablet: 28,
    wide: 32,
  },
} as const;

export function resolveResponsiveClass(width: number): ResponsiveClass {
  if (width >= responsiveBreakpoints.wide) return 'wide';
  if (width >= responsiveBreakpoints.tablet) return 'tablet';
  if (width >= responsiveBreakpoints.fold) return 'fold';
  if (width >= responsiveBreakpoints.largePhone) return 'largePhone';
  if (width >= responsiveBreakpoints.phone) return 'phone';
  return 'compact';
}

export function responsiveValue<T>(layoutClass: ResponsiveClass, values: Record<ResponsiveClass, T>): T {
  return values[layoutClass];
}
