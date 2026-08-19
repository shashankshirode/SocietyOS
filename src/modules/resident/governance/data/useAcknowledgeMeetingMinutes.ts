import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { governanceRepository } from './governance.repository';

export function useAcknowledgeMeetingMinutes() {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryMutation((minutesId: string) => governanceRepository.acknowledgeMeetingMinutes(
    minutesId,
    { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
  ));
}
