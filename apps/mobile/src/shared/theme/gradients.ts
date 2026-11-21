export const gradients = {
  primary: ['#172554', '#4F46E5', '#0EA5E9'],
  secondary: ['#064E3B', '#0F766E', '#14B8A6'],
  success: ['#14532D', '#15803D', '#22C55E'],
  warning: ['#78350F', '#B45309', '#F59E0B'],
  danger: ['#7F1D1D', '#B91C1C', '#F43F5E'],
  info: ['#0C4A6E', '#0369A1', '#38BDF8'],
  dark: ['#070B14', '#111827', '#253149'],
  grey: ['#F8FAFC', '#EAECF0'],

  
  resident: ['#172554', '#4F46E5', '#0EA5E9'],
  guard: ['#064E3B', '#0F766E', '#14B8A6'],
  admin: ['#0F172A', '#1D4ED8', '#38BDF8'],
  treasurer: ['#78350F', '#B7791F', '#F59E0B'],
  facility: ['#312E81', '#7C3AED', '#A855F7'],
  superAdmin: ['#111827', '#BE123C', '#F97316'],
} as const;

export type Gradients = typeof gradients;
export type GradientToken = keyof Gradients;
