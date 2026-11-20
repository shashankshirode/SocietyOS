import { useCallback, useMemo } from 'react';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useResidentDashboard } from './useResidentDashboard';
import { useDateTimePreferences } from '../../../../shared/datetime';
import type { ActivityModule, HomeActivityItem } from '../data/dashboard.types';
import { useCursorPagination, type CursorPage } from '../../../../shared/hooks/useCursorPagination';

const ACTIVITY_PAGE_SIZE = 10;

function groupActivitiesByDate(activities: readonly HomeActivityItem[]): Record<string, HomeActivityItem[]> {
  const groups: Record<string, HomeActivityItem[]> = {};
  for (const activity of activities) {
    const dateGroup = activity.dateGroupLabel || 'Earlier';
    if (!groups[dateGroup]) groups[dateGroup] = [];
    groups[dateGroup].push(activity);
  }
  return groups;
}

export function useResidentActivityPagination(filter: 'all' | 'actions') {
  const { activeContext } = useActiveResidentHome();
  const { data: dashboard, isLoading, error, refetch } = useResidentDashboard();
  const { formatDateTime } = useDateTimePreferences();

  const allActivities = useMemo((): HomeActivityItem[] => {
    if (!dashboard) return [];
    return [
      ...dashboard.visitorTimeline.map((v) => ({
        id: v.id,
        title: v.visitorName,
        description: `${v.purpose} · ${v.gateName}`,
        module: 'visitor' as ActivityModule,
        timestampLabel: v.enteredAtLabel || (v.validFrom ? formatDateTime(v.validFrom) : 'Today'),
        dateGroupLabel: 'Today',
      })),
      ...(dashboard.maintenancePayment.status !== 'paid' ? [{
        id: `bill-${dashboard.maintenancePayment.billId}`,
        title: `Maintenance ₹${Math.round(dashboard.maintenancePayment.totalOutstanding ?? dashboard.maintenancePayment.billAmount ?? 0).toLocaleString('en-IN')} ${dashboard.maintenancePayment.status === 'overdue' ? 'overdue' : 'due'}`,
        description: `Billing cycle: ${dashboard.maintenancePayment.billingMonth}`,
        module: 'billing' as ActivityModule,
        timestampLabel: dashboard.maintenancePayment.dueDateLabel || 'This week',
        dateGroupLabel: dashboard.maintenancePayment.dueInDays && dashboard.maintenancePayment.dueInDays <= 7 ? 'This week' : 'Earlier',
      }] : []),
      ...dashboard.notices.map((n) => ({
        id: `notice-${n.id}`,
        title: n.title,
        description: n.acknowledgementStatus === 'pending' ? 'Needs acknowledgement' : n.summary || 'Society notice',
        module: 'notice' as ActivityModule,
        timestampLabel: n.publishedAtLabel || (n.publishedDate ? formatDateTime(n.publishedDate) : 'Today'),
        dateGroupLabel: 'Today',
      })),
      ...(dashboard.complaintProgress ? [{
        id: `complaint-${dashboard.complaintProgress.complaintId}`,
        title: dashboard.complaintProgress.title,
        description: dashboard.complaintProgress.latestUpdate || dashboard.complaintProgress.assignedTo || 'In progress',
        module: 'complaint' as ActivityModule,
        timestampLabel: dashboard.complaintProgress.slaRemainingLabel || 'Today',
        dateGroupLabel: 'Today',
      }] : []),
      ...dashboard.amenities.filter((a) => a.nextSlotLabel).map((a) => ({
        id: `facility-${a.id}`,
        title: `${a.name} booked`,
        description: a.nextSlotLabel || 'Facility booking',
        module: 'facility' as ActivityModule,
        timestampLabel: a.nextSlotLabel || 'Today',
        dateGroupLabel: 'Today',
      })),
      ...dashboard.activities.map((act) => ({
        ...act,
        timestampLabel: act.timestampLabel || 'Earlier',
      })),
    ];
  }, [dashboard, formatDateTime]);

  const fetchPage = useCallback(async (cursor?: string): Promise<CursorPage<HomeActivityItem>> => {
    let filtered = allActivities;
    if (filter === 'actions') {
      filtered = filtered.filter((a) => a.module === 'visitor' || a.module === 'billing' || a.module === 'notice' || a.module === 'complaint');
    }

    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    const pageItems = filtered.slice(startIndex, startIndex + ACTIVITY_PAGE_SIZE);
    const nextCursor = startIndex + ACTIVITY_PAGE_SIZE < filtered.length ? String(startIndex + ACTIVITY_PAGE_SIZE) : undefined;

    const result: CursorPage<HomeActivityItem> = {
      items: pageItems,
      hasMore: !!nextCursor,
    };
    if (nextCursor !== undefined) {
      result.nextCursor = nextCursor;
    }
    return result;
  }, [allActivities, filter]);

  const pagination = useCursorPagination(fetchPage, [activeContext?.dataScopeKey, filter, allActivities.length]);

  const sortedGroups = useMemo(() => {
    const activityGroups = groupActivitiesByDate(pagination.items);
    return Object.entries(activityGroups).sort((a, b) => {
      const order = { 'Now': 0, 'Today': 1, 'This week': 2, 'Earlier': 3 };
      return (order[a[0] as keyof typeof order] ?? 4) - (order[b[0] as keyof typeof order] ?? 4);
    });
  }, [pagination.items]);

  const totalCount = allActivities.length;

  return {
    ...pagination,
    sortedGroups,
    totalCount,
    refetch,
    isInitialLoading: isLoading || pagination.isInitialLoading,
    error: error || pagination.errorMessage,
  };
}

export default useResidentActivityPagination;