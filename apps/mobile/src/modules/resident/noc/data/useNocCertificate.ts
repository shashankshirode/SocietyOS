import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { nocRepository } from './noc.repository';

export function useNocCertificate(certificateId: string) {
  return useRepositoryResult(() => nocRepository.certificate(certificateId), [certificateId]);
}

