import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ResidentTabBarLayout } from './residentTabBar.types';
import { getAppPlatform, type AppPlatform } from '../../../shared/platform';

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

  const dockWidth = Math.min(Math.max(width * 0.58, 720), 840);
  const dockBottom = Math.max(bottomInset, 12);

  return {
    isTabletDock,
    tabBarStyle: {
      position: 'absolute',
      width: dockWidth,
      left: (width - dockWidth) / 2,
      bottom: dockBottom,
      height: 64,
      paddingBottom: 8,
      paddingTop: 8,
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
    return 64 + Math.max(bottomInset, 12) + 8;
  }

  const phoneBottomPadding = platformOS === 'android' ? Math.max(bottomInset, 8) : bottomInset;
  return 64 + 8 + phoneBottomPadding;
}

export function useResidentTabBarLayout(): ResidentTabBarLayout {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    return resolveResidentTabBarLayout(width, insets.bottom, getAppPlatform());
  }, [insets.bottom, width]);
}
