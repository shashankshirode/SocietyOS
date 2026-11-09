import { useMemo, useState, useCallback } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
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
import { ResidentHomeSwitcherSheet } from '../../homeContext/components/ResidentHomeSwitcherSheet';
import { SharedResidentTopBar } from '../../navigation/SharedResidentTopBar';
import { useDateTimePreferences } from '../../../../shared/datetime';
import {
  createScrollContentStyle,
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

interface ActivityEntry {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly module: string;
  readonly timestampLabel: string;
  readonly dateGroupLabel?: string;
}

function formatAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function groupActivitiesByDate(activities: readonly ActivityEntry[]): Record<string, ActivityEntry[]> {
  const groups: Record<string, ActivityEntry[]> = {};
  for (const activity of activities) {
    const dateGroup = activity.dateGroupLabel || 'Earlier';
    if (!groups[dateGroup]) groups[dateGroup] = [];
    groups[dateGroup].push(activity);
  }
  return groups;
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

export function ResidentActivityScreen({ navigation }: Props) {
  // 1. ALL HOOKS CALLED AT TOP LEVEL IN CONSISTENT ORDER
  const { semantic } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { activeContext } = useActiveResidentHome();
  const { canPerformAction } = useResidentRoleNavigation();
  const { data: dashboard, error, isLoading, refetch } = useResidentDashboard();
  const { formatDateTime } = useDateTimePreferences();

  const [refreshing, setRefreshing] = useState(false);
  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'actions'>('all');

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const waitingVisitor = dashboard?.visitorTimeline.find((v) => v.status === 'waitingAtGate');
  const isOverdue = dashboard?.maintenancePayment.status === 'overdue';
  const isDue = dashboard?.maintenancePayment.status !== 'paid';
  const totalDue = dashboard?.maintenancePayment.totalOutstanding ?? dashboard?.maintenancePayment.billAmount ?? 0;

  // Compute pending actionable items (derived strictly from real domain state)
  const needsAttentionItems = useMemo((): AttentionActionItem[] => {
    if (!dashboard) return [];
    const items: AttentionActionItem[] = [];

    // 1. Visitor awaiting gate review
    if (waitingVisitor) {
      items.push({
        id: 'visitor-waiting',
        category: 'Visitor Approval',
        priorityLabel: 'Waiting at Gate',
        title: `${waitingVisitor.visitorName}`,
        description: `${waitingVisitor.purpose} · ${waitingVisitor.gateName}`,
        meta: waitingVisitor.enteredAtLabel || 'Just now',
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

    // 2. Urgent notice requiring acknowledgement
    const urgentNotice = dashboard.notices.find(
      (n) => (n.category === 'emergency' || n.category === 'important') && n.acknowledgementStatus === 'pending',
    );
    if (urgentNotice) {
      items.push({
        id: `urgent-notice-${urgentNotice.id}`,
        category: 'Notice Acknowledgement',
        priorityLabel: urgentNotice.category === 'emergency' ? 'Emergency' : 'Important',
        title: urgentNotice.title,
        description: urgentNotice.summary || 'Requires your acknowledgement',
        meta: urgentNotice.publishedAtLabel || (urgentNotice.publishedDate ? formatDateTime(urgentNotice.publishedDate) : 'Today'),
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

    // 3. Maintenance payment due or overdue
    if (isDue && canPerformAction('maintenance')) {
      items.push({
        id: `maintenance-${dashboard.maintenancePayment.billId}`,
        category: isOverdue ? 'Maintenance Overdue' : 'Maintenance Due',
        priorityLabel: isOverdue ? 'Overdue' : 'Due Soon',
        title: `Maintenance · ${formatAmount(totalDue)}`,
        description: isOverdue
          ? 'Immediate payment required for current period'
          : `Due in ${dashboard.maintenancePayment.dueInDays ?? 4} days · ${dashboard.maintenancePayment.billingMonth}`,
        meta: dashboard.maintenancePayment.dueDateLabel ? `Due: ${dashboard.maintenancePayment.dueDateLabel}` : undefined,
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
  }, [dashboard, waitingVisitor, isDue, isOverdue, totalDue, canPerformAction, semantic, navigation, formatDateTime]);

  // Compute routine / informational activity history
  const allActivities = useMemo((): ActivityEntry[] => {
    if (!dashboard) return [];
    return [
      ...dashboard.visitorTimeline.map((v) => ({
        id: v.id,
        title: v.visitorName,
        description: `${v.purpose} · ${v.gateName}`,
        module: 'visitor',
        timestampLabel: v.enteredAtLabel || (v.validFrom ? formatDateTime(v.validFrom) : 'Today'),
        dateGroupLabel: 'Today',
      })),
      ...(dashboard.maintenancePayment.status !== 'paid' ? [{
        id: `bill-${dashboard.maintenancePayment.billId}`,
        title: `Maintenance ₹${Math.round(totalDue).toLocaleString('en-IN')} ${dashboard.maintenancePayment.status === 'overdue' ? 'overdue' : 'due'}`,
        description: `Billing cycle: ${dashboard.maintenancePayment.billingMonth}`,
        module: 'billing',
        timestampLabel: dashboard.maintenancePayment.dueDateLabel || 'This week',
        dateGroupLabel: dashboard.maintenancePayment.dueInDays && dashboard.maintenancePayment.dueInDays <= 7 ? 'This week' : 'Earlier',
      }] : []),
      ...dashboard.notices.map((n) => ({
        id: `notice-${n.id}`,
        title: n.title,
        description: n.acknowledgementStatus === 'pending' ? 'Needs acknowledgement' : n.summary || 'Society notice',
        module: 'notice',
        timestampLabel: n.publishedAtLabel || (n.publishedDate ? formatDateTime(n.publishedDate) : 'Today'),
        dateGroupLabel: 'Today',
      })),
      ...(dashboard.complaintProgress ? [{
        id: `complaint-${dashboard.complaintProgress.complaintId}`,
        title: dashboard.complaintProgress.title,
        description: dashboard.complaintProgress.latestUpdate || dashboard.complaintProgress.assignedTo || 'In progress',
        module: 'complaint',
        timestampLabel: dashboard.complaintProgress.slaRemainingLabel || 'Today',
        dateGroupLabel: 'Today',
      }] : []),
      ...dashboard.amenities.filter((a) => a.nextSlotLabel).map((a) => ({
        id: `facility-${a.id}`,
        title: `${a.name} booked`,
        description: a.nextSlotLabel || 'Facility booking',
        module: 'facility',
        timestampLabel: a.nextSlotLabel || 'Today',
        dateGroupLabel: 'Today',
      })),
      ...dashboard.activities.map((act) => ({
        ...act,
        timestampLabel: act.timestampLabel || 'Earlier',
      })),
    ];
  }, [dashboard, totalDue, formatDateTime]);

  const activityGroups = useMemo(() => groupActivitiesByDate(allActivities), [allActivities]);
  const sortedGroups = useMemo(() => {
    return Object.entries(activityGroups).sort((a, b) => {
      const order = { 'Now': 0, 'Today': 1, 'This week': 2, 'Earlier': 3 };
      return (order[a[0] as keyof typeof order] ?? 4) - (order[b[0] as keyof typeof order] ?? 4);
    });
  }, [activityGroups]);

  const attentionCount = needsAttentionItems.length;

  // Handle Loading & Error states gracefully AFTER all hooks executed
  if (isLoading && !dashboard) {
    return (
      <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
        <SharedResidentTopBar
          societyName={activeContext.displaySocietyName}
          unitName={activeContext.displayUnitName}
          onSwitchResidence={() => setSwitcherVisible(true)}
          onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
          onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
        />
        <ScreenLoadingState message="Loading updates..." />
      </View>
    );
  }

  if (error && !dashboard) {
    return (
      <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
        <SharedResidentTopBar
          societyName={activeContext.displaySocietyName}
          unitName={activeContext.displayUnitName}
          onSwitchResidence={() => setSwitcherVisible(true)}
          onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
          onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
        />
        <ScreenErrorState
          title="Unable to load updates"
          message={error.message || 'Please check your connection and try again.'}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, createRootStyle(semantic.surface.canvas)]}>
      {/* 1. Persistent Shared Resident Top Bar (Handles safe-area insets cleanly, no overlap) */}
      <SharedResidentTopBar
        societyName={activeContext.displaySocietyName}
        unitName={activeContext.displayUnitName}
        onSwitchResidence={() => setSwitcherVisible(true)}
        onOpenNotifications={() => navigation.navigate('HomeTab', { screen: 'NotificationInbox' })}
        onOpenProfile={() => navigation.navigate('HomeTab', { screen: 'ProfileTab', params: { screen: 'ProfileHome' } })}
      />

      {/* 2. Scrollable Body with generous bottom navigation clearance */}
      <ScrollView
        contentContainerStyle={createScrollContentStyle(insets.bottom)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={semantic.accent.moss}
          />
        }
      >
        {/* Page Introduction */}
        <View style={styles.introSection}>
          <SafeText style={[styles.pageTitle, createTextStyle(semantic.text.primary)]}>
            Updates
          </SafeText>
          <SafeText style={[styles.pageSubtitle, createTextStyle(semantic.text.secondary)]}>
            Important updates from your home and society.
          </SafeText>
        </View>

        {/* Attention Overview Banner (Replaces the oversized Home Status panel) */}
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

        {/* Primary Filter (Action needed vs All updates) */}
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
            accessibilityLabel={`All updates filter, ${allActivities.length} total`}
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
                {allActivities.length}
              </SafeText>
            </View>
          </Pressable>
        </View>

        {/* Section: Actionable Update Cards */}
        {(filter === 'actions' || filter === 'all') && (
          <View>
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
                  You're all caught up
                </SafeText>
                <SafeText style={[styles.emptySubtitle, createTextStyle(semantic.text.secondary)]}>
                  No items require your approval or payment right now.
                </SafeText>
              </View>
            )}

            {needsAttentionItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.actionCard,
                  createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
                ]}
              >
                {/* Header row: Contextual icon badge + category tag + priority badge */}
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

                {/* Content body */}
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

                {/* Subtle Divider */}
                <View style={[styles.actionDivider, { backgroundColor: semantic.border.subtle }]} />

                {/* Dedicated Action Footer Row */}
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

        {/* Section: All Updates History (Shown when filter is 'all') */}
        {filter === 'all' && (
          <View style={{ marginTop: attentionCount > 0 ? 12 : 0 }}>
            <View style={styles.sectionTitleRow}>
              <SafeText style={[styles.sectionHeading, createTextStyle(semantic.text.primary)]}>
                Activity & Notices
              </SafeText>
              <SafeText style={[styles.sectionSubheading, createTextStyle(semantic.text.tertiary)]}>
                {allActivities.length} updates
              </SafeText>
            </View>

            {allActivities.length === 0 ? (
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
            ) : (
              sortedGroups.map(([groupTitle, groupActivities]) => (
                <View key={groupTitle} style={styles.activityGroup}>
                  <View style={styles.activityGroupHeader}>
                    <SafeText style={[styles.activityGroupTitle, createTextStyle(semantic.text.tertiary)]}>
                      {groupTitle}
                    </SafeText>
                    <SafeText style={[styles.activityGroupCount, createTextStyle(semantic.text.tertiary)]}>
                      {groupActivities.length}
                    </SafeText>
                  </View>

                  <View
                    style={[
                      styles.activityListCard,
                      createCardSurfaceStyle(semantic.surface.raised, semantic.border.default),
                    ]}
                  >
                    {groupActivities.map((activity, index) => (
                      <Pressable
                        key={activity.id}
                        style={[
                          styles.activityItem,
                          index === groupActivities.length - 1 ? styles.activityItemLast : null,
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
                          <Ionicons
                            name={getModuleIcon(activity.module)}
                            size={18}
                            color={getModuleColor(activity.module, semantic)}
                          />
                        </View>
                        <View style={styles.activityContent}>
                          <SafeText
                            style={[styles.activityTitle, createTextStyle(semantic.text.primary)]}
                            numberOfLines={1}
                          >
                            {activity.title}
                          </SafeText>
                          <SafeText
                            style={[styles.activityDescription, createTextStyle(semantic.text.secondary)]}
                            numberOfLines={2}
                          >
                            {activity.description}
                          </SafeText>
                          <SafeText
                            style={[styles.activityTime, createTextStyle(semantic.text.tertiary)]}
                          >
                            {activity.timestampLabel}
                          </SafeText>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={semantic.text.tertiary}
                          style={styles.activityChevron}
                        />
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Residence Switcher Sheet */}
      <ResidentHomeSwitcherSheet
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
      />
    </View>
  );
}

export default ResidentActivityScreen;
