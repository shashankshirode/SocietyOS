import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useAmcRenewalReminders() {
  return useRepositoryResult(() => facilityOpsRepository.getAmcRenewalReminders(), []);
}
export function useMarkAmcRenewalStarted() {
  return useRepositoryMutation((contractId: string) => facilityOpsRepository.markAmcRenewalStarted(contractId));
}
export function useMarkAmcRenewed() {
  return useRepositoryMutation((contractId: string) => facilityOpsRepository.markAmcRenewed(contractId));
}
