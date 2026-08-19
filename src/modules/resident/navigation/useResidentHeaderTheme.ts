import { useMemo } from 'react';
import { roleColorTokens } from '../../../shared/theme/roleColorTokens';
import { navigationTokens } from '../../../shared/theme/navigationTokens';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import type {
  MessageKey,
  ResidentHeaderResolvedTheme,
  ResidentHeaderRoleTokenKey,
  ResidentHeaderVariant,
} from './residentHeader.types';

function resolveRoleTokenKey(roleLabelKey: MessageKey): ResidentHeaderRoleTokenKey {
  if (roleLabelKey.includes('tenant')) {
    return 'RESIDENT_TENANT';
  }

  if (roleLabelKey.includes('family')) {
    return 'RESIDENT_FAMILY';
  }

  return 'RESIDENT_OWNER';
}

export function useResidentHeaderTheme(
  variant: ResidentHeaderVariant,
  roleLabelKey?: MessageKey
): ResidentHeaderResolvedTheme {
  const appTheme = useAppTheme();
  const roleTokenKey = resolveRoleTokenKey(roleLabelKey ?? 'resident.header.roles.owner');

  return useMemo(() => {
    const roleToken = roleColorTokens[roleTokenKey];
    const modeNavigationTokens = appTheme.isDark ? navigationTokens.dark : navigationTokens.light;

    return {
      variant,
      roleTokenKey,
      backgroundColors: roleToken.background,
      accentColor: roleToken.accent,
      textColor: roleToken.text,
      surfaceColor: modeNavigationTokens.headerBackground,
      borderColor: appTheme.colors.border,
      isDark: appTheme.isDark,
    };
  }, [appTheme.colors.border, appTheme.isDark, roleTokenKey, variant]);
}

