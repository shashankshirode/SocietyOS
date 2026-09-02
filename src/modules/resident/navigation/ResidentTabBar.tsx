import React, { useEffect, useMemo, useState } from 'react';
import { View, Pressable, Platform, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useResidentTabVisibility } from './useResidentTabVisibility';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { SafeText } from '../../../shared/components/SafeText';
import { useReducedMotion } from '../../../shared/motion/useReducedMotion';
import { createBottomStyle, createColorStyle, createDockHorizontalStyle, createLensWidthStyle, createResidentTabBarStyles } from './styles/ResidentTabBar.styles';
import type { AppTheme } from '../../../shared/theme';
import { isResidentPrimaryTabRoute, residentTabIcons } from './residentPrimaryNavigation';
import { IdentityCenterHost } from '../experience/IdentityCenterHost';
import { useKeyboardExperience } from '../experience/KeyboardExperienceContext';

function TabBarItem({
  route,
  label,
  isFocused,
  onPress,
  onLongPress,
  inactiveColor,
  badge,
  theme,
}: {
  route: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  inactiveColor: string;
  badge?: number;
  theme: AppTheme;
}) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const iconConfig = isResidentPrimaryTabRoute(route) ? residentTabIcons[route] : residentTabIcons.HomeTab;
  const iconName = isFocused ? iconConfig.filled : iconConfig.outline;
  const styles = useMemo(() => createResidentTabBarStyles(theme), [theme]);
  const color = isFocused ? theme.semantic.text.primary : inactiveColor;

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reducedMotion) {
      scale.value = withTiming(theme.motion.scale.active, { duration: theme.navigation.motionDuration });
    }
  };

  const handlePressOut = () => {
    if (!reducedMotion) {
      scale.value = withTiming(1, { duration: theme.navigation.motionDuration });
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
      style={styles.tabItem}
    >
      <Animated.View style={animatedIconStyle}>
        <View>
          <Ionicons
            name={iconName as keyof typeof Ionicons.glyphMap}
            size={22}
            color={color}
          />
          {badge !== undefined && badge > 0 && (
            <View style={styles.badge}>
              <SafeText variant="tiny" style={styles.badgeText}>
                {badge > 99 ? '99+' : badge}
              </SafeText>
            </View>
          )}
        </View>
      </Animated.View>
      <SafeText
        variant="tiny"
        style={[styles.label, createColorStyle(color)]}
        numberOfLines={1}
      >
        {label}
      </SafeText>
    </Pressable>
  );
}

export function SocietyNavigationDock(props: BottomTabBarProps) {
  const hideTabBar = useResidentTabVisibility(props.state);
  const activeRoute = props.state.routes[props.state.index];
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const theme = useAppTheme();
  const { colors } = theme;
  const styles = useMemo(() => createResidentTabBarStyles(theme), [theme]);
  const reducedMotion = useReducedMotion();
  const keyboard = useKeyboardExperience();
  const [dockContentWidth, setDockContentWidth] = useState(0);
  const lensX = useSharedValue(0);
  const primaryRoutes = props.state.routes.filter((route) => isResidentPrimaryTabRoute(route.name));
  const activePrimaryIndex = Math.max(0, primaryRoutes.findIndex((route) => route.key === activeRoute?.key));
  const itemWidth = primaryRoutes.length > 0 ? dockContentWidth / primaryRoutes.length : 0;

  useEffect(() => {
    const nextX = activePrimaryIndex * itemWidth;
    lensX.value = reducedMotion ? nextX : withTiming(nextX, { duration: theme.navigation.motionDuration });
  }, [activePrimaryIndex, itemWidth, lensX, reducedMotion, theme.navigation.motionDuration]);

  const lensStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lensX.value }],
  }));

  const handleDockLayout = (event: LayoutChangeEvent) => {
    setDockContentWidth(Math.max(0, event.nativeEvent.layout.width - theme.navigation.internalPadding * 2));
  };

  if (hideTabBar || keyboard.isOpen || !activeRoute || !isResidentPrimaryTabRoute(activeRoute.name)) {
    return <IdentityCenterHost navigation={props.navigation} />;
  }

  const { state, descriptors, navigation } = props;
  const bottomOffset = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;

  return (<>
    <IdentityCenterHost navigation={navigation} />
    <View
      onLayout={handleDockLayout}
      style={[
        styles.container,
        createDockHorizontalStyle(screenWidth, theme.navigation.capsuleInset, theme.navigation.tabletMaxWidth),
        createBottomStyle(bottomOffset + theme.navigation.dockBottomGap),
      ]}
    >
      {itemWidth > 0 ? <Animated.View pointerEvents="none" style={[styles.activeLens, createLensWidthStyle(itemWidth), lensStyle]} /> : null}
      {state.routes.map((route, index) => {
        if (!isResidentPrimaryTabRoute(route.name)) return null;
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
            inactiveColor={colors.tabBarInactive}
            theme={theme}
            {...(badge !== undefined ? { badge } : {})}
          />
        );
      })}
    </View>
  </>);
}

export const ResidentTabBar = SocietyNavigationDock;

export default ResidentTabBar;
