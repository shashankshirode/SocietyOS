import { StyleSheet } from 'react-native';
import { resolveResidentTabBarLayout } from '../../navigation/useResidentTabBarLayout';

describe('Resident dashboard cross-platform layout contract', () => {
  it('keeps iOS phone tab spacing tied to the safe-area inset', () => {
    const result = resolveResidentTabBarLayout(390, 0, 'ios');
    const tabBarStyle = StyleSheet.flatten(result.tabBarStyle);

    expect(result.isTabletDock).toBe(false);
    expect(tabBarStyle).toMatchObject({ paddingBottom: 0 });
  });

  it('keeps Android phone tab spacing above the minimum touch-safe inset', () => {
    const result = resolveResidentTabBarLayout(390, 0, 'android');
    const tabBarStyle = StyleSheet.flatten(result.tabBarStyle);

    expect(result.isTabletDock).toBe(false);
    expect(tabBarStyle).toMatchObject({ paddingBottom: 8 });
  });

  it('uses the centered tablet dock consistently across supported platforms', () => {
    const result = resolveResidentTabBarLayout(1200, 0, 'ios');
    const tabBarStyle = StyleSheet.flatten(result.tabBarStyle);

    expect(result.isTabletDock).toBe(true);
    expect(tabBarStyle).toMatchObject({ width: 720, left: 240 });
  });
});
