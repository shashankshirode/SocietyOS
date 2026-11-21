import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';

export function useAcceptedContacts() {
  return useRepositoryResult(() => residentConnectRepository.getAcceptedContacts(), []);
}
