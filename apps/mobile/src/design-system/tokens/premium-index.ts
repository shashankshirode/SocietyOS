export { colors, getColors, glassStyles } from './premium-colors';
export type { PremiumColorScheme, ColorMode } from './premium-colors';

export { typography } from './premium-typography';
export type { PremiumTypography } from './premium-typography';

export { spacing } from './premium-spacing';
export type { PremiumSpacing } from './premium-spacing';

export { radius } from './premium-radius';
export type { PremiumRadius } from './premium-radius';

export { shadows } from './premium-shadows';
export type { PremiumShadows, ShadowKey } from './premium-shadows';

export { motion, getMotionConfig } from './premium-motion';
export type { PremiumMotion } from './premium-motion';

export type PremiumDesignTokens = {
  colors: typeof import('./premium-colors').colors.light;
  typography: typeof import('./premium-typography').typography;
  spacing: typeof import('./premium-spacing').spacing;
  radius: typeof import('./premium-radius').radius;
  shadows: typeof import('./premium-shadows').shadows;
  motion: typeof import('./premium-motion').motion;
};