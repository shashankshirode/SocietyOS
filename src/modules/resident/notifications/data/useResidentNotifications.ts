import { useCallback } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { residentNotificationsRepository } from './residentNotifications.repository';

export function useResidentNotifications() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };

  const query = useRepositoryResult(
    () => residentNotificationsRepository.list(context),
    [activeContext.dataScopeKey]
  );

  const notifications = query.data ?? [];
  const unreadCount = notifications.filter((item) => item.status === 'unread').length;

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const res = await residentNotificationsRepository.markAsRead(
        notificationId,
        context
      );
      if (res.ok) {
        await query.refetch();
      }
      return res;
    },
    [context, query]
  );

  const markAllAsRead = useCallback(async () => {
    const res = await residentNotificationsRepository.markAllAsRead(context);
    if (res.ok) {
      await query.refetch();
    }
    return res;
  }, [context, query]);

  return {
    ...query,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
