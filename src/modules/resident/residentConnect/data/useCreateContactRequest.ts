import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';
import type { ContactRequest } from '../../../../shared/types/residentConnect.types';

export function useCreateContactRequest() {
  return useRepositoryMutation((input: Partial<ContactRequest>) =>
    residentConnectRepository.createContactRequest(input)
  );
}
