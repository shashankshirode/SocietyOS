import type { PremiumSpacing } from './premium-spacing';
import type { PremiumRadius } from './premium-radius';

export const skeletonTokens = {
  light: {
    base: '#F1F5F9',
    highlight: '#E2E8F0',
    shimmer: 'rgba(255, 255, 255, 0.6)',
    baseOpacity: 0.8,
    highlightOpacity: 0.6,
  },
  dark: {
    base: '#1E293B',
    highlight: '#334155',
    shimmer: 'rgba(255, 255, 255, 0.1)',
    baseOpacity: 0.8,
    highlightOpacity: 0.5,
  },
} as const;

export const skeletonSizes = {
  avatar: {
    xs: { width: 24, height: 24, borderRadius: 12 },
    sm: { width: 32, height: 32, borderRadius: 16 },
    md: { width: 40, height: 40, borderRadius: 20 },
    lg: { width: 48, height: 48, borderRadius: 24 },
    xl: { width: 64, height: 64, borderRadius: 32 },
    xxl: { width: 96, height: 96, borderRadius: 48 },
  },
  button: {
    xs: { width: '100%', height: 32, borderRadius: 8 },
    sm: { width: '100%', height: 40, borderRadius: 12 },
    md: { width: '100%', height: 48, borderRadius: 12 },
    lg: { width: '100%', height: 56, borderRadius: 16 },
    xl: { width: '100%', height: 64, borderRadius: 16 },
  },
  input: {
    xs: { width: '100%', height: 36, borderRadius: 8 },
    sm: { width: '100%', height: 40, borderRadius: 10 },
    md: { width: '100%', height: 48, borderRadius: 12 },
    lg: { width: '100%', height: 56, borderRadius: 12 },
  },
  card: {
    sm: { width: '100%', height: 80, borderRadius: 12 },
    md: { width: '100%', height: 120, borderRadius: 16 },
    lg: { width: '100%', height: 160, borderRadius: 16 },
    xl: { width: '100%', height: 200, borderRadius: 20 },
    featured: { width: '100%', height: 240, borderRadius: 20 },
  },
  badge: {
    sm: { width: 48, height: 20, borderRadius: 10 },
    md: { width: 64, height: 24, borderRadius: 12 },
    lg: { width: 80, height: 28, borderRadius: 14 },
  },
  chip: {
    sm: { width: 56, height: 28, borderRadius: 14 },
    md: { width: 72, height: 32, borderRadius: 16 },
    lg: { width: 96, height: 36, borderRadius: 18 },
  },
  listItem: {
    sm: { width: '100%', height: 72, borderRadius: 12 },
    md: { width: '100%', height: 88, borderRadius: 14 },
    lg: { width: '100%', height: 104, borderRadius: 16 },
  },
  image: {
    thumbnail: { width: 60, height: 60, borderRadius: 10 },
    small: { width: 100, height: 100, borderRadius: 12 },
    medium: { width: 160, height: 120, borderRadius: 14 },
    large: { width: '100%', height: 160, borderRadius: 16 },
    featured: { width: '100%', height: 200, borderRadius: 20 },
    hero: { width: '100%', height: 240, borderRadius: 20 },
  },
  icon: {
    xs: { width: 16, height: 16, borderRadius: 4 },
    sm: { width: 20, height: 20, borderRadius: 5 },
    md: { width: 24, height: 24, borderRadius: 6 },
    lg: { width: 32, height: 32, borderRadius: 8 },
    xl: { width: 40, height: 40, borderRadius: 10 },
    xxl: { width: 48, height: 48, borderRadius: 12 },
  },
  text: {
    xs: { width: '30%', height: 10, borderRadius: 3 },
    sm: { width: '40%', height: 12, borderRadius: 3 },
    md: { width: '60%', height: 14, borderRadius: 3 },
    lg: { width: '80%', height: 16, borderRadius: 3 },
    xl: { width: '90%', height: 20, borderRadius: 3 },
    display: { width: '50%', height: 24, borderRadius: 3 },
    label: { width: '35%', height: 12, borderRadius: 3 },
    caption: { width: '45%', height: 10, borderRadius: 3 },
    line: { width: '100%', height: 1, borderRadius: 0.5 },
  },
  divider: {
    thin: { width: '100%', height: 1, borderRadius: 0.5 },
    thick: { width: '100%', height: 2, borderRadius: 1 },
  },
  spacer: {
    xs: { width: '100%', height: 4, borderRadius: 0 },
    sm: { width: '100%', height: 8, borderRadius: 0 },
    md: { width: '100%', height: 16, borderRadius: 0 },
    lg: { width: '100%', height: 24, borderRadius: 0 },
    xl: { width: '100%', height: 32, borderRadius: 0 },
  },
  progress: {
    sm: { width: '100%', height: 4, borderRadius: 2 },
    md: { width: '100%', height: 6, borderRadius: 3 },
    lg: { width: '100%', height: 8, borderRadius: 4 },
  },
  timeline: {
    dot: { width: 12, height: 12, borderRadius: 6 },
    line: { width: 2, height: '100%', borderRadius: 1 },
    connector: { width: 2, height: 20, borderRadius: 1 },
  },
  modal: {
    sm: { width: '85%', height: 200, borderRadius: 20 },
    md: { width: '90%', height: 300, borderRadius: 24 },
    lg: { width: '95%', height: 400, borderRadius: 24 },
    full: { width: '100%', height: '100%', borderRadius: 0 },
  },
  toast: {
    sm: { width: 200, height: 48, borderRadius: 12 },
    md: { width: 280, height: 56, borderRadius: 14 },
    lg: { width: 320, height: 64, borderRadius: 16 },
  },
  sheet: {
    sm: { width: '100%', height: 200, borderRadius: 20 },
    md: { width: '100%', height: 300, borderRadius: 24 },
    lg: { width: '100%', height: 400, borderRadius: 24 },
    xl: { width: '100%', height: 500, borderRadius: 24 },
    full: { width: '100%', height: '100%', borderRadius: 0 },
  },
  navigation: {
    tabBar: { width: '100%', height: 80, borderRadius: 0 },
    header: { width: '100%', height: 56, borderRadius: 0 },
    backButton: { width: 40, height: 40, borderRadius: 20 },
  },
  search: {
    bar: { width: '100%', height: 48, borderRadius: 12 },
    input: { width: '100%', height: 44, borderRadius: 10 },
  },
  filter: {
    chip: { width: 72, height: 32, borderRadius: 16 },
    bar: { width: '100%', height: 40, borderRadius: 0 },
  },
  stat: {
    card: { width: '45%', height: 72, borderRadius: 14 },
    icon: { width: 40, height: 40, borderRadius: 12 },
    value: { width: '60%', height: 24, borderRadius: 3 },
    label: { width: '80%', height: 12, borderRadius: 3 },
  },
} as const;

export const skeletonAnimation = {
  duration: 1200,
  easing: 'ease-in-out',
  baseOpacity: 0.6,
  highlightOpacity: 0.3,
  pulseDuration: 1000,
  shimmerDuration: 1500,
} as const;

export type SkeletonSizes = typeof skeletonSizes;
export type SkeletonAnimation = typeof skeletonAnimation;

export const getSkeletonTheme = (isDark: boolean) => ({
  colors: isDark ? skeletonTokens.dark : skeletonTokens.light,
  sizes: skeletonSizes,
  animation: skeletonAnimation,
});

export const createSkeletonStyle = (sizeKey: keyof typeof skeletonSizes, variant?: string, overrides?: Record<string, any>) => {
  const sizeConfig = skeletonSizes[sizeKey] as any;
  if (!sizeConfig) return {};
  
  const variantConfig = variant && sizeConfig[variant] 
    ? sizeConfig[variant] 
    : sizeConfig;
  
  return {
    width: variantConfig?.width,
    height: variantConfig?.height,
    borderRadius: variantConfig?.borderRadius,
    ...overrides,
  };
};

