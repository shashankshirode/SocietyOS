import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useResidentTabVisibility } from '../../modules/resident/navigation/useResidentTabVisibility';
import { IdentityCenterHost } from '../../modules/resident/experience/IdentityCenterHost';
import { useKeyboardExperience } from '../../modules/resident/experience/KeyboardExperienceContext';
import {
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../shared/theme/typography';

export function ResidentBottomNavigation(props: BottomTabBarProps) {
  const { state, navigation } = props;
  const hideTabBar = useResidentTabVisibility(state);
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const keyboard = useKeyboardExperience();

  if (hideTabBar || keyboard.isOpen) {
    return <IdentityCenterHost navigation={navigation} />;
  }

  const activeRoute = state.routes[state.index];
  const activeRouteName = activeRoute?.name || 'HomeTab';
  const childRoute = (activeRoute?.state as { routes?: { name?: string }[]; index?: number } | undefined)?.routes?.[activeRoute?.state?.index ?? 0]?.name;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 12);

  const handleTabPress = (targetRoute: string) => {
    if (targetRoute === 'ProfileTab') {
      navigation.navigate('HomeTab', {
        screen: 'ProfileTab',
        params: { screen: 'ProfileHome' },
      });
      return;
    }
    navigation.navigate(targetRoute);
  };

  const isYouActive = activeRouteName === 'ProfileTab' || childRoute === 'ProfileTab' || activeRouteName === 'ChatTab';
  const isHomeActive = (activeRouteName === 'HomeTab' && childRoute !== 'ProfileTab') || !activeRouteName;
  const isUpdatesActive = activeRouteName === 'ActivityTab';
  const isActionsActive = activeRouteName === 'ServicesTab';
  const isCommunityActive = activeRouteName === 'CommunityTab';

  const dockWidth = screenWidth;
  const dockHeight = 70 + bottomPadding;

  return (
    <>
      <IdentityCenterHost navigation={navigation} />
      <View
        style={[styles.dockContainer, { width: dockWidth, height: dockHeight }]}
        accessibilityRole="tablist"
      >
        {/* Deep Forest Green Organic Curved Surface */}
        <Svg
          width={dockWidth}
          height={dockHeight}
          viewBox={`0 0 ${dockWidth} ${dockHeight}`}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="none"
        >
          <Path
            d={`M 0 22 
               C ${dockWidth * 0.22} 22, ${dockWidth * 0.32} 16, ${dockWidth * 0.38} 8
               C ${dockWidth * 0.42} 2, ${dockWidth * 0.46} 0, ${dockWidth * 0.5} 0
               C ${dockWidth * 0.54} 0, ${dockWidth * 0.58} 2, ${dockWidth * 0.62} 8
               C ${dockWidth * 0.68} 16, ${dockWidth * 0.78} 22, ${dockWidth} 22
               L ${dockWidth} ${dockHeight}
               L 0 ${dockHeight} Z`}
            fill="#064F45"
          />
        </Svg>

        <View style={[styles.tabsRow, { paddingBottom: bottomPadding }]}>
          {/* 1. Home */}
          <Pressable
            onPress={() => handleTabPress('HomeTab')}
            style={styles.tabItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isHomeActive }}
            accessibilityLabel="Home"
          >
            <View style={styles.iconWrapper}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill={isHomeActive ? '#FFFFFF' : 'none'}>
                <Path
                  d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                  stroke={isHomeActive ? '#FFFFFF' : '#8CA39C'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              {isHomeActive && <View style={styles.activeDot} />}
            </View>
            <Text style={[styles.tabLabel, isHomeActive && styles.tabLabelActive]}>
              Home
            </Text>
          </Pressable>

          {/* 2. Updates */}
          <Pressable
            onPress={() => handleTabPress('ActivityTab')}
            style={styles.tabItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isUpdatesActive }}
            accessibilityLabel="Updates"
          >
            <View style={styles.iconWrapper}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                  stroke={isUpdatesActive ? '#FFFFFF' : '#8CA39C'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              {isUpdatesActive && <View style={styles.activeDot} />}
            </View>
            <Text style={[styles.tabLabel, isUpdatesActive && styles.tabLabelActive]}>
              Updates
            </Text>
          </Pressable>

          {/* 3. Central Actions Button */}
          <View style={styles.centerActionContainer}>
            <Pressable
              onPress={() => handleTabPress('ServicesTab')}
              style={({ pressed }) => [
                styles.centerActionButton,
                isActionsActive && styles.centerActionButtonActive,
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Actions"
            >
              {/* 4-point Sparkle Icon */}
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
                  stroke={isActionsActive ? '#10201D' : '#FFFFFF'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={isActionsActive ? '#10201D' : 'none'}
                />
                <Circle cx="18" cy="5" r="1.2" fill={isActionsActive ? '#10201D' : '#FFFFFF'} />
                <Circle cx="6" cy="18" r="1.2" fill={isActionsActive ? '#10201D' : '#FFFFFF'} />
              </Svg>
            </Pressable>
            <Text style={[styles.actionLabel, isActionsActive && styles.actionLabelActive]}>
              Actions
            </Text>
          </View>

          {/* 4. Community */}
          <Pressable
            onPress={() => handleTabPress('CommunityTab')}
            style={styles.tabItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isCommunityActive }}
            accessibilityLabel="Community"
          >
            <View style={styles.iconWrapper}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                  stroke={isCommunityActive ? '#FFFFFF' : '#8CA39C'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke={isCommunityActive ? '#FFFFFF' : '#8CA39C'}
                  strokeWidth={2}
                />
                <Path
                  d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  stroke={isCommunityActive ? '#FFFFFF' : '#8CA39C'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              {isCommunityActive && <View style={styles.activeDot} />}
            </View>
            <Text style={[styles.tabLabel, isCommunityActive && styles.tabLabelActive]}>
              Community
            </Text>
          </Pressable>

          {/* 5. You */}
          <Pressable
            onPress={() => handleTabPress('ProfileTab')}
            style={styles.tabItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isYouActive }}
            accessibilityLabel="You"
          >
            <View style={styles.iconWrapper}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke={isYouActive ? '#FFFFFF' : '#8CA39C'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke={isYouActive ? '#FFFFFF' : '#8CA39C'}
                  strokeWidth={2}
                />
              </Svg>
              {isYouActive && <View style={styles.activeDot} />}
            </View>
            <Text style={[styles.tabLabel, isYouActive && styles.tabLabelActive]}>
              You
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    overflow: 'visible',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingTop: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FAF8F1',
  },
  tabLabel: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 11,
    color: '#8CA39C',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  centerActionContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -22,
    paddingHorizontal: 4,
  },
  centerActionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0D6458',
    borderWidth: 2,
    borderColor: '#1C7A6D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  centerActionButtonActive: {
    backgroundColor: '#C5A880',
    borderColor: '#FAF8F1',
  },
  actionLabel: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 11,
    color: '#8CA39C',
    marginTop: 4,
    fontWeight: '500',
  },
  actionLabelActive: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
