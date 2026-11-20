import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootTabParamList, HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { ScreenErrorState } from '../../../../ui/states/ScreenErrorState';
import { ScreenLoadingState } from '../../../../ui/states/ScreenLoadingState';
import { useResidentNotifications } from '../data/useResidentNotifications';
import { useCursorPagination, type CursorPage } from '../../../../shared/hooks/useCursorPagination';
import { resolveNotificationDestination } from '../hooks/useNotificationNavigation';
import { ResidentHomeSwitcherSheet } from '../../homeContext/components/ResidentHomeSwitcherSheet';
import { SharedResidentTopBar } from '../../navigation/SharedResidentTopBar';
import { useDateTimePreferences } from '../../../../shared/datetime';
import { resolveResidentTabBarObstruction } from '../../navigation/useResidentTabBarLayout';
import { getAppPlatform } from '../../../../shared/platform';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import {
  createRootStyle,
  createCardSurfaceStyle,
  createTextStyle,
  styles,
} from '../styles/screens/NotificationInboxScreen.styles';

export type NotificationInboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'NotificationInbox'>,
  BottomTabScreenProps<RootTabParamList>
>;

type Props = NotificationInboxScreenProps;

const filterCategories: readonly {
  id: 'ALL' | 'SECURITY' | 'BILLING' | 'COMPLAINTS' | 'NOTICES' | 'COMMUNITY';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'ALL', label: 'All', icon: 'layers-outline' },
  { id: 'SECURITY', label: 'Security', icon: 'shield-checkmark-outline' },
  { id: 'BILLING', label: 'Billing', icon: 'receipt-outline' },
  { id: 'COMPLAINTS', label: 'Complaints', icon: 'construct-outline' },
  { id: 'NOTICES', label: 'Notices', icon: 'megaphone-outline' },
  { id: 'COMMUNITY', label: 'Community', icon: 'people-outline' },
];

const NOTIFICATION_PAGE_SIZE = 15;

export function NotificationInboxScreen({ navigation }: Props) {
  const { semantic } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { activeContext } = useActiveResidentHome();
  const { formatDateTime } = useDateTimePreferences();

  const [selectedCategory, setSelectedCategory] = useState<
    'ALL' | 'SECURITY' | 'BILLING' | 'COMPLAINTS' | 'NOTICES' | 'COMMUNITY'
  >('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [switcherVisible, setSwitcherVisible] = useState(false);

  const {
    notifications: allNotifications,
    unreadCount,
    markAsRead,
    refetch,
    error,
  } = useResidentNotifications();

  const filteredNotifications = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return allNotifications;
    }
    return allNotifications.filter((item) => item.category === selectedCategory);
  }, [allNotifications, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: allNotifications.length,
      SECURITY: 0,
      BILLING: 0,
      COMPLAINTS: 0,
      NOTICES: 0,
      COMMUNITY: 0,
    };
    allNotifications.forEach((item) => {
      const cat = item.category;
      if (typeof cat === 'string' && Object.prototype.hasOwnProperty.call(counts, cat)) {
        const current = counts[cat];
        counts[cat] = (current ?? 0) + 1;
      }
    });
    return counts;
  }, [allNotifications]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const fetchPage = useCallback(
    async (cursor?: string): Promise<CursorPage<typeof filteredNotifications[0]>> => {
      const startIndex = cursor ? parseInt(cursor, 10) : 0;
      const pageItems = filteredNotifications.slice(startIndex, startIndex + NOTIFICATION_PAGE_SIZE);
      const nextCursor =
        startIndex + NOTIFICATION_PAGE_SIZE < filteredNotifications.length
          ? String(startIndex + NOTIFICATION_PAGE_SIZE)
          : undefined;

      const result: CursorPage<typeof filteredNotifications[0]> = {
        items: pageItems,
        hasMore: !!nextCursor,
      };
      if (nextCursor !== undefined) {
        result.nextCursor = nextCursor;
      }
      if (cursor) {
        result.previousCursor = String(Math.max(0, startIndex - NOTIFICATION_PAGE_SIZE));
      }
      return result;
    },
    [filteredNotifications]
  );

  const {
    items: paginatedNotifications,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    loadMore,
    errorMessage: paginationError,
  } = useCursorPagination(fetchPage, [
    activeContext?.dataScopeKey ?? 'unknown',
    selectedCategory,
    filteredNotifications.length,
  ]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isRefreshing) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isRefreshing, loadMore]);

  const handleItemPress = useCallback(
    async (notification: typeof allNotifications[0]) => {
      if (notification.status === 'unread') {
        await markAsRead(notification.id);
      }

      const destination = resolveNotificationDestination(notification);
      if (!destination) {
        return;
      }

      const { tabName, screenName, params } = destination;

      if (tabName === 'HomeTab') {
        navigation.navigate('HomeTab', {
          screen: screenName,
          params,
        } as any);
      } else if (tabName === 'VisitorTab') {
        navigation.navigate('VisitorTab', {
          screen: screenName,
          params,
        } as any);
      } else if (tabName === 'ComplaintTab') {
        navigation.navigate('ComplaintTab', {
          screen: screenName,
          params,
        } as any);
      } else if (tabName === 'BillTab') {
        navigation.navigate('BillTab', {
          screen: screenName,
          params,
        } as any);
      } else if (tabName === 'CommunityTab') {
        navigation.navigate('CommunityTab', {
          screen: screenName,
          params,
        } as any);
      }
    },
    [markAsRead, navigation]
  );

  const getCategoryIconColor = useCallback(
    (category?: string) => {
      switch (category) {
        case 'SECURITY':
          return semantic.status.warning;
        case 'BILLING':
          return semantic.accent.moss;
        case 'COMPLAINTS':
          return semantic.status.danger;
        case 'NOTICES':
          return semantic.accent.lavender;
        case 'COMMUNITY':
          return semantic.accent.moss;
        default:
          return semantic.text.tertiary;
      }
    },
    [semantic]
  );

  const getCategoryBgColor = useCallback(
    (category?: string) => {
      switch (category) {
        case 'SECURITY':
          return semantic.status.warningSurface;
        case 'BILLING':
          return semantic.status.successSurface;
        case 'COMPLAINTS':
          return semantic.status.dangerSurface;
        case 'NOTICES':
          return semantic.surface.soft;
        case 'COMMUNITY':
          return semantic.accent.lavender + '20';
        default:
          return semantic.surface.soft;
      }
    },
    [semantic]
  );

  const bottomInset = resolveResidentTabBarObstruction(
    390,
    insets.bottom,
    getAppPlatform(),
  );

  const renderItem = useCallback(
    ({ item }: { item: typeof allNotifications[0] }) => {
      const isUnread = item.status === 'unread';
      const displayTitle = item.title ?? 'Society Notification';
      const displayDesc = item.description ?? 'Tap to view details regarding this update.';
      const displayCategory = item.category ?? 'SYSTEM';
      const iconColor = getCategoryIconColor(displayCategory);
      const iconBgColor = getCategoryBgColor(displayCategory);

      return (
        <Pressable
          testID={`notification-item-${item.id}`}
          onPress={() => handleItemPress(item)}
          style={[
            styles.card,
            isUnread && styles.cardUnread,
            createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${displayTitle}, ${isUnread ? 'Unread' : 'Read'}`}
          android_ripple={{ color: semantic.accent.moss + '20' }}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
              <Ionicons
                name={
                  displayCategory === 'SECURITY'
                    ? 'shield-checkmark-outline'
                    : displayCategory === 'BILLING'
                    ? 'receipt-outline'
                    : displayCategory === 'COMPLAINTS'
                    ? 'construct-outline'
                    : displayCategory === 'NOTICES'
                    ? 'megaphone-outline'
                    : displayCategory === 'COMMUNITY'
                    ? 'people-outline'
                    : 'information-circle-outline'
                }
                size={20}
                color={iconColor}
              />
            </View>

            <View style={styles.cardTextContent}>
              <View style={styles.cardHeaderRow}>
                <SafeText style={[styles.categoryBadge, { backgroundColor: iconBgColor }]}>
                  <SafeText
                    style={[
                      styles.categoryText,
                      { color: iconColor },
                    ]}
                  >
                    {displayCategory}
                  </SafeText>
                </SafeText>
                <SafeText style={[styles.timeText, createTextStyle(semantic.text.tertiary)]}>
                  {formatDateTime(item.createdAtIso)}
                </SafeText>
              </View>

              <SafeText
                style={[
                  styles.cardTitle,
                  createTextStyle(isUnread ? semantic.text.primary : semantic.text.secondary),
                  isUnread ? { fontWeight: '700' } : { fontWeight: '500' },
                ]}
                numberOfLines={2}
              >
                {displayTitle}
              </SafeText>

              <SafeText
                style={[styles.cardDescription, createTextStyle(semantic.text.tertiary)]}
                numberOfLines={3}
              >
                {displayDesc}
              </SafeText>
            </View>

            {isUnread && <View style={styles.unreadIndicator} />}
            <Ionicons
              name="chevron-forward"
              size={18}
              color={semantic.text.tertiary}
              style={styles.chevron}
            />
          </View>
        </Pressable>
      );
    },
    [handleItemPress, getCategoryIconColor, getCategoryBgColor, semantic, formatDateTime]
  );

  const renderEmpty = useCallback(() => {
    const isFiltered = selectedCategory !== 'ALL';
    return (
      <View style={styles.emptyContainer} testID="notifications-empty-state">
        <View style={[styles.emptyIconBox, { backgroundColor: semantic.surface.soft }]}>
          <Ionicons
            name={isFiltered ? 'filter-outline' : 'notifications-off-outline'}
            size={32}
            color={semantic.text.tertiary}
          />
        </View>
        <SafeText style={[styles.emptyTitle, createTextStyle(semantic.text.primary)]}>
          {isFiltered ? `No ${selectedCategory.toLowerCase()} notifications` : 'No notifications yet'}
        </SafeText>
        <SafeText style={[styles.emptySubtitle, createTextStyle(semantic.text.secondary)]}>
          {isFiltered
            ? `There are no ${selectedCategory.toLowerCase()} updates at this time.`
            : 'Important updates from your home and society will appear here.'}
        </SafeText>
      </View>
    );
  }, [selectedCategory, semantic]);

  const renderFooter = useCallback(() => {
    if (paginationError) {
      return (
        <View style={styles.listFooterError}>
          <SafeText style={[styles.footerErrorText, createTextStyle(semantic.status.danger)]}>
            {paginationError}
          </SafeText>
          <Pressable
            onPress={loadMore}
            style={styles.footerRetryButton}
          >
            <SafeText style={[styles.footerRetryText, createTextStyle(semantic.accent.moss)]}>
              Try again
            </SafeText>
          </Pressable>
        </View>
      );
    }

    if (!hasMore) {
      return (
        <View style={styles.listFooter}>
          <SafeText style={[styles.footerEndText, createTextStyle(semantic.text.tertiary)]}>
            You&apos;ve seen all notifications
          </SafeText>
        </View>
      );
    }

    if (isLoadingMore) {
      return (
        <View style={styles.listFooter}>
          <View style={styles.footerLoader} />
          <SafeText style={[styles.footerLoadingText, createTextStyle(semantic.text.secondary)]}>
            Loading more notifications…
          </SafeText>
        </View>
      );
    }

    return null;
  }, [hasMore, isLoadingMore, paginationError, semantic, loadMore]);

  // Loading state - render early but AFTER all hooks
  if (isInitialLoading && !allNotifications.length) {
    return (
      <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
        <SharedResidentTopBar
          societyName={activeContext?.societyName}
          unitName={activeContext?.displayUnitName}
          onSwitchResidence={() => setSwitcherVisible(true)}
          onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
          onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
        />
        <ScreenLoadingState message="Loading notifications..." />
      </View>
    );
  }

  // Error state - render early but AFTER all hooks
  if (error && !allNotifications.length) {
    return (
      <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
        <SharedResidentTopBar
          societyName={activeContext?.societyName}
          unitName={activeContext?.displayUnitName}
          onSwitchResidence={() => setSwitcherVisible(true)}
          onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
          onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
        />
        <ScreenErrorState
          title="Unable to load notifications"
          message={error.message || 'Please check your connection and try again.'}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
      <SharedResidentTopBar
        societyName={activeContext?.societyName}
        unitName={activeContext?.displayUnitName}
        unreadCount={unreadCount}
        onSwitchResidence={() => setSwitcherVisible(true)}
        onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
        onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
      />

      <View style={styles.filterContainer}>
        <FlatList
          data={filterCategories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item.id;
            const count = categoryCounts[item.id] ?? 0;
            return (
              <Pressable
                key={item.id}
                testID={`notification-filter-${item.id.toLowerCase()}`}
                onPress={() => setSelectedCategory(item.id)}
                style={[
                  styles.filterPill,
                  isActive ? styles.filterPillActive : undefined,
                  createCardSurfaceStyle(
                    isActive ? semantic.accent.moss : semantic.surface.raised,
                    isActive ? 'transparent' : semantic.border.default
                  ),
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Filter by ${item.label}, ${count} items`}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : semantic.text.secondary}
                />
                <SafeText
                  style={[
                    styles.filterPillText,
                    isActive ? styles.filterPillTextActive : undefined,
                    { color: isActive ? '#FFFFFF' : semantic.text.primary },
                  ]}
                >
                  {item.label}
                </SafeText>
                {count > 0 && (
                  <View
                    style={[
                      styles.pillCountBadge,
                      isActive ? styles.pillCountBadgeActive : undefined,
                      {
                        backgroundColor: isActive
                          ? 'rgba(255,255,255,0.28)'
                          : semantic.surface.soft,
                      },
                    ]}
                  >
                    <SafeText
                      style={[
                        styles.pillCountText,
                        isActive ? styles.pillCountTextActive : undefined,
                        {
                          color: isActive ? '#FFFFFF' : semantic.text.secondary,
                        },
                      ]}
                    >
                      {count}
                    </SafeText>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={paginatedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: bottomInset + 24,
        }}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || refreshing}
            onRefresh={handleRefresh}
            tintColor={semantic.accent.moss}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
      />

      <ResidentHomeSwitcherSheet
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
      />
    </View>
  );
}

export default NotificationInboxScreen;