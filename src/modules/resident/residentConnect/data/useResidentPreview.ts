import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';

export function useResidentPreview(residentId: string) {
  return useRepositoryResult(() => residentConnectRepository.getResidentPreview(residentId), [residentId]);
}
