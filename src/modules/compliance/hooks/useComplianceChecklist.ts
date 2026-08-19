import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { complianceRepository } from '../data/compliance.repository';

export function useComplianceChecklist() {
  return useRepositoryResult(() => complianceRepository.getComplianceItems(), []);
}

export function useSubmitComplianceCheck() {
  return useRepositoryMutation(({ id, status }: { id: string; status: 'COMPLIANT' | 'NON_COMPLIANT' }) =>
    complianceRepository.submitComplianceCheck(id, status)
  );
}
