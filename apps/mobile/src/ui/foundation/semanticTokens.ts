import { societySemanticDark, societySemanticLight } from '../../shared/theme/societyTheme';



export const residentSemanticLight = {
  background: societySemanticLight.surface.canvas,
  surface: societySemanticLight.surface.base,
  surfaceRaised: societySemanticLight.surface.raised,
  surfaceTint: societySemanticLight.surface.focus,
  accent: societySemanticLight.accent.moss,
  accentSecondary: societySemanticLight.accent.sage,
  accentSoft: societySemanticLight.surface.focus,
  accentSecondarySoft: societySemanticLight.status.infoSurface,
  success: societySemanticLight.status.success,
  successSoft: societySemanticLight.status.successSurface,
  warning: societySemanticLight.status.warning,
  warningSoft: societySemanticLight.status.warningSurface,
  danger: societySemanticLight.status.danger,
  dangerSoft: societySemanticLight.status.dangerSurface,
  info: societySemanticLight.status.info,
  infoSoft: societySemanticLight.status.infoSurface,
  textPrimary: societySemanticLight.text.primary,
  textSecondary: societySemanticLight.text.secondary,
  textMuted: societySemanticLight.text.tertiary,
  textInverse: societySemanticLight.text.inverse,
  border: societySemanticLight.border.default,
  borderStrong: societySemanticLight.border.strong,
  goldHighlight: societySemanticLight.accent.amber,
  goldSoft: societySemanticLight.status.warningSurface,
} as const;

export const residentSemanticDark = {
  background: societySemanticDark.surface.canvas,
  surface: societySemanticDark.surface.base,
  surfaceRaised: societySemanticDark.surface.raised,
  surfaceTint: societySemanticDark.surface.focus,
  accent: societySemanticDark.accent.moss,
  accentSecondary: societySemanticDark.accent.sage,
  accentSoft: societySemanticDark.surface.focus,
  accentSecondarySoft: societySemanticDark.status.infoSurface,
  success: societySemanticDark.status.success,
  successSoft: societySemanticDark.status.successSurface,
  warning: societySemanticDark.status.warning,
  warningSoft: societySemanticDark.status.warningSurface,
  danger: societySemanticDark.status.danger,
  dangerSoft: societySemanticDark.status.dangerSurface,
  info: societySemanticDark.status.info,
  infoSoft: societySemanticDark.status.infoSurface,
  textPrimary: societySemanticDark.text.primary,
  textSecondary: societySemanticDark.text.secondary,
  textMuted: societySemanticDark.text.tertiary,
  textInverse: societySemanticDark.text.inverse,
  border: societySemanticDark.border.default,
  borderStrong: societySemanticDark.border.strong,
  goldHighlight: societySemanticDark.accent.amber,
  goldSoft: societySemanticDark.status.warningSurface,
} as const;

export type ResidentSemanticTokens = typeof residentSemanticLight;
