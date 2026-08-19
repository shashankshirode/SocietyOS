import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { SosCommandDockLayoutMode } from '../data/sosCommand.types';
import { getAppPlatform, type AppPlatform } from '../../../../shared/platform';
import { resolveResidentTabBarObstruction } from '../../navigation/useResidentTabBarLayout';

export const DOCK_LAYOUT_CONSTANTS = {
  minimumBottomSpacing: 20,
  minimumEdgeSpacing: 16,
  maximumDockWidth: 340,
  actionTileHeight: 56,
  dockVerticalGap: 12,
};

export function resolveSosCommandDockLayout(
  width: number,
  height: number,
  insets: EdgeInsets,
  platformOS: AppPlatform,
  options?: { isTabBarHidden?: boolean },
) {
  let mode: SosCommandDockLayoutMode = 'anchoredDock';
  if (width >= 768) {
    mode = 'tabletDock';
  } else if (height < 680) {
    mode = 'compactTray';
  }

  const tabBarObstruction = resolveResidentTabBarObstruction(width, insets.bottom, platformOS);
  const isTabBarHidden = options?.isTabBarHidden ?? false;
  const bottomOffset = isTabBarHidden
    ? Math.max(insets.bottom, 0) + DOCK_LAYOUT_CONSTANTS.minimumBottomSpacing
    : tabBarObstruction + DOCK_LAYOUT_CONSTANTS.minimumBottomSpacing;
  const rightOffset = Math.max(insets.right, 0) + DOCK_LAYOUT_CONSTANTS.minimumEdgeSpacing;

  return {
    mode,
    bottomOffset,
    rightOffset,
    width,
    height,
    insets,
    tabBarObstruction,
    constants: DOCK_LAYOUT_CONSTANTS,
  };
}

export function useSosCommandDockLayout(options?: { isTabBarHidden?: boolean }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return resolveSosCommandDockLayout(width, height, insets, getAppPlatform(), options);
}
export default useSosCommandDockLayout;
