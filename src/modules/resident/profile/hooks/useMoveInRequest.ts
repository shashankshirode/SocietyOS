import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ownerTenantRepository } from '../data/ownerTenant.repository';
import type { MoveInRequest } from '../../../../shared/types/ownerTenant.types';

export function useCreateMoveInRequest() {
  return useRepositoryMutation((input: Partial<MoveInRequest>) =>
    ownerTenantRepository.createMoveInRequest(input)
  );
}
