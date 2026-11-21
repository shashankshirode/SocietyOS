import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useWorkOrderDetail(workOrderId: string) {
  return useRepositoryResult(() => facilityOpsRepository.getWorkOrderDetail(workOrderId), [workOrderId]);
}
export function useWorkOrderLifecycleAction(action: 'assignVendor' | 'startWorkOrder' | 'completeWorkOrder' | 'verifyWorkOrder' | 'closeWorkOrder' | 'reopenWorkOrder') {
  return useRepositoryMutation((workOrderId: string) => facilityOpsRepository[action](workOrderId));
}
