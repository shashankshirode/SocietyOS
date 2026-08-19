import { darkPalette, lightPalette } from './colors';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const statusColors: Record<'light' | 'dark', Record<StatusTone, { text: string; background: string; border: string }>> = {
  light: {
    success: { text: lightPalette.success, background: lightPalette.successSoft, border: '#BBF7D0' },
    warning: { text: lightPalette.warning, background: lightPalette.warningSoft, border: '#FDE68A' },
    danger: { text: lightPalette.danger, background: lightPalette.dangerSoft, border: '#FECACA' },
    info: { text: lightPalette.info, background: lightPalette.infoSoft, border: '#BAE6FD' },
    neutral: { text: lightPalette.textSecondary, background: lightPalette.surfaceMuted, border: lightPalette.border },
  },
  dark: {
    success: { text: darkPalette.success, background: darkPalette.successSoft, border: '#166534' },
    warning: { text: darkPalette.warning, background: darkPalette.warningSoft, border: '#92400E' },
    danger: { text: darkPalette.danger, background: darkPalette.dangerSoft, border: '#991B1B' },
    info: { text: darkPalette.info, background: darkPalette.infoSoft, border: '#075985' },
    neutral: { text: darkPalette.textSecondary, background: darkPalette.surfaceMuted, border: darkPalette.border },
  },
};
