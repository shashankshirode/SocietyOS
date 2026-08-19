export type RoleThemeKey = 'resident' | 'guard' | 'admin' | 'treasurer' | 'facility' | 'superAdmin';

export const roleTheme: Record<RoleThemeKey, { accent: string; soft: string; text: string; gradient: readonly string[] }> = {
  resident: { accent: '#4F46E5', soft: '#E0E7FF', text: '#3730A3', gradient: ['#172554', '#4F46E5', '#0EA5E9'] },
  guard: { accent: '#0F766E', soft: '#CCFBF1', text: '#115E59', gradient: ['#064E3B', '#0F766E', '#14B8A6'] },
  admin: { accent: '#1D4ED8', soft: '#DBEAFE', text: '#1E40AF', gradient: ['#0F172A', '#1D4ED8', '#38BDF8'] },
  treasurer: { accent: '#B7791F', soft: '#FEF3C7', text: '#92400E', gradient: ['#78350F', '#B7791F', '#F59E0B'] },
  facility: { accent: '#7C3AED', soft: '#EDE9FE', text: '#6D28D9', gradient: ['#312E81', '#7C3AED', '#A855F7'] },
  superAdmin: { accent: '#BE123C', soft: '#FFE4E6', text: '#9F1239', gradient: ['#111827', '#BE123C', '#F97316'] },
};

export const getRoleTheme = (role: RoleThemeKey) => roleTheme[role];
