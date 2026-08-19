import { residentColors } from '../../shared/theme/residentColors';



export const residentSemanticLight = {
  background: residentColors.lightCanvas,
  surface: residentColors.lightSurface,
  surfaceRaised: residentColors.lightElevatedSurface,
  surfaceTint: '#EDF1F8',
  accent: residentColors.brandIndigo,
  accentSecondary: residentColors.brandCobalt,
  accentSoft: '#E8E5FB',
  accentSecondarySoft: '#DBEEFE',
  success: residentColors.success,
  successSoft: '#DCFCE7',
  warning: residentColors.warning,
  warningSoft: '#FEF3C7',
  danger: residentColors.danger,
  dangerSoft: '#FEE2E2',
  info: residentColors.information,
  infoSoft: '#E0F2FE',
  textPrimary: '#101828',
  textSecondary: '#475467',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',
  border: '#E2E6EE',
  borderStrong: '#CBD2DD',
  goldHighlight: '#B7791F',
  goldSoft: '#FEF9C3',
} as const;

export const residentSemanticDark = {
  background: residentColors.darkCanvas,
  surface: residentColors.darkSurface,
  surfaceRaised: residentColors.darkElevatedSurface,
  surfaceTint: '#1E293B',
  accent: '#9DA5FF',
  accentSecondary: '#38BDF8',
  accentSoft: '#1E1B4B',
  accentSecondarySoft: '#082F49',
  success: '#5BD39A',
  successSoft: '#052E16',
  warning: '#F0B85A',
  warningSoft: '#451A03',
  danger: '#FF8588',
  dangerSoft: '#450A0A',
  info: '#38BDF8',
  infoSoft: '#082F49',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  border: '#253149',
  borderStrong: '#334155',
  goldHighlight: '#FBBF24',
  goldSoft: '#451A03',
} as const;

export type ResidentSemanticTokens = typeof residentSemanticLight;
