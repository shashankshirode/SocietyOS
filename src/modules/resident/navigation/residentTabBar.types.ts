import type { Animated, StyleProp, ViewStyle } from 'react-native';

export type ResidentTabBarLayout = {
  isTabletDock: boolean;
  tabBarStyle: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};
