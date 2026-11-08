import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { formatResidentRelativeTime } from '../../../../core/localization/dateTimeFormatters';
import { useResidentNotifications } from '../data/useResidentNotifications';
import type {
  ResidentNotification,
  NotificationFilterCategory,
} from '../data/residentNotifications.types';
import { styles } from '../styles/screens/NotificationInboxScreen.styles';

const filterCategories: readonly { id: NotificationFilterCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'ALL', label: 'All', icon: 'layers-outline' },
  { id: 'SECURITY', label: 'Security', icon: 'shield-checkmark-outline' },
  { id: 'BILLING', label: 'Billing', icon: 'receipt-outline' },
  { id: 'COMPLAINTS', label: 'Complaints', icon: 'construct-outline' },
  { id: 'NOTICES', label: 'Notices', icon: 'megaphone-outline' },
  { id: 'COMMUNITY', label: 'Community', icon: 'people-outline' },
];

export interface NotificationInboxScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (route: string, params?: unknown) => void;
  };
}

export function NotificationInboxScreen({ navigation }: NotificationInboxScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<NotificationFilterCategory>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useResidentNotifications();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const filteredNotifications = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return notifications;
    }
    return notifications.filter((item) => item.category === selectedCategory);
  }, [notifications, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<NotificationFilterCategory, number> = {
      ALL: notifications.length,
      SECURITY: 0,
      BILLING: 0,
      COMPLAINTS: 0,
      NOTICES: 0,
      COMMUNITY: 0,
    };
    notifications.forEach((item) => {
      if (item.category && item.category in counts) {
        counts[item.category as NotificationFilterCategory] += 1;
      }
    });
    return counts;
  }, [notifications]);

  const handleItemPress = useCallback(
    async (item: ResidentNotification) => {
      if (item.status === 'unread') {
        await markAsRead(item.id);
      }
      if (item.deepLink) {
        navigation.navigate(item.deepLink);
      } else if (item.category === 'SECURITY') {
        navigation.navigate('VisitorList');
      } else if (item.category === 'BILLING') {
        navigation.navigate('BillList');
      } else if (item.category === 'COMPLAINTS') {
        navigation.navigate('ComplaintList');
      } else if (item.category === 'NOTICES') {
        navigation.navigate('NoticeListFromHome');
      } else if (item.category === 'COMMUNITY') {
        navigation.navigate('CommunityHome');
      }
    },
    [markAsRead, navigation]
  );

  const getCategoryBadgeStyle = (category?: string) => {
    switch (category) {
      case 'SECURITY':
        return styles.categoryBadgeSecurity;
      case 'BILLING':
        return styles.categoryBadgeBilling;
      case 'COMPLAINTS':
        return styles.categoryBadgeComplaints;
      case 'NOTICES':
        return styles.categoryBadgeNotices;
      case 'COMMUNITY':
        return styles.categoryBadgeCommunity;
      default:
        return styles.categoryBadgeDefault;
    }
  };

  const getCategoryTextStyle = (category?: string) => {
    switch (category) {
      case 'SECURITY':
        return styles.categoryTextSecurity;
      case 'BILLING':
        return styles.categoryTextBilling;
      case 'COMPLAINTS':
        return styles.categoryTextComplaints;
      case 'NOTICES':
        return styles.categoryTextNotices;
      case 'COMMUNITY':
        return styles.categoryTextCommunity;
      default:
        return styles.categoryTextDefault;
    }
  };

  const renderItem = ({ item }: { item: ResidentNotification }) => {
    const isUnread = item.status === 'unread';
    const displayTitle = item.title ?? 'Society Notification';
    const displayDesc = item.description ?? 'Tap to view details regarding this update.';
    const displayCategory = item.category ?? 'SYSTEM';

    return (
      <Pressable
        testID={`notification-item-${item.id}`}
        onPress={() => handleItemPress(item)}
        style={[styles.card, isUnread ? styles.cardUnread : undefined]}
        accessibilityRole="button"
        accessibilityLabel={`${displayTitle}, ${isUnread ? 'Unread' : 'Read'}`}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, getCategoryBadgeStyle(displayCategory)]}>
            <SafeText style={[styles.categoryText, getCategoryTextStyle(displayCategory)]}>
              {displayCategory}
            </SafeText>
          </View>
          <SafeText style={styles.timeText}>
            {formatResidentRelativeTime(item.createdAtIso)}
          </SafeText>
        </View>

        {isUnread ? <View style={styles.unreadDot} /> : null}

        <SafeText style={styles.cardTitle} numberOfLines={2}>
          {displayTitle}
        </SafeText>
        <SafeText style={styles.cardDescription} numberOfLines={3}>
          {displayDesc}
        </SafeText>

        <View style={styles.cardFooter}>
          <SafeText style={styles.actionText}>View details</SafeText>
          {item.priority === 'critical' ? (
            <View style={[styles.priorityBadge, styles.priorityBadgeCritical]}>
              <SafeText style={styles.priorityTextCritical}>Critical</SafeText>
            </View>
          ) : item.priority === 'important' ? (
            <View style={[styles.priorityBadge, styles.priorityBadgeImportant]}>
              <SafeText style={styles.priorityTextImportant}>Important</SafeText>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer} testID="notifications-empty-state">
      <View style={styles.emptyIconBox}>
        <Ionicons name="notifications-off-outline" size={32} color="#64748B" />
      </View>
      <SafeText style={styles.emptyTitle}>No Notifications</SafeText>
      <SafeText style={styles.emptySubtitle}>
        {selectedCategory === 'ALL'
          ? "You're all caught up! There are no updates at this time."
          : `No ${selectedCategory.toLowerCase()} updates right now.`}
      </SafeText>
    </View>
  );

  return (
    <View style={styles.root} testID="notification-inbox-screen">
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={navigation.goBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="notification-inbox-back-btn"
          >
            <Ionicons name="arrow-back" size={24} color="#111613" />
          </Pressable>
          <SafeText style={styles.titleText}>Notifications</SafeText>
          {unreadCount > 0 ? (
            <View style={styles.unreadHeaderBadge} testID="notification-unread-count-badge">
              <SafeText style={styles.unreadHeaderBadgeText}>{unreadCount}</SafeText>
            </View>
          ) : null}
        </View>

        {unreadCount > 0 ? (
          <Pressable
            onPress={markAllAsRead}
            style={styles.markAllButton}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
            testID="notification-mark-all-read-btn"
          >
            <Ionicons name="checkmark-done" size={16} color="#2563EB" />
            <SafeText style={styles.markAllText}>Mark all read</SafeText>
          </Pressable>
        ) : null}
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <Pressable
                key={cat.id}
                testID={`notification-filter-${cat.id.toLowerCase()}`}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.filterPill, isActive ? styles.filterPillActive : undefined]}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${cat.label}, ${count} items`}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : '#4B5563'}
                />
                <SafeText
                  style={[styles.filterPillText, isActive ? styles.filterPillTextActive : undefined]}
                >
                  {cat.label}
                </SafeText>
                <View
                  style={[
                    styles.pillCountBadge,
                    isActive ? styles.pillCountBadgeActive : undefined,
                  ]}
                >
                  <SafeText
                    style={[
                      styles.pillCountText,
                      isActive ? styles.pillCountTextActive : undefined,
                    ]}
                  >
                    {count}
                  </SafeText>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

export default NotificationInboxScreen;

