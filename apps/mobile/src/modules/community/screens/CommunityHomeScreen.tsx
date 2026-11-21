import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import { SafeText } from '../../../shared/components/SafeText';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { ScreenLoadingState } from '../../../ui/states/ScreenLoadingState';
import { ScreenEmptyState } from '../../../ui/states/ScreenEmptyState';
import { useCommunityDashboard } from '../data/communityHooks';
import { formatResidentRelativeTime } from '../../../core/localization/dateTimeFormatters';
import { communityFeedMockSource } from '../data/communityFeed.mockSource';
import type { CommunityPost } from '../../../shared/types/communityFeed.types';
import type { CommunityEvent } from '../../../shared/types/communityEvent.types';
import {
  createBackgroundStyle,
  createBorderStyle,
  createColorStyle,
  styles,
} from '../styles/screens/CommunityHomeScreen.styles';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';

type CommunityQuickLinkRoute =
  | 'MarketplaceListingFeed'
  | 'ResidentSkillDirectory'
  | 'BorrowLendHome'
  | 'LostFoundList'
  | 'VerifiedVendors';

type Props = {
  navigation: {
    navigate: (screen: CommunityQuickLinkRoute | string, params?: unknown) => void;
    goBack: () => void;
    canGoBack?: () => boolean;
  };
};

const quickLinks: readonly {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: CommunityQuickLinkRoute;
}[] = [
  { id: 'marketplace', get title() { return getActiveUiLiteral('m_c608981d8d68'); }, icon: 'storefront-outline', screen: 'MarketplaceListingFeed' },
  { id: 'neighbours', get title() { return getActiveUiLiteral('m_b0f76f451e7d'); }, icon: 'people-outline', screen: 'ResidentSkillDirectory' },
  { id: 'borrow', get title() { return getActiveUiLiteral('m_b74ebd90e386'); }, icon: 'swap-horizontal-outline', screen: 'BorrowLendHome' },
  { id: 'lost-found', get title() { return getActiveUiLiteral('m_b9b39c7466af'); }, icon: 'search-outline', screen: 'LostFoundList' },
  { id: 'services', get title() { return getActiveUiLiteral('m_7bc8d0563571'); }, icon: 'ribbon-outline', screen: 'VerifiedVendors' },
];

export function CommunityHomeScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const messages = useMessages();
  const copy = messages.resident.dashboard.communityHome;
  const { data: dashboard, isLoading } = useCommunityDashboard();
  const canGoBack = navigation.canGoBack?.() ?? true;

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  const loadFeedAndEvents = useCallback(async () => {
    const feedRes = await communityFeedMockSource.getFeed();
    if (feedRes.ok) {
      setPosts(feedRes.data);
    }
    const eventsRes = await communityFeedMockSource.getEvents();
    if (eventsRes.ok) {
      setEvents(eventsRes.data);
    }
  }, []);

  useEffect(() => {
    void loadFeedAndEvents();
  }, [loadFeedAndEvents]);

  const handleToggleLike = async (postId: string) => {
    const res = await communityFeedMockSource.toggleReaction(undefined, {
      postId,
      reactionType: 'LIKE',
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? res.data : p)));
    }
  };

  const handleToggleHelpful = async (postId: string) => {
    const res = await communityFeedMockSource.toggleReaction(undefined, {
      postId,
      reactionType: 'HELPFUL',
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? res.data : p)));
    }
  };

  const handleRsvp = async (eventId: string) => {
    const res = await communityFeedMockSource.submitRsvp(undefined, {
      eventId,
      status: 'GOING',
      guestCount: 1,
    });
    if (res.ok) {
      setEvents((prev) => prev.map((e) => (e.id === eventId ? res.data.event : e)));
    }
  };

  if (isLoading && !dashboard) return <ScreenLoadingState />;

  return (
    <ScreenContainer style={createBackgroundStyle(theme.semantic.surface.canvas)}>
      <ResidentPageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        variant="community"
        showBackButton={canGoBack}
        onBackPress={navigation.goBack}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {dashboard?.recentActivities?.[0] ? (
          <Pressable
            onPress={() => navigation.navigate('MarketplaceListingFeed')}
            style={[styles.feature, createBackgroundStyle(theme.semantic.surface.focus)]}
            accessibilityRole="button"
          >
            <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.moss)]}>{copy.thisWeek}</SafeText>
            <SafeText variant="h2" color="primary">{dashboard.recentActivities[0].description}</SafeText>
            <SafeText variant="caption" color="muted">{formatResidentRelativeTime(dashboard.recentActivities[0].timestamp)}</SafeText>
            <Ionicons name="arrow-forward" size={20} color={theme.semantic.text.primary} />
          </Pressable>
        ) : null}

        <View style={styles.section}>
          <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.text.tertiary)]}>{copy.usefulAroundYou}</SafeText>
          <View style={[styles.utilityList, createBorderStyle(theme.semantic.border.subtle)]}>
            {quickLinks.map((item, index) => (
              <Pressable key={item.id} onPress={() => navigation.navigate(item.screen)} style={styles.utilityRow} accessibilityRole="button">
                <View style={[styles.icon, createBackgroundStyle(theme.semantic.surface.soft)]}>
                  <Ionicons name={item.icon} size={20} color={theme.semantic.accent.moss} />
                </View>
                <SafeText variant="bodyStrong" color="primary" style={styles.utilityTitle}>{item.title}</SafeText>
                <Ionicons name="arrow-forward" size={18} color={theme.semantic.text.tertiary} />
                {index < quickLinks.length - 1 ? <View style={[styles.divider, createBackgroundStyle(theme.semantic.border.subtle)]} /> : null}
              </Pressable>
            ))}
          </View>
        </View>

        {events.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.text.tertiary)]}>
                Upcoming Community Events
              </SafeText>
            </View>
            {events.map((event) => {
              const isFull = event.currentAttendees >= event.maxCapacity;
              return (
                <View
                  key={event.id}
                  style={[
                    styles.eventCard,
                    createBackgroundStyle(theme.semantic.surface.soft),
                    createBorderStyle(theme.semantic.border.subtle),
                  ]}
                  testID={`community-event-card-${event.id}`}
                >
                  <View style={styles.eventHeaderRow}>
                    <SafeText variant="bodyStrong" color="primary">
                      {event.title}
                    </SafeText>
                    <View
                      style={[
                        styles.postCategoryTag,
                        createBackgroundStyle(theme.semantic.surface.focus),
                      ]}
                    >
                      <SafeText variant="tiny" style={createColorStyle(theme.semantic.accent.moss)}>
                        {event.category}
                      </SafeText>
                    </View>
                  </View>

                  <SafeText variant="body" color="muted">
                    {event.description}
                  </SafeText>

                  <View style={styles.eventMetaRow}>
                    <Ionicons name="location-outline" size={14} color={theme.semantic.text.tertiary} />
                    <SafeText variant="caption" color="muted">
                      {event.venue}
                    </SafeText>
                  </View>

                  <View style={[styles.rsvpBar, createBorderStyle(theme.semantic.border.subtle)]}>
                    <SafeText variant="caption" color="muted">
                      {event.currentAttendees} / {event.maxCapacity} Going {event.waitlistCount > 0 ? `(${event.waitlistCount} waitlisted)` : ''}
                    </SafeText>
                    <Pressable
                      onPress={() => handleRsvp(event.id)}
                      style={[
                        styles.rsvpBadge,
                        createBackgroundStyle(isFull ? theme.semantic.surface.focus : theme.semantic.accent.moss),
                      ]}
                      accessibilityRole="button"
                      testID={`event-rsvp-btn-${event.id}`}
                    >
                      <SafeText
                        variant="caption"
                        style={createColorStyle(isFull ? theme.semantic.text.primary : theme.semantic.surface.canvas)}
                      >
                        {isFull ? 'Join Waitlist' : 'RSVP Going'}
                      </SafeText>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        {posts.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.text.tertiary)]}>
                Community Discussions & Feed
              </SafeText>
            </View>
            {posts.map((post) => (
              <View
                key={post.id}
                style={[
                  styles.postCard,
                  createBackgroundStyle(theme.semantic.surface.soft),
                  createBorderStyle(theme.semantic.border.subtle),
                ]}
                testID={`community-post-card-${post.id}`}
              >
                <View style={styles.postHeader}>
                  <View style={styles.postAuthorInfo}>
                    <SafeText variant="caption" color="primary">
                      {post.authorName} ({post.authorUnit})
                    </SafeText>
                    <SafeText variant="tiny" color="muted">
                      • {formatResidentRelativeTime(post.createdAtIso)}
                    </SafeText>
                  </View>
                  <View
                    style={[
                      styles.postCategoryTag,
                      createBackgroundStyle(theme.semantic.surface.focus),
                    ]}
                  >
                    <SafeText variant="tiny" style={createColorStyle(theme.semantic.accent.moss)}>
                      {post.category}
                    </SafeText>
                  </View>
                </View>

                <SafeText variant="bodyStrong" color="primary">
                  {post.title}
                </SafeText>
                <SafeText variant="body" color="muted">
                  {post.content}
                </SafeText>

                <View style={[styles.postActionsRow, createBorderStyle(theme.semantic.border.subtle)]}>
                  <Pressable
                    onPress={() => handleToggleLike(post.id)}
                    style={styles.actionButton}
                    accessibilityRole="button"
                    testID={`post-like-btn-${post.id}`}
                  >
                    <Ionicons name="heart-outline" size={16} color={theme.semantic.text.tertiary} />
                    <SafeText variant="caption" color="muted">
                      {post.likesCount}
                    </SafeText>
                  </Pressable>

                  <Pressable
                    onPress={() => handleToggleHelpful(post.id)}
                    style={styles.actionButton}
                    accessibilityRole="button"
                    testID={`post-helpful-btn-${post.id}`}
                  >
                    <Ionicons name="bulb-outline" size={16} color={theme.semantic.text.tertiary} />
                    <SafeText variant="caption" color="muted">
                      {post.helpfulCount} Helpful
                    </SafeText>
                  </Pressable>

                  <View style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={16} color={theme.semantic.text.tertiary} />
                    <SafeText variant="caption" color="muted">
                      {post.commentsCount}
                    </SafeText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {dashboard?.recentActivities?.length ? (
          <View style={styles.section}>
            <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.text.tertiary)]}>{copy.recent}</SafeText>
            {dashboard.recentActivities.slice(1, 4).map((activity) => (
              <View key={activity.id} style={[styles.activityRow, createBorderStyle(theme.semantic.border.subtle)]}>
                <SafeText variant="body" color="primary" style={styles.utilityTitle}>{activity.description}</SafeText>
                <SafeText variant="caption" color="muted">{formatResidentRelativeTime(activity.timestamp)}</SafeText>
              </View>
            ))}
          </View>
        ) : (
          <ScreenEmptyState title={copy.quietTitle} description={copy.quietDescription} iconName="leaf-outline" />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

export default CommunityHomeScreen;
