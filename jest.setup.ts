import '@testing-library/react-native/dist/matchers/extend-expect';
import type { ReactNode } from 'react';

import { NativeModules } from 'react-native';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

NativeModules.StatusBarManager = {
  setColor: jest.fn(),
  setStyle: jest.fn(),
  setHidden: jest.fn(),
  setNetworkActivityIndicatorVisible: jest.fn(),
  getHeight: jest.fn((cb: any) => cb && cb({ height: 44 })),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

jest.mock(
  '@react-native-async-storage/async-storage',
  () => jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'en-IN' }],
}));

jest.mock('react-native-worklets', () => ({
  createWorklet: (fn: any) => fn,
  scheduleOnJS: (fn: any) => fn,
  scheduleOnUI: (fn: any) => fn,
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, ScrollView, FlatList } = require('react-native');

  const createChainableAnimation = () => {
    const builder: any = {
      duration: () => builder,
      delay: () => builder,
      springify: () => builder,
      damping: () => builder,
      mass: () => builder,
      stiffness: () => builder,
      easing: () => builder,
      withCallback: () => builder,
    };
    return builder;
  };

  return {
    __esModule: true,
    default: {
      View,
      Text,
      ScrollView,
      FlatList,
      call: () => undefined,
      createAnimatedComponent: (c: any) => c,
    },
    View,
    Text,
    ScrollView,
    FlatList,
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: (fn: any) => fn() || {},
    useReducedMotion: () => false,
    withTiming: (toValue: any) => toValue,
    withRepeat: (val: any) => val,
    withSequence: (...vals: any[]) => vals[0],
    withDelay: (_d: any, val: any) => val,
    withSpring: (toValue: any) => toValue,
    cancelAnimation: () => {},
    Easing: {
      inOut: () => () => 0,
      in: () => () => 0,
      out: () => () => 0,
      bezier: () => () => 0,
      ease: () => 0,
      linear: () => 0,
    },
    FadeIn: createChainableAnimation(),
    FadeOut: createChainableAnimation(),
    FadeInUp: createChainableAnimation(),
    FadeInDown: createChainableAnimation(),
    FadeOutUp: createChainableAnimation(),
    FadeOutDown: createChainableAnimation(),
    SlideInRight: createChainableAnimation(),
    SlideInLeft: createChainableAnimation(),
    SlideOutRight: createChainableAnimation(),
    SlideOutLeft: createChainableAnimation(),
    Layout: createChainableAnimation(),
  };
});

jest.mock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
    SafeAreaView: ({ children }: { children: ReactNode }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const ReactRuntime = jest.requireActual<typeof import('react')>('react');
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');

  function MockIonicon({ name, accessibilityLabel }: { name: string; accessibilityLabel?: string }) {
    return ReactRuntime.createElement(Text, { accessibilityLabel: accessibilityLabel ?? name }, '');
  }

  MockIonicon.glyphMap = {};
  return {
    __esModule: true,
    default: MockIonicon,
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});
