import React from 'react';
import { RoleAwareAppHeader } from './RoleAwareAppHeader';
import type { HeaderRoleThemeKey } from './headerTheme';

export function getRoleAwareScreenOptions(role: HeaderRoleThemeKey) {
  return ({ navigation, route }: LegacyScreenProps) => {
    const showBack = navigation.canGoBack?.() ?? false;
    const routeTitle = route.name;
    const title = routeTitle
      .replace(/_/g, ' ')
      .replace('Screen', '')
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      header: () => (
        <RoleAwareAppHeader
          role={role}
          title={title}
          showBack={showBack}
          onBack={() => navigation.goBack()}
        />
      ),
    };
  };
}
