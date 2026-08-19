import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useResidentTabVisibility } from './useResidentTabVisibility';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SafeText } from '../../../shared/components/SafeText';
import { useReducedMotion } from '../../../shared/motion/useReducedMotion';

type TabIconName = 'home' | 'people' | 'chatbox-ellipses' | 'card' | 'chatbubbles';

const TAB_ICONS: Record<string, {
  filled: TabIconName;
  outline: `${TabIconName}-outline`;
}> = {
  HomeTab: { filled: 'home', outline: 'home-outline' },
  VisitorTab: { filled: 'people', outline: 'people-outline' },
  ComplaintTab: { filled: 'chatbox-ellipses', outline: 'chatbox-ellipses-outline' },
  BillTab: { filled: 'card', outline: 'card-outline' },
  ChatTab: { filled: 'chatbubbles', outline: 'chatbubbles-outline' },
};

function TabBarItem({
  route,
  label,
  isFocused,
  onPress,
  onLongPress,
  activeColor,
  inactiveColor,
  badge,
}: {
  route: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  activeColor: string;
  inactiveColor: string;
  badge?: number;
}) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const iconConfig = TAB_ICONS[route] ?? TAB_ICONS['HomeTab']!;
  const iconName = isFocused ? iconConfig!.filled : iconConfig!.outline;
  const color = isFocused ? activeColor : inactiveColor;

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
    transform: [{ scaleX: withSpring(isFocused ? 1 : 0, { damping: 18, stiffness: 300 }) }],
  }));

  const handlePressIn = () => {
    if (!reducedMotion) {
      scale.value = withSpring(1.15, { damping: 14, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (!reducedMotion) {
      scale.value = withSpring(1, { damping: 14, stiffness: 400 });
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={tabStyles.tabItem}
    >
      <Animated.View style={animatedIconStyle}>
        <View>
          <Ionicons
            name={iconName as keyof typeof Ionicons.glyphMap}
            size={22}
            color={color}
          />
          {badge !== undefined && badge > 0 && (
            <View style={tabStyles.badge}>
              <SafeText variant="tiny" style={tabStyles.badgeText}>
                {badge > 99 ? '99+' : badge}
              </SafeText>
            </View>
          )}
        </View>
      </Animated.View>
      <SafeText
        variant="tiny"
        style={[tabStyles.label, { color }]}
        numberOfLines={1}
      >
        {label}
      </SafeText>
      <Animated.View style={[tabStyles.activeDot, { backgroundColor: activeColor }, dotStyle]} />
    </Pressable>
  );
}

export function ResidentTabBar(props: BottomTabBarProps) {
  const hideTabBar = useResidentTabVisibility(props.state);
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  if (hideTabBar) {
    return null;
  }

  const { state, descriptors, navigation } = props;
  const bottomOffset = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;

  return (
    <View
      style={[
        tabStyles.container,
        {
          bottom: bottomOffset + 8,
          backgroundColor: colors.tabBarBackground,
          borderColor: colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        if (!descriptor) return null;
        const { options } = descriptor;
        const label = typeof options.tabBarLabel === 'string'
          ? options.tabBarLabel
          : typeof options.title === 'string'
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const rawBadge = options.tabBarBadge;
        const badge = typeof rawBadge === 'number' ? rawBadge : undefined;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.key}
            route={route.name}
            label={label}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            activeColor={colors.tabBarActive}
            inactiveColor={colors.tabBarInactive}
            {...(badge !== undefined ? { badge } : {})}
          />
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    borderRadius: 32,
    borderWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
});

export default ResidentTabBar;
