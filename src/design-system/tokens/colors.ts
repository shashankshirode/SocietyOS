export const colorPalette = {
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
    1000: '#000000',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  brand: {
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      950: '#1E1B4B',
    },
    secondary: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
      950: '#052E16',
    },
    accent: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
      950: '#431407',
    },
    teal: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
      950: '#042F2E',
    },
  },
  semantic: {
    success: {
      light: '#15803D',
      lightBg: '#DCFCE7',
      dark: '#4ADE80',
      darkBg: '#052E16',
    },
    warning: {
      light: '#B45309',
      lightBg: '#FEF3C7',
      dark: '#FBBF24',
      darkBg: '#451A03',
    },
    danger: {
      light: '#B91C1C',
      lightBg: '#FEE2E2',
      dark: '#F87171',
      darkBg: '#450A0A',
    },
    info: {
      light: '#0369A1',
      lightBg: '#E0F2FE',
      dark: '#38BDF8',
      darkBg: '#082F49',
    },
  },
  role: {
    resident: {
      light: ['#172554', '#4F46E5', '#0EA5E9'],
      dark: ['#A5B4FC', '#818CF8', '#38BDF8'],
    },
    guard: {
      light: ['#064E3B', '#0F766E', '#14B8A6'],
      dark: ['#6EE7B7', '#2DD4BF', '#5EEAD4'],
    },
    admin: {
      light: ['#0F172A', '#1D4ED8', '#38BDF8'],
      dark: ['#E2E8F0', '#93C5FD', '#BFDBFE'],
    },
    treasurer: {
      light: ['#78350F', '#B7791F', '#F59E0B'],
      dark: ['#FDE68A', '#FBBF24', '#FCD34D'],
    },
    facility: {
      light: ['#312E81', '#7C3AED', '#A855F7'],
      dark: ['#C4B5FD', '#A78BFA', '#D8B4FE'],
    },
    superAdmin: {
      light: ['#111827', '#BE123C', '#F97316'],
      dark: ['#F3F4F6', '#FB7185', '#FDBA74'],
    },
  },
} as const;

export type ColorPalette = typeof colorPalette;

export const lightThemeColors = {
  background: {
    primary: colorPalette.neutral[0],
    secondary: colorPalette.neutral[50],
    tertiary: colorPalette.neutral[100],
    inverse: colorPalette.neutral[900],
  },
  surface: {
    primary: colorPalette.neutral[0],
    secondary: colorPalette.neutral[50],
    tertiary: colorPalette.neutral[100],
    raised: colorPalette.neutral[0],
    overlay: 'rgba(0, 0, 0, 0.5)',
    modal: colorPalette.neutral[0],
  },
  border: {
    subtle: colorPalette.slate[200],
    default: colorPalette.slate[300],
    strong: colorPalette.slate[400],
    focus: colorPalette.brand.primary[500],
    error: colorPalette.semantic.danger.light,
  },
  text: {
    primary: colorPalette.slate[900],
    secondary: colorPalette.slate[600],
    tertiary: colorPalette.slate[400],
    inverse: colorPalette.neutral[0],
    link: colorPalette.brand.primary[600],
    disabled: colorPalette.slate[400],
  },
  icon: {
    primary: colorPalette.slate[600],
    secondary: colorPalette.slate[400],
    inverse: colorPalette.neutral[0],
    disabled: colorPalette.slate[300],
  },
  brand: {
    primary: colorPalette.brand.primary[600],
    primaryHover: colorPalette.brand.primary[700],
    primaryLight: colorPalette.brand.primary[100],
    secondary: colorPalette.brand.secondary[600],
    accent: colorPalette.brand.accent[500],
    teal: colorPalette.brand.teal[600],
  },
  status: {
    success: colorPalette.semantic.success.light,
    successBg: colorPalette.semantic.success.lightBg,
    warning: colorPalette.semantic.warning.light,
    warningBg: colorPalette.semantic.warning.lightBg,
    danger: colorPalette.semantic.danger.light,
    dangerBg: colorPalette.semantic.danger.lightBg,
    info: colorPalette.semantic.info.light,
    infoBg: colorPalette.semantic.info.lightBg,
  },
  role: {
    resident: colorPalette.role.resident.light,
    guard: colorPalette.role.guard.light,
    admin: colorPalette.role.admin.light,
    treasurer: colorPalette.role.treasurer.light,
    facility: colorPalette.role.facility.light,
    superAdmin: colorPalette.role.superAdmin.light,
  },
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.4)',
    modal: 'rgba(0, 0, 0, 0.6)',
    toast: 'rgba(0, 0, 0, 0.8)',
  },
} as const;

export const darkThemeColors = {
  background: {
    primary: colorPalette.slate[950],
    secondary: colorPalette.slate[900],
    tertiary: colorPalette.slate[800],
    inverse: colorPalette.neutral[100],
  },
  surface: {
    primary: colorPalette.slate[900],
    secondary: colorPalette.slate[800],
    tertiary: colorPalette.slate[700],
    raised: colorPalette.slate[800],
    overlay: 'rgba(0, 0, 0, 0.7)',
    modal: colorPalette.slate[800],
  },
  border: {
    subtle: colorPalette.slate[700],
    default: colorPalette.slate[600],
    strong: colorPalette.slate[500],
    focus: colorPalette.brand.primary[400],
    error: colorPalette.semantic.danger.dark,
  },
  text: {
    primary: colorPalette.neutral[100],
    secondary: colorPalette.slate[300],
    tertiary: colorPalette.slate[500],
    inverse: colorPalette.slate[900],
    link: colorPalette.brand.primary[400],
    disabled: colorPalette.slate[600],
  },
  icon: {
    primary: colorPalette.slate[300],
    secondary: colorPalette.slate[500],
    inverse: colorPalette.slate[900],
    disabled: colorPalette.slate[700],
  },
  brand: {
    primary: colorPalette.brand.primary[400],
    primaryHover: colorPalette.brand.primary[300],
    primaryLight: colorPalette.brand.primary[900],
    secondary: colorPalette.brand.secondary[400],
    accent: colorPalette.brand.accent[400],
    teal: colorPalette.brand.teal[400],
  },
  status: {
    success: colorPalette.semantic.success.dark,
    successBg: colorPalette.semantic.success.darkBg,
    warning: colorPalette.semantic.warning.dark,
    warningBg: colorPalette.semantic.warning.darkBg,
    danger: colorPalette.semantic.danger.dark,
    dangerBg: colorPalette.semantic.danger.darkBg,
    info: colorPalette.semantic.info.dark,
    infoBg: colorPalette.semantic.info.darkBg,
  },
  role: {
    resident: colorPalette.role.resident.dark,
    guard: colorPalette.role.guard.dark,
    admin: colorPalette.role.admin.dark,
    treasurer: colorPalette.role.treasurer.dark,
    facility: colorPalette.role.facility.dark,
    superAdmin: colorPalette.role.superAdmin.dark,
  },
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.6)',
    modal: 'rgba(0, 0, 0, 0.8)',
    toast: 'rgba(20, 20, 20, 0.9)',
  },
} as const;

type RecursiveColorTokens<T> = {
  [K in keyof T]: T[K] extends string ? string : RecursiveColorTokens<T[K]>;
};

export type ThemeColors = RecursiveColorTokens<typeof lightThemeColors>;
export type ColorMode = 'light' | 'dark';

export function getThemeColors(mode: ColorMode): ThemeColors {
  return mode === 'dark' ? darkThemeColors : lightThemeColors;
}