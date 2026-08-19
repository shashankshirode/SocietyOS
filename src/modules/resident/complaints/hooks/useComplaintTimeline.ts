import { useMemo, useState } from 'react';

export type ComplaintTimelineEvent = {
  id: string;
  title: string;
  actor: string;
  timestamp: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
};

const timelineEvents: ComplaintTimelineEvent[] = [
  {
    id: 'cmp-tl-1',
    title: 'Water leakage reported',
    actor: 'Resident A-1204',
    timestamp: 'Today, 9:15 AM',
    status: 'OPEN',
  },
  {
    id: 'cmp-tl-2',
    title: 'Assigned to plumbing vendor',
    actor: 'Facility Manager',
    timestamp: 'Today, 9:42 AM',
    status: 'ASSIGNED',
  },
  {
    id: 'cmp-tl-3',
    title: 'Inspection in progress',
    actor: 'Vendor Team',
    timestamp: 'Today, 10:30 AM',
    status: 'IN_PROGRESS',
  },
];

export function useComplaintTimeline() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setIsRefreshing(false);
  };

  return useMemo(
    () => ({
      data: timelineEvents,
      isLoading: false,
      isRefreshing,
      error: null as Error | null,
      refresh,
    }),
    [isRefreshing]
  );
}
