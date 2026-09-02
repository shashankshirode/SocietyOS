export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export const ambientGradients = {
  morning: {
    start: '#F59E0B',
    end: '#D97706',
    soft: ['#FEF3C7', '#FDE68A', '#FCD34D'],
    header: ['#78350F', '#B45309', '#D97706'],
    accent: '#F59E0B',
    badgeText: '#92400E',
    badgeBg: '#FEF3C7',
    icon: 'sunny-outline',
  },
  day: {
    start: '#0284C7',
    end: '#0369A1',
    soft: ['#E0F2FE', '#BAE6FD', '#7DD3FC'],
    header: ['#0C4A6E', '#0284C7', '#38BDF8'],
    accent: '#0284C7',
    badgeText: '#075985',
    badgeBg: '#E0F2FE',
    icon: 'partly-sunny-outline',
  },
  evening: {
    start: '#6366F1',
    end: '#4338CA',
    soft: ['#EEF2FF', '#E0E7FF', '#C7D2FE'],
    header: ['#312E81', '#4F46E5', '#818CF8'],
    accent: '#6366F1',
    badgeText: '#3730A3',
    badgeBg: '#EEF2FF',
    icon: 'cloud-outline',
  },
  night: {
    start: '#1E293B',
    end: '#0F172A',
    soft: ['#334155', '#1E293B', '#0F172A'],
    header: ['#020617', '#0F172A', '#1E293B'],
    accent: '#38BDF8',
    badgeText: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    icon: 'moon-outline',
  },
} as const;

export type AmbientGradientScheme = typeof ambientGradients;
