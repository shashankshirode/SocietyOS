import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { ScreenErrorState } from '../../../../ui/states/ScreenErrorState';
import { ScreenLoadingState } from '../../../../ui/states/ScreenLoadingState';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useResidentRoleNavigation } from '../../navigation/useResidentRoleNavigation';
import { useResidentDashboard } from '../hooks/useResidentDashboard';
import { useResidentActivityPagination } from '../hooks/useResidentActivityPagination';
import { resolveResidentTabBarObstruction } from '../../navigation/useResidentTabBarLayout';
import { getAppPlatform } from '../../../../shared/platform';
import { useDateTimePreferences } from '../../../../shared/datetime';
import { ResidentHomeSwitcherSheet } from '../../homeContext/components/ResidentHomeSwitcherSheet';
import { SharedResidentTopBar } from '../../navigation/SharedResidentTopBar';
import {
  createRootStyle,
  createCardSurfaceStyle,
  createTextStyle,
  styles,
} from '../styles/screens/ResidentActivityScreen.styles';

export type ResidentActivityScreenProps = BottomTabScreenProps<RootTabParamList, 'ActivityTab'>;
type Props = ResidentActivityScreenProps;

interface AttentionActionItem {
  readonly id: string;
  readonly category: string;
  readonly priorityLabel: string;
  readonly title: string;
  readonly description: string;
  readonly meta?: string;
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly buttonText: string;
  readonly buttonBg: string;
  readonly buttonTextColor: string;
  readonly onPress: () => void;
  readonly priority: number;
}

function formatAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function getModuleIcon(module: string): keyof typeof Ionicons.glyphMap {
  switch (module) {
    case 'visitor': return 'person-outline';
    case 'billing': return 'wallet-outline';
    case 'complaint': return 'construct-outline';
    case 'facility': return 'calendar-outline';
    case 'notice': return 'megaphone-outline';
    case 'document': return 'document-text-outline';
    case 'emergency': return 'alert-circle-outline';
    default: return 'information-circle-outline';
  }
}

function getModuleColor(module: string, semantic: ReturnType<typeof useAppTheme>['semantic']): string {
  switch (module) {
    case 'visitor': return semantic.status.success;
    case 'billing': return semantic.accent.moss;
    case 'complaint': return semantic.status.warning;
    case 'facility': return semantic.accent.lavender;
    case 'notice': return semantic.accent.moss;
    case 'document': return semantic.text.tertiary;
    case 'emergency': return semantic.status.danger;
    default: return semantic.text.tertiary;
  }
}

function getModuleBg(module: string, semantic: ReturnType<typeof useAppTheme>['semantic']): string {
  switch (module) {
    case 'visitor': return semantic.status.successSurface;
    case 'billing': return semantic.surface.soft;
    case 'complaint': return semantic.status.warningSurface;
    case 'facility': return semantic.surface.soft;
    case 'notice': return semantic.surface.soft;
    case 'document': return semantic.surface.soft;
    case 'emergency': return semantic.status.dangerSurface;
    default: return semantic.surface.soft;
  }
}

function renderActivityItem({
  activity,
  index,
  groupActivities,
  semantic,
  navigation,
}: {
  activity: { id: string; title: string; description: string; module: string; timestampLabel: string };
  index: number;
  groupActivities: { id: string; title: string; description: string; module: string; timestampLabel: string }[];
  semantic: ReturnType<typeof useAppTheme>['semantic'];
  navigation: Props['navigation'];
}) {
  const isLast = index === groupActivities.length - 1;
  return (
    <Pressable
      key={activity.id}
      style={[
        styles.activityItem,
        isLast ? styles.activityItemLast : null,
        { borderBottomColor: semantic.border.subtle },
      ]}
      onPress={() => {
        if (activity.module === 'visitor') navigation.navigate('VisitorTab', { screen: 'VisitorList' });
        else if (activity.module === 'billing') navigation.navigate('BillTab', { screen: 'BillList' });
        else if (activity.module === 'complaint') navigation.navigate('ComplaintTab', { screen: 'ComplaintList' });
        else if (activity.module === 'facility') navigation.navigate('HomeTab', { screen: 'FacilityStack', params: { screen: 'FacilityList' } });
        else if (activity.module === 'notice') navigation.navigate('HomeTab', { screen: 'NoticeListFromHome' });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${activity.title}. ${activity.description}. ${activity.timestampLabel}`}
    >
      <View
        style={[
          styles.activityIconWrapper,
          { backgroundColor: getModuleBg(activity.module, semantic) },
        ]}
      >
        <Ionicons name={getModuleIcon(activity.module)} size={18} color={getModuleColor(activity.module, semantic)} />
      </View>
      <View style={styles.activityContent}>
        <SafeText style={[styles.activityTitle, createTextStyle(semantic.text.primary)]}>
          {activity.title}
        </SafeText>
        <SafeText style={[styles.activityDescription, createTextStyle(semantic.text.secondary)]}>
          {activity.description}
        </SafeText>
        <SafeText style={[styles.activityTime, createTextStyle(semantic.text.tertiary)]}>
          {activity.timestampLabel}
        </SafeText>
      </View>
      <Ionicons name="chevron-forward" size={16} color={semantic.text.tertiary} style={styles.activityChevron} />
    </Pressable>
  );
}

function renderActivityGroup({
  groupTitle,
  groupActivities,
  semantic,
  navigation,
}: {
  groupTitle: string;
  groupActivities: { id: string; title: string; description: string; module: string; timestampLabel: string }[];
  semantic: ReturnType<typeof useAppTheme>['semantic'];
  navigation: Props['navigation'];
}) {
  return (
    <View key={groupTitle} style={styles.activityGroup}>
      <View style={styles.activityGroupHeader}>
        <SafeText style={[styles.activityGroupTitle, createTextStyle(semantic.text.tertiary)]}>
          {groupTitle}
        </SafeText>
        <SafeText style={[styles.activityGroupCount, createTextStyle(semantic.text.tertiary)]}>
          {groupActivities.length}
        </SafeText>
      </View>
      <View style={[styles.activityListCard, createCardSurfaceStyle(semantic.surface.raised, semantic.border.default)]}>
        {groupActivities.map((activity, index) =>
          renderActivityItem({ activity, index, groupActivities, semantic, navigation })
        )}
      </View>
    </View>
  );
}

export function ResidentActivityScreen({ navigation }: Props) {
  const { semantic } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { activeContext } = useActiveResidentHome();
  const { canPerformAction } = useResidentRoleNavigation();
  const { formatDateTime } = useDateTimePreferences();

  const [refreshing, setRefreshing] = useState(false);
  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'actions'>('all');

  const {
    sortedGroups,
    totalCount,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    loadMore,
    refresh,
  } = useResidentActivityPagination(filter);

  const { data: dashboard } = useResidentDashboard();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isRefreshing) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isRefreshing, loadMore]);

  const attentionItems = useMemo((): AttentionActionItem[] => {
    if (!dashboard) return [];
    const items: AttentionActionItem[] = [];

    const waitingVisitorLocal = dashboard.visitorTimeline.find((v: typeof dashboard.visitorTimeline[0]) => v.status === 'waitingAtGate');
    const isOverdue = dashboard.maintenancePayment.status === 'overdue';
    const isDue = dashboard.maintenancePayment.status !== 'paid';
    const totalDue = dashboard.maintenancePayment.totalOutstanding ?? dashboard.maintenancePayment.billAmount ?? 0;

    if (waitingVisitorLocal) {
      const meta = waitingVisitorLocal.enteredAtLabel || 'Just now';
      items.push({
        id: 'visitor-waiting',
        category: 'Visitor Approval',
        priorityLabel: 'Waiting at Gate',
        title: waitingVisitorLocal.visitorName,
        description: `${waitingVisitorLocal.purpose} · ${waitingVisitorLocal.gateName}`,
        ...(meta ? { meta } : {}),
        icon: 'shield-checkmark-outline',
        iconBg: semantic.status.warningSurface,
        iconColor: semantic.status.warning,
        buttonText: 'Review',
        buttonBg: semantic.status.warning,
        buttonTextColor: '#FFFFFF',
        onPress: () => navigation.navigate('VisitorTab', { screen: 'VisitorList' }),
        priority: 100,
      });
    }

    const urgentNotice = dashboard.notices.find(
      (n: typeof dashboard.notices[0]) => (n.category === 'emergency' || n.category === 'important') && n.acknowledgementStatus === 'pending',
    );
    if (urgentNotice) {
      const meta = urgentNotice.publishedAtLabel || (urgentNotice.publishedDate ? formatDateTime(urgentNotice.publishedDate) : 'Today');
      items.push({
        id: `urgent-notice-${urgentNotice.id}`,
        category: 'Notice Acknowledgement',
        priorityLabel: urgentNotice.category === 'emergency' ? 'Emergency' : 'Important',
        title: urgentNotice.title,
        description: urgentNotice.summary || 'Requires your acknowledgement',
        ...(meta ? { meta } : {}),
        icon: 'alert-circle-outline',
        iconBg: semantic.status.dangerSurface,
        iconColor: semantic.status.danger,
        buttonText: 'Read Notice',
        buttonBg: semantic.status.danger,
        buttonTextColor: '#FFFFFF',
        onPress: () => navigation.navigate('HomeTab', { screen: 'NoticeListFromHome' }),
        priority: 95,
      });
    }

    if (isDue && canPerformAction('maintenance')) {
      const meta = dashboard.maintenancePayment.dueDateLabel ? `Due: ${dashboard.maintenancePayment.dueDateLabel}` : undefined;
      items.push({
        id: `maintenance-${dashboard.maintenancePayment.billId}`,
        category: isOverdue ? 'Maintenance Overdue' : 'Maintenance Due',
        priorityLabel: isOverdue ? 'Overdue' : 'Due Soon',
        title: `Maintenance · ${formatAmount(totalDue)}`,
        description: isOverdue
          ? 'Immediate payment required for current period'
          : `Due in ${dashboard.maintenancePayment.dueInDays ?? 4} days · ${dashboard.maintenancePayment.billingMonth}`,
        ...(meta ? { meta } : {}),
        icon: 'wallet-outline',
        iconBg: isOverdue ? semantic.status.dangerSurface : semantic.status.warningSurface,
        iconColor: isOverdue ? semantic.status.danger : semantic.status.warning,
        buttonText: isOverdue ? 'Pay Immediately' : 'Pay Dues',
        buttonBg: isOverdue ? semantic.status.danger : semantic.accent.moss,
        buttonTextColor: '#FFFFFF',
        onPress: () => navigation.navigate('BillTab', { screen: 'BillList' }),
        priority: isOverdue ? 90 : 70,
      });
    }

    return items.sort((a, b) => b.priority - a.priority);
  }, [dashboard, canPerformAction, semantic, navigation, formatDateTime]);

  const attentionCount = attentionItems.length;

  const bottomInset = resolveResidentTabBarObstruction(
    insets.bottom > 0 ? 390 : 390,
    insets.bottom,
    getAppPlatform(),
  );

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={styles.introSection}>
        <SafeText style={[styles.pageTitle, createTextStyle(semantic.text.primary)]}>
          Updates
        </SafeText>
        <SafeText style={[styles.pageSubtitle, createTextStyle(semantic.text.secondary)]}>
          Important updates from your home and society.
        </SafeText>
      </View>

      <View
        style={[
          styles.attentionBanner,
          createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
        ]}
      >
        <View style={styles.attentionLeft}>
          <SafeText style={[styles.attentionTitle, createTextStyle(semantic.text.primary)]}>
            {attentionCount === 0
              ? 'All clear'
              : `${attentionCount} item${attentionCount > 1 ? 's' : ''} need${attentionCount === 1 ? 's' : ''} your attention`}
          </SafeText>
          <SafeText style={[styles.attentionSubtitle, createTextStyle(semantic.text.secondary)]}>
            {attentionCount === 0
              ? 'Everything is up to date in your home'
              : 'Review important requests and notices'}
          </SafeText>
        </View>
        <View
          style={[
            styles.attentionBadge,
            {
              backgroundColor: attentionCount > 0
                ? semantic.status.warningSurface
                : semantic.status.successSurface,
            },
          ]}
        >
          <Ionicons
            name={attentionCount > 0 ? 'alert-circle' : 'checkmark-circle'}
            size={22}
            color={attentionCount > 0 ? semantic.status.warning : semantic.status.success}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        <Pressable
          style={[
            styles.filterPill,
            filter === 'actions'
              ? [styles.filterPillActive, { backgroundColor: semantic.accent.moss }]
              : createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
          ]}
          onPress={() => setFilter('actions')}
          accessibilityRole="tab"
          accessibilityState={{ selected: filter === 'actions' }}
          accessibilityLabel={`Action needed filter, ${attentionCount} items`}
        >
          <SafeText
            style={[
              styles.filterText,
              { color: filter === 'actions' ? '#FFFFFF' : semantic.text.primary },
            ]}
          >
            Action needed
          </SafeText>
          {attentionCount > 0 && (
            <View
              style={[
                styles.filterCountBadge,
                {
                  backgroundColor: filter === 'actions'
                    ? 'rgba(255,255,255,0.28)'
                    : semantic.status.warningSurface,
                },
              ]}
            >
              <SafeText
                style={[
                  styles.filterCountText,
                  {
                    color: filter === 'actions'
                      ? '#FFFFFF'
                      : semantic.status.warning,
                  },
                ]}
              >
                {attentionCount}
              </SafeText>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.filterPill,
            filter === 'all'
              ? [styles.filterPillActive, { backgroundColor: semantic.accent.moss }]
              : createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
          ]}
          onPress={() => setFilter('all')}
          accessibilityRole="tab"
          accessibilityState={{ selected: filter === 'all' }}
          accessibilityLabel={`All updates filter, ${totalCount} total`}
        >
          <SafeText
            style={[
              styles.filterText,
              { color: filter === 'all' ? '#FFFFFF' : semantic.text.primary },
            ]}
          >
            All updates
          </SafeText>
          <View
            style={[
              styles.filterCountBadge,
              {
                backgroundColor: filter === 'all'
                  ? 'rgba(255,255,255,0.28)'
                  : semantic.surface.soft,
              },
            ]}
          >
            <SafeText
              style={[
                styles.filterCountText,
                {
                  color: filter === 'all'
                    ? '#FFFFFF'
                    : semantic.text.secondary,
                },
              ]}
            >
              {totalCount}
            </SafeText>
          </View>
        </Pressable>
      </View>

      {(filter === 'actions' || filter === 'all') && (
        <View style={styles.actionSection}>
          {attentionCount > 0 && (
            <View style={styles.sectionTitleRow}>
              <SafeText style={[styles.sectionHeading, createTextStyle(semantic.text.primary)]}>
                Action Required
              </SafeText>
              <SafeText style={[styles.sectionSubheading, createTextStyle(semantic.text.tertiary)]}>
                {attentionCount} pending
              </SafeText>
            </View>
          )}

          {attentionCount === 0 && filter === 'actions' && (
            <View
              style={[
                styles.emptyState,
                createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={36}
                color={semantic.status.success}
                style={styles.emptyIcon}
              />
              <SafeText style={[styles.emptyTitle, createTextStyle(semantic.text.primary)]}>
                You&apos;re all caught up
              </SafeText>
              <SafeText style={[styles.emptySubtitle, createTextStyle(semantic.text.secondary)]}>
                No items require your approval or payment right now.
              </SafeText>
            </View>
          )}

          {attentionItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.actionCard,
                createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
              ]}
            >
              <View style={styles.actionCardHeader}>
                <View style={[styles.actionIconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <View style={styles.actionHeaderMeta}>
                  <SafeText style={[styles.actionCategoryTag, { color: item.iconColor }]}>
                    {item.category}
                  </SafeText>
                </View>
                <View style={[styles.actionPriorityBadge, { backgroundColor: item.iconBg }]}>
                  <SafeText style={[styles.actionPriorityText, { color: item.iconColor }]}>
                    {item.priorityLabel}
                  </SafeText>
                </View>
              </View>

              <SafeText style={[styles.actionTitle, createTextStyle(semantic.text.primary)]}>
                {item.title}
              </SafeText>
              <SafeText style={[styles.actionDescription, createTextStyle(semantic.text.secondary)]}>
                {item.description}
              </SafeText>
              {item.meta ? (
                <View style={styles.actionMetaRow}>
                  <Ionicons name="time-outline" size={13} color={semantic.text.tertiary} />
                  <SafeText style={[styles.actionMetaText, createTextStyle(semantic.text.tertiary)]}>
                    {item.meta}
                  </SafeText>
                </View>
              ) : null}

              <View style={[styles.actionDivider, { backgroundColor: semantic.border.subtle }]} />

              <View style={styles.actionFooterRow}>
                <Pressable
                  style={[styles.actionCtaButton, { backgroundColor: item.buttonBg }]}
                  onPress={item.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.buttonText}: ${item.title}`}
                >
                  <SafeText style={[styles.actionCtaText, { color: item.buttonTextColor }]}>
                    {item.buttonText}
                  </SafeText>
                  <Ionicons name="arrow-forward" size={14} color={item.buttonTextColor} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  ), [
    semantic,
    attentionCount,
    attentionItems,
    totalCount,
    filter,
  ]);

  const renderFooter = useCallback(() => {
    if (!hasMore) {
      return (
        <View style={styles.listFooter}>
          <SafeText style={[styles.footerEndText, createTextStyle(semantic.text.tertiary)]}>
            You&apos;ve seen all updates
          </SafeText>
        </View>
      );
    }
    if (isLoadingMore) {
      return (
        <View style={styles.listFooter}>
          <View style={styles.footerLoader} />
          <SafeText style={[styles.footerLoadingText, createTextStyle(semantic.text.secondary)]}>
            Loading more updates…
          </SafeText>
        </View>
      );
    }
    return null;
  }, [hasMore, isLoadingMore, semantic]);

  const renderEmpty = useCallback(() => {
    if (filter === 'actions') {
      return (
        <View style={styles.emptyStateContainer}>
          <View
            style={[
              styles.emptyState,
              createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={36}
              color={semantic.status.success}
              style={styles.emptyIcon}
            />
            <SafeText style={[styles.emptyTitle, createTextStyle(semantic.text.primary)]}>
              You&apos;re all caught up
            </SafeText>
            <SafeText style={[styles.emptySubtitle, createTextStyle(semantic.text.secondary)]}>
              No items require your approval or payment right now.
            </SafeText>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.emptyStateContainer}>
        <View
          style={[
            styles.emptyState,
            createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
          ]}
        >
          <Ionicons
            name="sparkles-outline"
            size={36}
            color={semantic.text.tertiary}
            style={styles.emptyIcon}
          />
          <SafeText style={[styles.emptyTitle, createTextStyle(semantic.text.primary)]}>
            No recent activity
          </SafeText>
          <SafeText style={[styles.emptySubtitle, createTextStyle(semantic.text.secondary)]}>
            Updates from visitors, notices, and facilities will appear here.
          </SafeText>
        </View>
      </View>
    );
  }, [filter, semantic]);

  const data = useMemo(() => {
    const flattened: { type: 'group'; groupTitle: string; groupActivities: { id: string; title: string; description: string; module: string; timestampLabel: string }[] }[] = [];
    for (const [groupTitle, groupActivities] of sortedGroups) {
      flattened.push({ type: 'group', groupTitle, groupActivities });
    }
    return flattened;
  }, [sortedGroups]);

  const keyExtractor = useCallback((item: { type: 'group'; groupTitle: string; groupActivities: any[] }, index: number) => {
    return `group-${item.groupTitle}-${index}`;
  }, []);

  const renderItem = useCallback(({ item, index }: { item: { type: 'group'; groupTitle: string; groupActivities: any[] }; index: number }) => (
    renderActivityGroup({
      groupTitle: item.groupTitle,
      groupActivities: item.groupActivities,
      semantic,
      navigation,
    })
  ), [semantic, navigation]);

  // Loading state - render early but AFTER all hooks
  if (isInitialLoading && !dashboard) {
    return (
      <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
        <SharedResidentTopBar
          societyName={activeContext.societyName}
          unitName={activeContext.displayUnitName}
          onSwitchResidence={() => setSwitcherVisible(true)}
          onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
          onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
        />
        <ScreenLoadingState message="Loading updates..." />
      </View>
    );
  }

  // Error state - render early but AFTER all hooks
  if (error && !dashboard) {
    return (
      <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
        <SharedResidentTopBar
          societyName={activeContext.societyName}
          unitName={activeContext.displayUnitName}
          onSwitchResidence={() => setSwitcherVisible(true)}
          onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
          onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
        />
        <ScreenErrorState
          title="Unable to load updates"
          message={typeof error === 'string' ? error : error?.message || 'Please check your connection and try again.'}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
      <SharedResidentTopBar
        societyName={activeContext.societyName}
        unitName={activeContext.displayUnitName}
        onSwitchResidence={() => setSwitcherVisible(true)}
        onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
        onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
      />

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || refreshing}
            onRefresh={handleRefresh}
            tintColor={semantic.accent.moss}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: bottomInset + 24,
        }}
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

export default ResidentActivityScreen;