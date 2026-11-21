import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { complaintRepository } from './complaints.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useComplaints() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => complaintRepository.list(context), [context.dataScopeKey]);

  return result;
}
export default useComplaints;
