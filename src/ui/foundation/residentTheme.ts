import { useAppTheme } from '../../shared/theme/useAppTheme';
import { residentSemanticLight, residentSemanticDark } from './semanticTokens';


export function useResidentTheme() {
  const { dark } = useAppTheme();
  const tokens = dark ? residentSemanticDark : residentSemanticLight;

  return tokens;
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
