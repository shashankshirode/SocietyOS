import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ResidentTabBarLayout } from './residentTabBar.types';
import { getAppPlatform, type AppPlatform } from '../../../shared/platform';
import { societyNavigation } from '../../../shared/theme/societyTheme';

export function resolveResidentTabBarLayout(
  width: number,
  bottomInset: number,
  platformOS: AppPlatform
): ResidentTabBarLayout {
  const isTabletDock = width >= 768;
  const phoneBottomPadding = platformOS === 'android' ? Math.max(bottomInset, 8) : bottomInset;

  if (!isTabletDock) {
    return {
      isTabletDock,
      tabBarStyle: {
        height: 56 + phoneBottomPadding,
        paddingBottom: phoneBottomPadding,
      },
    };
  }

  const dockWidth = Math.min(Math.max(width * 0.58, societyNavigation.tabletMaxWidth), 840);
  const dockBottom = Math.max(bottomInset, 12);

  return {
    isTabletDock,
    tabBarStyle: {
      position: 'absolute',
      width: dockWidth,
      left: (width - dockWidth) / 2,
      bottom: dockBottom,
      height: societyNavigation.capsuleHeight,
      paddingBottom: societyNavigation.internalPadding,
      paddingTop: societyNavigation.internalPadding,
      borderRadius: 28,
      borderWidth: StyleSheet.hairlineWidth,
    },
  };
}

export function resolveResidentTabBarObstruction(
  width: number,
  bottomInset: number,
  platformOS: AppPlatform,
): number {
  if (width >= 768) {
    return societyNavigation.capsuleHeight + Math.max(bottomInset, 12) + societyNavigation.dockBottomGap;
  }

  const phoneBottomPadding = platformOS === 'android' ? Math.max(bottomInset, 8) : bottomInset;
  return societyNavigation.capsuleHeight + societyNavigation.dockBottomGap + phoneBottomPadding;
}

export function useResidentTabBarLayout(): ResidentTabBarLayout {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    return resolveResidentTabBarLayout(width, insets.bottom, getAppPlatform());
  }, [insets.bottom, width]);
}
