import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import { complaintRepository } from './complaints.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useCreateComplaint() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryMutation((payload: CreateComplaintPayload) => complaintRepository.create(context, payload));
}
export default useCreateComplaint;
