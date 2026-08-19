import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentRepository } from '../data/resident.repository';

export function useResidentProfile() {
  return useRepositoryResult(() => residentRepository.getProfile(), []);
}

