import type { NavigationProp, ParamListBase } from '@react-navigation/native';

export type RootResetNavigation = Pick<NavigationProp<ParamListBase>, 'getParent' | 'reset'>;

export function resetToAppModeSelector(navigation: RootResetNavigation): void {
  let rootNavigation = navigation;
  let parent = rootNavigation.getParent();

  while (parent) {
    rootNavigation = parent;
    parent = rootNavigation.getParent();
  }

  rootNavigation.reset({
    index: 0,
    routes: [{ name: 'AppModeSelector' }],
  });
}
