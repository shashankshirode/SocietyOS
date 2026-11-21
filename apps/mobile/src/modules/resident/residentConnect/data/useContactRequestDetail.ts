import { useRepositoryResult, useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';
import type { ReportCategory } from '../../../../shared/types/privacy.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useContactRequestDetail(requestId: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => residentConnectRepository.getContactRequestDetail(requestId, {
      activeHome: activeContext,
      dataScopeKey: activeContext.dataScopeKey,
    }),
    [requestId, activeContext]
  );
}

export function useAcceptContactRequest() {
  return useRepositoryMutation((requestId: string) =>
    residentConnectRepository.acceptContactRequest(requestId)
  );
}

export function useRejectContactRequest() {
  return useRepositoryMutation((requestId: string) =>
    residentConnectRepository.rejectContactRequest(requestId)
  );
}

export function useBlockContactRequest() {
  return useRepositoryMutation((requestId: string) =>
    residentConnectRepository.blockContactRequest(requestId)
  );
}

export function useReportContactRequest() {
  return useRepositoryMutation((payload: { requestId: string; category: ReportCategory; description: string }) =>
    residentConnectRepository.reportContactRequest(payload.requestId, {
      category: payload.category,
      description: payload.description,
    })
  );
}
