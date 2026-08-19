import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { residentNotificationsRepository } from './residentNotifications.repository';

export function useResidentNotifications() {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => residentNotificationsRepository.list({
      activeHome: activeContext,
      dataScopeKey: activeContext.dataScopeKey,
    }),
    [activeContext.dataScopeKey]
  );
}
