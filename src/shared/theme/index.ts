import { lightTheme } from './lightTheme';

export { palette } from './colors';
export { lightPalette, darkPalette } from './colors';
export type { Palette, PaletteColor, ColorToken } from './colors';
export { semanticColors } from './semanticColors';
export type { SemanticColors } from './semanticColors';
export { statusColors } from './statusColors';
export type { StatusTone } from './statusColors';
export { Typography, typographyScale } from './typography';
export type { TypographyScale, TypographyToken, TextStyleToken } from './typography';
export { Spacing, spacingScale } from './spacing';
export type { SpacingScale, SpacingToken, SpacingScaleToken } from './spacing';
export { Radius, radiusScale } from './radius';
export type { RadiusScale, RadiusToken, RadiusScaleToken } from './radius';
export { Shadows, shadowPresets } from './shadows';
export type { ShadowPresets, ShadowToken, ShadowPresetsToken } from './shadows';
export { Layout, layoutScale } from './layout';
export type { LayoutScale } from './layout';
export { zIndex, zIndexScale } from './zIndex';
export type { ZIndexScale, ZIndexToken } from './zIndex';
export { elevation } from './elevation';
export type { Elevation } from './elevation';
export type { ThemeColors, AppTheme } from './theme.types';
export { lightTheme } from './lightTheme';
export { darkTheme } from './darkTheme';
export { residentColors } from './residentColors';
export type { ResidentColorToken } from './residentColors';
export { appTheme } from './appTheme';
export {
  societySemanticLight,
  societySemanticDark,
  societyBorderWidths,
  societyTouch,
  societyNavigation,
  societyContent,
  societyIcons,
  societyMotion,
  societySkeletonTokens,
} from './societyTheme';
export type {
  SocietySemanticColors,
  SocietyBorderWidths,
  SocietyTouch,
  SocietyNavigation,
  SocietyContent,
  SocietySkeletonTokens,
} from './societyTheme';
export { gradients } from './gradients';
export type { Gradients, GradientToken } from './gradients';
export { Motion, motionTokens, MotionIntent } from './motion';
export type { MotionTokens, MotionDurationToken, MotionStaggerToken } from './motion';

export { ImageTokens, imageTokens } from './imageTokens';
export type { ImageTokenScale } from './imageTokens';
export { imageAssets } from './imageAssets';
export type { ImageAssets } from './imageAssets';
export { ambientGradients, getTimeOfDay } from './ambientGradients';
export type { AmbientGradientScheme, TimeOfDay } from './ambientGradients';
export { IconTokens, iconTokens } from './iconTokens';
export type { IconTokenScale } from './iconTokens';
export { roleTheme, getRoleTheme } from './roleTheme';
export type { RoleThemeKey } from './roleTheme';
export { ThemeProvider, useThemeContext } from './ThemeProvider';
export { useAppTheme } from './useAppTheme';

export const Colors = lightTheme.colors;

export * from './colorPalette';
export * from './semanticTokens';
export * from './roleColorTokens';
export * from './navigationTokens';
export * from './spacingTokens';
export * from './typographyTokens';
export * from './radiusTokens';
export * from './shadowTokens';
