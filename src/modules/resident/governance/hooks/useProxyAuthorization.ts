import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from '../data/governance.repository';
import type { ProxyAuthorizationInput } from '../data/governance.dto';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useProxyAuthorization() {
  const { activeContext } = useActiveResidentHome();
  const mutation = useRepositoryMutation((input: ProxyAuthorizationInput) =>
    governanceRepository.submitProxyAuthorization(
      input.meetingId,
      input,
      { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }
    )
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
