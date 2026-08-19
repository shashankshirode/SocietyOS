import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { complaintRepository } from './complaints.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useComplaintDetail(complaintId: string) {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => complaintRepository.detail(context, complaintId), [complaintId, context.dataScopeKey]);
}
export default useComplaintDetail;
