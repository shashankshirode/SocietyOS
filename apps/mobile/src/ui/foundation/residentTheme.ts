import { useAppTheme } from '../../shared/theme/useAppTheme';
import { residentSemanticLight, residentSemanticDark } from './semanticTokens';
import { societySelectionTokens } from '../../shared/theme/societyTheme';


export function useResidentTheme() {
  const { dark } = useAppTheme();
  const tokens = dark ? residentSemanticDark : residentSemanticLight;

  return {
    ...tokens,
    selectedBackground: dark ? societySelectionTokens.dark.background : societySelectionTokens.light.background,
    selectedForeground: dark ? societySelectionTokens.dark.foreground : societySelectionTokens.light.foreground,
    selectedBorder: dark ? societySelectionTokens.dark.border : societySelectionTokens.light.border,
  };
}


export const residentTheme = {
  background: residentSemanticLight.background,
  surface: residentSemanticLight.surface,
  surfaceRaised: residentSemanticLight.surfaceRaised,
  accent: residentSemanticLight.accent,
  accentSoft: residentSemanticLight.accentSoft,
  accentSecondary: residentSemanticLight.accentSecondary,
  textPrimary: residentSemanticLight.textPrimary,
  textSecondary: residentSemanticLight.textSecondary,
  border: residentSemanticLight.border,
  success: residentSemanticLight.success,
  successSoft: residentSemanticLight.successSoft,
  warning: residentSemanticLight.warning,
  warningSoft: residentSemanticLight.warningSoft,
  danger: residentSemanticLight.danger,
};

export type ResidentTheme = ReturnType<typeof useResidentTheme>;
