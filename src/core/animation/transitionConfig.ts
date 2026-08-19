import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const screenTransitionPresets: Record<'slideAndFade' | 'fadeThrough', NativeStackNavigationOptions> = {
  slideAndFade: {
    gestureEnabled: true,
    animation: 'slide_from_right',
  },
  fadeThrough: {
    gestureEnabled: false,
    animation: 'fade',
  },
};

